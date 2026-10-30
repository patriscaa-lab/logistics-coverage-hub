/** Web app Gmail membaca hanya proyeksi operasional yang dibagikan sebagai Viewer. */
function loadHub_() {
  const id = PropertiesService.getScriptProperties().getProperty('OPS_SPREADSHEET_ID');
  if (!id) throw new Error('Salinan operasional belum dikonfigurasi. Hubungi administrator.');
  let values;
  try {
    // SpreadsheetApp.openById memerlukan scope tulis Sheets, bahkan untuk operasi baca.
    // Advanced Sheets API mendukung spreadsheets.readonly yang dipakai web app.
    const response = Sheets.Spreadsheets.Values.get(id, "'Operational Snapshot'!A1:B1000", { valueRenderOption: 'FORMATTED_VALUE' });
    values = (response.values || []).map(row => [String(row[0] || ''), String(row[1] || '')]);
    if (values.length < 4) throw new Error('snapshot');
  } catch (e) {
    console.error('LCH_SNAPSHOT_READ: ' + String(e.message || e));
    throw new Error('Salinan operasional belum dapat dibaca. Periksa akses akun dengan administrator.');
  }
  if (values[0][0] !== 'schema' || values[0][1] !== '1' || values[1][0] !== 'syncedAt' || values[2][0] !== 'sha256') {
    throw new Error('Format salinan operasional tidak sesuai.');
  }
  const chunks = values.slice(3).filter(row => row[0] === 'chunk');
  if (chunks.some(row => !row[1].startsWith('json:'))) throw new Error('Format payload operasional tidak sesuai.');
  const json = chunks.map(row => row[1].slice(5)).join('');
  if (!json || json.length > 2000000 || digest_(json) !== values[2][1]) throw new Error('Sinkronisasi belum lengkap. Coba Refresh Data kembali.');
  let hub;
  try { hub = JSON.parse(json); assertSafeSnapshot_(hub); }
  catch (e) { throw new Error('Salinan operasional tidak valid. Hubungi administrator.'); }
  if (hub.loadedAt !== values[1][1]) throw new Error('Versi salinan operasional tidak konsisten.');
  return hub;
}

function digest_(text) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, text, Utilities.Charset.UTF_8)
    .map(byte => ('0' + ((byte + 256) % 256).toString(16)).slice(-2)).join('');
}

function assertSafeSnapshot_(hub) {
  function exactKeys(value, keys) {
    if (!value || typeof value !== 'object' || Array.isArray(value) || Object.keys(value).length !== keys.length ||
        keys.some(key => !Object.prototype.hasOwnProperty.call(value, key))) throw new Error('schema');
  }
  function textRow(row, keys, numeric) {
    exactKeys(row, keys.concat(numeric || []));
    if (keys.some(key => typeof row[key] !== 'string') || (numeric || []).some(key => !Number.isSafeInteger(row[key]) || row[key] < 0)) throw new Error('type');
  }
  exactKeys(hub, ['loadedAt', 'vendors', 'routes', 'quality', 'summary']);
  if (typeof hub.loadedAt !== 'string' || !Number.isFinite(Date.parse(hub.loadedAt)) || !Array.isArray(hub.vendors) || !Array.isArray(hub.routes)) throw new Error('schema');
  hub.vendors.forEach(v => textRow(v, ['id','name','status','group','service','base','coverage','commercial'], ['routeCount']));
  hub.routes.forEach(r => {
    const copy = Object.assign({}, r); delete copy.prices;
    textRow(copy, ['id','vendorId','vendorName','origin','destination','mode','service','vehicle','leadMin','leadMax','evidence','commercial']);
    if (!Array.isArray(r.prices) || Object.keys(r).length !== Object.keys(copy).length + 1) throw new Error('prices');
    r.prices.forEach(p => textRow(p, ['routeId','mode','service','vehicle','basis','approved','offer','counter','final']));
  });
  ['quality','summary'].forEach(key => {
    const keys = key === 'quality' ? ['missingCoverage','unclassified','excludedRoutes','nonEligibleRoutes','duplicateVendorIds'] : ['vendors','activeTransport','confirmedPairs','destinations'];
    exactKeys(hub[key], keys);
    if (keys.some(k => !Number.isSafeInteger(hub[key][k]) || hub[key][k] < 0)) throw new Error('count');
  });
  // Validasi relasi, bukan hanya bentuk JSON: harga tidak boleh terikat ke vendor/rute lain.
  const vendorById = Object.create(null);
  hub.vendors.forEach(v => {
    if (!v.id.trim() || !v.name.trim() || vendorById[v.id]) throw new Error('vendor identity');
    vendorById[v.id] = v;
  });
  const routeIds = new Set();
  hub.routes.forEach(r => {
    const vendor = vendorById[r.vendorId];
    if (!r.id.trim() || routeIds.has(r.id) || !r.origin.trim() || !r.destination.trim() ||
        !vendor || vendor.name !== r.vendorName || vendor.status !== 'Aktif' || vendor.group !== 'Ekspedisi / Transport') throw new Error('route identity');
    routeIds.add(r.id);
    if (r.prices.some(p => p.routeId !== r.id)) throw new Error('price identity');
  });
  const normalize = value => value.trim().replace(/\s+/g, ' ').toLowerCase();
  if (hub.summary.vendors !== hub.vendors.length ||
      hub.summary.activeTransport !== hub.vendors.filter(v => v.status === 'Aktif' && v.group === 'Ekspedisi / Transport').length ||
      hub.summary.confirmedPairs !== new Set(hub.routes.map(r => normalize(r.origin) + '\u0000' + normalize(r.destination))).size ||
      hub.summary.destinations !== new Set(hub.routes.map(r => normalize(r.destination))).size) throw new Error('summary consistency');
}
