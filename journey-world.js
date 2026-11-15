/* Vạn Kiếm Phi Tiên — hành trình xuyên ngũ cảnh giới
 * Chỉ thay đổi lớp phong cảnh; không can thiệp tiến độ, thời lượng hay gameplay.
 */
(function installJourneyWorld(){
  "use strict";
  const config = (window.VKP_DATA && window.VKP_DATA.scenery && window.VKP_DATA.scenery.journey) || {};
  const regions = Array.isArray(config.regions) ? config.regions : [];
  const portals = Array.isArray(config.portals) ? config.portals : [];
  const transitionWidth = Math.max(.005, Math.min(.04, Number(config.transitionWidth) || .018));
  let frameProgress=0;

  function currentProgress(){
    if(typeof finished !== "undefined" && finished) return 1;
    if(!Array.isArray(racers) || !racers.length || !(Number(distance)>0)) return 0;
    let furthest = 0;
    for(let i=0;i<racers.length;i++){
      const value = Number(racers[i] && racers[i].progress) || 0;
      if(value>furthest) furthest=value;
    }
    return Math.max(0,Math.min(1,furthest/distance));
  }

  function smooth(value){
    const t=Math.max(0,Math.min(1,value));
    return t*t*(3-2*t);
  }

  function activeBlend(progress){
    if(!regions.length) return [];
    for(let i=1;i<regions.length;i++){
      const boundary=Number(regions[i].start)||0;
      if(progress>=boundary-transitionWidth && progress<=boundary+transitionWidth){
        const mix=smooth((progress-(boundary-transitionWidth))/(transitionWidth*2));
        return [{region:regions[i-1],alpha:1-mix},{region:regions[i],alpha:mix}];
      }
    }
    let active=regions[0];
    for(let i=1;i<regions.length;i++){
      if(progress>=Number(regions[i].start||0)) active=regions[i];
    }
    return [{region:active,alpha:1}];
  }

  function drawSwordLandmark(target,x,y,scale,angle,color){
    target.save();
    target.translate(x,y);
    target.rotate(angle||0);
    target.scale(scale,scale);
    target.fillStyle="#34495d";
    target.fillRect(-2,3,4,12);
    target.fillStyle="#d8bd7b";
    target.fillRect(-6,1,12,3);
    target.fillStyle=color;
    target.beginPath();
    target.moveTo(0,-27);target.lineTo(4,-5);target.lineTo(2,3);
    target.lineTo(-2,3);target.lineTo(-4,-5);target.closePath();
    target.fill();
    target.strokeStyle="rgba(245,250,255,.88)";
    target.lineWidth=1;target.stroke();
    target.restore();
  }

  function drawIsland(target,x,y,scale,color){
    target.save();target.translate(x,y);target.scale(scale,scale);
    target.fillStyle="#435e67";
    target.beginPath();target.moveTo(-76,0);target.quadraticCurveTo(-48,-15,0,-12);
    target.quadraticCurveTo(48,-18,76,0);target.lineTo(43,18);target.lineTo(15,31);
    target.lineTo(-18,24);target.closePath();target.fill();
    target.fillStyle=color;
    target.beginPath();target.moveTo(-82,-3);target.quadraticCurveTo(-42,-22,0,-15);
    target.quadraticCurveTo(43,-22,82,-3);target.quadraticCurveTo(35,7,-8,5);
    target.quadraticCurveTo(-48,8,-82,-3);target.closePath();target.fill();
    target.fillStyle="rgba(239,250,232,.62)";
    target.fillRect(-42,-8,26,2);target.fillRect(20,-10,31,2);
    target.restore();
  }

  function drawRegionLandmark(target,region,time,alpha){
    const kind=region.landmark;
    target.save();
    target.globalAlpha=alpha;
    if(kind==="valley"){
      // Vách núi ngọc và hai dòng thác xa, làm giàu cảnh mở màn.
      target.fillStyle="#456b58";
      target.beginPath();target.moveTo(0,395);target.lineTo(0,310);target.lineTo(90,265);
      target.lineTo(155,320);target.lineTo(245,278);target.lineTo(320,395);target.closePath();target.fill();
      target.beginPath();target.moveTo(790,395);target.lineTo(865,285);target.lineTo(940,325);
      target.lineTo(1025,258);target.lineTo(1100,315);target.lineTo(1100,395);target.closePath();target.fill();
      target.fillStyle="rgba(204,244,231,.72)";
      target.fillRect(130,318,5,74);target.fillRect(886,326,4,67);
      target.fillStyle="rgba(245,255,235,.65)";
      target.fillRect(126,350,2,30);target.fillRect(889,350,2,32);
    }else if(kind==="floating"){
      // Đảo tiên nhiều tầng lơ lửng trên biển mây.
      drawIsland(target,190,300+Math.sin(time*.00035)*3,.78,"#8db9a7");
      drawIsland(target,535,238+Math.sin(time*.00028+1)*4,1.05,"#a8c8bd");
      drawIsland(target,900,315+Math.sin(time*.00032+2)*3,.72,"#83a99f");
      target.fillStyle="#536d70";
      target.fillRect(515,205,40,19);target.fillRect(522,191,26,15);
      target.fillStyle="#d9c48d";
      target.beginPath();target.moveTo(505,207);target.quadraticCurveTo(535,183,565,207);target.lineTo(559,211);target.lineTo(511,211);target.closePath();target.fill();
      target.strokeStyle="rgba(224,248,244,.7)";target.lineWidth=2;
      target.beginPath();target.moveTo(65,265);target.quadraticCurveTo(250,225,385,263);
      target.moveTo(700,275);target.quadraticCurveTo(870,235,1050,268);target.stroke();
    }else if(kind==="sword"){
      // Kiếm sơn và các thanh phi kiếm trấn giữ thiên không.
      target.fillStyle="#394e70";
      target.beginPath();target.moveTo(300,395);target.lineTo(430,286);target.lineTo(500,328);
      target.lineTo(590,210);target.lineTo(700,330);target.lineTo(770,278);
      target.lineTo(900,395);target.closePath();target.fill();
      target.fillStyle="rgba(188,218,246,.72)";
      target.beginPath();target.moveTo(590,210);target.lineTo(620,300);target.lineTo(590,282);
      target.lineTo(565,305);target.closePath();target.fill();
      drawSwordLandmark(target,245,285,.78,-.18,"#c8e8f7");
      drawSwordLandmark(target,375,235,.9,.12,"#d8e8ff");
      drawSwordLandmark(target,790,250,.82,-.1,"#c5e4ff");
      drawSwordLandmark(target,925,300,.7,.16,"#d8e8ff");
      drawSwordLandmark(target,690,195,.62,.2,"#b7d7f2");
    }else if(kind==="thunder"){
      // Tầng mây lôi vực, nét sét góc cạnh kiểu pixel-art.
      target.fillStyle="rgba(37,37,73,.66)";
      [[150,180,155,34],[365,155,190,42],[660,177,205,38],[930,160,170,42]].forEach(([x,y,w,h])=>{
        target.beginPath();target.ellipse(x,y,w/2,h/2,0,0,Math.PI*2);target.fill();
      });
      target.strokeStyle=region.accent||"#c4b8ff";target.lineWidth=4;
      target.beginPath();
      target.moveTo(255,185);target.lineTo(235,225);target.lineTo(260,225);target.lineTo(226,282);
      target.moveTo(740,170);target.lineTo(718,215);target.lineTo(744,215);target.lineTo(708,270);
      target.moveTo(980,205);target.lineTo(960,240);target.lineTo(980,240);target.lineTo(951,286);
      target.stroke();
      target.fillStyle="rgba(205,196,255,.55)";
      target.fillRect(252,223,4,4);target.fillRect(741,213,4,4);
    }else if(kind==="celestial"){
      // Thiên cung dát vàng hiện ra trên tầng mây cuối hành trình.
      target.strokeStyle="rgba(255,226,151,.62)";target.lineWidth=2;
      for(let i=0;i<9;i++){
        const a=(Math.PI*2*i)/9;
        target.beginPath();target.moveTo(550+Math.cos(a)*125,250+Math.sin(a)*80);
        target.lineTo(550+Math.cos(a)*205,250+Math.sin(a)*135);target.stroke();
      }
      target.fillStyle="#765b3e";
      target.fillRect(430,282,240,75);target.fillRect(462,252,176,35);
      target.fillStyle="#c49a57";
      target.fillRect(444,290,212,58);target.fillRect(474,260,152,25);
      target.fillStyle="#f0d38e";
      for(let i=0;i<7;i++)target.fillRect(452+i*32,294,5,52);
      target.beginPath();target.moveTo(405,287);target.quadraticCurveTo(550,202,695,287);
      target.lineTo(674,294);target.quadraticCurveTo(550,229,426,294);target.closePath();target.fill();
      target.beginPath();target.moveTo(454,255);target.quadraticCurveTo(550,205,646,255);
      target.lineTo(630,261);target.quadraticCurveTo(550,224,470,261);target.closePath();target.fill();
      target.fillStyle="#fff0bb";target.fillRect(535,235,30,8);
    }
    target.restore();
  }

  function drawMainRealm(time){
    if(!regions.length || typeof ctx==="undefined")return;
    const blend=activeBlend(frameProgress);
    for(let i=0;i<blend.length;i++){
      const item=blend[i],region=item.region,alpha=item.alpha;
      if(alpha<=.015)continue;
      ctx.save();
      ctx.globalAlpha=alpha*.20;
      ctx.fillStyle=region.tint||"#8ac8bd";
      ctx.fillRect(0,0,W,555);
      ctx.globalAlpha=1;
      drawRegionLandmark(ctx,region,time,alpha*.76);
      ctx.restore();
    }
  }

  function drawMiniRealm(){
    if(!regions.length || typeof cameraCtx==="undefined")return;
    const blend=activeBlend(frameProgress);
    const width=cameraCanvas.width,height=cameraCanvas.height;
    for(let i=0;i<blend.length;i++){
      const item=blend[i];
      if(item.alpha<=.015)continue;
      cameraCtx.save();
      cameraCtx.globalAlpha=item.alpha*.17;
      cameraCtx.fillStyle=item.region.tint||"#8ac8bd";
      cameraCtx.fillRect(0,0,width,height);
      cameraCtx.globalAlpha=item.alpha*.78;
      cameraCtx.fillStyle=item.region.accent||"#d7e9d0";
      cameraCtx.fillRect(0,0,width,3);
      cameraCtx.fillRect(0,height-4,width,4);
      cameraCtx.restore();
    }
  }

  function drawJourneyPortals(time){
    if(!racers.length || finished || !portals.length)return;
    const progress=frameProgress;
    const top=TRACK.top+8;
    const bottom=TRACK.bottom-142;
    portals.forEach((portal,index)=>{
      const x=TRACK.left+35+(TRACK.right-TRACK.left-45)*Number(portal.progress||0);
      const color=portal.color||"#a9d9d5";
      const distanceToLeader=Math.abs(progress-Number(portal.progress||0));
      const alpha=distanceToLeader<.12?.96:.66;
      ctx.save();
      ctx.globalAlpha=alpha;
      // Khung cổng mảnh, khác hình khối với ba cổng sự kiện.
      ctx.fillStyle="#273b43";
      ctx.fillRect(x-20,top+34,5,bottom-top-68);
      ctx.fillRect(x+15,top+34,5,bottom-top-68);
      ctx.fillStyle=color;
      ctx.fillRect(x-19,top+37,2,bottom-top-74);
      ctx.fillRect(x+17,top+37,2,bottom-top-74);
      ctx.fillStyle="#d8c38b";
      ctx.fillRect(x-24,top+29,13,5);
      ctx.fillRect(x+11,top+29,13,5);
      ctx.fillRect(x-24,bottom-37,13,5);
      ctx.fillRect(x+11,bottom-37,13,5);
      ctx.strokeStyle="#273b43";ctx.lineWidth=7;
      ctx.beginPath();ctx.moveTo(x-23,top+36);ctx.quadraticCurveTo(x,top-2,x+23,top+36);ctx.stroke();
      ctx.strokeStyle=color;ctx.lineWidth=2.5;
      ctx.beginPath();ctx.moveTo(x-23,top+36);ctx.quadraticCurveTo(x,top-2,x+23,top+36);ctx.stroke();
      ctx.fillStyle=color;
      ctx.beginPath();ctx.moveTo(x,top+10);ctx.lineTo(x+5,top+17);ctx.lineTo(x,top+24);ctx.lineTo(x-5,top+17);ctx.closePath();ctx.fill();
      // Bảng tên chuyển cảnh đặt thấp hơn bảng của cổng sự kiện để tránh chồng chữ.
      ctx.fillStyle="#1c303b";ctx.fillRect(x-34,top+4,68,12);
      ctx.strokeStyle=color;ctx.lineWidth=1;ctx.strokeRect(x-34.5,top+3.5,69,13);
      ctx.fillStyle="#fff4d5";ctx.font="bold 7px Arial";ctx.textAlign="center";ctx.textBaseline="middle";
      ctx.fillText(String(portal.shortName||("CẢNH GIỚI "+(index+2))),x,top+10,64);
      ctx.restore();
    });
  }

  if(typeof render==="function"){
    const baseRender=render;
    render=function(time){
      frameProgress=currentProgress();
      baseRender(time);
    };
  }

  if(typeof drawScenery==="function"){
    const baseDrawScenery=drawScenery;
    drawScenery=function(time){
      baseDrawScenery(time);
      drawMainRealm(time||0);
    };
  }
  if(typeof drawCameraBackground==="function"){
    const baseCameraBackground=drawCameraBackground;
    drawCameraBackground=function(time){
      baseCameraBackground(time);
      drawMiniRealm();
    };
  }
  if(typeof drawTrackLines==="function"){
    const baseDrawTrackLines=drawTrackLines;
    drawTrackLines=function(){
      baseDrawTrackLines();
      drawJourneyPortals(typeof sceneTime==="number"?sceneTime:0);
    };
  }
})();
