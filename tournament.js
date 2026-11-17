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
  let liveLabel=null;
  let liveMessage=null;
  let stageTimer=0;
  let liveTimer=0;
  let active=false;
  let bypassStart=false;
  let lastEvent="";
  let lastStatus="";
  let closingShown=false;

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
    liveBar.className="tournament-livebar";
    liveBar.setAttribute("aria-live","polite");
    liveBar.setAttribute("aria-atomic","true");
    liveBar.innerHTML='<span class="tournament-live-label"></span><strong class="tournament-live-message"></strong>';
    arena.appendChild(liveBar);
    liveLabel=liveBar.querySelector(".tournament-live-label");
    liveMessage=liveBar.querySelector(".tournament-live-message");
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

  function showLive(label,message){
    if(active)return;
    buildLiveBar();
    if(liveTimer){clearTimeout(liveTimer);liveTimer=0;}
    liveLabel.textContent=label;
    liveMessage.textContent=message;
    liveBar.classList.add("is-visible");
    liveTimer=window.setTimeout(()=>{
      liveTimer=0;
      if(liveBar)liveBar.classList.remove("is-visible");
    },commentaryDuration);
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
      showLive("TRƯỞNG LÃO BÌNH LUẬN","Đại hội Ngự Kiếm chính thức khai cuộc!");
      return;
    }
    const leaderPrefix="HẠNG 1 · ĐANG DẪN ĐẦU:";
    if(value.startsWith(leaderPrefix)){
      const name=value.slice(leaderPrefix.length).trim();
      showLive("TRƯỞNG LÃO BÌNH LUẬN",name+" đang dẫn đầu đại hội!");
      return;
    }
    if(value.includes("PHOTO FINISH")){
      showLive("KHOẢNH KHẮC SÁT NÚT",value);
      return;
    }
    if(value.includes("ĐÃ VỀ ĐÍCH")){
      showLive("TIN VỀ ĐÍCH",value);
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
    showLive("CHƯỞNG MÔN VINH DANH TAM GIÁP",
      champion?champion+" đã đoạt ngôi quán quân.":"Đại hội đã định danh tam giáp.");
  }

  startButton.addEventListener("click",onStartCapture,true);
  const summonButton=document.getElementById("summon");
  if(summonButton)summonButton.addEventListener("click",()=>{if(active)closeOpening();},true);
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
  });
})();
