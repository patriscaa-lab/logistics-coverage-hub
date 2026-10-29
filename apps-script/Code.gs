/** Logistics Coverage Hub. Seluruh helper privat berakhiran _. Tidak ada operasi tulis Sheet. */
function doGet() {
  try {
    authorize_();
    return HtmlService.createHtmlOutputFromFile('Index').setTitle('Logistics Coverage Hub')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  } catch (e) {
    return HtmlService.createHtmlOutput('<h1>Akses dibatasi</h1><p>Gunakan akun tim Logistik yang telah diizinkan administrator.</p>');
  }
}

function authorize_() {
  const p = PropertiesService.getScriptProperties();
  const email = String(Session.getActiveUser().getEmail() || '').trim().toLowerCase();
  const allowed = String(p.getProperty('ALLOWED_EMAILS') || '').split(',').map(x => x.trim().toLowerCase()).filter(Boolean);
  // Jangan fallback ke effective user: pada execute-as-owner itu adalah identitas pemilik.
  if (!email || allowed.indexOf(email) < 0) throw new Error('Akses ditolak. Hubungi administrator Logistik.');
  return email;
}

function getHubData() {
  authorize_();
  return loadHub_();
}

function searchRoutes(query) {
  authorize_();
  if (!query || typeof query.origin !== 'string' || typeof query.destination !== 'string' ||
      !query.origin.trim() || !query.destination.trim() || query.origin.length > 200 || query.destination.length > 200) {
    throw new Error('Pilih origin dan destination yang valid.');
  }
  const hub = loadHub_();
  const origin = normalize_(query.origin), destination = normalize_(query.destination);
  const results = hub.routes.filter(r => normalize_(r.origin) === origin && normalize_(r.destination) === destination);
  const grouped = Object.create(null);
  results.forEach(r => { if (!grouped[r.vendorId]) grouped[r.vendorId] = []; grouped[r.vendorId].push(r); });
  return { results: Object.keys(grouped).map(id => {
    const rows = grouped[id];
    const result = Object.assign({}, rows[0]);
    ['mode', 'service', 'vehicle'].forEach(key => { result[key] = Array.from(new Set(rows.map(r => r[key]).filter(Boolean))).join(', '); });
    const mins = rows.map(r => r.leadMin).filter(x => x !== '' && Number.isFinite(Number(x))).map(Number);
    const maxs = rows.map(r => r.leadMax).filter(x => x !== '' && Number.isFinite(Number(x))).map(Number);
    result.leadMin = mins.length ? String(Math.min.apply(null, mins)) : '';
    result.leadMax = maxs.length ? String(Math.max.apply(null, maxs)) : '';
    const contracted = rows.filter(r => r.commercial === 'Available & Contracted').length;
    result.commercial = contracted === rows.length ? 'Available & Contracted' : contracted ? 'Available — Partial Contract' :
      rows.some(r => r.commercial === 'Quotation Only') ? 'Quotation Only' : 'Available — Rate Pending';
    result.evidence = contracted === rows.length ? 'Disetujui' : 'Quotation / negosiasi, perlu konfirmasi operasional';
    result.slotCount = rows.length;
    return result;
  }), loadedAt: hub.loadedAt };
}

function normalize_(value) { return String(value || '').trim().replace(/\s+/g, ' ').toLowerCase(); }

function readTable_(book, name, required) {
  const sheet = book.getSheetByName(name);
  if (!sheet || sheet.getLastRow() < 4) throw new Error('Struktur Central Master belum lengkap: ' + name);
  const values = sheet.getRange(4, 1, sheet.getLastRow() - 3, sheet.getLastColumn()).getDisplayValues();
  const headers = values.shift().map(x => String(x).trim());
  if (required.some(key => headers.indexOf(key) < 0) || new Set(headers.filter(Boolean)).size !== headers.filter(Boolean).length) {
    throw new Error('Header Central Master tidak sesuai: ' + name + '. Hubungi administrator.');
  }
  return values.filter(row => row.some(Boolean)).map(row => {
    const result = Object.create(null);
    headers.forEach((key, i) => { if (key) result[key] = String(row[i] || '').trim(); });
    return result;
  });
}

function group_(type) {
  if (/^(Freight Forwarder( \/ Transporter)?|Kurir Cargo|Pelayaran\/Shipping Line|Kurir Ekspres|Truck Owner|Travel|Pengiriman Mobil|Bus)$/i.test(type)) return 'Ekspedisi / Transport';
  if (/^(Asuransi|Sewa Pergudangan)$/i.test(type)) return 'Asuransi & Support';
  if (/^(Diambil Sendiri oleh Customer|Implementasi SPS Project|Penjualan Material Inventory|Mobil Operasional)$/i.test(type)) return 'Internal / Self Pickup / Mitra';
  return 'Perlu klasifikasi';
}

function commercial_(rows) {
  const approved = rows.filter(r => r.approval === 'APPROVED').length;
  if (approved && approved === rows.length) return 'Available & Contracted';
  if (approved) return 'Available — Partial Contract';
  if (rows.some(r => r.approval === 'VENDOR OFFER - APPROVAL NOT RECORDED')) return 'Quotation Only';
  return 'Available — Rate Pending';
}

// Hanya dipakai oleh proyek publisher privat. Bukan endpoint web app.
function loadCentralHub_() {
  const id = PropertiesService.getScriptProperties().getProperty('CENTRAL_MASTER_ID');
  if (!id) throw new Error('Administrator belum mengatur Central Master.');
  let book;
  try { book = SpreadsheetApp.openById(id); }
  catch (e) { throw new Error('Central Master belum dapat dibaca. Hubungi administrator.'); }
  const sourceVendors = readTable_(book, 'Vendor Master', ['Vendor ID', 'Vendor Name', 'Status Vendor', 'Vendor Type', 'Base / Branch', 'Coverage Area Raw']);
  const sourceRoutes = readTable_(book, 'Route & Rate Master', ['Route ID', 'Vendor ID', 'Origin City', 'Destination City', 'Mode', 'Service', 'Vehicle Type', 'Lead Time Min (Day)', 'Lead Time Max (Day)', 'Approval Status', 'Source Confirmation']);
  const ids = new Set();
  const vendors = sourceVendors.map(row => {
    if (!row['Vendor ID'] || !row['Vendor Name'] || ids.has(row['Vendor ID'])) throw new Error('Vendor ID kosong/duplikat atau nama kosong. Perbaiki Central Master.');
    ids.add(row['Vendor ID']);
    // Whitelist eksplisit. PIC, phone, email, address, KHS, dan seluruh rate tidak dikembalikan.
    return { id: row['Vendor ID'], name: row['Vendor Name'], status: row['Status Vendor'],
      group: group_(row['Vendor Type']), service: row['Vendor Type'], base: row['Base / Branch'], coverage: row['Coverage Area Raw'] };
  });
  const byId = Object.create(null);
  vendors.forEach(v => { byId[v.id] = v; });
  let excluded = 0;
  const routeIds = new Set();
  const routes = [];
  sourceRoutes.forEach(row => {
    const vendor = byId[row['Vendor ID']];
    const approval = row['Approval Status'];
    const confirmation = row['Source Confirmation'];
    // Status yang terbukti pada Central Master. Nilai baru/ambigu memerlukan review, bukan asumsi coverage.
    const evidence = (approval === 'APPROVED' && confirmation === 'Setuju') ||
      (approval === 'COUNTER / NOT APPROVED' && confirmation === 'Tidak Setuju') ||
      (approval === 'VENDOR OFFER - APPROVAL NOT RECORDED' && confirmation === 'No approval column in source');
    if (!vendor || !row['Route ID'] || routeIds.has(row['Route ID']) || !row['Origin City'] || !row['Destination City'] || !evidence) { excluded++; return; }
    routeIds.add(row['Route ID']);
    const route = { id: row['Route ID'], vendorId: vendor.id, vendorName: vendor.name,
      origin: row['Origin City'], destination: row['Destination City'],
      mode: row['Mode'], service: row['Service'], vehicle: row['Vehicle Type'],
      leadMin: row['Lead Time Min (Day)'], leadMax: row['Lead Time Max (Day)'],
      approval: approval, evidence: approval === 'APPROVED' ? 'Disetujui' : 'Quotation / negosiasi, perlu konfirmasi operasional' };
    routes.push(route);
  });
  vendors.forEach(v => {
    const own = routes.filter(r => r.vendorId === v.id);
    v.commercial = commercial_(own);
    v.routeCount = own.length;
  });
  const eligible = routes.filter(r => byId[r.vendorId].group === 'Ekspedisi / Transport' && byId[r.vendorId].status === 'Aktif');
  // Jangan kirim kode approval sumber. Hanya status operasional yang diturunkan server.
  eligible.forEach(r => { r.commercial = commercial_([r]); delete r.approval; });
  return {
    loadedAt: new Date().toISOString(), vendors: vendors, routes: eligible,
    quality: { missingCoverage: vendors.filter(v => !v.coverage).length,
      unclassified: vendors.filter(v => v.group === 'Perlu klasifikasi').length,
      excludedRoutes: excluded, nonEligibleRoutes: routes.length - eligible.length },
    summary: { vendors: vendors.length, activeTransport: vendors.filter(v => v.status === 'Aktif' && v.group === 'Ekspedisi / Transport').length,
      confirmedPairs: new Set(eligible.map(r => normalize_(r.origin) + '\u0000' + normalize_(r.destination))).size,
      destinations: new Set(eligible.map(r => normalize_(r.destination))).size }
  };
}
