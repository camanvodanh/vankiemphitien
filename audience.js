
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
  ctx.lineJoin = "round";
  ctx.miterLimit = 2;

  // Một nét viền nâu đen mảnh, sắc; bỏ các lớp vàng chồng làm nhòe chữ nhỏ.
  ctx.lineWidth = Math.max(1.35, 1.65 * scale);
  ctx.strokeStyle = "#17251f";
  ctx.strokeText(text, x, y);

  ctx.fillStyle = color || "#fff0c5";
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
