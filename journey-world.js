/* Vạn Kiếm Phi Tiên — chuyển cảnh xuyên ngũ cảnh giới
 * Mỗi cảnh giới là một lớp phong cảnh hoàn chỉnh; giao thoa bằng crossfade.
 * Không đổi tiến độ/quãng đường/thời lượng; hiệu ứng gameplay chỉ được áp dụng khi qua bốn cổng.
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
    function drawIsland(target,x,y,scale,color){
    target.save();target.translate(x,y);target.scale(scale,scale);
    target.fillStyle="#435e67";target.beginPath();target.moveTo(-76,0);target.quadraticCurveTo(-48,-15,0,-12);target.quadraticCurveTo(48,-18,76,0);target.lineTo(43,18);target.lineTo(15,31);target.lineTo(-18,24);target.closePath();target.fill();
    target.fillStyle=color;target.beginPath();target.moveTo(-82,-3);target.quadraticCurveTo(-42,-22,0,-15);target.quadraticCurveTo(43,-22,82,-3);target.quadraticCurveTo(35,7,-8,5);target.quadraticCurveTo(-48,8,-82,-3);target.closePath();target.fill();
    target.fillStyle="rgba(239,250,232,.62)";target.fillRect(-42,-8,26,2);target.fillRect(20,-10,31,2);target.restore();
  }
  function drawRealmSky(target,region,time){
    const palettes={
      valley:["#315d69","#78a99a","#c9d8b3"],
      floating:["#31586d","#6f9294","#a6aa9a"],
      sword:["#1e304a","#435e7a","#7d8990"],
      thunder:["#171c31","#34374d","#666678"],
      celestial:["#4d4945","#887657","#b4a27e"]
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
    target.fillStyle="rgba(12,24,34,.28)";target.fillRect(0,430,1100,125);
    // Dải mây ngang làm nhịp nối thị giác, không tạo particle hay timer.
    target.save();target.globalAlpha=.16;target.fillStyle=region.accent||"#aebfc0";
    for(let i=0;i<5;i++){const x=((i*257+time*.008)%(1320))-110,y=175+(i%3)*54;target.fillRect(x,y,125,3);target.fillRect(x+22,y-5,62,3);}
    target.restore();
  }
  function drawCloudBank(target,x,y,scale,alpha,color){
    target.save();target.globalAlpha=alpha;target.translate(x,y);target.scale(scale,scale);
    const g=target.createLinearGradient(0,-30,0,32);
    g.addColorStop(0,"#b8c8ca");g.addColorStop(.42,color);g.addColorStop(1,"#526b77");
    target.fillStyle=g;target.beginPath();
    target.ellipse(-58,7,62,22,-.05,0,Math.PI*2);
    target.ellipse(-22,-8,55,31,-.08,0,Math.PI*2);
    target.ellipse(25,-5,67,29,.04,0,Math.PI*2);
    target.ellipse(75,10,49,20,.06,0,Math.PI*2);
    target.fill();
    target.globalAlpha*=.38;target.strokeStyle="#d5e0dc";target.lineWidth=2;
    target.beginPath();target.moveTo(-95,7);target.bezierCurveTo(-48,-25,18,-23,98,6);target.stroke();
    target.restore();
  }
  function drawSwordVariant(target,x,y,scale,angle,kind,color){
    target.save();target.translate(x,y);target.rotate(angle||0);target.scale(scale,scale);
    const blade=color||"#a9c4d4",edge="#d4d9d2",gold="#ad9363",dark="#344454";
    target.lineJoin="round";target.lineCap="round";
    // Tỷ lệ tạo hình tiêu chuẩn; kích thước thực tế được điều tiết theo từng lớp bố trí.
    if(kind===0){
      target.fillStyle=blade;target.beginPath();target.moveTo(0,-116);target.lineTo(8,-91);target.lineTo(5,4);target.lineTo(0,17);target.lineTo(-5,4);target.lineTo(-8,-91);target.closePath();target.fill();
      target.strokeStyle=edge;target.lineWidth=1.7;target.stroke();
      target.strokeStyle="rgba(232,241,239,.58)";target.lineWidth=1;target.beginPath();target.moveTo(0,-105);target.lineTo(1,5);target.stroke();
    }else if(kind===1){
      target.fillStyle=blade;target.beginPath();target.moveTo(0,-116);target.bezierCurveTo(20,-80,16,-30,5,15);target.lineTo(-4,15);target.bezierCurveTo(-15,-30,-18,-80,0,-116);target.closePath();target.fill();
      target.strokeStyle=edge;target.lineWidth=1.6;target.stroke();
      target.strokeStyle="rgba(226,235,234,.55)";target.beginPath();target.moveTo(1,-103);target.quadraticCurveTo(8,-34,1,10);target.stroke();
    }else if(kind===2){
      target.fillStyle=blade;target.beginPath();target.moveTo(0,-112);target.lineTo(14,-68);target.lineTo(8,8);target.lineTo(0,19);target.lineTo(-8,8);target.lineTo(-14,-68);target.closePath();target.fill();
      target.strokeStyle=edge;target.lineWidth=1.7;target.stroke();
      target.fillStyle=gold;target.beginPath();target.moveTo(-10,3);target.lineTo(-25,-12);target.lineTo(-20,12);target.lineTo(0,22);target.lineTo(20,12);target.lineTo(25,-12);target.lineTo(10,3);target.closePath();target.fill();target.strokeStyle="#d2bd8d";target.stroke();
    }else if(kind===3){
      target.fillStyle=blade;target.beginPath();target.moveTo(0,-122);target.lineTo(5,-20);target.lineTo(2,18);target.lineTo(-2,18);target.lineTo(-5,-20);target.closePath();target.fill();
      target.strokeStyle=edge;target.lineWidth=1.5;target.stroke();
      target.strokeStyle=gold;target.lineWidth=2.4;target.beginPath();target.moveTo(-16,4);target.lineTo(16,4);target.stroke();
    }else if(kind===4){
      target.fillStyle=blade;target.beginPath();target.moveTo(0,-116);target.lineTo(10,-82);target.lineTo(7,-28);target.lineTo(3,16);target.lineTo(-3,16);target.lineTo(-7,-28);target.lineTo(-10,-82);target.closePath();target.fill();
      target.strokeStyle=edge;target.lineWidth=1.5;target.stroke();
      target.fillStyle=gold;target.beginPath();target.moveTo(-8,1);target.lineTo(-21,-7);target.lineTo(-17,12);target.lineTo(0,18);target.lineTo(17,12);target.lineTo(21,-7);target.lineTo(8,1);target.closePath();target.fill();
    }else{
      // Trọng kiếm bản rộng, sống kiếm dày và mũi tam giác.
      target.fillStyle=blade;target.beginPath();target.moveTo(-8,-105);target.lineTo(0,-124);target.lineTo(8,-105);target.lineTo(13,8);target.lineTo(0,20);target.lineTo(-13,8);target.closePath();target.fill();
      target.strokeStyle=edge;target.lineWidth=2;target.stroke();
      target.strokeStyle="rgba(42,57,69,.48)";target.lineWidth=2;target.beginPath();target.moveTo(0,-104);target.lineTo(0,11);target.stroke();
    }
    // Kiếm cách, chuôi bọc da, vòng chặn và chóp chuôi riêng biệt.
    target.fillStyle=gold;target.strokeStyle="#d4c29b";target.lineWidth=1.5;
    target.beginPath();target.moveTo(-15,12);target.quadraticCurveTo(0,20,15,12);target.lineTo(12,20);target.quadraticCurveTo(0,27,-12,20);target.closePath();target.fill();target.stroke();
    target.fillStyle=dark;target.fillRect(-3,21,6,29);
    target.strokeStyle=gold;target.lineWidth=2;
    for(let k=0;k<3;k++){target.beginPath();target.moveTo(-3,25+k*7);target.lineTo(3,28+k*7);target.stroke();}
    target.fillStyle=gold;target.beginPath();target.arc(0,52,4,0,Math.PI*2);target.fill();
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
      // Vân Hải có nhiều lớp mây cuộn, lớp trước tối và dày để tạo chiều sâu.
      for(let layer=0;layer<4;layer++){
        const count=layer===0?11:layer===1?9:layer===2?7:6;
        const speed=(layer%2?-1:1)*(.0035+layer*.003);
        for(let i=0;i<count;i++){
          const drift=(time*speed*(1+(i%3)*.16)+i*181+layer*97+1800)%1800;
          const x=drift-260,y=112+layer*78+(i%4)*17;
          const scale=.42+layer*.18+(i%3)*.08;
          const alpha=[.32,.46,.58,.68][layer];
          drawCloudBank(target,x,y,scale,alpha,["#849da5","#78969e","#718d96","#607e8a"][layer]);
        }
      }
      // Tầng vân đài và cầu mây nằm ngang, tạo chiều sâu mà không dùng vòng xoắn.
      const cloudTerraces=[
        [-80,188,430,22,.22],[270,164,390,18,.18],[690,205,470,24,.2],
        [-120,352,520,25,.3],[430,375,470,22,.26],[820,330,390,20,.24]
      ];
      cloudTerraces.forEach(([x,y,w,h,alpha],i)=>{
        const drift=((time*(i%2?-.006:.008)+i*173+w*2)%(w+1250))-w-120;
        target.save();target.globalAlpha=alpha;
        target.fillStyle=i%2?"#91aeb2":"#78969f";
        target.beginPath();target.ellipse(drift,y,w*.5,h,0,0,Math.PI*2);target.fill();
        target.strokeStyle="rgba(190,210,207,.28)";target.lineWidth=3;
        target.beginPath();target.moveTo(drift-w*.42,y-3);target.bezierCurveTo(drift-w*.12,y-h*.8,drift+w*.15,y-h*.65,drift+w*.45,y-2);target.stroke();
        target.restore();
      });
      // Những nhịp cầu vân mỏng nối các đảo tiên, chuyển động chậm theo gió.
      target.save();target.strokeStyle="rgba(169,195,196,.34)";target.lineWidth=7;
      for(let i=0;i<4;i++){
        const y=260+i*31,offset=Math.sin(time*.00018+i)*9;
        target.beginPath();target.moveTo(145,y+offset);target.bezierCurveTo(330,y-28+offset,465,y+32-offset,635,y+offset);
        target.bezierCurveTo(790,y-24-offset,900,y+18+offset,1035,y-5);target.stroke();
      }
      target.restore();
      // Tám đảo tiên phân tầng, có chân núi lơ lửng và thác mây.
      const islands=[
        [92,300,.58,"#789ca4"],[245,242,.48,"#91afb0"],[365,340,.76,"#789ca6"],
        [505,220,.54,"#9bb6b0"],[650,300,1.02,"#91aaa7"],[810,225,.72,"#829fa6"],
        [965,325,.68,"#7896a0"],[1080,245,.46,"#91aaa8"]
      ];
      islands.forEach(([x,y,s,c],i)=>drawIsland(target,x,y+Math.sin(time*.00023+i)*5,s,c));
      // Tiên các trên đảo lớn, có điện chính và các tháp phụ xa gần.
      drawPagodaGroup(target,650,246,.72,false);
      drawPagodaGroup(target,810,198,.46,false);
      drawPagodaGroup(target,365,310,.43,false);
      drawPagodaGroup(target,965,297,.38,false);
      target.strokeStyle="rgba(153,184,190,.48)";target.lineWidth=2;
      for(let i=0;i<5;i++){
        const x=((i*267+time*.009+1450)%1550)-210,y=302+i*25;
        target.beginPath();target.moveTo(x,y);target.bezierCurveTo(x+90,y-8,x+165,y+10,x+255,y+1);target.stroke();
      }
      // Thác mây nhiều dòng từ đảo tiên, chuyển động theo thời gian.
      for(let i=0;i<7;i++){
        const x=245+i*105,phase=time*.00055+i*.8;
        target.save();target.globalAlpha=.28+.12*(.5+.5*Math.sin(phase));
        target.strokeStyle="#9ab9bd";target.lineWidth=5+(i%3)*2;
        target.beginPath();target.moveTo(x,285+(i%2)*24);
        target.bezierCurveTo(x-18,345,x+22+Math.sin(phase)*9,385,x+Math.sin(phase*1.3)*13,448);
        target.stroke();target.restore();
      }
      // Những mảng sương tiền cảnh lướt ngang chậm.
      for(let i=0;i<5;i++){
        const x=((i*287-time*.018+1500)%1500)-200,y=438+(i%2)*22;
        drawCloudBank(target,x,y,.92,.32,"#718b92");
      }
    }else if(kind==="sword"){
      // Kiếm sơn tầng tầng, vách núi dựng như lưỡi kiếm khổng lồ.
      const peaks=[[45,420,130,255],[170,430,265,300],[300,425,405,220],[435,435,535,185],[565,430,660,210],[700,430,790,270],[835,425,930,225],[965,430,1060,270]];
      peaks.forEach(([x0,y0,x1,y1],i)=>{
        target.fillStyle=i%2?"#293e57":"#22354d";target.beginPath();
        target.moveTo(x0,y0);target.lineTo(x1,y1);target.lineTo(x1+55,y1+105);target.lineTo(x0+100,y0);target.closePath();target.fill();
        target.strokeStyle="rgba(148,174,190,.42)";target.lineWidth=2;
        target.beginPath();target.moveTo(x1,y1);target.lineTo(x1+18,y1+58);target.lineTo(x1+6,y1+92);target.stroke();
        target.fillStyle=i%2?"#668ba0":"#71869d";target.beginPath();
        target.moveTo(x1-8,y1+42);target.lineTo(x1,y1+14);target.lineTo(x1+10,y1+44);target.lineTo(x1,y1+61);target.closePath();target.fill();
      });
      // Kiếm cổ chia theo cụm nhỏ, nhiều chủng loại nhưng giữ tỷ lệ vừa phải.
      const palette=["#a9c4d4","#86a9bf","#b5a8c5","#b6a27c","#7eaaa5","#9babb9"];
      for(let i=0;i<28;i++){
        const col=i%7,row=Math.floor(i/7);
        const x=48+col*164+(row%2)*31+Math.sin(i*1.7)*12;
        const y=188+row*56+Math.cos(i*2.1)*13;
        const scale=.39+((i*5)%5)*.055,angle=Math.sin(i*2.1)*.27;
        drawSwordVariant(target,x,y,scale,angle,i%6,palette[i%palette.length]);
      }
      // Linh kiếm bay thưa ở ba cao độ, không che các đảo kiếm và kiếm trận.
      for(let i=0;i<12;i++){
        const x=((i*173+time*(i%2?-.014:.017)+1370)%1370)-135;
        const y=142+(i%4)*57+Math.sin(time*.0007+i)*9;
        drawSwordVariant(target,x,y,.38+(i%3)*.065,Math.sin(time*.0003+i)*.2,i%6,palette[(i+2)%palette.length]);
      }
      // Cổ kiếm cắm thành từng nhóm dọc sườn núi, có khoảng trống giữa các nhóm.
      const embeddedPalette=["#a9c4d4","#86a9bf","#b5a8c5","#b6a27c","#7eaaa5","#9babb9"];
      for(let i=0;i<22;i++){
        const group=Math.floor(i/6),within=i%6;
        const x=55+group*260+within*28+(within%2)*8;
        const y=366+(within%3)*22+(group%2)*9;
        const scale=.34+((i*3)%4)*.055;
        drawSwordVariant(target,x,y,scale,Math.sin(i*1.7)*.16,i%6,embeddedPalette[i%embeddedPalette.length]);
      }
      // Một nhóm nhỏ linh kiếm hộ vệ quanh kiếm chủ, không tạo vành kiếm quá dày.
      for(let i=0;i<8;i++){
        const a=time*.00016+i*Math.PI*2/8,radius=158+(i%2)*34;
        const x=590+Math.cos(a)*radius,y=266+Math.sin(a)*radius*.43;
        drawSwordVariant(target,x,y,.39+(i%2)*.06,a*.18,i%6,palette[(i+3)%palette.length]);
      }
      // Ba tầng kiếm trận phù văn màu lam xám, tránh ánh sáng trắng chói.
      target.save();target.translate(590,270);target.rotate(-time*.000045);
      for(let ring=0;ring<3;ring++){
        target.beginPath();target.ellipse(0,0,92+ring*47,31+ring*19,0,0,Math.PI*2);
        target.strokeStyle=ring===1?"rgba(157,190,207,.48)":"rgba(112,151,174,.34)";
        target.lineWidth=ring===1?2:1.1;target.setLineDash(ring===2?[7,5]:[2,5]);target.stroke();
      }
      target.setLineDash([]);
      for(let i=0;i<16;i++){
        const a=i*Math.PI/8,inner=104,outer=230;
        target.strokeStyle=i%2?"rgba(133,171,191,.32)":"rgba(178,155,116,.34)";
        target.lineWidth=1;target.beginPath();target.moveTo(Math.cos(a)*inner,Math.sin(a)*inner*.42);target.lineTo(Math.cos(a)*outer,Math.sin(a)*outer*.42);target.stroke();
      }
      for(let i=0;i<8;i++){
        const a=i*Math.PI/4+time*.000035,x=Math.cos(a)*224,y=Math.sin(a)*92;
        drawSwordVariant(target,x,y,.88,a+Math.PI/2,i%6,embeddedPalette[i%embeddedPalette.length]);
      }
      target.restore();
      const coreGlow=target.createRadialGradient(590,270,5,590,270,82);
      coreGlow.addColorStop(0,"rgba(151,187,204,.24)");coreGlow.addColorStop(.45,"rgba(91,132,158,.13)");coreGlow.addColorStop(1,"rgba(58,91,116,0)");
      target.fillStyle=coreGlow;target.beginPath();target.arc(590,270,82,0,Math.PI*2);target.fill();
      drawSwordVariant(target,590,270,.72,0,2,"#b8d0dc");
      target.save();target.translate(590,255);target.rotate(time*.00006);
      target.strokeStyle="rgba(139,172,190,.38)";target.lineWidth=2;
      for(let i=0;i<12;i++){target.rotate(Math.PI/6);target.beginPath();target.ellipse(0,0,118,35,0,0,Math.PI*2);target.stroke();}
      target.restore();
    }else if(kind==="thunder"){
      // Bão lôi cuộn thành các khối mây đen dày, đáy mây xé tua và xoáy ngược.
      for(let layer=0;layer<4;layer++){
        const speed=[.008,-.014,.021,-.027][layer],baseY=115+layer*69;
        for(let i=0;i<7;i++){
          const x=((i*207+time*speed+1650)%1650)-250;
          const y=baseY+(i%3)*19+Math.sin(time*.00042+i*1.8)*10;
          const w=112+layer*15+(i%3)*12,h=35+layer*8+(i%2)*8;
          target.fillStyle=["rgba(19,23,39,.96)","rgba(29,32,51,.94)","rgba(42,43,65,.91)","rgba(55,54,76,.86)"][layer];
          target.beginPath();
          target.ellipse(x,y,w,h,-.05,0,Math.PI*2);
          target.ellipse(x+w*.46,y-17,w*.72,h*1.08,.08,0,Math.PI*2);
          target.ellipse(x+w*.95,y+3,w*.62,h*.88,-.08,0,Math.PI*2);
          target.ellipse(x+w*.32,y+24,w*.48,h*.5,.04,0,Math.PI*2);
          target.fill();
          target.strokeStyle="rgba(126,130,158,.16)";target.lineWidth=3;
          target.beginPath();target.moveTo(x-w*.6,y+12);target.bezierCurveTo(x-w*.1,y+h*1.3,x+w*.55,y+h*1.1,x+w*1.35,y+7);target.stroke();
        }
      }
      // Các dải gió xoáy và màn mưa nghiêng dưới chân mây.
      target.strokeStyle="rgba(105,111,139,.25)";target.lineWidth=5;
      for(let i=0;i<8;i++){
        const x=((i*171-time*.026+1400)%1400)-150,y=355+(i%3)*28;
        target.beginPath();target.moveTo(x,y);target.bezierCurveTo(x+75,y-18,x+135,y+34,x+225,y-8);target.stroke();
      }
      // Sét đánh nhiều tầng, tia chính dài và nhiều nhánh phụ phân叉.
      for(let i=0;i<16;i++){
        const seed=i*73.3,period=900+(i%5)*245,phase=(time+seed*19)%period;
        const active=phase<210?Math.sin(Math.PI*phase/210):0;
        const x=42+(i*71)%1010+Math.sin(time*.0007+i)*22;
        const y=150+(i%4)*31,length=110+(i%5)*28;
        if(active>.025){
          target.save();target.globalAlpha=.2+active*.68;
          target.strokeStyle=i%4===0?"#c8cbd4":"#a5a8c2";target.lineWidth=1.2+active*2.1;
          target.beginPath();target.moveTo(x,y);target.lineTo(x-12,y+length*.19);target.lineTo(x+9,y+length*.36);target.lineTo(x-18,y+length*.58);target.lineTo(x+3,y+length);target.stroke();
          target.lineWidth=1.15;target.beginPath();
          target.moveTo(x-12,y+length*.19);target.lineTo(x-39,y+length*.31);target.lineTo(x-55,y+length*.49);
          target.moveTo(x+9,y+length*.36);target.lineTo(x+37,y+length*.45);target.lineTo(x+53,y+length*.63);
          target.moveTo(x-18,y+length*.58);target.lineTo(x-42,y+length*.72);
          target.stroke();target.restore();
        }
      }
      // Chớp sáng cục bộ, không phủ trắng toàn bộ cảnh.
      const flash=Math.max(0,Math.sin(time*.0013)*Math.sin(time*.00031+1.7)-.86);
      if(flash>0){target.fillStyle="rgba(177,184,208,"+(flash*.12)+")";target.fillRect(0,0,1100,465);}
      target.strokeStyle="rgba(151,157,178,.24)";target.lineWidth=1;
      for(let i=0;i<52;i++){
        const x=(i*43+time*.035)%1120,y=270+(i*31)%190;
        target.beginPath();target.moveTo(x,y);target.lineTo(x-9,y+23);target.stroke();
      }
    }else if(kind==="celestial"){
      // Thiên Cung nhiều lớp điện đài, mái ngói trầm, vàng cổ và ngọc xanh.
      target.save();
      const glow=target.createRadialGradient(550,280,35,550,280,330);
      glow.addColorStop(0,"rgba(198,164,105,.13)");glow.addColorStop(1,"rgba(130,112,83,0)");
      target.fillStyle=glow;target.fillRect(170,45,760,420);
      // Dãy điện phụ lùi sâu theo phối cảnh.
      drawPagodaGroup(target,105,360,.62,true);
      drawPagodaGroup(target,245,338,.78,true);
      drawPagodaGroup(target,385,315,.68,true);
      drawPagodaGroup(target,715,315,.68,true);
      drawPagodaGroup(target,855,338,.78,true);
      drawPagodaGroup(target,995,360,.62,true);
      drawPagodaGroup(target,550,300,1.58,true);
      // Đại điện trung tâm có ba tầng mái cong và đấu củng.
      target.fillStyle="#584735";target.fillRect(355,337,390,84);
      target.fillStyle="#876b48";target.fillRect(382,346,336,70);
      target.fillStyle="#34464a";target.fillRect(411,351,278,63);
      for(let i=0;i<11;i++){
        const x=425+i*25;target.fillStyle=i%2?"#a98b58":"#bda16d";target.fillRect(x,354,6,59);
        target.fillStyle="#d1bd91";target.fillRect(x+1,354,2,59);
      }
      for(let tier=0;tier<3;tier++){
        const y=338-tier*43,w=450-tier*83;
        target.fillStyle=tier===0?"#795a3b":"#69513a";
        target.beginPath();target.moveTo(550-w/2,y);target.quadraticCurveTo(550,y-58,550+w/2,y);
        target.lineTo(550+w*.43,y+10);target.quadraticCurveTo(550,y-30,550-w*.43,y+10);target.closePath();target.fill();
        target.strokeStyle="#c6a66e";target.lineWidth=3;target.stroke();
        target.strokeStyle="#8e754e";target.lineWidth=1;
        for(let k=0;k<7;k++){const xx=550-w*.38+k*w*.76/6;target.beginPath();target.moveTo(xx,y-5);target.lineTo(xx+(k-3)*3,y+8);target.stroke();}
        target.fillStyle="#b99a62";target.fillRect(545,y-32,10,23);
      }
      // Cửa son, bậc đá ngọc, lan can và cột chạm rồng.
      target.fillStyle="#263d40";target.fillRect(510,365,80,52);
      target.strokeStyle="#c6a66e";target.lineWidth=3;target.strokeRect(516,370,68,47);
      target.fillStyle="#a98a58";target.fillRect(548,370,4,47);
      for(let i=0;i<7;i++){
        target.fillStyle=i%2?"#88734f":"#aa9163";
        target.fillRect(365-i*15,420+i*5,370+i*30,5);
      }
      for(const x of [390,710]){
        target.fillStyle="#a98b58";target.fillRect(x-7,304,14,111);
        target.strokeStyle="#c8b17e";target.lineWidth=2;
        for(let y=315;y<407;y+=18){target.beginPath();target.ellipse(x,y,10,5,0,0,Math.PI*2);target.stroke();}
        target.fillStyle="#9b8156";target.beginPath();target.arc(x,300,13,0,Math.PI*2);target.fill();
      }
      // Thiên môn và cặp cổng phụ ở hai đầu quần thể.
      for(const x of [135,965]){
        target.fillStyle="#65513b";target.fillRect(x-38,342,76,76);
        target.strokeStyle="#c5a56d";target.lineWidth=4;target.strokeRect(x-32,348,64,68);
        target.fillStyle="#30464a";target.fillRect(x-18,362,36,54);
        target.beginPath();target.moveTo(x-53,350);target.quadraticCurveTo(x,308,x+53,350);target.lineTo(x+43,358);target.quadraticCurveTo(x,330,x-43,358);target.closePath();target.fillStyle="#806044";target.fill();
        target.strokeStyle="#c6a66e";target.lineWidth=2;target.stroke();
      }
      // Cầu ngọc nối các điện, hồ sen và vườn tùng trên tầng mây.
      target.strokeStyle="rgba(157,174,157,.72)";target.lineWidth=5;
      target.beginPath();target.moveTo(90,430);target.quadraticCurveTo(260,372,390,418);target.moveTo(710,418);target.quadraticCurveTo(840,372,1010,430);target.stroke();
      target.strokeStyle="rgba(180,158,111,.55)";target.lineWidth=2;
      for(let i=0;i<9;i++){const x=160+i*98;target.beginPath();target.moveTo(x,402);target.lineTo(x,418);target.stroke();}
      for(let i=0;i<12;i++){
        const x=95+i*82,y=448+(i%3)*7;
        target.fillStyle=i%2?"#526b58":"#68765d";target.beginPath();target.arc(x,y,9+(i%3)*2,0,Math.PI*2);target.fill();
        target.fillStyle="#9c875d";target.fillRect(x-2,y-15,4,12);
      }
      // Đèn cung treo dưới mái, ánh sáng nhỏ và ấm.
      for(let i=0;i<9;i++){
        const x=330+i*55,y=250+(i%2)*23;
        target.strokeStyle="rgba(174,147,99,.7)";target.lineWidth=1.5;target.beginPath();target.moveTo(x,y-28);target.lineTo(x,y-5);target.stroke();
        target.fillStyle="#9d7449";target.fillRect(x-5,y-5,10,14);
        target.fillStyle="rgba(207,168,104,.42)";target.fillRect(x-3,y-2,6,8);
      }
      target.restore();
    }
  }
  function drawRegionScene(target,region,time,alpha=1){
    target.save();target.globalAlpha=alpha;
    drawRealmSky(target,region,time);
    drawRegionLandmark(target,region,time);
    target.restore();
  }
  function drawRealmArrivalTitle(time){
    let index=-1;
    for(let i=1;i<regions.length;i++){const elapsed=frameProgress-(Number(regions[i].start)||0);if(elapsed>=0&&elapsed<.035){index=i;break;}}
    if(index<0)return;
    const region=regions[index],phase=(frameProgress-Number(region.start))/.035;
    const fade=Math.min(1,phase*7,(1-phase)*5);
    const title=String(region.name||region.shortName||"CẢNH GIỚI MỚI").toLocaleUpperCase("vi");
    const gameCanvas=document.getElementById("game");
    const viewWidth=(gameCanvas&&gameCanvas.clientWidth)||1100;
    const uiScale=Math.min(1.42,Math.max(1,1100/viewWidth));
    const x=550,y=114;
    ctx.save();ctx.globalAlpha=Math.max(0,fade);
    ctx.font="700 "+(18*uiScale)+'px Arial, "Noto Sans", "PingFang SC", sans-serif';
    const textWidth=ctx.measureText(title).width;
    const width=Math.min(760,Math.max(340,textWidth+104));
    const glow=ctx.createRadialGradient(x,y,12,x,y,Math.max(190,width*.48));glow.addColorStop(0,region.accent||"#e7f2ff");glow.addColorStop(1,"rgba(0,0,0,0)");
    ctx.fillStyle=glow;ctx.fillRect(x-width/2-24,y-29,width+48,58);
    ctx.fillStyle="rgba(13,24,43,.96)";ctx.beginPath();
    ctx.moveTo(x-width/2+18,y-14);ctx.lineTo(x-width/2+5,y);ctx.lineTo(x-width/2+18,y+14);
    ctx.lineTo(x+width/2-18,y+14);ctx.lineTo(x+width/2-5,y);ctx.lineTo(x+width/2-18,y-14);ctx.closePath();ctx.fill();
    ctx.strokeStyle=region.accent||"#e8d29b";ctx.lineWidth=2;ctx.stroke();
    ctx.strokeStyle="rgba(255,245,211,.72)";ctx.lineWidth=1;ctx.beginPath();
    ctx.moveTo(x-width/2+30,y-9);ctx.lineTo(x-width/2+48,y);ctx.lineTo(x-width/2+30,y+9);
    ctx.moveTo(x+width/2-30,y-9);ctx.lineTo(x+width/2-48,y);ctx.lineTo(x+width/2-30,y+9);ctx.stroke();
    ctx.fillStyle="#fff7df";ctx.textAlign="center";ctx.textBaseline="middle";
    ctx.shadowColor=region.accent||"#d9eaff";ctx.shadowBlur=10;ctx.fillText(title,x,y,width-68);ctx.shadowBlur=0;ctx.restore();
  }

  function drawMainRealm(time){
    if(!regions.length||typeof ctx==="undefined"||frameProgress<Number(regions[1]&&regions[1].start||.2))return;
    const blend=activeBlend(frameProgress);
    if(!blend.length)return;
    // Chỉ hòa trộn lớp trời/núi phía trên; chừa nguyên vùng linh quang Chưởng Môn và sông ở bên dưới.
    // Ở cổng đầu tiên, nguồn cũ là ảnh chụp cảnh gốc chưa chỉnh sửa; vùng bảo vệ phía dưới không bị xóa.
    ctx.save();ctx.beginPath();ctx.rect(0,0,1100,480);ctx.clip();
    ctx.clearRect(0,0,1100,480);
    ctx.globalCompositeOperation="source-over";
    for(let i=0;i<blend.length;i++){
      const layer=blend[i];
      if(layer.region){
        drawRegionScene(ctx,layer.region,time,layer.alpha);
      }else if(baseSceneCanvas){
        ctx.save();ctx.globalAlpha=layer.alpha;
        ctx.drawImage(baseSceneCanvas,0,0,baseSceneCanvas.width,480,0,0,1100,480);
        ctx.restore();
      }
    }
    ctx.restore();
    drawRealmArrivalTitle(time);
  }
  function drawMiniRealm(time=0){
    if(!regions.length||typeof cameraCtx==="undefined"||frameProgress<Number(regions[1]&&regions[1].start||.2))return;
    const blend=activeBlend(frameProgress),width=cameraCanvas.width,height=cameraCanvas.height;
    if(!blend.length)return;
    const hasBase=blend.some(layer=>!layer.region);
    if(!hasBase)cameraCtx.clearRect(0,0,width,height);
    const scale=width/1100;
    cameraCtx.save();
    cameraCtx.globalCompositeOperation="source-over";
    for(const layer of blend){
      if(!layer.region)continue;
      cameraCtx.save();
      cameraCtx.translate(0,-37.5);
      cameraCtx.scale(scale,scale);
      drawRegionScene(cameraCtx,layer.region,time,layer.alpha);
      cameraCtx.restore();
    }
    cameraCtx.restore();
    const active=blend[blend.length-1].region;
    if(active){
      cameraCtx.save();cameraCtx.globalAlpha=.9;cameraCtx.strokeStyle=active.accent||"#d7e9d0";cameraCtx.lineWidth=3;
      cameraCtx.strokeRect(1.5,1.5,width-3,height-3);cameraCtx.restore();
    }
  }
  function applyPortalEffect(racer,portal,index){
    if(!racer||racer.finished||!portal||!portal.effect)return;
    const gate=portal.effect,config=(window.VKP_DATA.effects&&window.VKP_DATA.effects.balance)||{};
    const limits=config.speedLimits;
    // Cổng mới thanh tẩy cả hiệu ứng đang chạy lẫn hiệu ứng đang chờ kích hoạt.
    racer.speedMultiplier=1;racer.effectTimer=0;racer.effectDuration=0;
    racer.effectType="";racer.effectName="";racer.effectPolarity="";
    racer.pendingEffect=null;racer.pendingEffectTimer=0;racer.effectCooldown=0;
    racer.personalEffectType="";racer.personalEffectName="";
    racer.personalEffectPolarity="";racer.personalEffectMultiplier=1;
    const gateMultiplier=Number(gate.multiplier)||1;
    let personalMultiplier=1,personal=null,personalDuration=0;
    if(Math.random()>=config.noEffectChance){
      const ranked=sortedRacers(),rank=Math.max(0,ranked.indexOf(racer));
      const ratio=ranked.length>1?rank/(ranked.length-1):.5;
      const position=ratio<1/3?"front":ratio>2/3?"back":"middle";
      const goodChance=Number((config.positionGoodChance||{})[position]??.5);
      const polarity=Math.random()<goodChance?"positive":"negative";
      const weights=config.tierWeights||{light:.35,medium:.4,strong:.25};
      const roll=Math.random(),tier=roll<weights.light?"light":roll<weights.light+weights.medium?"medium":"strong";
      const pool=(window.VKP_DATA.effects.raceEvents||[]).filter(item=>item.polarity===polarity);
      if(pool.length){
        const chosen=pool[Math.floor(Math.random()*pool.length)];
        const ranges=polarity==="positive"?config.multipliers.boost:config.multipliers.slow;
        const range=ranges&&ranges[tier]||[1,1];
        const variation=1+(Math.random()*2-1)*Number(config.multiplierVariation||0);
        personalMultiplier=(Number(range[0])+(Number(range[1])-Number(range[0]))*Math.random())*variation;
        personalDuration=Number(config.durationSeconds&&config.durationSeconds[0]||2)+Math.random()*(Number(config.durationSeconds&&config.durationSeconds[1]||5)-Number(config.durationSeconds&&config.durationSeconds[0]||2));
        personal={...chosen,tier};
      }
    }
    const gateDuration=Math.max(.5,Number(gate.duration)||4);
    const totalDuration=Math.max(gateDuration,personalDuration);
    racer.effectType=String(gate.type||"cloud_step");
    racer.effectName=String(gate.name||portal.shortName||"Cổng cảnh giới")+(personal?" · "+personal.name:"");
    racer.effectPolarity=personal&&personal.polarity!==gate.polarity?"mixed":(personal?personal.polarity:gate.polarity||"positive");
    racer.effectTimer=totalDuration;racer.effectDuration=totalDuration;
    racer.speedMultiplier=clamp(gateMultiplier*personalMultiplier,limits.min,limits.max);
    racer.effectCooldown=totalDuration;
    racer.personalEffectType=personal?personal.type:"";
    racer.personalEffectName=personal?personal.name:"";
    racer.personalEffectPolarity=personal?personal.polarity:"";
    racer.personalEffectMultiplier=personalMultiplier;
    racer.portalEffectIndex=index;
    racer.pendingEffect=null;racer.pendingEffectTimer=0;
    const count=racers.length>=70?2:racers.length>=40?4:8;
    if(typeof addParticles==="function")addParticles(racerX(racer),laneY(racers.indexOf(racer)),count,gate.color||"#d9f2ff");
  }

  // Mỗi tiên nhân chỉ chịu tác động một lần tại mỗi cổng; tiến độ và quãng
  // đường không đổi. Hiệu ứng cổng được áp dụng sau updateRace để ghi đè
  // sạch hiệu ứng cũ, kể cả hiệu ứng ngẫu nhiên vừa được xếp lịch ở frame đó.
  if(typeof createRacer==="function"){
    const baseCreateRacer=createRacer;
    createRacer=function(name,index){
      const racer=baseCreateRacer(name,index);
      racer.realmPortalMask=0;
      return racer;
    };
  }
  if(typeof startRace==="function"){
    const baseStartRace=startRace;
    startRace=function(){
      baseStartRace();
      if(running)racers.forEach(racer=>{racer.realmPortalMask=0;});
    };
  }
  if(typeof updateRace==="function"){
    const baseUpdateRace=updateRace;
    updateRace=function(dt){
      const before=new Map(racers.map(racer=>[racer.id,Number(racer.progress)||0]));
      baseUpdateRace(dt);
      if(!started||!portals.length)return;
      racers.forEach(racer=>{
        if(racer.finished)return;
        const previous=before.get(racer.id)||0,current=Number(racer.progress)||0;
        if(current<=previous)return;
        portals.forEach((portal,index)=>{
          const bit=1<<index,threshold=Number(portal.progress)*distance;
          if(!(racer.realmPortalMask&bit)&&previous<threshold&&current>=threshold){
            racer.realmPortalMask|=bit;
            applyPortalEffect(racer,portal,index);
          }
        });
      });
    };
  }

  function drawJourneyPortals(){
    if(!racers.length||!started||finished||!portals.length)return;
    const progress=frameProgress;
    let portal=null,index=-1;
    for(let i=0;i<portals.length;i++){
      const gap=Number(portals[i].progress||0)-progress;
      if(gap>=0){portal=portals[i];index=i;break;}
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
    const destination=regions[index+1];
    const label=String(destination&&destination.name||portal.shortName||("CẢNH GIỚI "+(index+2))).toLocaleUpperCase("vi");
    ctx.font="bold 14px Georgia,serif";ctx.textAlign="center";ctx.textBaseline="middle";
    const labelWidth=Math.min(280,Math.max(150,ctx.measureText(label).width+34)),labelY=top-24;
    ctx.fillStyle="rgba(12,23,42,.94)";ctx.fillRect(x-labelWidth/2,labelY-14,labelWidth,28);
    ctx.strokeStyle=color;ctx.lineWidth=2;ctx.strokeRect(x-labelWidth/2,labelY-14,labelWidth,28);
    ctx.fillStyle="#fff4d5";ctx.fillText(label,x,labelY,labelWidth-18);
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
    drawCameraBackground=function(time){baseCameraBackground(time);drawMiniRealm(time||0);};
  }
  if(typeof drawTrackLines==="function"){
    const baseDrawTrackLines=drawTrackLines;
    drawTrackLines=function(){baseDrawTrackLines();drawJourneyPortals();};
  }
})();
