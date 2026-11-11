
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
  // Luân phiên nam/nữ theo nhịp phase của từng hàng; giữ nguyên màu cấp bậc.
  const personIndex=Math.abs(Math.round(phase*10));
  const female=personIndex%2===1;
  const robe=role.robe,shade=role.dark,trim=role.belt;
  const skin=female?"#f2c8a8":"#d9a783";
  const hair=female?"#211c2b":"#29232a";
  const beat=time*.00072+phase,pose=Math.floor((beat*.72)%5);
  const armWave=Math.sin(time*.008+phase);
  const jump=pose===2?Math.max(0,Math.sin(beat*5))*5:Math.sin(beat*2)*.8;

  ctx.save();
  ctx.translate(x,y-jump);
  ctx.scale(scale*role.scale,scale);
  ctx.lineJoin="round";ctx.lineCap="round";

  // Bóng chân và hào quang cấp bậc.
  ctx.fillStyle="rgba(20,27,30,.3)";
  ctx.beginPath();ctx.ellipse(0,39,18,4,0,0,Math.PI*2);ctx.fill();
  if(role.aura)drawAura(0,-14,roleName==="elder"?39:roleName==="disciple"?35:29,role.aura,time,phase);

  // Giày và lớp áo trong.
  ctx.fillStyle="#403b38";
  if(female){
    ctx.beginPath();ctx.ellipse(-5,35,5,2.6,-.12,0,Math.PI*2);ctx.ellipse(5,35,5,2.6,.12,0,Math.PI*2);ctx.fill();
  }else{
    ctx.fillRect(-9,34,7,4);ctx.fillRect(2,34,7,4);
  }

  // Tà đạo bào: nam dáng thẳng, vai rộng; nữ chiết eo và váy xếp tầng.
  ctx.fillStyle=shade;ctx.beginPath();
  if(female){
    ctx.moveTo(-7,-10);ctx.lineTo(7,-10);ctx.lineTo(11,4);
    ctx.quadraticCurveTo(14,20,27,37);ctx.quadraticCurveTo(0,45,-27,37);
    ctx.quadraticCurveTo(-14,20,-11,4);ctx.closePath();
  }else{
    ctx.moveTo(-15,-11);ctx.lineTo(15,-11);ctx.lineTo(20,5);
    ctx.lineTo(19,37);ctx.quadraticCurveTo(0,41,-19,37);
    ctx.lineTo(-20,5);ctx.closePath();
  }ctx.fill();

  ctx.fillStyle=robe;ctx.beginPath();
  if(female){
    ctx.moveTo(-7,-10);ctx.lineTo(7,-10);ctx.lineTo(10,4);
    ctx.quadraticCurveTo(13,21,23,35);ctx.quadraticCurveTo(0,41,-23,35);
    ctx.quadraticCurveTo(-13,21,-10,4);ctx.closePath();
  }else{
    ctx.moveTo(-13,-11);ctx.lineTo(13,-11);ctx.lineTo(16,5);
    ctx.lineTo(16,35);ctx.quadraticCurveTo(0,39,-16,35);
    ctx.lineTo(-16,5);ctx.closePath();
  }ctx.fill();

  // Nẹp thêu viền tà áo và hoa văn cấp bậc.
  if(female){
    ctx.fillStyle=shade;ctx.beginPath();ctx.moveTo(-7,8);ctx.quadraticCurveTo(-12,25,-20,36);ctx.quadraticCurveTo(-9,42,0,39);ctx.lineTo(-3,9);ctx.closePath();ctx.fill();
    ctx.beginPath();ctx.moveTo(7,8);ctx.quadraticCurveTo(12,25,20,36);ctx.quadraticCurveTo(9,42,0,39);ctx.lineTo(3,9);ctx.closePath();ctx.fill();
    ctx.fillStyle=robe;ctx.globalAlpha=.88;ctx.beginPath();ctx.moveTo(-3,10);ctx.quadraticCurveTo(-8,27,-12,38);ctx.quadraticCurveTo(0,42,12,38);ctx.quadraticCurveTo(8,27,3,10);ctx.closePath();ctx.fill();ctx.globalAlpha=1;
  }
  ctx.strokeStyle=trim;ctx.lineWidth=1.5;
  ctx.beginPath();
  if(female){
    ctx.moveTo(-9,-7);ctx.quadraticCurveTo(-8,16,-17,34);
    ctx.moveTo(9,-7);ctx.quadraticCurveTo(8,16,17,34);
    ctx.moveTo(-17,29);ctx.quadraticCurveTo(0,35,17,29);
  }else{
    ctx.moveTo(-12,-6);ctx.lineTo(-14,34);
    ctx.moveTo(12,-6);ctx.lineTo(14,34);
    ctx.moveTo(-16,31);ctx.lineTo(16,31);
  }ctx.stroke();

  // Cổ giao lĩnh nhiều lớp, áo lót sáng và đai ngọc.
  ctx.fillStyle=female?"#fff0df":"#f4e4c9";
  ctx.beginPath();ctx.moveTo(-6,-11);ctx.lineTo(0,3);ctx.lineTo(6,-11);
  ctx.lineTo(3,10);ctx.lineTo(0,14);ctx.lineTo(-3,10);ctx.closePath();ctx.fill();
  ctx.strokeStyle=trim;ctx.lineWidth=1.2;
  ctx.beginPath();ctx.moveTo(-10,-9);ctx.lineTo(-2,4);ctx.lineTo(0,7);ctx.lineTo(2,4);ctx.lineTo(10,-9);ctx.stroke();

  // Đai lưng và khóa ngọc.
  ctx.fillStyle=shade;ctx.fillRect(-11,5,22,5);
  ctx.fillStyle=trim;ctx.fillRect(-11,5,22,2);
  ctx.fillStyle="#ead8a8";ctx.strokeStyle="#8e7447";ctx.lineWidth=.8;
  ctx.beginPath();ctx.roundRect(-3.2,4,6.4,7,1.4);ctx.fill();ctx.stroke();
  ctx.fillStyle=role.aura||"#9ac8bd";
  ctx.beginPath();ctx.arc(0,7.5,1.6,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle=trim;ctx.lineWidth=1.2;
  ctx.beginPath();ctx.moveTo(5,9);ctx.lineTo(8,20);ctx.lineTo(5,24);ctx.stroke();

  // Tay áo: nữ tay lụa dài rủ; nam tay áo rộng, góc cạnh.
  ctx.fillStyle=robe;ctx.strokeStyle=trim;ctx.lineWidth=1.2;
  const armY=pose===0?-5:pose===1?-29+armWave*3:pose===2?-25:pose===3?-20:-29;
  ctx.beginPath();
  if(female){
    ctx.moveTo(-8,-8);ctx.quadraticCurveTo(-18,-13,-20,2);
    ctx.lineTo(-30,24);ctx.quadraticCurveTo(-22,31,-14,17);
    ctx.lineTo(-5,3);ctx.closePath();
  }else{
    ctx.moveTo(-10,-8);ctx.lineTo(-19,-5);ctx.lineTo(-24,13);
    ctx.lineTo(-15,19);ctx.lineTo(-5,3);ctx.closePath();
  }ctx.fill();ctx.stroke();
  ctx.beginPath();
  if(female){
    ctx.moveTo(8,-8);ctx.quadraticCurveTo(18,-13,20,2);
    ctx.lineTo(30,24);ctx.quadraticCurveTo(22,31,14,17);
    ctx.lineTo(5,3);ctx.closePath();
  }else{
    ctx.moveTo(10,-8);ctx.lineTo(19,-5);ctx.lineTo(24,13);
    ctx.lineTo(15,19);ctx.lineTo(5,3);ctx.closePath();
  }ctx.fill();ctx.stroke();

  // Cánh tay và bàn tay đang chào mừng.
  ctx.strokeStyle=skin;ctx.lineWidth=female?2.8:4;
  ctx.beginPath();
  ctx.moveTo(-14,1);ctx.quadraticCurveTo(-19,-7,-16,armY);
  ctx.moveTo(14,1);ctx.quadraticCurveTo(19,-7,16,-armY*.68);ctx.stroke();
  ctx.fillStyle=robe;
  ctx.beginPath();ctx.ellipse(-16,armY,female?4.5:5.5,6,-.2,0,Math.PI*2);
  ctx.ellipse(16,-armY*.68,female?4.5:5.5,6,.2,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=skin;
  ctx.beginPath();ctx.arc(-16,armY,2.5,0,Math.PI*2);ctx.arc(16,-armY*.68,2.5,0,Math.PI*2);ctx.fill();

  // Cổ, gương mặt.
  ctx.fillStyle=skin;ctx.fillRect(-3.5,-19,7,9);
  ctx.beginPath();ctx.ellipse(0,-25,female?6.1:6.9,8,0,0,Math.PI*2);ctx.fill();

  if(female){
    // Tóc dài, búi trâm ngọc, mái mềm và lọn tóc hai bên.
    ctx.fillStyle=hair;
    ctx.beginPath();ctx.arc(0,-28,7.3,Math.PI,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.moveTo(-6,-28);ctx.quadraticCurveTo(-11,-14,-9,5);
    ctx.quadraticCurveTo(-5,-3,-4,-20);ctx.closePath();ctx.fill();
    ctx.beginPath();ctx.moveTo(6,-28);ctx.quadraticCurveTo(11,-14,9,5);
    ctx.quadraticCurveTo(5,-3,4,-20);ctx.closePath();ctx.fill();
    ctx.beginPath();ctx.ellipse(2,-33,4.8,3.8,-.25,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle=trim;ctx.lineWidth=1.6;ctx.beginPath();
    ctx.moveTo(3,-34);ctx.lineTo(12,-40);ctx.stroke();
    ctx.fillStyle="#f4dfaa";ctx.beginPath();ctx.arc(12,-40,2.2,0,Math.PI*2);ctx.fill();
    // Hoa tai.
    ctx.fillStyle="#f0d99c";ctx.beginPath();ctx.arc(-6,-23,1.1,0,Math.PI*2);ctx.arc(6,-23,1.1,0,Math.PI*2);ctx.fill();
  }else{
    // Nam búi tóc cao, quan mão; trưởng lão có râu bạc.
    ctx.fillStyle=hair;
    ctx.beginPath();ctx.arc(0,-28,7.6,Math.PI,Math.PI*2);ctx.fill();
    ctx.fillRect(-7,-28,3,11);ctx.fillRect(4,-28,3,11);
    ctx.beginPath();ctx.ellipse(1,-36,5.2,4,-.2,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=trim;ctx.fillRect(-3,-43,7,8);
    ctx.beginPath();ctx.moveTo(-5,-34);ctx.lineTo(5,-34);ctx.lineTo(4,-31);ctx.lineTo(-4,-31);ctx.closePath();ctx.fill();
    if(roleName==="elder"){
      ctx.fillStyle="#e6e0d3";ctx.beginPath();
      ctx.moveTo(-3,-18);ctx.lineTo(3,-18);ctx.lineTo(2,-7);
      ctx.lineTo(0,-4);ctx.lineTo(-2,-7);ctx.closePath();ctx.fill();
      ctx.strokeStyle="#e6e0d3";ctx.lineWidth=1.2;
      ctx.beginPath();ctx.moveTo(-5,-17);ctx.lineTo(-7,-11);ctx.moveTo(5,-17);ctx.lineTo(7,-11);ctx.stroke();
    }
  }

  // Mắt, chân mày, mũi và nét miệng; nam góc cạnh, nữ thanh tú.
  ctx.strokeStyle=hair;ctx.lineWidth=female?1:1.5;
  ctx.beginPath();
  ctx.moveTo(-4,-27);ctx.lineTo(-1.5,-27);ctx.moveTo(1.5,-27);ctx.lineTo(4,-27);
  if(!female){ctx.moveTo(-4.5,-29);ctx.lineTo(-1.2,-30);ctx.moveTo(1.2,-30);ctx.lineTo(4.5,-29);}
  ctx.stroke();
  ctx.fillStyle="#30272a";
  ctx.fillRect(-2.8,-25,1.2,1.4);ctx.fillRect(1.6,-25,1.2,1.4);
  ctx.strokeStyle=female?"#a85f66":"#70463d";ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(-2,-18);ctx.quadraticCurveTo(0,female?-16.5:-17,2,-18);ctx.stroke();

  // Huy hiệu ngực và tua trang trí riêng theo thân phận.
  if(roleName==="elder"||roleName==="disciple"||roleName==="core"){
    ctx.fillStyle="#f0d99c";ctx.beginPath();ctx.arc(0,15,2.4,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle=trim;ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(0,17);ctx.lineTo(0,23);ctx.stroke();
  }
  if(pose===3){ctx.fillStyle=hair;ctx.beginPath();ctx.ellipse(0,-20,2,2.8,0,0,Math.PI*2);ctx.fill();}
  ctx.restore();
  if(role.aura)drawEnergyRings(x,y,scale*role.scale,role.aura,time,phase);
}