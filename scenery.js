
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

}

// =====================================================
// BẦU TRỜI
// =====================================================

function drawSky(time) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  VKP_DATA.scenery.sky.gradient.forEach(([stop,color])=>g.addColorStop(stop,color));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  stars.forEach(s => {
    const twinkle = .7 + Math.sin(time * .0015 + s.phase) * .3;
    ctx.globalAlpha = s.alpha * twinkle;
    ctx.fillStyle = "#fff3c6";
    ctx.fillRect(s.x, s.y, s.size, s.size);
  });
  ctx.globalAlpha = 1;

  // Tâm quầng sáng và các tia nắng luôn lấy chung tọa độ từ cấu hình mặt trời.
  const sunConfig = VKP_DATA.scenery.sky.sun;
  const sunGradient = ctx.createRadialGradient(
    sunConfig.x, sunConfig.y, sunConfig.innerRadius,
    sunConfig.x, sunConfig.y, sunConfig.outerRadius
  );
  sunConfig.stops.forEach(([stop,color])=>sunGradient.addColorStop(stop,color));
  ctx.fillStyle = sunGradient;
  ctx.fillRect(...sunConfig.rect);

  ctx.save();
  ctx.globalAlpha = .1;
  ctx.fillStyle = "#fff3c3";
  const rayX = sunConfig.x;
  const rayY = sunConfig.y + 10;
  for (let i = 0; i < 5; i++) {
    const left = rayX - 185 + i * 82;
    ctx.beginPath();
    ctx.moveTo(rayX, rayY);
    ctx.lineTo(left, 400);
    ctx.lineTo(left + 62, 400);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

// =====================================================
// NÚI TIÊN
// =====================================================




// =====================================================
// VÁCH NÚI SAU THÁC — TẠO CHIỀU SÂU CHO DÒNG THÁC
// =====================================================

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


// =====================================================
// MÁI KIẾN TRÚC TIÊN MÔN
// =====================================================



// =====================================================
// THÁP TIÊN
// =====================================================


// =====================================================
// VẠN KIẾM ĐIỆN VÀ TIÊN ĐIỆN
// =====================================================


// =====================================================
// TIÊN ĐÀI LƠ LỬNG
// =====================================================


// =====================================================
// THÁC NƯỚC
// =====================================================


// =====================================================
// QUẢNG TRƯỜNG TIÊN MÔN
// KHÔNG CÒN LÀ KHU VỰC SÔNG NƯỚC
// =====================================================


// =====================================================
// CẦU ĐÁ TRANG TRÍ
// =====================================================


// =====================================================
// LINH TUYỀN CHƯỞNG MÔN — BẢO VẬT NGỰ LONG
// =====================================================


// =====================================================
// TỔNG HỢP PHONG CẢNH
// =====================================================

