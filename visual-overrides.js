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
  // Quảng trường chỉ chiếm phần trung tâm, chừa hai sườn núi và hàng cây hai bên.
  const left=225, right=875, top=405;
  const floor=ctx.createLinearGradient(0,top,0,H);
  floor.addColorStop(0,"#d9c79d");floor.addColorStop(.28,"#c7b184");
  floor.addColorStop(.72,"#927c5b");floor.addColorStop(1,"#5d503d");
  ctx.fillStyle=floor;ctx.beginPath();
  ctx.moveTo(left,top+8);ctx.quadraticCurveTo(550,top-18,right,top+8);
  ctx.lineTo(930,H);ctx.lineTo(170,H);ctx.closePath();ctx.fill();
  ctx.save();ctx.beginPath();ctx.moveTo(left,top+8);
  ctx.quadraticCurveTo(550,top-18,right,top+8);
  ctx.lineTo(930,H);ctx.lineTo(170,H);ctx.closePath();ctx.clip();
  for(let y=430;y<H+20;y+=32){
    ctx.strokeStyle="rgba(255,239,199,.28)";ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(185-(y-top)*.16,y);ctx.lineTo(915+(y-top)*.16,y);ctx.stroke();
  }
  for(let x=210;x<=890;x+=78){
    ctx.strokeStyle="rgba(75,59,39,.16)";ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(550+(x-550)*.12,top);ctx.lineTo(x,H);ctx.stroke();
  }
  ctx.strokeStyle="rgba(255,225,164,.2)";ctx.lineWidth=2;
  for(let i=0;i<5;i++){ctx.beginPath();ctx.ellipse(550,690,85+i*36,20+i*8,0,0,Math.PI*2);ctx.stroke();}
  ctx.restore();
  ctx.strokeStyle="#ead39c";ctx.lineWidth=3;ctx.beginPath();
  ctx.moveTo(left,top+7);ctx.quadraticCurveTo(550,top-20,right,top+7);ctx.stroke();
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
  // Chỉ dùng một bảng hiệu gốc do scenery.js vẽ; không chồng thêm bảng thứ hai.
  drawPalace(x,y,scale,grand);
}

function drawScenery(time) {
  drawSky(time);drawMountainRange();drawMovingClouds(time);
  drawRiver(time);
  // Nâng toàn bộ tiên môn, đỉnh mái và bảng hiệu vượt rõ đường đua trên cùng.
  drawFloatingPlatform(150,220,.92);drawFloatingPlatform(950,210,.90);
  drawPagoda(150,235,1.02,"#554335");drawPagoda(950,220,1.06,"#584333");
  drawPalaceWithSign(270,270,.52,false);drawPalaceWithSign(830,265,.52,false);
  drawPalaceWithSign(550,220,1.08,true);
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


// =====================================================
// REVISION 3 — thác nghiêng, HUD cân giữa và tinh chỉnh cảnh
// =====================================================
function drawWaterfall(x,y,width,height,time) {
  ctx.save();
  const dx=width*.42;
  ctx.fillStyle="#476c5a";ctx.beginPath();
  ctx.moveTo(x-18,y-4);ctx.lineTo(x+width+12,y+2);
  ctx.lineTo(x+width+dx+22,y+height);ctx.lineTo(x+dx-22,y+height-2);
  ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+width,y+2);
  ctx.lineTo(x+width+dx,y+height);ctx.lineTo(x+dx,y+height);ctx.closePath();ctx.clip();
  const water=ctx.createLinearGradient(x,y,x+dx,y+height);
  water.addColorStop(0,"#e4f3df");water.addColorStop(.34,"#a9d9d2");
  water.addColorStop(.72,"#68b4b0");water.addColorStop(1,"#438f8c");
  ctx.fillStyle=water;ctx.fillRect(x-8,y-4,width+dx+16,height+10);
  const drift=(time*.006)%34;
  for(let i=-2;i<Math.ceil(height/25)+3;i++){
    const yy=y+i*25+drift,xx=x+(yy-y)*.42;
    ctx.strokeStyle="rgba(255,255,230,.48)";ctx.lineWidth=1.7;
    ctx.beginPath();ctx.moveTo(xx+4,yy);ctx.lineTo(xx+width*.55,yy+7);ctx.stroke();
  }
  ctx.restore();
  ctx.fillStyle="rgba(226,246,231,.42)";
  ctx.beginPath();ctx.ellipse(x+dx+width*.52,y+height,width*1.65,8,.04,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle="rgba(231,249,235,.65)";ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(x+dx+width*.15,y+height-3);
  ctx.quadraticCurveTo(x+dx+width*.55,y+height+5,x+dx+width,y+height-2);ctx.stroke();
}
function drawRaceHud() {
  const remaining=Math.max(0,duration-elapsed),completed=racers.filter(r=>r.finished).length;
  const gap=14,leftWidth=220,rightWidth=190,total=220+14+190;
  const left=(W-total)/2,y=14,h=52;
  function centeredBox(x,w,label,value) {
    ctx.save();ctx.fillStyle="rgba(20,48,39,.9)";ctx.fillRect(x,y,w,h);
    ctx.strokeStyle="rgba(224,194,126,.85)";ctx.lineWidth=1;ctx.strokeRect(x+.5,y+.5,w-1,h-1);
    ctx.textAlign="center";ctx.textBaseline="middle";
    ctx.fillStyle="#e0c991";ctx.font="bold 10px Arial";ctx.fillText(label,x+w/2,y+13,w-12);
    ctx.fillStyle="#fff0c7";ctx.font="bold 21px Arial";ctx.fillText(value,x+w/2,y+37,w-12);
    ctx.restore();
  }
  centeredBox(left,leftWidth,"THỜI GIAN CÒN LẠI",timeText(remaining));
  centeredBox(left+leftWidth+gap,rightWidth,"HOÀN THÀNH",`${completed} / ${racers.length}`);
}


// =====================================================
// REVISION 4 — quảng trường toàn bề ngang, tiên sơn và kiến trúc
// =====================================================
function drawRiver(time) {
  const edgeY=530;
  const floor=ctx.createLinearGradient(0,475,0,H);
  floor.addColorStop(0,"#d9c99f");floor.addColorStop(.22,"#c7b58d");
  floor.addColorStop(.62,"#a18b66");floor.addColorStop(1,"#66543d");
  ctx.fillStyle=floor;ctx.beginPath();ctx.moveTo(0,edgeY);
  ctx.quadraticCurveTo(W*.5,460,W,edgeY);ctx.lineTo(W,H);ctx.lineTo(0,H);
  ctx.closePath();ctx.fill();
  ctx.save();ctx.beginPath();ctx.moveTo(0,edgeY);
  ctx.quadraticCurveTo(W*.5,460,W,edgeY);ctx.lineTo(W,H);ctx.lineTo(0,H);
  ctx.closePath();ctx.clip();
  for(let y=485;y<H+28;y+=31){
    const spread=(y-460)*.48;ctx.strokeStyle="rgba(255,241,205,.30)";
    ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(-spread,y);
    ctx.lineTo(W+spread,y);ctx.stroke();
  }
  for(let x=-440;x<=W+440;x+=88){
    ctx.strokeStyle="rgba(75,59,39,.15)";ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(W*.5+(x-W*.5)*.12,465);ctx.lineTo(x,H);ctx.stroke();
  }
  ctx.strokeStyle="rgba(255,224,164,.20)";ctx.lineWidth=2;
  for(let i=0;i<5;i++){
    ctx.beginPath();ctx.ellipse(W*.5,690,92+i*37,17+i*8,0,0,Math.PI*2);ctx.stroke();
  }
  ctx.restore();
  ctx.strokeStyle="#e8d29d";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(0,edgeY+1);
  ctx.quadraticCurveTo(W*.5,461,W,edgeY+1);ctx.stroke();
  ctx.strokeStyle="rgba(91,70,43,.55)";ctx.lineWidth=2;ctx.beginPath();
  ctx.moveTo(0,edgeY+9);ctx.quadraticCurveTo(W*.5,470,W,edgeY+9);ctx.stroke();
  ctx.fillStyle="rgba(255,231,180,.32)";ctx.beginPath();
  ctx.moveTo(W*.5-30,505);ctx.lineTo(W*.5,489);ctx.lineTo(W*.5+30,505);
  ctx.lineTo(W*.5,521);ctx.closePath();ctx.fill();
}

function drawMountainRange() {
  function ridge(points,topColor,bottomColor){
    const g=ctx.createLinearGradient(0,80,0,470);g.addColorStop(0,topColor);g.addColorStop(1,bottomColor);
    ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(0,H);
    points.forEach(p=>ctx.lineTo(p[0],p[1]));ctx.lineTo(W,H);ctx.closePath();ctx.fill();
  }
  ridge([[0,330],[65,250],[120,280],[205,145],[265,220],[345,165],[425,265],[510,175],[590,245],[675,125],[735,205],[815,150],[900,255],[985,165],[1050,245],[1100,205]],"#b8c9b5","#829d89");
  ridge([[0,405],[75,315],[145,355],[235,235],[305,325],[390,245],[475,365],[565,255],[650,350],[745,225],[820,325],[915,235],[1000,350],[1060,285],[1100,320]],"#78957c","#4d765f");
  ridge([[0,485],[75,390],[150,430],[245,320],[330,420],[420,330],[515,450],[610,330],[700,425],[790,315],[875,430],[970,330],[1045,420],[1100,375]],"#426b55","#294d40");
  const cliffs=[[[205,145],[228,205],[265,220],[242,190]],[[675,125],[700,190],[735,205],[710,166]],[[985,165],[1008,225],[1050,245],[1020,207]],[[420,330],[445,382],[475,365],[454,350]],[[790,315],[820,370],[875,430],[840,365]]];
  cliffs.forEach((p,i)=>{
    ctx.fillStyle=i<3?"rgba(238,235,207,.62)":"rgba(207,220,190,.24)";
    ctx.beginPath();p.forEach((v,j)=>j?ctx.lineTo(v[0],v[1]):ctx.moveTo(v[0],v[1]));ctx.closePath();ctx.fill();
  });
  const mist=ctx.createLinearGradient(0,330,0,510);
  mist.addColorStop(0,"rgba(222,238,218,0)");mist.addColorStop(.55,"rgba(221,238,215,.20)");
  mist.addColorStop(1,"rgba(221,238,215,0)");ctx.fillStyle=mist;ctx.fillRect(0,320,W,200);
}

function drawSpiritBirds(time) {
  function bird(x,y,scale,phase,color,span){
    const flap=Math.sin(time*.004+phase)*7;ctx.save();
    ctx.translate(x,y+Math.sin(time*.0018+phase)*5);ctx.scale(scale,scale);
    ctx.strokeStyle=color;ctx.lineWidth=2.2;ctx.lineCap="round";ctx.beginPath();
    ctx.moveTo(-span,flap);ctx.quadraticCurveTo(-span*.48,-9-flap,0,0);
    ctx.quadraticCurveTo(span*.48,-9-flap,span,flap);ctx.stroke();ctx.restore();
  }
  [[345,150,.92,.2],[760,112,1.12,1.7],[930,185,.72,3.1]].forEach((v,i)=>{
    const x=v[0]+Math.sin(time*.00045+v[3])*24,y=v[1]+Math.sin(time*.001+v[3])*8,s=v[2];
    const flap=Math.sin(time*.003+v[3])*5;ctx.save();ctx.translate(x,y);ctx.scale(s,s);
    ctx.strokeStyle="#f7f4df";ctx.fillStyle="#f7f4df";ctx.lineWidth=2.4;
    ctx.beginPath();ctx.ellipse(0,0,17,5,-.08,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.moveTo(10,-1);ctx.quadraticCurveTo(22,-18,19,-25);ctx.quadraticCurveTo(17,-29,14,-25);ctx.stroke();
    ctx.beginPath();ctx.moveTo(18,-25);ctx.lineTo(25,-23);ctx.stroke();
    ctx.beginPath();ctx.moveTo(-3,1);ctx.quadraticCurveTo(-18,-13,-29,-flap-7);
    ctx.quadraticCurveTo(-17,-4,-3,3);ctx.quadraticCurveTo(15,-13,30,-flap-7);
    ctx.quadraticCurveTo(17,-2,-3,1);ctx.fill();ctx.stroke();
    ctx.strokeStyle="#b85a43";ctx.lineWidth=2;ctx.beginPath();
    ctx.moveTo(-5,4);ctx.lineTo(-9,13);ctx.moveTo(2,4);ctx.lineTo(0,13);ctx.stroke();ctx.restore();
  });
  for(let i=0;i<9;i++){
    const x=(i*137+time*(.012+(i%3)*.002))%(W+80)-40;
    const y=205+Math.sin(time*.0014+i*1.8)*32+(i%3)*19;
    bird(x,y,.48+(i%3)*.10,i*.9,"rgba(49,75,65,.78)",9+(i%3)*2);
  }
}

// Một mái chính liền khối, không còn các tầng mái lồng và khe hở.
function drawPalace(x,y,scale,grand=false) {
  ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);
  const bw=grand?238:174,roofHalf=bw*.72;
  const aura=ctx.createRadialGradient(0,-76,8,0,-76,grand?235:165);
  aura.addColorStop(0,"rgba(255,225,157,.28)");aura.addColorStop(1,"rgba(255,225,157,0)");
  ctx.fillStyle=aura;ctx.fillRect(-bw*1.5,-245,bw*3,300);
  ctx.fillStyle="#5c594b";ctx.beginPath();ctx.moveTo(-bw*.78,38);ctx.lineTo(bw*.78,38);
  ctx.lineTo(bw*.92,55);ctx.lineTo(-bw*.92,55);ctx.closePath();ctx.fill();
  ctx.fillStyle="#c6ad79";ctx.fillRect(-bw*.88,34,bw*1.76,7);
  ctx.fillStyle="#e2cc98";ctx.fillRect(-bw*.96,48,bw*1.92,7);

  ctx.fillStyle="#d8c397";ctx.fillRect(-bw/2,-72,bw,108);
  ctx.fillStyle="#73513b";ctx.fillRect(-bw/2+10,-62,bw-20,96);
  ctx.fillStyle="#a74437";ctx.fillRect(-bw/2+13,-56,bw-26,8);
  const door=grand?48:36;
  ctx.fillStyle="#342a25";ctx.fillRect(-door/2,-40,door,74);
  ctx.fillStyle="#b98b4d";ctx.fillRect(-door/2+4,-36,door-8,70);
  ctx.fillStyle="#342a25";ctx.fillRect(-door/2+8,-31,door-16,65);
  ctx.strokeStyle="#e5c77e";ctx.lineWidth=2;ctx.strokeRect(-door/2+8,-31,door-16,65);
  ctx.beginPath();ctx.moveTo(0,-31);ctx.lineTo(0,34);ctx.stroke();

  [-.42,-.25,.25,.42].forEach(k=>{
    const px=bw*k;ctx.fillStyle="#a94336";ctx.fillRect(px-5,-68,10,105);
    ctx.fillStyle="#e6c77f";ctx.fillRect(px-7,-66,14,4);ctx.fillRect(px-7,31,14,5);
    ctx.fillStyle="rgba(255,225,165,.32)";ctx.fillRect(px-2,-60,2,86);
  });
  [-.34,.34].forEach(k=>{
    const px=bw*k;ctx.fillStyle="#d9b873";ctx.fillRect(px-13,-42,26,39);
    ctx.fillStyle="#29463e";ctx.fillRect(px-9,-38,18,31);
    ctx.strokeStyle="#e6c77d";ctx.lineWidth=2;ctx.beginPath();
    ctx.moveTo(px,-38);ctx.lineTo(px,-7);ctx.moveTo(px-9,-23);ctx.lineTo(px+9,-23);ctx.stroke();
  });

  // Mái kín, một khối ngói cong; diềm vàng chỉ viền mặt trước.
  ctx.fillStyle="#302f2d";ctx.beginPath();ctx.moveTo(-roofHalf-18,-78);
  ctx.quadraticCurveTo(-roofHalf*.82,-85,0,-143);
  ctx.quadraticCurveTo(roofHalf*.82,-85,roofHalf+18,-78);
  ctx.lineTo(roofHalf+5,-65);ctx.quadraticCurveTo(0,-121,-roofHalf-5,-65);
  ctx.closePath();ctx.fill();
  const rg=ctx.createLinearGradient(0,-140,0,-64);
  rg.addColorStop(0,"#bd9855");rg.addColorStop(.48,"#80603d");rg.addColorStop(1,"#493b31");
  ctx.fillStyle=rg;ctx.beginPath();ctx.moveTo(-roofHalf-10,-80);
  ctx.quadraticCurveTo(-roofHalf*.72,-87,0,-137);
  ctx.quadraticCurveTo(roofHalf*.72,-87,roofHalf+10,-80);
  ctx.lineTo(roofHalf-1,-70);ctx.quadraticCurveTo(0,-119,-roofHalf+1,-70);
  ctx.closePath();ctx.fill();
  ctx.strokeStyle="#e8cc83";ctx.lineWidth=4;ctx.beginPath();
  ctx.moveTo(-roofHalf-13,-78);ctx.quadraticCurveTo(0,-147,roofHalf+13,-78);ctx.stroke();
  ctx.strokeStyle="rgba(255,229,170,.38)";ctx.lineWidth=1;
  for(let i=-5;i<=5;i++){
    const px=i*roofHalf*.14;ctx.beginPath();ctx.moveTo(px,-132+Math.abs(i)*3);
    ctx.lineTo(px*1.55,-75);ctx.stroke();
  }
  ctx.strokeStyle="#e6c47b";ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();
  ctx.moveTo(-roofHalf-12,-78);ctx.quadraticCurveTo(-roofHalf-31,-84,-roofHalf-28,-101);
  ctx.moveTo(roofHalf+12,-78);ctx.quadraticCurveTo(roofHalf+31,-84,roofHalf+28,-101);ctx.stroke();
  ctx.fillStyle="#f2d994";ctx.beginPath();ctx.arc(0,-140,5,0,Math.PI*2);ctx.fill();

  // Một bảng hiệu duy nhất, đủ chiều cao cho dấu tiếng Việt.
  const pw=grand?154:112,py=-111;
  ctx.fillStyle="#33251d";ctx.fillRect(-pw/2-5,py-5,pw+10,31);
  ctx.fillStyle="#d9b66e";ctx.fillRect(-pw/2-2,py-2,pw+4,25);
  ctx.fillStyle="#77332b";ctx.fillRect(-pw/2+2,py+2,pw-4,17);
  ctx.strokeStyle="#fff0bd";ctx.lineWidth=1.5;ctx.strokeRect(-pw/2+4,py+3,pw-8,15);
  ctx.fillStyle="#fff1c8";ctx.font="bold "+(grand?15:13)+"px serif";
  ctx.textAlign="center";ctx.textBaseline="middle";ctx.shadowColor="#ffe3a0";ctx.shadowBlur=4;
  ctx.fillText(grand?"VẠN KIẾM ĐIỆN":"TIÊN ĐIỆN",0,py+10,pw-13);ctx.shadowBlur=0;
  [-bw*.77,bw*.77].forEach(px=>{
    ctx.fillStyle="#d8bb78";ctx.fillRect(px,-157,2,75);ctx.fillStyle="#a64035";
    ctx.beginPath();ctx.moveTo(px+2,-154);ctx.lineTo(px+29,-145);ctx.lineTo(px+2,-135);ctx.closePath();ctx.fill();
  });
  ctx.restore();
}

function drawScenery(time) {
  drawSky(time);drawMountainRange();drawMovingClouds(time);drawSpiritBirds(time);
  drawWaterfall(890,250,30,205,time);drawWaterfall(112,315,22,145,time);

  // Tiên Điện nằm trên các sườn núi cao.
  drawFloatingPlatform(790,397,.92);drawFloatingPlatform(970,435,.62);
  drawPalace(790,354,.78,false);drawPalace(970,405,.54,false);

  // Vạn Kiếm Điện ở ranh giới rừng và quảng trường.
  drawFloatingPlatform(178,482,.92);drawPalace(178,440,.76,true);

  // Cây ở bìa rừng; nền quảng trường sẽ che phần gốc phía dưới đường biên.
  drawPine(24,535,1.05,"#294f3d");drawPine(78,532,.96,"#315b45");
  drawTree(132,531,.82,"#426b4c");drawPine(250,508,.74,"#315b45");
  drawTree(315,500,.66,"#426b4c");drawTree(850,500,.66,"#426b4c");
  drawPine(920,508,.74,"#315b45");drawPine(1020,532,.96,"#315b45");
  drawPine(1075,535,1.05,"#294f3d");

  drawRiver(time);
  drawCrowd(time);
}

// HUD ở hai góc trên, nền xanh ôm vừa nhãn và số liệu.
function drawRaceHud() {
  const remaining=Math.max(0,duration-elapsed);
  const completed=racers.filter(r=>r.finished).length;
  const items=[
    {x:12,label:"THỜI GIAN",value:timeText(remaining),align:"left"},
    {x:W-12,label:"HOÀN THÀNH",value:String(completed)+" / "+String(racers.length),align:"right"}
  ];
  items.forEach(item=>{
    ctx.save();ctx.font="bold 10px Arial";
    const labelW=ctx.measureText(item.label).width;
    ctx.font="bold 20px Arial";const valueW=ctx.measureText(item.value).width;
    const boxW=Math.ceil(Math.max(labelW,valueW)+22),boxH=49;
    const x=item.align==="left"?item.x:item.x-boxW,y=12;
    ctx.fillStyle="rgba(20,48,39,.92)";ctx.fillRect(x,y,boxW,boxH);
    ctx.strokeStyle="rgba(224,194,126,.88)";ctx.lineWidth=1;
    ctx.strokeRect(x+.5,y+.5,boxW-1,boxH-1);
    ctx.textAlign="center";ctx.textBaseline="middle";
    ctx.fillStyle="#e0c991";ctx.font="bold 10px Arial";
    ctx.fillText(item.label,x+boxW/2,y+12,boxW-8);
    ctx.fillStyle="#fff0c7";ctx.font="bold 20px Arial";
    ctx.fillText(item.value,x+boxW/2,y+34,boxW-8);ctx.restore();
  });
}


// =====================================================
// REVISION 5 — quảng trường gọn, tiên sơn, hồ suối và khán đài
// =====================================================

function drawRiver(time) {
  const edgeY=610;
  const g=ctx.createLinearGradient(0,edgeY,0,H);
  g.addColorStop(0,"#d9c99f");g.addColorStop(.25,"#c6b38a");
  g.addColorStop(.68,"#947d59");g.addColorStop(1,"#62503a");
  ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(0,edgeY);
  ctx.quadraticCurveTo(W*.5,590,W,edgeY);ctx.lineTo(W,H);ctx.lineTo(0,H);
  ctx.closePath();ctx.fill();

  ctx.save();ctx.beginPath();ctx.moveTo(0,edgeY);
  ctx.quadraticCurveTo(W*.5,590,W,edgeY);ctx.lineTo(W,H);ctx.lineTo(0,H);
  ctx.closePath();ctx.clip();
  for(let y=625;y<H+20;y+=35){
    const spread=(y-600)*.42;
    ctx.strokeStyle="rgba(255,239,199,.28)";ctx.lineWidth=1.6;
    ctx.beginPath();ctx.moveTo(-spread,y);ctx.lineTo(W+spread,y);ctx.stroke();
  }
  for(let x=-380;x<W+400;x+=90){
    ctx.strokeStyle="rgba(75,58,37,.17)";ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(W*.5+(x-W*.5)*.13,595);ctx.lineTo(x,H);ctx.stroke();
  }
  ctx.strokeStyle="rgba(255,226,167,.19)";ctx.lineWidth=2;
  for(let i=0;i<4;i++){
    ctx.beginPath();ctx.ellipse(W*.5,715,70+i*34,14+i*6,0,0,Math.PI*2);ctx.stroke();
  }
  ctx.restore();
  ctx.strokeStyle="#e7d19d";ctx.lineWidth=4;
  ctx.beginPath();ctx.moveTo(0,edgeY);ctx.quadraticCurveTo(W*.5,590,W,edgeY);ctx.stroke();
  ctx.strokeStyle="rgba(85,65,42,.42)";ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(0,edgeY+8);ctx.quadraticCurveTo(W*.5,599,W,edgeY+8);ctx.stroke();
}

// Suối núi uốn quanh chân núi, đổ xuống hồ xanh ngọc dưới chân thác.
function drawMountainStream(time) {
  ctx.save();
  // Bờ đá tối, nhiều lớp bờ cát và rêu.
  ctx.lineCap="round";ctx.lineJoin="round";
  ctx.strokeStyle="#455c4b";ctx.lineWidth=43;
  ctx.beginPath();ctx.moveTo(70,520);ctx.bezierCurveTo(190,490,250,565,370,548);
  ctx.bezierCurveTo(485,530,520,480,650,500);ctx.bezierCurveTo(740,515,790,485,880,480);ctx.stroke();
  ctx.strokeStyle="#9b9a70";ctx.lineWidth=34;ctx.stroke();
  const water=ctx.createLinearGradient(0,475,0,570);
  water.addColorStop(0,"#bce6dc");water.addColorStop(.42,"#65b8b0");water.addColorStop(1,"#267e82");
  ctx.strokeStyle=water;ctx.lineWidth=25;
  ctx.beginPath();ctx.moveTo(70,518);ctx.bezierCurveTo(190,488,250,562,370,545);
  ctx.bezierCurveTo(485,526,520,477,650,497);ctx.bezierCurveTo(740,512,790,482,880,478);ctx.stroke();

  // Vân nước chuyển động chậm theo dòng.
  const shift=(time*.018)%70;
  for(let i=0;i<9;i++){
    const t=(i/9+shift/70)%1;
    const x=90+t*760,y=514+Math.sin(t*8)*23;
    ctx.strokeStyle="rgba(240,255,239,.52)";ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(x-12,y-2);ctx.quadraticCurveTo(x,y-6,x+14,y+1);ctx.stroke();
  }

  // Hồ nước chân thác: lòng hồ sâu, bờ đá, gợn sóng và bọt trắng.
  const lx=895,ly=493;
  const lake=ctx.createRadialGradient(lx-20,ly-12,5,lx,ly,125);
  lake.addColorStop(0,"#c4eee0");lake.addColorStop(.42,"#62b8ad");lake.addColorStop(1,"#285f60");
  ctx.fillStyle="#465d4d";ctx.beginPath();ctx.ellipse(lx,ly+7,125,48,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=lake;ctx.beginPath();ctx.ellipse(lx,ly,116,39,-.04,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle="rgba(230,255,238,.58)";ctx.lineWidth=2;
  for(let i=0;i<4;i++){
    ctx.beginPath();ctx.ellipse(lx-4,ly+2,26+i*19,7+i*4,-.05,0,Math.PI*2);ctx.stroke();
  }
  ctx.fillStyle="rgba(242,255,239,.48)";
  for(let i=0;i<8;i++){
    const a=i*.78+time*.0002;
    ctx.beginPath();ctx.ellipse(lx+Math.cos(a)*38,ly+Math.sin(a)*13,3,1.5,a,0,Math.PI*2);ctx.fill();
  }
  // Mỏm đá và rêu hai bờ.
  for(let i=0;i<9;i++){
    const x=785+i*26,y=475+(i%3)*12;
    ctx.fillStyle=i%2?"#68765a":"#817b60";
    ctx.beginPath();ctx.ellipse(x,y,13,7,-.3,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="rgba(102,151,99,.75)";
    ctx.beginPath();ctx.ellipse(x-2,y-5,8,3,-.4,0,Math.PI*2);ctx.fill();
  }
  ctx.restore();
}

// Tăng chiều sâu địa hình núi: vân đá, sườn gãy, tuyết và thảm cây.
function drawMountainRange() {
  function layer(points,top,bottom){
    const grad=ctx.createLinearGradient(0,90,0,570);
    grad.addColorStop(0,top);grad.addColorStop(1,bottom);
    ctx.fillStyle=grad;ctx.beginPath();ctx.moveTo(0,H);
    points.forEach(p=>ctx.lineTo(p[0],p[1]));ctx.lineTo(W,H);ctx.closePath();ctx.fill();
  }
  layer([[0,350],[70,245],[125,282],[210,112],[270,215],[350,145],[430,260],[515,170],[600,250],[680,100],[745,208],[820,135],[905,250],[990,145],[1050,235],[W,190]],"#c9d5c4","#839b88");
  layer([[0,420],[80,310],[150,350],[235,210],[310,320],[395,225],[480,360],[565,235],[655,340],[750,205],[830,320],[920,215],[1005,335],[W,290]],"#819b82","#4e7059");
  layer([[0,505],[85,390],[165,445],[255,305],[345,415],[435,315],[525,455],[615,315],[705,430],[800,295],[885,420],[975,310],[1050,410],[W,365]],"#4d7358","#294b3c");

  // Mặt đá bắt sáng trên các đỉnh cao.
  const faces=[
    [[210,112],[228,188],[270,215],[247,163]],
    [[350,145],[372,211],[430,260],[390,185]],
    [[680,100],[706,178],[745,208],[716,151]],
    [[820,135],[850,210],[905,250],[865,174]],
    [[990,145],[1015,205],[1050,235],[1028,182]]
  ];
  faces.forEach((p,i)=>{
    ctx.fillStyle=i%2?"rgba(231,237,211,.32)":"rgba(247,245,218,.62)";
    ctx.beginPath();p.forEach((v,j)=>j?ctx.lineTo(v[0],v[1]):ctx.moveTo(v[0],v[1]));ctx.closePath();ctx.fill();
  });

  // Khe nứt và tầng đá theo sườn núi.
  ctx.lineCap="round";
  for(let i=0;i<22;i++){
    const x=40+i*49,y=330+(i%4)*28;
    ctx.strokeStyle=i%2?"rgba(27,55,43,.22)":"rgba(230,229,194,.22)";
    ctx.lineWidth=i%3===0?3:1.5;ctx.beginPath();
    ctx.moveTo(x,y);ctx.lineTo(x+10+(i%3)*7,y+17+(i%4)*5);
    ctx.lineTo(x+24+(i%2)*8,y+24+(i%3)*6);ctx.stroke();
  }

  // Rừng tùng thu nhỏ thành từng cụm trên các sườn xa.
  for(let i=0;i<30;i++){
    const x=18+i*38,y=420+(i%4)*18;
    ctx.fillStyle=i%2?"rgba(32,77,57,.72)":"rgba(45,91,65,.76)";
    ctx.beginPath();ctx.moveTo(x,y-15);ctx.lineTo(x-9,y+8);ctx.lineTo(x+9,y+8);ctx.closePath();ctx.fill();
  }
  const haze=ctx.createLinearGradient(0,365,0,570);
  haze.addColorStop(0,"rgba(220,237,218,0)");haze.addColorStop(.55,"rgba(215,235,218,.19)");
  haze.addColorStop(1,"rgba(215,235,218,0)");ctx.fillStyle=haze;ctx.fillRect(0,360,W,210);
}

// Tiên hạc và linh điểu có thân, cổ, đuôi, lông cánh và nhịp bay riêng.
function drawSpiritBirds(time) {
  const cranes=[[315,145,.95,.3],[710,105,1.16,1.8],[955,180,.78,3.2]];
  cranes.forEach((b,index)=>{
    const phase=b[3],x=b[0]+Math.sin(time*.00042+phase)*27;
    const y=b[1]+Math.sin(time*.001+phase)*8,flap=Math.sin(time*.0032+phase);
    ctx.save();ctx.translate(x,y);ctx.scale(b[2],b[2]);
    // Thân hạc và cổ cong thanh thoát.
    ctx.fillStyle="#f7f4e5";ctx.beginPath();ctx.ellipse(0,0,19,6,-.08,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle="#f7f4e5";ctx.lineWidth=3;ctx.lineCap="round";
    ctx.beginPath();ctx.moveTo(12,-1);ctx.bezierCurveTo(23,-10,23,-23,16,-27);ctx.stroke();
    ctx.fillStyle="#f7f4e5";ctx.beginPath();ctx.arc(15,-28,4,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle="#c65b42";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(18,-28);ctx.lineTo(27,-26);ctx.stroke();
    // Cánh xòe nhiều lớp lông.
    ctx.fillStyle="#fffdf0";ctx.beginPath();
    ctx.moveTo(-3,0);ctx.quadraticCurveTo(-22,-12,-31,-(10+flap*8));
    ctx.quadraticCurveTo(-21,-2,-4,4);ctx.quadraticCurveTo(12,-13,32,-(10+flap*8));
    ctx.quadraticCurveTo(18,-1,-3,0);ctx.fill();
    ctx.strokeStyle="rgba(202,211,194,.9)";ctx.lineWidth=1.1;
    for(let f=0;f<6;f++){
      const t=f/5;
      ctx.beginPath();ctx.moveTo(-5-t*3,1-t*2);ctx.quadraticCurveTo(-18-t*2,-5-flap*5,-28-t*1.5,-8-flap*8);ctx.stroke();
      ctx.beginPath();ctx.moveTo(3+t*2,1-t*2);ctx.quadraticCurveTo(18+t*2,-5-flap*5,29+t*1.5,-8-flap*8);ctx.stroke();
    }
    // Đuôi dài và chân đỏ.
    ctx.strokeStyle="#f7f4e5";ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(-15,1);ctx.lineTo(-31,-4);ctx.moveTo(-15,3);ctx.lineTo(-29,5);ctx.stroke();
    ctx.strokeStyle="#b94f40";ctx.lineWidth=1.7;ctx.beginPath();
    ctx.moveTo(-5,5);ctx.lineTo(-8,15);ctx.moveTo(3,5);ctx.lineTo(1,15);ctx.stroke();
    ctx.restore();
  });

  // Linh điểu nhỏ bay theo đàn, cánh có độ cong và lệch nhịp.
  for(let i=0;i<12;i++){
    const x=(i*113+time*(.009+(i%4)*.002))%(W+100)-50;
    const y=225+Math.sin(time*.0012+i*1.4)*38+(i%3)*13;
    const f=Math.sin(time*.004+i)*5;
    ctx.save();ctx.translate(x,y);ctx.scale(.65+(i%3)*.12,.65+(i%3)*.12);
    ctx.strokeStyle=i%4===0?"#d7c99b":"rgba(43,69,58,.86)";
    ctx.lineWidth=2.2;ctx.lineCap="round";ctx.beginPath();
    ctx.moveTo(-13,f);ctx.quadraticCurveTo(-7,-10-f,0,0);
    ctx.quadraticCurveTo(7,-10-f,13,f);ctx.stroke();ctx.restore();
  }
}

// Mái ngói cong sát thân điện, diềm mái liền nhà; biển hiệu treo ở mặt trước,
// đúng khoảng giữa mép mái và thân điện.
function drawPalace(x,y,scale,grand=false) {
  ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);
  const bw=grand?250:184,half=bw*.76;
  const aura=ctx.createRadialGradient(0,-65,5,0,-65,grand?220:155);
  aura.addColorStop(0,"rgba(255,225,157,.24)");aura.addColorStop(1,"rgba(255,225,157,0)");
  ctx.fillStyle=aura;ctx.fillRect(-bw*1.4,-225,bw*2.8,280);

  // Bệ đá.
  ctx.fillStyle="#5d5747";ctx.fillRect(-bw*.72,30,bw*1.44,14);
  ctx.fillStyle="#d1b77e";ctx.fillRect(-bw*.82,40,bw*1.64,7);
  ctx.fillStyle="#ead5a2";ctx.fillRect(-bw*.9,48,bw*1.8,7);

  // Thân điện.
  ctx.fillStyle="#d9c69a";ctx.fillRect(-bw/2,-70,bw,104);
  ctx.fillStyle="#684b39";ctx.fillRect(-bw/2+10,-60,bw-20,94);
  ctx.fillStyle="#a84337";ctx.fillRect(-bw/2+12,-54,bw-24,8);
  const door=grand?50:36;
  ctx.fillStyle="#302923";ctx.fillRect(-door/2,-38,door,72);
  ctx.fillStyle="#c39a59";ctx.fillRect(-door/2+4,-34,door-8,68);
  ctx.fillStyle="#302923";ctx.fillRect(-door/2+8,-30,door-16,64);
  ctx.strokeStyle="#ebcf8a";ctx.lineWidth=2;ctx.strokeRect(-door/2+8,-30,door-16,64);
  ctx.beginPath();ctx.moveTo(0,-30);ctx.lineTo(0,34);ctx.stroke();

  [-.42,-.25,.25,.42].forEach(k=>{
    const px=bw*k;ctx.fillStyle="#a84337";ctx.fillRect(px-5,-66,10,101);
    ctx.fillStyle="#e6c77f";ctx.fillRect(px-7,-64,14,4);ctx.fillRect(px-7,29,14,5);
  });
  [-.34,.34].forEach(k=>{
    const px=bw*k;ctx.fillStyle="#d7b66e";ctx.fillRect(px-12,-41,24,37);
    ctx.fillStyle="#29463e";ctx.fillRect(px-8,-37,16,29);
    ctx.strokeStyle="#e8c97d";ctx.lineWidth=2;ctx.beginPath();
    ctx.moveTo(px,-37);ctx.lineTo(px,-8);ctx.moveTo(px-8,-22);ctx.lineTo(px+8,-22);ctx.stroke();
  });

  // Mái liền khối với đầu đao, mặt dưới chạm sát đỉnh thân nhà.
  ctx.fillStyle="#302b29";ctx.beginPath();ctx.moveTo(-half-22,-73);
  ctx.quadraticCurveTo(-half*.78,-84,0,-142);
  ctx.quadraticCurveTo(half*.78,-84,half+22,-73);
  ctx.lineTo(half+8,-62);ctx.quadraticCurveTo(0,-119,-half-8,-62);
  ctx.closePath();ctx.fill();
  const roof=ctx.createLinearGradient(0,-140,0,-63);
  roof.addColorStop(0,"#c5a15e");roof.addColorStop(.42,"#87623d");roof.addColorStop(1,"#47372e");
  ctx.fillStyle=roof;ctx.beginPath();ctx.moveTo(-half-14,-76);
  ctx.quadraticCurveTo(-half*.73,-86,0,-136);
  ctx.quadraticCurveTo(half*.73,-86,half+14,-76);
  ctx.lineTo(half,-68);ctx.quadraticCurveTo(0,-119,-half,-68);
  ctx.closePath();ctx.fill();
  // Diềm gỗ chạy sát nóc thân nhà.
  ctx.fillStyle="#49352b";ctx.fillRect(-bw*.53,-73,bw*1.06,8);
  ctx.strokeStyle="#edcf87";ctx.lineWidth=3;ctx.beginPath();
  ctx.moveTo(-half-19,-74);ctx.quadraticCurveTo(0,-149,half+19,-74);ctx.stroke();
  ctx.strokeStyle="rgba(255,231,177,.42)";ctx.lineWidth=1;
  for(let i=-6;i<=6;i++){
    const px=i*half*.12;ctx.beginPath();ctx.moveTo(px,-132+Math.abs(i)*2.5);ctx.lineTo(px*1.5,-76);ctx.stroke();
  }
  // Đầu đao cong và chuông mái.
  ctx.strokeStyle="#e7c67e";ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();
  ctx.moveTo(-half-15,-75);ctx.quadraticCurveTo(-half-38,-81,-half-32,-102);
  ctx.moveTo(half+15,-75);ctx.quadraticCurveTo(half+38,-81,half+32,-102);ctx.stroke();
  ctx.fillStyle="#f4d994";ctx.beginPath();ctx.arc(0,-139,5,0,Math.PI*2);ctx.fill();

  // Bảng hiệu ở mặt trước, giữa mái và thân, không đặt lên đỉnh mái.
  const pw=grand?168:118,py=-76;
  ctx.fillStyle="#33241c";ctx.fillRect(-pw/2-5,py-5,pw+10,31);
  ctx.fillStyle="#d9b66e";ctx.fillRect(-pw/2-2,py-2,pw+4,25);
  ctx.fillStyle="#71312a";ctx.fillRect(-pw/2+2,py+2,pw-4,17);
  ctx.strokeStyle="#fff0bd";ctx.lineWidth=1.5;ctx.strokeRect(-pw/2+4,py+3,pw-8,15);
  ctx.fillStyle="#fff1c8";ctx.font="bold "+(grand?15:13)+"px serif";
  ctx.textAlign="center";ctx.textBaseline="middle";ctx.shadowColor="#ffe3a0";ctx.shadowBlur=4;
  ctx.fillText(grand?"VẠN KIẾM ĐIỆN":"TIÊN ĐIỆN",0,py+10,pw-13);ctx.shadowBlur=0;

  // Huy hiệu, cột đỡ và cờ gọn.
  [-bw*.78,bw*.78].forEach(px=>{
    ctx.fillStyle="#d8bb78";ctx.fillRect(px,-112,3,50);
    ctx.fillStyle="#a64035";ctx.beginPath();ctx.moveTo(px+3,-110);
    ctx.lineTo(px+30,-101);ctx.lineTo(px+3,-92);ctx.closePath();ctx.fill();
  });
  ctx.restore();
}

function drawCrowd(time) {
  // Dãy danh dự chia thành ba cụm có khoảng trống rõ ràng.
  drawAudiencePlatform(550,682,142);
  drawFormalSpectator(550,654,1.25,"master",time,0);
  drawRoleLabel(550,617,"CHƯỞNG MÔN","#f2d17d",1.25);

  drawAudiencePlatform(255,710,188);
  drawAudiencePlatform(845,710,188);
  [[190,682],[255,682],[320,682]].forEach((p,i)=>drawFormalSpectator(p[0],p[1],.96,"elder",time,i));
  [[780,682],[845,682],[910,682]].forEach((p,i)=>drawFormalSpectator(p[0],p[1],.96,"elder",time,i+3));
  drawRoleLabel(255,644,"ĐẠI TRƯỞNG LÃO","#d4b5fa",1.02);
  drawRoleLabel(845,644,"TRƯỞNG LÃO","#d4b5fa",1.02);

  drawAudiencePlatform(550,750,260);
  [[445,721],[495,721],[545,721],[595,721],[645,721]].forEach((p,i)=>drawFormalSpectator(p[0],p[1],.82,"disciple",time,i));
  drawRoleLabel(550,684,"THÂN TRUYỀN ĐỆ TỬ","#a9c9f0",.94);

  // Đệ tử phổ thông phân bố cân hai cánh, chừa lề an toàn cho nhân vật và HUD.
  const bands=[
    {x:28,y:670,n:8,role:"servant",s:.66},
    {x:28,y:720,n:8,role:"outer",s:.68},
    {x:28,y:775,n:8,role:"inner",s:.64},
    {x:724,y:670,n:8,role:"outer",s:.68},
    {x:724,y:720,n:8,role:"servant",s:.66},
    {x:724,y:775,n:8,role:"core",s:.64}
  ];
  bands.forEach((row,r)=>{
    for(let i=0;i<row.n;i++){
      const x=row.x+i*48+(i%2)*3;
      const y=row.y+Math.sin(i*1.7+r)*3;
      drawSpectator(x,y,row.s,row.role,time,i*.71+r*1.3);
    }
  });
  drawCrowdFlag(18,690,"#a53f36",time);
  drawCrowdFlag(W-18,690,"#b18a43",time);
}

function drawScenery(time) {
  drawSky(time);drawMountainRange();drawMovingClouds(time);drawSpiritBirds(time);
  drawWaterfall(890,250,30,205,time);
  drawWaterfall(112,315,22,145,time);
  drawMountainStream(time);

  // Các điện nhỏ bám sát mỏm núi.
  drawFloatingPlatform(790,397,.92);drawFloatingPlatform(970,435,.62);
  drawPalace(790,354,.78,false);drawPalace(970,405,.54,false);

  // Vạn Kiếm Điện ở chính giữa quảng trường, phía trước khu chưởng môn.
  drawPalace(550,574,.70,true);

  // Cây rừng chỉ đứng ở bìa, phía trên đường biên quảng trường.
  drawPine(24,565,1.02,"#294f3d");drawPine(78,560,.94,"#315b45");
  drawTree(132,555,.80,"#426b4c");drawPine(250,545,.72,"#315b45");
  drawTree(315,548,.64,"#426b4c");drawTree(850,548,.64,"#426b4c");
  drawPine(920,545,.72,"#315b45");drawPine(1020,560,.94,"#315b45");
  drawPine(1075,565,1.02,"#294f3d");

  drawRiver(time);
  drawCrowd(time);
}

// HUD ở hai góc trên, nền xanh ôm vừa nội dung.
function drawRaceHud() {
  const remaining=Math.max(0,duration-elapsed);
  const completed=racers.filter(r=>r.finished).length;
  const items=[
    {x:12,label:"THỜI GIAN",value:timeText(remaining),align:"left"},
    {x:W-12,label:"HOÀN THÀNH",value:String(completed)+" / "+String(racers.length),align:"right"}
  ];
  items.forEach(item=>{
    ctx.save();ctx.font="bold 10px Arial";
    const labelW=ctx.measureText(item.label).width;
    ctx.font="bold 20px Arial";const valueW=ctx.measureText(item.value).width;
    const boxW=Math.ceil(Math.max(labelW,valueW)+22),boxH=49;
    const x=item.align==="left"?item.x:item.x-boxW,y=12;
    ctx.fillStyle="rgba(20,48,39,.92)";ctx.fillRect(x,y,boxW,boxH);
    ctx.strokeStyle="rgba(224,194,126,.88)";ctx.lineWidth=1;
    ctx.strokeRect(x+.5,y+.5,boxW-1,boxH-1);
    ctx.textAlign="center";ctx.textBaseline="middle";
    ctx.fillStyle="#e0c991";ctx.font="bold 10px Arial";ctx.fillText(item.label,x+boxW/2,y+12,boxW-8);
    ctx.fillStyle="#fff0c7";ctx.font="bold 20px Arial";ctx.fillText(item.value,x+boxW/2,y+34,boxW-8);
    ctx.restore();
  });
}

// Cổng tiên môn mở rộng ngang, vòm và biển hiệu cân xứng.
function drawImmortalFinishGate() {
  const x=TRACK.right,top=TRACK.top-55,bottom=TRACK.bottom;
  ctx.save();
  const aura=ctx.createRadialGradient(x,top+65,5,x,top+65,145);
  aura.addColorStop(0,"rgba(255,231,160,.30)");aura.addColorStop(1,"rgba(255,231,160,0)");
  ctx.fillStyle=aura;ctx.fillRect(x-150,top-35,300,220);

  [-48,48].forEach(offset=>{
    const px=x+offset;
    const grad=ctx.createLinearGradient(px-10,0,px+10,0);
    grad.addColorStop(0,"#65472d");grad.addColorStop(.35,"#f2d99a");
    grad.addColorStop(.7,"#b88d4c");grad.addColorStop(1,"#59402b");
    ctx.fillStyle=grad;ctx.fillRect(px-9,top+29,18,bottom-top-29);
    ctx.strokeStyle="#f3d78e";ctx.lineWidth=2;ctx.strokeRect(px-9,top+29,18,bottom-top-29);
    ctx.fillStyle="#765332";ctx.fillRect(px-18,bottom-18,36,18);
    ctx.fillStyle="#e2c17b";ctx.fillRect(px-21,bottom-22,42,5);
    ctx.fillStyle="#9c713b";ctx.fillRect(px-15,top+18,30,12);
    ctx.fillStyle="#f1d58b";ctx.fillRect(px-19,top+13,38,6);
    ctx.fillStyle="#fff0b5";ctx.beginPath();ctx.arc(px,top+9,5,0,Math.PI*2);ctx.fill();
  });

  // Vòm đại môn rộng, cong vút như cổng sơn môn.
  ctx.beginPath();ctx.moveTo(x-65,top+35);
  ctx.bezierCurveTo(x-58,top-18,x-24,top-35,x,top-35);
  ctx.bezierCurveTo(x+24,top-35,x+58,top-18,x+65,top+35);
  ctx.strokeStyle="#65452b";ctx.lineWidth=17;ctx.stroke();
  ctx.strokeStyle="#e9c77b";ctx.lineWidth=8;ctx.stroke();
  ctx.strokeStyle="rgba(255,245,193,.8)";ctx.lineWidth=2;ctx.stroke();

  // Mái ngói cong trên vòm.
  ctx.fillStyle="#47382e";ctx.beginPath();ctx.moveTo(x-76,top+24);
  ctx.quadraticCurveTo(x,top-52,x+76,top+24);
  ctx.lineTo(x+62,top+31);ctx.quadraticCurveTo(x,top-31,x-62,top+31);
  ctx.closePath();ctx.fill();
  ctx.strokeStyle="#e8c87d";ctx.lineWidth=3;ctx.beginPath();
  ctx.moveTo(x-76,top+24);ctx.quadraticCurveTo(x,top-52,x+76,top+24);ctx.stroke();

  // Biển hiệu rộng vừa dòng chữ.
  ctx.fillStyle="#6a3028";ctx.fillRect(x-52,top-2,104,27);
  ctx.strokeStyle="#f0d28a";ctx.lineWidth=2;ctx.strokeRect(x-52,top-2,104,27);
  ctx.fillStyle="#ffe9ad";ctx.font="bold 13px serif";ctx.textAlign="center";
  ctx.textBaseline="middle";ctx.fillText("TIÊN MÔN",x,top+11);

  const glow=ctx.createLinearGradient(0,top+45,0,bottom-20);
  glow.addColorStop(0,"rgba(255,245,190,.05)");
  glow.addColorStop(.5,"rgba(255,238,166,.8)");
  glow.addColorStop(1,"rgba(255,245,190,.05)");
  ctx.fillStyle=glow;ctx.fillRect(x-1,top+45,2,bottom-top-65);
  ctx.strokeStyle="rgba(255,224,145,.5)";ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(x-13,top+48);ctx.lineTo(x-13,bottom-18);
  ctx.moveTo(x+13,top+48);ctx.lineTo(x+13,bottom-18);ctx.stroke();
  ctx.restore();
}


// =====================================================
// REVISION 6 — LIÊN KẾT THÁC, HỒ, SÔNG; SẮP XẾP TIÊN ĐIỆN
// =====================================================

function drawMountainStream(time) {
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Dòng sông chạy xuyên suốt từ ngoài mép trái sang ngoài mép phải.
  // Hai đường bờ đá tạo cảm giác lòng sông nằm sâu trong địa hình.
  const riverPath = () => {
    ctx.beginPath();
    ctx.moveTo(-100, 520);
    ctx.bezierCurveTo(120, 500, 220, 545, 390, 526);
    ctx.bezierCurveTo(555, 507, 660, 536, 820, 518);
    ctx.bezierCurveTo(980, 500, 1080, 535, 1200, 516);
  };

  ctx.strokeStyle = "#344c3e";
  ctx.lineWidth = 76;
  riverPath(); ctx.stroke();

  ctx.strokeStyle = "#786f54";
  ctx.lineWidth = 65;
  riverPath(); ctx.stroke();

  ctx.strokeStyle = "#b1a17a";
  ctx.lineWidth = 52;
  riverPath(); ctx.stroke();

  const water = ctx.createLinearGradient(0, 492, 0, 552);
  water.addColorStop(0, "#b9e7df");
  water.addColorStop(.28, "#65b9b6");
  water.addColorStop(.68, "#318f96");
  water.addColorStop(1, "#176775");
  ctx.strokeStyle = water;
  ctx.lineWidth = 43;
  riverPath(); ctx.stroke();

  // Dòng nước siết: các dải bọt kéo dài, nghiêng theo chiều trái sang phải.
  const drift = (time * .105) % 180;
  for (let i = 0; i < 22; i++) {
    const x = ((i * 83 + drift) % 1380) - 100;
    const y = 520 + Math.sin(x * .009) * 10 + Math.sin(i * 1.7) * 7;
    const len = 13 + (i % 4) * 8;
    ctx.strokeStyle = i % 3 === 0
      ? "rgba(245,255,244,.82)"
      : "rgba(194,245,235,.48)";
    ctx.lineWidth = i % 4 === 0 ? 3 : 1.7;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + len * .45, y - 3, x + len, y + 1);
    ctx.stroke();
  }

  // Bọt nước và vệt xoáy dọc theo dòng chảy.
  for (let i = 0; i < 12; i++) {
    const x = ((i * 127 + drift * .72) % 1320) - 80;
    const y = 510 + Math.sin(i * 2.1) * 13;
    ctx.fillStyle = "rgba(238,255,246,.55)";
    ctx.beginPath();
    ctx.ellipse(x, y, 5 + (i % 3) * 2, 1.8, -.08, 0, Math.PI * 2);
    ctx.fill();
  }

  // Hai hồ chân thác mở rộng qua mép khung hình, bờ hồ bám vào chân núi.
  const lakes = [
    { x: 12, y: 490, rx: 150, ry: 76, phase: .4 },
    { x: W - 12, y: 488, rx: 158, ry: 78, phase: 2.1 }
  ];

  lakes.forEach((lake, index) => {
    const { x, y, rx, ry, phase } = lake;
    ctx.fillStyle = "#344b3d";
    ctx.beginPath();
    ctx.ellipse(x, y + 9, rx + 13, ry + 8, -.04, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#80795c";
    ctx.beginPath();
    ctx.ellipse(x, y + 4, rx + 5, ry + 3, -.04, 0, Math.PI * 2);
    ctx.fill();

    const lakeGrad = ctx.createRadialGradient(
      x - rx * .22, y - ry * .28, 5, x, y, rx * 1.12
    );
    lakeGrad.addColorStop(0, "#d0f4e5");
    lakeGrad.addColorStop(.25, "#83d0c4");
    lakeGrad.addColorStop(.62, "#399da0");
    lakeGrad.addColorStop(1, "#1c6570");
    ctx.fillStyle = lakeGrad;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, -.04, 0, Math.PI * 2);
    ctx.fill();

    // Gợn tròn lan ra từ nơi thác đổ, nhiều lớp và chuyển động nhẹ.
    for (let i = 0; i < 5; i++) {
      const pulse = (time * .018 + i * 19 + phase * 11) % 24;
      ctx.strokeStyle = "rgba(225,255,241," + (0.48 - i * .065) + ")";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(
        x + (index === 0 ? 30 : -30),
        y - 4,
        18 + i * 17 + pulse * .35,
        5 + i * 4 + pulse * .12,
        -.05, 0, Math.PI * 2
      );
      ctx.stroke();
    }

    // Mảng sáng và bọt xoáy sát chân thác.
    for (let i = 0; i < 11; i++) {
      const a = i * .72 + time * .00035 + phase;
      const px = x + Math.cos(a) * (26 + (i % 3) * 13);
      const py = y - 8 + Math.sin(a) * (10 + (i % 3) * 5);
      ctx.fillStyle = "rgba(245,255,239," + (.32 + (i % 3) * .12) + ")";
      ctx.beginPath();
      ctx.ellipse(px, py, 4 + (i % 2) * 2, 1.8, a, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // Bãi đá nhô khỏi bờ, rêu và bụi cây neo dòng nước vào chân núi.
  for (let i = 0; i < 24; i++) {
    const side = i % 2 ? -1 : 1;
    const x = -15 + i * 49;
    const y = 474 + Math.sin(i * 1.6) * 13 + (side < 0 ? -24 : 25);
    ctx.fillStyle = i % 3 ? "#66745a" : "#898064";
    ctx.beginPath();
    ctx.ellipse(x, y, 12 + (i % 3) * 3, 6 + (i % 2) * 2, -.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(105,153,98,.78)";
    ctx.beginPath();
    ctx.ellipse(x - 2, y - 4, 8, 3, -.3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Đường bọt nối hai hồ với lòng sông, nhấn mạnh hướng trái -> phải.
  for (let i = 0; i < 8; i++) {
    const x = ((i * 171 + drift * .8) % 1320) - 100;
    ctx.strokeStyle = "rgba(230,255,245,.42)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, 536 + Math.sin(i) * 5);
    ctx.lineTo(x + 27, 534 + Math.sin(i) * 5);
    ctx.stroke();
  }
  ctx.restore();
}

// Thác có lòng nước rõ, chân thác chạm mặt hồ; không còn cảm giác treo giữa trời.
function drawLinkedCascade(x, topY, bottomY, width, time, side) {
  ctx.save();
  const mid = (topY + bottomY) * .5;
  const drift = Math.sin(time * .002 + side) * 2.5;

  // Vách đá tối phía sau ôm lấy dòng thác.
  ctx.fillStyle = "#435b4a";
  ctx.beginPath();
  ctx.moveTo(x - width * 1.35, topY - 8);
  ctx.lineTo(x - width * .78, topY + 12);
  ctx.lineTo(x - width * .9, mid);
  ctx.lineTo(x - width * 1.2, bottomY + 9);
  ctx.lineTo(x + width * 1.2, bottomY + 9);
  ctx.lineTo(x + width * .9, mid);
  ctx.lineTo(x + width * .78, topY + 12);
  ctx.lineTo(x + width * 1.35, topY - 8);
  ctx.closePath();
  ctx.fill();

  // Dải nước chính, rộng ở chân và uốn nhẹ theo vách đá.
  const grad = ctx.createLinearGradient(x - width, 0, x + width, 0);
  grad.addColorStop(0, "#317f8a");
  grad.addColorStop(.24, "#9bded8");
  grad.addColorStop(.55, "#e0fff0");
  grad.addColorStop(.82, "#75c9c7");
  grad.addColorStop(1, "#286f7b");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(x - width * .72, topY);
  ctx.bezierCurveTo(x - width * .55, mid, x - width * .9 + drift, bottomY - 8, x - width * 1.08, bottomY);
  ctx.lineTo(x + width * 1.08, bottomY);
  ctx.bezierCurveTo(x + width * .82 + drift, mid, x + width * .65, topY + 5, x + width * .72, topY);
  ctx.closePath();
  ctx.fill();

  // Sợi nước và vệt sáng chạy thẳng xuống, chuyển động cùng chiều trọng lực.
  for (let i = 0; i < 13; i++) {
    const px = x - width * .68 + i * width * .112;
    const offset = (time * (.045 + (i % 3) * .012) + i * 19) % 34;
    ctx.strokeStyle = i % 3 === 0
      ? "rgba(250,255,245,.78)"
      : "rgba(216,250,239,.48)";
    ctx.lineWidth = i % 4 === 0 ? 2.5 : 1.2;
    ctx.beginPath();
    ctx.moveTo(px, topY + offset * .25);
    ctx.bezierCurveTo(px - 3, mid, px + 3, bottomY - 12 + offset * .08, px + drift, bottomY);
    ctx.stroke();
  }

  // Bọt trắng tại điểm chạm mặt hồ.
  ctx.fillStyle = "rgba(238,255,247,.72)";
  for (let i = 0; i < 9; i++) {
    const px = x + Math.sin(time * .003 + i * 1.9) * (width * .9);
    const py = bottomY - 2 + Math.cos(i * 2.3) * 3;
    ctx.beginPath();
    ctx.ellipse(px, py, 5 + (i % 3) * 3, 2, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

// Địa hình núi nhiều sống núi, đỉnh nhọn, vách đá dựng và tầng đá ngoằn ngoèo.
function drawMountainRange() {
  const ridge = (points, colors) => {
    const g = ctx.createLinearGradient(0, 80, 0, 590);
    g.addColorStop(0, colors[0]);
    g.addColorStop(.48, colors[1]);
    g.addColorStop(1, colors[2]);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(0, H);
    points.forEach(p => ctx.lineTo(p[0], p[1]));
    ctx.lineTo(W, H);
    ctx.closePath();
    ctx.fill();
  };

  // Lớp núi xa, các đỉnh cao có đường sống núi rõ rệt.
  ridge([
    [0,350],[48,278],[92,300],[145,205],[190,235],[246,92],
    [286,170],[338,132],[390,220],[448,162],[500,250],
    [558,116],[604,177],[658,78],[704,164],[754,122],
    [808,214],[866,105],[914,184],[968,135],[1018,224],
    [1065,152],[W,205]
  ], ["#dce4d5","#9caf9b","#6f8a78"]);

  // Sườn giữa có mỏm đá và các vách bị xẻ bởi khe núi.
  ridge([
    [0,424],[58,345],[116,365],[176,267],[230,330],[290,225],
    [352,337],[412,260],[470,368],[535,245],[590,337],
    [650,214],[712,334],[772,232],[830,350],[890,238],
    [950,345],[1015,252],[1070,340],[W,286]
  ], ["#aabda5","#718c70","#496a56"]);

  // Chân núi phía trước, tạo đường cong ôm lấy thung lũng và dòng sông.
  ridge([
    [0,505],[65,420],[122,448],[185,360],[248,430],[310,342],
    [378,447],[445,355],[512,462],[580,360],[650,448],
    [720,345],[786,448],[850,356],[916,450],[982,365],
    [1040,444],[W,390]
  ], ["#719276","#456d55","#294c3d"]);

  // Các mặt đá sáng và vách đứng có cạnh gãy, không phải mảng tam giác phẳng đơn điệu.
  const cliffs = [
    [[246,92],[258,150],[286,170],[272,126],[260,110]],
    [[338,132],[354,195],[390,220],[365,165],[351,151]],
    [[558,116],[570,174],[604,177],[584,145]],
    [[658,78],[674,142],[704,164],[681,113]],
    [[866,105],[880,164],[914,184],[892,132]],
    [[290,225],[307,286],[352,337],[326,270]],
    [[535,245],[554,301],[590,337],[566,282]],
    [[772,232],[793,299],[830,350],[807,281]],
    [[185,360],[204,397],[248,430],[218,378]],
    [[720,345],[743,397],[786,448],[755,382]]
  ];
  cliffs.forEach((p, i) => {
    ctx.fillStyle = i % 2 ? "rgba(222,224,190,.42)" : "rgba(244,239,207,.58)";
    ctx.beginPath();
    p.forEach((v, j) => j ? ctx.lineTo(v[0], v[1]) : ctx.moveTo(v[0], v[1]));
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(54,75,58,.30)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });

  // Những tầng địa chất uốn lượn theo sườn, khe nứt sâu và đá vụn.
  ctx.lineCap = "round";
  for (let i = 0; i < 34; i++) {
    const x = (i * 79 + 17) % W;
    const y = 300 + (i % 6) * 27;
    ctx.strokeStyle = i % 2 ? "rgba(31,62,47,.28)" : "rgba(222,222,183,.25)";
    ctx.lineWidth = i % 4 === 0 ? 3 : 1.3;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x + 9, y + 8, x - 5, y + 17, x + 17, y + 25);
    ctx.bezierCurveTo(x + 29, y + 31, x + 18, y + 37, x + 39, y + 41);
    ctx.stroke();
  }

  // Rừng tùng bám trên các gờ đá, không phủ kín mặt vách.
  for (let i = 0; i < 42; i++) {
    const x = (i * 53 + 9) % W;
    const y = 386 + (i % 5) * 17;
    const s = .7 + (i % 3) * .12;
    ctx.fillStyle = i % 2 ? "#315b43" : "#426d50";
    ctx.beginPath();
    ctx.moveTo(x, y - 18 * s);
    ctx.lineTo(x - 9 * s, y + 7 * s);
    ctx.lineTo(x + 9 * s, y + 7 * s);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "rgba(24,57,42,.7)";
    ctx.fillRect(x - 1, y + 4, 2, 5);
  }

  const mist = ctx.createLinearGradient(0, 340, 0, 590);
  mist.addColorStop(0, "rgba(222,239,222,0)");
  mist.addColorStop(.55, "rgba(213,235,218,.16)");
  mist.addColorStop(1, "rgba(213,235,218,0)");
  ctx.fillStyle = mist;
  ctx.fillRect(0, 340, W, 250);
}

function drawCrowd(time) {
  // Khu danh dự nằm phía trên; đệ tử cổ vũ phổ thông đứng thành hàng phía dưới.
  drawAudiencePlatform(550, 654, 150);
  drawFormalSpectator(550, 626, 1.22, "master", time, 0);
  drawRoleLabel(550, 584, "CHƯỞNG MÔN", "#f2d17d", 1.18);

  drawAudiencePlatform(255, 680, 220);
  drawAudiencePlatform(845, 680, 220);
  [[165,652],[225,652],[285,652],[345,652],
   [755,652],[815,652],[875,652],[935,652]].forEach((p,i) =>
    drawFormalSpectator(p[0],p[1],.92,"elder",time,i)
  );
  drawRoleLabel(255, 615, "ĐẠI TRƯỞNG LÃO", "#d4b5fa", .98);
  drawRoleLabel(845, 615, "TRƯỞNG LÃO", "#d4b5fa", .98);

  drawAudiencePlatform(550, 727, 310);
  [[410,699],[465,699],[520,699],[575,699],[630,699],[685,699]].forEach((p,i) =>
    drawFormalSpectator(p[0],p[1],.78,"disciple",time,i)
  );
  // Bảng thân truyền tách khỏi ngai, đặt phía trên hàng ghế riêng.
  drawRoleLabel(550, 665, "THÂN TRUYỀN ĐỆ TỬ", "#a9c9f0", .92);

  // Chỉ bố trí đệ tử phổ thông ở hai cánh và hàng cuối, không đứng đè lên ghế VIP.
  const rows = [
    { x: 18, y: 770, n: 9, role: "servant", scale: .66 },
    { x: 590, y: 770, n: 9, role: "outer", scale: .66 },
    { x: 18, y: 792, n: 9, role: "inner", scale: .56 },
    { x: 590, y: 792, n: 9, role: "core", scale: .56 }
  ];
  rows.forEach((r, ri) => {
    for (let i = 0; i < r.n; i++) {
      drawSpectator(r.x + i * 54, r.y + (i % 2) * 2, r.scale, r.role, time, i * .7 + ri);
    }
  });

  drawCrowdFlag(12, 746, "#a53f36", time);
  drawCrowdFlag(W - 18, 746, "#b18a43", time);
}

function drawScenery(time) {
  drawSky(time);
  drawMountainRange();
  drawMovingClouds(time);
  drawSpiritBirds(time);

  // Các tiên điện được đặt trên sống núi, mỏm đá và một đảo đá giữa hồ.
  // Mỗi bệ nằm ngay dưới chân điện, không đặt chồng lên thác nước.
  drawFloatingPlatform(245, 252, .56);
  drawPalace(245, 210, .48, false);

  drawFloatingPlatform(438, 326, .48);
  drawPalace(438, 284, .42, false);

  drawFloatingPlatform(660, 238, .62);
  drawPalace(660, 190, .54, false);

  drawFloatingPlatform(858, 300, .48);
  drawPalace(858, 258, .42, false);

  drawFloatingPlatform(550, 462, .38);
  drawPalace(550, 430, .34, false);

  // Thác trái đổ vào hồ trái; thác phải đổ vào hồ phải.
  drawLinkedCascade(72, 300, 478, 27, time, .2);
  drawLinkedCascade(W - 72, 270, 476, 34, time, 1.4);

  // Hồ và sông được vẽ sau thác để mặt nước nối liền, bờ hồ ôm chân núi.
  drawMountainStream(time);

  // Cây mọc trên các bậc đất và gờ núi, tránh lòng sông và mặt hồ.
  drawPine(170, 430, .78, "#315b45");
  drawTree(205, 448, .62, "#426b4c");
  drawPine(365, 448, .68, "#315b45");
  drawTree(475, 438, .58, "#426b4c");
  drawPine(735, 438, .72, "#315b45");
  drawTree(805, 447, .62, "#426b4c");
  drawPine(930, 430, .76, "#315b45");

  drawRiver(time);
  drawCrowd(time);
}

// Tránh để thẻ HOÀN THÀNH che cổng đích TIÊN MÔN ở góc phải.
function drawRaceHud() {
  const remaining = Math.max(0, duration - elapsed);
  const completed = racers.filter(r => r.finished).length;
  const items = [
    { x: 12, y: 12, label: "THỜI GIAN", value: timeText(remaining) },
    { x: 12, y: 68, label: "ĐÃ VỀ ĐÍCH", value: String(completed) + " / " + String(racers.length) }
  ];
  items.forEach(item => {
    ctx.save();
    ctx.font = "bold 10px Arial";
    const labelW = ctx.measureText(item.label).width;
    ctx.font = "bold 20px Arial";
    const valueW = ctx.measureText(item.value).width;
    const boxW = Math.ceil(Math.max(labelW, valueW) + 22);
    const boxH = 49;
    ctx.fillStyle = "rgba(20,48,39,.92)";
    ctx.fillRect(item.x, item.y, boxW, boxH);
    ctx.strokeStyle = "rgba(224,194,126,.88)";
    ctx.lineWidth = 1;
    ctx.strokeRect(item.x + .5, item.y + .5, boxW - 1, boxH - 1);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#e0c991";
    ctx.font = "bold 10px Arial";
    ctx.fillText(item.label, item.x + boxW / 2, item.y + 12, boxW - 8);
    ctx.fillStyle = "#fff0c7";
    ctx.font = "bold 20px Arial";
    ctx.fillText(item.value, item.x + boxW / 2, item.y + 34, boxW - 8);
    ctx.restore();
  });
}
