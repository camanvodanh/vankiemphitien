/* Vạn Kiếm Phi Tiên — chuyển cảnh xuyên ngũ cảnh giới
 * Mỗi cảnh giới là một lớp phong cảnh hoàn chỉnh; giao thoa bằng crossfade.
 * Không can thiệp tiến độ, thời lượng, vận tốc hoặc gameplay.
 */
(function installJourneyWorld(){
  "use strict";
  const config=(window.VKP_DATA&&window.VKP_DATA.scenery&&window.VKP_DATA.scenery.journey)||{};
  const regions=Array.isArray(config.regions)?config.regions:[];
  const portals=Array.isArray(config.portals)?config.portals:[];
  const transitionWidth=Math.max(.005,Math.min(.04,Number(config.transitionWidth)||.018));
  let frameProgress=0;
  let baseSceneCanvas=null;
  let baseSceneCtx=null;

  function captureBaseScene(){
    if(typeof ctx==="undefined"||!ctx.canvas)return;
    const source=ctx.canvas;
    if(!baseSceneCanvas){
      baseSceneCanvas=document.createElement("canvas");
      baseSceneCtx=baseSceneCanvas.getContext("2d");
    }
    if(baseSceneCanvas.width!==source.width||baseSceneCanvas.height!==source.height){
      baseSceneCanvas.width=source.width;
      baseSceneCanvas.height=source.height;
    }
    baseSceneCtx.clearRect(0,0,source.width,source.height);
    baseSceneCtx.drawImage(source,0,0);
  }

  function currentProgress(){
    if(typeof finished!=="undefined"&&finished)return 1;
    if(!Array.isArray(racers)||!racers.length||!(Number(distance)>0))return 0;
    let furthest=0;
    for(let i=0;i<racers.length;i++){
      const value=Number(racers[i]&&racers[i].progress)||0;
      if(value>furthest)furthest=value;
    }
    const progress=Math.max(0,Math.min(1,furthest/distance));
    // Dùng chung tiến độ đã quét một lần cho chuyển cảnh và cổng cảnh giới.
    window.__vkJourneyProgress=progress;
    return progress;
  }
  function smooth(value){const t=Math.max(0,Math.min(1,value));return t*t*(3-2*t);}
  function activeBlend(progress){
    if(!regions.length||progress<Number(regions[1]&&regions[1].start||.2))return [];
    // Chỉ bắt đầu đổi cảnh sau khi đã vượt qua cổng. Cảnh đầu tiên vẫn là
    // phong cảnh gốc của sơn môn, không bị lớp landmark mới phủ lên.
    for(let i=1;i<regions.length;i++){
      const boundary=Number(regions[i].start)||0;
      const width=transitionWidth*2;
      if(progress>=boundary&&progress<boundary+width){
        const mix=smooth((progress-boundary)/width);
        if(i===1)return [{region:null,alpha:1-mix},{region:regions[i],alpha:mix}];
        return [{region:regions[i-1],alpha:1-mix},{region:regions[i],alpha:mix}];
      }
    }
    let active=regions[0];
    for(let i=1;i<regions.length;i++)if(progress>=Number(regions[i].start||0))active=regions[i];
    return progress<Number(regions[1]&&regions[1].start||.2)?[]:[{region:active,alpha:1}];
  }
  function drawSwordLandmark(target,x,y,scale,angle,color){
    target.save();target.translate(x,y);target.rotate(angle||0);target.scale(scale,scale);
    target.fillStyle="#34495d";target.fillRect(-2,3,4,12);
    target.fillStyle="#d8bd7b";target.fillRect(-6,1,12,3);
    target.fillStyle=color;target.beginPath();target.moveTo(0,-27);target.lineTo(4,-5);target.lineTo(2,3);target.lineTo(-2,3);target.lineTo(-4,-5);target.closePath();target.fill();
    target.strokeStyle="rgba(245,250,255,.88)";target.lineWidth=1;target.stroke();target.restore();
  }
  function drawIsland(target,x,y,scale,color){
    target.save();target.translate(x,y);target.scale(scale,scale);
    target.fillStyle="#435e67";target.beginPath();target.moveTo(-76,0);target.quadraticCurveTo(-48,-15,0,-12);target.quadraticCurveTo(48,-18,76,0);target.lineTo(43,18);target.lineTo(15,31);target.lineTo(-18,24);target.closePath();target.fill();
    target.fillStyle=color;target.beginPath();target.moveTo(-82,-3);target.quadraticCurveTo(-42,-22,0,-15);target.quadraticCurveTo(43,-22,82,-3);target.quadraticCurveTo(35,7,-8,5);target.quadraticCurveTo(-48,8,-82,-3);target.closePath();target.fill();
    target.fillStyle="rgba(239,250,232,.62)";target.fillRect(-42,-8,26,2);target.fillRect(20,-10,31,2);target.restore();
  }
  function drawRealmSky(target,region,time){
    const palettes={
      valley:["#315d69","#78a99a","#c9d8b3"],
      floating:["#3d7898","#9bd0d1","#e1e7d0"],
      sword:["#243f68","#638db2","#b5c9d0"],
      thunder:["#211f48","#514d79","#9a8da9"],
      celestial:["#765c45","#d6ad70","#f6e5b6"]
    };
    const colors=palettes[region.landmark]||palettes.valley;
    const sky=target.createLinearGradient(0,0,0,555);
    sky.addColorStop(0,colors[0]);sky.addColorStop(.58,colors[1]);sky.addColorStop(1,colors[2]);
    target.fillStyle=sky;target.fillRect(0,0,1100,555);
    // Các lớp sơn mạch xa tạo chiều sâu riêng cho từng cảnh giới.
    const ridgeColor=region.landmark==="thunder"?"#343453":region.landmark==="celestial"?"#9b805b":region.landmark==="sword"?"#344d70":"#416b61";
    target.fillStyle=ridgeColor;target.beginPath();target.moveTo(0,430);
    const peaks=region.landmark==="sword"?[[95,330],[205,375],[330,260],[455,345],[590,215],[730,340],[865,270],[1010,350],[1100,300]]:[[80,350],[190,280],[310,365],[440,255],[565,350],[690,275],[830,365],[960,265],[1100,345]];
    peaks.forEach(([x,y])=>target.lineTo(x,y));target.lineTo(1100,555);target.lineTo(0,555);target.closePath();target.fill();
    target.fillStyle="rgba(20,43,48,.20)";target.fillRect(0,430,1100,125);
    // Dải mây ngang làm nhịp nối thị giác, không tạo particle hay timer.
    target.save();target.globalAlpha=.28;target.fillStyle=region.accent||"#e8f3df";
    for(let i=0;i<5;i++){const x=((i*257+time*.008)%(1320))-110,y=175+(i%3)*54;target.fillRect(x,y,125,3);target.fillRect(x+22,y-5,62,3);}
    target.restore();
  }
  function drawCloudBank(target,x,y,scale,alpha,color){
    target.save();target.globalAlpha=alpha;target.translate(x,y);target.scale(scale,scale);
    const g=target.createLinearGradient(0,-28,0,28);g.addColorStop(0,"#f8ffff");g.addColorStop(.42,color);g.addColorStop(1,"#668b9d");
    target.fillStyle=g;target.beginPath();
    target.ellipse(-48,5,53,19,0,0,Math.PI*2);target.ellipse(-12,-7,48,27,0,0,Math.PI*2);
    target.ellipse(31,-3,58,25,0,0,Math.PI*2);target.ellipse(70,9,43,17,0,0,Math.PI*2);
    target.fill();target.restore();
  }
  function drawSwordVariant(target,x,y,scale,angle,kind,color){
    target.save();target.translate(x,y);target.rotate(angle);target.scale(scale,scale);
    target.fillStyle="#b99a62";target.strokeStyle="#f5e5b4";target.lineWidth=1.4;
    if(kind===0){
      target.beginPath();target.moveTo(0,-36);target.lineTo(5,-5);target.lineTo(3,7);target.lineTo(-3,7);target.lineTo(-5,-5);target.closePath();target.fillStyle=color;target.fill();target.stroke();
      target.fillRect(-10,5,20,4);target.fillRect(-2,9,4,12);
    }else if(kind===1){
      target.beginPath();target.moveTo(0,-39);target.quadraticCurveTo(12,-12,3,8);target.lineTo(-3,8);target.quadraticCurveTo(-12,-12,0,-39);target.closePath();target.fillStyle=color;target.fill();target.stroke();
      target.fillRect(-12,5,24,3);target.fillRect(-2,8,4,13);
    }else if(kind===2){
      target.beginPath();target.moveTo(0,-34);target.lineTo(8,-13);target.lineTo(3,8);target.lineTo(-3,8);target.lineTo(-8,-13);target.closePath();target.fillStyle=color;target.fill();target.stroke();
      target.beginPath();target.moveTo(-8,4);target.lineTo(-18,-4);target.lineTo(-14,9);target.lineTo(0,13);target.lineTo(14,9);target.lineTo(18,-4);target.lineTo(8,4);target.fillStyle="#d5b775";target.fill();target.stroke();
      target.fillRect(-2,13,4,12);
    }else{
      target.beginPath();target.moveTo(0,-40);target.lineTo(3,-9);target.lineTo(0,10);target.lineTo(-3,-9);target.closePath();target.fillStyle=color;target.fill();target.stroke();
      target.fillRect(-13,2,26,4);target.fillRect(-2,6,4,17);
    }
    target.restore();
  }
  function drawPagodaGroup(target,x,y,scale,gold){
    target.save();target.translate(x,y);target.scale(scale,scale);
    const stone=gold?"#8c633e":"#536b79",roof=gold?"#d6a85e":"#3e6576",trim=gold?"#ffe2a0":"#c7e9ed";
    for(let floor=0;floor<3;floor++){
      const yy=-floor*31,w=74-floor*13;
      target.fillStyle=stone;target.fillRect(-w*.36,yy-5, w*.72,25);
      target.fillStyle="#f2d69b";target.fillRect(-w*.25,yy+1, w*.5,15);
      target.fillStyle="#253c4a";target.fillRect(-w*.13,yy+2,w*.26,14);
      target.fillStyle=roof;target.beginPath();target.moveTo(-w*.62,yy-5);target.quadraticCurveTo(0,yy-28,w*.62,yy-5);target.lineTo(w*.48,yy-1);target.lineTo(-w*.48,yy-1);target.closePath();target.fill();
      target.strokeStyle=trim;target.lineWidth=2;target.stroke();
      target.beginPath();target.moveTo(-w*.62,yy-5);target.lineTo(-w*.77,yy-13);target.moveTo(w*.62,yy-5);target.lineTo(w*.77,yy-13);target.stroke();
    }
    target.fillStyle=trim;target.fillRect(-5,-112,10,18);target.beginPath();target.moveTo(0,-133);target.lineTo(8,-112);target.lineTo(-8,-112);target.closePath();target.fill();
    target.fillStyle=gold?"#f9e8b7":"#9ad8d7";target.fillRect(-2,-130,4,8);
    target.restore();
  }
  function drawRegionLandmark(target,region,time){
    const kind=region.landmark;
    if(kind==="valley"){
      target.fillStyle="#365b4c";target.beginPath();target.moveTo(0,440);target.lineTo(0,310);target.lineTo(90,265);target.lineTo(155,320);target.lineTo(245,278);target.lineTo(320,440);target.closePath();target.fill();
      target.beginPath();target.moveTo(790,440);target.lineTo(865,285);target.lineTo(940,325);target.lineTo(1025,258);target.lineTo(1100,315);target.lineTo(1100,440);target.closePath();target.fill();
      target.fillStyle="#d8f5e8";target.fillRect(130,318,5,112);target.fillRect(886,326,4,102);
      target.fillStyle="#b9e6d8";target.fillRect(126,350,2,70);target.fillRect(889,350,2,62);
      target.fillStyle="#624b39";target.fillRect(478,335,144,86);target.fillStyle="#b99a61";target.fillRect(489,347,122,66);
      target.fillStyle="#38594e";target.fillRect(500,358,100,55);target.fillStyle="#e3c98c";target.fillRect(474,331,152,7);
      for(let i=0;i<5;i++)target.fillRect(493+i*27,344,3,68);
    }else if(kind==="floating"){
      // Biển mây nhiều tầng: các dải mây xa, trung cảnh và tiền cảnh chuyển động ngược tốc độ.
      for(let i=0;i<7;i++){
        const drift=(time*(.006+i*.0012)*(i%2?-1:1))%(1450);
        const x=((i*211+drift+1450)%1450)-170;
        drawCloudBank(target,x,175+(i%4)*54,.58+(i%3)*.16,.28,"#c6e5eb");
      }
      for(let i=0;i<5;i++){
        const drift=(time*(.012+i*.0015)*(i%2?-1:1))%1500;
        const x=((i*307+drift+1500)%1500)-190;
        drawCloudBank(target,x,365+(i%2)*34,1.0+(i%3)*.12,.72,"#a7d2dc");
      }
      drawIsland(target,135,286+Math.sin(time*.00028)*5,.72,"#91c5d1");
      drawIsland(target,350,235+Math.sin(time*.00022+1)*4,.56,"#a9d7d8");
      drawIsland(target,565,285+Math.sin(time*.0003+2)*5,1.08,"#c0e5dc");
      drawIsland(target,820,225+Math.sin(time*.00025+3)*4,.72,"#a8d5d5");
      drawIsland(target,1030,310+Math.sin(time*.00032+4)*5,.62,"#85b8c5");
      drawPagodaGroup(target,565,228,.58,false);
      drawPagodaGroup(target,820,190,.36,false);
      target.strokeStyle="rgba(238,255,255,.8)";target.lineWidth=3;
      for(let i=0;i<4;i++){
        const x=((i*295+time*.018)%1350)-120,y=260+i*25;
        target.beginPath();target.moveTo(x,y);target.bezierCurveTo(x+90,y-35,x+160,y+32,x+245,y-4);target.stroke();
      }
      // Thác mây đổ từ đảo tiên.
      target.globalAlpha=.55;target.strokeStyle="#e9ffff";target.lineWidth=7;
      for(const x of [330,560,820]){target.beginPath();target.moveTo(x,295);target.bezierCurveTo(x-12,345,x+15,385,x,420);target.stroke();}
      target.globalAlpha=1;
    }else if(kind==="sword"){
      // Kiếm sơn nhiều đỉnh, mỗi vách có quặng tinh thể và khe sáng.
      const peaks=[[70,390,160,270],[205,410,285,305],[365,420,470,230],[510,430,590,185],[675,420,760,280],[820,420,900,235],[960,420,1040,290]];
      peaks.forEach(([x0,y0,x1,y1],i)=>{
        target.fillStyle=i%2?"#314967":"#263e60";target.beginPath();target.moveTo(x0,y0);target.lineTo(x1,y1);target.lineTo(x1+65,y1+110);target.lineTo(x0+95,y0);target.closePath();target.fill();
        target.strokeStyle="rgba(191,222,255,.65)";target.lineWidth=2;target.beginPath();target.moveTo(x1,y1);target.lineTo(x1+18,y1+58);target.lineTo(x1+6,y1+92);target.stroke();
        target.fillStyle=i%2?"#87c5e5":"#9eb7e7";target.beginPath();target.moveTo(x1-8,y1+42);target.lineTo(x1,y1+14);target.lineTo(x1+10,y1+44);target.lineTo(x1,y1+61);target.closePath();target.fill();
      });
      // Rừng kiếm với nhiều chủng loại, kích thước và hướng bay.
      const palette=["#d8f1ff","#a9d4ff","#8fc7db","#d9c5ff","#f4e3ad","#9fe8e1"];
      for(let i=0;i<31;i++){
        const x=28+(i*137)%1040,y=190+(i*71)%205;
        const scale=.38+((i*7)%9)*.075,angle=Math.sin(i*2.1)*.38;
        drawSwordVariant(target,x,y,scale,angle,i%4,palette[i%palette.length]);
      }
      for(let i=0;i<12;i++){
        const x=((i*113+time*.025)%1260)-80,y=145+(i%4)*37+Math.sin(time*.001+i)*9;
        drawSwordVariant(target,x,y,.48+(i%3)*.13,Math.sin(time*.0004+i)*.18,i%4,palette[(i+2)%palette.length]);
      }
      // Trận kiếm khổng lồ phía xa và các vòng kiếm khí.
      target.save();target.translate(590,255);target.rotate(time*.00008);
      target.strokeStyle="rgba(185,220,255,.6)";target.lineWidth=2;
      for(let i=0;i<12;i++){target.rotate(Math.PI/6);target.beginPath();target.ellipse(0,0,118,35,0,0,Math.PI*2);target.stroke();}
      target.restore();
    }else if(kind==="thunder"){
      // Mây giông nhiều lớp chuyển động, đáy mây cuộn và có viền sáng.
      for(let layer=0;layer<3;layer++){
        const speed=layer===0?.012:layer===1?-.019:.027;
        for(let i=0;i<6;i++){
          const x=((i*225+time*speed+1500)%1500)-190;
          const y=135+layer*74+(i%2)*18;
          target.fillStyle=layer===0?"rgba(29,27,59,.88)":layer===1?"rgba(48,43,83,.82)":"rgba(73,66,112,.7)";
          target.beginPath();target.ellipse(x,y,105+layer*12,34+layer*5,0,0,Math.PI*2);target.ellipse(x+55,y-13,76,39,0,0,Math.PI*2);target.ellipse(x+112,y+4,92,31,0,0,Math.PI*2);target.fill();
          target.strokeStyle="rgba(193,184,255,.22)";target.lineWidth=2;target.beginPath();target.moveTo(x-55,y+15);target.quadraticCurveTo(x+20,y+42,x+120,y+12);target.stroke();
        }
      }
      // Mưa sét nhiều nhánh, độ dài và vị trí biến đổi liên tục theo thời gian.
      for(let i=0;i<9;i++){
        const seed=i*91.7,period=1150+(i%4)*370;
        const phase=(time+seed*17)%period;
        const active=phase<230?Math.sin(Math.PI*phase/230):0;
        const x=75+(i*127)%950+Math.sin(time*.001+i)*18;
        const y=175+(i%3)*37;
        if(active>.02){
          const length=72+(i%4)*28;
          target.save();target.globalAlpha=.25+active*.75;
          target.strokeStyle=i%3===0?"#ffffff":"#c8c4ff";target.lineWidth=1.5+active*2.2;
          target.beginPath();target.moveTo(x,y);target.lineTo(x-9,y+length*.28);target.lineTo(x+8,y+length*.43);target.lineTo(x-13,y+length*.7);target.lineTo(x+4,y+length);target.stroke();
          target.lineWidth=1.2;target.beginPath();target.moveTo(x-8,y+length*.28);target.lineTo(x-31,y+length*.43);target.lineTo(x-37,y+length*.62);target.moveTo(x+8,y+length*.43);target.lineTo(x+29,y+length*.57);target.stroke();
          target.restore();
        }
      }
      const flash=Math.max(0,Math.sin(time*.0017)*Math.sin(time*.00037+1)-.82);
      if(flash>0){target.fillStyle="rgba(224,231,255,"+(flash*.23)+")";target.fillRect(0,0,1100,470);}
      // Màn mưa xa nghiêng nhẹ.
      target.strokeStyle="rgba(201,207,255,.22)";target.lineWidth=1;
      for(let i=0;i<38;i++){const x=(i*43+time*.045)%1120,y=275+(i*31)%165;target.beginPath();target.moveTo(x,y);target.lineTo(x-7,y+17);target.stroke();}
    }else if(kind==="celestial"){
      // Quần thể thiên cung nhiều lớp, trục chính lớn và các điện phụ hai bên.
      target.save();
      const glow=target.createRadialGradient(550,275,30,550,275,360);
      glow.addColorStop(0,"rgba(255,239,184,.34)");glow.addColorStop(1,"rgba(255,220,140,0)");
      target.fillStyle=glow;target.fillRect(150,40,800,430);
      target.strokeStyle="rgba(255,226,151,.62)";target.lineWidth=2;
      for(let i=0;i<12;i++){const a=Math.PI*2*i/12;target.beginPath();target.moveTo(550+Math.cos(a)*120,270+Math.sin(a)*72);target.lineTo(550+Math.cos(a)*310,270+Math.sin(a)*185);target.stroke();}
      drawPagodaGroup(target,245,365,1.0,true);
      drawPagodaGroup(target,855,365,1.0,true);
      drawPagodaGroup(target,390,322,.76,true);
      drawPagodaGroup(target,710,322,.76,true);
      drawPagodaGroup(target,550,315,1.72,true);
      // Đại điện trung tâm với nhiều tầng mái, cột son, bậc ngọc và lan can.
      target.fillStyle="#76502f";target.fillRect(375,335,350,78);
      target.fillStyle="#c18c49";target.fillRect(395,345,310,62);
      target.fillStyle="#3d4d50";target.fillRect(425,348,250,58);
      for(let i=0;i<9;i++){
        const x=438+i*28;target.fillStyle="#f2d58e";target.fillRect(x,350,7,55);
        target.fillStyle="#fff0bd";target.fillRect(x+1,350,2,55);
      }
      for(let tier=0;tier<3;tier++){
        const y=338-tier*39,w=410-tier*76;
        target.fillStyle="#a46d3c";target.beginPath();target.moveTo(550-w/2,y);target.quadraticCurveTo(550,y-55,550+w/2,y);target.lineTo(550+w*.43,y+8);target.quadraticCurveTo(550,y-31,550-w*.43,y+8);target.closePath();target.fill();
        target.strokeStyle="#ffe4a1";target.lineWidth=3;target.stroke();
        target.fillStyle="#e8c16d";target.fillRect(550-5,y-28,10,22);
        target.fillStyle="#fff1bd";target.fillRect(548,y-43,4,13);
      }
      // Cửa ngọc, bậc thềm và long trụ trang trí.
      target.fillStyle="#263e43";target.fillRect(515,365,70,48);
      target.fillStyle="#f4d88e";target.strokeStyle="#fff0c1";target.lineWidth=2;
      target.strokeRect(521,369,58,44);target.fillRect(543,369,4,44);
      for(let i=0;i<6;i++){
        target.fillStyle=i%2?"#d6b36d":"#f5dfa0";target.fillRect(390-i*13,414+i*6,320+i*26,6);
      }
      for(const x of [405,695]){
        target.fillStyle="#e6c57e";target.fillRect(x-5,315,10,95);
        target.beginPath();target.arc(x,309,12,0,Math.PI*2);target.fill();
        target.strokeStyle="#fff0bd";target.lineWidth=2;target.strokeRect(x-12,326,24,72);
      }
      // Cầu mây nối các điện phụ.
      target.strokeStyle="rgba(255,235,185,.8)";target.lineWidth=5;
      target.beginPath();target.moveTo(115,412);target.quadraticCurveTo(280,360,390,410);target.moveTo(710,410);target.quadraticCurveTo(830,360,985,412);target.stroke();
      target.restore();
    }
  }
  function drawRegionScene(target,region,time,alpha=1){
    target.save();target.globalAlpha=alpha;
    drawRealmSky(target,region,time);
    drawRegionLandmark(target,region,time);
    target.restore();
  }
  function drawMainRealm(time){
    if(!regions.length||typeof ctx==="undefined"||frameProgress<Number(regions[1]&&regions[1].start||.2))return;
    const blend=activeBlend(frameProgress);
    if(!blend.length)return;
    // Xóa hẳn lớp trời/núi cũ rồi hòa trộn hai nguồn hình có alpha tổng bằng 1.
    // Ở cổng đầu tiên, nguồn cũ là ảnh chụp cảnh gốc chưa chỉnh sửa.
    ctx.save();ctx.beginPath();ctx.rect(0,0,1100,478);ctx.clip();
    ctx.clearRect(0,0,1100,478);
    for(let i=0;i<blend.length;i++){
      const layer=blend[i];
      if(layer.region){
        drawRegionScene(ctx,layer.region,time,layer.alpha);
      }else if(baseSceneCanvas){
        ctx.save();ctx.globalAlpha=layer.alpha;
        ctx.drawImage(baseSceneCanvas,0,0,baseSceneCanvas.width,478,0,0,1100,478);
        ctx.restore();
      }
    }
    ctx.restore();
  }
  function drawMiniRealm(){
    if(!regions.length||typeof cameraCtx==="undefined"||frameProgress<Number(regions[1]&&regions[1].start||.2))return;
    const blend=activeBlend(frameProgress),width=cameraCanvas.width,height=cameraCanvas.height;
    const active=blend.length===1?blend[0].region:blend[1].region;
    if(!active)return;
    cameraCtx.save();cameraCtx.globalAlpha=.18;cameraCtx.fillStyle=active.tint||"#8ac8bd";cameraCtx.fillRect(0,0,width,height);
    cameraCtx.globalAlpha=.85;cameraCtx.fillStyle=active.accent||"#d7e9d0";cameraCtx.fillRect(0,0,width,3);cameraCtx.fillRect(0,height-4,width,4);cameraCtx.restore();
  }
  function drawJourneyPortals(){
    if(!racers.length||finished||!portals.length)return;
    const progress=frameProgress;
    let portal=null,index=-1;
    for(let i=0;i<portals.length;i++){
      const gap=Number(portals[i].progress||0)-progress;
      if(gap>=0&&gap<=.04){portal=portals[i];index=i;break;}
    }
    if(!portal)return;
    const gap=Number(portal.progress||0)-progress;
    const x=TRACK.left+35+(TRACK.right-TRACK.left-45)*Number(portal.progress||0);
    const top=TRACK.top+30,bottom=TRACK.bottom-150,color=portal.color||"#a9d9d5";
    const pulse=.5+.5*Math.sin((typeof performance!=="undefined"?performance.now():0)*.002+index);
    const half=19+3*pulse;
    const points=[
      [x-2,top],[x+half*.55,top+34],[x+half,top+78],[x+half*.55,top+125],
      [x+half*.82,bottom-70],[x+4,bottom],[x-half*.55,bottom-42],
      [x-half,bottom-105],[x-half*.62,top+100],[x-2,top]
    ];
    ctx.save();
    ctx.globalAlpha=Math.max(.28,Math.min(.95,1-gap*15));
    // Khe nứt xé dọc không gian: viền đá tối, lõi sáng và đường rạn ngoằn ngoèo.
    const crack=()=>{
      ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]);
      for(let i=1;i<points.length;i++)ctx.lineTo(points[i][0],points[i][1]);
      ctx.closePath();
    };
    crack();ctx.fillStyle="#101b35";ctx.fill();
    crack();ctx.strokeStyle="#27364d";ctx.lineWidth=11;ctx.stroke();
    crack();ctx.strokeStyle=color;ctx.lineWidth=4;ctx.stroke();
    ctx.save();ctx.beginPath();ctx.moveTo(x,top+8);ctx.lineTo(x+5,top+52);ctx.lineTo(x-5,top+93);ctx.lineTo(x+4,bottom-55);ctx.lineTo(x,bottom-8);ctx.strokeStyle="#f4fbff";ctx.lineWidth=1.8;ctx.stroke();ctx.restore();
    // Các nhánh rạn ngắn tỏa ra từ khe chính.
    ctx.strokeStyle=color;ctx.lineWidth=1.6;
    [[-1,top+58,-25,top+42],[2,top+112,25,top+92],[-2,bottom-105,-25,bottom-128],[1,bottom-62,24,bottom-43]].forEach(([sx,sy,ex,ey])=>{
      ctx.beginPath();ctx.moveTo(x+sx,sy);ctx.lineTo(x+(sx+ex)*.45,sy+(ey-sy)*.42);ctx.lineTo(x+ex,ey);ctx.stroke();
    });
    // Vệt tinh tú nhỏ nằm trong lòng khe, không tạo particle động.
    ctx.fillStyle="#fff6d5";
    for(let i=0;i<4;i++){const yy=top+28+i*(bottom-top-56)/3;ctx.fillRect(x+(i%2?5:-4),yy,2,2);}
    const label=String(portal.shortName||("CẢNH GIỚI "+(index+2)));
    ctx.font="bold 8px Arial";ctx.textAlign="center";ctx.textBaseline="middle";
    const labelY=top-13;ctx.fillStyle="#172337";ctx.fillRect(x-38,labelY-7,76,14);
    ctx.strokeStyle=color;ctx.lineWidth=1;ctx.strokeRect(x-38.5,labelY-7.5,77,15);
    ctx.fillStyle="#fff4d5";ctx.fillText(label,x,labelY,72);
    ctx.restore();
  }
  if(typeof render==="function"){
    const baseRender=render;
    render=function(time){frameProgress=currentProgress();baseRender(time);};
  }
  if(typeof drawScenery==="function"){
    const baseDrawScenery=drawScenery;
    drawScenery=function(time){baseDrawScenery(time);captureBaseScene();if(frameProgress>=Number(regions[1]&&regions[1].start||.2))drawMainRealm(time||0);};
  }
  if(typeof drawCameraBackground==="function"){
    const baseCameraBackground=drawCameraBackground;
    drawCameraBackground=function(time){baseCameraBackground(time);drawMiniRealm();};
  }
  if(typeof drawTrackLines==="function"){
    const baseDrawTrackLines=drawTrackLines;
    drawTrackLines=function(){baseDrawTrackLines();drawJourneyPortals();};
  }
})();
