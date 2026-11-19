"use strict";

// RACE EVENT ENGINE — chuẩn hóa sự kiện cuộc đua cho camera, bình luận và khán giả.
(function(){
 const listeners=new Map(),cooldowns=new Map(),recent=new Map();
 const defaults={"racer:overtake":700,"leader:change":1100,"racer:finish":0,"race:photo-finish":2500,"race:start":0,"race:countdown":0,"race:complete":0};
 let serial=0,leaderId=null;
 function subscribe(type,callback){
  if(typeof callback!=="function")return()=>{};
  const set=listeners.get(type)||new Set();set.add(callback);listeners.set(type,set);
  return()=>set.delete(callback);
 }
 function emit(type,payload={},options={}){
  const now=performance.now(),key=options.key||type,limit=Number.isFinite(options.cooldown)?options.cooldown:(defaults[type]||0);
  if(limit>0&&now-(cooldowns.get(key)||0)<limit)return false;
  cooldowns.set(key,now);const event={type,payload,at:now,id:++serial};
  recent.set(type,event);
  (listeners.get(type)||[]).forEach(fn=>{try{fn(event);}catch(error){console.error("[VKP Event]",type,error);}});
  (listeners.get("*")||[]).forEach(fn=>{try{fn(event);}catch(error){console.error("[VKP Event]",type,error);}});
  return true;
 }
 function reset(){cooldowns.clear();recent.clear();serial=0;leaderId=null;emit("race:reset",{},{cooldown:0});}
 function trackLeader(racer){
  if(!racer||racer.finished||leaderId===racer.id)return;
  const previous=leaderId;leaderId=racer.id;
  emit("leader:change",{racer,previousId:previous},{key:"leader-change",cooldown:1100});
 }
 window.VKPRaceEvents={subscribe,emit,reset,trackLeader,getRecent:type=>recent.get(type)||null};
 // Camera nhận cùng event bus, giữ riêng trách nhiệm lựa chọn khung hình.
 if(window.VKPCameraDirector){
  subscribe("racer:overtake",e=>window.VKPCameraDirector.onOvertake(e.payload.racer,e.payload.oldRank,e.payload.newRank));
  subscribe("racer:finish",e=>window.VKPCameraDirector.onFinish(e.payload.racer,e.payload.rank));
  subscribe("race:photo-finish",e=>window.VKPCameraDirector.onPhotoFinish&&window.VKPCameraDirector.onPhotoFinish(e.payload.first,e.payload.second));
 }


})();