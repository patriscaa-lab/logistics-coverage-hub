/** Proyek Apps Script TERPISAH, privat milik pemilik Central Master; jangan deploy sebagai web app. */
function syncOperationalSnapshot() {
  const props = PropertiesService.getScriptProperties();
  const owner = String(props.getProperty('PUBLISHER_OWNER_EMAIL') || '').trim().toLowerCase();
  const effective = String(Session.getEffectiveUser().getEmail() || '').trim().toLowerCase();
  if (!owner || owner !== effective) throw new Error('Sinkronisasi hanya dapat dijalankan akun pemilik publisher.');
  const source = props.getProperty('CENTRAL_MASTER_ID');
  const target = props.getProperty('OPS_SPREADSHEET_ID');
  if (!source || !target || source === target) throw new Error('Gunakan dua spreadsheet terpisah: master dan proyeksi operasional.');
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) throw new Error('Sinkronisasi lain sedang berjalan.');
  try {
    const hub = loadCentralHub_();
    assertSafeSnapshot_(hub);
    const json = JSON.stringify(hub);
    if (json.length > 2000000) throw new Error('Salinan terlalu besar untuk format ini.');
    const rows = [['schema','1'], ['syncedAt',hub.loadedAt], ['sha256',digest_(json)]];
    // Prefix memastikan potongan teks tidak pernah ditafsirkan Sheet sebagai formula.
    for (let i = 0; i < json.length; i += 30000) rows.push(['chunk','json:' + json.slice(i,i + 30000)]);
    const book = SpreadsheetApp.openById(target);
    const sheet = book.getSheetByName('Operational Snapshot') || book.insertSheet('Operational Snapshot');
    if (sheet.getLastColumn() > 2) throw new Error('Sheet tujuan harus khusus salinan operasional dengan dua kolom.');
    const height = Math.max(rows.length, sheet.getLastRow());
    while (rows.length < height) rows.push(['','']);
    if (height > sheet.getMaxRows()) sheet.insertRowsAfter(sheet.getMaxRows(), height - sheet.getMaxRows());
    // Satu penulisan untuk payload beserta metadata. Pembaca memverifikasi digest untuk menolak pembacaan parsial.
    sheet.getRange(1,1,height,2).setValues(rows);
    SpreadsheetApp.flush();
    return { syncedAt: hub.loadedAt, vendors: hub.summary.vendors, routes: hub.routes.length };
  } finally { lock.releaseLock(); }
}

function installOperationalSyncTrigger() {
  // Panggil dari editor publisher setelah konfigurasi diverifikasi; tidak dipanggil otomatis oleh web app.
  syncOperationalSnapshot();
  const existing = ScriptApp.getProjectTriggers().filter(t => t.getHandlerFunction() === 'syncOperationalSnapshot');
  if (!existing.length) ScriptApp.newTrigger('syncOperationalSnapshot').timeBased().everyMinutes(5).create();
}
