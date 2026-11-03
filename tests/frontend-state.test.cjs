const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');
const html=fs.readFileSync('apps-script/Index.html','utf8');
const flush=()=>new Promise(resolve=>setImmediate(resolve));
function fixture(){return {loadedAt:'2026-10-30T01:00:00.000Z',canViewRates:false,vendors:[{id:'v1',name:'Vendor Uji',status:'Aktif',group:'Ekspedisi / Transport',service:'Transport',base:'Jakarta',coverage:'',commercial:'Available & Contracted',routeCount:1}],routes:[{id:'r1',vendorId:'v1',vendorName:'Vendor Uji',origin:'Jakarta',destination:'Kota Surabaya',mode:'Darat',service:'FTL',vehicle:'Truk',leadMin:'1',leadMax:'2',commercial:'Available & Contracted',evidence:'Uji'}],summary:{vendors:1,activeTransport:1,confirmedPairs:1,destinations:1},quality:{missingCoverage:1,unclassified:0,excludedRoutes:0,nonEligibleRoutes:0,duplicateVendorIds:0}};}
function browser(){
  const nodes=new Map(),requests=[],sections=[],nav=[],subnav=[];
  class Node{
    constructor(tag='div'){this.tag=tag;this.children=[];this.style={};this.dataset={};this.events={};this.attributes={};this.value='';this._text='';}
    set id(value){this._id=value;nodes.set(value,this);}get id(){return this._id;}
    set textContent(value){this._text=String(value);this.children=[];}get textContent(){return this._text+this.children.map(n=>n.textContent||'').join(' ');}
    get childElementCount(){return this.children.length;}
    append(...items){for(const item of items){if(item.parent)item.parent.children=item.parent.children.filter(n=>n!==item);item.parent=this;this.children.push(item);}}
    prepend(...items){this.children.unshift(...items);}replaceChildren(...items){this._text='';this.children=[];this.append(...items);}
    setAttribute(key,value){this.attributes[key]=value;}removeAttribute(key){delete this.attributes[key];}
    addEventListener(event,handler){(this.events[event]||=([])).push(handler);}dispatch(event){(this.events[event]||[]).forEach(handler=>handler({target:this}));}
    close(){this.open=false;}showModal(){this.open=true;}focus(){}click(){if(this.onclick)this.onclick();}
  }
  for(const [,id]of html.matchAll(/\bid="([^"]+)"/g)){const n=new Node();n.id=id;}
  for(const [,id]of html.matchAll(/<section[^>]*\bid="([^"]+)"/g))sections.push(nodes.get(id));
  for(const [,view]of html.matchAll(/<button[^>]*data-view="([^"]+)"/g)){const n=new Node('button');n.dataset.view=view;nav.push(n);}
  for(const [,view]of html.matchAll(/<button[^>]*data-subview="([^"]+)"/g)){const n=new Node('button');n.dataset.subview=view;subnav.push(n);}
  nodes.get('group').value='Ekspedisi / Transport';
  const document={getElementById:id=>nodes.get(id),createElement:tag=>new Node(tag),createElementNS:(_,tag)=>new Node(tag),body:new Node('body'),querySelectorAll:selector=>selector==='main>section'?sections:selector==='[data-subview]'?subnav:selector.startsWith('nav ')?nav:[],addEventListener(){}};
  const run={withSuccessHandler(resolve){return {withFailureHandler(reject){return new Proxy({},{get:(_,name)=>arg=>requests.push({name,arg,resolve,reject})});}};}};
  const map={setView(){return this;},fitBounds(){return this;},invalidateSize(){},attributionControl:{addAttribution(){}}};
  const layer=()=>({addTo(){return this;},clearLayers(){},bindTooltip(){return this;},on(){return this;}});
  const L={map:()=>map,geoJSON:layer,layerGroup:layer,circleMarker:layer,polyline:layer};
  const ctx=vm.createContext({document,window:{google:{script:{run}},L},google:{script:{run}},L,Option:function(label,value){const n=new Node('option');n.textContent=label;n.value=value;return n;},setTimeout:fn=>{fn();return 0;},console});
  const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]).filter(Boolean);vm.runInContext(scripts.join('\n'),ctx);
  return {ctx,nodes,requests,async load(data=fixture()){assert.equal(requests[0].name,'getHubData');requests[0].resolve(data);await flush();}};
}
test('akun tanpa role harga melihat akses dibatasi, bukan nol vendor berharga', {timeout:2000},async()=>{const b=browser();await b.load();assert.match(b.nodes.get('mapNote').textContent,/Ketersediaan harga dibatasi/);assert.ok(!b.nodes.get('mapNote').textContent.includes('0 tujuan memiliki harga'));b.ctx.showCityInsight('Surabaya');assert.match(b.nodes.get('cityInfo').textContent,/izin komersial/);});
test('hasil request lama tidak muncul dan tidak mengaktifkan tombol saat request baru masih berjalan', {timeout:2000},async()=>{const b=browser();await b.load();const first=b.ctx.search('Jakarta','Surabaya'),second=b.ctx.search('Jakarta','Kediri');assert.equal(b.requests.length,3);b.requests[1].resolve({results:[{...fixture().routes[0],vendorName:'HASIL_LAMA'}]});await first;assert.equal(b.nodes.get('searchButton').disabled,true);assert.ok(!b.nodes.get('results').textContent.includes('HASIL_LAMA'));b.requests[2].resolve({results:[]});await second;assert.equal(b.nodes.get('searchButton').disabled,false);assert.equal(b.nodes.get('resultTitle').textContent,'Jakarta → Kediri');});
test('mengedit rute membuang hasil, perbandingan, dan respons harga yang sedang menunggu', {timeout:2000},async()=>{const b=browser();await b.load();const search=b.ctx.search('Jakarta','Surabaya');b.nodes.get('origin').value='Bandung';b.nodes.get('origin').dispatch('input');b.requests[1].resolve({results:[{...fixture().routes[0],vendorName:'VENDOR_RUTE_LAMA'}]});await search;assert.ok(!b.nodes.get('results').textContent.includes('VENDOR_RUTE_LAMA'));assert.match(b.nodes.get('results').textContent,/Rute berubah/);assert.equal(b.nodes.get('distance').textContent,'');assert.equal(b.nodes.get('detailBody').textContent,'');assert.equal(b.nodes.get('compare').textContent,'Bandingkan (0/3)');});
test('refresh mencegah search mencampur snapshot dan membuang respons search sebelum refresh', {timeout:2000},async()=>{const b=browser();await b.load();const search=b.ctx.search('Jakarta','Surabaya');const refresh=b.ctx.refresh();const count=b.requests.length;const blocked=b.ctx.search('Jakarta','Kediri');await flush();assert.equal(b.requests.length,count);await blocked;b.requests[1].resolve({results:[{...fixture().routes[0],vendorName:'SNAPSHOT_LAMA'}]});await search;assert.equal(b.nodes.get('searchButton').disabled,true);b.requests[2].resolve(fixture());await refresh;assert.equal(b.nodes.get('searchButton').disabled,false);assert.ok(!b.nodes.get('results').textContent.includes('SNAPSHOT_LAMA'));});
