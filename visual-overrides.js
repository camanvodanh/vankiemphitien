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
    { y: 755, count: 17, start: 18, step: 32, role: "servant", scale: .67 },
    { y: 724, count: 13, start: 20, step: 38, role: "outer", scale: .72 },
    { y: 755, count: 17, start: 538, step: 32, role: "outer", scale: .69 },
    { y: 724, count: 13, start: 600, step: 38, role: "inner", scale: .75 },
    { y: 695, count: 6, start: 25, step: 43, role: "inner", scale: .78 },
    { y: 695, count: 6, start: 815, step: 43, role: "core", scale: .82 }
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
  drawRoleLabel(550, 678, "THÂN TRUYỀN ĐỆ TỬ", "#a9c9f0", .98);

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
