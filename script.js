
"use strict";

(() => {
  const $ = id => document.getElementById(id);

  const canvas = $("game");
  const ctx = canvas.getContext("2d");
  const cameraCanvas = $("leaderCanvas");
  const cameraCtx = cameraCanvas.getContext("2d");

  const W = canvas.width;
  const H = canvas.height;

  const TRACK = {
    left: 100,
    right: 1000,
    top: 145,
    bottom: 590
  };

  const palette = [
    ["#d95c4b", "#853c35"],
    ["#4d8db2", "#315a7a"],
    ["#a78ac9", "#66517f"],
    ["#d4a64d", "#8c682e"],
    ["#5b9b76", "#376447"],
    ["#d17b9c", "#8e4c68"],
    ["#b8b9c6", "#747583"],
    ["#c77a45", "#804b2e"],
    ["#6c9eaa", "#426c75"],
    ["#b4a05d", "#76652f"]
  ];

  const ROLE = {
    servant: {
      name: "Tạp dịch",
      robe: "#817b6a",
      dark: "#4f4b42",
      belt: "#a99b77",
      aura: null,
      scale: .72
    },
    outer: {
      name: "Ngoại môn",
      robe: "#4d83a1",
      dark: "#294f6c",
      belt: "#c3a86b",
      aura: null,
      scale: .8
    },
    inner: {
      name: "Nội môn",
      robe: "#d8dfd0",
      dark: "#719b9a",
      belt: "#d5b86e",
      aura: "#b5e5d8",
      scale: .88
    },
    core: {
      name: "Nòng cốt",
      robe: "#d6b45e",
      dark: "#89602e",
      belt: "#fff0b2",
      aura: "#ffe3a0",
      scale: .98
    },
    elder: {
      name: "Trưởng lão",
      robe: "#755b91",
      dark: "#443451",
      belt: "#e5c67d",
      aura: "#d8c2ff",
      scale: 1.15
    },
    master: {
      name: "Môn chủ",
      robe: "#a83f36",
      dark: "#592b2b",
      belt: "#f6d88b",
      aura: "#ffe8a4",
      scale: 1.38
    }
  };

  let racers = [];
  let particles = [];
  let stars = [];
  let clouds = [];
  let waterLines = [];

  let running = false;
  let paused = false;
  let started = false;
  let finished = false;
  let locked = false;

  let duration = 60;
  let distance = 10000;
  let elapsed = 0;

  let countdown = 0;
  let countdownAccumulator = 0;

  let eventClock = 0;
  let nextEvent = 6;
  let eventText = "";
  let eventTextLife = 0;

  let finishQueue = [];
  let finishMessage = "";
  let finishMessageLife = 0;

  let lastTime = 0;
  let sceneTime = 0;

  const rand = (min, max) =>
    Math.random() * (max - min) + min;

  const randInt = (min, max) =>
    Math.floor(rand(min, max + 1));

  const clamp = (v, min, max) =>
    Math.max(min, Math.min(max, v));

  function timeText(value) {
    const seconds = Math.max(0, Math.ceil(value));

    return (
      String(Math.floor(seconds / 60)).padStart(2, "0") +
      ":" +
      String(seconds % 60).padStart(2, "0")
    );
  }

  function laneGap() {
    return (TRACK.bottom - TRACK.top) /
      Math.max(1, racers.length);
  }

  function laneY(index) {
    return TRACK.top + laneGap() * index + laneGap() / 2;
  }

  function racerScale() {
    const gap = laneGap();
    const scaleByCount = 1.25 - racers.length * .008;
    const scaleByLane = gap * .78 / 51;

    return clamp(
      Math.min(1.05, scaleByCount, scaleByLane),
      .055,
      1.05
    );
  }

  function progressOf(racer) {
    return clamp(racer.progress / distance, 0, 1);
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, ch => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[ch]);
  }

  // =====================================================
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
  // NHÂN VẬT CỔ VŨ THEO CẤP BẬC
  // =====================================================

  function drawAura(x, y, radius, color, time, phase = 0) {
    if (!color) return;

    ctx.save();

    const pulse = 1 + Math.sin(time * .003 + phase) * .08;

    const gradient = ctx.createRadialGradient(
      x, y, 2,
      x, y, radius * pulse
    );

    gradient.addColorStop(0, color + "55");
    gradient.addColorStop(.45, color + "22");
    gradient.addColorStop(1, color + "00");

    ctx.fillStyle = gradient;

    ctx.beginPath();
    ctx.arc(x, y, radius * pulse, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function drawEnergyRings(x, y, scale, color, time, phase) {
    if (!color) return;

    ctx.save();

    ctx.translate(x, y);
    ctx.scale(scale, scale);

    const alpha = .35 + Math.sin(time * .003 + phase) * .12;

    ctx.strokeStyle = color;
    ctx.globalAlpha = alpha;
    ctx.lineWidth = 1.4;

    ctx.beginPath();
    ctx.ellipse(
      0,
      13,
      25 + Math.sin(time * .002 + phase) * 2,
      7,
      0,
      0,
      Math.PI * 2
    );
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(
      0,
      13,
      17,
      5,
      0,
      0,
      Math.PI * 2
    );
    ctx.stroke();

    ctx.restore();
  }

  function drawSpectator(x, y, scale, roleName, time, phase = 0) {
    const role = ROLE[roleName] || ROLE.outer;

    const wave = Math.sin(time * .006 + phase);
    const armWave = Math.sin(time * .008 + phase);

    ctx.save();

    ctx.translate(x, y);
    ctx.scale(scale * role.scale, scale * role.scale);

    // Bóng dưới chân
    ctx.fillStyle = "rgba(20,35,27,.28)";
    ctx.beginPath();
    ctx.ellipse(0, 22, 14, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Hào quang riêng của cấp cao
    if (role.aura) {
      drawAura(0, -10, roleName === "master" ? 43 : 31, role.aura, time, phase);
    }

    // Chân
    ctx.fillStyle = "#403a35";
    ctx.fillRect(-6, 15, 5, 9);
    ctx.fillRect(2, 15, 5, 9);

    // Thân áo
    ctx.fillStyle = role.dark;

    ctx.beginPath();
    ctx.moveTo(-8, -4);
    ctx.lineTo(8, -4);
    ctx.lineTo(13, 20);
    ctx.lineTo(-13, 20);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = role.robe;

    ctx.beginPath();
    ctx.moveTo(-7, -5);
    ctx.lineTo(7, -5);
    ctx.lineTo(10, 17);
    ctx.lineTo(-10, 17);
    ctx.closePath();
    ctx.fill();

    // Vạt áo
    ctx.fillStyle = role.dark;
    ctx.beginPath();
    ctx.moveTo(-7, 1);
    ctx.lineTo(0, 5);
    ctx.lineTo(-4, 18);
    ctx.lineTo(-11, 17);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(7, 1);
    ctx.lineTo(0, 5);
    ctx.lineTo(4, 18);
    ctx.lineTo(11, 17);
    ctx.closePath();
    ctx.fill();

    // Đai lưng
    ctx.fillStyle = role.belt;
    ctx.fillRect(-8, 7, 16, 3);

    // Ngọc bội cho nội môn trở lên
    if (["inner", "core", "elder", "master"].includes(roleName)) {
      ctx.fillStyle = "#f1d98b";
      ctx.fillRect(3, 9, 3, 5);
    }

    // Cổ áo
    ctx.fillStyle = "#f2e4c0";
    ctx.fillRect(-4, -5, 8, 3);

    // Mặt
    ctx.fillStyle = "#efc39b";
    ctx.fillRect(-6, -20, 12, 13);

    // Tóc
    const hair = ["elder", "master"].includes(roleName)
      ? "#e6e0d3"
      : "#29252a";

    ctx.fillStyle = hair;
    ctx.fillRect(-7, -24, 14, 6);
    ctx.fillRect(-6, -27, 12, 4);
    ctx.fillRect(-8, -19, 3, 8);
    ctx.fillRect(5, -19, 3, 8);

    // Mắt
    ctx.fillStyle = "#3c302a";
    ctx.fillRect(-3, -15, 2, 2);
    ctx.fillRect(2, -15, 2, 2);

    // Râu trưởng lão và môn chủ
    if (roleName === "elder" || roleName === "master") {
      ctx.fillStyle = "#e2ded1";

      ctx.beginPath();
      ctx.moveTo(-4, -8);
      ctx.lineTo(4, -8);
      ctx.lineTo(2, 2);
      ctx.lineTo(0, 5);
      ctx.lineTo(-2, 2);
      ctx.closePath();
      ctx.fill();

      // Tóc búi cao
      ctx.fillRect(-3, -32, 6, 7);
      ctx.fillStyle = "#d6b86f";
      ctx.fillRect(-4, -31, 8, 2);
    }

    // Tay áo và cánh tay vẫy
    ctx.strokeStyle = "#efc39b";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";

    const leftArmY = -8 + armWave * 5;
    const rightArmY = -15 - armWave * 8;

    ctx.beginPath();
    ctx.moveTo(-7, 0);
    ctx.lineTo(-15, leftArmY);
    ctx.moveTo(7, 0);
    ctx.lineTo(15, rightArmY);
    ctx.stroke();

    // Tay áo
    ctx.fillStyle = role.robe;
    ctx.fillRect(-19, leftArmY - 4, 8, 7);
    ctx.fillRect(11, rightArmY - 4, 8, 7);

    // Trang sức theo chức vị
    if (roleName === "core") {
      ctx.fillStyle = "#f5d984";
      ctx.fillRect(-2, -28, 4, 4);
      ctx.fillRect(-11, -5, 3, 3);
      ctx.fillRect(8, -5, 3, 3);
    }

    if (roleName === "elder") {
      // Trượng trưởng lão
      ctx.strokeStyle = "#e2c783";
      ctx.lineWidth = 3;

      ctx.beginPath();
      ctx.moveTo(20, -22);
      ctx.lineTo(20, 23);
      ctx.stroke();

      ctx.fillStyle = "#e6d08f";
      ctx.beginPath();
      ctx.arc(20, -25, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    if (roleName === "master") {
      // Vương miện / quan ngọc môn chủ
      ctx.fillStyle = "#e8c36e";

      ctx.beginPath();
      ctx.moveTo(-7, -26);
      ctx.lineTo(-5, -36);
      ctx.lineTo(0, -30);
      ctx.lineTo(5, -36);
      ctx.lineTo(7, -26);
      ctx.closePath();
      ctx.fill();

      // Phất trần / cờ lệnh
      ctx.strokeStyle = "#e6cb88";
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.moveTo(20, -29);
      ctx.lineTo(20, 21);
      ctx.stroke();

      // Cờ môn chủ chuyển động
      ctx.fillStyle = "#b43e35";

      ctx.beginPath();
      ctx.moveTo(22, -28);
      ctx.lineTo(42 + wave * 3, -22);
      ctx.lineTo(22, -15);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = "#f2d48b";
      ctx.stroke();
    }

    ctx.restore();

    // Hiệu ứng vòng linh khí ở dưới chân
    if (role.aura) {
      drawEnergyRings(x, y, scale * role.scale, role.aura, time, phase);
    }
  }

  function drawAudiencePlatform(x, y, width) {
    ctx.save();

    // Đài đá cao
    ctx.fillStyle = "#6c5b43";
    ctx.fillRect(x - width / 2, y, width, 12);

    ctx.fillStyle = "#c2a875";
    ctx.fillRect(x - width / 2 - 7, y - 5, width + 14, 6);

    ctx.fillStyle = "#e2c78b";
    ctx.fillRect(x - width / 2, y + 12, width, 3);

    // Trụ đá
    for (let px = x - width / 2 + 18; px < x + width / 2; px += 45) {
      ctx.fillStyle = "#a98d60";
      ctx.fillRect(px, y + 14, 5, 18);
    }

    ctx.restore();
  }

  function drawRoleLabel(x, y, text, color, scale = 1) {
    ctx.save();

    ctx.font = `bold ${Math.max(7, 9 * scale)}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const width = ctx.measureText(text).width + 12;
    const height = 15 * scale;

    ctx.fillStyle = "rgba(31,42,33,.82)";
    ctx.fillRect(x - width / 2, y - height / 2, width, height);

    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.strokeRect(x - width / 2, y - height / 2, width, height);

    ctx.fillStyle = "#fff0c5";
    ctx.fillText(text, x, y);

    ctx.restore();
  }

  function drawCrowd(time) {
    // Nhóm tạp dịch ở tầng thấp
    const servants = [
      [25, 615], [55, 625], [88, 618],
      [120, 628], [155, 616], [190, 627]
    ];

    servants.forEach((p, i) => {
      drawSpectator(
        p[0], p[1], .72,
        "servant", time, i * .8
      );
    });

    // Ngoại môn
    const outer = [
      [235, 620], [275, 626], [315, 617],
      [355, 628], [395, 618]
    ];

    outer.forEach((p, i) => {
      drawSpectator(
        p[0], p[1], .8,
        "outer", time, i * .7
      );
    });

    // Nội môn
    const inner = [
      [430, 616], [470, 620], [510, 614],
      [550, 620], [590, 614], [630, 620]
    ];

    inner.forEach((p, i) => {
      drawSpectator(
        p[0], p[1], .87,
        "inner", time, i * .9
      );
    });

    // Đệ tử nòng cốt đứng gần khu vực trung tâm
    const core = [
      [680, 614], [720, 617], [760, 614]
    ];

    core.forEach((p, i) => {
      drawSpectator(
        p[0], p[1], .94,
        "core", time, i * .8
      );
    });

    // Trưởng lão trên đài cao bên trái
    drawAudiencePlatform(850, 584, 120);

    drawSpectator(
      850, 580, 1.05,
      "elder", time, 1
    );

    drawRoleLabel(
      850, 544, "TRƯỞNG LÃO",
      "#c9a7ef", 1
    );

    // Trưởng lão thứ hai
    drawAudiencePlatform(975, 588, 90);

    drawSpectator(
      975, 584, .95,
      "elder", time, 2
    );

    // Đài chính của môn chủ
    drawAudiencePlatform(550, 574, 190);

    // Hào quang lớn sau môn chủ
    drawAura(
      550, 552, 75,
      "#ffe6a0", time, 0
    );

    // Môn chủ đứng vị trí cao nhất
    drawSpectator(
      550, 566, 1.25,
      "master", time, 0
    );

    drawRoleLabel(
      550, 522, "MÔN CHỦ",
      "#f2d17d", 1.15
    );

    // Cờ hiệu cổ vũ hai bên
    drawCrowdFlag(15, 550, "#a53f36", time);
    drawCrowdFlag(1080, 550, "#b18a43", time);

    // Cờ nòng cốt
    drawCrowdFlag(420, 580, "#426f8a", time);
    drawCrowdFlag(700, 580, "#8e4f83", time);
  }

  function drawCrowdFlag(x, y, color, time) {
    ctx.save();

    const wave = Math.sin(time * .003 + x) * 4;

    ctx.fillStyle = "#c6a66a";
    ctx.fillRect(x, y - 45, 3, 48);

    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.moveTo(x + 3, y - 43);
    ctx.lineTo(x + 27 + wave, y - 34);
    ctx.lineTo(x + 3, y - 23);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "#ead19a";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();
  }

  // =====================================================
  // TỔNG HỢP PHONG CẢNH
  // =====================================================

  function drawScenery(time) {
    drawSky(time);
    drawMountainRange();
    drawMovingClouds(time);

    // Tiên sơn và kiến trúc xa
    drawFloatingPlatform(165, 290, .8);
    drawFloatingPlatform(940, 275, .75);

    drawPagoda(165, 310, .82, "#554335");
    drawPagoda(950, 290, .88, "#584333");

    // Điện phụ
    drawPalace(275, 370, .53, false);
    drawPalace(825, 365, .55, false);

    // Chính điện quy mô lớn
    drawPalace(550, 320, 1.05, true);

    // Thác nước
    drawWaterfall(890, 275, 35, 180, time);
    drawWaterfall(105, 345, 23, 105, time);

    // Sông và cầu
    drawRiver(time);
    drawBridge();

    // Cây tùng hai bên
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

    // Nhân vật cổ vũ và đài cao
    drawCrowd(time);
  }

  // =====================================================
  // HUD VÀ ĐƯỜNG ĐUA
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
    ctx.font = "bold 10px Arial";
    ctx.fillText(label, tx, y + 13);

    ctx.fillStyle = "#fff0c7";
    ctx.font = "bold 21px Arial";
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

  function drawTrackLines() {
    ctx.save();

    // Nền đường đua
    ctx.fillStyle = "rgba(39,58,43,.13)";
    ctx.fillRect(
      TRACK.left,
      TRACK.top,
      TRACK.right - TRACK.left,
      TRACK.bottom - TRACK.top
    );

    ctx.strokeStyle = "rgba(244,224,166,.4)";
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(TRACK.left, TRACK.top);
    ctx.lineTo(TRACK.right, TRACK.top);
    ctx.moveTo(TRACK.left, TRACK.bottom);
    ctx.lineTo(TRACK.right, TRACK.bottom);
    ctx.stroke();

    if (racers.length > 1) {
      for (let i = 1; i < racers.length; i++) {
        const y = TRACK.top + laneGap() * i;

        ctx.setLineDash([5, 8]);
        ctx.strokeStyle = "rgba(255,239,190,.3)";

        ctx.beginPath();
        ctx.moveTo(TRACK.left, y);
        ctx.lineTo(TRACK.right, y);
        ctx.stroke();
      }
    }

    ctx.setLineDash([]);

    // Vạch xuất phát
    ctx.fillStyle = "rgba(244,224,166,.85)";
    ctx.fillRect(
      TRACK.left,
      TRACK.top,
      3,
      TRACK.bottom - TRACK.top
    );

    // Vạch đích
    const finishX = TRACK.right - 8;

    for (let y = TRACK.top; y < TRACK.bottom; y += 12) {
      for (let x = finishX; x < finishX + 12; x += 12) {
        ctx.fillStyle =
          (Math.floor(y / 12) + Math.floor(x / 12)) % 2 === 0
            ? "rgba(255,245,213,.95)"
            : "rgba(47,62,47,.9)";

        ctx.fillRect(x, y, 12, 12);
      }
    }

    ctx.restore();
  }

  // =====================================================
  // NHÂN VẬT NGỰ KIẾM
  // =====================================================

  function drawRacer(target, racer, x, y, scale, time) {
    target.save();

    target.translate(
      x,
      y + Math.sin(time * .009 + racer.phase) * 2
    );

    target.scale(scale, scale);

    // Hào quang nhân vật
    const glow = target.createRadialGradient(
      0, 0, 3, 0, 0, 43
    );

    glow.addColorStop(0, "rgba(255,225,139,.35)");
    glow.addColorStop(1, "rgba(255,225,139,0)");

    target.fillStyle = glow;
    target.fillRect(-48, -45, 96, 90);

    // Phi kiếm
    target.fillStyle = "#d6c18a";
    target.fillRect(-29, 17, 58, 4);

    target.fillStyle = "#f3e6b5";
    target.fillRect(-23, 15, 45, 2);

    // Ánh kiếm
    target.fillStyle = "rgba(255,236,164,.55)";
    target.fillRect(-34, 21, 68, 2);

    // Thân áo
    target.fillStyle = racer.dark;
    target.fillRect(-10, -5, 20, 22);

    target.fillStyle = racer.color;
    target.fillRect(-9, -7, 18, 21);
    target.fillRect(-14, -2, 5, 14);
    target.fillRect(9, -2, 5, 14);

    // Khuôn mặt
    target.fillStyle = "#f0c49b";
    target.fillRect(-7, -22, 14, 14);

    // Tóc
    target.fillStyle = "#29252a";
    target.fillRect(-8, -25, 16, 5);
    target.fillRect(-7, -28, 13, 4);
    target.fillRect(-9, -21, 3, 8);
    target.fillRect(6, -21, 3, 8);
    target.fillRect(4, -31, 3, 7);

    // Mắt
    target.fillStyle = "#392a26";
    target.fillRect(-4, -17, 2, 2);
    target.fillRect(3, -17, 2, 2);

    target.fillStyle = "#e8cb83";
    target.fillRect(-8, 5, 16, 2);

    target.restore();
  }

  function drawRacerName(racer, x, y, scale) {
    ctx.save();

    const fontSize = clamp(11 * scale + 3, 7, 12);

    ctx.font = `bold ${fontSize}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const maxWidth = 150;
    const measured = Math.min(
      ctx.measureText(racer.name).width,
      maxWidth
    );

    const boxWidth = measured + 12;
    const boxHeight = fontSize + 7;
    const labelY = y - 27 * scale - boxHeight / 2;

    ctx.fillStyle = "rgba(19,43,35,.86)";
    ctx.fillRect(
      x - boxWidth / 2,
      labelY - boxHeight / 2,
      boxWidth,
      boxHeight
    );

    ctx.strokeStyle = "rgba(225,196,126,.8)";
    ctx.lineWidth = .8;

    ctx.strokeRect(
      x - boxWidth / 2,
      labelY - boxHeight / 2,
      boxWidth,
      boxHeight
    );

    ctx.fillStyle = "#fff0c5";
    ctx.fillText(racer.name, x, labelY, maxWidth);

    ctx.restore();
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
        ctx.font = "bold 12px Arial";
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
      ctx.fillStyle = "#ffe5a0";
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });

    ctx.globalAlpha = 1;
    ctx.restore();
  }

  function triggerEvent() {
    const active = racers.filter(r => !r.finished);

    if (!active.length) return;

    const racer = active[randInt(0, active.length - 1)];
    const index = racers.indexOf(racer);

    addParticles(racerX(racer), laneY(index), 22);

    eventText = eventMessages[
      randInt(0, eventMessages.length - 1)
    ];

    eventTextLife = 2.2;
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

    ctx.font = `bold ${fontSize}px Arial`;

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
    const w = cameraCanvas.width;
    const h = cameraCanvas.height;

    const bg = cameraCtx.createLinearGradient(0, 0, 0, h);

    bg.addColorStop(0, "#6e9a87");
    bg.addColorStop(1, "#243f37");

    cameraCtx.clearRect(0, 0, w, h);
    cameraCtx.fillStyle = bg;
    cameraCtx.fillRect(0, 0, w, h);

    cameraCtx.fillStyle = "rgba(218,232,195,.35)";

    cameraCtx.beginPath();
    cameraCtx.moveTo(0, 105);
    cameraCtx.lineTo(65, 45);
    cameraCtx.lineTo(120, 100);
    cameraCtx.lineTo(190, 40);
    cameraCtx.lineTo(270, 103);
    cameraCtx.lineTo(340, 48);
    cameraCtx.lineTo(420, 105);
    cameraCtx.lineTo(420, 190);
    cameraCtx.lineTo(0, 190);
    cameraCtx.fill();
  }

  function leaderOf() {
    if (!racers.length) return null;

    return [...racers].sort((a, b) => {
      if (a.finished && b.finished) {
        return a.finishTime - b.finishTime;
      }

      if (a.finished) return -1;
      if (b.finished) return 1;

      return b.progress - a.progress;
    })[0];
  }

  function drawCamera(time) {
    drawCameraBackground();

    if (!started || !racers.length) {
      $("leaderName").textContent = "Đang chờ cuộc đua";
      $("leaderProgress").textContent = "Chưa bắt đầu";

      cameraCtx.fillStyle = "#f3dfa9";
      cameraCtx.font = "13px Arial";
      cameraCtx.textAlign = "center";

      cameraCtx.fillText(
        "Nhân vật sẽ xuất hiện khi cuộc đua bắt đầu",
        210,
        105
      );

      return;
    }

    const leader = leaderOf();

    if (!leader) return;

    drawRacer(cameraCtx, leader, 210, 91, 2.2, time);

    $("leaderName").textContent = leader.name;

    $("leaderProgress").textContent = leader.finished
      ? "Đã về đích"
      : `${Math.floor(progressOf(leader) * 100)}%`;
  }

  // =====================================================
  // BẢNG XẾP HẠNG
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

    const completed = racers.filter(r => r.finished).length;

    $("totalCount").textContent = racers.length;
    $("finishedCount").textContent = completed;

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

  function render(time) {
    ctx.clearRect(0, 0, W, H);

    drawScenery(time);
    drawTrackLines();
    drawRaceHud();
    drawRacers(time);
    drawAnnouncement();
    drawParticles();
    drawCamera(time);
    updateRanking();
  }

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

    // Xáo trộn thứ hạng
    for (let i = times.length - 1; i > 0; i--) {
      const j = randInt(0, i);

      [times[i], times[j]] = [times[j], times[i]];
    }

    others.forEach((racer, index) => {
      racer.targetFinishTime = times[index];
    });

    // Người cuối cùng về đích đúng thời gian đã chọn
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

    // Xử lý người về đích theo thứ tự thời gian
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
      ? "Thiết lập đã khóa trong cuộc đua. Nhấn Làm mới để thay đổi."
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

  $("summon").addEventListener("click", summon);
  $("start").addEventListener("click", startRace);

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
})();
