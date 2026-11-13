
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
  // Khi có hiệu ứng, luôn hiển thị hệ số tốc độ dù thứ hạng không đổi.
  // Tăng tốc dùng mũi tên xanh; giảm tốc dùng mũi tên đỏ.
  if(racer.effectTimer>0){
   const multiplier=racer.speedMultiplier||1;
   const direction=multiplier>=1?"up":"down";
   racer.rankChangeText=newRank+"|"+direction+"|"+multiplier.toFixed(1);
   racer.rankChangeTimer=racer.effectTimer;
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

// Giới hạn tốc độ vẽ để Safari/iPhone không phải dựng lại toàn bộ
// quảng trường, khán đài và tiểu cảnh camera ở cả 60 khung hình/giây.
let lastCanvasRenderAt = 0;
let canvasRenderDisabled = false;

function frame(time) {
  const dt = lastTime
    ? Math.min((time - lastTime) / 1000, .05)
    : 0;

  lastTime = time;
  sceneTime = time;

  if (running && !paused && !finished) {
    if (countdown > 0) {
      countdownAccumulator += dt;

      while (countdown > 0 && countdownAccumulator >= 1) {
        countdownAccumulator -= 1;
        countdown--;

        if (countdown > 0) {
          $("status").textContent = `Bắt đầu sau ${countdown}...`;
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

    if (started && countdown === 0 && !finished) updateRace(dt);
  }

  updateParticles(dt);
  eventTextLife = Math.max(0, eventTextLife - dt);
  finishMessageLife = Math.max(0, finishMessageLife - dt);
  advanceFinishAnnouncements();

  // 20 FPS khi chờ, 30 FPS khi đua. Logic thời gian vẫn cập nhật mỗi RAF.
  const renderInterval = running && !paused ? 1000 / 30 : 1000 / 20;
  if (!canvasRenderDisabled && (!lastCanvasRenderAt || time - lastCanvasRenderAt >= renderInterval)) {
    lastCanvasRenderAt = time;
    try {
      render(time);
    } catch (error) {
      canvasRenderDisabled = true;
      console.error("Vạn Kiếm Phi Tiên: lỗi khi dựng khung hình", error);
      const status = $("status");
      if (status) status.textContent = "Lỗi hiển thị cảnh — vui lòng tải lại trang.";
    }
  }

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
  const typed=getInputNames();
  if(typed.length===1){$("lockNotice").textContent="Cần ít nhất 2 tiên nhân. Hãy nhập thêm một tên hoặc xóa danh sách để tạo theo số lượng."; $("names").focus();return;}
  const amount=getRandomQuantity();const finalNames=typed.length?typed:generateCultivationNames(amount);
  if(finalNames.length<2){$("lockNotice").textContent="Đại hội cần tối thiểu 2 tiên nhân mới có thể khởi tạo.";return;}
  if(finalNames.length>100){$("lockNotice").textContent="Tối đa 100 tiên nhân. Hãy rút gọn danh sách rồi triệu hồi lại.";return;}
  racers=finalNames.map((name,index)=>createRacer(name,index));if(window.CultivationMusic)window.CultivationMusic.setPhase("setup");raceStopped=false;
  racers.forEach(r=>{r.swordStyle=randInt(0,11);r.swordColor=randInt(0,9);if(r.gender==="female")r.swordColor=randInt(0,3);else r.swordColor=randInt(4,7);});
  duration=Number($("speed").value);elapsed=0;running=false;paused=false;started=false;finished=false;countdown=0;countdownAccumulator=0;eventClock=0;nextEvent=rand(5,9);
  eventText="";eventTextLife=0;finishQueue=[];cameraFocusId=null;finishEndAnnouncementPending=false;finishEndAnnouncementShown=false;finishMessage="";finishMessageLife=0;particles=[];assignFinishTimes();
  $("status").textContent="Đã triệu hồi";$("lockNotice").textContent="Tiếp theo: Nhấn Chạy để khai mở cuộc đua.";$("leaderName").textContent="Đang chờ cuộc đua";$("leaderProgress").textContent="--";setSettingsLocked(false);$("leaderEffect").textContent="";collapseSetupPanel();syncButtons();render(performance.now());
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
  assignFinishTimes();started=false;finished=false;paused=false;running=true;if(window.CultivationMusic)window.CultivationMusic.setPhase("race");
  $("status").textContent="Bắt đầu sau 3...";
  $("leaderName").textContent="Đang chờ cuộc đua";$("leaderProgress").textContent="Chưa có thứ hạng";
  setSettingsLocked(true);$("lockNotice").textContent="Tiếp theo: Chờ đếm ngược rồi theo dõi cuộc đua.";syncButtons();
}
function togglePause(){if(!running||finished)return;running=false;paused=true;if(window.CultivationMusic)window.CultivationMusic.pause();$("status").textContent="Đang tạm dừng";$("lockNotice").textContent="Cuộc đua đang tạm dừng. Nhấn Tiếp tục để xem tiếp.";syncButtons();}
function resumeRace(){if(!paused||finished)return;paused=false;running=true;if(window.CultivationMusic)window.CultivationMusic.resume();$("status").textContent=started?"Đang tranh phong":"Bắt đầu sau "+countdown+"...";$("lockNotice").textContent=started?"Cuộc đua đang tiếp tục. Theo dõi nhân vật dẫn đầu.":"Tiếp theo: Chờ đếm ngược rồi theo dõi cuộc đua.";syncButtons();}
function finishRace(){
 if(window.CultivationMusic)window.CultivationMusic.setPhase("award");
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
  if(window.CultivationMusic)window.CultivationMusic.setPhase("setup");
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
  const total=Math.min(3,racers.length);
  $("leaderName").textContent="Ban thưởng Top "+total+" Tiên Hội";
  $("leaderProgress").textContent="TOP "+total+" TIÊN HỘI";
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
 const rankArrow=racer.rankMovementTimer>0&&racer.rankMovement
  ? (racer.rankMovement==="up"?'<span class="camera-rank-up">↑</span>':'<span class="camera-rank-down">↓</span>')
  : "";
 const hasSpeedEffect=racer.effectTimer>0&&Math.abs((racer.speedMultiplier||1)-1)>.001;
 const speedText=hasSpeedEffect
  ? '<small class="'+((racer.speedMultiplier||1)>=1?'camera-speed-up':'camera-speed-down')+'">× '+(racer.speedMultiplier||1).toFixed(1)+' · '+Math.max(0,racer.effectTimer).toFixed(1)+'s</small>'
  : "";
 $("leaderProgress").innerHTML='Hạng '+rank+' '+rankArrow+' '+speedText;
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
    // Chỉ kéo bằng chuột trên màn hình rộng; thao tác chạm trên điện thoại
    // phải được dành cho cuộn trang và thu phóng trình duyệt.
    camera.style.touchAction="auto";
    camera.addEventListener("pointerdown",event=>{
      if(event.pointerType!=="mouse"||window.matchMedia("(max-width:760px)").matches)return;
      if(event.button!==0)return;
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
      const title=event.target.closest&&event.target.closest(".game-setup .setup-title-wrap");
      if(title){
        const panel=title.closest(".game-setup");
        if(panel&&panel.classList.contains("is-minimized")){
          panel.classList.remove("is-minimized");
          panel.hidden=false;
          const control=panel.querySelector(".window-minimize");
          if(control){
            control.textContent="−";
            control.setAttribute("aria-expanded","true");
            control.setAttribute("aria-label","Thu nhỏ bảng triệu hồi");
            control.title="Thu nhỏ";
          }
          $("setupToggle").hidden=true;
          event.preventDefault();
          event.stopPropagation();
          return;
        }
      }
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
    ? {art:"pause",label:"Tạm ngưng"}
    : paused
      ? {art:"sword",label:"Tiếp tục"}
      : (finished||raceStopped)
        ? {art:"sword",label:"Bắt đầu lại"}
        : {art:"sword",label:"Chạy"};

  // Họa tiết vector tự vẽ riêng cho Vạn Kiếm Phi Tiên, không dùng bộ icon.
  const artwork={
    sword:`<svg class="cultivation-art art-sword" viewBox="0 0 64 120" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="swordSteelFinal" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#718f8b"/><stop offset=".22" stop-color="#e8f4e8"/><stop offset=".5" stop-color="#fffef0"/><stop offset=".78" stop-color="#b7d2c5"/><stop offset="1" stop-color="#58756f"/></linearGradient>
        <linearGradient id="swordGoldFinal" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff4c9"/><stop offset=".48" stop-color="#d6ad62"/><stop offset="1" stop-color="#80572f"/></linearGradient>
        <linearGradient id="swordGripFinal" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#9b7847"/><stop offset=".5" stop-color="#23463a"/><stop offset="1" stop-color="#b18a50"/></linearGradient>
        <filter id="swordGlowFinal" x="-100%" y="-30%" width="300%" height="160%"><feGaussianBlur stdDeviation="3"/></filter>
      </defs>
      <path d="M32 2 42 70 32 83 22 70Z" fill="#8fe5d2" opacity=".3" filter="url(#swordGlowFinal)"/>
      <path d="M32 3 40 68 32 81 24 68Z" fill="url(#swordSteelFinal)" stroke="#fff0c5" stroke-width="1.5" stroke-linejoin="round"/>
      <path d="M32 7 36 67 32 75Z" fill="#fff" opacity=".78"/>
      <path d="M32 7 28 67 32 75Z" fill="#5b8179" opacity=".34"/>
      <path d="M32 10 32 76" stroke="#fff" stroke-width="1.1" opacity=".9"/>
      <path d="M17 72Q25 66 32 72Q39 66 47 72L43 80Q32 76 21 80Z" fill="url(#swordGoldFinal)" stroke="#fff0c4" stroke-width="1.4" stroke-linejoin="round"/>
      <path d="M22 74 32 77 42 74M32 73v9" stroke="#fff7d7" stroke-width="1" fill="none"/>
      <path d="M29 80 35 80 36 103 32 109 28 103Z" fill="url(#swordGripFinal)" stroke="#e8d19a" stroke-width="1.2"/>
      <path d="m29 85 6 4m-6 3 6 4m-6 3 6 4" stroke="#f0d7a0" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M32 107 26 113 32 118 38 113Z" fill="url(#swordGoldFinal)" stroke="#fff0c5" stroke-width="1.3"/>
      <circle cx="32" cy="113" r="2" fill="#e7fff0"/>
      <path d="M14 23 19 18M50 23 45 18M12 44 18 42M52 44 46 42" stroke="#b8f4e2" stroke-width="1.5" stroke-linecap="round" opacity=".8"/>
    </svg>`,
    pause:`<svg class="cultivation-art art-pause" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <path d="M18 13 25 8 28 18 25 46 19 53 15 45Z" fill="#d9bd7e" stroke="#fff0c6" stroke-width="1.2" stroke-linejoin="round"/>
      <path d="M46 13 39 8 36 18 39 46 45 53 49 45Z" fill="#a9c9ae" stroke="#e4f0cf" stroke-width="1.2" stroke-linejoin="round"/>
      <path d="m18 18 7 2-2 22-5 5-2-5Z" fill="#fff0bd" opacity=".38"/>
      <path d="m46 18-7 2 2 22 5 5 2-5Z" fill="#e9f7dc" opacity=".35"/>
      <path d="M12 8q7-5 13 0M39 8q6-5 13 0M12 56q7 5 13 0M39 56q6 5 13 0" fill="none" stroke="#e5c77f" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M8 31q-4-5 0-10M56 31q4-5 0-10M8 38q-4 5 0 10M56 38q4 5 0 10" fill="none" stroke="#8ed8c0" stroke-width="1.4" stroke-linecap="round"/>
      <path d="M32 4v5m0 46v5" stroke="#f7e4b4" stroke-width="1.4" stroke-linecap="round"/>
      <path d="m29 7 3-3 3 3m-6 50 3 3 3-3" fill="none" stroke="#d9b66d" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    return:`<svg class="cultivation-art art-return" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <path d="M47 18A22 22 0 0 0 10 29" fill="none" stroke="#d9b66d" stroke-width="2.5" stroke-linecap="round"/>
      <path d="m8 17 2 13 12-4" fill="none" stroke="#f4dda4" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M17 43 47 13M40 10l8 3 3 8" fill="none" stroke="#e8d19a" stroke-width="2" stroke-linecap="round"/>
      <path d="m14 49 6-6 7 7-6 6Z" fill="#b58a4b" stroke="#f4dda4" stroke-width="1"/>
      <path d="M48 42q5 5 10 3M7 38q-3 5 0 9" fill="none" stroke="#8ed8c0" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`,
    stop:`<svg class="cultivation-art art-stop" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <defs><linearGradient id="stopJadeGold" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff0c2"/><stop offset=".55" stop-color="#c99c55"/><stop offset="1" stop-color="#79512d"/></linearGradient></defs>
      <path d="M32 5 39 17 53 11 47 25 60 32 47 39 53 53 39 47 32 60 25 47 11 53 17 39 4 32 17 25 11 11 25 17Z" fill="none" stroke="url(#stopJadeGold)" stroke-width="2.6" stroke-linejoin="round"/>
      <rect x="23" y="23" width="18" height="18" rx="2" fill="#b88b49" stroke="#fff0c6" stroke-width="1.8"/>
      <rect x="27" y="27" width="10" height="10" fill="#183d34" stroke="#e9d39a" stroke-width="1.2"/>
      <path d="M32 13v7m0 24v7M13 32h7m24 0h7" stroke="#8ed8c0" stroke-width="2" stroke-linecap="round"/>
      <circle cx="32" cy="32" r="3" fill="#fff4d0"/>
    </svg>`,
    setup:`<svg class="cultivation-art art-setup" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="summonJade" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#e6f5c9"/><stop offset=".28" stop-color="#65b99a"/><stop offset=".7" stop-color="#1d6654"/><stop offset="1" stop-color="#0d382f"/></linearGradient>
        <linearGradient id="summonGold" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff2bd"/><stop offset=".5" stop-color="#d4a85c"/><stop offset="1" stop-color="#80572e"/></linearGradient>
      </defs>
      <path d="M32 4 37 13 48 10 45 21 56 27 46 34 50 46 38 45 32 57 26 45 14 46 18 34 8 27 19 21 16 10 27 13Z" fill="none" stroke="url(#summonGold)" stroke-width="1.7" opacity=".9"/>
      <path d="M17 24Q32 19 47 24L44 42Q41 50 32 51Q23 50 20 42Z" fill="url(#summonJade)" stroke="#f3dda0" stroke-width="2"/>
      <path d="M15 24Q32 17 49 24L46 29Q32 34 18 29Z" fill="#d5b36b" stroke="#fff0bd" stroke-width="1.5"/>
      <ellipse cx="32" cy="25" rx="13" ry="4" fill="#103e35" stroke="#bce7c8" stroke-width="1.2"/>
      <path d="M21 34Q32 39 43 34M23 40Q32 44 41 40" fill="none" stroke="#b8e9c9" stroke-width="1.3" opacity=".8"/>
      <path d="M23 48 20 55M41 48 44 55M19 55h26" fill="none" stroke="url(#summonGold)" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M32 3Q25 10 32 17Q39 10 32 3Z" fill="#eaffcf" stroke="#8de2c2" stroke-width="1.2"/>
      <path d="M7 14q7 0 8 7M57 14q-7 0-8 7" fill="none" stroke="#9ce7ce" stroke-width="1.5" stroke-linecap="round"/>
      <circle cx="11" cy="10" r="2" fill="#fff0bc"/><circle cx="53" cy="10" r="2" fill="#fff0bc"/>
    </svg>`
  };
  runButton.hidden=false;
  stopButton.hidden=false;
  runButton.innerHTML='<span class="btn-icon">'+artwork[state.art]+'</span><span class="btn-label">'+state.label+'</span>';
  runButton.setAttribute("aria-label",state.label);
  runButton.title=state.label;
  runButton.disabled=!racers.length;

  if(pauseButton){pauseButton.hidden=true;pauseButton.disabled=true;}

  stopButton.hidden=false;
  const isSetup=finished||raceStopped;
  stopButton.disabled=!racers.length;
  stopButton.innerHTML='<span class="btn-icon">'+artwork[isSetup?"setup":"stop"]+'</span><span class="btn-label">'+(isSetup?"Khởi tạo":"Dừng")+'</span>';
  stopButton.setAttribute("aria-label",isSetup?"Khởi tạo":"Dừng");
  stopButton.title=isSetup?"Khởi tạo":"Dừng";

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


// Đổi sang nhập số lượng sẽ xóa danh sách tên thủ công.
(function syncManualNamesWithQuantity(){
 function attach(){const namesInput=$("names"),quantityInput=$("quantity"),notice=$("lockNotice");if(!namesInput||!quantityInput||quantityInput.dataset.nameSyncReady==="1")return;quantityInput.dataset.nameSyncReady="1";
  const clearManualNames=()=>{if(!namesInput.value.trim())return;namesInput.value="";if(notice)notice.textContent="Đã chuyển sang tạo theo số lượng; danh sách tên thủ công đã được xóa.";};
  quantityInput.addEventListener("input",clearManualNames);quantityInput.addEventListener("change",clearManualNames);
  namesInput.addEventListener("input",()=>{if(!notice)return;const count=getInputNames().length;if(count===1)notice.textContent="Cần nhập thêm ít nhất 1 tên nữa để khởi tạo đại hội.";else if(count>=2)notice.textContent="Đã nhập "+count+" tiên nhân. Có thể khởi tạo đại hội.";});
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",attach,{once:true});else attach();
})();


// REVISION 33 — thiên quang giáng thế, từng tiên nhân hiện thân theo thứ tự.
let summonArrivalStartedAt=0;
let summonRitualStartedAt=0;
const summonRitualDuration=2.65;
let summonRacersBeforeClick=null;
let summonBatchSize=1;
const summonGroupStep=.30;
const summonRevealDuration=.42;
const summonBeamDuration=.78;
// Tối đa 12 lượt giáng lâm; ít người đi riêng, đông người tự chia nhóm tăng dần.
function getSummonBatchSize(count){
  return Math.max(1,Math.ceil(count/12));
}
function getSummonGroupDelay(index){
  return .18+Math.floor(Math.max(0,index)/summonBatchSize)*summonGroupStep;
}
$("summon").addEventListener("click",()=>{summonRacersBeforeClick=racers;},true);
$("summon").addEventListener("click",()=>{
  if(racers.length>=2&&racers!==summonRacersBeforeClick&&!running&&!paused){
    summonRitualStartedAt=performance.now();
    summonArrivalStartedAt=summonRitualStartedAt+summonRitualDuration*1000;
    summonBatchSize=getSummonBatchSize(racers.length);
    const groupCount=Math.ceil(racers.length/summonBatchSize);
    $("status").textContent=summonBatchSize===1
      ?"Thiên quang giáng thế · tiên nhân lần lượt hiện thân"
      :`Thiên quang giáng thế · mỗi lượt ${summonBatchSize} tiên nhân · ${groupCount} lượt`;
    $("lockNotice").textContent=`Đã triệu hồi ${racers.length} tiên nhân. Nhấn Chạy để bắt đầu.`;
  }
});
const summonOriginalDrawRacer=drawRacer;
drawRacer=function(target,racer,x,y,scale,time){
  if(target===ctx&&summonArrivalStartedAt){
    const index=racers.indexOf(racer);
    const age=(time-summonArrivalStartedAt)/1000;
    const delay=getSummonGroupDelay(index);
    if(age<delay)return;
    const reveal=Math.max(0,Math.min(1,(age-delay)/summonRevealDuration));
    target.save();target.globalAlpha*=reveal;
    summonOriginalDrawRacer(target,racer,x,y,scale*(.82+.18*reveal),time);
    target.restore();return;
  }
  summonOriginalDrawRacer(target,racer,x,y,scale,time);
};
const summonOriginalDrawRacerName=drawRacerName;
drawRacerName=function(racer,x,y,scale){
  if(summonArrivalStartedAt){
    const index=racers.indexOf(racer);
    const age=(performance.now()-summonArrivalStartedAt)/1000;
    const reveal=Math.max(0,Math.min(1,(age-getSummonGroupDelay(index))/summonRevealDuration));
    if(reveal<=0)return;
    ctx.save();ctx.globalAlpha*=reveal;summonOriginalDrawRacerName(racer,x,y,scale);ctx.restore();return;
  }
  summonOriginalDrawRacerName(racer,x,y,scale);
};
function drawSummonRitual(time){
  if(!summonRitualStartedAt)return;
  const age=(time-summonRitualStartedAt)/1000;
  if(age<0)return;
  if(age>=summonRitualDuration){summonRitualStartedAt=0;return;}
  const p=Math.max(0,Math.min(1,age/summonRitualDuration));
  const pulse=.78+.22*Math.sin(age*8);
  const cx=W*.5,cy=H*.49;
  ctx.save();
  ctx.globalCompositeOperation="screen";
  // Đại pháp trận của chưởng môn mở ra dưới quảng trường.
  ctx.save();ctx.translate(cx,cy);ctx.rotate(age*.72);
  ctx.globalAlpha=(.35+.5*Math.sin(p*Math.PI))*pulse;
  ctx.strokeStyle="#b8f7df";ctx.shadowColor="#8fffe0";ctx.shadowBlur=22;
  ctx.lineWidth=2.2;ctx.beginPath();ctx.ellipse(0,0,145+10*Math.sin(age*5),43+4*Math.sin(age*5),0,0,Math.PI*2);ctx.stroke();
  ctx.lineWidth=1.2;ctx.strokeStyle="#ffe5a8";
  ctx.beginPath();ctx.ellipse(0,0,116,32,0,0,Math.PI*2);ctx.stroke();
  for(let i=0;i<16;i++){
    const a=i*Math.PI/8, r=i%2?130:145;
    ctx.save();ctx.rotate(a);ctx.translate(r,0);
    ctx.beginPath();ctx.moveTo(-5,0);ctx.lineTo(0,-5);ctx.lineTo(5,0);ctx.lineTo(0,5);ctx.closePath();ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
  // Chưởng môn đứng trung tâm, bốn trưởng lão hai bên cùng kết ấn truyền công.
  const masters=[{x:cx,y:cy-94,scale:1.18,chief:true},{x:cx-150,y:cy-55,scale:.92},{x:cx-88,y:cy-78,scale:.88},{x:cx+88,y:cy-78,scale:.88},{x:cx+150,y:cy-55,scale:.92}];
  masters.forEach((m,i)=>{
    const bob=Math.sin(age*5+i*.8)*2;
    ctx.save();ctx.translate(m.x,m.y+bob);ctx.globalAlpha*=Math.min(1,p*3);
    // Áo bào và thân pháp sư.
    ctx.fillStyle=m.chief?"#d9bd78":"#b7d9c5";
    ctx.shadowColor=m.chief?"#ffe6a4":"#a8ffe0";ctx.shadowBlur=13;
    ctx.beginPath();ctx.moveTo(-7,-15);ctx.lineTo(7,-15);ctx.lineTo(16,19);ctx.lineTo(-16,19);ctx.closePath();ctx.fill();
    ctx.shadowBlur=5;ctx.fillStyle=m.chief?"#fff0bd":"#e9f4dc";
    ctx.beginPath();ctx.arc(0,-22,7,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle=m.chief?"#fff0b5":"#c8f7e2";ctx.lineWidth=3;ctx.lineCap="round";
    ctx.beginPath();ctx.moveTo(-7,-9);ctx.lineTo(-20,-19);ctx.moveTo(7,-9);ctx.lineTo(20,-19);ctx.stroke();
    // Pháp lực từ hai tay hội tụ về pháp trận.
    ctx.strokeStyle=m.chief?"rgba(255,224,154,.9)":"rgba(157,255,218,.78)";
    ctx.lineWidth=m.chief?3:2;ctx.shadowColor=ctx.strokeStyle;ctx.shadowBlur=12;
    ctx.beginPath();ctx.moveTo(-20,-19);ctx.quadraticCurveTo((cx-m.x)*.45,-45,cx-m.x,cy-m.y+4);ctx.stroke();
    ctx.restore();
  });
  // Linh lực tụ hội thành cột sáng ở tâm trận, báo hiệu thiên quang sắp giáng.
  const gather=Math.min(1,p*1.35);
  ctx.globalAlpha=.2+.65*gather;
  const glow=ctx.createRadialGradient(cx,cy,2,cx,cy,100+50*gather);
  glow.addColorStop(0,"rgba(255,250,207,.8)");glow.addColorStop(.35,"rgba(147,255,220,.28)");glow.addColorStop(1,"rgba(120,255,220,0)");
  ctx.fillStyle=glow;ctx.beginPath();ctx.ellipse(cx,cy,100+50*gather,32+15*gather,0,0,Math.PI*2);ctx.fill();
  ctx.globalAlpha=.55*gather;
  ctx.strokeStyle="#fff0bd";ctx.lineWidth=2;ctx.shadowColor="#baffdf";ctx.shadowBlur=18;
  ctx.beginPath();ctx.moveTo(cx,cy-165*gather);ctx.lineTo(cx,cy-38);ctx.stroke();
  for(let i=0;i<24;i++){
    const a=i*2.399+age*2.4, r=24+(i%6)*17+(1-gather)*34;
    const x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r*.28;
    ctx.globalAlpha=(.2+.65*gather)*(0.5+0.5*Math.sin(age*9+i));
    ctx.fillStyle=i%3?"#baffdf":"#fff0bd";ctx.shadowBlur=12;
    ctx.beginPath();ctx.arc(x,y,1.2+(i%3)*.6,0,Math.PI*2);ctx.fill();
  }
  ctx.restore();
}
function drawSummonArrival(time){
  if(!summonArrivalStartedAt||time<summonArrivalStartedAt)return;
  const age=Math.max(0,(time-summonArrivalStartedAt)/1000);
  const lastDelay=getSummonGroupDelay(Math.max(0,racers.length-1));
  if(age>lastDelay+1.05){summonArrivalStartedAt=0;return;}
  ctx.save();
  racers.forEach((racer,index)=>{
    const delay=getSummonGroupDelay(index);
    const local=age-delay;
    if(local<-.22||local>summonBeamDuration)return;
    const x=racerX(racer),y=laneY(index);
    const progress=Math.max(0,Math.min(1,(local+.22)/.55));
    const fade=local<0?Math.max(0,1+local/.22):Math.max(0,1-local/summonBeamDuration);
    const beamBottom=-90+(y+90)*progress;
    ctx.save();ctx.globalAlpha=Math.max(0,fade)*.92;
    // Cột thiên quang phóng thẳng từ tầng mây xuống vị trí giáng lâm.
    const beam=ctx.createLinearGradient(x,0,x,Math.max(1,beamBottom));
    beam.addColorStop(0,"rgba(255,255,235,0)");
    beam.addColorStop(.12,"rgba(210,255,239,.18)");
    beam.addColorStop(.72,"rgba(184,246,224,.62)");
    beam.addColorStop(1,"rgba(255,241,190,.92)");
    ctx.fillStyle=beam;ctx.shadowColor="#b9ffe9";ctx.shadowBlur=24;
    ctx.beginPath();ctx.moveTo(x-5,0);ctx.lineTo(x+5,0);ctx.lineTo(x+18,beamBottom);ctx.lineTo(x-18,beamBottom);ctx.closePath();ctx.fill();
    ctx.shadowBlur=0;ctx.fillStyle="rgba(255,255,232,.72)";ctx.fillRect(x-1.2,0,2.4,Math.max(0,beamBottom));
    // Tia sáng phụ kéo dài như nét mực trong tranh manhua.
    for(let ray=-2;ray<=2;ray++){
      ctx.globalAlpha=Math.max(0,fade)*(.12+Math.abs(ray)*.025);
      ctx.fillStyle=ray%2?"#c8f8e7":"#fff0bd";
      ctx.fillRect(x+ray*5,0,ray===0?1.5:.8,Math.max(0,beamBottom-18));
    }
    ctx.globalAlpha=Math.max(0,fade);
    // Một trận đồ duy nhất dưới chân: không còn hai vòng tròn đồng tâm.
    const sealScale=.72+Math.min(1,Math.max(0,local)/.28)*.28;
    ctx.translate(x,y+10);
    ctx.scale(sealScale,sealScale);
    ctx.strokeStyle="#f0d99d";ctx.lineWidth=2;ctx.shadowColor="#b8ffe7";ctx.shadowBlur=16;
    ctx.beginPath();ctx.ellipse(0,0,31,8,0,0,Math.PI*2);ctx.stroke();
    // Nét phù văn ngắn nằm trên cùng một trận đồ, không tạo thêm vòng bao.
    ctx.shadowBlur=8;ctx.lineWidth=1.2;ctx.strokeStyle="rgba(190,248,222,.95)";
    for(let mark=0;mark<8;mark++){
      const a=mark*Math.PI/4;
      const px=Math.cos(a)*31,py=Math.sin(a)*8;
      ctx.save();ctx.translate(px,py);ctx.rotate(a);
      ctx.beginPath();ctx.moveTo(-3,-2);ctx.lineTo(0,2);ctx.lineTo(3,-2);ctx.stroke();
      ctx.restore();
    }
    ctx.fillStyle="#fff1bd";ctx.shadowBlur=14;
    ctx.beginPath();ctx.moveTo(0,-5);ctx.lineTo(3,0);ctx.lineTo(0,5);ctx.lineTo(-3,0);ctx.closePath();ctx.fill();
    ctx.restore();
  });
  ctx.restore();
}
const renderBeforeSummonArrival=render;
render=function(time){renderBeforeSummonArrival(time);drawSummonRitual(time);drawSummonArrival(time);};


// REVISION 34 — xoay pháp luân: vòng ngoài chọn số tiên nhân, vòng trong chọn thời lượng.
(function enableRotarySummonDial(){
  const quantity=$("quantity"),speed=$("speed"),button=$("summon");
  const qValue=$("dialQuantityValue"),tValue=$("dialDurationValue");
  const qRing=document.querySelector('[data-dial="quantity"]');
  const tRing=document.querySelector('[data-dial="duration"]');
  if(!quantity||!speed||!button||!qRing||!tRing)return;
  const durations=[30,60,120,180,300];
  let qRotation=0,tRotation=0,drag=null;
  const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
  function refresh(){
    const q=clamp(Number(quantity.value)||10,2,100);
    const t=durations.indexOf(Number(speed.value));
    qValue.textContent=String(q);
    tValue.textContent=(Number(speed.value)||60)+"s";
    qRing.setAttribute("aria-valuenow",String(q));
    tRing.setAttribute("aria-valuenow",String(Math.max(0,t)));
    qRing.style.transform="translate(-50%,-50%) rotate("+qRotation+"deg)";
    tRing.style.transform="translate(-50%,-50%) rotate("+tRotation+"deg)";
    const disabled=locked||running||paused;
    [qRing,tRing].forEach(r=>{r.style.pointerEvents=disabled?"none":"auto";r.setAttribute("aria-disabled",String(disabled));});
  }
  function pointAngle(event,ring){
    const rect=ring.getBoundingClientRect();
    return Math.atan2(event.clientY-(rect.top+rect.height/2),event.clientX-(rect.left+rect.width/2))*180/Math.PI;
  }
  function angleDelta(next,previous){
    let d=next-previous;
    if(d>180)d-=360;
    if(d< -180)d+=360;
    return d;
  }
  function setQuantity(next){
    const value=clamp(Math.round(next),2,100);
    quantity.value=String(value);
    quantity.dispatchEvent(new Event("input",{bubbles:true}));
    refresh();
  }
  function setDuration(index){
    const value=durations[clamp(Math.round(index),0,durations.length-1)];
    speed.value=String(value);
    speed.dispatchEvent(new Event("change",{bubbles:true}));
    refresh();
  }
  [qRing,tRing].forEach(ring=>{
    ring.addEventListener("pointerdown",event=>{
      if(locked||running||paused)return;
      event.preventDefault();
      ring.setPointerCapture(event.pointerId);
      drag={ring,angle:pointAngle(event,ring),remainder:0};
    });
    ring.addEventListener("pointermove",event=>{
      if(!drag||drag.ring!==ring)return;
      const next=pointAngle(event,ring);
      drag.remainder+=angleDelta(next,drag.angle);
      drag.angle=next;
      if(ring===qRing){
        const step=360/98;
        const steps=drag.remainder>0?Math.floor(drag.remainder/step):Math.ceil(drag.remainder/step);
        if(steps){setQuantity(Number(quantity.value)+steps);drag.remainder-=steps*step;qRotation+=steps*step;}
      }else{
        const step=72;
        const steps=drag.remainder>0?Math.floor(drag.remainder/step):Math.ceil(drag.remainder/step);
        if(steps){setDuration(durations.indexOf(Number(speed.value))+steps);drag.remainder-=steps*step;tRotation+=steps*step;}
      }
      refresh();
    });
    const end=()=>{if(drag&&drag.ring===ring)drag=null;};
    ring.addEventListener("pointerup",end);
    ring.addEventListener("pointercancel",end);
    ring.addEventListener("lostpointercapture",end);
    ring.addEventListener("keydown",event=>{
      if(locked||running||paused)return;
      if(!["ArrowUp","ArrowRight","ArrowDown","ArrowLeft"].includes(event.key))return;
      event.preventDefault();
      const step=(event.key==="ArrowUp"||event.key==="ArrowRight")?1:-1;
      if(ring===qRing)setQuantity(Number(quantity.value)+step);
      else setDuration(durations.indexOf(Number(speed.value))+step);
    });
  });
  quantity.addEventListener("input",refresh);
  quantity.addEventListener("change",refresh);
  speed.addEventListener("change",refresh);
  button.addEventListener("click",refresh,true);
  refresh();
  const oldSyncButtons=syncButtons;
  syncButtons=function(){oldSyncButtons();refresh();};
  const oldSetSettingsLocked=setSettingsLocked;
  setSettingsLocked=function(value){oldSetSettingsLocked(value);refresh();};
})();


// REVISION 35 — vạch chỉ số, xoay mượt hơn, chạm thông số để nhập/chọn trực tiếp.
(function refineRotarySummonDial(){
 const q=$("quantity"),speed=$("speed"),names=$("names");
 const qRing=document.querySelector('[data-dial="quantity"]'),tRing=document.querySelector('[data-dial="duration"]');
 const qButton=$("openQuantityDial"),tButton=$("openDurationDial"),editor=$("dialEditor");
 const editorLabel=$("dialEditorLabel"),editorInput=$("dialEditorInput"),editorSelect=$("dialEditorSelect");
 const done=$("dialEditorDone"),qText=$("dialQuantityValue"),tText=$("dialDurationValue");
 if(!q||!speed||!names||!qRing||!tRing||!editor)return;
 const durations=[30,60,120,180,300];
 let activeEditor="",drag=null;
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 function update(){
   const typed=getInputNames().length;
   if(typed){q.value=String(clamp(typed,2,100));}
   else q.value=String(clamp(Number(q.value)||10,2,100));
   qText.textContent=q.value+(typed>100?"+":"");
   tText.textContent=(Number(speed.value)||60)+"s";
   qRing.setAttribute("aria-valuenow",q.value);
   tRing.setAttribute("aria-valuenow",String(Math.max(0,durations.indexOf(Number(speed.value)))));
   const disabled=locked||running||paused;
   [qRing,tRing,qButton,tButton].forEach(el=>{if(el)el.setAttribute("aria-disabled",String(disabled));});
 }
 function openEditor(kind){
   if(locked||running||paused)return;
   activeEditor=kind;editor.hidden=false;
   const isQ=kind==="quantity";
   editorLabel.textContent=isQ?"Nhập số tiên nhân (2–100)":"Chọn thời lượng cuộc đua";
   editorInput.hidden=!isQ;editorSelect.hidden=isQ;
   if(isQ){editorInput.value=q.value;editorInput.min="2";editorInput.max="100";editorInput.focus();editorInput.select();}
   else{editorSelect.value=speed.value;editorSelect.focus();}
 }
 function closeEditor(){
   if(activeEditor==="quantity"){
     const value=clamp(Math.round(Number(editorInput.value)||2),2,100);
     q.value=String(value);q.dispatchEvent(new Event("change",{bubbles:true}));
   }else if(activeEditor==="duration"){
     speed.value=editorSelect.value;speed.dispatchEvent(new Event("change",{bubbles:true}));
   }
   editor.hidden=true;activeEditor="";update();
 }
 qButton.addEventListener("click",()=>openEditor("quantity"));
 tButton.addEventListener("click",()=>openEditor("duration"));
 done.addEventListener("click",closeEditor);
 editorInput.addEventListener("keydown",e=>{if(e.key==="Enter")closeEditor();});
 editorSelect.addEventListener("change",closeEditor);
 names.addEventListener("input",()=>{
   const count=getInputNames().length;
   q.value=String(clamp(count||10,2,100));
   if(count>100)$("lockNotice").textContent="Danh sách có "+count+" tên; tối đa 100 tiên nhân. Hãy rút gọn danh sách.";
   update();
 });
 q.addEventListener("input",update);q.addEventListener("change",update);
 speed.addEventListener("change",update);
 function syncMarkerOrientation(ring){
  const rotation=Number(ring.dataset.rotation||0);
  ring.querySelectorAll(".dial-marker").forEach(marker=>{
    marker.style.transform="translate(-50%,-50%) rotate("+(-rotation)+"deg)";
  });
 }
 function markers(ring,labels,radius){
  let layer=ring.querySelector(".dial-markers");
  if(!layer){layer=document.createElement("div");layer.className="dial-markers";ring.appendChild(layer);}
  layer.replaceChildren();
  labels.forEach((label,i)=>{
    const angle=(-90+i*360/labels.length)*Math.PI/180;
    const span=document.createElement("span");span.className="dial-marker";span.textContent=label;
    span.style.left=(50+Math.cos(angle)*radius)+"%";
    span.style.top=(50+Math.sin(angle)*radius)+"%";
    layer.appendChild(span);
  });
  syncMarkerOrientation(ring);
 }
 markers(qRing,["2","20","40","60","80","100"],43);
 markers(tRing,["30s","60s","120s","180s","300s"],43);
 function angleAt(e,ring){const r=ring.getBoundingClientRect();return Math.atan2(e.clientY-r.top-r.height/2,e.clientX-r.left-r.width/2)*180/Math.PI;}
 function delta(a,b){let d=a-b;if(d>180)d-=360;if(d< -180)d+=360;return d;}
 function begin(e,ring,kind){
   if(locked||running||paused)return;
   e.preventDefault();e.stopImmediatePropagation();
   ring.setPointerCapture(e.pointerId);
   drag={ring,kind,angle:angleAt(e,ring),carry:0};
 }
 function move(e,ring){
   if(!drag||drag.ring!==ring)return;
   e.preventDefault();e.stopImmediatePropagation();
   const next=angleAt(e,ring);drag.carry+=delta(next,drag.angle);drag.angle=next;
   const step=drag.kind==="quantity"?4:45;
   const count=drag.carry>0?Math.floor(drag.carry/step):Math.ceil(drag.carry/step);
   if(count){
     if(drag.kind==="quantity"){
       const typed=getInputNames().length;
       if(!typed){q.value=String(clamp(Number(q.value)+count,2,100));q.dispatchEvent(new Event("change",{bubbles:true}));}
     }else{
       const idx=durations.indexOf(Number(speed.value));
       speed.value=String(durations[clamp(idx+count,0,durations.length-1)]);
       speed.dispatchEvent(new Event("change",{bubbles:true}));
     }
     drag.carry-=count*step;
     const rotation=Number(ring.dataset.rotation||0)+count*step;
     ring.dataset.rotation=String(rotation);
     ring.style.transform="translate(-50%,-50%) rotate("+rotation+"deg)";
     syncMarkerOrientation(ring);
     update();
   }
 }
 [ [qRing,"quantity"],[tRing,"duration"] ].forEach(([ring,kind])=>{
   ring.addEventListener("pointerdown",e=>begin(e,ring,kind),true);
   ring.addEventListener("pointermove",e=>move(e,ring),true);
   const end=e=>{if(drag&&drag.ring===ring){e.stopImmediatePropagation();drag=null;}};
   ring.addEventListener("pointerup",end,true);ring.addEventListener("pointercancel",end,true);
   ring.addEventListener("lostpointercapture",end,true);
   ring.addEventListener("click",e=>{e.preventDefault();e.stopImmediatePropagation();},true);
 });
 const oldSync=syncButtons;
 syncButtons=function(){oldSync();update();};
 const oldLock=setSettingsLocked;
 setSettingsLocked=function(v){oldLock(v);update();};
 update();
})();
// REVISION 36 — hướng dẫn rõ nguyên nhân khi nút điều khiển đang bị khóa.
(function explainDisabledActions(){
  function refreshGuidance(){
    const start=$("start"),stop=$("stop"),summon=$("summon"),pauseButton=$("pause"),notice=$("lockNotice");
    if(!start||!stop||!summon)return;
    const hasRacers=Array.isArray(racers)&&racers.length>0;
    const reason=running
      ?"Cuộc đua đang diễn ra. Hãy nhấn Tạm ngưng hoặc Dừng trước khi thay đổi thiết lập."
      :paused
        ?"Cuộc đua đang tạm ngưng. Hãy nhấn Tiếp tục hoặc Dừng để thực hiện thao tác khác."
        :!hasRacers
          ?"Chưa có tiên nhân nên nút Chạy và Dừng đang khóa. Hãy nhập danh sách tên hoặc chọn số lượng, rồi nhấn Triệu Hồi."
          :"Đã có tiên nhân. Nhấn Chạy để bắt đầu; muốn đổi danh sách, hãy nhấn Dừng rồi Khởi tạo.";
    start.title=start.disabled?(hasRacers?"Đang chạy hoặc tạm ngưng cuộc đua.":"Hãy nhấn Triệu Hồi trước khi Chạy."):"Bắt đầu hoặc chạy lại cuộc đua";
    start.setAttribute("aria-description",start.disabled?start.title:"");
    stop.title=stop.disabled?"Chưa có tiên nhân. Hãy nhấn Triệu Hồi trước.":((finished||raceStopped)?"Mở lại thiết lập để tạo cuộc đua mới":"Dừng cuộc đua");
    stop.setAttribute("aria-description",stop.disabled?stop.title:"");
    summon.title=summon.disabled?"Không thể triệu hồi khi cuộc đua đang chạy hoặc tạm ngưng. Hãy Dừng cuộc đua trước.":"Triệu hồi tiên nhân vào trường đua";
    summon.setAttribute("aria-description",summon.disabled?summon.title:"");
    if(pauseButton){
      pauseButton.title=pauseButton.disabled?"Chỉ có thể tạm ngưng khi cuộc đua đang chạy.":(paused?"Tiếp tục cuộc đua":"Tạm ngưng cuộc đua");
      pauseButton.setAttribute("aria-description",pauseButton.disabled?pauseButton.title:"");
    }
    if(notice&&!running&&!paused)notice.textContent=reason;
  }
  const previousSync=syncButtons;
  syncButtons=function(){previousSync();refreshGuidance();};
  const previousLock=setSettingsLocked;
  setSettingsLocked=function(value){previousLock(value);refreshGuidance();};
  refreshGuidance();
})();
