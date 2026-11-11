
"use strict";

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

function processFinish(racer, index) {
  if (racer.finished) return;

  racer.progress = distance;
  racer.finished = true;
  racer.finishTime = racer.targetFinishTime;

  finishQueue.push(racer);

  showFinishAnnouncement(racer, finishQueue.length);

  addParticles(
    TRACK.right - 35,
    laneY(index),
    28
  );
}

// =====================================================
// CẬP NHẬT CUỘC ĐUA
// =====================================================

function updateRace(dt) {
  if (!running || paused || !started || finished) return;

  const previousElapsed = elapsed;

  elapsed = Math.min(duration, elapsed + dt);

  racers.forEach(racer => {
    if (racer.finished) return;

    const targetTime = Math.max(
      .001,
      racer.targetFinishTime
    );

    const ratio = clamp(
      elapsed / targetTime,
      0,
      1
    );

    racer.progress = distance * ratio;
  });

  const due = racers
    .map((racer, index) => ({ racer, index }))
    .filter(item =>
      !item.racer.finished &&
      previousElapsed < item.racer.targetFinishTime &&
      elapsed >= item.racer.targetFinishTime
    )
    .sort((a, b) =>
      a.racer.targetFinishTime -
      b.racer.targetFinishTime
    );

  due.forEach(item => {
    processFinish(item.racer, item.index);
  });

  eventClock += dt;

  if (eventClock >= nextEvent && elapsed < duration) {
    triggerEvent();

    eventClock = 0;
    nextEvent = rand(5, 9);
  }

  if (elapsed >= duration) {
    racers.forEach((racer, index) => {
      if (!racer.finished) {
        processFinish(racer, index);
      }
    });

    finishRace();
  }
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
    progress: 0,
    targetFinishTime: 0,
    finished: false,
    finishTime: null,
    color: color[0],
    dark: color[1],
    phase: rand(0, Math.PI * 2)
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
      "Danh sách tối đa 100 tiên nhân.";

    return;
  }

  racers = finalNames.map((name, index) =>
    createRacer(name, index)
  );

  duration = Number($("speed").value);
  distance = Number($("distance").value);

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

  $("lockNotice").textContent =
    `Đã triệu hồi ${racers.length} tiên nhân. Sẵn sàng bắt đầu.`;

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
  $("distance").disabled = value;
  $("quantity").disabled = value;
  $("names").disabled = value;

  $("summon").disabled =
    value || running || paused;

  $("lockNotice").classList.toggle("locked", value);

  $("lockNotice").textContent = value
    ? "Thiết lập đã khóa trong cuộc đua."
    : racers.length
      ? "Có thể triệu hồi lại hoặc thay đổi thiết lập."
      : "Nhập danh sách hoặc chọn số lượng để triệu hồi.";
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

  $("reset").disabled = false;
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
  distance = Number($("distance").value);

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
    "Đại hội đã kết thúc. Thiết lập đã được mở khóa, có thể triệu hồi đại hội mới.";

  syncButtons();
  updateRanking();
}

// =====================================================
// LÀM MỚI
// =====================================================

function resetGame() {
  racers = [];
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
  distance = Number($("distance").value);

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

$("reset").addEventListener("click", resetGame);

$("speed").addEventListener("change", () => {
  if (!locked) {
    duration = Number($("speed").value);
  }
});

$("distance").addEventListener("change", () => {
  if (!locked) {
    distance = Number($("distance").value);
  }
});

// =====================================================
// KHỞI CHẠY
// =====================================================

initStars();

duration = Number($("speed").value);
distance = Number($("distance").value);

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
  if(finalNames.length>100){$("lockNotice").textContent="Danh sách tối đa 100 tiên nhân.";return;}
  racers=finalNames.map((name,index)=>createRacer(name,index));
  racers.forEach((r,i)=>r.swordStyle=i%7);
  duration=Number($("speed").value);
  elapsed=0;running=false;paused=false;started=false;finished=false;
  countdown=0;countdownAccumulator=0;eventClock=0;nextEvent=rand(5,9);
  eventText="";eventTextLife=0;finishQueue=[];cameraFocusId=null;
  finishMessage="";finishMessageLife=0;particles=[];
  assignFinishTimes();
  $("status").textContent="Đã triệu hồi";
  $("lockNotice").textContent=typed.length?"Số lượng lấy theo danh sách tên, đã loại tên trùng.":"Đã tạo "+racers.length+" tiên nhân với tên tu tiên ngẫu nhiên.";
  $("leaderName").textContent="Đang chờ cuộc đua";$("leaderProgress").textContent="Thời gian về đích: --:--";
  setSettingsLocked(false);syncButtons();render(performance.now());
}
function setSettingsLocked(value){
  locked=value;["speed","quantity","names","summon"].forEach(id=>$(id).disabled=value);
  $("lockNotice").classList.toggle("locked",value);
}
function syncButtons(){
  const b=$("start");
  b.textContent=running?"Ⅱ Tạm dừng":paused?"▶ Tiếp tục":finished?"↻ Bắt đầu lại":"✦ Bắt đầu vào trường đua";
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
  elapsed=0;countdown=3;countdownAccumulator=0;eventClock=0;nextEvent=rand(5,9);
  finishQueue=[];cameraFocusId=null;finishMessage="";finishMessageLife=0;
  eventText="BẮT ĐẦU SAU 3";eventTextLife=1;
  racers.forEach(r=>{r.progress=0;r.finished=false;r.finishTime=null;});
  assignFinishTimes();started=false;finished=false;paused=false;running=true;
  $("status").textContent="Bắt đầu sau 3...";
  $("leaderName").textContent="Đang chờ cuộc đua";$("leaderProgress").textContent="Thời gian về đích: --:--";
  setSettingsLocked(true);syncButtons();
}
function togglePause(){if(!running||finished)return;running=false;paused=true;$("status").textContent="Đang tạm dừng";syncButtons();}
function resumeRace(){if(!paused||finished)return;paused=false;running=true;$("status").textContent=started?"Đang tranh phong":"Bắt đầu sau "+countdown+"...";syncButtons();}
function finishRace(){
  elapsed=duration;racers.forEach(r=>{r.progress=distance;r.finished=true;if(r.finishTime===null)r.finishTime=duration;});
  finished=true;running=false;paused=false;started=true;$("status").textContent="Đại hội kết thúc";
  finishMessage="ĐẠI HỘI KẾT THÚC!";finishMessageLife=3;setSettingsLocked(false);
  $("lockNotice").textContent="Cuộc đua hoàn thành. Bấm Bắt đầu lại để chạy lại với đúng danh sách nhân vật này.";
  syncButtons();updateRanking();
}
function resetGame(){
  racers=[];particles=[];running=false;paused=false;started=false;finished=false;
  countdown=0;countdownAccumulator=0;elapsed=0;eventClock=0;eventText="";eventTextLife=0;
  finishQueue=[];cameraFocusId=null;finishMessage="";finishMessageLife=0;
  $("status").textContent="Chờ triệu hồi";$("leaderName").textContent="Đang chờ cuộc đua";$("leaderProgress").textContent="Thời gian về đích: --:--";
  setSettingsLocked(false);syncButtons();updateRanking();render(performance.now());
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
  drawCameraBackground();
  if(!started||!racers.length){
    $("leaderName").textContent="Đang chờ cuộc đua";
    $("leaderProgress").textContent="Thời gian về đích: --:--";
    cameraCtx.fillStyle="#f3dfa9";cameraCtx.font="13px Arial";cameraCtx.textAlign="center";
    cameraCtx.fillText("Nhân vật sẽ xuất hiện khi cuộc đua bắt đầu",210,105);return;
  }
  const racer=leaderOf();if(!racer)return;
  drawRacer(cameraCtx,racer,210,91,2.2,time);
  $("leaderName").textContent=racer.name;
  const remaining=racer.finished?Math.max(0,racer.finishTime||0):Math.max(0,racer.targetFinishTime-elapsed);
  $("leaderProgress").textContent=racer.finished?"Đã về đích · "+timeText(remaining):"Dự kiến về đích sau "+timeText(remaining);
}
function updateRanking(){
  const sorted=sortedRacers();
  if(!sorted.length){$("rankBody").innerHTML='<tr><td colspan="3" class="empty">Chưa có tiên nhân</td></tr>';return;}
  $("rankBody").innerHTML=sorted.map((r,i)=>{
    const medal=i===0?"🥇":i===1?"🥈":i===2?"🥉":i+1;
    const remaining=r.finished?timeText(r.finishTime||0):timeText(Math.max(0,r.targetFinishTime-elapsed));
    return '<tr><td>'+medal+'</td><td title="'+escapeHTML(r.name)+'">'+escapeHTML(r.name)+'</td><td>'+remaining+'</td></tr>';
  }).join("");
}
