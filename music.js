(function(){
"use strict";

// Nhạc thu âm nhạc cụ Trung Hoa, dùng theo giấy phép Creative Commons BY 4.0.
const tracks={
  setup:{
    name:"Tĩnh Tâm Tu Luyện",
    title:"All The Tea In China",
    url:"https://www.silvermansound.com/wp-content/uploads/all-the-tea-in-china.mp3"
  },
  race:{
    name:"Vạn Kiếm Tranh Phong",
    title:"Imperial China Cinematic",
    url:"https://www.silvermansound.com/wp-content/uploads/imperial-china-cinematic.mp3"
  },
  award:{
    name:"Tiên Hội Vinh Danh",
    title:"The Victory Of Heroes",
    url:"https://www.silvermansound.com/wp-content/uploads/the-victory-of-heroes.mp3"
  }
};

const MUSIC_STORAGE_KEY="vankiemphitien-music-enabled";
let enabled=true;
try{const saved=localStorage.getItem(MUSIC_STORAGE_KEY);if(saved==="0")enabled=false;else if(saved==="1")enabled=true;}catch(_){}
let unlocked=false,paused=false,phase="setup",button=null;
let currentAudio=null,fadeTimer=null,fadeToken=0;
const audioPool={};

function updateButton(){
  if(!button)return;
  button.textContent=enabled?"♫ Nhạc: Bật":"♫ Nhạc: Tắt";
  button.setAttribute("aria-pressed",String(enabled));
  button.title=enabled?"Tắt nhạc nền tiên hiệp":"Bật nhạc nền tiên hiệp";
}
function getAudio(key){
  if(audioPool[key])return audioPool[key];
  const audio=new Audio(tracks[key].url);
  audio.preload="auto";
  audio.loop=true;
  audio.volume=0;
  audio.setAttribute("playsinline","");
  audioPool[key]=audio;
  return audio;
}
function stopFade(){
  fadeToken++;
  if(fadeTimer){clearInterval(fadeTimer);fadeTimer=null;}
}
function fadeTo(audio,target,duration,token,onDone){
  const from=audio.volume;
  const started=performance.now();
  if(fadeTimer){clearInterval(fadeTimer);fadeTimer=null;}
  fadeTimer=setInterval(()=>{
    if(token!==fadeToken){clearInterval(fadeTimer);fadeTimer=null;return;}
    const p=Math.min(1,(performance.now()-started)/duration);
    audio.volume=Math.max(0,Math.min(1,from+(target-from)*p));
    if(p>=1){
      clearInterval(fadeTimer);fadeTimer=null;
      if(onDone)onDone();
    }
  },40);
}
async function playPhase(key,fromGesture){
  if(!tracks[key]||!enabled||paused)return;
  const next=getAudio(key);
  if(next===currentAudio&&!next.paused)return;
  stopFade();
  const token=fadeToken;
  try{
    next.volume=0;
    if(next.paused){
      const promise=next.play();
      if(promise&&typeof promise.then==="function")await promise;
    }
    const previous=currentAudio;
    currentAudio=next;
    fadeTo(next,.58,1100,token);
    if(previous&&previous!==next){
      const prevToken=token;
      const started=performance.now();
      const initial=previous.volume;
      const timer=setInterval(()=>{
        if(prevToken!==fadeToken){clearInterval(timer);return;}
        const p=Math.min(1,(performance.now()-started)/900);
        previous.volume=Math.max(0,initial*(1-p));
        if(p>=1){clearInterval(timer);previous.pause();previous.currentTime=0;}
      },40);
    }
    unlocked=true;
  }catch(error){
    // Safari may reject playback until a direct user gesture.
    unlocked=false;
  }
}
async function unlock(){
  if(!enabled||paused)return;
  await playPhase(phase,true);
  updateButton();
}
function setPhase(next){
  if(!tracks[next])return;
  phase=next;
  if(unlocked&&enabled&&!paused)playPhase(phase,false);
  updateButton();
}
function pause(){
  paused=true;
  stopFade();
  Object.values(audioPool).forEach(audio=>audio.pause());
}
function resume(){
  paused=false;
  if(enabled&&unlocked)playPhase(phase,false);
}
function toggle(){
  enabled=!enabled;
  try{localStorage.setItem(MUSIC_STORAGE_KEY,enabled?"1":"0");}catch(_){}
  if(!enabled){
    stopFade();
    Object.values(audioPool).forEach(audio=>{audio.pause();audio.currentTime=0;audio.volume=0;});
    currentAudio=null;
  }else{
    paused=false;
    unlock();
  }
  updateButton();
}
function init(){
  button=document.getElementById("musicToggle");
  updateButton();
  if(button)button.addEventListener("click",toggle);
  document.addEventListener("pointerdown",event=>{
    if(event.target&&event.target.closest&&event.target.closest("#musicToggle"))return;
    if(!unlocked&&enabled)unlock();
  },{passive:true});
  document.addEventListener("keydown",()=>{if(!unlocked&&enabled)unlock();},{once:true});
  setPhase("setup");
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});
else init();
window.CultivationMusic={setPhase,pause,resume,unlock,toggle,getPhase:()=>phase};
})();