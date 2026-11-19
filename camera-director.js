"use strict";

// CAMERA DIRECTOR — chọn cảnh Thiên Lý Kính theo diễn biến, không can thiệp gameplay.
(function(){
 const state={mode:"leader",targetId:null,until:0,lastCut:0};
 const HOLD_MS=1050;
 function now(){return performance.now();}
 function setShot(mode,target,until,force=false){
  const id=target&&target.id||null;
  if(!force&&state.mode===mode&&state.targetId===id)return;
  if(!force&&now()-state.lastCut<HOLD_MS&&state.until>now())return;
  state.mode=mode;state.targetId=id;state.until=until||0;state.lastCut=now();
 }
 function reset(){state.mode="leader";state.targetId=null;state.until=0;state.lastCut=0;}
 function onOvertake(racer,oldRank,newRank){
  if(!racer||newRank>=oldRank||newRank>3||now()-state.lastCut<900)return;
  setShot("overtake",racer,now()+1700,true);
 }
 function onFinish(racer,rank){
  if(!racer||rank>3)return;
  setShot("finish",racer,now()+2300,true);
 }
 function onPhotoFinish(first,second){
  const target=first||second;if(!target)return;
  setShot("photo",target,now()+2200,true);
 }
 function select(){
  const time=now();
  const active=Array.isArray(racers)?racers.filter(r=>!r.finished):[];
  const ranked=typeof sortedRacers==="function"?sortedRacers():active.slice().sort((a,b)=>b.progress-a.progress);
  const leader=active.slice().sort((a,b)=>b.progress-a.progress)[0]||ranked[0]||null;
  const effectTarget=typeof cameraFocusId!=="undefined"&&cameraFocusId?racers.find(r=>r.id===cameraFocusId):null;
  if(effectTarget&&!effectTarget.finished&&effectTarget.effectTimer>0){
   state.mode="effect";state.targetId=effectTarget.id;state.until=time+250;return {racer:effectTarget,mode:"effect",label:"HIỆU ỨNG",scale:2.12};
  }
  if(state.until>time&&state.targetId){
   const target=racers.find(r=>r.id===state.targetId&&(state.mode==="finish"||!r.finished));
   if(target)return {racer:target,mode:state.mode,label:state.mode==="finish"?"VỀ ĐÍCH":state.mode==="photo"?"PHOTO FINISH":state.mode==="duel"?"TRANH PHONG":"PHA VƯỢT HẠNG",scale:2.15};
   state.until=0;state.targetId=null;
  }
  if(active.length>=2){
   const top=active.slice().sort((a,b)=>b.progress-a.progress);
   const gap=Math.abs((top[0].progress-top[1].progress)/Math.max(1,distance));
   if(gap<=.022&&time-state.lastCut>=HOLD_MS){
    setShot("duel",top[1],time+1400);
    return {racer:top[1],mode:"duel",label:"TRANH PHONG",scale:2.08};
   }
  }
  if(leader){state.mode="leader";state.targetId=leader.id;return {racer:leader,mode:"leader",label:"DẪN ĐẦU",scale:2.0};}
  return null;
 }
 window.VKPCameraDirector={reset,onOvertake,onFinish,onPhotoFinish,select};
})();