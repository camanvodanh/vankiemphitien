"use strict";

(function initTournamentCommentary(){
  const arena=document.querySelector(".arena-frame");
  const canvas=document.getElementById("game");
  const startButton=document.getElementById("start");
  const eventNode=document.getElementById("event");
  const statusNode=document.getElementById("status");
  if(!arena||!canvas||!startButton)return;

  const bubbles=[];
  let chatterTimer=0,frameRequest=0,turn=0,lastEvent="",bubbleSequence=0,stopped=false;
  const MAX_BUBBLES=6,BUBBLE_LIFE=4300;

  function inferGender(name){
    const n=String(name||"").trim().toLowerCase();
    if(!n)return "unknown";
    if(/(nữ|tiên tử|thánh nữ|tiểu thư|cô nương|sư tỷ|chị|cô gái)/.test(n))return "female";
    if(/(nam|sư huynh|công tử|đạo trưởng|thiếu hiệp|kiếm tôn|chân quân|tiên quân|anh)/.test(n))return "male";
    if(/(linh nhi|tử yên|băng tâm|thanh huyền|nhược|mộng|uyển|婉|嫣|瑶|蓉|娜|婷|琳|雪|月|凤|凰|仙|姬|妃|柔|清|霜|梅|兰|菊|荷|萱|馨|静|雅|薇|璃|曦|妍|诗)/i.test(n))return "female";
    if(/(thiên|hạo|minh|long|phong|kiệt|khải|vũ|quân|nguyên|cường|tuấn|đạt|bảo|俊|豪|杰|龙|天|宇|轩|辰|阳|剑|君|枫|峰|海|浩|明|伟|强|勇|文|武)/i.test(n))return "male";
    return "unknown";
  }
  const honorific=g=>g==="female"?"sư tỷ":g==="male"?"sư huynh":"đạo hữu";
  const lines=[
    ["outer",(n,h)=>n?h+"! Cố lên! Đệ tử đang dõi theo!":"Chư vị cố lên! Đệ tử đang dõi theo!"],
    ["inner",(n,h)=>n?n+" "+h+" sắp vượt thêm một người rồi!":"Nhanh quá, sắp vượt thêm một người rồi!"],
    ["servant",(n,h)=>n?"Hay quá, "+h+"! Giữ vững kiếm thế nhé!":"Hay quá! Giữ vững kiếm thế nhé!"],
    ["disciple",(n,h)=>n?h+" có hy vọng đoạt vị trí cao rồi!":"Phong chúng ta có hy vọng đoạt vị trí cao rồi!"],
    ["core",(n,h)=>n?n+" quả nhiên có bản lĩnh, đường kiếm thật đẹp!":"Đạo hữu quả nhiên có bản lĩnh, đường kiếm thật đẹp!"],
    ["outer",(n,h)=>n?h+"! Đệ tử tin "+(h==="sư huynh"?"huynh":h==="sư tỷ"?"tỷ":"đạo hữu")+" làm được!":"Đừng để mất vị trí! Cố lên!"],
    ["inner",()=> "Đuổi kịp rồi! Chỉ còn một đoạn nữa thôi!"],
    ["servant",()=> "Đệ tử cổ vũ cho tất cả các vị! Bay nhanh lên nào!"],
    ["disciple",(n,h)=>n?h+", phía trước đang có cơ hội! Tăng tốc đi!":"Phía trước đang có cơ hội! Tăng tốc đi!"],
    ["inner",()=> "Đẹp lắm! Đường kiếm ấy khiến người xem cũng thấy nhiệt huyết!"],
    ["outer",()=> "Sắp vượt rồi! Mau lên, chỉ còn một chút nữa!"],
    ["core",()=> "Thân pháp ấy rất có triển vọng. Lại áp sát rồi!"],
    ["servant",()=> "Cố lên! Khán đài đang cổ vũ cho các vị!"],
    ["disciple",()=> "Đừng chậm lại! Cơ hội đổi thứ hạng ngay trước mắt!"],
    ["inner",(n,h)=>n?h+", cố giữ nhịp thở và kiếm thế!":"Đạo hữu, cố giữ nhịp thở và kiếm thế!"],
    ["outer",()=> "Kiếm quang thật đẹp! Tranh phong càng lúc càng kịch liệt!"]
  ];

  function racersNow(){
    return typeof racers!=="undefined"&&Array.isArray(racers)?racers:[];
  }

  const speakerAnchors={
    master:{x:550,y:690,side:1},elder:{x:867,y:680,side:-1},disciple:{x:263,y:675,side:1},core:{x:550,y:710,side:-1},inner:{x:380,y:730,side:1},outer:{x:550,y:785,side:-1},servant:{x:550,y:845,side:1},
    racer:{x:550,y:642,side:1}
  };

  function isFinished(){return typeof finished!=="undefined"&&finished;}
  function positionBubble(item){
    if(!item.el.isConnected)return;
    const cr=canvas.getBoundingClientRect(),ar=arena.getBoundingClientRect();
    if(!cr.width||!cr.height||!ar.width||!ar.height)return;
    const anchor=speakerAnchors[item.type]||speakerAnchors.outer;
    const zoom=typeof gameZoom!=="undefined"?gameZoom:1;
    const panX=typeof gamePanX!=="undefined"?gamePanX:0;
    const panY=typeof gamePanY!=="undefined"?gamePanY:0;
    const sx=canvas.width*.5+panX+(anchor.x-canvas.width*.5)*zoom;
    const sy=canvas.height*.5+panY+(anchor.y-canvas.height*.5)*zoom;
    const px=cr.left-ar.left+sx/canvas.width*cr.width;
    const py=cr.top-ar.top+sy/canvas.height*cr.height;
    const width=item.el.offsetWidth||120;
    const height=item.el.offsetHeight||34;
    const side=anchor.side||1;
    const offset=Math.min(22,width*.13)*side;
    const drift=(item.sequence%3-1)*Math.min(34,width*.13);
    const left=Math.max(width/2+5,Math.min(ar.width-width/2-5,px+offset+drift));
    item.el.style.left=left+"px";
    item.el.style.top=(py-12-(Math.floor(item.sequence/3)%2)*15)+"px";
    item.el.style.setProperty("--speech-tail-x",Math.max(10,Math.min(width-10,px-left+width/2))+"px");
  }

  function followBubbles(){
    bubbles.forEach(positionBubble);
    if(bubbles.length)frameRequest=requestAnimationFrame(followBubbles);
    else frameRequest=0;
  }

  function removeBubble(item){if(item.timer)clearTimeout(item.timer);item.el.remove();const i=bubbles.indexOf(item);if(i>=0)bubbles.splice(i,1);}
  function clearBubbles(){bubbles.slice().forEach(removeBubble);if(frameRequest){cancelAnimationFrame(frameRequest);frameRequest=0;}}
  function stopChatter(){stopped=true;if(chatterTimer){clearTimeout(chatterTimer);chatterTimer=0;}clearBubbles();}
  function showBubble(message,type){
    if(!message||stopped||isFinished())return;
    while(bubbles.length>=MAX_BUBBLES)removeBubble(bubbles[0]);
    const seq=++bubbleSequence;
    const el=document.createElement("div");
    el.className="tournament-speech-bubble speaker-"+type+" is-visible";
    el.setAttribute("role","status");
    el.setAttribute("aria-label",String(message));
    const text=document.createElement("strong");
    text.className="tournament-speech-message";
    text.textContent=String(message);
    el.appendChild(text);
    el.style.zIndex=String(1150+seq);
    arena.appendChild(el);
    const item={el,type,sequence:seq,timer:0};
    bubbles.push(item);
    positionBubble(item);
    if(!frameRequest)frameRequest=requestAnimationFrame(followBubbles);
    item.timer=window.setTimeout(()=>removeBubble(item),BUBBLE_LIFE);
  }

  function scheduleChatter(){
    if(chatterTimer)return;
    const speak=()=>{
      chatterTimer=0;
      if(stopped||isFinished())return;
      const active=typeof running!=="undefined"&&running&&typeof started!=="undefined"&&started&&!(typeof paused!=="undefined"&&paused);
      if(!active){chatterTimer=window.setTimeout(speak,350);return;}
      const list=racersNow();
      const leader=typeof leaderOf==="function"?leaderOf():null;
      const target=turn%4===0&&leader?leader:list.length?list[turn%list.length]:null;
      const name=target&&target.name?String(target.name).trim():"";
      const call=honorific(inferGender(name));
      const entry=lines[turn++%lines.length];
      showBubble(entry[1](name,call),entry[0]);
      if(!stopped&&!isFinished())chatterTimer=window.setTimeout(speak,1250+Math.floor(Math.random()*450));
    };
    chatterTimer=window.setTimeout(speak,500);
  }

  function handleEvent(){
    if(!eventNode||stopped||isFinished())return;
    const value=eventNode.textContent.trim();
    if(!value||value===lastEvent)return;
    lastEvent=value;
    if(value.includes("ĐẠI HỘI BẮT ĐẦU")){
      showBubble("Đại hội Ngự Kiếm chính thức khai cuộc! Chư vị chuẩn bị thưởng thức!","elder");
      scheduleChatter();
    }else if(value.startsWith("HẠNG 1 · ĐANG DẪN ĐẦU:")){
      const name=value.slice("HẠNG 1 · ĐANG DẪN ĐẦU:".length).trim();
      showBubble("Chưởng môn, "+name+" vừa vượt lên rồi! Kiếm thế thật khá!","elder");
      window.setTimeout(()=>{if(!isFinished()&&!stopped)showBubble("Ta thấy rồi. "+name+" giữ thân pháp rất vững, không hề rối loạn.","master");},850);
    }else if(value.includes("PHOTO FINISH")){
      showBubble("Chỉ chênh lệch trong gang tấc! Quả là một trận tranh phong kịch liệt!","elder");
    }
  }

  startButton.addEventListener("click",scheduleChatter);
  if(eventNode)new MutationObserver(handleEvent).observe(eventNode,{childList:true,characterData:true,subtree:true});
  if(statusNode)new MutationObserver(()=>{if(isFinished())stopChatter();else if(statusNode.textContent.includes("Đã triệu hồi"))stopped=false;else if(typeof running!=="undefined"&&running&&typeof started!=="undefined"&&started&&!(typeof paused!=="undefined"&&paused))scheduleChatter();}).observe(statusNode,{childList:true,characterData:true,subtree:true});

  const originalDraw=window.drawAnnouncement;
  if(typeof originalDraw==="function"){
    window.drawAnnouncement=function(...args){
      if(bubbles.some(item=>item.el.isConnected&&item.el.classList.contains("is-visible")))return;
      return originalDraw.apply(this,args);
    };
  }

  window.addEventListener("pagehide",stopChatter);
})();
