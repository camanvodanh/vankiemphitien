
"use strict";

// Khai báo trước lần updateRanking() khởi tạo ở cuối file.
let rankingOrderSignature = "";
let raceStopped = false;

// =====================================================
// PHÂN BỔ THỜI ĐIỂM VỀ ĐÍCH
// =====================================================

function assignFinishTimes() {
  if (!racers.length) return;

  const shuffled = [...racers].sort(
    () => Math.random() - .5
  );

  const lastRacer = shuffled[shuffled.length - 1];
  const others = racers.filter(r => r !== lastRacer);

  const times = others.map((r, index) => {
    const ratio = others.length <= 1
      ? .7
      : .48 + (index / (others.length - 1)) * .43;

    return duration * ratio;
  });

  for (let i = times.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [times[i], times[j]] = [times[j], times[i]];
  }

  others.forEach((racer, index) => {
    racer.targetFinishTime = times[index];
  });

  lastRacer.targetFinishTime = duration;
}

// =====================================================
// XỬ LÝ VỀ ĐÍCH
// =====================================================

function processFinish(racer,index){
 if(racer.finished)return;racer.progress=distance;racer.finished=true;racer.finishTime=elapsed;
 racer.speedMultiplier=1;racer.effectTimer=0;racer.effectType="";racer.effectName="";
 if(cameraFocusId===racer.id)cameraFocusId=null;
 finishQueue.push(racer);showFinishAnnouncement(racer,finishQueue.length);addParticles(TRACK.right-35,laneY(index),28);
}

// =====================================================
// CẬP NHẬT CUỘC ĐUA
// =====================================================

function updateRace(dt){
 if(!running||paused||!started||finished)return;
 elapsed=Math.min(duration,elapsed+dt);
 const rankBefore=new Map(sortedRacers().map((r,i)=>[r.id,i+1]));
 racers.forEach(racer=>{
  if(racer.finished)return;
  if(racer.rankChangeTimer>0){
   racer.rankChangeTimer=Math.max(0,racer.rankChangeTimer-dt);
   if(racer.rankChangeTimer===0)racer.rankChangeText="";
  }
  if(racer.rankMovementTimer>0){
   racer.rankMovementTimer=Math.max(0,racer.rankMovementTimer-dt);
   if(racer.rankMovementTimer===0)racer.rankMovement="";
  }
  if(racer.effectTimer>0){
   racer.effectTimer=Math.max(0,racer.effectTimer-dt);
   if(racer.effectTimer===0){
    racer.speedMultiplier=1;racer.effectType="";racer.effectName="";
    if(cameraFocusId===racer.id)cameraFocusId=null;
   }
  }
  const baseSpeed=distance/Math.max(.001,racer.targetFinishTime);
  racer.progress=Math.min(distance,racer.progress+baseSpeed*dt*(racer.speedMultiplier||1));
 });
 const rankedNow=sortedRacers();
 for(let i=0;i<rankedNow.length;i++){
  const racer=rankedNow[i],oldRank=rankBefore.get(racer.id),newRank=i+1;
  if(oldRank&&oldRank!==newRank){
   racer.rankMovement=newRank<oldRank?"up":"down";
   racer.rankMovementTimer=3.5;
  }
  if(racer.effectTimer>0&&oldRank&&oldRank!==newRank){
   const multiplier=racer.speedMultiplier||1;
   const direction=newRank<oldRank?"up":"down";
   racer.rankChangeText=newRank+"|"+direction+"|"+multiplier.toFixed(1);
   racer.rankChangeTimer=3.2;
  }
 }
 racers.map((racer,index)=>({racer,index})).filter(o=>!o.racer.finished&&o.racer.progress>=distance).forEach(o=>processFinish(o.racer,o.index));
 eventClock+=dt;
 if(eventClock>=nextEvent&&elapsed<duration){triggerEvent();eventClock=0;nextEvent=rand(4.5,7.5);}
 if(elapsed>=duration){racers.forEach((racer,index)=>{if(!racer.finished)processFinish(racer,index);});finishRace();}
}
// =====================================================
// ĐẾM NGƯỢC VÀ VÒNG LẶP ANIMATION
// =====================================================

function frame(time) {
  const dt = lastTime
    ? Math.min((time - lastTime) / 1000, .05)
    : 0;

  lastTime = time;
  sceneTime = time;

  if (running && !paused && !finished) {
    if (countdown > 0) {
      countdownAccumulator += dt;

      while (
        countdown > 0 &&
        countdownAccumulator >= 1
      ) {
        countdownAccumulator -= 1;
        countdown--;

        if (countdown > 0) {
          $("status").textContent =
            `Bắt đầu sau ${countdown}...`;

          eventText = `BẮT ĐẦU SAU ${countdown}`;
          eventTextLife = .9;
        } else {
          started = true;
          elapsed = 0;
          countdownAccumulator = 0;

          $("status").textContent = "Đang tranh phong";
          $("lockNotice").textContent = "Cuộc đua đang diễn ra. Theo dõi trực tiếp hoặc nhấn Tạm dừng.";

          eventText = "ĐẠI HỘI BẮT ĐẦU!";
          eventTextLife = 1.5;
        }
      }
    }

    if (started && countdown === 0 && !finished) {
      updateRace(dt);
    }
  }

  updateParticles(dt);

  eventTextLife = Math.max(0, eventTextLife - dt);
  finishMessageLife = Math.max(0, finishMessageLife - dt);
  advanceFinishAnnouncements();

  render(time);

  requestAnimationFrame(frame);
}

// =====================================================
// TRIỆU HỒI
// =====================================================

function getInputNames() {
  return $("names").value
    .split(/\r?\n/)
    .map(name => name.trim())
    .filter(Boolean);
}

function getRandomQuantity() {
  const raw = parseInt($("quantity").value, 10);

  const amount = clamp(
    Number.isFinite(raw) ? raw : 10,
    2,
    100
  );

  $("quantity").value = amount;

  return amount;
}

function createRacer(name, index) {
  const color = palette[index % palette.length];

  return {
    id: Math.random().toString(36).slice(2),
    name,
    gender: /nữ|tiên tử|thánh nữ|tiểu thư|cô nương|nguyệt|thanh huyền|linh nhi|nhược|tử yên|băng tâm/i.test(name) ? "female" : (randInt(0,1) === 0 ? "male" : "female"),
    appearanceSeed: randInt(0,4),
    progress: 0,
    targetFinishTime: 0,
    finished: false,
    finishTime: null,
    color: color[0],
    dark: color[1],
    phase: rand(0, Math.PI * 2),
    speedMultiplier: 1,
    effectTimer: 0,
    effectType: "",
    effectName: "",
    rankChangeText: "",
    rankChangeTimer: 0,
    rankMovement: "",
    rankMovementTimer: 0
  };
}

function summon() {
  if (locked || running || paused) return;

  const names = getInputNames();

  const finalNames = names.length > 0
    ? names
    : Array.from(
        { length: getRandomQuantity() },
        (_, i) =>
          `Tiên nhân ${String(i + 1).padStart(2, "0")}`
      );

  if (finalNames.length > 100) {
    $("lockNotice").textContent =
      "Tối đa 100 tiên nhân. Hãy rút gọn danh sách rồi triệu hồi lại.";

    return;
  }

  racers = finalNames.map((name, index) =>
    createRacer(name, index)
  );

  duration = Number($("speed").value);
  

  elapsed = 0;

  running = false;
  paused = false;
  started = false;
  finished = false;

  countdown = 0;
  countdownAccumulator = 0;

  eventClock = 0;
  nextEvent = rand(5, 9);

  eventText = "";
  eventTextLife = 0;

  finishQueue = [];
  finishMessage = "";
  finishMessageLife = 0;

  particles = [];

  assignFinishTimes();

  $("status").textContent = "Đã triệu hồi";
  collapseSetupPanel();

  $("lockNotice").textContent =
    "Tiếp theo: Nhấn Bắt đầu để khai mở cuộc đua.";

  $("leaderName").textContent = "Đang chờ cuộc đua";
  $("leaderProgress").textContent = "Chưa bắt đầu";

  setSettingsLocked(false);
  syncButtons();

  render(performance.now());
}

// =====================================================
// KHÓA THIẾT LẬP VÀ ĐỒNG BỘ NÚT
// =====================================================

function setSettingsLocked(value) {
  locked = value;

  $("speed").disabled = value;
$("quantity").disabled = value;
  $("names").disabled = value;

  $("summon").disabled =
    value || running || paused;

  $("lockNotice").classList.toggle("locked", value);

  $("lockNotice").textContent = value
    ? "Cuộc đua đang diễn ra. Theo dõi trực tiếp hoặc nhấn Tạm dừng."
    : racers.length
      ? "Tiếp theo: Nhấn Bắt đầu để khai mở cuộc đua."
      : "Bước 1: Nhập tên hoặc chọn số lượng, sau đó nhấn Triệu hồi.";
}

function syncButtons() {
  $("start").disabled =
    racers.length === 0 ||
    running ||
    paused ||
    finished;

  $("pause").disabled =
    !running && !paused;

  $("summon").disabled =
    locked ||
    running ||
    paused;

  // Nút reset đã được thay bằng Dừng; không tham chiếu phần tử không còn tồn tại.
}

// =====================================================
// BẮT ĐẦU CUỘC ĐUA
// =====================================================

function startRace() {
  if (
    !racers.length ||
    running ||
    finished ||
    paused
  ) return;

  duration = Number($("speed").value);
  

  elapsed = 0;

  countdown = 3;
  countdownAccumulator = 0;

  eventClock = 0;
  nextEvent = rand(5, 9);

  finishQueue = [];
  finishMessage = "";
  finishMessageLife = 0;

  eventText = "BẮT ĐẦU SAU 3";
  eventTextLife = 1;

  racers.forEach(racer => {
    racer.progress = 0;
    racer.finished = false;
    racer.finishTime = null;
  });

  assignFinishTimes();

  started = false;
  finished = false;
  paused = false;
  running = true;

  $("status").textContent = "Bắt đầu sau 3...";

  $("leaderName").textContent = "Đang chờ cuộc đua";
  $("leaderProgress").textContent = "Chưa bắt đầu";

  setSettingsLocked(true);
  syncButtons();
}

// =====================================================
// TẠM DỪNG / TIẾP TỤC
// =====================================================

function togglePause() {
  if (!running || finished) return;

  paused = true;
  running = false;

  $("pause").textContent = "Tiếp tục";
  $("status").textContent = "Đang tạm dừng";

  syncButtons();
}

function resumeRace() {
  if (!paused || finished) return;

  paused = false;
  running = true;

  $("pause").textContent = "Tạm dừng";

  $("status").textContent = started
    ? "Đang tranh phong"
    : `Bắt đầu sau ${countdown}...`;

  syncButtons();
}

// =====================================================
// KẾT THÚC CUỘC ĐUA
// TỰ ĐỘNG MỞ KHÓA THIẾT LẬP
// =====================================================

function finishRace() {
  elapsed = duration;
  setSetupPanel(true);

  racers.forEach(racer => {
    racer.progress = distance;
    racer.finished = true;

    if (racer.finishTime === null) {
      racer.finishTime = duration;
    }
  });

  finished = true;
  running = false;
  paused = false;
  started = true;

  $("status").textContent = "Đại hội kết thúc";

  finishMessage = "ĐẠI HỘI KẾT THÚC!";
  finishMessageLife = 3;

  $("pause").textContent = "Tạm dừng";

  // MỞ KHÓA THỜI GIAN, KHOẢNG CÁCH,
  // SỐ LƯỢNG VÀ DANH SÁCH TIÊN NHÂN
  setSettingsLocked(false);

  $("lockNotice").textContent =
    "Tiếp theo: Nhấn Triệu hồi để mở đại hội mới.";

  syncButtons();
  updateRanking();
}

// =====================================================
// LÀM MỚI
// =====================================================

function resetGame() {
  racers = [];
  raceStopped = false;
  particles = [];

  running = false;
  paused = false;
  started = false;
  finished = false;

  countdown = 0;
  countdownAccumulator = 0;

  elapsed = 0;
  eventClock = 0;

  eventText = "";
  eventTextLife = 0;

  finishQueue = [];
  finishMessage = "";
  finishMessageLife = 0;

  duration = Number($("speed").value);
  

  $("status").textContent = "Chờ triệu hồi";

  $("leaderName").textContent = "Đang chờ cuộc đua";
  $("leaderProgress").textContent = "Chưa bắt đầu";

  $("pause").textContent = "Tạm dừng";

  setSettingsLocked(false);
  syncButtons();

  updateRanking();
  render(performance.now());
}

// =====================================================
// SỰ KIỆN GIAO DIỆN
// =====================================================

$("quantity").addEventListener("change", getRandomQuantity);
$("names").addEventListener("input",()=>{const n=getInputNames().length;if(n)$("quantity").value=n;});

$("summon").addEventListener("click", summon);
$("start").addEventListener("click", toggleRaceControl);

$("pause").addEventListener("click", () => {
  if (paused) {
    resumeRace();
  } else {
    togglePause();
  }
});

$("stop").addEventListener("click", handleStopOrSetup);
$("setupToggle").addEventListener("click", () => setSetupPanel(true));

$("speed").addEventListener("change", () => {
  if (!locked) {
    duration = Number($("speed").value);
  }
});

// =====================================================
// KHỞI CHẠY
// =====================================================

initStars();

duration = Number($("speed").value);


updateRanking();
setSettingsLocked(false);
syncButtons();

drawCameraBackground();
render(0);

lastTime = 0;

requestAnimationFrame(frame);


// REVISION 9 — một nút điều khiển, tên tu tiên duy nhất và camera người dẫn đầu.
function uniqueNames(list) {
  const seen=new Set();
  return list.filter(name=>{
    const key=name.normalize("NFC").toLocaleLowerCase("vi").replace(/\s+/g," ").trim();
    if(!key||seen.has(key))return false;seen.add(key);return true;
  });
}
function generateCultivationNames(amount) {
  const surnames=["Diệp","Tiêu","Lâm","Tô","Mộ Dung","Cố","Thẩm","Bạch","Vân","Tần","Lạc","Ninh","Hàn","Thượng Quan","Đoan Mộc","Phong","Dạ","Mặc","Sở","Giang","Âu Dương","Tư Đồ","Long","Trần","Hứa","Tạ","Lục","Đường","Yến","Kỷ"];
  const given=["Trường Phong","Vô Trần","Thanh Huyền","Tử Mặc","Nguyệt Dao","Thiên Vũ","Kiếm Tâm","Hạo Nhiên","Vân Khê","Minh Nguyệt","Bạch Y","Tử Yên","Cảnh Hành","Thanh Liên","Phi Vũ","Lăng Tiêu","Mộng Dao","Thiên Hà","Ngọc Khanh","Tĩnh Uyên","Huyền Dạ","Vân Sam","Sơ Ảnh","Dạ Bạch","Tuyết Nhi","Phong Nhiên","Thừa Phong","Tử Dương","Uyển Nhi","Vô Ưu","Kinh Hồng","Trường Ca","Tầm Chân","Linh Quân","Hành Chu","Vãn Tình","Tịch Nhan","Thiếu Khanh","Tuyết Kiến","Vân Trạch"];
  const pool=[];for(const s of surnames)for(const g of given)pool.push(s+" "+g);
  for(let i=pool.length-1;i>0;i--){const j=randInt(0,i);[pool[i],pool[j]]=[pool[j],pool[i]];}
  return pool.slice(0,Math.min(amount,pool.length));
}
function getInputNames(){return uniqueNames($("names").value.split(/\r?\n/).map(s=>s.trim()).filter(Boolean));}
function summon(){
  if(running||paused)return;
  const typed=getInputNames(),amount=getRandomQuantity();
  const finalNames=typed.length?typed:generateCultivationNames(amount);
  if(!finalNames.length)return;
  if(finalNames.length>100){$("lockNotice").textContent="Tối đa 100 tiên nhân. Hãy rút gọn danh sách rồi triệu hồi lại.";return;}
  racers=finalNames.map((name,index)=>createRacer(name,index));
  raceStopped=false;
  racers.forEach(r=>{r.swordStyle=randInt(0,11);r.swordColor=randInt(0,9);if(r.gender==="female")r.swordColor=randInt(0,3);else r.swordColor=randInt(4,7);});
  duration=Number($("speed").value);
  elapsed=0;running=false;paused=false;started=false;finished=false;
  countdown=0;countdownAccumulator=0;eventClock=0;nextEvent=rand(5,9);
  eventText="";eventTextLife=0;finishQueue=[];cameraFocusId=null;finishEndAnnouncementPending=false;finishEndAnnouncementShown=false;
  finishMessage="";finishMessageLife=0;particles=[];
  assignFinishTimes();
  $("status").textContent="Đã triệu hồi";
  $("lockNotice").textContent="Tiếp theo: Nhấn Bắt đầu để khai mở cuộc đua.";
  $("leaderName").textContent="Đang chờ cuộc đua";$("leaderProgress").textContent="--";
  setSettingsLocked(false);$("lockNotice").textContent="Tiếp theo: Nhấn Bắt đầu để khai mở cuộc đua.";syncButtons();render(performance.now());
}
function setSettingsLocked(value){
  locked=value;["speed","quantity","names","summon"].forEach(id=>$(id).disabled=value);
  $("lockNotice").classList.toggle("locked",value);
}
function syncButtons(){
  const b=$("start");
  const state=running?{icon:"❖",label:"Tạm"}:paused?{icon:"⚔",label:"Tiếp"}:finished?{icon:"⟲",label:"Lại"}:{icon:"⚔",label:"Chạy"};
  b.innerHTML='<span class="btn-icon" aria-hidden="true">'+state.icon+'</span><span class="btn-label">'+state.label+'</span>';
  b.disabled=!racers.length;
  if($("pause")){$("pause").hidden=true;$("pause").disabled=true;}
  $("summon").disabled=running||paused;
}
function toggleRaceControl(){
  if(!racers.length)return;
  if(running){togglePause();return;}
  if(paused){resumeRace();return;}
  startRace();
}
function startRace(){
  if(!racers.length||running||paused)return;
  duration=Number($("speed").value);
  raceStopped=false;
  elapsed=0;countdown=3;countdownAccumulator=0;eventClock=0;nextEvent=rand(5,9);
  finishQueue=[];cameraFocusId=null;finishMessage="";finishMessageLife=0;finishEndAnnouncementPending=false;finishEndAnnouncementShown=false;
  eventText="BẮT ĐẦU SAU 3";eventTextLife=1;
  racers.forEach(r=>{r.progress=0;r.finished=false;r.finishTime=null;r.speedMultiplier=1;r.effectTimer=0;r.effectType="";r.effectName="";});
  assignFinishTimes();started=false;finished=false;paused=false;running=true;
  $("status").textContent="Bắt đầu sau 3...";
  $("leaderName").textContent="Đang chờ cuộc đua";$("leaderProgress").textContent="Chưa có thứ hạng";
  setSettingsLocked(true);$("lockNotice").textContent="Tiếp theo: Chờ đếm ngược rồi theo dõi cuộc đua.";syncButtons();
}
function togglePause(){if(!running||finished)return;running=false;paused=true;$("status").textContent="Đang tạm dừng";$("lockNotice").textContent="Cuộc đua đang tạm dừng. Nhấn Tiếp tục để xem tiếp.";syncButtons();}
function resumeRace(){if(!paused||finished)return;paused=false;running=true;$("status").textContent=started?"Đang tranh phong":"Bắt đầu sau "+countdown+"...";$("lockNotice").textContent=started?"Cuộc đua đang tiếp tục. Theo dõi nhân vật dẫn đầu.":"Tiếp theo: Chờ đếm ngược rồi theo dõi cuộc đua.";syncButtons();}
function finishRace(){
 collapseSetupPanel();
 elapsed=duration;
 ceremonyStartedAt=performance.now();
 racers.forEach(racer=>{
  racer.progress=distance;
  racer.finished=true;
  if(racer.finishTime===null)racer.finishTime=duration;
  racer.speedMultiplier=1;racer.effectTimer=0;racer.effectType="";racer.effectName="";
 });
 cameraFocusId=null;
 finished=true;running=false;paused=false;started=true;
 eventText="";eventTextLife=0;finishMessage="";finishMessageLife=0;
 $("status").textContent="Đại hội kết thúc · Vinh danh top 3";
 $("pause").textContent="Tiếp";
 setSettingsLocked(false);
 $("lockNotice").textContent="Tiếp theo: Nhấn Triệu hồi để mở đại hội mới.";
 syncButtons();updateRanking();
}
function resetGame(){
  racers=[];raceStopped=false;particles=[];running=false;paused=false;started=false;finished=false;
  countdown=0;countdownAccumulator=0;elapsed=0;eventClock=0;eventText="";eventTextLife=0;
  finishQueue=[];cameraFocusId=null;finishMessage="";finishMessageLife=0;finishEndAnnouncementPending=false;finishEndAnnouncementShown=false;
  $("status").textContent="Chờ triệu hồi";$("leaderName").textContent="Đang chờ cuộc đua";$("leaderProgress").textContent="Chưa khai mở";$("leaderEffect").textContent="";$("lockNotice").textContent="Bước 1: Nhập danh sách hoặc chọn số lượng, sau đó nhấn Tạo.";
  setSettingsLocked(false);setSetupPanel(true);syncButtons();updateRanking();render(performance.now());
}
function leaderOf(){
  const active=racers.filter(r=>!r.finished);
  if(active.length)return active.sort((a,b)=>b.progress-a.progress)[0];
  return finishQueue.length?finishQueue[finishQueue.length-1]:null;
}


// REVISION 10 — lần lượt chiếu người đang dẫn đầu còn lại và thời gian về đích.
function leaderOf(){
  const active=racers.filter(r=>!r.finished).sort((a,b)=>b.progress-a.progress||a.targetFinishTime-b.targetFinishTime);
  if(active.length)return active[0];
  return finishQueue.length?finishQueue[finishQueue.length-1]:null;
}
function drawCamera(time){
 drawCameraBackground(time);
 if(finished){
  drawPodiumScene(cameraCtx,time,true);
  $("leaderName").textContent="Lễ trao giải · Top 3";
  $("leaderProgress").textContent="VINH DANH TOP 3";
  $("leaderEffect").textContent="";
  return;
 }
 if(!started||!racers.length){
  $("leaderName").textContent="Đang chờ cuộc đua";
  $("leaderProgress").textContent="--";
  $("leaderEffect").textContent="";
  cameraCtx.fillStyle="#fff2c9";cameraCtx.font="bold 14px Arial, sans-serif";
  cameraCtx.textAlign="center";cameraCtx.textBaseline="middle";
  cameraCtx.fillText("Chờ khai mở tiên hội",210,96);
  return;
 }
 let racer=cameraFocusId?racers.find(item=>item.id===cameraFocusId):null;
 if(!racer||racer.finished||racer.effectTimer<=0)racer=leaderOf();
 if(!racer)return;
 drawRacer(cameraCtx,racer,210,108,2.0,time);
 const rank=sortedRacers().findIndex(item=>item.id===racer.id)+1;
 $("leaderEffect").textContent=(racer.effectTimer>0&&racer.effectName)?racer.effectName:"";
 $("leaderName").textContent=racer.name;
 const shift=racer.rankChangeTimer>0&&racer.rankChangeText;
 if(shift){
  const parts=racer.rankChangeText.split("|"),shownRank=Number(parts[0]),direction=parts[1],speed=parts[2];
  const arrow=direction==="up"
   ? '<span class="camera-rank-up">↑</span>'
   : '<span class="camera-rank-down">↓</span>';
  $("leaderProgress").innerHTML=arrow+" "+shownRank+" <small>· "+speed+"</small>";
 }else{
  $("leaderProgress").textContent=String(rank);
 }
}


function updateRanking(){
 const body=$("rankBody");
 const sorted=sortedRacers();
 if(!sorted.length){
  body.innerHTML='<tr><td colspan="3" class="empty">Chưa có tiên nhân</td></tr>';
  rankingOrderSignature="";
  return;
 }

 // Chỉ dựng lại bảng khi thứ tự hoặc trạng thái hàng thay đổi,
 // tránh làm mới DOM mỗi khung hình và giữ hiệu ứng chuyển động mượt.
 const signature=sorted.map(r=>r.id+":"+r.rankMovement+":"+(r.finished&&r.finishTime!==null?r.finishTime:"")).join("|");
 if(signature===rankingOrderSignature)return;

 const previousPositions=new Map();
 body.querySelectorAll("tr[data-racer-id]").forEach(row=>{
  const id=row.dataset.racerId;
  if(id)previousPositions.set(id,row.getBoundingClientRect().top);
 });

 body.innerHTML=sorted.map((r,i)=>{
  const medal=i===0?"🥇":i===1?"🥈":i===2?"🥉":i+1;
  const arrow=r.rankMovement==="up"?'<span class="rank-movement rank-up" aria-label="Tăng hạng" title="Tăng hạng">▲</span>':r.rankMovement==="down"?'<span class="rank-movement rank-down" aria-label="Giảm hạng" title="Giảm hạng">▼</span>':"";
  const actualTime=r.finished&&r.finishTime!==null?timeText(r.finishTime):"—";
  return '<tr data-racer-id="'+r.id+'"><td><span class="rank-cell">'+arrow+'<span class="rank-position">'+medal+'</span></span></td><td title="'+escapeHTML(r.name)+'">'+escapeHTML(r.name)+'</td><td>'+actualTime+'</td></tr>';
 }).join("");

 const movedRows=[];
 body.querySelectorAll("tr[data-racer-id]").forEach((row,index)=>{
  const oldTop=previousPositions.get(row.dataset.racerId);
  if(oldTop===undefined)return;
  const newTop=row.getBoundingClientRect().top;
  const delta=oldTop-newTop;
  if(Math.abs(delta)<1)return;

  // Giữ nguyên cả hàng như một khối: nâng nhẹ lên khỏi mặt bảng,
  // sau đó trượt đến vị trí mới và hạ xuống êm.
  row.classList.add("rank-row-moving");
  row.style.transition="none";
  row.style.transform="translate3d(0,"+delta+"px,0) scale(1.018)";
  movedRows.push({row,index});
 });
 if(movedRows.length){
  // Buộc trình duyệt ghi nhận trạng thái nhấc hàng trước khi chạy chuyển động.
  void body.offsetHeight;
  requestAnimationFrame(()=>{
   movedRows.forEach(({row,index})=>{
    row.style.transition="transform 620ms cubic-bezier(.18,.78,.22,1), filter 620ms ease";
    row.style.transform="translate3d(0,0,0) scale(1)";
    row.style.filter="";
    row.style.transitionDelay=Math.min(index*16,96)+"ms";
    row.addEventListener("transitionend",function finishRowMove(event){
     if(event.propertyName!=="transform")return;
     row.removeEventListener("transitionend",finishRowMove);
     row.classList.remove("rank-row-moving");
     row.style.transition="";
     row.style.transitionDelay="";
     row.style.transform="";
     row.style.filter="";
    });
   });
  });
 }
 rankingOrderSignature=signature;
}

// Hiển thị hạng người về cuối cùng trước khi hiện thông báo kết thúc.
let finishEndAnnouncementPending=false;
let finishEndAnnouncementShown=false;
function advanceFinishAnnouncements(){
  if(finished&&finishEndAnnouncementPending&&!finishEndAnnouncementShown&&finishMessageLife<=0){
    finishMessage="ĐẠI HỘI KẾT THÚC!";
    finishMessageLife=3;
    finishEndAnnouncementShown=true;
    $("event").textContent=finishMessage;
  }
}


// KÉO THẢ GÓC QUAN SÁT: luôn hoạt động, kể cả trước khi triệu hồi hoặc bắt đầu.
(function enableDraggableCamera(){
  function attach(){
    const camera=document.querySelector(".game-camera");
    const frame=document.querySelector(".arena-frame");
    if(!camera||!frame||camera.dataset.dragReady==="1")return;
    camera.dataset.dragReady="1";
    let drag=null;
    camera.style.touchAction="none";
    camera.addEventListener("pointerdown",event=>{
      if(event.pointerType==="mouse"&&event.button!==0)return;
      if(event.target.closest&&event.target.closest(".window-minimize"))return;
      const box=camera.getBoundingClientRect();
      const area=frame.getBoundingClientRect();
      drag={id:event.pointerId,dx:event.clientX-box.left,dy:event.clientY-box.top};
      camera.style.position="absolute";
      camera.style.left=(box.left-area.left)+"px";
      camera.style.top=(box.top-area.top)+"px";
      camera.style.right="auto";
      camera.style.bottom="auto";
      try{camera.setPointerCapture(event.pointerId);}catch(_){}
      event.preventDefault();
      event.stopPropagation();
    });
    camera.addEventListener("pointermove",event=>{
      if(!drag||event.pointerId!==drag.id)return;
      const area=frame.getBoundingClientRect();
      const maxX=Math.max(0,area.width-camera.offsetWidth);
      const maxY=Math.max(0,area.height-camera.offsetHeight);
      camera.style.left=Math.min(maxX,Math.max(0,event.clientX-area.left-drag.dx))+"px";
      camera.style.top=Math.min(maxY,Math.max(0,event.clientY-area.top-drag.dy))+"px";
      event.preventDefault();
    });
    const stop=event=>{if(drag&&event.pointerId===drag.id)drag=null;};
    camera.addEventListener("pointerup",stop);
    camera.addEventListener("pointercancel",stop);
    camera.addEventListener("lostpointercapture",()=>{drag=null;});
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",attach,{once:true});
  else attach();
})();

function setSetupPanel(show){
 const panel=document.querySelector(".arena-frame .game-setup");
 if(!panel)return;
 panel.hidden=!show;
 if(show) panel.classList.remove("is-minimized");
 const button=panel.querySelector(".window-minimize");
 if(button){
  button.textContent=show?"−":"+";
  button.setAttribute("aria-expanded",String(!!show));
  button.setAttribute("aria-label",show?"Thu nhỏ khởi tạo đại hội":"Mở rộng khởi tạo đại hội");
  button.title=show?"Thu nhỏ":"Mở rộng";
 }
 $("setupToggle").hidden=true;
}
function collapseSetupPanel(){
 const panel=document.querySelector(".arena-frame .game-setup");
 if(!panel)return;
 panel.hidden=false;
 panel.classList.add("is-minimized");
 const button=panel.querySelector(".window-minimize");
 if(button){
  button.textContent="+";
  button.setAttribute("aria-expanded","false");
  button.setAttribute("aria-label","Mở rộng khởi tạo đại hội");
  button.title="Mở rộng";
 }
 $("setupToggle").hidden=true;
}
function stopRace(){
 if(!racers.length)return;
 running=false;paused=false;started=false;finished=false;raceStopped=true;
 countdown=0;countdownAccumulator=0;
 $("status").textContent="Cuộc đua đã dừng";
 $("pause").hidden=true;$("pause").disabled=true;
 $("start").querySelector(".btn-label").textContent="Chạy lại";
 setSettingsLocked(false);
 $("lockNotice").textContent="Cuộc đua đã dừng. Có thể bắt đầu lại hoặc mở Thiết lập để thay đổi danh sách.";
 collapseSetupPanel();syncButtons();render(performance.now());
}
function syncButtons(){
 const startButton=$("start"),pauseButton=$("pause"),stopButton=$("stop");
 const restart=finished||raceStopped;
 startButton.innerHTML='<span class="btn-icon" aria-hidden="true">'+(restart?'↻':'▶')+'</span><span class="btn-label">'+(restart?'Bắt đầu lại':'Chạy')+'</span>';
 startButton.disabled=!racers.length||running||paused;
 pauseButton.hidden=!running&&!paused;
 pauseButton.disabled=!running&&!paused;
 pauseButton.textContent=paused?'▶ Tiếp tục':'Ⅱ Tạm ngưng';
 stopButton.hidden=!running&&!paused;
 stopButton.disabled=!running&&!paused;
 $("setupToggle").hidden=true;
 $("summon").disabled=locked||running||paused;
}


// MINIMIZE / RESTORE: các bảng hoạt động như cửa sổ nổi.
(function enablePanelWindows(){
  function attach(){
    if(document.documentElement.dataset.panelWindowsReady==="1")return;
    document.documentElement.dataset.panelWindowsReady="1";
    document.addEventListener("click",event=>{
      const button=event.target.closest&&event.target.closest(".window-minimize");
      if(!button)return;
      const panel=button.closest(".game-setup,.game-camera,.game-ranking");
      if(!panel)return;
      const minimized=panel.classList.toggle("is-minimized");
      if(panel.classList.contains("game-setup")) panel.hidden=false;
      button.textContent=minimized?"+":"−";
      button.setAttribute("aria-expanded",String(!minimized));
      button.setAttribute("aria-label",minimized?"Mở rộng bảng":"Thu nhỏ bảng");
      button.title=minimized?"Mở rộng":"Thu nhỏ";
      if(panel.classList.contains("game-setup")) $("setupToggle").hidden=true;
      event.preventDefault();
      event.stopPropagation();
    });
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",attach,{once:true});
  else attach();
})();


/* ORIENTATION: request landscape where the browser supports orientation lock.
   On iPhone Safari, physical rotation is handled by the responsive landscape CSS. */
(function enableLandscapeView(){
  function attach(){
    const button=document.getElementById("rotateView");
    if(!button||button.dataset.orientationReady==="1")return;
    button.dataset.orientationReady="1";
    const isLandscape=()=>window.matchMedia&&window.matchMedia("(orientation: landscape)").matches;
    const refresh=()=>{
      const landscape=isLandscape();
      button.textContent=landscape?"↻ Đang xem ngang":"↻ Xoay ngang";
      button.setAttribute("aria-label",landscape?"Đang ở chế độ xem ngang":"Bật chế độ xem ngang");
      button.title=landscape?"Xoay điện thoại về dọc để trở lại":"Xoay ngang điện thoại để mở rộng sân đua";
    };
    button.addEventListener("click",async()=>{
      try{
        const root=document.documentElement;
        if(!document.fullscreenElement&&root.requestFullscreen){
          await root.requestFullscreen();
        }
        if(screen.orientation&&typeof screen.orientation.lock==="function"){
          await screen.orientation.lock("landscape");
          button.textContent="↻ Đang xem ngang";
        }else{
          button.textContent="↻ Hãy xoay máy ngang";
          button.title="Trên iPhone, xoay điện thoại 90°; giao diện sẽ tự căn chỉnh theo chiều ngang.";
        }
      }catch(error){
        button.textContent="↻ Hãy xoay máy ngang";
        button.title="Trình duyệt không hỗ trợ khóa xoay tự động. Xoay điện thoại 90° để giao diện tự căn chỉnh.";
      }
      refresh();
      if(!isLandscape()){
        button.textContent="↻ Hãy xoay máy ngang";
        button.title="Xoay điện thoại 90°; toàn bộ giao diện sẽ tự co giãn theo chiều ngang.";
      }
    });
    window.addEventListener("resize",refresh,{passive:true});
    window.addEventListener("orientationchange",refresh,{passive:true});
    refresh();
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",attach,{once:true});
  else attach();
})();


// XOAY NGANG: yêu cầu khóa hướng khi trình duyệt hỗ trợ; nếu không, hướng dẫn xoay máy.
(function enableLandscapeMode(){
  function attach(){
    const button=$("rotateScreen"),hint=$("rotateHint");
    if(!button||button.dataset.ready==="1")return;
    button.dataset.ready="1";
    const update=()=>{
      const landscape=window.innerWidth>window.innerHeight;
      if(landscape&&hint)hint.hidden=true;
      button.classList.toggle("is-landscape",landscape);
      button.querySelector("span").textContent=landscape?"Đang ngang":"Xoay ngang";
    };
    button.addEventListener("click",async()=>{
      try{
        if(!document.fullscreenElement&&document.documentElement.requestFullscreen){
          await document.documentElement.requestFullscreen();
        }
      }catch(_){}
      let lockedOrientation=false;
      try{
        if(screen.orientation&&screen.orientation.lock){
          await screen.orientation.lock("landscape");
          lockedOrientation=true;
        }
      }catch(_){}
      if(!lockedOrientation&&hint)hint.hidden=window.innerWidth>window.innerHeight;
      update();
    });
    window.addEventListener("resize",update,{passive:true});
    window.addEventListener("orientationchange",update,{passive:true});
    update();
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",attach,{once:true});
  else attach();
})();


// REVISION 31 — chỉ hai nút điều khiển, trạng thái thay đổi theo cuộc đua.
function syncButtons(){
  const runButton=$("start");
  const stopButton=$("stop");
  const pauseButton=$("pause");
  const state=running
    ? {icon:"❖",label:"Tạm ngưng"}
    : paused
      ? {icon:"⚔",label:"Tiếp tục"}
      : (finished||raceStopped)
        ? {icon:"⟲",label:"Bắt đầu lại"}
        : {icon:"⚔",label:"Chạy"};

  runButton.innerHTML='<span class="btn-icon" aria-hidden="true">'+state.icon+'</span><span class="btn-label">'+state.label+'</span>';
  runButton.disabled=!racers.length;

  // Nút tạm ngưng cũ được giữ ẩn để tương thích với các hàm hiện hữu.
  if(pauseButton){pauseButton.hidden=true;pauseButton.disabled=true;}

  stopButton.hidden=false;
  stopButton.disabled=!racers.length;
  stopButton.innerHTML='<span class="btn-icon" aria-hidden="true">'+((finished||raceStopped)?"☯":"✥")+'</span><span class="btn-label">'+((finished||raceStopped)?"Khởi tạo":"Dừng")+'</span>';

  $("setupToggle").hidden=true;
  $("summon").disabled=locked||running||paused;
}

function stopRace(){
  // Dừng đồng nghĩa trở về trạng thái ban đầu như vừa tải lại trang.
  resetGame();
}

function handleStopOrSetup(){
  if(finished||raceStopped){
    setSettingsLocked(false);
    setSetupPanel(true);
    return;
  }
  stopRace();
}
