
// ===== scenery.js — phần 1 =====

// KHỞI TẠO PHONG CẢNH
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
    const twinkle = .7 + Math.sin(time * .0015 + s.phase) * .3;

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

  // Ánh sáng chiếu từ tiên nhật
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
  // Núi xa
  mountain([
    [0, 285], [75, 180], [135, 225], [225, 105],
    [300, 210], [410, 115], [500, 225],
    [625, 95], [720, 205], [830, 125],
    [930, 220], [1030, 115], [1100, 210]
  ], "#9eb5a5");

  // Núi trung cảnh
  mountain([
    [0, 350], [85, 255], [165, 300], [260, 190],
    [350, 300], [450, 205], [555, 315],
    [660, 190], [755, 300], [850, 205],
    [950, 315], [1050, 220], [1100, 280]
  ], "#718f7a");

  // Núi gần
  mountain([
    [0, 430], [90, 330], [170, 385], [270, 275],
    [370, 390], [480, 300], [570, 410],
    [690, 280], [790, 390], [900, 295],
    [1010, 395], [1100, 330]
  ], "#416d58");

  drawSnowPeak(225, 105, 70, 50);
  drawSnowPeak(625, 95, 80, 55);
  drawSnowPeak(830, 125, 70, 45);
  drawSnowPeak(1030, 115, 65, 45);

  // Sườn núi sáng
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

function drawCloud(x, y, scale, alpha = .55) {
  ctx.save();

  ctx.globalAlpha = alpha;
  ctx.fillStyle = "#f5f5df";

  ctx.beginPath();
  ctx.ellipse(x, y, 55 * scale, 12 * scale, 0, 0, Math.PI * 2);
  ctx.ellipse(x + 25 * scale, y - 7 * scale, 30 * scale, 16 * scale, 0, 0, Math.PI * 2);
  ctx.ellipse(x - 25 * scale, y - 5 * scale, 28 * scale, 14 * scale, 0, 0, Math.PI * 2);
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
// KIẾN TRÚC TIÊN MÔN
// =====================================================

function drawRoof(width, y, height, color, trim = "#e5c47b") {
  ctx.save();

  // Mái cong nhiều lớp
  ctx.fillStyle = color;

  ctx.beginPath();
  ctx.moveTo(-width, y + height);
  ctx.quadraticCurveTo(-width * .65, y + height - 3, 0, y);
  ctx.quadraticCurveTo(width * .65, y + height - 3, width, y + height);
  ctx.lineTo(width - 14, y + height + 4);
  ctx.quadraticCurveTo(0, y + 9, -width + 14, y + height + 4);
  ctx.closePath();
  ctx.fill();

  // Viền vàng
  ctx.strokeStyle = trim;
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.moveTo(-width + 7, y + height + 2);
  ctx.quadraticCurveTo(0, y + 7, width - 7, y + height + 2);
  ctx.stroke();

  // Đầu đao cong
  ctx.fillStyle = trim;

  ctx.beginPath();
  ctx.moveTo(-width, y + height);
  ctx.quadraticCurveTo(-width - 13, y + height - 5, -width - 18, y + height - 15);
  ctx.lineTo(-width - 10, y + height + 1);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(width, y + height);
  ctx.quadraticCurveTo(width + 13, y + height - 5, width + 18, y + height - 15);
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

function drawPagoda(x, y, scale, color = "#594335") {
  ctx.save();

  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // Bệ đá
  ctx.fillStyle = "#bda77d";
  ctx.fillRect(-45, -5, 90, 9);
  ctx.fillRect(-37, -12, 74, 7);

  // Thân tháp
  ctx.fillStyle = "#cbb589";
  ctx.fillRect(-25, -105, 50, 93);

  ctx.fillStyle = "#73513b";
  ctx.fillRect(-20, -100, 40, 86);

  // Cửa sổ và cửa tầng
  for (let i = 0; i < 4; i++) {
    const yy = -91 + i * 21;

    ctx.fillStyle = "#e3c57f";
    ctx.fillRect(-7, yy, 14, 14);

    ctx.fillStyle = "#273e37";
    ctx.fillRect(-4, yy + 3, 8, 10);
  }

  // Bốn tầng mái
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

  // Chuông nhỏ
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


// ===== scenery.js — phần 2 =====

function drawPalace(x, y, scale, grand = false) {
  ctx.save();

  ctx.translate(x, y);
  ctx.scale(scale, scale);

  const bodyWidth = grand ? 235 : 160;

  // Hào quang kiến trúc
  const aura = ctx.createRadialGradient(
    0, -65, 5, 0, -65, grand ? 230 : 150
  );

  aura.addColorStop(0, "rgba(255,221,142,.24)");
  aura.addColorStop(1, "rgba(255,221,142,0)");

  ctx.fillStyle = aura;
  ctx.fillRect(-bodyWidth * 1.5, -250, bodyWidth * 3, 300);

  // Nền đá nhiều tầng
  ctx.fillStyle = "#806b4f";
  ctx.fillRect(-bodyWidth * .68, 25, bodyWidth * 1.36, 14);

  ctx.fillStyle = "#c8b28a";
  ctx.fillRect(-bodyWidth * .75, 37, bodyWidth * 1.5, 8);

  ctx.fillStyle = "#e0ca99";
  ctx.fillRect(-bodyWidth * .82, 45, bodyWidth * 1.64, 7);

  // Bậc thềm
  ctx.fillStyle = "#a9946d";

  for (let i = 0; i < 5; i++) {
    ctx.fillRect(
      -bodyWidth * (.3 + i * .09),
      45 + i * 4,
      bodyWidth * (.6 + i * .18),
      4
    );
  }

  // Thân chính điện
  ctx.fillStyle = "#d5bd8a";
  ctx.fillRect(-bodyWidth / 2, -65, bodyWidth, 90);

  ctx.fillStyle = "#674837";
  ctx.fillRect(-bodyWidth / 2 + 10, -54, bodyWidth - 20, 78);

  // Vách trang trí
  ctx.fillStyle = "#a53f36";
  ctx.fillRect(-bodyWidth / 2 + 14, -50, bodyWidth - 28, 8);

  // Cửa lớn
  const doorWidth = grand ? 43 : 30;

  ctx.fillStyle = "#302b26";
  ctx.fillRect(-doorWidth / 2, -35, doorWidth, 60);

  ctx.fillStyle = "#c49b53";
  ctx.fillRect(-doorWidth / 2 + 4, -31, doorWidth - 8, 56);

  ctx.fillStyle = "#302b26";
  ctx.fillRect(-doorWidth / 2 + 7, -27, doorWidth - 14, 52);

  ctx.fillStyle = "#e8c978";
  ctx.fillRect(-2, -27, 4, 52);

  // Cửa sổ hai bên
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

  // Lan can trước điện
  ctx.fillStyle = "#d4b77b";
  ctx.fillRect(-bodyWidth * .65, 22, bodyWidth * 1.3, 5);

  for (let i = -5; i <= 5; i++) {
    ctx.fillRect(i * bodyWidth * .1 - 2, 26, 4, 12);
  }

  // Mái tầng dưới
  drawRoof(bodyWidth * .72, -72, 28, "#463c32");
  drawRoof(bodyWidth * .68, -79, 25, "#a47b3d");

  // Mái tầng trên
  drawRoof(bodyWidth * .48, -127, 25, "#40382f");
  drawRoof(bodyWidth * .44, -134, 23, "#b28a45");

  // Chóp mái
  ctx.fillStyle = "#e4c57c";
  ctx.fillRect(-3, -150, 6, 17);

  ctx.beginPath();
  ctx.arc(0, -154, 5, 0, Math.PI * 2);
  ctx.fill();

  // Bảng hiệu chính điện
  ctx.fillStyle = "#d7b96f";
  ctx.fillRect(-35, -112, 70, 19);

  ctx.fillStyle = "#7e302c";
  ctx.fillRect(-32, -110, 64, 15);

  ctx.fillStyle = "#f6e2aa";
  ctx.font = "bold 11px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(grand ? "VẠN KIẾM ĐIỆN" : "TIÊN ĐIỆN", 0, -102);

  // Cờ hai bên chính điện
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

  // Đèn lồng hai bên
  [-bodyWidth * .58, bodyWidth * .58].forEach(px => {
    ctx.fillStyle = "#d7b66d";
    ctx.fillRect(px - 1, -43, 2, 13);

    ctx.fillStyle = "#e2a64e";
    ctx.beginPath();
    ctx.ellipse(px, -27, 8, 11, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#fff0b5";
    ctx.fillRect(px - 2, -33, 4, 12);
  });

  ctx.restore();
}

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
  ctx.ellipse(0, 19, 65, 9, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// =====================================================
// THÁC NƯỚC VÀ DÒNG SÔNG
// =====================================================

function drawWaterfall(x, y, width, height, time) {
  ctx.save();

  // Vách đá hai bên
  ctx.fillStyle = "#476c5a";

  ctx.beginPath();
  ctx.moveTo(x - 22, y);
  ctx.lineTo(x + width + 22, y);
  ctx.lineTo(x + width + 34, y + height);
  ctx.lineTo(x - 30, y + height);
  ctx.closePath();
  ctx.fill();

  // Dòng nước
  const water = ctx.createLinearGradient(x, y, x, y + height);

  water.addColorStop(0, "#e1f1d8");
  water.addColorStop(.35, "#a5d7d0");
  water.addColorStop(.72, "#6bb2ad");
  water.addColorStop(1, "#438f8c");

  ctx.fillStyle = water;
  ctx.fillRect(x, y, width, height);

  // Vệt nước chảy chậm, ổn định
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.clip();

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

  // Sương nước chân thác
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

function drawRiver(time) {
  const g = ctx.createLinearGradient(0, 450, 0, 650);

  g.addColorStop(0, "#78b5a9");
  g.addColorStop(.35, "#478f91");
  g.addColorStop(.72, "#327b82");
  g.addColorStop(1, "#245d68");

  ctx.fillStyle = g;

  ctx.beginPath();
  ctx.moveTo(0, 490);
  ctx.quadraticCurveTo(300, 450, 520, 520);
  ctx.quadraticCurveTo(780, 600, 1100, 485);
  ctx.lineTo(1100, 650);
  ctx.lineTo(0, 650);
  ctx.closePath();
  ctx.fill();

  // Ánh phản chiếu mặt nước
  const reflection = ctx.createLinearGradient(0, 490, 0, 640);

  reflection.addColorStop(0, "rgba(239,242,204,.3)");
  reflection.addColorStop(1, "rgba(239,242,204,0)");

  ctx.fillStyle = reflection;
  ctx.fillRect(0, 490, W, 160);

  // Gợn nước trôi chậm, không nhấp nháy
  ctx.save();

  ctx.beginPath();
  ctx.moveTo(0, 490);
  ctx.quadraticCurveTo(300, 450, 520, 520);
  ctx.quadraticCurveTo(780, 600, 1100, 485);
  ctx.lineTo(1100, 650);
  ctx.lineTo(0, 650);
  ctx.closePath();
  ctx.clip();

  waterLines.forEach(line => {
    const x = (line.x + time * .001 * line.speed) % (W + 60) - 30;
    const y = line.y;

    ctx.globalAlpha = line.alpha;
    ctx.strokeStyle = "#d8f2df";
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(
      x + line.length / 2,
      y - 2,
      x + line.length,
      y
    );
    ctx.stroke();
  });

  ctx.globalAlpha = 1;
  ctx.restore();

  // Đá ven sông
  for (let i = 0; i < 12; i++) {
    const x = i * 100 + 15;
    const y = 500 + Math.sin(i * 1.7) * 22;

    ctx.fillStyle = "#66765d";
    ctx.beginPath();
    ctx.ellipse(x, y, 13, 5, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawBridge() {
  ctx.save();

  // Cầu đá cong
  ctx.strokeStyle = "#78694d";
  ctx.lineWidth = 13;

  ctx.beginPath();
  ctx.moveTo(0, 470);
  ctx.quadraticCurveTo(500, 385, 1100, 470);
  ctx.stroke();

  ctx.strokeStyle = "#d8c393";
  ctx.lineWidth = 5;

  ctx.beginPath();
  ctx.moveTo(0, 461);
  ctx.quadraticCurveTo(500, 376, 1100, 461);
  ctx.stroke();

  // Lan can cầu
  ctx.strokeStyle = "#aa9366";
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.moveTo(0, 448);
  ctx.quadraticCurveTo(500, 363, 1100, 448);
  ctx.stroke();

  for (let x = 45; x < 1080; x += 65) {
    const y = 448 - Math.sin((x / 1100) * Math.PI) * 85;

    ctx.fillStyle = "#bca77a";
    ctx.fillRect(x, y - 11, 5, 17);

    ctx.fillStyle = "#e4cb91";
    ctx.fillRect(x - 3, y - 14, 11, 4);
  }

  ctx.restore();
}

// =====================================================

