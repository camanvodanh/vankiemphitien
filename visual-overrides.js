"use strict";

// =====================================================
// VISUAL OVERRIDES — VẠN KIẾM PHI TIÊN
// Tách rõ rừng núi / quảng trường, bố trí khán đài,
// tạo pháp bảo đa dạng cho từng người đua.
// =====================================================

function drawRiver(time) {
  // Quảng trường thu gọn vào khu trung tâm; hai mép là rừng núi.
  const left = 145;
  const right = 955;
  const top = 555;

  const floor = ctx.createLinearGradient(0, top, 0, H);
  floor.addColorStop(0, "#cbb98f");
  floor.addColorStop(.35, "#ad9870");
  floor.addColorStop(.75, "#806c50");
  floor.addColorStop(1, "#594b3a");

  ctx.fillStyle = floor;
  ctx.beginPath();
  ctx.moveTo(left, top + 8);
  ctx.quadraticCurveTo(550, top - 18, right, top + 8);
  ctx.lineTo(right + 38, H);
  ctx.lineTo(left - 38, H);
  ctx.closePath();
  ctx.fill();

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(left, top + 8);
  ctx.quadraticCurveTo(550, top - 18, right, top + 8);
  ctx.lineTo(right + 38, H);
  ctx.lineTo(left - 38, H);
  ctx.closePath();
  ctx.clip();

  // Phiến đá lát quảng trường theo phối cảnh.
  for (let y = 575; y < H + 25; y += 34) {
    ctx.strokeStyle = "rgba(246,224,177,.30)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(95 - (y - 555) * .35, y);
    ctx.lineTo(1005 + (y - 555) * .35, y);
    ctx.stroke();
  }

  for (let x = 120; x <= 980; x += 82) {
    ctx.strokeStyle = "rgba(64,51,34,.17)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(550 + (x - 550) * .16, 555);
    ctx.lineTo(x, H);
    ctx.stroke();
  }

  // Vòng tiên trận chỉ nằm ở khu vực trung tâm.
  ctx.strokeStyle = "rgba(255,226,166,.23)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.ellipse(550, 690, 75 + i * 34, 16 + i * 8, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();

  // Bậc viền quảng trường, không đặt đèn.
  ctx.strokeStyle = "#e0c994";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(left, top + 7);
  ctx.quadraticCurveTo(550, top - 20, right, top + 7);
  ctx.stroke();

  ctx.strokeStyle = "rgba(74,59,39,.45)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(left - 10, top + 18);
  ctx.quadraticCurveTo(550, top - 5, right + 10, top + 18);
  ctx.stroke();

  // Ngọc ấn trung tâm.
  ctx.fillStyle = "rgba(245,220,164,.35)";
  ctx.beginPath();
  ctx.moveTo(520, 575);
  ctx.lineTo(550, 560);
  ctx.lineTo(580, 575);
  ctx.lineTo(550, 590);
  ctx.closePath();
  ctx.fill();
}

function drawFormalSpectator(x, y, scale, roleName, time, phase = 0) {
  const role = ROLE[roleName] || ROLE.outer;
  const female = Math.abs(Math.floor(phase * 7 + (roleName==="elder"?1:0))) % 2 === 1;
  const hair = roleName==="master" || roleName==="elder" ? "#ded8ca" : (female ? "#211e29" : "#302a27");
  const skin = female ? "#f4cda9" : "#dcae89";
  const robe = female && roleName!=="master" ? "#b77f9f" : role.robe;
  ctx.save();ctx.translate(x,y);ctx.scale(scale*role.scale,scale);
  ctx.fillStyle="rgba(24,28,24,.30)";ctx.beginPath();ctx.ellipse(0,19,19,5,0,0,Math.PI*2);ctx.fill();
  // Thân áo phân biệt rõ: nữ có eo thon, tay áo rộng và tà váy xòe.
  ctx.fillStyle=role.dark;ctx.beginPath();
  if(female){ctx.moveTo(-8,-5);ctx.quadraticCurveTo(0,-9,8,-5);ctx.lineTo(19,18);ctx.quadraticCurveTo(0,23,-19,18);ctx.closePath();}
  else{ctx.moveTo(-13,-5);ctx.lineTo(13,-5);ctx.lineTo(19,18);ctx.lineTo(-19,18);ctx.closePath();}
  ctx.fill();
  ctx.fillStyle=robe;ctx.beginPath();
  if(female){ctx.moveTo(-7,-7);ctx.lineTo(7,-7);ctx.lineTo(11,9);ctx.lineTo(17,18);ctx.quadraticCurveTo(0,22,-17,18);ctx.lineTo(-11,9);ctx.closePath();}
  else{ctx.moveTo(-10,-7);ctx.lineTo(10,-7);ctx.lineTo(14,13);ctx.lineTo(-14,13);ctx.closePath();}
  ctx.fill();
  // Cổ áo chéo và đai lưng.
  ctx.strokeStyle="#f2e5c7";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-4,-7);ctx.lineTo(2,2);ctx.lineTo(7,-5);ctx.stroke();
  ctx.fillStyle=role.belt;ctx.fillRect(-10,5,20,3);
  ctx.fillStyle="#efc39b";ctx.strokeStyle=skin;ctx.lineWidth=4;ctx.lineCap="round";
  ctx.beginPath();ctx.moveTo(-10,-2);ctx.lineTo(-16,7);ctx.moveTo(10,-2);ctx.lineTo(16,7);ctx.stroke();
  ctx.fillStyle=skin;ctx.beginPath();ctx.ellipse(0,-17,female?5.5:6.2,7,0,0,Math.PI*2);ctx.fill();
  // Tóc nam búi cao; tóc nữ dài, có mái và trâm ngọc.
  ctx.fillStyle=hair;
  if(female){
    ctx.beginPath();ctx.moveTo(-7,-20);ctx.quadraticCurveTo(-10,-31,0,-31);ctx.quadraticCurveTo(10,-31,7,-19);ctx.lineTo(9,0);ctx.quadraticCurveTo(5,5,5,-12);ctx.lineTo(-5,-12);ctx.quadraticCurveTo(-5,4,-9,1);ctx.closePath();ctx.fill();
    ctx.beginPath();ctx.arc(0,-29,4,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle="#e8cf8d";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(1,-30);ctx.lineTo(10,-34);ctx.stroke();
  }else{
    ctx.beginPath();ctx.arc(0,-23,7,Math.PI,Math.PI*2);ctx.fill();ctx.fillRect(-7,-23,3,7);ctx.fillRect(4,-23,3,7);
    ctx.beginPath();ctx.ellipse(0,-31,4,5,0,0,Math.PI*2);ctx.fill();
  }
  ctx.fillStyle="#45352e";ctx.fillRect(-3,-18,1.6,1.6);ctx.fillRect(2,-18,1.6,1.6);
  if(roleName==="elder"||roleName==="master"){
    if(!female){ctx.fillStyle=hair;ctx.beginPath();ctx.moveTo(-3,-10);ctx.lineTo(3,-10);ctx.lineTo(2,2);ctx.lineTo(0,5);ctx.lineTo(-2,2);ctx.closePath();ctx.fill();}
  }
  if(roleName==="master"){ctx.fillStyle="#e8c36e";ctx.beginPath();ctx.moveTo(-8,-26);ctx.lineTo(-5,-38);ctx.lineTo(0,-31);ctx.lineTo(5,-38);ctx.lineTo(8,-26);ctx.closePath();ctx.fill();}
  if(roleName==="elder"){ctx.strokeStyle="#dfc17e";ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(21,-20);ctx.lineTo(21,23);ctx.stroke();}
  if(role.aura){ctx.globalAlpha=.35;const halo=ctx.createRadialGradient(0,-9,2,0,-9,35);halo.addColorStop(0,role.aura+"66");halo.addColorStop(1,role.aura+"00");ctx.fillStyle=halo;ctx.beginPath();ctx.ellipse(0,-8,35,28,0,0,Math.PI*2);ctx.fill();}
  ctx.restore();
}

function drawCrowd(time) {
  // Khán đài danh dự ở trung tâm: chưởng môn > trưởng lão > thân truyền.
  // Mỗi nhóm có bệ riêng, không đè lên hàng đệ tử phổ thông.

  // Dãy đệ tử thường ở xa khu vực danh dự, chia hai cánh.
  const rows = [
    { y: 760, count: 17, start: 18, step: 32, role: "servant", scale: .67 },
    { y: 760, count: 17, start: 538, step: 32, role: "outer", scale: .69 },
    { y: 730, count: 7, start: 18, step: 40, role: "inner", scale: .76 },
    { y: 730, count: 7, start: 842, step: 40, role: "core", scale: .80 },
    { y: 790, count: 17, start: 18, step: 32, role: "outer", scale: .66 }
  ];

  rows.forEach((row, ri) => {
    for (let i = 0; i < row.count; i++) {
      drawSpectator(
        row.start + i * row.step,
        row.y + (i % 2) * 3,
        row.scale,
        row.role,
        time,
        i * .63 + ri
      );
    }
  });

  // Bệ trung tâm dành riêng cho chưởng môn.
  drawAudiencePlatform(550, 688, 190);
  ctx.fillStyle = "#50352b";
  ctx.fillRect(475, 626, 150, 61);
  ctx.fillStyle = "#d9b976";
  ctx.fillRect(468, 681, 164, 8);
  ctx.fillStyle = "#8d3430";
  ctx.fillRect(495, 634, 110, 50);
  ctx.strokeStyle = "#f2d58d";
  ctx.lineWidth = 3;
  ctx.strokeRect(500, 639, 100, 42);

  // Vương miện/ngai nổi bật.
  ctx.fillStyle = "#e8cb83";
  ctx.beginPath();
  ctx.moveTo(490, 640); ctx.lineTo(500, 616);
  ctx.lineTo(525, 632); ctx.lineTo(550, 605);
  ctx.lineTo(575, 632); ctx.lineTo(600, 616);
  ctx.lineTo(610, 640); ctx.closePath(); ctx.fill();

  drawFormalSpectator(550, 658, 1.32, "master", time, 0);
  drawRoleLabel(550, 592, "CHƯỞNG MÔN", "#f2d17d", 1.35);

  // Trưởng lão ngồi hai bên, thấp hơn và nhỏ hơn chưởng môn.
  drawAudiencePlatform(255, 700, 245);
  drawAudiencePlatform(845, 700, 245);

  const elders = [
    [170, 682], [225, 682], [280, 682], [335, 682],
    [765, 682], [820, 682], [875, 682], [930, 682]
  ];
  elders.forEach((p, i) => {
    drawFormalSpectator(p[0], p[1], 1.00, "elder", time, i);
  });
  drawRoleLabel(255, 640, "ĐẠI TRƯỞNG LÃO", "#d4b5fa", 1.08);
  drawRoleLabel(845, 640, "TRƯỞNG LÃO", "#d4b5fa", 1.08);

  // Thân truyền ngồi hàng kế tiếp, nằm ngoài khoảng chiếm chỗ của hai nhóm trên.
  drawAudiencePlatform(550, 730, 390);
  const personal = [
    [390, 712], [450, 712], [510, 712],
    [590, 712], [650, 712], [710, 712]
  ];
  personal.forEach((p, i) => {
    drawFormalSpectator(p[0], p[1], .88, "disciple", time, i);
  });
  drawRoleLabel(550, 674, "CHÂN TRUYỀN ĐỆ TỬ", "#a9c9f0", .98);

  // Cờ nghi lễ ở hai rìa, không chắn nhân vật.
  drawCrowdFlag(12, 710, "#a53f36", time);
  drawCrowdFlag(1085, 710, "#b18a43", time);
}

function drawNearBankTerraces(time){
 ctx.save();
 // Bậc đá dẫn từ bờ sông xuống quảng trường, chừa vùng giữa cho đệ tử.
 for(let side=0;side<2;side++){
  const x=side?1100:0,dir=side?-1:1;
  for(let i=0;i<5;i++){
   const y=520+i*25,w=95+i*18;
   ctx.fillStyle=i%2?"#76664e":"#958064";
   ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+dir*w,y+10);ctx.lineTo(x+dir*w,y+22);ctx.lineTo(x,y+12);ctx.closePath();ctx.fill();
   ctx.strokeStyle="rgba(242,215,157,.48)";ctx.lineWidth=2;
   ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+dir*w,y+10);ctx.stroke();
  }
  // Lan can ngọc và trụ đèn ven bậc.
  ctx.strokeStyle="#c9ad70";ctx.lineWidth=3;
  ctx.beginPath();ctx.moveTo(x+dir*8,525);ctx.lineTo(x+dir*105,575);ctx.stroke();
  for(let i=0;i<4;i++){
   const px=x+dir*(14+i*27),py=528+i*12;
   ctx.fillStyle="#b99a62";ctx.fillRect(px-3,py-9,6,15);
   ctx.fillStyle="#f5d995";ctx.beginPath();ctx.arc(px,py-11,4,0,Math.PI*2);ctx.fill();
  }
  // Bồn sen, đá cảnh và bụi trúc.
  const gx=x+dir*130,gy=610;
  ctx.fillStyle="#4e6d58";ctx.beginPath();ctx.ellipse(gx,gy,52,17,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle="#8b9d76";ctx.beginPath();ctx.ellipse(gx,gy-3,43,11,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle="#d8c38b";ctx.beginPath();ctx.arc(gx+dir*8,gy-6,5,0,Math.PI*2);ctx.fill();
  for(let j=0;j<4;j++)drawPine(gx+dir*(-35+j*22),gy+15,.24+(j%2)*.05,"#315c45");
 }
 // Dải cờ nghi lễ nhỏ dọc bờ, chuyển động nhẹ.
 for(let i=0;i<6;i++){
  const x=250+i*120,y=570+(i%2)*20,wave=Math.sin(time*.0015+i)*3;
  ctx.strokeStyle="#c7a76b";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y-38);ctx.stroke();
  ctx.fillStyle=i%2?"#567c83":"#9a4b42";ctx.beginPath();ctx.moveTo(x,y-36);ctx.lineTo(x+20+wave,y-29);ctx.lineTo(x,y-20);ctx.closePath();ctx.fill();
 }
 ctx.restore();
}

function drawScenery(time){
  drawSky(time);
  drawMountainRange();
  drawMovingClouds(time);

  // Cụm tiên môn được nâng cao và phóng lớn:
  // đỉnh điện cao hơn rõ rệt so với làn đua trên cùng (TRACK.top).
  drawFloatingPlatform(150, 300, .85);
  drawFloatingPlatform(950, 290, .82);
  drawPagoda(150, 315, .94, "#554335");
  drawPagoda(950, 300, 1.00, "#584333");

  drawPalace(270, 355, .62, false);
  drawPalace(830, 350, .64, false);
  drawPalace(550, 300, 1.30, true);

  drawWaterfall(900, 285, 34, 190, time);
  drawWaterfall(105, 350, 24, 125, time);

  // Núi rừng ôm hai bên quảng trường, cây chỉ mọc trên nền đất núi.
  drawPine(18, 570, 1.25);
  drawPine(70, 585, 1.05);
  drawPine(118, 570, .92);
  drawTree(42, 610, .95);
  drawTree(130, 620, .78);

  drawPine(982, 570, 1.22);
  drawPine(1035, 590, 1.02);
  drawPine(1080, 565, .92);
  drawTree(970, 615, .82);
  drawTree(1060, 625, .9);

  // Vành cây thấp trên sườn núi phía sau, không mọc trên mặt quảng trường.
  drawPine(205, 535, .62, "#315b45");
  drawPine(890, 535, .65, "#315b45");

  drawRiver(time);
  drawBridge();
  drawCrowd(time);
}

// Pháp bảo đua: chọn ổn định theo mã người chơi, không đổi giữa các khung hình.
function artifactKind(racer) {
  if (Number.isInteger(racer.swordStyle)) return ((racer.swordStyle % 12) + 12) % 12;
  const id = String(racer.id || racer.name || "0");
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return hash % 12;
}

function drawRacingArtifact(target, kind, phase) {
  target.save();
  target.translate(0, 18);
  target.rotate(Math.sin(phase) * .025);

  const metal = "#d9d3bd";
  const edge = "#f4e6b7";
  const dark = "#66513a";
  const gem = "#70c9d2";

  // Vệt linh khí chung.
  target.globalAlpha = .42;
  target.strokeStyle = "#ffe6a0";
  target.lineWidth = 2;
  target.beginPath();
  target.ellipse(0, 7, 39, 5, 0, 0, Math.PI * 2);
  target.stroke();
  target.globalAlpha = 1;

  if (kind === 0 || kind === 1) {
    // Kiếm thẳng / cổ kiếm.
    target.fillStyle = dark;
    target.fillRect(-3, -2, 6, 23);
    target.fillStyle = "#c59d58";
    target.fillRect(-11, 1, 22, 4);
    target.fillStyle = metal;
    target.beginPath();
    target.moveTo(0, -26); target.lineTo(5, 1);
    target.lineTo(0, 18); target.lineTo(-5, 1);
    target.closePath(); target.fill();
    target.strokeStyle = edge; target.lineWidth = 1.5; target.stroke();
    target.fillStyle = gem; target.beginPath(); target.arc(0, 4, 3, 0, Math.PI * 2); target.fill();
  } else if (kind === 2 || kind === 3) {
    // Thương / trường giáo.
    target.strokeStyle = "#8c6844"; target.lineWidth = 4;
    target.beginPath(); target.moveTo(0, 24); target.lineTo(0, -23); target.stroke();
    target.fillStyle = metal;
    target.beginPath();
    target.moveTo(0, -31); target.lineTo(7, -15);
    target.lineTo(0, -18); target.lineTo(-7, -15);
    target.closePath(); target.fill();
    target.strokeStyle = edge; target.lineWidth = 1; target.stroke();
    target.fillStyle = "#b8493e"; target.fillRect(-2, -12, 4, 8);
  } else if (kind === 4) {
    // Quạt pháp bảo mở cánh.
    target.fillStyle = "#d8c38e";
    target.beginPath(); target.moveTo(0, 20);
    target.quadraticCurveTo(-4, 0, -26, -19);
    target.quadraticCurveTo(0, -31, 26, -19);
    target.quadraticCurveTo(4, 0, 0, 20); target.closePath(); target.fill();
    target.strokeStyle = "#8e6843"; target.lineWidth = 2;
    target.beginPath(); target.moveTo(0, 20); target.lineTo(-26, -19);
    target.moveTo(0, 20); target.lineTo(-13, -26);
    target.moveTo(0, 20); target.lineTo(0, -29);
    target.moveTo(0, 20); target.lineTo(13, -26);
    target.moveTo(0, 20); target.lineTo(26, -19); target.stroke();
    target.fillStyle = "#b84439"; target.beginPath(); target.arc(0, 18, 4, 0, Math.PI * 2); target.fill();
  } else if (kind === 5) {
    // Hồ lô ngọc.
    target.fillStyle = "#3c9278";
    target.beginPath(); target.ellipse(0, 8, 13, 17, 0, 0, Math.PI * 2); target.fill();
    target.beginPath(); target.ellipse(0, -8, 9, 12, 0, 0, Math.PI * 2); target.fill();
    target.fillStyle = "#d8bd78"; target.fillRect(-5, -23, 10, 5);
    target.fillStyle = "#e6d18d"; target.fillRect(-2, -29, 4, 7);
    target.strokeStyle = "#d8bd78"; target.lineWidth = 2;
    target.beginPath(); target.ellipse(0, 8, 13, 17, 0, 0, Math.PI * 2); target.stroke();
  } else if (kind === 6) {
    // Liên đài pháp bảo.
    target.fillStyle = "#d9b96f";
    for (let i = 0; i < 8; i++) {
      target.save(); target.rotate(i * Math.PI / 4);
      target.beginPath(); target.ellipse(0, -13, 5, 14, 0, 0, Math.PI * 2); target.fill();
      target.restore();
    }
    target.fillStyle = "#75c8bb"; target.beginPath(); target.arc(0, 0, 8, 0, Math.PI * 2); target.fill();
    target.fillStyle = "#f3df9e"; target.beginPath(); target.arc(0, 0, 3, 0, Math.PI * 2); target.fill();
  } else {
    // Song nguyệt luân.
    target.strokeStyle = "#c6d6d1"; target.lineWidth = 6;
    target.beginPath(); target.arc(0, 0, 18, .2, Math.PI * 1.8); target.stroke();
    target.strokeStyle = "#f5e5ad"; target.lineWidth = 2;
    target.beginPath(); target.arc(0, 0, 12, .2, Math.PI * 1.8); target.stroke();
    target.fillStyle = "#d3ad60"; target.fillRect(-3, -3, 6, 6);
  }

  target.restore();
}

function drawRacer(target,racer,x,y,scale,time){
  const female=racer.gender==="female";
  const skin=female?"#f4c9a5":"#dfae89";
  const hair=female?"#211b2b":"#29242a";
  target.save();target.translate(x,y+Math.sin(time*.009+racer.phase)*2);target.scale(scale,scale);
  const glow=target.createRadialGradient(0,0,3,0,0,47);glow.addColorStop(0,"rgba(255,225,139,.42)");glow.addColorStop(1,"rgba(255,225,139,0)");target.fillStyle=glow;target.fillRect(-50,-48,100,96);
  if(racer.effectTimer>0){const pulse=1+Math.sin(time*.025)*.12,color=racer.effectType==="boost"?"#ffe17b":racer.effectType==="slow"?"#8de8ef":"#ff9a72";target.save();target.globalAlpha=.8;target.strokeStyle=color;target.lineWidth=2.2;target.beginPath();target.ellipse(0,4,43*pulse,17*pulse,0,0,Math.PI*2);target.stroke();target.globalAlpha=.32;target.lineWidth=5;target.beginPath();target.ellipse(0,4,51*pulse,22*pulse,0,0,Math.PI*2);target.stroke();target.restore();}
  drawRacingArtifact(target,artifactKind(racer),time*.004+racer.phase,racer.swordColor||0);
  target.save();target.globalAlpha=.75;target.strokeStyle=racer.effectTimer>0?"#fff0a6":"rgba(255,235,170,.5)";target.lineWidth=1.3;target.beginPath();target.moveTo(-37,20);target.lineTo(38,18);target.stroke();target.restore();
  // Silhouette: nữ có eo thon, tay áo dài và tà váy; nam có vai rộng, thân áo gọn.
  target.fillStyle=racer.dark;target.beginPath();
  if(female){target.moveTo(-7,-7);target.lineTo(7,-7);target.lineTo(13,1);target.lineTo(19,19);target.quadraticCurveTo(0,25,-19,19);target.lineTo(-13,1);target.closePath();}
  else{target.moveTo(-11,-7);target.lineTo(11,-7);target.lineTo(16,17);target.lineTo(-16,17);target.closePath();}
  target.fill();
  target.fillStyle=racer.color;target.beginPath();
  if(female){target.moveTo(-7,-8);target.lineTo(7,-8);target.lineTo(9,5);target.lineTo(16,18);target.quadraticCurveTo(0,22,-16,18);target.lineTo(-9,5);target.closePath();}
  else{target.moveTo(-9,-8);target.lineTo(9,-8);target.lineTo(12,16);target.lineTo(-12,16);target.closePath();}
  target.fill();
  // Cổ áo giao lĩnh, đai và vạt áo.
  target.strokeStyle="#f2dfb1";target.lineWidth=2;target.beginPath();target.moveTo(-4,-8);target.lineTo(2,2);target.lineTo(7,-6);target.stroke();
  target.fillStyle="#e8cb83";target.fillRect(-9,5,18,2.5);
  target.fillStyle=skin;target.beginPath();target.ellipse(0,-20,female?6:6.5,8,0,0,Math.PI*2);target.fill();
  target.fillStyle=hair;
  if(female){
    target.beginPath();target.arc(0,-25,7,Math.PI,Math.PI*2);target.fill();
    target.fillRect(-7,-25,3,19);target.fillRect(5,-25,3,19);
    target.beginPath();target.arc(3,-32,4,0,Math.PI*2);target.fill();
    target.strokeStyle="#f0d18c";target.lineWidth=1.8;target.beginPath();target.moveTo(3,-32);target.lineTo(12,-37);target.stroke();
  }else{
    target.fillRect(-7,-27,14,5);target.fillRect(-5,-32,10,6);
    target.beginPath();target.ellipse(0,-36,4,5,0,0,Math.PI*2);target.fill();
  }
  target.fillStyle="#382d2a";target.beginPath();target.arc(-2,-20,1,0,Math.PI*2);target.arc(3,-20,1,0,Math.PI*2);target.fill();
  // Tay áo và bàn tay; tay nữ mềm, ống tay rộng.
  target.strokeStyle=skin;target.lineWidth=female?5:6;target.lineCap="round";target.beginPath();
  target.moveTo(-8,-5);target.lineTo(-17,7);target.moveTo(8,-5);target.lineTo(17,7);target.stroke();
  target.fillStyle=racer.color;target.beginPath();target.moveTo(-12,-7);target.lineTo(-19,5);target.lineTo(-13,9);target.lineTo(-7,0);target.closePath();target.fill();
  target.beginPath();target.moveTo(12,-7);target.lineTo(19,5);target.lineTo(13,9);target.lineTo(7,0);target.closePath();target.fill();
  if(female){target.fillStyle=racer.color;target.beginPath();target.moveTo(-5,13);target.lineTo(0,19);target.lineTo(5,13);target.strokeStyle="#f5d995";target.lineWidth=1;target.stroke();}
  target.save();target.globalAlpha=.78;target.fillStyle=racer.color;target.beginPath();const tail=racer.effectType==="boost"?-25:racer.effectType==="slow"?-10:-17;target.moveTo(-7,-4);target.quadraticCurveTo(tail-10,-1,tail,-13);target.lineTo(-4,-8);target.closePath();target.fill();target.restore();
  if(racer.effectTimer>0&&racer.effectName&&target!==cameraCtx){target.save();target.font="bold 7px Arial,sans-serif";target.textAlign="center";target.textBaseline="middle";target.lineJoin="round";target.lineWidth=2.2;target.strokeStyle="rgba(14,25,24,.98)";target.strokeText(racer.effectName,0,-65,126);target.fillStyle="#fff1bd";target.fillText(racer.effectName,0,-65,126);target.restore();}
  target.restore();
}


// =====================================================
// REVISION 2 — hướng pháp bảo, quảng trường và khán đài
// Hướng đua trong game: trái -> phải.
// =====================================================

function drawRiver(time) {
  // Quảng trường chỉ chiếm phần trung tâm, chừa hai sườn núi và hàng cây hai bên.
  const left=225, right=875, top=405;
  const floor=ctx.createLinearGradient(0,top,0,H);
  floor.addColorStop(0,"#d9c79d");floor.addColorStop(.28,"#c7b184");
  floor.addColorStop(.72,"#927c5b");floor.addColorStop(1,"#5d503d");
  ctx.fillStyle=floor;ctx.beginPath();
  ctx.moveTo(left,top+8);ctx.quadraticCurveTo(550,top-18,right,top+8);
  ctx.lineTo(930,H);ctx.lineTo(170,H);ctx.closePath();ctx.fill();
  ctx.save();ctx.beginPath();ctx.moveTo(left,top+8);
  ctx.quadraticCurveTo(550,top-18,right,top+8);
  ctx.lineTo(930,H);ctx.lineTo(170,H);ctx.closePath();ctx.clip();
  for(let y=430;y<H+20;y+=32){
    ctx.strokeStyle="rgba(255,239,199,.28)";ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(185-(y-top)*.16,y);ctx.lineTo(915+(y-top)*.16,y);ctx.stroke();
  }
  for(let x=210;x<=890;x+=78){
    ctx.strokeStyle="rgba(75,59,39,.16)";ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(550+(x-550)*.12,top);ctx.lineTo(x,H);ctx.stroke();
  }
  ctx.strokeStyle="rgba(255,225,164,.2)";ctx.lineWidth=2;
  for(let i=0;i<5;i++){ctx.beginPath();ctx.ellipse(550,690,85+i*36,20+i*8,0,0,Math.PI*2);ctx.stroke();}
  ctx.restore();
  ctx.strokeStyle="#ead39c";ctx.lineWidth=3;ctx.beginPath();
  ctx.moveTo(left,top+7);ctx.quadraticCurveTo(550,top-20,right,top+7);ctx.stroke();
}
function drawCrowd(time) {
  // Đệ tử phổ thông được đẩy ra xa hai cánh và hàng dưới.
  const rows=[
    {y:785,n:18,x:12,step:31,r:"servant",s:.62},
    {y:785,n:18,x:550,step:31,r:"outer",s:.62},
    {y:752,n:8,x:12,step:39,r:"outer",s:.68},
    {y:752,n:8,x:790,step:39,r:"inner",s:.70},
    {y:716,n:6,x:10,step:43,r:"inner",s:.72},
    {y:716,n:6,x:832,step:43,r:"core",s:.74}
  ];
  rows.forEach((r,k)=>{for(let i=0;i<r.n;i++)drawSpectator(r.x+i*r.step,r.y+(i%2)*2,r.s,r.r,time,i*.61+k);});

  // Ba cấp ghế danh dự gần nhau, không đè vào đệ tử thường.
  drawAudiencePlatform(550,646,164);
  ctx.fillStyle="#50352b";ctx.fillRect(490,590,120,53);
  ctx.fillStyle="#d9b976";ctx.fillRect(480,640,140,8);
  ctx.fillStyle="#8d3430";ctx.fillRect(503,598,94,42);
  ctx.strokeStyle="#f2d58d";ctx.lineWidth=3;ctx.strokeRect(507,602,86,34);
  ctx.fillStyle="#e8cb83";ctx.beginPath();
  ctx.moveTo(495,603);ctx.lineTo(504,580);ctx.lineTo(528,594);
  ctx.lineTo(550,568);ctx.lineTo(572,594);ctx.lineTo(596,580);
  ctx.lineTo(605,603);ctx.closePath();ctx.fill();
  drawFormalSpectator(550,623,1.18,"master",time,0);
  drawRoleLabel(550,557,"CHƯỞNG MÔN","#f2d17d",1.28);

  drawAudiencePlatform(360,665,150);drawAudiencePlatform(740,665,150);
  [[315,650],[365,650],[415,650],[685,650],[735,650],[785,650]].forEach((p,i)=>drawFormalSpectator(p[0],p[1],.88,"elder",time,i));
  drawRoleLabel(360,616,"TRƯỞNG LÃO","#d4b5fa",.96);
  drawRoleLabel(740,616,"TRƯỞNG LÃO","#d4b5fa",.96);

  drawAudiencePlatform(550,690,210);
  [[455,676],[505,676],[555,676],[605,676],[655,676]].forEach((p,i)=>drawFormalSpectator(p[0],p[1],.76,"disciple",time,i));
  drawRoleLabel(555,646,"THÂN TRUYỀN","#a9c9f0",.88);
  drawCrowdFlag(12,700,"#a53f36",time);drawCrowdFlag(1085,700,"#b18a43",time);
}

function drawPalaceWithSign(x,y,scale,grand=false) {
  // Chỉ dùng một bảng hiệu gốc do scenery.js vẽ; không chồng thêm bảng thứ hai.
  drawPalace(x,y,scale,grand);
}

function drawScenery(time) {
  drawSky(time);drawMountainRange();drawMovingClouds(time);
  drawRiver(time);
  // Nâng toàn bộ tiên môn, đỉnh mái và bảng hiệu vượt rõ đường đua trên cùng.
  drawFloatingPlatform(150,220,.92);drawFloatingPlatform(950,210,.90);
  drawPagoda(150,235,1.02,"#554335");drawPagoda(950,220,1.06,"#584333");
  drawPalaceWithSign(270,270,.52,false);drawPalaceWithSign(830,265,.52,false);
  drawPalaceWithSign(550,220,1.08,true);
  drawWaterfall(900,255,34,145,time);drawWaterfall(105,300,24,105,time);
  // Cây nằm trên sườn núi hai bên, không mọc trên sân lát đá.
  drawPine(18,470,1.16);drawPine(65,480,.98);drawPine(112,470,.86);
  drawTree(42,505,.82);drawTree(125,515,.72);
  drawPine(982,470,1.16);drawPine(1035,480,.98);drawPine(1080,470,.86);
  drawTree(970,505,.82);drawTree(1060,515,.72);
  // Cố ý không gọi drawBridge() để bỏ hàng cột chắn ngang.
  drawCrowd(time);
}

function drawRacingArtifact(target,kind,phase,colorIndex=0){
  const palettes=[
    ["#e7ffff","#41c8c2","#117f86"],["#e8f3ff","#78b8ff","#285caa"],
    ["#f4eaff","#c49aff","#7042b0"],["#fff0f5","#ff91bd","#b53f76"],
    ["#fff7d9","#f2cb65","#a87525"],["#fff0e8","#ff8b70","#a83d36"],
    ["#edfff1","#8ee0a8","#277d54"],["#f1fbff","#b8eaff","#648ca8"],
    ["#fff2e2","#ffad61","#a85c27"],["#f4f2ff","#b5b9d8","#555b87"]
  ];
  const colors=palettes[((colorIndex%palettes.length)+palettes.length)%palettes.length];
  const bright=colors[0],glowColor=colors[1],deep=colors[2];
  const blade=target.createLinearGradient(0,-9,0,9);
  blade.addColorStop(0,deep);blade.addColorStop(.2,bright);
  blade.addColorStop(.48,glowColor);blade.addColorStop(.72,bright);blade.addColorStop(1,deep);
  target.save();target.translate(0,19);target.rotate(Math.sin(phase)*.012);
  target.globalAlpha=.2;target.strokeStyle=glowColor;target.lineWidth=2.2;
  target.beginPath();target.ellipse(1,9,45,5,0,0,Math.PI*2);target.stroke();target.globalAlpha=1;
  target.fillStyle="#49372a";target.fillRect(-40,-2.8,23,5.6);
  target.strokeStyle=bright;target.lineWidth=1;
  for(let i=0;i<5;i++){target.beginPath();target.moveTo(-38+i*4,-2.5);target.lineTo(-35+i*4,2.5);target.stroke();}
  target.fillStyle="#8e693c";target.fillRect(-20,-7,4,14);
  target.fillStyle="#e8c77b";target.fillRect(-22,-5,8,2);target.fillRect(-22,3,8,2);
  target.fillStyle="#4a342b";target.fillRect(-44,-3.5,5,7);
  target.fillStyle=glowColor;target.beginPath();target.arc(-43,0,3.2,0,Math.PI*2);target.fill();
  target.fillStyle=blade;target.beginPath();
  switch(((kind%12)+12)%12){
    case 0: target.moveTo(-16,-4.5);target.lineTo(29,-4.5);target.lineTo(47,0);target.lineTo(29,4.5);target.lineTo(-16,4.5);break;
    case 1: target.moveTo(-16,-3.5);target.quadraticCurveTo(16,-9,35,-3);target.lineTo(48,0);target.quadraticCurveTo(17,9,-16,3.5);break;
    case 2: target.moveTo(-16,-7);target.lineTo(23,-7);target.lineTo(47,0);target.lineTo(23,7);target.lineTo(-16,7);break;
    case 3: target.moveTo(-16,-2.3);target.lineTo(34,-2.3);target.lineTo(49,0);target.lineTo(34,2.3);target.lineTo(-16,2.3);break;
    case 4: target.moveTo(-16,-4);target.quadraticCurveTo(15,-9,38,-5);target.lineTo(48,-1);target.quadraticCurveTo(27,2,36,5);target.quadraticCurveTo(8,7,-16,4);break;
    case 5: target.moveTo(-16,-5);target.lineTo(-7,-7);target.lineTo(25,-5);target.lineTo(47,0);target.lineTo(25,5);target.lineTo(-7,7);target.lineTo(-16,5);break;
    case 6: target.moveTo(-16,-3);target.quadraticCurveTo(4,-8,26,-4);target.lineTo(47,0);target.quadraticCurveTo(5,8,-16,3);break;
    case 7: target.moveTo(-16,-2.5);target.lineTo(39,-1.8);target.lineTo(51,0);target.lineTo(39,1.8);target.lineTo(-16,2.5);break;
    case 8: target.moveTo(-16,-6);target.lineTo(15,-8);target.lineTo(38,-5);target.lineTo(48,0);target.lineTo(38,5);target.lineTo(15,8);target.lineTo(-16,6);break;
    case 9: target.moveTo(-16,-4);target.lineTo(20,-4);target.lineTo(34,-2);target.lineTo(49,0);target.lineTo(34,2);target.lineTo(20,4);target.lineTo(-16,4);break;
    case 10: target.moveTo(-16,-4);target.lineTo(27,-4);target.quadraticCurveTo(37,-4,42,-1);target.lineTo(49,0);target.lineTo(42,1);target.quadraticCurveTo(37,4,27,4);target.lineTo(-16,4);break;
    default: target.moveTo(-16,-5);target.lineTo(27,-5);target.lineTo(35,-2);target.lineTo(48,0);target.lineTo(35,2);target.lineTo(27,5);target.lineTo(-16,5);
  }
  target.closePath();target.fill();target.strokeStyle=deep;target.lineWidth=1;target.stroke();
  target.strokeStyle="rgba(255,255,255,.92)";target.lineWidth=.9;
  target.beginPath();target.moveTo(-11,-1.1);target.lineTo(35,-.6);target.stroke();
  target.strokeStyle=bright;target.lineWidth=.65;
  target.beginPath();target.moveTo(-10,-3);target.lineTo(25,-3);target.stroke();
  target.fillStyle="#fff4ce";
  for(let i=0;i<3;i++){const x=-2+i*10;target.beginPath();target.moveTo(x,-1.7);target.lineTo(x+1.7,0);target.lineTo(x,1.7);target.lineTo(x-1.7,0);target.closePath();target.fill();}
  target.restore();
}
function drawRacer(target,racer,x,y,scale,time) {
  target.save();target.translate(x,y+Math.sin(time*.009+racer.phase)*2);target.scale(scale,scale);
  const glow=target.createRadialGradient(0,0,3,0,0,43);
  glow.addColorStop(0,"rgba(255,225,139,.35)");glow.addColorStop(1,"rgba(255,225,139,0)");
  target.fillStyle=glow;target.fillRect(-48,-45,96,90);
  drawRacingArtifact(target,artifactKind(racer),time*.004+racer.phase,racer.swordColor||0);
 // Linh kiếm bừng sáng theo tốc độ và loại dị tượng.
 target.save();target.globalAlpha=racer.effectTimer>0?.9:.48;
 target.shadowColor=racer.effectType==="slow"?"#8de8ef":"#ffe7a0";target.shadowBlur=racer.effectTimer>0?12:5;
 target.strokeStyle=racer.effectType==="slow"?"#a8f5f4":"#fff0b5";target.lineWidth=1.8;
 target.beginPath();target.moveTo(-34,18);target.lineTo(40,17);target.stroke();
 for(let i=0;i<3;i++){const px=-5+i*18,py=16+Math.sin(time*.02+i)*2;target.fillStyle="#fff4c2";target.beginPath();target.arc(px,py,1.5,0,Math.PI*2);target.fill();}
 target.restore();
  target.fillStyle=racer.dark;target.fillRect(-10,-5,20,22);
  target.fillStyle=racer.color;target.fillRect(-9,-7,18,21);
  target.fillRect(-14,-2,5,14);target.fillRect(9,-2,5,14);
  target.fillStyle="#f0c49b";target.fillRect(-7,-22,14,14);
  target.fillStyle="#29252a";target.fillRect(-8,-25,16,5);target.fillRect(-7,-28,13,4);
  target.fillRect(-9,-21,3,8);target.fillRect(6,-21,3,8);target.fillRect(4,-31,3,7);
  target.fillStyle="#392a26";target.fillRect(-4,-17,2,2);target.fillRect(3,-17,2,2);
  target.fillStyle="#e8cb83";target.fillRect(-8,5,16,2);
  target.restore();
}


// =====================================================
// REVISION 3 — thác nghiêng, HUD cân giữa và tinh chỉnh cảnh
// =====================================================
function drawWaterfall(x,y,width,height,time) {
  ctx.save();
  const dx=width*.42;
  ctx.fillStyle="#476c5a";ctx.beginPath();
  ctx.moveTo(x-18,y-4);ctx.lineTo(x+width+12,y+2);
  ctx.lineTo(x+width+dx+22,y+height);ctx.lineTo(x+dx-22,y+height-2);
  ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+width,y+2);
  ctx.lineTo(x+width+dx,y+height);ctx.lineTo(x+dx,y+height);ctx.closePath();ctx.clip();
  const water=ctx.createLinearGradient(x,y,x+dx,y+height);
  water.addColorStop(0,"#e4f3df");water.addColorStop(.34,"#a9d9d2");
  water.addColorStop(.72,"#68b4b0");water.addColorStop(1,"#438f8c");
  ctx.fillStyle=water;ctx.fillRect(x-8,y-4,width+dx+16,height+10);
  const drift=(time*.006)%34;
  for(let i=-2;i<Math.ceil(height/25)+3;i++){
    const yy=y+i*25+drift,xx=x+(yy-y)*.42;
    ctx.strokeStyle="rgba(255,255,230,.48)";ctx.lineWidth=1.7;
    ctx.beginPath();ctx.moveTo(xx+4,yy);ctx.lineTo(xx+width*.55,yy+7);ctx.stroke();
  }
  ctx.restore();
  ctx.fillStyle="rgba(226,246,231,.42)";
  ctx.beginPath();ctx.ellipse(x+dx+width*.52,y+height,width*1.65,8,.04,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle="rgba(231,249,235,.65)";ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(x+dx+width*.15,y+height-3);
  ctx.quadraticCurveTo(x+dx+width*.55,y+height+5,x+dx+width,y+height-2);ctx.stroke();
}
function drawRaceHud() {
  const remaining=Math.max(0,duration-elapsed),completed=racers.filter(r=>r.finished).length;
  const gap=14,leftWidth=220,rightWidth=190,total=220+14+190;
  const left=(W-total)/2,y=14,h=52;
  function centeredBox(x,w,label,value) {
    ctx.save();ctx.fillStyle="rgba(20,48,39,.9)";ctx.fillRect(x,y,w,h);
    ctx.strokeStyle="rgba(224,194,126,.85)";ctx.lineWidth=1;ctx.strokeRect(x+.5,y+.5,w-1,h-1);
    ctx.textAlign="center";ctx.textBaseline="middle";
    ctx.fillStyle="#e0c991";ctx.font="bold 10px Georgia";ctx.fillText(label,x+w/2,y+13,w-12);
    ctx.fillStyle="#fff0c7";ctx.font="bold 21px Georgia";ctx.fillText(value,x+w/2,y+37,w-12);
    ctx.restore();
  }
  centeredBox(left,leftWidth,"THỜI GIAN CÒN LẠI",timeText(remaining));
  centeredBox(left+leftWidth+gap,rightWidth,"HOÀN THÀNH",`${completed} / ${racers.length}`);
}


// =====================================================
// REVISION 4 — quảng trường toàn bề ngang, tiên sơn và kiến trúc
// =====================================================
function drawRiver(time) {
  const edgeY=530;
  const floor=ctx.createLinearGradient(0,475,0,H);
  floor.addColorStop(0,"#d9c99f");floor.addColorStop(.22,"#c7b58d");
  floor.addColorStop(.62,"#a18b66");floor.addColorStop(1,"#66543d");
  ctx.fillStyle=floor;ctx.beginPath();ctx.moveTo(0,edgeY);
  ctx.quadraticCurveTo(W*.5,460,W,edgeY);ctx.lineTo(W,H);ctx.lineTo(0,H);
  ctx.closePath();ctx.fill();
  ctx.save();ctx.beginPath();ctx.moveTo(0,edgeY);
  ctx.quadraticCurveTo(W*.5,460,W,edgeY);ctx.lineTo(W,H);ctx.lineTo(0,H);
  ctx.closePath();ctx.clip();
  for(let y=485;y<H+28;y+=31){
    const spread=(y-460)*.48;ctx.strokeStyle="rgba(255,241,205,.30)";
    ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(-spread,y);
    ctx.lineTo(W+spread,y);ctx.stroke();
  }
  for(let x=-440;x<=W+440;x+=88){
    ctx.strokeStyle="rgba(75,59,39,.15)";ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(W*.5+(x-W*.5)*.12,465);ctx.lineTo(x,H);ctx.stroke();
  }
  ctx.strokeStyle="rgba(255,224,164,.20)";ctx.lineWidth=2;
  for(let i=0;i<5;i++){
    ctx.beginPath();ctx.ellipse(W*.5,690,92+i*37,17+i*8,0,0,Math.PI*2);ctx.stroke();
  }
  ctx.restore();
  ctx.strokeStyle="#e8d29d";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(0,edgeY+1);
  ctx.quadraticCurveTo(W*.5,461,W,edgeY+1);ctx.stroke();
  ctx.strokeStyle="rgba(91,70,43,.55)";ctx.lineWidth=2;ctx.beginPath();
  ctx.moveTo(0,edgeY+9);ctx.quadraticCurveTo(W*.5,470,W,edgeY+9);ctx.stroke();
  ctx.fillStyle="rgba(255,231,180,.32)";ctx.beginPath();
  ctx.moveTo(W*.5-30,505);ctx.lineTo(W*.5,489);ctx.lineTo(W*.5+30,505);
  ctx.lineTo(W*.5,521);ctx.closePath();ctx.fill();
}

function drawMountainRange() {
  function ridge(points,topColor,bottomColor){
    const g=ctx.createLinearGradient(0,80,0,470);g.addColorStop(0,topColor);g.addColorStop(1,bottomColor);
    ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(0,H);
    points.forEach(p=>ctx.lineTo(p[0],p[1]));ctx.lineTo(W,H);ctx.closePath();ctx.fill();
  }
  ridge([[0,330],[65,250],[120,280],[205,145],[265,220],[345,165],[425,265],[510,175],[590,245],[675,125],[735,205],[815,150],[900,255],[985,165],[1050,245],[1100,205]],"#b8c9b5","#829d89");
  ridge([[0,405],[75,315],[145,355],[235,235],[305,325],[390,245],[475,365],[565,255],[650,350],[745,225],[820,325],[915,235],[1000,350],[1060,285],[1100,320]],"#78957c","#4d765f");
  ridge([[0,485],[75,390],[150,430],[245,320],[330,420],[420,330],[515,450],[610,330],[700,425],[790,315],[875,430],[970,330],[1045,420],[1100,375]],"#426b55","#294d40");
  const cliffs=[[[205,145],[228,205],[265,220],[242,190]],[[675,125],[700,190],[735,205],[710,166]],[[985,165],[1008,225],[1050,245],[1020,207]],[[420,330],[445,382],[475,365],[454,350]],[[790,315],[820,370],[875,430],[840,365]]];
  cliffs.forEach((p,i)=>{
    ctx.fillStyle=i<3?"rgba(238,235,207,.62)":"rgba(207,220,190,.24)";
    ctx.beginPath();p.forEach((v,j)=>j?ctx.lineTo(v[0],v[1]):ctx.moveTo(v[0],v[1]));ctx.closePath();ctx.fill();
  });
  const mist=ctx.createLinearGradient(0,330,0,510);
  mist.addColorStop(0,"rgba(222,238,218,0)");mist.addColorStop(.55,"rgba(221,238,215,.20)");
  mist.addColorStop(1,"rgba(221,238,215,0)");ctx.fillStyle=mist;ctx.fillRect(0,320,W,200);
}

function drawSpiritBirds(time){
 const flocks=[
  {dir:1,y:66,s:.55,speed:.000018,phase:.1,count:2},
  {dir:-1,y:118,s:.43,speed:.000014,phase:.55,count:2}
 ];
 flocks.forEach((f,k)=>{
  for(let j=0;j<f.count;j++){
   const p=(time*f.speed+f.phase+j*.48)%1;
   const x=f.dir>0?-75+p*(W+150):W+75-p*(W+150);
   const y=f.y+Math.sin(time*.00055+j*1.7+k)*5;
   const flap=Math.sin(time*.002+j*1.8+k)*.7;
   ctx.save();ctx.translate(x,y);ctx.scale(f.dir*f.s,f.s);
   ctx.fillStyle="#fffdf0";ctx.beginPath();ctx.ellipse(0,0,18,5,-.05,0,Math.PI*2);ctx.fill();
   ctx.strokeStyle="#fffdf0";ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();
   ctx.moveTo(12,-1);ctx.quadraticCurveTo(23,-12,21,-23);ctx.stroke();
   ctx.fillStyle="#fffdf0";ctx.beginPath();ctx.arc(20,-24,3.5,0,Math.PI*2);ctx.fill();
   ctx.fillStyle="#c94d3e";ctx.beginPath();ctx.moveTo(23,-24);ctx.lineTo(32,-22);ctx.lineTo(23,-20);ctx.closePath();ctx.fill();
   ctx.fillStyle="#fffdf5";ctx.beginPath();ctx.moveTo(-5,0);ctx.quadraticCurveTo(-22,-21-flap*5,-53,-20-flap*6);ctx.quadraticCurveTo(-36,6,-5,6);ctx.closePath();ctx.fill();
   ctx.beginPath();ctx.moveTo(-5,3);ctx.quadraticCurveTo(-22,13+flap*3,-42,20+flap*4);ctx.quadraticCurveTo(-25,11,-5,6);ctx.closePath();ctx.fill();
   ctx.strokeStyle="#b94c40";ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(-3,4);ctx.lineTo(-7,16);ctx.moveTo(5,4);ctx.lineTo(7,16);ctx.stroke();
   ctx.restore();
  }
 });
}

// Một mái chính liền khối, không còn các tầng mái lồng và khe hở.
function drawPalace(x,y,scale,grand=false) {
  ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);
  const bw=grand?238:174,roofHalf=bw*.72;
  const aura=ctx.createRadialGradient(0,-76,8,0,-76,grand?235:165);
  aura.addColorStop(0,"rgba(255,225,157,.28)");aura.addColorStop(1,"rgba(255,225,157,0)");
  ctx.fillStyle=aura;ctx.fillRect(-bw*1.5,-245,bw*3,300);
  ctx.fillStyle="#5c594b";ctx.beginPath();ctx.moveTo(-bw*.78,38);ctx.lineTo(bw*.78,38);
  ctx.lineTo(bw*.92,55);ctx.lineTo(-bw*.92,55);ctx.closePath();ctx.fill();
  ctx.fillStyle="#c6ad79";ctx.fillRect(-bw*.88,34,bw*1.76,7);
  ctx.fillStyle="#e2cc98";ctx.fillRect(-bw*.96,48,bw*1.92,7);

  ctx.fillStyle="#d8c397";ctx.fillRect(-bw/2,-72,bw,108);
  ctx.fillStyle="#73513b";ctx.fillRect(-bw/2+10,-62,bw-20,96);
  ctx.fillStyle="#a74437";ctx.fillRect(-bw/2+13,-56,bw-26,8);
  const door=grand?48:36;
  ctx.fillStyle="#342a25";ctx.fillRect(-door/2,-40,door,74);
  ctx.fillStyle="#b98b4d";ctx.fillRect(-door/2+4,-36,door-8,70);
  ctx.fillStyle="#342a25";ctx.fillRect(-door/2+8,-31,door-16,65);
  ctx.strokeStyle="#e5c77e";ctx.lineWidth=2;ctx.strokeRect(-door/2+8,-31,door-16,65);
  ctx.beginPath();ctx.moveTo(0,-31);ctx.lineTo(0,34);ctx.stroke();

  [-.42,-.25,.25,.42].forEach(k=>{
    const px=bw*k;ctx.fillStyle="#a94336";ctx.fillRect(px-5,-68,10,105);
    ctx.fillStyle="#e6c77f";ctx.fillRect(px-7,-66,14,4);ctx.fillRect(px-7,31,14,5);
    ctx.fillStyle="rgba(255,225,165,.32)";ctx.fillRect(px-2,-60,2,86);
  });
  [-.34,.34].forEach(k=>{
    const px=bw*k;ctx.fillStyle="#d9b873";ctx.fillRect(px-13,-42,26,39);
    ctx.fillStyle="#29463e";ctx.fillRect(px-9,-38,18,31);
    ctx.strokeStyle="#e6c77d";ctx.lineWidth=2;ctx.beginPath();
    ctx.moveTo(px,-38);ctx.lineTo(px,-7);ctx.moveTo(px-9,-23);ctx.lineTo(px+9,-23);ctx.stroke();
  });

  // Mái kín, một khối ngói cong; diềm vàng chỉ viền mặt trước.
  ctx.fillStyle="#302f2d";ctx.beginPath();ctx.moveTo(-roofHalf-18,-78);
  ctx.quadraticCurveTo(-roofHalf*.82,-85,0,-143);
  ctx.quadraticCurveTo(roofHalf*.82,-85,roofHalf+18,-78);
  ctx.lineTo(roofHalf+5,-65);ctx.quadraticCurveTo(0,-121,-roofHalf-5,-65);
  ctx.closePath();ctx.fill();
  const rg=ctx.createLinearGradient(0,-140,0,-64);
  rg.addColorStop(0,"#bd9855");rg.addColorStop(.48,"#80603d");rg.addColorStop(1,"#493b31");
  ctx.fillStyle=rg;ctx.beginPath();ctx.moveTo(-roofHalf-10,-80);
  ctx.quadraticCurveTo(-roofHalf*.72,-87,0,-137);
  ctx.quadraticCurveTo(roofHalf*.72,-87,roofHalf+10,-80);
  ctx.lineTo(roofHalf-1,-70);ctx.quadraticCurveTo(0,-119,-roofHalf+1,-70);
  ctx.closePath();ctx.fill();
  ctx.strokeStyle="#e8cc83";ctx.lineWidth=4;ctx.beginPath();
  ctx.moveTo(-roofHalf-13,-78);ctx.quadraticCurveTo(0,-147,roofHalf+13,-78);ctx.stroke();
  ctx.strokeStyle="rgba(255,229,170,.38)";ctx.lineWidth=1;
  for(let i=-5;i<=5;i++){
    const px=i*roofHalf*.14;ctx.beginPath();ctx.moveTo(px,-132+Math.abs(i)*3);
    ctx.lineTo(px*1.55,-75);ctx.stroke();
  }
  ctx.strokeStyle="#e6c47b";ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();
  ctx.moveTo(-roofHalf-12,-78);ctx.quadraticCurveTo(-roofHalf-31,-84,-roofHalf-28,-101);
  ctx.moveTo(roofHalf+12,-78);ctx.quadraticCurveTo(roofHalf+31,-84,roofHalf+28,-101);ctx.stroke();
  ctx.fillStyle="#f2d994";ctx.beginPath();ctx.arc(0,-140,5,0,Math.PI*2);ctx.fill();

  // Một bảng hiệu duy nhất, đủ chiều cao cho dấu tiếng Việt.
  const pw=grand?154:112,py=-111;
  ctx.fillStyle="#33251d";ctx.fillRect(-pw/2-5,py-5,pw+10,31);
  ctx.fillStyle="#d9b66e";ctx.fillRect(-pw/2-2,py-2,pw+4,25);
  ctx.fillStyle="#77332b";ctx.fillRect(-pw/2+2,py+2,pw-4,17);
  ctx.strokeStyle="#fff0bd";ctx.lineWidth=1.5;ctx.strokeRect(-pw/2+4,py+3,pw-8,15);
  ctx.fillStyle="#fff1c8";ctx.font="bold "+(grand?15:13)+"px serif";
  ctx.textAlign="center";ctx.textBaseline="middle";ctx.shadowColor="#ffe3a0";ctx.shadowBlur=4;
  ctx.fillText(grand?"VẠN KIẾM ĐIỆN":"TIÊN ĐIỆN",0,py+10,pw-13);ctx.shadowBlur=0;
  [-bw*.77,bw*.77].forEach(px=>{
    ctx.fillStyle="#d8bb78";ctx.fillRect(px,-157,2,75);ctx.fillStyle="#a64035";
    ctx.beginPath();ctx.moveTo(px+2,-154);ctx.lineTo(px+29,-145);ctx.lineTo(px+2,-135);ctx.closePath();ctx.fill();
  });
  ctx.restore();
}

function drawScenery(time) {
  drawSky(time);drawMountainRange();drawMovingClouds(time);drawSpiritBirds(time);
  drawWaterfall(890,250,30,205,time);drawWaterfall(112,315,22,145,time);

  // Tiên Điện nằm trên các sườn núi cao.
  drawFloatingPlatform(790,397,.92);drawFloatingPlatform(970,435,.62);
  drawPalace(790,354,.78,false);drawPalace(970,405,.54,false);

  // Vạn Kiếm Điện ở ranh giới rừng và quảng trường.
  drawFloatingPlatform(178,482,.92);drawPalace(178,440,.76,true);

  // Cây ở bìa rừng; nền quảng trường sẽ che phần gốc phía dưới đường biên.
  drawPine(24,535,1.05,"#294f3d");drawPine(78,532,.96,"#315b45");
  drawTree(132,531,.82,"#426b4c");drawPine(250,508,.74,"#315b45");
  drawTree(315,500,.66,"#426b4c");drawTree(850,500,.66,"#426b4c");
  drawPine(920,508,.74,"#315b45");drawPine(1020,532,.96,"#315b45");
  drawPine(1075,535,1.05,"#294f3d");

  drawRiver(time);
  drawCrowd(time);
}

// HUD ở hai góc trên, nền xanh ôm vừa nhãn và số liệu.
function drawRaceHud() {
  const remaining=Math.max(0,duration-elapsed);
  const completed=racers.filter(r=>r.finished).length;
  const items=[
    {x:12,label:"THỜI GIAN",value:timeText(remaining),align:"left"},
    {x:W-12,label:"HOÀN THÀNH",value:String(completed)+" / "+String(racers.length),align:"right"}
  ];
  items.forEach(item=>{
    ctx.save();ctx.font="bold 10px Georgia";
    const labelW=ctx.measureText(item.label).width;
    ctx.font="bold 20px Georgia";const valueW=ctx.measureText(item.value).width;
    const boxW=Math.ceil(Math.max(labelW,valueW)+22),boxH=49;
    const x=item.align==="left"?item.x:item.x-boxW,y=12;
    ctx.fillStyle="rgba(20,48,39,.92)";ctx.fillRect(x,y,boxW,boxH);
    ctx.strokeStyle="rgba(224,194,126,.88)";ctx.lineWidth=1;
    ctx.strokeRect(x+.5,y+.5,boxW-1,boxH-1);
    ctx.textAlign="center";ctx.textBaseline="middle";
    ctx.fillStyle="#e0c991";ctx.font="bold 10px Georgia";
    ctx.fillText(item.label,x+boxW/2,y+12,boxW-8);
    ctx.fillStyle="#fff0c7";ctx.font="bold 20px Georgia";
    ctx.fillText(item.value,x+boxW/2,y+34,boxW-8);ctx.restore();
  });
}


// =====================================================
// REVISION 5 — quảng trường gọn, tiên sơn, hồ suối và khán đài
// =====================================================

function drawRiver(time) {
  const edgeY=610;
  const g=ctx.createLinearGradient(0,edgeY,0,H);
  g.addColorStop(0,"#d9c99f");g.addColorStop(.25,"#c6b38a");
  g.addColorStop(.68,"#947d59");g.addColorStop(1,"#62503a");
  ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(0,edgeY);
  ctx.quadraticCurveTo(W*.5,590,W,edgeY);ctx.lineTo(W,H);ctx.lineTo(0,H);
  ctx.closePath();ctx.fill();

  ctx.save();ctx.beginPath();ctx.moveTo(0,edgeY);
  ctx.quadraticCurveTo(W*.5,590,W,edgeY);ctx.lineTo(W,H);ctx.lineTo(0,H);
  ctx.closePath();ctx.clip();
  for(let y=625;y<H+20;y+=35){
    const spread=(y-600)*.42;
    ctx.strokeStyle="rgba(255,239,199,.28)";ctx.lineWidth=1.6;
    ctx.beginPath();ctx.moveTo(-spread,y);ctx.lineTo(W+spread,y);ctx.stroke();
  }
  for(let x=-380;x<W+400;x+=90){
    ctx.strokeStyle="rgba(75,58,37,.17)";ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(W*.5+(x-W*.5)*.13,595);ctx.lineTo(x,H);ctx.stroke();
  }
  ctx.strokeStyle="rgba(255,226,167,.19)";ctx.lineWidth=2;
  for(let i=0;i<4;i++){
    ctx.beginPath();ctx.ellipse(W*.5,715,70+i*34,14+i*6,0,0,Math.PI*2);ctx.stroke();
  }
  ctx.restore();
  ctx.strokeStyle="#e7d19d";ctx.lineWidth=4;
  ctx.beginPath();ctx.moveTo(0,edgeY);ctx.quadraticCurveTo(W*.5,590,W,edgeY);ctx.stroke();
  ctx.strokeStyle="rgba(85,65,42,.42)";ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(0,edgeY+8);ctx.quadraticCurveTo(W*.5,599,W,edgeY+8);ctx.stroke();
}

// Suối núi uốn quanh chân núi, đổ xuống hồ xanh ngọc dưới chân thác.
function drawMountainStream(time) {
  ctx.save();
  // Bờ đá tối, nhiều lớp bờ cát và rêu.
  ctx.lineCap="round";ctx.lineJoin="round";
  ctx.strokeStyle="#455c4b";ctx.lineWidth=43;
  ctx.beginPath();ctx.moveTo(70,520);ctx.bezierCurveTo(190,490,250,565,370,548);
  ctx.bezierCurveTo(485,530,520,480,650,500);ctx.bezierCurveTo(740,515,790,485,880,480);ctx.stroke();
  ctx.strokeStyle="#9b9a70";ctx.lineWidth=34;ctx.stroke();
  const water=ctx.createLinearGradient(0,475,0,570);
  water.addColorStop(0,"#bce6dc");water.addColorStop(.42,"#65b8b0");water.addColorStop(1,"#267e82");
  ctx.strokeStyle=water;ctx.lineWidth=25;
  ctx.beginPath();ctx.moveTo(70,518);ctx.bezierCurveTo(190,488,250,562,370,545);
  ctx.bezierCurveTo(485,526,520,477,650,497);ctx.bezierCurveTo(740,512,790,482,880,478);ctx.stroke();

  // Vân nước chuyển động chậm theo dòng.
  const shift=(time*.018)%70;
  for(let i=0;i<9;i++){
    const t=(i/9+shift/70)%1;
    const x=90+t*760,y=514+Math.sin(t*8)*23;
    ctx.strokeStyle="rgba(240,255,239,.52)";ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(x-12,y-2);ctx.quadraticCurveTo(x,y-6,x+14,y+1);ctx.stroke();
  }

  // Hồ nước chân thác: lòng hồ sâu, bờ đá, gợn sóng và bọt trắng.
  const lx=895,ly=493;
  const lake=ctx.createRadialGradient(lx-20,ly-12,5,lx,ly,125);
  lake.addColorStop(0,"#c4eee0");lake.addColorStop(.42,"#62b8ad");lake.addColorStop(1,"#285f60");
  ctx.fillStyle="#465d4d";ctx.beginPath();ctx.ellipse(lx,ly+7,125,48,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=lake;ctx.beginPath();ctx.ellipse(lx,ly,116,39,-.04,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle="rgba(230,255,238,.58)";ctx.lineWidth=2;
  for(let i=0;i<4;i++){
    ctx.beginPath();ctx.ellipse(lx-4,ly+2,26+i*19,7+i*4,-.05,0,Math.PI*2);ctx.stroke();
  }
  ctx.fillStyle="rgba(242,255,239,.48)";
  for(let i=0;i<8;i++){
    const a=i*.78+time*.0002;
    ctx.beginPath();ctx.ellipse(lx+Math.cos(a)*38,ly+Math.sin(a)*13,3,1.5,a,0,Math.PI*2);ctx.fill();
  }
  // Mỏm đá và rêu hai bờ.
  for(let i=0;i<9;i++){
    const x=785+i*26,y=475+(i%3)*12;
    ctx.fillStyle=i%2?"#68765a":"#817b60";
    ctx.beginPath();ctx.ellipse(x,y,13,7,-.3,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="rgba(102,151,99,.75)";
    ctx.beginPath();ctx.ellipse(x-2,y-5,8,3,-.4,0,Math.PI*2);ctx.fill();
  }
  ctx.restore();
}

// Tăng chiều sâu địa hình núi: vân đá, sườn gãy, tuyết và thảm cây.
function drawMountainRange() {
  function layer(points,top,bottom){
    const grad=ctx.createLinearGradient(0,90,0,570);
    grad.addColorStop(0,top);grad.addColorStop(1,bottom);
    ctx.fillStyle=grad;ctx.beginPath();ctx.moveTo(0,H);
    points.forEach(p=>ctx.lineTo(p[0],p[1]));ctx.lineTo(W,H);ctx.closePath();ctx.fill();
  }
  layer([[0,350],[70,245],[125,282],[210,112],[270,215],[350,145],[430,260],[515,170],[600,250],[680,100],[745,208],[820,135],[905,250],[990,145],[1050,235],[W,190]],"#c9d5c4","#839b88");
  layer([[0,420],[80,310],[150,350],[235,210],[310,320],[395,225],[480,360],[565,235],[655,340],[750,205],[830,320],[920,215],[1005,335],[W,290]],"#819b82","#4e7059");
  layer([[0,505],[85,390],[165,445],[255,305],[345,415],[435,315],[525,455],[615,315],[705,430],[800,295],[885,420],[975,310],[1050,410],[W,365]],"#4d7358","#294b3c");

  // Mặt đá bắt sáng trên các đỉnh cao.
  const faces=[
    [[210,112],[228,188],[270,215],[247,163]],
    [[350,145],[372,211],[430,260],[390,185]],
    [[680,100],[706,178],[745,208],[716,151]],
    [[820,135],[850,210],[905,250],[865,174]],
    [[990,145],[1015,205],[1050,235],[1028,182]]
  ];
  faces.forEach((p,i)=>{
    ctx.fillStyle=i%2?"rgba(231,237,211,.32)":"rgba(247,245,218,.62)";
    ctx.beginPath();p.forEach((v,j)=>j?ctx.lineTo(v[0],v[1]):ctx.moveTo(v[0],v[1]));ctx.closePath();ctx.fill();
  });

  // Khe nứt và tầng đá theo sườn núi.
  ctx.lineCap="round";
  for(let i=0;i<22;i++){
    const x=40+i*49,y=330+(i%4)*28;
    ctx.strokeStyle=i%2?"rgba(27,55,43,.22)":"rgba(230,229,194,.22)";
    ctx.lineWidth=i%3===0?3:1.5;ctx.beginPath();
    ctx.moveTo(x,y);ctx.lineTo(x+10+(i%3)*7,y+17+(i%4)*5);
    ctx.lineTo(x+24+(i%2)*8,y+24+(i%3)*6);ctx.stroke();
  }

  // Rừng tùng thu nhỏ thành từng cụm trên các sườn xa.
  for(let i=0;i<30;i++){
    const x=18+i*38,y=420+(i%4)*18;
    ctx.fillStyle=i%2?"rgba(32,77,57,.72)":"rgba(45,91,65,.76)";
    ctx.beginPath();ctx.moveTo(x,y-15);ctx.lineTo(x-9,y+8);ctx.lineTo(x+9,y+8);ctx.closePath();ctx.fill();
  }
  const haze=ctx.createLinearGradient(0,365,0,570);
  haze.addColorStop(0,"rgba(220,237,218,0)");haze.addColorStop(.55,"rgba(215,235,218,.19)");
  haze.addColorStop(1,"rgba(215,235,218,0)");ctx.fillStyle=haze;ctx.fillRect(0,360,W,210);
}

// Tiên hạc và linh điểu có thân, cổ, đuôi, lông cánh và nhịp bay riêng.
function drawSpiritBirds(time){
 const flocks=[
  {dir:1,y:66,s:.55,speed:.000018,phase:.1,count:2},
  {dir:-1,y:118,s:.43,speed:.000014,phase:.55,count:2}
 ];
 flocks.forEach((f,k)=>{
  for(let j=0;j<f.count;j++){
   const p=(time*f.speed+f.phase+j*.48)%1;
   const x=f.dir>0?-75+p*(W+150):W+75-p*(W+150);
   const y=f.y+Math.sin(time*.00055+j*1.7+k)*5;
   const flap=Math.sin(time*.002+j*1.8+k)*.7;
   ctx.save();ctx.translate(x,y);ctx.scale(f.dir*f.s,f.s);
   ctx.fillStyle="#fffdf0";ctx.beginPath();ctx.ellipse(0,0,18,5,-.05,0,Math.PI*2);ctx.fill();
   ctx.strokeStyle="#fffdf0";ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();
   ctx.moveTo(12,-1);ctx.quadraticCurveTo(23,-12,21,-23);ctx.stroke();
   ctx.fillStyle="#fffdf0";ctx.beginPath();ctx.arc(20,-24,3.5,0,Math.PI*2);ctx.fill();
   ctx.fillStyle="#c94d3e";ctx.beginPath();ctx.moveTo(23,-24);ctx.lineTo(32,-22);ctx.lineTo(23,-20);ctx.closePath();ctx.fill();
   ctx.fillStyle="#fffdf5";ctx.beginPath();ctx.moveTo(-5,0);ctx.quadraticCurveTo(-22,-21-flap*5,-53,-20-flap*6);ctx.quadraticCurveTo(-36,6,-5,6);ctx.closePath();ctx.fill();
   ctx.beginPath();ctx.moveTo(-5,3);ctx.quadraticCurveTo(-22,13+flap*3,-42,20+flap*4);ctx.quadraticCurveTo(-25,11,-5,6);ctx.closePath();ctx.fill();
   ctx.strokeStyle="#b94c40";ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(-3,4);ctx.lineTo(-7,16);ctx.moveTo(5,4);ctx.lineTo(7,16);ctx.stroke();
   ctx.restore();
  }
 });
}

// Mái ngói cong sát thân điện, diềm mái liền nhà; biển hiệu treo ở mặt trước,
// đúng khoảng giữa mép mái và thân điện.
function drawPalace(x,y,scale,grand=false) {
  ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);
  const bw=grand?250:184,half=bw*.76;
  const aura=ctx.createRadialGradient(0,-65,5,0,-65,grand?220:155);
  aura.addColorStop(0,"rgba(255,225,157,.24)");aura.addColorStop(1,"rgba(255,225,157,0)");
  ctx.fillStyle=aura;ctx.fillRect(-bw*1.4,-225,bw*2.8,280);
  ctx.fillStyle="#5d5747";ctx.fillRect(-bw*.72,30,bw*1.44,14);
  ctx.fillStyle="#d1b77e";ctx.fillRect(-bw*.82,40,bw*1.64,7);
  ctx.fillStyle="#ead5a2";ctx.fillRect(-bw*.9,48,bw*1.8,7);
  ctx.fillStyle="#d9c69a";ctx.fillRect(-bw/2,-70,bw,104);
  ctx.fillStyle="#684b39";ctx.fillRect(-bw/2+10,-60,bw-20,94);
  ctx.fillStyle="#a84337";ctx.fillRect(-bw/2+12,-54,bw-24,8);
  const door=grand?50:36;
  ctx.fillStyle="#302923";ctx.fillRect(-door/2,-38,door,72);
  ctx.fillStyle="#c39a59";ctx.fillRect(-door/2+4,-34,door-8,68);
  ctx.fillStyle="#302923";ctx.fillRect(-door/2+8,-30,door-16,64);
  ctx.strokeStyle="#ebcf8a";ctx.lineWidth=2;ctx.strokeRect(-door/2+8,-30,door-16,64);
  ctx.beginPath();ctx.moveTo(0,-30);ctx.lineTo(0,34);ctx.stroke();
  // Cột son nghiêng nhẹ theo phối cảnh; bảng hiệu giữ nguyên phương ngang.
  [-.42,-.25,.25,.42].forEach((k,index)=>{
    const baseX=bw*k,lean=(k<0?-1:1)*(index===0||index===3?4:2.5),topX=baseX-lean;
    ctx.fillStyle="#8f382f";ctx.beginPath();ctx.moveTo(topX-5,-66);ctx.lineTo(topX+5,-66);ctx.lineTo(baseX+5,35);ctx.lineTo(baseX-5,35);ctx.closePath();ctx.fill();
    ctx.fillStyle="#e6c77f";ctx.beginPath();ctx.moveTo(topX-7,-64);ctx.lineTo(topX+7,-64);ctx.lineTo(baseX+7,30);ctx.lineTo(baseX-7,30);ctx.closePath();ctx.fill();
    ctx.fillStyle="rgba(255,226,167,.32)";ctx.beginPath();ctx.moveTo(topX-2,-59);ctx.lineTo(topX,-59);ctx.lineTo(baseX,24);ctx.lineTo(baseX-2,24);ctx.closePath();ctx.fill();
  });
  [-.34,.34].forEach(k=>{const px=bw*k;ctx.fillStyle="#d7b66e";ctx.fillRect(px-12,-41,24,37);ctx.fillStyle="#29463e";ctx.fillRect(px-8,-37,16,29);ctx.strokeStyle="#e8c97d";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(px,-37);ctx.lineTo(px,-8);ctx.moveTo(px-8,-22);ctx.lineTo(px+8,-22);ctx.stroke();});
  ctx.fillStyle="#302b29";ctx.beginPath();ctx.moveTo(-half-22,-73);ctx.quadraticCurveTo(-half*.78,-84,0,-142);ctx.quadraticCurveTo(half*.78,-84,half+22,-73);ctx.lineTo(half+8,-62);ctx.quadraticCurveTo(0,-119,-half-8,-62);ctx.closePath();ctx.fill();
  const roof=ctx.createLinearGradient(0,-140,0,-63);roof.addColorStop(0,"#c5a15e");roof.addColorStop(.42,"#87623d");roof.addColorStop(1,"#47372e");
  ctx.fillStyle=roof;ctx.beginPath();ctx.moveTo(-half-14,-76);ctx.quadraticCurveTo(-half*.73,-86,0,-136);ctx.quadraticCurveTo(half*.73,-86,half+14,-76);ctx.lineTo(half,-68);ctx.quadraticCurveTo(0,-119,-half,-68);ctx.closePath();ctx.fill();
  ctx.fillStyle="#49352b";ctx.fillRect(-bw*.53,-73,bw*1.06,8);
  ctx.strokeStyle="#edcf87";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-half-19,-74);ctx.quadraticCurveTo(0,-149,half+19,-74);ctx.stroke();
  ctx.strokeStyle="rgba(255,231,177,.42)";ctx.lineWidth=1;
  for(let n=-6;n<=6;n++){const px=n*half*.12;ctx.beginPath();ctx.moveTo(px,-132+Math.abs(n)*2.5);ctx.lineTo(px*1.5,-76);ctx.stroke();}
  ctx.strokeStyle="#e7c67e";ctx.lineWidth=5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(-half-15,-75);ctx.quadraticCurveTo(-half-38,-81,-half-32,-102);ctx.moveTo(half+15,-75);ctx.quadraticCurveTo(half+38,-81,half+32,-102);ctx.stroke();
  ctx.fillStyle="#f4d994";ctx.beginPath();ctx.arc(0,-139,5,0,Math.PI*2);ctx.fill();
  // Bảng hiệu nằm ngang, không bị xoay theo cột.
  const pw=grand?168:118,py=-76;
  ctx.fillStyle="#33241c";ctx.fillRect(-pw/2-5,py-5,pw+10,31);
  ctx.fillStyle="#d9b66e";ctx.fillRect(-pw/2-2,py-2,pw+4,25);
  ctx.fillStyle="#71312a";ctx.fillRect(-pw/2+2,py+2,pw-4,17);
  ctx.strokeStyle="#fff0bd";ctx.lineWidth=1.5;ctx.strokeRect(-pw/2+4,py+3,pw-8,15);
  ctx.fillStyle="#fff1c8";ctx.font="bold "+(grand?15:13)+"px serif";ctx.textAlign="center";ctx.textBaseline="middle";ctx.shadowColor="#ffe3a0";ctx.shadowBlur=4;
  ctx.fillText(grand?"VẠN KIẾM ĐIỆN":"TIÊN ĐIỆN",0,py+10,pw-13);ctx.shadowBlur=0;
  [-bw*.78,bw*.78].forEach(px=>{ctx.fillStyle="#d8bb78";ctx.fillRect(px,-112,3,50);ctx.fillStyle="#a64035";ctx.beginPath();ctx.moveTo(px+3,-110);ctx.lineTo(px+30,-101);ctx.lineTo(px+3,-92);ctx.closePath();ctx.fill();});
  ctx.restore();
}
function drawCrowd(time) {
  // Dãy danh dự chia thành ba cụm có khoảng trống rõ ràng.
  drawAudiencePlatform(550,682,142);
  drawFormalSpectator(550,654,1.25,"master",time,0);
  drawRoleLabel(550,617,"CHƯỞNG MÔN","#f2d17d",1.25);

  drawAudiencePlatform(255,710,188);
  drawAudiencePlatform(845,710,188);
  [[190,682],[255,682],[320,682]].forEach((p,i)=>drawFormalSpectator(p[0],p[1],.96,"elder",time,i));
  [[780,682],[845,682],[910,682]].forEach((p,i)=>drawFormalSpectator(p[0],p[1],.96,"elder",time,i+3));
  drawRoleLabel(255,644,"ĐẠI TRƯỞNG LÃO","#d4b5fa",1.02);
  drawRoleLabel(845,644,"TRƯỞNG LÃO","#d4b5fa",1.02);

  drawAudiencePlatform(550,750,260);
  [[445,721],[495,721],[545,721],[595,721],[645,721]].forEach((p,i)=>drawFormalSpectator(p[0],p[1],.82,"disciple",time,i));
  drawRoleLabel(550,684,"CHÂN TRUYỀN ĐỆ TỬ","#a9c9f0",.94);

  // Đệ tử phổ thông phân bố cân hai cánh, chừa lề an toàn cho nhân vật và HUD.
  const bands=[
    {x:28,y:670,n:8,role:"servant",s:.66},
    {x:28,y:720,n:8,role:"outer",s:.68},
    {x:28,y:775,n:8,role:"inner",s:.64},
    {x:724,y:670,n:8,role:"outer",s:.68},
    {x:724,y:720,n:8,role:"servant",s:.66},
    {x:724,y:775,n:8,role:"core",s:.64}
  ];
  bands.forEach((row,r)=>{
    for(let i=0;i<row.n;i++){
      const x=row.x+i*48+(i%2)*3;
      const y=row.y+Math.sin(i*1.7+r)*3;
      drawSpectator(x,y,row.s,row.role,time,i*.71+r*1.3);
    }
  });
  drawCrowdFlag(18,690,"#a53f36",time);
  drawCrowdFlag(W-18,690,"#b18a43",time);
}

function drawScenery(time) {
  drawSky(time);drawMountainRange();drawMovingClouds(time);drawSpiritBirds(time);
  drawWaterfall(890,250,30,205,time);
  drawWaterfall(112,315,22,145,time);
  drawMountainStream(time);

  // Các điện nhỏ bám sát mỏm núi.
  drawFloatingPlatform(790,397,.92);drawFloatingPlatform(970,435,.62);
  drawPalace(790,354,.78,false);drawPalace(970,405,.54,false);

  // Vạn Kiếm Điện ở chính giữa quảng trường, phía trước khu chưởng môn.
  drawPalace(550,574,.70,true);

  // Cây rừng chỉ đứng ở bìa, phía trên đường biên quảng trường.
  drawPine(24,565,1.02,"#294f3d");drawPine(78,560,.94,"#315b45");
  drawTree(132,555,.80,"#426b4c");drawPine(250,545,.72,"#315b45");
  drawTree(315,548,.64,"#426b4c");drawTree(850,548,.64,"#426b4c");
  drawPine(920,545,.72,"#315b45");drawPine(1020,560,.94,"#315b45");
  drawPine(1075,565,1.02,"#294f3d");

  drawRiver(time);
  drawCrowd(time);
}

// HUD ở hai góc trên, nền xanh ôm vừa nội dung.
function drawRaceHud() {
  const remaining=Math.max(0,duration-elapsed);
  const completed=racers.filter(r=>r.finished).length;
  const items=[
    {x:12,label:"THỜI GIAN",value:timeText(remaining),align:"left"},
    {x:W-12,label:"HOÀN THÀNH",value:String(completed)+" / "+String(racers.length),align:"right"}
  ];
  items.forEach(item=>{
    ctx.save();ctx.font="bold 10px Georgia";
    const labelW=ctx.measureText(item.label).width;
    ctx.font="bold 20px Georgia";const valueW=ctx.measureText(item.value).width;
    const boxW=Math.ceil(Math.max(labelW,valueW)+22),boxH=49;
    const x=item.align==="left"?item.x:item.x-boxW,y=12;
    ctx.fillStyle="rgba(20,48,39,.92)";ctx.fillRect(x,y,boxW,boxH);
    ctx.strokeStyle="rgba(224,194,126,.88)";ctx.lineWidth=1;
    ctx.strokeRect(x+.5,y+.5,boxW-1,boxH-1);
    ctx.textAlign="center";ctx.textBaseline="middle";
    ctx.fillStyle="#e0c991";ctx.font="bold 10px Georgia";ctx.fillText(item.label,x+boxW/2,y+12,boxW-8);
    ctx.fillStyle="#fff0c7";ctx.font="bold 20px Georgia";ctx.fillText(item.value,x+boxW/2,y+34,boxW-8);
    ctx.restore();
  });
}

// Cổng tiên môn mở rộng ngang, vòm và biển hiệu cân xứng.
function drawImmortalFinishGate() {
  const x=TRACK.right,top=TRACK.top-55,bottom=TRACK.bottom;
  ctx.save();
  const aura=ctx.createRadialGradient(x,top+65,5,x,top+65,145);
  aura.addColorStop(0,"rgba(255,231,160,.30)");aura.addColorStop(1,"rgba(255,231,160,0)");
  ctx.fillStyle=aura;ctx.fillRect(x-150,top-35,300,220);

  [-48,48].forEach(offset=>{
    const px=x+offset;
    const grad=ctx.createLinearGradient(px-10,0,px+10,0);
    grad.addColorStop(0,"#65472d");grad.addColorStop(.35,"#f2d99a");
    grad.addColorStop(.7,"#b88d4c");grad.addColorStop(1,"#59402b");
    ctx.fillStyle=grad;ctx.fillRect(px-9,top+29,18,bottom-top-29);
    ctx.strokeStyle="#f3d78e";ctx.lineWidth=2;ctx.strokeRect(px-9,top+29,18,bottom-top-29);
    ctx.fillStyle="#765332";ctx.fillRect(px-18,bottom-18,36,18);
    ctx.fillStyle="#e2c17b";ctx.fillRect(px-21,bottom-22,42,5);
    ctx.fillStyle="#9c713b";ctx.fillRect(px-15,top+18,30,12);
    ctx.fillStyle="#f1d58b";ctx.fillRect(px-19,top+13,38,6);
    ctx.fillStyle="#fff0b5";ctx.beginPath();ctx.arc(px,top+9,5,0,Math.PI*2);ctx.fill();
  });

  // Vòm đại môn rộng, cong vút như cổng sơn môn.
  ctx.beginPath();ctx.moveTo(x-65,top+35);
  ctx.bezierCurveTo(x-58,top-18,x-24,top-35,x,top-35);
  ctx.bezierCurveTo(x+24,top-35,x+58,top-18,x+65,top+35);
  ctx.strokeStyle="#65452b";ctx.lineWidth=17;ctx.stroke();
  ctx.strokeStyle="#e9c77b";ctx.lineWidth=8;ctx.stroke();
  ctx.strokeStyle="rgba(255,245,193,.8)";ctx.lineWidth=2;ctx.stroke();

  // Mái ngói cong trên vòm.
  ctx.fillStyle="#47382e";ctx.beginPath();ctx.moveTo(x-76,top+24);
  ctx.quadraticCurveTo(x,top-52,x+76,top+24);
  ctx.lineTo(x+62,top+31);ctx.quadraticCurveTo(x,top-31,x-62,top+31);
  ctx.closePath();ctx.fill();
  ctx.strokeStyle="#e8c87d";ctx.lineWidth=3;ctx.beginPath();
  ctx.moveTo(x-76,top+24);ctx.quadraticCurveTo(x,top-52,x+76,top+24);ctx.stroke();

  // Biển hiệu rộng vừa dòng chữ.
  ctx.fillStyle="#6a3028";ctx.fillRect(x-52,top-2,104,27);
  ctx.strokeStyle="#f0d28a";ctx.lineWidth=2;ctx.strokeRect(x-52,top-2,104,27);
  ctx.fillStyle="#ffe9ad";ctx.font="bold 13px serif";ctx.textAlign="center";
  ctx.textBaseline="middle";ctx.fillText("TIÊN MÔN",x,top+11);

  const glow=ctx.createLinearGradient(0,top+45,0,bottom-20);
  glow.addColorStop(0,"rgba(255,245,190,.05)");
  glow.addColorStop(.5,"rgba(255,238,166,.8)");
  glow.addColorStop(1,"rgba(255,245,190,.05)");
  ctx.fillStyle=glow;ctx.fillRect(x-1,top+45,2,bottom-top-65);
  ctx.strokeStyle="rgba(255,224,145,.5)";ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(x-13,top+48);ctx.lineTo(x-13,bottom-18);
  ctx.moveTo(x+13,top+48);ctx.lineTo(x+13,bottom-18);ctx.stroke();
  ctx.restore();
}


// =====================================================
// REVISION 6 — LIÊN KẾT THÁC, HỒ, SÔNG; SẮP XẾP TIÊN ĐIỆN
// =====================================================

function drawMountainStream(time) {
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Dòng sông chạy xuyên suốt từ ngoài mép trái sang ngoài mép phải.
  // Hai đường bờ đá tạo cảm giác lòng sông nằm sâu trong địa hình.
  const riverPath = () => {
    ctx.beginPath();
    ctx.moveTo(-100, 520);
    ctx.bezierCurveTo(120, 500, 220, 545, 390, 526);
    ctx.bezierCurveTo(555, 507, 660, 536, 820, 518);
    ctx.bezierCurveTo(980, 500, 1080, 535, 1200, 516);
  };

  ctx.strokeStyle = "#344c3e";
  ctx.lineWidth = 76;
  riverPath(); ctx.stroke();

  ctx.strokeStyle = "#786f54";
  ctx.lineWidth = 65;
  riverPath(); ctx.stroke();

  ctx.strokeStyle = "#b1a17a";
  ctx.lineWidth = 52;
  riverPath(); ctx.stroke();

  const water = ctx.createLinearGradient(0, 492, 0, 552);
  water.addColorStop(0, "#b9e7df");
  water.addColorStop(.28, "#65b9b6");
  water.addColorStop(.68, "#318f96");
  water.addColorStop(1, "#176775");
  ctx.strokeStyle = water;
  ctx.lineWidth = 43;
  riverPath(); ctx.stroke();

  // Dòng nước siết: các dải bọt kéo dài, nghiêng theo chiều trái sang phải.
  const drift = (time * .105) % 180;
  for (let i = 0; i < 22; i++) {
    const x = ((i * 83 + drift) % 1380) - 100;
    const y = 520 + Math.sin(x * .009) * 10 + Math.sin(i * 1.7) * 7;
    const len = 13 + (i % 4) * 8;
    ctx.strokeStyle = i % 3 === 0
      ? "rgba(245,255,244,.82)"
      : "rgba(194,245,235,.48)";
    ctx.lineWidth = i % 4 === 0 ? 3 : 1.7;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + len * .45, y - 3, x + len, y + 1);
    ctx.stroke();
  }

  // Bọt nước và vệt xoáy dọc theo dòng chảy.
  for (let i = 0; i < 12; i++) {
    const x = ((i * 127 + drift * .72) % 1320) - 80;
    const y = 510 + Math.sin(i * 2.1) * 13;
    ctx.fillStyle = "rgba(238,255,246,.55)";
    ctx.beginPath();
    ctx.ellipse(x, y, 5 + (i % 3) * 2, 1.8, -.08, 0, Math.PI * 2);
    ctx.fill();
  }

  // Hai hồ chân thác mở rộng qua mép khung hình, bờ hồ bám vào chân núi.
  const lakes = [
    { x: 12, y: 490, rx: 150, ry: 76, phase: .4 },
    { x: W - 12, y: 488, rx: 158, ry: 78, phase: 2.1 }
  ];

  lakes.forEach((lake, index) => {
    const { x, y, rx, ry, phase } = lake;
    ctx.fillStyle = "#344b3d";
    ctx.beginPath();
    ctx.ellipse(x, y + 9, rx + 13, ry + 8, -.04, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#80795c";
    ctx.beginPath();
    ctx.ellipse(x, y + 4, rx + 5, ry + 3, -.04, 0, Math.PI * 2);
    ctx.fill();

    const lakeGrad = ctx.createRadialGradient(
      x - rx * .22, y - ry * .28, 5, x, y, rx * 1.12
    );
    lakeGrad.addColorStop(0, "#d0f4e5");
    lakeGrad.addColorStop(.25, "#83d0c4");
    lakeGrad.addColorStop(.62, "#399da0");
    lakeGrad.addColorStop(1, "#1c6570");
    ctx.fillStyle = lakeGrad;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, -.04, 0, Math.PI * 2);
    ctx.fill();

    // Gợn tròn lan ra từ nơi thác đổ, nhiều lớp và chuyển động nhẹ.
    for (let i = 0; i < 5; i++) {
      const pulse = (time * .018 + i * 19 + phase * 11) % 24;
      ctx.strokeStyle = "rgba(225,255,241," + (0.48 - i * .065) + ")";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(
        x + (index === 0 ? 30 : -30),
        y - 4,
        18 + i * 17 + pulse * .35,
        5 + i * 4 + pulse * .12,
        -.05, 0, Math.PI * 2
      );
      ctx.stroke();
    }

    // Mảng sáng và bọt xoáy sát chân thác.
    for (let i = 0; i < 11; i++) {
      const a = i * .72 + time * .00035 + phase;
      const px = x + Math.cos(a) * (26 + (i % 3) * 13);
      const py = y - 8 + Math.sin(a) * (10 + (i % 3) * 5);
      ctx.fillStyle = "rgba(245,255,239," + (.32 + (i % 3) * .12) + ")";
      ctx.beginPath();
      ctx.ellipse(px, py, 4 + (i % 2) * 2, 1.8, a, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // Bãi đá nhô khỏi bờ, rêu và bụi cây neo dòng nước vào chân núi.
  for (let i = 0; i < 24; i++) {
    const side = i % 2 ? -1 : 1;
    const x = -15 + i * 49;
    const y = 474 + Math.sin(i * 1.6) * 13 + (side < 0 ? -24 : 25);
    ctx.fillStyle = i % 3 ? "#66745a" : "#898064";
    ctx.beginPath();
    ctx.ellipse(x, y, 12 + (i % 3) * 3, 6 + (i % 2) * 2, -.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(105,153,98,.78)";
    ctx.beginPath();
    ctx.ellipse(x - 2, y - 4, 8, 3, -.3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Đường bọt nối hai hồ với lòng sông, nhấn mạnh hướng trái -> phải.
  for (let i = 0; i < 8; i++) {
    const x = ((i * 171 + drift * .8) % 1320) - 100;
    ctx.strokeStyle = "rgba(230,255,245,.42)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, 536 + Math.sin(i) * 5);
    ctx.lineTo(x + 27, 534 + Math.sin(i) * 5);
    ctx.stroke();
  }
  ctx.restore();
}

// Thác có lòng nước rõ, chân thác chạm mặt hồ; không còn cảm giác treo giữa trời.
function drawLinkedCascade(x, topY, bottomY, width, time, side) {
  ctx.save();
  const mid = (topY + bottomY) * .5;
  const drift = Math.sin(time * .002 + side) * 2.5;

  // Vách đá tối phía sau ôm lấy dòng thác.
  ctx.fillStyle = "#435b4a";
  ctx.beginPath();
  ctx.moveTo(x - width * 1.35, topY - 8);
  ctx.lineTo(x - width * .78, topY + 12);
  ctx.lineTo(x - width * .9, mid);
  ctx.lineTo(x - width * 1.2, bottomY + 9);
  ctx.lineTo(x + width * 1.2, bottomY + 9);
  ctx.lineTo(x + width * .9, mid);
  ctx.lineTo(x + width * .78, topY + 12);
  ctx.lineTo(x + width * 1.35, topY - 8);
  ctx.closePath();
  ctx.fill();

  // Dải nước chính, rộng ở chân và uốn nhẹ theo vách đá.
  const grad = ctx.createLinearGradient(x - width, 0, x + width, 0);
  grad.addColorStop(0, "#317f8a");
  grad.addColorStop(.24, "#9bded8");
  grad.addColorStop(.55, "#e0fff0");
  grad.addColorStop(.82, "#75c9c7");
  grad.addColorStop(1, "#286f7b");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(x - width * .72, topY);
  ctx.bezierCurveTo(x - width * .55, mid, x - width * .9 + drift, bottomY - 8, x - width * 1.08, bottomY);
  ctx.lineTo(x + width * 1.08, bottomY);
  ctx.bezierCurveTo(x + width * .82 + drift, mid, x + width * .65, topY + 5, x + width * .72, topY);
  ctx.closePath();
  ctx.fill();

  // Sợi nước và vệt sáng chạy thẳng xuống, chuyển động cùng chiều trọng lực.
  for (let i = 0; i < 13; i++) {
    const px = x - width * .68 + i * width * .112;
    const offset = (time * (.045 + (i % 3) * .012) + i * 19) % 34;
    ctx.strokeStyle = i % 3 === 0
      ? "rgba(250,255,245,.78)"
      : "rgba(216,250,239,.48)";
    ctx.lineWidth = i % 4 === 0 ? 2.5 : 1.2;
    ctx.beginPath();
    ctx.moveTo(px, topY + offset * .25);
    ctx.bezierCurveTo(px - 3, mid, px + 3, bottomY - 12 + offset * .08, px + drift, bottomY);
    ctx.stroke();
  }

  // Bọt trắng tại điểm chạm mặt hồ.
  ctx.fillStyle = "rgba(238,255,247,.72)";
  for (let i = 0; i < 9; i++) {
    const px = x + Math.sin(time * .003 + i * 1.9) * (width * .9);
    const py = bottomY - 2 + Math.cos(i * 2.3) * 3;
    ctx.beginPath();
    ctx.ellipse(px, py, 5 + (i % 3) * 3, 2, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

// Địa hình núi nhiều sống núi, đỉnh nhọn, vách đá dựng và tầng đá ngoằn ngoèo.
function drawMountainRange() {
  const ridge = (points, colors) => {
    const g = ctx.createLinearGradient(0, 80, 0, 590);
    g.addColorStop(0, colors[0]);
    g.addColorStop(.48, colors[1]);
    g.addColorStop(1, colors[2]);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(0, H);
    points.forEach(p => ctx.lineTo(p[0], p[1]));
    ctx.lineTo(W, H);
    ctx.closePath();
    ctx.fill();
  };

  // Lớp núi xa, các đỉnh cao có đường sống núi rõ rệt.
  ridge([
    [0,350],[48,278],[92,300],[145,205],[190,235],[246,92],
    [286,170],[338,132],[390,220],[448,162],[500,250],
    [558,116],[604,177],[658,78],[704,164],[754,122],
    [808,214],[866,105],[914,184],[968,135],[1018,224],
    [1065,152],[W,205]
  ], ["#dce4d5","#9caf9b","#6f8a78"]);

  // Sườn giữa có mỏm đá và các vách bị xẻ bởi khe núi.
  ridge([
    [0,424],[58,345],[116,365],[176,267],[230,330],[290,225],
    [352,337],[412,260],[470,368],[535,245],[590,337],
    [650,214],[712,334],[772,232],[830,350],[890,238],
    [950,345],[1015,252],[1070,340],[W,286]
  ], ["#aabda5","#718c70","#496a56"]);

  // Chân núi phía trước, tạo đường cong ôm lấy thung lũng và dòng sông.
  ridge([
    [0,505],[65,420],[122,448],[185,360],[248,430],[310,342],
    [378,447],[445,355],[512,462],[580,360],[650,448],
    [720,345],[786,448],[850,356],[916,450],[982,365],
    [1040,444],[W,390]
  ], ["#719276","#456d55","#294c3d"]);

  // Các mặt đá sáng và vách đứng có cạnh gãy, không phải mảng tam giác phẳng đơn điệu.
  const cliffs = [
    [[246,92],[258,150],[286,170],[272,126],[260,110]],
    [[338,132],[354,195],[390,220],[365,165],[351,151]],
    [[558,116],[570,174],[604,177],[584,145]],
    [[658,78],[674,142],[704,164],[681,113]],
    [[866,105],[880,164],[914,184],[892,132]],
    [[290,225],[307,286],[352,337],[326,270]],
    [[535,245],[554,301],[590,337],[566,282]],
    [[772,232],[793,299],[830,350],[807,281]],
    [[185,360],[204,397],[248,430],[218,378]],
    [[720,345],[743,397],[786,448],[755,382]]
  ];
  cliffs.forEach((p, i) => {
    ctx.fillStyle = i % 2 ? "rgba(222,224,190,.42)" : "rgba(244,239,207,.58)";
    ctx.beginPath();
    p.forEach((v, j) => j ? ctx.lineTo(v[0], v[1]) : ctx.moveTo(v[0], v[1]));
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(54,75,58,.30)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });

  // Những tầng địa chất uốn lượn theo sườn, khe nứt sâu và đá vụn.
  ctx.lineCap = "round";
  for (let i = 0; i < 34; i++) {
    const x = (i * 79 + 17) % W;
    const y = 300 + (i % 6) * 27;
    ctx.strokeStyle = i % 2 ? "rgba(31,62,47,.28)" : "rgba(222,222,183,.25)";
    ctx.lineWidth = i % 4 === 0 ? 3 : 1.3;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x + 9, y + 8, x - 5, y + 17, x + 17, y + 25);
    ctx.bezierCurveTo(x + 29, y + 31, x + 18, y + 37, x + 39, y + 41);
    ctx.stroke();
  }

  // Rừng tùng bám trên các gờ đá, không phủ kín mặt vách.
  for (let i = 0; i < 42; i++) {
    const x = (i * 53 + 9) % W;
    const y = 386 + (i % 5) * 17;
    const s = .7 + (i % 3) * .12;
    ctx.fillStyle = i % 2 ? "#315b43" : "#426d50";
    ctx.beginPath();
    ctx.moveTo(x, y - 18 * s);
    ctx.lineTo(x - 9 * s, y + 7 * s);
    ctx.lineTo(x + 9 * s, y + 7 * s);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "rgba(24,57,42,.7)";
    ctx.fillRect(x - 1, y + 4, 2, 5);
  }

  const mist = ctx.createLinearGradient(0, 340, 0, 590);
  mist.addColorStop(0, "rgba(222,239,222,0)");
  mist.addColorStop(.55, "rgba(213,235,218,.16)");
  mist.addColorStop(1, "rgba(213,235,218,0)");
  ctx.fillStyle = mist;
  ctx.fillRect(0, 340, W, 250);
}

function drawCrowd(time) {
  // Khu danh dự nằm phía trên; đệ tử cổ vũ phổ thông đứng thành hàng phía dưới.
  drawAudiencePlatform(550, 654, 150);
  drawFormalSpectator(550, 626, 1.22, "master", time, 0);
  drawRoleLabel(550, 566, "CHƯỞNG MÔN", "#f2d17d", 1.18);

  drawAudiencePlatform(255, 680, 220);
  drawAudiencePlatform(845, 680, 220);
  [[165,652],[225,652],[285,652],[345,652],
   [755,652],[815,652],[875,652],[935,652]].forEach((p,i) =>
    drawFormalSpectator(p[0],p[1],.92,"elder",time,i)
  );
  drawRoleLabel(255, 596, "ĐẠI TRƯỞNG LÃO", "#d4b5fa", .98);
  drawRoleLabel(845, 596, "TRƯỞNG LÃO", "#d4b5fa", .98);

  drawAudiencePlatform(550, 727, 310);
  [[410,699],[465,699],[520,699],[575,699],[630,699],[685,699]].forEach((p,i) =>
    drawFormalSpectator(p[0],p[1],.78,"disciple",time,i)
  );
  // Bảng thân truyền tách khỏi ngai, đặt phía trên hàng ghế riêng.
  drawRoleLabel(550, 642, "CHÂN TRUYỀN ĐỆ TỬ", "#a9c9f0", .92);

  // Chỉ bố trí đệ tử phổ thông ở hai cánh và hàng cuối, không đứng đè lên ghế VIP.
  const rows = [
    { x: 18, y: 770, n: 6, role: "servant", scale: .70 },
    { x: 782, y: 770, n: 6, role: "outer", scale: .70 }
  ];
  rows.forEach((r, ri) => {
    for (let i = 0; i < r.n; i++) {
      drawSpectator(r.x + i * 52, r.y + (i % 2) * 2, r.scale, r.role, time, i * .7 + ri);
    }
  });

  drawCrowdFlag(12, 746, "#a53f36", time);
  drawCrowdFlag(W - 18, 746, "#b18a43", time);
}

function drawScenery(time) {
  drawSky(time);
  drawMountainRange();
  drawMovingClouds(time);
  drawSpiritBirds(time);

  // Các tiên điện được đặt trên sống núi, mỏm đá và một đảo đá giữa hồ.
  // Mỗi bệ nằm ngay dưới chân điện, không đặt chồng lên thác nước.
  drawFloatingPlatform(245, 252, .56);
  drawPalace(245, 210, .48, false);

  drawFloatingPlatform(438, 326, .48);
  drawPalace(438, 284, .42, false);

  drawFloatingPlatform(660, 238, .62);
  drawPalace(660, 190, .54, false);

  drawFloatingPlatform(858, 300, .48);
  drawPalace(858, 258, .42, false);

  drawFloatingPlatform(550, 462, .38);
  drawPalace(550, 430, .34, false);

  // Thác trái đổ vào hồ trái; thác phải đổ vào hồ phải.
  drawLinkedCascade(72, 300, 478, 27, time, .2);
  drawLinkedCascade(W - 72, 270, 476, 34, time, 1.4);

  // Hồ và sông được vẽ sau thác để mặt nước nối liền, bờ hồ ôm chân núi.
  drawMountainStream(time);

  // Cây mọc trên các bậc đất và gờ núi, tránh lòng sông và mặt hồ.
  drawPine(170, 430, .78, "#315b45");
  drawTree(205, 448, .62, "#426b4c");
  drawPine(365, 448, .68, "#315b45");
  drawTree(475, 438, .58, "#426b4c");
  drawPine(735, 438, .72, "#315b45");
  drawTree(805, 447, .62, "#426b4c");
  drawPine(930, 430, .76, "#315b45");

  drawRiver(time);
  drawCrowd(time);
}

// Tránh để thẻ HOÀN THÀNH che cổng đích TIÊN MÔN ở góc phải.
function drawRaceHud() {
  const remaining = Math.max(0, duration - elapsed);
  const completed = racers.filter(r => r.finished).length;
  const items = [
    { x: 12, y: 12, label: "THỜI GIAN", value: timeText(remaining) },
    { x: 12, y: 68, label: "ĐÃ VỀ ĐÍCH", value: String(completed) + " / " + String(racers.length) }
  ];
  items.forEach(item => {
    ctx.save();
    ctx.font = "bold 10px Georgia";
    const labelW = ctx.measureText(item.label).width;
    ctx.font = "bold 20px Georgia";
    const valueW = ctx.measureText(item.value).width;
    const boxW = Math.ceil(Math.max(labelW, valueW) + 22);
    const boxH = 49;
    ctx.fillStyle = "rgba(20,48,39,.92)";
    ctx.fillRect(item.x, item.y, boxW, boxH);
    ctx.strokeStyle = "rgba(224,194,126,.88)";
    ctx.lineWidth = 1;
    ctx.strokeRect(item.x + .5, item.y + .5, boxW - 1, boxH - 1);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#e0c991";
    ctx.font = "bold 10px Georgia";
    ctx.fillText(item.label, item.x + boxW / 2, item.y + 12, boxW - 8);
    ctx.fillStyle = "#fff0c7";
    ctx.font = "bold 20px Georgia";
    ctx.fillText(item.value, item.x + boxW / 2, item.y + 34, boxW - 8);
    ctx.restore();
  });
}


// =====================================================
// REVISION 7 — BỐ CỤC KHÁN ĐÀI, HỒ TỰ NHIÊN, CỔNG 3D
// =====================================================

function drawCrowd(time) {
  // Ba khu vực danh dự cùng một tầng: thân truyền trái, chưởng môn giữa, trưởng lão phải.
  drawAudiencePlatform(300, 681, 205);
  drawFormalSpectator(300, 649, 1.02, "disciple", time, 0);
  drawRoleLabel(300, 610, "CHÂN TRUYỀN ĐỆ TỬ", "#a9c9f0", .96);

  drawAudiencePlatform(550, 681, 178);
  drawFormalSpectator(550, 649, 1.18, "master", time, 0);
  drawRoleLabel(550, 600, "CHƯỞNG MÔN", "#f2d17d", 1.12);

  drawAudiencePlatform(800, 681, 205);
  drawFormalSpectator(800, 649, 1.02, "elder", time, 1);
  drawRoleLabel(800, 610, "TRƯỞNG LÃO", "#d4b5fa", .98);

  // Đám đông đứng dày thành nhiều lớp như khán giả concert, thấp hơn khu danh dự.
  const crowdRows = [
    { y: 725, count: 34, x: 14, step: 32, scale: .67, role: "servant" },
    { y: 750, count: 35, x: 4, step: 32, scale: .63, role: "outer" },
    { y: 774, count: 36, x: -3, step: 31, scale: .59, role: "inner" },
    { y: 795, count: 37, x: -8, step: 30, scale: .53, role: "core" }
  ];
  crowdRows.forEach((row, ri) => {
    for (let i = 0; i < row.count; i++) {
      const stagger = (i % 2) * 7;
      const sway = Math.sin(time * .002 + i * .8 + ri) * 2;
      drawSpectator(
        row.x + i * row.step + stagger,
        row.y + sway,
        row.scale,
        row.role,
        time,
        i * .57 + ri * 1.3
      );
    }
  });
  drawCrowdFlag(12, 713, "#a53f36", time);
  drawCrowdFlag(W - 18, 713, "#b18a43", time);
}

// Hồ dạng lòng chảo tự nhiên, bờ đất/đá ôm theo địa hình; không đặt các viên đá lên mặt nước.
function drawMountainStream(time) {
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Sông chính nằm trong thung lũng, bờ cao thấp tự nhiên.
  const river = () => {
    ctx.beginPath();
    ctx.moveTo(-90, 522);
    ctx.bezierCurveTo(100, 505, 210, 539, 360, 524);
    ctx.bezierCurveTo(520, 510, 650, 537, 810, 521);
    ctx.bezierCurveTo(970, 505, 1080, 531, 1190, 518);
  };
  ctx.strokeStyle = "#294a3c";
  ctx.lineWidth = 75;
  river(); ctx.stroke();
  ctx.strokeStyle = "#756f53";
  ctx.lineWidth = 63;
  river(); ctx.stroke();
  ctx.strokeStyle = "#318b91";
  ctx.lineWidth = 48;
  river(); ctx.stroke();

  const rg = ctx.createLinearGradient(0, 495, 0, 550);
  rg.addColorStop(0, "#a9e2d4");
  rg.addColorStop(.32, "#55afb0");
  rg.addColorStop(.72, "#277f8a");
  rg.addColorStop(1, "#165e6b");
  ctx.strokeStyle = rg;
  ctx.lineWidth = 39;
  river(); ctx.stroke();

  // Hồ trái/phải là phần mở rộng của thung lũng, bờ hồ không tạo viền elip đều.
  const pools = [
    { x: -8, y: 505, w: 205, h: 68, left: true },
    { x: W + 8, y: 503, w: 210, h: 70, left: false }
  ];
  pools.forEach((p, index) => {
    ctx.fillStyle = "#294b3c";
    ctx.beginPath();
    ctx.moveTo(p.x - p.w, p.y - 19);
    ctx.bezierCurveTo(p.x - p.w * .82, p.y - p.h, p.x - p.w * .25, p.y - p.h * 1.15, p.x + p.w * .28, p.y - p.h * .82);
    ctx.bezierCurveTo(p.x + p.w * .92, p.y - p.h * .62, p.x + p.w * 1.05, p.y + 12, p.x + p.w * .65, p.y + p.h * .48);
    ctx.bezierCurveTo(p.x + p.w * .12, p.y + p.h * .82, p.x - p.w * .65, p.y + p.h * .62, p.x - p.w, p.y - 19);
    ctx.fill();

    ctx.fillStyle = "#82785a";
    ctx.beginPath();
    ctx.moveTo(p.x - p.w * .94, p.y - 17);
    ctx.bezierCurveTo(p.x - p.w * .78, p.y - p.h * .78, p.x - p.w * .2, p.y - p.h, p.x + p.w * .3, p.y - p.h * .7);
    ctx.bezierCurveTo(p.x + p.w * .82, p.y - p.h * .48, p.x + p.w * .94, p.y + 8, p.x + p.w * .6, p.y + p.h * .35);
    ctx.bezierCurveTo(p.x + p.w * .08, p.y + p.h * .67, p.x - p.w * .65, p.y + p.h * .48, p.x - p.w * .94, p.y - 17);
    ctx.fill();

    const water = ctx.createRadialGradient(p.x - 25, p.y - 35, 4, p.x, p.y, p.w);
    water.addColorStop(0, "#c5f0dc");
    water.addColorStop(.28, "#78c9c0");
    water.addColorStop(.68, "#328e96");
    water.addColorStop(1, "#1b6570");
    ctx.fillStyle = water;
    ctx.beginPath();
    ctx.moveTo(p.x - p.w * .88, p.y - 16);
    ctx.bezierCurveTo(p.x - p.w * .7, p.y - p.h * .72, p.x - p.w * .18, p.y - p.h * .88, p.x + p.w * .28, p.y - p.h * .63);
    ctx.bezierCurveTo(p.x + p.w * .78, p.y - p.h * .42, p.x + p.w * .88, p.y + 5, p.x + p.w * .55, p.y + p.h * .25);
    ctx.bezierCurveTo(p.x + p.w * .05, p.y + p.h * .52, p.x - p.w * .6, p.y + p.h * .38, p.x - p.w * .88, p.y - 16);
    ctx.fill();

    // Vệt nước xoáy trong hồ, hướng thoát về dòng sông.
    for (let i = 0; i < 8; i++) {
      const a = i * .83 + time * .0003 + index;
      const px = p.x + Math.cos(a) * (32 + (i % 3) * 22);
      const py = p.y - 10 + Math.sin(a) * (12 + (i % 3) * 7);
      ctx.strokeStyle = "rgba(235,255,244," + (.5 - (i % 3) * .09) + ")";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(px, py, 9 + (i % 3) * 4, 2.4, a * .15, 0, Math.PI * 1.65);
      ctx.stroke();
    }
  });

  // Dải bọt chạy liên tục từ hồ trái qua sông sang hồ phải.
  const flow = (time * .14) % 150;
  for (let i = 0; i < 28; i++) {
    const x = ((i * 61 + flow) % 1360) - 120;
    const y = 520 + Math.sin(x * .008) * 8 + Math.sin(i * 1.6) * 5;
    ctx.strokeStyle = i % 3 ? "rgba(225,255,244,.58)" : "rgba(255,255,248,.88)";
    ctx.lineWidth = i % 4 === 0 ? 2.6 : 1.4;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + 10, y - 3, x + 23, y + 1);
    ctx.stroke();
  }

  // Bờ đất và rêu liền với chân núi, tuyệt đối không rải đá nổi giữa mặt nước.
  for (let i = 0; i < 18; i++) {
    const x = i * 68 - 25;
    const y = 474 + Math.sin(i * 1.37) * 10;
    ctx.fillStyle = i % 2 ? "#506c4e" : "#6e7958";
    ctx.beginPath();
    ctx.ellipse(x, y, 25 + (i % 3) * 4, 9 + (i % 2) * 3, -.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(114,157,93,.7)";
    ctx.beginPath();
    ctx.ellipse(x - 3, y - 5, 14, 3, -.15, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

// Thác vẽ sau mặt hồ: chân thác chạm mặt nước, bọt loang ra đúng điểm tiếp xúc.
function drawLinkedCascade(x, topY, bottomY, width, time, side) {
  ctx.save();
  const mid = (topY + bottomY) / 2;
  const sway = Math.sin(time * .0018 + side) * 2;

  // Hốc đá/vách núi bao quanh miệng thác và kéo xuống tận hồ.
  ctx.fillStyle = "#344f40";
  ctx.beginPath();
  ctx.moveTo(x - width * 1.8, topY - 15);
  ctx.lineTo(x - width * .95, topY + 18);
  ctx.lineTo(x - width * 1.12, mid);
  ctx.lineTo(x - width * 1.4, bottomY + 18);
  ctx.lineTo(x + width * 1.4, bottomY + 18);
  ctx.lineTo(x + width * 1.12, mid);
  ctx.lineTo(x + width * .95, topY + 18);
  ctx.lineTo(x + width * 1.8, topY - 15);
  ctx.closePath();
  ctx.fill();

  const water = ctx.createLinearGradient(x - width, 0, x + width, 0);
  water.addColorStop(0, "#286c78");
  water.addColorStop(.22, "#72c5c5");
  water.addColorStop(.48, "#e0fff0");
  water.addColorStop(.72, "#8bd7d0");
  water.addColorStop(1, "#286d79");
  ctx.fillStyle = water;
  ctx.beginPath();
  ctx.moveTo(x - width * .66, topY);
  ctx.bezierCurveTo(x - width * .55, mid, x - width * .92 + sway, bottomY - 12, x - width * 1.05, bottomY);
  ctx.quadraticCurveTo(x, bottomY + 7, x + width * 1.05, bottomY);
  ctx.bezierCurveTo(x + width * .9 + sway, mid, x + width * .65, topY + 4, x + width * .66, topY);
  ctx.closePath();
  ctx.fill();

  for (let i = 0; i < 15; i++) {
    const px = x - width * .62 + i * width * .088;
    const phase = (time * (.05 + (i % 4) * .012) + i * 13) % 31;
    ctx.strokeStyle = i % 3 === 0 ? "rgba(255,255,246,.85)" : "rgba(217,250,240,.52)";
    ctx.lineWidth = i % 4 === 0 ? 2.4 : 1.2;
    ctx.beginPath();
    ctx.moveTo(px, topY + phase * .2);
    ctx.bezierCurveTo(px - 3, mid, px + 3, bottomY - 8, px + sway, bottomY);
    ctx.stroke();
  }

  // Tán bọt trắng trải ngang mặt hồ ngay chân thác.
  for (let i = 0; i < 13; i++) {
    const px = x + Math.sin(time * .0025 + i * 1.5) * width * 1.2;
    const py = bottomY + Math.cos(i * 2.2) * 3;
    ctx.fillStyle = "rgba(245,255,249," + (.38 + (i % 3) * .13) + ")";
    ctx.beginPath();
    ctx.ellipse(px, py, 5 + (i % 4) * 2, 2 + (i % 2), 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

// Núi có đỉnh tù và các bậc vách đá rộng để đặt điện; tránh chóp nhọn bất khả thi.
function drawMountainRange() {
  const layer = (pts, top, mid, base) => {
    const g = ctx.createLinearGradient(0, 80, 0, 590);
    g.addColorStop(0, top); g.addColorStop(.5, mid); g.addColorStop(1, base);
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.moveTo(0, H);
    pts.forEach(p => ctx.lineTo(p[0], p[1]));
    ctx.lineTo(W, H); ctx.closePath(); ctx.fill();
  };

  layer([
    [0,350],[55,292],[105,310],[160,230],[210,250],[260,190],
    [315,220],[370,168],[425,240],[480,195],[535,245],
    [590,175],[650,218],[710,160],[770,220],[825,178],
    [880,245],[935,190],[990,245],[1045,198],[W,250]
  ], "#dce5d7","#9caf9c","#718b78");

  layer([
    [0,430],[70,360],[125,382],[190,300],[250,350],[315,280],
    [380,365],[445,300],[510,380],[575,290],[640,365],
    [705,285],[770,370],[835,300],[900,380],[965,305],
    [1030,370],[W,320]
  ], "#aabda5","#718c70","#496a56");

  layer([
    [0,510],[70,448],[135,465],[205,395],[275,455],[340,382],
    [410,460],[480,390],[550,466],[620,390],[690,462],
    [760,385],[830,460],[900,392],[970,462],[1040,395],[W,440]
  ], "#789779","#4c7158","#294b3c");

  // Các bậc vách đá phẳng/rộng, là nền địa hình thực cho tiên điện.
  const ledges = [
    [205,365,118,24],[430,278,112,23],[650,335,132,25],
    [855,292,118,22],[540,425,120,22],[75,405,105,22],
    [1015,390,115,24]
  ];
  ledges.forEach((l,i) => {
    const [x,y,w,h] = l;
    ctx.fillStyle = "#435b45";
    ctx.beginPath();
    ctx.moveTo(x-w/2,y); ctx.lineTo(x-w*.38,y-h);
    ctx.lineTo(x+w*.36,y-h); ctx.lineTo(x+w/2,y+2);
    ctx.lineTo(x+w*.28,y+h*.55); ctx.lineTo(x-w*.35,y+h*.55);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = i%2 ? "#a0a17a" : "#b0a886";
    ctx.beginPath();
    ctx.moveTo(x-w*.42,y-h); ctx.lineTo(x+w*.36,y-h);
    ctx.lineTo(x+w*.47,y-h+5); ctx.lineTo(x-w*.46,y-h+6);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "rgba(35,62,45,.65)"; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(x-w*.34,y+4); ctx.lineTo(x-w*.15,y+13); ctx.lineTo(x+w*.12,y+15); ctx.stroke();
  });

  // Mặt vách đứng, đường phân tầng đá uốn theo địa hình.
  for (let i=0;i<28;i++) {
    const x=(i*83+21)%W, y=300+(i%5)*31;
    ctx.strokeStyle=i%2?"rgba(35,64,47,.34)":"rgba(225,222,190,.28)";
    ctx.lineWidth=i%4===0?3:1.3;
    ctx.beginPath();ctx.moveTo(x,y);
    ctx.bezierCurveTo(x+18,y+8,x-8,y+20,x+16,y+28);
    ctx.bezierCurveTo(x+34,y+35,x+18,y+42,x+43,y+47);ctx.stroke();
  }
  const mist=ctx.createLinearGradient(0,340,0,590);
  mist.addColorStop(0,"rgba(222,239,222,0)");
  mist.addColorStop(.55,"rgba(213,235,218,.14)");
  mist.addColorStop(1,"rgba(213,235,218,0)");
  ctx.fillStyle=mist;ctx.fillRect(0,340,W,250);
}

// Đặt điện lên các bậc vách đá; bệ có chân tiếp xúc với mặt đá.
function drawScenery(time) {
  drawSky(time);
  drawMountainRange();
  drawMovingClouds(time);
  drawSpiritBirds(time);

  drawFloatingPlatform(205, 360, .43);
  drawPalace(205, 320, .40, false);

  drawFloatingPlatform(430, 273, .42);
  drawPalace(430, 233, .39, false);

  drawFloatingPlatform(650, 330, .48);
  drawPalace(650, 284, .44, false);

  drawFloatingPlatform(855, 287, .42);
  drawPalace(855, 247, .39, false);

  drawFloatingPlatform(540, 420, .36);
  drawPalace(540, 386, .33, false);

  drawFloatingPlatform(75, 400, .34);
  drawPalace(75, 370, .31, false);

  // Vẽ sông/hồ trước, sau đó thác đổ xuống và hòa vào mặt hồ.
  drawMountainStream(time);
  drawLinkedCascade(72, 300, 478, 27, time, .2);
  drawLinkedCascade(W - 72, 270, 476, 34, time, 1.4);

  drawPine(170, 430, .78, "#315b45");
  drawTree(205, 448, .62, "#426b4c");
  drawPine(365, 448, .68, "#315b45");
  drawTree(475, 438, .58, "#426b4c");
  drawPine(735, 438, .72, "#315b45");
  drawTree(805, 447, .62, "#426b4c");
  drawPine(930, 430, .76, "#315b45");
  drawRiver(time);
  drawCrowd(time);
}

// Đồng hồ đặt giữa mép trên, chỉ còn chữ số, không nền và không nhãn phụ.
function drawRaceHud() {
  const remaining = Math.max(0, duration - elapsed);
  ctx.save();
  ctx.font = "bold 25px Georgia";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgba(22,43,34,.72)";
  ctx.strokeText(timeText(remaining), W / 2, 13);
  ctx.fillStyle = "#fff0c4";
  ctx.fillText(timeText(remaining), W / 2, 13);
  ctx.restore();
}

// Cổng có phối cảnh: trụ xa nhỏ hơn, chân cổng cắm vào nền cỏ, bệ nghiêng theo góc nhìn.
function drawImmortalFinishGate() {
  const x = TRACK.right;
  const ground = TRACK.bottom + 27;
  const top = TRACK.top - 57;
  ctx.save();

  const aura=ctx.createRadialGradient(x,top+72,5,x,top+72,145);
  aura.addColorStop(0,"rgba(255,231,160,.26)");
  aura.addColorStop(1,"rgba(255,231,160,0)");
  ctx.fillStyle=aura;ctx.fillRect(x-150,top-35,300,235);

  // Bóng đổ trên nền cỏ giúp cổng có trọng lượng.
  ctx.fillStyle="rgba(24,45,31,.48)";
  ctx.beginPath();
  ctx.moveTo(x-82,ground-2);ctx.lineTo(x+64,ground-8);
  ctx.lineTo(x+96,ground+3);ctx.lineTo(x-52,ground+10);
  ctx.closePath();ctx.fill();

  // Hai trụ dạng khối hộp phối cảnh, trụ phải lùi sâu hơn.
  const posts=[
    {x:x-49, y:ground, topY:top+31, w:18, depth:9, far:false},
    {x:x+47, y:ground-8, topY:top+37, w:15, depth:8, far:true}
  ];
  posts.forEach(p=>{
    const g=ctx.createLinearGradient(p.x-p.w/2,0,p.x+p.w/2,0);
    g.addColorStop(0,"#65452c");g.addColorStop(.28,"#f1d99a");
    g.addColorStop(.68,"#b88d4c");g.addColorStop(1,"#513b2a");
    ctx.fillStyle=g;
    ctx.beginPath();
    ctx.moveTo(p.x-p.w/2,p.topY);
    ctx.lineTo(p.x+p.w/2,p.topY+2);
    ctx.lineTo(p.x+p.w/2+3,p.y);
    ctx.lineTo(p.x-p.w/2+3,p.y-5);
    ctx.closePath();ctx.fill();
    ctx.strokeStyle="#f5d993";ctx.lineWidth=1.5;ctx.stroke();

    // Mặt bên tối làm rõ chiều sâu.
    ctx.fillStyle="#60452e";
    ctx.beginPath();
    ctx.moveTo(p.x+p.w/2,p.topY+2);
    ctx.lineTo(p.x+p.w/2+p.depth,p.topY-3);
    ctx.lineTo(p.x+p.w/2+p.depth,p.y-5);
    ctx.lineTo(p.x+p.w/2+3,p.y);
    ctx.closePath();ctx.fill();

    // Chân đế rộng, nghiêng và chìm nhẹ vào cỏ.
    ctx.fillStyle="#795632";
    ctx.beginPath();
    ctx.moveTo(p.x-p.w,p.y-10);
    ctx.lineTo(p.x+p.w*.8,p.y-7);
    ctx.lineTo(p.x+p.w*1.3,p.y+3);
    ctx.lineTo(p.x-p.w*.7,p.y+1);
    ctx.closePath();ctx.fill();
    ctx.strokeStyle="#e6c47c";ctx.lineWidth=2;ctx.stroke();
  });

  // Vòm cong phối cảnh, hơi nghiêng theo trục ngang.
  ctx.beginPath();
  ctx.moveTo(x-60,top+42);
  ctx.bezierCurveTo(x-56,top-13,x-18,top-37,x+4,top-34);
  ctx.bezierCurveTo(x+31,top-31,x+58,top-5,x+63,top+38);
  ctx.strokeStyle="#5a402c";ctx.lineWidth=19;ctx.stroke();
  ctx.strokeStyle="#e9c77b";ctx.lineWidth=8;ctx.stroke();
  ctx.strokeStyle="rgba(255,247,202,.82)";ctx.lineWidth=2;ctx.stroke();

  // Mái có mặt trên và mặt bên, nhấn phối cảnh 3D.
  ctx.fillStyle="#47372d";
  ctx.beginPath();
  ctx.moveTo(x-78,top+27);ctx.quadraticCurveTo(x-7,top-54,x+78,top+20);
  ctx.lineTo(x+64,top+31);ctx.quadraticCurveTo(x-7,top-31,x-63,top+36);
  ctx.closePath();ctx.fill();
  ctx.fillStyle="#2f3029";
  ctx.beginPath();ctx.moveTo(x+78,top+20);ctx.lineTo(x+91,top+27);
  ctx.lineTo(x+75,top+39);ctx.lineTo(x+64,top+31);ctx.closePath();ctx.fill();
  ctx.strokeStyle="#e8c87d";ctx.lineWidth=3;
  ctx.beginPath();ctx.moveTo(x-78,top+27);ctx.quadraticCurveTo(x-7,top-54,x+78,top+20);ctx.stroke();

  // Biển hiệu gắn trên mặt trước, hơi xiên.
  ctx.fillStyle="#6a3028";
  ctx.beginPath();ctx.moveTo(x-53,top+1);ctx.lineTo(x+50,top+4);
  ctx.lineTo(x+48,top+30);ctx.lineTo(x-55,top+27);ctx.closePath();ctx.fill();
  ctx.strokeStyle="#f0d28a";ctx.lineWidth=2;ctx.stroke();
  ctx.fillStyle="#ffe9ad";ctx.font="bold 13px serif";
  ctx.textAlign="center";ctx.textBaseline="middle";
  ctx.fillText("TIÊN MÔN",x-1,top+15);

  // Hai chân trụ hòa vào thảm cỏ ở đường chân trời.
  ctx.fillStyle="#31583d";
  ctx.beginPath();
  ctx.moveTo(x-100,ground+2);ctx.quadraticCurveTo(x-70,ground-8,x-40,ground+3);
  ctx.quadraticCurveTo(x+5,ground-4,x+42,ground+5);
  ctx.quadraticCurveTo(x+80,ground-4,x+105,ground+7);
  ctx.lineTo(x+105,ground+17);ctx.lineTo(x-100,ground+17);ctx.closePath();ctx.fill();
  ctx.restore();
}


// REVISION 8 — chỉnh bố cục và phong cảnh.
TRACK.top = 155;
TRACK.bottom = 575;

function drawRaceHud() {
  const remaining = Math.max(0, duration - elapsed);
  ctx.save();
  ctx.font = "bold 25px Georgia";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgba(22,43,34,.78)";
  ctx.strokeText(timeText(remaining), W / 2, 13);
  ctx.fillStyle = "#fff0c4";
  ctx.fillText(timeText(remaining), W / 2, 13);
  ctx.restore();
}

function drawAnnouncement() {
  const message = finishMessageLife > 0 ? finishMessage : eventTextLife > 0 ? eventText : "";
  if (!message) return;
  const isFinish = finishMessageLife > 0;
  const life = isFinish ? finishMessageLife : eventTextLife;
  ctx.save();
  ctx.globalAlpha = clamp(life / .55, 0, 1);
  ctx.font = "bold 15px Georgia";
  const boxW = Math.min(W - 260, Math.max(230, ctx.measureText(message).width + 28));
  const boxH = 30, x = (W - boxW) / 2, y = 62;
  ctx.fillStyle = isFinish ? "rgba(99,59,26,.9)" : "rgba(24,52,41,.88)";
  ctx.fillRect(x, y, boxW, boxH);
  ctx.strokeStyle = "#e4c27e"; ctx.lineWidth = 1.3;
  ctx.strokeRect(x + .5, y + .5, boxW - 1, boxH - 1);
  ctx.fillStyle = isFinish ? "#ffe7a7" : "#f6dfa2";
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText(message, W / 2, y + boxH / 2, boxW - 18);
  ctx.restore();
}

function drawVIPChair(x,y,scale,tone,time,phase=0){
 ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);
 const sovereign=scale>1.15;
 ctx.fillStyle="rgba(19,30,24,.34)";ctx.beginPath();ctx.ellipse(0,24,sovereign?35:22,6,0,0,Math.PI*2);ctx.fill();
 if(sovereign){
  ctx.shadowColor="#ffe7a0";ctx.shadowBlur=18+Math.sin(time*.003)*5;ctx.strokeStyle="rgba(255,226,151,.78)";ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,-12,43+Math.sin(time*.002)*3,15,0,0,Math.PI*2);ctx.stroke();ctx.shadowBlur=0;
  ctx.fillStyle="#58372a";ctx.beginPath();ctx.moveTo(-30,10);ctx.lineTo(-30,-48);ctx.quadraticCurveTo(-24,-67,0,-72);ctx.quadraticCurveTo(24,-67,30,-48);ctx.lineTo(30,10);ctx.closePath();ctx.fill();
  const back=ctx.createLinearGradient(-25,-65,25,8);back.addColorStop(0,"#f0d48b");back.addColorStop(.25,tone);back.addColorStop(1,"#54272b");ctx.fillStyle=back;ctx.beginPath();ctx.moveTo(-25,7);ctx.lineTo(-25,-47);ctx.quadraticCurveTo(0,-61,25,-47);ctx.lineTo(25,7);ctx.closePath();ctx.fill();
  ctx.strokeStyle="#ffe6a4";ctx.lineWidth=3;ctx.stroke();
  ctx.fillStyle="#e9c878";ctx.beginPath();ctx.moveTo(-34,-47);ctx.lineTo(-27,-64);ctx.lineTo(-12,-54);ctx.lineTo(0,-82);ctx.lineTo(12,-54);ctx.lineTo(27,-64);ctx.lineTo(34,-47);ctx.lineTo(24,-40);ctx.lineTo(-24,-40);ctx.closePath();ctx.fill();ctx.strokeStyle="#fff1c4";ctx.lineWidth=1.5;ctx.stroke();
  for(const side of [-1,1]){ctx.fillStyle="#b98c48";ctx.fillRect(side*26-5,-18,10,32);ctx.fillStyle="#f5dc98";ctx.beginPath();ctx.arc(side*31,-23,6,0,Math.PI*2);ctx.fill();}
  ctx.fillStyle="#a72f35";ctx.fillRect(-25,4,50,9);ctx.fillStyle="#f5d78d";ctx.fillRect(-32,12,64,5);
  ctx.fillStyle="#d9b56a";ctx.fillRect(-27,18,7,13);ctx.fillRect(20,18,7,13);
  ctx.fillStyle="#f5e0a6";ctx.beginPath();ctx.arc(0,-70,4+Math.sin(time*.004)*1,0,Math.PI*2);ctx.fill();
 }else{
  ctx.fillStyle="#59452f";ctx.fillRect(-15,8,4,17);ctx.fillRect(11,8,4,17);ctx.fillRect(-17,21,34,3);
  ctx.fillStyle=tone;ctx.beginPath();ctx.moveTo(-17,8);ctx.lineTo(-17,-27);ctx.quadraticCurveTo(0,-39,17,-27);ctx.lineTo(17,8);ctx.closePath();ctx.fill();
  ctx.strokeStyle=scale>.72?"#e8cf91":"#cdbb8b";ctx.lineWidth=scale>.72?2:1.3;ctx.stroke();
  ctx.fillStyle="rgba(255,235,184,.18)";ctx.beginPath();ctx.moveTo(-12,4);ctx.lineTo(-12,-24);ctx.quadraticCurveTo(0,-32,12,-24);ctx.lineTo(12,4);ctx.closePath();ctx.fill();
  ctx.fillStyle="#b99457";ctx.fillRect(-22,-3,7,6);ctx.fillRect(15,-3,7,6);ctx.fillRect(-20,1,4,13);ctx.fillRect(16,1,4,13);
  ctx.fillStyle="#f5dfaa";ctx.globalAlpha=.5+Math.sin(time*.002+phase)*.08;ctx.beginPath();ctx.arc(-18,-5,3,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(18,-5,3,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
  ctx.fillStyle="#d8bd83";ctx.beginPath();ctx.moveTo(-18,7);ctx.quadraticCurveTo(0,2,18,7);ctx.lineTo(15,14);ctx.lineTo(-15,14);ctx.closePath();ctx.fill();
 }
 ctx.restore();
}

function drawCrowd(time) {
  drawVIPChair(550, 672, 1.38, "#762f32", time, 0);
  drawFormalSpectator(550, 662, 1.18, "master", time, 0);
  drawRoleLabel(550, 615, "CHƯỞNG MÔN", "#f2d17d", 1.1);

  const elders = [
    [58,696],[145,689],[232,684],[319,689],[406,696],[475,699],
    [625,699],[694,696],[781,689],[868,684],[955,689],[1042,696]
  ];
  elders.forEach(([x,y],i) => {
    drawVIPChair(x,y,.86,"#5b456b",time,i);
    drawFormalSpectator(x,y-7,.78,"elder",time,i*.8);
  });
  drawRoleLabel(260,642,"TRƯỞNG LÃO","#d4b5fa",.95);
  drawRoleLabel(840,642,"TRƯỞNG LÃO","#d4b5fa",.95);

  const disciples = [
    [385,650],[440,650],[495,650],[605,650],[660,650],[715,650],
    [412,713],[474,713],[626,713],[688,713]
  ];
  disciples.forEach(([x,y],i) => {
    drawVIPChair(x,y,.72,"#405d82",time,i*.7);
    drawFormalSpectator(x,y-8,.69,"disciple",time,i);
  });
  drawRoleLabel(550,608,"CHÂN TRUYỀN ĐỆ TỬ","#a9c9f0",.92);

  const rows = [
    {y:748,count:35,x:4,step:32,scale:.62,role:"servant"},
    {y:773,count:36,x:-3,step:31,scale:.58,role:"outer"},
    {y:796,count:37,x:-8,step:30,scale:.52,role:"inner"}
  ];
  rows.forEach((row,ri) => {
    for(let i=0;i<row.count;i++) {
      drawSpectator(row.x+i*row.step+(i%2)*6,
        row.y+Math.sin(time*.002+i+ri)*1.6,
        row.scale,row.role,time,i*.57+ri);
    }
  });
  drawCrowdFlag(12,728,"#a53f36",time);
  drawCrowdFlag(W-18,728,"#b18a43",time);
}

// Hồ và sông nhập thành một lòng nước liên tục; gợn ngắn theo dòng chảy.
function drawMountainStream(time) {
  ctx.save(); ctx.lineJoin = "round"; ctx.lineCap = "round";
  const basin = () => {
    ctx.beginPath();
    ctx.moveTo(-100,485);
    ctx.bezierCurveTo(-55,430,35,418,125,450);
    ctx.bezierCurveTo(190,474,210,500,280,506);
    ctx.bezierCurveTo(410,520,485,492,590,505);
    ctx.bezierCurveTo(700,518,810,493,890,500);
    ctx.bezierCurveTo(965,505,990,470,1055,445);
    ctx.bezierCurveTo(1125,420,1190,455,1210,505);
    ctx.lineTo(1210,570);
    ctx.bezierCurveTo(1080,590,1000,560,900,555);
    ctx.bezierCurveTo(780,550,690,576,570,560);
    ctx.bezierCurveTo(440,545,350,575,240,555);
    ctx.bezierCurveTo(130,540,20,580,-100,550);
    ctx.closePath();
  };
  ctx.fillStyle = "#344d3c"; basin(); ctx.fill();
  ctx.save(); basin(); ctx.clip();
  const water = ctx.createLinearGradient(0,425,0,580);
  water.addColorStop(0,"#b7e8d5"); water.addColorStop(.22,"#70c4bb");
  water.addColorStop(.56,"#348e96"); water.addColorStop(1,"#175c69");
  ctx.fillStyle = water; ctx.fillRect(-100,410,1300,190);

  for(let i=0;i<34;i++) {
    const x=((i*53+time*.085)%1370)-130;
    const y=520+Math.sin(x*.007)*12+Math.sin(i*1.7)*7;
    ctx.strokeStyle=i%4===0?"rgba(242,255,246,.66)":"rgba(205,246,231,.34)";
    ctx.lineWidth=i%5===0?2.4:1.15;
    ctx.beginPath(); ctx.moveTo(x,y);
    ctx.bezierCurveTo(x+8,y-3,x+17,y+3,x+28,y); ctx.stroke();
  }
  for(let i=0;i<13;i++) {
    const x=80+i*78+Math.sin(time*.001+i)*5, y=466+(i%3)*23;
    ctx.strokeStyle="rgba(235,255,246,.32)"; ctx.lineWidth=1.2;
    ctx.beginPath(); ctx.moveTo(x,y); ctx.quadraticCurveTo(x+12,y-2,x+23,y+1); ctx.stroke();
  }
  ctx.restore();

  // Đá cuội chỉ nằm trên bờ, chìm một phần vào nền đất.
  for(let i=0;i<8;i++) {
    const side=i%2?1:-1, x=i*54-30;
    const y=side<0?428+Math.sin(i*1.4)*4:586+Math.sin(i*1.1)*4;
    const r=7+(i%4)*2;
    ctx.fillStyle="rgba(23,43,34,.35)";
    ctx.beginPath(); ctx.ellipse(x+2,y+4,r*1.5,r*.55,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=i%3?"#777b65":"#a19b78";
    ctx.beginPath(); ctx.moveTo(x-r,y+3); ctx.lineTo(x-r*.7,y-r*.65);
    ctx.lineTo(x+r*.2,y-r); ctx.lineTo(x+r,y-r*.25);
    ctx.lineTo(x+r*.8,y+4); ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}

// Thác có vách đá ôm dòng, màn nước nhiều lớp và sương ở chân thác.
function drawLinkedCascade(x, topY, bottomY, width, time, side) {
  ctx.save();
  const mid=(topY+bottomY)/2, drift=Math.sin(time*.0013+side)*2.2;
  ctx.fillStyle="#304a3b"; ctx.beginPath();
  ctx.moveTo(x-width*2.1,topY-12); ctx.lineTo(x-width*.9,topY+4);
  ctx.lineTo(x-width*1.12,mid); ctx.lineTo(x-width*1.55,bottomY+16);
  ctx.lineTo(x+width*1.55,bottomY+16); ctx.lineTo(x+width*1.12,mid);
  ctx.lineTo(x+width*.9,topY+4); ctx.lineTo(x+width*2.1,topY-12);
  ctx.closePath(); ctx.fill();

  ctx.fillStyle="#64765a"; ctx.beginPath();
  ctx.moveTo(x-width*1.45,topY+5); ctx.lineTo(x-width*.75,topY-3);
  ctx.lineTo(x+width*.8,topY-2); ctx.lineTo(x+width*1.5,topY+7);
  ctx.lineTo(x+width*.85,topY+12); ctx.lineTo(x-width*.85,topY+12);
  ctx.closePath(); ctx.fill();

  const sheet=ctx.createLinearGradient(x-width,0,x+width,0);
  sheet.addColorStop(0,"rgba(36,105,117,.92)");
  sheet.addColorStop(.18,"rgba(111,194,195,.94)");
  sheet.addColorStop(.43,"rgba(225,255,243,.96)");
  sheet.addColorStop(.7,"rgba(118,202,197,.93)");
  sheet.addColorStop(1,"rgba(35,103,116,.94)");
  ctx.fillStyle=sheet; ctx.beginPath();
  ctx.moveTo(x-width*.72,topY+5);
  ctx.bezierCurveTo(x-width*.54,mid,x-width*.94+drift,bottomY-20,x-width*1.35,bottomY);
  ctx.quadraticCurveTo(x,bottomY+13,x+width*1.32,bottomY);
  ctx.bezierCurveTo(x+width*.86+drift,mid,x+width*.63,topY+4,x+width*.72,topY+5);
  ctx.closePath(); ctx.fill();

  for(let i=0;i<8;i++) {
    const px=x-width*.58+i*width*.165, offset=(time*(.035+(i%3)*.009)+i*11)%42;
    ctx.strokeStyle=i%3===0?"rgba(255,255,245,.78)":"rgba(35,102,111,.24)";
    ctx.lineWidth=i%3===0?2.2:4;
    ctx.beginPath(); ctx.moveTo(px,topY+8+offset*.15);
    ctx.bezierCurveTo(px-4,mid,px+4,bottomY-22,px+drift,bottomY-2); ctx.stroke();
  }
  ctx.strokeStyle="rgba(239,255,247,.7)"; ctx.lineWidth=2; ctx.beginPath();
  ctx.moveTo(x-width*.66,topY+7);
  ctx.bezierCurveTo(x-width*.5,mid,x-width*.7,bottomY-12,x-width*1.1,bottomY);
  ctx.moveTo(x+width*.66,topY+7);
  ctx.bezierCurveTo(x+width*.5,mid,x+width*.7,bottomY-12,x+width*1.1,bottomY);
  ctx.stroke();

  const mist=ctx.createRadialGradient(x,bottomY,2,x,bottomY,width*2.6);
  mist.addColorStop(0,"rgba(239,255,248,.46)"); mist.addColorStop(1,"rgba(239,255,248,0)");
  ctx.fillStyle=mist; ctx.fillRect(x-width*3,bottomY-24,width*6,55);

  for(let i=0;i<15;i++) {
    const px=x+Math.sin(time*.002+i*1.7)*width*1.25;
    const py=bottomY+Math.cos(i*2.1)*3;
    ctx.fillStyle="rgba(246,255,250,"+(.38+(i%4)*.1)+")";
    ctx.beginPath(); ctx.ellipse(px,py,3+(i%4)*2,1.5+(i%2),0,0,Math.PI*2); ctx.fill();
  }
  ctx.restore();
}

function drawSpiritBirds(time){
 const flocks=[
  {dir:1,y:66,s:.55,speed:.000018,phase:.1,count:2},
  {dir:-1,y:118,s:.43,speed:.000014,phase:.55,count:2}
 ];
 flocks.forEach((f,k)=>{
  for(let j=0;j<f.count;j++){
   const p=(time*f.speed+f.phase+j*.48)%1;
   const x=f.dir>0?-75+p*(W+150):W+75-p*(W+150);
   const y=f.y+Math.sin(time*.00055+j*1.7+k)*5;
   const flap=Math.sin(time*.002+j*1.8+k)*.7;
   ctx.save();ctx.translate(x,y);ctx.scale(f.dir*f.s,f.s);
   ctx.fillStyle="#fffdf0";ctx.beginPath();ctx.ellipse(0,0,18,5,-.05,0,Math.PI*2);ctx.fill();
   ctx.strokeStyle="#fffdf0";ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();
   ctx.moveTo(12,-1);ctx.quadraticCurveTo(23,-12,21,-23);ctx.stroke();
   ctx.fillStyle="#fffdf0";ctx.beginPath();ctx.arc(20,-24,3.5,0,Math.PI*2);ctx.fill();
   ctx.fillStyle="#c94d3e";ctx.beginPath();ctx.moveTo(23,-24);ctx.lineTo(32,-22);ctx.lineTo(23,-20);ctx.closePath();ctx.fill();
   ctx.fillStyle="#fffdf5";ctx.beginPath();ctx.moveTo(-5,0);ctx.quadraticCurveTo(-22,-21-flap*5,-53,-20-flap*6);ctx.quadraticCurveTo(-36,6,-5,6);ctx.closePath();ctx.fill();
   ctx.beginPath();ctx.moveTo(-5,3);ctx.quadraticCurveTo(-22,13+flap*3,-42,20+flap*4);ctx.quadraticCurveTo(-25,11,-5,6);ctx.closePath();ctx.fill();
   ctx.strokeStyle="#b94c40";ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(-3,4);ctx.lineTo(-7,16);ctx.moveTo(5,4);ctx.lineTo(7,16);ctx.stroke();
   ctx.restore();
  }
 });
}

function drawScenery(time) {
  drawSky(time); drawMountainRange(); drawMovingClouds(time);
  drawSpiritBirds(time);
  drawFloatingPlatform(230,350,.46); drawPalace(230,310,.43,false);
  drawFloatingPlatform(430,270,.43); drawPalace(430,230,.40,false);
  drawFloatingPlatform(675,325,.48); drawPalace(675,279,.44,false);
  drawFloatingPlatform(865,285,.43); drawPalace(865,245,.40,false);
  drawFloatingPlatform(540,420,.36); drawPalace(540,386,.33,false);
  drawTempleAuras(time);
  drawMountainStream(time);
  drawLinkedCascade(72,285,510,30,time,.2);
  drawLinkedCascade(1028,260,510,34,time,1.4);
  drawPine(175,440,.72,"#315b45"); drawTree(205,456,.58,"#426b4c");
  drawPine(355,455,.62,"#315b45"); drawTree(470,455,.54,"#426b4c");
  drawPine(740,455,.66,"#315b45"); drawTree(815,454,.58,"#426b4c");
  drawPine(930,440,.7,"#315b45");
  drawRiver(time); drawCrowd(time);
}


// REVISION 9 — tiên khí quanh VIP, đàn hạc bay theo quỹ đạo sơn mạch.
function drawVIPAura(x,y,radius,color,time,phase,intensity){
  ctx.save();
  const pulse=1+Math.sin(time*.0017+phase)*.08;
  const glow=ctx.createRadialGradient(x,y-10,1,x,y-10,radius*pulse);
  glow.addColorStop(0,color+"35");glow.addColorStop(.55,color+"12");glow.addColorStop(1,color+"00");
  ctx.fillStyle=glow;ctx.fillRect(x-radius,y-radius,radius*2,radius*2);
  for(let i=0;i<Math.round(9*intensity);i++){
    const a=time*.00045+phase+i*2.399,orbit=radius*(.22+((i*13)%19)/25);
    const px=x+Math.cos(a)*orbit,py=y-8+Math.sin(a*1.15)*orbit*.48;
    ctx.globalAlpha=.25+.65*(.55+.45*Math.sin(time*.003+i*1.7+phase)**2);
    ctx.fillStyle=color;ctx.beginPath();ctx.arc(px,py,1+(i%3)*.45,0,Math.PI*2);ctx.fill();
  }
  ctx.restore();
}

// Đệ tử phổ thông đứng chung một khu vực, phân tầng bằng y phục và linh khí.
const discipleCrowdLayout = (() => {
  const fixed = new Map([
    [39, "core"], [40, "core"], [41, "core"],
    [11, "inner"], [12, "inner"], [14, "inner"], [15, "inner"],
    [38, "inner"], [42, "inner"], [65, "inner"], [66, "inner"]
  ]);
  const pool = [...Array(48).fill("servant"), ...Array(22).fill("outer")];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return Array.from({ length: 81 }, (_, i) => {
    const role = fixed.get(i) || pool.shift();
    const row = Math.floor(i / 27), col = i % 27;
    const scale = role === "core" ? .57 : role === "inner" ? .53 : role === "outer" ? .50 : .47;
    return { x: 20 + col * 41, y: [722, 752, 782][row], role, scale };
  });
})();

function drawCrowd(time){
  const disciples=Array.from({length:10},(_,i)=>[80+i*40,680]);
  disciples.forEach(([x,y],i)=>{
    drawVIPAura(x,y-13,29,"#a9d7ff",time,i,.42);
    drawVIPChair(x,y,.58,"#405d82",time,i*.65);
    drawFormalSpectator(x,y-8,.58,"disciple",time,i);
  });
  drawRoleLabel(260,632,"CHÂN TRUYỀN ĐỆ TỬ","#a9c9f0",.92);

  drawVIPAura(550,650,120,"#ffe5a0",time,.4,1);
  drawVIPAura(550,650,82,"#fff0bf",time,1.8,.9);
  drawVIPChair(550,674,1.38,"#762f32",time,0);
  drawFormalSpectator(550,662,1.16,"master",time,0);
  drawRoleLabel(550,606,"CHƯỞNG MÔN","#f2d17d",1.1);

  const elders=Array.from({length:10},(_,i)=>[660+i*40,680]);
  elders.forEach(([x,y],i)=>{
    drawVIPAura(x,y-12,36,"#d7baff",time,i*.75,.55);
    drawVIPChair(x,y,.60,"#5b456b",time,i);
    drawFormalSpectator(x,y-8,.60,"elder",time,i*.8);
  });
  drawRoleLabel(860,632,"TRƯỞNG LÃO","#d4b5fa",.92);

  // Ba hàng đệ tử xen kẽ; nòng cốt ít người ở trung tâm và được các cấp bao quanh.
  discipleCrowdLayout.forEach((p,i)=>{
    const sway=Math.sin(time*.002+i*.8)*1.35;
    drawSpectator(p.x,p.y+sway,p.scale,p.role,time,i*.57);
  });
  drawCrowdFlag(12,710,"#a53f36",time);
  drawCrowdFlag(W-18,710,"#b18a43",time);
}
function drawSpiritBirds(time){
 const flocks=[
  {dir:1,y:66,s:.55,speed:.000018,phase:.1,count:2},
  {dir:-1,y:118,s:.43,speed:.000014,phase:.55,count:2}
 ];
 flocks.forEach((f,k)=>{
  for(let j=0;j<f.count;j++){
   const p=(time*f.speed+f.phase+j*.48)%1;
   const x=f.dir>0?-75+p*(W+150):W+75-p*(W+150);
   const y=f.y+Math.sin(time*.00055+j*1.7+k)*5;
   const flap=Math.sin(time*.002+j*1.8+k)*.7;
   ctx.save();ctx.translate(x,y);ctx.scale(f.dir*f.s,f.s);
   ctx.fillStyle="#fffdf0";ctx.beginPath();ctx.ellipse(0,0,18,5,-.05,0,Math.PI*2);ctx.fill();
   ctx.strokeStyle="#fffdf0";ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();
   ctx.moveTo(12,-1);ctx.quadraticCurveTo(23,-12,21,-23);ctx.stroke();
   ctx.fillStyle="#fffdf0";ctx.beginPath();ctx.arc(20,-24,3.5,0,Math.PI*2);ctx.fill();
   ctx.fillStyle="#c94d3e";ctx.beginPath();ctx.moveTo(23,-24);ctx.lineTo(32,-22);ctx.lineTo(23,-20);ctx.closePath();ctx.fill();
   ctx.fillStyle="#fffdf5";ctx.beginPath();ctx.moveTo(-5,0);ctx.quadraticCurveTo(-22,-21-flap*5,-53,-20-flap*6);ctx.quadraticCurveTo(-36,6,-5,6);ctx.closePath();ctx.fill();
   ctx.beginPath();ctx.moveTo(-5,3);ctx.quadraticCurveTo(-22,13+flap*3,-42,20+flap*4);ctx.quadraticCurveTo(-25,11,-5,6);ctx.closePath();ctx.fill();
   ctx.strokeStyle="#b94c40";ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(-3,4);ctx.lineTo(-7,16);ctx.moveTo(5,4);ctx.lineTo(7,16);ctx.stroke();
   ctx.restore();
  }
 });
}
function drawTempleAuras(time){
  const sites=[[230,310,72,.2],[430,230,62,1.3],[675,279,78,2.4],[865,245,66,3.5],[540,386,54,4.4]];
  sites.forEach(([x,y,r,p])=>{
    ctx.save();
    const glow=ctx.createRadialGradient(x,y-15,2,x,y-15,r);
    glow.addColorStop(0,"rgba(255,230,172,.18)");glow.addColorStop(.5,"rgba(169,225,222,.08)");glow.addColorStop(1,"rgba(169,225,222,0)");
    ctx.fillStyle=glow;ctx.fillRect(x-r,y-r,r*2,r*2);
    for(let i=0;i<34;i++){
      const a=time*.00022+p+i*2.399,orbit=r*(.2+((i*17)%29)/34);
      const px=x+Math.cos(a)*orbit,py=y-14+Math.sin(a*1.19)*orbit*.48;
      ctx.globalAlpha=.18+.55*Math.pow(Math.sin(time*.002+i+p),2);
      ctx.fillStyle=i%4===0?"#fff0bc":"#bde9dc";
      ctx.beginPath();ctx.arc(px,py,1+(i%3)*.4,0,Math.PI*2);ctx.fill();
    }
    ctx.restore();
  });
}

// Cổng tiên môn có mặt trước, mặt bên và hai trụ nghiêng theo phối cảnh.
function drawImmortalFinishGate(){
 const x=TRACK.right,ground=TRACK.bottom+27,top=TRACK.top-57,bottom=TRACK.bottom;
 ctx.save();
 const aura=ctx.createRadialGradient(x,top+70,4,x,top+70,165);aura.addColorStop(0,"rgba(255,231,160,.34)");aura.addColorStop(1,"rgba(255,231,160,0)");
 ctx.fillStyle=aura;ctx.fillRect(x-170,top-55,340,260);
 ctx.fillStyle="rgba(24,45,31,.42)";ctx.beginPath();ctx.moveTo(x-86,ground);ctx.lineTo(x+72,ground-9);ctx.lineTo(x+105,ground+8);ctx.lineTo(x-55,ground+18);ctx.closePath();ctx.fill();
 const posts=[{bx:x-50,tx:x-42,by:ground,ty:top+35,w:17,d:11},{bx:x+45,tx:x+37,by:ground-9,ty:top+40,w:15,d:10}];
 posts.forEach(p=>{
  const grad=ctx.createLinearGradient(p.tx-p.w/2,0,p.tx+p.w/2,0);grad.addColorStop(0,"#5c402c");grad.addColorStop(.3,"#f0d99b");grad.addColorStop(.68,"#b58b4d");grad.addColorStop(1,"#4b382a");
  ctx.fillStyle=grad;ctx.beginPath();ctx.moveTo(p.tx-p.w/2,p.ty);ctx.lineTo(p.tx+p.w/2,p.ty+2);ctx.lineTo(p.bx+p.w/2,p.by);ctx.lineTo(p.bx-p.w/2,p.by-5);ctx.closePath();ctx.fill();ctx.strokeStyle="#f1d28b";ctx.lineWidth=1.6;ctx.stroke();
  ctx.fillStyle="#503a2a";ctx.beginPath();ctx.moveTo(p.tx+p.w/2,p.ty+2);ctx.lineTo(p.tx+p.w/2+p.d,p.ty-3);ctx.lineTo(p.bx+p.w/2+p.d,p.by-5);ctx.lineTo(p.bx+p.w/2,p.by);ctx.closePath();ctx.fill();
  ctx.fillStyle="#8c673b";ctx.beginPath();ctx.moveTo(p.bx-p.w,p.by-8);ctx.lineTo(p.bx+p.w,p.by-6);ctx.lineTo(p.bx+p.w*1.4,p.by+5);ctx.lineTo(p.bx-p.w*.8,p.by+3);ctx.closePath();ctx.fill();
  ctx.fillStyle="#e8cb83";ctx.beginPath();ctx.arc(p.tx,p.ty-7,4,0,Math.PI*2);ctx.fill();
 });
 // Vòm đá cong với nhiều lớp viền kim loại.
 ctx.beginPath();ctx.moveTo(x-65,top+35);ctx.bezierCurveTo(x-58,top-18,x-24,top-35,x,top-35);ctx.bezierCurveTo(x+24,top-35,x+58,top-18,x+65,top+35);
 ctx.strokeStyle="#50382a";ctx.lineWidth=19;ctx.stroke();ctx.strokeStyle="#e9c77b";ctx.lineWidth=9;ctx.stroke();ctx.strokeStyle="rgba(255,245,193,.9)";ctx.lineWidth=2;ctx.stroke();
 // Mái ngói nhiều tầng và đầu đao chạm hoa văn.
 for(let layer=0;layer<2;layer++){
  const off=layer*9;ctx.fillStyle=layer?"#8d6338":"#47382e";ctx.beginPath();ctx.moveTo(x-82-off,top+25+off);ctx.quadraticCurveTo(x,top-58+off,x+82+off,top+25+off);ctx.lineTo(x+65+off,top+34+off);ctx.quadraticCurveTo(x,top-34+off,x-65-off,top+34+off);ctx.closePath();ctx.fill();
  ctx.strokeStyle=layer?"#f4d991":"#e8c87d";ctx.lineWidth=layer?2:4;ctx.beginPath();ctx.moveTo(x-82-off,top+25+off);ctx.quadraticCurveTo(x,top-58+off,x+82+off,top+25+off);ctx.stroke();
 }
 for(const side of [-1,1]){
  ctx.strokeStyle="#f2d58e";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+side*70,top+24);ctx.quadraticCurveTo(x+side*91,top+4,x+side*98,top-9);ctx.stroke();
  ctx.fillStyle="#e8c77b";ctx.beginPath();ctx.moveTo(x+side*98,top-9);ctx.lineTo(x+side*112,top-16);ctx.lineTo(x+side*105,top-2);ctx.closePath();ctx.fill();
 }
 // Biển hiệu chạm viền vàng, ngọc hai bên và chữ phát sáng.
 const plaque=ctx.createLinearGradient(x-60,top-7,x+60,top+30);plaque.addColorStop(0,"#582c29");plaque.addColorStop(.5,"#a65a38");plaque.addColorStop(1,"#512a29");
 ctx.fillStyle=plaque;ctx.beginPath();ctx.moveTo(x-58,top-1);ctx.lineTo(x-49,top-10);ctx.lineTo(x+49,top-10);ctx.lineTo(x+58,top-1);ctx.lineTo(x+53,top+27);ctx.lineTo(x-53,top+27);ctx.closePath();ctx.fill();
 ctx.strokeStyle="#f8df9c";ctx.lineWidth=3;ctx.stroke();ctx.strokeStyle="rgba(255,246,203,.8)";ctx.lineWidth=1;ctx.strokeRect(x-44,top-5,88,22);
 ctx.fillStyle="#ffe9ad";ctx.font="bold 15px Georgia";ctx.textAlign="center";ctx.textBaseline="middle";ctx.shadowColor="#ffe4a0";ctx.shadowBlur=13;ctx.fillText("TIÊN MÔN",x,top+8);ctx.shadowBlur=0;
 for(const side of [-1,1]){ctx.fillStyle="#fff0b7";ctx.beginPath();ctx.moveTo(x+side*58,top+4);ctx.lineTo(x+side*68,top+9);ctx.lineTo(x+side*58,top+15);ctx.lineTo(x+side*49,top+9);ctx.closePath();ctx.fill();}
 ctx.fillStyle="#a8f3e7";ctx.shadowColor="#9ff7ec";ctx.shadowBlur=14;ctx.beginPath();ctx.arc(x,top-19,4,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
 const rune="✦";ctx.fillStyle="#ffe7a2";ctx.font="bold 13px Georgia";ctx.fillText(rune,x-34,top+8);ctx.fillText(rune,x+34,top+8);
 const light=ctx.createLinearGradient(0,top+45,0,bottom-20);light.addColorStop(0,"rgba(255,245,190,.05)");light.addColorStop(.5,"rgba(255,238,166,.82)");light.addColorStop(1,"rgba(255,245,190,.05)");
 ctx.fillStyle=light;ctx.fillRect(x-1,top+45,2,bottom-top-65);
 ctx.strokeStyle="rgba(255,224,145,.5)";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x-13,top+48);ctx.lineTo(x-13,bottom-18);ctx.moveTo(x+13,top+48);ctx.lineTo(x+13,bottom-18);ctx.stroke();
 ctx.restore();
}


// REVISION 15 — 14 công trình tiên môn, mỗi nơi có kiến trúc và pháp khí nhận diện riêng.
function drawSectPavilion(x,y,scale,title,type,accent){
 ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);
 const gold="#e7c77c",rg=ctx.createLinearGradient(-65,-125,65,-55);
 rg.addColorStop(0,accent);rg.addColorStop(.5,"#29433e");rg.addColorStop(1,"#182b2b");
 // Không vẽ vòng bóng hoặc quầng tròn bên dưới lầu các.
 ctx.fillStyle="#553a2a";ctx.fillRect(-47,-74,94,67);
 ctx.fillStyle="#26332e";ctx.fillRect(-30,-63,60,53);
 ctx.fillStyle="#765137";ctx.fillRect(-25,-58,50,48);
 ctx.fillStyle="#17211e";ctx.fillRect(-16,-52,32,42);
 ctx.fillStyle="#d5b16c";ctx.fillRect(-50,-75,100,5);ctx.fillRect(-52,-10,104,4);
 for(const px of [-42,-28,28,42]){
  const g=ctx.createLinearGradient(px-3,0,px+3,0);g.addColorStop(0,"#493126");g.addColorStop(.5,"#e3c27b");g.addColorStop(1,"#503528");
  ctx.fillStyle=g;ctx.fillRect(px-3,-76,6,69);ctx.strokeStyle="#f0d28b";ctx.lineWidth=1;ctx.strokeRect(px-3,-76,6,69);
  ctx.fillStyle=gold;ctx.fillRect(px-5,-48,10,2);ctx.fillRect(px-5,-27,10,2);
 }
 const lamp=ctx.createRadialGradient(0,-35,1,0,-35,34);lamp.addColorStop(0,"rgba(255,224,143,.48)");lamp.addColorStop(1,"rgba(255,224,143,0)");
 ctx.fillStyle=lamp;ctx.fillRect(-36,-72,72,65);ctx.fillStyle="#201c19";ctx.fillRect(-13,-47,26,38);ctx.fillStyle=gold;ctx.fillRect(-15,-49,30,3);
 function roof(yy,w,h,upper){
  ctx.fillStyle="#493329";ctx.beginPath();ctx.moveTo(-w*.68,yy+3);ctx.quadraticCurveTo(-w*.43,yy-h*.72,-w*.12,yy-h*.88);ctx.quadraticCurveTo(0,yy-h*1.08,w*.12,yy-h*.88);ctx.quadraticCurveTo(w*.43,yy-h*.72,w*.68,yy+3);ctx.lineTo(w*.49,yy-2);ctx.quadraticCurveTo(0,yy-h*.73,-w*.49,yy-2);ctx.closePath();ctx.fill();
  ctx.fillStyle=rg;ctx.beginPath();ctx.moveTo(-w*.72,yy);ctx.quadraticCurveTo(-w*.43,yy-h*.83,-w*.12,yy-h*.94);ctx.quadraticCurveTo(0,yy-h*1.14,w*.12,yy-h*.94);ctx.quadraticCurveTo(w*.43,yy-h*.83,w*.72,yy);ctx.quadraticCurveTo(w*.5,yy-5,0,yy-h*.8);ctx.quadraticCurveTo(-w*.5,yy-5,-w*.72,yy);ctx.closePath();ctx.fill();ctx.strokeStyle=gold;ctx.lineWidth=2.4;ctx.stroke();
  ctx.strokeStyle="rgba(255,238,188,.7)";ctx.lineWidth=.8;for(let k=-3;k<=3;k++){const xx=k*w*.13;ctx.beginPath();ctx.moveTo(xx,yy-h*.86);ctx.lineTo(xx*.78,yy-4);ctx.stroke();}
  for(const side of [-1,1]){ctx.fillStyle="#d7b36d";ctx.beginPath();ctx.moveTo(side*w*.67,yy);ctx.quadraticCurveTo(side*w*.84,yy-8,side*w*.82,yy-20);ctx.lineTo(side*w*.75,yy-13);ctx.lineTo(side*w*.6,yy+2);ctx.closePath();ctx.fill();}
  if(upper){ctx.fillStyle="#f5d991";ctx.beginPath();ctx.moveTo(0,yy-h*1.13);ctx.lineTo(-5,yy-h);ctx.lineTo(0,yy-h*.9);ctx.lineTo(5,yy-h);ctx.closePath();ctx.fill();}
 }
 roof(-72,120,39,false);roof(-108,94,30,true);
 // Tên lầu được vẽ riêng ở tọa độ cố định trong drawSectArchitecture().
 if(type==="treasure"){ctx.strokeStyle="#f5d46f";ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,-25,30,0,Math.PI*2);ctx.stroke();for(const xx of [-22,5]){ctx.fillStyle="#a87932";ctx.fillRect(xx,-25,18,13);ctx.fillStyle="#f4d77d";ctx.fillRect(xx,-29,18,4);}for(const [xx,yy] of [[-13,-42],[12,-44],[0,-54]]){ctx.fillStyle="#8ce9ed";ctx.beginPath();ctx.moveTo(xx,yy-6);ctx.lineTo(xx+4,yy);ctx.lineTo(xx,yy+6);ctx.lineTo(xx-4,yy);ctx.closePath();ctx.fill();}}
 else if(type==="scripture"){for(let i=0;i<4;i++){ctx.fillStyle=["#a64b3e","#557d70","#d5b66f","#536e94"][i];ctx.fillRect(-35+i*18,-54,14,36);ctx.fillStyle="#e7d39a";ctx.fillRect(-33+i*18,-50,10,2);ctx.fillRect(-33+i*18,-42,10,1);}ctx.strokeStyle=gold;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-41,-58);ctx.lineTo(41,-58);ctx.moveTo(-41,-15);ctx.lineTo(41,-15);ctx.stroke();ctx.fillStyle="#f1dfae";ctx.fillRect(-7,-38,14,21);ctx.strokeRect(-7,-38,14,21);}
 else if(type==="herb"){for(let i=0;i<5;i++){const xx=-39+i*19;ctx.strokeStyle="#7c5d35";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(xx,-8);ctx.lineTo(xx,-43-(i%2)*7);ctx.stroke();ctx.fillStyle=i%2?"#77a66c":"#b3c47a";ctx.beginPath();ctx.ellipse(xx-4,-35-(i%2)*7,5,3,-.5,0,Math.PI*2);ctx.ellipse(xx+4,-29-(i%2)*7,5,3,.5,0,Math.PI*2);ctx.fill();}ctx.fillStyle="#74b9a0";ctx.fillRect(-46,-18,12,13);ctx.fillRect(34,-18,12,13);}
 else if(type==="main"){for(let i=0;i<5;i++){ctx.fillStyle="#d5b36d";ctx.fillRect(-31+i*15,-5,12,4);}ctx.fillStyle="#fff0b7";ctx.beginPath();ctx.arc(0,-120,4,0,Math.PI*2);ctx.fill();}
 else if(type==="lecture"){ctx.fillStyle="#f0d89a";ctx.font="bold 10px Arial, sans-serif";ctx.textAlign="center";ctx.lineWidth=3;ctx.strokeStyle="#172522";ctx.strokeText("ĐẠO PHÁP KINH VĂN",0,-48);ctx.fillText("ĐẠO PHÁP KINH VĂN",0,-48);for(let i=0;i<5;i++){ctx.fillStyle="#9a7650";ctx.beginPath();ctx.ellipse(-30+i*15,-7,5,3,0,0,Math.PI*2);ctx.fill();}}
 else if(type==="cave"){ctx.fillStyle="#34433d";ctx.beginPath();ctx.moveTo(-43,-5);ctx.lineTo(-36,-42);ctx.quadraticCurveTo(0,-77,36,-42);ctx.lineTo(43,-5);ctx.closePath();ctx.fill();ctx.fillStyle="#101d1c";ctx.beginPath();ctx.moveTo(-25,-5);ctx.lineTo(-23,-38);ctx.quadraticCurveTo(0,-64,23,-38);ctx.lineTo(25,-5);ctx.closePath();ctx.fill();ctx.strokeStyle="#8ce5d5";ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,-30,27,Math.PI,Math.PI*2);ctx.stroke();ctx.fillStyle="#9ce9e0";ctx.beginPath();ctx.moveTo(-32,-48);ctx.lineTo(-25,-60);ctx.lineTo(-18,-48);ctx.closePath();ctx.fill();}
 else if(type==="tower"){ctx.fillStyle="#315e58";ctx.fillRect(-22,-126,44,51);for(let j=0;j<4;j++){ctx.fillStyle="#3d7169";ctx.fillRect(-26,-119+j*12,52,7);ctx.strokeStyle=gold;ctx.strokeRect(-26,-119+j*12,52,7);}ctx.strokeStyle="#b8fff1";ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,-97,48,10,.12,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.ellipse(0,-75,39,8,-.12,0,Math.PI*2);ctx.stroke();ctx.fillStyle="#d9fff1";ctx.beginPath();ctx.arc(0,-135,5,0,Math.PI*2);ctx.fill();}
 else if(type==="alchemy"){ctx.fillStyle="#35413a";ctx.beginPath();ctx.moveTo(-27,-10);ctx.lineTo(-23,-40);ctx.quadraticCurveTo(0,-55,23,-40);ctx.lineTo(27,-10);ctx.closePath();ctx.fill();ctx.strokeStyle="#e4bc6a";ctx.lineWidth=3;ctx.stroke();ctx.fillStyle="#d95e37";ctx.beginPath();ctx.moveTo(-13,-43);ctx.quadraticCurveTo(-18,-67,0,-74);ctx.quadraticCurveTo(17,-62,11,-43);ctx.fill();ctx.fillStyle="#ffcf70";ctx.beginPath();ctx.moveTo(-6,-44);ctx.quadraticCurveTo(-5,-58,4,-62);ctx.quadraticCurveTo(10,-50,5,-44);ctx.fill();for(let i=0;i<5;i++){ctx.fillStyle="#ffb75c";ctx.fillRect(-30+i*14,-68-(i%2)*8,2,2);}}
 else if(type==="forge"){ctx.fillStyle="#4d4a43";ctx.fillRect(-36,-23,72,15);ctx.fillStyle="#9da2a0";ctx.beginPath();ctx.moveTo(-20,-30);ctx.lineTo(20,-30);ctx.lineTo(29,-24);ctx.lineTo(14,-17);ctx.lineTo(-18,-17);ctx.closePath();ctx.fill();ctx.strokeStyle="#d7a15b";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-8,-47);ctx.lineTo(8,-33);ctx.stroke();ctx.fillStyle="#d9d5c4";ctx.fillRect(3,-53,18,7);for(let i=0;i<7;i++){const q=i*2.399;ctx.fillStyle="#ffc65c";ctx.beginPath();ctx.arc(Math.cos(q)*24,-42+Math.sin(q)*14,1.8,0,Math.PI*2);ctx.fill();}}
 else if(type==="array"){ctx.strokeStyle="#85d7d1";ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,-25,34,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(0,-25,22,0,Math.PI*2);ctx.stroke();for(let i=0;i<8;i++){ctx.save();ctx.translate(0,-25);ctx.rotate(i*Math.PI/4);ctx.fillStyle="#e5ca82";ctx.fillRect(-2,-42,4,11);ctx.restore();}ctx.fillStyle="#8de6e2";ctx.beginPath();ctx.arc(0,-25,7,0,Math.PI*2);ctx.fill();}
 else if(type==="foreign"){for(let i=0;i<4;i++){ctx.fillStyle=["#d9bd7d","#c58c53","#a6c2ae","#d5a5a0"][i];ctx.fillRect(-32+i*19,-51,12,24);}ctx.strokeStyle=gold;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-48,-68);ctx.lineTo(-48,-95);ctx.stroke();ctx.fillStyle="#a94339";ctx.beginPath();ctx.moveTo(-48,-94);ctx.lineTo(-24,-88);ctx.lineTo(-48,-81);ctx.closePath();ctx.fill();}
 else if(type==="academy"){for(let i=0;i<3;i++){ctx.fillStyle="#60452f";ctx.fillRect(-43+i*29,-40,24,31);ctx.fillStyle="#243b37";ctx.fillRect(-38+i*29,-33,14,15);ctx.fillStyle="#d5b36d";ctx.fillRect(-40+i*29,-17,18,2);}ctx.strokeStyle="#c8b27d";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-52,-7);ctx.lineTo(52,-7);ctx.stroke();ctx.strokeStyle="#d9e7e0";ctx.beginPath();ctx.moveTo(-12,-17);ctx.lineTo(11,-47);ctx.moveTo(0,-31);ctx.lineTo(17,-35);ctx.stroke();}
 else if(type==="observatory"){ctx.strokeStyle="#d9c17f";ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(0,-36,34,13,.2,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.ellipse(0,-36,13,34,.2,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.moveTo(-32,-36);ctx.lineTo(32,-36);ctx.moveTo(0,-69);ctx.lineTo(0,-3);ctx.stroke();ctx.fillStyle="#9be7f2";ctx.beginPath();ctx.arc(0,-36,6,0,Math.PI*2);ctx.fill();for(let i=0;i<8;i++){const q=i*Math.PI/4;ctx.fillStyle="#fff0b2";ctx.beginPath();ctx.arc(Math.cos(q)*44,-36+Math.sin(q)*22,2,0,Math.PI*2);ctx.fill();}}
 else if(type==="guardian"){ctx.strokeStyle="#8bd9ec";ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,-20,55,15,0,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.ellipse(0,-20,39,10,0,0,Math.PI*2);ctx.stroke();ctx.fillStyle="#5a766e";ctx.fillRect(-8,-82,16,68);ctx.fillStyle="#a8e6e6";ctx.beginPath();ctx.moveTo(0,-105);ctx.lineTo(9,-83);ctx.lineTo(0,-65);ctx.lineTo(-9,-83);ctx.closePath();ctx.fill();for(let i=0;i<6;i++){ctx.save();ctx.rotate(i*Math.PI/3);ctx.strokeStyle="#e8d28e";ctx.beginPath();ctx.moveTo(0,-22);ctx.lineTo(0,-53);ctx.stroke();ctx.restore();}}
 ctx.restore();
}
function drawSectArchitecture(time){
 const buildings=[
  [165,175,.34,"TỤ LINH THÁP","tower","#39766e"],
  [365,175,.34,"TÀNG KINH CÁC","scripture","#8c6043"],
  [565,175,.34,"TÀNG BẢO CÁC","treasure","#b68a43"],
  [765,175,.34,"QUAN TINH LÂU","observatory","#536c91"],
  [955,175,.34,"BÁCH THẢO CÁC","herb","#648653"],
  [205,300,.34,"GIẢNG ĐẠO CÁC","lecture","#577d83"],
  [405,300,.34,"ĐAN CÁC","alchemy","#9e543b"],
  [550,300,.62,"LĂNG TIÊU CHÍNH ĐIỆN","main","#9d4939"],
  [695,300,.34,"LUYỆN KHÍ ĐIỆN","forge","#82604a"],
  [895,300,.34,"QUAN TINH ĐÀI","observatory","#536c91"],
  [165,410,.30,"BẾ QUAN ĐỘNG PHỦ","cave","#536b62"],
  [355,410,.30,"ĐỆ TỬ VIỆN","academy","#66817a"],
  [550,410,.30,"TRẬN PHÁP CÁC","array","#4f7b83"],
  [745,410,.30,"HỘ SƠN TRẬN CÁC","guardian","#527e88"],
  [935,410,.30,"NGOẠI VỤ ĐIỆN","foreign","#916c48"]
 ];
 buildings.forEach(([x,y,s,title,type,accent])=>{
  drawSectMountainLedge(x,y,s);
  drawSectPavilion(x,y-5,s,title,type,accent);
 });
}
function drawCascadeCliff(x,topY,bottomY,width,time){
 ctx.save();ctx.lineJoin="round";
 const outer=width*3.2,mid=topY+(bottomY-topY)*.48;
 const rock=ctx.createLinearGradient(x-outer,topY,x+outer,bottomY);
 rock.addColorStop(0,"#536b57");rock.addColorStop(.45,"#344f43");rock.addColorStop(1,"#1d3b35");
 ctx.fillStyle=rock;ctx.beginPath();
 ctx.moveTo(x-outer,bottomY);ctx.lineTo(x-outer*.88,mid+30);
 ctx.lineTo(x-outer*.55,topY+72);ctx.lineTo(x-outer*.28,topY+18);
 ctx.lineTo(x-outer*.08,topY-62);ctx.lineTo(x+outer*.25,topY-28);
 ctx.lineTo(x+outer*.48,topY+42);ctx.lineTo(x+outer*.82,mid-8);
 ctx.lineTo(x+outer,bottomY);ctx.closePath();ctx.fill();
 ctx.strokeStyle="rgba(190,211,168,.45)";ctx.lineWidth=3;ctx.beginPath();
 ctx.moveTo(x-outer*.55,topY+72);ctx.lineTo(x-outer*.28,topY+18);ctx.lineTo(x-outer*.08,topY-62);
 ctx.lineTo(x+outer*.25,topY-28);ctx.lineTo(x+outer*.48,topY+42);ctx.stroke();
 ctx.fillStyle="#80916b";ctx.beginPath();
 ctx.moveTo(x-outer*.48,topY+60);ctx.lineTo(x-outer*.25,topY+18);
 ctx.lineTo(x-outer*.06,topY-55);ctx.lineTo(x+outer*.20,topY-22);
 ctx.lineTo(x+outer*.42,topY+46);ctx.lineTo(x+outer*.18,topY+30);
 ctx.lineTo(x-outer*.02,topY-6);ctx.lineTo(x-outer*.22,topY+55);ctx.closePath();ctx.fill();
 for(let i=0;i<9;i++){
  const px=x-outer*.82+i*outer*.205,py=topY+90+(i%3)*75;
  ctx.fillStyle=i%2?"#536b50":"#6c7d5d";ctx.beginPath();
  ctx.moveTo(px-12,py+12);ctx.lineTo(px-4,py-10);ctx.lineTo(px+8,py-16);ctx.lineTo(px+15,py+10);ctx.closePath();ctx.fill();
 }
 ctx.restore();
}
function drawScenery(time){
 drawSky(time);drawMountainRange();drawMovingClouds(time);drawSectMountainBack(time);
 drawMountainStream(time);drawRiver(time);
 drawCascadeCliff(34,235,520,27,time);drawCascadeCliff(1066,235,520,27,time);
 drawLinkedCascade(34,235,520,27,time,.2);drawLinkedCascade(1066,235,520,27,time,1.4);
 drawSectArchitecture(time);drawSpiritBirds(time);drawTempleAuras(time);
 drawPine(185,500,.58,"#315b45");drawTree(215,510,.48,"#426b4c");
 drawPine(360,500,.52,"#315b45");drawTree(475,505,.44,"#426b4c");
 drawPine(740,500,.52,"#315b45");drawTree(820,505,.46,"#426b4c");
 drawPine(925,495,.58,"#315b45");drawCrowd(time);
}
function drawSpiritBirds(time){
 const flocks=[
  {dir:1,y:66,s:.55,speed:.000018,phase:.1,count:2},
  {dir:-1,y:118,s:.43,speed:.000014,phase:.55,count:2}
 ];
 flocks.forEach((f,k)=>{
  for(let j=0;j<f.count;j++){
   const p=(time*f.speed+f.phase+j*.48)%1;
   const x=f.dir>0?-75+p*(W+150):W+75-p*(W+150);
   const y=f.y+Math.sin(time*.00055+j*1.7+k)*5;
   const flap=Math.sin(time*.002+j*1.8+k)*.7;
   ctx.save();ctx.translate(x,y);ctx.scale(f.dir*f.s,f.s);
   ctx.fillStyle="#fffdf0";ctx.beginPath();ctx.ellipse(0,0,18,5,-.05,0,Math.PI*2);ctx.fill();
   ctx.strokeStyle="#fffdf0";ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();
   ctx.moveTo(12,-1);ctx.quadraticCurveTo(23,-12,21,-23);ctx.stroke();
   ctx.fillStyle="#fffdf0";ctx.beginPath();ctx.arc(20,-24,3.5,0,Math.PI*2);ctx.fill();
   ctx.fillStyle="#c94d3e";ctx.beginPath();ctx.moveTo(23,-24);ctx.lineTo(32,-22);ctx.lineTo(23,-20);ctx.closePath();ctx.fill();
   ctx.fillStyle="#fffdf5";ctx.beginPath();ctx.moveTo(-5,0);ctx.quadraticCurveTo(-22,-21-flap*5,-53,-20-flap*6);ctx.quadraticCurveTo(-36,6,-5,6);ctx.closePath();ctx.fill();
   ctx.beginPath();ctx.moveTo(-5,3);ctx.quadraticCurveTo(-22,13+flap*3,-42,20+flap*4);ctx.quadraticCurveTo(-25,11,-5,6);ctx.closePath();ctx.fill();
   ctx.strokeStyle="#b94c40";ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(-3,4);ctx.lineTo(-7,16);ctx.moveTo(5,4);ctx.lineTo(7,16);ctx.stroke();
   ctx.restore();
  }
 });
}
function drawRacer(target,racer,x,y,scale,time){
 target.save();target.translate(x,y+Math.sin(time*.009+racer.phase)*2);target.scale(scale,scale);
 const glow=target.createRadialGradient(0,0,3,0,0,47);glow.addColorStop(0,"rgba(255,225,139,.42)");glow.addColorStop(1,"rgba(255,225,139,0)");target.fillStyle=glow;target.fillRect(-50,-48,100,96);
 if(racer.effectTimer>0){const pulse=1+Math.sin(time*.025)*.12,color=racer.effectType==="boost"?"#ffe17b":racer.effectType==="slow"?"#8de8ef":"#ff9a72";
  target.save();target.globalAlpha=.8;target.strokeStyle=color;target.lineWidth=2.2;target.beginPath();target.ellipse(0,4,43*pulse,17*pulse,0,0,Math.PI*2);target.stroke();
  target.globalAlpha=.32;target.lineWidth=5;target.beginPath();target.ellipse(0,4,51*pulse,22*pulse,0,0,Math.PI*2);target.stroke();target.globalAlpha=.95;target.fillStyle=color;
  for(let i=0;i<8;i++){const ang=time*.009+i*Math.PI/4,rad=25+Math.sin(time*.018+i)*8,px=Math.cos(ang)*rad,py=Math.sin(ang)*rad*.5-9;target.beginPath();target.moveTo(px,py-4);target.lineTo(px+2,py);target.lineTo(px,py+4);target.lineTo(px-2,py);target.closePath();target.fill();}
  if(racer.effectType==="boost"){target.strokeStyle="#fff4bd";target.lineWidth=2;for(let i=0;i<4;i++){target.beginPath();target.moveTo(-42-i*3,8+i*3);target.lineTo(-65-i*5,8+i*4);target.stroke();}}
  if(racer.effectType==="slow"){target.strokeStyle="#a8f5f4";target.lineWidth=1.5;for(let i=0;i<3;i++){target.beginPath();target.arc(0,-4,18+i*8,time*.006+i,time*.006+i+Math.PI*1.35);target.stroke();}}
  if(racer.effectType==="impact"){target.strokeStyle="#ffb18c";target.lineWidth=2;for(let i=0;i<5;i++){const q=i*1.256;target.beginPath();target.moveTo(Math.cos(q)*18,Math.sin(q)*12);target.lineTo(Math.cos(q)*37,Math.sin(q)*26);target.stroke();}}target.restore();}
 drawRacingArtifact(target,artifactKind(racer),time*.004+racer.phase,racer.swordColor||0);
 target.save();target.globalAlpha=.75;target.strokeStyle=racer.effectTimer>0?"#fff0a6":"rgba(255,235,170,.5)";target.lineWidth=1.3;target.beginPath();target.moveTo(-37,20);target.lineTo(38,18);target.stroke();target.restore();
 target.fillStyle=racer.dark;target.fillRect(-10,-5,20,22);target.fillStyle=racer.color;target.fillRect(-9,-7,18,21);target.fillRect(-14,-2,5,14);target.fillRect(9,-2,5,14);
 target.fillStyle="#f0c49b";target.fillRect(-7,-22,14,14);target.fillStyle="#29252a";target.fillRect(-8,-25,16,5);target.fillRect(-7,-28,13,4);target.fillRect(-9,-21,3,8);target.fillRect(6,-21,3,8);target.fillRect(4,-31,3,7);
 target.fillStyle="#392a26";target.fillRect(-4,-17,2,2);target.fillRect(3,-17,2,2);target.fillStyle="#e8cb83";target.fillRect(-8,5,16,2);
 target.save();target.globalAlpha=.78;target.fillStyle=racer.color;target.beginPath();const tail=racer.effectType==="boost"?-25:racer.effectType==="slow"?-10:-17;target.moveTo(-7,-4);target.quadraticCurveTo(tail-10,-1,tail,-13);target.lineTo(-4,-8);target.closePath();target.fill();target.restore();
 if(racer.effectTimer>0&&racer.effectName&&target!==cameraCtx){
  target.save();target.font="bold 7px Arial, sans-serif";target.textAlign="center";target.textBaseline="middle";target.lineJoin="round";
  target.lineWidth=2.2;target.strokeStyle="rgba(14,25,24,.98)";target.strokeText(racer.effectName,0,-65,126);
  target.fillStyle="#fff1bd";target.fillText(racer.effectName,0,-65,126);target.restore();
 }
 target.restore();
}

/* REVISION 16 — tên rõ nét, khán đài phân tầng, không dùng bảng nền. */
function drawRoleLabel(x,y,label,color="#fff0c5",scale=1){
 ctx.save();ctx.font="bold "+Math.max(10,12*scale)+"px Arial, sans-serif";
 ctx.textAlign="center";ctx.textBaseline="middle";ctx.lineJoin="round";
 ctx.lineWidth=3.5;ctx.strokeStyle="rgba(19,29,25,.95)";ctx.strokeText(label,x,y);
 ctx.fillStyle=color;ctx.fillText(label,x,y);ctx.restore();
}
function drawCrowd(time){
 drawVIPAura(550,646,145,"#ffe5a0",time,.4,1.9);drawVIPAura(550,646,92,"#fff0bf",time,1.8,1.5);
 drawVIPChair(550,674,1.48,"#762f32",time,0);drawFormalSpectator(550,662,1.16,"master",time,0);
 drawRoleLabel(550,596,"CHƯỞNG MÔN","#f2d17d",1.12);
 const disciples=Array.from({length:10},(_,i)=>[58+i*40,680]);
 disciples.forEach(([x,y],i)=>{drawVIPAura(x,y-12,34,"#a9d7ff",time,i*.7,.62);drawVIPChair(x,y,.82,"#405d82",time,i*.65);drawFormalSpectator(x,y-8,.70,"disciple",time,i);});
 drawRoleLabel(255,625,"CHÂN TRUYỀN ĐỆ TỬ","#a9c9f0",.94);
 const elders=Array.from({length:10},(_,i)=>[682+i*40,680]);
 elders.forEach(([x,y],i)=>{drawVIPAura(x,y-12,38,"#d7baff",time,i*.75,.72);drawVIPChair(x,y,.88,"#5b456b",time,i);drawFormalSpectator(x,y-8,.74,"elder",time,i*.8);});
 drawRoleLabel(862,625,"TRƯỞNG LÃO","#d4b5fa",.94);
 const core=Array.from({length:12},(_,i)=>[52+i*90,713]);
 core.forEach(([x,y],i)=>{drawVIPAura(x,y-9,27,"#b8e5d6",time,i*.61,.30);drawVIPChair(x,y,.53,"#466b61",time,i*.55);drawFormalSpectator(x,y-6,.48,"core",time,i*.52);});
 const rows=[
  {role:"inner",count:38,y:727,start:2,step:29,scale:.44,spread:12},
  {role:"outer",count:52,y:746,start:-2,step:21,scale:.40,spread:15},
  {role:"servant",count:66,y:765,start:-4,step:17,scale:.35,spread:17},
  {role:"servant",count:78,y:783,start:-5,step:14,scale:.31,spread:18}
 ];
 rows.forEach((row,ri)=>{for(let i=0;i<row.count;i++){
  const x=row.start+i*row.step+Math.sin(i*2.399+ri)*6+(i%2)*2;
  const y=row.y+Math.sin(i*1.73+ri*2.1)*row.spread+Math.cos(i*.43+ri)*3;
  drawSpectator(x,y,row.scale,row.role,time,i*.59+ri);
 }});
 drawCrowdFlag(12,714,"#a53f36",time);drawCrowdFlag(W-18,714,"#b18a43",time);
}

function drawSectMountainBack(time){
 const layers=[
  {a:"#40584d",b:"#263f38",pts:[[-40,520],[35,405],[105,325],[165,365],[245,250],[315,335],[395,215],[465,295],[535,190],[615,280],[700,205],[770,315],[850,220],[930,315],[1010,230],[1140,510]]},
  {a:"#536b59",b:"#314c42",pts:[[-30,535],[55,450],[130,375],[205,410],[285,305],[355,390],[430,270],[505,355],[585,260],[655,360],[735,270],[815,390],[900,285],[980,390],[1060,300],[1140,540]]}
 ];
 layers.forEach((layer,li)=>{const g=ctx.createLinearGradient(0,180+li*50,0,560);g.addColorStop(0,layer.a);g.addColorStop(1,layer.b);ctx.fillStyle=g;ctx.beginPath();layer.pts.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.lineTo(1140,560);ctx.lineTo(-40,560);ctx.closePath();ctx.fill();ctx.strokeStyle=li?"rgba(180,199,157,.23)":"rgba(208,220,178,.35)";ctx.lineWidth=2;ctx.beginPath();layer.pts.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();});
 for(let i=0;i<22;i++){const x=25+(i*53)%1060,y=300+(i*37)%190;ctx.strokeStyle=i%2?"rgba(20,39,34,.25)":"rgba(218,211,168,.20)";ctx.lineWidth=i%3===0?3:1.2;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-12,y+13);ctx.lineTo(x+5,y+25);ctx.lineTo(x-4,y+39);ctx.stroke();}
}
function drawSectMountainLedge(x,y,scale){
 ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);
 const g=ctx.createLinearGradient(0,-2,0,28);g.addColorStop(0,"#a59b78");g.addColorStop(.35,"#66745b");g.addColorStop(1,"#30483e");
 ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(-112,1);ctx.lineTo(-84,-7);ctx.lineTo(-45,-4);ctx.lineTo(-14,-12);ctx.lineTo(22,-5);ctx.lineTo(67,-9);ctx.lineTo(112,2);ctx.lineTo(98,18);ctx.lineTo(-96,18);ctx.closePath();ctx.fill();
 ctx.strokeStyle="rgba(224,211,166,.65)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-112,1);ctx.lineTo(-84,-7);ctx.lineTo(-45,-4);ctx.lineTo(-14,-12);ctx.lineTo(22,-5);ctx.lineTo(67,-9);ctx.lineTo(112,2);ctx.stroke();
 ctx.strokeStyle="rgba(23,39,33,.65)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-75,10);ctx.lineTo(-58,5);ctx.lineTo(-42,12);ctx.moveTo(36,8);ctx.lineTo(52,3);ctx.lineTo(70,12);ctx.stroke();ctx.restore();
}

function drawRacerName(racer,x,y,scale){
 const order=sortedRacers(),rank=order.findIndex(item=>item.id===racer.id)+1;
 const p=rank===1?{fill:"#ffe27a",glow:"#ffd34e",shadow:15}:rank===2?{fill:"#f1f5ff",glow:"#b8d8f5",shadow:10}:rank===3?{fill:"#ffc28a",glow:"#d88b54",shadow:7}:{fill:"#fff7dc",glow:"#a9d9e7",shadow:2};
 const pulse=1+Math.sin(sceneTime*.008+rank)*.08,labelY=y-43*scale;
 ctx.save();const fs=clamp(12*scale+4,9,15);ctx.font="800 "+fs+"px Arial, sans-serif";ctx.textAlign="center";ctx.textBaseline="middle";ctx.lineJoin="round";
 ctx.shadowColor=p.glow;ctx.shadowBlur=p.shadow*pulse;ctx.lineWidth=3.1;ctx.strokeStyle="rgba(13,25,25,.97)";ctx.strokeText(racer.name,x,labelY,155);
 ctx.fillStyle=p.fill;ctx.fillText(racer.name,x,labelY,155);
 if(rank<=3){ctx.shadowBlur=p.shadow+4;ctx.fillStyle=p.glow;ctx.font="bold "+Math.max(8,fs*.8)+"px Arial";ctx.fillText(rank===1?"♛":rank===2?"✧":"✦",x,labelY-fs*.9);for(let i=0;i<3;i++){const sx=x+Math.sin(sceneTime*.006+i*2+rank)*12,sy=labelY+Math.cos(sceneTime*.005+i*2)*3;ctx.globalAlpha=.5+.5*Math.sin(sceneTime*.01+i)**2;ctx.fillRect(sx,sy,1.5,1.5);}}
 ctx.restore();
}
function drawPodiumScene(target,time,mini=false){
 const ordered=sortedRacers().slice(0,3),w=target.canvas.width,h=target.canvas.height;
 const base=h*(mini ? .91 : .76),xs=mini?[w*.26,w*.5,w*.74]:[w*.27,w*.5,w*.73];
 const tops=mini?[h*.70,h*.62,h*.72]:[h*.59,h*.51,h*.61];
 const colors=["#c88d45","#d9e1e8","#b8794e"],glows=["#ffe17b","#dcecff","#e6a16c"],slotRanks=[2,1,3];
 target.save();
 const aura=target.createRadialGradient(w*.5,h*.45,4,w*.5,h*.45,mini?w*.48:w*.55);aura.addColorStop(0,"rgba(255,228,157,.25)");aura.addColorStop(1,"rgba(255,228,157,0)");
 target.fillStyle=aura;target.fillRect(0,0,w,h);
 target.textAlign="center";target.textBaseline="middle";target.font=mini?"900 12px Arial, sans-serif":"900 34px Georgia";
 target.fillStyle="#ffe8a6";target.shadowColor="#ffcf64";target.shadowBlur=mini?8:22;target.fillText("VINH DANH TOP 3",w*.5,mini?12:h*.13);target.shadowBlur=0;
 target.fillStyle="rgba(19,38,33,.65)";target.beginPath();target.ellipse(w*.5,base+3,w*(mini?.43:.38),mini?7:24,0,0,Math.PI*2);target.fill();
 for(let slot=0;slot<3;slot++){
  const rank=slotRanks[slot],racer=ordered[rank-1];if(!racer)continue;
  const x=xs[slot],top=tops[slot],bw=w*.19,bh=base-top;
  const grad=target.createLinearGradient(x-bw/2,top,x+bw/2,base);grad.addColorStop(0,colors[rank-1]);grad.addColorStop(.5,"#684a36");grad.addColorStop(1,"#2d302c");
  target.fillStyle=grad;target.fillRect(x-bw/2,top,bw,bh);target.strokeStyle=glows[rank-1];target.lineWidth=mini?1.2:3;target.strokeRect(x-bw/2,top,bw,bh);
  target.fillStyle=glows[rank-1];target.font=mini?"bold 10px Arial":"bold 23px Georgia";target.fillText(String(rank),x,top+(mini?10:20));
  const cs=mini?.43:1.18,cy=top-(mini?16:43);
  target.save();target.globalAlpha=.22;target.fillStyle=glows[rank-1];target.beginPath();target.ellipse(x,cy+3,mini?28:72,mini?15:42,0,0,Math.PI*2);target.fill();target.restore();
  for(let i=0;i<(mini?5:15);i++){const a=time*.0015+i*2.399+rank,rad=(mini?15:40)+Math.sin(time*.004+i)*4;target.globalAlpha=.55+.4*Math.sin(time*.006+i)**2;target.fillStyle=glows[rank-1];target.beginPath();target.arc(x+Math.cos(a)*rad,cy+Math.sin(a)*rad*.5,mini?1:2,0,Math.PI*2);target.fill();}
  drawRacer(target,racer,x,cy,cs,time);
  target.globalAlpha=1;target.font=mini?"bold 8px Arial":"bold 17px Arial";target.fillStyle="#fff1c8";target.strokeStyle="#172522";target.lineWidth=mini?2:4;target.strokeText(racer.name,x,top-(mini?28:79),mini?125:190);target.fillText(racer.name,x,top-(mini?28:79),mini?125:190);
  target.font=mini?"bold 8px Arial":"bold 14px Arial";target.fillStyle=glows[rank-1];target.fillText(rank===1?"ĐẠI ĐẠO ĐỆ NHẤT":rank===2?"Á QUÂN":"QUÝ QUÂN",x,base+(mini?4:20),mini?110:160);
 }
 target.globalAlpha=1;target.restore();
}


// =====================================================
// REVISION 17 — THÁC SƠN TUYỀN, KIẾN TRÚC VÀ KHÁN ĐÀI
// =====================================================

function drawCascadeCliff(x, topY, bottomY, width, time) {
  ctx.save();
  ctx.lineJoin="round";
  const span=width*3.35, mid=topY+(bottomY-topY)*.52;
  const rock=ctx.createLinearGradient(x-span,topY-70,x+span,bottomY+20);
  rock.addColorStop(0,"#71836a");rock.addColorStop(.28,"#526b56");
  rock.addColorStop(.62,"#344f43");rock.addColorStop(1,"#1d3934");
  ctx.fillStyle=rock;
  ctx.beginPath();
  ctx.moveTo(x-span,bottomY+15);
  ctx.lineTo(x-span*.94,mid+55);
  ctx.lineTo(x-span*.72,mid+4);
  ctx.lineTo(x-span*.56,topY+75);
  ctx.lineTo(x-span*.34,topY+38);
  ctx.lineTo(x-span*.18,topY-34);
  ctx.lineTo(x-span*.03,topY-62);
  ctx.lineTo(x+span*.19,topY-27);
  ctx.lineTo(x+span*.34,topY+39);
  ctx.lineTo(x+span*.58,topY+74);
  ctx.lineTo(x+span*.76,mid+8);
  ctx.lineTo(x+span*.94,mid+62);
  ctx.lineTo(x+span,bottomY+15);
  ctx.closePath();ctx.fill();

  const face=ctx.createLinearGradient(x-span*.4,topY,x+span*.5,bottomY);
  face.addColorStop(0,"rgba(164,177,133,.55)");
  face.addColorStop(.5,"rgba(83,112,82,.28)");
  face.addColorStop(1,"rgba(18,43,38,.6)");
  ctx.fillStyle=face;ctx.beginPath();
  ctx.moveTo(x-span*.68,topY+88);ctx.lineTo(x-span*.34,topY+38);
  ctx.lineTo(x-span*.18,topY-34);ctx.lineTo(x-span*.03,topY-62);
  ctx.lineTo(x+span*.19,topY-27);ctx.lineTo(x+span*.34,topY+39);
  ctx.lineTo(x+span*.58,topY+74);ctx.lineTo(x+span*.35,topY+58);
  ctx.lineTo(x+span*.12,topY+2);ctx.lineTo(x-span*.05,topY-22);
  ctx.lineTo(x-span*.22,topY+48);ctx.lineTo(x-span*.43,topY+106);
  ctx.closePath();ctx.fill();

  ctx.strokeStyle="rgba(208,220,174,.55)";ctx.lineWidth=2.4;
  ctx.beginPath();ctx.moveTo(x-span*.34,topY+38);ctx.lineTo(x-span*.18,topY-34);
  ctx.lineTo(x-span*.03,topY-62);ctx.lineTo(x+span*.19,topY-27);
  ctx.lineTo(x+span*.34,topY+39);ctx.stroke();

  // Các vân đá chạy dọc vách, tránh tạo cảm giác bức tường ngang.
  for(let i=0;i<13;i++){
    const px=x-span*.82+i*span*.137;
    const py=topY+70+(i%4)*47;
    ctx.strokeStyle=i%2?"rgba(18,42,36,.34)":"rgba(210,216,174,.25)";
    ctx.lineWidth=i%3===0?3:1.2;
    ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px-8,py+25);ctx.lineTo(px+5,py+48);ctx.lineTo(px-3,py+72);ctx.stroke();
  }
  for(let i=0;i<15;i++){
    const px=x-span*.88+i*span*.126,py=topY+95+(i%4)*64;
    ctx.fillStyle=i%2?"#536c50":"#788365";
    ctx.beginPath();ctx.moveTo(px-15,py+12);ctx.lineTo(px-5,py-8);
    ctx.lineTo(px+8,py-16);ctx.lineTo(px+18,py+8);ctx.closePath();ctx.fill();
  }
  ctx.restore();
}

function drawLinkedCascade(x,topY,bottomY,width,time,side){
 const upper=topY-53,mid1=topY+91,mid2=topY+190,foot=bottomY;
 const sway=Math.sin(time*.0011+side)*2.2;
 ctx.save();ctx.lineCap="round";ctx.lineJoin="round";

 // Hồ nguồn trên đỉnh núi và dòng suối tràn qua mép đá.
 const source=ctx.createLinearGradient(x-width*1.7,upper-8,x+width*1.7,upper+18);
 source.addColorStop(0,"#286978");source.addColorStop(.42,"#d9fff1");source.addColorStop(1,"#286978");
 ctx.fillStyle=source;ctx.beginPath();ctx.ellipse(x,upper+5,width*1.55,12,.02,0,Math.PI*2);ctx.fill();
 ctx.strokeStyle="rgba(240,255,245,.82)";ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,upper+3,width*1.25,6,0,0,Math.PI*2);ctx.stroke();

 // Dải thác tầng trên: hẹp ở nguồn, loe rộng khi rơi.
 const water=ctx.createLinearGradient(x-width*2,0,x+width*2,0);
 water.addColorStop(0,"#236c7b");water.addColorStop(.16,"#64b9c1");water.addColorStop(.36,"#e5fff2");
 water.addColorStop(.56,"#a5e5dc");water.addColorStop(.82,"#4b9eaa");water.addColorStop(1,"#205b70");
 ctx.fillStyle=water;ctx.beginPath();
 ctx.moveTo(x-width*.48,upper+7);
 ctx.bezierCurveTo(x-width*.55,upper+55,x-width*.82,mid1-30,x-width*1.08,mid1);
 ctx.quadraticCurveTo(x-width*.65,mid1+18,x,mid1+10);
 ctx.quadraticCurveTo(x+width*.72,mid1+18,x+width*1.08,mid1);
 ctx.bezierCurveTo(x+width*.82,mid1-30,x+width*.55,upper+55,x+width*.48,upper+7);
 ctx.closePath();ctx.fill();

 // Gờ đá giữa tầng, gồ ghề hai bên như dòng nước va vào vách.
 const shelf=ctx.createLinearGradient(0,mid1-12,0,mid1+24);shelf.addColorStop(0,"#71866a");shelf.addColorStop(.45,"#344f43");shelf.addColorStop(1,"#1c3934");
 ctx.fillStyle=shelf;ctx.beginPath();
 ctx.moveTo(x-width*1.72,mid1+8);ctx.lineTo(x-width*1.35,mid1-5);ctx.lineTo(x-width*.92,mid1+4);
 ctx.lineTo(x-width*.58,mid1-7);ctx.lineTo(x-width*.22,mid1+4);ctx.lineTo(x+width*.18,mid1-6);
 ctx.lineTo(x+width*.58,mid1+5);ctx.lineTo(x+width*.94,mid1-5);ctx.lineTo(x+width*1.38,mid1+7);
 ctx.lineTo(x+width*1.72,mid1-1);ctx.lineTo(x+width*1.55,mid1+21);ctx.lineTo(x-width*1.55,mid1+22);ctx.closePath();ctx.fill();
 ctx.strokeStyle="rgba(218,228,184,.62)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-width*1.5,mid1+3);ctx.lineTo(x-width*1.15,mid1-3);ctx.lineTo(x-width*.8,mid1+5);ctx.lineTo(x-width*.48,mid1-3);ctx.lineTo(x-width*.15,mid1+5);ctx.lineTo(x+width*.2,mid1-3);ctx.lineTo(x+width*.55,mid1+5);ctx.lineTo(x+width*.9,mid1-2);ctx.lineTo(x+width*1.45,mid1+5);ctx.stroke();

 // Tầng giữa, dòng nước đổ qua gờ đá, hơi cong theo sườn núi.
 ctx.fillStyle=water;ctx.beginPath();
 ctx.moveTo(x-width*.7,mid1+10);
 ctx.bezierCurveTo(x-width*.9,mid1+48,x-width*1.35,mid2-42,x-width*1.55,mid2);
 ctx.quadraticCurveTo(x-width*.8,mid2+21,x+sway,mid2+12);
 ctx.quadraticCurveTo(x+width*.9,mid2+22,x+width*1.55,mid2);
 ctx.bezierCurveTo(x+width*1.35,mid2-42,x+width*.9,mid1+48,x+width*.7,mid1+10);
 ctx.closePath();ctx.fill();

 // Gờ đá thứ hai, không tạo đường ngang thẳng.
 ctx.fillStyle="#2b493e";ctx.beginPath();
 ctx.moveTo(x-width*2.05,mid2+8);ctx.lineTo(x-width*1.62,mid2-7);ctx.lineTo(x-width*1.2,mid2+5);
 ctx.lineTo(x-width*.76,mid2-8);ctx.lineTo(x-width*.32,mid2+4);ctx.lineTo(x+width*.12,mid2-5);
 ctx.lineTo(x+width*.55,mid2+7);ctx.lineTo(x+width*.98,mid2-7);ctx.lineTo(x+width*1.48,mid2+6);
 ctx.lineTo(x+width*2.02,mid2-4);ctx.lineTo(x+width*1.8,mid2+22);ctx.lineTo(x-width*1.8,mid2+22);ctx.closePath();ctx.fill();
 ctx.strokeStyle="rgba(206,221,177,.55)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-width*1.8,mid2+3);ctx.lineTo(x-width*1.35,mid2-4);ctx.lineTo(x-width*.9,mid2+5);ctx.lineTo(x-width*.48,mid2-4);ctx.lineTo(x,mid2+5);ctx.lineTo(x+width*.48,mid2-4);ctx.lineTo(x+width*.95,mid2+5);ctx.lineTo(x+width*1.42,mid2-4);ctx.lineTo(x+width*1.85,mid2+4);ctx.stroke();

 // Tầng cuối xòe rộng thành màn nước và đổ vào hồ chân núi.
 ctx.fillStyle=water;ctx.beginPath();
 ctx.moveTo(x-width*.98,mid2+10);
 ctx.bezierCurveTo(x-width*1.08,mid2+55,x-width*1.9,foot-54,x-width*2.18,foot-5);
 ctx.quadraticCurveTo(x-width*1.2,foot+17,x,foot+10);
 ctx.quadraticCurveTo(x+width*1.25,foot+18,x+width*2.18,foot-5);
 ctx.bezierCurveTo(x+width*1.9,foot-54,x+width*1.08,mid2+55,x+width*.98,mid2+10);
 ctx.closePath();ctx.fill();

 // Cắt dải nước để tạo nhiều sợi chảy dọc, phản chiếu ánh trời.
 ctx.save();ctx.beginPath();ctx.moveTo(x-width*.48,upper+7);
 ctx.bezierCurveTo(x-width*.55,upper+55,x-width*.82,mid1-30,x-width*1.08,mid1);
 ctx.quadraticCurveTo(x-width*.65,mid1+18,x,mid1+10);ctx.quadraticCurveTo(x+width*.72,mid1+18,x+width*1.08,mid1);
 ctx.bezierCurveTo(x+width*.82,mid1-30,x+width*.55,upper+55,x+width*.48,upper+7);ctx.closePath();
 ctx.moveTo(x-width*.7,mid1+10);ctx.bezierCurveTo(x-width*.9,mid1+48,x-width*1.35,mid2-42,x-width*1.55,mid2);
 ctx.quadraticCurveTo(x-width*.8,mid2+21,x+sway,mid2+12);ctx.quadraticCurveTo(x+width*.9,mid2+22,x+width*1.55,mid2);
 ctx.bezierCurveTo(x+width*1.35,mid2-42,x+width*.9,mid1+48,x+width*.7,mid1+10);ctx.closePath();
 ctx.moveTo(x-width*.98,mid2+10);ctx.bezierCurveTo(x-width*1.08,mid2+55,x-width*1.9,foot-54,x-width*2.18,foot-5);
 ctx.quadraticCurveTo(x-width*1.2,foot+17,x,foot+10);ctx.quadraticCurveTo(x+width*1.25,foot+18,x+width*2.18,foot-5);
 ctx.bezierCurveTo(x+width*1.9,foot-54,x+width*1.08,mid2+55,x+width*.98,mid2+10);ctx.closePath();ctx.clip();
 const offset=(time*.025)%62;
 for(let i=0;i<19;i++){
  const t=i/18,px=x-width*1.55+t*width*3.1;
  const start=upper+((i*31+offset)%Math.max(1,foot-upper));
  const bend=Math.sin(i*1.8+time*.001+side)*width*.16;
  ctx.strokeStyle=i%5===0?"rgba(255,255,247,.9)":i%3===0?"rgba(24,88,105,.45)":"rgba(221,255,244,.46)";
  ctx.lineWidth=i%5===0?2.8:1.1+(i%3)*.55;
  ctx.beginPath();ctx.moveTo(px,start);ctx.bezierCurveTo(px+bend-4,start+40,px+bend+5,start+92,px+bend,Math.min(foot+12,start+155));ctx.stroke();
 }
 for(let i=0;i<10;i++){
  const yy=upper+35+i*30,px=x+Math.sin(time*.001+i*1.7)*width*.4;
  ctx.strokeStyle="rgba(255,255,255,.46)";ctx.lineWidth=1.1;
  ctx.beginPath();ctx.moveTo(px-width*.35,yy);ctx.quadraticCurveTo(px,yy+6,px+width*.38,yy+1);ctx.stroke();
 }
 ctx.restore();

 // Bọt trắng ở hai tầng va đập và chân thác.
 [[mid1,1.15],[mid2,1.65],[foot,2.1]].forEach(([yy,mul],i)=>{
  for(let j=0;j<7;j++){
   const px=x+(j-3)*width*.45+Math.sin(time*.002+j+i)*2;
   ctx.globalAlpha=.55+.3*Math.sin(time*.004+j*1.7)**2;
   ctx.fillStyle="#f3fff4";ctx.beginPath();ctx.ellipse(px,yy+Math.sin(j*2+i)*3,2.5*mul,1.4*mul,0,0,Math.PI*2);ctx.fill();
  }
 });
 ctx.globalAlpha=1;
 const pool=ctx.createRadialGradient(x,foot+8,2,x,foot+8,width*3.4);
 pool.addColorStop(0,"rgba(242,255,247,.68)");pool.addColorStop(.3,"rgba(117,218,208,.36)");pool.addColorStop(1,"rgba(65,139,143,0)");
 ctx.fillStyle=pool;ctx.beginPath();ctx.ellipse(x,foot+8,width*3.4,19,0,0,Math.PI*2);ctx.fill();
 ctx.strokeStyle="rgba(238,255,247,.78)";ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,foot+8,width*2.5,9,0,0,Math.PI*2);ctx.stroke();
 // Màn sương, giọt nước bắt sáng và lá cây bám vách.
 for(let i=0;i<26;i++){
  const px=x+Math.sin(time*.0014+i*1.31+side)*width*2.8;
  const py=foot-14+Math.cos(i*2.17+time*.001)*12;
  ctx.globalAlpha=.22+.42*(.5+.5*Math.sin(time*.002+i));
  ctx.fillStyle="#f4fff7";ctx.beginPath();ctx.ellipse(px,py,1.2+(i%3),2+(i%2),0,0,Math.PI*2);ctx.fill();
 }
 ctx.globalAlpha=1;ctx.restore();
}

function drawSectArchitecture(time){
 const buildings=[
  [165,175,.34,"TỤ LINH THÁP","tower","#39766e"],
  [365,175,.34,"TÀNG KINH CÁC","scripture","#8c6043"],
  [565,175,.34,"TÀNG BẢO CÁC","treasure","#b68a43"],
  [765,175,.34,"QUAN TINH LÂU","observatory","#536c91"],
  [955,175,.34,"BÁCH THẢO CÁC","herb","#648653"],
  [205,300,.34,"GIẢNG ĐẠO CÁC","lecture","#577d83"],
  [405,300,.34,"ĐAN CÁC","alchemy","#9e543b"],
  [550,300,.62,"LĂNG TIÊU CHÍNH ĐIỆN","main","#9d4939"],
  [695,300,.34,"LUYỆN KHÍ ĐIỆN","forge","#82604a"],
  [895,300,.34,"QUAN TINH ĐÀI","observatory","#536c91"],
  [165,410,.30,"BẾ QUAN ĐỘNG PHỦ","cave","#536b62"],
  [355,410,.30,"ĐỆ TỬ VIỆN","academy","#66817a"],
  [550,410,.30,"TRẬN PHÁP CÁC","array","#4f7b83"],
  [745,410,.30,"HỘ SƠN TRẬN CÁC","guardian","#527e88"],
  [935,410,.30,"NGOẠI VỤ ĐIỆN","foreign","#916c48"]
 ];
 buildings.forEach(([x,y,s,title,type,accent])=>{
  drawSectMountainLedge(x,y,s);
  drawSectPavilion(x,y-5,s,title,type,accent);
 });
}

function drawCrowd(time){
  // Khu vực tôn vị: môn chủ ở chính giữa, hai hàng thân truyền và trưởng lão tách biệt.
  drawVIPAura(550,646,145,"#ffe5a0",time,.4,1.9);
  drawVIPAura(550,646,92,"#fff0bf",time,1.8,1.5);
  drawVIPChair(550,674,1.48,"#762f32",time,0);
  drawFormalSpectator(550,662,1.16,"master",time,0);
  drawRoleLabel(550,596,"CHƯỞNG MÔN","#f2d17d",1.12);

  const disciples=Array.from({length:10},(_,i)=>[265+i*19,665]);
  disciples.forEach(([x,y],i)=>{
    drawVIPAura(x,y-12,30,"#a9d7ff",time,i*.7,.55);
    drawVIPChair(x,y,.70,"#405d82",time,i*.65);
    drawFormalSpectator(x,y-8,.62,"disciple",time,i);
  });
  drawRoleLabel(360,628,"CHÂN TRUYỀN ĐỆ TỬ","#a9c9f0",.88);

  const elders=Array.from({length:10},(_,i)=>[645+i*19,665]);
  elders.forEach(([x,y],i)=>{
    drawVIPAura(x,y-12,32,"#d7baff",time,i*.75,.62);
    drawVIPChair(x,y,.74,"#5b456b",time,i);
    drawFormalSpectator(x,y-8,.65,"elder",time,i*.8);
  });
  drawRoleLabel(740,628,"TRƯỞNG LÃO","#d4b5fa",.88);

  // Nòng cốt đứng thành hai cụm nghi lễ, không có ghế.
  for(let i=0;i<18;i++){
    const x=75+i*55+(i%2)*5,y=710+Math.sin(i*1.7)*3;
    drawVIPAura(x,y-10,20,"#b8e5d6",time,i*.61,.22);
    drawSpectator(x,y,.55,"core",time,i*.73);
  }
  for(let i=0;i<14;i++){
    const x=165+i*55,y=728+Math.sin(i*1.9)*2;
    drawSpectator(x,y,.43,"core",time,i*1.13+2);
  }

  // Đám đông đứng dày phía sau, phân lớp theo cấp bậc.
  const rows=[
    {role:"inner",count:42,y:748,start:-5,step:27,scale:.39,spread:7},
    {role:"outer",count:58,y:765,start:-5,step:20,scale:.35,spread:8},
    {role:"servant",count:76,y:782,start:-5,step:15,scale:.32,spread:8},
    {role:"servant",count:88,y:797,start:-5,step:13,scale:.29,spread:7}
  ];
  rows.forEach((row,ri)=>{
    for(let i=0;i<row.count;i++){
      const x=row.start+i*row.step+Math.sin(i*2.399+ri)*5+(i%2)*2;
      const y=row.y+Math.sin(i*1.73+ri*2.1)*row.spread+Math.cos(i*.43+ri)*2;
      drawSpectator(x,y,row.scale,row.role,time,i*.59+ri*1.7);
    }
  });
  drawCrowdFlag(12,724,"#a53f36",time);
  drawCrowdFlag(W-18,724,"#b18a43",time);
}


/* === CẢNH QUẦN THỂ TIÊN MÔN & LỄ TRAO GIẢI ĐẠI ĐIỂN === */
function drawSectArchitecture(time){
 const buildings=[
  [165,175,.34,"TỤ LINH THÁP","tower","#39766e"],
  [365,175,.34,"TÀNG KINH CÁC","scripture","#8c6043"],
  [565,175,.34,"TÀNG BẢO CÁC","treasure","#b68a43"],
  [765,175,.34,"QUAN TINH LÂU","observatory","#536c91"],
  [955,175,.34,"BÁCH THẢO CÁC","herb","#648653"],
  [205,300,.34,"GIẢNG ĐẠO CÁC","lecture","#577d83"],
  [405,300,.34,"ĐAN CÁC","alchemy","#9e543b"],
  [550,300,.62,"LĂNG TIÊU CHÍNH ĐIỆN","main","#9d4939"],
  [695,300,.34,"LUYỆN KHÍ ĐIỆN","forge","#82604a"],
  [895,300,.34,"QUAN TINH ĐÀI","observatory","#536c91"],
  [165,410,.30,"BẾ QUAN ĐỘNG PHỦ","cave","#536b62"],
  [355,410,.30,"ĐỆ TỬ VIỆN","academy","#66817a"],
  [550,410,.30,"TRẬN PHÁP CÁC","array","#4f7b83"],
  [745,410,.30,"HỘ SƠN TRẬN CÁC","guardian","#527e88"],
  [935,410,.30,"NGOẠI VỤ ĐIỆN","foreign","#916c48"]
 ];
 buildings.forEach(([x,y,s,title,type,accent])=>{
  drawSectMountainLedge(x,y,s);
  drawSectPavilion(x,y-5,s,title,type,accent);
 });
}

function drawCrowd(time){
 // Chưởng môn ngồi chính giữa, lùi sâu về hậu đài.
 drawVIPAura(550,552,112,"#ffe5a0",time,.4,2.2);
 drawVIPAura(550,552,70,"#fff0bf",time,1.8,1.7);
 drawVIPChair(550,579,1.38,"#762f32",time,0);
 drawFormalSpectator(550,566,1.04,"master",time,0);
 drawRoleLabel(550,493,"CHƯỞNG MÔN","#f2d17d",1.05);

 // Thân truyền bên trái, trưởng lão bên phải; tách hẳn khỏi bảo tọa.
 for(let i=0;i<10;i++){
  const x=150+i*22,y=612;
  drawVIPAura(x,y-10,22,"#a9d7ff",time,i*.7,.42);
  drawVIPChair(x,y,.58,"#405d82",time,i*.65);
  drawFormalSpectator(x,y-7,.52,"disciple",time,i);
 }
 drawRoleLabel(260,566,"CHÂN TRUYỀN ĐỆ TỬ","#a9c9f0",.82);
 for(let i=0;i<10;i++){
  const x=730+i*22,y=612;
  drawVIPAura(x,y-10,23,"#d7baff",time,i*.75,.45);
  drawVIPChair(x,y,.60,"#5b456b",time,i);
  drawFormalSpectator(x,y-7,.54,"elder",time,i*.8);
 }
 drawRoleLabel(840,566,"TRƯỞNG LÃO","#d4b5fa",.82);

 // Nòng cốt đứng thành một cụm liền khối, không ghế.
 for(let i=0;i<28;i++){
  const col=i%7,row=Math.floor(i/7),x=445+col*35+(row%2)*7,y=660+row*14+Math.sin(i*1.7)*2;
  drawVIPAura(x,y-8,12,"#b8e5d6",time,i*.61,.15);
  drawSpectator(x,y,.43,"core",time,i*.73);
 }
 drawRoleLabel(550,635,"ĐỆ TỬ NÒNG CỐT","#f5d984",.78);

 // Nội môn, ngoại môn và tạp dịch chen thành biển người bao quanh.
 const groups=[
  {role:"inner",count:64,scale:.37,y0:684,y1:735},
  {role:"outer",count:92,scale:.34,y0:705,y1:765},
  {role:"servant",count:132,scale:.30,y0:735,y1:798}
 ];
 groups.forEach((g,gi)=>{
  for(let i=0;i<g.count;i++){
   const col=i%48,row=Math.floor(i/48);
   const x=12+col*23+Math.sin(i*2.17+gi)*8+(row%2)*5;
   const y=g.y0+(g.y1-g.y0)*((Math.floor(i/48)+.5)/Math.max(1,Math.ceil(g.count/48)))+Math.sin(i*1.91+gi)*9;
   drawSpectator(x,y,g.scale,g.role,time,i*.59+gi*2.1);
  }
 });
 drawCrowdFlag(12,696,"#a53f36",time);drawCrowdFlag(W-18,696,"#b18a43",time);
}

function drawSpiritBirds(time){
 const flocks=[
  {dir:1,y:66,s:.55,speed:.000018,phase:.1,count:2},
  {dir:-1,y:118,s:.43,speed:.000014,phase:.55,count:2}
 ];
 flocks.forEach((f,k)=>{
  for(let j=0;j<f.count;j++){
   const p=(time*f.speed+f.phase+j*.48)%1;
   const x=f.dir>0?-75+p*(W+150):W+75-p*(W+150);
   const y=f.y+Math.sin(time*.00055+j*1.7+k)*5;
   const flap=Math.sin(time*.002+j*1.8+k)*.7;
   ctx.save();ctx.translate(x,y);ctx.scale(f.dir*f.s,f.s);
   ctx.fillStyle="#fffdf0";ctx.beginPath();ctx.ellipse(0,0,18,5,-.05,0,Math.PI*2);ctx.fill();
   ctx.strokeStyle="#fffdf0";ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();
   ctx.moveTo(12,-1);ctx.quadraticCurveTo(23,-12,21,-23);ctx.stroke();
   ctx.fillStyle="#fffdf0";ctx.beginPath();ctx.arc(20,-24,3.5,0,Math.PI*2);ctx.fill();
   ctx.fillStyle="#c94d3e";ctx.beginPath();ctx.moveTo(23,-24);ctx.lineTo(32,-22);ctx.lineTo(23,-20);ctx.closePath();ctx.fill();
   ctx.fillStyle="#fffdf5";ctx.beginPath();ctx.moveTo(-5,0);ctx.quadraticCurveTo(-22,-21-flap*5,-53,-20-flap*6);ctx.quadraticCurveTo(-36,6,-5,6);ctx.closePath();ctx.fill();
   ctx.beginPath();ctx.moveTo(-5,3);ctx.quadraticCurveTo(-22,13+flap*3,-42,20+flap*4);ctx.quadraticCurveTo(-25,11,-5,6);ctx.closePath();ctx.fill();
   ctx.strokeStyle="#b94c40";ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(-3,4);ctx.lineTo(-7,16);ctx.moveTo(5,4);ctx.lineTo(7,16);ctx.stroke();
   ctx.restore();
  }
 });
}

function drawRacerNameOnTarget(target,racer,x,y,rank,scale=1){
 const style=rank===1?{fill:"#ffe27a",glow:"#ffd34e",blur:14}:rank===2?{fill:"#f1f5ff",glow:"#b8d8f5",blur:10}:rank===3?{fill:"#ffc28a",glow:"#d88b54",blur:8}:{fill:"#fff7dc",glow:"#a9d9e7",blur:3};
 target.save();target.textAlign="center";target.textBaseline="middle";target.lineJoin="round";
 target.font="900 "+Math.max(9,13*scale)+"px Arial";target.lineWidth=3;target.strokeStyle="rgba(12,25,25,.96)";target.strokeText(racer.name,x,y,380);
 target.shadowColor=style.glow;target.shadowBlur=started?style.blur:0;target.fillStyle=started?style.fill:"#fff7dc";target.fillText(racer.name,x,y,380);
 if(started&&rank<=3){target.font="bold "+Math.max(8,10*scale)+"px Arial";target.fillStyle=style.glow;target.fillText(rank===1?"♛":rank===2?"✧":"✦",x,y-13*scale);}
 target.restore();
}

function drawCeremonyBackdrop(target,mini,time){
 const w=target.canvas.width,h=target.canvas.height;
 const bg=target.createLinearGradient(0,0,0,h);bg.addColorStop(0,"#9dbeb2");bg.addColorStop(.42,"#476b5c");bg.addColorStop(1,"#172e2b");
 target.fillStyle=bg;target.fillRect(0,0,w,h);
 // Dãy núi và mây tiên phía sau đại điện.
 target.fillStyle="#789a83";target.beginPath();target.moveTo(0,h*.46);target.lineTo(w*.12,h*.16);target.lineTo(w*.25,h*.39);target.lineTo(w*.42,h*.10);target.lineTo(w*.57,h*.38);target.lineTo(w*.77,h*.13);target.lineTo(w,h*.43);target.lineTo(w,h);target.lineTo(0,h);target.closePath();target.fill();
 target.fillStyle="#315746";target.beginPath();target.moveTo(0,h*.58);target.lineTo(w*.16,h*.34);target.lineTo(w*.31,h*.52);target.lineTo(w*.48,h*.27);target.lineTo(w*.67,h*.51);target.lineTo(w*.84,h*.32);target.lineTo(w,h*.56);target.lineTo(w,h);target.lineTo(0,h);target.closePath();target.fill();
 // Đại điện nhiều tầng mái vàng.
 const cx=w*.5,scale=mini?.62:1;
 target.save();target.translate(cx,h*.49);target.scale(scale,scale);
 target.fillStyle="#53372d";target.fillRect(-90,-68,180,82);
 target.fillStyle="#8c483b";target.fillRect(-76,-58,152,70);
 target.fillStyle="#f0d28a";target.fillRect(-83,8,166,6);
 for(let layer=0;layer<3;layer++){const yy=-68-layer*28,ww=130-layer*24;target.fillStyle=layer===0?"#4b302b":"#7b4b36";target.beginPath();target.moveTo(-ww*.7,yy+5);target.quadraticCurveTo(0,yy-40,ww*.7,yy+5);target.lineTo(ww*.56,yy+10);target.quadraticCurveTo(0,yy-25,-ww*.56,yy+10);target.closePath();target.fill();target.strokeStyle="#f2d58f";target.lineWidth=3;target.stroke();}
 target.fillStyle="#fff0b8";target.font="bold 12px Georgia";target.textAlign="center";target.fillText("LĂNG TIÊU CHÍNH ĐIỆN",0,-90);
 target.restore();
 // Sân lễ, bậc ngọc, cờ và đèn hai bên.
 target.fillStyle="#b9a77b";target.beginPath();target.moveTo(w*.12,h*.76);target.lineTo(w*.88,h*.76);target.lineTo(w,h);target.lineTo(0,h);target.closePath();target.fill();
 target.fillStyle="#665443";target.fillRect(w*.12,h*.78,w*.76,h*.035);target.fillStyle="#e5c77e";target.fillRect(w*.12,h*.78,w*.76,2);
 for(const side of [0,1]){const x=side?w*.91:w*.09;target.strokeStyle="#d6bd7c";target.lineWidth=mini?2:4;target.beginPath();target.moveTo(x,h*.42);target.lineTo(x,h*.79);target.stroke();target.fillStyle=side?"#a8473b":"#4c7294";target.beginPath();target.moveTo(x,h*.43);target.lineTo(x+(side?-1:1)*w*.07,h*.48);target.lineTo(x,h*.54);target.closePath();target.fill();}
 for(let i=0;i<14;i++){const x=w*(.08+i*.064);target.globalAlpha=.25+.3*Math.sin(time*.002+i)**2;target.fillStyle="#ffe6a4";target.beginPath();target.arc(x,h*.78,mini?1.2:2.5,0,Math.PI*2);target.fill();}
 target.globalAlpha=1;
}

function drawAwardMaster(target,x,y,scale,time){
 target.save();target.translate(x,y);target.scale(scale,scale);
 const aura=target.createRadialGradient(0,-35,2,0,-35,72);aura.addColorStop(0,"rgba(255,229,153,.34)");aura.addColorStop(1,"rgba(255,229,153,0)");
 target.fillStyle=aura;target.fillRect(-75,-110,150,145);
 target.fillStyle="#5a2929";target.beginPath();target.moveTo(-30,18);target.lineTo(-24,-47);target.quadraticCurveTo(0,-63,24,-47);target.lineTo(30,18);target.closePath();target.fill();
 target.fillStyle="#a8443b";target.beginPath();target.moveTo(-25,12);target.lineTo(-20,-43);target.lineTo(0,-52);target.lineTo(20,-43);target.lineTo(25,12);target.closePath();target.fill();
 target.strokeStyle="#f2d48b";target.lineWidth=3;target.stroke();
 target.fillStyle="#eac39d";target.beginPath();target.ellipse(0,-66,15,18,0,0,Math.PI*2);target.fill();
 target.fillStyle="#e6dfd2";target.beginPath();target.moveTo(-11,-56);target.lineTo(11,-56);target.lineTo(7,-31);target.lineTo(0,-25);target.lineTo(-7,-31);target.closePath();target.fill();
 target.fillStyle="#e8c36e";target.beginPath();target.moveTo(-17,-78);target.lineTo(-12,-96);target.lineTo(-4,-85);target.lineTo(0,-105);target.lineTo(5,-85);target.lineTo(13,-96);target.lineTo(17,-78);target.closePath();target.fill();
 target.strokeStyle="#efc39b";target.lineWidth=6;target.lineCap="round";target.beginPath();target.moveTo(-20,-36);target.lineTo(-35,-8);target.moveTo(20,-36);target.lineTo(40,-48);target.stroke();
 target.fillStyle="#ffe6a0";target.shadowColor="#ffe6a0";target.shadowBlur=18+Math.sin(time*.006)*5;target.beginPath();target.arc(43,-52,8,0,Math.PI*2);target.fill();target.shadowBlur=0;
 target.restore();
}

function drawPodiumScene(target,time,mini=false){
 const ordered=sortedRacers().slice(0,3),w=target.canvas.width,h=target.canvas.height;
 const elapsedCeremony=Math.max(0,(performance.now()-ceremonyStartedAt)/1000);
 const activeRank=Math.min(3,Math.floor(elapsedCeremony/4.5)+1);
 const active=ordered[activeRank-1]||ordered[0];
 drawCeremonyBackdrop(target,mini,time);
 target.save();target.textAlign="center";target.textBaseline="middle";
 target.font=mini?"900 11px Georgia":"900 34px Georgia";target.fillStyle="#fff0b8";target.shadowColor="#ffcf64";target.shadowBlur=mini?8:22;
 target.fillText("ĐẠI ĐIỂN VINH DANH TOP 3",w*.5,mini?11:h*.105);target.shadowBlur=0;
 const masterX=w*(mini?.29:.39),masterY=h*(mini?.68:.64),winnerX=w*(mini?.72:.72),winnerY=h*(mini?.67:.65);
 drawAwardMaster(target,masterX,masterY,mini?.47:1.25,time);
 if(active){
  // Nhân vật được xướng danh tiến lên nhận thưởng, tên nằm dưới khung hình.
  drawRacer(target,active,winnerX,winnerY,mini?.72:1.15,time);
  const color=activeRank===1?"#ffe17b":activeRank===2?"#dcecff":"#e6a16c";
  target.strokeStyle=color;target.lineWidth=mini?2:4;target.shadowColor=color;target.shadowBlur=mini?7:18;
  target.beginPath();target.moveTo(masterX+w*(mini?.10:.10),masterY-h*(mini?.18:.18));target.quadraticCurveTo(w*.55,h*.25,winnerX-w*(mini?.07:.07),winnerY-h*(mini?.12:.12));target.stroke();target.shadowBlur=0;
  target.fillStyle=color;target.beginPath();target.arc((masterX+winnerX)/2,h*(mini?.39:.40),mini?3:8,0,Math.PI*2);target.fill();
  target.font=mini?"bold 8px Arial":"bold 18px Arial";target.fillStyle="#fff3c6";target.fillText("CHƯỞNG MÔN TRAO THƯỞNG",w*.5,h*(mini?.82:.84));
 }
 // Bục tam cấp và bảng tên đặt thấp, không che mặt nhân vật.
 const podiumX=[w*.25,w*.5,w*.75],ranks=[2,1,3],colors=["#c88d45","#d9e1e8","#b8794e"],glows=["#ffe17b","#dcecff","#e6a16c"];
 for(let i=0;i<3;i++){
  const rank=ranks[i],racer=ordered[rank-1];if(!racer)continue;
  const base=h*(mini?.96:.96),top=h*(mini?(rank===1?.77:.82):(rank===1?.78:.82)),bw=w*(mini?.19:.18);
  const grad=target.createLinearGradient(podiumX[i]-bw/2,top,podiumX[i]+bw/2,base);grad.addColorStop(0,colors[rank-1]);grad.addColorStop(1,"#382f2a");
  target.fillStyle=grad;target.fillRect(podiumX[i]-bw/2,top,bw,base-top);target.strokeStyle=glows[rank-1];target.lineWidth=mini?1:2;target.strokeRect(podiumX[i]-bw/2,top,bw,base-top);
  target.fillStyle=glows[rank-1];target.font=mini?"bold 9px Arial":"bold 20px Georgia";target.fillText("HẠNG "+rank,podiumX[i],top+(mini?8:17));
  target.font=mini?"bold 6px Arial":"bold 13px Arial";target.fillStyle="#fff1c8";target.fillText(racer.name,podiumX[i],base-(mini?4:8),bw-5);
 }
 target.restore();
}

function drawRacerName(racer,x,y,scale){
 const rank=sortedRacers().findIndex(item=>item.id===racer.id)+1;
 drawRacerNameOnTarget(ctx,racer,x,y-43*scale,rank,scale);
}

// =====================================================
// REVISION 3 — nghi lễ trao giải, bố trí khán đài và tiên hạc
// =====================================================


function drawMasterBaguaAura(time){
  // Đại bát quái trận riêng quanh chưởng môn: tám quẻ, thái cực và linh châu.
  const cx=550,cy=646,rot=time*.00012;
  ctx.save();
  ctx.translate(cx,cy);
  ctx.rotate(rot);

  // Ba vòng trận pháp đồng tâm, chuyển động chậm.
  for(let i=0;i<3;i++){
    ctx.strokeStyle=i===0?"rgba(255,231,166,.78)":"rgba(190,225,208,.38)";
    ctx.lineWidth=i===0?2.2:1.25;
    ctx.beginPath();
    ctx.ellipse(0,0,48+i*17,17+i*6,0,0,Math.PI*2);
    ctx.stroke();
  }

  // Tám quẻ phân bố đều trên vòng ngoài.
  for(let i=0;i<8;i++){
    ctx.save();
    ctx.rotate(i*Math.PI/4);
    ctx.strokeStyle="rgba(255,235,184,.72)";
    ctx.lineWidth=1.8;
    ctx.beginPath();
    ctx.moveTo(0,-61);
    ctx.lineTo(0,-78);
    ctx.stroke();
    for(let j=0;j<3;j++){
      const yy=-83-j*5;
      if((i+j)%2===0){
        ctx.beginPath();ctx.moveTo(-5,yy);ctx.lineTo(5,yy);ctx.stroke();
      }else{
        ctx.beginPath();
        ctx.moveTo(-5,yy);ctx.lineTo(-1,yy);
        ctx.moveTo(1,yy);ctx.lineTo(5,yy);
        ctx.stroke();
      }
    }
    // Linh châu nhỏ ở đầu mỗi quẻ.
    ctx.fillStyle="rgba(255,231,166,.9)";
    ctx.beginPath();ctx.arc(0,-58,1.8,0,Math.PI*2);ctx.fill();
    ctx.restore();
  }

  // Thái cực đồ ở tâm trận.
  ctx.fillStyle="rgba(255,239,194,.92)";
  ctx.beginPath();ctx.arc(0,0,14,0,Math.PI*2);ctx.fill();
  ctx.fillStyle="#345d59";
  ctx.beginPath();
  ctx.arc(0,-7,7,Math.PI/2,-Math.PI/2);
  ctx.arc(0,7,7,-Math.PI/2,Math.PI/2);
  ctx.fill();
  ctx.fillStyle="#f8e6b5";
  ctx.beginPath();ctx.arc(0,-7,2.2,0,Math.PI*2);ctx.fill();
  ctx.fillStyle="#345d59";
  ctx.beginPath();ctx.arc(0,7,2.2,0,Math.PI*2);ctx.fill();
  ctx.restore();

  // Các hạt linh khí bay chậm quanh ngai, không che khuất nhân vật.
  ctx.save();
  for(let i=0;i<18;i++){
    const a=-time*.00032+i*Math.PI*2/18;
    const rx=94+Math.sin(time*.001+i)*5;
    const ry=34+Math.cos(time*.0013+i*.7)*3;
    const x=cx+Math.cos(a)*rx;
    const y=cy+Math.sin(a)*ry;
    ctx.globalAlpha=.28+.48*Math.pow(Math.sin(time*.002+i),2);
    ctx.fillStyle=i%3===0?"#fff0bc":"#bde9dc";
    ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=7;
    ctx.beginPath();ctx.arc(x,y,1.2+(i%3)*.45,0,Math.PI*2);ctx.fill();
  }
  ctx.restore();
}

function drawCrowd(time){
  // Chưởng môn ở chính giữa, hai nhóm danh dự ngồi tách hẳn hai bên.
  drawMasterBaguaAura(time);
  drawVIPAura(550,552,112,"#ffe5a0",time,.4,2.2);
  drawVIPAura(550,552,70,"#fff0bf",time,1.8,1.7);
  drawVIPChair(550,579,1.38,"#762f32",time,0);
  drawFormalSpectator(550,566,1.04,"master",time,0);
  drawRoleLabel(550,493,"CHƯỞNG MÔN","#f2d17d",1.05);

  // Thân truyền: 10 người ngồi bên trái, giãn đều, không sát nhau.
  for(let i=0;i<10;i++){
    const x=78+i*41,y=612;
    drawVIPAura(x,y-10,22,"#a9d7ff",time,i*.7,.42);
    drawVIPChair(x,y,.58,"#405d82",time,i*.65);
    drawFormalSpectator(x,y-7,.52,"disciple",time,i);
  }
  drawRoleLabel(263,566,"CHÂN TRUYỀN ĐỆ TỬ","#a9c9f0",.82);

  // Trưởng lão: 10 người bên phải, khoảng cách đồng đều.
  for(let i=0;i<10;i++){
    const x=662+i*41,y=612;
    drawVIPAura(x,y-10,23,"#d7baff",time,i*.75,.45);
    drawVIPChair(x,y,.60,"#5b456b",time,i);
    drawFormalSpectator(x,y-7,.54,"elder",time,i*.8);
  }
  drawRoleLabel(867,566,"TRƯỞNG LÃO","#d4b5fa",.82);

  // Nòng cốt đứng thành cụm, bỏ hoàn toàn bảng chữ trên đầu.
  for(let i=0;i<28;i++){
    const col=i%7,row=Math.floor(i/7);
    const x=445+col*35+(row%2)*7;
    const y=660+row*14+Math.sin(i*1.7)*2;
    drawVIPAura(x,y-8,12,"#b8e5d6",time,i*.61,.15);
    drawSpectator(x,y,.43,"core",time,i*.73);
  }

  // Các tầng đệ tử phổ thông tụ đông xung quanh nhưng vẫn có khe đứng riêng.
  const groups=[
    {role:"inner",count:64,scale:.37,y0:684,y1:735},
    {role:"outer",count:92,scale:.34,y0:705,y1:765},
    {role:"servant",count:132,scale:.30,y0:735,y1:798}
  ];
  groups.forEach((g,gi)=>{
    for(let i=0;i<g.count;i++){
      const col=i%48,row=Math.floor(i/48);
      const x=12+col*23+Math.sin(i*2.17+gi)*6+(row%2)*5;
      const y=g.y0+(g.y1-g.y0)*((row+.5)/Math.max(1,Math.ceil(g.count/48)))+Math.sin(i*1.91+gi)*7;
      drawSpectator(x,y,g.scale,g.role,time,i*.59+gi*2.1);
    }
  });
  drawCrowdFlag(12,696,"#a53f36",time);
  drawCrowdFlag(W-18,696,"#b18a43",time);
}

// Trao riêng từng giải trong 4,5 giây; sau đủ ba lượt mới dựng bục vinh danh.
function drawPodiumScene(target,time,mini=false){
  const ordered=sortedRacers().slice(0,3);
  const w=target.canvas.width,h=target.canvas.height;
  const elapsedCeremony=Math.max(0,(performance.now()-ceremonyStartedAt)/1000);
  const awardDuration=4.5;
  const finalCeremony=elapsedCeremony>=awardDuration*3;
  drawCeremonyBackdrop(target,mini,time);

  target.save();
  target.textAlign="center";
  target.textBaseline="middle";

  if(!finalCeremony){
    const rank=Math.min(3,Math.floor(elapsedCeremony/awardDuration)+1);
    const racer=ordered[rank-1];
    const color=rank===1?"#ffe17b":rank===2?"#dcecff":"#e6a16c";
    const title=rank===1?"TRAO THƯỞNG ĐỆ NHẤT":"TRAO THƯỞNG ĐỆ "+(rank===2?"NHỊ":"TAM");
    target.font=mini?"900 11px Georgia":"900 31px Georgia";
    target.fillStyle=color;target.shadowColor=color;target.shadowBlur=mini?8:20;
    target.fillText(title,w*.5,mini?12:h*.105);
    target.shadowBlur=0;

    // Chưởng môn và người nhận đứng riêng hai bên sân khấu.
    const masterX=w*(mini?.28:.30),masterY=h*(mini?.69:.68);
    const winnerX=w*(mini?.73:.73),winnerY=h*(mini?.68:.68);
    drawAwardMaster(target,masterX,masterY,mini?.48:1.42,time);
    if(racer){
      drawRacer(target,racer,winnerX,winnerY,mini?.78:1.30,time);
      target.font=mini?"bold 8px Arial":"bold 19px Arial";
      target.fillStyle="#fff4ce";
      target.fillText(racer.name,winnerX,h*(mini?.86:.86),w*.42);
      target.font=mini?"bold 8px Arial":"bold 17px Georgia";
      target.fillStyle=color;
      target.fillText("HẠNG "+rank,winnerX,h*(mini?.92:.92));
    }
    target.strokeStyle=color;target.lineWidth=mini?2:4;
    target.shadowColor=color;target.shadowBlur=mini?8:18;
    target.beginPath();
    target.moveTo(masterX+w*(mini?.10:.10),masterY-h*(mini?.18:.18));
    target.quadraticCurveTo(w*.53,h*.24,winnerX-w*(mini?.08:.08),winnerY-h*(mini?.13:.13));
    target.stroke();target.shadowBlur=0;
    target.font=mini?"bold 7px Arial":"bold 17px Arial";
    target.fillStyle="#fff0c5";
    target.fillText("CHƯỞNG MÔN ĐÍCH THÂN BAN THƯỞNG",w*.5,h*(mini?.97:.97));
  }else{
    // Chỉ sau khi đã trao đủ hạng 1, 2, 3 mới xuất hiện lễ vinh danh chung.
    target.font=mini?"900 11px Georgia":"900 32px Georgia";
    target.fillStyle="#fff0b8";target.shadowColor="#ffcf64";target.shadowBlur=mini?8:22;
    target.fillText("VINH DANH TAM GIÁP TIÊN HỘI",w*.5,mini?11:h*.105);
    target.shadowBlur=0;
    const podiumX=[w*.25,w*.5,w*.75],ranks=[2,1,3];
    const colors=["#c88d45","#d9e1e8","#b8794e"];
    const glows=["#ffe17b","#dcecff","#e6a16c"];
    for(let i=0;i<3;i++){
      const rank=ranks[i],racer=ordered[rank-1];
      if(!racer)continue;
      const base=h*(mini?.96:.96);
      const top=h*(mini?(rank===1?.70:.77):(rank===1?.69:.77));
      const bw=w*(mini?.20:.19);
      const grad=target.createLinearGradient(podiumX[i]-bw/2,top,podiumX[i]+bw/2,base);
      grad.addColorStop(0,colors[rank-1]);grad.addColorStop(1,"#382f2a");
      target.fillStyle=grad;target.fillRect(podiumX[i]-bw/2,top,bw,base-top);
      target.strokeStyle=glows[rank-1];target.lineWidth=mini?1:2;
      target.strokeRect(podiumX[i]-bw/2,top,bw,base-top);
      // Tên đặt ở mặt trước bục, không đè lên khuôn mặt.
      target.fillStyle=glows[rank-1];
      target.font=mini?"bold 8px Arial":"bold 18px Georgia";
      target.fillText("HẠNG "+rank,podiumX[i],top+(mini?8:17));
      target.font=mini?"bold 6px Arial":"bold 13px Arial";
      target.fillStyle="#fff1c8";
      target.fillText(racer.name,podiumX[i],base-(mini?4:8),bw-5);
    }
    drawAwardMaster(target,w*.5,h*.57,mini?.38:1.05,time);
    target.font=mini?"bold 7px Arial":"bold 18px Georgia";
    target.fillStyle="#fff0c5";
    target.fillText("CHƯỞNG MÔN VINH DANH BA VỊ TRÍ DẪN ĐẦU",w*.5,h*.48);
  }
  target.restore();
}

// Tiên hạc luôn giữ thân thẳng đứng; chỉ lật ngang khi đổi hướng,
// tuyệt đối không xoay vòng hoặc lộn ngược đầu.
function drawSpiritBirds(time){
 const flocks=[
  {dir:1,y:66,s:.55,speed:.000018,phase:.1,count:2},
  {dir:-1,y:118,s:.43,speed:.000014,phase:.55,count:2}
 ];
 flocks.forEach((f,k)=>{
  for(let j=0;j<f.count;j++){
   const p=(time*f.speed+f.phase+j*.48)%1;
   const x=f.dir>0?-75+p*(W+150):W+75-p*(W+150);
   const y=f.y+Math.sin(time*.00055+j*1.7+k)*5;
   const flap=Math.sin(time*.002+j*1.8+k)*.7;
   ctx.save();ctx.translate(x,y);ctx.scale(f.dir*f.s,f.s);
   ctx.fillStyle="#fffdf0";ctx.beginPath();ctx.ellipse(0,0,18,5,-.05,0,Math.PI*2);ctx.fill();
   ctx.strokeStyle="#fffdf0";ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();
   ctx.moveTo(12,-1);ctx.quadraticCurveTo(23,-12,21,-23);ctx.stroke();
   ctx.fillStyle="#fffdf0";ctx.beginPath();ctx.arc(20,-24,3.5,0,Math.PI*2);ctx.fill();
   ctx.fillStyle="#c94d3e";ctx.beginPath();ctx.moveTo(23,-24);ctx.lineTo(32,-22);ctx.lineTo(23,-20);ctx.closePath();ctx.fill();
   ctx.fillStyle="#fffdf5";ctx.beginPath();ctx.moveTo(-5,0);ctx.quadraticCurveTo(-22,-21-flap*5,-53,-20-flap*6);ctx.quadraticCurveTo(-36,6,-5,6);ctx.closePath();ctx.fill();
   ctx.beginPath();ctx.moveTo(-5,3);ctx.quadraticCurveTo(-22,13+flap*3,-42,20+flap*4);ctx.quadraticCurveTo(-25,11,-5,6);ctx.closePath();ctx.fill();
   ctx.strokeStyle="#b94c40";ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(-3,4);ctx.lineTo(-7,16);ctx.moveTo(5,4);ctx.lineTo(7,16);ctx.stroke();
   ctx.restore();
  }
 });
}



// =====================================================

function awardSmoothstep(t){t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);}

// REVISION 4 — TIÊN HẠC, THÁC NƯỚC, RỪNG TIÊN,
// CỔNG ĐÍCH THIÊN KHẢI VÀ CHƯỞNG MÔN NGỰ KIẾM TRAO GIẢI
// =====================================================

function drawWaterfall(x,y,width,height,time){
  ctx.save();
  // Vách đá tối làm nền, nước không còn là một dải dài đặc.
  const rock=ctx.createLinearGradient(x-width*1.5,y,x+width*1.5,y+height);
  rock.addColorStop(0,"#526d58");rock.addColorStop(.5,"#294c43");rock.addColorStop(1,"#183a36");
  ctx.fillStyle=rock;ctx.beginPath();
  ctx.moveTo(x-width*1.45,y-8);ctx.lineTo(x+width*1.45,y-8);
  ctx.lineTo(x+width*1.9,y+height);ctx.lineTo(x-width*1.9,y+height);ctx.closePath();ctx.fill();
  // Hồ nguồn.
  const source=ctx.createLinearGradient(x-width,y-8,x+width,y+10);
  source.addColorStop(0,"#286879");source.addColorStop(.5,"#d9fff2");source.addColorStop(1,"#347d88");
  ctx.fillStyle=source;ctx.beginPath();ctx.ellipse(x,y+2,width*1.05,8,0,0,Math.PI*2);ctx.fill();
  // Màn nước nền mờ, có mép cong thay vì một khối chữ nhật.
  const base=ctx.createLinearGradient(x-width,y,x+width,y);
  base.addColorStop(0,"rgba(49,126,143,.55)");base.addColorStop(.24,"rgba(135,215,211,.75)");
  base.addColorStop(.5,"rgba(225,255,244,.88)");base.addColorStop(.78,"rgba(105,190,194,.72)");base.addColorStop(1,"rgba(39,105,126,.5)");
  ctx.fillStyle=base;ctx.beginPath();
  ctx.moveTo(x-width*.48,y+4);
  ctx.bezierCurveTo(x-width*.62,y+height*.28,x-width*.8,y+height*.72,x-width*1.15,y+height);
  ctx.quadraticCurveTo(x,y+height+8,x+width*1.15,y+height);
  ctx.bezierCurveTo(x+width*.8,y+height*.72,x+width*.62,y+height*.28,x+width*.48,y+4);
  ctx.closePath();ctx.fill();
  ctx.save();ctx.beginPath();
  ctx.moveTo(x-width*.48,y+4);
  ctx.bezierCurveTo(x-width*.62,y+height*.28,x-width*.8,y+height*.72,x-width*1.15,y+height);
  ctx.quadraticCurveTo(x,y+height+8,x+width*1.15,y+height);
  ctx.bezierCurveTo(x+width*.8,y+height*.72,x+width*.62,y+height*.28,x+width*.48,y+4);
  ctx.closePath();ctx.clip();
  // Nhiều sợi ngắn tách rời, trượt từ trên xuống với tốc độ vừa phải.
  const offset=(time*.045)%58;
  for(let i=0;i<34;i++){
    const t=(i+.5)/34;
    const px=x-width*1.02+t*width*2.04;
    const len=18+(i%5)*8+(Math.sin(i*2.1)*4);
    const travel=(i*19+offset*(.72+(i%4)*.12))%(height+len)-len;
    const sway=Math.sin(time*.0012+i*1.73)*2.8;
    const alpha=.25+((i*7)%10)/18;
    ctx.globalAlpha=alpha;
    ctx.strokeStyle=i%7===0?"#f7fff0":i%3===0?"#e2fff5":"#79c9ce";
    ctx.lineWidth=i%6===0?2.2:1+(i%3)*.35;
    ctx.lineCap="round";ctx.beginPath();
    ctx.moveTo(px, y+travel);
    ctx.bezierCurveTo(px+sway-2,y+travel+len*.32,px+sway+2,y+travel+len*.72,px+sway,y+travel+len);
    ctx.stroke();
    if(i%3===0){
      ctx.globalAlpha=alpha*.55;ctx.fillStyle="#f4fff7";
      ctx.beginPath();ctx.ellipse(px+sway,y+travel+len,1.2,2.2,0,0,Math.PI*2);ctx.fill();
    }
  }
  // Các gợn ngang ngắn, phân tán.
  for(let i=0;i<15;i++){
    const yy=y+((i*37+time*.022)%(height+12));
    const xx=x+Math.sin(i*2.7+time*.001)*width*.56;
    ctx.globalAlpha=.25+.25*Math.sin(i+time*.003)**2;
    ctx.strokeStyle="#f1fff4";ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(xx-width*.12,yy);ctx.quadraticCurveTo(xx,yy+2,xx+width*.13,yy);ctx.stroke();
  }
  ctx.restore();
  ctx.globalAlpha=1;
  // Bọt chân thác và hồ nước.
  const mist=ctx.createRadialGradient(x,y+height,2,x,y+height,width*2.7);
  mist.addColorStop(0,"rgba(244,255,247,.62)");mist.addColorStop(.35,"rgba(129,220,211,.28)");mist.addColorStop(1,"rgba(80,155,160,0)");
  ctx.fillStyle=mist;ctx.beginPath();ctx.ellipse(x,y+height,width*2.7,13,0,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle="rgba(236,255,246,.7)";ctx.lineWidth=1.5;
  for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse(x,y+height+2,width*(.8+i*.48),4+i*2,0,0,Math.PI*2);ctx.stroke();}
  ctx.restore();
}

function drawDenseForest(time){
  // Rừng chỉ mọc trên hai sườn núi; vùng sông và quảng trường luôn để trống.
  const clusters=[
    {x:18,y:520,s:1.05},{x:62,y:500,s:.88},{x:105,y:535,s:.78},
    {x:145,y:485,s:.62},{x:185,y:515,s:.54},
    {x:915,y:515,s:.54},{x:955,y:485,s:.62},
    {x:1000,y:535,s:.78},{x:1040,y:500,s:.88},{x:1080,y:520,s:1.05}
  ];
  clusters.forEach((p,i)=>{
    const sway=Math.sin(time*.0007+i*1.9)*1.5;
    drawPine(p.x+sway,p.y,p.s*(.96+.025*Math.sin(time*.001+i)));
    drawTree(p.x+13,p.y+14,p.s*.62,i%2?"#315f49":"#3b704e");
    // Tán bụi và cây non tạo cảm giác rừng nhiều tầng.
    ctx.save();ctx.globalAlpha=.9;ctx.fillStyle=i%2?"#244c3c":"#2d5941";
    for(let k=0;k<4;k++){
      const xx=p.x-22+k*13,yy=p.y+22+(k%2)*7;
      ctx.beginPath();ctx.ellipse(xx,yy,13*p.s,8*p.s,-.15,0,Math.PI*2);ctx.fill();
    }
    ctx.restore();
  });
  // Lớp tán cây xa trên sườn núi, không đặt vào lòng sông.
  for(let i=0;i<15;i++){
    const left=i<8,x=left?12+i*18:970+(i-8)*18;
    const y=430+(i%3)*17,s=.34+(i%4)*.07;
    drawPine(x,y,s,i%2?"#315e48":"#426d4c");
  }
}

function drawCelestialDestination(time){
  const x=TRACK.right,top=TRACK.top-48,bottom=TRACK.bottom-8;
  ctx.save();
  // Quầng sáng sau cổng.
  const halo=ctx.createRadialGradient(x,top+92,4,x,top+92,142);
  halo.addColorStop(0,"rgba(255,239,178,.62)");halo.addColorStop(.35,"rgba(155,226,222,.22)");halo.addColorStop(1,"rgba(115,211,208,0)");
  ctx.fillStyle=halo;ctx.fillRect(x-150,top-35,300,bottom-top+70);
  // Hai trụ ngọc chạm khắc, không có chữ hay biển hiệu.
  for(const side of [-1,1]){
    const px=x+side*36;
    const grad=ctx.createLinearGradient(px-9,0,px+9,0);
    grad.addColorStop(0,"#526b63");grad.addColorStop(.35,"#e9d99f");grad.addColorStop(.65,"#9dc6b3");grad.addColorStop(1,"#40594d");
    ctx.fillStyle=grad;ctx.fillRect(px-7,top+35,14,bottom-top-35);
    ctx.strokeStyle="#fff0bc";ctx.lineWidth=1.5;ctx.strokeRect(px-7,top+35,14,bottom-top-35);
    for(let j=0;j<4;j++){
      const yy=top+54+j*78;
      ctx.fillStyle="#f4df9f";ctx.beginPath();ctx.arc(px,yy,3.2,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle="rgba(255,239,186,.8)";ctx.beginPath();ctx.ellipse(px,yy,13,5,0,0,Math.PI*2);ctx.stroke();
    }
    // Đế sen.
    ctx.fillStyle="#9b8256";ctx.beginPath();ctx.moveTo(px-18,bottom);ctx.lineTo(px-13,bottom-12);ctx.lineTo(px+13,bottom-12);ctx.lineTo(px+18,bottom);ctx.closePath();ctx.fill();
    ctx.fillStyle="#e9d59a";ctx.fillRect(px-21,bottom-14,42,4);
  }
  // Vòm ngọc nhiều tầng, tạo dáng cổng thiên giới.
  for(let layer=0;layer<3;layer++){
    ctx.beginPath();ctx.moveTo(x-52,top+45+layer*7);
    ctx.quadraticCurveTo(x,top-31+layer*7,x+52,top+45+layer*7);
    ctx.strokeStyle=layer===0?"#fff2bf":layer===1?"#d6b36e":"#6d9e8a";
    ctx.lineWidth=layer===0?6:layer===1?3:1.5;ctx.stroke();
  }
  // Vòng tiên trận ở giữa, không có bảng chữ.
  const pulse=1+Math.sin(time*.002)*.035;
  ctx.save();ctx.translate(x,top+104);ctx.scale(pulse,1);
  for(let i=0;i<3;i++){
    ctx.strokeStyle=i===0?"rgba(255,246,199,.9)":"rgba(135,224,214,.65)";
    ctx.lineWidth=i===0?2.4:1.2;ctx.beginPath();ctx.ellipse(0,0,31+i*13,43+i*10,0,0,Math.PI*2);ctx.stroke();
  }
  ctx.rotate(time*.00022);ctx.strokeStyle="rgba(255,238,181,.82)";ctx.lineWidth=1.4;
  for(let i=0;i<8;i++){ctx.rotate(Math.PI/4);ctx.beginPath();ctx.moveTo(0,-20);ctx.lineTo(0,-52);ctx.stroke();ctx.beginPath();ctx.arc(0,-54,3,0,Math.PI*2);ctx.stroke();}
  ctx.restore();
  // Vệt sáng đích dạng cột linh quang.
  const beam=ctx.createLinearGradient(0,top+52,0,bottom-8);
  beam.addColorStop(0,"rgba(255,249,209,0)");beam.addColorStop(.5,"rgba(255,246,198,.8)");beam.addColorStop(1,"rgba(255,249,209,0)");
  ctx.fillStyle=beam;ctx.fillRect(x-1.5,top+52,3,bottom-top-60);
  ctx.restore();
}

function drawImmortalFinishGate(){
  drawCelestialDestination(sceneTime||0);
}

function drawAmbientEnergy(time){
  const orbit=(cx,cy,rx,ry,amount,color,speed,alpha)=>{
    ctx.save();ctx.strokeStyle=color;ctx.lineWidth=1.6;ctx.globalAlpha=alpha;
    ctx.shadowColor=color;ctx.shadowBlur=9;
    for(let i=0;i<amount;i++){
      const a=time*speed+i*Math.PI*2/amount;
      const x=cx+Math.cos(a)*rx,y=cy+Math.sin(a)*ry;
      ctx.beginPath();ctx.ellipse(cx,cy,rx,ry,a*.08,a,a+.72);ctx.stroke();
      ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,1.7,0,Math.PI*2);ctx.fill();
    }
    ctx.restore();
  };
  // Thứ tự cường độ: chưởng môn > trưởng lão/thân truyền > kiến trúc > thác/sông > tiên hạc.
  orbit(550,648,78,27,10,"#ffe8a4",.00072,.92);
  orbit(550,648,112,38,7,"#fff0bf",-.00048,.68);
  for(let i=0;i<10;i++){
    orbit(150+i*22,655,15,7,2,"#b9d8ff",.0009+i*.00002,.34);
    orbit(730+i*22,655,16,7,2,"#d8c2ff",-.00085-i*.00002,.36);
  }
  // Linh khí trên các lầu các, nhẹ hơn nhóm danh dự.
  [[185,280],[305,292],[425,282],[550,318],[675,282],[795,292],[915,220],[185,438],[305,446],[425,438],[550,450],[675,438],[900,440],[795,445]].forEach((p,i)=>{
    orbit(p[0],p[1]-28,22,8,2,"#f3dfac",.00042+i*.000015,.18);
  });
  // Hơi nước và sông chỉ có hạt sáng thưa, rất nhẹ.
  for(let i=0;i<16;i++){
    const x=105+(i*67)%900,y=360+(i%5)*26;
    ctx.globalAlpha=.10+.08*Math.sin(time*.002+i)**2;ctx.fillStyle="#d7fff0";
    ctx.beginPath();ctx.arc(x+Math.sin(time*.001+i)*5,y,1.4,0,Math.PI*2);ctx.fill();
  }
}

function drawSpiritBirds(time){
 const flocks=[
  {dir:1,y:66,s:.55,speed:.000018,phase:.1,count:2},
  {dir:-1,y:118,s:.43,speed:.000014,phase:.55,count:2}
 ];
 flocks.forEach((f,k)=>{
  for(let j=0;j<f.count;j++){
   const p=(time*f.speed+f.phase+j*.48)%1;
   const x=f.dir>0?-75+p*(W+150):W+75-p*(W+150);
   const y=f.y+Math.sin(time*.00055+j*1.7+k)*5;
   const flap=Math.sin(time*.002+j*1.8+k)*.7;
   ctx.save();ctx.translate(x,y);ctx.scale(f.dir*f.s,f.s);
   ctx.fillStyle="#fffdf0";ctx.beginPath();ctx.ellipse(0,0,18,5,-.05,0,Math.PI*2);ctx.fill();
   ctx.strokeStyle="#fffdf0";ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();
   ctx.moveTo(12,-1);ctx.quadraticCurveTo(23,-12,21,-23);ctx.stroke();
   ctx.fillStyle="#fffdf0";ctx.beginPath();ctx.arc(20,-24,3.5,0,Math.PI*2);ctx.fill();
   ctx.fillStyle="#c94d3e";ctx.beginPath();ctx.moveTo(23,-24);ctx.lineTo(32,-22);ctx.lineTo(23,-20);ctx.closePath();ctx.fill();
   ctx.fillStyle="#fffdf5";ctx.beginPath();ctx.moveTo(-5,0);ctx.quadraticCurveTo(-22,-21-flap*5,-53,-20-flap*6);ctx.quadraticCurveTo(-36,6,-5,6);ctx.closePath();ctx.fill();
   ctx.beginPath();ctx.moveTo(-5,3);ctx.quadraticCurveTo(-22,13+flap*3,-42,20+flap*4);ctx.quadraticCurveTo(-25,11,-5,6);ctx.closePath();ctx.fill();
   ctx.strokeStyle="#b94c40";ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(-3,4);ctx.lineTo(-7,16);ctx.moveTo(5,4);ctx.lineTo(7,16);ctx.stroke();
   ctx.restore();
  }
 });
}

function drawAwardMaster(target,x,y,scale,time){
  target.save();target.translate(x,y);target.scale(scale,scale);
  // Phi kiếm chưởng môn: thân kiếm dài, chuôi ngọc, trận văn và đuôi linh quang.
  const sword=target.createLinearGradient(-66,0,66,0);
  sword.addColorStop(0,"#8c9da0");sword.addColorStop(.25,"#e8f7e8");sword.addColorStop(.52,"#fff4c1");sword.addColorStop(.78,"#a9dcd2");sword.addColorStop(1,"#607c80");
  target.save();target.shadowColor="#baf7ef";target.shadowBlur=20;
  target.fillStyle="rgba(179,244,233,.16)";target.beginPath();target.ellipse(-4,24,90,15,0,0,Math.PI*2);target.fill();
  target.fillStyle=sword;target.beginPath();target.moveTo(-68,22);target.lineTo(48,16);target.lineTo(69,21);target.lineTo(47,26);target.lineTo(-68,27);target.closePath();target.fill();
  target.strokeStyle="#fff3bf";target.lineWidth=2;target.stroke();
  target.fillStyle="#b68a43";target.fillRect(-17,15,7,16);target.fillRect(-27,17,25,4);
  target.fillStyle="#70d4d0";target.beginPath();target.arc(-14,17,4,0,Math.PI*2);target.fill();
  target.restore();
  // Vệt bay kéo dài phía sau.
  target.globalAlpha=.55;target.strokeStyle="#d9fff1";target.lineWidth=2;
  for(let i=0;i<4;i++){target.beginPath();target.moveTo(-75,28+i*3);target.quadraticCurveTo(-105,20+i*7,-132,34+i*5);target.stroke();}
  target.globalAlpha=1;
  // Thân chưởng môn, tay phải vươn ra trao pháp bảo.
  target.fillStyle="#54292b";target.beginPath();target.moveTo(-28,16);target.lineTo(-24,-48);target.quadraticCurveTo(0,-67,24,-48);target.lineTo(30,16);target.closePath();target.fill();
  target.fillStyle="#a8443b";target.beginPath();target.moveTo(-23,12);target.lineTo(-19,-43);target.lineTo(0,-54);target.lineTo(20,-43);target.lineTo(25,12);target.closePath();target.fill();
  target.strokeStyle="#f2d48b";target.lineWidth=3;target.stroke();
  target.fillStyle="#eac39d";target.beginPath();target.ellipse(0,-68,14,17,0,0,Math.PI*2);target.fill();
  target.fillStyle="#e6dfd2";target.beginPath();target.moveTo(-10,-57);target.lineTo(10,-57);target.lineTo(7,-32);target.lineTo(0,-26);target.lineTo(-7,-32);target.closePath();target.fill();
  target.fillStyle="#e8c36e";target.beginPath();target.moveTo(-16,-80);target.lineTo(-12,-98);target.lineTo(-4,-86);target.lineTo(0,-108);target.lineTo(5,-86);target.lineTo(13,-98);target.lineTo(16,-80);target.closePath();target.fill();
  target.strokeStyle="#efc39b";target.lineWidth=6;target.lineCap="round";target.beginPath();
  target.moveTo(-20,-39);target.lineTo(-37,-8);
  target.moveTo(20,-39);target.lineTo(40,-49);
  target.stroke();
  target.strokeStyle="#efc39b";target.lineWidth=5;target.beginPath();target.moveTo(40,-49);target.lineTo(55,-58);target.stroke();
  target.fillStyle="#ffe6a0";target.shadowColor="#ffe6a0";target.shadowBlur=20+Math.sin(time*.006)*5;
  target.beginPath();target.arc(58,-60,7,0,Math.PI*2);target.fill();target.shadowBlur=0;
  target.restore();
}

function drawPodiumScene(target,time,mini=false){
  const ordered=sortedRacers().slice(0,3),w=target.canvas.width,h=target.canvas.height;
  const elapsedCeremony=Math.max(0,(performance.now()-ceremonyStartedAt)/1000);
  const awardDuration=6.0,flightPhase=(elapsedCeremony%awardDuration)/awardDuration;
  const finalCeremony=elapsedCeremony>=awardDuration*3;
  drawCeremonyBackdrop(target,mini,time);
  target.save();target.textAlign="center";target.textBaseline="middle";
  if(!finalCeremony){
    const rank=Math.min(3,Math.floor(elapsedCeremony/awardDuration)+1),racer=ordered[rank-1];
    const color=rank===1?"#ffe17b":rank===2?"#dcecff":"#e6a16c";
    target.font=mini?"900 11px Georgia":"900 30px Georgia";target.fillStyle=color;target.shadowColor=color;target.shadowBlur=mini?8:20;
    target.fillText(rank===1?"BAN THƯỞNG ĐỆ NHẤT":rank===2?"BAN THƯỞNG ĐỆ NHỊ":"BAN THƯỞNG ĐỆ TAM",w*.5,mini?12:h*.09);target.shadowBlur=0;
    // Ngai chưởng môn còn ở phía trái sân khấu; chưởng môn khởi hành từ ngai.
    const throneX=w*.17,throneY=h*.82;
    target.fillStyle="#644b35";target.fillRect(throneX-w*.055,throneY-h*.10,w*.11,h*.10);
    target.fillStyle="#d8b975";target.fillRect(throneX-w*.063,throneY-h*.105,w*.126,h*.012);
    target.fillStyle="#8e3d35";target.fillRect(throneX-w*.035,throneY-h*.20,w*.07,h*.10);
    target.strokeStyle="#f0d28a";target.lineWidth=mini?1:3;target.strokeRect(throneX-w*.035,throneY-h*.20,w*.07,h*.10);
    // Bay từ ngai lên giữa sân, dừng lại trao tận tay rồi lướt về.
    const flightIn=awardSmoothstep(flightPhase/.34),flightOut=awardSmoothstep((flightPhase-.84)/.16);
    const masterX=throneX+(w*.43-throneX)*flightIn-(w*.10)*flightOut;
    const masterY=throneY-h*.19-(h*.12)*Math.sin(Math.min(1,flightPhase/.84)*Math.PI*.72);
    const masterScale=mini?.43:1.12;
    drawAwardMaster(target,masterX,masterY,masterScale,time);
    if(racer){
      const winnerX=w*.76,winnerY=h*.68;
      drawRacer(target,racer,winnerX,winnerY,mini?.73:1.18,time);
      // Tên và thứ hạng nằm ở chân sân khấu, không che gương mặt.
      target.font=mini?"bold 7px Arial":"bold 16px Arial";target.fillStyle="#fff4ce";
      target.fillText(racer.name,winnerX,h*.86,w*.34);
      target.font=mini?"bold 7px Arial":"bold 15px Georgia";target.fillStyle=color;
      target.fillText("HẠNG "+rank,winnerX,h*.92);
      // Pháp bảo được chuyển tận tay: viên ngọc bay khỏi tay chưởng môn sang tay người nhận.
      const handoff=awardSmoothstep((flightPhase-.42)/.25);
      const giftX=masterX+ (winnerX-masterX)*handoff;
      const giftY=h*.60-Math.sin(handoff*Math.PI)*h*.07;
      target.strokeStyle=color;target.lineWidth=mini?2:4;target.shadowColor=color;target.shadowBlur=mini?7:18;
      target.beginPath();target.moveTo(masterX+w*.045,masterY-h*.10);target.quadraticCurveTo(w*.55,h*.36,giftX,handoff>.8?winnerY-h*.10:giftY);target.stroke();target.shadowBlur=0;
      target.fillStyle=color;target.shadowColor=color;target.shadowBlur=mini?8:22;
      target.beginPath();target.arc(giftX,giftY,mini?4:9,0,Math.PI*2);target.fill();target.shadowBlur=0;
      target.fillStyle="#fff0c5";target.font=mini?"bold 7px Arial":"bold 16px Arial";
    }
  }else{
    // Sau khi đã trao đủ cả ba phần thưởng mới vinh danh tam giáp.
    target.font=mini?"900 11px Georgia":"900 31px Georgia";target.fillStyle="#fff0b8";target.shadowColor="#ffcf64";target.shadowBlur=mini?8:22;
    target.fillText("VINH DANH TAM GIÁP TIÊN HỘI",w*.5,mini?12:h*.10);target.shadowBlur=0;
    const podiumX=[w*.25,w*.5,w*.75],ranks=[2,1,3],colors=["#c88d45","#d9e1e8","#b8794e"],glows=["#ffe17b","#dcecff","#e6a16c"];
    for(let i=0;i<3;i++){
      const rank=ranks[i],racer=ordered[rank-1];if(!racer)continue;
      const base=h*.96,top=h*(rank===1?.69:.77),bw=w*.19;
      const grad=target.createLinearGradient(podiumX[i]-bw/2,top,podiumX[i]+bw/2,base);
      grad.addColorStop(0,colors[rank-1]);grad.addColorStop(1,"#382f2a");
      target.fillStyle=grad;target.fillRect(podiumX[i]-bw/2,top,bw,base-top);
      target.strokeStyle=glows[rank-1];target.lineWidth=mini?1:2;target.strokeRect(podiumX[i]-bw/2,top,bw,base-top);
      target.fillStyle=glows[rank-1];target.font=mini?"bold 8px Arial":"bold 18px Georgia";target.fillText("HẠNG "+rank,podiumX[i],top+(mini?8:17));
      target.font=mini?"bold 6px Arial":"bold 13px Arial";target.fillStyle="#fff1c8";target.fillText(racer.name,podiumX[i],base-(mini?4:8),bw-5);
    }
    drawAwardMaster(target,w*.5,h*.62,mini?.34:.88,time);
  }
  target.restore();
}

function drawScenery(time){
  drawSky(time);
  drawMountainRange();
  drawMovingClouds(time);
  // Nền quảng trường được vẽ trước; không phủ lên chân kiến trúc hay tán rừng.
  drawRiver(time);
  drawWaterfall(112,292,25,172,time);
  drawWaterfall(972,238,34,205,time);
  drawSectArchitecture(time);
  // Rừng rậm nằm ngoài lòng sông, không trồng cây giữa đường nước.
  drawDenseForest(time);
  drawAmbientEnergy(time);
  drawSpiritBirds(time);
  drawCrowd(time);
}




// Camera nền cũng không dùng chữ hay biển hiệu TIÊN MÔN.
function drawCameraBackground(){
 const w=cameraCanvas.width,h=cameraCanvas.height,t=sceneTime||0,c=cameraCtx;
 c.clearRect(0,0,w,h);
 const sky=c.createLinearGradient(0,0,0,h);sky.addColorStop(0,"#9fc5c5");sky.addColorStop(.48,"#d4e2cf");sky.addColorStop(1,"#e7d9b4");c.fillStyle=sky;c.fillRect(0,0,w,h);
 // Nắng dịu và mây mỏng.
 const sun=c.createRadialGradient(325,28,2,325,28,95);sun.addColorStop(0,"rgba(255,248,211,.85)");sun.addColorStop(1,"rgba(255,235,180,0)");c.fillStyle=sun;c.fillRect(225,-65,200,180);
 for(let i=0;i<4;i++){const x=((i*125+t*.004)%(w+100))-50,y=40+(i%3)*20;c.fillStyle="rgba(255,255,239,.35)";c.beginPath();c.ellipse(x,y,36,6,0,0,Math.PI*2);c.ellipse(x+17,y-4,22,9,0,0,Math.PI*2);c.fill();}
 // Các dãy tiên sơn thấp, đỉnh tròn và đan xen giống phong cảnh game.
 const ridge=(pts,color)=>{c.fillStyle=color;c.beginPath();c.moveTo(0,h);pts.forEach(([x,y],i)=>i?c.quadraticCurveTo((pts[i-1][0]+x)/2,Math.min(pts[i-1][1],y)-8,x,y):c.lineTo(x,y));c.lineTo(w,h);c.closePath();c.fill();};
 ridge([[0,111],[38,77],[82,87],[125,48],[170,68],[213,38],[255,75],[300,45],[345,72],[385,51],[420,85]],"#b1c9ae");
 ridge([[0,139],[45,103],[88,119],[135,78],[180,112],[225,76],[270,115],[315,82],[360,118],[420,94]],"#72977b");
 ridge([[0,158],[55,131],[105,146],[155,112],[205,143],[260,111],[315,146],[370,119],[420,150]],"#416d55");
 // Vách núi hai bên và thác đổ từ khe đá xuống dòng sông.
 c.fillStyle="#365d48";c.beginPath();c.moveTo(0,105);c.quadraticCurveTo(38,84,72,108);c.lineTo(78,166);c.lineTo(0,174);c.closePath();c.fill();
 c.fillStyle="#365d48";c.beginPath();c.moveTo(420,104);c.quadraticCurveTo(382,84,348,108);c.lineTo(342,166);c.lineTo(420,174);c.closePath();c.fill();
 for(const x of [66,354]){
  c.fillStyle="#183b37";c.beginPath();c.moveTo(x-12,95);c.quadraticCurveTo(x,80,x+12,95);c.lineTo(x+8,102);c.quadraticCurveTo(x,97,x-8,102);c.closePath();c.fill();
  const water=c.createLinearGradient(x-12,0,x+12,0);water.addColorStop(0,"#3b8790");water.addColorStop(.48,"#e5fff3");water.addColorStop(1,"#4d9ca4");
  c.fillStyle=water;c.beginPath();c.moveTo(x-7,98);c.bezierCurveTo(x-10,119,x-13,142,x-24,163);c.quadraticCurveTo(x,170,x+24,163);c.bezierCurveTo(x+13,142,x+10,119,x+7,98);c.closePath();c.fill();
  c.save();c.beginPath();c.rect(x-24,98,48,68);c.clip();for(let j=0;j<8;j++){const yy=100+((j*17+t*.02)%68);c.strokeStyle=j%3?"rgba(236,255,248,.7)":"#fff";c.lineWidth=j%3?1:1.7;c.beginPath();c.moveTo(x-6+(j%4)*3,yy);c.lineTo(x-8+(j%4)*3,yy+10);c.stroke();}c.restore();
 }
 // Tiên điện giữa thung lũng, giữ hình khối đơn giản, dễ nhận ra.
 function pavilion(x,y,s,color,main=false){c.save();c.translate(x,y);c.scale(s,s);c.fillStyle="#4d3b30";c.fillRect(-24,-28,48,29);c.fillStyle=color;c.fillRect(-20,-24,40,24);c.fillStyle="#e1c27b";c.fillRect(-26,0,52,3);for(const px of [-16,0,16]){c.fillStyle="#f0d38b";c.fillRect(px-2,-23,4,23);}const roof=(ww,yy,hh)=>{c.fillStyle="#9b7047";c.beginPath();c.moveTo(-ww,yy+hh);c.quadraticCurveTo(0,yy-(main?21:14),ww,yy+hh);c.lineTo(ww-6,yy+hh+3);c.quadraticCurveTo(0,yy-(main?13:8),-ww+6,yy+hh+3);c.closePath();c.fill();c.strokeStyle="#f2d99b";c.lineWidth=1.5;c.stroke();};roof(main?39:28,-29,9);roof(main?28:20,-43,7);c.fillStyle="#e6c67c";c.fillRect(-2,-53,4,12);c.restore();}
 pavilion(210,127,1.02,"#8b4b3d",true);pavilion(86,144,.65,"#416b63");pavilion(334,144,.65,"#536d83");pavilion(145,157,.42,"#8b7147");pavilion(278,157,.42,"#607b57");
 // Rừng tùng xa, cầu mây và mặt sông mảnh ở chân cảnh.
 for(let i=0;i<12;i++){const x=8+i*37,y=163+(i%3)*3,s=.22+(i%3)*.035;c.fillStyle="#315c47";c.beginPath();c.moveTo(x,y-28*s);c.lineTo(x-9*s,y-7*s);c.lineTo(x+9*s,y-7*s);c.closePath();c.fill();}
 c.strokeStyle="rgba(244,248,226,.68)";c.lineWidth=3;c.beginPath();c.moveTo(0,166);c.quadraticCurveTo(210,151,420,166);c.stroke();
 const mist=c.createLinearGradient(0,130,0,h);mist.addColorStop(0,"rgba(224,248,232,0)");mist.addColorStop(1,"rgba(195,225,204,.2)");c.fillStyle=mist;c.fillRect(0,125,w,h-125);
}



// =====================================================
// REVISION 5 — SỬA ĐỘ MỜ, KHÔI PHỤC DÒNG SÔNG,
// RỪNG KHÔNG LẤN SÔNG, CHIM BAY NGOÀI HÀNH LANG ĐUA
// =====================================================

// Bảo vệ trạng thái canvas: hiệu ứng linh khí không được làm mờ
// nhân vật, tên, kiếm, HUD, đồng hồ hay cổng đích ở các lớp kế tiếp.
function drawAmbientEnergy(time){
  ctx.save();
  ctx.globalAlpha=1;
  ctx.shadowBlur=0;
  const orbit=(cx,cy,rx,ry,amount,color,speed,alpha)=>{
    ctx.save();ctx.strokeStyle=color;ctx.lineWidth=1.6;ctx.globalAlpha=alpha;
    ctx.shadowColor=color;ctx.shadowBlur=9;
    for(let i=0;i<amount;i++){
      const a=time*speed+i*Math.PI*2/amount;
      const px=cx+Math.cos(a)*rx,py=cy+Math.sin(a)*ry;
      ctx.beginPath();ctx.ellipse(cx,cy,rx,ry,a*.08,a,a+.72);ctx.stroke();
      ctx.fillStyle=color;ctx.beginPath();ctx.arc(px,py,1.7,0,Math.PI*2);ctx.fill();
    }
    ctx.restore();
  };
  // Chưởng môn sáng rõ nhất.
  orbit(550,566,78,27,12,"#ffe8a4",.00072,.96);
  orbit(550,566,112,38,9,"#fff0bf",-.00048,.76);
  // Trưởng lão và thân truyền.
  for(let i=0;i<10;i++){
    orbit(78+i*41,604,17,7,2,"#b9d8ff",.0009+i*.00002,.42);
    orbit(662+i*41,604,18,8,2,"#d8c2ff",-.00085-i*.00002,.44);
  }
  // Linh khí lầu các ở mức nhẹ.
  [[185,280],[305,292],[425,282],[550,318],[675,282],[795,292],[915,220],[185,410],[305,415],[795,415],[915,410]].forEach((p,i)=>{
    orbit(p[0],p[1]-22,20,7,2,"#f3dfac",.00042+i*.000015,.16);
  });
  // Hạt sương thưa, không phủ lên vùng đường đua.
  for(let i=0;i<12;i++){
    const px=110+(i*79)%880,py=468+(i%3)*8;
    ctx.globalAlpha=.13+.08*Math.sin(time*.002+i)**2;
    ctx.fillStyle="#d7fff0";ctx.beginPath();
    ctx.arc(px+Math.sin(time*.001+i)*5,py,1.25,0,Math.PI*2);ctx.fill();
  }
  ctx.restore();
}

// Nền đất ở dưới khán đài và một dòng sông ngang nối hai thác.
// Sông nằm dưới đáy trường đua, bờ cây chỉ được phép mọc ngoài dải nước.
function drawRiver(time) {
  // Chỉ dựng nền bờ đất phía sau; lòng sông duy nhất do drawRiverCurrent
  // vẽ ở cao độ 520, không còn một dải nước thứ hai hay doi đất ở giữa.
  const ground=ctx.createLinearGradient(0,535,0,H);
  ground.addColorStop(0,"#b5a078");
  ground.addColorStop(.35,"#8c7957");
  ground.addColorStop(1,"#4e4939");
  ctx.fillStyle=ground;
  ctx.fillRect(0,535,W,H-535);

  // Bờ đất thấp, chuyển sắc mềm để tiếp nối mặt sông mà không cắt ngang dòng.
  const bank=ctx.createLinearGradient(0,535,0,565);
  bank.addColorStop(0,"rgba(181,160,120,.0)");
  bank.addColorStop(.55,"rgba(181,160,120,.48)");
  bank.addColorStop(1,"rgba(112,94,65,.12)");
  ctx.fillStyle=bank;
  ctx.fillRect(0,535,W,32);
}

// Rừng tầng tầng trên sườn núi và hai mép cảnh; tuyệt đối tránh dải sông.
function drawDenseForest(time){
  // Chỉ giữ vài cụm thông nhỏ sát mép khung; không trồng cây/bụi cỏ
  // trên quảng trường hoặc phía trước hàng đệ tử.
  const clusters=[
    {x:8,y:438,s:.58},{x:48,y:452,s:.46},
    {x:1092,y:438,s:.58},{x:1052,y:452,s:.46}
  ];
  clusters.forEach((p,i)=>{
    const sway=Math.sin(time*.00055+i*1.8)*1.1;
    drawPine(p.x+sway,p.y,p.s);
  });
}

// Chim chỉ lượn trên sườn núi ở hai hành lang ngoài đường đua.
// Có tiên hạc, chim én và linh điểu vàng; tốc độ chậm, quỹ đạo êm.
function drawSpiritBirds(time){
 const flocks=[
  {dir:1,y:66,s:.55,speed:.000018,phase:.1,count:2},
  {dir:-1,y:118,s:.43,speed:.000014,phase:.55,count:2}
 ];
 flocks.forEach((f,k)=>{
  for(let j=0;j<f.count;j++){
   const p=(time*f.speed+f.phase+j*.48)%1;
   const x=f.dir>0?-75+p*(W+150):W+75-p*(W+150);
   const y=f.y+Math.sin(time*.00055+j*1.7+k)*5;
   const flap=Math.sin(time*.002+j*1.8+k)*.7;
   ctx.save();ctx.translate(x,y);ctx.scale(f.dir*f.s,f.s);
   ctx.fillStyle="#fffdf0";ctx.beginPath();ctx.ellipse(0,0,18,5,-.05,0,Math.PI*2);ctx.fill();
   ctx.strokeStyle="#fffdf0";ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();
   ctx.moveTo(12,-1);ctx.quadraticCurveTo(23,-12,21,-23);ctx.stroke();
   ctx.fillStyle="#fffdf0";ctx.beginPath();ctx.arc(20,-24,3.5,0,Math.PI*2);ctx.fill();
   ctx.fillStyle="#c94d3e";ctx.beginPath();ctx.moveTo(23,-24);ctx.lineTo(32,-22);ctx.lineTo(23,-20);ctx.closePath();ctx.fill();
   ctx.fillStyle="#fffdf5";ctx.beginPath();ctx.moveTo(-5,0);ctx.quadraticCurveTo(-22,-21-flap*5,-53,-20-flap*6);ctx.quadraticCurveTo(-36,6,-5,6);ctx.closePath();ctx.fill();
   ctx.beginPath();ctx.moveTo(-5,3);ctx.quadraticCurveTo(-22,13+flap*3,-42,20+flap*4);ctx.quadraticCurveTo(-25,11,-5,6);ctx.closePath();ctx.fill();
   ctx.strokeStyle="#b94c40";ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(-3,4);ctx.lineTo(-7,16);ctx.moveTo(5,4);ctx.lineTo(7,16);ctx.stroke();
   ctx.restore();
  }
 });
}

// Bọc toàn bộ cảnh quan trong trạng thái canvas riêng; alpha luôn trả về 1.
function drawScenery(time){
  ctx.save();
  ctx.globalAlpha=1;ctx.shadowBlur=0;

  // Nền trời phủ kín canvas; rút ngắn tầng núi/mây/tiên môn lên 35px
  // để giảm khoảng trời trống và dành thêm chiều cao cho trường đua.
  drawSky(time);
  ctx.save();
  ctx.translate(0,-35);
  drawMountainRange();
  drawMovingClouds(time);
  drawWaterfall(112,292,25,190,time);
  drawWaterfall(972,238,34,245,time);
  drawSectArchitecture(time);
  drawDenseForest(time);
  ctx.restore();

  // Giữ sông và quảng trường ở cao độ riêng, không kéo cây cỏ vào sân.
  drawRiver(time);
  drawBridge();
  drawAmbientEnergy(time);
  ctx.globalAlpha=1;ctx.shadowBlur=0;
  drawSpiritBirds(time);
  ctx.globalAlpha=1;ctx.shadowBlur=0;
  drawCrowd(time);
  ctx.globalAlpha=1;ctx.shadowBlur=0;
  ctx.restore();
}


// =====================================================
// REVISION 6 — thác nước tự nhiên, nghi lễ trao tận tay,
// bát quái linh khí, chim bay vòng liên tục, kiến trúc.
// =====================================================

function drawWaterfall(x,y,width,height,time){
  ctx.save();
  // Vách đá có chiều sâu, viền rêu và hõm đá quanh nguồn thác.
  const rock=ctx.createLinearGradient(x-width*2,y,x+width*2,y+height);
  rock.addColorStop(0,"#193b3b");rock.addColorStop(.28,"#315d52");
  rock.addColorStop(.62,"#23483f");rock.addColorStop(1,"#102e31");
  ctx.fillStyle=rock;ctx.beginPath();
  ctx.moveTo(x-width*1.55,y-12);ctx.quadraticCurveTo(x,y-25,x+width*1.55,y-12);
  ctx.lineTo(x+width*2.05,y+height);ctx.quadraticCurveTo(x,y+height+24,x-width*2.05,y+height);
  ctx.closePath();ctx.fill();

  // Hồ nước trên mép đá.
  const pool=ctx.createLinearGradient(x-width,y-12,x+width,y+13);
  pool.addColorStop(0,"#1b5965");pool.addColorStop(.28,"#6fc3c0");
  pool.addColorStop(.52,"#e4fff0");pool.addColorStop(.78,"#75c8c4");pool.addColorStop(1,"#245c68");
  ctx.fillStyle=pool;ctx.beginPath();ctx.ellipse(x,y-5,width*1.22,12,0,0,Math.PI*2);ctx.fill();

  // Màn nước liền khối, mép lượn tự nhiên và thay đổi nhẹ theo dòng chảy.
  const sway=Math.sin(time*.00042+x)*width*.055;
  const left=x-width*.53,right=x+width*.53;
  const water=ctx.createLinearGradient(x-width,y,x+width,y);
  water.addColorStop(0,"rgba(32,103,119,.86)");
  water.addColorStop(.18,"rgba(99,183,184,.94)");
  water.addColorStop(.43,"rgba(210,249,233,.96)");
  water.addColorStop(.62,"rgba(133,211,202,.96)");
  water.addColorStop(.84,"rgba(63,147,158,.94)");
  water.addColorStop(1,"rgba(24,82,101,.82)");
  ctx.fillStyle=water;ctx.beginPath();
  ctx.moveTo(left,y-7);
  ctx.bezierCurveTo(left-width*.16,y+height*.22,left-width*.06+sway,y+height*.64,x-width*1.02+sway,y+height);
  ctx.quadraticCurveTo(x,y+height+12,x+width*1.02+sway,y+height);
  ctx.bezierCurveTo(right+width*.06+sway,y+height*.64,right+width*.16,y+height*.22,right,y-7);
  ctx.closePath();ctx.fill();

  ctx.save();ctx.beginPath();
  ctx.moveTo(left,y-7);
  ctx.bezierCurveTo(left-width*.16,y+height*.22,left-width*.06+sway,y+height*.64,x-width*1.02+sway,y+height);
  ctx.quadraticCurveTo(x,y+height+12,x+width*1.02+sway,y+height);
  ctx.bezierCurveTo(right+width*.06+sway,y+height*.64,right+width*.16,y+height*.22,right,y-7);
  ctx.closePath();ctx.clip();

  // Các dải nước bản rộng uốn lượn, mô phỏng lớp nước đổ chồng lên nhau.
  for(let i=0;i<7;i++){
    const t=(i-3)/3,px=x+t*width*.54;
    const drift=Math.sin(time*.0007+i*1.8+x)*width*.075;
    const phase=(time*.00034+i*.19)%1;
    const yy=y-30+phase*(height+75);
    const bandW=width*(.10+(i%3)*.035);
    ctx.globalAlpha=.13+(i%3)*.045;
    ctx.fillStyle=i%2?"#e8fff2":"#66c6c5";
    ctx.beginPath();
    ctx.moveTo(px-bandW*.45,yy);
    ctx.bezierCurveTo(px-bandW*.95+drift,yy+height*.12,px+bandW*.55+drift,yy+height*.23,px+bandW*.48,yy+height*.34);
    ctx.bezierCurveTo(px+bandW*.2,yy+height*.37,px-bandW*.8+drift,yy+height*.2,px-bandW*.45,yy);
    ctx.closePath();ctx.fill();
  }

  // Bề mặt nước có vân mềm, không kẻ thành những sợi chỉ mảnh.
  for(let i=0;i<12;i++){
    const yy=y+((i*47+time*.018)%(height+22));
    const xx=x+Math.sin(i*1.73+time*.0008)*width*.44;
    const span=width*(.12+(i%4)*.045);
    ctx.globalAlpha=.12+(i%4)*.035;
    ctx.strokeStyle=i%2?"#f3fff4":"#9de3dc";
    ctx.lineWidth=3+(i%3)*1.5;
    ctx.lineCap="round";ctx.beginPath();
    ctx.moveTo(xx-span,yy);
    ctx.quadraticCurveTo(xx,yy+Math.sin(time*.001+i)*3,xx+span,yy+1);
    ctx.stroke();
  }
  // Một vài vùng bọt lớn sát chân thác.
  ctx.globalAlpha=.5;
  for(let i=0;i<8;i++){
    const bx=x+Math.sin(i*2.4+time*.0007)*width*.8;
    const by=y+height-5+Math.cos(i*1.7+time*.0009)*5;
    ctx.fillStyle="#eafff4";ctx.beginPath();
    ctx.ellipse(bx,by,3+(i%3)*2,1.8+(i%2),0,0,Math.PI*2);ctx.fill();
  }
  ctx.restore();
  ctx.globalAlpha=1;

  // Sương chân thác và gợn nước lan ra hồ.
  const mist=ctx.createRadialGradient(x,y+height,2,x,y+height,width*2.5);
  mist.addColorStop(0,"rgba(238,255,245,.58)");
  mist.addColorStop(.38,"rgba(120,213,205,.24)");
  mist.addColorStop(1,"rgba(70,145,155,0)");
  ctx.fillStyle=mist;ctx.beginPath();ctx.ellipse(x,y+height,width*2.5,16,0,0,Math.PI*2);ctx.fill();
  for(let i=0;i<4;i++){
    const ripple=(time*.018+i*width*.38)%(width*2.4);
    ctx.globalAlpha=.35-i*.055;ctx.strokeStyle="#d9fff1";ctx.lineWidth=1.4;
    ctx.beginPath();ctx.ellipse(x,y+height+2,width*.35+ripple*.28,4+i*2,0,0,Math.PI*2);ctx.stroke();
  }
  ctx.restore();
}

function drawAmbientEnergy(time){
  ctx.save();
  ctx.globalAlpha=1;
  // Đại bát quái trận: vòng âm dương, tám quẻ và các quỹ đạo ngọc khí.
  const cx=550,cy=566,rot=time*.00012;
  ctx.save();ctx.translate(cx,cy);ctx.rotate(rot);
  for(let i=0;i<3;i++){
    ctx.strokeStyle=i===0?"rgba(255,231,166,.72)":"rgba(190,225,208,.34)";
    ctx.lineWidth=i===0?2.2:1.2;
    ctx.beginPath();ctx.ellipse(0,0,48+i*17,17+i*6,0,0,Math.PI*2);ctx.stroke();
  }
  ctx.strokeStyle="rgba(255,235,184,.55)";ctx.lineWidth=1.5;
  for(let i=0;i<8;i++){
    ctx.save();ctx.rotate(i*Math.PI/4);
    ctx.beginPath();ctx.moveTo(0,-61);ctx.lineTo(0,-78);ctx.stroke();
    // Ba hào của từng quẻ, hào âm được ngắt đôi.
    for(let j=0;j<3;j++){
      const yy=-83-j*5;
      if((i+j)%2===0){ctx.beginPath();ctx.moveTo(-5,yy);ctx.lineTo(5,yy);ctx.stroke();}
      else{ctx.beginPath();ctx.moveTo(-5,yy);ctx.lineTo(-1,yy);ctx.moveTo(1,yy);ctx.lineTo(5,yy);ctx.stroke();}
    }
    ctx.restore();
  }
  // Thái cực đồ ở tâm trận.
  ctx.fillStyle="rgba(255,239,194,.88)";ctx.beginPath();ctx.arc(0,0,14,0,Math.PI*2);ctx.fill();
  ctx.fillStyle="#345d59";ctx.beginPath();ctx.arc(0,-7,7,Math.PI/2,-Math.PI/2);ctx.arc(0,7,7,-Math.PI/2,Math.PI/2);ctx.fill();
  ctx.fillStyle="#f8e6b5";ctx.beginPath();ctx.arc(0,-7,2.2,0,Math.PI*2);ctx.fill();
  ctx.fillStyle="#345d59";ctx.beginPath();ctx.arc(0,7,2.2,0,Math.PI*2);ctx.fill();
  ctx.restore();

  // Linh khí quanh trưởng lão và thân truyền được tiết chế, không rối mắt.
  for(let i=0;i<8;i++){
    const x=160+i*112,y=600+(i%2)*10;
    ctx.globalAlpha=.22;
    ctx.strokeStyle=i%2?"#c9b5ed":"#a9d7e5";ctx.lineWidth=1.4;
    ctx.beginPath();ctx.ellipse(x,y,18,5,0,0,Math.PI*2);ctx.stroke();
  }
  ctx.restore();
}

function drawSpiritBirds(time){
 const flocks=[
  {dir:1,y:66,s:.55,speed:.000018,phase:.1,count:2},
  {dir:-1,y:118,s:.43,speed:.000014,phase:.55,count:2}
 ];
 flocks.forEach((f,k)=>{
  for(let j=0;j<f.count;j++){
   const p=(time*f.speed+f.phase+j*.48)%1;
   const x=f.dir>0?-75+p*(W+150):W+75-p*(W+150);
   const y=f.y+Math.sin(time*.00055+j*1.7+k)*5;
   const flap=Math.sin(time*.002+j*1.8+k)*.7;
   ctx.save();ctx.translate(x,y);ctx.scale(f.dir*f.s,f.s);
   ctx.fillStyle="#fffdf0";ctx.beginPath();ctx.ellipse(0,0,18,5,-.05,0,Math.PI*2);ctx.fill();
   ctx.strokeStyle="#fffdf0";ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();
   ctx.moveTo(12,-1);ctx.quadraticCurveTo(23,-12,21,-23);ctx.stroke();
   ctx.fillStyle="#fffdf0";ctx.beginPath();ctx.arc(20,-24,3.5,0,Math.PI*2);ctx.fill();
   ctx.fillStyle="#c94d3e";ctx.beginPath();ctx.moveTo(23,-24);ctx.lineTo(32,-22);ctx.lineTo(23,-20);ctx.closePath();ctx.fill();
   ctx.fillStyle="#fffdf5";ctx.beginPath();ctx.moveTo(-5,0);ctx.quadraticCurveTo(-22,-21-flap*5,-53,-20-flap*6);ctx.quadraticCurveTo(-36,6,-5,6);ctx.closePath();ctx.fill();
   ctx.beginPath();ctx.moveTo(-5,3);ctx.quadraticCurveTo(-22,13+flap*3,-42,20+flap*4);ctx.quadraticCurveTo(-25,11,-5,6);ctx.closePath();ctx.fill();
   ctx.strokeStyle="#b94c40";ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(-3,4);ctx.lineTo(-7,16);ctx.moveTo(5,4);ctx.lineTo(7,16);ctx.stroke();
   ctx.restore();
  }
 });
}

function drawAwardMaster(target,x,y,scale,time){
  target.save();target.translate(x,y);target.scale(scale,scale);
  // Phi kiếm chưởng môn có mũi nhọn, sống kiếm, hai lưỡi, chắn tay và chuôi riêng biệt.
  const blade=target.createLinearGradient(0,8,0,37);
  blade.addColorStop(0,"#fff9d9");blade.addColorStop(.32,"#bce9e2");blade.addColorStop(.58,"#f4fff2");blade.addColorStop(1,"#668f91");
  target.save();target.shadowColor="#a9f4ed";target.shadowBlur=16;
  target.fillStyle="rgba(174,244,233,.17)";target.beginPath();target.ellipse(4,33,112,13,0,0,Math.PI*2);target.fill();
  target.fillStyle=blade;target.beginPath();
  target.moveTo(-72,14);target.lineTo(70,14);target.lineTo(105,27);target.lineTo(70,40);target.lineTo(-72,40);target.closePath();target.fill();
  target.strokeStyle="#fff4c6";target.lineWidth=2.2;target.stroke();
  target.strokeStyle="#6f9b9b";target.lineWidth=1.5;target.beginPath();target.moveTo(-67,27);target.lineTo(98,27);target.stroke();
  // Chuôi và chắn kiếm.
  target.fillStyle="#6a4530";target.fillRect(-103,22,34,10);
  target.fillStyle="#d7b66d";target.fillRect(-108,19,7,16);
  target.fillStyle="#c99e52";target.beginPath();target.moveTo(-72,14);target.lineTo(-66,19);target.lineTo(-66,33);target.lineTo(-72,40);target.closePath();target.fill();
  target.fillStyle="#e7c879";target.fillRect(-72,11,8,32);
  target.fillStyle="#5fc9c4";target.beginPath();target.arc(-91,27,5,0,Math.PI*2);target.fill();
  // Phù văn dọc sống kiếm.
  target.strokeStyle="rgba(83,137,135,.8)";target.lineWidth=1;
  for(let i=0;i<4;i++){target.beginPath();target.moveTo(-42+i*25,22);target.lineTo(-34+i*25,32);target.stroke();}
  target.restore();
  // Vệt kiếm ngắn, mờ và nằm sau thân kiếm.
  target.globalAlpha=.28;target.strokeStyle="#d9fff1";target.lineWidth=2;
  for(let i=0;i<3;i++){target.beginPath();target.moveTo(-76,42+i*3);target.quadraticCurveTo(-112,39+i*5,-140,48+i*5);target.stroke();}
  target.globalAlpha=1;

  // Chưởng môn cưỡi kiếm, áo bào đỏ viền vàng.
  target.fillStyle="#54292b";target.beginPath();target.moveTo(-28,18);target.lineTo(-24,-48);target.quadraticCurveTo(0,-67,24,-48);target.lineTo(30,18);target.closePath();target.fill();
  target.fillStyle="#a8443b";target.beginPath();target.moveTo(-23,13);target.lineTo(-19,-43);target.lineTo(0,-54);target.lineTo(20,-43);target.lineTo(25,13);target.closePath();target.fill();
  target.strokeStyle="#f2d48b";target.lineWidth=2.5;target.stroke();
  target.fillStyle="#eac39d";target.beginPath();target.ellipse(0,-68,14,17,0,0,Math.PI*2);target.fill();
  target.fillStyle="#e6dfd2";target.beginPath();target.moveTo(-10,-57);target.lineTo(10,-57);target.lineTo(7,-32);target.lineTo(0,-26);target.lineTo(-7,-32);target.closePath();target.fill();
  target.fillStyle="#e8c36e";target.beginPath();target.moveTo(-16,-80);target.lineTo(-12,-98);target.lineTo(-4,-86);target.lineTo(0,-108);target.lineTo(5,-86);target.lineTo(13,-98);target.lineTo(16,-80);target.closePath();target.fill();
  // Tay trái giữ thăng bằng, tay phải đưa quà ra phía người nhận.
  target.strokeStyle="#efc39b";target.lineWidth=6;target.lineCap="round";target.beginPath();
  target.moveTo(-20,-39);target.lineTo(-38,-8);
  target.moveTo(20,-39);target.lineTo(48,-49);target.lineTo(72,-53);target.stroke();
  target.fillStyle="#efc39b";target.beginPath();target.arc(73,-53,5,0,Math.PI*2);target.fill();
  target.restore();
}

function drawGiftBox(target,x,y,scale,color){
  target.save();target.translate(x,y);target.scale(scale,scale);
  target.shadowColor=color;target.shadowBlur=12;
  target.fillStyle=color;target.fillRect(-8,-7,16,14);
  target.strokeStyle="#fff5d1";target.lineWidth=1.5;target.strokeRect(-8,-7,16,14);
  target.fillStyle="#fff1c2";target.fillRect(-2,-7,4,14);target.fillRect(-8,-2,16,3);
  target.beginPath();target.ellipse(-3,-10,4,2.5,-.4,0,Math.PI*2);target.ellipse(3,-10,4,2.5,.4,0,Math.PI*2);target.fill();
  target.restore();
}

function drawPodiumScene(target,time,mini=false){
  const ordered=sortedRacers().slice(0,3),w=target.canvas.width,h=target.canvas.height;
  const elapsedCeremony=Math.max(0,(performance.now()-ceremonyStartedAt)/1000);
  const awardDuration=6.0,flightPhase=(elapsedCeremony%awardDuration)/awardDuration;
  const finalCeremony=elapsedCeremony>=awardDuration*3;
  drawCeremonyBackdrop(target,mini,time);
  target.save();target.textAlign="center";target.textBaseline="middle";
  if(!finalCeremony){
    const rank=Math.min(3,Math.floor(elapsedCeremony/awardDuration)+1),racer=ordered[rank-1];
    const color=rank===1?"#ffe17b":rank===2?"#dcecff":"#e6a16c";
    target.font=mini?"900 11px Georgia":"900 30px Georgia";target.fillStyle=color;target.shadowColor=color;target.shadowBlur=mini?8:20;
    target.fillText(rank===1?"BAN THƯỞNG ĐỆ NHẤT":rank===2?"BAN THƯỞNG ĐỆ NHỊ":"BAN THƯỞNG ĐỆ TAM",w*.5,mini?12:h*.09);target.shadowBlur=0;
    const throneX=w*.17,throneY=h*.82;
    target.fillStyle="#644b35";target.fillRect(throneX-w*.055,throneY-h*.10,w*.11,h*.10);
    target.fillStyle="#d8b975";target.fillRect(throneX-w*.063,throneY-h*.105,w*.126,h*.012);
    target.fillStyle="#8e3d35";target.fillRect(throneX-w*.035,throneY-h*.20,w*.07,h*.10);
    target.strokeStyle="#f0d28a";target.lineWidth=mini?1:3;target.strokeRect(throneX-w*.035,throneY-h*.20,w*.07,h*.10);

    const arrival=awardSmoothstep((flightPhase-.06)/.27);
    const departure=awardSmoothstep((flightPhase-.83)/.17);
    const masterX=throneX+(w*.43-throneX)*arrival-(w*.10)*departure;
    const masterY=throneY-h*.19-(h*.12)*Math.sin(Math.min(1,arrival)*Math.PI*.72);
    const masterScale=mini?.43:1.12;
    drawAwardMaster(target,masterX,masterY,masterScale,time);
    if(racer){
      const winnerX=w*.76,winnerY=h*.68;
      drawRacer(target,racer,winnerX,winnerY,mini?.73:1.18,time);
      target.font=mini?"bold 7px Arial":"bold 16px Arial";target.fillStyle="#fff4ce";
      target.fillText(racer.name,winnerX,h*.86,w*.34);
      target.font=mini?"bold 7px Arial":"bold 15px Georgia";target.fillStyle=color;
      target.fillText("HẠNG "+rank,winnerX,h*.92);

      // Quà nằm trên tay chưởng môn, được trao trực tiếp sang tay người nhận.
      // Không có dây sáng, tia nối hay đường truyền vật phẩm.
      const handoff=awardSmoothstep((flightPhase-.42)/.22);
      const masterHandX=masterX+73*masterScale,masterHandY=masterY-53*masterScale;
      const receiverHandX=winnerX-27,receiverHandY=winnerY-25;
      // Người nhận đưa tay ra đón pháp bảo, không chỉ đứng nhìn.
      target.save();target.strokeStyle=racer.color;target.lineWidth=7;target.lineCap="round";
      target.beginPath();target.moveTo(winnerX-7,winnerY-5);target.lineTo(receiverHandX,receiverHandY);target.stroke();
      target.strokeStyle="#efc39b";target.lineWidth=5;target.beginPath();target.moveTo(receiverHandX-2,receiverHandY);target.lineTo(receiverHandX+5,receiverHandY-2);target.stroke();target.restore();
      const giftX=masterHandX+(receiverHandX-masterHandX)*handoff;
      const giftY=masterHandY+(receiverHandY-masterHandY)*handoff-Math.sin(handoff*Math.PI)*h*.045;
      if(flightPhase<.42)drawGiftBox(target,masterHandX,masterHandY,mini?.52:.9,color);
      else if(flightPhase<.70)drawGiftBox(target,giftX,giftY,mini?.52:.9,color);
      else drawGiftBox(target,receiverHandX,receiverHandY,mini?.52:.9,color);
    }
  }else{
    // Khi đã trao đủ ba phần thưởng: chỉ còn tam giáp, không còn chưởng môn.
    target.font=mini?"900 11px Georgia":"900 31px Georgia";target.fillStyle="#fff0b8";target.shadowColor="#ffcf64";target.shadowBlur=mini?8:22;
    target.fillText("VINH DANH TAM GIÁP TIÊN HỘI",w*.5,mini?12:h*.10);target.shadowBlur=0;
    const podiumX=[w*.25,w*.5,w*.75],ranks=[2,1,3],colors=["#c88d45","#d9e1e8","#b8794e"],glows=["#ffe17b","#dcecff","#e6a16c"];
    for(let i=0;i<3;i++){
      const rank=ranks[i],racer=ordered[rank-1];if(!racer)continue;
      const base=h*.96,top=h*(rank===1?.69:.77),bw=w*.19;
      const grad=target.createLinearGradient(podiumX[i]-bw/2,top,podiumX[i]+bw/2,base);
      grad.addColorStop(0,colors[rank-1]);grad.addColorStop(1,"#382f2a");
      target.fillStyle=grad;target.fillRect(podiumX[i]-bw/2,top,bw,base-top);
      target.strokeStyle=glows[rank-1];target.lineWidth=mini?1:2;target.strokeRect(podiumX[i]-bw/2,top,bw,base-top);
      target.fillStyle=glows[rank-1];target.font=mini?"bold 8px Arial":"bold 18px Georgia";target.fillText("HẠNG "+rank,podiumX[i],top+(mini?8:17));
      target.font=mini?"bold 6px Arial":"bold 13px Arial";target.fillStyle="#fff1c8";target.fillText(racer.name,podiumX[i],base-(mini?4:8),bw-5);
    }
  }
  target.restore();
}

function drawSectArchitecture(time){
 const buildings=[
  [165,175,.34,"TỤ LINH THÁP","tower","#39766e"],
  [365,175,.34,"TÀNG KINH CÁC","scripture","#8c6043"],
  [565,175,.34,"TÀNG BẢO CÁC","treasure","#b68a43"],
  [765,175,.34,"QUAN TINH LÂU","observatory","#536c91"],
  [955,175,.34,"BÁCH THẢO CÁC","herb","#648653"],
  [205,300,.34,"GIẢNG ĐẠO CÁC","lecture","#577d83"],
  [405,300,.34,"ĐAN CÁC","alchemy","#9e543b"],
  [550,300,.62,"LĂNG TIÊU CHÍNH ĐIỆN","main","#9d4939"],
  [695,300,.34,"LUYỆN KHÍ ĐIỆN","forge","#82604a"],
  [895,300,.34,"QUAN TINH ĐÀI","observatory","#536c91"],
  [165,410,.30,"BẾ QUAN ĐỘNG PHỦ","cave","#536b62"],
  [355,410,.30,"ĐỆ TỬ VIỆN","academy","#66817a"],
  [550,410,.30,"TRẬN PHÁP CÁC","array","#4f7b83"],
  [745,410,.30,"HỘ SƠN TRẬN CÁC","guardian","#527e88"],
  [935,410,.30,"NGOẠI VỤ ĐIỆN","foreign","#916c48"]
 ];
 buildings.forEach(([x,y,s,title,type,accent])=>{
  drawSectMountainLedge(x,y,s);
  drawSectPavilion(x,y-5,s,title,type,accent);
 });
}


// Gender-aware racer rendering override (final definition).
function drawRacer(target,racer,x,y,scale,time){
  const female=racer.gender==="female",skin=female?"#f4c9a5":"#dfae89",hair=female?"#211b2b":"#29242a";
  target.save();target.translate(x,y+Math.sin(time*.009+racer.phase)*2);target.scale(scale,scale);
  const glow=target.createRadialGradient(0,0,3,0,0,47);glow.addColorStop(0,"rgba(255,225,139,.42)");glow.addColorStop(1,"rgba(255,225,139,0)");target.fillStyle=glow;target.fillRect(-50,-48,100,96);
  if(racer.effectTimer>0){const pulse=1+Math.sin(time*.025)*.12,color=racer.effectType==="boost"?"#ffe17b":racer.effectType==="slow"?"#8de8ef":"#ff9a72";target.save();target.globalAlpha=.8;target.strokeStyle=color;target.lineWidth=2.2;target.beginPath();target.ellipse(0,4,43*pulse,17*pulse,0,0,Math.PI*2);target.stroke();target.globalAlpha=.32;target.lineWidth=5;target.beginPath();target.ellipse(0,4,51*pulse,22*pulse,0,0,Math.PI*2);target.stroke();target.restore();}
  drawRacingArtifact(target,artifactKind(racer),time*.004+racer.phase,racer.swordColor||0);
  target.save();target.globalAlpha=.75;target.strokeStyle=racer.effectTimer>0?"#fff0a6":"rgba(255,235,170,.5)";target.lineWidth=1.3;target.beginPath();target.moveTo(-37,20);target.lineTo(38,18);target.stroke();target.restore();
  target.fillStyle=racer.dark;target.beginPath();
  if(female){target.moveTo(-7,-8);target.lineTo(7,-8);target.lineTo(13,1);target.lineTo(19,19);target.quadraticCurveTo(0,25,-19,19);target.lineTo(-13,1);target.closePath();}
  else{target.moveTo(-11,-8);target.lineTo(11,-8);target.lineTo(16,17);target.lineTo(-16,17);target.closePath();}
  target.fill();target.fillStyle=racer.color;target.beginPath();
  if(female){target.moveTo(-7,-8);target.lineTo(7,-8);target.lineTo(9,5);target.lineTo(16,18);target.quadraticCurveTo(0,22,-16,18);target.lineTo(-9,5);target.closePath();}
  else{target.moveTo(-9,-8);target.lineTo(9,-8);target.lineTo(12,16);target.lineTo(-12,16);target.closePath();}
  target.fill();
  target.strokeStyle="#f2dfb1";target.lineWidth=2;target.beginPath();target.moveTo(-4,-8);target.lineTo(2,2);target.lineTo(7,-6);target.stroke();target.fillStyle="#e8cb83";target.fillRect(-9,5,18,2.5);
  target.fillStyle=skin;target.beginPath();target.ellipse(0,-20,female?6:6.5,8,0,0,Math.PI*2);target.fill();target.fillStyle=hair;
  if(female){target.beginPath();target.arc(0,-25,7,Math.PI,Math.PI*2);target.fill();target.fillRect(-7,-25,3,19);target.fillRect(5,-25,3,19);target.beginPath();target.arc(3,-32,4,0,Math.PI*2);target.fill();target.strokeStyle="#f0d18c";target.lineWidth=1.8;target.beginPath();target.moveTo(3,-32);target.lineTo(12,-37);target.stroke();}
  else{target.fillRect(-7,-27,14,5);target.fillRect(-5,-32,10,6);target.beginPath();target.ellipse(0,-36,4,5,0,0,Math.PI*2);target.fill();}
  target.fillStyle="#382d2a";target.beginPath();target.arc(-2,-20,1,0,Math.PI*2);target.arc(3,-20,1,0,Math.PI*2);target.fill();
  target.strokeStyle=skin;target.lineWidth=female?5:6;target.lineCap="round";target.beginPath();target.moveTo(-8,-5);target.lineTo(-17,7);target.moveTo(8,-5);target.lineTo(17,7);target.stroke();
  target.fillStyle=racer.color;target.beginPath();target.moveTo(-12,-7);target.lineTo(-19,5);target.lineTo(-13,9);target.lineTo(-7,0);target.closePath();target.fill();target.beginPath();target.moveTo(12,-7);target.lineTo(19,5);target.lineTo(13,9);target.lineTo(7,0);target.closePath();target.fill();
  target.save();target.globalAlpha=.78;target.fillStyle=racer.color;target.beginPath();const tail=racer.effectType==="boost"?-25:racer.effectType==="slow"?-10:-17;target.moveTo(-7,-4);target.quadraticCurveTo(tail-10,-1,tail,-13);target.lineTo(-4,-8);target.closePath();target.fill();target.restore();
  if(racer.effectTimer>0&&racer.effectName&&target!==cameraCtx){target.save();target.font="bold 7px Arial,sans-serif";target.textAlign="center";target.textBaseline="middle";target.lineJoin="round";target.lineWidth=2.2;target.strokeStyle="rgba(14,25,24,.98)";target.strokeText(racer.effectName,0,-65,126);target.fillStyle="#fff1bd";target.fillText(racer.effectName,0,-65,126);target.restore();}
  target.restore();
}


// =====================================================
// REVISION 11 — gương mặt và giới tính nhân vật rõ ràng,
// chim bay ngang tầng trời, không cắt qua đường đua.
// =====================================================

function drawSpectator(x,y,scale,roleName,time,phase=0){
 const role=ROLE[roleName]||ROLE.outer;
 const seed=Math.abs(Math.floor(phase*13+({servant:0,outer:1,inner:2,core:3,disciple:4,elder:5,master:6}[roleName]||0)*3));
 const female=seed%2===1,skin=["#f6d2b5","#e9b993","#d69a76","#f0c5a0","#bd805f"][seed%5];
 const hair=["#211a25","#39251f","#171d2c","#5a3027","#29242a"][(seed*3)%5];
 const sway=Math.sin(time*.004+phase);
 ctx.save();ctx.translate(x,y+Math.sin(time*.006+phase)*1.3);ctx.scale(scale*role.scale,scale);
 ctx.fillStyle="rgba(20,30,25,.28)";ctx.beginPath();ctx.ellipse(0,21,15,4,0,0,Math.PI*2);ctx.fill();
 if(role.aura)drawAura(0,-9,roleName==="elder"?34:26,role.aura,time,phase);
 // Áo trong và thân ngoài: nữ eo thon, váy xếp tầng; nam vai rộng, trường bào thẳng.
 ctx.fillStyle=role.dark;ctx.beginPath();
 if(female){ctx.moveTo(-7,-8);ctx.lineTo(7,-8);ctx.lineTo(12,5);ctx.lineTo(20,20);ctx.quadraticCurveTo(0,27,-20,20);ctx.lineTo(-12,5);ctx.closePath();}
 else{ctx.moveTo(-13,-8);ctx.lineTo(13,-8);ctx.lineTo(17,19);ctx.lineTo(-17,19);ctx.closePath();}
 ctx.fill();
 ctx.fillStyle=role.robe;ctx.beginPath();
 if(female){ctx.moveTo(-7,-9);ctx.lineTo(7,-9);ctx.lineTo(10,4);ctx.lineTo(17,18);ctx.quadraticCurveTo(0,24,-17,18);ctx.lineTo(-10,4);ctx.closePath();}
 else{ctx.moveTo(-11,-9);ctx.lineTo(11,-9);ctx.lineTo(14,18);ctx.lineTo(-14,18);ctx.closePath();}
 ctx.fill();
 // Vạt áo nữ xếp lớp, dải lụa dài; nam có hai vạt trường sam và giáp vai.
 ctx.fillStyle=role.dark;
 if(female){
  ctx.beginPath();ctx.moveTo(-4,1);ctx.lineTo(0,4);ctx.lineTo(-10,22);ctx.lineTo(-17,19);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(4,1);ctx.lineTo(0,4);ctx.lineTo(10,22);ctx.lineTo(17,19);ctx.closePath();ctx.fill();
  ctx.strokeStyle=role.belt;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(7,7);ctx.quadraticCurveTo(16,16,22,26+sway*2);ctx.stroke();
 }else{
  ctx.beginPath();ctx.moveTo(-10,-7);ctx.lineTo(-16,-1);ctx.lineTo(-12,5);ctx.lineTo(-6,-3);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(10,-7);ctx.lineTo(16,-1);ctx.lineTo(12,5);ctx.lineTo(6,-3);ctx.closePath();ctx.fill();
  ctx.strokeStyle=role.belt;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-5,7);ctx.lineTo(-3,19);ctx.moveTo(5,7);ctx.lineTo(3,19);ctx.stroke();
 }
 ctx.strokeStyle=role.belt;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-10,5);ctx.lineTo(10,5);ctx.stroke();
 // Tay áo rộng và khác dáng.
 ctx.fillStyle=role.robe;ctx.beginPath();
 if(female){ctx.moveTo(-8,-5);ctx.lineTo(-16,1);ctx.lineTo(-20,11);ctx.lineTo(-13,14);ctx.lineTo(-5,3);ctx.closePath();ctx.moveTo(8,-5);ctx.lineTo(16,1);ctx.lineTo(20,11);ctx.lineTo(13,14);ctx.lineTo(5,3);ctx.closePath();}
 else{ctx.moveTo(-10,-5);ctx.lineTo(-19,0);ctx.lineTo(-17,10);ctx.lineTo(-10,9);ctx.lineTo(-6,1);ctx.closePath();ctx.moveTo(10,-5);ctx.lineTo(19,0);ctx.lineTo(17,10);ctx.lineTo(10,9);ctx.lineTo(6,1);ctx.closePath();}
 ctx.fill();
 ctx.strokeStyle=skin;ctx.lineWidth=4.5;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(-15,8);ctx.lineTo(-17,14+sway);ctx.moveTo(15,8);ctx.lineTo(17,14-sway);ctx.stroke();
 // Khuôn mặt, tóc dài/trâm nữ và búi tóc nam.
 ctx.fillStyle=skin;ctx.beginPath();ctx.ellipse(0,-19,female?6:6.6,7.7,0,0,Math.PI*2);ctx.fill();
 ctx.fillStyle=hair;
 if(female){
  ctx.beginPath();ctx.arc(0,-23,7.2,Math.PI,Math.PI*2);ctx.fill();
  ctx.fillRect(-7,-23,3,23);ctx.fillRect(4,-23,3,23);
  ctx.beginPath();ctx.ellipse(0,-30,4.8,3.8,0,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle="#e8cf8d";ctx.lineWidth=1.8;ctx.beginPath();ctx.moveTo(2,-30);ctx.lineTo(13,-35);ctx.stroke();
 }else{
  ctx.beginPath();ctx.arc(0,-24,7.2,Math.PI,Math.PI*2);ctx.fill();
  ctx.fillRect(-7,-24,3,6);ctx.fillRect(4,-24,3,6);
  ctx.beginPath();ctx.ellipse(0,-33,4.2,5.5,0,0,Math.PI*2);ctx.fill();
 }
 ctx.fillStyle="#392b27";ctx.beginPath();ctx.arc(-2.5,-19,1,0,Math.PI*2);ctx.arc(2.5,-19,1,0,Math.PI*2);ctx.fill();
 ctx.strokeStyle="#8b5144";ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(0,-17);ctx.lineTo(-.5,-15);ctx.moveTo(-2,-13);ctx.quadraticCurveTo(0,-12,2,-13);ctx.stroke();
 if(roleName==="elder"||roleName==="master"){if(!female){ctx.fillStyle="#ded8ca";ctx.beginPath();ctx.moveTo(-3,-10);ctx.lineTo(3,-10);ctx.lineTo(2,3);ctx.lineTo(0,6);ctx.lineTo(-2,3);ctx.closePath();ctx.fill();}}
 if(roleName==="master"){ctx.fillStyle="#e8c36e";ctx.beginPath();ctx.moveTo(-9,-26);ctx.lineTo(-6,-39);ctx.lineTo(0,-32);ctx.lineTo(6,-39);ctx.lineTo(9,-26);ctx.closePath();ctx.fill();}
 if(roleName==="elder"){ctx.strokeStyle="#dfc17e";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(20,-18);ctx.lineTo(20,23);ctx.stroke();}
 ctx.restore();
}

function drawFormalSpectator(x,y,scale,roleName,time,phase=0){
  // Dùng cùng màu phẩm cấp cho nam và nữ; chỉ khác phom áo, tóc và gương mặt.
  drawSpectator(x,y,scale,roleName,time,phase);
}

function drawSpiritBirds(time){
 const flocks=[
  {dir:1,y:66,s:.55,speed:.000018,phase:.1,count:2},
  {dir:-1,y:118,s:.43,speed:.000014,phase:.55,count:2}
 ];
 flocks.forEach((f,k)=>{
  for(let j=0;j<f.count;j++){
   const p=(time*f.speed+f.phase+j*.48)%1;
   const x=f.dir>0?-75+p*(W+150):W+75-p*(W+150);
   const y=f.y+Math.sin(time*.00055+j*1.7+k)*5;
   const flap=Math.sin(time*.002+j*1.8+k)*.7;
   ctx.save();ctx.translate(x,y);ctx.scale(f.dir*f.s,f.s);
   ctx.fillStyle="#fffdf0";ctx.beginPath();ctx.ellipse(0,0,18,5,-.05,0,Math.PI*2);ctx.fill();
   ctx.strokeStyle="#fffdf0";ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();
   ctx.moveTo(12,-1);ctx.quadraticCurveTo(23,-12,21,-23);ctx.stroke();
   ctx.fillStyle="#fffdf0";ctx.beginPath();ctx.arc(20,-24,3.5,0,Math.PI*2);ctx.fill();
   ctx.fillStyle="#c94d3e";ctx.beginPath();ctx.moveTo(23,-24);ctx.lineTo(32,-22);ctx.lineTo(23,-20);ctx.closePath();ctx.fill();
   ctx.fillStyle="#fffdf5";ctx.beginPath();ctx.moveTo(-5,0);ctx.quadraticCurveTo(-22,-21-flap*5,-53,-20-flap*6);ctx.quadraticCurveTo(-36,6,-5,6);ctx.closePath();ctx.fill();
   ctx.beginPath();ctx.moveTo(-5,3);ctx.quadraticCurveTo(-22,13+flap*3,-42,20+flap*4);ctx.quadraticCurveTo(-25,11,-5,6);ctx.closePath();ctx.fill();
   ctx.strokeStyle="#b94c40";ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(-3,4);ctx.lineTo(-7,16);ctx.moveTo(5,4);ctx.lineTo(7,16);ctx.stroke();
   ctx.restore();
  }
 });
}

// Kiếm có màu nhận diện theo giới tính; kiểu dáng thay đổi theo pháp bảo.
function drawRacingArtifact(target,kind,phase){
  const female=arguments.length>3&&arguments[3]==="female";
  const colors=female?["#f2b9d5","#c8b4f2","#f0d18a","#f3a9bd"]:["#a9d8ef","#d8e5ef","#91c9d0","#d8bd82"];
  const blade=colors[kind%colors.length];
  target.save();
  target.translate(0,29);
  target.rotate(Math.sin(phase)*.012);
  target.globalAlpha=.96;
  target.shadowColor=blade;
  target.shadowBlur=7;
  // Lưỡi kiếm nằm ngang, mũi nhọn hướng phải.
  target.fillStyle=blade;
  target.beginPath();
  target.moveTo(-39,-4);
  target.lineTo(27,-4);
  target.lineTo(46,0);
  target.lineTo(27,4);
  target.lineTo(-39,4);
  target.closePath();
  target.fill();
  target.strokeStyle=female?"#fff0f7":"#f4f5e8";
  target.lineWidth=1.4;
  target.stroke();
  target.strokeStyle="rgba(255,255,255,.65)";
  target.lineWidth=.8;
  target.beginPath();target.moveTo(-33,-1);target.lineTo(32,-1);target.stroke();
  // Chuôi kiếm và chắn tay ở phía trái.
  target.shadowBlur=0;
  target.fillStyle=female?"#d7a9a0":"#b99a61";
  target.fillRect(-43,-3,7,6);
  target.fillRect(-39,-7,3,14);
  target.fillStyle="#72533a";
  target.fillRect(-51,-2,10,4);
  target.fillStyle=female?"#ffe5a8":"#b9f0ef";
  target.beginPath();target.arc(-38,0,2.2,0,Math.PI*2);target.fill();
  target.restore();
}

// Nhân vật triệu hồi: gương mặt, sắc da, tóc và trang phục có biến thể.
function drawRacer(target,racer,x,y,scale,time){
  const female=racer.gender==="female";
  const skins=["#f6d0b0","#e6b58e","#c98767","#f0c29e","#ad7658"];
  const hairs=["#211a25","#39251f","#171d2c","#6a3429","#29242a","#4b315d"];
  const seed=(racer.appearanceSeed??0)%5,skin=skins[seed],hair=hairs[(seed+(female?1:0))%hairs.length];
  const activeEffect=racer.effectTimer>0?racer.effectType:"";
   const phase=time*.001;
   const spin=activeEffect==="dizzy"?Math.sin(phase*8+racer.phase)*.72:0;
   const faintTilt=activeEffect==="faint"?.34+Math.sin(phase*5)*.07:activeEffect==="weak"?.12:0;
   const impactJolt=activeEffect==="impact"?(Math.sin(time*.075)*2.5):activeEffect==="lightning"?(Math.sin(time*.11)*1.8):0;
   target.save();target.translate(x+impactJolt,y+Math.sin(time*.009+racer.phase)*2);target.rotate(spin+faintTilt);target.scale(scale,scale);
  // Phi kiếm nằm ngang: mũi kiếm hướng về trước (phải), chuôi ở sau; người cưỡi nằm ngang dọc thân kiếm.
  // Giữ nhân vật đứng thẳng, không xoay hệ tọa độ.
  const glow=target.createRadialGradient(0,0,3,0,0,48);glow.addColorStop(0,"rgba(255,225,139,.38)");glow.addColorStop(1,"rgba(255,225,139,0)");target.fillStyle=glow;target.fillRect(-51,-48,102,96);
  // Không vẽ vòng tròn bao quanh thân; giữ lại hiệu ứng đặc trưng của từng loại ở phía dưới.
  drawRacingArtifact(target,artifactKind(racer),time*.004+racer.phase,female?"female":"male");
  // Phom y phục khác nhau, màu áo vẫn lấy từ bảng màu riêng của từng tiên nhân.
  target.fillStyle=racer.dark;target.beginPath();
  if(female){target.moveTo(-7,-8);target.lineTo(7,-8);target.lineTo(12,1);target.lineTo(19,20);target.quadraticCurveTo(0,25,-19,20);target.lineTo(-12,1);}
  else{target.moveTo(-12,-8);target.lineTo(12,-8);target.lineTo(16,18);target.lineTo(-16,18);}
  target.closePath();target.fill();target.fillStyle=racer.color;target.beginPath();
  if(female){target.moveTo(-7,-8);target.lineTo(7,-8);target.lineTo(9,5);target.lineTo(16,19);target.quadraticCurveTo(0,22,-16,19);target.lineTo(-9,5);}
  else{target.moveTo(-10,-8);target.lineTo(10,-8);target.lineTo(12,17);target.lineTo(-12,17);}
  target.closePath();target.fill();
  target.strokeStyle="#f2dfb1";target.lineWidth=2;target.beginPath();target.moveTo(-4,-8);target.lineTo(2,2);target.lineTo(7,-6);target.stroke();
  target.fillStyle="#e8cb83";target.fillRect(-9,5,18,2.5);
  // Tay áo và thân áo có vạt phụ khác nhau theo kiểu nhân vật.
  target.strokeStyle=skin;target.lineWidth=female?5:6;target.lineCap="round";target.beginPath();target.moveTo(-8,-4);target.lineTo(-17,8);target.moveTo(8,-4);target.lineTo(17,8);target.stroke();
  target.fillStyle=racer.color;target.beginPath();target.moveTo(-12,-7);target.lineTo(-20,5);target.lineTo(-13,10);target.lineTo(-7,0);target.closePath();target.fill();
  target.beginPath();target.moveTo(12,-7);target.lineTo(20,5);target.lineTo(13,10);target.lineTo(7,0);target.closePath();target.fill();
  // Gương mặt đặt phía trước tóc, có mắt, mũi và miệng rõ nét.
  target.fillStyle=skin;target.beginPath();target.ellipse(0,-20,female?6.2:6.7,8,0,0,Math.PI*2);target.fill();
  if(activeEffect==="poison"||activeEffect==="weak"||activeEffect==="faint"){
    target.save();target.globalAlpha=activeEffect==="poison"?.62:activeEffect==="weak"?.48:.38;
    target.fillStyle=activeEffect==="poison"?"#72a85b":activeEffect==="weak"?"#c5d2d0":"#aab5bd";
    target.beginPath();target.ellipse(0,-20,female?6.2:6.7,8,0,0,Math.PI*2);target.fill();target.restore();
  }
  target.fillStyle=hair;
  const hairstyle=(racer.appearanceSeed??0)%4;
  if(female){
    target.beginPath();target.arc(0,-25,7,Math.PI,Math.PI*2);target.fill();
    if(hairstyle===0){target.fillRect(-7,-25,3,21);target.fillRect(4,-25,3,21);}
    else if(hairstyle===1){target.fillRect(-8,-24,3,16);target.fillRect(5,-24,3,19);}
    else if(hairstyle===2){target.beginPath();target.moveTo(-7,-25);target.lineTo(-11,-5);target.lineTo(-6,-8);target.lineTo(-3,-23);target.fill();}
    else{target.beginPath();target.ellipse(0,-31,5,4,0,0,Math.PI*2);target.fill();target.fillRect(5,-23,3,17);}
    target.beginPath();target.arc(3,-32,4,0,Math.PI*2);target.fill();
    target.strokeStyle="#f0d18c";target.lineWidth=1.8;target.beginPath();target.moveTo(3,-32);target.lineTo(12,-37);target.stroke();
  }else{
    target.beginPath();target.arc(0,-25,7,Math.PI,Math.PI*2);target.fill();
    target.fillRect(-7,-25,3,7);target.fillRect(4,-25,3,7);
    target.beginPath();target.ellipse(0,-33,4,5,0,0,Math.PI*2);target.fill();
  }
  if(activeEffect==="faint"){
    target.strokeStyle="#514b4a";target.lineWidth=1.15;target.beginPath();target.moveTo(-4,-20);target.lineTo(-1.5,-19.5);target.moveTo(1.5,-19.5);target.lineTo(4,-20);target.stroke();
  }else if(activeEffect==="weak"){
    target.strokeStyle="#514b4a";target.lineWidth=1;target.beginPath();target.moveTo(-4,-20);target.lineTo(-1,-20);target.moveTo(1,-20);target.lineTo(4,-20);target.stroke();
  }else{
    target.fillStyle="#382d2a";target.beginPath();target.arc(-2.5,-20,1,0,Math.PI*2);target.arc(2.5,-20,1,0,Math.PI*2);target.fill();
  }
  target.strokeStyle="#8b5144";target.lineWidth=.8;target.beginPath();target.moveTo(0,-18);target.lineTo(-.4,-16);target.moveTo(-2,-14);target.quadraticCurveTo(0,-13,2,-14);target.stroke();
  if(female){target.strokeStyle="#b86e73";target.lineWidth=.8;target.beginPath();target.moveTo(-5,-17);target.lineTo(-3,-16);target.moveTo(3,-16);target.lineTo(5,-17);target.stroke();}
  target.save();target.globalAlpha=.78;target.fillStyle=racer.color;target.beginPath();target.moveTo(-7,-4);target.quadraticCurveTo(-26,-1,-17,-15);target.lineTo(-4,-8);target.closePath();target.fill();target.restore();
  if(racer.effectTimer>0&&racer.effectName&&target!==cameraCtx){target.save();target.font="bold 7px Arial,sans-serif";target.textAlign="center";target.textBaseline="middle";target.lineWidth=2;target.strokeStyle="rgba(14,25,24,.98)";target.strokeText(racer.effectName,0,-65,126);target.fillStyle="#fff1bd";target.fillText(racer.effectName,0,-65,126);target.restore();}
  // Chi tiết trang phục bổ sung: nữ có tà váy xòe và dải lụa; nam có trường bào hai tà, giáp vai.
  target.save();
  target.translate(0,0);
  if(female){
    target.fillStyle=racer.color;target.globalAlpha=.96;target.beginPath();
    target.moveTo(-8,2);target.lineTo(8,2);target.lineTo(22,22);target.quadraticCurveTo(0,28,-22,22);target.closePath();target.fill();
    target.fillStyle=racer.dark;target.beginPath();target.moveTo(-4,3);target.lineTo(0,8);target.lineTo(-13,23);target.lineTo(-18,20);target.closePath();target.fill();
    target.strokeStyle="#f4d99a";target.lineWidth=1.8;target.beginPath();target.moveTo(8,-5);target.quadraticCurveTo(27,2,31,18);target.stroke();
  }else{
    target.fillStyle=racer.dark;target.beginPath();
    target.moveTo(-10,1);target.lineTo(-3,5);target.lineTo(-7,25);target.lineTo(-15,22);target.closePath();target.fill();
    target.beginPath();target.moveTo(10,1);target.lineTo(3,5);target.lineTo(7,25);target.lineTo(15,22);target.closePath();target.fill();
    target.fillStyle="#e7ca83";target.fillRect(-4,5,8,3);
    target.strokeStyle="#e7ca83";target.lineWidth=1.6;target.beginPath();
    target.moveTo(-11,-5);target.lineTo(-18,2);target.lineTo(-13,7);
    target.moveTo(11,-5);target.lineTo(18,2);target.lineTo(13,7);target.stroke();
  }
  target.restore();
  if(racer.effectTimer>0){
    const t=time*.001,fade=Math.min(1,racer.effectTimer/.35);
    target.save();target.lineCap="round";target.lineJoin="round";
    if(activeEffect==="poison"){
      target.globalAlpha=.72*fade;target.strokeStyle="#a2e66d";target.fillStyle="#8acb62";target.lineWidth=1.7;
      for(let i=0;i<4;i++){const px=-18+i*12,py=-37-Math.abs(Math.sin(t*2+i))*7;target.beginPath();target.arc(px,py,2.2+(i%2),0,Math.PI*2);target.fill();target.beginPath();target.moveTo(px,py+5);target.quadraticCurveTo(px-5,py-2,px+1,py-9);target.stroke();}
      target.globalAlpha=.34;target.fillStyle="#77b85c";target.beginPath();target.ellipse(0,-19,10,12,0,0,Math.PI*2);target.fill();
    }else if(activeEffect==="weak"||activeEffect==="faint"){
      target.globalAlpha=.8*fade;target.fillStyle="#d8e4e8";target.beginPath();target.ellipse(9,-24,2,4,0,0,Math.PI*2);target.fill();
      target.strokeStyle="#b9d0d2";target.lineWidth=1.3;target.beginPath();target.moveTo(-17,1);target.quadraticCurveTo(-26,7,-30,14);target.stroke();
      if(activeEffect==="faint"){target.globalAlpha=.72;target.fillStyle="#e2e8ed";target.font="bold 8px Arial";target.textAlign="center";target.fillText("Z",14,-39+Math.sin(t*3)*2);target.fillText("Z",21,-47+Math.sin(t*3+1)*2);}
    }else if(activeEffect==="pill"||activeEffect==="boost"||activeEffect==="sword_intent"||activeEffect==="cloud_step"||activeEffect==="formation"){
      target.globalAlpha=.85*fade;target.strokeStyle="#ffe18a";target.lineWidth=2;
      for(let i=0;i<4;i++){const xx=-28+i*17,yy=12-Math.abs(Math.sin(t*5+i))*24;target.beginPath();target.moveTo(xx,yy+8);target.quadraticCurveTo(xx-5,yy,xx,yy-7);target.stroke();}
      target.globalAlpha=.55;target.fillStyle="#fff0ad";for(let i=0;i<7;i++){const xx=Math.sin(t*3+i*2.1)*27,yy=-10+Math.cos(t*4+i)*25;target.beginPath();target.arc(xx,yy,1.3,0,Math.PI*2);target.fill();}
    }else if(activeEffect==="impact"){
      target.globalAlpha=.9*fade;target.strokeStyle="#ffb27b";target.lineWidth=2.2;
      for(let i=0;i<5;i++){const aa=i*Math.PI*2/5+t*2;target.beginPath();target.moveTo(Math.cos(aa)*12,Math.sin(aa)*8-5);target.lineTo(Math.cos(aa)*27,Math.sin(aa)*17-5);target.stroke();}
      target.strokeStyle="#fff0c4";target.beginPath();target.moveTo(24,-34);target.lineTo(30,-40);target.lineTo(26,-27);target.lineTo(34,-30);target.stroke();
    }else if(activeEffect==="lightning"){
      target.globalAlpha=.95*fade;target.strokeStyle="#c8f3ff";target.lineWidth=2.8;target.shadowColor="#75dfff";target.shadowBlur=12;
      target.beginPath();target.moveTo(12,-48);target.lineTo(3,-30);target.lineTo(10,-28);target.lineTo(-3,-7);target.stroke();
      target.shadowBlur=0;target.fillStyle="#e9fbff";for(let i=0;i<6;i++){const xx=Math.sin(t*13+i*3)*28,yy=-4+Math.cos(t*9+i)*20;target.beginPath();target.arc(xx,yy,1.5,0,Math.PI*2);target.fill();}
    }else if(activeEffect==="gale"){
      target.globalAlpha=.8*fade;target.strokeStyle="#b8edf2";target.lineWidth=1.8;
      for(let i=0;i<4;i++){const yy=-24+i*13,offset=(t*38+i*21)%58;target.beginPath();target.moveTo(-42+offset,yy);target.bezierCurveTo(-24+offset,yy-8,-8+offset,yy+8,12+offset,yy-2);target.stroke();}
    }else if(activeEffect==="dizzy"){
      target.globalAlpha=.9*fade;target.strokeStyle="#d8c6ff";target.lineWidth=1.8;
      target.beginPath();target.ellipse(0,-43,17,5,Math.sin(t*5)*.18,t*.012,t*.012+Math.PI*1.7);target.stroke();
      target.fillStyle="#d8c6ff";target.beginPath();target.arc(Math.sin(t*5)*17,-43+Math.cos(t*5)*4,2,0,Math.PI*2);target.fill();
    }
    if(activeEffect==="sword_intent"){
      target.globalAlpha=.9*fade;target.strokeStyle="#c9f4ff";target.lineWidth=2.2;target.shadowColor="#78dfff";target.shadowBlur=9;target.beginPath();target.moveTo(-30,9);target.quadraticCurveTo(-2,-8,31,-37);target.stroke();target.shadowBlur=0;target.fillStyle="#fff2bd";target.beginPath();target.arc(30,-37,2.4,0,Math.PI*2);target.fill();
    }else if(activeEffect==="cloud_step"){
      target.globalAlpha=.72*fade;target.strokeStyle="#a9f4ed";target.lineWidth=2;for(let i=0;i<3;i++){const yy=15+i*5,shift=Math.sin(t*4+i)*5;target.beginPath();target.ellipse(-19+shift,yy,13+i*3,4,0,Math.PI,Math.PI*2);target.stroke();}target.fillStyle="#e6fff5";for(let i=0;i<5;i++){const xx=-28+i*13+Math.sin(t*5+i)*3;target.beginPath();target.arc(xx,17+Math.cos(t*4+i)*3,1.5,0,Math.PI*2);target.fill();}
    }else if(activeEffect==="formation"){
      target.globalAlpha=.78*fade;target.strokeStyle="#e0c5ff";target.lineWidth=1.3;target.beginPath();target.ellipse(0,7,34,12,t*.25,0,Math.PI*2);target.stroke();for(let i=0;i<6;i++){const a=i*Math.PI/3+t*.25;target.beginPath();target.arc(Math.cos(a)*29,7+Math.sin(a)*9,2,0,Math.PI*2);target.stroke();}
    }
    target.restore();
  }
  target.restore();
}


// =====================================================
// REVISION 12 — quy hoạch tiên điện theo tầng, không đè
// cổng, thác nước hoặc tên bảng hiệu; màu áo theo chức vị.
// =====================================================
function drawSectArchitecture(time){
 const buildings=[
  [165,175,.34,"TỤ LINH THÁP","tower","#39766e"],
  [365,175,.34,"TÀNG KINH CÁC","scripture","#8c6043"],
  [565,175,.34,"TÀNG BẢO CÁC","treasure","#b68a43"],
  [765,175,.34,"QUAN TINH LÂU","observatory","#536c91"],
  [955,175,.34,"BÁCH THẢO CÁC","herb","#648653"],
  [205,300,.34,"GIẢNG ĐẠO CÁC","lecture","#577d83"],
  [405,300,.34,"ĐAN CÁC","alchemy","#9e543b"],
  [550,300,.62,"LĂNG TIÊU CHÍNH ĐIỆN","main","#9d4939"],
  [695,300,.34,"LUYỆN KHÍ ĐIỆN","forge","#82604a"],
  [895,300,.34,"QUAN TINH ĐÀI","observatory","#536c91"],
  [165,410,.30,"BẾ QUAN ĐỘNG PHỦ","cave","#536b62"],
  [355,410,.30,"ĐỆ TỬ VIỆN","academy","#66817a"],
  [550,410,.30,"TRẬN PHÁP CÁC","array","#4f7b83"],
  [745,410,.30,"HỘ SƠN TRẬN CÁC","guardian","#527e88"],
  [935,410,.30,"NGOẠI VỤ ĐIỆN","foreign","#916c48"]
 ];
 buildings.forEach(([x,y,s,title,type,accent])=>{
  drawSectMountainLedge(x,y,s);
  drawSectPavilion(x,y-5,s,title,type,accent);
 });
}

// Bảo đảm áo nam/nữ luôn lấy đúng màu gốc theo ROLE, không pha màu theo giới.
function drawFormalSpectator(x,y,scale,roleName,time,phase=0){
  drawSpectator(x,y,scale,roleName,time,phase);
}


function drawStandingSectMaster(target,x,y,scale){
 target.save();target.translate(x,y);target.scale(scale,scale);
 target.fillStyle="#54292b";target.beginPath();target.moveTo(-20,0);target.lineTo(-17,-37);target.lineTo(17,-37);target.lineTo(20,0);target.closePath();target.fill();
 target.fillStyle="#a8443b";target.beginPath();target.moveTo(-16,-2);target.lineTo(-13,-34);target.lineTo(0,-42);target.lineTo(13,-34);target.lineTo(16,-2);target.closePath();target.fill();
 target.strokeStyle="#f2d48b";target.lineWidth=2;target.stroke();
 target.fillStyle="#efc39b";target.beginPath();target.ellipse(0,-53,10,12,0,0,Math.PI*2);target.fill();
 target.fillStyle="#e6dfd2";target.beginPath();target.moveTo(-7,-43);target.lineTo(7,-43);target.lineTo(5,-25);target.lineTo(0,-21);target.lineTo(-5,-25);target.closePath();target.fill();
 target.fillStyle="#e8c36e";target.beginPath();target.moveTo(-12,-61);target.lineTo(-9,-74);target.lineTo(-3,-65);target.lineTo(0,-80);target.lineTo(4,-65);target.lineTo(10,-74);target.lineTo(12,-61);target.closePath();target.fill();
 target.strokeStyle="#efc39b";target.lineWidth=4;target.lineCap="round";target.beginPath();target.moveTo(-14,-31);target.lineTo(-23,-12);target.moveTo(14,-31);target.lineTo(23,-12);target.stroke();
 target.restore();
}
function drawPodiumScene(target,time,mini=false){
 const ordered=sortedRacers().slice(0,3),w=target.canvas.width,h=target.canvas.height;
 const elapsedCeremony=Math.max(0,(performance.now()-ceremonyStartedAt)/1000);
 drawCeremonyBackdrop(target,mini,time);
 target.save();target.textAlign="center";target.textBaseline="middle";
 target.font=mini?"900 11px Georgia":"900 30px Georgia";
 target.fillStyle="#fff0b8";target.shadowColor="#ffcf64";target.shadowBlur=mini?8:22;
 target.fillText("VINH DANH TAM GIÁP TIÊN HỘI",w*.5,mini?12:h*.10);target.shadowBlur=0;
 const podiumX=[w*.25,w*.5,w*.75],ranks=[2,1,3];
 const base=h*.94, tops=[h*.70,h*.57,h*.70];
 const metals=["#c88d45","#d9e1e8","#b8794e"],glows=["#ffe17b","#dcecff","#e6a16c"];
 for(let i=0;i<3;i++){
  const rank=ranks[i],racer=ordered[rank-1];if(!racer)continue;
  const x=podiumX[i],top=tops[i],bw=w*.19;
  const grad=target.createLinearGradient(x-bw/2,top,x+bw/2,base);
  grad.addColorStop(0,metals[rank-1]);grad.addColorStop(.55,"#70513a");grad.addColorStop(1,"#302f2b");
  target.fillStyle=grad;target.fillRect(x-bw/2,top,bw,base-top);
  target.strokeStyle=glows[rank-1];target.lineWidth=mini?1.2:3;target.strokeRect(x-bw/2,top,bw,base-top);
  target.fillStyle=glows[rank-1];target.font=mini?"bold 8px Arial":"bold 18px Georgia";target.fillText(rank===1?"ĐỆ NHẤT":rank===2?"ĐỆ NHỊ":"ĐỆ TAM",x,top+(mini?9:19));
  const riderY=top-(mini?23:58),riderScale=mini?.54:1.34;
  target.save();target.globalAlpha=.25;target.fillStyle=glows[rank-1];target.beginPath();target.ellipse(x,riderY+20,mini?26:68,mini?12:28,0,0,Math.PI*2);target.fill();target.restore();
  // drawRacer luôn vẽ pháp kiếm bên dưới, nhân vật đứng thẳng trên kiếm.
  drawRacer(target,racer,x,riderY,riderScale,time);
  target.font=mini?"bold 7px Arial":"bold 15px Arial";target.fillStyle="#fff4ce";target.strokeStyle="#182a25";target.lineWidth=mini?2:4;
  target.strokeText(racer.name,x,top-(mini?42:94),w*.28);target.fillText(racer.name,x,top-(mini?42:94),w*.28);
  target.font=mini?"bold 7px Arial":"bold 14px Georgia";target.fillStyle=glows[rank-1];target.fillText(rank===1?"TOP 1 · QUÁN QUÂN":rank===2?"TOP 2 · Á QUÂN":"TOP 3 · QUÝ QUÂN",x,base+(mini?2:19),w*.30);
 }
 // Chưởng môn rời ngai: đứng dậy, bật lên phi kiếm rồi bay ngang phía sau tam giáp.
 // Không có cảnh cầm/trao quà hay chuyển cảnh trao thưởng.
 const mx=w*.10,my=h*.75;
 if(elapsedCeremony<1.25){
  drawStandingSectMaster(target,mx,my,mini?.48:1.0);
 }else{
  const p=Math.min(1,(elapsedCeremony-1.25)/3.2);
  const ease=p*p*(3-2*p);
  const sx=w*.10+(w*.72)*ease,sy=h*.70-h*.35*Math.sin(Math.PI*ease)-h*.08*ease;
  drawAwardMaster(target,sx,sy,mini?.40:.78,time);
 }
 target.restore();
}

/* REVISION 18 — bỏ phần đẩy quảng trường xuống thêm 210px.
   Giữ cảnh quan ở tọa độ gốc để vừa khung canvas 1100 × 900. */


// =====================================================
// REVISION 19 — quảng trường thanh sạch, nhân vật ngự kiếm
// đứng thẳng, lưỡi kiếm ngang hướng phải; thêm chim trời.
// =====================================================

function drawPlazaGate(time){
  const x=550,top=505,bottom=650;
  ctx.save();
  ctx.globalAlpha=.96;
  // Hai trụ cổng ngọc và đế đá.
  for(const side of [-1,1]){
    const px=x+side*104;
    const grad=ctx.createLinearGradient(px-9,0,px+9,0);
    grad.addColorStop(0,"#70502f");grad.addColorStop(.35,"#efd28b");grad.addColorStop(.7,"#a87b3e");grad.addColorStop(1,"#5d402b");
    ctx.fillStyle=grad;ctx.fillRect(px-8,top+28,16,bottom-top-28);
    ctx.strokeStyle="#f1d58f";ctx.lineWidth=1.5;ctx.strokeRect(px-8,top+28,16,bottom-top-28);
    ctx.fillStyle="#765331";ctx.fillRect(px-17,bottom-8,34,8);
    ctx.fillStyle="#e8c77f";ctx.fillRect(px-20,bottom-12,40,4);
    ctx.fillStyle="#f8e6ac";ctx.beginPath();ctx.arc(px,top+22,5,0,Math.PI*2);ctx.fill();
  }
  // Vòm cổng.
  ctx.beginPath();ctx.moveTo(x-116,top+37);ctx.quadraticCurveTo(x,top-45,x+116,top+37);
  ctx.strokeStyle="#68472d";ctx.lineWidth=15;ctx.stroke();
  ctx.strokeStyle="#e8c77f";ctx.lineWidth=7;ctx.stroke();
  ctx.strokeStyle="rgba(255,244,197,.8)";ctx.lineWidth=1.5;ctx.stroke();
  // Biển hiệu.
  ctx.fillStyle="#71332c";ctx.fillRect(x-57,top+2,114,28);
  ctx.strokeStyle="#f0d28a";ctx.lineWidth=2;ctx.strokeRect(x-57,top+2,114,28);
  ctx.fillStyle="#fff0c5";ctx.font="bold 15px Georgia";ctx.textAlign="center";ctx.textBaseline="middle";
  ctx.fillText("VẠN KIẾM TIÊN MÔN",x,top+16);
  ctx.restore();
}

function drawCrowd(time){
  // Cổng và cờ là lớp nền; không đặt cây, bụi cỏ, cầu hay bậc thang trên sân.
  drawPlazaGate(time);
  drawCrowdFlag(35,735,"#a53f36",time);
  drawCrowdFlag(W-35,735,"#b18a43",time);
  drawCrowdFlag(175,700,"#426f8a",time);
  drawCrowdFlag(W-175,700,"#8e4f83",time);

  // Chưởng môn ngự tại trung tâm quảng trường.
  drawVIPAura(550,650,104,"#ffe5a0",time,.4,1.25);
  drawVIPChair(550,672,1.34,"#762f32",time,0);
  drawFormalSpectator(550,655,1.08,"master",time,0);
  drawRoleLabel(550,590,"CHƯỞNG MÔN","#f2d17d",1.05);

  // Trưởng lão ngồi hai cánh, không chồng lên khu thân truyền.
  const elders=[145,235,865,955];
  elders.forEach((x,i)=>{
    const y=688;
    drawVIPAura(x,y-12,28,"#d7baff",time,i*.8,.38);
    drawVIPChair(x,y,.72,"#5b456b",time,i);
    drawFormalSpectator(x,y-9,.72,"elder",time,i*.9);
  });
  drawRoleLabel(235,645,"TRƯỞNG LÃO","#d4b5fa",.88);
  drawRoleLabel(865,645,"TRƯỞNG LÃO","#d4b5fa",.88);

  // Thân truyền đệ tử ngồi hàng riêng trước đài chưởng môn.
  const direct=[390,455,520,585,650,715];
  direct.forEach((x,i)=>{
    const y=690;
    drawVIPAura(x,y-12,22,"#a9d7ff",time,i*.7,.35);
    drawVIPChair(x,y,.62,"#405d82",time,i*.65);
    drawFormalSpectator(x,y-8,.62,"disciple",time,i);
  });
  drawRoleLabel(550,645,"CHÂN TRUYỀN ĐỆ TỬ","#a9c9f0",.88);

  // Các hàng đệ tử phổ thông tách tầng rõ ràng, không bị che khuất.
  const rows=[
    {role:"core",count:14,y:738,scale:.48},
    {role:"inner",count:20,y:778,scale:.39},
    {role:"outer",count:24,y:818,scale:.36},
    {role:"servant",count:28,y:858,scale:.32}
  ];
  rows.forEach((row,ri)=>{
    for(let i=0;i<row.count;i++){
      const x=28+i*(1044/(row.count-1));
      const y=row.y+Math.sin(i*1.37+ri)*2;
      drawSpectator(x,y,row.scale,row.role,time,i*.63+ri*1.8);
    }
  });
}

function drawSpiritBirds(time){
  // Tiên hạc trắng bay chậm ở tầng trời cao.
  const cranes=[
    {dir:1,y:64,s:.52,speed:.000018,phase:.08},
    {dir:-1,y:112,s:.42,speed:.000014,phase:.52}
  ];
  cranes.forEach((f,k)=>{
    for(let j=0;j<2;j++){
      const p=(time*f.speed+f.phase+j*.48)%1;
      const x=f.dir>0?-70+p*(W+140):W+70-p*(W+140);
      const y=f.y+Math.sin(time*.00055+j*1.7+k)*4;
      const flap=Math.sin(time*.002+j*1.8+k)*.65;
      ctx.save();ctx.translate(x,y);ctx.scale(f.dir*f.s,f.s);
      ctx.fillStyle="#fffdf0";ctx.beginPath();ctx.ellipse(0,0,18,5,-.05,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle="#fffdf0";ctx.lineWidth=3;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(12,-1);ctx.quadraticCurveTo(23,-12,21,-23);ctx.stroke();
      ctx.fillStyle="#fffdf0";ctx.beginPath();ctx.arc(20,-24,3.5,0,Math.PI*2);ctx.fill();
      ctx.fillStyle="#c94d3e";ctx.beginPath();ctx.moveTo(23,-24);ctx.lineTo(32,-22);ctx.lineTo(23,-20);ctx.closePath();ctx.fill();
      ctx.fillStyle="#fffdf5";ctx.beginPath();ctx.moveTo(-5,0);ctx.quadraticCurveTo(-22,-21-flap*5,-53,-20-flap*6);ctx.quadraticCurveTo(-36,6,-5,6);ctx.closePath();ctx.fill();
      ctx.beginPath();ctx.moveTo(-5,3);ctx.quadraticCurveTo(-22,13+flap*3,-42,20+flap*4);ctx.quadraticCurveTo(-25,11,-5,6);ctx.closePath();ctx.fill();
      ctx.strokeStyle="#b94c40";ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(-3,4);ctx.lineTo(-7,16);ctx.moveTo(5,4);ctx.lineTo(7,16);ctx.stroke();
      ctx.restore();
    }
  });

  // Chim én và linh điểu nhỏ: thân mảnh, hai cánh vỗ, bay thành nhóm thưa.
  const flocks=[
    {dir:1,y:86,s:.30,speed:.000031,phase:.34,count:3,color:"#354b54"},
    {dir:-1,y:145,s:.24,speed:.000025,phase:.71,count:2,color:"#b58a4a"}
  ];
  flocks.forEach((f,k)=>{
    for(let i=0;i<f.count;i++){
      const p=(time*f.speed+f.phase+i*.29)%1;
      const x=f.dir>0?-40+p*(W+80):W+40-p*(W+80);
      const y=f.y+Math.sin(time*.0012+i*1.9+k)*6;
      const flap=Math.sin(time*.004+i*1.7+k)*5;
      ctx.save();ctx.translate(x,y);ctx.scale(f.dir*f.s,f.s);
      ctx.fillStyle=f.color;
      ctx.beginPath();ctx.ellipse(0,0,13,3,0,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.moveTo(-2,0);ctx.quadraticCurveTo(-12,-flap-9,-24,-flap-3);ctx.quadraticCurveTo(-15,2,-2,2);ctx.closePath();ctx.fill();
      ctx.beginPath();ctx.moveTo(-2,1);ctx.quadraticCurveTo(-13,flap+8,-23,flap+4);ctx.quadraticCurveTo(-13,0,-2,-1);ctx.closePath();ctx.fill();
      ctx.beginPath();ctx.moveTo(9,0);ctx.lineTo(18,-2);ctx.lineTo(12,3);ctx.closePath();ctx.fill();
      ctx.restore();
    }
  });
}

function drawScenery(time){
  ctx.save();
  ctx.globalAlpha=1;ctx.shadowBlur=0;
  drawSky(time);

  // Thu gọn tầng trời bằng cách nâng núi, mây và tiên môn lên vừa phải.
  ctx.save();
  ctx.translate(0,-62);
  drawMountainRange();
  drawMovingClouds(time);
  drawWaterfall(112,292,25,190,time);
  drawWaterfall(972,238,34,245,time);
  drawSectArchitecture(time);
  ctx.restore();

  // Sân đá sạch: giữ mặt đất và dòng nước, bỏ cầu, bậc đá và cây cỏ trên quảng trường.
  drawRiver(time);
  drawSpiritBirds(time);
  drawCrowd(time);
  ctx.globalAlpha=1;ctx.shadowBlur=0;
  ctx.restore();
}


// =====================================================
// REVISION 20 — phục hồi đội hình quảng trường và kiếm cổ điển.
// =====================================================
function drawRacingArtifact(target,kind,phase){
  const female=arguments.length>3&&arguments[3]==="female";
  const colors=female?["#f2b9d5","#c8b4f2","#f0d18a","#f3a9bd"]:["#a9d8ef","#d8e5ef","#91c9d0","#d8bd82"];
  const blade=colors[kind%colors.length];
  target.save();target.translate(0,18);target.rotate(Math.PI/2+Math.sin(phase)*.025);
  target.globalAlpha=.95;target.shadowColor=blade;target.shadowBlur=7;
  target.fillStyle="#72533a";target.fillRect(-3,-1,6,20);
  target.fillStyle=female?"#d7a9a0":"#b99a61";target.fillRect(-11,1,22,4);
  target.fillStyle=blade;target.beginPath();
  if(kind%4===0){target.moveTo(0,-31);target.lineTo(5,-3);target.lineTo(0,19);target.lineTo(-5,-3);}
  else if(kind%4===1){target.moveTo(0,-29);target.lineTo(8,-8);target.lineTo(3,12);target.lineTo(0,19);target.lineTo(-3,12);target.lineTo(-8,-8);}
  else if(kind%4===2){target.moveTo(0,-27);target.quadraticCurveTo(13,-10,5,8);target.lineTo(0,19);target.lineTo(-5,8);target.quadraticCurveTo(-13,-10,0,-27);}
  else{target.moveTo(0,-32);target.lineTo(4,-7);target.lineTo(9,8);target.lineTo(0,19);target.lineTo(-9,8);target.lineTo(-4,-7);}
  target.closePath();target.fill();target.strokeStyle=female?"#fff0f7":"#f4f5e8";target.lineWidth=1.5;target.stroke();
  target.fillStyle=female?"#ffe5a8":"#b9f0ef";target.beginPath();target.arc(0,4,3,0,Math.PI*2);target.fill();
  target.restore();
}

function drawCrowd(time){
  // Chưởng môn ở chính giữa, hai nhóm danh dự ngồi tách hẳn hai bên.
  drawVIPAura(550,552,112,"#ffe5a0",time,.4,2.2);
  drawVIPAura(550,552,70,"#fff0bf",time,1.8,1.7);
  drawVIPChair(550,579,1.38,"#762f32",time,0);
  drawFormalSpectator(550,566,1.04,"master",time,0);
  drawRoleLabel(550,493,"CHƯỞNG MÔN","#f2d17d",1.05);

  // Thân truyền: 10 người ngồi bên trái, giãn đều, không sát nhau.
  for(let i=0;i<10;i++){
    const x=78+i*41,y=612;
    drawVIPAura(x,y-10,22,"#a9d7ff",time,i*.7,.42);
    drawVIPChair(x,y,.58,"#405d82",time,i*.65);
    drawFormalSpectator(x,y-7,.52,"disciple",time,i);
  }
  drawRoleLabel(263,566,"CHÂN TRUYỀN ĐỆ TỬ","#a9c9f0",.82);

  // Trưởng lão: 10 người bên phải, khoảng cách đồng đều.
  for(let i=0;i<10;i++){
    const x=662+i*41,y=612;
    drawVIPAura(x,y-10,23,"#d7baff",time,i*.75,.45);
    drawVIPChair(x,y,.60,"#5b456b",time,i);
    drawFormalSpectator(x,y-7,.54,"elder",time,i*.8);
  }
  drawRoleLabel(867,566,"TRƯỞNG LÃO","#d4b5fa",.82);

  // Nòng cốt đứng thành cụm, bỏ hoàn toàn bảng chữ trên đầu.
  for(let i=0;i<28;i++){
    const col=i%7,row=Math.floor(i/7);
    const x=445+col*35+(row%2)*7;
    const y=660+row*14+Math.sin(i*1.7)*2;
    drawVIPAura(x,y-8,12,"#b8e5d6",time,i*.61,.15);
    drawSpectator(x,y,.43,"core",time,i*.73);
  }

  // Nội môn: tách khỏi cụm nòng cốt ở chính giữa.
  // Chia đều thành hai cánh trái/phải, mỗi cánh 32 người (4 hàng x 8 người).
  // Chừa hành lang trung tâm để nòng cốt có không gian riêng.
  const innerSide=[
    {x0:18,dir:1},
    {x0:682,dir:1}
  ];
  innerSide.forEach((side,si)=>{
    for(let i=0;i<32;i++){
      const col=i%8,row=Math.floor(i/8);
      const x=side.x0+col*54+Math.sin(i*1.37+si)*2.2;
      const y=674+row*17+Math.sin(i*1.83+si)*1.8;
      drawSpectator(x,y,.36,"inner",time,i*.59+si*2.1);
    }
  });

  // Ngoại môn và tạp dịch xếp thành các dải phía dưới, phủ đều chiều ngang.
  const groups=[
    {role:"outer",count:92,scale:.33,y0:746,y1:775},
    {role:"servant",count:132,scale:.29,y0:790,y1:882}
  ];
  groups.forEach((g,gi)=>{
    for(let i=0;i<g.count;i++){
      const col=i%48,row=Math.floor(i/48);
      const x=12+col*23+Math.sin(i*2.17+gi)*5+(row%2)*4;
      const y=g.y0+(g.y1-g.y0)*((row+.5)/Math.max(1,Math.ceil(g.count/48)))+Math.sin(i*1.91+gi)*3;
      drawSpectator(x,y,g.scale,g.role,time,i*.59+gi*2.1);
    }
  });
  drawCrowdFlag(12,696,"#a53f36",time);
  drawCrowdFlag(W-18,696,"#b18a43",time);
}

function drawSectArchitecture(time){
 const buildings=[
  [235,170,.32,"TỤ LINH THÁP","tower","#39766e"],
  [390,170,.32,"TÀNG KINH CÁC","scripture","#8c6043"],
  [550,170,.52,"LĂNG TIÊU CHÍNH ĐIỆN","main","#9d4939"],
  [710,170,.32,"TÀNG BẢO CÁC","treasure","#b68a43"],
  [865,170,.32,"BÁCH THẢO CÁC","herb","#648653"],

  [235,292,.32,"GIẢNG ĐẠO CÁC","lecture","#577d83"],
  [390,292,.32,"ĐAN CÁC","alchemy","#9e543b"],
  [550,292,.32,"LUYỆN KHÍ ĐIỆN","forge","#82604a"],
  [710,292,.32,"QUAN TINH LÂU","observatory","#536c91"],
  [865,292,.32,"QUAN TINH ĐÀI","observatory","#536c91"],

  [235,410,.29,"BẾ QUAN ĐỘNG PHỦ","cave","#536b62"],
  [390,410,.29,"ĐỆ TỬ VIỆN","academy","#66817a"],
  [550,410,.29,"TRẬN PHÁP CÁC","array","#4f7b83"],
  [710,410,.29,"HỘ SƠN TRẬN CÁC","guardian","#527e88"],
  [865,410,.29,"NGOẠI VỤ ĐIỆN","foreign","#916c48"]
 ];
 buildings.forEach(([x,y,s,title,type,accent])=>{
  drawSectMountainLedge(x,y,s);
  drawSectPavilion(x,y-5,s,title,type,accent);
 });
}

function drawScenery(time){
  ctx.save();
  ctx.globalAlpha=1;ctx.shadowBlur=0;
  drawSky(time);
  // Trả tầng trời, mây và núi về cao độ cũ; không kéo bầu trời xuống thấp.
  drawMountainRange();
  drawMovingClouds(time);
  // Thác nước giữ ở hai mép, chừa khoảng trống cho các lầu các.
  drawWaterfall(112,292,25,190,time);
  drawWaterfall(972,238,34,245,time);
  drawRiver(time);
  drawSectArchitecture(time);
  drawSpiritBirds(time);
  drawCrowd(time);
  ctx.globalAlpha=1;ctx.shadowBlur=0;
  ctx.restore();
}


// =====================================================
// REVISION 18 — PHI KIẾM CHÂN THỰC, THÁC LIỀN SÔNG,
// TIÊN ĐIỆN LƠ LỬNG KHÔNG BỆ ĐÁ
// =====================================================

function drawRacingArtifact(target,kind,phase){
  const female=arguments.length>3&&arguments[3]==="female";
  const palettes=[
    ["#c7e4ed","#f7ffff","#5d8794","#a77b43"],["#9ed8e9","#efffff","#477d8a","#527d86"],
    ["#c8b5ed","#fff2ff","#78649f","#79558c"],["#e4bd70","#fff2c7","#986b35","#79512e"],
    ["#a8d2ad","#efffe8","#568260","#47704b"],["#b9c9da","#ffffff","#657b92","#526075"],
    ["#e8a5aa","#fff0e8","#a45161","#813d4a"],["#d9c89d","#fff6dc","#88744d","#665239"]
  ];
  const p=palettes[((kind%palettes.length)+palettes.length)%palettes.length];
  const blade=p[0],edge=p[1],fuller=p[2],metal=p[3],shape=((kind%8)+8)%8;
  target.save();target.translate(0,18);target.rotate(Math.PI/2+Math.sin(phase)*.012);
  target.globalAlpha=1;

  // Lưỡi kiếm không vẽ bóng đen bên dưới nhân vật.
  const grad=target.createLinearGradient(-12,0,12,0);
  grad.addColorStop(0,"#425c66");grad.addColorStop(.13,blade);
  grad.addColorStop(.48,edge);grad.addColorStop(.82,blade);grad.addColorStop(1,"#425c66");
  target.fillStyle=grad;target.beginPath();
  if(shape===0){target.moveTo(0,-56);target.lineTo(8,-43);target.lineTo(8,-8);target.lineTo(6,0);target.lineTo(-6,0);target.lineTo(-8,-8);target.lineTo(-8,-43);}
  else if(shape===1){target.moveTo(0,-54);target.lineTo(12,-40);target.lineTo(11,-8);target.lineTo(7,1);target.lineTo(-7,1);target.lineTo(-11,-8);target.lineTo(-12,-40);}
  else if(shape===2){target.moveTo(0,-57);target.quadraticCurveTo(14,-38,10,-15);target.lineTo(6,0);target.lineTo(-5,0);target.quadraticCurveTo(5,-30,0,-57);}
  else if(shape===3){target.moveTo(0,-60);target.lineTo(6,-43);target.lineTo(4,-5);target.lineTo(3,1);target.lineTo(-3,1);target.lineTo(-4,-5);target.lineTo(-6,-43);}
  else if(shape===4){target.moveTo(0,-57);target.lineTo(11,-37);target.lineTo(8,-7);target.lineTo(5,1);target.lineTo(-5,1);target.lineTo(-8,-7);target.lineTo(-11,-37);}
  else if(shape===5){target.moveTo(-2,-56);target.quadraticCurveTo(15,-38,12,-16);target.lineTo(6,1);target.lineTo(-5,0);target.quadraticCurveTo(2,-27,-2,-56);}
  else if(shape===6){target.moveTo(-2,-55);target.lineTo(9,-42);target.lineTo(10,-10);target.lineTo(7,1);target.lineTo(-7,1);target.lineTo(-10,-10);target.lineTo(-9,-42);}
  else{target.moveTo(0,-62);target.lineTo(9,-39);target.lineTo(7,-7);target.lineTo(4,2);target.lineTo(-4,2);target.lineTo(-7,-7);target.lineTo(-9,-39);}
  target.closePath();target.fill();target.strokeStyle=edge;target.lineWidth=1.7;target.stroke();
  target.strokeStyle=fuller;target.lineWidth=1.7;target.beginPath();target.moveTo(0,-52);target.quadraticCurveTo(1,-27,0,-3);target.stroke();
  target.strokeStyle="rgba(255,255,255,.82)";target.lineWidth=.9;target.beginPath();target.moveTo(-3,-43);target.lineTo(-2,-12);target.stroke();
  target.strokeStyle="rgba(255,255,255,.72)";target.lineWidth=1;target.beginPath();target.moveTo(6,-39);target.lineTo(5,-8);target.stroke();

  const guard=target.createLinearGradient(-19,0,19,0);
  guard.addColorStop(0,"#49372b");guard.addColorStop(.24,metal);guard.addColorStop(.5,"#fff0b9");guard.addColorStop(.76,metal);guard.addColorStop(1,"#49372b");
  target.fillStyle=guard;target.beginPath();target.moveTo(-18,1);target.quadraticCurveTo(-12,8,0,7);target.quadraticCurveTo(12,8,18,1);target.lineTo(14,-3);target.quadraticCurveTo(0,2,-14,-3);target.closePath();target.fill();
  target.strokeStyle="#fff0c7";target.lineWidth=1;target.stroke();
  target.fillStyle="#3c2c26";target.beginPath();target.roundRect(-4,7,8,23,2);target.fill();
  target.strokeStyle=metal;target.lineWidth=1.2;
  for(let y=11;y<=25;y+=5){target.beginPath();target.moveTo(-4,y);target.lineTo(4,y+3);target.stroke();}
  target.fillStyle=metal;target.fillRect(-5,8,10,2.5);target.fillRect(-5,27,10,2.5);
  target.beginPath();target.arc(0,33,5,0,Math.PI*2);target.fill();
  target.fillStyle=female?"#f6c8dc":"#bcebed";target.beginPath();target.arc(0,33,2.3,0,Math.PI*2);target.fill();
  target.fillStyle=p[2];target.beginPath();target.arc(0,3,2.8,0,Math.PI*2);target.fill();
  target.restore();
}
function drawWaterfall(x,y,width,height,time){
  ctx.save();
  const bottom=y+height+10;
  const sway=Math.sin(time*.00038+x*.01)*width*.045;
  const left=x-width*.58,right=x+width*.58;

  // Vách núi liền mạch, không tạo các tảng đá rời/lơ lửng.
  const cliff=ctx.createLinearGradient(x-width*2.2,y,x+width*2.2,bottom);
  cliff.addColorStop(0,"#284c43");cliff.addColorStop(.38,"#3d6251");
  cliff.addColorStop(.72,"#294b42");cliff.addColorStop(1,"#193a36");
  ctx.fillStyle=cliff;ctx.beginPath();
  ctx.moveTo(x-width*2.2,y-8);
  ctx.lineTo(x-width*1.65,y+height*.32);
  ctx.lineTo(x-width*1.9,bottom+8);
  ctx.lineTo(x+width*1.9,bottom+8);
  ctx.lineTo(x+width*1.65,y+height*.32);
  ctx.lineTo(x+width*2.2,y-8);
  ctx.closePath();ctx.fill();

  // Mép nguồn thác: dòng suối tràn qua một gờ đá tự nhiên.
  const source=ctx.createLinearGradient(x-width,y-8,x+width,y+12);
  source.addColorStop(0,"#1c6670");source.addColorStop(.32,"#7bc9c1");
  source.addColorStop(.52,"#edfff0");source.addColorStop(.76,"#79c7bd");
  source.addColorStop(1,"#205c68");
  ctx.fillStyle=source;ctx.beginPath();
  ctx.ellipse(x,y+1,width*1.02,8,0,0,Math.PI*2);ctx.fill();

  // Dải nước chính thu hẹp ở trên và xòe rộng ở chân thác.
  const water=ctx.createLinearGradient(x-width,y,x+width,y);
  water.addColorStop(0,"rgba(31,91,108,.9)");
  water.addColorStop(.16,"rgba(87,169,177,.96)");
  water.addColorStop(.38,"rgba(211,249,232,.98)");
  water.addColorStop(.56,"rgba(151,220,210,.98)");
  water.addColorStop(.82,"rgba(67,151,160,.95)");
  water.addColorStop(1,"rgba(25,83,101,.9)");
  ctx.fillStyle=water;ctx.beginPath();
  ctx.moveTo(left,y+4);
  ctx.bezierCurveTo(left-width*.18,y+height*.24,left-width*.2+sway,y+height*.72,x-width*1.04+sway,bottom);
  ctx.quadraticCurveTo(x+sway,bottom+12,x+width*1.04+sway,bottom);
  ctx.bezierCurveTo(right+width*.2+sway,y+height*.72,right+width*.18,y+height*.24,right,y+4);
  ctx.closePath();ctx.fill();

  ctx.save();ctx.beginPath();
  ctx.moveTo(left,y+4);
  ctx.bezierCurveTo(left-width*.18,y+height*.24,left-width*.2+sway,y+height*.72,x-width*1.04+sway,bottom);
  ctx.quadraticCurveTo(x+sway,bottom+12,x+width*1.04+sway,bottom);
  ctx.bezierCurveTo(right+width*.2+sway,y+height*.72,right+width*.18,y+height*.24,right,y+4);
  ctx.closePath();ctx.clip();

  // Dải nước rộng uốn cong chậm, tạo cảm giác nhiều lớp nước đổ.
  for(let i=0;i<8;i++){
    const t=(i-3.5)/3.5,px=x+t*width*.62;
    const drift=Math.sin(time*.00055+i*1.43+x)*width*.09;
    const phase=(time*.00022+i*.137)%1;
    const yy=y-25+phase*(height+55);
    const bandW=width*(.12+(i%3)*.045);
    ctx.globalAlpha=.12+(i%3)*.035;
    ctx.fillStyle=i%2?"#effff5":"#65c3c4";
    ctx.beginPath();ctx.moveTo(px-bandW*.4,yy);
    ctx.bezierCurveTo(px-bandW+drift,yy+height*.13,px+bandW*.55+drift,yy+height*.23,px+bandW*.48,yy+height*.34);
    ctx.quadraticCurveTo(px,yy+height*.38,px-bandW*.4,yy);ctx.closePath();ctx.fill();
  }

  // Vân sáng mềm, tốc độ vừa phải; tránh các vạch trắng thẳng đều nhau.
  for(let i=0;i<14;i++){
    const yy=y+((i*41+time*.012)%(height+18));
    const xx=x+Math.sin(i*1.51+time*.00055)*width*.43;
    const span=width*(.12+(i%4)*.04);
    ctx.globalAlpha=.15+(i%3)*.035;
    ctx.strokeStyle=i%2?"#f4fff4":"#9ce0d9";
    ctx.lineWidth=2.4+(i%3)*1.15;ctx.lineCap="round";
    ctx.beginPath();ctx.moveTo(xx-span,yy);
    ctx.quadraticCurveTo(xx,yy+Math.sin(time*.0008+i)*3,xx+span,yy+1);ctx.stroke();
  }
  ctx.restore();

  // Chân thác loang thành quạt nước, nối trực tiếp vào lòng sông.
  const fan=ctx.createLinearGradient(x,bottom-5,x,bottom+27);
  fan.addColorStop(0,"rgba(224,255,241,.82)");
  fan.addColorStop(.35,"rgba(100,196,190,.72)");
  fan.addColorStop(1,"rgba(51,139,151,0)");
  ctx.fillStyle=fan;ctx.beginPath();
  ctx.moveTo(x-width*1.05+sway,bottom-4);
  ctx.quadraticCurveTo(x-width*1.35,bottom+13,x-width*1.7,bottom+22);
  ctx.quadraticCurveTo(x,bottom+35,x+width*1.7,bottom+22);
  ctx.quadraticCurveTo(x+width*1.35,bottom+13,x+width*1.05+sway,bottom-4);
  ctx.closePath();ctx.fill();

  // Bọt trắng tập trung ngay nơi nước chạm sông.
  for(let i=0;i<11;i++){
    const bx=x+Math.sin(i*2.1+time*.00045)*width*1.15;
    const by=bottom+Math.cos(i*1.7+time*.0005)*4;
    ctx.globalAlpha=.38+(i%3)*.12;ctx.fillStyle="#f0fff3";
    ctx.beginPath();ctx.ellipse(bx,by,2.5+(i%3)*1.6,1.3+(i%2),0,0,Math.PI*2);ctx.fill();
  }
  ctx.globalAlpha=1;
  // Sương rất mỏng, hòa vào mặt sông thay vì tạo một vòng trắng cứng.
  const mist=ctx.createRadialGradient(x,bottom+5,1,x,bottom+5,width*2.2);
  mist.addColorStop(0,"rgba(218,255,239,.28)");
  mist.addColorStop(.45,"rgba(121,207,199,.13)");
  mist.addColorStop(1,"rgba(75,151,157,0)");
  ctx.fillStyle=mist;ctx.beginPath();ctx.ellipse(x,bottom+5,width*2.2,13,0,0,Math.PI*2);ctx.fill();
  ctx.restore();
}

function drawSectArchitecture(time){
 const buildings=[
  [235,170,.32,"TỤ LINH THÁP","tower","#39766e",0],
  [390,170,.32,"TÀNG KINH CÁC","scripture","#8c6043",1.1],
  [550,170,.52,"LĂNG TIÊU CHÍNH ĐIỆN","main","#9d4939",2.2],
  [710,170,.32,"TÀNG BẢO CÁC","treasure","#b68a43",3.3],
  [865,170,.32,"BÁCH THẢO CÁC","herb","#648653",4.4],
  [235,292,.32,"GIẢNG ĐẠO CÁC","lecture","#577d83",.7],
  [390,292,.32,"ĐAN CÁC","alchemy","#9e543b",1.8],
  [550,292,.32,"LUYỆN KHÍ ĐIỆN","forge","#82604a",2.9],
  [710,292,.32,"QUAN TINH LÂU","observatory","#536c91",4],
  [865,292,.32,"QUAN TINH ĐÀI","observatory","#536c91",5.1],
  [235,410,.29,"BẾ QUAN ĐỘNG PHỦ","cave","#536b62",1.4],
  [390,410,.29,"ĐỆ TỬ VIỆN","academy","#66817a",2.5],
  [550,410,.29,"TRẬN PHÁP CÁC","array","#4f7b83",3.6],
  [710,410,.29,"HỘ SƠN TRẬN CÁC","guardian","#527e88",4.7],
  [865,410,.29,"NGOẠI VỤ ĐIỆN","foreign","#916c48",5.8]
 ];
 buildings.forEach(([x,y,s,title,type,accent,phase],i)=>{
  const bob=Math.sin(time*.00125+phase)*4.2;
  const drift=Math.sin(time*.0008+phase)*1.3;
  ctx.save();
  // Công trình được phép lơ lửng nhẹ; bỏ toàn bộ vòng/quầng bên dưới.
  ctx.restore();
  drawSectPavilion(x+drift,y-5+bob,s,"",type,accent);

  // Bảng tên đặt ở tọa độ cố định, không đi theo chuyển động của lầu các.
  ctx.save();
  ctx.textAlign="center";ctx.textBaseline="middle";ctx.lineJoin="round";
  ctx.font="bold 12px Arial, sans-serif";
  ctx.lineWidth=2;ctx.strokeStyle="rgba(12,25,22,.98)";
  ctx.strokeText(title,x,y-5-169*s,120);
  ctx.fillStyle="#fff0c0";ctx.fillText(title,x,y-5-169*s,120);
  ctx.restore();
 });
}

function drawScenery(time){
  ctx.save();
  ctx.globalAlpha=1;ctx.shadowBlur=0;
  drawSky(time);
  drawMountainRange();
  drawMovingClouds(time);
  // Thác đổ trước, mặt sông vẽ sau để hai lớp nước giao nhau tự nhiên.
  drawWaterfall(112,292,25,190,time);
  drawWaterfall(972,238,34,245,time);
  drawRiver(time);
  drawSectArchitecture(time);
  drawSpiritBirds(time);
  drawCrowd(time);
  ctx.globalAlpha=1;ctx.shadowBlur=0;
  ctx.restore();
}


// =====================================================
// REVISION 18 — BÁT QUÁI CHƯỞNG MÔN, THÁC SƠN TUYỀN VÀ KHÁN ĐÀI
// =====================================================

function drawMasterBaguaAura(time) {
  const cx=550,cy=566,rotation=time*.00022;
  ctx.save();ctx.translate(cx,cy);

  // Chỉ giữ đồ hình Bát Quái: tám quẻ xoay quanh Thái Cực, không có
  // các vòng tròn hào quang bên ngoài.
  for(let i=0;i<8;i++){
    const a=rotation+i*Math.PI/4;
    const px=Math.cos(a)*91,py=Math.sin(a)*36;
    ctx.save();ctx.translate(px,py);ctx.rotate(a+Math.PI/2);
    ctx.strokeStyle="rgba(255,239,190,.96)";ctx.lineWidth=2.7;
    ctx.shadowColor="#ffe5a0";ctx.shadowBlur=7;
    for(let j=0;j<3;j++){
      const yy=(j-1)*7;
      ctx.beginPath();
      if((i+j)%2===0){ctx.moveTo(-8,yy);ctx.lineTo(8,yy);}
      else{ctx.moveTo(-8,yy);ctx.lineTo(-2,yy);ctx.moveTo(2,yy);ctx.lineTo(8,yy);}
      ctx.stroke();
    }
    ctx.restore();
  }

  // Thái Cực ở chính giữa, xoay ngược chiều với tám quẻ.
  ctx.save();ctx.rotate(-rotation*1.5);
  ctx.fillStyle="rgba(255,241,204,.98)";
  ctx.beginPath();ctx.arc(0,0,17,0,Math.PI*2);ctx.fill();
  ctx.fillStyle="#315e59";ctx.beginPath();
  ctx.arc(0,-8.5,8.5,Math.PI/2,-Math.PI/2);
  ctx.arc(0,8.5,8.5,-Math.PI/2,Math.PI/2);ctx.fill();
  ctx.fillStyle="#fff0c4";ctx.beginPath();ctx.arc(0,-8.5,2.6,0,Math.PI*2);ctx.fill();
  ctx.fillStyle="#315e59";ctx.beginPath();ctx.arc(0,8.5,2.6,0,Math.PI*2);ctx.fill();
  ctx.restore();ctx.restore();
}

// Thác bắt nguồn từ khe nước trong lòng núi, đổ thành màn nước nhiều sợi.
function drawWaterfall(x,y,width,height,time){
 const bottom=y+height,sway=Math.sin(time*.0012+x)*1.3;
 ctx.save();ctx.lineJoin="round";
 // Vai đá hai bên kéo liền từ sườn núi tới miệng khe, làm rõ thác nằm
 // trong vách núi thay vì lơ lửng phía trước phong cảnh.
 const cliff=ctx.createLinearGradient(x-width*2,0,x+width*2,0);
 cliff.addColorStop(0,"#344f3e");cliff.addColorStop(.35,"#71846e");cliff.addColorStop(.65,"#526d56");cliff.addColorStop(1,"#2d493a");
 ctx.fillStyle=cliff;ctx.beginPath();
 ctx.moveTo(x-width*3.1,y-34);
 ctx.bezierCurveTo(x-width*2.1,y-22,x-width*1.65,y+8,x-width*1.45,y+42);
 ctx.lineTo(x-width*1.75,bottom-8);
 ctx.quadraticCurveTo(x-width*.95,bottom+13,x-width*.35,bottom-1);
 ctx.lineTo(x+width*.35,bottom-1);
 ctx.quadraticCurveTo(x+width*.95,bottom+13,x+width*1.75,bottom-8);
 ctx.lineTo(x+width*1.45,y+42);
 ctx.bezierCurveTo(x+width*1.65,y+8,x+width*2.1,y-22,x+width*3.1,y-34);
 ctx.closePath();ctx.fill();

 // Hốc nguồn tối nằm sâu trong vách, gờ đá phủ lên mép nước.
 ctx.fillStyle="rgba(13,37,34,.88)";ctx.beginPath();
 ctx.moveTo(x-width*.9,y+13);ctx.quadraticCurveTo(x,y-15,x+width*.9,y+13);
 ctx.quadraticCurveTo(x+width*.62,y+29,x,y+24);ctx.quadraticCurveTo(x-width*.62,y+29,x-width*.9,y+13);ctx.fill();
 ctx.strokeStyle="rgba(210,202,160,.75)";ctx.lineWidth=5;ctx.beginPath();
 ctx.moveTo(x-width*1.2,y+10);ctx.quadraticCurveTo(x,y-12,x+width*1.2,y+10);ctx.stroke();

 const water=ctx.createLinearGradient(x-width*1.5,0,x+width*1.5,0);
 water.addColorStop(0,"#286a78");water.addColorStop(.2,"#70c5c7");water.addColorStop(.48,"#e8fff5");water.addColorStop(.75,"#79c9c8");water.addColorStop(1,"#286a78");
 ctx.fillStyle=water;ctx.beginPath();ctx.moveTo(x-width*.58,y+16);
 ctx.bezierCurveTo(x-width*.66,y+height*.35,x-width*.92+sway,bottom-24,x-width*1.5,bottom);
 ctx.quadraticCurveTo(x,bottom+17,x+width*1.5,bottom);
 ctx.bezierCurveTo(x+width*.92+sway,bottom-24,x+width*.66,y+height*.35,x+width*.58,y+16);ctx.closePath();ctx.fill();

 ctx.save();ctx.beginPath();ctx.moveTo(x-width*.58,y+16);
 ctx.bezierCurveTo(x-width*.66,y+height*.35,x-width*.92+sway,bottom-24,x-width*1.5,bottom);
 ctx.quadraticCurveTo(x,bottom+17,x+width*1.5,bottom);
 ctx.bezierCurveTo(x+width*.92+sway,bottom-24,x+width*.66,y+height*.35,x+width*.58,y+16);ctx.closePath();ctx.clip();
 for(let i=0;i<26;i++){const px=x-width*1.3+(i+.5)/26*width*2.6,len=24+(i%5)*8,off=(time*(.014+(i%4)*.003)+i*25)%(height+len)-len;ctx.globalAlpha=.32+(i%5)*.07;ctx.strokeStyle=i%5===0?"#fff":i%2?"#d9fff1":"#63b9c3";ctx.lineWidth=i%6===0?2.2:1.1;ctx.beginPath();ctx.moveTo(px,y+off);ctx.lineTo(px+sway,y+off+len);ctx.stroke();}
 ctx.restore();
 ctx.globalAlpha=.78;ctx.strokeStyle="rgba(242,255,249,.92)";ctx.lineWidth=2.5;
 for(let i=0;i<7;i++){const spread=(i-3)*width*.72;ctx.beginPath();ctx.moveTo(x+spread*.2,bottom);ctx.quadraticCurveTo(x+spread*.7,bottom+9,x+spread,bottom+4+Math.sin(time*.004+i)*2);ctx.stroke();}
 ctx.restore();
}

// Dòng sông nằm sát chân thác, nước nhập vào nhau thay vì kết thúc lơ lửng.
function drawRiverCurrent(time) {
  // Một lòng sông duy nhất, liên tục từ trái sang phải; bỏ dải đất nằm
  // giữa hai lớp nước khiến dòng sông trông như bị chia đôi.
  ctx.save();ctx.lineCap="round";ctx.lineJoin="round";
  const riverPath=()=>{
    ctx.beginPath();ctx.moveTo(-80,520);
    ctx.bezierCurveTo(150,505,260,536,430,521);
    ctx.bezierCurveTo(610,506,720,536,880,520);
    ctx.bezierCurveTo(1030,506,1110,530,1180,516);
  };
  ctx.strokeStyle="#29483c";ctx.lineWidth=66;riverPath();ctx.stroke();
  ctx.strokeStyle="rgba(199,183,139,.82)";ctx.lineWidth=59;riverPath();ctx.stroke();
  const water=ctx.createLinearGradient(0,488,0,552);
  water.addColorStop(0,"#c5eee0");water.addColorStop(.28,"#69beb8");
  water.addColorStop(.66,"#318d95");water.addColorStop(1,"#185f6c");
  ctx.strokeStyle=water;ctx.lineWidth=53;riverPath();ctx.stroke();

  const drift=(time*.035)%150;
  for(let i=0;i<36;i++){
    const x=((i*43+drift)%1320)-70;
    const y=520+Math.sin(x*.008)*8+Math.sin(i*1.5)*4;
    ctx.strokeStyle=i%5===0?"rgba(255,255,246,.88)":"rgba(218,252,239,.52)";
    ctx.lineWidth=i%4===0?2.2:1.15;ctx.beginPath();
    ctx.moveTo(x,y);ctx.quadraticCurveTo(x+11,y-3,x+24,y+1);ctx.stroke();
  }
  ctx.restore();
}

// Núi chuyển thành các lớp sườn mềm; bỏ các mảng đá/vách vụn dư thừa.
function drawMountainRange(){
 // Nhiều ngọn núi tròn, đan xen và chồng lớp; đường đỉnh thoải, không nhọn.
 const layer=(points,top,mid,base)=>{
  const g=ctx.createLinearGradient(0,115,0,600);g.addColorStop(0,top);g.addColorStop(.5,mid);g.addColorStop(1,base);
  ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(0,H);
  points.forEach((p,i)=>{if(i===0)ctx.lineTo(p[0],p[1]);else{const prev=points[i-1],mx=(prev[0]+p[0])/2;ctx.quadraticCurveTo(mx,Math.min(prev[1],p[1])-13,p[0],p[1]);}});
  ctx.lineTo(W,H);ctx.closePath();ctx.fill();
 };
 layer([[0,370],[70,322],[145,300],[220,318],[300,245],[380,220],[455,252],[535,205],[610,228],[690,188],[770,225],[850,206],[930,265],[1010,280],[W,330]],"#dce8d9","#a5bdac","#6f907d");
 layer([[0,438],[80,395],[160,365],[245,390],[330,315],[410,300],[490,335],[570,280],[650,302],[735,265],[820,300],[905,285],[990,350],[W,390]],"#a8bea8","#6f8d72","#3f634f");
 layer([[0,520],[95,470],[180,450],[270,475],[360,405],[445,390],[530,420],[620,375],[705,395],[790,365],[875,405],[960,430],[W,470]],"#789777","#4b7056","#294a3b");
 // Vách núi liền mạch phía trước, mở ra các khe thác ngay trên sườn.
 const face=ctx.createLinearGradient(0,330,0,590);face.addColorStop(0,"#71846e");face.addColorStop(.45,"#526d56");face.addColorStop(1,"#263f35");
 ctx.fillStyle=face;ctx.beginPath();ctx.moveTo(0,420);
 ctx.bezierCurveTo(80,380,155,394,230,425);
 ctx.bezierCurveTo(315,455,390,468,470,442);
 ctx.bezierCurveTo(555,414,640,422,720,451);
 ctx.bezierCurveTo(820,484,920,462,W,420);
 ctx.lineTo(W,590);ctx.lineTo(0,590);ctx.closePath();ctx.fill();
 // Gân địa tầng mềm theo triền núi.
 ctx.save();ctx.lineCap="round";
 for(let i=0;i<8;i++){const y=438+i*17;ctx.strokeStyle=i%2?"rgba(27,49,39,.25)":"rgba(205,198,154,.18)";ctx.lineWidth=i%3===0?3:1.5;ctx.beginPath();ctx.moveTo(0,y);ctx.bezierCurveTo(190,y-20,320,y+15,500,y-4);ctx.bezierCurveTo(700,y-22,870,y+18,W,y-7);ctx.stroke();}
 ctx.restore();
}

function drawCrowd(time) {
  drawMasterBaguaAura(time);
  drawVIPChair(550,579,1.38,"#762f32",time,0);
  drawFormalSpectator(550,566,1.04,"master",time,0);
  drawRoleLabel(550,493,"CHƯỞNG MÔN","#f2d17d",1.05);

  for(let i=0;i<10;i++){
    const x=78+i*41,y=612;
    drawVIPAura(x,y-10,22,"#a9d7ff",time,i*.7,.42);
    drawVIPChair(x,y,.58,"#405d82",time,i*.65);
    drawFormalSpectator(x,y-7,.52,"disciple",time,i);
  }
  drawRoleLabel(263,566,"CHÂN TRUYỀN ĐỆ TỬ","#a9c9f0",.82);

  for(let i=0;i<10;i++){
    const x=662+i*41,y=612;
    drawVIPAura(x,y-10,23,"#d7baff",time,i*.75,.45);
    drawVIPChair(x,y,.60,"#5b456b",time,i);
    drawFormalSpectator(x,y-7,.54,"elder",time,i*.8);
  }
  drawRoleLabel(867,566,"TRƯỞNG LÃO","#d4b5fa",.82);

  for(let i=0;i<28;i++){
    const col=i%7,row=Math.floor(i/7);
    const x=445+col*35+(row%2)*7,y=660+row*14+Math.sin(i*1.7)*2;
    drawVIPAura(x,y-8,12,"#b8e5d6",time,i*.61,.15);
    drawSpectator(x,y,.43,"core",time,i*.73);
  }
  // Nội môn vẫn đứng thành hai cánh riêng, không chen vào nòng cốt.
  for(let i=0;i<64;i++){
    const side=i<32?0:1,local=i%32,col=local%8,row=Math.floor(local/8);
    const x=side===0?42+col*43+(row%2)*4:762+col*43+(row%2)*4;
    const y=656+row*16+Math.sin(i*1.73)*1.8;
    drawSpectator(x,y,.37,"inner",time,i*.59);
  }

  // Ngoại môn ở dải giữa; tạp dịch được trải xuống gần mép dưới canvas.
  const groups=[
    {role:"outer",count:92,scale:.34,y0:705,y1:765},
    {role:"servant",count:146,scale:.30,y0:785,y1:885}
  ];
  groups.forEach((g,gi)=>{
    const rowCount=Math.ceil(g.count/48);
    for(let i=0;i<g.count;i++){
      const col=i%48,row=Math.floor(i/48);
      const x=12+col*23+Math.sin(i*2.17+gi)*6+(row%2)*5;
      const y=g.y0+(g.y1-g.y0)*((row+.5)/rowCount)+Math.sin(i*1.91+gi)*5;
      drawSpectator(x,y,g.scale,g.role,time,i*.59+gi*2.1);
    }
  });
  drawCrowdFlag(12,696,"#a53f36",time);
  drawCrowdFlag(W-18,696,"#b18a43",time);
}

function drawScenery(time) {
  drawSky(time);
  drawMountainRange();
  drawMovingClouds(time);
  drawRiver(time);

  // Rừng và tiên điện ở phía sau màn nước.
  drawDenseForest(time);
  drawSectArchitecture(time);
  drawAmbientEnergy(time);
  drawSpiritBirds(time);

  // Hai thác bắt nguồn từ khe núi, chân thác chạm trực tiếp lòng sông.
  drawWaterfall(112, 260, 25, 260, time);
  drawWaterfall(972, 238, 34, 282, time);
  drawRiverCurrent(time);
  drawCrowd(time);
}


// REVISION 54 — trả thông báo về vùng trời trống, hoàn thiện hai sơn tuyền và điểm hợp lưu.
function drawTwinWaterfallMountains(time){
  const peak=(x,scale,flip)=>{
    ctx.save();
    ctx.translate(x,0);
    ctx.scale(scale*(flip?-1:1),scale);
    const rock=ctx.createLinearGradient(0,105,0,560);
    rock.addColorStop(0,"#d9e5d4");
    rock.addColorStop(.22,"#9db79e");
    rock.addColorStop(.58,"#55785f");
    rock.addColorStop(1,"#294a3b");
    ctx.fillStyle=rock;
    ctx.beginPath();
    ctx.moveTo(-205,555);
    ctx.bezierCurveTo(-178,438,-154,345,-128,250);
    ctx.bezierCurveTo(-105,184,-70,126,-25,105);
    ctx.bezierCurveTo(8,91,42,126,65,176);
    ctx.bezierCurveTo(99,246,128,338,157,405);
    ctx.bezierCurveTo(176,454,194,508,210,555);
    ctx.closePath();ctx.fill();

    // Các sống núi phụ tạo chiều sâu, ôm lấy khe nước.
    ctx.fillStyle="rgba(31,67,52,.34)";
    ctx.beginPath();
    ctx.moveTo(-205,555);
    ctx.bezierCurveTo(-165,430,-120,345,-86,282);
    ctx.bezierCurveTo(-58,228,-35,190,-8,178);
    ctx.bezierCurveTo(-42,282,-55,392,-68,555);
    ctx.closePath();ctx.fill();
    ctx.fillStyle="rgba(226,237,214,.48)";
    ctx.beginPath();
    ctx.moveTo(8,111);
    ctx.quadraticCurveTo(47,134,67,183);
    ctx.quadraticCurveTo(37,166,22,174);
    ctx.quadraticCurveTo(5,154,-13,161);
    ctx.quadraticCurveTo(-3,130,8,111);
    ctx.closePath();ctx.fill();

    // Vệt địa tầng và cây bụi bám sườn.
    ctx.lineCap="round";
    for(let i=0;i<6;i++){
      const yy=285+i*37;
      ctx.strokeStyle=i%2?"rgba(25,57,43,.25)":"rgba(224,218,177,.22)";
      ctx.lineWidth=2.2;
      ctx.beginPath();
      ctx.moveTo(-154+i*3,yy+24);
      ctx.quadraticCurveTo(-72,yy-12,8,yy+16);
      ctx.quadraticCurveTo(85,yy+38,157,yy+66);
      ctx.stroke();
    }
    ctx.restore();
  };
  peak(112,1.08,false);
  peak(972,1.12,true);
}

// Miệng thác xòe rộng, có bọt nước và vân dòng chảy nhập vào sông.
function drawWaterfallMouth(x,y,time,side){
  ctx.save();
  ctx.lineCap="round";ctx.lineJoin="round";
  const sway=Math.sin(time*.0011+side)*4;
  const basin=ctx.createLinearGradient(x,y-10,x,y+34);
  basin.addColorStop(0,"rgba(221,255,246,.92)");
  basin.addColorStop(.38,"rgba(107,207,199,.88)");
  basin.addColorStop(1,"rgba(35,125,137,.12)");
  ctx.fillStyle=basin;
  ctx.beginPath();
  ctx.moveTo(x-16,y-17);
  ctx.bezierCurveTo(x-30,y+2,x-77+sway,y+14,x-106,y+29);
  ctx.quadraticCurveTo(x,y+57,x+106,y+29);
  ctx.bezierCurveTo(x+77+sway,y+14,x+30,y+2,x+16,y-17);
  ctx.quadraticCurveTo(x,y-5,x-16,y-17);
  ctx.closePath();ctx.fill();

  for(let i=0;i<9;i++){
    const spread=(i-4)*20;
    const yy=y+17+Math.abs(i-4)*2;
    ctx.strokeStyle=i%3===0?"rgba(255,255,245,.94)":"rgba(198,249,239,.7)";
    ctx.lineWidth=i%3===0?2.1:1.2;
    ctx.beginPath();
    ctx.moveTo(x+spread*.22,yy);
    ctx.quadraticCurveTo(x+spread*.62+sway,yy+7,x+spread,yy+10+Math.sin(time*.003+i)*1.5);
    ctx.stroke();
  }
  // Bọt sáng trôi chậm ra hai phía theo dòng sông.
  for(let i=0;i<7;i++){
    const drift=(time*.018+i*29)%118-59;
    ctx.globalAlpha=.45+.35*Math.sin(time*.002+i)**2;
    ctx.fillStyle="#effff5";
    ctx.beginPath();ctx.ellipse(x+drift,y+24+Math.sin(i*2+time*.001)*5,3.5,1.5,0,0,Math.PI*2);ctx.fill();
  }
  ctx.restore();
}

// Dòng thác duy nhất bắt nguồn từ khe đỉnh tiên sơn bên trái.
function drawMountainCascade(x,top,bottom,time){
  ctx.save();const sway=Math.sin(time*.00075)*2.2;
  const water=ctx.createLinearGradient(x-8,top,x+54,bottom);
  water.addColorStop(0,"rgba(225,250,239,.96)");water.addColorStop(.18,"rgba(170,225,216,.94)");water.addColorStop(.56,"rgba(105,190,187,.96)");water.addColorStop(1,"rgba(62,145,151,.94)");ctx.fillStyle=water;
  const path=()=>{ctx.beginPath();ctx.moveTo(x-5,top);ctx.bezierCurveTo(x-15,top+82,x-4,top+164,x+12,top+238);ctx.bezierCurveTo(x+23,bottom-78,x+31+sway,bottom-28,x+43+sway,bottom+2);ctx.lineTo(x+84+sway,bottom+2);ctx.bezierCurveTo(x+67+sway,bottom-42,x+56,bottom-92,x+43,bottom-151);ctx.bezierCurveTo(x+24,bottom-245,x+13,top+100,x+9,top+5);ctx.closePath();};
  path();ctx.fill();ctx.save();path();ctx.clip();
  for(let i=0;i<9;i++){const xx=x-1+i*8,drift=Math.sin(time*.0012+i*.8)*3,offset=(time*.012+i*43)%(bottom-top+80);ctx.strokeStyle=i%3===0?"rgba(248,255,241,.78)":"rgba(215,250,240,.42)";ctx.lineWidth=i%3===0?2:1.1;ctx.beginPath();ctx.moveTo(xx+drift,top+offset-35);ctx.bezierCurveTo(xx-5+drift,top+offset+8,xx+8+drift,top+offset+42,xx+13+drift,top+offset+78);ctx.stroke();}
  ctx.restore();ctx.globalAlpha=.72;const foam=ctx.createRadialGradient(x+60,bottom-2,3,x+60,bottom-2,66);foam.addColorStop(0,"rgba(240,255,245,.9)");foam.addColorStop(.35,"rgba(163,229,218,.62)");foam.addColorStop(1,"rgba(111,194,190,0)");ctx.fillStyle=foam;ctx.beginPath();ctx.ellipse(x+60,bottom-1,68,17,0,0,Math.PI*2);ctx.fill();
  for(let i=0;i<5;i++){const drift=(time*.014+i*23)%86-43;ctx.strokeStyle="rgba(230,255,245,.65)";ctx.lineWidth=1.4;ctx.beginPath();ctx.ellipse(x+60+drift,bottom+2+Math.sin(time*.001+i)*3,12+i*2,2.2,0,0,Math.PI*2);ctx.stroke();}ctx.restore();
}

function drawScenery(time){
  ctx.save();ctx.globalAlpha=1;ctx.shadowBlur=0;drawSky(time);drawMountainRange();drawTwinWaterfallMountains(time);drawMovingClouds(time);
  drawRiver(time);drawSectArchitecture(time);drawDenseForest(time);drawAmbientEnergy(time);drawSpiritBirds(time);drawRiverCurrent(time);
  // Thác trái chảy trực tiếp từ đỉnh núi; bỏ hẳn thác phải và trụ đá sau nước.
  drawMountainCascade(82,132,548,time);drawCrowd(time);ctx.globalAlpha=1;ctx.shadowBlur=0;ctx.restore();
}

// Thông báo nằm trên khoảng trời trống, tuyệt đối không đè lên biển hiệu
// "LĂNG TIÊU CHÍNH ĐIỆN" ở hàng kiến trúc phía trên.
function drawAnnouncement(){
  const message=finishMessageLife>0?finishMessage:eventTextLife>0?eventText:"";
  if(!message)return;
  const isFinish=finishMessageLife>0;
  const life=isFinish?finishMessageLife:eventTextLife;
  ctx.save();
  ctx.globalAlpha=clamp(life/.55,0,1);
  ctx.font="bold 15px Georgia";
  const boxW=Math.min(W-36,Math.max(230,ctx.measureText(message).width+28));
  const boxH=29,x=(W-boxW)/2,y=12;
  ctx.fillStyle=isFinish?"rgba(99,59,26,.92)":"rgba(24,52,41,.9)";
  ctx.fillRect(x,y,boxW,boxH);
  ctx.strokeStyle="#e4c27e";ctx.lineWidth=1.3;
  ctx.strokeRect(x+.5,y+.5,boxW-1,boxH-1);
  ctx.fillStyle=isFinish?"#ffe7a7":"#f6dfa2";
  ctx.textAlign="center";ctx.textBaseline="middle";
  ctx.fillText(message,W/2,y+boxH/2,boxW-18);
  ctx.restore();
}
