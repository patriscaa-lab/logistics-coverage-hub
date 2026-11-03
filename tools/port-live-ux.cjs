const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const args=process.argv.slice(2),arg=k=>args[args.indexOf(k)+1];
if(!args.includes('--baseline')||!args.includes('--out'))throw Error('Gunakan --baseline DIR --out DIR_BARU');
const base=fs.realpathSync(arg('--baseline')),target=path.resolve(arg('--out')),out=path.join(target,'apps-script'),pkg=path.resolve(__dirname,'../live-integration');
if(fs.existsSync(target))throw Error('Output harus direktori baru');
if(target.startsWith(base+path.sep))throw Error('Output tidak boleh di dalam baseline');
const expected=JSON.parse(fs.readFileSync(path.join(pkg,'baseline-manifest.json'),'utf8')).files;
const hash=t=>crypto.createHash('sha256').update(t.replace(/\r\n/g,'\n')).digest('hex'),content={},edits=[];
for(const name of fs.readdirSync(base)){if(/\.(gs|html)$/.test(name)&&!expected[name])throw Error('Source tambahan: '+name);}
for(const name of Object.keys(expected)){content[name]=fs.readFileSync(path.join(base,name),'utf8');if(hash(content[name])!==expected[name].sha256)throw Error('Baseline berubah: '+name);}
function change(file,from,to,expectedCount=1){const count=content[file].split(from).length-1;if(count!==expectedCount)throw Error('Pencocokan gagal: '+file);content[file]=content[file].split(from).join(to);edits.push({file,count});}
change('Code.gs',"HtmlService.createHtmlOutputFromFile('MapTools').getContent()","HtmlService.createHtmlOutputFromFile('MapTools').getContent() + HtmlService.createHtmlOutputFromFile('Geography').getContent() + HtmlService.createHtmlOutputFromFile('CoverageUX').getContent()");
for(const copy of [
 '<small>Logistics Coverage Hub</small>',
 '<p class="muted">Pantau coverage, bandingkan vendor, hitung kebutuhan armada, dan pastikan data logistik selalu lengkap.</p>',
 '<p class="muted">Tujuan berharga, pilihan vendor, dan risiko ketergantungan berdasarkan bukti rute aktif.</p>',
 '<p class="muted">Hasil berasal dari pasangan origin → destination; arah balik dicari secara terpisah.</p>',
 '<p class="muted">Cari rute, pilih vendor, lalu bandingkan layanan dan harga berizin.</p>',
 '<p class="note">Rekomendasi default: vendor Aktif dari kelompok Ekspedisi / Transport. Quotation dan negosiasi memerlukan konfirmasi operasional.</p>',
 '<p class="muted">Capability, cakupan, dan kesiapan komersial ditampilkan secara terpisah.</p>',
 '<p class="muted">Hitung kebutuhan muatan sebagai persiapan pemilihan armada.</p>',
 '<p class="muted">Referensi dimensi bak, payload, jenis body, dan batas loading.</p>',
 '<p class="note">Berdasarkan moda pada bukti rute aktif. Satu vendor dapat memiliki lebih dari satu moda.</p>'
])change('Index.html',copy,'');
change('Index.html',"L.map('map').setView","L.map('map',{zoomAnimation:false}).setView");
change('Index.html','Pilih origin dan destination untuk memulai.','Pilih origin dan destination untuk melihat vendor.');
change('Index.html','Belum ada bukti rute untuk vendor transport Aktif pada pasangan ini. Periksa direktori atau koordinasikan validasi rute dengan tim Logistik.','Belum ada bukti rute aktif untuk pasangan ini.');
change('Index.html',"el('h3','Harga vendor per armada'),el('p','Nilai mengikuti sumber. Penawaran, counter, dan final belum berarti approved. Harga kosong tidak dianggap nol.','note')","el('h3','Harga vendor per armada')");
change('Index.html',"copy.append(el('strong',label),el('small',description))","copy.append(el('strong',label))");
change('Index.html',"contract.append(layout,el('p','Kesiapan komersial mengikuti bukti sumber; bukan jumlah dokumen KHS.','note'))","contract.append(layout)");
// Copy hasil jarak dipadatkan, angka/status/provider/cache tidak diganti.
change('Index.html',"box.append(el('p','Pilih asal dan tujuan untuk melihat dua jenis jarak.','note'));continue;","continue;");
change('Index.html',"result.note||'Jarak antartitik referensi kota. Bukan jarak alamat pickup/delivery atau dasar tarif.'","result.roadStatus==='ok'?'Estimasi jalan bukan dasar tarif resmi.':result.roadStatus==='loading'?'Menghitung jarak jalan…':'Jarak jalan belum tersedia.'");
const mapChanges=[
 ["root=make('div',undefined,'map-tools');root.id='mapToolsPanel';root.append(make('h3','Ukur jarak di peta'),make('p','Pilih kota/kabupaten, atau tentukan dua titik langsung pada peta.'));","root=make('details',undefined,'map-tools');root.id='mapToolsPanel';root.addEventListener('toggle',()=>{if(!root.open)setMode('');});root.append(make('summary','Ukur Jarak'));"],
 ["byId('mapToolsHint').textContent=mode?'Klik '+(mode==='origin'?'titik asal':'titik tujuan')+' pada peta. Anda tetap dapat menggeser dan memperbesar peta.':'Pilih nama kota/kabupaten atau gunakan tombol pilih titik di peta.';","byId('mapToolsHint').textContent=mode?'Klik '+(mode==='origin'?'asal':'tujuan')+' pada peta.':'';byId('mapToolsHint').hidden=!mode;"],
 ["note.textContent='Pilih dua lokasi untuk mengukur. Pengukuran ini tidak membuat bukti rute vendor.'","note.textContent=''"],
 ["note.textContent='Mengambil jarak jalan dari Google Maps…'","note.textContent='Menghitung jarak jalan…'"],
 ["'Jarak jalan/driving untuk kendaraan umum; dapat mencakup penyeberangan. Bukan jaminan akses truk atau dasar tarif.'","'Estimasi jalan bukan dasar tarif resmi.'"],
 ["'Perhitungan lain sedang berjalan. Klik Ukur jarak untuk mencoba lagi.'","'Tunggu sebentar, lalu klik Ukur Jarak.'"],
 ["'Rute jalan belum tersedia atau layanan Google sedang gagal. Jarak lurus tetap tersedia.'","'Jarak jalan belum tersedia.'"],
 ["'Layanan jarak jalan belum dapat diakses. Klik Ukur jarak untuk mencoba lagi.'","'Jarak jalan gagal dimuat. Coba lagi.'"],
 ["const hint=make('p','Pilih nama kota/kabupaten atau gunakan tombol pilih titik di peta.','map-tools-status');hint.id='mapToolsHint';","const hint=make('p','','map-tools-status');hint.id='mapToolsHint';hint.hidden=true;"],
 ["const note=make('p','Pilih dua lokasi untuk mengukur.')","const note=make('p','')"],
 ["make('button','Ukur jarak')","make('button','Ukur Jarak')"],
 ["'Titik peta ('+coords.join(', ')+')'","state.mode==='origin'?'Titik asal':'Titik tujuan'"],
 ["marker.on('click',()=>{choose(state.mode||(!state.origin?'origin':'destination'),point.coords,point.label);});","marker.on('click',()=>{if(state.mode)choose(state.mode,point.coords,point.label);else if(typeof showCityInsight==='function')showCityInsight(point.label);});"],
 ["{permanent:true,direction:'top'}","{direction:'top'}"],
 ["byId('mapToolsHint').textContent='Lokasi belum ada pada referensi. Gunakan tombol pilih titik pada peta.';","byId('mapToolsHint').textContent='Lokasi belum ditemukan. Pilih titik di peta.';byId('mapToolsHint').hidden=false;"],
 ['.map-tools h3{','.map-tools summary{cursor:pointer;font-size:17px;font-weight:600}.map-tools[open] summary{margin-bottom:14px}.map-tools h3{'],
 ['padding:[55,55],maxZoom:8','padding:[55,55],maxZoom:8,animate:false'],
 ['setView(point.coords,7)','setView(point.coords,7,{animate:false})']
];
mapChanges.forEach(([from,to])=>change('MapTools.html',from,to));

change('MapTools.html',"async function diagnose(){const box=diagnosticPanel();box.hidden=false;box.replaceChildren(make('strong','Pemeriksaan akses data'),make('p','Memeriksa sesi akun dan izin baca…'));try{const result=await call('diagnoseHubAccess');box.replaceChildren(make('strong','Status: '+result.code),make('p',mapToolsStatus(result.code)));if(result.account)box.append(make('p','Akun sesi: '+result.account));}catch(e){box.replaceChildren(make('strong','Pemeriksaan akses belum dapat dijalankan'),make('p','Google mungkin belum mengotorisasi aplikasi pada sesi ini. Gunakan satu akun Logistik dan buka URL aplikasi kembali.'));}const retry=make('button','Muat ulang data'),check=make('button','Periksa lagi');retry.onclick=()=>{if(typeof refresh==='function')refresh();};check.onclick=diagnose;box.append(retry,check);}","async function diagnose(){const generation=state.diagnosticGeneration;const box=diagnosticPanel();box.hidden=false;box.replaceChildren(make('strong','Pemeriksaan akses data'),make('p','Memeriksa sesi akun dan izin baca…'));try{const result=await call('diagnoseHubAccess');if(generation!==state.diagnosticGeneration)return;if(result.code==='DATA_READABLE'&&typeof hub!=='undefined'&&hub&&byId('error')?.hidden){box.hidden=true;box.replaceChildren();return;}box.replaceChildren(make('strong','Status: '+result.code),make('p',mapToolsStatus(result.code)));if(result.account)box.append(make('p','Akun sesi: '+result.account));}catch(e){if(generation!==state.diagnosticGeneration)return;box.replaceChildren(make('strong','Pemeriksaan akses belum dapat dijalankan'),make('p','Google mungkin belum mengotorisasi aplikasi pada sesi ini. Gunakan satu akun Logistik dan buka URL aplikasi kembali.'));}const retry=make('button','Muat ulang data'),check=make('button','Periksa lagi');retry.onclick=()=>{if(typeof refresh==='function')refresh();};check.onclick=diagnose;box.append(retry,check);}");
change('MapTools.html','diagnosed:false','diagnosed:false,diagnosticGeneration:0');
change('MapTools.html','diagnosticPanel();let attempts=0;',"const diagnosticRender=render;render=function(){const result=diagnosticRender.apply(this,arguments);state.diagnosticGeneration++;const box=diagnosticPanel();box.hidden=true;box.replaceChildren();state.diagnosed=false;return result;};\ndiagnosticPanel();let attempts=0;");
for(const name of ['Geography.html','CoverageUX.html'])content[name]=fs.readFileSync(path.join(pkg,name),'utf8');
fs.mkdirSync(out,{recursive:true});for(const [name,text] of Object.entries(content))fs.writeFileSync(path.join(out,name),text);
fs.mkdirSync(path.join(target,'tests'));fs.mkdirSync(path.join(target,'tools'));
for(const name of ['live-regression.test.cjs','ux-coverage.test.cjs'])fs.copyFileSync(path.join(pkg,'qa',name),path.join(target,'tests',name));
fs.copyFileSync(path.join(pkg,'qa/browser-live-ux.cjs'),path.join(target,'tools/browser-live-ux.cjs'));
fs.writeFileSync(path.join(target,'delta-manifest.json'),JSON.stringify({baselineVersion:8,edits,files:Object.fromEntries(Object.entries(content).map(([n,t])=>[n,hash(t)]))},null,2));
console.log('Kandidat lokal dibuat. Tidak ada deployment: '+target);
