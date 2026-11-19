"use strict";

// =====================================================
// VISUAL OVERRIDES — VẠN KIẾM PHI TIÊN
// Tách rõ rừng núi / quảng trường, bố trí khán đài,
// tạo pháp bảo đa dạng cho từng người đua.
// =====================================================








// Pháp bảo đua: chọn ổn định theo mã người chơi, không đổi giữa các khung hình.
function artifactKind(racer) {
  if (Number.isInteger(racer.swordStyle)) return ((racer.swordStyle % 12) + 12) % 12;
  const id = String(racer.id || racer.name || "0");
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return hash % 12;
}






// =====================================================
// REVISION 2 — hướng pháp bảo, quảng trường và khán đài
// Hướng đua trong game: trái -> phải.
// =====================================================









// =====================================================
// REVISION 3 — thác nghiêng, HUD cân giữa và tinh chỉnh cảnh
// =====================================================



// =====================================================
// REVISION 4 — quảng trường toàn bề ngang, tiên sơn và kiến trúc
// =====================================================



// Một mái chính liền khối, không còn các tầng mái lồng và khe hở.


// HUD ở hai góc trên, nền xanh ôm vừa nhãn và số liệu.



// =====================================================
// REVISION 5 — quảng trường gọn, tiên sơn, hồ suối và khán đài
// =====================================================


// Suối núi uốn quanh chân núi, đổ xuống hồ xanh ngọc dưới chân thác.

// Tăng chiều sâu địa hình núi: vân đá, sườn gãy, tuyết và thảm cây.

// Tiên hạc và linh điểu có thân, cổ, đuôi, lông cánh và nhịp bay riêng.

// Mái ngói cong sát thân điện, diềm mái liền nhà; biển hiệu treo ở mặt trước,
// đúng khoảng giữa mép mái và thân điện.



// HUD ở hai góc trên, nền xanh ôm vừa nội dung.


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


// Thác có lòng nước rõ, chân thác chạm mặt hồ; không còn cảm giác treo giữa trời.

// Địa hình núi nhiều sống núi, đỉnh nhọn, vách đá dựng và tầng đá ngoằn ngoèo.




// Tránh để thẻ HOÀN THÀNH che cổng đích TIÊN MÔN ở góc phải.



// =====================================================
// REVISION 7 — BỐ CỤC KHÁN ĐÀI, HỒ TỰ NHIÊN, CỔNG 3D
// =====================================================



// Hồ dạng lòng chảo tự nhiên, bờ đất/đá ôm theo địa hình; không đặt các viên đá lên mặt nước.

// Thác vẽ sau mặt hồ: chân thác chạm mặt nước, bọt loang ra đúng điểm tiếp xúc.

// Núi có đỉnh tù và các bậc vách đá rộng để đặt điện; tránh chóp nhọn bất khả thi.

// Đặt điện lên các bậc vách đá; bệ có chân tiếp xúc với mặt đá.

// Đồng hồ đặt giữa mép trên, chỉ còn chữ số, không nền và không nhãn phụ.


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



// Hồ và sông nhập thành một lòng nước liên tục; gợn ngắn theo dòng chảy.

// Thác có vách đá ôm dòng, màn nước nhiều lớp và sương ở chân thác.




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
 else if(type==="lecture"){ctx.fillStyle="#f0d89a";ctx.font="bold 10px Arial, sans-serif";ctx.textAlign="center";ctx.shadowBlur=0;ctx.shadowColor="transparent";ctx.lineWidth=0;ctx.fillText("ĐẠO PHÁP KINH VĂN",0,-48);for(let i=0;i<5;i++){ctx.fillStyle="#9a7650";ctx.beginPath();ctx.ellipse(-30+i*15,-7,5,3,0,0,Math.PI*2);ctx.fill();}}
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


/* REVISION 16 — tên rõ nét, khán đài phân tầng, không dùng bảng nền. */
function drawRoleLabel(x,y,label,color="#fff0c5",scale=1){
 ctx.save();
 ctx.globalAlpha=1;ctx.globalCompositeOperation="source-over";
 ctx.shadowColor="transparent";ctx.shadowBlur=0;
 ctx.shadowOffsetX=0;ctx.shadowOffsetY=0;ctx.filter="none";
 // Tăng cỡ chữ và chỉ giữ một nét viền tối rõ ràng để chữ không bị bết/mờ.
 ctx.font="900 "+Math.max(17,20*scale)+"px Arial, sans-serif";
 ctx.textAlign="center";ctx.textBaseline="middle";
 ctx.lineJoin="round";ctx.miterLimit=2;
 ctx.lineWidth=Math.max(3,3.5*scale);
 ctx.strokeStyle="#10251f";
 ctx.strokeText(label,x,y);
 ctx.fillStyle=color;
 ctx.fillText(label,x,y);
 ctx.restore();
}


function drawSectMountainLedge(x,y,scale){
 ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);
 const g=ctx.createLinearGradient(0,-2,0,28);g.addColorStop(0,"#a59b78");g.addColorStop(.35,"#66745b");g.addColorStop(1,"#30483e");
 ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(-112,1);ctx.lineTo(-84,-7);ctx.lineTo(-45,-4);ctx.lineTo(-14,-12);ctx.lineTo(22,-5);ctx.lineTo(67,-9);ctx.lineTo(112,2);ctx.lineTo(98,18);ctx.lineTo(-96,18);ctx.closePath();ctx.fill();
 ctx.strokeStyle="rgba(224,211,166,.65)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-112,1);ctx.lineTo(-84,-7);ctx.lineTo(-45,-4);ctx.lineTo(-14,-12);ctx.lineTo(22,-5);ctx.lineTo(67,-9);ctx.lineTo(112,2);ctx.stroke();
 ctx.strokeStyle="rgba(23,39,33,.65)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-75,10);ctx.lineTo(-58,5);ctx.lineTo(-42,12);ctx.moveTo(36,8);ctx.lineTo(52,3);ctx.lineTo(70,12);ctx.stroke();ctx.restore();
}





// =====================================================
// REVISION 17 — THÁC SƠN TUYỀN, KIẾN TRÚC VÀ KHÁN ĐÀI
// =====================================================







/* === CẢNH QUẦN THỂ TIÊN MÔN & LỄ TRAO GIẢI ĐẠI ĐIỂN === */




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
 const sky=target.createLinearGradient(0,0,0,h);
 sky.addColorStop(0,"#101f3b");sky.addColorStop(.25,"#3d6177");sky.addColorStop(.53,"#82978d");sky.addColorStop(1,"#263c35");
 target.fillStyle=sky;target.fillRect(0,0,w,h);
 const sun=target.createRadialGradient(w*.5,h*.25,2,w*.5,h*.25,w*.46);
 sun.addColorStop(0,"rgba(255,241,196,.48)");sun.addColorStop(.45,"rgba(255,218,151,.18)");sun.addColorStop(1,"rgba(255,221,155,0)");
 target.fillStyle=sun;target.fillRect(0,0,w,h);
 for(let layer=0;layer<3;layer++){
  target.fillStyle=["#9aafaa","#668478","#385e50"][layer];target.beginPath();target.moveTo(0,h*(.46+layer*.075));
  for(let i=0;i<=10;i++){const x=w*i/10,y=h*(.34+layer*.075+Math.sin(i*1.43+layer*.8)*.065);target.lineTo(x,y);}
  target.lineTo(w,h);target.lineTo(0,h);target.closePath();target.fill();
 }
 // Đại điện Lăng Tiêu nhiều tầng, mái lưu ly, đấu củng và cột son.
 target.save();target.translate(w*.5,h*.485);target.scale(mini?.62:1.18,mini?.62:1.18);
 const stone=target.createLinearGradient(-190,0,190,0);stone.addColorStop(0,"#47372e");stone.addColorStop(.5,"#b18b55");stone.addColorStop(1,"#3b302b");
 target.fillStyle=stone;target.fillRect(-151,-74,302,174);
 target.fillStyle="#7c302e";target.fillRect(-137,-95,274,185);
 target.fillStyle="#253c3c";target.fillRect(-112,-82,224,151);
 target.fillStyle="#101f25";target.fillRect(-37,-52,74,121);
 target.strokeStyle="#e8ca83";target.lineWidth=4;target.strokeRect(-37,-52,74,121);
 for(const x of [-91,-66,66,91]){
  target.fillStyle="#172a2c";target.fillRect(x-9,-49,18,115);target.strokeStyle="#d9b875";target.lineWidth=2;target.strokeRect(x-9,-49,18,115);
  target.fillStyle="#e8cb83";target.fillRect(x-11,-15,22,4);
 }
 for(let k=0;k<4;k++){
  const yy=42-k*43,ww=238-k*37,hh=59-k*5;
  const roof=target.createLinearGradient(0,yy-hh,0,yy+12);roof.addColorStop(0,k===0?"#365e60":"#25474e");roof.addColorStop(.58,"#193b43");roof.addColorStop(1,"#102a32");
  target.fillStyle=roof;target.beginPath();target.moveTo(-ww*.72,yy+8);target.quadraticCurveTo(-ww*.48,yy-hh*.72,-ww*.14,yy-hh*.9);target.quadraticCurveTo(0,yy-hh*1.28,ww*.14,yy-hh*.9);target.quadraticCurveTo(ww*.48,yy-hh*.72,ww*.72,yy+8);target.lineTo(ww*.57,yy+17);target.quadraticCurveTo(0,yy-hh*.62,-ww*.57,yy+17);target.closePath();target.fill();target.strokeStyle="#f0d28e";target.lineWidth=4;target.stroke();
  target.strokeStyle="rgba(255,242,197,.72)";target.lineWidth=1.2;
  for(let j=-4;j<=4;j++){const xx=j*ww*.105;target.beginPath();target.moveTo(xx,yy-hh*.84);target.lineTo(xx*.83,yy+9);target.stroke();}
  for(const side of [-1,1]){target.strokeStyle="#f2d58f";target.lineWidth=3;target.beginPath();target.moveTo(side*ww*.68,yy+5);target.quadraticCurveTo(side*ww*.87,yy-2,side*ww*.91,yy-28);target.stroke();target.fillStyle="#f2d58f";target.beginPath();target.arc(side*ww*.91,yy-28,3,0,Math.PI*2);target.fill();}
 }
 const plaque=target.createLinearGradient(-112,-115,112,-78);plaque.addColorStop(0,"#552b2a");plaque.addColorStop(.5,"#a65d38");plaque.addColorStop(1,"#4a2828");
 target.fillStyle=plaque;target.beginPath();target.roundRect(-111,-119,222,38,7);target.fill();target.strokeStyle="#f6dc9a";target.lineWidth=4;target.stroke();target.strokeStyle="rgba(255,246,207,.75)";target.lineWidth=1.2;target.strokeRect(-101,-111,202,22);
 target.fillStyle="#fff0b9";target.textAlign="center";target.textBaseline="middle";target.font="900 21px Georgia,serif";target.shadowColor="#ffe29a";target.shadowBlur=13;target.fillText("LĂNG TIÊU TIÊN ĐIỆN",0,-100,184);target.shadowBlur=0;
 for(let i=0;i<4;i++){const yy=76+i*13,half=128+i*18;target.fillStyle=i%2?"#746044":"#a88b5c";target.beginPath();target.moveTo(-half,yy);target.lineTo(half,yy);target.lineTo(half+13,yy+9);target.lineTo(-half-13,yy+9);target.closePath();target.fill();target.strokeStyle="#ead29a";target.lineWidth=1.6;target.stroke();}
 for(const side of [-1,1]){const x=side*171;target.fillStyle="#5a382b";target.fillRect(x-8,-16,16,105);target.strokeStyle="#e8c77d";target.lineWidth=2.5;target.strokeRect(x-8,-16,16,105);target.fillStyle="#e6c477";target.beginPath();target.moveTo(x-18,-17);target.lineTo(x,-37);target.lineTo(x+18,-17);target.closePath();target.fill();target.fillStyle="#fff0b8";target.shadowColor="#ffe5a0";target.shadowBlur=12;target.beginPath();target.arc(x,-42,5,0,Math.PI*2);target.fill();target.shadowBlur=0;}
 target.restore();
 // Sân đá đại lễ rộng, lát đá hướng tâm về chính điện.
 const floor=target.createLinearGradient(0,h*.65,0,h);floor.addColorStop(0,"#c9b88d");floor.addColorStop(.3,"#a99770");floor.addColorStop(1,"#4c5947");
 target.fillStyle=floor;target.beginPath();target.moveTo(w*.13,h*.66);target.lineTo(w*.87,h*.66);target.lineTo(w,h);target.lineTo(0,h);target.closePath();target.fill();
 for(let i=0;i<7;i++){const y=h*(.69+i*.045),spread=i*9;target.strokeStyle=i%2?"rgba(66,54,39,.38)":"rgba(255,238,187,.62)";target.lineWidth=mini?1:2;target.beginPath();target.moveTo(w*.12-spread,y);target.lineTo(w*.88+spread,y);target.stroke();}
 target.fillStyle="rgba(255,226,164,.12)";target.beginPath();target.moveTo(w*.46,h*.66);target.lineTo(w*.54,h*.66);target.lineTo(w*.64,h);target.lineTo(w*.36,h);target.closePath();target.fill();
 target.strokeStyle="rgba(255,231,174,.58)";target.lineWidth=mini?1:2;target.beginPath();target.moveTo(w*.46,h*.67);target.lineTo(w*.36,h);target.moveTo(w*.54,h*.67);target.lineTo(w*.64,h);target.stroke();
 // Cột cờ hai bên quảng trường, thay cho các vòng nước xanh gây rối mắt.
 for(const side of [-1,1]){const x=side>0?w*.91:w*.09;target.strokeStyle="#d9bd7c";target.lineWidth=mini?2:4;target.beginPath();target.moveTo(x,h*.39);target.lineTo(x,h*.76);target.stroke();target.fillStyle=side>0?"#a84942":"#9b713e";target.beginPath();target.moveTo(x,h*.41);target.lineTo(x-side*w*.065,h*.46);target.lineTo(x,h*.53);target.closePath();target.fill();target.fillStyle="#f4d98d";target.beginPath();target.arc(x,h*.38,mini?2:5,0,Math.PI*2);target.fill();}
 for(let i=0;i<34;i++){const x=w*((i*.618033)%1),y=h*(.28+((i*.371)%1)*.62);target.globalAlpha=.12+.25*Math.sin(time*.002+i)**2;target.fillStyle=i%2?"#fff0bd":"#b9f2dd";target.beginPath();target.arc(x,y,mini?1:2,0,Math.PI*2);target.fill();}
 target.globalAlpha=1;
}





/* Thần Sầu nhận thưởng: tay áo nối liền cánh tay, bàn tay ôm hộp quà trước ngực. */
function drawThanSauGiftReach(target,x,riderY,scale,raise,mini){
  // Thần Sầu dùng nguyên hai tay pixel có sẵn trong frame gốc.
  // Không vẽ tay áo, cánh tay hoặc bàn tay Canvas giả lên sprite.
}

function drawThanSauGiftReception(target,x,riderY,rank,scale,bounce,mini){
  // Giữ hộp thưởng; cánh tay/bàn tay phải lấy trực tiếp từ frame pixel gốc.
  drawCeremonyRankGift(target,x,riderY-bounce+2,rank,mini?.58:.72);
  // Hiệu ứng sao vui mừng, không can thiệp vào hình dáng nhân vật.
  target.save();target.globalAlpha=.72+.28*Math.sin(performance.now()*.012+rank);
  target.strokeStyle=rank===1?"#fff0a2":"#dffaff";target.lineWidth=mini?1:2;
  const sy=riderY-bounce-48*scale;
  for(let n=0;n<3;n++){
    const sx=x+(n-1)*(mini?13:25),yy=sy+Math.sin(performance.now()*.008+n)*3;
    target.beginPath();target.moveTo(sx,yy-(mini?3:6));target.lineTo(sx,yy+(mini?3:6));
    target.moveTo(sx-(mini?3:6),yy);target.lineTo(sx+(mini?3:6),yy);target.stroke();
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






// Trao riêng từng giải trong 4,5 giây; sau đủ ba lượt mới dựng bục vinh danh.


// Tiên hạc luôn giữ thân thẳng đứng; chỉ lật ngang khi đổi hướng,
// tuyệt đối không xoay vòng hoặc lộn ngược đầu.



// =====================================================

function awardSmoothstep(t){t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);}

// REVISION 4 — TIÊN HẠC, THÁC NƯỚC, RỪNG TIÊN,
// CỔNG ĐÍCH THIÊN KHẢI VÀ CHƯỞNG MÔN NGỰ KIẾM TRAO GIẢI
// =====================================================



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











// Camera nền cũng không dùng chữ hay biển hiệu TIÊN MÔN.
function drawCameraBackground(time=0){
 const w=cameraCanvas.width,h=cameraCanvas.height,c=cameraCtx,t=time||sceneTime||performance.now();
 c.clearRect(0,0,w,h);
 // Tiểu cảnh quan sát đồng bộ với đại cảnh tiên môn: trời xanh, tiên sơn,
 // lầu các trên sườn núi, thác nước, linh hà và rừng tùng hai bờ.
 const sky=c.createLinearGradient(0,0,0,h);
 sky.addColorStop(0,"#456f8d");sky.addColorStop(.38,"#9fc8c4");sky.addColorStop(.72,"#d8dfc1");sky.addColorStop(1,"#e6d8b2");
 c.fillStyle=sky;c.fillRect(0,0,w,h);
 const sun=c.createRadialGradient(w*.78,h*.12,2,w*.78,h*.12,86);
 sun.addColorStop(0,"rgba(255,246,205,.82)");sun.addColorStop(.38,"rgba(255,230,174,.24)");sun.addColorStop(1,"rgba(255,230,174,0)");
 c.fillStyle=sun;c.fillRect(w*.55,0,w*.45,h*.58);
 // Mây tiên trôi chậm.
 for(let i=0;i<5;i++){
  const x=((i*109+t*.006)%(w+100))-50,y=31+(i%3)*15;
  c.globalAlpha=.24;c.fillStyle="#f7f4df";c.beginPath();
  c.ellipse(x,y,36,6,0,0,Math.PI*2);c.ellipse(x+15,y-4,21,8,0,0,Math.PI*2);c.ellipse(x-16,y-3,20,7,0,0,Math.PI*2);c.fill();
 }
 c.globalAlpha=1;
 const ridge=(pts,top,mid,base)=>{
  const g=c.createLinearGradient(0,18,0,160);g.addColorStop(0,top);g.addColorStop(.58,mid);g.addColorStop(1,base);
  c.fillStyle=g;c.beginPath();c.moveTo(0,160);pts.forEach(([x,y])=>c.lineTo(x,y));c.lineTo(w,160);c.closePath();c.fill();
 };
 ridge([[0,112],[31,59],[56,84],[98,27],[131,75],[169,19],[204,72],[246,33],[282,77],[326,37],[365,78],[420,39]],"#d5e2d0","#8eae9e","#6f947f");
 ridge([[0,132],[36,91],[72,111],[112,65],[149,103],[190,59],[231,108],[271,69],[314,109],[357,74],[420,116]],"#8fb39c","#527e6b","#355e52");
 ridge([[0,151],[43,119],[86,138],[128,99],[172,139],[216,103],[261,142],[308,108],[354,142],[420,117]],"#5b876d","#315f4d","#244b40");
 // Tiên các mái cong dát vàng nép giữa các tầng núi.
 const pavilion=(x,y,z,col)=>{
  c.save();c.translate(x,y);c.scale(z,z);
  c.fillStyle="#382d2b";c.fillRect(-18,-20,36,23);
  c.fillStyle=col;c.fillRect(-15,-17,30,17);
  for(let k=0;k<2;k++){
   const ww=27-k*7,yy=-20-k*15;
   c.fillStyle=k?"#9c7447":"#684a38";c.beginPath();
   c.moveTo(-ww,yy+5);c.quadraticCurveTo(0,yy-14,ww,yy+5);
   c.lineTo(ww-4,yy+8);c.quadraticCurveTo(0,yy-7,-ww+4,yy+8);c.closePath();c.fill();
   c.strokeStyle="#e7ca86";c.lineWidth=1.2;c.stroke();
  }
  c.restore();
 };
 pavilion(63,130,.68,"#496e63");pavilion(350,128,.72,"#536f7b");
 pavilion(139,116,.48,"#806548");pavilion(277,119,.5,"#617d5c");
 // Thác từ vách núi hai bên, nước chảy thành dải mềm.
 for(const [x,top,bottom,ww] of [[22,105,184,10],[390,96,185,12]]){
  c.fillStyle="rgba(28,65,59,.42)";c.fillRect(x-4,top,ww+8,bottom-top);
  const g=c.createLinearGradient(x,top,x+ww,top);g.addColorStop(0,"rgba(180,239,225,.32)");g.addColorStop(.5,"rgba(235,255,242,.88)");g.addColorStop(1,"rgba(76,172,169,.42)");
  c.fillStyle=g;c.fillRect(x,top,ww,bottom-top);
  c.save();c.beginPath();c.rect(x,top,ww,bottom-top);c.clip();
  for(let k=0;k<5;k++){const yy=top+((k*23+t*.035)%(bottom-top));c.strokeStyle="rgba(239,255,245,.68)";c.lineWidth=k%2?1:1.5;c.beginPath();c.moveTo(x+2+k%3*2,yy);c.lineTo(x+3+k%3*2,yy+12);c.stroke();}
  c.restore();
 }
 // Linh hà uốn qua chân núi, gợn sóng chậm.
 c.fillStyle="#355e4c";c.beginPath();c.moveTo(0,164);c.quadraticCurveTo(90,146,180,164);c.quadraticCurveTo(284,183,420,157);c.lineTo(420,h);c.lineTo(0,h);c.closePath();c.fill();
 const river=c.createLinearGradient(0,160,0,h);river.addColorStop(0,"#a8e1d1");river.addColorStop(.3,"#4ca6a0");river.addColorStop(1,"#1b6374");
 c.fillStyle=river;c.beginPath();c.moveTo(0,168);c.quadraticCurveTo(92,150,180,168);c.quadraticCurveTo(285,187,420,161);c.lineTo(420,h);c.lineTo(0,h);c.closePath();c.fill();
 c.save();c.beginPath();c.rect(0,158,w,h-158);c.clip();
 for(let i=0;i<12;i++){const x=((i*47+t*.012)%(w+45))-22,y=174+(i%4)*9;c.strokeStyle=i%2?"rgba(226,255,242,.62)":"rgba(133,231,220,.7)";c.lineWidth=i%3===0?1.8:1;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+10,y-2,x+25,y);c.stroke();}
 c.restore();
 // Tùng xanh đậm và linh vụ ở tiền cảnh.
 for(let i=0;i<16;i++){
  const x=i*29-3,y=166+(i%3)*5,z=.38+(i%4)*.07;
  c.fillStyle=i%2?"#244d3e":"#315d46";c.beginPath();c.moveTo(x,y-39*z);c.lineTo(x-12*z,y-8*z);c.lineTo(x+12*z,y-8*z);c.closePath();c.fill();
  c.fillStyle="#73543a";c.fillRect(x-1,y-9*z,2,10*z);
 }
 const mist=c.createLinearGradient(0,143,0,h);mist.addColorStop(0,"rgba(224,250,232,0)");mist.addColorStop(1,"rgba(226,249,232,.22)");c.fillStyle=mist;c.fillRect(0,143,w,h-143);
}


// =====================================================
// REVISION 5 — SỬA ĐỘ MỜ, KHÔI PHỤC DÒNG SÔNG,
// RỪNG KHÔNG LẤN SÔNG, CHIM BAY NGOÀI HÀNH LANG ĐUA
// =====================================================

// Bảo vệ trạng thái canvas: hiệu ứng linh khí không được làm mờ
// nhân vật, tên, kiếm, HUD, đồng hồ hay cổng đích ở các lớp kế tiếp.

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

// Bọc toàn bộ cảnh quan trong trạng thái canvas riêng; alpha luôn trả về 1.


// =====================================================
// REVISION 6 — thác nước tự nhiên, nghi lễ trao tận tay,
// bát quái linh khí, chim bay vòng liên tục, kiến trúc.
// =====================================================











// Gender-aware racer rendering override (final definition).



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
 // Nhóm tôn vị giữ phong thái nghiêm trang, tuyệt đối không tham gia cổ vũ.
 const dignitary=["core","disciple","elder","master"].includes(roleName);
 const crowdApplause=!dignitary&&!!(finished&&racers.length&&finishQueue.length>=racers.length);
 const crowdCheer=!dignitary&&!crowdApplause&&finishQueue.length>0;
 const beat=time*.012+phase*.7;
 const jump=crowdCheer?Math.max(0,Math.sin(beat))*10:crowdApplause?Math.abs(Math.sin(beat*.72))*1.5:0;
 ctx.save();ctx.translate(x,y+Math.sin(time*.006+phase)*.8-jump);ctx.scale(scale*role.scale,scale);
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
 // Mỗi cấp bậc có kiểu cổ vũ riêng; khi có người về nhất cả khán đài đồng loạt bật dậy.
 ctx.strokeStyle=skin;ctx.lineWidth=4.5;ctx.lineCap="round";
 let leftHand=[-18,12],rightHand=[18,12],leftElbow=[-16,0],rightElbow=[16,0];
 if(crowdApplause){
   // Người cuối cùng cán đích: tất cả vỗ tay nhịp nhàng trước ngực.
   const clap=Math.abs(Math.sin(beat*1.15));
   leftHand=[-3-clap*3,-3];rightHand=[3+clap*3,-3];
   leftElbow=[-15,-1];rightElbow=[15,-1];
 }else if(crowdCheer){
   // Người đầu tiên về đích: cùng reo hò, giơ cao hai tay và nhảy lên.
   leftHand=[-22+Math.sin(beat)*3,-31];rightHand=[22-Math.sin(beat)*3,-31];
   leftElbow=[-18,-17];rightElbow=[18,-17];
 }else if(roleName==="servant"){
   // Tạp dịch: vẫy cả hai tay liên tục, phấn khởi và nhiệt tình.
   leftHand=[-21,-17+Math.sin(beat)*9];rightHand=[21,-17-Math.sin(beat)*9];
   leftElbow=[-17,-5];rightElbow=[17,-5];
 }else if(roleName==="outer"){
   // Ngoại môn: một tay vẫy cao, tay kia giơ ngang hô vang.
   leftHand=[-22,-25+Math.sin(beat)*8];rightHand=[22,-7-Math.sin(beat+1)*5];
   leftElbow=[-17,-8];rightElbow=[17,-2];
 }else if(roleName==="inner"){
   // Nội môn: chắp tay kiếm quyết rồi nâng tay hô cổ vũ.
   leftHand=[-8,-24+Math.sin(beat)*4];rightHand=[19,-18-Math.sin(beat)*5];
   leftElbow=[-15,-9];rightElbow=[15,-8];
 }else if(dignitary){
   // Tôn vị giữ tay trước thân; khi khai trận chỉ nâng nhẹ tay áo bằng chính cánh tay đang vẽ.
   leftHand=[-5,5];rightHand=[5,5];
   leftElbow=[-14,-1];rightElbow=[14,-1];
   const ritualPose=typeof getPlazaRitualPose==="function"?getPlazaRitualPose(time):0;
   if(ritualPose>.01){
     const lift=(roleName==="master"?15:roleName==="elder"?12:10)*ritualPose;
     leftHand=[-8,5-lift];rightHand=[8,5-lift];
     leftElbow=[-15,-1-lift*.52];rightElbow=[15,-1-lift*.52];
   }
 }else{
   leftHand=[-18,-13+Math.sin(beat)*5];rightHand=[18,-13-Math.sin(beat)*5];
   leftElbow=[-15,-3];rightElbow=[15,-3];
 }
 ctx.beginPath();ctx.moveTo(-9,-5);ctx.lineTo(leftElbow[0],leftElbow[1]);ctx.lineTo(leftHand[0],leftHand[1]);
 ctx.moveTo(9,-5);ctx.lineTo(rightElbow[0],rightElbow[1]);ctx.lineTo(rightHand[0],rightHand[1]);ctx.stroke();
 // Bàn tay và tay áo vung theo nhịp, tránh dáng đứng bất động.
 ctx.fillStyle=role.robe;ctx.beginPath();ctx.arc(leftHand[0],leftHand[1],3.2,0,Math.PI*2);ctx.arc(rightHand[0],rightHand[1],3.2,0,Math.PI*2);ctx.fill();
 if(roleName==="inner"&&!crowdApplause){
   // Kiếm quyết phát sáng nhỏ trên tay nội môn.
   ctx.strokeStyle="#e6d18e";ctx.lineWidth=1.7;ctx.beginPath();ctx.moveTo(rightHand[0]+2,rightHand[1]-2);ctx.lineTo(rightHand[0]+5,rightHand[1]-15);ctx.stroke();
   ctx.beginPath();ctx.moveTo(rightHand[0]+1,rightHand[1]-7);ctx.lineTo(rightHand[0]+7,rightHand[1]-6);ctx.stroke();
 }
 if(crowdCheer){
   ctx.strokeStyle="rgba(255,231,158,.85)";ctx.lineWidth=1.4;
   for(let k=0;k<3;k++){const side=k-1;ctx.beginPath();ctx.moveTo(side*9,-43-Math.sin(beat+k)*2);ctx.lineTo(side*9-3,-49-Math.sin(beat+k)*2);ctx.stroke();}
 }
 if(crowdApplause){
   // Nét nhịp nhỏ ở hai bên thể hiện tiếng vỗ tay tập thể.
   ctx.strokeStyle="rgba(255,226,153,.8)";ctx.lineWidth=1.2;
   ctx.beginPath();ctx.moveTo(-23,-5);ctx.lineTo(-27,-9);ctx.moveTo(23,-5);ctx.lineTo(27,-9);ctx.stroke();
 }
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
 ctx.strokeStyle="#8b5144";ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(0,-17);ctx.lineTo(-.5,-15);
 const masterChant=roleName==="master"&&typeof getPlazaRitualPose==="function"?getPlazaRitualPose(time):0;
 if(masterChant>.05){
   const syllable=.8+.2*Math.sin(time*.018);
   ctx.ellipse(0,-12,1.8,1.2+syllable*1.5,0,0,Math.PI*2);
 }else{ctx.quadraticCurveTo(0,-12,2,-13);}
 ctx.stroke();
 if(roleName==="elder"||roleName==="master"){if(!female){ctx.fillStyle="#ded8ca";ctx.beginPath();ctx.moveTo(-3,-10);ctx.lineTo(3,-10);ctx.lineTo(2,3);ctx.lineTo(0,6);ctx.lineTo(-2,3);ctx.closePath();ctx.fill();}}
 if(roleName==="master"){ctx.fillStyle="#e8c36e";ctx.beginPath();ctx.moveTo(-9,-26);ctx.lineTo(-6,-39);ctx.lineTo(0,-32);ctx.lineTo(6,-39);ctx.lineTo(9,-26);ctx.closePath();ctx.fill();}
 if(roleName==="elder"){ctx.strokeStyle="#dfc17e";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(20,-18);ctx.lineTo(20,23);ctx.stroke();}
 ctx.restore();
}




// Kiếm có màu nhận diện theo giới tính; kiểu dáng thay đổi theo pháp bảo.


// Chọn lọc lớp hiệu ứng trên đường đua theo từng loại, không thay đổi trạng thái thi đấu.
let __raceEffectDisplayFrame=-1;
let __raceEffectDisplayByType=new Map();
function shouldDrawRaceEffect(target,racer,time){
  if(!(racer&&racer.effectTimer>0&&racer.effectType))return false;
  // Thiên Lý Kính luôn vẽ đầy đủ hiệu ứng cho nhân vật đang được chiếu.
  if(target===cameraCtx)return true;
  if(__raceEffectDisplayFrame!==time){
    __raceEffectDisplayFrame=time;
    __raceEffectDisplayByType=new Map();
  }
  const type=String(racer.effectType);
  if(!__raceEffectDisplayByType.has(type)){
    const group=racers.filter(item=>!item.finished&&item.effectTimer>0&&String(item.effectType)===type);
    // Tối đa 8: hiện đầy đủ; 9–20: chọn 6; trên 20: chọn 4 nhân vật đại diện.
    const limit=group.length<=8?group.length:group.length<=20?6:4;
    const stableHash=value=>{
      let hash=2166136261;
      for(const char of String(value||"")){hash^=char.charCodeAt(0);hash=Math.imul(hash,16777619);}
      return hash>>>0;
    };
    const selected=new Set(group.slice().sort((a,b)=>stableHash(a.id)-stableHash(b.id)).slice(0,limit).map(item=>String(item.id)));
    __raceEffectDisplayByType.set(type,selected);
  }
  return __raceEffectDisplayByType.get(type).has(String(racer.id));
}

// Nhân vật triệu hồi: gương mặt, sắc da, tóc và trang phục có biến thể.
function __drawRacerBaseThanSau(target,racer,x,y,scale,time){
  const female=racer.gender==="female";
  const skins=VKP_DATA.characters.appearance.skinTones;
  const hairs=VKP_DATA.characters.appearance.hairColors;
  const seed=(racer.appearanceSeed??0)%5,skin=skins[seed],hair=hairs[(seed+(female?1:0))%hairs.length];
  const showRaceEffect=shouldDrawRaceEffect(target,racer,time);
  const activeEffect=showRaceEffect?racer.effectType:"";
   const phase=time*.001,duration=Math.max(.001,racer.effectDuration||racer.effectTimer||1),progress=clamp(1-racer.effectTimer/duration,0,1);
  const wave=Math.sin(phase*7+racer.phase),pulse=Math.sin(phase*10+racer.phase);let actionX=0,actionY=0,actionAngle=0;
  switch(activeEffect){
   case "poison":actionX=wave*1.8;actionAngle=wave*.075;break;case "weak":actionY=2+Math.abs(wave)*1.8;actionAngle=.12+wave*.025;break;
   case "pill":actionY=-3-Math.abs(wave)*3;actionAngle=-.045;break;case "qi_pill":actionY=-2-Math.abs(Math.sin(phase*12))*4;actionX=2+Math.sin(phase*5)*2;actionAngle=-.08;break;case "impact":actionY=Math.abs(pulse)*9;actionX=Math.sin(phase*18)*2;actionAngle=wave*.14;break;
   case "lightning":actionX=Math.sin(phase*38)*3.5;actionY=Math.cos(phase*31)*2;actionAngle=Math.sin(phase*34)*.09;break;
   case "gale":actionX=wave*3;actionY=Math.sin(phase*5)*2;actionAngle=wave*.27;break;case "dizzy":actionAngle=Math.sin(phase*8+racer.phase)*.72;break;
   case "faint":actionY=4+Math.abs(wave)*2;actionAngle=.34+Math.sin(phase*5)*.07;break;case "boost":if(racer.isLegendaryThanSau&&racer.thanSauEatingTimer>0){const eat=clamp(1-racer.thanSauEatingTimer/.9,0,1);actionX=-1+Math.sin(eat*Math.PI)*2;actionY=-Math.sin(eat*Math.PI)*5;actionAngle=-.025+Math.sin(eat*Math.PI)*.035;}else{actionX=3+Math.sin(phase*7)*3;actionY=-3-Math.sin(phase*6)*3;actionAngle=.08+Math.sin(phase*7)*.12;}break;
   case "sword_intent":actionX=1+Math.sin(phase*5)*.8;actionY=-1;actionAngle=-.035+Math.sin(phase*4)*.018;break;case "cloud_step":actionY=-Math.abs(Math.sin(phase*8))*10;actionAngle=.11;break;
   case "formation":actionX=Math.sin(phase*4)*3;actionY=Math.cos(phase*4)*3;actionAngle=Math.sin(phase*4)*.08;break;
   case "formation_sword":actionX=3+Math.sin(phase*8)*2;actionAngle=-.18;break;
   case "formation_seal":actionX=Math.sin(phase*5)*2;actionY=-2-Math.abs(Math.sin(phase*6))*2;actionAngle=.06*Math.sin(phase*4);break;
   case "talisman":actionX=5+Math.sin(phase*9)*2;actionY=-2-Math.abs(Math.sin(phase*7))*3;actionAngle=-.12;break;
   case "talisman_guard":actionX=Math.sin(phase*4)*1.5;actionAngle=-.08;break;
   case "talisman_thunder":actionX=5+Math.sin(phase*14)*2;actionY=-3;actionAngle=-.22;break;
   case "sword_spin":actionAngle=-.06+Math.sin(phase*5)*.045;actionX=2+Math.sin(phase*7)*2;actionY=-3-Math.abs(Math.sin(phase*6))*3;break;
   case "wind_step":actionX=Math.sin(phase*11+racer.phase)*7;actionY=-3-Math.abs(Math.sin(phase*8))*4;actionAngle=Math.sin(phase*11+racer.phase)*.22;break;
   case "shadow_step":actionX=progress<.22?-9:progress<.48?17:Math.sin(phase*18)*2;actionY=-Math.sin(progress*Math.PI)*7;actionAngle=progress<.48?-.24:.08;break;
   case "sword_dash":actionX=13+Math.sin(phase*16)*2;actionY=-4-Math.abs(Math.sin(phase*12))*2;actionAngle=-.48;break;
   case "body_burst":actionY=progress<.22?4: -Math.abs(Math.sin(phase*9))*11;actionX=progress<.22?-3:5+Math.sin(phase*7)*2;actionAngle=progress<.22?.18:-.08;break;case "cloud_stride":actionX=2+Math.sin(phase*4)*4;actionY=-4-Math.sin(phase*3)*3;actionAngle=-.04+Math.sin(phase*3)*.06;break;
  }
  const idleBob=Math.sin(time*.009+racer.phase)*2,impactJolt=activeEffect==="impact"||activeEffect==="lightning"?Math.sin(time*.075)*1.2:0;
  target.save();target.translate(x+actionX+impactJolt,y+idleBob+actionY);target.rotate(actionAngle);target.scale(scale,scale);
  // Phi kiếm nằm ngang: mũi kiếm hướng về trước (phải), chuôi ở sau; người cưỡi nằm ngang dọc thân kiếm.
  // Giữ nhân vật đứng thẳng, không xoay hệ tọa độ.
  const glow=target.createRadialGradient(0,0,3,0,0,48);glow.addColorStop(0,"rgba(255,225,139,.38)");glow.addColorStop(1,"rgba(255,225,139,0)");target.fillStyle=glow;target.fillRect(-51,-48,102,96);
  // Không vẽ vòng tròn bao quanh thân; giữ lại hiệu ứng đặc trưng của từng loại ở phía dưới.
  drawRacingArtifact(target,artifactKind(racer),time*.004+racer.phase,female?"female":"male");
  // Đã bỏ vòng nét đứt quanh thân; hiệu ứng cá nhân vẫn giữ nguyên logic và hiệu ứng đặc trưng.
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
  if(showRaceEffect&&racer.effectTimer>0&&racer.effectName&&target!==cameraCtx){target.save();target.font="bold 7px Arial,sans-serif";target.textAlign="center";target.textBaseline="middle";target.lineWidth=2;target.strokeStyle="rgba(14,25,24,.98)";target.strokeText(racer.effectName,0,-65,126);target.fillStyle="#fff1bd";target.fillText(racer.effectName,0,-65,126);target.restore();}
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
  if(showRaceEffect&&racer.effectTimer>0){
    if(racers.length>35&&target!==cameraCtx){
      // Trường đua giảm tải hiệu ứng trang trí; Thiên Lý Kính vẫn vẽ đầy đủ hiệu ứng của nhân vật đang chiếu.
      target.save();target.globalAlpha=.48;
      target.fillStyle=racer.effectPolarity==="negative"?"#b7baff":"#b8eaff";
      target.fillRect(-22,-40,44,2);target.fillRect(-22,26,44,2);
      target.restore();
    }else{
    const t=time*.001,fade=Math.min(1,racer.effectTimer/.35);
    target.save();target.lineCap="round";target.lineJoin="round";
    if(activeEffect==="poison"){
      target.globalAlpha=.72*fade;target.strokeStyle="#a2e66d";target.fillStyle="#8acb62";target.lineWidth=1.7;
      for(let i=0;i<4;i++){const px=-18+i*12,py=-37-Math.abs(Math.sin(t*2+i))*7;target.beginPath();target.arc(px,py,2.2+(i%2),0,Math.PI*2);target.fill();target.beginPath();target.moveTo(px,py+5);target.quadraticCurveTo(px-5,py-2,px+1,py-9);target.stroke();}
      target.globalAlpha=.34;target.fillStyle="#77b85c";target.beginPath();target.ellipse(0,-19,10,12,0,0,Math.PI*2);target.fill();
    }else if(activeEffect==="weak"){
      // Suy lực: linh khí rò rỉ thành dải bụi xám rơi xuống.
      target.globalAlpha=.82*fade;target.strokeStyle="#b9c5c9";target.lineWidth=2;
      for(let n=0;n<4;n++){const px=-20+n*13,fall=(t*22+n*11)%35;target.beginPath();target.moveTo(px,-31+fall);target.quadraticCurveTo(px+5,-23+fall,px+1,-17+fall);target.stroke();}
      target.fillStyle="#d6e0e2";for(let n=0;n<5;n++){const px=-24+n*12,py=8+(t*13+n*7)%22;target.fillRect(px,py,2,4);}
    }else if(activeEffect==="faint"){
      // Ngất: dấu sao tắt dần và chữ Z lơ lửng trên đầu.
      target.globalAlpha=.72*fade;target.strokeStyle="#cbd7df";target.lineWidth=1.5;
      for(let n=0;n<3;n++){const aa=t*1.4+n*Math.PI*2/3,px=Math.cos(aa)*18,py=-43+Math.sin(aa)*7;target.beginPath();target.moveTo(px-3,py);target.lineTo(px+3,py);target.moveTo(px,py-3);target.lineTo(px,py+3);target.stroke();}
      target.fillStyle="#e2e8ed";target.font="bold 8px Arial";target.textAlign="center";target.fillText("Z",14,-39+Math.sin(t*3)*2);target.fillText("Z",21,-47+Math.sin(t*3+1)*2);
    }else if(activeEffect==="impact"){
      // Va chạm: giật lùi ngắn, tia va đập và vệt bụi; tuyệt đối không có chữ Z hay tư thế ngủ.
      const hit=Math.abs(Math.sin(t*10));
      target.globalAlpha=.95*fade;target.strokeStyle="#ffbd83";target.lineWidth=2.4;target.lineCap="round";
      for(let i=0;i<7;i++){const aa=i*Math.PI*2/7+t*.35,inner=10+hit*3,outer=25+hit*5;
        target.beginPath();target.moveTo(Math.cos(aa)*inner,Math.sin(aa)*inner-7);target.lineTo(Math.cos(aa)*outer,Math.sin(aa)*outer-7);target.stroke();}
      target.fillStyle="#fff2c9";target.beginPath();target.arc(0,-7,4+hit*2,0,Math.PI*2);target.fill();
      target.globalAlpha=.65*fade;target.strokeStyle="#dcecf0";target.lineWidth=1.5;
      for(let i=0;i<3;i++){const yy=19+i*5,dx=Math.sin(t*8+i)*4;target.beginPath();target.moveTo(-26+dx,yy);target.quadraticCurveTo(-12,yy+3,0,yy);target.stroke();}
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
       // Kiếm Ý: ngưng thần kết kiếm quyết, kiếm khí lơ lửng trước ấn quyết, không lao đi.
       const pulse=.72+.28*Math.sin(t*3.8),orbit=t*1.35;
       target.globalAlpha=.95*fade;target.shadowColor="#55dfff";target.shadowBlur=15;
       target.strokeStyle="#b9f5ff";target.lineWidth=2.3;target.lineCap="round";
       target.beginPath();target.moveTo(12,-5);target.quadraticCurveTo(22,-17,30,-27);target.moveTo(13,-1);target.quadraticCurveTo(24,-8,34,-18);target.stroke();
       target.save();target.translate(39,-31+Math.sin(t*3)*3);target.rotate(-.62);
       target.globalAlpha=pulse*fade;target.fillStyle="#efffff";target.strokeStyle="#70dcff";target.lineWidth=1.5;
       target.beginPath();target.moveTo(0,-27);target.lineTo(4,-8);target.lineTo(3,13);target.lineTo(-3,13);target.lineTo(-4,-8);target.closePath();target.fill();target.stroke();
       target.strokeStyle="#d7c18b";target.lineWidth=3;target.beginPath();target.moveTo(-8,11);target.lineTo(8,11);target.moveTo(0,13);target.lineTo(0,23);target.stroke();target.restore();
       target.globalAlpha=.7*fade;target.strokeStyle="#8ceaff";target.lineWidth=1.4;target.shadowBlur=8;
       for(let n=0;n<3;n++){const a=orbit+n*Math.PI*2/3;target.save();target.translate(35,-28);target.rotate(a*.18);target.beginPath();target.arc(0,0,17+n*5,-1.05,.72);target.stroke();target.restore();}
       target.shadowBlur=0;
     }
if(activeEffect==="cloud_step"){
      // Đạp Vân Bộ: mây tụ dưới chân kiếm, nhân vật bật lên theo từng nhịp.
      target.globalAlpha=.8*fade;target.fillStyle="#e8fbff";target.strokeStyle="#a5e8f0";target.lineWidth=1.5;
      const bounce=Math.abs(Math.sin(t*8));
      for(let n=0;n<3;n++){const xx=-12+n*12,yy=25+bounce*5+(n%2)*3;target.beginPath();target.ellipse(xx,yy,10,4,0,0,Math.PI*2);target.fill();target.stroke();}
      target.strokeStyle="rgba(204,249,255,.8)";target.beginPath();target.moveTo(-18,31);target.quadraticCurveTo(0,39,20,30);target.stroke();
    }
    if(activeEffect==="boost"){
       // Du Long Bộ: thanh long hiện rõ đầu, hàm, bờm, sừng, vảy, bụng giáp, bốn chân và đuôi.
       const phase=t*2.5,sway=Math.sin(phase),dragonY=-18+sway*3;
       target.save();target.globalAlpha=.94*fade;target.lineJoin="round";target.lineCap="round";
       const scaleDragon=1;
       // Thân uốn lượn dài, có sống lưng và bụng sáng phân đốt.
       const body=target.createLinearGradient(-72,dragonY-14,48,dragonY+16);
       body.addColorStop(0,"#155b78");body.addColorStop(.3,"#168f9c");body.addColorStop(.7,"#54d9c5");body.addColorStop(1,"#c4fff0");
       target.shadowColor="#39d9e8";target.shadowBlur=14;target.fillStyle=body;target.strokeStyle="#b8fff1";target.lineWidth=1.6;
       target.beginPath();target.moveTo(-77,dragonY+12);
       target.bezierCurveTo(-60,dragonY-2,-55,dragonY-24,-37,dragonY-15);
       target.bezierCurveTo(-20,dragonY-6,-20,dragonY+17,-2,dragonY+9);
       target.bezierCurveTo(16,dragonY+1,12,dragonY-22,31,dragonY-17);
       target.bezierCurveTo(43,dragonY-14,48,dragonY-7,53,dragonY-5);
       target.lineTo(47,dragonY+10);
       target.bezierCurveTo(25,dragonY+17,18,dragonY+30,0,dragonY+23);
       target.bezierCurveTo(-21,dragonY+18,-23,dragonY-1,-39,dragonY-3);
       target.bezierCurveTo(-55,dragonY-5,-59,dragonY+16,-77,dragonY+12);target.closePath();target.fill();target.stroke();
       target.shadowBlur=0;
       // Bụng rồng màu ngà chia thành từng phiến giáp cong.
       target.strokeStyle="#d9fff0";target.lineWidth=2.4;
       for(let i=0;i<8;i++){const x=-61+i*14,y=dragonY+7+Math.sin(i*.95+phase)*9;
         target.beginPath();target.moveTo(x-3,y-1);target.quadraticCurveTo(x,y+5,x+5,y+7);target.stroke();}
       // Vảy lưng hình giọt ngọc, chạy dọc theo đường cong thân.
       target.fillStyle="#a8fff0";target.strokeStyle="#e2fff6";target.lineWidth=.8;
       for(let i=0;i<13;i++){const x=-67+i*9.2,y=dragonY-7+Math.sin(i*.72+phase)*9;
         target.beginPath();target.moveTo(x-3,y);target.quadraticCurveTo(x,y-5,x+3,y);target.lineTo(x,y+3);target.closePath();target.fill();target.stroke();}
       // Bờm gáy thành từng tua cong sau đầu.
       target.strokeStyle="#9bfff0";target.lineWidth=2.2;
       for(let i=0;i<5;i++){const x=24-i*4,y=dragonY-13+i*4;
         target.beginPath();target.moveTo(x,y);target.quadraticCurveTo(x-11,y-7,x-15,y-15);target.stroke();}
       // Bốn chân có khớp và móng vuốt.
       target.strokeStyle="#bafff0";target.lineWidth=3;
       for(const lx of [-43,-8,24]){
         const ly=dragonY+8+Math.sin(phase+lx*.08)*3;
         target.beginPath();target.moveTo(lx,ly);target.lineTo(lx-3,ly+9);target.lineTo(lx+2,ly+13);
         target.moveTo(lx+2,ly+13);target.lineTo(lx+6,ly+10);target.moveTo(lx+2,ly+13);target.lineTo(lx+3,ly+17);target.stroke();
       }
       // Đầu rồng lớn, dáng đầu thú phương Đông nhìn nghiêng sang phải.
       const hx=52,hy=dragonY-13+Math.sin(phase+1)*2;
       const head=target.createLinearGradient(hx-13,hy-15,hx+17,hy+12);
       head.addColorStop(0,"#16778a");head.addColorStop(.55,"#63e2cd");head.addColorStop(1,"#d8fff0");
       target.fillStyle=head;target.strokeStyle="#e0fff5";target.lineWidth=1.7;
       target.beginPath();target.moveTo(hx-15,hy-7);target.quadraticCurveTo(hx-10,hy-20,hx+2,hy-17);
       target.quadraticCurveTo(hx+14,hy-17,hx+17,hy-7);target.quadraticCurveTo(hx+27,hy-3,hx+22,hy+4);
       target.quadraticCurveTo(hx+15,hy+11,hx+1,hy+8);target.lineTo(hx-10,hy+5);
       target.quadraticCurveTo(hx-20,hy+2,hx-15,hy-7);target.closePath();target.fill();target.stroke();
       // Mõm vuông, hàm dưới và miệng tách rõ.
       target.fillStyle="#aaffed";target.beginPath();target.moveTo(hx+5,hy-5);target.lineTo(hx+25,hy-2);
       target.quadraticCurveTo(hx+31,hy+2,hx+22,hy+7);target.lineTo(hx+5,hy+5);target.closePath();target.fill();target.stroke();
       target.fillStyle="#15576a";target.beginPath();target.moveTo(hx+4,hy+5);target.quadraticCurveTo(hx+17,hy+13,hx+25,hy+6);target.lineTo(hx+17,hy+12);target.closePath();target.fill();
       // Mũi, lỗ mũi, răng nanh và ria rồng.
       target.fillStyle="#164f5e";target.beginPath();target.arc(hx+23,hy+1,1.5,0,Math.PI*2);target.arc(hx+17,hy+1,1.2,0,Math.PI*2);target.fill();
       target.fillStyle="#fff8d4";target.beginPath();target.moveTo(hx+12,hy+5);target.lineTo(hx+15,hy+10);target.lineTo(hx+17,hy+5);target.closePath();target.fill();
       target.strokeStyle="#d7fff2";target.lineWidth=1.5;target.beginPath();
       target.moveTo(hx+19,hy+5);target.quadraticCurveTo(hx+29,hy+14,hx+39,hy+10);
       target.moveTo(hx+17,hy+7);target.quadraticCurveTo(hx+25,hy+20,hx+35,hy+20);target.stroke();
       // Sừng phân nhánh, tai và cặp râu hướng ngược gió.
       target.strokeStyle="#f4d68e";target.lineWidth=3;target.beginPath();
       target.moveTo(hx-8,hy-12);target.quadraticCurveTo(hx-17,hy-26,hx-12,hy-32);
       target.moveTo(hx+1,hy-15);target.quadraticCurveTo(hx+7,hy-29,hx+17,hy-28);
       target.moveTo(hx-10,hy-6);target.quadraticCurveTo(hx-23,hy-13,hx-27,hy-5);target.stroke();
       target.strokeStyle="#baffef";target.lineWidth=2;target.beginPath();
       target.moveTo(hx-12,hy+1);target.quadraticCurveTo(hx-28,hy+5,hx-35,hy+1);
       target.moveTo(hx-9,hy+5);target.quadraticCurveTo(hx-24,hy+15,hx-34,hy+12);target.stroke();
       // Mắt hổ phách có đồng tử dọc và lông mày nổi.
       target.fillStyle="#fff0a8";target.beginPath();target.ellipse(hx+7,hy-8,3.2,2.4,-.2,0,Math.PI*2);target.fill();
       target.fillStyle="#173e45";target.fillRect(hx+6,hy-10,1.5,4);
       target.strokeStyle="#155d69";target.lineWidth=2.4;target.beginPath();target.moveTo(hx+1,hy-12);target.lineTo(hx+12,hy-14);target.stroke();
       // Đuôi dài chẻ đôi như đuôi cá rồng.
       target.fillStyle="#37bcae";target.strokeStyle="#c4fff0";target.lineWidth=1.3;
       target.beginPath();target.moveTo(-72,dragonY+10);target.quadraticCurveTo(-91,dragonY+12,-98,dragonY+2);
       target.quadraticCurveTo(-84,dragonY+4,-81,dragonY-7);target.quadraticCurveTo(-74,dragonY+1,-72,dragonY+10);target.closePath();target.fill();target.stroke();
       target.globalAlpha=.58*fade;target.strokeStyle="#b6fff2";target.lineWidth=2;
       for(let i=0;i<3;i++){const yy=dragonY+22+i*6;target.beginPath();target.moveTo(-66-i*3,yy);target.quadraticCurveTo(-87-i*3,yy-6,-104-i*3,yy-1);target.stroke();}
       target.restore();
     }
if(activeEffect==="sword_spin"){
      // Kiếm Vũ: nhiều phi kiếm hiện hình rõ, lần lượt lướt chém chéo qua trước và sau nhân vật; không tạo vòng tròn.
      target.save();target.lineJoin="round";target.lineCap="round";
      for(let i=0;i<3;i++){
        const phaseSword=t*4.2+i*Math.PI*2/3;
        const sweep=Math.sin(phaseSword)*.34;
        const sx=-24+i*24+Math.cos(phaseSword)*5,sy=-25+Math.sin(phaseSword*1.2)*9;
        target.save();target.translate(sx,sy);target.rotate(-.62+sweep);
        target.globalAlpha=(.62+i*.1)*fade;target.shadowColor="#78dcff";target.shadowBlur=11;
        const blade=target.createLinearGradient(-4,-25,4,20);
        blade.addColorStop(0,"#ffffff");blade.addColorStop(.48,"#b9f2ff");blade.addColorStop(1,"#4c9fc9");
        target.fillStyle=blade;target.strokeStyle="#eaffff";target.lineWidth=1.2;
        target.beginPath();target.moveTo(0,-31);target.lineTo(4,-19);target.lineTo(3,14);target.lineTo(0,20);target.lineTo(-3,14);target.lineTo(-4,-19);target.closePath();target.fill();target.stroke();
        target.shadowBlur=0;target.strokeStyle="#f1d28a";target.lineWidth=2.8;
        target.beginPath();target.moveTo(-8,13);target.quadraticCurveTo(0,17,8,13);target.stroke();
        target.strokeStyle="#b88a50";target.lineWidth=3.2;target.beginPath();target.moveTo(0,17);target.lineTo(0,27);target.stroke();
        target.fillStyle="#fff0bd";target.beginPath();target.arc(0,29,2,0,Math.PI*2);target.fill();
        target.globalAlpha=.5*fade;target.strokeStyle="#a8edff";target.lineWidth=2;
        target.beginPath();target.moveTo(0,-26);target.lineTo(0,-43);target.stroke();
        target.restore();
      }
      // Một nhát kiếm quang chéo ngắn nhấn nhịp múa kiếm.
      target.globalAlpha=.55*fade;target.strokeStyle="#e7fbff";target.lineWidth=2.2;target.shadowColor="#7ddfff";target.shadowBlur=9;
      const slash=Math.sin(t*5)*5;target.beginPath();target.moveTo(-39,18+slash);target.quadraticCurveTo(-5,-3-slash,32,-34+slash);target.stroke();
      target.shadowBlur=0;target.restore();
    }
    if(activeEffect==="pill"){
      // Tay lấy linh đan, đưa lên miệng rồi nuốt; viên đan biến mất.
      const reach=Math.min(1,progress/.28),drink=Math.max(0,Math.min(1,(progress-.28)/.34));
      const smooth=n=>n*n*(3-2*n),lift=smooth(reach),toMouth=smooth(drink);
      const handX=12-7*toMouth,handY=-5-20*lift+10*toMouth;
      target.globalAlpha=.98*fade;target.strokeStyle=skin;target.lineWidth=4.2;target.lineCap="round";
      target.beginPath();target.moveTo(9,-3);target.quadraticCurveTo(15,-13,handX,handY+3);target.stroke();
      target.fillStyle=skin;target.beginPath();target.arc(handX,handY,3.2,0,Math.PI*2);target.fill();
      if(progress<.64){target.fillStyle="#e8a9f2";target.strokeStyle="#fff0c7";target.lineWidth=1.2;target.shadowColor="#ffb7ff";target.shadowBlur=8;target.beginPath();target.ellipse(handX-1,handY-5,3.2,4.2,.3,0,Math.PI*2);target.fill();target.stroke();target.shadowBlur=0;}
      if(progress>.48){target.globalAlpha=.35*fade;target.fillStyle="#ffe9a8";target.beginPath();target.ellipse(0,-20,10,12,0,0,Math.PI*2);target.fill();}
    }
    if(activeEffect==="qi_pill"){
      // Tụ Khí Đan: giơ viên đan xanh ngọc lên cao, nuốt rồi hấp thu linh khí.
      const lift=Math.min(1,progress/.24),drink=Math.max(0,Math.min(1,(progress-.24)/.30));
      const smooth=n=>n*n*(3-2*n),p=smooth(lift),q=smooth(drink),hx=13-10*q,hy=-8-18*p+8*q;
      target.globalAlpha=.98*fade;target.strokeStyle=skin;target.lineWidth=4.4;target.lineCap="round";
      target.beginPath();target.moveTo(9,-2);target.quadraticCurveTo(19,-17,hx,hy+3);target.stroke();
      target.fillStyle=skin;target.beginPath();target.arc(hx,hy,3.1,0,Math.PI*2);target.fill();
      if(progress<.54){target.shadowColor="#65f2d1";target.shadowBlur=12;target.fillStyle="#67d8b5";target.strokeStyle="#e1fff2";target.lineWidth=1.4;target.beginPath();target.moveTo(hx,hy-11);target.quadraticCurveTo(hx+7,hy-3,hx,hy+1);target.quadraticCurveTo(hx-7,hy-3,hx,hy-11);target.closePath();target.fill();target.stroke();target.shadowBlur=0;}
      target.globalAlpha=.7*fade;target.strokeStyle="#8fffe0";target.lineWidth=1.4;
      for(let n=0;n<3;n++){const aa=t*3+n*Math.PI*2/3;target.beginPath();target.arc(0,-20,13+n*4,aa,aa+1.2);target.stroke();}
      if(progress>.54){target.globalAlpha=.42*fade;target.fillStyle="#a5ffe5";target.beginPath();target.arc(0,-20,11+Math.sin(t*8)*2,0,Math.PI*2);target.fill();}
    }

    if(activeEffect==="formation"){
      // Tụ Linh Trận: trận đồ ba tầng, bát quái, linh tuyến nối các trận nhãn và phù văn cổ.
      const rot=-t*.58,pulse=.88+.12*Math.sin(t*5);
      target.globalAlpha=.96*fade;target.save();target.translate(0,27);target.rotate(rot);
      target.shadowColor="#b98cff";target.shadowBlur=13;target.strokeStyle="#d9c0ff";target.lineWidth=1.8;
      for(const radius of [39,31,19]){target.beginPath();target.arc(0,0,radius*pulse,0,Math.PI*2);target.stroke();}
      for(let n=0;n<8;n++){const a=n*Math.PI/4,px=Math.cos(a)*36,py=Math.sin(a)*36;
        target.beginPath();target.moveTo(Math.cos(a)*19,Math.sin(a)*19);target.lineTo(px,py);target.stroke();
        target.beginPath();target.moveTo(Math.cos(a)*31,Math.sin(a)*31);target.lineTo(Math.cos(a+.18)*39,Math.sin(a+.18)*39);target.stroke();
        target.fillStyle="#f4e9ff";target.beginPath();target.arc(px,py,3,0,Math.PI*2);target.fill();
      }
      target.strokeStyle="#f3dcff";target.lineWidth=1.5;target.beginPath();
      for(let n=0;n<8;n++){const a=n*Math.PI/4-Math.PI/2,px=Math.cos(a)*31,py=Math.sin(a)*31;n?target.lineTo(px,py):target.moveTo(px,py);}target.closePath();target.stroke();
      target.shadowBlur=0;target.fillStyle="#fff0ff";target.font="bold 9px serif";target.textAlign="center";target.textBaseline="middle";
      for(let n=0;n<8;n++){const a=n*Math.PI/4;target.fillText(["乾","坎","艮","震","巽","離","坤","兌"][n],Math.cos(a)*25,Math.sin(a)*25);}
      target.restore();
    }
    if(activeEffect==="formation_sword"||activeEffect==="formation_seal"){
      const rot=t*(activeEffect==="formation_sword"?1.15:.42);
      target.save();target.globalAlpha=.96*fade;
      if(activeEffect==="formation_sword"){
        // Vạn Kiếm Trận: tám phi kiếm dài, thấy rõ lưỡi kiếm, chắn tay, chuôi và kiếm quang.
        target.translate(5,-12);target.shadowColor="#75dfff";target.shadowBlur=16;
        for(let n=0;n<8;n++){
          const a=rot+n*Math.PI/4,px=Math.cos(a)*43,py=Math.sin(a)*32;
          target.save();target.translate(px,py);target.rotate(a+Math.PI/2);
          const blade=target.createLinearGradient(-4,0,4,0);
          blade.addColorStop(0,"#5bb8df");blade.addColorStop(.48,"#f4ffff");blade.addColorStop(1,"#78d9ff");
          target.fillStyle=blade;target.strokeStyle="#e5fbff";target.lineWidth=1.2;
          target.beginPath();target.moveTo(0,-23);target.lineTo(4,-9);target.lineTo(3,10);target.lineTo(0,15);target.lineTo(-3,10);target.lineTo(-4,-9);target.closePath();target.fill();target.stroke();
          target.strokeStyle="#f3d48b";target.lineWidth=2.5;target.beginPath();target.moveTo(-7,10);target.lineTo(7,10);target.stroke();
          target.strokeStyle="#c99b58";target.lineWidth=2;target.beginPath();target.moveTo(0,12);target.lineTo(0,23);target.stroke();
          target.fillStyle="#fff0bd";target.beginPath();target.arc(0,24,1.8,0,Math.PI*2);target.fill();
          target.globalAlpha=.7;target.strokeStyle="#b8f4ff";target.lineWidth=1.5;target.beginPath();target.moveTo(0,-17);target.lineTo(0,7);target.stroke();
          target.restore();
        }
        target.shadowBlur=0;
      }else{
        // Bát Quái Trận: tám phù trận nhỏ mở ra theo vòng bát quái, nối bằng linh tuyến.
        target.translate(0,5);target.rotate(rot*.35);target.strokeStyle="#d8b7ff";target.shadowColor="#b78aff";target.shadowBlur=10;target.lineWidth=1.6;
        target.beginPath();target.arc(0,0,34,0,Math.PI*2);target.stroke();
        for(let n=0;n<8;n++){const a=n*Math.PI/4,px=Math.cos(a)*34,py=Math.sin(a)*34;target.beginPath();target.moveTo(0,0);target.lineTo(px,py);target.stroke();target.fillStyle="#f5eaff";target.fillRect(px-3,py-5,6,10);}
        target.shadowBlur=0;
      }
      target.restore();
    }
    if(activeEffect==="wind_step"){
       // Phong Hành: ba dải phong lụa song song, thuôn nhọn về sau như luồng khí lướt tốc độ cao.
       const flow=t*2.8,drift=Math.sin(flow)*3;
       target.save();target.globalAlpha=.88*fade;target.lineCap="round";target.lineJoin="round";
       const bands=[{y:-25,w:5,a:.42},{y:-7,w:7,a:.72},{y:12,w:5,a:.48}];
       for(let i=0;i<bands.length;i++){
         const b=bands[i],s=Math.sin(flow+i*.7)*2;
         target.globalAlpha=b.a*fade;
         const ribbon=target.createLinearGradient(-68,b.y,42,b.y);
         ribbon.addColorStop(0,"rgba(110,220,207,0)");ribbon.addColorStop(.38,"#65cfc2");ribbon.addColorStop(.78,"#c9fff0");ribbon.addColorStop(1,"rgba(240,255,247,0)");
         target.fillStyle=ribbon;target.beginPath();
         target.moveTo(-68,b.y+drift+s);target.bezierCurveTo(-38,b.y-7+s,-4,b.y-5-s,25,b.y-1);
         target.lineTo(43,b.y-5);target.bezierCurveTo(19,b.y+7+s,-15,b.y+8+s,-68,b.y+4+s);target.closePath();target.fill();
       }
       // Những vệt khí mảnh chạy cùng một hướng, không giao cắt nguệch ngoạc.
       target.globalAlpha=.72*fade;target.strokeStyle="#edfff8";target.lineWidth=1.35;target.shadowColor="#8cebd9";target.shadowBlur=7;
       for(let i=0;i<4;i++){
         const yy=-31+i*18,offset=((flow*19+i*23)%24);
         target.beginPath();target.moveTo(-61+offset,yy);target.bezierCurveTo(-36+offset,yy-2,-14+offset,yy-1,12+offset,yy-4);target.stroke();
       }
       target.shadowBlur=0;
       // Làn gió cuộn dưới phi kiếm thành hai cung mềm, cùng chiều chuyển động.
       target.globalAlpha=.58*fade;target.strokeStyle="#a8f4e6";target.lineWidth=2;
       for(let i=0;i<2;i++){target.beginPath();target.moveTo(-39,24+i*5);target.bezierCurveTo(-17,15+i*5,9,31+i*4,34,20+i*4);target.stroke();}
       target.restore();
     }
if(activeEffect==="shadow_step"){
       // Ảnh Độn: người chợt tan thành ba bóng lệch nhịp rồi hiện hình ở điểm kế tiếp; không dùng vòng tròn.
       const blink=.18+.82*Math.abs(Math.sin(progress*Math.PI*2.2));
       for(let n=3;n>=1;n--){target.globalAlpha=(.10+n*.075)*fade;target.fillStyle=n%2?"#b8b0ff":"#7d72c9";target.save();target.translate(-n*15,Math.sin(t*8+n)*4);target.scale(.88,1);target.beginPath();target.ellipse(0,0,11,20,-.12,0,Math.PI*2);target.fill();target.restore();}
       target.globalAlpha=blink*fade;target.strokeStyle="#e5ddff";target.lineWidth=2.1;target.shadowColor="#a89aff";target.shadowBlur=13;
       for(let n=0;n<4;n++){const yy=-26+n*15;target.beginPath();target.moveTo(-39,yy);target.lineTo(-22,yy-5);target.lineTo(-10,yy+1);target.stroke();}
       target.shadowBlur=0;target.fillStyle="#eeeaff";target.globalAlpha=.75*blink*fade;
       for(let n=0;n<4;n++){const px=-23+n*13,py=22+Math.sin(t*9+n)*3;target.fillRect(px,py,3,2);}
     }
if(activeEffect==="sword_dash"){
       // Kiếm Độn: một thanh phi kiếm lam bạc hoàn chỉnh lao ngang, mũi nhọn hướng về trước.
       const surge=.9+.1*Math.sin(t*15),bladeGlow=target.createLinearGradient(-42,0,66,0);
       bladeGlow.addColorStop(0,"#4c9fc4");bladeGlow.addColorStop(.22,"#b9f3ff");bladeGlow.addColorStop(.72,"#f4ffff");bladeGlow.addColorStop(1,"#65cfff");
       target.save();target.globalAlpha=.98*fade;target.shadowColor="#4bd5ff";target.shadowBlur=17;
       // Lưỡi kiếm dài, sống kiếm nổi và hai cạnh rõ nét.
       target.fillStyle=bladeGlow;target.strokeStyle="#eaffff";target.lineWidth=1.5;
       target.beginPath();target.moveTo(-28,-5);target.lineTo(43,-6*surge);target.lineTo(68,0);target.lineTo(43,6*surge);target.lineTo(-28,5);target.closePath();target.fill();target.stroke();
       target.strokeStyle="#ffffff";target.lineWidth=1.2;target.beginPath();target.moveTo(-20,-1);target.lineTo(59,0);target.stroke();
       // Chắn tay kiếm có cánh cong, chuôi quấn dây và chụp chuôi.
       target.shadowBlur=0;target.strokeStyle="#f4d28c";target.lineWidth=3.5;target.lineCap="round";
       target.beginPath();target.moveTo(-28,-12);target.quadraticCurveTo(-17,0,-28,12);target.stroke();
       target.strokeStyle="#9b6b38";target.lineWidth=5;target.beginPath();target.moveTo(-33,0);target.lineTo(-53,0);target.stroke();
       target.strokeStyle="#f5dca4";target.lineWidth=1.4;
       for(let n=0;n<4;n++){const xx=-50+n*4.5;target.beginPath();target.moveTo(xx,-3);target.lineTo(xx+5,3);target.stroke();}
       target.fillStyle="#e9c47e";target.beginPath();target.arc(-56,0,3.4,0,Math.PI*2);target.fill();
       // Kiếm quang kéo dài phía sau nhưng không che hình dáng thanh kiếm.
       target.globalAlpha=.38*fade;target.strokeStyle="#78e7ff";target.lineWidth=3;
       for(let n=0;n<3;n++){const yy=-13+n*13,off=(t*38+n*17)%22;target.beginPath();target.moveTo(-77+off,yy);target.bezierCurveTo(-56+off,yy-3,-44+off,yy+3,-31+off,yy);target.stroke();}
       target.restore();
     }
if(activeEffect==="cloud_stride"){
       // Lưu Vân Bộ: bước nhẹ liên hoàn, mây dài tách thành từng dải lụa trắng xanh trôi về sau.
       const drift=t*1.7;target.globalAlpha=.82*fade;target.strokeStyle="#e4fbff";target.lineWidth=2;target.shadowColor="#a8e8ff";target.shadowBlur=8;
       for(let n=0;n<3;n++){const yy=17+n*6,offset=Math.sin(drift+n*1.1)*5;target.beginPath();target.moveTo(-48,yy+offset);target.bezierCurveTo(-27,yy-11-offset,-5,yy+10+offset,18,yy-2);target.bezierCurveTo(30,yy-8,39,yy-3,48,yy-7);target.stroke();}
       target.shadowBlur=0;target.fillStyle="#f4ffff";
       for(let n=0;n<4;n++){const px=-27+n*17+Math.sin(drift+n)*4;target.beginPath();target.ellipse(px,27+Math.cos(drift+n)*2,7,2.4,0,0,Math.PI*2);target.fill();}
     }
     if(activeEffect==="body_burst"){
       // Bạo Bộ: dồn lực ở chân, bật vọt lên; chỉ để lại luồng khí trắng xanh, không có hạt vàng.
       const leap=Math.abs(Math.sin(progress*Math.PI*2.2));
       target.globalAlpha=.9*fade;target.strokeStyle="#c8f4ef";target.lineWidth=2;target.shadowColor="#83dfd3";target.shadowBlur=7;
       for(let n=0;n<3;n++){const spread=12+leap*12+n*5;target.beginPath();target.moveTo(-spread,27+n*3);target.quadraticCurveTo(0,34+leap*9+n*3,spread,27+n*3);target.stroke();}
       target.shadowBlur=0;
     }
if(activeEffect==="talisman"||activeEffect==="talisman_guard"||activeEffect==="talisman_thunder"){
      // Phù chú có hành động riêng: phù tốc xoay vòng, hộ thân kết thành khiên, lôi phù phóng sét.
      const count=activeEffect==="talisman"?4:activeEffect==="talisman_guard"?5:3;
      target.globalAlpha=.98*fade;target.shadowColor=activeEffect==="talisman_thunder"?"#7feaff":"#ffd86e";target.shadowBlur=10;
      for(let n=0;n<count;n++){
        const a=t*(activeEffect==="talisman_thunder"?-1.8:2.6)+n*Math.PI*2/count;
        const px=activeEffect==="talisman_guard"?17+Math.cos(a)*24:Math.cos(a)*31;
        const py=activeEffect==="talisman_guard"?-5+Math.sin(a)*24:-17+Math.sin(a)*25;
        target.save();target.translate(px,py);target.rotate(activeEffect==="talisman_thunder"?-.3+Math.sin(a)*.18:Math.sin(a)*.35);
        target.fillStyle=activeEffect==="talisman_thunder"?"#d9f7ff":"#f5d77e";target.strokeStyle=activeEffect==="talisman_thunder"?"#4b9fce":"#a94b32";target.lineWidth=1;
        target.fillRect(-4,-10,8,19);target.strokeRect(-4,-10,8,19);
        target.strokeStyle="#a94336";target.lineWidth=1.1;target.beginPath();target.moveTo(0,-7);target.lineTo(-2,-3);target.lineTo(2,0);target.lineTo(-1,4);target.lineTo(1,7);target.stroke();
        target.restore();
        if(activeEffect==="talisman_thunder"){target.strokeStyle="#b7f5ff";target.lineWidth=2;target.beginPath();target.moveTo(px,py+9);target.lineTo(px-5,py+17);target.lineTo(px+1,py+22);target.lineTo(px-4,py+30);target.stroke();}
      }
      // Hộ Thân Phù chỉ giữ các lá phù bay độc lập quanh người, không có dây nối màu xanh.
      target.shadowBlur=0;
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
  }
  target.restore();
  // Dấu hiệu thể chất chuyển thành chấm ngọc nhỏ cạnh pháp bảo, không che mặt hay tên.
  if(target!==cameraCtx&&racer.talent&&racer.talent.id){
    const talentColors={
      "wind":"#8ed8c7","thunder":"#a98be8","sword":"#b7d8ed","shadow":"#8d9bb4",
      "steady":"#c2a77a","fire":"#e69b62","ice":"#9bd9e9","azure-phoenix":"#d9a5c7",
      "kunpeng":"#82b8b1","heavenly-machine":"#d5bd83","sword-bone":"#9ebbd5",
      "purple-lightning":"#a78be8","moon-shadow":"#b8a9db","vajra":"#d4b477",
      "nine-sun":"#e6b66c","void":"#8999b5","star":"#e5d38e",
      "dragon-elephant":"#c58d72","azure-wood":"#8ebc83","cold-moon-sword":"#a5c9dc"
    };
    const color=talentColors[racer.talent.id]||"#c9b27b";
    const dotX=x+Math.max(12,scale*20),dotY=y+Math.max(10,scale*17);
    target.save();
    target.globalAlpha=.78;
    target.fillStyle="rgba(12,24,29,.72)";
    target.beginPath();target.arc(dotX,dotY,4.2,0,Math.PI*2);target.fill();
    target.fillStyle=color;
    target.beginPath();target.arc(dotX,dotY,2.2,0,Math.PI*2);target.fill();
    target.restore();
  }
}


// =====================================================
// REVISION 12 — quy hoạch tiên điện theo tầng, không đè
// cổng, thác nước hoặc tên bảng hiệu; màu áo theo chức vị.
// =====================================================

// Bảo đảm áo nam/nữ luôn lấy đúng màu gốc theo ROLE, không pha màu theo giới.
function drawFormalSpectator(x,y,scale,roleName,time,phase=0){
  drawSpectator(x,y,scale,roleName,time,phase);
}





/* REVISION 18 — bỏ phần đẩy quảng trường xuống thêm 210px.
   Giữ cảnh quan ở tọa độ gốc để vừa khung canvas 1100 × 900. */


// =====================================================
// REVISION 19 — quảng trường thanh sạch, nhân vật ngự kiếm
// đứng thẳng, lưỡi kiếm ngang hướng phải; thêm chim trời.
// =====================================================




function drawSpiritBirds(time){
  // Tiên hạc đầu đỏ: thân trắng thanh thoát, cổ đen, cánh lông nhiều lớp.
  const groups=[
    {dir:1,y:66,s:.62,speed:.000017,phase:.04},
    {dir:-1,y:119,s:.49,speed:.000014,phase:.51}
  ];

  const drawWing=(angle,far,underside=false)=>{
    ctx.save();
    // Cánh sau lùi sâu vào phía đối diện thân và nhỏ hơn, chỉ lộ một phần.
    ctx.translate(far?-12:-7,far?-1:-4);
    if(underside)ctx.scale(1,-1);
    if(far)ctx.scale(.58,.68);
    ctx.rotate(angle);
    const feather=far?"#d9e0dc":"#fffdf5";
    const shade=far?"#aebdb9":"#d9ded8";
    const tip=far?"#586568":"#343e42";
    // Cánh chính có bầu cánh rộng, thuôn dần về đầu.
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.bezierCurveTo(-13,-12,-25,-34,-48,-61);
    ctx.bezierCurveTo(-53,-67,-59,-64,-57,-57);
    ctx.lineTo(-51,-43);
    ctx.bezierCurveTo(-62,-53,-69,-47,-63,-37);
    ctx.lineTo(-53,-25);
    ctx.bezierCurveTo(-63,-32,-68,-24,-59,-15);
    ctx.quadraticCurveTo(-39,3,-8,10);
    ctx.closePath();
    ctx.fillStyle=feather;ctx.strokeStyle=shade;ctx.lineWidth=1.2;ctx.fill();ctx.stroke();

    // Lông cánh dài riêng biệt, xòe thành quạt khi nâng/hạ cánh.
    for(let i=0;i<8;i++){
      const t=i/7;
      ctx.beginPath();
      ctx.moveTo(-7-t*5,2+t*2);
      ctx.bezierCurveTo(-22-t*5,-13-t*4,-37-t*3,-39+t*19,-49-t*2,-57+t*25);
      ctx.strokeStyle=i%3===0?shade:"rgba(255,255,255,.9)";
      ctx.lineWidth=1.15;ctx.stroke();
    }
    // Đầu cánh đen đặc trưng của hạc đầu đỏ.
    ctx.beginPath();
    ctx.moveTo(-43,-47);ctx.quadraticCurveTo(-58,-60,-57,-55);
    ctx.lineTo(-51,-39);ctx.quadraticCurveTo(-62,-49,-63,-39);
    ctx.lineTo(-51,-23);ctx.quadraticCurveTo(-61,-31,-59,-17);
    ctx.quadraticCurveTo(-51,-5,-39,-4);
    ctx.quadraticCurveTo(-45,-25,-43,-47);
    ctx.closePath();ctx.fillStyle=tip;ctx.globalAlpha=.88;ctx.fill();ctx.globalAlpha=1;
    ctx.restore();
  };

  groups.forEach((g,gi)=>{
    for(let n=0;n<2;n++){
      const p=(time*g.speed+g.phase+n*.48)%1;
      const x=g.dir>0?-100+p*(W+200):W+100-p*(W+200);
      const phase=time*.00155+n*1.7+gi*.8;
      const flap=Math.sin(phase);
      const y=g.y+Math.sin(time*.00048+n*1.4+gi)*3;
      ctx.save();
      ctx.translate(x,y);
      ctx.scale(g.dir*g.s,g.s);

      // Chân đỏ nâu kéo thẳng về sau, có ngón chân nhỏ.
      ctx.strokeStyle="#8f5146";ctx.lineWidth=1.7;ctx.lineCap="round";
      for(let leg=0;leg<2;leg++){
        const z=leg*3;
        ctx.beginPath();ctx.moveTo(-1,5+z);ctx.lineTo(-10,17+z);ctx.lineTo(-29,18+z+flap*1.2);ctx.stroke();
        ctx.beginPath();ctx.moveTo(-29,18+z+flap*1.2);ctx.lineTo(-34,16+z+flap*1.2);ctx.stroke();
      }

      // Cánh sau ở phía xa: thu nhỏ, lùi sau thân và chỉ để lộ phần lông ngoài.
      // Góc vỗ nhẹ hơn cánh trước để tạo phối cảnh chính diện tự nhiên.
      drawWing(-flap*.48,true,true);

      // Đuôi xếp lớp, phần lông đuôi sẫm màu lộ nhẹ.
      ctx.fillStyle="#f6f4eb";ctx.strokeStyle="#cbd3ce";ctx.lineWidth=1;
      for(let i=0;i<6;i++){
        ctx.beginPath();ctx.moveTo(-13,1);
        ctx.quadraticCurveTo(-28-i*2,-7+i*1.5,-47-i*1.2,-5+i*2);
        ctx.quadraticCurveTo(-30-i,-1+i*1.5,-13,5);ctx.closePath();ctx.fill();ctx.stroke();
      }
      ctx.fillStyle="#343e42";
      ctx.beginPath();ctx.moveTo(-38,-3);ctx.quadraticCurveTo(-49,-7,-54,-3);ctx.quadraticCurveTo(-44,3,-35,2);ctx.fill();

      // Thân hạc thuôn dài, ngực sáng và lưng có sắc xám tự nhiên.
      const body=ctx.createLinearGradient(-8,-11,10,12);
      body.addColorStop(0,"#fffef9");body.addColorStop(.52,"#f5f3ec");body.addColorStop(1,"#c7d0cb");
      ctx.fillStyle=body;ctx.strokeStyle="#c4cec8";ctx.lineWidth=1.1;
      ctx.beginPath();ctx.ellipse(-1,0,24,9.5,-.08,0,Math.PI*2);ctx.fill();ctx.stroke();
      ctx.strokeStyle="rgba(171,185,179,.65)";ctx.lineWidth=.85;
      for(let i=0;i<7;i++){
        ctx.beginPath();ctx.moveTo(-17+i*4,-4);ctx.quadraticCurveTo(-9+i*3,1,-4+i*3,6);ctx.stroke();
      }

      // Cánh gần thân: nổi rõ ở mặt trên, vỗ đồng bộ với cánh xa.
      drawWing(flap*.92,false,false);
      ctx.save();ctx.translate(-7,-4);ctx.rotate(flap*.92);
      ctx.strokeStyle="rgba(255,255,255,.94)";ctx.lineWidth=1.25;
      for(let i=0;i<6;i++){
        ctx.beginPath();ctx.moveTo(-9-i,-2+i*.4);
        ctx.quadraticCurveTo(-29-i*2,-18-i*2,-49-i,-42+i*4);ctx.stroke();
      }
      ctx.restore();

      // Cổ dài hình chữ S, mảng đen sau cổ và đầu đỏ đặc trưng.
      ctx.lineCap="round";ctx.lineJoin="round";
      ctx.strokeStyle="#f8f6ee";ctx.lineWidth=7.2;
      ctx.beginPath();ctx.moveTo(15,-2);ctx.bezierCurveTo(27,-7,20,-24,31,-31);ctx.quadraticCurveTo(37,-36,42,-29);ctx.stroke();
      ctx.strokeStyle="#303a3d";ctx.lineWidth=3.1;
      ctx.beginPath();ctx.moveTo(21,-8);ctx.bezierCurveTo(26,-14,23,-26,33,-32);ctx.stroke();
      ctx.strokeStyle="rgba(255,255,255,.8)";ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(17,-3);ctx.quadraticCurveTo(25,-14,29,-27);ctx.stroke();

      // Đầu nhỏ, mảng da đỏ trên đỉnh, mắt đen và mỏ nhọn.
      ctx.fillStyle="#fffdf6";ctx.beginPath();ctx.ellipse(41,-31,5.2,3.8,-.18,0,Math.PI*2);ctx.fill();
      ctx.fillStyle="#bd3938";ctx.beginPath();ctx.ellipse(39,-35,3.6,2.5,-.35,0,Math.PI*2);ctx.fill();
      ctx.fillStyle="#b65a45";ctx.beginPath();ctx.moveTo(45,-31);ctx.lineTo(57,-29);ctx.lineTo(45,-27);ctx.closePath();ctx.fill();
      ctx.fillStyle="#202d31";ctx.beginPath();ctx.arc(43,-32,1,0,Math.PI*2);ctx.fill();

      // Viền sáng chạy dọc cổ và vài hạt bụi mây quanh cánh.
      ctx.strokeStyle="rgba(255,255,255,.75)";ctx.lineWidth=.9;
      ctx.beginPath();ctx.moveTo(18,-5);ctx.quadraticCurveTo(29,-17,36,-28);ctx.stroke();
      ctx.restore();
    }
  });

  // Chim nhỏ ở xa, giữ thưa để không lấn át đàn tiên hạc.
  const distant=[
    {dir:1,y:91,s:.25,speed:.000029,phase:.32,count:3,color:"#42565a"},
    {dir:-1,y:151,s:.21,speed:.000023,phase:.68,count:2,color:"#9d8055"}
  ];
  distant.forEach((f,k)=>{
    for(let i=0;i<f.count;i++){
      const p=(time*f.speed+f.phase+i*.29)%1;
      const x=f.dir>0?-45+p*(W+90):W+45-p*(W+90);
      const y=f.y+Math.sin(time*.001+i*1.8+k)*5;
      const flap=Math.sin(time*.0038+i*1.6+k)*5;
      ctx.save();ctx.translate(x,y);ctx.scale(f.dir*f.s,f.s);ctx.fillStyle=f.color;
      ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(-12,-flap-11,-24,-flap-3);ctx.quadraticCurveTo(-14,2,0,1);ctx.closePath();ctx.fill();
      ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(-12,flap+10,-23,flap+4);ctx.quadraticCurveTo(-12,0,0,-1);ctx.closePath();ctx.fill();
      ctx.restore();
    }
  });
}


// =====================================================
// REVISION 20 — phục hồi đội hình quảng trường và kiếm cổ điển.
// =====================================================







// =====================================================
// REVISION 18 — PHI KIẾM CHÂN THỰC, THÁC LIỀN SÔNG,
// TIÊN ĐIỆN LƠ LỬNG KHÔNG BỆ ĐÁ
// =====================================================

function drawRacingArtifact(target,kind,phase){
  const female=arguments.length>3&&arguments[3]==="female";
  const palettes=VKP_DATA.swords.racingPalettes;
  const p=palettes[((kind%palettes.length)+palettes.length)%palettes.length];
  const blade=p[0],edge=p[1],fuller=p[2],metal=p[3];
  const shapeCount=VKP_DATA.swords.shapeCount;
  const shape=((kind%shapeCount)+shapeCount)%shapeCount;
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




// =====================================================
// REVISION 18 — BÁT QUÁI CHƯỞNG MÔN, THÁC SƠN TUYỀN VÀ KHÁN ĐÀI
// =====================================================



// Thác bắt nguồn từ khe nước trong lòng núi, đổ thành màn nước nhiều sợi.

// Dòng sông nằm sát chân thác, nước nhập vào nhau thay vì kết thúc lơ lửng.

// Núi chuyển thành các lớp sườn mềm; bỏ các mảng đá/vách vụn dư thừa.

function drawCrowd(time) {
  // Ngai nằm trong khoảng trống giữa Chân truyền và Trưởng lão,
  // nhỉnh cao hơn hai hàng bên nhưng không lấn xuống khu Nòng cốt.
  const masterSeatY=ctx.canvas.height*(565/825);
  if(!window.__awardMasterDepartureActive)drawCeremonySeatedMaster(ctx,550,masterSeatY,.82);
  // Hạ nhãn thêm một chút để sát vòng Thái Cực hơn; không thay đổi ngai hoặc Chưởng môn.
  drawRoleLabel(550,444,"CHƯỞNG MÔN","#f2d17d",1.05);

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

  // Khôi phục mật độ khán đài như trước khi tối ưu hiệu năng.
  for(let i=0;i<28;i++){
    const col=i%7,row=Math.floor(i/7);
    const x=445+col*35+(row%2)*7,y=660+row*14+Math.sin(i*1.7)*2;
    drawVIPAura(x,y-8,12,"#b8e5d6",time,i*.61,.15);
    drawSpectator(x,y,.43,"core",time,i*.73);
  }
  // Nội môn: hai cánh, mỗi bên 32 người.
  for(let i=0;i<64;i++){
    const side=i<32?0:1,local=i%32,col=local%8,row=Math.floor(local/8);
    const x=side===0?42+col*43+(row%2)*4:762+col*43+(row%2)*4;
    const y=656+row*16+Math.sin(i*1.73)*1.8;
    drawSpectator(x,y,.37,"inner",time,i*.59);
  }

  // Ngoại môn 112 người (2 hàng), tạp dịch 168 người (3 hàng).
  // Cả hai nhóm dùng 56 cột cố định để mật độ đồng nhất, không còn hàng cuối thưa.
  const groups=[
    {role:"outer",count:112,columns:56,scale:.34,y0:705,y1:765},
    {role:"servant",count:168,columns:56,scale:.30,y0:785,y1:885}
  ];
  groups.forEach((g,gi)=>{
    const rowCount=Math.ceil(g.count/g.columns);
    for(let row=0;row<rowCount;row++){
      const rowStart=row*g.columns;
      const itemsInRow=Math.min(g.columns,g.count-rowStart);
      for(let col=0;col<itemsInRow;col++){
        const i=rowStart+col;
        // Tọa độ ngang cố định từ mép trái tới mép phải: 56 người/hàng.
        const spread=itemsInRow>1?col/(itemsInRow-1):.5;
        const x=28+spread*(W-56);
        const y=g.y0+(g.y1-g.y0)*((row+.5)/rowCount)+Math.sin(i*1.91+gi)*2;
        drawSpectator(x,y,g.scale,g.role,time,i*.59+gi*2.1);
      }
    }
  });
  drawCrowdFlag(12,696,"#a53f36",time);
  drawCrowdFlag(W-18,696,"#b18a43",time);
}



// REVISION 54 — trả thông báo về vùng trời trống, hoàn thiện hai sơn tuyền và điểm hợp lưu.


// Dòng thác duy nhất bắt nguồn từ khe đỉnh tiên sơn bên trái.


// Thông báo nằm trên khoảng trời trống, tuyệt đối không đè lên biển hiệu
// "LĂNG TIÊU CHÍNH ĐIỆN" ở hàng kiến trúc phía trên.



// =====================================================
// REVISION 20 — LỄ BAN THƯỞNG: CHƯỞNG MÔN NGỰ KIẾM PHÁT QUÀ
// =====================================================


function drawCeremonyRankGift(target,x,y,rank,scale){
  const palettes={
    1:{base:"#d8a83f",dark:"#8b4c25",shine:"#fff0a7",gem:"#d84d43"},
    2:{base:"#b9d7e7",dark:"#527d9c",shine:"#f4ffff",gem:"#63c9df"},
    3:{base:"#b97849",dark:"#69412f",shine:"#f4d39a",gem:"#68b68a"}
  };
  const p=palettes[rank]||palettes[3];
  target.save();target.translate(x,y);target.scale(scale,scale);
  target.shadowColor=p.shine;target.shadowBlur=rank===1?18:12;
  // Hộp bảo vật có nắp nổi và viền kim loại.
  const body=target.createLinearGradient(-13,-8,13,13);
  body.addColorStop(0,p.shine);body.addColorStop(.3,p.base);body.addColorStop(1,p.dark);
  target.fillStyle=body;target.beginPath();target.moveTo(-13,-7);target.lineTo(13,-7);target.lineTo(11,11);target.lineTo(-11,11);target.closePath();target.fill();
  target.strokeStyle=p.shine;target.lineWidth=1.5;target.stroke();
  target.fillStyle=p.dark;target.fillRect(-14,-10,28,5);
  target.strokeStyle=p.shine;target.lineWidth=1.2;target.strokeRect(-14,-10,28,5);
  target.fillStyle=p.shine;target.fillRect(-3,-7,6,18);target.fillRect(-13,-1,26,4);
  target.fillStyle=p.gem;target.beginPath();
  if(rank===1){target.moveTo(0,-20);target.lineTo(7,-13);target.lineTo(0,-7);target.lineTo(-7,-13);target.closePath();}
  else if(rank===2){target.moveTo(0,-19);target.lineTo(6,-13);target.lineTo(0,-7);target.lineTo(-6,-13);target.closePath();}
  else{target.arc(0,-13,5,0,Math.PI*2);}
  target.fill();target.strokeStyle=p.shine;target.lineWidth=1;target.stroke();
  // Nơ/ribbon phân cấp: đệ nhất có tua lụa, đệ nhị có cánh bạc, đệ tam có tua đồng.
  target.strokeStyle=p.shine;target.lineWidth=2;target.beginPath();
  if(rank===1){target.moveTo(-8,-10);target.quadraticCurveTo(-18,-22,-20,-14);target.moveTo(8,-10);target.quadraticCurveTo(18,-22,20,-14);target.moveTo(-5,10);target.lineTo(-8,17);target.moveTo(5,10);target.lineTo(8,17);}
  else if(rank===2){target.moveTo(-8,-10);target.lineTo(-18,-17);target.lineTo(-14,-7);target.moveTo(8,-10);target.lineTo(18,-17);target.lineTo(14,-7);}
  else{target.moveTo(-8,9);target.lineTo(-13,15);target.moveTo(8,9);target.lineTo(13,15);}
  target.stroke();target.shadowBlur=0;target.restore();
}



// =====================================================
// REVISION 21 — nghi thức ban thưởng theo đúng hai cảnh
// =====================================================
function drawAwardPlazaBackdropV2(target,time,mini){
 const w=target.canvas.width,h=target.canvas.height;
 drawCeremonyBackdrop(target,mini,time);
 // Phủ thêm lớp sương tiên và sân quảng trường riêng cho cảnh chưởng môn khởi hành.
 const mist=target.createLinearGradient(0,h*.48,0,h*.9);mist.addColorStop(0,"rgba(220,244,221,0)");mist.addColorStop(.65,"rgba(220,244,221,.16)");mist.addColorStop(1,"rgba(32,65,54,.18)");
 target.fillStyle=mist;target.fillRect(0,h*.45,w,h*.55);
 target.strokeStyle="rgba(255,226,163,.42)";target.lineWidth=mini?1:2;
 target.beginPath();target.ellipse(w*.5,h*.79,w*.34,h*.07,0,0,Math.PI*2);target.stroke();
 for(let i=0;i<8;i++){const a=i*Math.PI/4+time*.00008;const x=w*.5+Math.cos(a)*w*.34,y=h*.79+Math.sin(a)*h*.07;target.fillStyle="#e9d18b";target.beginPath();target.arc(x,y,mini?1.2:3,0,Math.PI*2);target.fill();}
}


function drawCeremonyFlyingSword(target,x,y,scale,time){
 target.save();target.translate(x,y);target.scale(scale,scale);
 target.shadowColor="#8df5e0";target.shadowBlur=14;
 const blade=target.createLinearGradient(0,-5,0,7);blade.addColorStop(0,"#faffea");blade.addColorStop(.45,"#8ce6d7");blade.addColorStop(1,"#327d78");
 target.fillStyle=blade;target.strokeStyle="#f5e5ad";target.lineWidth=1.2;
 target.beginPath();target.moveTo(-43,0);target.lineTo(32,-5);target.lineTo(49,0);target.lineTo(32,5);target.closePath();target.fill();target.stroke();
 target.shadowBlur=0;target.strokeStyle="#d8b36b";target.lineWidth=3;target.beginPath();target.moveTo(-5,-9);target.lineTo(-5,9);target.moveTo(-13,0);target.lineTo(3,0);target.stroke();
 target.strokeStyle="#f4e2a8";target.lineWidth=2;target.beginPath();target.moveTo(-30,0);target.lineTo(-48,-5);target.stroke();
 for(let i=0;i<3;i++){target.globalAlpha=.35-i*.08;target.strokeStyle="#9af0dc";target.lineWidth=2;target.beginPath();target.moveTo(-48-i*9,0);target.lineTo(-66-i*9,0);target.stroke();}
 target.globalAlpha=1;target.restore();
}


/* REVISION 74 — bục trao thưởng tam giáp bằng đá ngọc, kim loại chạm khắc nhiều tầng. */
function drawGrandAwardPedestalV2(target,x,top,base,width,rank,mini=false){
  const depth=mini?4:13;
  const palette={
    1:{main:"#b98535",light:"#fff0ad",dark:"#51351d",stone:"#5b4635"},
    2:{main:"#9ebbc9",light:"#f0ffff",dark:"#344d5e",stone:"#43545a"},
    3:{main:"#a96e43",light:"#f4cf9b",dark:"#4c3027",stone:"#554039"}
  }[rank]||{main:"#98734b",light:"#f5dfa9",dark:"#49382b",stone:"#514236"};
  const left=x-width/2,right=x+width/2,cap=mini?4:11;
  target.save();
  // Mặt hông phải tạo chiều sâu khối đá.
  const side=target.createLinearGradient(right,0,right+depth,0);
  side.addColorStop(0,palette.dark);side.addColorStop(1,"#171f20");
  target.fillStyle=side;target.beginPath();target.moveTo(right,top+cap);target.lineTo(right+depth,top+cap-depth*.35);target.lineTo(right+depth,base-depth*.25);target.lineTo(right,base);target.closePath();target.fill();
  // Thân bục đá nguyên khối, có vát cạnh và gờ kim loại.
  const face=target.createLinearGradient(left,top,left,base);
  face.addColorStop(0,palette.main);face.addColorStop(.12,palette.stone);face.addColorStop(.72,"#39332d");face.addColorStop(1,palette.dark);
  target.fillStyle=face;target.beginPath();target.moveTo(left,top+cap);target.lineTo(right,top+cap);target.lineTo(right,base-8);target.lineTo(left,base-8);target.closePath();target.fill();
  target.strokeStyle=palette.light;target.lineWidth=mini?1:2;target.stroke();
  // Bệ chân ba tầng.
  for(let n=0;n<3;n++){
    const inset=n*(mini?2:5),yy=base-(n+1)*(mini?4:10);
    target.fillStyle=n===1?palette.main:palette.dark;
    target.fillRect(left-inset,yy,width+inset*2,mini?3:7);
    target.strokeStyle=palette.light;target.lineWidth=mini?.65:1.4;
    target.strokeRect(left-inset,yy,width+inset*2,mini?3:7);
  }
  // Đỉnh bục nhiều lớp, có mặt đá sáng và đường viền vàng.
  const topGrad=target.createLinearGradient(left,top,right,top+cap);
  topGrad.addColorStop(0,palette.light);topGrad.addColorStop(.35,palette.main);topGrad.addColorStop(1,palette.dark);
  target.fillStyle=topGrad;target.beginPath();target.moveTo(left-3,top+cap);target.lineTo(x,top);target.lineTo(right+3,top+cap);target.lineTo(right,top+cap+5);target.lineTo(left,top+cap+5);target.closePath();target.fill();
  target.strokeStyle=palette.light;target.lineWidth=mini?1:2.4;target.stroke();
  // Trụ chạm khắc hai bên và các đai kim loại.
  for(const px of [left+width*.13,right-width*.13]){
    target.fillStyle="rgba(12,20,20,.42)";target.fillRect(px-(mini?1:3),top+cap+8,mini?2:6,base-top-cap-25);
    target.strokeStyle=palette.light;target.lineWidth=mini?.6:1.3;
    target.beginPath();target.moveTo(px,top+cap+10);target.lineTo(px,base-22);target.stroke();
    target.fillStyle=palette.main;target.fillRect(px-(mini?2:5),top+cap+12,mini?4:10,mini?2:4);
    target.fillRect(px-(mini?2:5),base-25,mini?4:10,mini?2:4);
  }
  target.strokeStyle=palette.light;target.lineWidth=mini?.7:1.5;
  target.beginPath();target.moveTo(left+5,top+cap+18);target.lineTo(right-5,top+cap+18);target.moveTo(left+5,base-18);target.lineTo(right-5,base-18);target.stroke();
  // Huy hiệu ngọc khắc hạng trên mặt trước.
  const badgeY=top+(base-top)*.34;
  target.fillStyle=palette.dark;target.strokeStyle=palette.light;target.lineWidth=mini?1:2;
  target.beginPath();target.moveTo(x,badgeY-(mini?7:18));target.lineTo(x+(mini?6:16),badgeY);target.lineTo(x,badgeY+(mini?7:18));target.lineTo(x-(mini?6:16),badgeY);target.closePath();target.fill();target.stroke();
  target.fillStyle=palette.light;target.font=mini?"bold 6px Georgia":"bold 15px Georgia";target.textAlign="center";target.textBaseline="middle";
  target.fillText(String(rank),x,badgeY);
  // Chạm hoa văn dọc hai mặt.
  target.globalAlpha=.65;target.strokeStyle=palette.light;target.lineWidth=mini?.55:1;
  for(let n=0;n<3;n++){
    const yy=top+cap+30+n*(base-top-cap-60)/3;
    target.beginPath();target.moveTo(x-width*.28,yy);target.lineTo(x-width*.18,yy-4);target.lineTo(x-width*.08,yy);target.moveTo(x+width*.08,yy);target.lineTo(x+width*.18,yy-4);target.lineTo(x+width*.28,yy);target.stroke();
  }
  target.restore();
}

/* REVISION 74 — người nhận quà ôm hộp trước ngực và bật nhảy vui mừng liên tục. */
function drawRecipientCelebrationGiftV2(target,x,riderY,rank,scale,bounce,mini){
  target.save();target.translate(x,riderY-bounce);target.scale(scale,scale);
  target.strokeStyle="#efc39b";target.lineWidth=mini?2.4:4.5;target.lineCap="round";target.lineJoin="round";
  target.beginPath();
  target.moveTo(-9,-6);target.quadraticCurveTo(-17,-1,-12,7);target.lineTo(-7,10);
  target.moveTo(9,-6);target.quadraticCurveTo(17,-1,12,7);target.lineTo(7,10);
  target.stroke();
  target.fillStyle="#f1c8a6";target.beginPath();target.arc(-7,10,2.2,0,Math.PI*2);target.arc(7,10,2.2,0,Math.PI*2);target.fill();
  target.restore();
  drawCeremonyRankGift(target,x,riderY-bounce+7*scale,rank,mini?.58:.82);
  // Sao vui mừng nhấp nháy phía trên đầu.
  target.save();target.globalAlpha=.72+.28*Math.sin(performance.now()*.012+rank);
  target.strokeStyle=rank===1?"#fff0a2":"#dffaff";target.lineWidth=mini?1:2;
  const sy=riderY-bounce-48*scale;
  for(let n=0;n<3;n++){const sx=x+(n-1)*(mini?13:25),yy=sy+Math.sin(performance.now()*.008+n)*3;
    target.beginPath();target.moveTo(sx,yy- (mini?3:6));target.lineTo(sx,yy+(mini?3:6));target.moveTo(sx-(mini?3:6),yy);target.lineTo(sx+(mini?3:6),yy);target.stroke();}
  target.restore();
}


function drawPodiumScene(target,time,mini=false){
  const ordered=sortedRacers().slice(0,VKP_DATA.ceremony.awards.topCount),w=target.canvas.width,h=target.canvas.height;
  const elapsed=Math.max(0,(performance.now()-ceremonyStartedAt)/1000);
  const count=ordered.length;
  
  // Thiên Lý Kính bỏ qua cảnh giải tán, đứng dậy và nhảy lên phi kiếm tại quảng trường.
  // Khung mini đi thẳng tới cùng cảnh trao giải, cùng nền, bục, người nhận và quỹ đạo chưởng môn.
  // Render mini không được ghi đè cờ ẩn ngai của sân chính.
  const title="BAN THƯỞNG TOP "+count+" TIÊN HỘI";
  const departure=VKP_DATA.ceremony.departure;
  const {disperseEnd,seatEnd,standEnd,swordArrivalEnd:swordEnd,flightEnd:flyEnd,transitionEnd}=departure;
  target.save();

  // Cảnh 1: toàn bộ tiên nhân giải tán khỏi quảng trường sau thông báo kết thúc.
  if(!mini&&elapsed<transitionEnd){
    // Ẩn chưởng môn trong lớp khán đài suốt nghi thức; mỗi frame chỉ vẽ một bản thể ở lớp hoạt ảnh chủ động.
    window.__awardMasterDepartureActive=true;
    if(target===ctx){
      drawScenery(time);
    }else{
      drawAwardPlazaBackdropV2(target,time,mini);
    }
    if(elapsed<disperseEnd){
      const p=awardSmoothstep(elapsed/disperseEnd);
      const fade=1-p;
      racers.forEach((racer,index)=>{
        const col=index%10,row=Math.floor(index/10);
        const startX=w*(.08+col*.093),startY=h*(.49+row*.026);
        const side=index%2===0?-1:1;
        const x=startX+side*w*.42*p;
        const y=startY-h*.16*p-Math.sin(p*Math.PI)*h*.07;
        target.save();target.globalAlpha=fade;
        drawRacer(target,racer,x,y,mini?.19:.34,time);
        target.restore();
      });
      target.textAlign="center";target.textBaseline="middle";
      target.font=mini?"900 10px Georgia":"900 27px Georgia";
      target.lineWidth=mini?2:5;target.strokeStyle="rgba(20,35,31,.9)";
      target.fillStyle="#fff0bd";target.shadowColor="#f5d58b";target.shadowBlur=mini?6:16;
      target.strokeText("ĐẠI HỘI KẾT THÚC!",w*.5,h*.16);
      target.fillText("ĐẠI HỘI KẾT THÚC!",w*.5,h*.16);
      target.restore();return;
    }

    // Cảnh 2: chưởng môn đứng dậy ngay tại ngai giữa quảng trường có đủ khán giả.
    const tx=w*.5,ty=h*(612/825),masterScale=mini?.48:.82;
    if(elapsed<seatEnd){
      drawCeremonySeatedMaster(target,tx,ty,masterScale);
    }else if(elapsed<standEnd){
      const p=awardSmoothstep((elapsed-seatEnd)/(standEnd-seatEnd));
      drawAwardThroneOnlyV2(target,tx,ty,masterScale,0);
      drawStandingSectMaster(target,tx,ty-h*.055*p,mini?.46:.82);
    }else if(elapsed<swordEnd){
      drawAwardThroneOnlyV2(target,tx,ty,masterScale,0);
      // Phi kiếm từ bên phải lao tới, giảm tốc và dừng ngay dưới chân chưởng môn.
      const p=awardSmoothstep((elapsed-standEnd)/(swordEnd-standEnd));
      const swordX=w*(.91-.41*p),swordY=ty-h*.055;
      // Chỉ có một bản thể: kiếm tiếp cận khi chưởng môn còn đứng; khi đã lên kiếm,
      // chuyển hẳn sang sprite ngự kiếm (đã có kiếm + một Thái Cực Ngọc Luân).
      const mounted=p>=.86;
      if(!mounted){
        drawCeremonyFlyingSword(target,swordX,swordY+24*(mini?.40:.76),mini?.40:.76,time);
        drawStandingSectMaster(target,tx,ty-h*.055,mini?.46:.82);
      }else if(!mini){
        const mountProgress=awardSmoothstep((p-.86)/.14);
        const masterY=ty-h*.055-h*.018*mountProgress;
        drawAwardMaster(target,tx,masterY,mini?.40:.76,time);
      }
    }else{
      drawAwardThroneOnlyV2(target,tx,ty,masterScale,0);
      if(!mini){
        const p=awardSmoothstep((elapsed-swordEnd)/(flyEnd-swordEnd));
        const x=tx+w*.82*p,y=ty-h*(.055+.31*p)+Math.sin(p*Math.PI*2)*h*.018;
        drawCeremonyFlyingSword(target,x,y+24*(mini?.40:.76),mini?.40:.76,time);
        drawAwardMaster(target,x,y,mini?.40:.76,time);
      }
    }
    if(elapsed>flyEnd){
      const alpha=clamp((elapsed-flyEnd)/(transitionEnd-flyEnd),0,1);
      target.fillStyle="rgba(8,18,18,"+alpha+")";target.fillRect(0,0,w,h);
    }
    target.restore();return;
  }

  window.__awardMasterDepartureActive=false;
  drawCeremonyBackdrop(target,mini,time);
  const podiumX=count===1?[w*.5]:count===2?[w*.25,w*.5]:[w*.25,w*.5,w*.75];
  const rankAt=count===1?[1]:count===2?[2,1]:[2,1,3];
  const topByRank={1:h*.535,2:h*.655,3:h*.715},base=h*.955;
  const metals={1:["#d9b45f","#fff0a7"],2:["#a9c7d8","#e5f7ff"],3:["#ad754d","#f2c08e"]};
  const {awardStart,masterFlightDuration,giftDropDuration:dropDuration}=VKP_DATA.ceremony.awards;
  target.textAlign="center";target.textBaseline="middle";
  target.font=mini?"900 10px Georgia":"900 27px Georgia";
  target.fillStyle="#fff0b8";target.shadowColor="#ffcf64";target.shadowBlur=mini?7:18;
  target.fillText(title,w*.5,h*.09);target.shadowBlur=0;

  for(let i=0;i<count;i++){
    const rank=rankAt[i],racer=ordered[rank-1],x=podiumX[i],top=topByRank[rank],bw=count===1?w*.24:w*.19;
    drawGrandAwardPedestalV2(target,x,top,base,bw,rank,mini);
    if(!racer)continue;
    const riderY=top-(mini?25:57),scale=mini?.48:1.12;
    const passP=clamp((x/w+.16)/1.32,0,1),dropStart=awardStart+passP*masterFlightDuration;
    const receivedAt=dropStart+dropDuration,celebrating=elapsed>=receivedAt;
    const bounce=celebrating?Math.abs(Math.sin((elapsed-receivedAt)*5.4+rank*.7))*(mini?4:13):0;
    drawRacer(target,racer,x,riderY-bounce,scale,time);
    target.font=mini?"bold 6px Arial":"bold 13px Arial";target.lineWidth=mini?2:3;
    target.strokeStyle="#172a25";target.fillStyle="#fff3d2";
    target.strokeText(racer.name,x,riderY-bounce+26*scale,w*.21);
    target.fillText(racer.name,x,riderY-bounce+26*scale,w*.21);
    const rankTitle=rank===1?"TOP 1 · QUÁN QUÂN":rank===2?"TOP 2 · Á QUÂN":"TOP 3 · QUÝ QUÂN";
    target.save();target.textAlign="center";target.textBaseline="middle";
    target.font=mini?"900 8px Georgia":"900 21px Georgia";
    target.lineJoin="round";target.lineWidth=mini?2.5:5;
    const rankTextWidth=target.measureText(rankTitle).width;
    const rankPlateWidth=Math.min(w*(mini?.24:.29),rankTextWidth+(mini?12:28));
    target.globalAlpha=mini?.42:.28;target.fillStyle=metals[rank][0];
    target.beginPath();target.roundRect(x-rankPlateWidth/2,base-(mini?14:79),rankPlateWidth,mini?14:34,mini?4:10);target.fill();
    target.globalAlpha=1;
    target.strokeStyle="#17231f";target.strokeText(rankTitle,x,base-(mini?7:62),rankPlateWidth-10);
    target.shadowColor=metals[rank][0];target.shadowBlur=mini?5:16;
    target.fillStyle=rank===1?"#fff0a4":rank===2?"#edf8ff":"#ffd0a0";
    target.fillText(rankTitle,x,base-(mini?7:62),rankPlateWidth-10);
    target.shadowBlur=0;
    target.restore();
  }

  const flightP=clamp((elapsed-awardStart)/masterFlightDuration,0,1);
  const masterX=w*(-.16+1.32*flightP),masterY=h*(.205+Math.sin(flightP*Math.PI*2)*.012);
  if(elapsed>=awardStart&&elapsed<=awardStart+masterFlightDuration+.12)drawAwardMaster(target,masterX,masterY,mini?.36:.70,time);

  for(let i=0;i<count;i++){
    const rank=rankAt[i],x=podiumX[i],racer=ordered[rank-1];if(!racer)continue;
    const top=topByRank[rank],riderY=top-(mini?25:57),scale=mini?.48:1.12;
    const passP=clamp((x/w+.16)/1.32,0,1),dropStart=awardStart+passP*masterFlightDuration;
    const p=clamp((elapsed-dropStart)/dropDuration,0,1);
    if(elapsed<dropStart)continue;
    if(p<1){
      const eased=awardSmoothstep(p),masterAt=clamp((elapsed-awardStart)/masterFlightDuration,0,1);
      const masterGiftY=h*(.205+Math.sin(masterAt*Math.PI*2)*.012);
      const giftY=masterGiftY+(riderY-masterGiftY)*eased;
      const raise=awardSmoothstep(p/.78);
      if(racer.isLegendaryThanSau){
        drawThanSauGiftReach(target,x,riderY,scale,raise,mini);
      }else{
        target.save();target.strokeStyle="#efc39b";target.lineWidth=mini?2:5;target.lineCap="round";
        target.beginPath();
        target.moveTo(x-9*scale,riderY-5*scale);target.lineTo(x-17*scale,riderY-15*scale-17*raise*scale);
        target.moveTo(x+9*scale,riderY-5*scale);target.lineTo(x+17*scale,riderY-15*scale-17*raise*scale);
        target.stroke();target.restore();
      }
      drawCeremonyRankGift(target,x,giftY,rank,mini?.55:.82);
    }else{
      const bounce=Math.abs(Math.sin((elapsed-(dropStart+dropDuration))*5.4+rank*.7))*(mini?4:13);
      if(racer.isLegendaryThanSau)drawThanSauGiftReception(target,x,riderY,rank,scale,bounce,mini);
      else drawRecipientCelebrationGiftV2(target,x,riderY,rank,scale,bounce,mini);
    }
  }
  target.restore();
}
// REVISION 77 — pháp bảo Ngự Long và linh tuyền đổ thẳng xuống lòng sông.
// Được vẽ ở lớp tiền cảnh sau mặt sông để nhìn rõ điểm phát nguồn và đường nước.



// =====================================================
// REVISION 90 — đại sơn liên mạch, linh tuyền bên trái,
// chưởng môn trẻ đồng nhất và Hậu Thiên Bát Quái dưới chân.
// =====================================================
function drawMountainRange(){
  // Hạ toàn bộ dãy núi một chút để mở rộng tầng trời cho tiên hạc và tường thụy.
  ctx.save();ctx.translate(0,38);
  const layer=(pts,top,mid,base)=>{const g=ctx.createLinearGradient(0,128,0,628);g.addColorStop(0,top);g.addColorStop(.52,mid);g.addColorStop(1,base);ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(0,H);pts.forEach((p,i)=>{if(!i)ctx.lineTo(p[0],p[1]);else{const a=pts[i-1];ctx.quadraticCurveTo((a[0]+p[0])*.5,Math.min(a[1],p[1])-19,p[0],p[1]);}});ctx.lineTo(W,H);ctx.closePath();ctx.fill();};
  // Một dãy núi lớn liên tục, đỉnh trung tâm cao và nhiều lớp sống núi.
  layer([[0,385],[75,340],[150,352],[235,286],[315,315],[390,205],[465,258],[545,126],[615,205],[690,158],[765,250],[845,278],[925,316],[1010,330],[W,375]],"#e5ecdf","#afc4b0","#718d78");
  layer([[0,450],[85,405],[165,414],[245,350],[325,385],[405,278],[480,328],[555,218],[630,286],[705,230],[785,330],[865,360],[950,386],[W,425]],"#b8cbb7","#78967c","#4b6e56");
  layer([[0,520],[90,474],[180,490],[265,430],[350,470],[435,408],[520,452],[605,398],[690,444],[775,420],[860,458],[950,470],[W,488]],"#829f7e","#55785d","#2d5141");
  const peaks=[
    [[390,205],[412,241],[465,258],[432,224]],
    [[545,126],[566,181],[615,205],[580,153]],
    [[690,158],[711,208],[765,250],[727,190]],
    [[555,218],[576,267],[630,286],[592,239]],
    [[705,230],[730,282],[785,330],[748,264]]
  ];
  peaks.forEach((p,i)=>{ctx.fillStyle=i%2?"rgba(228,239,218,.36)":"rgba(250,248,225,.62)";ctx.beginPath();p.forEach((v,j)=>j?ctx.lineTo(v[0],v[1]):ctx.moveTo(v[0],v[1]));ctx.closePath();ctx.fill();});
  // Những vệt sườn núi tạo chiều sâu, không còn vách đá/thác.
  ctx.save();ctx.globalAlpha=.28;ctx.strokeStyle="#e4e8d2";ctx.lineWidth=3;
  for(let i=0;i<8;i++){const x=250+i*78;ctx.beginPath();ctx.moveTo(x,330+i%3*13);ctx.quadraticCurveTo(x+35,365+i%2*18,x+78,390+i%3*12);ctx.stroke();}
  ctx.restore();
  const haze=ctx.createLinearGradient(0,290,0,510);haze.addColorStop(0,"rgba(229,240,224,0)");haze.addColorStop(.5,"rgba(229,240,224,.24)");haze.addColorStop(1,"rgba(229,240,224,0)");ctx.fillStyle=haze;ctx.fillRect(0,328,W,220);
  ctx.restore();
}

function drawScenery(time){
  ctx.save();ctx.globalAlpha=1;ctx.shadowBlur=0;
  drawSky(time);
  drawMountainRange();
  drawMovingClouds(time);
  drawRiver(time);
  drawDenseForest(time);
  // Lầu các nằm nguyên vẹn ở lớp sau; pháp bảo được đặt sát mép trái ngoài cụm điện.
  drawSectArchitecture(time);
  drawAmbientEnergy(time);
  drawSpiritBirds(time);
  drawRiverCurrent(time);
  // Pháp bảo Long Tuyền và dòng linh thủy không thuộc nền chung; tránh xuất hiện sai cảnh giới.
  drawCrowd(time);
  ctx.globalAlpha=1;ctx.shadowBlur=0;ctx.restore();
}


// =====================================================
// REVISION 91 — chưởng môn uy nghi, pháp y tông chủ,
// linh trận Bát Quái tròn xoay ngay dưới chân.
// =====================================================


function drawSectMasterFigure(target,x,y,scale,time,mode){
  target.save();target.translate(x,y);target.scale(scale,scale);
  const flying=mode==="flying";
  // Đại bào tông chủ: áo ngoài đỏ huyền sắc, vạt choàng rộng,
  // giáp vai thêu kim long, lớp trong vàng ngà và đai ngọc.
  target.lineJoin="round";target.lineCap="round";
  // Vạt áo choàng sau lưng.
  target.fillStyle="#3c2029";target.beginPath();target.moveTo(-22,-48);target.quadraticCurveTo(-52,-28,-61,18);target.lineTo(-35,30);target.lineTo(-17,-2);target.lineTo(20,-2);target.lineTo(42,30);target.lineTo(61,17);target.quadraticCurveTo(48,-33,22,-48);target.closePath();target.fill();
  target.fillStyle="#792b32";target.beginPath();target.moveTo(-22,-49);target.quadraticCurveTo(-47,-26,-49,13);target.lineTo(-31,19);target.lineTo(-14,-10);target.lineTo(16,-10);target.lineTo(34,19);target.lineTo(50,13);target.quadraticCurveTo(44,-28,21,-49);target.closePath();target.fill();
  target.strokeStyle="#e4bd70";target.lineWidth=2.4;target.stroke();
  // Thân áo thêu long văn.
  target.fillStyle="#a83b3d";target.beginPath();target.moveTo(-22,-51);target.lineTo(-29,-7);target.quadraticCurveTo(-26,13,-42,31);target.quadraticCurveTo(0,43,42,31);target.quadraticCurveTo(26,13,29,-7);target.lineTo(22,-51);target.quadraticCurveTo(0,-66,-22,-51);target.closePath();target.fill();
  target.strokeStyle="#f0d18b";target.lineWidth=2.8;target.stroke();
  // Lớp áo trong và cổ giao lĩnh.
  target.fillStyle="#f1dfb4";target.beginPath();target.moveTo(-12,-51);target.lineTo(0,-30);target.lineTo(12,-51);target.lineTo(21,20);target.lineTo(0,34);target.lineTo(-21,20);target.closePath();target.fill();
  target.fillStyle="#612b30";target.beginPath();target.moveTo(-13,-52);target.lineTo(0,-30);target.lineTo(13,-52);target.lineTo(7,-12);target.lineTo(0,-4);target.lineTo(-7,-12);target.closePath();target.fill();
  // Rồng vàng cuộn trên ngực áo.
  target.strokeStyle="#f5d887";target.lineWidth=2.5;target.beginPath();target.moveTo(-8,-16);target.bezierCurveTo(17,-29,20,-4,2,1);target.bezierCurveTo(-16,8,-11,22,7,17);target.stroke();
  target.fillStyle="#f5d887";target.beginPath();target.arc(9,-20,4,0,Math.PI*2);target.fill();
  target.strokeStyle="#f5d887";target.lineWidth=1.5;target.beginPath();target.moveTo(11,-23);target.lineTo(17,-29);target.moveTo(8,-24);target.lineTo(6,-31);target.stroke();
  // Đai ngọc và ngọc bội.
  const belt=target.createLinearGradient(0,5,0,14);belt.addColorStop(0,"#f4dc9b");belt.addColorStop(.5,"#9b713d");belt.addColorStop(1,"#f7e3a9");
  target.fillStyle=belt;target.fillRect(-28,8,56,7);
  target.fillStyle="#4dc5ae";target.strokeStyle="#f6dfa0";target.lineWidth=1.5;target.beginPath();target.roundRect(-5,7,10,11,3);target.fill();target.stroke();
  target.fillStyle="#d7b36c";target.beginPath();target.moveTo(0,18);target.lineTo(-5,26);target.lineTo(0,35);target.lineTo(5,26);target.closePath();target.fill();
  // Tay áo lớn, viền chỉ vàng; tư thế đặt tay ngai hoặc vươn tay ban thưởng.
  target.fillStyle="#872c35";target.strokeStyle="#edcc83";target.lineWidth=2.5;
  target.beginPath();target.moveTo(-21,-43);target.lineTo(-39,-36);target.lineTo(-48,-5);target.lineTo(-29,2);target.lineTo(-14,-19);target.closePath();target.fill();target.stroke();
  target.beginPath();target.moveTo(21,-43);target.lineTo(39,-36);target.lineTo(48,-5);target.lineTo(29,2);target.lineTo(14,-19);target.closePath();target.fill();target.stroke();
  // Cổ, gương mặt trưởng thành, ánh mắt nghiêm nghị và tóc búi cao.
  target.fillStyle="#d7a77f";target.fillRect(-6,-62,12,12);
  target.fillStyle="#e9bd98";target.beginPath();target.ellipse(0,-76,15,18,0,0,Math.PI*2);target.fill();
  target.fillStyle="#30232a";target.beginPath();target.arc(0,-83,16,Math.PI,Math.PI*2);target.fill();target.fillRect(-15,-84,4,19);target.fillRect(11,-84,4,19);
  target.beginPath();target.moveTo(-15,-82);target.quadraticCurveTo(-11,-98,0,-94);target.quadraticCurveTo(11,-98,15,-82);target.lineTo(8,-75);target.lineTo(0,-80);target.lineTo(-8,-75);target.closePath();target.fill();
  // Lông mày, mắt sâu, sống mũi, ria mép và râu cằm ngắn tạo vẻ tông chủ.
  target.strokeStyle="#38262a";target.lineWidth=2.2;target.beginPath();target.moveTo(-10,-80);target.lineTo(-3,-82);target.moveTo(3,-82);target.lineTo(10,-80);target.stroke();
  target.fillStyle="#34242a";target.fillRect(-8,-77,4,2);target.fillRect(4,-77,4,2);
  target.strokeStyle="#b77b60";target.lineWidth=1.5;target.beginPath();target.moveTo(0,-76);target.lineTo(-1,-69);target.lineTo(2,-68);target.stroke();
  target.strokeStyle="#653b34";target.lineWidth=1.7;target.beginPath();target.moveTo(-5,-65);target.quadraticCurveTo(0,-62,5,-65);target.stroke();
  target.fillStyle="#38272b";target.beginPath();target.moveTo(-5,-61);target.quadraticCurveTo(0,-55,5,-61);target.lineTo(3,-56);target.lineTo(-3,-56);target.closePath();target.fill();
  // Mão phải cầm hộp quà khi bay; hai tay nghỉ trên tay ngai khi ngồi.
  if(flying){target.strokeStyle="#e9bd98";target.lineWidth=6;target.beginPath();target.moveTo(29,-25);target.lineTo(43,-38);target.lineTo(53,-39);target.stroke();target.fillStyle="#e9bd98";target.beginPath();target.arc(54,-39,4,0,Math.PI*2);target.fill();}
  else{target.strokeStyle="#e9bd98";target.lineWidth=5;target.beginPath();target.moveTo(-25,-23);target.lineTo(-36,-8);target.moveTo(25,-23);target.lineTo(36,-8);target.stroke();}
  // Mão vàng/kim quan và ngọc trên đỉnh tóc.
  target.fillStyle="#d9b66c";target.strokeStyle="#fff0b5";target.lineWidth=1.5;
  target.beginPath();target.moveTo(-17,-91);target.lineTo(-13,-105);target.lineTo(-5,-96);target.lineTo(0,-116);target.lineTo(6,-96);target.lineTo(14,-105);target.lineTo(17,-91);target.closePath();target.fill();target.stroke();
  target.fillStyle="#58d5c0";target.beginPath();target.arc(0,-99,3.5,0,Math.PI*2);target.fill();
  // Vai áo gắn phù hiệu song long.
  target.strokeStyle="#f2d68e";target.lineWidth=2;target.beginPath();target.arc(-30,-36,7,0,Math.PI*2);target.arc(30,-36,7,0,Math.PI*2);target.stroke();
  target.restore();
}






// =====================================================
// REVISION 92 — Thái Cực đồ chân thực và đồng nhất ngai,
// chưởng môn ở quảng trường với chưởng môn trao thưởng.
// =====================================================
function drawMasterBaguaHalo(target,x,y,scale,time){
  // Thái Cực Ngọc Luân: dùng chung mốc thời gian của khung hình để chuyển động ổn định.
  const motionTime=Number.isFinite(time)?time:performance.now();
  // Không có quẻ, phù văn hoặc các vòng Bát Quái đồng tâm.
  target.save();target.translate(x,y-48*scale);target.rotate(motionTime*.00042);target.scale(scale,.94*scale);
  const r=94;
  const aura=target.createRadialGradient(0,0,r*.35,0,0,r*1.35);aura.addColorStop(0,"rgba(103,222,198,.22)");aura.addColorStop(.72,"rgba(89,193,171,.10)");aura.addColorStop(1,"rgba(89,193,171,0)");
  target.fillStyle=aura;target.beginPath();target.arc(0,0,r*1.35,0,Math.PI*2);target.fill();

  // Đĩa ngọc đen xanh với viền kim tuyến duy nhất.
  const jade=target.createRadialGradient(-24,-30,5,0,0,r);jade.addColorStop(0,"#315d55");jade.addColorStop(.62,"#173b37");jade.addColorStop(1,"#091f20");
  target.shadowColor="#8cf0d7";target.shadowBlur=20;target.fillStyle=jade;target.beginPath();target.arc(0,0,r,0,Math.PI*2);target.fill();target.shadowBlur=0;
  const rim=target.createLinearGradient(-r,-r,r,r);rim.addColorStop(0,"#fff0bd");rim.addColorStop(.3,"#72d8c0");rim.addColorStop(.62,"#d7b66d");rim.addColorStop(1,"#f7e7b0");
  target.strokeStyle=rim;target.lineWidth=3.2;target.beginPath();target.arc(0,0,r-1.5,0,Math.PI*2);target.stroke();

  // Hai cực âm dương với đường phân giới chữ S cổ điển.
  const q=r-5;
  target.fillStyle="#f5edcf";target.beginPath();target.arc(0,0,q,0,Math.PI*2);target.fill();
  target.fillStyle="#173b37";target.beginPath();target.arc(0,0,q,Math.PI/2,Math.PI*1.5);target.closePath();target.fill();
  target.fillStyle="#f5edcf";target.beginPath();target.arc(0,-q/2,q/2,0,Math.PI*2);target.fill();
  target.fillStyle="#173b37";target.beginPath();target.arc(0,q/2,q/2,0,Math.PI*2);target.fill();
  target.fillStyle="#173b37";target.beginPath();target.arc(0,-q/2,10.5,0,Math.PI*2);target.fill();
  target.fillStyle="#f5edcf";target.beginPath();target.arc(0,q/2,10.5,0,Math.PI*2);target.fill();

  // Tám nét mây ngọc khắc chìm ở viền, không tạo thành Bát Quái.
  target.globalAlpha=.52;target.strokeStyle="#f0d99b";target.lineWidth=1.1;
  for(let i=0;i<8;i++){const a=i*Math.PI/4,px=Math.cos(a)*84,py=Math.sin(a)*84;target.save();target.translate(px,py);target.rotate(a);target.beginPath();target.arc(0,0,4,-Math.PI*.8,Math.PI*.8);target.stroke();target.restore();}
  target.globalAlpha=1;
  // Ít hạt sáng hơn, gom chung một path để giảm lệnh vẽ/shadow trên iPhone.
  target.shadowBlur=0;target.beginPath();
  for(let i=0;i<10;i++){const a=-motionTime*.00032+i*Math.PI*2/10,rr=r+5+Math.sin(motionTime*.002+i)*2;target.globalAlpha=.38+.38*(.5+.5*Math.sin(motionTime*.003+i));target.fillStyle=i%2?"#b9f7e4":"#ffe4a7";target.moveTo(Math.cos(a)*rr+1.5,Math.sin(a)*rr);target.arc(Math.cos(a)*rr,Math.sin(a)*rr,1.5,0,Math.PI*2);}
  target.globalAlpha=1;target.shadowBlur=0;target.restore();
}
function drawAmbientEnergy(time){
  ctx.save();
  for(let i=0;i<12;i++){
    const side=i<6?0:1;
    const x=side===0?92+(i%6)*66:746+(i%6)*66;
    const y=575+(i%3)*17;
    const pulse=.5+.5*Math.sin(time*.002+i*1.4);
    ctx.globalAlpha=.12+.12*pulse;
    ctx.fillStyle=i%2?"#b8e4ed":"#d9c3f2";
    ctx.shadowColor=ctx.fillStyle;
    ctx.shadowBlur=8;
    ctx.beginPath();ctx.arc(x+Math.sin(time*.001+i)*3,y,1.5+pulse,0,Math.PI*2);ctx.fill();
  }
  ctx.globalAlpha=1;ctx.shadowBlur=0;ctx.restore();
}
function drawSectMasterThrone(target,x,y,scale,tilt=0){
  target.save();target.translate(x,y);target.rotate(tilt);target.scale(scale,scale);
  const gold=target.createLinearGradient(-45,0,45,0);gold.addColorStop(0,"#513321");gold.addColorStop(.24,"#c99b53");gold.addColorStop(.5,"#fff0b4");gold.addColorStop(.76,"#b17b3e");gold.addColorStop(1,"#4b3024");
  // Lưng ngai cao, đỉnh chạm song long và khung gỗ tử đàn.
  target.fillStyle="#422b27";target.beginPath();target.moveTo(-42,22);target.lineTo(-38,-58);target.quadraticCurveTo(-34,-80,0,-84);target.quadraticCurveTo(34,-80,38,-58);target.lineTo(42,22);target.closePath();target.fill();
  target.strokeStyle=gold;target.lineWidth=4;target.stroke();
  target.fillStyle="#762c32";target.beginPath();target.moveTo(-30,-49);target.lineTo(30,-49);target.lineTo(33,15);target.lineTo(-33,15);target.closePath();target.fill();
  target.strokeStyle="#f3d995";target.lineWidth=2;target.stroke();
  // Song long chạm nổi trên tựa ghế.
  target.strokeStyle="#e8c878";target.lineWidth=2.6;
  for(const side of [-1,1]){target.save();target.translate(side*18,-43);target.scale(side,1);target.beginPath();target.moveTo(-7,13);target.bezierCurveTo(-22,0,-8,-17,4,-9);target.quadraticCurveTo(14,-2,7,7);target.stroke();target.fillStyle="#f2d78e";target.beginPath();target.arc(7,-10,3.2,0,Math.PI*2);target.fill();target.restore();}
  // Tay vịn uốn hình đầu rồng.
  for(const side of [-1,1]){target.fillStyle=gold;target.beginPath();target.roundRect(side*31-5,-10,10,31,4);target.fill();target.strokeStyle="#f4d994";target.lineWidth=1.6;target.stroke();target.fillStyle="#d9b66c";target.beginPath();target.arc(side*31,-13,6,0,Math.PI*2);target.fill();}
  // Đệm ngồi, bệ chân và bậc ngọc.
  target.fillStyle="#a57a43";target.beginPath();target.moveTo(-35,14);target.lineTo(35,14);target.lineTo(44,25);target.lineTo(-44,25);target.closePath();target.fill();target.strokeStyle="#f2d58e";target.lineWidth=2;target.stroke();
  target.fillStyle="#4b3428";target.fillRect(-48,25,96,7);target.fillStyle=gold;target.fillRect(-51,22,102,4);
  target.restore();
}
function drawCeremonySeatedMaster(target,x,y,scale){
  drawMasterBaguaHalo(target,x,y,scale,performance.now());
  drawSectMasterThrone(target,x,y,scale,0);
  drawSectMasterFigure(target,x,y-3,scale,performance.now(),"seated");
}
function drawAwardThroneOnlyV2(target,x,y,scale,tilt=0){
  drawSectMasterThrone(target,x,y,scale,tilt);
}
function drawStandingSectMaster(target,x,y,scale){
  // Dùng chung khuôn mặt, mão, áo bào và họa tiết với chưởng môn ở ngai/phi kiếm.
  drawSectMasterFigure(target,x,y,scale,performance.now(),"standing");
}
function drawAwardMaster(target,x,y,scale,time){
  // Cùng Thái Cực trận dưới phi kiếm, cùng một mẫu nhân vật với chưởng môn trên ngai.
  drawMasterBaguaHalo(target,x,y,scale,time);
  target.save();target.translate(x,y);target.scale(scale,scale);
  const blade=target.createLinearGradient(0,8,0,38);blade.addColorStop(0,"#fff8d8");blade.addColorStop(.3,"#aee7df");blade.addColorStop(.62,"#f4fff1");blade.addColorStop(1,"#668c8d");
  target.shadowColor="#a5f4e8";target.shadowBlur=15;target.fillStyle="rgba(160,244,228,.16)";target.beginPath();target.ellipse(0,35,112,13,0,0,Math.PI*2);target.fill();target.shadowBlur=0;
  target.fillStyle=blade;target.strokeStyle="#fff0c4";target.lineWidth=2;target.beginPath();target.moveTo(-73,16);target.lineTo(72,16);target.lineTo(106,29);target.lineTo(72,42);target.lineTo(-73,42);target.closePath();target.fill();target.stroke();
  target.strokeStyle="#648f8d";target.lineWidth=1.4;target.beginPath();target.moveTo(-68,29);target.lineTo(99,29);target.stroke();
  target.fillStyle="#7b5736";target.fillRect(-104,24,32,10);target.fillStyle="#d8b66e";target.fillRect(-109,20,7,18);target.fillRect(-73,13,8,32);
  target.restore();
  drawSectMasterFigure(target,x,y,scale,time,"flying");
}


// =====================================================
// THẦN SẦU — sprite sheet 5x2, 10 frame pixel ngự kiếm.
// Dùng chung drawRacer cho Canvas chính và Thiên Lý Kính.
// =====================================================
const __thanSauSpriteSheet = new Image();
let __thanSauSpriteReady = false;
__thanSauSpriteSheet.onload = () => { __thanSauSpriteReady = true; };
__thanSauSpriteSheet.onerror = () => {
  __thanSauSpriteReady = false;
  console.warn("Không tải được sprite sheet Thần Sầu.");
};
// Nạp sprite ngay khi file renderer khởi chạy, trước khi người dùng triệu hồi.
__thanSauSpriteSheet.src = "assets/characters/than-sau/than-sau-spritesheet.png?v=3";

function drawThanSauSummonPlaceholder(target,x,y,scale,time){
  // Không vẽ nhân vật thường làm fallback: chỉ hiển thị bóng linh thể tạm thời chờ sprite.
  target.save();target.translate(x,y+Math.sin(time*.006)*1.5);target.scale(scale,scale);
  target.globalAlpha=.82;target.shadowColor="#b8ffe9";target.shadowBlur=18;
  target.fillStyle="rgba(180,255,235,.18)";target.beginPath();target.ellipse(0,5,40,25,0,0,Math.PI*2);target.fill();
  target.strokeStyle="#e9fff3";target.lineWidth=2;target.beginPath();target.arc(0,0,31,time*.001,time*.001+Math.PI*1.65);target.stroke();
  target.fillStyle="#d8fff2";target.beginPath();target.moveTo(-9,-31);target.lineTo(0,-44);target.lineTo(9,-31);target.lineTo(6,-21);target.lineTo(-6,-21);target.closePath();target.fill();
  target.fillStyle="#365b59";target.beginPath();target.moveTo(-14,-20);target.lineTo(-19,-4);target.lineTo(-13,13);target.lineTo(0,21);target.lineTo(13,13);target.lineTo(19,-4);target.lineTo(14,-20);target.closePath();target.fill();
  target.strokeStyle="#d4fff0";target.lineWidth=1.6;target.beginPath();target.moveTo(-16,3);target.lineTo(-25,20);target.lineTo(-9,18);target.moveTo(16,3);target.lineTo(25,20);target.lineTo(9,18);target.stroke();
  target.strokeStyle="#fff0bd";target.lineWidth=3;target.beginPath();target.moveTo(-42,24);target.lineTo(42,16);target.stroke();
  target.fillStyle="#fff0bd";target.beginPath();target.arc(0,-4,3,0,Math.PI*2);target.fill();
  target.restore();
}

function drawThanSauEffect(target,racer,time,scale=1){
  if(!(racer&&shouldDrawRaceEffect(target,racer,time)))return;
  const activeEffect=racer.effectType||"";
  const phase=time*.001;
  const duration=Math.max(.001,racer.effectDuration||racer.effectTimer||1);
  const progress=clamp(1-racer.effectTimer/duration,0,1);
  const wave=Math.sin(phase*7+(racer.phase||0));
  const pulse=Math.sin(phase*10+(racer.phase||0));
  if(racer.effectTimer>0&&shouldDrawRaceEffect(target,racer,time)){
    if(racers.length>35&&target!==cameraCtx){
      // Trường đua giảm tải hiệu ứng trang trí; Thiên Lý Kính vẫn vẽ đầy đủ hiệu ứng của nhân vật đang chiếu.
      target.save();target.globalAlpha=.48;
      target.fillStyle=racer.effectPolarity==="negative"?"#b7baff":"#b8eaff";
      target.fillRect(-22,-40,44,2);target.fillRect(-22,26,44,2);
      target.restore();
    }else{
    const t=time*.001,fade=Math.min(1,racer.effectTimer/.35);
    target.save();target.lineCap="round";target.lineJoin="round";
    if(activeEffect==="poison"){
      target.globalAlpha=.72*fade;target.strokeStyle="#a2e66d";target.fillStyle="#8acb62";target.lineWidth=1.7;
      for(let i=0;i<4;i++){const px=-18+i*12,py=-37-Math.abs(Math.sin(t*2+i))*7;target.beginPath();target.arc(px,py,2.2+(i%2),0,Math.PI*2);target.fill();target.beginPath();target.moveTo(px,py+5);target.quadraticCurveTo(px-5,py-2,px+1,py-9);target.stroke();}
      target.globalAlpha=.34;target.fillStyle="#77b85c";target.beginPath();target.ellipse(0,-19,10,12,0,0,Math.PI*2);target.fill();
    }else if(activeEffect==="weak"){
      // Suy lực: linh khí rò rỉ thành dải bụi xám rơi xuống.
      target.globalAlpha=.82*fade;target.strokeStyle="#b9c5c9";target.lineWidth=2;
      for(let n=0;n<4;n++){const px=-20+n*13,fall=(t*22+n*11)%35;target.beginPath();target.moveTo(px,-31+fall);target.quadraticCurveTo(px+5,-23+fall,px+1,-17+fall);target.stroke();}
      target.fillStyle="#d6e0e2";for(let n=0;n<5;n++){const px=-24+n*12,py=8+(t*13+n*7)%22;target.fillRect(px,py,2,4);}
    }else if(activeEffect==="faint"){
      // Ngất: dấu sao tắt dần và chữ Z lơ lửng trên đầu.
      target.globalAlpha=.72*fade;target.strokeStyle="#cbd7df";target.lineWidth=1.5;
      for(let n=0;n<3;n++){const aa=t*1.4+n*Math.PI*2/3,px=Math.cos(aa)*18,py=-43+Math.sin(aa)*7;target.beginPath();target.moveTo(px-3,py);target.lineTo(px+3,py);target.moveTo(px,py-3);target.lineTo(px,py+3);target.stroke();}
      target.fillStyle="#e2e8ed";target.font="bold 8px Arial";target.textAlign="center";target.fillText("Z",14,-39+Math.sin(t*3)*2);target.fillText("Z",21,-47+Math.sin(t*3+1)*2);
    }else if(activeEffect==="impact"){
      // Va chạm: giật lùi ngắn, tia va đập và vệt bụi; tuyệt đối không có chữ Z hay tư thế ngủ.
      const hit=Math.abs(Math.sin(t*10));
      target.globalAlpha=.95*fade;target.strokeStyle="#ffbd83";target.lineWidth=2.4;target.lineCap="round";
      for(let i=0;i<7;i++){const aa=i*Math.PI*2/7+t*.35,inner=10+hit*3,outer=25+hit*5;
        target.beginPath();target.moveTo(Math.cos(aa)*inner,Math.sin(aa)*inner-7);target.lineTo(Math.cos(aa)*outer,Math.sin(aa)*outer-7);target.stroke();}
      target.fillStyle="#fff2c9";target.beginPath();target.arc(0,-7,4+hit*2,0,Math.PI*2);target.fill();
      target.globalAlpha=.65*fade;target.strokeStyle="#dcecf0";target.lineWidth=1.5;
      for(let i=0;i<3;i++){const yy=19+i*5,dx=Math.sin(t*8+i)*4;target.beginPath();target.moveTo(-26+dx,yy);target.quadraticCurveTo(-12,yy+3,0,yy);target.stroke();}
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
       // Kiếm Ý: ngưng thần kết kiếm quyết, kiếm khí lơ lửng trước ấn quyết, không lao đi.
       const pulse=.72+.28*Math.sin(t*3.8),orbit=t*1.35;
       target.globalAlpha=.95*fade;target.shadowColor="#55dfff";target.shadowBlur=15;
       target.strokeStyle="#b9f5ff";target.lineWidth=2.3;target.lineCap="round";
       target.beginPath();target.moveTo(12,-5);target.quadraticCurveTo(22,-17,30,-27);target.moveTo(13,-1);target.quadraticCurveTo(24,-8,34,-18);target.stroke();
       target.save();target.translate(39,-31+Math.sin(t*3)*3);target.rotate(-.62);
       target.globalAlpha=pulse*fade;target.fillStyle="#efffff";target.strokeStyle="#70dcff";target.lineWidth=1.5;
       target.beginPath();target.moveTo(0,-27);target.lineTo(4,-8);target.lineTo(3,13);target.lineTo(-3,13);target.lineTo(-4,-8);target.closePath();target.fill();target.stroke();
       target.strokeStyle="#d7c18b";target.lineWidth=3;target.beginPath();target.moveTo(-8,11);target.lineTo(8,11);target.moveTo(0,13);target.lineTo(0,23);target.stroke();target.restore();
       target.globalAlpha=.7*fade;target.strokeStyle="#8ceaff";target.lineWidth=1.4;target.shadowBlur=8;
       for(let n=0;n<3;n++){const a=orbit+n*Math.PI*2/3;target.save();target.translate(35,-28);target.rotate(a*.18);target.beginPath();target.arc(0,0,17+n*5,-1.05,.72);target.stroke();target.restore();}
       target.shadowBlur=0;
     }
if(activeEffect==="cloud_step"){
      // Đạp Vân Bộ: mây tụ dưới chân kiếm, nhân vật bật lên theo từng nhịp.
      target.globalAlpha=.8*fade;target.fillStyle="#e8fbff";target.strokeStyle="#a5e8f0";target.lineWidth=1.5;
      const bounce=Math.abs(Math.sin(t*8));
      for(let n=0;n<3;n++){const xx=-12+n*12,yy=25+bounce*5+(n%2)*3;target.beginPath();target.ellipse(xx,yy,10,4,0,0,Math.PI*2);target.fill();target.stroke();}
      target.strokeStyle="rgba(204,249,255,.8)";target.beginPath();target.moveTo(-18,31);target.quadraticCurveTo(0,39,20,30);target.stroke();
    }
    if(activeEffect==="boost"&&!racer.isLegendaryThanSau&&!(racer.thanSauEatingTimer>0)){
       // Du Long Bộ: thanh long hiện rõ đầu, hàm, bờm, sừng, vảy, bụng giáp, bốn chân và đuôi.
       const phase=t*2.5,sway=Math.sin(phase),dragonY=-18+sway*3;
       target.save();target.globalAlpha=.94*fade;target.lineJoin="round";target.lineCap="round";
       const scaleDragon=1;
       // Thân uốn lượn dài, có sống lưng và bụng sáng phân đốt.
       const body=target.createLinearGradient(-72,dragonY-14,48,dragonY+16);
       body.addColorStop(0,"#155b78");body.addColorStop(.3,"#168f9c");body.addColorStop(.7,"#54d9c5");body.addColorStop(1,"#c4fff0");
       target.shadowColor="#39d9e8";target.shadowBlur=14;target.fillStyle=body;target.strokeStyle="#b8fff1";target.lineWidth=1.6;
       target.beginPath();target.moveTo(-77,dragonY+12);
       target.bezierCurveTo(-60,dragonY-2,-55,dragonY-24,-37,dragonY-15);
       target.bezierCurveTo(-20,dragonY-6,-20,dragonY+17,-2,dragonY+9);
       target.bezierCurveTo(16,dragonY+1,12,dragonY-22,31,dragonY-17);
       target.bezierCurveTo(43,dragonY-14,48,dragonY-7,53,dragonY-5);
       target.lineTo(47,dragonY+10);
       target.bezierCurveTo(25,dragonY+17,18,dragonY+30,0,dragonY+23);
       target.bezierCurveTo(-21,dragonY+18,-23,dragonY-1,-39,dragonY-3);
       target.bezierCurveTo(-55,dragonY-5,-59,dragonY+16,-77,dragonY+12);target.closePath();target.fill();target.stroke();
       target.shadowBlur=0;
       // Bụng rồng màu ngà chia thành từng phiến giáp cong.
       target.strokeStyle="#d9fff0";target.lineWidth=2.4;
       for(let i=0;i<8;i++){const x=-61+i*14,y=dragonY+7+Math.sin(i*.95+phase)*9;
         target.beginPath();target.moveTo(x-3,y-1);target.quadraticCurveTo(x,y+5,x+5,y+7);target.stroke();}
       // Vảy lưng hình giọt ngọc, chạy dọc theo đường cong thân.
       target.fillStyle="#a8fff0";target.strokeStyle="#e2fff6";target.lineWidth=.8;
       for(let i=0;i<13;i++){const x=-67+i*9.2,y=dragonY-7+Math.sin(i*.72+phase)*9;
         target.beginPath();target.moveTo(x-3,y);target.quadraticCurveTo(x,y-5,x+3,y);target.lineTo(x,y+3);target.closePath();target.fill();target.stroke();}
       // Bờm gáy thành từng tua cong sau đầu.
       target.strokeStyle="#9bfff0";target.lineWidth=2.2;
       for(let i=0;i<5;i++){const x=24-i*4,y=dragonY-13+i*4;
         target.beginPath();target.moveTo(x,y);target.quadraticCurveTo(x-11,y-7,x-15,y-15);target.stroke();}
       // Bốn chân có khớp và móng vuốt.
       target.strokeStyle="#bafff0";target.lineWidth=3;
       for(const lx of [-43,-8,24]){
         const ly=dragonY+8+Math.sin(phase+lx*.08)*3;
         target.beginPath();target.moveTo(lx,ly);target.lineTo(lx-3,ly+9);target.lineTo(lx+2,ly+13);
         target.moveTo(lx+2,ly+13);target.lineTo(lx+6,ly+10);target.moveTo(lx+2,ly+13);target.lineTo(lx+3,ly+17);target.stroke();
       }
       // Đầu rồng lớn, dáng đầu thú phương Đông nhìn nghiêng sang phải.
       const hx=52,hy=dragonY-13+Math.sin(phase+1)*2;
       const head=target.createLinearGradient(hx-13,hy-15,hx+17,hy+12);
       head.addColorStop(0,"#16778a");head.addColorStop(.55,"#63e2cd");head.addColorStop(1,"#d8fff0");
       target.fillStyle=head;target.strokeStyle="#e0fff5";target.lineWidth=1.7;
       target.beginPath();target.moveTo(hx-15,hy-7);target.quadraticCurveTo(hx-10,hy-20,hx+2,hy-17);
       target.quadraticCurveTo(hx+14,hy-17,hx+17,hy-7);target.quadraticCurveTo(hx+27,hy-3,hx+22,hy+4);
       target.quadraticCurveTo(hx+15,hy+11,hx+1,hy+8);target.lineTo(hx-10,hy+5);
       target.quadraticCurveTo(hx-20,hy+2,hx-15,hy-7);target.closePath();target.fill();target.stroke();
       // Mõm vuông, hàm dưới và miệng tách rõ.
       target.fillStyle="#aaffed";target.beginPath();target.moveTo(hx+5,hy-5);target.lineTo(hx+25,hy-2);
       target.quadraticCurveTo(hx+31,hy+2,hx+22,hy+7);target.lineTo(hx+5,hy+5);target.closePath();target.fill();target.stroke();
       target.fillStyle="#15576a";target.beginPath();target.moveTo(hx+4,hy+5);target.quadraticCurveTo(hx+17,hy+13,hx+25,hy+6);target.lineTo(hx+17,hy+12);target.closePath();target.fill();
       // Mũi, lỗ mũi, răng nanh và ria rồng.
       target.fillStyle="#164f5e";target.beginPath();target.arc(hx+23,hy+1,1.5,0,Math.PI*2);target.arc(hx+17,hy+1,1.2,0,Math.PI*2);target.fill();
       target.fillStyle="#fff8d4";target.beginPath();target.moveTo(hx+12,hy+5);target.lineTo(hx+15,hy+10);target.lineTo(hx+17,hy+5);target.closePath();target.fill();
       target.strokeStyle="#d7fff2";target.lineWidth=1.5;target.beginPath();
       target.moveTo(hx+19,hy+5);target.quadraticCurveTo(hx+29,hy+14,hx+39,hy+10);
       target.moveTo(hx+17,hy+7);target.quadraticCurveTo(hx+25,hy+20,hx+35,hy+20);target.stroke();
       // Sừng phân nhánh, tai và cặp râu hướng ngược gió.
       target.strokeStyle="#f4d68e";target.lineWidth=3;target.beginPath();
       target.moveTo(hx-8,hy-12);target.quadraticCurveTo(hx-17,hy-26,hx-12,hy-32);
       target.moveTo(hx+1,hy-15);target.quadraticCurveTo(hx+7,hy-29,hx+17,hy-28);
       target.moveTo(hx-10,hy-6);target.quadraticCurveTo(hx-23,hy-13,hx-27,hy-5);target.stroke();
       target.strokeStyle="#baffef";target.lineWidth=2;target.beginPath();
       target.moveTo(hx-12,hy+1);target.quadraticCurveTo(hx-28,hy+5,hx-35,hy+1);
       target.moveTo(hx-9,hy+5);target.quadraticCurveTo(hx-24,hy+15,hx-34,hy+12);target.stroke();
       // Mắt hổ phách có đồng tử dọc và lông mày nổi.
       target.fillStyle="#fff0a8";target.beginPath();target.ellipse(hx+7,hy-8,3.2,2.4,-.2,0,Math.PI*2);target.fill();
       target.fillStyle="#173e45";target.fillRect(hx+6,hy-10,1.5,4);
       target.strokeStyle="#155d69";target.lineWidth=2.4;target.beginPath();target.moveTo(hx+1,hy-12);target.lineTo(hx+12,hy-14);target.stroke();
       // Đuôi dài chẻ đôi như đuôi cá rồng.
       target.fillStyle="#37bcae";target.strokeStyle="#c4fff0";target.lineWidth=1.3;
       target.beginPath();target.moveTo(-72,dragonY+10);target.quadraticCurveTo(-91,dragonY+12,-98,dragonY+2);
       target.quadraticCurveTo(-84,dragonY+4,-81,dragonY-7);target.quadraticCurveTo(-74,dragonY+1,-72,dragonY+10);target.closePath();target.fill();target.stroke();
       target.globalAlpha=.58*fade;target.strokeStyle="#b6fff2";target.lineWidth=2;
       for(let i=0;i<3;i++){const yy=dragonY+22+i*6;target.beginPath();target.moveTo(-66-i*3,yy);target.quadraticCurveTo(-87-i*3,yy-6,-104-i*3,yy-1);target.stroke();}
       target.restore();
     }
if(activeEffect==="sword_spin"){
      // Kiếm Vũ: nhiều phi kiếm hiện hình rõ, lần lượt lướt chém chéo qua trước và sau nhân vật; không tạo vòng tròn.
      target.save();target.lineJoin="round";target.lineCap="round";
      for(let i=0;i<3;i++){
        const phaseSword=t*4.2+i*Math.PI*2/3;
        const sweep=Math.sin(phaseSword)*.34;
        const sx=-24+i*24+Math.cos(phaseSword)*5,sy=-25+Math.sin(phaseSword*1.2)*9;
        target.save();target.translate(sx,sy);target.rotate(-.62+sweep);
        target.globalAlpha=(.62+i*.1)*fade;target.shadowColor="#78dcff";target.shadowBlur=11;
        const blade=target.createLinearGradient(-4,-25,4,20);
        blade.addColorStop(0,"#ffffff");blade.addColorStop(.48,"#b9f2ff");blade.addColorStop(1,"#4c9fc9");
        target.fillStyle=blade;target.strokeStyle="#eaffff";target.lineWidth=1.2;
        target.beginPath();target.moveTo(0,-31);target.lineTo(4,-19);target.lineTo(3,14);target.lineTo(0,20);target.lineTo(-3,14);target.lineTo(-4,-19);target.closePath();target.fill();target.stroke();
        target.shadowBlur=0;target.strokeStyle="#f1d28a";target.lineWidth=2.8;
        target.beginPath();target.moveTo(-8,13);target.quadraticCurveTo(0,17,8,13);target.stroke();
        target.strokeStyle="#b88a50";target.lineWidth=3.2;target.beginPath();target.moveTo(0,17);target.lineTo(0,27);target.stroke();
        target.fillStyle="#fff0bd";target.beginPath();target.arc(0,29,2,0,Math.PI*2);target.fill();
        target.globalAlpha=.5*fade;target.strokeStyle="#a8edff";target.lineWidth=2;
        target.beginPath();target.moveTo(0,-26);target.lineTo(0,-43);target.stroke();
        target.restore();
      }
      // Một nhát kiếm quang chéo ngắn nhấn nhịp múa kiếm.
      target.globalAlpha=.55*fade;target.strokeStyle="#e7fbff";target.lineWidth=2.2;target.shadowColor="#7ddfff";target.shadowBlur=9;
      const slash=Math.sin(t*5)*5;target.beginPath();target.moveTo(-39,18+slash);target.quadraticCurveTo(-5,-3-slash,32,-34+slash);target.stroke();
      target.shadowBlur=0;target.restore();
    }
    if(activeEffect==="pill"){
      // Tay lấy linh đan, đưa lên miệng rồi nuốt; viên đan biến mất.
      const reach=Math.min(1,progress/.28),drink=Math.max(0,Math.min(1,(progress-.28)/.34));
      const smooth=n=>n*n*(3-2*n),lift=smooth(reach),toMouth=smooth(drink);
      const handX=12-7*toMouth,handY=-5-20*lift+10*toMouth;
      target.globalAlpha=.98*fade;target.strokeStyle=skin;target.lineWidth=4.2;target.lineCap="round";
      target.beginPath();target.moveTo(9,-3);target.quadraticCurveTo(15,-13,handX,handY+3);target.stroke();
      target.fillStyle=skin;target.beginPath();target.arc(handX,handY,3.2,0,Math.PI*2);target.fill();
      if(progress<.64){target.fillStyle="#e8a9f2";target.strokeStyle="#fff0c7";target.lineWidth=1.2;target.shadowColor="#ffb7ff";target.shadowBlur=8;target.beginPath();target.ellipse(handX-1,handY-5,3.2,4.2,.3,0,Math.PI*2);target.fill();target.stroke();target.shadowBlur=0;}
      if(progress>.48){target.globalAlpha=.35*fade;target.fillStyle="#ffe9a8";target.beginPath();target.ellipse(0,-20,10,12,0,0,Math.PI*2);target.fill();}
    }
    if(activeEffect==="qi_pill"){
      // Tụ Khí Đan: giơ viên đan xanh ngọc lên cao, nuốt rồi hấp thu linh khí.
      const lift=Math.min(1,progress/.24),drink=Math.max(0,Math.min(1,(progress-.24)/.30));
      const smooth=n=>n*n*(3-2*n),p=smooth(lift),q=smooth(drink),hx=13-10*q,hy=-8-18*p+8*q;
      target.globalAlpha=.98*fade;target.strokeStyle=skin;target.lineWidth=4.4;target.lineCap="round";
      target.beginPath();target.moveTo(9,-2);target.quadraticCurveTo(19,-17,hx,hy+3);target.stroke();
      target.fillStyle=skin;target.beginPath();target.arc(hx,hy,3.1,0,Math.PI*2);target.fill();
      if(progress<.54){target.shadowColor="#65f2d1";target.shadowBlur=12;target.fillStyle="#67d8b5";target.strokeStyle="#e1fff2";target.lineWidth=1.4;target.beginPath();target.moveTo(hx,hy-11);target.quadraticCurveTo(hx+7,hy-3,hx,hy+1);target.quadraticCurveTo(hx-7,hy-3,hx,hy-11);target.closePath();target.fill();target.stroke();target.shadowBlur=0;}
      target.globalAlpha=.7*fade;target.strokeStyle="#8fffe0";target.lineWidth=1.4;
      for(let n=0;n<3;n++){const aa=t*3+n*Math.PI*2/3;target.beginPath();target.arc(0,-20,13+n*4,aa,aa+1.2);target.stroke();}
      if(progress>.54){target.globalAlpha=.42*fade;target.fillStyle="#a5ffe5";target.beginPath();target.arc(0,-20,11+Math.sin(t*8)*2,0,Math.PI*2);target.fill();}
    }

    if(activeEffect==="formation"){
      // Tụ Linh Trận: trận đồ ba tầng, bát quái, linh tuyến nối các trận nhãn và phù văn cổ.
      const rot=-t*.58,pulse=.88+.12*Math.sin(t*5);
      target.globalAlpha=.96*fade;target.save();target.translate(0,27);target.rotate(rot);
      target.shadowColor="#b98cff";target.shadowBlur=13;target.strokeStyle="#d9c0ff";target.lineWidth=1.8;
      for(const radius of [39,31,19]){target.beginPath();target.arc(0,0,radius*pulse,0,Math.PI*2);target.stroke();}
      for(let n=0;n<8;n++){const a=n*Math.PI/4,px=Math.cos(a)*36,py=Math.sin(a)*36;
        target.beginPath();target.moveTo(Math.cos(a)*19,Math.sin(a)*19);target.lineTo(px,py);target.stroke();
        target.beginPath();target.moveTo(Math.cos(a)*31,Math.sin(a)*31);target.lineTo(Math.cos(a+.18)*39,Math.sin(a+.18)*39);target.stroke();
        target.fillStyle="#f4e9ff";target.beginPath();target.arc(px,py,3,0,Math.PI*2);target.fill();
      }
      target.strokeStyle="#f3dcff";target.lineWidth=1.5;target.beginPath();
      for(let n=0;n<8;n++){const a=n*Math.PI/4-Math.PI/2,px=Math.cos(a)*31,py=Math.sin(a)*31;n?target.lineTo(px,py):target.moveTo(px,py);}target.closePath();target.stroke();
      target.shadowBlur=0;target.fillStyle="#fff0ff";target.font="bold 9px serif";target.textAlign="center";target.textBaseline="middle";
      for(let n=0;n<8;n++){const a=n*Math.PI/4;target.fillText(["乾","坎","艮","震","巽","離","坤","兌"][n],Math.cos(a)*25,Math.sin(a)*25);}
      target.restore();
    }
    if(activeEffect==="formation_sword"||activeEffect==="formation_seal"){
      const rot=t*(activeEffect==="formation_sword"?1.15:.42);
      target.save();target.globalAlpha=.96*fade;
      if(activeEffect==="formation_sword"){
        // Vạn Kiếm Trận: tám phi kiếm dài, thấy rõ lưỡi kiếm, chắn tay, chuôi và kiếm quang.
        target.translate(5,-12);target.shadowColor="#75dfff";target.shadowBlur=16;
        for(let n=0;n<8;n++){
          const a=rot+n*Math.PI/4,px=Math.cos(a)*43,py=Math.sin(a)*32;
          target.save();target.translate(px,py);target.rotate(a+Math.PI/2);
          const blade=target.createLinearGradient(-4,0,4,0);
          blade.addColorStop(0,"#5bb8df");blade.addColorStop(.48,"#f4ffff");blade.addColorStop(1,"#78d9ff");
          target.fillStyle=blade;target.strokeStyle="#e5fbff";target.lineWidth=1.2;
          target.beginPath();target.moveTo(0,-23);target.lineTo(4,-9);target.lineTo(3,10);target.lineTo(0,15);target.lineTo(-3,10);target.lineTo(-4,-9);target.closePath();target.fill();target.stroke();
          target.strokeStyle="#f3d48b";target.lineWidth=2.5;target.beginPath();target.moveTo(-7,10);target.lineTo(7,10);target.stroke();
          target.strokeStyle="#c99b58";target.lineWidth=2;target.beginPath();target.moveTo(0,12);target.lineTo(0,23);target.stroke();
          target.fillStyle="#fff0bd";target.beginPath();target.arc(0,24,1.8,0,Math.PI*2);target.fill();
          target.globalAlpha=.7;target.strokeStyle="#b8f4ff";target.lineWidth=1.5;target.beginPath();target.moveTo(0,-17);target.lineTo(0,7);target.stroke();
          target.restore();
        }
        target.shadowBlur=0;
      }else{
        // Bát Quái Trận: tám phù trận nhỏ mở ra theo vòng bát quái, nối bằng linh tuyến.
        target.translate(0,5);target.rotate(rot*.35);target.strokeStyle="#d8b7ff";target.shadowColor="#b78aff";target.shadowBlur=10;target.lineWidth=1.6;
        target.beginPath();target.arc(0,0,34,0,Math.PI*2);target.stroke();
        for(let n=0;n<8;n++){const a=n*Math.PI/4,px=Math.cos(a)*34,py=Math.sin(a)*34;target.beginPath();target.moveTo(0,0);target.lineTo(px,py);target.stroke();target.fillStyle="#f5eaff";target.fillRect(px-3,py-5,6,10);}
        target.shadowBlur=0;
      }
      target.restore();
    }
    if(activeEffect==="wind_step"){
       // Phong Hành: ba dải phong lụa song song, thuôn nhọn về sau như luồng khí lướt tốc độ cao.
       const flow=t*2.8,drift=Math.sin(flow)*3;
       target.save();target.globalAlpha=.88*fade;target.lineCap="round";target.lineJoin="round";
       const bands=[{y:-25,w:5,a:.42},{y:-7,w:7,a:.72},{y:12,w:5,a:.48}];
       for(let i=0;i<bands.length;i++){
         const b=bands[i],s=Math.sin(flow+i*.7)*2;
         target.globalAlpha=b.a*fade;
         const ribbon=target.createLinearGradient(-68,b.y,42,b.y);
         ribbon.addColorStop(0,"rgba(110,220,207,0)");ribbon.addColorStop(.38,"#65cfc2");ribbon.addColorStop(.78,"#c9fff0");ribbon.addColorStop(1,"rgba(240,255,247,0)");
         target.fillStyle=ribbon;target.beginPath();
         target.moveTo(-68,b.y+drift+s);target.bezierCurveTo(-38,b.y-7+s,-4,b.y-5-s,25,b.y-1);
         target.lineTo(43,b.y-5);target.bezierCurveTo(19,b.y+7+s,-15,b.y+8+s,-68,b.y+4+s);target.closePath();target.fill();
       }
       // Những vệt khí mảnh chạy cùng một hướng, không giao cắt nguệch ngoạc.
       target.globalAlpha=.72*fade;target.strokeStyle="#edfff8";target.lineWidth=1.35;target.shadowColor="#8cebd9";target.shadowBlur=7;
       for(let i=0;i<4;i++){
         const yy=-31+i*18,offset=((flow*19+i*23)%24);
         target.beginPath();target.moveTo(-61+offset,yy);target.bezierCurveTo(-36+offset,yy-2,-14+offset,yy-1,12+offset,yy-4);target.stroke();
       }
       target.shadowBlur=0;
       // Làn gió cuộn dưới phi kiếm thành hai cung mềm, cùng chiều chuyển động.
       target.globalAlpha=.58*fade;target.strokeStyle="#a8f4e6";target.lineWidth=2;
       for(let i=0;i<2;i++){target.beginPath();target.moveTo(-39,24+i*5);target.bezierCurveTo(-17,15+i*5,9,31+i*4,34,20+i*4);target.stroke();}
       target.restore();
     }
if(activeEffect==="shadow_step"){
       // Ảnh Độn: người chợt tan thành ba bóng lệch nhịp rồi hiện hình ở điểm kế tiếp; không dùng vòng tròn.
       const blink=.18+.82*Math.abs(Math.sin(progress*Math.PI*2.2));
       for(let n=3;n>=1;n--){target.globalAlpha=(.10+n*.075)*fade;target.fillStyle=n%2?"#b8b0ff":"#7d72c9";target.save();target.translate(-n*15,Math.sin(t*8+n)*4);target.scale(.88,1);target.beginPath();target.ellipse(0,0,11,20,-.12,0,Math.PI*2);target.fill();target.restore();}
       target.globalAlpha=blink*fade;target.strokeStyle="#e5ddff";target.lineWidth=2.1;target.shadowColor="#a89aff";target.shadowBlur=13;
       for(let n=0;n<4;n++){const yy=-26+n*15;target.beginPath();target.moveTo(-39,yy);target.lineTo(-22,yy-5);target.lineTo(-10,yy+1);target.stroke();}
       target.shadowBlur=0;target.fillStyle="#eeeaff";target.globalAlpha=.75*blink*fade;
       for(let n=0;n<4;n++){const px=-23+n*13,py=22+Math.sin(t*9+n)*3;target.fillRect(px,py,3,2);}
     }
if(activeEffect==="sword_dash"){
       // Kiếm Độn: một thanh phi kiếm lam bạc hoàn chỉnh lao ngang, mũi nhọn hướng về trước.
       const surge=.9+.1*Math.sin(t*15),bladeGlow=target.createLinearGradient(-42,0,66,0);
       bladeGlow.addColorStop(0,"#4c9fc4");bladeGlow.addColorStop(.22,"#b9f3ff");bladeGlow.addColorStop(.72,"#f4ffff");bladeGlow.addColorStop(1,"#65cfff");
       target.save();target.globalAlpha=.98*fade;target.shadowColor="#4bd5ff";target.shadowBlur=17;
       // Lưỡi kiếm dài, sống kiếm nổi và hai cạnh rõ nét.
       target.fillStyle=bladeGlow;target.strokeStyle="#eaffff";target.lineWidth=1.5;
       target.beginPath();target.moveTo(-28,-5);target.lineTo(43,-6*surge);target.lineTo(68,0);target.lineTo(43,6*surge);target.lineTo(-28,5);target.closePath();target.fill();target.stroke();
       target.strokeStyle="#ffffff";target.lineWidth=1.2;target.beginPath();target.moveTo(-20,-1);target.lineTo(59,0);target.stroke();
       // Chắn tay kiếm có cánh cong, chuôi quấn dây và chụp chuôi.
       target.shadowBlur=0;target.strokeStyle="#f4d28c";target.lineWidth=3.5;target.lineCap="round";
       target.beginPath();target.moveTo(-28,-12);target.quadraticCurveTo(-17,0,-28,12);target.stroke();
       target.strokeStyle="#9b6b38";target.lineWidth=5;target.beginPath();target.moveTo(-33,0);target.lineTo(-53,0);target.stroke();
       target.strokeStyle="#f5dca4";target.lineWidth=1.4;
       for(let n=0;n<4;n++){const xx=-50+n*4.5;target.beginPath();target.moveTo(xx,-3);target.lineTo(xx+5,3);target.stroke();}
       target.fillStyle="#e9c47e";target.beginPath();target.arc(-56,0,3.4,0,Math.PI*2);target.fill();
       // Kiếm quang kéo dài phía sau nhưng không che hình dáng thanh kiếm.
       target.globalAlpha=.38*fade;target.strokeStyle="#78e7ff";target.lineWidth=3;
       for(let n=0;n<3;n++){const yy=-13+n*13,off=(t*38+n*17)%22;target.beginPath();target.moveTo(-77+off,yy);target.bezierCurveTo(-56+off,yy-3,-44+off,yy+3,-31+off,yy);target.stroke();}
       target.restore();
     }
if(activeEffect==="cloud_stride"){
       // Lưu Vân Bộ: bước nhẹ liên hoàn, mây dài tách thành từng dải lụa trắng xanh trôi về sau.
       const drift=t*1.7;target.globalAlpha=.82*fade;target.strokeStyle="#e4fbff";target.lineWidth=2;target.shadowColor="#a8e8ff";target.shadowBlur=8;
       for(let n=0;n<3;n++){const yy=17+n*6,offset=Math.sin(drift+n*1.1)*5;target.beginPath();target.moveTo(-48,yy+offset);target.bezierCurveTo(-27,yy-11-offset,-5,yy+10+offset,18,yy-2);target.bezierCurveTo(30,yy-8,39,yy-3,48,yy-7);target.stroke();}
       target.shadowBlur=0;target.fillStyle="#f4ffff";
       for(let n=0;n<4;n++){const px=-27+n*17+Math.sin(drift+n)*4;target.beginPath();target.ellipse(px,27+Math.cos(drift+n)*2,7,2.4,0,0,Math.PI*2);target.fill();}
     }
     if(activeEffect==="body_burst"){
       // Bạo Bộ: dồn lực ở chân, bật vọt lên; chỉ để lại luồng khí trắng xanh, không có hạt vàng.
       const leap=Math.abs(Math.sin(progress*Math.PI*2.2));
       target.globalAlpha=.9*fade;target.strokeStyle="#c8f4ef";target.lineWidth=2;target.shadowColor="#83dfd3";target.shadowBlur=7;
       for(let n=0;n<3;n++){const spread=12+leap*12+n*5;target.beginPath();target.moveTo(-spread,27+n*3);target.quadraticCurveTo(0,34+leap*9+n*3,spread,27+n*3);target.stroke();}
       target.shadowBlur=0;
     }
if(activeEffect==="talisman"||activeEffect==="talisman_guard"||activeEffect==="talisman_thunder"){
      // Phù chú có hành động riêng: phù tốc xoay vòng, hộ thân kết thành khiên, lôi phù phóng sét.
      const count=activeEffect==="talisman"?4:activeEffect==="talisman_guard"?5:3;
      target.globalAlpha=.98*fade;target.shadowColor=activeEffect==="talisman_thunder"?"#7feaff":"#ffd86e";target.shadowBlur=10;
      for(let n=0;n<count;n++){
        const a=t*(activeEffect==="talisman_thunder"?-1.8:2.6)+n*Math.PI*2/count;
        const px=activeEffect==="talisman_guard"?17+Math.cos(a)*24:Math.cos(a)*31;
        const py=activeEffect==="talisman_guard"?-5+Math.sin(a)*24:-17+Math.sin(a)*25;
        target.save();target.translate(px,py);target.rotate(activeEffect==="talisman_thunder"?-.3+Math.sin(a)*.18:Math.sin(a)*.35);
        target.fillStyle=activeEffect==="talisman_thunder"?"#d9f7ff":"#f5d77e";target.strokeStyle=activeEffect==="talisman_thunder"?"#4b9fce":"#a94b32";target.lineWidth=1;
        target.fillRect(-4,-10,8,19);target.strokeRect(-4,-10,8,19);
        target.strokeStyle="#a94336";target.lineWidth=1.1;target.beginPath();target.moveTo(0,-7);target.lineTo(-2,-3);target.lineTo(2,0);target.lineTo(-1,4);target.lineTo(1,7);target.stroke();
        target.restore();
        if(activeEffect==="talisman_thunder"){target.strokeStyle="#b7f5ff";target.lineWidth=2;target.beginPath();target.moveTo(px,py+9);target.lineTo(px-5,py+17);target.lineTo(px+1,py+22);target.lineTo(px-4,py+30);target.stroke();}
      }
      // Hộ Thân Phù chỉ giữ các lá phù bay độc lập quanh người, không có dây nối màu xanh.
      target.shadowBlur=0;
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
  }
}
function drawRacer(target, racer, x, y, scale, time) {
  if (!racer || !racer.isLegendaryThanSau) {
    return __drawRacerBaseThanSau(target, racer, x, y, scale, time);
  }
  if (!__thanSauSpriteReady || !__thanSauSpriteSheet.naturalWidth || !__thanSauSpriteSheet.naturalHeight) {
    drawThanSauSummonPlaceholder(target,x,y,scale,time);
    return;
  }
  const columns=5,rows=2,frameCount=10;
  const frameWidth=__thanSauSpriteSheet.naturalWidth/columns,frameHeight=__thanSauSpriteSheet.naturalHeight/rows;
  const frameIndex=((Math.floor(time/105+(racer.phase||0)*2)%frameCount)+frameCount)%frameCount;
  const sx=(frameIndex%columns)*frameWidth,sy=Math.floor(frameIndex/columns)*frameHeight;
  const phase=time*.001,active=racer.effectTimer>0&&shouldDrawRaceEffect(target,racer,time),activeEffect=active?(racer.effectType||""):"";
  const duration=Math.max(.001,racer.effectDuration||racer.effectTimer||1);
  const progress=clamp(1-racer.effectTimer/duration,0,1);
  const wave=Math.sin(phase*7+(racer.phase||0)),pulse=Math.sin(phase*10+(racer.phase||0));
  let actionX=0,actionY=0,actionAngle=0;
  switch(activeEffect){
   case "poison":actionX=wave*1.8;actionAngle=wave*.075;break;case "weak":actionY=2+Math.abs(wave)*1.8;actionAngle=.12+wave*.025;break;
   case "pill":actionY=-3-Math.abs(wave)*3;actionAngle=-.045;break;case "qi_pill":actionY=-2-Math.abs(Math.sin(phase*12))*4;actionX=2+Math.sin(phase*5)*2;actionAngle=-.08;break;case "impact":actionY=Math.abs(pulse)*9;actionX=Math.sin(phase*18)*2;actionAngle=wave*.14;break;
   case "lightning":actionX=Math.sin(phase*38)*3.5;actionY=Math.cos(phase*31)*2;actionAngle=Math.sin(phase*34)*.09;break;
   case "gale":actionX=wave*3;actionY=Math.sin(phase*5)*2;actionAngle=wave*.27;break;case "dizzy":actionAngle=Math.sin(phase*8+racer.phase)*.72;break;
   case "faint":actionY=4+Math.abs(wave)*2;actionAngle=.34+Math.sin(phase*5)*.07;break;case "boost":actionX=3+Math.sin(phase*7)*3;actionY=-3-Math.sin(phase*6)*3;actionAngle=.08+Math.sin(phase*7)*.12;break;
   case "sword_intent":actionX=1+Math.sin(phase*5)*.8;actionY=-1;actionAngle=-.035+Math.sin(phase*4)*.018;break;case "cloud_step":actionY=-Math.abs(Math.sin(phase*8))*10;actionAngle=.11;break;
   case "formation":actionX=Math.sin(phase*4)*3;actionY=Math.cos(phase*4)*3;actionAngle=Math.sin(phase*4)*.08;break;
   case "formation_sword":actionX=3+Math.sin(phase*8)*2;actionAngle=-.18;break;
   case "formation_seal":actionX=Math.sin(phase*5)*2;actionY=-2-Math.abs(Math.sin(phase*6))*2;actionAngle=.06*Math.sin(phase*4);break;
   case "talisman":actionX=5+Math.sin(phase*9)*2;actionY=-2-Math.abs(Math.sin(phase*7))*3;actionAngle=-.12;break;
   case "talisman_guard":actionX=Math.sin(phase*4)*1.5;actionAngle=-.08;break;
   case "talisman_thunder":actionX=5+Math.sin(phase*14)*2;actionY=-3;actionAngle=-.22;break;
   case "sword_spin":actionAngle=-.06+Math.sin(phase*5)*.045;actionX=2+Math.sin(phase*7)*2;actionY=-3-Math.abs(Math.sin(phase*6))*3;break;
   case "wind_step":actionX=Math.sin(phase*11+racer.phase)*7;actionY=-3-Math.abs(Math.sin(phase*8))*4;actionAngle=Math.sin(phase*11+racer.phase)*.22;break;
   case "shadow_step":actionX=progress<.22?-9:progress<.48?17:Math.sin(phase*18)*2;actionY=-Math.sin(progress*Math.PI)*7;actionAngle=progress<.48?-.24:.08;break;
   case "sword_dash":actionX=13+Math.sin(phase*16)*2;actionY=-4-Math.abs(Math.sin(phase*12))*2;actionAngle=-.48;break;
   case "body_burst":actionY=progress<.22?4: -Math.abs(Math.sin(phase*9))*11;actionX=progress<.22?-3:5+Math.sin(phase*7)*2;actionAngle=progress<.22?.18:-.08;break;case "cloud_stride":actionX=2+Math.sin(phase*4)*4;actionY=-4-Math.sin(phase*3)*3;actionAngle=-.04+Math.sin(phase*3)*.06;break;
  }
  const bob=Math.sin(time*.009+(racer.phase||0))*1.2;
  target.save();// Sprite pixel luôn thẳng đứng; hiệu ứng chỉ dịch chuyển thân, không xoay cả khung ảnh.
  target.translate(x+actionX,y+bob+actionY);
  target.scale(scale*1.08,scale*1.08);target.imageSmoothingEnabled=false;
  // Giữ nguyên tỷ lệ khung ảnh pixel gốc (không ép frame dọc thành hình vuông).
  const drawHeight=108,drawWidth=drawHeight*(frameWidth/frameHeight);
  const drawLeft=-drawWidth/2,drawTop=-drawHeight/2;
  const glow=target.createRadialGradient(0,0,5,0,0,Math.max(58,drawHeight*.58));
  glow.addColorStop(0,active?"rgba(255,224,145,.38)":"rgba(255,220,145,.28)");glow.addColorStop(1,"rgba(255,220,145,0)");
  target.fillStyle=glow;target.fillRect(drawLeft-9,drawTop-4,drawWidth+18,drawHeight+8);
  target.drawImage(__thanSauSpriteSheet,sx,sy,frameWidth,frameHeight,drawLeft,drawTop,drawWidth,drawHeight);
  const eatingBun=!!(racer.isLegendaryThanSau&&racer.thanSauEatingTimer>0&&active&&activeEffect==="boost");
  const eatProgress=eatingBun?clamp(1-racer.thanSauEatingTimer/.9,0,1):0;
  const bowlX=eatingBun?29-17*Math.sin(eatProgress*Math.PI/2):29;
  const bowlY=eatingBun?-1-24*Math.sin(eatProgress*Math.PI/2):-1;
  const bowlTilt=eatingBun?-.12-.72*Math.sin(eatProgress*Math.PI/2):-.12;
  target.save();target.translate(bowlX,bowlY);target.rotate(bowlTilt);
  target.fillStyle="#8d342b";target.beginPath();target.ellipse(0,11,16,5.8,0,0,Math.PI*2);target.fill();
  const bowlGrad=target.createLinearGradient(0,1,0,19);bowlGrad.addColorStop(0,"#f4e2bb");bowlGrad.addColorStop(.45,"#d65c43");bowlGrad.addColorStop(1,"#7e2926");
  target.fillStyle=bowlGrad;target.beginPath();target.moveTo(-15,2);target.quadraticCurveTo(-13,18,0,19);target.quadraticCurveTo(13,18,15,2);target.quadraticCurveTo(0,7,-15,2);target.closePath();target.fill();
  target.fillStyle="#f7e8c8";target.beginPath();target.ellipse(0,2,15.5,5.5,0,0,Math.PI*2);target.fill();
  const soupGrad=target.createRadialGradient(-3,0,1,0,2,14);soupGrad.addColorStop(0,"#f5a04c");soupGrad.addColorStop(.58,"#d84a2f");soupGrad.addColorStop(1,"#8f2928");
  target.fillStyle=soupGrad;target.beginPath();target.ellipse(0,2,13.3,4.1,0,0,Math.PI*2);target.fill();
  target.strokeStyle="#fff0cf";target.lineWidth=1.7;target.lineCap="round";
  for(let n=0;n<4;n++){const nx=-8+n*5;target.beginPath();target.moveTo(nx-2,1);target.bezierCurveTo(nx-5,-4,nx+4,-4,nx+1,1);target.bezierCurveTo(nx-2,5,nx+5,5,nx+3,1);target.stroke();}
  target.fillStyle="#f36b4b";target.beginPath();target.moveTo(-11,1);target.lineTo(-6,-2);target.lineTo(-5,2);target.closePath();target.fill();
  target.beginPath();target.moveTo(5,1);target.lineTo(10,-2);target.lineTo(11,2);target.closePath();target.fill();
  target.fillStyle="#f2d7a0";target.beginPath();target.ellipse(-1,-.4,3.4,1.8,-.3,0,Math.PI*2);target.ellipse(7,2,2.7,1.4,.2,0,Math.PI*2);target.fill();
  target.fillStyle="#74a85c";target.beginPath();target.ellipse(-3,-1.6,2.3,1,-.5,0,Math.PI*2);target.ellipse(3,3,2,1,.4,0,Math.PI*2);target.fill();
  target.fillStyle="#c72e24";target.beginPath();target.ellipse(-8,3,2.3,1.1,-.3,0,Math.PI*2);target.ellipse(9,-.5,1.8,.9,.2,0,Math.PI*2);target.fill();
  target.strokeStyle="#ffe7b3";target.lineWidth=1;target.beginPath();target.ellipse(0,2,15.5,5.5,0,0,Math.PI*2);target.stroke();
  if(eatingBun&&eatProgress>.18){
    const pour=clamp((eatProgress-.18)/.72,0,1),mouthX=1,mouthY=-39;
    target.save();target.globalAlpha=.95*(1-pour*.18);target.strokeStyle="#fff0d2";target.lineWidth=2.1;target.lineCap="round";
    target.beginPath();target.moveTo(bowlX-5,bowlY-2);target.bezierCurveTo(bowlX-13,bowlY-15,-5,-23,mouthX,mouthY+5);target.stroke();
    target.strokeStyle="#e85a35";target.lineWidth=1.6;target.beginPath();target.moveTo(bowlX-1,bowlY+1);target.quadraticCurveTo(bowlX-7,bowlY-17,mouthX+2,mouthY+7);target.stroke();
    target.fillStyle="#f8e9c7";target.beginPath();target.arc(mouthX,mouthY+5,2.1,0,Math.PI*2);target.fill();target.restore();
  }
  if(eatingBun||(racer.isLegendaryThanSau&&racer.thanSauEatingTimer>0)){
    const steam=time*.008;target.globalAlpha=.88;target.strokeStyle="#fff2cf";target.lineWidth=1.6;
    for(let i=0;i<5;i++){const steamX=-9+i*4.5,steamY=-7-Math.sin(steam+i)*3;target.beginPath();target.moveTo(steamX,steamY);target.quadraticCurveTo(steamX-3,-14-Math.sin(steam+i)*2,steamX+1,-21-Math.sin(steam+i)*3);target.stroke();}
    target.fillStyle="#ff704d";target.beginPath();target.arc(-14,-4,2.2,0,Math.PI*2);target.arc(14,-7,1.8,0,Math.PI*2);target.fill();
    target.fillStyle="#ffd46d";target.beginPath();target.arc(-11,-10,1.3,0,Math.PI*2);target.arc(12,-14,1.1,0,Math.PI*2);target.fill();
  }
  target.restore();
  if(active)drawThanSauEffect(target,racer,time);
  // Lớp đặc trưng Ăn Bún Chua Cay luôn vẽ sau hiệu ứng chung để không bị Du Long Bộ che.
  if(eatingBun){
    target.save();
    const foodPulse=.75+.25*Math.sin(time*.018);
    target.globalAlpha=.9;
    target.shadowColor="#ff7448";target.shadowBlur=9;
    target.strokeStyle="#ff9b58";target.lineWidth=1.8;
    target.beginPath();target.ellipse(bowlX-3,bowlY-1,20*foodPulse,8*foodPulse,-.35,Math.PI*1.05,Math.PI*1.92);target.stroke();
    target.shadowBlur=0;
    for(let n=0;n<5;n++){
      const a=time*.006+n*Math.PI*2/5,px=bowlX+Math.cos(a)*(19+n%2*4),py=bowlY-8+Math.sin(a)*10;
      target.globalAlpha=.65+.3*Math.sin(time*.02+n);
      target.fillStyle=n%2?"#ff6745":"#ffd46d";
      target.beginPath();target.arc(px,py,1.5+(n%2)*.6,0,Math.PI*2);target.fill();
    }
    target.globalAlpha=.88;target.strokeStyle="#fff0cf";target.lineWidth=1.4;
    for(let n=0;n<3;n++){
      const sx=bowlX-5+n*5,sy=bowlY-8;
      target.beginPath();target.moveTo(sx,sy);target.quadraticCurveTo(sx-5,-24-n*2,sx+1,-34-n*2);target.stroke();
    }
    target.restore();
  }
  if(active&&racer.effectName&&target!==cameraCtx){
    target.save();target.font="bold 7px Arial,sans-serif";target.textAlign="center";target.textBaseline="middle";
    target.lineJoin="round";target.lineWidth=2.2;target.strokeStyle="rgba(14,25,24,.98)";
    target.strokeText(racer.effectName,0,-65,126);target.fillStyle="#fff1bd";target.fillText(racer.effectName,0,-65,126);target.restore();
  }
  target.restore();
}



// REVISION 132 — HUD thời gian dùng vùng riêng, co giãn theo chiều rộng hiển thị.
function drawRaceHud() {
  const remaining=Math.max(0,duration-elapsed);
  const viewWidth=(typeof canvas!=="undefined"&&canvas.clientWidth)||W;
  const uiScale=clamp(1100/viewWidth,1,1.42);
  const boxW=150,boxH=42,x=(W-boxW)/2,y=7;
  ctx.save();
  ctx.fillStyle="rgba(17,43,36,.94)";
  ctx.fillRect(x,y,boxW,boxH);
  ctx.strokeStyle="rgba(232,199,126,.95)";ctx.lineWidth=1.5;
  ctx.strokeRect(x+.75,y+.75,boxW-1.5,boxH-1.5);
  ctx.textAlign="center";ctx.textBaseline="middle";
  ctx.fillStyle="#fff4d1";ctx.shadowColor="rgba(255,224,153,.42)";ctx.shadowBlur=5;
  ctx.font="700 "+(22*uiScale)+"px Arial, \"Noto Sans\", \"PingFang SC\", sans-serif";
  ctx.fillText(timeText(remaining),W/2,y+boxH/2,boxW-14);
  ctx.restore();
}

// REVISION 132 — thông báo nằm ở hàng thứ hai, tách biệt HUD và tên cảnh giới.
function drawAnnouncement(){
  const message=finishMessageLife>0?finishMessage:eventTextLife>0?eventText:"";
  if(!message)return;
  const isFinish=finishMessageLife>0;
  const life=isFinish?finishMessageLife:eventTextLife;
  const displayMessage=message;
  const viewWidth=(typeof canvas!=="undefined"&&canvas.clientWidth)||W;
  const uiScale=clamp(1100/viewWidth,1,1.42);
  ctx.save();
  ctx.globalAlpha=clamp(life/.55,0,1);
  ctx.font="700 "+(18*uiScale)+"px Arial, \"Noto Sans\", \"PingFang SC\", sans-serif";
  const boxW=Math.min(W-40,Math.max(310,ctx.measureText(displayMessage).width+42));
  const boxH=38,x=(W-boxW)/2,y=59;
  ctx.fillStyle=isFinish?"rgba(99,59,26,.96)":"rgba(18,48,40,.95)";
  ctx.fillRect(x,y,boxW,boxH);
  ctx.strokeStyle="#f0d08a";ctx.lineWidth=1.6;
  ctx.strokeRect(x+.8,y+.8,boxW-1.6,boxH-1.6);
  ctx.fillStyle=isFinish?"#ffe9ad":"#fff0c5";
  ctx.textAlign="center";ctx.textBaseline="middle";
  ctx.shadowColor="rgba(255,226,166,.3)";ctx.shadowBlur=4;
  ctx.fillText(displayMessage,W/2,y+boxH/2,boxW-22);
  ctx.restore();
}


/* PHASE 2 — TIÊN MÔN: QUẦN THỂ KIẾN TRÚC, DÒNG SÔNG VÀ NHẬN DIỆN CẤP BẬC.
 * Chỉ thay lớp trình bày; không đụng tới gameplay hoặc thứ tự cảnh giới.
 */
function drawSectArchitecture(time){
  const buildings=[
    // Hậu cảnh: năm công trình cân xứng qua trục chính điện, giữ nhịp xen kẽ.
    {x:250,y:190,s:.43,title:"TỤ LINH THÁP",type:"tower",accent:"#39766e",phase:.2},
    {x:380,y:190,s:.45,title:"TÀNG KINH CÁC",type:"scripture",accent:"#8c6043",phase:1.1},
    {x:550,y:190,s:.76,title:"LĂNG TIÊU CHÍNH ĐIỆN",type:"main",accent:"#9d4939",phase:2.2},
    {x:720,y:190,s:.45,title:"TÀNG BẢO CÁC",type:"treasure",accent:"#b68a43",phase:3.3},
    {x:850,y:190,s:.43,title:"BÁCH THẢO CÁC",type:"herb",accent:"#648653",phase:4.4},

    // Trung cảnh: hai cặp điện đối xứng, chừa hành lang thoáng quanh trục giữa.
    {x:220,y:326,s:.48,title:"GIẢNG ĐẠO CÁC",type:"lecture",accent:"#577d83",phase:.7},
    {x:420,y:326,s:.49,title:"ĐAN CÁC",type:"alchemy",accent:"#9e543b",phase:1.8},
    {x:680,y:326,s:.49,title:"LUYỆN KHÍ ĐIỆN",type:"forge",accent:"#82604a",phase:2.9},
    {x:880,y:326,s:.48,title:"QUAN TINH LÂU",type:"observatory",accent:"#536c91",phase:4},

    // Tiền cảnh: giữ năm vị trí so le; toàn bộ mái và biển hiệu tránh vùng cổng đích.
    {x:250,y:444,s:.36,title:"BẾ QUAN ĐỘNG PHỦ",type:"cave",accent:"#536b62",phase:1.4},
    {x:400,y:444,s:.37,title:"ĐỆ TỬ VIỆN",type:"academy",accent:"#66817a",phase:2.5},
    {x:550,y:444,s:.39,title:"TRẬN PHÁP CÁC",type:"array",accent:"#4f7b83",phase:3.6},
    {x:700,y:444,s:.37,title:"HỘ SƠN TRẬN CÁC",type:"guardian",accent:"#527e88",phase:4.7},
    {x:850,y:444,s:.36,title:"NGOẠI VỤ ĐIỆN",type:"foreign",accent:"#916c48",phase:5.8}
  ];

  buildings.forEach((b,index)=>{
    const bob=Math.sin(time*.00072+b.phase)*1.65;
    const drift=Math.sin(time*.00042+b.phase)*.65;
    drawSectMountainLedge(b.x,b.y,b.s);
    drawSectPavilion(b.x+drift,b.y-5+bob,b.s,"",b.type,b.accent);

    // Hạ biển hiệu sát mái hơn; vùng an toàn trước trụ cổng đích xấp xỉ 964.
    const labelY=b.y-5-156*b.s;
    ctx.save();
    ctx.textAlign="center";ctx.textBaseline="middle";ctx.lineJoin="round";
    ctx.font="bold "+(index===2?18.5:15.5)+"px Arial, sans-serif";
    // Reset toàn bộ trạng thái đổ bóng/lọc kế thừa trước khi vẽ chữ biển hiệu.
    ctx.globalAlpha=1;ctx.globalCompositeOperation="source-over";
    ctx.shadowColor="transparent";ctx.shadowBlur=0;
    ctx.shadowOffsetX=0;ctx.shadowOffsetY=0;ctx.filter="none";
    // Viền tối ôm sát chữ để giữ tương phản khi biển hiệu trùng màu nền.
    ctx.lineJoin="round";
    // Một nét viền xanh đen mảnh, sắc; giữ lòng chữ sáng và không tạo quầng mờ.
    const labelMaxWidth=Math.min(210,250*b.s+38);
    ctx.lineJoin="round";ctx.miterLimit=2;
    ctx.lineWidth=index===2?2.8:2.2;
    ctx.strokeStyle="#17251f";
    ctx.strokeText(b.title,b.x,labelY,labelMaxWidth);
    ctx.fillStyle=index===2?"#ffe8ad":"#fff3d0";
    ctx.fillText(b.title,b.x,labelY,labelMaxWidth);
    ctx.restore();
  });
}

/* Nước trôi chậm, đều: giữ nguyên hình lòng sông và chỉ giảm tốc vân mặt nước. */
function drawRiverCurrent(time){
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

  // Dải phản quang ngắn, trôi ngang chậm khoảng một nửa tốc độ cũ.
  const drift=(time*.0175)%156;
  for(let i=0;i<30;i++){
    const x=((i*45+drift)%1320)-70;
    const y=520+Math.sin(x*.008)*7+Math.sin(i*1.5)*3;
    ctx.strokeStyle=i%5===0?"rgba(255,255,246,.82)":"rgba(218,252,239,.46)";
    ctx.lineWidth=i%4===0?1.9:1.05;
    ctx.beginPath();ctx.moveTo(x,y);
    ctx.quadraticCurveTo(x+9,y-2,x+20,y+.7);ctx.stroke();
  }
  ctx.restore();
}

/* Giữ nguyên hình người và bố trí khán đài hiện hành; cấp bậc đã được phân biệt bằng đạo bào, đai ngọc, phụ kiện và linh quang từ ROLE. */
