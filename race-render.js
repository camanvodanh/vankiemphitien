
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
 const effects=VKP_DATA.effects.raceEvents;
 const effect=effects[randInt(0,effects.length-1)];
 racer.speedMultiplier=effect.multiplier;racer.effectTimer=effect.duration;racer.effectDuration=effect.duration;racer.effectType=effect.type;racer.effectName=effect.name;
 cameraFocusId=racer.id;const px=racerX(racer),py=laneY(index);addParticles(px,py,32);
 const burstColor=effect.color||"#ffe7a0";
 for(let i=0;i<VKP_DATA.effects.particleBurst.count;i++){const angle=i*VKP_DATA.effects.particleBurst.angleStep;particles.push({x:px+Math.cos(angle)*8,y:py+Math.sin(angle)*6,vx:Math.cos(angle)*rand(VKP_DATA.effects.particleBurst.speedMin,VKP_DATA.effects.particleBurst.speedMax),vy:Math.sin(angle)*rand(VKP_DATA.effects.particleBurst.speedMin,VKP_DATA.effects.particleBurst.speedMax),life:rand(VKP_DATA.effects.particleBurst.lifeMin,VKP_DATA.effects.particleBurst.lifeMax),maxLife:VKP_DATA.effects.particleBurst.lifeMax,size:rand(VKP_DATA.effects.particleBurst.sizeMin,VKP_DATA.effects.particleBurst.sizeMax),color:burstColor});}
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
  const y = H - boxHeight - 24;

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

function drawCameraBackground(time=0) {
  const c=cameraCtx,w=cameraCanvas.width,h=cameraCanvas.height;
  c.clearRect(0,0,w,h);
  const sky=c.createLinearGradient(0,0,0,h);
  sky.addColorStop(0,"#527b91");sky.addColorStop(.36,"#a9c9bd");sky.addColorStop(.72,"#d5d9b8");sky.addColorStop(1,"#e5d4a6");
  c.fillStyle=sky;c.fillRect(0,0,w,h);

  // Nhật quang, tầng mây và sương núi.
  const sun=c.createRadialGradient(324,27,2,324,27,112);
  sun.addColorStop(0,"rgba(255,247,207,.92)");sun.addColorStop(.35,"rgba(255,230,171,.28)");sun.addColorStop(1,"rgba(255,230,171,0)");
  c.fillStyle=sun;c.fillRect(210,-80,210,190);
  for(let i=0;i<5;i++){
    const x=((i*103+time*.006)%(w+120))-60,y=45+(i%3)*22;
    c.globalAlpha=.22;c.fillStyle="#f8f5dc";c.beginPath();
    c.ellipse(x,y,44,7,0,0,Math.PI*2);c.ellipse(x+19,y-5,24,10,0,0,Math.PI*2);c.ellipse(x-20,y-3,23,9,0,0,Math.PI*2);c.fill();
  }
  c.globalAlpha=1;

  // Dãy tiên sơn nhiều lớp, có sống núi, vách đá và tuyết đọng.
  const ridge=(pts,top,mid,base)=>{const g=c.createLinearGradient(0,20,0,176);g.addColorStop(0,top);g.addColorStop(.55,mid);g.addColorStop(1,base);c.fillStyle=g;c.beginPath();c.moveTo(0,h);pts.forEach(([x,y])=>c.lineTo(x,y));c.lineTo(w,h);c.closePath();c.fill();};
  ridge([[0,106],[26,69],[51,87],[86,30],[116,76],[151,40],[181,88],[217,25],[246,72],[281,36],[314,84],[350,31],[390,83],[420,59]],"#dce8d8","#a5bdac","#6f907d");
  ridge([[0,132],[34,94],[67,115],[104,67],[139,116],[177,76],[213,122],[250,68],[285,119],[321,75],[356,124],[389,83],[420,111]],"#9ab9a5","#668c76","#416b58");
  ridge([[0,151],[48,121],[88,140],[130,103],[169,145],[211,111],[251,148],[295,108],[334,145],[375,111],[420,143]],"#668d70","#416c55","#294b3d");
  c.fillStyle="rgba(246,250,229,.82)";
  [[86,30,12,17],[217,25,14,18],[350,31,12,15]].forEach(([x,y,dx,dy])=>{c.beginPath();c.moveTo(x-dx,y+dy);c.lineTo(x,y);c.lineTo(x+dx,y+dy*.7);c.lineTo(x+4,y+dy*.55);c.lineTo(x,y+dy*.8);c.lineTo(x-5,y+dy*.55);c.closePath();c.fill();});

  // Vách núi tiền cảnh và khe thác nối về lòng sông.
  c.fillStyle="#355d49";c.beginPath();c.moveTo(0,113);c.quadraticCurveTo(35,92,69,119);c.lineTo(91,174);c.lineTo(0,181);c.closePath();c.fill();
  c.fillStyle="#3c654e";c.beginPath();c.moveTo(420,111);c.quadraticCurveTo(385,91,353,119);c.lineTo(332,174);c.lineTo(420,181);c.closePath();c.fill();

  // Tiên điện trung tâm và quần thể lầu các hai bên.
  function pavilion(x,y,s,main=false,color="#875a43"){
    c.save();c.translate(x,y);c.scale(s,s);
    c.fillStyle="#49382d";c.fillRect(-25,-24,50,27);
    c.fillStyle=color;c.fillRect(-21,-21,42,22);
    c.fillStyle="#d8bd7a";c.fillRect(-27,1,54,3);
    for(const px of [-17,0,17]){c.fillStyle="#e7ca82";c.fillRect(px-2,-20,4,21);c.fillStyle="#253f38";c.fillRect(px-1,-15,2,13);}
    const roof=(ww,yy,hh)=>{c.fillStyle="#9d7547";c.beginPath();c.moveTo(-ww,yy+hh);c.quadraticCurveTo(0,yy- (main?26:18),ww,yy+hh);c.lineTo(ww-7,yy+hh+3);c.quadraticCurveTo(0,yy-(main?17:10),-ww+7,yy+hh+3);c.closePath();c.fill();c.strokeStyle="#f2d99b";c.lineWidth=1.6;c.stroke();};
    roof(main?42:31,-26,10);roof(main?31:23,-42,8);
    c.fillStyle="#e6c67c";c.fillRect(-2,-54,4,13);c.beginPath();c.arc(0,-55,3,0,Math.PI*2);c.fill();
    if(main){c.fillStyle="#fff0bd";c.font="bold 7px Georgia";c.textAlign="center";c.fillText("TIÊN MÔN",0,-31);}
    c.restore();
  }
  pavilion(210,128,1.02,true,"#8b4b3d");
  pavilion(83,143,.62,false,"#416b63");pavilion(337,145,.62,false,"#536d83");
  pavilion(145,158,.42,false,"#8b7147");pavilion(278,159,.42,false,"#607b57");

  // Rừng tùng, cầu đá và thác nước có vệt chảy.
  for(let i=0;i<13;i++){
    const x=8+i*34,y=163+(i%3)*4,s=.24+(i%4)*.035;
    c.fillStyle="#594632";c.fillRect(x-1,y-17*s,2,19*s);
    c.fillStyle=i%2?"#315c47":"#3d6a50";
    c.beginPath();c.moveTo(x,y-36*s);c.lineTo(x-11*s,y-12*s);c.lineTo(x+11*s,y-12*s);c.closePath();c.fill();
  }
  for(const x of [53,367]){
    const water=c.createLinearGradient(x-10,0,x+10,0);water.addColorStop(0,"#337c88");water.addColorStop(.42,"#e4fff2");water.addColorStop(1,"#4d9ca4");
    c.fillStyle=water;c.beginPath();c.moveTo(x-5,91);c.bezierCurveTo(x-12,117,x-15,143,x-25,166);c.quadraticCurveTo(x,173,x+25,166);c.bezierCurveTo(x+15,143,x+12,117,x+5,91);c.closePath();c.fill();
    c.save();c.beginPath();c.rect(x-20,90,40,82);c.clip();
    for(let j=0;j<8;j++){const yy=92+((j*17+time*.035)%82);c.strokeStyle=j%3?"rgba(236,255,248,.7)":"rgba(255,255,255,.95)";c.lineWidth=j%3?1:1.8;c.beginPath();c.moveTo(x-5+(j%4)*3,yy);c.lineTo(x-9+(j%4)*4,yy+12);c.stroke();}
    c.restore();
    c.fillStyle="rgba(235,255,246,.5)";c.beginPath();c.ellipse(x,169,24,4,0,0,Math.PI*2);c.fill();
  }
  c.strokeStyle="rgba(244,248,226,.62)";c.lineWidth=4;c.beginPath();c.moveTo(0,164);c.quadraticCurveTo(210,148,420,164);c.stroke();
  c.strokeStyle="rgba(244,221,167,.7)";c.lineWidth=1.5;c.beginPath();c.moveTo(0,167);c.quadraticCurveTo(210,151,420,167);c.stroke();
  const mist=c.createLinearGradient(0,133,0,h);mist.addColorStop(0,"rgba(222,248,231,0)");mist.addColorStop(1,"rgba(204,231,210,.25)");c.fillStyle=mist;c.fillRect(0,130,w,h-130);
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
  cameraCtx.fillText("Chờ khai mở tiên hội",210,120);return;
 }
 const leader=leaderOf();if(!leader)return;
 drawRacer(cameraCtx,leader,210,137,2.65,time);
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

let gameZoom=1,gamePanX=0,gamePanY=0;
const gamePointers=new Map();
let gameGesture=null;
function clampGamePan(){const maxX=W*(gameZoom-1)/2,maxY=H*(gameZoom-1)/2;gamePanX=Math.max(-maxX,Math.min(maxX,gamePanX));gamePanY=Math.max(-maxY,Math.min(maxY,gamePanY));}
function canvasPoint(event){const rect=canvas.getBoundingClientRect();return{x:(event.clientX-rect.left)*W/rect.width,y:(event.clientY-rect.top)*H/rect.height};}
function zoomGameAt(nextZoom,point){const next=Math.max(1,Math.min(3.5,nextZoom)),anchor=point||{x:W/2,y:H/2};const worldX=(anchor.x-W/2-gamePanX)/gameZoom+W/2,worldY=(anchor.y-H/2-gamePanY)/gameZoom+H/2;gameZoom=next;gamePanX=anchor.x-W/2-(worldX-W/2)*gameZoom;gamePanY=anchor.y-H/2-(worldY-H/2)*gameZoom;if(gameZoom===1){gamePanX=0;gamePanY=0;}clampGamePan();}
function pointerCenter(){const a=Array.from(gamePointers.values());return a.length<2?null:{x:(a[0].x+a[1].x)/2,y:(a[0].y+a[1].y)/2};}
function pointerDistance(){const a=Array.from(gamePointers.values());return a.length<2?0:Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);}
(function enableGestureGameView(){
if(!canvas)return;canvas.style.touchAction="none";
canvas.addEventListener("pointerdown",event=>{if(event.pointerType==="mouse"&&event.button!==0)return;const point=canvasPoint(event);gamePointers.set(event.pointerId,{...point,type:event.pointerType});try{canvas.setPointerCapture(event.pointerId);}catch(_){}if(gamePointers.size>=2){const center=pointerCenter();gameGesture={mode:"pinch",distance:pointerDistance(),zoom:gameZoom,worldX:(center.x-W/2-gamePanX)/gameZoom+W/2,worldY:(center.y-H/2-gamePanY)/gameZoom+H/2};event.preventDefault();}else if(event.pointerType==="mouse"||gameZoom>1){gameGesture={mode:"pan",last:point};event.preventDefault();}else gameGesture=null;});
canvas.addEventListener("pointermove",event=>{if(!gamePointers.has(event.pointerId))return;const point=canvasPoint(event);gamePointers.set(event.pointerId,{...point,type:event.pointerType});if(gamePointers.size>=2){if(!gameGesture||gameGesture.mode!=="pinch"){const center=pointerCenter();gameGesture={mode:"pinch",distance:pointerDistance(),zoom:gameZoom,worldX:(center.x-W/2-gamePanX)/gameZoom+W/2,worldY:(center.y-H/2-gamePanY)/gameZoom+H/2};}const center=pointerCenter(),distance=pointerDistance(),next=Math.max(1,Math.min(3.5,gameGesture.zoom*(distance/Math.max(1,gameGesture.distance))));gameZoom=next;gamePanX=center.x-W/2-(gameGesture.worldX-W/2)*gameZoom;gamePanY=center.y-H/2-(gameGesture.worldY-H/2)*gameZoom;if(gameZoom===1){gamePanX=0;gamePanY=0;}clampGamePan();event.preventDefault();}else if(gameGesture&&gameGesture.mode==="pan"){gamePanX+=point.x-gameGesture.last.x;gamePanY+=point.y-gameGesture.last.y;gameGesture.last=point;clampGamePan();event.preventDefault();}});
const endPointer=event=>{gamePointers.delete(event.pointerId);if(gamePointers.size===1){const point=gamePointers.values().next().value;gameGesture=gameZoom>1?{mode:"pan",last:point}:null;}else if(gamePointers.size===0)gameGesture=null;};
canvas.addEventListener("pointerup",endPointer);canvas.addEventListener("pointercancel",endPointer);canvas.addEventListener("lostpointercapture",endPointer);
canvas.addEventListener("wheel",event=>{event.preventDefault();zoomGameAt(gameZoom*(event.deltaY<0?1.12:1/1.12),canvasPoint(event));},{passive:false});
})();
function render(time){
  ctx.clearRect(0,0,W,H);
  // Khung gọn theo chiều cao mới: giữ nguyên tọa độ gốc của trường đua,
  // không dịch toàn cảnh xuống dưới làm dư bầu trời và quảng trường.
  ctx.save();
  ctx.translate(W/2+gamePanX,H/2+gamePanY);
  ctx.scale(gameZoom,gameZoom);
  ctx.translate(-W/2,-H/2);
  // Lỗi ở một chi tiết phong cảnh/khán đài không được phép chặn toàn bộ
  // nhân vật và vòng lặp render. Nếu scenery lỗi, vẫn tiếp tục vẽ đường đua.
  try {
    drawScenery(time);
  } catch (error) {
    if (!window.__vkSceneryErrorLogged) {
      window.__vkSceneryErrorLogged = true;
      console.error("Lỗi riêng lớp phong cảnh/khán đài:", error);
    }
  }
  if(finished){
    drawPodiumScene(ctx,time,false);drawParticles();drawCamera(time);
    ctx.restore();updateRanking();return;
  }
  drawTrackLines();drawRaceHud();drawRacers(time);drawAnnouncement();drawParticles();drawCamera(time);
  ctx.restore();
  updateRanking();
}
