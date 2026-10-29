const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
function publisher(options={}) {
  const properties={PUBLISHER_OWNER_EMAIL:'owner@example.test',CENTRAL_MASTER_ID:'SOURCE',OPS_SPREADSHEET_ID:'OPS',...options.properties};
  const state={writes:[],opens:[],released:false};
  const hub={loadedAt:'2026-10-29T10:00:00.000Z',vendors:[],routes:[],summary:{vendors:0,activeTransport:0,confirmedPairs:0,destinations:0},quality:{missingCoverage:0,unclassified:0,excludedRoutes:0,nonEligibleRoutes:0,duplicateVendorIds:0}};
  const ctx=vm.createContext({PropertiesService:{getScriptProperties:()=>({getProperty:key=>properties[key]})},Session:{getEffectiveUser:()=>({getEmail:()=>options.email||'owner@example.test'})},LockService:{getScriptLock:()=>({tryLock:()=>true,releaseLock:()=>{state.released=true;}})},loadCentralHub_:()=>hub,digest_:()=> 'digest',SpreadsheetApp:{flush(){},openById:id=>{state.opens.push(id);return {getSheetByName:()=>({getLastColumn:()=>2,getLastRow:()=>options.oldHeight||0,getMaxRows:()=>1000,getRange:()=>({setValues:rows=>state.writes.push(rows)})})};}}});
  vm.runInContext(fs.readFileSync('apps-script/Snapshot.gs','utf8'),ctx);
  // Digest implementation is irrelevant to write targeting; reader tests cover schema separately.
  ctx.digest_=()=> 'digest';
  vm.runInContext(fs.readFileSync('publisher/Publisher.gs','utf8'),ctx);
  return {ctx,state,hub};
}
test('publisher hanya menulis spreadsheet operasional, bukan source',()=>{const {ctx,state}=publisher();ctx.syncOperationalSnapshot();assert.deepEqual(state.opens,['OPS']);assert.equal(state.writes.length,1);assert.equal(state.writes[0][0][0],'schema');assert.ok(state.writes[0][3][1].startsWith('json:'));assert.equal(state.released,true);});
test('source dan tujuan yang sama ditolak sebelum operasi tulis',()=>{const {ctx,state}=publisher({properties:{OPS_SPREADSHEET_ID:'SOURCE'}});assert.throws(()=>ctx.syncOperationalSnapshot(),/terpisah/);assert.equal(state.writes.length,0);assert.equal(state.opens.length,0);});
test('akun selain pemilik tidak dapat menjalankan publisher',()=>{const {ctx,state}=publisher({email:'outsider@example.test'});assert.throws(()=>ctx.syncOperationalSnapshot(),/pemilik/);assert.equal(state.writes.length,0);});
test('schema berisi kontak tambahan tidak pernah ditulis',()=>{const {ctx,state,hub}=publisher();hub.phone='SECRET';assert.throws(()=>ctx.syncOperationalSnapshot(),/schema/);assert.equal(state.writes.length,0);assert.equal(state.released,true);});
test('baris lama dibersihkan dalam penulisan payload yang sama',()=>{const {ctx,state}=publisher({oldHeight:10});ctx.syncOperationalSnapshot();assert.equal(state.writes[0].length,10);assert.deepEqual(Array.from(state.writes[0][9]),['','']);});
