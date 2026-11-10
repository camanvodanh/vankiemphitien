
"use strict";

// =====================================================
// HÀO QUANG VÀ VÒNG LINH KHÍ
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
  ctx.ellipse(0, 13, 17, 5, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

// =====================================================
// ĐỆ TỬ ĐỨNG CỔ VŨ
// =====================================================

function drawSpectator(
  x,
  y,
  scale,
  roleName,
  time,
  phase = 0
) {
  const role = ROLE[roleName] || ROLE.outer;

  const armWave = Math.sin(time * .008 + phase);

  ctx.save();

  ctx.translate(x, y);
  ctx.scale(scale * role.scale, scale * role.scale);

  // Bóng dưới chân
  ctx.fillStyle = "rgba(20,35,27,.28)";
  ctx.beginPath();
  ctx.ellipse(0, 22, 14, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Hào quang cấp cao
  if (role.aura) {
    drawAura(
      0,
      -10,
      roleName === "core" ? 31 : 25,
      role.aura,
      time,
      phase
    );
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

  // Ngọc bội
  if (["inner", "core"].includes(roleName)) {
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
  ctx.fillStyle = "#29252a";
  ctx.fillRect(-7, -24, 14, 6);
  ctx.fillRect(-6, -27, 12, 4);
  ctx.fillRect(-8, -19, 3, 8);
  ctx.fillRect(5, -19, 3, 8);

  // Mắt
  ctx.fillStyle = "#3c302a";
  ctx.fillRect(-3, -15, 2, 2);
  ctx.fillRect(2, -15, 2, 2);

  // Tay vẫy
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

  ctx.fillStyle = role.robe;
  ctx.fillRect(-19, leftArmY - 4, 8, 7);
  ctx.fillRect(11, rightArmY - 4, 8, 7);

  // Trang sức đệ tử nòng cốt
  if (roleName === "core") {
    ctx.fillStyle = "#f5d984";
    ctx.fillRect(-2, -28, 4, 4);
    ctx.fillRect(-11, -5, 3, 3);
    ctx.fillRect(8, -5, 3, 3);
  }

  ctx.restore();

  if (role.aura) {
    drawEnergyRings(
      x,
      y,
      scale * role.scale,
      role.aura,
      time,
      phase
    );
  }
}

// =====================================================
// NGỌC ĐÀI VÀ NGỌA THẤT
// =====================================================

function drawAudiencePlatform(x, y, width) {
  ctx.save();

  // Bệ đá nhiều tầng
  ctx.fillStyle = "#62513d";
  ctx.fillRect(x - width / 2, y, width, 13);

  ctx.fillStyle = "#b99a62";
  ctx.fillRect(x - width / 2 - 7, y - 5, width + 14, 6);

  ctx.fillStyle = "#e4ca8c";
  ctx.fillRect(x - width / 2, y + 13, width, 3);

  ctx.fillStyle = "#8e744b";

  for (
    let px = x - width / 2 + 18;
    px < x + width / 2;
    px += 38
  ) {
    ctx.fillRect(px, y + 16, 5, 12);
  }

  // Hoa văn mặt trước
  ctx.strokeStyle = "rgba(255,225,158,.7)";
  ctx.lineWidth = 1;

  ctx.strokeRect(
    x - width / 2 + 5,
    y + 2,
    width - 10,
    8
  );

  ctx.restore();
}

function drawAudienceThrone(
  x,
  y,
  width,
  height,
  grand = false
) {
  ctx.save();

  const left = -width / 2;
  const backWidth = width * .66;

  // Bóng ngai
  ctx.fillStyle = "rgba(20,25,20,.25)";
  ctx.fillRect(left - 7, y - 5, width + 14, 12);

  // Tựa lưng
  ctx.fillStyle = grand ? "#54251f" : "#44334d";
  ctx.fillRect(
    -backWidth / 2,
    y - height,
    backWidth,
    height - 8
  );

  ctx.fillStyle = grand ? "#9d3d30" : "#70558b";
  ctx.fillRect(
    -backWidth / 2 + 5,
    y - height + 6,
    backWidth - 10,
    height - 20
  );

  // Viền vàng
  ctx.strokeStyle = "#e7c77b";
  ctx.lineWidth = grand ? 4 : 3;
  ctx.strokeRect(
    -backWidth / 2 + 3,
    y - height + 3,
    backWidth - 6,
    height - 15
  );

  // Hoa văn trên tựa lưng
  ctx.fillStyle = "#f1d78c";

  ctx.beginPath();
  ctx.moveTo(0, y - height + 10);
  ctx.lineTo(12, y - height + 27);
  ctx.lineTo(0, y - height + 43);
  ctx.lineTo(-12, y - height + 27);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = grand ? "#9b352c" : "#59416c";
  ctx.fillRect(-5, y - height + 22, 10, 10);

  // Mặt ghế
  ctx.fillStyle = "#4c3028";
  ctx.fillRect(-width / 2, y - 13, width, 13);

  ctx.fillStyle = grand ? "#d0a64d" : "#b79b6b";
  ctx.fillRect(-width / 2, y - 15, width, 5);

  // Tay vịn hai bên
  [-1, 1].forEach(side => {
    const px = side * (width / 2 - 8);

    ctx.fillStyle = grand ? "#7f3029" : "#55415e";
    ctx.fillRect(px - 5, y - 28, 10, 28);

    ctx.fillStyle = "#e5c477";
    ctx.fillRect(px - 8, y - 30, 16, 5);

    ctx.beginPath();
    ctx.arc(px, y - 32, 5, 0, Math.PI * 2);
    ctx.fill();
  });

  // Chân ngai
  ctx.fillStyle = "#6c4c30";
  ctx.fillRect(-width * .34, y - 2, 9, 14);
  ctx.fillRect(width * .34 - 9, y - 2, 9, 14);

  ctx.restore();
}

// =====================================================
// MÔN CHỦ VÀ TRƯỞNG LÃO NGỒI
// =====================================================

function drawSeatedSpectator(
  x,
  y,
  scale,
  roleName,
  time,
  phase = 0
) {
  const role = ROLE[roleName] || ROLE.elder;
  const isMaster = roleName === "master";

  ctx.save();

  ctx.translate(
    x,
    y + Math.sin(time * .002 + phase) * 1.2
  );

  ctx.scale(scale * role.scale, scale * role.scale);

  // Hào quang
  if (role.aura) {
    const radius = isMaster ? 55 : 37;

    const aura = ctx.createRadialGradient(
      0, -28, 3,
      0, -28, radius
    );

    aura.addColorStop(0, role.aura + "55");
    aura.addColorStop(.5, role.aura + "22");
    aura.addColorStop(1, role.aura + "00");

    ctx.fillStyle = aura;
    ctx.fillRect(-65, -90, 130, 120);
  }

  // Áo choàng rộng phía sau
  ctx.fillStyle = role.dark;

  ctx.beginPath();
  ctx.moveTo(-12, -30);
  ctx.lineTo(12, -30);
  ctx.lineTo(26, 15);
  ctx.lineTo(17, 22);
  ctx.lineTo(-17, 22);
  ctx.lineTo(-26, 15);
  ctx.closePath();
  ctx.fill();

  // Thân áo chính
  ctx.fillStyle = role.robe;

  ctx.beginPath();
  ctx.moveTo(-10, -29);
  ctx.lineTo(10, -29);
  ctx.lineTo(19, 13);
  ctx.lineTo(13, 20);
  ctx.lineTo(-13, 20);
  ctx.lineTo(-19, 13);
  ctx.closePath();
  ctx.fill();

  // Vạt áo phủ ngang đầu gối
  ctx.fillStyle = role.dark;
  ctx.fillRect(-20, 8, 40, 12);

  ctx.fillStyle = role.robe;
  ctx.fillRect(-17, 6, 34, 10);

  // Đường viền áo
  ctx.strokeStyle = isMaster ? "#f7d77e" : "#d8c18b";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(-10, -26);
  ctx.lineTo(-17, 14);
  ctx.moveTo(10, -26);
  ctx.lineTo(17, 14);
  ctx.stroke();

  // Đai lưng
  ctx.fillStyle = role.belt;
  ctx.fillRect(-11, -4, 22, 4);

  // Ngọc bội
  ctx.fillStyle = "#ffe8a0";
  ctx.fillRect(5, -1, 4, 8);

  // Hai chân ngồi xếp bằng
  ctx.fillStyle = role.dark;

  ctx.beginPath();
  ctx.ellipse(-9, 17, 15, 5, -.15, 0, Math.PI * 2);
  ctx.ellipse(9, 17, 15, 5, .15, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = isMaster ? "#c9a34f" : "#a58b64";
  ctx.fillRect(-18, 19, 14, 3);
  ctx.fillRect(4, 19, 14, 3);

  // Hai tay đặt trên tay vịn
  ctx.strokeStyle = "#efc39b";
  ctx.lineWidth = 4;
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(-9, -22);
  ctx.lineTo(-21, -7);
  ctx.lineTo(-25, -5);

  ctx.moveTo(9, -22);
  ctx.lineTo(21, -7);
  ctx.lineTo(25, -5);
  ctx.stroke();

  // Tay áo
  ctx.fillStyle = role.robe;
  ctx.fillRect(-25, -12, 10, 8);
  ctx.fillRect(15, -12, 10, 8);

  // Mặt
  ctx.fillStyle = "#efc39b";
  ctx.fillRect(-7, -48, 14, 15);

  // Tóc bạc trưởng lão, tóc môn chủ
  ctx.fillStyle = isMaster ? "#28232b" : "#e5dfd1";
  ctx.fillRect(-8, -52, 16, 6);
  ctx.fillRect(-7, -56, 14, 5);
  ctx.fillRect(-9, -47, 3, 9);
  ctx.fillRect(6, -47, 3, 9);

  // Mắt
  ctx.fillStyle = "#392b26";
  ctx.fillRect(-4, -42, 2, 2);
  ctx.fillRect(3, -42, 2, 2);

  // Râu
  ctx.fillStyle = isMaster ? "#d9d4c9" : "#f0eadc";

  ctx.beginPath();
  ctx.moveTo(-4, -34);
  ctx.lineTo(4, -34);
  ctx.lineTo(3, -23);
  ctx.lineTo(0, -19);
  ctx.lineTo(-3, -23);
  ctx.closePath();
  ctx.fill();

  // Mũ miện môn chủ
  if (isMaster) {
    ctx.fillStyle = "#e8c36e";

    ctx.beginPath();
    ctx.moveTo(-10, -51);
    ctx.lineTo(-8, -65);
    ctx.lineTo(-3, -58);
    ctx.lineTo(0, -70);
    ctx.lineTo(4, -58);
    ctx.lineTo(9, -65);
    ctx.lineTo(11, -51);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "#fff0b5";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = "#b83d35";
    ctx.fillRect(-3, -61, 6, 5);

    ctx.fillStyle = "#ffe8a0";
    ctx.fillRect(-2, -69, 4, 4);

    // Họa tiết rồng trên ngực
    ctx.strokeStyle = "#f4d47d";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(-7, -20);
    ctx.quadraticCurveTo(0, -13, 7, -20);
    ctx.stroke();

    ctx.fillStyle = "#f8df9a";
    ctx.fillRect(-2, -17, 4, 4);
  } else {
    // Trâm ngọc trưởng lão
    ctx.fillStyle = "#e6d08f";
    ctx.fillRect(-3, -59, 6, 8);
    ctx.fillRect(-5, -56, 10, 2);
  }

  ctx.restore();

  if (role.aura) {
    drawEnergyRings(
      x,
      y,
      scale * role.scale,
      role.aura,
      time,
      phase
    );
  }
}

// =====================================================
// CỜ HIỆU CỔ VŨ
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
// BỐ TRÍ KHÁN GIẢ THEO CẤP BẬC
// =====================================================

function drawCrowd(time) {
  // ---------------------------------------------------
  // TẦNG CAO NHẤT: MÔN CHỦ NGỒI CHỦ TỌA
  // ---------------------------------------------------

  drawAudiencePlatform(550, 607, 190);
  drawAudienceThrone(550, 590, 150, 84, true);

  drawAura(550, 550, 88, "#ffe6a0", time, 0);

  drawSeatedSpectator(
    550, 580, 1.05,
    "master", time, 0
  );

  // ---------------------------------------------------
  // TẦNG THẤP HƠN: HAI VỊ TRÍ TRƯỞNG LÃO
  // ---------------------------------------------------

  drawAudiencePlatform(380, 623, 112);
  drawAudienceThrone(380, 610, 100, 59, false);

  drawSeatedSpectator(
    380, 601, .83,
    "elder", time, 1
  );

  drawAudiencePlatform(720, 623, 112);
  drawAudienceThrone(720, 610, 100, 59, false);

  drawSeatedSpectator(
    720, 601, .83,
    "elder", time, 2
  );

  // ---------------------------------------------------
  // TẦNG KẾ TIẾP: ĐỆ TỬ NÒNG CỐT ĐỨNG
  // ---------------------------------------------------

  const core = [
    [265, 619],
    [470, 619],
    [630, 619],
    [835, 619]
  ];

  core.forEach((p, i) => {
    drawSpectator(
      p[0], p[1], .68,
      "core", time, i * .8
    );
  });

  // ---------------------------------------------------
  // NỘI MÔN ĐỨNG Ở HÀNG PHÍA DƯỚI
  // ---------------------------------------------------

  const inner = [
    [165, 632],
    [325, 632],
    [550, 632],
    [775, 632],
    [935, 632]
  ];

  inner.forEach((p, i) => {
    drawSpectator(
      p[0], p[1], .57,
      "inner", time, i * .9
    );
  });

  // ---------------------------------------------------
  // NGOẠI MÔN ĐỨNG Ở HAI CÁNH
  // ---------------------------------------------------

  const outer = [
    [45, 637],
    [105, 637],
    [225, 637],
    [875, 637],
    [995, 637],
    [1055, 637]
  ];

  outer.forEach((p, i) => {
    drawSpectator(
      p[0], p[1], .53,
      "outer", time, i * .7
    );
  });

  // ---------------------------------------------------
  // TẠP DỊCH ĐỨNG Ở MÉP NGOÀI
  // ---------------------------------------------------

  const servants = [
    [18, 642],
    [145, 642],
    [955, 642],
    [1080, 642]
  ];

  servants.forEach((p, i) => {
    drawSpectator(
      p[0], p[1], .47,
      "servant", time, i * .8
    );
  });

  // Cờ hiệu hai bên
  drawCrowdFlag(15, 596, "#a53f36", time);
  drawCrowdFlag(1080, 596, "#b18a43", time);
}
