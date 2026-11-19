"use strict";

// VKP AUDIO — chuông tiên môn và âm thanh hiệu ứng theo cảnh Thiên Lý Kính.
(function(){
 const STORAGE_KEY="vankiemphitien-sound-enabled";
 let enabled=true,context=null,master=null,noiseBuffer=null,currentEffectKey=null;
 const effectNodes=new Set(),bellNodes=new Set();
 try{const saved=localStorage.getItem(STORAGE_KEY);if(saved==="0")enabled=false;else if(saved==="1")enabled=true;}catch(_){}

 function getContext(){
  if(context)return context;
  const AudioContextClass=window.AudioContext||window.webkitAudioContext;
  if(!AudioContextClass)return null;
  context=new AudioContextClass();
  master=context.createGain();master.gain.value=.72;master.connect(context.destination);
  return context;
 }
 function register(node,group){
  group.add(node);
  node.addEventListener("ended",()=>group.delete(node),{once:true});
  return node;
 }
 function stopGroup(group){
  Array.from(group).forEach(node=>{try{node.stop(0);}catch(_){}group.delete(node);});
 }
 function stopAll(){stopGroup(effectNodes);stopGroup(bellNodes);currentEffectKey=null;}
 function envelopeGain(at,duration,volume,attack=.012){
  const gain=context.createGain();
  gain.gain.setValueAtTime(.0001,at);
  gain.gain.exponentialRampToValueAtTime(Math.max(.0002,volume),at+attack);
  gain.gain.exponentialRampToValueAtTime(.0001,at+duration);
  gain.connect(master);
  return gain;
 }
 function tone(freq,duration,volume,group,at=context.currentTime,type="sine",attack=.012){
  const oscillator=context.createOscillator(),gain=envelopeGain(at,duration,volume,attack);
  oscillator.type=type;oscillator.frequency.setValueAtTime(freq,at);
  oscillator.connect(gain);register(oscillator,group);
  oscillator.start(at);oscillator.stop(at+duration+.025);
  return oscillator;
 }
 function noiseSource(duration,volume,group,at=context.currentTime,filterType="lowpass",startHz=900,endHz=180,attack=.018){
  if(!noiseBuffer){
   noiseBuffer=context.createBuffer(1,Math.ceil(context.sampleRate*2),context.sampleRate);
   const data=noiseBuffer.getChannelData(0);
   for(let i=0;i<data.length;i++)data[i]=Math.random()*2-1;
  }
  const source=context.createBufferSource(),filter=context.createBiquadFilter(),gain=envelopeGain(at,duration,volume,attack);
  source.buffer=noiseBuffer;filter.type=filterType;
  filter.frequency.setValueAtTime(startHz,at);filter.frequency.exponentialRampToValueAtTime(Math.max(40,endHz),at+duration);
  source.connect(filter);filter.connect(gain);register(source,group);
  source.start(at);source.stop(at+duration+.025);
 }
 function bellNote(freq,group,at,duration=1.15,volume=.12){
  [[1,.72],[2.01,.23],[2.74,.12],[4.08,.055]].forEach(([ratio,level],i)=>{
   tone(freq*ratio,duration*(i===0?1:.72),volume*level,group,at,"sine",.004);
  });
 }
 function ring(kind){
  if(!enabled)return;
  const ctx=getContext();if(!ctx||ctx.state!=="running")return;
  const at=ctx.currentTime+.015;
  if(kind==="start"){
   bellNote(587,bellNodes,at,1.45,.14);
   bellNote(784,bellNodes,at+.34,1.65,.13);
   tone(196,.9,.035,bellNodes,at,"sine",.05);
  }else if(kind==="leader"){
   bellNote(988,bellNodes,at,.78,.075);
   tone(1480,.42,.025,bellNodes,at+.045,"sine",.006);
  }else if(kind==="finish"){
   bellNote(784,bellNodes,at,1.0,.095);
   bellNote(1046,bellNodes,at+.12,.92,.07);
  }else if(kind==="finish-first"){
   bellNote(1046,bellNodes,at,1.35,.13);
   bellNote(1318,bellNodes,at+.18,1.45,.105);
   tone(262,.8,.035,bellNodes,at,"sine",.04);
  }else if(kind==="grand"){
   // Đại chung trầm, nhiều họa âm kim loại ngân dài.
   [[110,.16,2.8],[164.8,.095,2.5],[220,.07,2.1],[329.6,.035,1.8],[440,.018,1.4]].forEach(([f,v,d])=>{
    tone(f,d,v,bellNodes,at,"sine",.035);
   });
   noiseSource(.22,.025,bellNodes,at,"lowpass",420,90,.025);
  }
 }
 function playEffect(type){
  if(!enabled)return;
  const ctx=getContext();if(!ctx||ctx.state!=="running")return;
  const at=ctx.currentTime+.01;
  const presets={
   poison:["bubble",.9],weak:["down",.82],pill:["chime",1.04],impact:["impact",.92],
   lightning:["lightning",1.12],gale:["wind",.92],dizzy:["down",1.2],faint:["down",.68],
   boost:["dash",1.12],qi_pill:["chime",.92],sword_intent:["sword",1.16],cloud_step:["wind",1.18],
   formation:["formation",.88],formation_sword:["sword",.94],formation_seal:["formation",1.04],
   sword_spin:["sword",1.28],talisman:["dash",.82],talisman_guard:["formation",.78],
   talisman_thunder:["lightning",.92],wind_step:["wind",1.06],shadow_step:["dash",.72],
   sword_dash:["sword",1.34],body_burst:["impact",1.18],cloud_stride:["wind",.82]
  };
  const preset=presets[type]||["chime",1],kind=preset[0],pitch=preset[1];
  if(kind==="wind"){
   noiseSource(.62,.105,effectNodes,at,"bandpass",1300*pitch,260*pitch,.045);
   tone(360*pitch,.48,.025,effectNodes,at,"sine",.05);
  }else if(kind==="dash"){
   noiseSource(.48,.13,effectNodes,at,"highpass",500*pitch,3600*pitch,.012);
   tone(260*pitch,.34,.045,effectNodes,at,"triangle",.012);
   tone(620*pitch,.22,.025,effectNodes,at+.12,"sine",.008);
  }else if(kind==="lightning"){
   noiseSource(.19,.19,effectNodes,at,"highpass",5200*pitch,700*pitch,.003);
   tone(1180*pitch,.34,.075,effectNodes,at,"sawtooth",.002);
   tone(240*pitch,.42,.07,effectNodes,at+.025,"sine",.003);
  }else if(kind==="impact"){
   tone(92*pitch,.38,.19,effectNodes,at,"sine",.003);
   noiseSource(.16,.11,effectNodes,at,"lowpass",620,100,.002);
  }else if(kind==="bubble"){
   [0,.16,.32].forEach((offset,i)=>tone((220-i*31)*pitch,.25,.065,effectNodes,at+offset,"sine",.025));
   tone(440*pitch,.38,.018,effectNodes,at+.08,"triangle",.02);
  }else if(kind==="down"){
   const osc=tone(560*pitch,.62,.07,effectNodes,at,"sine",.025);
   osc.frequency.exponentialRampToValueAtTime(145*pitch,at+.58);
   tone(92*pitch,.42,.025,effectNodes,at+.08,"sine",.04);
  }else if(kind==="formation"){
   [523,659,784].forEach((f,i)=>bellNote(f*pitch,effectNodes,at+i*.075,.72,.045));
   tone(1046*pitch,.5,.022,effectNodes,at+.16,"sine",.015);
  }else if(kind==="sword"){
   noiseSource(.3,.085,effectNodes,at,"bandpass",3800*pitch,520*pitch,.008);
   tone(880*pitch,.46,.075,effectNodes,at+.045,"triangle",.004);
   tone(1320*pitch,.3,.025,effectNodes,at+.1,"sine",.006);
  }else{
   bellNote(740*pitch,effectNodes,at,.8,.065);
   bellNote(1110*pitch,effectNodes,at+.1,.65,.035);
  }
 }
 function setCameraEffect(type){
  const next=type||null;
  if(next===currentEffectKey)return;
  stopGroup(effectNodes);currentEffectKey=next;
  if(next)playEffect(next);
 }
 function updateButton(){
  const button=document.getElementById("soundToggle");if(!button)return;
  button.setAttribute("aria-pressed",String(enabled));
  button.setAttribute("aria-label",enabled?"Tắt âm thanh hiệu ứng và chuông":"Bật âm thanh hiệu ứng và chuông");
  button.title=enabled?"Tắt âm thanh hiệu ứng và chuông":"Bật âm thanh hiệu ứng và chuông";
 }
 async function unlock(){
  const ctx=getContext();if(!ctx)return;
  try{if(ctx.state!=="running")await ctx.resume();}catch(_){}
 }
 function toggle(){
  enabled=!enabled;
  try{localStorage.setItem(STORAGE_KEY,enabled?"1":"0");}catch(_){}
  if(!enabled)stopAll();else{currentEffectKey=null;unlock();}
  updateButton();
 }
 function init(){
  const button=document.getElementById("soundToggle");
  if(button)button.addEventListener("click",toggle);
  document.addEventListener("pointerdown",unlock,{passive:true});
  document.addEventListener("keydown",unlock,{once:true});
  updateButton();
  const events=window.VKPRaceEvents;
  if(events){
   events.subscribe("race:start",()=>ring("start"));
   events.subscribe("leader:change",()=>ring("leader"));
   events.subscribe("racer:finish",event=>{
    const rank=event&&event.payload&&event.payload.rank;
    ring(rank===1?"finish-first":"finish");
   });
   events.subscribe("race:complete",()=>ring("grand"));
   events.subscribe("race:reset",()=>setCameraEffect(null));
  }
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
 window.VKPAudio={setCameraEffect,toggle,isEnabled:()=>enabled,unlock};
})();