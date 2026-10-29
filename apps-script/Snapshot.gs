/** Web app Gmail membaca hanya proyeksi operasional yang dibagikan sebagai Viewer. */
function loadHub_() {
  const id = PropertiesService.getScriptProperties().getProperty('OPS_SPREADSHEET_ID');
  if (!id) throw new Error('Salinan operasional belum dikonfigurasi. Hubungi administrator.');
  let values;
  try {
    const sheet = SpreadsheetApp.openById(id).getSheetByName('Operational Snapshot');
    if (!sheet || sheet.getLastRow() < 4 || sheet.getLastRow() > 1000 || sheet.getLastColumn() !== 2) throw new Error('snapshot');
    values = sheet.getRange(1, 1, sheet.getLastRow(), 2).getDisplayValues();
  } catch (e) { throw new Error('Salinan operasional belum dapat dibaca. Periksa akses akun dengan administrator.'); }
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
  hub.routes.forEach(r => textRow(r, ['id','vendorId','vendorName','origin','destination','mode','service','vehicle','leadMin','leadMax','evidence','commercial']));
  ['quality','summary'].forEach(key => {
    const keys = key === 'quality' ? ['missingCoverage','unclassified','excludedRoutes','nonEligibleRoutes'] : ['vendors','activeTransport','confirmedPairs','destinations'];
    exactKeys(hub[key], keys);
    if (keys.some(k => !Number.isSafeInteger(hub[key][k]) || hub[key][k] < 0)) throw new Error('count');
  });
}
