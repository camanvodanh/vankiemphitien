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
    const progress=Math.max(0,Math.min(1,furthest/distance));
    // Dùng chung tiến độ đã quét một lần cho cả cổng cảnh giới và cổng gameplay.
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
    if(!regions.length||typeof ctx==="undefined"||frameProgress<Number(regions[1]&&regions[1].start||.2))return;
    const blend=activeBlend(frameProgress);
    if(!blend.length)return;
    // Chỉ thay tầng trời/sơn mạch sau khi đã đi qua cổng đầu tiên.
    // Nguồn cảnh gốc và quảng trường tiền cảnh vẫn nguyên vẹn.
    ctx.save();ctx.beginPath();ctx.rect(0,0,1100,478);ctx.clip();
    if(blend.length===1){drawRegionScene(ctx,blend[0].region,time,1);ctx.restore();return;}
    if(blend[0].region)drawRegionScene(ctx,blend[0].region,time,blend[0].alpha);
    drawRegionScene(ctx,blend[1].region,time,blend[1].alpha);
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
    drawScenery=function(time){baseDrawScenery(time);if(frameProgress>=Number(regions[1]&&regions[1].start||.2))drawMainRealm(time||0);};
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
