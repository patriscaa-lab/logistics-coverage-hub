/** Status aman untuk membedakan gagal login, izin data, dan snapshot rusak. */
function diagnoseHubAccess() {
  const account = String(Session.getActiveUser().getEmail() || '').trim().toLowerCase();
  try { authorize_(); } catch (e) { return { code: account ? 'ACCOUNT_NOT_ALLOWED' : 'SESSION_MISSING', account: account }; }
  const id = PropertiesService.getScriptProperties().getProperty('OPS_SPREADSHEET_ID');
  if (!id) return { code: 'DATA_NOT_CONFIGURED', account: account };
  try {
    // Tidak mengirim snapshot, harga, identitas spreadsheet, atau allowlist ke respons.
    loadHub_();
    return { code: 'DATA_READABLE', account: account };
  } catch (e) {
    // loadHub_ menyamarkan error layanan; pembacaan minimum membedakan izin dari format.
    try { Sheets.Spreadsheets.Values.get(id, "'Operational Snapshot'!A1:B3", {valueRenderOption:'FORMATTED_VALUE'}); }
    catch (readError) {
      const text = String(readError.message || readError).toLowerCase();
      const code = /authorization|not have permission to call|insufficient authentication|scope/.test(text) ? 'GOOGLE_AUTH_REQUIRED' : /permission|forbidden|not found|403|404/.test(text) ? 'DATA_ACCESS_DENIED' : 'DATA_SERVICE_UNAVAILABLE';
      return { code: code, account: account };
    }
    return { code: 'SNAPSHOT_INVALID', account: account };
  }
}

/** Pengukuran dua titik peta; tidak membuat bukti rute/vendor atau mengubah tarif. */
function measureMapRoute(query) {
  authorize_();
  const points = query && [query.origin,query.destination];
  if (!points || points.some(p=>!Array.isArray(p)||p.length!==2||p.some(n=>typeof n!=='number'||!Number.isFinite(n))||p[0]<-12||p[0]>7||p[1]<94||p[1]>142)) throw new Error('Koordinat pengukuran tidak valid.');
  const [a,b]=points,rad=x=>x*Math.PI/180;
  const h=Math.sin(rad(b[0]-a[0])/2)**2+Math.cos(rad(a[0]))*Math.cos(rad(b[0]))*Math.sin(rad(b[1]-a[1])/2)**2;
  const result={straightKm:6371*2*Math.asin(Math.sqrt(Math.min(1,h))),roadKm:null,status:'unavailable'};
  if(result.straightKm===0){result.roadKm=0;result.status='ok';return result;}
  const cache=CacheService.getUserCache(),key='map-tools-v1:'+points.flat().map(n=>n.toFixed(5)).join(':');
  const cached=cache.get(key);if(cached){try{return JSON.parse(cached);}catch(e){}}
  const lock=LockService.getUserLock();if(!lock.tryLock(500)){result.status='busy';return result;}
  try {
    const next=cache.get(key);if(next)return JSON.parse(next);
    const last=Number(cache.get('map-tools-last')||0);if(Date.now()-last<1000){result.status='busy';return result;}
    cache.put('map-tools-last',String(Date.now()),5);
    const response=Maps.newDirectionFinder().setOrigin(a[0],a[1]).setDestination(b[0],b[1]).setMode(Maps.DirectionFinder.Mode.DRIVING).setRegion('id').setLanguage('id').getDirections();
    const route=response&&response.routes&&response.routes[0];
    if(route&&Array.isArray(route.legs)&&route.legs.length&&route.legs.every(leg=>leg.distance&&Number.isFinite(leg.distance.value)&&leg.distance.value>=0)){
      result.roadKm=route.legs.reduce((sum,leg)=>sum+leg.distance.value,0)/1000;result.status='ok';
    }else result.status='no_route';
    cache.put(key,JSON.stringify(result),result.status==='ok'?3600:60);
  }catch(e){result.status='unavailable';}
  finally{lock.releaseLock();}
  return result;
}
