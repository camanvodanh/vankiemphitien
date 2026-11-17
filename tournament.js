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
  const liveBubbles=[];
  let livePositionFrame=0;
  let crowdTimer=0;
  let stageTimer=0;

  let active=false;
  let bypassStart=false;
  let lastEvent="";
  let lastStatus="";
  let closingShown=false;
  let commentaryTurn=0;
  let exchangeTimer=0;
  let crowdTurn=0;

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

  function getRacerByName(name){
    const wanted=String(name||"").trim();
    if(!wanted)return null;
    return getRacers().find(racer=>String(racer.name||"").trim()===wanted)||null;
  }

  function getSpeakerAnchor(speaker){
    const canvas=document.getElementById("game");
    const width=canvas?canvas.width:1100;
    const height=canvas?canvas.height:900;
    speaker=speaker||{type:"elder"};
    if(speaker.type==="racer"&&speaker.racer){
      const list=getRacers();
      const racer=list.find(item=>item===speaker.racer||(speaker.racer.id!=null&&item.id===speaker.racer.id))||null;
      if(racer){
        if(typeof finished!=="undefined"&&finished&&typeof sortedRacers==="function"){
          const ordered=sortedRacers(),rank=ordered.indexOf(racer)+1,count=Math.min(3,ordered.length);
          const podiumX=count===1?[width*.5]:count===2?[width*.25,width*.5]:[width*.25,width*.5,width*.75];
          const rankAt=count===1?[1]:count===2?[2,1]:[2,1,3],podiumIndex=rankAt.indexOf(rank);
          const topByRank={1:height*.535,2:height*.655,3:height*.715};
          if(podiumIndex>=0)return {x:podiumX[podiumIndex],y:topByRank[rank]-125};
          return {x:744,y:587};
        }
        if(typeof racerX==="function"&&typeof laneY==="function"){
          const index=list.indexOf(racer),scale=typeof racerScale==="function"?racerScale():1;
          return {x:racerX(racer),y:laneY(index)-Math.max(28,scale*36)};
        }
      }
    }
    if(speaker.type==="master")return {x:width*.5,y:518};
    if(speaker.type==="elder")return {x:744,y:587};
    if(speaker.type==="disciple")return {x:263,y:535};
    if(speaker.type==="core")return {x:550,y:615};
    if(speaker.type==="inner")return {x:420,y:650};
    if(speaker.type==="outer")return {x:550,y:705};
    if(speaker.type==="servant")return {x:550,y:785};
    return {x:744,y:558};
  }

  function positionLiveBubble(item){
    if(!item||!item.el.classList.contains("is-visible"))return;
    const canvas=document.getElementById("game");
    if(!canvas)return;
    const cr=canvas.getBoundingClientRect(),ar=arena.getBoundingClientRect();
    if(!cr.width||!cr.height||!ar.width||!ar.height)return;
    const width=canvas.width||1100,height=canvas.height||900,a=getSpeakerAnchor(item.speaker);
    const zoom=typeof gameZoom!=="undefined"?gameZoom:1;
    const panX=typeof gamePanX!=="undefined"?gamePanX:0,panY=typeof gamePanY!=="undefined"?gamePanY:0;
    const sx=width*.5+panX+(a.x-width*.5)*zoom,sy=height*.5+panY+(a.y-height*.5)*zoom;
    const anchorX=cr.left-ar.left+(sx/width)*cr.width,anchorY=cr.top-ar.top+(sy/height)*cr.height;
    const scaleX=cr.width/width;
    const sideShift=item.speaker.type==="master"?Math.min(150,Math.max(92,ar.width*.14)):0;
    const drop=item.speaker.type==="master"?Math.max(28,34*scaleX):0;
    const center=anchorX+sideShift;
    const half=(item.el.offsetWidth||180)/2;
    const bubbleCenter=Math.max(half+8,Math.min(ar.width-half-8,center));
    const tailX=Math.max(12,Math.min((item.el.offsetWidth||180)-12,anchorX-bubbleCenter+half));
    const top=anchorY+drop;
    item.el.classList.toggle("is-below",top<(item.el.offsetHeight||50)+16);
    item.el.style.left=bubbleCenter+"px";
    item.el.style.setProperty("--speech-tail-x",tailX+"px");
    item.el.style.top=Math.max(8,Math.min(ar.height-16,top))+"px";
  }

  function followLiveBubble(){
    const visible=liveBubbles.filter(item=>item.el.isConnected&&item.el.classList.contains("is-visible"));
    liveBubbles.splice(0,liveBubbles.length,...visible);
    visible.forEach(positionLiveBubble);
    if(visible.length)livePositionFrame=requestAnimationFrame(followLiveBubble);
    else livePositionFrame=0;
  }

  function ensureLiveFollowing(){
    if(!livePositionFrame)livePositionFrame=requestAnimationFrame(followLiveBubble);
  }

  function clearLiveBubbles(){
    liveBubbles.forEach(item=>{clearTimeout(item.timer);item.el.remove()});
    liveBubbles.length=0;
    if(livePositionFrame){cancelAnimationFrame(livePositionFrame);livePositionFrame=0}
  }

  function showLive(message,speaker={type:"elder"}){
    if(active||!message)return;
    const el=document.createElement("div");
    el.className="tournament-speech-bubble speaker-"+(speaker.type||"elder");
    el.setAttribute("aria-live","polite");
    const label=document.createElement("strong");
    label.className="tournament-speech-message";
    label.textContent=String(message);
    el.appendChild(label);
    arena.appendChild(el);
    const item={el,speaker,timer:0};
    liveBubbles.push(item);
    while(liveBubbles.length>7){
      const oldest=liveBubbles.shift();
      clearTimeout(oldest.timer);oldest.el.remove();
    }
    el.classList.add("is-visible");
    positionLiveBubble(item);
    ensureLiveFollowing();
    item.timer=window.setTimeout(()=>{
      el.classList.remove("is-visible","is-below");
      el.remove();
      const index=liveBubbles.indexOf(item);
      if(index>=0)liveBubbles.splice(index,1);
    },Math.max(3800,commentaryDuration+500));
  }

  function startCrowdChatter(){
    if(crowdTimer)return;
    const lines=[
      {role:"outer",say:name=>name+" sư huynh! Cố lên! Đệ tử đang dõi theo huynh đây!"},
      {role:"inner",say:name=>"Nhanh quá! "+name+" sư huynh sắp vượt thêm một người rồi!"},
      {role:"servant",say:name=>"Hay quá! "+name+" sư huynh, giữ vững kiếm thế nhé!"},
      {role:"disciple",say:name=>"Phong chúng ta có hy vọng đoạt vị trí cao rồi! Cố lên!"},
      {role:"core",say:name=>name+" đạo hữu quả nhiên có bản lĩnh, đường kiếm thật đẹp!"},
      {role:"outer",say:name=>"Sư huynh bên trái cố lên! Đừng để mất vị trí!"},
      {role:"inner",say:name=>"Đuổi kịp rồi! Chỉ còn một đoạn nữa thôi!"},
      {role:"servant",say:name=>"Đệ tử cổ vũ cho tất cả các vị! Bay nhanh lên nào!"},
      {role:"disciple",say:name=>name+" sư huynh, phía trước đang có cơ hội! Tăng tốc đi!"},
      {role:"inner",say:name=>"Đẹp lắm! Đường kiếm ấy khiến người xem cũng thấy nhiệt huyết!"},
      {role:"outer",say:name=>name+" sư huynh! Đệ tử tin huynh làm được!"},
      {role:"core",say:name=>"Thân pháp ấy rất có triển vọng. Chư vị xem, lại áp sát rồi!"},
      {role:"servant",say:name=>"Cố lên! Cố lên! Khán đài đang cổ vũ cho các vị!"},
      {role:"disciple",say:name=>"Đừng chậm lại! Cơ hội đổi thứ hạng ngay trước mắt!"},
      {role:"inner",say:name=>name+" đạo hữu, cố giữ nhịp thở và kiếm thế!"},
      {role:"outer",say:name=>"Sắp vượt rồi! Mau lên, chỉ còn một chút nữa!"}
    ];
    const speak=()=>{
      crowdTimer=0;
      if(typeof finished!=="undefined"&&finished)return;
      if(typeof running==="undefined"||!running||paused){crowdTimer=window.setTimeout(speak,1000);return;}
      const list=getRacers(),leader=typeof leaderOf==="function"?leaderOf():null;
      const target=list.length?(crowdTurn%4===0&&leader?leader:list[crowdTurn%list.length]):null;
      const name=target&&target.name?String(target.name):"các vị sư huynh";
      const entry=lines[crowdTurn++%lines.length];
      showLive(entry.say(name),{type:entry.role});
      crowdTimer=window.setTimeout(speak,1200+Math.floor(Math.random()*550));
    };
    crowdTimer=window.setTimeout(speak,900);
  }

  const baseDrawAnnouncement=window.drawAnnouncement;
  if(typeof baseDrawAnnouncement==="function"){
    window.drawAnnouncement=function(...args){
      if(liveBubbles.some(item=>item.el.classList.contains("is-visible")))return;
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
      showLive("Đại hội Ngự Kiếm chính thức khai cuộc! Chư vị chuẩn bị thưởng thức!",{type:"elder"});
      startCrowdChatter();
      return;
    }
    const leaderPrefix="HẠNG 1 · ĐANG DẪN ĐẦU:";
    if(value.startsWith(leaderPrefix)){
      const name=value.slice(leaderPrefix.length).trim();
      if(exchangeTimer){clearTimeout(exchangeTimer);exchangeTimer=0;}
      startCrowdChatter();
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
        const cheerName=name.replace(/\s+(sư huynh|sư tỷ|đạo hữu)$/i,"").trim();
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
      // Bỏ lời thoại "Ta đã về đích"; giữ nguyên bảng xếp hạng và thông báo hệ thống.
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
    if(exchangeTimer){clearTimeout(exchangeTimer);exchangeTimer=0;}
    if(crowdTimer){clearTimeout(crowdTimer);crowdTimer=0;}
    clearLiveBubbles();
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
    if(exchangeTimer)clearTimeout(exchangeTimer);
    if(crowdTimer)clearTimeout(crowdTimer);
    clearLiveBubbles();
  });
})();
