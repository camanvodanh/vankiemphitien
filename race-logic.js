
"use strict";

// Khai báo trước lần updateRanking() khởi tạo ở cuối file.
let rankingOrderSignature = "";
let rankingPendingSignature = "";
let rankingPendingSince = 0;
let raceStopped = false;

// =====================================================
// PHÂN BỔ THỜI ĐIỂM VỀ ĐÍCH
// =====================================================

function assignFinishTimes() {
  if (!racers.length) return;

  // Mỗi tiên nhân nhận nhịp độ xuất phát ngẫu nhiên, không ấn định sẵn
  // người cuối hay dàn thứ hạng theo một dải thời gian cố định.
  racers.forEach(racer => {
    racer.targetFinishTime = duration * rand(.89, .995);
    racer.pacePhase = Math.random() * Math.PI * 2;
    racer.paceAmplitude = rand(.018, .042);
  });
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
  if(racer.effectCooldown>0)racer.effectCooldown=Math.max(0,racer.effectCooldown-dt);
  if(racer.pendingEffectTimer>0){
   racer.pendingEffectTimer=Math.max(0,racer.pendingEffectTimer-dt);
   if(racer.pendingEffectTimer===0&&racer.pendingEffect)activateRaceEffect(racer);
  }
  if(racer.effectTimer>0){
   racer.effectTimer=Math.max(0,racer.effectTimer-dt);
   if(racer.effectTimer===0){
    racer.speedMultiplier=1;racer.effectType="";racer.effectName="";racer.effectPolarity="";
    racer.effectCooldown=rand(VKP_DATA.effects.balance.recoverySeconds[0],VKP_DATA.effects.balance.recoverySeconds[1]);
    if(cameraFocusId===racer.id)cameraFocusId=null;
   }
  }
  const limits=VKP_DATA.effects.balance.speedLimits;
  racer.speedMultiplier=clamp(racer.speedMultiplier||1,limits.min,limits.max);
  const baseSpeed=distance/Math.max(.001,racer.targetFinishTime);
  // Nhịp phi hành dao động nhẹ theo từng cá thể, tạo cơ hội vượt lên và tụt lại
  // thay vì giữ nguyên một tốc độ tuyến tính từ đầu đến cuối.
  const paceWave=1+Math.sin(elapsed*1.65+(racer.pacePhase||0))*(racer.paceAmplitude||.025);
  racer.progress=Math.min(distance,racer.progress+baseSpeed*paceWave*dt*racer.speedMultiplier);
 });
 const rankedNow=sortedRacers();
 for(let i=0;i<rankedNow.length;i++){
  const racer=rankedNow[i],oldRank=rankBefore.get(racer.id),newRank=i+1;
  if(oldRank&&oldRank!==newRank){
   racer.rankMovement=newRank<oldRank?"up":"down";
   racer.rankMovementTimer=3.5;
  }
  if(racer.effectTimer>0){
   const multiplier=racer.speedMultiplier||1;
   const direction=multiplier>=1?"up":"down";
   racer.rankChangeText=newRank+"|"+direction+"|"+multiplier.toFixed(2);
   racer.rankChangeTimer=racer.effectTimer;
  }
 }
 racers.map((racer,index)=>({racer,index})).filter(o=>!o.racer.finished&&o.racer.progress>=distance).forEach(o=>processFinish(o.racer,o.index));
 eventClock+=dt;
 if(eventClock>=nextEvent&&elapsed<duration){triggerEvent();eventClock=0;nextEvent=rand(getRaceEffectTimingProfile(duration).eventIntervalSeconds[0],getRaceEffectTimingProfile(duration).eventIntervalSeconds[1]);}
 if(racers.length&&racers.every(racer=>racer.finished)){finishRace();return;}
 if(elapsed>=duration){racers.forEach((racer,index)=>{if(!racer.finished)processFinish(racer,index);});finishRace();}
}
// =====================================================
// ĐẾM NGƯỢC VÀ VÒNG LẶP ANIMATION
// =====================================================

// Giới hạn tốc độ vẽ để Safari/iPhone không phải dựng lại toàn bộ
// quảng trường, khán đài và tiểu cảnh camera ở cả 60 khung hình/giây.
let lastCanvasRenderAt = 0;
let canvasRenderDisabled = false; // Giữ biến tương thích; không tự khóa khi gặp lỗi render.

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

  // Hạ tải dựng hình trên điện thoại; logic cuộc đua vẫn cập nhật mỗi RAF.
  const renderInterval = running && !paused ? 1000 / 18 : 1000 / 10;
  if (!canvasRenderDisabled && (!lastCanvasRenderAt || time - lastCanvasRenderAt >= renderInterval)) {
    lastCanvasRenderAt = time;
    try {
      render(time);
    } catch (error) {
      // Không khóa vĩnh viễn canvas sau một lỗi đơn lẻ.
      // Render tiếp ở khung kế tiếp để tránh màn hình trắng/mất toàn bộ nhân vật.
      if (!window.__vkRenderErrorLogged) {
        window.__vkRenderErrorLogged = true;
        console.error("Vạn Kiếm Phi Tiên: lỗi khung hình (sẽ tự thử lại)", error);
      }
      const status = $("status");
      if (status) status.textContent = "Đang khôi phục hiển thị…";
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
  nextEvent = rand(VKP_DATA.effects.balance.waitSeconds[0], VKP_DATA.effects.balance.waitSeconds[1]);

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
  nextEvent = rand(VKP_DATA.effects.balance.waitSeconds[0], VKP_DATA.effects.balance.waitSeconds[1]);

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

// Không dựng toàn bộ đại cảnh đồng bộ trong lúc parser vừa khởi tạo trang.
// Khung hình đầu tiên sẽ được vẽ ở RAF để trình duyệt kịp hiển thị giao diện.
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
  if(finalNames.length>VKP_DATA.summoning.maximumRacers){$("lockNotice").textContent="Tối đa 100 tiên nhân. Hãy rút gọn danh sách rồi triệu hồi lại.";return;}
  racers=finalNames.map((name,index)=>createRacer(name,index));if(window.CultivationMusic)window.CultivationMusic.setPhase("setup");window.__awardMasterDepartureActive=false;raceStopped=false;
  racers.forEach(r=>{r.swordStyle=randInt(0,11);r.swordColor=randInt(0,9);if(r.gender==="female")r.swordColor=randInt(0,3);else r.swordColor=randInt(4,7);});
  duration=Number($("speed").value);elapsed=0;running=false;paused=false;started=false;finished=false;countdown=0;countdownAccumulator=0;eventClock=0;nextEvent=rand(getRaceEffectTimingProfile(duration).eventIntervalSeconds[0],getRaceEffectTimingProfile(duration).eventIntervalSeconds[1]);
  eventText="";eventTextLife=0;finishQueue=[];cameraFocusId=null;finishEndAnnouncementPending=false;finishEndAnnouncementShown=false;finishMessage="";finishMessageLife=0;particles=[];assignFinishTimes();
  $("status").textContent="Đã triệu hồi";$("lockNotice").textContent="Tiếp theo: Nhấn Chạy để khai mở cuộc đua.";$("leaderName").textContent="Đang chờ cuộc đua";$("leaderProgress").textContent="--";setSettingsLocked(false);$("leaderEffect").textContent="";collapseSetupPanel();syncButtons();
  // Không dựng Canvas đồng bộ trong sự kiện chạm; ưu tiên phản hồi nút trên iPhone.
  lastCanvasRenderAt=0;
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
  if(!summonVisualReady){$("lockNotice").textContent="Chưởng môn vẫn đang triệu hồi. Hãy chờ tất cả tiên nhân hiện thân rồi mới có thể Chạy.";return;}
  if(!racers.length)return;
  if(running){togglePause();return;}
  if(paused){resumeRace();return;}
  startRace();
}
function startRace(){
  if(!summonVisualReady||!racers.length||running||paused)return;
  duration=Number($("speed").value);
  raceStopped=false;
  elapsed=0;countdown=3;countdownAccumulator=0;eventClock=0;nextEvent=rand(getRaceEffectTimingProfile(duration).eventIntervalSeconds[0],getRaceEffectTimingProfile(duration).eventIntervalSeconds[1]);
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
 racers.forEach(r=>{r.rankMovement="";r.rankMovementTimer=0;r.rankChangeText="";r.rankChangeTimer=0;});
 eventText="";eventTextLife=0;finishMessage="";finishMessageLife=0;
 $("status").textContent="Đại hội kết thúc · Vinh danh top 3";
 $("pause").textContent="Tiếp";
 setSettingsLocked(false);
 $("lockNotice").textContent="Tiếp theo: Nhấn Triệu hồi để mở đại hội mới.";
 syncButtons();updateRanking();
}
function resetGame(){
  if(typeof summonUnlockTimer!=="undefined"&&summonUnlockTimer){clearTimeout(summonUnlockTimer);summonUnlockTimer=0;}
  if(typeof summonVisualReady!=="undefined")summonVisualReady=true;
  // Hủy mọi hiệu ứng triệu hồi còn treo khi dừng giữa chừng.
  if(typeof summonArrivalStartedAt!=="undefined")summonArrivalStartedAt=0;
  if(typeof summonRitualStartedAt!=="undefined")summonRitualStartedAt=0;
  if(typeof summonRitualReturnAt!=="undefined")summonRitualReturnAt=0;
  if(window.CultivationMusic)window.CultivationMusic.setPhase("setup");
  window.__awardMasterDepartureActive=false;
  window.__vkSummonRevealActive=false;
  racers=[];raceStopped=false;particles=[];running=false;paused=false;started=false;finished=false;
  countdown=0;countdownAccumulator=0;elapsed=0;eventClock=0;eventText="";eventTextLife=0;
  finishQueue=[];cameraFocusId=null;finishMessage="";finishMessageLife=0;finishEndAnnouncementPending=false;finishEndAnnouncementShown=false;
  $("status").textContent="Chờ triệu hồi";$("leaderName").textContent="Đang chờ cuộc đua";$("leaderProgress").textContent="Chưa khai mở";$("leaderEffect").textContent="";$("lockNotice").textContent="Bước 1: Nhập danh sách hoặc chọn số lượng, sau đó nhấn Tạo.";
  setSettingsLocked(false);setSetupPanel(true);syncButtons();updateRanking();
  // Để RAF vẽ khung hình kế tiếp thay vì khóa luồng thao tác Dừng/Triệu hồi.
  lastCanvasRenderAt=0;
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
 let revealing=window.__vkSummonRevealActive===true;
 const now=performance.now();
 const raceActive=started===true||finished===true;
 const raceOver=finished===true&&racers.length>0&&racers.every(r=>r.finished===true);
 // Chỉ giữ trạng thái triệu hồi khi vẫn còn ít nhất một tiên nhân chưa đến lượt hiện thân.
 // Nếu bộ hẹn giờ bị trễ/hủy, bảng vẫn tự hoàn tất khi mốc hiện thân cuối cùng đã qua.
 if(revealing&&racers.length&&racers.every(r=>!Number.isFinite(r.summonRevealAt)||now>=r.summonRevealAt)){
  revealing=false;
  window.__vkSummonRevealActive=false;
  rankingOrderSignature="";
 }
 // Trước cuộc đua giữ đúng thứ tự triệu hồi, chỉ thêm tên khi tiên nhân hiện thân.
 const source=raceActive?sortedRacers():racers;
 const sorted=source.filter(r=>!revealing||!Number.isFinite(r.summonRevealAt)||now>=r.summonRevealAt);
 if(!sorted.length){
  // Chỉ hiện dòng chờ khi chưa có dữ liệu tiên nhân; không để placeholder che danh sách đã triệu hồi.
  body.innerHTML='<tr><td colspan="3" class="empty">'+(racers.length?"Đang triệu hồi tiên nhân…":"Chưa có tiên nhân")+'</td></tr>';
  rankingOrderSignature=(raceActive?"race|":"idle|")+(racers.length?"summoning|":"empty|");
  rankingPendingSignature="";
  rankingPendingSince=0;
  return;
 }
 const mode=raceActive?"race":"idle";
 const signature=mode+"|"+sorted.map(r=>String(r.id)).join("|");
 // Chỉ trì hoãn thay đổi thứ tự trong lúc đua: tránh các lần vượt sát nhau
 // làm FLIP bị khởi động lại liên tục ở từng khung hình.
 if(signature!==rankingOrderSignature&&raceActive){
  if(rankingPendingSignature!==signature){
   rankingPendingSignature=signature;
   rankingPendingSince=now;
   return;
  }
  if(now-rankingPendingSince<190)return;
 }
 if(signature===rankingOrderSignature)return;
 rankingPendingSignature="";
 rankingPendingSince=0;

 const oldRows=new Map();
 body.querySelectorAll("tr[data-racer-id]").forEach(row=>{
  oldRows.set(row.dataset.racerId,{row,top:row.getBoundingClientRect().top});
 });
 const orderedRows=[];
 const liveIds=new Set(sorted.map(r=>String(r.id)));
 oldRows.forEach((entry,id)=>{if(!liveIds.has(id))entry.row.remove();});
 sorted.forEach((r,i)=>{
  const key=String(r.id);
  const previous=oldRows.get(key);
  const row=previous?previous.row:document.createElement("tr");
  row.dataset.racerId=key;
  const medal=raceActive?(i===0?"🥇":i===1?"🥈":i===2?"🥉":String(i+1)):"";
  const arrow=raceActive&&!raceOver&&r.rankMovement==="up"
   ?'<span class="rank-movement rank-up" aria-label="Tăng hạng" title="Tăng hạng">▲</span>'
   :raceActive&&!raceOver&&r.rankMovement==="down"
    ?'<span class="rank-movement rank-down" aria-label="Giảm hạng" title="Giảm hạng">▼</span>':"";
  const actualTime=raceActive&&r.finished&&r.finishTime!==null?timeText(r.finishTime):"—";
  row.innerHTML='<td><span class="rank-cell">'+arrow+'<span class="rank-position">'+medal+'</span></span></td><td title="'+escapeHTML(r.name)+'">'+escapeHTML(r.name)+'</td><td>'+actualTime+'</td>';
  orderedRows.push({row,oldTop:previous?previous.top:null});
 });
 const fragment=document.createDocumentFragment();
 orderedRows.forEach(item=>fragment.appendChild(item.row));
 body.appendChild(fragment);

 const moving=[];
 if(raceOver){
  body.querySelectorAll("tr[data-racer-id]").forEach(row=>{
   row.classList.remove("rank-row-moving");
   row.style.transition="";row.style.transform="";
  });
 }
 orderedRows.forEach(({row,oldTop})=>{
  if(raceOver)return;
  if(oldTop===null)return;
  const newTop=row.getBoundingClientRect().top;
  const delta=oldTop-newTop;
  if(Math.abs(delta)<1)return;
  row.classList.add("rank-row-moving");
  row.style.transition="none";
  row.style.transform="translate3d(0,"+delta+"px,0)";
  moving.push(row);
 });
 if(moving.length){
  void body.offsetHeight;
  requestAnimationFrame(()=>{
   moving.forEach(row=>{
    row.style.transition="transform 640ms cubic-bezier(.22,.61,.36,1)";
    row.style.transform="translate3d(0,0,0)";
    const cleanup=event=>{
     if(event.propertyName!=="transform")return;
     row.removeEventListener("transitionend",cleanup);
     row.classList.remove("rank-row-moving");
     row.style.transition="";
     row.style.transform="";
   };
   row.addEventListener("transitionend",cleanup);
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
 startButton.disabled=!racers.length||!summonVisualReady||running||paused;
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
  runButton.disabled=!racers.length||!summonVisualReady;

  if(pauseButton){pauseButton.hidden=true;pauseButton.disabled=true;}

  stopButton.hidden=false;
  const isSetup=finished||raceStopped;
  stopButton.disabled=!racers.length||!summonVisualReady;
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
const summonRitualDuration=VKP_DATA.summoning.ritualDuration;
let summonRitualReturnAt=0;
let summonRacersBeforeClick=null;
let summonBatchSize=1;
let summonVisualReady=true;
let summonUnlockTimer=0;
const summonGroupStep=VKP_DATA.summoning.groupStep;
const summonRevealDuration=VKP_DATA.summoning.revealDuration;
const summonBeamDuration=VKP_DATA.summoning.beamDuration;
// Tối đa 12 lượt giáng lâm; ít người đi riêng, đông người tự chia nhóm tăng dần.
function getSummonBatchSize(count){
  return Math.max(VKP_DATA.summoning.minimumBatchSize,Math.ceil(count/VKP_DATA.summoning.maximumWaves));
}
function getSummonGroupDelay(index){
  return VKP_DATA.summoning.groupStartDelay+Math.floor(Math.max(0,index)/summonBatchSize)*summonGroupStep;
}
$("summon").addEventListener("click",()=>{summonRacersBeforeClick=racers;},true);
$("summon").addEventListener("click",()=>{
  if(racers.length>=2&&racers!==summonRacersBeforeClick&&!running&&!paused){
    summonRitualStartedAt=performance.now();
    summonArrivalStartedAt=summonRitualStartedAt+summonRitualDuration*1000;
    summonBatchSize=getSummonBatchSize(racers.length);
    // Tiên Bảng chỉ mở tên đúng lúc từng nhóm bắt đầu hiện thân.
    window.__vkSummonRevealActive=true;
    racers.forEach((racer,index)=>{
      racer.summonRevealAt=summonArrivalStartedAt+getSummonGroupDelay(index)*1000;
    });
    rankingOrderSignature="";
    const groupCount=Math.ceil(racers.length/summonBatchSize);
    const lastDelay=getSummonGroupDelay(Math.max(0,racers.length-1));
    summonRitualReturnAt=summonArrivalStartedAt+(lastDelay+VKP_DATA.summoning.beamTailDuration)*1000;
    // Khóa nút Chạy cho đến khi nhóm cuối cùng đã hiện thân hoàn toàn.
    summonVisualReady=false;
    if(summonUnlockTimer)clearTimeout(summonUnlockTimer);
    const revealCompleteAt=summonArrivalStartedAt+(lastDelay+summonRevealDuration)*1000;
    summonUnlockTimer=setTimeout(()=>{
      summonVisualReady=true;
      summonUnlockTimer=0;
      window.__vkSummonRevealActive=false;
      rankingOrderSignature="";
      updateRanking();
      syncButtons();
      $("status").textContent="Toàn bộ tiên nhân đã hiện thân · Đại hội bắt đầu!";
      $("lockNotice").textContent="Đã triệu hồi hoàn tất. Tự động bắt đầu sau 3 giây đếm ngược.";
      // Tự động khai cuộc ngay khi nhân vật cuối cùng hiện thân hoàn toàn.
      if(racers.length>=2&&!running&&!paused&&!finished)startRace();
    },Math.max(0,revealCompleteAt-performance.now()));
    syncButtons();
    $("status").textContent=summonBatchSize===1
      ?"Chưởng môn khai trận · linh lực hội tụ · thiên quang giáng lâm"
      :`Chưởng môn khai trận · mỗi lượt ${summonBatchSize} tiên nhân · ${groupCount} lượt`;
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
// Tư thế được áp dụng lên chính các nhân vật đang ngồi tại quảng trường.
function getPlazaRitualPose(time){
  if(!summonRitualStartedAt)return 0;
  const age=(time-summonRitualStartedAt)/1000;
  const rise=Math.max(0,Math.min(1,(age-.12)/.82));
  const returnStart=summonRitualReturnAt? summonRitualReturnAt-950:Infinity;
  const lower=summonRitualReturnAt?Math.max(0,Math.min(1,(summonRitualReturnAt-time)/950)):1;
  const smooth=value=>value*value*(3-2*value);
  return Math.min(smooth(rise),smooth(lower));
}
// Chỉ nâng nhẹ toàn bộ nhân vật thật tại chỗ; tay và bàn tay do drawSpectator vẽ.
const summonBaseDrawSpectator=drawSpectator;
drawSpectator=function(x,y,scale,roleName,time,phase=0){
  const affected=roleName==="master"||roleName==="disciple"||roleName==="elder";
  const pose=affected?getPlazaRitualPose(time):0;
  const lift=(roleName==="master"?12:roleName==="elder"?8:7)*pose;
  summonBaseDrawSpectator(x,y-lift,scale,roleName,time,phase);
};

function drawSummonRitual(time){
  if(!summonRitualStartedAt)return;
  const age=Math.max(0,(time-summonRitualStartedAt)/1000);
  if(summonRitualReturnAt&&time>=summonRitualReturnAt){
    summonRitualStartedAt=0;summonRitualReturnAt=0;return;
  }
  if(age<0||age>=summonRitualDuration)return;
  const clamp01=value=>Math.max(0,Math.min(1,value));
  const smooth=value=>{const v=clamp01(value);return v*v*(3-2*v);};
  const formation=smooth((age-.18)/.72);
  const energy=smooth((age-.78)/2.15);
  const omen=smooth((age-2.85)/1.25);
  const cx=550,cy=674;
  ctx.save();
  ctx.globalCompositeOperation="screen";

  // Pháp trận mở ngay dưới chân chưởng môn đang đứng trên đài chủ tọa.
  ctx.save();ctx.translate(cx,cy);
  ctx.globalAlpha=formation*(.78+.16*Math.sin(age*5));
  // Pháp trận nhìn thẳng từ trên xuống: hình tròn phẳng, không kéo dẹt phối cảnh.
  ctx.strokeStyle="#baffe9";ctx.shadowColor="#8effdf";ctx.shadowBlur=18;
  ctx.lineWidth=2.6;ctx.beginPath();ctx.arc(0,0,78+2*Math.sin(age*3),0,Math.PI*2);ctx.stroke();
  ctx.strokeStyle="#ffe6a8";ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(0,0,62,0,Math.PI*2);ctx.stroke();
  ctx.save();ctx.rotate(age*.42);
  for(let i=0;i<8;i++){
    const a=i*Math.PI/4;ctx.save();ctx.rotate(a);ctx.beginPath();
    ctx.moveTo(0,-8);ctx.lineTo(0,-72);ctx.stroke();
    ctx.translate(0,-67);ctx.rotate(-a);ctx.strokeRect(-4,-4,8,8);ctx.restore();
  }
  for(let i=0;i<16;i++){
    const a=i*Math.PI/8;
    ctx.fillStyle=i%2?"#c8fff0":"#fff0bd";
    ctx.beginPath();ctx.arc(Math.cos(a)*70,Math.sin(a)*70,2.1,0,Math.PI*2);ctx.fill();
  }
  ctx.restore();ctx.restore();

  // Chưởng môn niệm chú và kết ấn ngay tại ngai; không tạo nhân vật giả.
  const chant=smooth((age-.65)/1.1);
  ctx.save();ctx.translate(cx,642);
  ctx.globalAlpha=chant;
  ctx.strokeStyle="#fff0bd";ctx.lineWidth=2.4;ctx.shadowColor="#ffe4a0";ctx.shadowBlur=16;
  ctx.beginPath();ctx.arc(0,-43,9+7*Math.sin(age*5),0,Math.PI*2);ctx.stroke();
  for(let i=0;i<8;i++){
    const a=i*Math.PI/4+age*.8;
    ctx.beginPath();ctx.moveTo(Math.cos(a)*13,Math.sin(a)*13-43);
    ctx.lineTo(Math.cos(a)*27,Math.sin(a)*27-43);ctx.stroke();
  }
  // Chú văn bay thành từng nhịp ngay phía trên chưởng môn đang niệm chú.
  const mantra=["唵","灵","召","玄","引","天"];
  ctx.textAlign="center";ctx.textBaseline="middle";
  ctx.font="bold 17px serif";ctx.fillStyle="#fff0bd";
  ctx.shadowColor="#ffe4a0";ctx.shadowBlur=13;
  mantra.forEach((glyph,i)=>{
    const phase=(age*1.05+i*.19)%1;
    const gx=Math.sin(age*1.4+i*1.1)*32+(i-2.5)*15;
    const gy=-91-phase*34;
    ctx.globalAlpha=chant*(1-phase)*.9;
    ctx.fillText(glyph,gx,gy);
  });
  ctx.restore();

  // Điểm phát linh lực lấy đúng tọa độ bàn tay của 10 chân truyền và 10 trưởng lão
  // đang được vẽ trong drawCrowd: không dùng lại tọa độ của bố cục khán đài cũ.
  const pose=getPlazaRitualPose(time);
  const donors=[];
  for(let i=0;i<10;i++){
    const x=78+i*41,scale=.52,phase=i;
    const bob=Math.sin(time*.006+phase)*.8;
    const handLift=10*pose,bodyLift=7*pose;
    // Chân truyền ở cánh trái hướng bàn tay phải về pháp trận.
    donors.push({x:x+8*scale,y:605-bodyLift+(5-handLift)*scale+bob,color:"#a9fff0",group:0,phase:i});
  }
  for(let i=0;i<10;i++){
    const x=662+i*41,scale=.54,phase=i*.8;
    const bob=Math.sin(time*.006+phase)*.8;
    const handLift=12*pose,bodyLift=8*pose;
    // Trưởng lão ở cánh phải hướng bàn tay trái về pháp trận.
    donors.push({x:x-8*scale,y:605-bodyLift+(5-handLift)*scale+bob,color:"#d8c0ff",group:1,phase:i+10});
  }
  if(age>1.05){
    donors.forEach((donor,i)=>{
      const {x:handX,y:handY,color,phase}=donor;
      const controlX=(handX+cx)*.5;
      const controlY=Math.min(handY,cy)-58-(i%4)*11;
      ctx.save();ctx.globalAlpha=.12+.72*energy;
      ctx.strokeStyle=color;
      ctx.lineWidth=2.2;ctx.shadowColor=color;ctx.shadowBlur=10;
      ctx.beginPath();ctx.moveTo(handX,handY);ctx.quadraticCurveTo(controlX,controlY,cx,cy);ctx.stroke();
      const travel=(age*.58+phase*.071)%1;
      const bx=(1-travel)*(1-travel)*handX+2*(1-travel)*travel*controlX+travel*travel*cx;
      const by=(1-travel)*(1-travel)*handY+2*(1-travel)*travel*controlY+travel*travel*cy;
      ctx.fillStyle="#fff3c4";ctx.beginPath();ctx.arc(bx,by,2.1+(i%2),0,Math.PI*2);ctx.fill();
      ctx.restore();
    });
  }

  // Khi linh lực đã tụ đủ, tường thụy mới hiện trên tầng mây.
  if(age>2.8){
    ctx.save();ctx.globalAlpha=omen;
    // Tường thụy phải phủ rõ bầu trời trước thời điểm cột sáng giáng xuống.
    const skyGlow=ctx.createLinearGradient(0,8,0,255);
    skyGlow.addColorStop(0,"rgba(255,239,190,.12)");
    skyGlow.addColorStop(.42,"rgba(255,226,164,.38)");
    skyGlow.addColorStop(1,"rgba(166,255,226,.04)");
    ctx.fillStyle=skyGlow;ctx.fillRect(0,8,W,250);
    // Quầng nhật hoa vàng ngọc và các tia sáng tỏa rộng trên tầng mây.
    const sunX=550+Math.sin(age*.55)*34,sunY=112;
    const halo=ctx.createRadialGradient(sunX,sunY,8,sunX,sunY,220);
    halo.addColorStop(0,"rgba(255,250,211,.72)");
    halo.addColorStop(.32,"rgba(255,220,151,.22)");
    halo.addColorStop(1,"rgba(255,220,151,0)");
    ctx.fillStyle=halo;ctx.fillRect(sunX-220,sunY-150,440,300);
    ctx.save();ctx.translate(sunX,sunY);ctx.rotate(-.12);
    ctx.strokeStyle="rgba(255,239,185,.34)";ctx.lineWidth=2;ctx.shadowColor="#ffe8a7";ctx.shadowBlur=12;
    for(let ray=0;ray<18;ray++){
      const a=ray*Math.PI/9+age*.08;
      ctx.beginPath();ctx.moveTo(Math.cos(a)*34,Math.sin(a)*34);
      ctx.lineTo(Math.cos(a)*210,Math.sin(a)*210);ctx.stroke();
    }
    ctx.restore();
    // Ba dải mây tường vân uốn lượn rõ nét.
    for(let band=0;band<4;band++){
      ctx.strokeStyle=band%2===0?"rgba(255,238,184,.95)":"rgba(145,255,226,.82)";
      ctx.lineWidth=band===1?4:2.4;ctx.shadowColor=ctx.strokeStyle;ctx.shadowBlur=19;
      ctx.beginPath();
      for(let x=0;x<=W;x+=14){
        const y=35+band*39+Math.sin(x*.012+age*1.3+band)*12+Math.sin(x*.025-age*.7)*4;
        if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
      }
      ctx.stroke();
    }
    // Mây lành cuộn hai bên trời, ánh vàng và xanh ngọc.
    for(let side=0;side<2;side++){
      for(let puff=0;puff<5;puff++){
        const x=(side?W-65:65)+(puff-2)*24+Math.sin(age*.7+puff)*8;
        const y=68+puff*23+Math.sin(age+puff)*4;
        ctx.globalAlpha=omen*.72;
        ctx.fillStyle=puff%2?"rgba(171,255,230,.72)":"rgba(255,230,171,.78)";
        ctx.beginPath();ctx.arc(x,y,11+(puff%3)*3,Math.PI,Math.PI*2);
        ctx.arc(x+13,y-3,12,Math.PI,Math.PI*2);ctx.arc(x+26,y,10,Math.PI,Math.PI*2);
        ctx.lineTo(x+26,y+5);ctx.lineTo(x,y+5);ctx.closePath();ctx.fill();
      }
    }
    for(let i=0;i<38;i++){
      const x=(i*83+age*25)%W,y=22+(i*47)%205;
      ctx.globalAlpha=omen*(.38+.52*Math.sin(age*3+i));
      ctx.fillStyle=i%3?"#caffec":"#fff0bd";
      ctx.shadowBlur=12;ctx.beginPath();ctx.arc(x,y,1.8+(i%3)*.7,0,Math.PI*2);ctx.fill();
    }
    ctx.restore();
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


// REVISION 34 đã được hợp nhất vào bộ điều khiển REVISION 35 bên dưới.
// Chỉ giữ một bộ xử lý sự kiện để hai vòng không ghi đè trạng thái xoay của nhau.

// REVISION 35 — vạch chỉ số, xoay mượt hơn, chạm thông số để nhập/chọn trực tiếp.
(function refineRotarySummonDial(){
 const q=$("quantity"),speed=$("speed"),names=$("names");
 const qRing=document.querySelector('[data-dial="quantity"]'),tRing=document.querySelector('[data-dial="duration"]');
 const qButton=$("openQuantityDial"),tButton=$("openDurationDial"),editor=$("dialEditor");
 const editorLabel=$("dialEditorLabel"),editorInput=$("dialEditorInput"),editorSelect=$("dialEditorSelect");
 const done=$("dialEditorDone"),qText=$("dialQuantityValue"),tText=$("dialDurationValue");
 if(!q||!speed||!names||!qRing||!tRing||!editor)return;
 const durationOptions=Array.isArray((window.VKP_DATA&&window.VKP_DATA.summoning||{}).durationOptions)?(window.VKP_DATA.summoning.durationOptions.map(Number)):[5,10,15,30,60,120,180,240,300,600];
 [speed,editorSelect].forEach(select=>{
   if(!select)return;
   const current=Number(select.value)||60;
   select.replaceChildren(...durationOptions.map(value=>{const option=document.createElement("option");option.value=String(value);option.textContent=value+" giây";return option;}));
   select.value=String(durationOptions.includes(current)?current:60);
 });
 const durationConfig=(window.VKP_DATA&&window.VKP_DATA.summoning)||{};
  const durations=Array.isArray(durationConfig.durationOptions)&&durationConfig.durationOptions.length
    ?durationConfig.durationOptions.map(Number):[5,10,15,30,60,120,180,240,300,600];
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
  const layer=ring.querySelector(".dial-markers");
  if(layer)layer.style.transform="rotate("+(-rotation)+"deg)";
  ring.querySelectorAll(".dial-marker").forEach(marker=>{
    marker.style.transform="translate(-50%,-50%)";
  });
 }
 function markers(ring,labels,radius){
  let layer=ring.querySelector(".dial-markers");
  if(!layer){layer=document.createElement("div");layer.className="dial-markers";ring.appendChild(layer);}
  layer.replaceChildren();
  labels.forEach((label,i)=>{
    const markerRatio=ring===tRing?i/Math.max(1,labels.length-1):i/labels.length;
    const angle=(-90+markerRatio*360)*Math.PI/180;
    const span=document.createElement("span");span.className="dial-marker";span.textContent=label;
    span.style.left=(50+Math.cos(angle)*radius)+"%";
    span.style.top=(50+Math.sin(angle)*radius)+"%";
    layer.appendChild(span);
  });
  syncMarkerOrientation(ring);
 }
 markers(qRing,["2","20","40","60","80","100"],46);
 markers(tRing,durations.map(value=>value+"s"),43);
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
   const step=drag.kind==="quantity"?4:360/(durations.length-1);
   const count=drag.carry>0?Math.floor(drag.carry/step):Math.ceil(drag.carry/step);
   if(count){
     if(drag.kind==="quantity"){
       const typed=getInputNames().length;
       if(!typed){
         // Vòng số lượng tuần hoàn từ 2 đến 100, không bị kẹt ở hai đầu.
         const current=clamp(Number(q.value)||10,2,100);
         const next=2+((((current-2)+count)%99)+99)%99;
         q.value=String(next);
         q.dispatchEvent(new Event("change",{bubbles:true}));
       }
     }else{
       // Thời lượng tuần hoàn: qua 600s quay về 5s và ngược lại.
       const found=durations.indexOf(Number(speed.value));
       const idx=found>=0?found:(durations.indexOf(60)>=0?durations.indexOf(60):0);
       const nextIndex=((idx+count)%durations.length+durations.length)%durations.length;
       speed.value=String(durations[nextIndex]);
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
