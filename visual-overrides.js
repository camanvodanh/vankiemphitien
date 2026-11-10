"use strict";

// =====================================================
// VISUAL OVERRIDES — VẠN KIẾM PHI TIÊN
// Tách rõ rừng núi / quảng trường, bố trí khán đài,
// tạo pháp bảo đa dạng cho từng người đua.
// =====================================================

function drawRiver(time) {
  // Quảng trường thu gọn vào khu trung tâm; hai mép là rừng núi.
  const left = 145;
  const right = 955;
  const top = 555;

  const floor = ctx.createLinearGradient(0, top, 0, H);
  floor.addColorStop(0, "#cbb98f");
  floor.addColorStop(.35, "#ad9870");
  floor.addColorStop(.75, "#806c50");
  floor.addColorStop(1, "#594b3a");

  ctx.fillStyle = floor;
  ctx.beginPath();
  ctx.moveTo(left, top + 8);
  ctx.quadraticCurveTo(550, top - 18, right, top + 8);
  ctx.lineTo(right + 38, H);
  ctx.lineTo(left - 38, H);
  ctx.closePath();
  ctx.fill();

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(left, top + 8);
  ctx.quadraticCurveTo(550, top - 18, right, top + 8);
  ctx.lineTo(right + 38, H);
  ctx.lineTo(left - 38, H);
  ctx.closePath();
  ctx.clip();

  // Phiến đá lát quảng trường theo phối cảnh.
  for (let y = 575; y < H + 25; y += 34) {
    ctx.strokeStyle = "rgba(246,224,177,.30)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(95 - (y - 555) * .35, y);
    ctx.lineTo(1005 + (y - 555) * .35, y);
    ctx.stroke();
  }

  for (let x = 120; x <= 980; x += 82) {
    ctx.strokeStyle = "rgba(64,51,34,.17)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(550 + (x - 550) * .16, 555);
    ctx.lineTo(x, H);
    ctx.stroke();
  }

  // Vòng tiên trận chỉ nằm ở khu vực trung tâm.
  ctx.strokeStyle = "rgba(255,226,166,.23)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.ellipse(550, 690, 75 + i * 34, 16 + i * 8, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();

  // Bậc viền quảng trường, không đặt đèn.
  ctx.strokeStyle = "#e0c994";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(left, top + 7);
  ctx.quadraticCurveTo(550, top - 20, right, top + 7);
  ctx.stroke();

  ctx.strokeStyle = "rgba(74,59,39,.45)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(left - 10, top + 18);
  ctx.quadraticCurveTo(550, top - 5, right + 10, top + 18);
  ctx.stroke();

  // Ngọc ấn trung tâm.
  ctx.fillStyle = "rgba(245,220,164,.35)";
  ctx.beginPath();
  ctx.moveTo(520, 575);
  ctx.lineTo(550, 560);
  ctx.lineTo(580, 575);
  ctx.lineTo(550, 590);
  ctx.closePath();
  ctx.fill();
}

function drawFormalSpectator(x, y, scale, roleName, time, phase = 0) {
  const role = ROLE[roleName];
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale * role.scale, scale);

  // Bóng và áo ngồi ngay ngắn trên ghế.
  ctx.fillStyle = "rgba(24,28,24,.30)";
  ctx.beginPath();
  ctx.ellipse(0, 19, 18, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = role.dark;
  ctx.beginPath();
  ctx.moveTo(-12, -4); ctx.lineTo(12, -4);
  ctx.lineTo(18, 17); ctx.lineTo(-18, 17);
  ctx.closePath(); ctx.fill();

  ctx.fillStyle = role.robe;
  ctx.beginPath();
  ctx.moveTo(-10, -7); ctx.lineTo(10, -7);
  ctx.lineTo(13, 13); ctx.lineTo(-13, 13);
  ctx.closePath(); ctx.fill();

  // Hai tay đặt trước bụng, tuyệt đối không vẫy.
  ctx.strokeStyle = "#efc39b";
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-10, -1); ctx.lineTo(-5, 8);
  ctx.moveTo(10, -1); ctx.lineTo(5, 8);
  ctx.stroke();

  ctx.fillStyle = role.belt;
  ctx.fillRect(-9, 5, 18, 3);

  ctx.fillStyle = "#efc39b";
  ctx.fillRect(-6, -21, 12, 13);

  ctx.fillStyle = roleName === "master" || roleName === "elder"
    ? "#e5dfd1" : "#29252a";
  ctx.fillRect(-7, -25, 14, 6);
  ctx.fillRect(-5, -28, 10, 4);

  ctx.fillStyle = "#352b27";
  ctx.fillRect(-3, -16, 2, 2);
  ctx.fillRect(2, -16, 2, 2);

  if (roleName === "master" || roleName === "elder") {
    ctx.fillStyle = "#e2ded1";
    ctx.beginPath();
    ctx.moveTo(-4, -8); ctx.lineTo(4, -8);
    ctx.lineTo(2, 3); ctx.lineTo(0, 6);
    ctx.lineTo(-2, 3); ctx.closePath();
    ctx.fill();
  }

  if (roleName === "master") {
    ctx.fillStyle = "#e8c36e";
    ctx.beginPath();
    ctx.moveTo(-8, -25); ctx.lineTo(-5, -36);
    ctx.lineTo(0, -30); ctx.lineTo(5, -36);
    ctx.lineTo(8, -25); ctx.closePath(); ctx.fill();
  }

  if (role.aura) {
    const halo = ctx.createRadialGradient(0, -9, 2, 0, -9, 35);
    halo.addColorStop(0, role.aura + "55");
    halo.addColorStop(1, role.aura + "00");
    ctx.fillStyle = halo;
    ctx.beginPath(); ctx.ellipse(0, -8, 35, 28, 0, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

function drawCrowd(time) {
  // Khán đài danh dự ở trung tâm: chưởng môn > trưởng lão > thân truyền.
  // Mỗi nhóm có bệ riêng, không đè lên hàng đệ tử phổ thông.

  // Dãy đệ tử thường ở xa khu vực danh dự, chia hai cánh.
  const rows = [
    { y: 760, count: 17, start: 18, step: 32, role: "servant", scale: .67 },
    { y: 760, count: 17, start: 538, step: 32, role: "outer", scale: .69 },
    { y: 730, count: 7, start: 18, step: 40, role: "inner", scale: .76 },
    { y: 730, count: 7, start: 842, step: 40, role: "core", scale: .80 },
    { y: 790, count: 17, start: 18, step: 32, role: "outer", scale: .66 }
  ];

  rows.forEach((row, ri) => {
    for (let i = 0; i < row.count; i++) {
      drawSpectator(
        row.start + i * row.step,
        row.y + (i % 2) * 3,
        row.scale,
        row.role,
        time,
        i * .63 + ri
      );
    }
  });

  // Bệ trung tâm dành riêng cho chưởng môn.
  drawAudiencePlatform(550, 688, 190);
  ctx.fillStyle = "#50352b";
  ctx.fillRect(475, 626, 150, 61);
  ctx.fillStyle = "#d9b976";
  ctx.fillRect(468, 681, 164, 8);
  ctx.fillStyle = "#8d3430";
  ctx.fillRect(495, 634, 110, 50);
  ctx.strokeStyle = "#f2d58d";
  ctx.lineWidth = 3;
  ctx.strokeRect(500, 639, 100, 42);

  // Vương miện/ngai nổi bật.
  ctx.fillStyle = "#e8cb83";
  ctx.beginPath();
  ctx.moveTo(490, 640); ctx.lineTo(500, 616);
  ctx.lineTo(525, 632); ctx.lineTo(550, 605);
  ctx.lineTo(575, 632); ctx.lineTo(600, 616);
  ctx.lineTo(610, 640); ctx.closePath(); ctx.fill();

  drawFormalSpectator(550, 658, 1.32, "master", time, 0);
  drawRoleLabel(550, 592, "CHƯỞNG MÔN", "#f2d17d", 1.35);

  // Trưởng lão ngồi hai bên, thấp hơn và nhỏ hơn chưởng môn.
  drawAudiencePlatform(255, 700, 245);
  drawAudiencePlatform(845, 700, 245);

  const elders = [
    [170, 682], [225, 682], [280, 682], [335, 682],
    [765, 682], [820, 682], [875, 682], [930, 682]
  ];
  elders.forEach((p, i) => {
    drawFormalSpectator(p[0], p[1], 1.00, "elder", time, i);
  });
  drawRoleLabel(255, 640, "ĐẠI TRƯỞNG LÃO", "#d4b5fa", 1.08);
  drawRoleLabel(845, 640, "TRƯỞNG LÃO", "#d4b5fa", 1.08);

  // Thân truyền ngồi hàng kế tiếp, nằm ngoài khoảng chiếm chỗ của hai nhóm trên.
  drawAudiencePlatform(550, 730, 390);
  const personal = [
    [390, 712], [450, 712], [510, 712],
    [590, 712], [650, 712], [710, 712]
  ];
  personal.forEach((p, i) => {
    drawFormalSpectator(p[0], p[1], .88, "disciple", time, i);
  });
  drawRoleLabel(550, 674, "THÂN TRUYỀN ĐỆ TỬ", "#a9c9f0", .98);

  // Cờ nghi lễ ở hai rìa, không chắn nhân vật.
  drawCrowdFlag(12, 710, "#a53f36", time);
  drawCrowdFlag(1085, 710, "#b18a43", time);
}

function drawScenery(time) {
  drawSky(time);
  drawMountainRange();
  drawMovingClouds(time);

  // Cụm tiên môn được nâng cao và phóng lớn:
  // đỉnh điện cao hơn rõ rệt so với làn đua trên cùng (TRACK.top).
  drawFloatingPlatform(150, 300, .85);
  drawFloatingPlatform(950, 290, .82);
  drawPagoda(150, 315, .94, "#554335");
  drawPagoda(950, 300, 1.00, "#584333");

  drawPalace(270, 355, .62, false);
  drawPalace(830, 350, .64, false);
  drawPalace(550, 300, 1.30, true);

  drawWaterfall(900, 285, 34, 190, time);
  drawWaterfall(105, 350, 24, 125, time);

  // Núi rừng ôm hai bên quảng trường, cây chỉ mọc trên nền đất núi.
  drawPine(18, 570, 1.25);
  drawPine(70, 585, 1.05);
  drawPine(118, 570, .92);
  drawTree(42, 610, .95);
  drawTree(130, 620, .78);

  drawPine(982, 570, 1.22);
  drawPine(1035, 590, 1.02);
  drawPine(1080, 565, .92);
  drawTree(970, 615, .82);
  drawTree(1060, 625, .9);

  // Vành cây thấp trên sườn núi phía sau, không mọc trên mặt quảng trường.
  drawPine(205, 535, .62, "#315b45");
  drawPine(890, 535, .65, "#315b45");

  drawRiver(time);
  drawBridge();
  drawCrowd(time);
}

// Pháp bảo đua: chọn ổn định theo mã người chơi, không đổi giữa các khung hình.
function artifactKind(racer) {
  const id = String(racer.id || racer.name || "0");
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return hash % 8;
}

function drawRacingArtifact(target, kind, phase) {
  target.save();
  target.translate(0, 18);
  target.rotate(Math.sin(phase) * .025);

  const metal = "#d9d3bd";
  const edge = "#f4e6b7";
  const dark = "#66513a";
  const gem = "#70c9d2";

  // Vệt linh khí chung.
  target.globalAlpha = .42;
  target.strokeStyle = "#ffe6a0";
  target.lineWidth = 2;
  target.beginPath();
  target.ellipse(0, 7, 39, 5, 0, 0, Math.PI * 2);
  target.stroke();
  target.globalAlpha = 1;

  if (kind === 0 || kind === 1) {
    // Kiếm thẳng / cổ kiếm.
    target.fillStyle = dark;
    target.fillRect(-3, -2, 6, 23);
    target.fillStyle = "#c59d58";
    target.fillRect(-11, 1, 22, 4);
    target.fillStyle = metal;
    target.beginPath();
    target.moveTo(0, -26); target.lineTo(5, 1);
    target.lineTo(0, 18); target.lineTo(-5, 1);
    target.closePath(); target.fill();
    target.strokeStyle = edge; target.lineWidth = 1.5; target.stroke();
    target.fillStyle = gem; target.beginPath(); target.arc(0, 4, 3, 0, Math.PI * 2); target.fill();
  } else if (kind === 2 || kind === 3) {
    // Thương / trường giáo.
    target.strokeStyle = "#8c6844"; target.lineWidth = 4;
    target.beginPath(); target.moveTo(0, 24); target.lineTo(0, -23); target.stroke();
    target.fillStyle = metal;
    target.beginPath();
    target.moveTo(0, -31); target.lineTo(7, -15);
    target.lineTo(0, -18); target.lineTo(-7, -15);
    target.closePath(); target.fill();
    target.strokeStyle = edge; target.lineWidth = 1; target.stroke();
    target.fillStyle = "#b8493e"; target.fillRect(-2, -12, 4, 8);
  } else if (kind === 4) {
    // Quạt pháp bảo mở cánh.
    target.fillStyle = "#d8c38e";
    target.beginPath(); target.moveTo(0, 20);
    target.quadraticCurveTo(-4, 0, -26, -19);
    target.quadraticCurveTo(0, -31, 26, -19);
    target.quadraticCurveTo(4, 0, 0, 20); target.closePath(); target.fill();
    target.strokeStyle = "#8e6843"; target.lineWidth = 2;
    target.beginPath(); target.moveTo(0, 20); target.lineTo(-26, -19);
    target.moveTo(0, 20); target.lineTo(-13, -26);
    target.moveTo(0, 20); target.lineTo(0, -29);
    target.moveTo(0, 20); target.lineTo(13, -26);
    target.moveTo(0, 20); target.lineTo(26, -19); target.stroke();
    target.fillStyle = "#b84439"; target.beginPath(); target.arc(0, 18, 4, 0, Math.PI * 2); target.fill();
  } else if (kind === 5) {
    // Hồ lô ngọc.
    target.fillStyle = "#3c9278";
    target.beginPath(); target.ellipse(0, 8, 13, 17, 0, 0, Math.PI * 2); target.fill();
    target.beginPath(); target.ellipse(0, -8, 9, 12, 0, 0, Math.PI * 2); target.fill();
    target.fillStyle = "#d8bd78"; target.fillRect(-5, -23, 10, 5);
    target.fillStyle = "#e6d18d"; target.fillRect(-2, -29, 4, 7);
    target.strokeStyle = "#d8bd78"; target.lineWidth = 2;
    target.beginPath(); target.ellipse(0, 8, 13, 17, 0, 0, Math.PI * 2); target.stroke();
  } else if (kind === 6) {
    // Liên đài pháp bảo.
    target.fillStyle = "#d9b96f";
    for (let i = 0; i < 8; i++) {
      target.save(); target.rotate(i * Math.PI / 4);
      target.beginPath(); target.ellipse(0, -13, 5, 14, 0, 0, Math.PI * 2); target.fill();
      target.restore();
    }
    target.fillStyle = "#75c8bb"; target.beginPath(); target.arc(0, 0, 8, 0, Math.PI * 2); target.fill();
    target.fillStyle = "#f3df9e"; target.beginPath(); target.arc(0, 0, 3, 0, Math.PI * 2); target.fill();
  } else {
    // Song nguyệt luân.
    target.strokeStyle = "#c6d6d1"; target.lineWidth = 6;
    target.beginPath(); target.arc(0, 0, 18, .2, Math.PI * 1.8); target.stroke();
    target.strokeStyle = "#f5e5ad"; target.lineWidth = 2;
    target.beginPath(); target.arc(0, 0, 12, .2, Math.PI * 1.8); target.stroke();
    target.fillStyle = "#d3ad60"; target.fillRect(-3, -3, 6, 6);
  }

  target.restore();
}

function drawRacer(target, racer, x, y, scale, time) {
  target.save();
  target.translate(x, y + Math.sin(time * .009 + racer.phase) * 2);
  target.scale(scale, scale);

  const glow = target.createRadialGradient(0, 0, 3, 0, 0, 43);
  glow.addColorStop(0, "rgba(255,225,139,.35)");
  glow.addColorStop(1, "rgba(255,225,139,0)");
  target.fillStyle = glow;
  target.fillRect(-48, -45, 96, 90);

  drawRacingArtifact(target, artifactKind(racer), time * .004 + racer.phase);

  // Nhân vật đứng vững trên pháp bảo, thân và chân tách rõ.
  target.fillStyle = racer.dark;
  target.fillRect(-10, -5, 20, 22);
  target.fillStyle = racer.color;
  target.fillRect(-9, -7, 18, 21);
  target.fillRect(-14, -2, 5, 14);
  target.fillRect(9, -2, 5, 14);

  target.fillStyle = "#f0c49b";
  target.fillRect(-7, -22, 14, 14);

  target.fillStyle = "#29252a";
  target.fillRect(-8, -25, 16, 5);
  target.fillRect(-7, -28, 13, 4);
  target.fillRect(-9, -21, 3, 8);
  target.fillRect(6, -21, 3, 8);
  target.fillRect(4, -31, 3, 7);

  target.fillStyle = "#392a26";
  target.fillRect(-4, -17, 2, 2);
  target.fillRect(3, -17, 2, 2);
  target.fillStyle = "#e8cb83";
  target.fillRect(-8, 5, 16, 2);

  target.restore();
}


// =====================================================
// REVISION 2 — hướng pháp bảo, quảng trường và khán đài
// Hướng đua trong game: trái -> phải.
// =====================================================

function drawRiver(time) {
  const g=ctx.createLinearGradient(0,370,0,H);
  g.addColorStop(0,"#d9c79d"); g.addColorStop(.25,"#c7b184");
  g.addColorStop(.7,"#927c5b"); g.addColorStop(1,"#5d503d");
  ctx.fillStyle=g; ctx.beginPath();
  ctx.moveTo(0,390); ctx.quadraticCurveTo(270,365,550,382);
  ctx.quadraticCurveTo(830,365,1100,390); ctx.lineTo(1100,H);
  ctx.lineTo(0,H); ctx.closePath(); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.moveTo(0,390);
  ctx.quadraticCurveTo(270,365,550,382); ctx.quadraticCurveTo(830,365,1100,390);
  ctx.lineTo(1100,H); ctx.lineTo(0,H); ctx.closePath(); ctx.clip();
  for(let y=405;y<H+24;y+=32){
    ctx.strokeStyle="rgba(255,239,199,.30)"; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(-30-(y-390)*.18,y);
    ctx.lineTo(1130+(y-390)*.18,y); ctx.stroke();
  }
  for(let x=-400;x<1500;x+=92){
    ctx.strokeStyle="rgba(75,59,39,.17)"; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(550+(x-550)*.12,382); ctx.lineTo(x,H); ctx.stroke();
  }
  ctx.strokeStyle="rgba(255,225,164,.22)"; ctx.lineWidth=2;
  for(let i=0;i<5;i++){ctx.beginPath();ctx.ellipse(550,675,105+i*43,24+i*9,0,0,Math.PI*2);ctx.stroke();}
  ctx.restore();
  ctx.fillStyle="#8c7654"; ctx.beginPath();
  ctx.moveTo(0,387);ctx.quadraticCurveTo(550,360,1100,387);
  ctx.lineTo(1100,400);ctx.quadraticCurveTo(550,374,0,400);ctx.closePath();ctx.fill();
  ctx.strokeStyle="#ead39c";ctx.lineWidth=3;ctx.beginPath();
  ctx.moveTo(0,386);ctx.quadraticCurveTo(550,359,1100,386);ctx.stroke();
}

function drawCrowd(time) {
  // Đệ tử phổ thông được đẩy ra xa hai cánh và hàng dưới.
  const rows=[
    {y:785,n:18,x:12,step:31,r:"servant",s:.62},
    {y:785,n:18,x:550,step:31,r:"outer",s:.62},
    {y:752,n:8,x:12,step:39,r:"outer",s:.68},
    {y:752,n:8,x:790,step:39,r:"inner",s:.70},
    {y:716,n:6,x:10,step:43,r:"inner",s:.72},
    {y:716,n:6,x:832,step:43,r:"core",s:.74}
  ];
  rows.forEach((r,k)=>{for(let i=0;i<r.n;i++)drawSpectator(r.x+i*r.step,r.y+(i%2)*2,r.s,r.r,time,i*.61+k);});

  // Ba cấp ghế danh dự gần nhau, không đè vào đệ tử thường.
  drawAudiencePlatform(550,646,164);
  ctx.fillStyle="#50352b";ctx.fillRect(490,590,120,53);
  ctx.fillStyle="#d9b976";ctx.fillRect(480,640,140,8);
  ctx.fillStyle="#8d3430";ctx.fillRect(503,598,94,42);
  ctx.strokeStyle="#f2d58d";ctx.lineWidth=3;ctx.strokeRect(507,602,86,34);
  ctx.fillStyle="#e8cb83";ctx.beginPath();
  ctx.moveTo(495,603);ctx.lineTo(504,580);ctx.lineTo(528,594);
  ctx.lineTo(550,568);ctx.lineTo(572,594);ctx.lineTo(596,580);
  ctx.lineTo(605,603);ctx.closePath();ctx.fill();
  drawFormalSpectator(550,623,1.18,"master",time,0);
  drawRoleLabel(550,557,"CHƯỞNG MÔN","#f2d17d",1.28);

  drawAudiencePlatform(360,665,150);drawAudiencePlatform(740,665,150);
  [[315,650],[365,650],[415,650],[685,650],[735,650],[785,650]].forEach((p,i)=>drawFormalSpectator(p[0],p[1],.88,"elder",time,i));
  drawRoleLabel(360,616,"TRƯỞNG LÃO","#d4b5fa",.96);
  drawRoleLabel(740,616,"TRƯỞNG LÃO","#d4b5fa",.96);

  drawAudiencePlatform(550,690,210);
  [[455,676],[505,676],[555,676],[605,676],[655,676]].forEach((p,i)=>drawFormalSpectator(p[0],p[1],.76,"disciple",time,i));
  drawRoleLabel(555,646,"THÂN TRUYỀN","#a9c9f0",.88);
  drawCrowdFlag(12,700,"#a53f36",time);drawCrowdFlag(1085,700,"#b18a43",time);
}

function drawPalaceWithSign(x,y,scale,grand=false) {
  // Gọi hàm drawPalace gốc trong scenery.js, không ghi đè chính nó.
  drawPalace(x,y,scale,grand);
  // Bảng hiệu thứ hai lớn, đặt thấp hơn đỉnh mái, chữ có dấu rõ ràng.
  const w=(grand?190:150), py=y-111*scale;
  ctx.save();ctx.translate(x,py);
  ctx.fillStyle="#38251b";ctx.fillRect(-w/2-5,-17*scale,w+10,34*scale);
  ctx.fillStyle="#e8c77c";ctx.fillRect(-w/2,-14*scale,w,28*scale);
  ctx.fillStyle="#74352b";ctx.fillRect(-w/2+4,-10*scale,w-8,20*scale);
  ctx.strokeStyle="#fff0bd";ctx.lineWidth=Math.max(1,1.6*scale);
  ctx.strokeRect(-w/2+6,-8*scale,w-12,16*scale);
  ctx.fillStyle="#fff4d1";ctx.textAlign="center";ctx.textBaseline="middle";
  ctx.font="bold "+Math.round((grand?18:16)*scale)+"px serif";
  ctx.shadowColor="#ffe29b";ctx.shadowBlur=5*scale;
  ctx.fillText(grand?"VẠN KIẾM ĐIỆN":"TIÊN ĐIỆN",0,0,w-16*scale);
  ctx.restore();

  // Trang trí nóc điện: sống mái, đầu đao và bảo châu.
  ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);
  ctx.strokeStyle="#f1d38a";ctx.lineWidth=3;
  ctx.beginPath();ctx.moveTo(-w/2,-143);ctx.quadraticCurveTo(0,-177,w/2,-143);ctx.stroke();
  for(const side of [-1,1]){
    ctx.fillStyle="#e7c779";ctx.beginPath();
    ctx.moveTo(side*(grand?162:112),-108);
    ctx.quadraticCurveTo(side*(grand?190:135),-126,side*(grand?204:145),-151);
    ctx.lineTo(side*(grand?178:125),-138);ctx.closePath();ctx.fill();
    ctx.fillStyle="#fff0bd";ctx.beginPath();ctx.arc(side*(grand?178:125),-143,4,0,Math.PI*2);ctx.fill();
  }
  ctx.fillStyle="#f5d994";ctx.beginPath();ctx.arc(0,-171,5,0,Math.PI*2);ctx.fill();
  ctx.restore();
}

function drawScenery(time) {
  drawSky(time);drawMountainRange();drawMovingClouds(time);
  drawRiver(time);
  // Nâng toàn bộ tiên môn, đỉnh mái và bảng hiệu vượt rõ đường đua trên cùng.
  drawFloatingPlatform(150,220,.92);drawFloatingPlatform(950,210,.90);
  drawPagoda(150,235,1.02,"#554335");drawPagoda(950,220,1.06,"#584333");
  drawPalaceWithSign(270,270,.70,false);drawPalaceWithSign(830,265,.72,false);
  drawPalaceWithSign(550,205,1.48,true);
  drawWaterfall(900,255,34,145,time);drawWaterfall(105,300,24,105,time);
  // Cây nằm trên sườn núi hai bên, không mọc trên sân lát đá.
  drawPine(18,470,1.16);drawPine(65,480,.98);drawPine(112,470,.86);
  drawTree(42,505,.82);drawTree(125,515,.72);
  drawPine(982,470,1.16);drawPine(1035,480,.98);drawPine(1080,470,.86);
  drawTree(970,505,.82);drawTree(1060,515,.72);
  // Cố ý không gọi drawBridge() để bỏ hàng cột chắn ngang.
  drawCrowd(time);
}

function drawRacingArtifact(target,kind,phase) {
  target.save();target.translate(0,19);target.rotate(Math.sin(phase)*.018);
  const gold="#c69a50",bright="#f5e7b6",steel="#cbd7d4",dark="#604832";
  target.globalAlpha=.38;target.strokeStyle="#ffe8a8";target.lineWidth=2;
  target.beginPath();target.ellipse(0,8,42,5,0,0,Math.PI*2);target.stroke();target.globalAlpha=1;

  if(kind===0||kind===1){
    // Kiếm ngang: chuôi ở sau bên trái, mũi kiếm hướng trước bên phải.
    target.fillStyle=dark;target.fillRect(-38,-3,19,6);
    target.fillStyle=gold;target.fillRect(-22,-7,5,14);
    target.fillStyle=steel;target.beginPath();
    target.moveTo(-18,-4);target.lineTo(24,-4);target.lineTo(41,0);
    target.lineTo(24,4);target.lineTo(-18,4);target.closePath();target.fill();
    target.strokeStyle=bright;target.lineWidth=1.5;target.stroke();
    target.fillStyle="#75cbd1";target.beginPath();target.arc(-29,0,2.5,0,Math.PI*2);target.fill();
  }else if(kind===2||kind===3){
    // Thương/giáo: cán ngang, mũi nhọn hướng phải.
    target.strokeStyle="#805a38";target.lineWidth=5;target.lineCap="round";
    target.beginPath();target.moveTo(-39,1);target.lineTo(25,1);target.stroke();
    target.strokeStyle="#d8b36a";target.lineWidth=1.5;
    target.beginPath();target.moveTo(-35,-1);target.lineTo(23,-1);target.stroke();
    target.fillStyle=steel;target.beginPath();target.moveTo(22,-7);
    target.lineTo(43,1);target.lineTo(22,8);target.lineTo(27,1);target.closePath();target.fill();
    target.strokeStyle=bright;target.lineWidth=1;target.stroke();
    target.fillStyle="#b8493e";target.beginPath();target.moveTo(8,1);
    target.lineTo(2,-7);target.lineTo(14,-3);target.closePath();target.fill();
  }else if(kind===4){
    // Quạt xòe ngang, cán ở phía sau.
    target.fillStyle="#d8c38e";target.beginPath();target.moveTo(-27,0);
    target.quadraticCurveTo(-4,-24,31,-15);target.quadraticCurveTo(18,0,31,15);
    target.quadraticCurveTo(-4,24,-27,0);target.closePath();target.fill();
    target.strokeStyle="#8e6843";target.lineWidth=2;
    for(let i=-2;i<=2;i++){target.beginPath();target.moveTo(-27,0);target.lineTo(29,i*7);target.stroke();}
    target.strokeStyle=gold;target.lineWidth=5;target.beginPath();
    target.moveTo(-31,-5);target.lineTo(-40,0);target.lineTo(-31,5);target.stroke();
  }else if(kind===5){
    // Hồ lô nằm ngang: nút ở đuôi trái, đầu bầu hướng trước phải.
    target.fillStyle="#348a70";target.beginPath();target.ellipse(-3,0,18,11,0,0,Math.PI*2);target.fill();
    target.beginPath();target.ellipse(12,0,11,8,0,0,Math.PI*2);target.fill();
    target.fillStyle="#d8bd78";target.fillRect(-25,-4,9,8);target.fillRect(-30,-2,6,4);
    target.fillStyle="#e6d18d";target.fillRect(20,-4,9,8);
    target.strokeStyle=gold;target.lineWidth=2;
    target.beginPath();target.ellipse(-3,0,18,11,0,0,Math.PI*2);target.stroke();
    target.beginPath();target.ellipse(12,0,11,8,0,0,Math.PI*2);target.stroke();
  }else if(kind===6){
    // Liên đài thuôn dài, đầu nhọn dẫn hướng phía trước.
    target.fillStyle="#d9b96f";target.beginPath();target.moveTo(-36,5);
    target.quadraticCurveTo(-10,17,20,5);target.lineTo(42,0);target.lineTo(20,-5);
    target.quadraticCurveTo(-10,-17,-36,-5);target.closePath();target.fill();
    target.strokeStyle=bright;target.lineWidth=2;target.beginPath();target.moveTo(-30,0);target.lineTo(40,0);target.stroke();
    target.fillStyle="#75c8bb";target.beginPath();target.arc(-4,-1,7,0,Math.PI*2);target.fill();
  }else{
    // Nguyệt luân đặt nằm ngang, mũi dẫn hướng ở bên phải.
    target.strokeStyle="#c6d6d1";target.lineWidth=6;target.beginPath();target.ellipse(0,0,29,10,0,0,Math.PI*2);target.stroke();
    target.strokeStyle="#f5e5ad";target.lineWidth=2;target.beginPath();target.ellipse(0,0,23,6,0,0,Math.PI*2);target.stroke();
    target.fillStyle=gold;target.beginPath();target.moveTo(25,-7);target.lineTo(42,0);target.lineTo(25,7);target.closePath();target.fill();
  }
  target.restore();
}

function drawRacer(target,racer,x,y,scale,time) {
  target.save();target.translate(x,y+Math.sin(time*.009+racer.phase)*2);target.scale(scale,scale);
  const glow=target.createRadialGradient(0,0,3,0,0,43);
  glow.addColorStop(0,"rgba(255,225,139,.35)");glow.addColorStop(1,"rgba(255,225,139,0)");
  target.fillStyle=glow;target.fillRect(-48,-45,96,90);
  drawRacingArtifact(target,artifactKind(racer),time*.004+racer.phase);
  target.fillStyle=racer.dark;target.fillRect(-10,-5,20,22);
  target.fillStyle=racer.color;target.fillRect(-9,-7,18,21);
  target.fillRect(-14,-2,5,14);target.fillRect(9,-2,5,14);
  target.fillStyle="#f0c49b";target.fillRect(-7,-22,14,14);
  target.fillStyle="#29252a";target.fillRect(-8,-25,16,5);target.fillRect(-7,-28,13,4);
  target.fillRect(-9,-21,3,8);target.fillRect(6,-21,3,8);target.fillRect(4,-31,3,7);
  target.fillStyle="#392a26";target.fillRect(-4,-17,2,2);target.fillRect(3,-17,2,2);
  target.fillStyle="#e8cb83";target.fillRect(-8,5,16,2);
  target.restore();
}
