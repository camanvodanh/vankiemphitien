
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


// =====================================================
// VẼ ĐỆ TỬ, TRƯỞNG LÃO, MÔN CHỦ
// =====================================================



// =====================================================
// ĐÀI NGỌC NHIỀU TẦNG
// =====================================================


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


// =====================================================
// GHẾ TRƯỞNG LÃO
// =====================================================


// =====================================================
// GHẾ MÔN CHỦ
// =====================================================


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
