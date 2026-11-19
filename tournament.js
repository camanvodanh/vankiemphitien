"use strict";

(function initTournamentCommentary(){
  const arena=document.querySelector(".arena-frame");
  const canvas=document.getElementById("game");
  const startButton=document.getElementById("start");
  const eventNode=document.getElementById("event");
  const statusNode=document.getElementById("status");
  if(!arena||!canvas||!startButton)return;

  const bubbles=[];
  const bubbleQueue=[];
  let chatterTimer=0,frameRequest=0,turn=0,lastEvent="",bubbleSequence=0,stopped=false;
  const MAX_BUBBLES=2,BUBBLE_LIFE=4300;

  function inferGender(name){
    const n=String(name||"").trim().toLowerCase();
    if(!n)return "unknown";
    if(/(nữ|tiên tử|thánh nữ|tiểu thư|cô nương|sư tỷ|chị|cô gái)/.test(n))return "female";
    if(/(nam|sư huynh|công tử|đạo trưởng|thiếu hiệp|kiếm tôn|chân quân|tiên quân|anh)/.test(n))return "male";
    if(/(linh nhi|tử yên|băng tâm|thanh huyền|nhược|mộng|uyển|婉|嫣|瑶|蓉|娜|婷|琳|雪|月|凤|凰|仙|姬|妃|柔|清|霜|梅|兰|菊|荷|萱|馨|静|雅|薇|璃|曦|妍|诗)/i.test(n))return "female";
    if(/(thiên|hạo|minh|long|phong|kiệt|khải|vũ|quân|nguyên|cường|tuấn|đạt|bảo|俊|豪|杰|龙|天|宇|轩|辰|阳|剑|君|枫|峰|海|浩|明|伟|强|勇|文|武)/i.test(n))return "male";
    return "unknown";
  }
  const titleFor=g=>g==="female"?"sư tỷ":g==="male"?"sư huynh":"đạo hữu";
  const addressedName=(name,g,capital=true)=>{const title=titleFor(g);const text=name?name+" "+title:title;return capital?text.charAt(0).toUpperCase()+text.slice(1):text;};
  function seniorAddress(name){
    const clean=String(name||"").trim().replace(/\s+(?:sư huynh|sư tỷ|đạo hữu|tiểu hữu|hậu bối)$/i,"").trim();
    if(!clean)return "chư vị đệ tử";
    const role=clean.match(/^(tạp dịch|ngoại môn|nội môn|nòng cốt|thân truyền)(?:\s+đệ tử)?\s+(.+)$/i);
    if(role)return role[1].toLowerCase()+" đệ tử "+role[2];
    return "đệ tử "+clean;
  }
  // Toàn bộ câu thoại được quản lý trong data/dialogues.json.
  const dialogueData=window.VKP_DATA&&window.VKP_DATA.dialogues;
  const lines=(dialogueData&&Array.isArray(dialogueData.lines)?dialogueData.lines:[]).map(entry=>[
    entry.role,
    (name,call)=>{
      const template=name?entry.text:(entry.fallback||entry.text);
      return String(template||"").replace(/\{call\}/g,call||"").replace(/\{name\}/g,name||"");
    }
  ]);

  // Chống lặp theo cả vai và toàn sân; đồng thời tính cả câu đang chờ trong hàng đợi.
  const recentLinesByRole=Object.create(null);
  const recentDialogueGlobal=[];
  // Lịch sử câu thực sự đã được đưa vào bong bóng, gồm cả thoại sự kiện và thoại tự động.
  const recentShownByRole=Object.create(null);
  const recentShownGlobal=[];
  function rememberShownMessage(role,message){
    const history=recentShownByRole[role]||(recentShownByRole[role]=[]);
    history.push(message);
    recentShownGlobal.push(message);
    if(history.length>18)history.shift();
    if(recentShownGlobal.length>32)recentShownGlobal.shift();
  }
  function chooseDialogue(role,name,call){
    const pool=lines.filter(line=>line[0]===role);
    if(!pool.length)return null;
    const recent=recentLinesByRole[role]||(recentLinesByRole[role]=[]);
    const evaluated=pool.map(line=>String(line[1](name,call))).filter(Boolean);
    let candidates=evaluated.filter(text=>!recent.includes(text)&&!recentDialogueGlobal.includes(text));
    if(!candidates.length)candidates=evaluated.filter(text=>!recent.includes(text));
    if(!candidates.length)candidates=evaluated;
    const chosen=candidates[Math.floor(Math.random()*candidates.length)];
    recent.push(chosen);
    recentDialogueGlobal.push(chosen);
    if(recent.length>18)recent.shift();
    if(recentDialogueGlobal.length>32)recentDialogueGlobal.shift();
    return chosen;
  }

  function racersNow(){
    return typeof racers!=="undefined"&&Array.isArray(racers)?racers:[];
  }

  const speakerAnchors={
    // Hai vị trí hàng đầu dùng bong bóng nằm dưới điểm neo; đuôi hướng ngược lên
    // để chỉ đúng người đang thoại mà không phủ lên nhân vật thi đấu.
    master:{x:550,y:560,side:1,below:true},elder:{x:867,y:620,side:-1,below:true},disciple:{x:263,y:600,side:1,below:true},core:{x:550,y:765,side:-1},inner:{x:380,y:775,side:1},outer:{x:550,y:795,side:-1},servant:{x:550,y:845,side:1},
    racer:{x:550,y:720,side:1}
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
    const width=item.el.offsetWidth||120,height=item.el.offsetHeight||34;
    // Khóa vị trí tương đối sau lần bố trí đầu tiên. Khi camera zoom/pan,
    // bong bóng vẫn bám theo điểm neo nhưng không nhảy chỗ khi bong bóng khác biến mất.
    if(item.layout){
      const left=Math.max(width/2+5,Math.min(ar.width-width/2-5,px+item.layout.dx));
      const top=item.layout.below
        ?Math.max(8,Math.min(ar.height-height-8,py+item.layout.dy))
        :Math.max(height+8,Math.min(ar.height-8,py+item.layout.dy));
      item.el.classList.toggle("is-below",item.layout.below);
      item.el.style.left=left+"px";
      item.el.style.top=top+"px";
      item.el.style.setProperty("--speech-tail-x",Math.max(10,Math.min(width-10,px-left+width/2))+"px");
      return;
    }
    const side=anchor.side||1,offset=Math.min(16,width*.09)*side;
    // Chọn vị trí trái/giữa/phải và thử cả hai hướng đuôi để luôn chỉ về người nói.
    // Các bong bóng đã được sắp theo thứ tự xuất hiện nên vị trí của chúng ổn định trong mỗi khung hình.
    const xSlots=[.16,.84,.34,.66,.50,.24,.76];
    const protectedSpeaker=item.type==="master"||item.type==="elder";
    const yLevels=protectedSpeaker?[0,1]:[0,-1,1];
    const preferredX=px*.34+ar.width*.66;
    const others=bubbles.filter(other=>other!==item&&other.el.isConnected&&other.el.style.left&&other.el.style.top);
    let best=null;
    const directions=protectedSpeaker?[true]:[!!anchor.below,!anchor.below];
    for(const below of directions){
      const baseY=below?py+8:py-10;
      for(const slot of xSlots){
        const center=preferredX*.38+(ar.width*slot)*.62+offset;
        const left=Math.max(width/2+5,Math.min(ar.width-width/2-5,center));
        for(const level of yLevels){
          const top=below
            ?Math.max(8,Math.min(ar.height-height-8,baseY+level*(height+7)))
            :Math.max(height+8,Math.min(ar.height-8,baseY+level*(height+7)));
          const visualTop=below?top+8:top-height;
          const rect={left:left-width/2,right:left+width/2,top:visualTop,bottom:visualTop+height};
          let overlap=0;
          for(const other of others){
            const ow=other.el.offsetWidth||120,oh=other.el.offsetHeight||34;
            const ol=parseFloat(other.el.style.left)||0,ot=parseFloat(other.el.style.top)||0;
            const obelow=other.el.classList.contains("is-below");
            const oy=obelow?ot+8:ot-oh;
            const ix=Math.max(0,Math.min(rect.right,ol+ow/2)-Math.max(rect.left,ol-ow/2));
            const iy=Math.max(0,Math.min(rect.bottom,oy+oh)-Math.max(rect.top,oy));
            overlap+=ix*iy;
          }
          const displacement=Math.abs(left-px)*.12+Math.abs(top-baseY)*.42+(below===!!anchor.below?0:18);
          const score=overlap*30+displacement;
          if(!best||score<best.score)best={score,left,top,below};
        }
      }
    }
    const left=best?best.left:Math.max(width/2+5,Math.min(ar.width-width/2-5,preferredX+offset));
    const bubbleY=best?best.top:Math.max(8,Math.min(ar.height-8,py));
    item.layout={dx:left-px,dy:bubbleY-py,below:best?best.below:!!anchor.below};
    item.el.classList.toggle("is-below",item.layout.below);
    item.el.style.left=left+"px";
    item.el.style.top=bubbleY+"px";
    item.el.style.setProperty("--speech-tail-x",Math.max(10,Math.min(width-10,px-left+width/2))+"px");
  }
  function followBubbles(){
    // Đặt bong bóng cũ trước, bong bóng mới tìm vị trí còn trống quanh chúng.
    bubbles.slice().sort((a,b)=>a.sequence-b.sequence).forEach(positionBubble);
    if(bubbles.length)frameRequest=requestAnimationFrame(followBubbles);
    else frameRequest=0;
  }

  function createBubble(message,type){
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
    const item={el,type,message:String(message),sequence:seq,timer:0};
    bubbles.push(item);
    positionBubble(item);
    if(!frameRequest)frameRequest=requestAnimationFrame(followBubbles);
    item.timer=window.setTimeout(()=>removeBubble(item),BUBBLE_LIFE);
  }
  function flushBubbleQueue(){
    if(stopped||isFinished()){bubbleQueue.length=0;return;}
    while(bubbles.length<MAX_BUBBLES&&bubbleQueue.length){
      const index=bubbleQueue.findIndex(entry=>!bubbles.some(item=>item.type===entry.type));
      if(index<0)return;
      const next=bubbleQueue.splice(index,1)[0];
      createBubble(next.message,next.type);
    }
  }
  function removeBubble(item){
    if(item.timer)clearTimeout(item.timer);
    item.el.remove();
    const i=bubbles.indexOf(item);
    if(i>=0)bubbles.splice(i,1);
    flushBubbleQueue();
  }
  function clearBubbles(){
    bubbleQueue.length=0;
    bubbles.slice().forEach(item=>{if(item.timer)clearTimeout(item.timer);item.el.remove();});
    bubbles.length=0;
    if(frameRequest){cancelAnimationFrame(frameRequest);frameRequest=0;}
  }
  function stopChatter(){stopped=true;if(chatterTimer){clearTimeout(chatterTimer);chatterTimer=0;}clearBubbles();}
  function showBubble(message,type){
    if(!message||stopped||isFinished())return;
    const normalized=String(message).trim();
    const shownForRole=recentShownByRole[type]||[];
    // Chặn cả câu sự kiện lẫn câu tự động nếu vừa được phát gần đây.
    if(shownForRole.includes(normalized)||recentShownGlobal.includes(normalized))return;
    if(bubbles.some(item=>item.type===type&&item.message===normalized)||
       bubbleQueue.some(entry=>entry.type===type&&entry.message===normalized))return;
    if(bubbles.length>=MAX_BUBBLES||bubbles.some(item=>item.type===type)){
      if(bubbleQueue.length<12){
        bubbleQueue.push({message:normalized,type});
        rememberShownMessage(type,normalized);
      }
      return;
    }
    rememberShownMessage(type,normalized);
    createBubble(normalized,type);
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
      const gender=inferGender(name);
      const call=addressedName(name,gender,true);
      const elderCall=seniorAddress(name);
      // Luân phiên có trọng số để Trưởng lão và Chân truyền đệ tử thường xuyên tham gia bình luận.
      // Chưởng môn không nằm trong vòng cổ vũ tự phát; chỉ đáp lời khi có đối thoại sự kiện.
      const speakerCycle=["servant","outer","inner","core","disciple","disciple","elder","outer","servant","inner","core","disciple"];
      const speaker=speakerCycle[turn%speakerCycle.length];
      // Chờ chỗ trống và không để cùng một vai có hai bong bóng cùng lúc.
      if(bubbles.length>=MAX_BUBBLES||bubbles.some(item=>item.type===speaker)){
        chatterTimer=window.setTimeout(speak,850);
        return;
      }
      const cycleIndex=turn++;
      const message=chooseDialogue(speaker,name,speaker==="elder"?elderCall:call);
      if(message)showBubble(message,speaker);
      if(!stopped&&!isFinished())chatterTimer=window.setTimeout(speak,2100+Math.floor(Math.random()*900));
    };
    chatterTimer=window.setTimeout(speak,500);
  }

  let leaderEventCount=0;
  function eventStillCurrent(value){return !stopped&&!isFinished()&&lastEvent===value;}
  function handleEvent(){
    if(!eventNode||stopped||isFinished())return;
    const value=eventNode.textContent.trim();
    if(!value||value===lastEvent)return;
    lastEvent=value;
    if(value.includes("ĐẠI HỘI BẮT ĐẦU")){
      showBubble("Đại hội Ngự Kiếm chính thức khai cuộc! Chư vị chuẩn bị thưởng thức!","disciple");
      scheduleChatter();
    }else if(value.startsWith("HẠNG 1 · ĐANG DẪN ĐẦU:")){
      const name=value.slice("HẠNG 1 · ĐANG DẪN ĐẦU:".length).trim();
      const call=seniorAddress(name);
      leaderEventCount++;
      const firstRole=["disciple","core","inner","outer","servant"][(leaderEventCount-1)%5];
      const firstLine=chooseDialogue(firstRole,name,addressedName(name,inferGender(name),true));
      if(firstLine)showBubble(firstLine,firstRole);
      window.setTimeout(()=>{
        if(!eventStillCurrent(value))return;
        const elderLine=chooseDialogue("elder",name,call);
        if(elderLine)showBubble(elderLine,"elder");
      },1900);
      if(leaderEventCount%3===0){
        window.setTimeout(()=>{
          if(!eventStillCurrent(value))return;
          const masterLine=chooseDialogue("master",name,call);
          if(masterLine)showBubble("Ta thấy rồi, "+call+"! "+masterLine,"master");
        },3900);
      }
    }else if(value.includes("PHOTO FINISH")){
      const line=chooseDialogue("disciple","","chư vị");
      showBubble(line||"Chỉ chênh lệch trong gang tấc! Quả là một trận tranh phong kịch liệt!","disciple");
      window.setTimeout(()=>{
        if(!eventStillCurrent(value))return;
        const elderLine=chooseDialogue("elder","","chư vị đệ tử");
        if(elderLine)showBubble(elderLine,"elder");
      },2000);
    }
  }
  startButton.addEventListener("click",()=>{
    // Listener của bộ điều khiển đua chạy trước; nếu nút vừa khởi động vòng đua mới,
    // mở lại lời bình ngay cả khi vòng trước đã kết thúc và đặt stopped=true.
    if(typeof running!=="undefined"&&running&&!isFinished())stopped=false;
    scheduleChatter();
  });
  if(eventNode)new MutationObserver(handleEvent).observe(eventNode,{childList:true,characterData:true,subtree:true});
  if(statusNode)new MutationObserver(()=>{
    if(isFinished()){stopChatter();return;}
    const statusText=statusNode.textContent.trim();
    // Mỗi lần triệu hồi hoặc bắt đầu đếm ngược đều là một vòng đời mới của lời bình.
    if(statusText.includes("Đã triệu hồi")||statusText.startsWith("Bắt đầu sau")||statusText.includes("Toàn bộ tiên nhân đã hiện thân"))stopped=false;
    if(typeof running!=="undefined"&&running&&typeof paused!=="undefined"&&!paused)scheduleChatter();
  }).observe(statusNode,{childList:true,characterData:true,subtree:true});

  const originalDraw=window.drawAnnouncement;
  if(typeof originalDraw==="function"){
    window.drawAnnouncement=function(...args){
      if(bubbles.some(item=>item.el.isConnected&&item.el.classList.contains("is-visible")))return;
      return originalDraw.apply(this,args);
    };
  }

  window.addEventListener("pagehide",stopChatter);
})();
