(function(){
"use strict";
const tracks={
setup:{name:"Tĩnh Tâm Tu Luyện",bpm:66,steps:32,melody:[[0,62,1.7],[4,67,1.4],[8,69,1.7],[12,74,1.3],[16,71,1.6],[20,69,1.5],[24,67,1.8],[28,64,1.6]],accents:[[0,50,3.4],[8,57,3.2],[16,54,3.4],[24,59,3.2]],bells:[[6,86,1.2],[22,83,1.3],[30,81,1.4]]},
race:{name:"Vạn Kiếm Tranh Phong",bpm:112,steps:32,melody:[[0,74,.42],[2,78,.38],[4,81,.6],[7,78,.38],[8,83,.55],[10,81,.38],[12,78,.5],[14,76,.38],[16,74,.42],[18,78,.38],[20,81,.6],[23,86,.4],[24,83,.55],[26,81,.38],[28,78,.5],[30,76,.38]],accents:[[0,50,.7],[4,57,.7],[8,54,.7],[12,59,.7],[16,50,.7],[20,57,.7],[24,54,.7],[28,59,.7]],bells:[[6,90,.6],[14,88,.6],[22,93,.6],[30,90,.6]]},
award:{name:"Tiên Hội Vinh Danh",bpm:78,steps:32,melody:[[0,74,1.1],[4,81,1.1],[8,86,1.5],[12,83,1.1],[16,81,1.2],[20,78,1.1],[24,74,1.5],[28,78,1.1]],accents:[[0,50,2.5],[8,57,2.4],[16,54,2.5],[24,59,2.4]],bells:[[4,93,1.3],[12,90,1.3],[20,98,1.6],[28,93,1.4]]}
};
const hz=n=>440*Math.pow(2,(n-69)/12);
let ctx=null,master=null,enabled=true,unlocked=false,phase="setup",paused=false,timer=null,step=0,nextAt=0,trackKey="",button=null;
function updateButton(){if(!button)return;button.textContent=unlocked?(enabled?"♫ Nhạc: Bật":"♫ Nhạc: Tắt"):"♫ Bật nhạc";button.setAttribute("aria-pressed",String(enabled));button.title=enabled?"Nhạc nền tu tiên":"Bật nhạc nền tu tiên";}
function ensureAudio(){if(ctx)return true;const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return false;ctx=new AC();master=ctx.createGain();master.gain.value=.48;master.connect(ctx.destination);return true;}
function tone(freq,when,duration,kind,volume){
if(!ctx||!master)return;const osc=ctx.createOscillator(),gain=ctx.createGain(),filter=ctx.createBiquadFilter();
osc.type=kind==="pluck"?"triangle":"sine";osc.frequency.setValueAtTime(freq,when);
if(kind==="flute"){osc.detune.setValueAtTime(-3,when);osc.detune.linearRampToValueAtTime(3,when+duration*.45);osc.detune.linearRampToValueAtTime(-2,when+duration);}
if(kind==="drum"){osc.frequency.setValueAtTime(freq*1.8,when);osc.frequency.exponentialRampToValueAtTime(Math.max(35,freq*.55),when+Math.min(.18,duration));}
filter.type="lowpass";filter.frequency.setValueAtTime(kind==="bell"?5200:kind==="flute"?1900:kind==="drum"?420:3200,when);
const peak=volume*(kind==="bell"?.42:kind==="flute"?.25:kind==="drum"?.34:.48);
gain.gain.setValueAtTime(.0001,when);gain.gain.exponentialRampToValueAtTime(Math.max(.0002,peak),when+(kind==="pluck"?.012:kind==="drum"?.006:.09));gain.gain.exponentialRampToValueAtTime(.0001,when+duration);
osc.connect(filter);filter.connect(gain);gain.connect(master);osc.start(when);osc.stop(when+duration+.04);
}
function playStep(index,when,track){const unit=(60/track.bpm)/2;
for(const [at,n,d] of track.melody)if(at===index)tone(hz(n),when,d*unit,"pluck",.82);
for(const [at,n,d] of track.accents)if(at===index)tone(hz(n),when,d*unit,"flute",.72);
for(const [at,n,d] of track.bells)if(at===index)tone(hz(n),when,d*unit,"bell",.68);
if(trackKey==="race"&&index%4===0)tone(index%8===0?82:64,when,.16,"drum",.9);
if(trackKey==="award"&&index%8===0)tone(55,when,.8,"drum",.4);
}
function schedule(){if(!ctx||paused||!enabled||!unlocked)return;const track=tracks[phase],unit=(60/track.bpm)/2;while(nextAt<ctx.currentTime+.16){playStep(step,nextAt,track);nextAt+=unit;step=(step+1)%track.steps;}}
function startTrack(reset){if(!ctx||!enabled||paused||!unlocked)return;if(reset||trackKey!==phase){trackKey=phase;step=0;nextAt=ctx.currentTime+.04;}if(timer)clearInterval(timer);schedule();timer=setInterval(schedule,45);}
async function unlock(){if(!enabled||!ensureAudio())return;try{if(ctx.state==="suspended")await ctx.resume();unlocked=true;paused=false;startTrack(true);updateButton();}catch(e){}}
function setPhase(next){if(!tracks[next])return;phase=next;if(unlocked&&enabled&&!paused)startTrack(true);updateButton();}
function pause(){paused=true;if(timer){clearInterval(timer);timer=null;}}
function resume(){paused=false;if(unlocked&&enabled)startTrack(true);}
function toggle(){if(!unlocked){enabled=true;unlock();updateButton();return;}enabled=!enabled;if(enabled){paused=false;unlock();}else pause();if(master&&ctx)master.gain.setTargetAtTime(enabled ? .48 : .0001,ctx.currentTime,.12);updateButton();}
function init(){button=document.getElementById("musicToggle");updateButton();if(button)button.addEventListener("click",toggle);
document.addEventListener("pointerdown",event=>{if(event.target&&event.target.closest&&event.target.closest("#musicToggle"))return;if(!unlocked&&enabled)unlock();},{passive:true});
document.addEventListener("keydown",()=>{if(!unlocked&&enabled)unlock();},{once:true});setPhase("setup");}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
window.CultivationMusic={setPhase,pause,resume,unlock,toggle,getPhase:()=>phase};
})();