
"use strict";

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
    0, 13,
    25 + Math.sin(time * .002 + phase) * 2,
    7, 0, 0, Math.PI * 2
  );
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(0, 13, 17, 5, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

// =====================================================
// VẼ ĐỆ TỬ, TRƯỞNG LÃO, MÔN CHỦ
// =====================================================



// =====================================================
// ĐÀI NGỌC NHIỀU TẦNG
// =====================================================

function drawAudiencePlatform(x, y, width) {
  ctx.save();

  // Bệ móng
  ctx.fillStyle = "#514333";
  ctx.fillRect(x - width / 2 - 15, y + 22, width + 30, 14);

  // Tầng đá thứ nhất
  ctx.fillStyle = "#806b4d";
  ctx.fillRect(x - width / 2 - 17, y + 15, width + 34, 9);

  // Viền ngọc
  ctx.fillStyle = "#c7a970";
  ctx.fillRect(x - width / 2 - 20, y + 8, width + 40, 8);

  ctx.fillStyle = "#e2c98f";
  ctx.fillRect(x - width / 2 - 17, y + 3, width + 34, 6);

  // Mặt sàn
  ctx.fillStyle = "#8e7048";
  ctx.fillRect(x - width / 2 - 10, y - 2, width + 20, 7);

  ctx.fillStyle = "#f1d99d";
  ctx.fillRect(x - width / 2 - 16, y - 7, width + 32, 6);

  // Hoa văn mặt tiền
  ctx.strokeStyle = "#e6c77f";
  ctx.lineWidth = 2;

  ctx.strokeRect(
    x - width / 2 + 4,
    y + 10,
    width - 8,
    17
  );

  // Họa tiết sen
  for (
    let px = x - width / 2 + 12;
    px < x + width / 2;
    px += 24
  ) {
    ctx.fillStyle = "#d8bd80";
    ctx.fillRect(px, y - 17, 4, 18);

    ctx.fillStyle = "#f0d99c";
    ctx.beginPath();
    ctx.arc(px + 2, y - 19, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Trụ sen phát sáng
  [-width / 2 - 12, width / 2 + 12].forEach(px => {
    ctx.fillStyle = "#d9bb75";
    ctx.fillRect(x + px - 2, y - 27, 4, 28);

    ctx.fillStyle = "#fff0b8";
    ctx.beginPath();
    ctx.arc(x + px, y - 30, 5, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

// =====================================================
// BIỂN TÊN CẤP BẬC
// =====================================================

function drawRoleLabel(x, y, text, color, scale = 1) {
  ctx.save();

  ctx.font = `bold ${Math.max(7, 9 * scale)}px Georgia`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const width = ctx.measureText(text).width + 16;
  const height = 17 * scale;

  // Bóng bảng
  ctx.fillStyle = "rgba(20,22,20,.4)";
  ctx.fillRect(
    x - width / 2 + 2,
    y - height / 2 + 3,
    width,
    height
  );

  // Khung ngoài
  ctx.fillStyle = "#8d7049";
  ctx.fillRect(
    x - width / 2 - 3,
    y - height / 2 - 3,
    width + 6,
    height + 6
  );

  // Viền vàng
  ctx.fillStyle = "#e5cb8a";
  ctx.fillRect(
    x - width / 2 - 1,
    y - height / 2 - 1,
    width + 2,
    height + 2
  );

  // Nền bảng
  ctx.fillStyle = "rgba(39,35,29,.96)";
  ctx.fillRect(
    x - width / 2,
    y - height / 2,
    width,
    height
  );

  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.strokeRect(
    x - width / 2 + 2,
    y - height / 2 + 2,
    width - 4,
    height - 4
  );

  ctx.fillStyle = "#fff0c5";
  ctx.shadowColor = color;
  ctx.shadowBlur = 4;
  ctx.fillText(text, x, y);

  ctx.restore();
}

// =====================================================
// GHẾ NGỒI THÂN TRUYỀN
// =====================================================

function drawDiscipleSeats(time) {
  const positions = [
    [395, 638], [450, 634], [505, 631],
    [560, 631], [615, 634], [670, 638],
    [725, 638]
  ];

  positions.forEach(([x, y], i) => {
    ctx.save();

    // Ghế ngọc riêng
    ctx.fillStyle = "#806543";
    ctx.fillRect(x - 17, y + 12, 34, 8);

    ctx.fillStyle = "#d8bd83";
    ctx.fillRect(x - 19, y + 7, 38, 5);

    ctx.fillStyle = "#a98b5c";
    ctx.fillRect(x - 14, y - 2, 28, 12);

    ctx.fillStyle = "#e7d09a";
    ctx.fillRect(x - 13, y - 4, 26, 3);

    // Họa tiết lưng ghế
    ctx.strokeStyle = "#e8cf91";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x - 12, y - 2, 24, 11);

    ctx.fillStyle = "#b9d8ff";
    ctx.beginPath();
    ctx.arc(x, y + 3, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  });
}

// =====================================================
// GHẾ TRƯỞNG LÃO
// =====================================================

function drawElderSeats() {
  const positions = [
    [145, 672], [195, 668], [245, 668], [295, 672],
    [755, 672], [805, 668], [855, 668], [905, 672]
  ];

  positions.forEach(([x, y]) => {
    ctx.save();

    ctx.fillStyle = "#5e4659";
    ctx.fillRect(x - 19, y + 10, 38, 9);

    ctx.fillStyle = "#c1a16d";
    ctx.fillRect(x - 21, y + 5, 42, 5);

    ctx.fillStyle = "#84678a";
    ctx.fillRect(x - 16, y - 8, 32, 17);

    ctx.fillStyle = "#d8c18b";
    ctx.fillRect(x - 17, y - 10, 34, 3);

    ctx.strokeStyle = "#e3c88e";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x - 13, y - 6, 26, 12);

    ctx.restore();
  });
}

// =====================================================
// GHẾ MÔN CHỦ
// =====================================================

function drawMasterThrone() {
  ctx.save();

  // Bậc ngai
  ctx.fillStyle = "#59402e";
  ctx.fillRect(465, 689, 170, 17);

  ctx.fillStyle = "#d4b16f";
  ctx.fillRect(455, 682, 190, 8);

  // Lưng ngai
  ctx.fillStyle = "#6c2929";
  ctx.fillRect(493, 640, 114, 43);

  ctx.fillStyle = "#e4c77d";
  ctx.fillRect(489, 635, 122, 7);

  ctx.strokeStyle = "#f2d48b";
  ctx.lineWidth = 2;
  ctx.strokeRect(500, 646, 100, 32);

  // Họa tiết kiếm
  ctx.strokeStyle = "#f1d58e";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(550, 650);
  ctx.lineTo(550, 673);
  ctx.moveTo(538, 659);
  ctx.lineTo(550, 650);
  ctx.lineTo(562, 659);
  ctx.stroke();

  // Đỉnh ngai
  ctx.fillStyle = "#e9cc82";

  ctx.beginPath();
  ctx.moveTo(493, 641);
  ctx.lineTo(500, 625);
  ctx.lineTo(520, 637);
  ctx.lineTo(550, 616);
  ctx.lineTo(580, 637);
  ctx.lineTo(600, 625);
  ctx.lineTo(607, 641);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#a63c32";
  ctx.beginPath();
  ctx.arc(550, 635, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// =====================================================
// CỜ NGHI LỄ
// =====================================================

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
// TỔNG HỢP KHÁN GIẢ VÀ KHU VỰC DANH DỰ
// =====================================================




// =====================================================
// REVISION 94 — ĐẠO BÀO NAM/NỮ PHÂN BIỆT RÕ,
// GIỮ NGUYÊN BẢNG MÀU CỦA TỪNG CẤP BẬC.
// =====================================================
