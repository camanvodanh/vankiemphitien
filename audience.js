
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

function drawSpectator(x,y,scale,roleName,time,phase=0){
  const role=ROLE[roleName]||ROLE.outer;
  const female=Math.abs(Math.floor(phase*5+(roleName==="elder"?1:0)))%2===1;
  const wave=Math.sin(time*.006+phase),armWave=Math.sin(time*.008+phase);
  const robe=female?(roleName==="servant"?"#a98b9b":roleName==="elder"?"#a68bbd":"#d28da9"):role.robe;
  const skin=female?"#f3c9a5":"#dfb08d";
  ctx.save();const beat=time*.00072+phase,pose=Math.floor((beat*.72)%5),jump=pose===2?Math.max(0,Math.sin(beat*5))*5:Math.sin(beat*2)*.8;
  ctx.translate(x,y-jump);ctx.scale(scale*role.scale,scale);
  ctx.fillStyle="rgba(20,35,27,.28)";ctx.beginPath();ctx.ellipse(0,22,14,4,0,0,Math.PI*2);ctx.fill();
  if(role.aura)drawAura(0,-10,roleName==="elder"?35:roleName==="disciple"?31:27,role.aura,time,phase);
  ctx.fillStyle="#403a35";ctx.fillRect(-6,15,5,9);ctx.fillRect(2,15,5,9);
  // Vóc dáng nữ nhỏ vai, eo gọn, tà váy xòe; nam vai rộng, áo thẳng.
  ctx.fillStyle=role.dark;ctx.beginPath();
  if(female){ctx.moveTo(-6,-5);ctx.lineTo(6,-5);ctx.lineTo(15,20);ctx.quadraticCurveTo(0,24,-15,20);ctx.closePath();}
  else{ctx.moveTo(-9,-5);ctx.lineTo(9,-5);ctx.lineTo(14,20);ctx.lineTo(-14,20);ctx.closePath();}
  ctx.fill();
  ctx.fillStyle=robe;ctx.beginPath();
  if(female){ctx.moveTo(-6,-6);ctx.lineTo(6,-6);ctx.lineTo(9,8);ctx.lineTo(13,18);ctx.quadraticCurveTo(0,22,-13,18);ctx.lineTo(-9,8);ctx.closePath();}
  else{ctx.moveTo(-8,-6);ctx.lineTo(8,-6);ctx.lineTo(11,17);ctx.lineTo(-11,17);ctx.closePath();}
  ctx.fill();
  ctx.fillStyle=role.belt;ctx.fillRect(-8,7,16,3);
  ctx.strokeStyle="#f1c39f";ctx.lineWidth=3;ctx.lineCap="round";const armY=pose===0?-5:pose===1?-28+armWave*3:pose===2?-23:pose===3?-20:-27;
  ctx.beginPath();ctx.moveTo(-7,0);ctx.lineTo(-15,armY);ctx.moveTo(7,0);ctx.lineTo(15,-armY*.7);ctx.stroke();
  ctx.fillStyle=robe;ctx.fillRect(-18,armY-3,7,7);ctx.fillRect(11,-armY*.7-3,7,7);
  // Mặt có đường nét và tóc riêng biệt.
  ctx.fillStyle=skin;ctx.beginPath();ctx.ellipse(0,-15,female?5.8:6.5,7,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=female?"#211d2a":"#29252a";
  if(female){ctx.beginPath();ctx.arc(0,-20,7,Math.PI,Math.PI*2);ctx.fill();ctx.fillRect(-7,-20,3,15);ctx.fillRect(5,-20,3,15);ctx.beginPath();ctx.arc(2,-26,3,0,Math.PI*2);ctx.fill();ctx.fillStyle="#e6ca86";ctx.fillRect(4,-28,7,2);}
  else{ctx.fillRect(-7,-22,14,5);ctx.fillRect(-5,-27,10,6);ctx.fillRect(-8,-18,3,8);ctx.fillRect(5,-18,3,8);}
  ctx.fillStyle="#382b28";ctx.fillRect(-3,-15,2,1.5);ctx.fillRect(2,-15,2,1.5);
  if((roleName==="elder"||roleName==="master")&&!female){ctx.fillStyle="#e2ded1";ctx.beginPath();ctx.moveTo(-3,-8);ctx.lineTo(3,-8);ctx.lineTo(2,2);ctx.lineTo(0,5);ctx.lineTo(-2,2);ctx.closePath();ctx.fill();}
  if(roleName==="core"||roleName==="disciple"){ctx.fillStyle="#e8d18d";ctx.fillRect(-2,-29,4,4);}
  if(pose===3){ctx.fillStyle="#382b28";ctx.beginPath();ctx.ellipse(0,-10,2.8,3.6,0,0,Math.PI*2);ctx.fill();}
  ctx.restore();
  if(role.aura)drawEnergyRings(x,y,scale*role.scale,role.aura,time,phase);
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


// =====================================================
// REVISION 94 — ĐẠO BÀO NAM/NỮ PHÂN BIỆT RÕ,
// GIỮ NGUYÊN BẢNG MÀU CỦA TỪNG CẤP BẬC.
// =====================================================
function drawSpectator(x,y,scale,roleName,time,phase=0){
  const role=ROLE[roleName]||ROLE.outer;
  const female=Math.abs(Math.floor(phase*5+(roleName==="elder"?1:0)))%2===1;
  const robe=role.robe,shadowRobe=role.dark,belt=role.belt;
  const skin=female?"#f1c7a5":"#d9a783";
  const ink=female?"#29212a":"#29232a";
  const wave=Math.sin(time*.006+phase),armWave=Math.sin(time*.008+phase);
  const beat=time*.00072+phase,pose=Math.floor((beat*.72)%5);
  const jump=pose===2?Math.max(0,Math.sin(beat*5))*5:Math.sin(beat*2)*.8;
  ctx.save();ctx.translate(x,y-jump);ctx.scale(scale*role.scale,scale);
  ctx.fillStyle="rgba(20,35,27,.3)";ctx.beginPath();ctx.ellipse(0,22,15,4,0,0,Math.PI*2);ctx.fill();
  if(role.aura)drawAura(0,-12,roleName==="elder"?36:roleName==="disciple"?32:28,role.aura,time,phase);

  // Tà áo trong và thân đạo bào: nữ chiết eo, váy nhiều lớp; nam vai rộng, vạt thẳng.
  ctx.fillStyle=shadowRobe;ctx.beginPath();
  if(female){
    ctx.moveTo(-7,-7);ctx.lineTo(7,-7);ctx.lineTo(12,5);ctx.quadraticCurveTo(13,14,19,22);
    ctx.quadraticCurveTo(0,27,-19,22);ctx.quadraticCurveTo(-13,13,-12,5);ctx.closePath();
  }else{
    ctx.moveTo(-10,-8);ctx.lineTo(10,-8);ctx.lineTo(16,20);ctx.lineTo(10,24);ctx.lineTo(-10,24);ctx.lineTo(-16,20);ctx.closePath();
  }ctx.fill();

  // Lớp áo ngoài có cổ giao lĩnh, đường viền thêu ánh kim.
  ctx.fillStyle=robe;ctx.beginPath();
  if(female){
    ctx.moveTo(-7,-8);ctx.lineTo(7,-8);ctx.lineTo(10,5);ctx.lineTo(15,19);
    ctx.quadraticCurveTo(0,24,-15,19);ctx.lineTo(-10,5);ctx.closePath();
  }else{
    ctx.moveTo(-9,-8);ctx.lineTo(9,-8);ctx.lineTo(13,18);ctx.lineTo(9,23);ctx.lineTo(-9,23);ctx.lineTo(-13,18);ctx.closePath();
  }ctx.fill();

  // Áo trong sáng màu theo tông cấp bậc, không đổi màu chủ đạo đạo bào.
  ctx.fillStyle=female?"rgba(255,239,221,.78)":"rgba(255,239,213,.58)";
  ctx.beginPath();ctx.moveTo(-4,-8);ctx.lineTo(0,1);ctx.lineTo(4,-8);ctx.lineTo(7,13);ctx.lineTo(0,18);ctx.lineTo(-7,13);ctx.closePath();ctx.fill();

  // Cổ áo giao lĩnh và đường chỉ viền.
  ctx.strokeStyle=belt;ctx.lineWidth=1.15;ctx.beginPath();
  ctx.moveTo(-8,-8);ctx.lineTo(-2,2);ctx.lineTo(0,5);ctx.lineTo(2,2);ctx.lineTo(8,-8);ctx.stroke();
  ctx.strokeStyle="rgba(255,232,179,.82)";ctx.lineWidth=.8;
  ctx.beginPath();ctx.moveTo(-12,15);ctx.quadraticCurveTo(0,19,12,15);ctx.stroke();

  // Tay áo rộng: nữ có ống tay mềm rủ, nam tay áo vuông khỏe.
  ctx.fillStyle=robe;ctx.strokeStyle=belt;ctx.lineWidth=1.1;
  ctx.beginPath();
  if(female){ctx.moveTo(-8,-5);ctx.quadraticCurveTo(-16,-7,-18,3);ctx.lineTo(-22,13);ctx.quadraticCurveTo(-17,17,-12,11);ctx.lineTo(-5,2);ctx.closePath();}
  else{ctx.moveTo(-9,-5);ctx.lineTo(-16,-3);ctx.lineTo(-20,8);ctx.lineTo(-13,13);ctx.lineTo(-6,3);ctx.closePath();}
  ctx.fill();ctx.stroke();
  ctx.beginPath();
  if(female){ctx.moveTo(8,-5);ctx.quadraticCurveTo(16,-7,18,3);ctx.lineTo(22,13);ctx.quadraticCurveTo(17,17,12,11);ctx.lineTo(5,2);ctx.closePath();}
  else{ctx.moveTo(9,-5);ctx.lineTo(16,-3);ctx.lineTo(20,8);ctx.lineTo(13,13);ctx.lineTo(6,3);ctx.closePath();}
  ctx.fill();ctx.stroke();

  // Đai lưng nhiều lớp, khóa ngọc và dải tua.
  ctx.fillStyle=shadowRobe;ctx.fillRect(-10,5,20,4);
  ctx.fillStyle=belt;ctx.fillRect(-10,5,20,2);
  ctx.fillStyle="#e8d39b";ctx.strokeStyle="#8e7447";ctx.lineWidth=.7;
  ctx.beginPath();ctx.roundRect(-2.2,4,4.4,5,1);ctx.fill();ctx.stroke();
  ctx.strokeStyle=belt;ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(3,8);ctx.lineTo(5,15);ctx.lineTo(3,18);ctx.stroke();

  // Họa tiết thêu ngực riêng theo cấp bậc.
  ctx.strokeStyle=belt;ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(5,-3);ctx.quadraticCurveTo(10,0,6,4);ctx.stroke();
  if(roleName==="elder"||roleName==="master"||roleName==="disciple"){
    ctx.beginPath();ctx.arc(6,-3,2.3,0,Math.PI*2);ctx.stroke();
  }

  // Tư thế tay cổ vũ, giữ cử chỉ nhưng thay bàn tay/ống tay theo giới tính.
  const armY=pose===0?-4:pose===1?-25+armWave*3:pose===2?-22:pose===3?-18:-25;
  ctx.strokeStyle=skin;ctx.lineWidth=female?2.8:3.5;ctx.lineCap="round";
  ctx.beginPath();ctx.moveTo(-12,0);ctx.quadraticCurveTo(-16,-5,-15,armY);
  ctx.moveTo(12,0);ctx.quadraticCurveTo(16,-5,15,-armY*.68);ctx.stroke();
  ctx.fillStyle=robe;ctx.beginPath();ctx.ellipse(-15,armY,3.8,5,-.25,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(15,-armY*.68,3.8,5,.25,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=skin;ctx.beginPath();ctx.arc(-15,armY,2.2,0,Math.PI*2);ctx.arc(15,-armY*.68,2.2,0,Math.PI*2);ctx.fill();

  // Cổ và gương mặt.
  ctx.fillStyle=skin;ctx.fillRect(-3.2,-17,6.4,8);
  ctx.beginPath();ctx.ellipse(0,-21,female?5.7:6.5,7.2,0,0,Math.PI*2);ctx.fill();

  // Tóc và búi: nữ tóc dài mềm, trâm ngọc; nam búi cao, mai tóc gọn.
  ctx.fillStyle=ink;
  if(female){
    ctx.beginPath();ctx.arc(0,-25,6.5,Math.PI,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.moveTo(-6,-25);ctx.quadraticCurveTo(-9,-17,-7,-8);ctx.quadraticCurveTo(-5,-12,-4,-19);ctx.closePath();ctx.fill();
    ctx.beginPath();ctx.moveTo(6,-25);ctx.quadraticCurveTo(9,-17,7,-8);ctx.quadraticCurveTo(5,-12,4,-19);ctx.closePath();ctx.fill();
    ctx.beginPath();ctx.ellipse(2,-29,4.2,3.2,-.35,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle=belt;ctx.lineWidth=1.1;ctx.beginPath();ctx.moveTo(3,-30);ctx.lineTo(9,-34);ctx.stroke();
    ctx.fillStyle="#f2dfaa";ctx.beginPath();ctx.arc(9,-34,1.7,0,Math.PI*2);ctx.fill();
    // Dải tóc sau gáy và trâm nhỏ tạo nét thục nữ.
    ctx.strokeStyle=ink;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(-4,-19);ctx.quadraticCurveTo(-8,-9,-5,-4);ctx.moveTo(4,-19);ctx.quadraticCurveTo(8,-9,5,-4);ctx.stroke();
  }else{
    ctx.beginPath();ctx.arc(0,-25,7,Math.PI,Math.PI*2);ctx.fill();
    ctx.fillRect(-7,-25,3,9);ctx.fillRect(4,-25,3,9);
    ctx.beginPath();ctx.ellipse(1,-31,4.5,3.5,-.2,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=belt;ctx.fillRect(-1,-35,3,5);
    if(roleName==="elder"){ctx.fillStyle="#e0d8c8";ctx.beginPath();ctx.moveTo(-3,-15);ctx.lineTo(3,-15);ctx.lineTo(2,-7);ctx.lineTo(0,-5);ctx.lineTo(-2,-7);ctx.closePath();ctx.fill();}
  }
  // Nét mặt nam góc cạnh, nữ thanh tú.
  ctx.strokeStyle=ink;ctx.lineWidth=female?1.0:1.35;ctx.beginPath();
  ctx.moveTo(-3.5,-22);ctx.lineTo(-1.2,-22);ctx.moveTo(1.2,-22);ctx.lineTo(3.5,-22);ctx.stroke();
  ctx.fillStyle=ink;ctx.fillRect(-2.8,-20,1.2,1.2);ctx.fillRect(1.6,-20,1.2,1.2);
  ctx.strokeStyle=female?"#b77c70":"#9c6957";ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(0,-19);ctx.lineTo(-.6,-16.8);ctx.lineTo(.8,-16.5);ctx.stroke();
  ctx.strokeStyle=female?"#a85f66":"#70463d";ctx.lineWidth=female?1:.9;ctx.beginPath();ctx.moveTo(-1.8,-14.7);ctx.quadraticCurveTo(0,-13.8,1.8,-14.7);ctx.stroke();

  // Phụ kiện cấp bậc: ngọc quan nam, trâm hoa nữ.
  if(roleName==="core"||roleName==="disciple"||roleName==="elder"){
    ctx.fillStyle=belt;ctx.beginPath();ctx.arc(0,-35,2.2,0,Math.PI*2);ctx.fill();
  }
  if(pose===3){ctx.fillStyle=ink;ctx.beginPath();ctx.ellipse(0,-17,1.8,2.5,0,0,Math.PI*2);ctx.fill();}
  ctx.restore();
  if(role.aura)drawEnergyRings(x,y,scale*role.scale,role.aura,time,phase);
}
