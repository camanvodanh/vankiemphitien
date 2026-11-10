
"use strict";

// =====================================================
// SCENERY.JS - VẠN KIẾM PHI TIÊN
// PHONG CẢNH TIÊN MÔN HOÀNH TRÁNG
// =====================================================

function initStars() {
  stars = Array.from({ length: 100 }, () => ({
    x: rand(0, W),
    y: rand(0, 430),
    size: rand(1, 2.5),
    alpha: rand(.15, .65),
    phase: rand(0, Math.PI * 2)
  }));

  clouds = Array.from({ length: 9 }, (_, i) => ({
    x: i * 145 - 70,
    y: rand(75, 190),
    scale: rand(.65, 1.25),
    speed: rand(2, 5),
    alpha: rand(.28, .55)
  }));

  waterLines = Array.from({ length: 30 }, () => ({
    x: rand(0, W),
    y: rand(500, 645),
    length: rand(12, 48),
    speed: rand(7, 18),
    alpha: rand(.15, .45)
  }));
}

// =====================================================
// BẦU TRỜI
// =====================================================

function drawSky(time) {
  const g = ctx.createLinearGradient(0, 0, 0, H);

  g.addColorStop(0, "#486f87");
  g.addColorStop(.2, "#83a9a6");
  g.addColorStop(.48, "#b6cbb1");
  g.addColorStop(.75, "#d9d8ae");
  g.addColorStop(1, "#e8d6a7");

  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  stars.forEach(s => {
    const twinkle =
      .7 + Math.sin(time * .0015 + s.phase) * .3;

    ctx.globalAlpha = s.alpha * twinkle;
    ctx.fillStyle = "#fff3c6";
    ctx.fillRect(s.x, s.y, s.size, s.size);
  });

  ctx.globalAlpha = 1;

  const sun = ctx.createRadialGradient(
    835, 95, 5, 835, 95, 190
  );

  sun.addColorStop(0, "rgba(255,248,208,.95)");
  sun.addColorStop(.35, "rgba(255,231,171,.35)");
  sun.addColorStop(1, "rgba(255,248,200,0)");

  ctx.fillStyle = sun;
  ctx.fillRect(630, -80, 410, 370);

  ctx.save();
  ctx.globalAlpha = .1;
  ctx.fillStyle = "#fff3c3";

  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(835, 90);
    ctx.lineTo(650 + i * 100, 400);
    ctx.lineTo(710 + i * 100, 400);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}

// =====================================================
// NÚI TIÊN
// =====================================================

function mountain(points, color) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], H);

  points.forEach(p => ctx.lineTo(p[0], p[1]));

  ctx.lineTo(points[points.length - 1][0], H);
  ctx.closePath();

  ctx.fillStyle = color;
  ctx.fill();
}

function drawSnowPeak(x, y, width, height) {
  ctx.save();

  ctx.fillStyle = "rgba(238,244,224,.85)";

  ctx.beginPath();
  ctx.moveTo(x - width / 2, y);
  ctx.lineTo(x, y - height);
  ctx.lineTo(x + width / 2, y);
  ctx.lineTo(x + width * .2, y - height * .27);
  ctx.lineTo(x, y - height * .48);
  ctx.lineTo(x - width * .18, y - height * .25);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function drawMountainRange() {
  mountain([
    [0, 285], [75, 180], [135, 225],
    [225, 105], [300, 210], [410, 115],
    [500, 225], [625, 95], [720, 205],
    [830, 125], [930, 220], [1030, 115],
    [1100, 210]
  ], "#9eb5a5");

  mountain([
    [0, 350], [85, 255], [165, 300],
    [260, 190], [350, 300], [450, 205],
    [555, 315], [660, 190], [755, 300],
    [850, 205], [950, 315], [1050, 220],
    [1100, 280]
  ], "#718f7a");

  mountain([
    [0, 430], [90, 330], [170, 385],
    [270, 275], [370, 390], [480, 300],
    [570, 410], [690, 280], [790, 390],
    [900, 295], [1010, 395], [1100, 330]
  ], "#416d58");

  drawSnowPeak(225, 105, 70, 50);
  drawSnowPeak(625, 95, 80, 55);
  drawSnowPeak(830, 125, 70, 45);
  drawSnowPeak(1030, 115, 65, 45);

  ctx.globalAlpha = .2;
  ctx.fillStyle = "#e7efd5";

  ctx.beginPath();
  ctx.moveTo(270, 275);
  ctx.lineTo(300, 350);
  ctx.lineTo(360, 390);
  ctx.lineTo(335, 305);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(690, 280);
  ctx.lineTo(730, 355);
  ctx.lineTo(790, 390);
  ctx.lineTo(750, 305);
  ctx.closePath();
  ctx.fill();

  ctx.globalAlpha = 1;
}

// =====================================================
// MÂY TRÔI
// =====================================================

function drawCloud(x, y, scale, alpha = .55) {
  ctx.save();

  ctx.globalAlpha = alpha;
  ctx.fillStyle = "#f5f5df";

  ctx.beginPath();
  ctx.ellipse(
    x, y, 55 * scale, 12 * scale,
    0, 0, Math.PI * 2
  );

  ctx.ellipse(
    x + 25 * scale, y - 7 * scale,
    30 * scale, 16 * scale,
    0, 0, Math.PI * 2
  );

  ctx.ellipse(
    x - 25 * scale, y - 5 * scale,
    28 * scale, 14 * scale,
    0, 0, Math.PI * 2
  );

  ctx.fill();
  ctx.restore();
}

function drawMovingClouds(time) {
  clouds.forEach(cloud => {
    const x = (
      cloud.x + time * .001 * cloud.speed
    ) % (W + 180) - 90;

    drawCloud(
      x,
      cloud.y,
      cloud.scale,
      cloud.alpha
    );
  });
}

// =====================================================
// CÂY CỔ THỤ VÀ TÙNG TIÊN
// =====================================================

function drawPine(x, y, scale, color = "#315b45") {
  ctx.save();

  ctx.translate(x, y);
  ctx.scale(scale, scale);

  ctx.fillStyle = "#594531";
  ctx.fillRect(-4, -5, 8, 48);

  ctx.fillStyle = color;

  ctx.beginPath();
  ctx.moveTo(0, -65);
  ctx.lineTo(-23, -25);
  ctx.lineTo(-11, -28);
  ctx.lineTo(-31, -3);
  ctx.lineTo(-13, -8);
  ctx.lineTo(-36, 17);
  ctx.lineTo(36, 17);
  ctx.lineTo(13, -8);
  ctx.lineTo(31, -3);
  ctx.lineTo(11, -28);
  ctx.lineTo(23, -25);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "rgba(164,197,135,.55)";
  ctx.fillRect(-5, -50, 4, 7);
  ctx.fillRect(8, -30, 5, 5);
  ctx.fillRect(-16, -12, 7, 4);

  ctx.restore();
}

function drawTree(x, y, scale, color = "#315b45") {
  ctx.save();

  ctx.translate(x, y);
  ctx.scale(scale, scale);

  ctx.fillStyle = "#584632";
  ctx.fillRect(-4, -3, 8, 42);

  ctx.fillStyle = color;

  ctx.beginPath();
  ctx.arc(0, -12, 22, 0, Math.PI * 2);
  ctx.arc(-14, 2, 15, 0, Math.PI * 2);
  ctx.arc(14, 3, 15, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(159,190,126,.55)";
  ctx.fillRect(-8, -28, 5, 4);
  ctx.fillRect(7, -17, 5, 4);

  ctx.restore();
}

// =====================================================
// MÁI KIẾN TRÚC TIÊN MÔN
// =====================================================

function drawRoof(
  width,
  y,
  height,
  color,
  trim = "#e5c47b"
) {
  ctx.save();

  // Khối mái chính
  ctx.fillStyle = color;

  ctx.beginPath();
  ctx.moveTo(-width, y + height);
  ctx.quadraticCurveTo(
    -width * .65,
    y + height - 3,
    0,
    y
  );

  ctx.quadraticCurveTo(
    width * .65,
    y + height - 3,
    width,
    y + height
  );

  ctx.lineTo(width - 14, y + height + 4);

  ctx.quadraticCurveTo(
    0,
    y + 9,
    -width + 14,
    y + height + 4
  );

  ctx.closePath();
  ctx.fill();

  // Phủ kín khu vực giữa mái
  ctx.fillStyle = color;

  ctx.beginPath();
  ctx.moveTo(-width + 12, y + height + 3);
  ctx.lineTo(width - 12, y + height + 3);
  ctx.lineTo(width * .58, y + 7);
  ctx.lineTo(-width * .58, y + 7);
  ctx.closePath();
  ctx.fill();

  // Viền mái vàng
  ctx.strokeStyle = trim;
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.moveTo(-width + 7, y + height + 2);

  ctx.quadraticCurveTo(
    0,
    y + 7,
    width - 7,
    y + height + 2
  );

  ctx.stroke();

  // Đầu đao cong trái
  ctx.fillStyle = trim;

  ctx.beginPath();
  ctx.moveTo(-width, y + height);

  ctx.quadraticCurveTo(
    -width - 13,
    y + height - 5,
    -width - 18,
    y + height - 15
  );

  ctx.lineTo(-width - 10, y + height + 1);
  ctx.closePath();
  ctx.fill();

  // Đầu đao cong phải
  ctx.beginPath();
  ctx.moveTo(width, y + height);

  ctx.quadraticCurveTo(
    width + 13,
    y + height - 5,
    width + 18,
    y + height - 15
  );

  ctx.lineTo(width + 10, y + height + 1);
  ctx.closePath();
  ctx.fill();

  // Đường ngói
  ctx.strokeStyle = "rgba(255,222,154,.28)";
  ctx.lineWidth = 1;

  for (let i = -4; i <= 4; i++) {
    ctx.beginPath();

    ctx.moveTo(i * width * .14, y + 5);
    ctx.lineTo(i * width * .22, y + height);

    ctx.stroke();
  }

  // Đỉnh mái
  ctx.fillStyle = "#f5d994";
  ctx.fillRect(-3, y - 3, 6, 5);

  ctx.restore();
}

function drawRoofOrnaments(width, y) {
  ctx.save();

  ctx.fillStyle = "#e8c777";

  [-width + 15, width - 15].forEach(x => {
    ctx.beginPath();
    ctx.arc(x, y + 3, 3, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.strokeStyle = "#d8b56b";
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  ctx.moveTo(-width + 12, y);
  ctx.lineTo(-width + 4, y - 9);

  ctx.moveTo(width - 12, y);
  ctx.lineTo(width - 4, y - 9);

  ctx.stroke();

  ctx.restore();
}

// =====================================================
// THÁP TIÊN
// =====================================================

function drawPagoda(
  x,
  y,
  scale,
  color = "#594335"
) {
  ctx.save();

  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // Bệ tháp
  ctx.fillStyle = "#bda77d";
  ctx.fillRect(-45, -5, 90, 9);
  ctx.fillRect(-37, -12, 74, 7);

  // Thân tháp
  ctx.fillStyle = "#cbb589";
  ctx.fillRect(-25, -105, 50, 93);

  ctx.fillStyle = "#73513b";
  ctx.fillRect(-20, -100, 40, 86);

  // Cửa sổ từng tầng
  for (let i = 0; i < 4; i++) {
    const yy = -91 + i * 21;

    ctx.fillStyle = "#e3c57f";
    ctx.fillRect(-7, yy, 14, 14);

    ctx.fillStyle = "#273e37";
    ctx.fillRect(-4, yy + 3, 8, 10);
  }

  // Bốn mái tháp
  for (let i = 0; i < 4; i++) {
    const yy = -105 + i * 22;
    const width = 36 + i * 9;

    drawRoof(width, yy, 12, color);
    drawRoofOrnaments(width, yy);
  }

  // Chóp tháp
  ctx.fillStyle = "#e4c77d";
  ctx.fillRect(-3, -125, 6, 20);

  ctx.beginPath();
  ctx.arc(0, -129, 5, 0, Math.PI * 2);
  ctx.fill();

  // Chuông hai bên
  [-32, 32].forEach(px => {
    ctx.strokeStyle = "#e2c77e";
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.moveTo(px, -84);
    ctx.lineTo(px, -65);
    ctx.stroke();

    ctx.fillStyle = "#d7b66c";
    ctx.beginPath();
    ctx.arc(px, -63, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

// =====================================================
// VẠN KIẾM ĐIỆN VÀ TIÊN ĐIỆN
// =====================================================

function drawPalace(x, y, scale, grand = false) {
  ctx.save();

  ctx.translate(x, y);
  ctx.scale(scale, scale);

  const bodyWidth = grand ? 270 : 178;

  // Hào quang kiến trúc
  const aura = ctx.createRadialGradient(
    0,
    -65,
    5,
    0,
    -65,
    grand ? 230 : 150
  );

  aura.addColorStop(
    0,
    "rgba(255,221,142,.24)"
  );

  aura.addColorStop(
    1,
    "rgba(255,221,142,0)"
  );

  ctx.fillStyle = aura;
  ctx.fillRect(
    -bodyWidth * 1.5,
    -250,
    bodyWidth * 3,
    300
  );

  // Bệ điện
  ctx.fillStyle = "#806b4f";
  ctx.fillRect(
    -bodyWidth * .68,
    25,
    bodyWidth * 1.36,
    14
  );

  ctx.fillStyle = "#c8b28a";
  ctx.fillRect(
    -bodyWidth * .75,
    37,
    bodyWidth * 1.5,
    8
  );

  ctx.fillStyle = "#e0ca99";
  ctx.fillRect(
    -bodyWidth * .82,
    45,
    bodyWidth * 1.64,
    7
  );

  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = "#a9946d";

    ctx.fillRect(
      -bodyWidth * (.3 + i * .09),
      45 + i * 4,
      bodyWidth * (.6 + i * .18),
      4
    );
  }

  // Thân điện
  ctx.fillStyle = "#d5bd8a";
  ctx.fillRect(
    -bodyWidth / 2,
    -65,
    bodyWidth,
    90
  );

  ctx.fillStyle = "#674837";
  ctx.fillRect(
    -bodyWidth / 2 + 10,
    -54,
    bodyWidth - 20,
    78
  );

  // Đai đỏ
  ctx.fillStyle = "#a53f36";
  ctx.fillRect(
    -bodyWidth / 2 + 14,
    -50,
    bodyWidth - 28,
    8
  );

  // Cửa lớn
  const doorWidth = grand ? 43 : 30;

  ctx.fillStyle = "#302b26";
  ctx.fillRect(
    -doorWidth / 2,
    -35,
    doorWidth,
    60
  );

  ctx.fillStyle = "#c49b53";
  ctx.fillRect(
    -doorWidth / 2 + 4,
    -31,
    doorWidth - 8,
    56
  );

  ctx.fillStyle = "#302b26";
  ctx.fillRect(
    -doorWidth / 2 + 7,
    -27,
    doorWidth - 14,
    52
  );

  ctx.fillStyle = "#e8c978";
  ctx.fillRect(-2, -27, 4, 52);

  // Cửa sổ
  [-bodyWidth * .35, bodyWidth * .35].forEach(px => {
    ctx.fillStyle = "#d8b66d";
    ctx.fillRect(px - 12, -39, 24, 36);

    ctx.fillStyle = "#30443a";
    ctx.fillRect(px - 8, -35, 16, 28);

    ctx.strokeStyle = "#e6c77d";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(px, -35);
    ctx.lineTo(px, -7);

    ctx.moveTo(px - 8, -21);
    ctx.lineTo(px + 8, -21);

    ctx.stroke();
  });

  // Cột son
  const pillarPositions = [
    -bodyWidth * .43,
    -bodyWidth * .25,
    bodyWidth * .25,
    bodyWidth * .43
  ];

  pillarPositions.forEach(px => {
    ctx.fillStyle = "#a84236";
    ctx.fillRect(px - 5, -62, 10, 89);

    ctx.fillStyle = "#e7c77b";
    ctx.fillRect(px - 7, -61, 14, 4);
    ctx.fillRect(px - 7, 20, 14, 5);

    ctx.fillStyle = "rgba(255,226,167,.35)";
    ctx.fillRect(px - 3, -56, 2, 72);
  });

  // Lan can điện
  ctx.fillStyle = "#d4b77b";
  ctx.fillRect(
    -bodyWidth * .65,
    22,
    bodyWidth * 1.3,
    5
  );

  for (let i = -5; i <= 5; i++) {
    ctx.fillRect(
      i * bodyWidth * .1 - 2,
      26,
      4,
      12
    );
  }

  // Mái dưới
  drawRoof(
    bodyWidth * .84,
    -76,
    32,
    "#463c32"
  );

  drawRoof(
    bodyWidth * .80,
    -84,
    29,
    "#a47b3d"
  );

  // Mái trên
  drawRoof(
    bodyWidth * .60,
    -139,
    28,
    "#40382f"
  );

  drawRoof(
    bodyWidth * .56,
    -147,
    26,
    "#b28a45"
  );

  // BẢNG HIỆU CÓ KHUNG BAO PHỦ
  const plaqueW = grand ? 174 : 132;
  const plaqueY = -124;

  // Khung ngoài
  ctx.fillStyle = "#35251c";
  ctx.fillRect(
    -plaqueW / 2 - 8,
    plaqueY - 8,
    plaqueW + 16,
    42
  );

  // Viền vàng
  ctx.fillStyle = "#e7c77d";
  ctx.fillRect(
    -plaqueW / 2 - 4,
    plaqueY - 4,
    plaqueW + 8,
    34
  );

  // Nền bảng
  ctx.fillStyle = "#493323";
  ctx.fillRect(
    -plaqueW / 2,
    plaqueY,
    plaqueW,
    26
  );

  ctx.fillStyle = "#8e302b";
  ctx.fillRect(
    -plaqueW / 2 + 5,
    plaqueY + 4,
    plaqueW - 10,
    18
  );

  // Viền chữ bên trong
  ctx.strokeStyle = "#fff0bc";
  ctx.lineWidth = 2;

  ctx.strokeRect(
    -plaqueW / 2 + 6,
    plaqueY + 5,
    plaqueW - 12,
    16
  );

  // Chữ trên bảng
  ctx.fillStyle = "#fff2c9";
  ctx.shadowColor = "#ffdc86";
  ctx.shadowBlur = 6;

  ctx.font = `bold ${grand ? 16 : 14}px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillText(
    grand ? "VẠN KIẾM ĐIỆN" : "TIÊN ĐIỆN",
    0,
    plaqueY + 13,
    plaqueW - 14
  );

  ctx.shadowBlur = 0;

  // Huy hiệu tròn trên bảng
  ctx.fillStyle = "#e8c779";

  ctx.beginPath();
  ctx.arc(0, plaqueY - 12, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#8e302b";

  ctx.beginPath();
  ctx.arc(0, plaqueY - 12, 5, 0, Math.PI * 2);
  ctx.fill();

  // Cờ hai bên
  [-bodyWidth * .78, bodyWidth * .78].forEach(px => {
    ctx.fillStyle = "#d9bd79";
    ctx.fillRect(px, -165, 3, 105);

    ctx.fillStyle = "#a33f36";

    ctx.beginPath();
    ctx.moveTo(px + 3, -162);
    ctx.lineTo(px + 38, -150);
    ctx.lineTo(px + 3, -137);
    ctx.closePath();
    ctx.fill();
  });

  // Đèn lồng
  [-bodyWidth * .58, bodyWidth * .58].forEach(px => {
    ctx.fillStyle = "#d7b66d";
    ctx.fillRect(px - 1, -43, 2, 13);

    ctx.fillStyle = "#e2a64e";

    ctx.beginPath();
    ctx.ellipse(
      px,
      -27,
      8,
      11,
      0,
      0,
      Math.PI * 2
    );

    ctx.fill();

    ctx.fillStyle = "#fff0b5";
    ctx.fillRect(px - 2, -33, 4, 12);
  });

  ctx.restore();
}

// =====================================================
// TIÊN ĐÀI LƠ LỬNG
// =====================================================

function drawFloatingPlatform(x, y, scale) {
  ctx.save();

  ctx.translate(x, y);
  ctx.scale(scale, scale);

  ctx.fillStyle = "#9c8b6c";

  ctx.beginPath();
  ctx.moveTo(-65, 0);
  ctx.lineTo(65, 0);
  ctx.lineTo(42, 17);
  ctx.lineTo(-42, 17);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#c8ad76";
  ctx.fillRect(-55, -5, 110, 5);

  ctx.fillStyle = "rgba(222,239,213,.35)";

  ctx.beginPath();
  ctx.ellipse(
    0, 19, 65, 9,
    0, 0, Math.PI * 2
  );

  ctx.fill();

  ctx.restore();
}

// =====================================================
// THÁC NƯỚC
// =====================================================

function drawWaterfall(x, y, width, height, time) {
  ctx.save();

  ctx.fillStyle = "#476c5a";

  ctx.beginPath();
  ctx.moveTo(x - 22, y);
  ctx.lineTo(x + width + 22, y);
  ctx.lineTo(x + width + 34, y + height);
  ctx.lineTo(x - 30, y + height);
  ctx.closePath();
  ctx.fill();

  const water = ctx.createLinearGradient(
    x, y, x, y + height
  );

  water.addColorStop(0, "#e1f1d8");
  water.addColorStop(.35, "#a5d7d0");
  water.addColorStop(.72, "#6bb2ad");
  water.addColorStop(1, "#438f8c");

  ctx.fillStyle = water;
  ctx.fillRect(x, y, width, height);

  ctx.save();

  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.clip();

  // Nước chảy chậm, không quá nhanh
  const offset = (time * .009) % 30;

  for (let i = -1; i < 9; i++) {
    const yy = y + ((i * 30 + offset) % height);

    ctx.strokeStyle = "rgba(255,255,224,.4)";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(x + 4, yy);
    ctx.lineTo(x + width - 4, yy + 8);
    ctx.stroke();
  }

  ctx.restore();

  // Bọt nước
  ctx.fillStyle = "rgba(231,245,225,.35)";

  ctx.beginPath();
  ctx.ellipse(
    x + width / 2,
    y + height,
    width * 1.8,
    10,
    0,
    0,
    Math.PI * 2
  );

  ctx.fill();

  ctx.restore();
}

// =====================================================
// QUẢNG TRƯỜNG TIÊN MÔN
// KHÔNG CÒN LÀ KHU VỰC SÔNG NƯỚC
// =====================================================

function drawRiver(time) {
  const floor = ctx.createLinearGradient(
    0, 490, 0, H
  );

  floor.addColorStop(0, "#c9b58b");
  floor.addColorStop(.35, "#a18b67");
  floor.addColorStop(.7, "#806c50");
  floor.addColorStop(1, "#574d3d");

  ctx.fillStyle = floor;

  ctx.beginPath();
  ctx.moveTo(0, 490);

  ctx.quadraticCurveTo(
    300, 455,
    550, 490
  );

  ctx.quadraticCurveTo(
    820, 520,
    1100, 485
  );

  ctx.lineTo(1100, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.fill();

  ctx.save();

  ctx.beginPath();
  ctx.moveTo(0, 490);

  ctx.quadraticCurveTo(
    300, 455,
    550, 490
  );

  ctx.quadraticCurveTo(
    820, 520,
    1100, 485
  );

  ctx.lineTo(1100, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.clip();

  // Đường lát đá
  for (let y = 520; y < H + 20; y += 34) {
    const spread = (y - 480) * .55;

    ctx.strokeStyle = "rgba(245,220,166,.28)";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(-spread, y);
    ctx.lineTo(W + spread, y);
    ctx.stroke();
  }

  // Đường phối cảnh
  for (let x = -500; x < 1600; x += 105) {
    ctx.strokeStyle = "rgba(55,48,38,.2)";
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(
      550 + (x - 550) * .2,
      490
    );

    ctx.lineTo(x, H);
    ctx.stroke();
  }

  // Tiên trận khắc trên nền
  ctx.strokeStyle = "rgba(245,218,158,.2)";
  ctx.lineWidth = 2;

  for (let i = 0; i < 5; i++) {
    ctx.beginPath();

    ctx.ellipse(
      550,
      690,
      90 + i * 42,
      20 + i * 10,
      0,
      0,
      Math.PI * 2
    );

    ctx.stroke();
  }

  ctx.restore();

  // Viền quảng trường
  ctx.strokeStyle = "rgba(245,218,158,.7)";
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.moveTo(0, 505);

  ctx.quadraticCurveTo(
    550, 470,
    1100, 502
  );

  ctx.stroke();

  // Đèn đá hai bên lối đi
  for (let i = 0; i < 9; i++) {
    const x = 55 + i * 125;
    const y = 555 + (i % 2) * 10;

    ctx.fillStyle = "rgba(239,207,131,.2)";

    ctx.beginPath();
    ctx.ellipse(
      x, y, 24, 8,
      0, 0, Math.PI * 2
    );

    ctx.fill();

    ctx.fillStyle = "#8b704b";
    ctx.fillRect(x - 5, y - 17, 10, 17);

    ctx.fillStyle = "#e8c879";
    ctx.fillRect(x - 2, y - 25, 4, 8);

    ctx.fillStyle = "#fff0b6";

    ctx.beginPath();
    ctx.arc(x, y - 28, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Họa tiết ngọc
  ctx.fillStyle = "rgba(245,222,170,.3)";

  ctx.beginPath();
  ctx.moveTo(510, 515);
  ctx.lineTo(550, 495);
  ctx.lineTo(590, 515);
  ctx.lineTo(550, 535);
  ctx.closePath();
  ctx.fill();
}

// =====================================================
// CẦU ĐÁ TRANG TRÍ
// =====================================================

function drawBridge() {
  ctx.save();

  ctx.strokeStyle = "#78694d";
  ctx.lineWidth = 13;

  ctx.beginPath();
  ctx.moveTo(0, 500);

  ctx.quadraticCurveTo(
    500, 455,
    1100, 500
  );

  ctx.stroke();

  ctx.strokeStyle = "#d8c393";
  ctx.lineWidth = 5;

  ctx.beginPath();
  ctx.moveTo(0, 491);

  ctx.quadraticCurveTo(
    500, 446,
    1100, 491
  );

  ctx.stroke();

  ctx.strokeStyle = "#aa9366";
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.moveTo(0, 482);

  ctx.quadraticCurveTo(
    500, 437,
    1100, 482
  );

  ctx.stroke();

  for (let x = 45; x < 1080; x += 65) {
    const y =
      482 - Math.sin((x / 1100) * Math.PI) * 45;

    ctx.fillStyle = "#bca77a";
    ctx.fillRect(x, y - 11, 5, 17);

    ctx.fillStyle = "#e4cb91";
    ctx.fillRect(x - 3, y - 14, 11, 4);
  }

  ctx.restore();
}

// =====================================================
// TỔNG HỢP PHONG CẢNH
// =====================================================

function drawScenery(time) {
  // Bầu trời và núi
  drawSky(time);
  drawMountainRange();
  drawMovingClouds(time);

  // Tiên sơn
  drawFloatingPlatform(165, 290, .8);
  drawFloatingPlatform(940, 275, .75);

  // Tháp tiên
  drawPagoda(
    165, 310, .82, "#554335"
  );

  drawPagoda(
    950, 290, .88, "#584333"
  );

  // Điện phụ
  drawPalace(275, 370, .53, false);
  drawPalace(825, 365, .55, false);

  // Đại điện trung tâm
  drawPalace(550, 320, 1.05, true);

  // Thác nước hai bên
  drawWaterfall(
    890, 275, 35, 180, time
  );

  drawWaterfall(
    105, 345, 23, 105, time
  );

  // Quảng trường đá ngọc
  drawRiver(time);
  drawBridge();

  // Tùng tiên
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

  // Khán giả và khu vực danh dự
  // Hàm drawCrowd được khai báo trong audience.js
  drawCrowd(time);
}
