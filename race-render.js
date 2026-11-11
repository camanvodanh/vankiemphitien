
"use strict";

// =====================================================
// ĐIỀU CHỈNH KHU VỰC ĐƯỜNG ĐUA
// Dành khoảng trống riêng cho khán giả phía dưới
// =====================================================

TRACK.bottom = 535;

// =====================================================
// TỔNG HỢP PHONG CẢNH
// =====================================================

function drawScenery(time) {
  drawSky(time);
  drawMountainRange();
  drawMovingClouds(time);

  drawFloatingPlatform(165, 290, .8);
  drawFloatingPlatform(940, 275, .75);

  drawPagoda(165, 310, .82, "#554335");
  drawPagoda(950, 290, .88, "#584333");

  drawPalace(275, 370, .53, false);
  drawPalace(825, 365, .55, false);
  drawPalace(550, 320, 1.05, true);

  drawWaterfall(890, 275, 35, 180, time);
  drawWaterfall(105, 345, 23, 105, time);

  drawRiver(time);
  drawBridge();

  drawPine(28, 465, 1.15);
  drawPine(65, 475, .9);
  drawPine(160, 465, .75);
  drawPine(335, 470, .8);
  drawPine(760, 470, .8);
  drawPine(1030, 455, 1.1);
  drawPine(1070, 480, .85);

  drawTree(200, 460, .75);
  drawTree(390, 485, .65);
  drawTree(710, 480, .7);
  drawTree(1000, 465, .7);

  // Khán giả ở khu vực riêng phía dưới
  drawCrowd(time);
}

// =====================================================
// HUD
// =====================================================

function drawHudBox(x, y, w, h, label, value, align = "left") {
  ctx.save();

  ctx.fillStyle = "rgba(20,48,39,.88)";
  ctx.fillRect(x, y, w, h);

  ctx.strokeStyle = "rgba(224,194,126,.8)";
  ctx.strokeRect(x + .5, y + .5, w - 1, h - 1);

  ctx.textAlign = align;
  ctx.textBaseline = "middle";

  const tx = align === "left" ? x + 12 : x + w - 12;

  ctx.fillStyle = "#d9c58f";
  ctx.font = "bold 10px Georgia";
  ctx.fillText(label, tx, y + 13);

  ctx.fillStyle = "#fff0c7";
  ctx.font = "bold 21px Georgia";
  ctx.fillText(value, tx, y + 34);

  ctx.restore();
}

function drawRaceHud() {
  const remaining = Math.max(0, duration - elapsed);
  const completed = racers.filter(r => r.finished).length;

  drawHudBox(
    18, 15, 165, 49,
    "THỜI GIAN CÒN LẠI",
    timeText(remaining)
  );

  drawHudBox(
    W - 183, 15, 165, 49,
    "HOÀN THÀNH",
    `${completed} / ${racers.length}`,
    "right"
  );
}

// =====================================================
// CỔNG ĐÍCH TIÊN MÔN
// =====================================================

function drawImmortalFinishGate() {
  const x = TRACK.right;
  const top = TRACK.top - 55;
  const bottom = TRACK.bottom;

  ctx.save();

  // Hào quang phía sau cổng
  const aura = ctx.createRadialGradient(
    x, top + 70, 5,
    x, top + 70, 100
  );

  aura.addColorStop(0, "rgba(255,231,160,.28)");
  aura.addColorStop(1, "rgba(255,231,160,0)");

  ctx.fillStyle = aura;
  ctx.fillRect(x - 100, top - 30, 200, 210);

  // Hai trụ cổng
  [-18, 18].forEach(offset => {
    const px = x + offset;

    const pillar = ctx.createLinearGradient(
      px - 7, 0,
      px + 7, 0
    );

    pillar.addColorStop(0, "#765333");
    pillar.addColorStop(.35, "#f1d99a");
    pillar.addColorStop(.65, "#b88d4c");
    pillar.addColorStop(1, "#59402b");

    ctx.fillStyle = pillar;
    ctx.fillRect(px - 6, top + 30, 12, bottom - top - 30);

    // Viền trụ
    ctx.strokeStyle = "#f3d78e";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(px - 6, top + 30, 12, bottom - top - 30);

    // Đế trụ
    ctx.fillStyle = "#765332";
    ctx.fillRect(px - 13, bottom - 17, 26, 17);

    ctx.fillStyle = "#e2c17b";
    ctx.fillRect(px - 15, bottom - 20, 30, 4);

    // Đầu trụ
    ctx.fillStyle = "#9c713b";
    ctx.fillRect(px - 11, top + 22, 22, 9);

    ctx.fillStyle = "#f1d58b";
    ctx.fillRect(px - 14, top + 18, 28, 5);

    // Ngọc sáng trên đầu trụ
    ctx.fillStyle = "#fff0b5";
    ctx.beginPath();
    ctx.arc(px, top + 15, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  // Vòm cổng cong
  ctx.beginPath();
  ctx.moveTo(x - 34, top + 35);
  ctx.quadraticCurveTo(
    x, top - 27,
    x + 34, top + 35
  );

  ctx.strokeStyle = "#6e4b2c";
  ctx.lineWidth = 11;
  ctx.stroke();

  ctx.strokeStyle = "#e9c77b";
  ctx.lineWidth = 6;
  ctx.stroke();

  ctx.strokeStyle = "rgba(255,245,193,.8)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Đầu mái hai bên
  [-1, 1].forEach(side => {
    const px = x + side * 34;

    ctx.fillStyle = "#9a713d";
    ctx.beginPath();
    ctx.moveTo(px - 9, top + 37);
    ctx.lineTo(px + side * 13, top + 25);
    ctx.lineTo(px + side * 8, top + 43);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "#f1d58b";
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  // Biển hiệu trên cổng
  ctx.fillStyle = "#6a3028";
  ctx.fillRect(x - 34, top + 4, 68, 22);

  ctx.strokeStyle = "#f0d28a";
  ctx.lineWidth = 2;
  ctx.strokeRect(x - 34, top + 4, 68, 22);

  ctx.fillStyle = "#ffe9ad";
  ctx.font = "bold 11px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("TIÊN MÔN", x, top + 15);

  // Ánh sáng vạch đích
  const finishGlow = ctx.createLinearGradient(
    0, top + 45,
    0, bottom - 20
  );

  finishGlow.addColorStop(0, "rgba(255,245,190,.05)");
  finishGlow.addColorStop(.5, "rgba(255,238,166,.8)");
  finishGlow.addColorStop(1, "rgba(255,245,190,.05)");

  ctx.fillStyle = finishGlow;
  ctx.fillRect(x - 1, top + 45, 2, bottom - top - 65);

  // Hai đường sáng mảnh hai bên vạch đích
  ctx.strokeStyle = "rgba(255,224,145,.5)";
  ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.moveTo(x - 8, top + 48);
  ctx.lineTo(x - 8, bottom - 18);

  ctx.moveTo(x + 8, top + 48);
  ctx.lineTo(x + 8, bottom - 18);
  ctx.stroke();

  ctx.restore();
}

// =====================================================
// ĐƯỜNG ĐUA
// Không vẽ nền xám và vạch chia làn
// =====================================================

function drawTrackLines() {
  // Chỉ giữ cổng đích phong cách tu tiên
  drawImmortalFinishGate();
}

// =====================================================
// NHÂN VẬT NGỰ KIẾM
// =====================================================

function drawRacer(target,racer,x,y,scale,time){
  target.save();target.translate(x,y+Math.sin(time*.009+racer.phase)*2);target.scale(scale,scale);
  const glow=target.createRadialGradient(0,0,3,0,0,46);glow.addColorStop(0,"rgba(255,225,139,.38)");glow.addColorStop(1,"rgba(255,225,139,0)");
  target.fillStyle=glow;target.fillRect(-50,-48,100,96);
  const styles=[
    {blade:"#d8e8ee",edge:"#fff5c9",hilt:"#c69a4e",type:0},
    {blade:"#9bd6ef",edge:"#e8fbff",hilt:"#4b8d9a",type:1},
    {blade:"#d9c2f3",edge:"#fff0ff",hilt:"#8a65a5",type:2},
    {blade:"#e7b96c",edge:"#fff0b5",hilt:"#9c572e",type:3},
    {blade:"#a8d8b0",edge:"#eaffd8",hilt:"#497b54",type:4},
    {blade:"#d7dbe3",edge:"#ffffff",hilt:"#59677f",type:5},
    {blade:"#e6a3a3",edge:"#ffe4d4",hilt:"#93444a",type:6}
  ];
  const sword=styles[(racer.swordStyle||0)%styles.length];
  target.save();target.rotate(-.08);
  target.fillStyle="rgba(18,30,36,.32)";
  target.beginPath();target.ellipse(0,22,40,5,0,0,Math.PI*2);target.fill();
  target.fillStyle=sword.blade;target.beginPath();
  if(sword.type===1){
    target.moveTo(-40,19);target.quadraticCurveTo(-2,12,35,7);
    target.quadraticCurveTo(27,16,5,20);target.lineTo(-40,22);
  }else if(sword.type===2){
    target.moveTo(-38,17);target.lineTo(13,13);target.lineTo(43,18);
    target.lineTo(15,24);target.lineTo(-38,22);
  }else if(sword.type===3){
    target.moveTo(-40,19);target.lineTo(34,17);target.lineTo(46,18);
    target.lineTo(34,20);target.lineTo(-40,21);
  }else if(sword.type===4){
    target.moveTo(-40,18);target.lineTo(25,15);target.lineTo(44,18);
    target.lineTo(25,21);target.lineTo(-40,21);
  }else if(sword.type===5){
    target.moveTo(-40,18);target.lineTo(28,17);target.lineTo(36,13);
    target.lineTo(45,18);target.lineTo(35,22);target.lineTo(28,20);target.lineTo(-40,22);
  }else if(sword.type===6){
    target.moveTo(-40,20);target.quadraticCurveTo(4,15,43,18);
    target.quadraticCurveTo(9,22,-40,21);
  }else{
    target.moveTo(-40,18);target.lineTo(28,16);target.lineTo(44,18);
    target.lineTo(28,21);target.lineTo(-40,21);
  }
  target.closePath();target.fill();
  target.strokeStyle=sword.edge;target.lineWidth=1.5;target.stroke();
  target.strokeStyle="rgba(255,255,255,.55)";target.lineWidth=.8;
  target.beginPath();target.moveTo(-32,19);target.lineTo(28,18);target.stroke();
  target.fillStyle=sword.hilt;target.fillRect(-10,14,4,11);
  target.fillRect(-15,15,14,3);target.fillRect(-9,24,3,7);
  target.restore();

  target.restore();
}

function drawRacerName(racer,x,y,scale){
 ctx.save();const fontSize=clamp(12*scale+4,9,14),labelY=y-43*scale;
 ctx.font="700 "+fontSize+"px Arial, sans-serif";ctx.textAlign="center";ctx.textBaseline="middle";ctx.lineJoin="round";
 ctx.lineWidth=3.2;ctx.strokeStyle="rgba(18,28,27,.96)";ctx.strokeText(racer.name,x,labelY,150);
 ctx.fillStyle="#fff7dc";ctx.fillText(racer.name,x,labelY,150);ctx.restore();
}

function racerX(racer) {
  const usableWidth = TRACK.right - TRACK.left - 45;

  return (
    TRACK.left +
    35 +
    progressOf(racer) * usableWidth
  );
}

function drawRacers(time) {
  if (!racers.length) return;

  const scale = racerScale();

  racers.forEach((racer, index) => {
    const x = racerX(racer);
    const y = laneY(index);

    drawRacer(ctx, racer, x, y, scale, time);
    drawRacerName(racer, x, y, scale);

    if (racer.finished) {
      ctx.fillStyle = "#ffe7a8";
      ctx.font = "bold 12px Georgia";
      ctx.textAlign = "center";
      ctx.fillText("✦", x, y - 31 * scale);
    }
  });
}

// =====================================================
// HẠT SÁNG VÀ SỰ KIỆN
// =====================================================

const eventMessages = [
  "Linh Khí Bùng Nổ",
  "Tiên Kiếm Gia Tốc",
  "Thiên Địa Dị Tượng",
  "Kiếm Quang Hộ Thể",
  "Tiên Khí Hội Tụ",
  "Phong Vân Biến Động",
  "Kiếm Ý Tăng Vọt"
];

function addParticles(x, y, amount = 12) {
  for (let i = 0; i < amount; i++) {
    particles.push({
      x,
      y,
      vx: rand(-1.8, 1.8),
      vy: rand(-1.6, 1.6),
      life: rand(.3, .9),
      maxLife: .9,
      size: rand(1, 3)
    });
  }
}

function updateParticles(dt) {
  particles.forEach(p => {
    p.x += p.vx * dt * 60;
    p.y += p.vy * dt * 60;
    p.life -= dt;
  });

  particles = particles.filter(p => p.life > 0);
}

function drawParticles() {
  ctx.save();

  particles.forEach(p => {
    ctx.globalAlpha = clamp(p.life / p.maxLife, 0, 1);
    ctx.fillStyle = p.color || "#ffe5a0";
    ctx.fillRect(p.x, p.y, p.size, p.size);
  });

  ctx.globalAlpha = 1;
  ctx.restore();
}

function triggerEvent(){
 const active=racers.filter(r=>!r.finished);if(!active.length)return;
 const racer=active[randInt(0,active.length-1)],index=racers.indexOf(racer);
 const effects=[
  {type:"boost",name:"Thiên phong trợ lực",multiplier:1.62,duration:2.8},
  {type:"boost",name:"Linh tuyền bùng nổ",multiplier:1.92,duration:1.65},
  {type:"slow",name:"Loạn lưu cương phong",multiplier:.58,duration:2.7},
  {type:"impact",name:"Kiếm khí va chạm",multiplier:.72,duration:2.15}
 ];
 const effect=effects[randInt(0,effects.length-1)];racer.speedMultiplier=effect.multiplier;racer.effectTimer=effect.duration;racer.effectType=effect.type;racer.effectName=effect.name;
 cameraFocusId=racer.id;const px=racerX(racer),py=laneY(index);addParticles(px,py,32);
 for(let i=0;i<12;i++){const angle=i*Math.PI/6;particles.push({x:px+Math.cos(angle)*8,y:py+Math.sin(angle)*6,vx:Math.cos(angle)*rand(1.2,3.1),vy:Math.sin(angle)*rand(1,2.6),life:rand(.45,.95),maxLife:.95,size:rand(2,4),color:effect.type==="boost"?"#ffe17b":effect.type==="slow"?"#8de8ef":"#ff9a72"});}
}

function showFinishAnnouncement(racer, rank) {
  finishMessage = `HẠNG ${rank}: ${racer.name} ĐÃ VỀ ĐÍCH!`;
  finishMessageLife = 3.2;
  $("event").textContent = finishMessage;
}

function drawAnnouncement() {
  const message = finishMessageLife > 0
    ? finishMessage
    : eventTextLife > 0
      ? eventText
      : "";

  if (!message) return;

  const isFinish = finishMessageLife > 0;

  ctx.save();

  const alpha = isFinish
    ? clamp(finishMessageLife / .7, 0, 1)
    : clamp(eventTextLife / .7, 0, 1);

  ctx.globalAlpha = alpha;

  const fontSize = isFinish ? 22 : 20;

  ctx.font = `bold ${fontSize}px Georgia`;

  const maxWidth = W - 260;
  const measured = ctx.measureText(message).width;

  const boxWidth = Math.min(
    maxWidth,
    Math.max(270, measured + 50)
  );

  const boxHeight = 45;
  const x = (W - boxWidth) / 2;
  const y = 79;

  ctx.fillStyle = isFinish
    ? "rgba(99,59,26,.94)"
    : "rgba(24,52,41,.91)";

  ctx.fillRect(x, y, boxWidth, boxHeight);

  ctx.strokeStyle = "#e4c27e";
  ctx.lineWidth = 2;

  ctx.strokeRect(
    x + 1,
    y + 1,
    boxWidth - 2,
    boxHeight - 2
  );

  ctx.fillStyle = isFinish ? "#ffe7a7" : "#f6dfa2";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillText(
    message,
    W / 2,
    y + boxHeight / 2,
    boxWidth - 25
  );

  ctx.restore();
}

// =====================================================
// CAMERA NGƯỜI DẪN ĐẦU
// =====================================================

function drawCameraBackground() {
  const w=cameraCanvas.width,h=cameraCanvas.height,g=cameraCtx.createLinearGradient(0,0,0,h);
  g.addColorStop(0,"#9fc4bd");g.addColorStop(.48,"#587d70");g.addColorStop(1,"#203e36");
  cameraCtx.clearRect(0,0,w,h);cameraCtx.fillStyle=g;cameraCtx.fillRect(0,0,w,h);
  // Núi tiên giới nhiều lớp.
  const ridges=[
    {c:"#9eb8a8",p:[[0,108],[42,40],[82,82],[132,24],[185,86],[235,32],[292,88],[350,28],[420,92]]},
    {c:"#587d6b",p:[[0,132],[52,75],[96,112],[155,55],[213,115],[275,64],[332,119],[385,72],[420,116]]},
    {c:"#315b4c",p:[[0,150],[45,112],[92,139],[145,95],[205,143],[270,99],[325,143],[380,104],[420,145]]}
  ];
  ridges.forEach(r=>{cameraCtx.fillStyle=r.c;cameraCtx.beginPath();r.p.forEach(([x,y],i)=>i?cameraCtx.lineTo(x,y):cameraCtx.moveTo(x,y));cameraCtx.lineTo(w,h);cameraCtx.lineTo(0,h);cameraCtx.closePath();cameraCtx.fill();});
  // Thác nước hai bên núi.
  for(const x of [48,372]){
    const water=cameraCtx.createLinearGradient(x-13,0,x+13,0);water.addColorStop(0,"#347f8b");water.addColorStop(.45,"#e0fff0");water.addColorStop(1,"#4b9eaa");
    cameraCtx.fillStyle=water;cameraCtx.beginPath();cameraCtx.moveTo(x-5,52);cameraCtx.bezierCurveTo(x-16,82,x-20,108,x-28,145);cameraCtx.quadraticCurveTo(x,151,x+28,145);cameraCtx.bezierCurveTo(x+20,108,x+16,82,x+5,52);cameraCtx.closePath();cameraCtx.fill();
    cameraCtx.strokeStyle="rgba(255,255,245,.75)";cameraCtx.lineWidth=1.5;for(let j=0;j<4;j++){cameraCtx.beginPath();cameraCtx.moveTo(x-8+j*5,57);cameraCtx.lineTo(x-13+j*8,141);cameraCtx.stroke();}
  }
  // Đại điện trung tâm và các lầu các hai cánh.
  function pavilion(x,y,s,color,main=false){
    cameraCtx.save();cameraCtx.translate(x,y);cameraCtx.scale(s,s);
    cameraCtx.fillStyle="#49372c";cameraCtx.fillRect(-24,-38,48,40);
    cameraCtx.fillStyle=color;cameraCtx.fillRect(-19,-33,38,34);
    cameraCtx.fillStyle="#f0d28a";cameraCtx.fillRect(-23,-3,46,3);
    cameraCtx.fillStyle="#e4c77f";cameraCtx.beginPath();cameraCtx.moveTo(-38,-34);cameraCtx.quadraticCurveTo(0,main?-75:-59,38,-34);cameraCtx.lineTo(29,-29);cameraCtx.quadraticCurveTo(0,main?-63:-49,-29,-29);cameraCtx.closePath();cameraCtx.fill();
    cameraCtx.strokeStyle="#fff0b7";cameraCtx.lineWidth=2;cameraCtx.stroke();
    for(const xx of [-17,17]){cameraCtx.fillStyle="#f3d68f";cameraCtx.fillRect(xx-2,-30,4,30);}
    if(main){cameraCtx.fillStyle="#fff0b7";cameraCtx.font="bold 8px Georgia";cameraCtx.textAlign="center";cameraCtx.fillText("TIÊN MÔN",0,-42);}
    cameraCtx.restore();
  }
  pavilion(210,130,.82,"#7a4d3e",true);pavilion(82,145,.48,"#426c67");pavilion(335,144,.48,"#536d8b");
  pavilion(143,162,.34,"#8a7049");pavilion(282,162,.34,"#657c57");
  // Cầu mây, tán cây và đèn lồng.
  cameraCtx.strokeStyle="rgba(240,247,225,.55)";cameraCtx.lineWidth=7;cameraCtx.beginPath();cameraCtx.moveTo(0,156);cameraCtx.quadraticCurveTo(210,138,420,156);cameraCtx.stroke();
  cameraCtx.fillStyle="rgba(240,214,151,.75)";for(let i=0;i<9;i++){const x=22+i*47;cameraCtx.beginPath();cameraCtx.arc(x,163+(i%2)*3,2,0,Math.PI*2);cameraCtx.fill();}
  const mist=cameraCtx.createLinearGradient(0,130,0,h);mist.addColorStop(0,"rgba(224,248,232,0)");mist.addColorStop(1,"rgba(195,225,204,.16)");cameraCtx.fillStyle=mist;cameraCtx.fillRect(0,125,w,h-125);
}

function leaderOf(){
  const active=racers.filter(r=>!r.finished);
  if(active.length)return active.sort((a,b)=>b.progress-a.progress)[0];
  return finishQueue.length?finishQueue[finishQueue.length-1]:null;
}
function drawCamera(time){
 drawCameraBackground();
 if(!started||!racers.length){
  $("leaderName").textContent="Đang chờ cuộc đua";$("leaderProgress").textContent="Hạng --/--";
  cameraCtx.fillStyle="#fff2c9";cameraCtx.font="bold 14px Arial, sans-serif";cameraCtx.textAlign="center";cameraCtx.textBaseline="middle";
  cameraCtx.fillText("Chờ khai mở tiên hội",210,96);return;
 }
 const leader=leaderOf();if(!leader)return;
 drawRacer(cameraCtx,leader,210,108,2.0,time);
 cameraCtx.save();cameraCtx.font="bold 17px Arial, sans-serif";cameraCtx.textAlign="center";cameraCtx.textBaseline="middle";cameraCtx.lineJoin="round";
 cameraCtx.lineWidth=4;cameraCtx.strokeStyle="rgba(15,27,25,.96)";cameraCtx.strokeText(leader.name,210,24,390);
 cameraCtx.fillStyle="#fff4d4";cameraCtx.fillText(leader.name,210,24,390);cameraCtx.restore();
 $("leaderName").textContent=leader.name;
 const rank=sortedRacers().findIndex(item=>item.id===leader.id)+1;
 $("leaderProgress").textContent="Hạng "+rank+"/"+racers.length;
}

// =====================================================
// TIÊN BẢNG
// =====================================================

function sortedRacers() {
  return [...racers].sort((a, b) => {
    if (a.finished && b.finished) {
      return a.finishTime - b.finishTime;
    }

    if (a.finished) return -1;
    if (b.finished) return 1;

    return b.progress - a.progress;
  });
}

function updateRanking() {
  const sorted = sortedRacers();

  // Không còn phần tổng số tham gia / về đích.
  if (!sorted.length) {
    $("rankBody").innerHTML =
      '<tr><td colspan="3" class="empty">Chưa có tiên nhân</td></tr>';

    return;
  }

  $("rankBody").innerHTML = sorted.map((r, i) => {
    const medal =
      i === 0 ? "🥇" :
      i === 1 ? "🥈" :
      i === 2 ? "🥉" :
      i + 1;

    const percent = Math.floor(progressOf(r) * 100);

    return `
      <tr>
        <td>${medal}</td>
        <td title="${escapeHTML(r.name)}">${escapeHTML(r.name)}</td>
        <td>${r.finished ? "Đích" : percent + "%"}</td>
      </tr>
    `;
  }).join("");
}

// =====================================================
// VẼ TOÀN BỘ KHUNG HÌNH
// =====================================================

function render(time){
 ctx.clearRect(0,0,W,H);drawScenery(time);
 if(finished){drawPodiumScene(ctx,time,false);drawParticles();drawCamera(time);updateRanking();return;}
 drawTrackLines();drawRaceHud();drawRacers(time);drawAnnouncement();drawParticles();drawCamera(time);updateRanking();
}
