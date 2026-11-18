"use strict";

(function initTournamentCommentary(){
  const arena=document.querySelector(".arena-frame");
  const canvas=document.getElementById("game");
  const startButton=document.getElementById("start");
  const eventNode=document.getElementById("event");
  const statusNode=document.getElementById("status");
  if(!arena||!canvas||!startButton)return;

  const bubbles=[];
  let chatterTimer=0;
  let frameRequest=0;
  let turn=0;
  let lastEvent="";

  const lines=[
    ["outer",name=>name+" sư huynh! Cố lên! Đệ tử đang dõi theo huynh đây!"],
    ["inner",name=>"Nhanh quá! "+name+" sư huynh sắp vượt thêm một người rồi!"],
    ["servant",name=>"Hay quá! "+name+" sư huynh, giữ vững kiếm thế nhé!"],
    ["disciple",name=>"Phong chúng ta có hy vọng đoạt vị trí cao rồi! Cố lên!"],
    ["core",name=>name+" đạo hữu quả nhiên có bản lĩnh, đường kiếm thật đẹp!"],
    ["outer",name=>"Sư huynh bên trái cố lên! Đừng để mất vị trí!"],
    ["inner",name=>"Đuổi kịp rồi! Chỉ còn một đoạn nữa thôi!"],
    ["servant",name=>"Đệ tử cổ vũ cho tất cả các vị! Bay nhanh lên nào!"],
    ["disciple",name=>name+" sư huynh, phía trước đang có cơ hội! Tăng tốc đi!"],
    ["inner",name=>"Đẹp lắm! Đường kiếm ấy khiến người xem cũng thấy nhiệt huyết!"],
    ["outer",name=>name+" sư huynh! Đệ tử tin huynh làm được!"],
    ["core",name=>"Thân pháp ấy rất có triển vọng. Chư vị xem, lại áp sát rồi!"],
    ["servant",name=>"Cố lên! Cố lên! Khán đài đang cổ vũ cho các vị!"],
    ["disciple",name=>"Đừng chậm lại! Cơ hội đổi thứ hạng ngay trước mắt!"],
    ["inner",name=>name+" đạo hữu, cố giữ nhịp thở và kiếm thế!"],
    ["outer",name=>"Sắp vượt rồi! Mau lên, chỉ còn một chút nữa!"]
  ];

  function racersNow(){
    return typeof racers!=="undefined"&&Array.isArray(racers)?racers:[];
  }

  function anchorFor(type){
    const w=canvas.width||1100,h=canvas.height||900;
    const anchors={
      master:[w*.5,h*.57],elder:[w*.68,h*.65],disciple:[w*.24,h*.59],
      core:[w*.5,h*.68],inner:[w*.38,h*.72],outer:[w*.52,h*.79],servant:[w*.5,h*.87]
    };
    return anchors[type]||anchors.elder;
  }

  function placeBubble(item){
    if(!item.el.isConnected)return;
    const cr=canvas.getBoundingClientRect(),ar=arena.getBoundingClientRect();
    if(!cr.width||!cr.height||!ar.width||!ar.height)return;
    const [x,y]=anchorFor(item.type);
    const zoom=typeof gameZoom!=="undefined"?gameZoom:1;
    const panX=typeof gamePanX!=="undefined"?gamePanX:0;
    const panY=typeof gamePanY!=="undefined"?gamePanY:0;
    const sx=canvas.width*.5+panX+(x-canvas.width*.5)*zoom;
    const sy=canvas.height*.5+panY+(y-canvas.height*.5)*zoom;
    const px=cr.left-ar.left+sx/canvas.width*cr.width;
    const py=cr.top-ar.top+sy/canvas.height*cr.height;
    const half=(item.el.offsetWidth||160)/2;
    const center=Math.max(half+6,Math.min(ar.width-half-6,px));
    item.el.style.left=center+"px";
    item.el.style.top=Math.max(12,Math.min(ar.height-18,py))+"px";
    item.el.style.setProperty("--speech-tail-x",Math.max(12,Math.min((item.el.offsetWidth||160)-12,px-center+half))+"px");
  }

  function followBubbles(){
    bubbles.forEach(placeBubble);
    if(bubbles.length)frameRequest=requestAnimationFrame(followBubbles);
    else frameRequest=0;
  }

  function showBubble(message,type){
    if(!message)return;
    const el=document.createElement("div");
    el.className="tournament-speech-bubble speaker-"+type+" is-visible";
    el.setAttribute("role","status");
    const text=document.createElement("strong");
    text.className="tournament-speech-message";
    text.textContent=String(message);
    el.appendChild(text);
    arena.appendChild(el);
    const item={el,type};
    bubbles.push(item);
    while(bubbles.length>5){
      const old=bubbles.shift();
      old.el.remove();
    }
    placeBubble(item);
    if(!frameRequest)frameRequest=requestAnimationFrame(followBubbles);
    window.setTimeout(()=>{
      el.classList.remove("is-visible");
      el.remove();
      const i=bubbles.indexOf(item);
      if(i>=0)bubbles.splice(i,1);
      if(!bubbles.length&&frameRequest){cancelAnimationFrame(frameRequest);frameRequest=0;}
    },4300);
  }

  function scheduleChatter(){
    if(chatterTimer)return;
    const speak=()=>{
      chatterTimer=0;
      if(typeof finished!=="undefined"&&finished)return;
      const active=typeof running!=="undefined"&&running&&typeof started!=="undefined"&&started&&!(typeof paused!=="undefined"&&paused);
      if(!active){chatterTimer=window.setTimeout(speak,350);return;}
      const list=racersNow();
      const leader=typeof leaderOf==="function"?leaderOf():null;
      const target=turn%4===0&&leader?leader:list.length?list[turn%list.length]:null;
      const name=target&&target.name?String(target.name):"các vị sư huynh";
      const entry=lines[turn++%lines.length];
      showBubble(entry[1](name),entry[0]);
      chatterTimer=window.setTimeout(speak,1150+Math.floor(Math.random()*500));
    };
    chatterTimer=window.setTimeout(speak,500);
  }

  function handleEvent(){
    if(!eventNode)return;
    const value=eventNode.textContent.trim();
    if(!value||value===lastEvent)return;
    lastEvent=value;
    if(value.includes("ĐẠI HỘI BẮT ĐẦU")){
      showBubble("Đại hội Ngự Kiếm chính thức khai cuộc! Chư vị chuẩn bị thưởng thức!","elder");
      scheduleChatter();
    }else if(value.startsWith("HẠNG 1 · ĐANG DẪN ĐẦU:")){
      const name=value.slice("HẠNG 1 · ĐANG DẪN ĐẦU:".length).trim();
      showBubble("Chưởng môn, "+name+" vừa vượt lên rồi! Kiếm thế thật khá!","elder");
      window.setTimeout(()=>showBubble("Ta thấy rồi. "+name+" giữ thân pháp rất vững, không hề rối loạn.","master"),850);
    }else if(value.includes("PHOTO FINISH")){
      showBubble("Chỉ chênh lệch trong gang tấc! Quả là một trận tranh phong kịch liệt!","elder");
    }
  }

  startButton.addEventListener("click",scheduleChatter);
  if(eventNode)new MutationObserver(handleEvent).observe(eventNode,{childList:true,characterData:true,subtree:true});
  if(statusNode)new MutationObserver(()=>{
    if(typeof running!=="undefined"&&running&&typeof started!=="undefined"&&started)scheduleChatter();
    if(typeof finished!=="undefined"&&finished&&chatterTimer){clearTimeout(chatterTimer);chatterTimer=0;}
  }).observe(statusNode,{childList:true,characterData:true,subtree:true});

  const originalDraw=window.drawAnnouncement;
  if(typeof originalDraw==="function"){
    window.drawAnnouncement=function(...args){
      if(bubbles.some(item=>item.el.isConnected&&item.el.classList.contains("is-visible")))return;
      return originalDraw.apply(this,args);
    };
  }

  window.addEventListener("pagehide",()=>{
    if(chatterTimer)clearTimeout(chatterTimer);
    if(frameRequest)cancelAnimationFrame(frameRequest);
    bubbles.forEach(item=>item.el.remove());
    bubbles.length=0;
  });
})();
