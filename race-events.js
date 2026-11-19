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
 if(window.VKPSlowMotion)subscribe("*",window.VKPSlowMotion.onEvent);
 // Camera nhận cùng event bus, giữ riêng trách nhiệm lựa chọn khung hình.
 if(window.VKPCameraDirector){
  subscribe("racer:overtake",e=>window.VKPCameraDirector.onOvertake(e.payload.racer,e.payload.oldRank,e.payload.newRank));
  subscribe("racer:finish",e=>window.VKPCameraDirector.onFinish(e.payload.racer,e.payload.rank));
  subscribe("race:photo-finish",e=>window.VKPCameraDirector.onPhotoFinish&&window.VKPCameraDirector.onPhotoFinish(e.payload.first,e.payload.second));
 }

 // SLOW MOTION — tự động nhấn nhịp ở các khoảnh khắc quan trọng, có điều khiển thủ công.
 (function installSlowMotion(){
  let autoEnabled=true,manualScale=1,autoScale=1,autoUntil=0;
  const speeds=[1,.5,.25,.1];
  function now(){return performance.now();}
  function updateUI(){
   document.querySelectorAll("[data-race-speed]").forEach(button=>{
    const selected=!autoEnabled&&Number(button.dataset.raceSpeed)===manualScale;
    button.classList.toggle("is-active",selected);
    button.setAttribute("aria-pressed",String(selected));
   });
   const autoButton=document.getElementById("raceAutoSlow");
   if(autoButton){autoButton.classList.toggle("is-active",autoEnabled);autoButton.setAttribute("aria-pressed",String(autoEnabled));}
   const label=document.getElementById("raceSpeedStatus");
   if(label){
    const scale=autoEnabled&&autoUntil>now()?autoScale:manualScale;
    label.textContent=autoEnabled?(autoUntil>now()?"TỰ ĐỘNG · "+scale+"x":"TỰ ĐỘNG"):"THỦ CÔNG · "+manualScale+"x";
   }
  }
  function setManual(value){
   manualScale=speeds.includes(Number(value))?Number(value):1;
   autoEnabled=false;autoUntil=0;updateUI();
  }
  function setAuto(value){autoEnabled=!!value;autoUntil=0;updateUI();}
  function trigger(scale,milliseconds){
   if(!autoEnabled)return;
   const until=now()+milliseconds;
   if(until>=autoUntil){autoScale=Math.min(autoScale||1,scale);autoUntil=until;}
   updateUI();
  }
  function onEvent(event){
   if(!event)return;
   const p=event.payload||{};
   if(event.type==="race:reset"||event.type==="race:start"){
    autoEnabled=true;manualScale=1;autoScale=1;autoUntil=0;updateUI();return;
   }
   if(event.type==="leader:change"&&p.previousId)trigger(.5,1500);
   if(event.type==="racer:overtake"&&p.newRank<=3)trigger(.5,1700);
   if(event.type==="racer:finish"&&p.rank<=3)trigger(.25,1900);
   if(event.type==="race:photo-finish")trigger(.1,2600);
  }
  document.querySelectorAll("[data-race-speed]").forEach(button=>{
   button.addEventListener("click",()=>setManual(button.dataset.raceSpeed));
  });
  const autoButton=document.getElementById("raceAutoSlow");
  if(autoButton)autoButton.addEventListener("click",()=>setAuto(!autoEnabled));
  window.VKPSlowMotion={
   getScale(){return autoEnabled&&autoUntil>now()?autoScale:manualScale;},
   setManual,setAuto,onEvent,
   reset(){autoEnabled=true;manualScale=1;autoScale=1;autoUntil=0;updateUI();}
  };
  updateUI();
 })();

})();