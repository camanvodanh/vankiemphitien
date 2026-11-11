
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

function drawSpectator(x, y, scale, roleName, time, phase = 0) {
  const role = ROLE[roleName] || ROLE.outer;

  const wave = Math.sin(time * .006 + phase);
  const armWave = Math.sin(time * .008 + phase);

  ctx.save();

  const beat = time * .00072 + phase;
  const pose = Math.floor((beat * .72) % 5);
  const jump = pose === 2 ? Math.max(0, Math.sin(beat * 5)) * 5 : Math.sin(beat * 2) * .8;
  ctx.translate(x, y - jump);
  ctx.scale(scale * role.scale, scale * role.scale);

  // Bóng dưới chân
  ctx.fillStyle = "rgba(20,35,27,.28)";
  ctx.beginPath();
  ctx.ellipse(0, 22, 14, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Hào quang
  if (role.aura) {
    drawAura(
      0,
      -10,
      roleName === "master" ? 43 :
      roleName === "elder" ? 35 :
      roleName === "disciple" ? 31 : 27,
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
  if (["inner", "core", "disciple", "elder", "master"].includes(roleName)) {
    ctx.fillStyle = "#f1d98b";
    ctx.fillRect(3, 9, 3, 5);
  }

  // Hoa văn trên áo thân truyền
  if (roleName === "disciple") {
    ctx.strokeStyle = "#e8d8a3";
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.moveTo(0, -2);
    ctx.lineTo(-3, 5);
    ctx.lineTo(0, 9);
    ctx.lineTo(3, 5);
    ctx.closePath();
    ctx.stroke();
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

    ctx.fillRect(-3, -32, 6, 7);

    ctx.fillStyle = "#d6b86f";
    ctx.fillRect(-4, -31, 8, 2);
  }

  // Thân truyền: phát quan, trâm ngọc
  if (roleName === "disciple") {
    ctx.fillStyle = "#e8d18d";

    ctx.fillRect(-4, -30, 8, 3);
    ctx.fillRect(-2, -35, 4, 6);

    ctx.fillStyle = "#b9d8ff";
    ctx.beginPath();
    ctx.arc(0, -36, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Tay và động tác vẫy
  ctx.strokeStyle = "#efc39b";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";

  
  const leftArmY = pose === 0 ? -5 + armWave * 2 :
                   pose === 1 ? -31 + armWave * 4 :
                   pose === 2 ? -25 + armWave * 5 :
                   pose === 3 ? -23 + armWave * 3 : -30 + armWave * 5;
  const rightArmY = pose === 0 ? -5 - armWave * 2 :
                    pose === 1 ? -31 - armWave * 4 :
                    pose === 2 ? -27 - armWave * 5 :
                    pose === 3 ? -23 - armWave * 3 : -6 - armWave * 5;
  const leftArmX = pose === 4 ? -20 : pose === 0 ? -8 : -15;
  const rightArmX = pose === 4 ? 20 : pose === 0 ? 8 : 15;

  ctx.beginPath();
  ctx.moveTo(-7, 0);
  ctx.lineTo(leftArmX, leftArmY);
  ctx.moveTo(7, 0);
  ctx.lineTo(rightArmX, rightArmY);
  ctx.stroke();

  ctx.fillStyle = role.robe;
  ctx.fillRect(leftArmX - 4, leftArmY - 4, 8, 7);
  ctx.fillRect(rightArmX - 4, rightArmY - 4, 8, 7);

  // Biểu cảm reo hò rõ hơn theo nhịp hoạt ảnh.
  if (pose === 3) { ctx.fillStyle = "#382b28"; ctx.beginPath(); ctx.ellipse(0,-10,2.8,3.6,0,0,Math.PI*2); ctx.fill(); }

  // Trang sức nòng cốt
  if (roleName === "core") {
    ctx.fillStyle = "#f5d984";
    ctx.fillRect(-2, -28, 4, 4);
    ctx.fillRect(-11, -5, 3, 3);
    ctx.fillRect(8, -5, 3, 3);
  }

  // Trượng trưởng lão
  if (roleName === "elder") {
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

  // Môn chủ
  if (roleName === "master") {
    ctx.fillStyle = "#e8c36e";

    ctx.beginPath();
    ctx.moveTo(-7, -26);
    ctx.lineTo(-5, -36);
    ctx.lineTo(0, -30);
    ctx.lineTo(5, -36);
    ctx.lineTo(7, -26);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "#e6cb88";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(20, -29);
    ctx.lineTo(20, 21);
    ctx.stroke();

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

function drawCrowd(time) {
  // ==========================================
  // 1. TẠP DỊCH - HÀNG DƯỚI CÙNG
  // ==========================================

  for (let i = 0; i < 15; i++) {
    const x = 22 + i * 34;
    const y = 752 + (i % 2) * 5;

    drawSpectator(
      x, y, .72, "servant", time, i * .55
    );
  }

  // ==========================================
  // 2. NGOẠI MÔN
  // ==========================================

  for (let i = 0; i < 15; i++) {
    const x = 570 + i * 34;
    const y = 752 + (i % 2) * 5;

    drawSpectator(
      x, y, .78, "outer", time, i * .6
    );
  }

  // ==========================================
  // 3. NỘI MÔN
  // ==========================================

  for (let i = 0; i < 10; i++) {
    const x = 35 + i * 43;
    const y = 704 + (i % 2) * 4;

    drawSpectator(
      x, y, .84, "inner", time, i * .7
    );
  }

  for (let i = 0; i < 10; i++) {
    const x = 675 + i * 43;
    const y = 704 + (i % 2) * 4;

    drawSpectator(
      x, y, .84, "inner", time, i * .7
    );
  }

  // ==========================================
  // 4. NÒNG CỐT
  // ==========================================

  for (let i = 0; i < 7; i++) {
    drawSpectator(
      180 + i * 37,
      687 + (i % 2) * 3,
      .94,
      "core",
      time,
      i * .65
    );
  }

  for (let i = 0; i < 7; i++) {
    drawSpectator(
      700 + i * 37,
      687 + (i % 2) * 3,
      .94,
      "core",
      time,
      i * .65
    );
  }

  // ==========================================
  // 5. KHU GHẾ THÂN TRUYỀN
  // ĐỊA VỊ CAO HƠN NÒNG CỐT
  // ==========================================

  drawAudiencePlatform(550, 644, 410);

  drawDiscipleSeats(time);

  const disciples = [
    [395, 629], [450, 625], [505, 622],
    [560, 622], [615, 625], [670, 629],
    [725, 629]
  ];

  disciples.forEach((p, i) => {
    drawSpectator(
      p[0], p[1], 1.02,
      "disciple", time, i * .8
    );
  });

  drawRoleLabel(
    550, 591,
    "THÂN TRUYỀN ĐỆ TỬ",
    "#a9c9f0",
    1.05
  );

  // ==========================================
  // 6. TÁM TRƯỞNG LÃO
  // ==========================================

  drawAudiencePlatform(245, 680, 235);
  drawAudiencePlatform(855, 680, 235);

  drawElderSeats();

  const elders = [
    [145, 665], [195, 661],
    [245, 661], [295, 665],
    [755, 665], [805, 661],
    [855, 661], [905, 665]
  ];

  elders.forEach((p, i) => {
    drawSpectator(
      p[0], p[1],
      i % 2 ? 1.0 : 1.04,
      "elder", time, i * .9
    );
  });

  drawRoleLabel(
    245, 625,
    "ĐẠI TRƯỞNG LÃO",
    "#d4b5fa",
    1.05
  );

  drawRoleLabel(
    855, 625,
    "TRƯỞNG LÃO",
    "#d4b5fa",
    1.05
  );

  // ==========================================
  // 7. ĐÀI MÔN CHỦ
  // ==========================================

  drawAudiencePlatform(550, 696, 200);
  drawMasterThrone();

  drawAura(
    550, 650, 90,
    "#ffe6a0", time, 0
  );

  drawSpectator(
    550, 664, 1.28,
    "master", time, 0
  );

  drawRoleLabel(
    550, 615,
    "CHƯỞNG MÔN",
    "#f2d17d",
    1.2
  );

  // ==========================================
  // 8. CỜ NGHI LỄ
  // ==========================================

  drawCrowdFlag(18, 710, "#a53f36", time);
  drawCrowdFlag(1080, 710, "#b18a43", time);
  drawCrowdFlag(105, 665, "#426f8a", time);
  drawCrowdFlag(995, 665, "#8e4f83", time);
}
