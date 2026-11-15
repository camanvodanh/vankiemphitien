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

  function currentProgress(){
    if(typeof finished!=="undefined"&&finished)return 1;
    if(!Array.isArray(racers)||!racers.length||!(Number(distance)>0))return 0;
    let furthest=0;
    for(let i=0;i<racers.length;i++){
      const value=Number(racers[i]&&racers[i].progress)||0;
      if(value>furthest)furthest=value;
    }
    return Math.max(0,Math.min(1,furthest/distance));
  }
  function smooth(value){const t=Math.max(0,Math.min(1,value));return t*t*(3-2*t);}
  function activeBlend(progress){
    if(!regions.length)return [];
    for(let i=1;i<regions.length;i++){
      const boundary=Number(regions[i].start)||0;
      if(progress>=boundary-transitionWidth&&progress<=boundary+transitionWidth){
        const mix=smooth((progress-(boundary-transitionWidth))/(transitionWidth*2));
        return [{region:regions[i-1],alpha:1-mix},{region:regions[i],alpha:mix}];
      }
    }
    let active=regions[0];
    for(let i=1;i<regions.length;i++)if(progress>=Number(regions[i].start||0))active=regions[i];
    return [{region:active,alpha:1}];
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
  function drawRegionLandmark(target,region,time){
    const kind=region.landmark;
    if(kind==="valley"){
      target.fillStyle="#365b4c";target.beginPath();target.moveTo(0,440);target.lineTo(0,310);target.lineTo(90,265);target.lineTo(155,320);target.lineTo(245,278);target.lineTo(320,440);target.closePath();target.fill();
      target.beginPath();target.moveTo(790,440);target.lineTo(865,285);target.lineTo(940,325);target.lineTo(1025,258);target.lineTo(1100,315);target.lineTo(1100,440);target.closePath();target.fill();
      target.fillStyle="#d8f5e8";target.fillRect(130,318,5,112);target.fillRect(886,326,4,102);
      target.fillStyle="#b9e6d8";target.fillRect(126,350,2,70);target.fillRect(889,350,2,62);
      // Cổng sơn môn ở xa, đặt vào lòng thung lũng thay vì phủ lên cảnh nền.
      target.fillStyle="#624b39";target.fillRect(478,335,144,86);target.fillStyle="#b99a61";target.fillRect(489,347,122,66);
      target.fillStyle="#38594e";target.fillRect(500,358,100,55);target.fillStyle="#e3c98c";target.fillRect(474,331,152,7);
      for(let i=0;i<5;i++)target.fillRect(493+i*27,344,3,68);
    }else if(kind==="floating"){
      drawIsland(target,190,300+Math.sin(time*.00035)*3,.78,"#8db9c7");
      drawIsland(target,535,238+Math.sin(time*.00028+1)*4,1.05,"#b4d7d2");
      drawIsland(target,900,315+Math.sin(time*.00032+2)*3,.72,"#83b5b5");
      target.fillStyle="#536d70";target.fillRect(515,205,40,19);target.fillRect(522,191,26,15);
      target.fillStyle="#d9c48d";target.beginPath();target.moveTo(505,207);target.quadraticCurveTo(535,183,565,207);target.lineTo(559,211);target.lineTo(511,211);target.closePath();target.fill();
      target.strokeStyle="rgba(224,248,244,.78)";target.lineWidth=3;target.beginPath();target.moveTo(65,265);target.quadraticCurveTo(250,225,385,263);target.moveTo(700,275);target.quadraticCurveTo(870,235,1050,268);target.stroke();
    }else if(kind==="sword"){
      target.fillStyle="#2d4567";target.beginPath();target.moveTo(300,440);target.lineTo(430,286);target.lineTo(500,328);target.lineTo(590,210);target.lineTo(700,330);target.lineTo(770,278);target.lineTo(900,440);target.closePath();target.fill();
      target.fillStyle="rgba(188,218,246,.72)";target.beginPath();target.moveTo(590,210);target.lineTo(620,300);target.lineTo(590,282);target.lineTo(565,305);target.closePath();target.fill();
      drawSwordLandmark(target,245,285,.78,-.18,"#c8e8f7");drawSwordLandmark(target,375,235,.9,.12,"#d8e8ff");drawSwordLandmark(target,790,250,.82,-.1,"#c5e4ff");drawSwordLandmark(target,925,300,.7,.16,"#d8e8ff");drawSwordLandmark(target,690,195,.62,.2,"#b7d7f2");
    }else if(kind==="thunder"){
      target.fillStyle="rgba(30,28,64,.92)";[[150,180,155,34],[365,155,190,42],[660,177,205,38],[930,160,170,42]].forEach(([x,y,w,h])=>{target.beginPath();target.ellipse(x,y,w/2,h/2,0,0,Math.PI*2);target.fill();});
      target.strokeStyle=region.accent||"#c4b8ff";target.lineWidth=4;target.beginPath();
      target.moveTo(255,185);target.lineTo(235,225);target.lineTo(260,225);target.lineTo(226,282);
      target.moveTo(740,170);target.lineTo(718,215);target.lineTo(744,215);target.lineTo(708,270);
      target.moveTo(980,205);target.lineTo(960,240);target.lineTo(980,240);target.lineTo(951,286);target.stroke();
      target.fillStyle="rgba(205,196,255,.7)";target.fillRect(252,223,4,4);target.fillRect(741,213,4,4);
    }else if(kind==="celestial"){
      target.strokeStyle="rgba(255,226,151,.72)";target.lineWidth=2;
      for(let i=0;i<9;i++){const a=Math.PI*2*i/9;target.beginPath();target.moveTo(550+Math.cos(a)*125,250+Math.sin(a)*80);target.lineTo(550+Math.cos(a)*205,250+Math.sin(a)*135);target.stroke();}
      target.fillStyle="#765b3e";target.fillRect(430,282,240,75);target.fillRect(462,252,176,35);
      target.fillStyle="#c49a57";target.fillRect(444,290,212,58);target.fillRect(474,260,152,25);
      target.fillStyle="#f0d38e";for(let i=0;i<7;i++)target.fillRect(452+i*32,294,5,52);
      target.beginPath();target.moveTo(405,287);target.quadraticCurveTo(550,202,695,287);target.lineTo(674,294);target.quadraticCurveTo(550,229,426,294);target.closePath();target.fill();
      target.beginPath();target.moveTo(454,255);target.quadraticCurveTo(550,205,646,255);target.lineTo(630,261);target.quadraticCurveTo(550,224,470,261);target.closePath();target.fill();
      target.fillStyle="#fff0bb";target.fillRect(535,235,30,8);
      target.fillStyle="#c69b5d";target.fillRect(355,380,390,14);target.fillStyle="#f2d69b";target.fillRect(385,394,330,5);
    }
  }
  function drawRegionScene(target,region,time,alpha=1){
    target.save();target.globalAlpha=alpha;
    drawRealmSky(target,region,time);
    drawRegionLandmark(target,region,time);
    target.restore();
  }
  function drawMainRealm(time){
    if(!regions.length||typeof ctx==="undefined")return;
    const blend=activeBlend(frameProgress);
    if(blend.length===1){drawRegionScene(ctx,blend[0].region,time,1);return;}
    // Vẽ cảnh mới kín khung trước, rồi phủ cảnh cũ với alpha giảm dần.
    // Nhờ vậy hai cảnh thực sự crossfade, không còn thấy cảnh gốc xuyên qua như lớp filter.
    drawRegionScene(ctx,blend[1].region,time,1);
    drawRegionScene(ctx,blend[0].region,time,blend[0].alpha);
  }
  function drawMiniRealm(){
    if(!regions.length||typeof cameraCtx==="undefined")return;
    const blend=activeBlend(frameProgress),width=cameraCanvas.width,height=cameraCanvas.height;
    const active=blend.length===1?blend[0].region:blend[1].region;
    cameraCtx.save();cameraCtx.globalAlpha=.18;cameraCtx.fillStyle=active.tint||"#8ac8bd";cameraCtx.fillRect(0,0,width,height);
    cameraCtx.globalAlpha=.85;cameraCtx.fillStyle=active.accent||"#d7e9d0";cameraCtx.fillRect(0,0,width,3);cameraCtx.fillRect(0,height-4,width,4);cameraCtx.restore();
  }
  function drawJourneyPortals(){
    if(!racers.length||finished||!portals.length)return;
    const progress=frameProgress;
    // Chỉ hiện cổng kế tiếp; các cổng ở xa không còn dồn thành một hàng phủ kín đường đua.
    let portal=null,index=-1;
    for(let i=0;i<portals.length;i++){
      if(progress<Number(portals[i].progress||0)+.012){portal=portals[i];index=i;break;}
    }
    if(!portal)return;
    const distanceToPortal=Number(portal.progress||0)-progress;
    if(distanceToPortal>.24)return;
    const x=TRACK.left+35+(TRACK.right-TRACK.left-45)*Number(portal.progress||0);
    const top=TRACK.top+8,bottom=TRACK.bottom-142,color=portal.color||"#a9d9d5";
    const alpha=Math.max(.25,Math.min(.96,1-distanceToPortal*2.7));
    ctx.save();ctx.globalAlpha=alpha;
    // Một cổng duy nhất phía trước đoàn đua, tạo cảm giác đang tiến đến ranh giới cảnh giới.
    ctx.fillStyle="#273b43";ctx.fillRect(x-20,top+34,5,bottom-top-68);ctx.fillRect(x+15,top+34,5,bottom-top-68);
    ctx.fillStyle=color;ctx.fillRect(x-19,top+37,2,bottom-top-74);ctx.fillRect(x+17,top+37,2,bottom-top-74);
    ctx.fillStyle="#d8c38b";ctx.fillRect(x-24,top+29,13,5);ctx.fillRect(x+11,top+29,13,5);ctx.fillRect(x-24,bottom-37,13,5);ctx.fillRect(x+11,bottom-37,13,5);
    ctx.strokeStyle="#273b43";ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(x-23,top+36);ctx.quadraticCurveTo(x,top-2,x+23,top+36);ctx.stroke();
    ctx.strokeStyle=color;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(x-23,top+36);ctx.quadraticCurveTo(x,top-2,x+23,top+36);ctx.stroke();
    ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(x,top+10);ctx.lineTo(x+5,top+17);ctx.lineTo(x,top+24);ctx.lineTo(x-5,top+17);ctx.closePath();ctx.fill();
    ctx.fillStyle="#1c303b";ctx.fillRect(x-34,top+4,68,12);ctx.strokeStyle=color;ctx.lineWidth=1;ctx.strokeRect(x-34.5,top+3.5,69,13);
    ctx.fillStyle="#fff4d5";ctx.font="bold 7px Arial";ctx.textAlign="center";ctx.textBaseline="middle";
    ctx.fillText(String(portal.shortName||("CẢNH GIỚI "+(index+2))),x,top+10,64);
    ctx.restore();
  }
  if(typeof render==="function"){
    const baseRender=render;
    render=function(time){frameProgress=currentProgress();baseRender(time);};
  }
  if(typeof drawScenery==="function"){
    const baseDrawScenery=drawScenery;
    drawScenery=function(time){baseDrawScenery(time);drawMainRealm(time||0);};
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
