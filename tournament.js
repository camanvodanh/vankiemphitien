"use strict";

(function initSectTournament(){
  const config=window.VKP_DATA&&window.VKP_DATA.ceremony&&window.VKP_DATA.ceremony.opening
    ?window.VKP_DATA.ceremony.opening:{};
  const stageDurations=Array.isArray(config.stageDurationsMs)&&config.stageDurationsMs.length
    ?config.stageDurationsMs.map(value=>Math.max(800,Number(value)||2200))
    :[2200,2500,2800];
  const featuredNames=Math.max(1,Math.min(10,Number(config.featuredNames)||6));
  const commentaryDuration=Math.max(1500,Number(config.commentaryDurationMs)||3400);
  const arena=document.querySelector(".arena-frame");
  const startButton=document.getElementById("start");
  const eventNode=document.getElementById("event");
  const statusNode=document.getElementById("status");
  const rankBody=document.getElementById("rankBody");
  if(!arena||!startButton)return;

  const slides=[
    {
      kicker:"NGHI THỨC KHAI MẠC",
      title:"ĐẠI HỘI TÔNG MÔN",
      subtitle:"VẠN KIẾM TỀ TỤ · TIÊN ĐẠO TRANH PHONG",
      body:"Vạn Kiếm Tiên Môn nghênh đón chư phong tề tụ, cùng chứng kiến đại hội ngự kiếm."
    },
    {
      kicker:"CHƯ PHONG HỘI TỤ",
      title:"TIÊN NHÂN ĐÃ TỀ TỰU",
      subtitle:"ĐẠI DIỆN CÁC MẠCH CÙNG TRANH PHONG",
      body:"Đệ tử các mạch đã tề tựu tại Vạn Kiếm Đài. Thiên Lý Kính và Tiên Bảng chuẩn bị ghi danh từng vị."
    },
    {
      kicker:"CHƯỞNG MÔN TUYÊN LỆNH",
      title:"KIẾM HỘI KHAI PHONG",
      subtitle:"VẠN KIẾM ĐÃ SẴN SÀNG",
      body:"Nghi thức hoàn tất. Chờ hiệu lệnh khai chiến, tranh đoạt tiên duyên và vinh danh tam giáp."
    }
  ];

  let opening=null;
  let liveBar=null;
  let liveMessage=null;
  let liveSpeaker={type:"elder"};
  let livePositionFrame=0;
  let stageTimer=0;
  let liveTimer=0;
  let active=false;
  let bypassStart=false;
  let lastEvent="";
  let lastStatus="";
  let closingShown=false;
  let commentaryTurn=0;
  let exchangeTimer=0;

  function getRacers(){
    return typeof racers!=="undefined"&&Array.isArray(racers)?racers:[];
  }

  function buildOpening(){
    if(opening)return opening;
    opening=document.createElement("section");
    opening.className="tournament-curtain";
    opening.setAttribute("role","dialog");
    opening.setAttribute("aria-modal","true");
    opening.setAttribute("aria-labelledby","tournamentOpeningTitle");
    opening.innerHTML=`
      <div class="tournament-card">
        <div class="tournament-sigil" aria-hidden="true">劍</div>
        <div class="tournament-ornament" aria-hidden="true"></div>
        <div class="tournament-copy">
          <p class="tournament-kicker"></p>
          <h2 id="tournamentOpeningTitle" class="tournament-title"></h2>
          <p class="tournament-subtitle"></p>
          <p class="tournament-description"></p>
        </div>
        <div class="tournament-stats">
          <div><small>TIÊN NHÂN THAM DỰ</small><strong data-stat="count">0</strong></div>
          <div><small>THỜI LƯỢNG</small><strong data-stat="duration">60s</strong></div>
          <div><small>VỊ TRÍ VINH DANH</small><strong>TOP 3</strong></div>
        </div>
        <div class="tournament-roster-wrap">
          <p class="tournament-roster-heading">ĐẠI DIỆN TIÊN MÔN</p>
          <div class="tournament-roster"></div>
        </div>
        <div class="tournament-progress" aria-hidden="true"></div>
        <button class="tournament-action" type="button">Khai chiến ngay <span aria-hidden="true">↗</span></button>
        <p class="tournament-hint">Nghi thức tự chuyển sang khai chiến · Chạm nút để bắt đầu ngay</p>
      </div>`;
    opening.querySelector(".tournament-action").addEventListener("click",launchRace);
    arena.appendChild(opening);
    return opening;
  }

  function buildLiveBar(){
    if(liveBar)return;
    liveBar=document.createElement("div");
    liveBar.className="tournament-speech-bubble";
    liveBar.setAttribute("aria-live","polite");
    liveBar.setAttribute("aria-atomic","true");
    liveBar.innerHTML='<strong class="tournament-speech-message"></strong>';
    arena.appendChild(liveBar);
    liveMessage=liveBar.querySelector(".tournament-speech-message");
  }

  function getRacerByName(name){
    const wanted=String(name||"").trim();
    if(!wanted)return null;
    return getRacers().find(racer=>String(racer.name||"").trim()===wanted)||null;
  }

  function getSpeakerAnchor(){
    const canvas=document.getElementById("game");
    const width=canvas?canvas.width:1100;
    const height=canvas?canvas.height:900;
    const speaker=liveSpeaker||{type:"elder"};

    if(speaker.type==="racer"&&speaker.racer){
      const list=getRacers();
      const racer=list.find(item=>item===speaker.racer||(speaker.racer.id!=null&&item.id===speaker.racer.id))||null;
      if(racer){
        if(typeof finished!=="undefined"&&finished&&typeof sortedRacers==="function"){
          const ordered=sortedRacers();
          const rank=ordered.indexOf(racer)+1;
          const count=Math.min(3,ordered.length);
          const podiumX=count===1?[width*.5]:count===2?[width*.25,width*.5]:[width*.25,width*.5,width*.75];
          const rankAt=count===1?[1]:count===2?[2,1]:[2,1,3];
          const podiumIndex=rankAt.indexOf(rank);
          const topByRank={1:height*.535,2:height*.655,3:height*.715};
          if(podiumIndex>=0){
            const riderY=topByRank[rank]-57;
            return {x:podiumX[podiumIndex],y:riderY-78};
          }
          // Người ngoài tam giáp không còn xuất hiện ở cảnh trao thưởng; trưởng lão tiếp lời thay.
          return {x:744,y:587};
        }
        if(typeof racerX==="function"&&typeof laneY==="function"){
          const index=list.indexOf(racer);
          const scale=typeof racerScale==="function"?racerScale():1;
          return {x:racerX(racer),y:laneY(index)-Math.max(34,scale*42)};
        }
      }
    }

    if(speaker.type==="master"){
      if(typeof finished!=="undefined"&&finished&&typeof ceremonyStartedAt!=="undefined"&&ceremonyStartedAt>0){
        const elapsed=Math.max(0,(performance.now()-ceremonyStartedAt)/1000);
        const departure=window.VKP_DATA&&window.VKP_DATA.ceremony&&window.VKP_DATA.ceremony.departure
          ?window.VKP_DATA.ceremony.departure:{};
        const swordEnd=Number(departure.swordArrivalEnd)||4.55;
        const flyEnd=Number(departure.flightEnd)||7.15;
        const transitionEnd=Number(departure.transitionEnd)||7.7;
        const smooth=value=>{const p=Math.max(0,Math.min(1,value));return p*p*(3-2*p);};
        if(elapsed<transitionEnd){
          if(elapsed<swordEnd)return {x:width*.5,y:518};
          const p=smooth((elapsed-swordEnd)/Math.max(.01,flyEnd-swordEnd));
          return {
            x:width*(.5+.82*p),
            y:height*(612/825)-height*(.055+.31*p)+42
          };
        }
        const awards=window.VKP_DATA&&window.VKP_DATA.ceremony&&window.VKP_DATA.ceremony.awards
          ?window.VKP_DATA.ceremony.awards:{};
        const awardStart=Number(awards.awardStart)||8.05;
        const flightDuration=Number(awards.masterFlightDuration)||3.9;
        const p=Math.max(0,Math.min(1,(elapsed-awardStart)/Math.max(.01,flightDuration)));
        return {
          x:width*(-.16+1.32*p),
          y:height*(.205+Math.sin(p*Math.PI*2)*.012)+45
        };
      }
      return {x:width*.5,y:518};
    }

    // Mặc định trưởng lão thứ ba từ trái sang: nằm rõ trong vùng quảng trường,
    // tránh nhãn chức danh TRƯỞNG LÃO ở phía bên phải.
    if(speaker.type==="elder")return {x:744,y:587};
    if(speaker.type==="disciple")return {x:263,y:535};
    if(speaker.type==="core")return {x:550,y:615};
    if(speaker.type==="inner")return {x:420,y:650};
    if(speaker.type==="outer")return {x:550,y:705};
    if(speaker.type==="servant")return {x:550,y:785};
    return {x:744,y:558};
  }

  function positionLiveBubble(){
    if(!liveBar||!liveBar.classList.contains("is-visible"))return;
    const canvas=document.getElementById("game");
    if(!canvas)return;
    const canvasRect=canvas.getBoundingClientRect();
    const arenaRect=arena.getBoundingClientRect();
    if(!canvasRect.width||!canvasRect.height||!arenaRect.width||!arenaRect.height)return;

    const width=canvas.width||1100,height=canvas.height||900;
    const anchor=getSpeakerAnchor();
    const zoom=typeof gameZoom!=="undefined"?gameZoom:1;
    const panX=typeof gamePanX!=="undefined"?gamePanX:0;
    const panY=typeof gamePanY!=="undefined"?gamePanY:0;
    const screenX=width*.5+panX+(anchor.x-width*.5)*zoom;
    const screenY=height*.5+panY+(anchor.y-height*.5)*zoom;
    const anchorLeft=canvasRect.left-arenaRect.left+(screenX/width)*canvasRect.width;
    const top=canvasRect.top-arenaRect.top+(screenY/height)*canvasRect.height;
    const halfWidth=(liveBar.offsetWidth||196)/2;
    const bubbleCenter=Math.max(halfWidth+8,Math.min(arenaRect.width-halfWidth-8,anchorLeft));
    const tailX=Math.max(12,Math.min((liveBar.offsetWidth||280)-12,anchorLeft-bubbleCenter+halfWidth));
    const bubbleHeight=liveBar.offsetHeight||42;
    const isBelow=top<bubbleHeight+18;
    liveBar.classList.toggle("is-below",isBelow);
    liveBar.style.left=bubbleCenter+"px";
    liveBar.style.setProperty("--speech-tail-x",tailX+"px");
    liveBar.style.top=Math.max(10,Math.min(arenaRect.height-18,top))+"px";
  }

  function followLiveBubble(){
    if(!liveBar||!liveBar.classList.contains("is-visible")){
      livePositionFrame=0;
      return;
    }
    positionLiveBubble();
    livePositionFrame=requestAnimationFrame(followLiveBubble);
  }

  function stopLiveFollowing(){
    if(livePositionFrame){
      cancelAnimationFrame(livePositionFrame);
      livePositionFrame=0;
    }
  }

  function renderStage(){
    if(!opening)return;
    const slide=slides[stage];
    opening.dataset.stage=String(stage);
    opening.querySelector(".tournament-kicker").textContent=slide.kicker;
    opening.querySelector(".tournament-title").textContent=slide.title;
    opening.querySelector(".tournament-subtitle").textContent=slide.subtitle;
    opening.querySelector(".tournament-description").textContent=slide.body;
    opening.querySelector('[data-stat="count"]').textContent=String(getRacers().length);
    const seconds=Math.max(1,Math.round((Number(document.getElementById("speed")?.value)||60)));
    opening.querySelector('[data-stat="duration"]').textContent=seconds+"s";

    const roster=opening.querySelector(".tournament-roster");
    const rosterWrap=opening.querySelector(".tournament-roster-wrap");
    roster.replaceChildren();
    const list=getRacers();
    list.slice(0,featuredNames).forEach((racer,index)=>{
      const name=document.createElement("span");
      name.className="tournament-roster-name";
      name.textContent=(index+1)+". "+String(racer.name||("Tiên nhân "+(index+1)));
      roster.appendChild(name);
    });
    if(list.length>featuredNames){
      const more=document.createElement("span");
      more.className="tournament-roster-more";
      more.textContent="+"+(list.length-featuredNames)+" vị tiên hữu khác";
      roster.appendChild(more);
    }
    rosterWrap.hidden=stage===0;

    const progress=opening.querySelector(".tournament-progress");
    if(!progress.childElementCount){
      stageDurations.forEach(()=>progress.appendChild(document.createElement("span")));
    }
    Array.from(progress.children).forEach((item,index)=>{
      item.classList.toggle("is-complete",index<stage);
      item.classList.toggle("is-current",index===stage);
    });
    const action=opening.querySelector(".tournament-action");
    action.innerHTML='Khai chiến ngay <span aria-hidden="true">↗</span>';
  }

  function clearStageTimer(){
    if(stageTimer){clearTimeout(stageTimer);stageTimer=0;}
  }

  function closeOpening(){
    clearStageTimer();
    active=false;
    if(opening){
      opening.remove();
      opening=null;
    }
  }

  function launchRace(){
    if(!active||startButton.disabled)return;
    closeOpening();
    bypassStart=true;
    startButton.click();
    if(bypassStart)bypassStart=false;
  }

  function scheduleStage(){
    clearStageTimer();
    if(!active)return;
    const delay=stageDurations[stage]||stageDurations[stageDurations.length-1]||2400;
    stageTimer=window.setTimeout(()=>{
      stageTimer=0;
      if(!active)return;
      if(stage<slides.length-1){
        stage++;
        renderStage();
        scheduleStage();
      }else{
        launchRace();
      }
    },delay);
  }

  function beginOpening(){
    if(active)return;
    active=true;
    stage=0;
    buildOpening();
    renderStage();
    opening.classList.remove("is-hidden");
    scheduleStage();
    const action=opening.querySelector(".tournament-action");
    if(action)action.focus({preventScroll:true});
  }

  function onStartCapture(event){
    if(bypassStart){bypassStart=false;return;}
    if(active){
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    if(running||paused||!getRacers().length)return;
    if(typeof summonVisualReady!=="undefined"&&!summonVisualReady)return;
    event.preventDefault();
    event.stopImmediatePropagation();
    beginOpening();
  }

  function showLive(message,speaker={type:"elder"}){
    if(active)return;
    buildLiveBar();
    if(liveTimer){clearTimeout(liveTimer);liveTimer=0;}
    if(exchangeTimer){clearTimeout(exchangeTimer);exchangeTimer=0;}
    stopLiveFollowing();
    liveSpeaker=speaker||{type:"elder"};
    liveMessage.textContent=String(message||"");
    liveBar.classList.remove("speaker-master","speaker-elder","speaker-core","speaker-disciple","speaker-inner","speaker-outer","speaker-servant","speaker-racer");
    liveBar.classList.add("speaker-"+(liveSpeaker.type||"elder"));
    liveBar.classList.add("is-visible");
    positionLiveBubble();
    livePositionFrame=requestAnimationFrame(followLiveBubble);
    liveTimer=window.setTimeout(()=>{
      liveTimer=0;
      if(liveBar)liveBar.classList.remove("is-visible","is-below");
      stopLiveFollowing();
    },commentaryDuration);
  }

  // Chỉ dùng bong bóng thoại trên nhân vật, không lặp lại banner Canvas toàn sân.
  const baseDrawAnnouncement=window.drawAnnouncement;
  if(typeof baseDrawAnnouncement==="function"){
    window.drawAnnouncement=function(...args){
      if(liveBar&&liveBar.classList.contains("is-visible"))return;
      return baseDrawAnnouncement.apply(this,args);
    };
  }

  function handleEventAnnouncement(){
    if(!eventNode)return;
    const value=(typeof finishMessageLife!=="undefined"&&finishMessageLife>0&&typeof finishMessage!=="undefined"&&finishMessage)
      ?String(finishMessage).trim()
      :(typeof eventTextLife!=="undefined"&&eventTextLife>0&&typeof eventText!=="undefined"&&eventText
        ?String(eventText).trim():eventNode.textContent.trim());
    if(!value||value===lastEvent)return;
    lastEvent=value;
    if(value.startsWith("BẮT ĐẦU SAU"))return;
    if(value.includes("ĐẠI HỘI BẮT ĐẦU")){
      showLive("Đại hội Ngự Kiếm chính thức khai cuộc!",{type:"elder"});
      return;
    }
    const leaderPrefix="HẠNG 1 · ĐANG DẪN ĐẦU:";
    if(value.startsWith(leaderPrefix)){
      const name=value.slice(leaderPrefix.length).trim();
      const racer=getRacerByName(name);
      const exchanges=[
        {speaker:{type:"elder"},line:"Chưởng môn, "+name+" vừa vượt lên rồi! Kiếm thế thật khá!"},
        {speaker:{type:"master"},line:"Ta thấy rồi. "+name+" giữ thân pháp rất vững, không hề rối loạn."},
        {speaker:{type:"core"},line:"Đệ tử cũng để ý vị ấy từ đầu. Xem ra lần này có đối thủ đáng gờm!"},
        {speaker:{type:"elder"},line:"Ha ha, đại hội năm nay quả nhiên có nhiều nhân tài."},
        {speaker:{type:"master"},line:"Cứ để họ tự mình phân cao thấp. Người có bản lĩnh ắt sẽ nổi bật."}
      ];
      const exchange=exchanges[commentaryTurn++%exchanges.length];
      showLive(exchange.line,exchange.speaker);
      exchangeTimer=window.setTimeout(()=>{
        exchangeTimer=0;
        const cheerName=name.replace(/\\s+(sư huynh|sư tỷ|đạo hữu)$/i,"").trim();
        const cheers=[
          cheerName+" sư huynh cố lên! Đừng để bị vượt qua!",
          cheerName+" sư huynh, hay lắm! Cứ giữ nhịp kiếm ấy!",
          cheerName+" sư huynh! Một kiếm vừa rồi đẹp quá!",
          "Cố lên! "+cheerName+" sư huynh sắp bỏ xa họ rồi!",
          "Đệ tử đặt cược vào "+cheerName+" sư huynh đó!"
        ];
        showLive(cheers[(commentaryTurn-1)%cheers.length],{type:"outer"});
      },1900);
      return;
    }
    if(value.includes("PHOTO FINISH")){
      const dialogue="Chỉ chênh lệch trong gang tấc! Quả là một trận tranh phong kịch liệt!";
      const recentFinisher=typeof finishQueue!=="undefined"&&finishQueue.length
        ?finishQueue[finishQueue.length-1]:null;
      showLive(dialogue,recentFinisher?{type:"racer",racer:recentFinisher}:{type:"elder"});
      return;
    }
    const finish=value.match(/^HẠNG\s+(\d+)\s*:\s*(.+?)\s+ĐÃ VỀ ĐÍCH!?$/i);
    if(finish){
      const name=finish[2].trim();
      const racer=getRacerByName(name);
      showLive("Ta đã về đích!",racer?{type:"racer",racer}:{type:"elder"});
      return;
    }
    if(value.includes("ĐẠI HỘI KẾT THÚC")){
      showLive("Chúc mừng tam giáp! Các vị đã làm rạng danh tiên môn.",{type:"master"});
    }
  }

  function handleStatusAnnouncement(){
    if(!statusNode)return;
    const value=statusNode.textContent.trim();
    if(!value||value===lastStatus){
      if(typeof finished!=="undefined"&&!finished)closingShown=false;
      return;
    }
    lastStatus=value;
    if(typeof finished==="undefined"||!finished){closingShown=false;return;}
    if(closingShown)return;
    closingShown=true;
    const names=rankBody
      ?Array.from(rankBody.querySelectorAll("tr")).slice(0,3)
        .map(row=>row.cells&&row.cells[1]?row.cells[1].textContent.trim():"")
        .filter(name=>name&&name!=="Chưa có tiên nhân")
      :[];
    const champion=names[0];
    showLive(
      "Chúc mừng tam giáp! Các vị đã làm rạng danh tiên môn.",
      {type:"master"}
    );
  }

  startButton.addEventListener("click",onStartCapture,true);
  const summonButton=document.getElementById("summon");
  if(summonButton)summonButton.addEventListener("click",()=>{
    if(active)closeOpening();
    if(liveTimer){clearTimeout(liveTimer);liveTimer=0;}
    if(exchangeTimer){clearTimeout(exchangeTimer);exchangeTimer=0;}
    if(liveBar)liveBar.classList.remove("is-visible","is-below");
    stopLiveFollowing();
  },true);
  document.addEventListener("keydown",event=>{
    if(active&&event.key==="Escape"){
      closeOpening();
      startButton.focus({preventScroll:true});
    }
  });
  if(eventNode){
    new MutationObserver(handleEventAnnouncement).observe(eventNode,{childList:true,characterData:true,subtree:true});
  }
  if(statusNode){
    new MutationObserver(handleStatusAnnouncement).observe(statusNode,{childList:true,characterData:true,subtree:true});
  }
  window.addEventListener("pagehide",()=>{
    clearStageTimer();
    if(liveTimer)clearTimeout(liveTimer);
    if(exchangeTimer)clearTimeout(exchangeTimer);
    stopLiveFollowing();
  });
})();
