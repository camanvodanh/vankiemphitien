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
  drawFloatingPlatform(790,355,.92);drawFloatingPlatform(970,405,.62);
  drawPalace(790,354,.78,false);drawPalace(970,405,.54,false);

  // Vạn Kiếm Điện ở ranh giới rừng và quảng trường.
  drawFloatingPlatform(178,445,.92);drawPalace(178,440,.76,true);

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
