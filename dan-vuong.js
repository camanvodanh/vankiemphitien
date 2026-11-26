"use strict";
(() => {
  const canvas=document.getElementById("danScene");
  if(!canvas) return;
  const ctx=canvas.getContext("2d");
  const cameraCanvas=document.getElementById("alchemyCamera");
  const cameraCtx=cameraCanvas?.getContext("2d");
  const W=1600,H=1000;
  const TAU=Math.PI*2;
  let raf=0,last=0;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const gold="#d6b66f";
  const robes=["#807b69","#4d83a1","#d8dfd0","#d2ad5b","#c7d5e6","#755b91"];
  const darks=["#4d493f","#294f6c","#668d88","#805b2c","#526d91","#443451"];
  // Cùng bảng màu cấp bậc nhân vật với trường đua Vạn Kiếm Phi Tiên.
  const ROLE={
    servant:{robe:"#817b6a",dark:"#4f4b42",belt:"#a99b77",aura:null,scale:.72},
    outer:{robe:"#4d83a1",dark:"#294f6c",belt:"#c3a86b",aura:null,scale:.8},
    inner:{robe:"#d8dfd0",dark:"#719b9a",belt:"#d5b86e",aura:"#b5e5d8",scale:.88},
    core:{robe:"#d6b45e",dark:"#89602e",belt:"#fff0b2",aura:"#ffe3a0",scale:.98},
    disciple:{robe:"#c9d7e8",dark:"#526d91",belt:"#f3d88b",aura:"#b9d8ff",scale:1.08},
    elder:{robe:"#755b91",dark:"#443451",belt:"#e5c67d",aura:"#d8c2ff",scale:1.15},
    master:{robe:"#a83f36",dark:"#592b2b",belt:"#f6d88b",aura:"#ffe8a4",scale:1.38}
  };
  function drawAura(x,y,radius,color,time,phase=0){
    if(!color)return;
    const pulse=1+Math.sin(time*.003+phase)*.08;
    const g=ctx.createRadialGradient(x,y,2,x,y,radius*pulse);
    g.addColorStop(0,color+"55");g.addColorStop(.45,color+"22");g.addColorStop(1,color+"00");
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,radius*pulse,0,TAU);ctx.fill();
  }

  const flames=Array.from({length:16},(_,i)=>({phase:i*.83,heat:.72+(i%4)*.055}));
  // Phase 2: autonomous alchemy simulation (observer mode)
  const PHASES=[{name:"Khống hỏa",end:.22},{name:"Tinh luyện",end:.47},{name:"Dung hợp",end:.72},{name:"Ngưng đan",end:1}];
  const STRATEGIES=["Tốc độ","Chất lượng","Cân bằng","Mạo hiểm"];
  let seed=20261126;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
  const npcs=Array.from({length:16},(_,i)=>({id:i+1,name:["Lăng Vân","Mặc Trần","Tử Yên","Thanh Huyền","Bạch Ly","Cố Minh","Diệp Khanh","Hàn Phong","Vân Chi","Tạ Nguyệt","Lục Dương","Thẩm Dao","Kỷ Ninh","Tô Mặc","Ninh Tuyết","Phong Dật"][i],
    stats:{alchemy:58+Math.floor(rand()*39),fire:55+Math.floor(rand()*42),sense:54+Math.floor(rand()*43),spirit:55+Math.floor(rand()*42),speed:55+Math.floor(rand()*42),calm:52+Math.floor(rand()*46)},
    strategy:STRATEGIES[i%4],progress:0,phase:0,status:"Đang chuẩn bị",done:false,success:false,quality:0,event:"",elapsed:0}));
  let simElapsed=0,lastSim=0,simStarted=false,eventText="Mười sáu đệ tử chuẩn bị khai lò";
  function beginSimulation(){if(simStarted)return;simStarted=true;lastSim=performance.now()}
  function updateSimulation(now){
    if(!simStarted)beginSimulation();const dt=Math.min(100,Math.max(0,now-lastSim));lastSim=now;simElapsed+=dt;
    for(let i=0;i<npcs.length;i++){const n=npcs[i];if(n.done)continue;
      const avg=(n.stats.alchemy+n.stats.fire+n.stats.sense+n.stats.spirit+n.stats.speed+n.stats.calm)/6;
      const strategyBoost=n.strategy==="Tốc độ"?1.2:n.strategy==="Chất lượng"?.91:n.strategy==="Mạo hiểm"?1.08:1;
      const target=210000*(1.12-avg/500)/strategyBoost;
      n.progress=clamp(n.progress+dt/target,0,1);n.elapsed+=dt;
      const phase=PHASES.findIndex(p=>n.progress<=p.end);n.phase=phase<0?3:phase;
      n.status=PHASES[n.phase].name;
      flames[i].heat=clamp(.58+n.stats.fire/220+(n.phase===0?.13:n.phase===3?.08:0)+Math.sin(now*.002+i)*.035,.55,1.15);
      if(n.progress>=1){n.done=true;n.success=rand()<(0.68+n.stats.alchemy/500+n.stats.calm/900-(n.strategy==="Mạo hiểm"?.16:0));
        n.quality=clamp(Math.round((n.stats.alchemy*.34+n.stats.sense*.24+n.stats.spirit*.18+n.stats.fire*.14+n.stats.calm*.1)+(n.strategy==="Chất lượng"?7:0)+(n.strategy==="Mạo hiểm"?rand()*18-8:0)),1,100);
        const events=["Đan văn hiện thế","Đan khí ngưng tụ","Một lò thành song đan","Đan lô chấn động","Hỏa thế nghịch chuyển"];
        if(n.success&&n.quality>88&&rand()>.45){n.event=events[Math.floor(rand()*events.length)];eventText="Lò "+String(n.id).padStart(2,"0")+": "+n.event}
        else if(!n.success){n.event="Luyện đan thất bại";eventText="Lò "+String(n.id).padStart(2,"0")+": đan lô tắt lửa"}
        n.status=n.success?"Đã thành đan":"Thất bại";
      }
    }
    const done=npcs.filter(n=>n.done).length;const running=npcs.filter(n=>!n.done);
    const leader=[...npcs].sort((a,b)=>b.progress-a.progress)[0];
    const phase=running.length?PHASES[running.reduce((a,n)=>a+n.phase,0)/running.length|0].name:"Hoàn tất";
    const time=document.getElementById("alchemyTime");if(time)time.textContent="TIẾN TRÌNH "+Math.floor(simElapsed/1000)+"s · "+done+"/16 lò hoàn tất";
    const phaseEl=document.getElementById("alchemyPhase");if(phaseEl)phaseEl.textContent="CÔNG ĐOẠN CHỦ ĐẠO: "+phase;
    const eventEl=document.getElementById("alchemyEvent");if(eventEl)eventEl.textContent=eventText;
    const leadEl=document.getElementById("alchemyLeader");if(leadEl)leadEl.textContent="DẪN ĐẦU: "+leader.name+" · "+Math.floor(leader.progress*100)+"%";
    const countEl=document.getElementById("alchemyCount");if(countEl)countEl.textContent=npcs.filter(n=>n.success).length+" thành đan · "+npcs.filter(n=>n.done&&!n.success).length+" thất bại";
    renderTournament(now);
  }


  // Phase 3: live tournament scoring, appraisal, leaderboard and station inspection.
  const PILL_RANKS=[["Phàm phẩm",0],["Hạ phẩm",48],["Trung phẩm",60],["Thượng phẩm",72],["Cực phẩm",82],["Linh phẩm",90],["Địa phẩm",95],["Thiên phẩm",98],["Tiên phẩm",100]];
  let selectedNpc=0,lastBoardUpdate=0,finalAnnounced=false,cameraFocusUntil=0;
  const pillRank=q=>{let rank=PILL_RANKS[0][0];for(const r of PILL_RANKS)if(q>=r[1])rank=r[0];return rank};
  function scoreNpc(n){
    const speed=clamp(100-(n.elapsed/2600),0,100);
    const technique=clamp((n.stats.alchemy*.28+n.stats.fire*.22+n.stats.sense*.22+n.stats.spirit*.16+n.stats.calm*.12)*(n.success?1:.55),0,100);
    const quality=n.success?n.quality:0;
    n.scores={speed,technique,quality,total:speed*.25+technique*.35+quality*.40};
    return n.scores;
  }
  function renderTournament(now){
    if(now-lastBoardUpdate<450)return;lastBoardUpdate=now;
    const ranked=[...npcs].map(n=>({n,s:scoreNpc(n)})).sort((a,b)=>b.s.total-a.s.total);
    const board=document.getElementById("alchemyBoard");
    if(board)board.innerHTML=ranked.map((item,i)=>{const n=item.n,s=item.s;const medal=i===0?"👑":i===1?"🥈":i===2?"🥉":String(i+1).padStart(2,"0");return '<button class="rank-row '+(n.id-1===selectedNpc?'is-selected':'')+'" data-npc="'+(n.id-1)+'"><b>'+medal+'</b><span class="rank-name">'+n.name+'<small>'+ (n.done?(n.success?pillRank(n.quality):"Luyện đan thất bại"):n.status)+'</small></span><span class="rank-score">'+s.total.toFixed(1)+'<small>điểm</small></span></button>'}).join("");
    board?.querySelectorAll("[data-npc]").forEach(el=>el.addEventListener("click",()=>{selectedNpc=Number(el.dataset.npc);renderSelected()}));
    const finished=npcs.every(n=>n.done);
    const champion=ranked[0].n;
    const title=document.getElementById("tournamentState");
    if(title)title.textContent=finished?"ĐÃ KẾT THÚC · CÔNG BỐ BẢNG VÀNG":"ĐẠI HỘI ĐAN ĐẠO · ĐANG TRANH TÀI";
    const champ=document.getElementById("alchemyChampion");
    if(champ)champ.textContent=finished?"ĐAN VƯƠNG: "+champion.name+" · "+pillRank(champion.quality)+" · "+ranked[0].s.total.toFixed(1)+" điểm":"TẠM DẪN ĐẦU: "+champion.name+" · "+ranked[0].s.total.toFixed(1)+" điểm";
    const appraisal=document.getElementById("alchemyAppraisal");
    if(appraisal)appraisal.textContent=finished?"Trưởng lão đã giám định toàn bộ đan dược. Người đứng đầu được tôn xưng Đan Vương.":npcs.filter(n=>n.done).length+" / 16 đan lô đã đưa đan dược vào Giám Đan Các.";
    renderSelected();
    if(finished&&!finalAnnounced){finalAnnounced=true;eventText="Đại hội kết thúc · "+champion.name+" đoạt Đan Vương";const ev=document.getElementById("alchemyEvent");if(ev)ev.textContent=eventText}
  }
  function renderSelected(){
    const n=npcs[selectedNpc];if(!n)return;const s=scoreNpc(n);
    const el=document.getElementById("alchemyDetail");if(!el)return;
    el.innerHTML='<strong>LÒ '+String(n.id).padStart(2,"0")+' · '+n.name+'</strong><span>'+n.status+' · '+n.strategy+'</span><span>Đan thuật '+n.stats.alchemy+' · Khống hỏa '+n.stats.fire+' · Thần thức '+n.stats.sense+'</span><span>Linh lực '+n.stats.spirit+' · Tốc độ '+n.stats.speed+' · Tâm cảnh '+n.stats.calm+'</span><span>Điểm tốc độ '+s.speed.toFixed(1)+' · Kỹ thuật '+s.technique.toFixed(1)+' · Chất lượng '+s.quality.toFixed(1)+'</span><em>'+(n.done?(n.success?"Thành phẩm: "+pillRank(n.quality)+" · "+n.event:"Đan lô thất bại · "+n.event):"Tiến độ luyện đan: "+Math.floor(n.progress*100)+"%")+'</em>';
  }
  function resetTournament(){
    seed=20261126;
    npcs.forEach((n,i)=>{n.progress=0;n.phase=0;n.status="Đang chuẩn bị";n.done=false;n.success=false;n.quality=0;n.event="";n.elapsed=0;});
    flames.forEach((f,i)=>f.heat=.72+(i%4)*.055);
    simElapsed=0;lastSim=performance.now();simStarted=true;eventText="Đại hội Đan Đạo khai lò · 16 vị đệ tử vào cuộc";finalAnnounced=false;lastBoardUpdate=0;
    const ev=document.getElementById("alchemyEvent");if(ev)ev.textContent=eventText;
    renderTournament(lastBoardUpdate+1000);
  }
  canvas.addEventListener("click",e=>{
    const r=canvas.getBoundingClientRect();const x=(e.clientX-r.left)/r.width*W,y=(e.clientY-r.top)/r.height*H;
    let best=-1,dist=1e9;
    for(let i=0;i<16;i++){const row=Math.floor(i/4),col=i%4,s=.68+row*.12,px=300+col*335+(row%2?18:-18),py=590+row*111,d=Math.hypot((x-px)/s,(y-py)/s);if(d<dist){dist=d;best=i}}
    if(best>=0&&dist<95){selectedNpc=best;renderSelected();renderTournament(performance.now()+1000)}
  });
  document.getElementById("restartAlchemy")?.addEventListener("click",resetTournament);

  function path(points,fill,stroke=null,lw=1){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw;ctx.stroke()}}
  function roof(cx,y,w,h,color="#283b35"){
    path([[cx-w/2,y],[cx-w*.39,y-h*.52],[cx-w*.18,y-h*.78],[cx,y-h],[cx+w*.18,y-h*.78],[cx+w*.39,y-h*.52],[cx+w/2,y]],color,"#c8a75e",3);
    ctx.strokeStyle="#e6cc88";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx-w*.48,y-2);ctx.quadraticCurveTo(cx,y-h*.25,cx+w*.48,y-2);ctx.stroke();
    for(let i=-3;i<=3;i++){ctx.strokeStyle="#b28b4e88";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(cx+i*w*.12,y-h*.35);ctx.lineTo(cx+i*w*.14,y-2);ctx.stroke()}
    path([[cx-w*.5,y],[cx-w*.56,y+9],[cx-w*.42,y+5],[cx-w*.36,y]],"#b28d4f");
    path([[cx+w*.5,y],[cx+w*.56,y+9],[cx+w*.42,y+5],[cx+w*.36,y]],"#b28d4f");
  }
  function drawBackground(t){
    const sky=ctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,"#182d32");sky.addColorStop(.42,"#536b62");sky.addColorStop(1,"#b2a27b");ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
    const glow=ctx.createRadialGradient(800,210,10,800,210,500);glow.addColorStop(0,"#f5d99a55");glow.addColorStop(1,"#f5d99a00");ctx.fillStyle=glow;ctx.fillRect(250,0,1100,650);
    for(let i=0;i<7;i++){const x=i*270-80;path([[x,480],[x+110,300+(i%3)*25],[x+230,470],[x+320,330],[x+440,490]],i%2?"#344d48":"#40584d")}
    ctx.fillStyle="#c5b17b";ctx.fillRect(0,460,W,540);
    ctx.fillStyle="#7f795e";ctx.fillRect(0,480,W,520);
    // distant cloud bands
    for(let i=0;i<5;i++){const x=((i*390+t*.008)%1900)-150;ctx.fillStyle="#e5e1c455";ctx.beginPath();ctx.ellipse(x,320+i*27,160,18,0,0,TAU);ctx.fill()}
  }
  function drawPalace(t){
    // Rear ceremonial hall
    ctx.fillStyle="#18231f99";ctx.fillRect(260,190,1080,330);
    path([[330,500],[350,270],[480,225],[1120,225],[1250,270],[1270,500]],"#34463c","#d2b16b",4);
    ctx.fillStyle="#273a33";ctx.fillRect(455,285,690,220);
    for(let i=0;i<7;i++){const x=490+i*102;ctx.fillStyle="#5a3028";ctx.fillRect(x,310,56,194);ctx.fillStyle="#e1bf78";ctx.fillRect(x-4,305,64,7);ctx.fillRect(x-4,497,64,8);ctx.fillStyle="#172b29";ctx.fillRect(x+8,325,40,165);ctx.strokeStyle="#d9bd7d";ctx.lineWidth=2;ctx.strokeRect(x+8,325,40,165);ctx.fillStyle="#d8bc7c";ctx.fillRect(x+27,325,2,165)}
    for(let i=0;i<9;i++){const x=365+i*109;ctx.fillStyle="#6b392c";ctx.fillRect(x,260,18,245);ctx.fillStyle="#d7b66e";ctx.fillRect(x-5,258,28,8);ctx.fillRect(x-5,495,28,10)}
    roof(800,275,1020,190,"#243b34");roof(800,210,790,150,"#354b3d");roof(800,155,490,112,"#253a33");
    // sign board
    ctx.fillStyle="#d7b66e";ctx.fillRect(690,285,220,56);ctx.fillStyle="#6b3028";ctx.fillRect(698,292,204,42);ctx.strokeStyle="#f0d79b";ctx.lineWidth=2;ctx.strokeRect(698,292,204,42);
    ctx.fillStyle="#f6e4b8";ctx.font="bold 30px serif";ctx.textAlign="center";ctx.fillText("丹 王 殿",800,323);
    // ceremonial stairs
    for(let i=0;i<6;i++){ctx.fillStyle=i%2?"#8d7953":"#aa9365";ctx.fillRect(580-i*26,505+i*13,440+i*52,13);ctx.strokeStyle="#e2c987";ctx.lineWidth=2;ctx.strokeRect(580-i*26,505+i*13,440+i*52,13)}
    // side lanterns
    for(const x of [390,1210]){ctx.fillStyle="#c39a53";ctx.fillRect(x-10,350,20,55);ctx.fillStyle="#f7d88a";ctx.fillRect(x-7,357,14,40);const g=ctx.createRadialGradient(x,377,2,x,377,55);g.addColorStop(0,"#ffc96955");g.addColorStop(1,"#ffc96900");ctx.fillStyle=g;ctx.fillRect(x-55,322,110,110)}
  }
  function drawMainFurnace(t){
    const x=800,y=475;
    ctx.save();ctx.translate(x,y);
    const aura=ctx.createRadialGradient(0,5,18,0,5,200);aura.addColorStop(0,"#f4c86b44");aura.addColorStop(1,"#f4c86b00");ctx.fillStyle=aura;ctx.fillRect(-210,-210,420,420);
    ctx.fillStyle="#5c4935";ctx.beginPath();ctx.ellipse(0,82,132,30,0,0,TAU);ctx.fill();
    ctx.fillStyle="#b68b48";ctx.beginPath();ctx.ellipse(0,45,112,25,0,0,TAU);ctx.fill();ctx.fillRect(-112,10,224,35);
    const body=ctx.createLinearGradient(-100,0,100,0);body.addColorStop(0,"#503b2b");body.addColorStop(.3,"#c39a50");body.addColorStop(.52,"#eed18a");body.addColorStop(.75,"#a8793c");body.addColorStop(1,"#4a382b");
    ctx.fillStyle=body;ctx.beginPath();ctx.moveTo(-92,-35);ctx.quadraticCurveTo(-120,45,-65,70);ctx.quadraticCurveTo(0,100,65,70);ctx.quadraticCurveTo(120,45,92,-35);ctx.lineTo(60,-65);ctx.lineTo(-60,-65);ctx.closePath();ctx.fill();ctx.strokeStyle="#f1d38a";ctx.lineWidth=5;ctx.stroke();
    ctx.fillStyle="#392d25";ctx.beginPath();ctx.ellipse(0,-35,80,24,0,0,TAU);ctx.fill();ctx.strokeStyle="#f5d68c";ctx.lineWidth=5;ctx.stroke();
    ctx.fillStyle="#f8b85c";ctx.beginPath();ctx.ellipse(0,-34,60,15,0,0,TAU);ctx.fill();ctx.fillStyle="#fff0ad";ctx.beginPath();ctx.ellipse(0,-34,32,8,0,0,TAU);ctx.fill();
    for(let i=0;i<3;i++){ctx.strokeStyle="#f6d88d";ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,8+i*18,95-i*8,.12*Math.PI,.88*Math.PI);ctx.stroke()}
    ctx.fillStyle="#e8c77a";ctx.font="bold 20px serif";ctx.textAlign="center";ctx.fillText("丹",0,35);
    // slow rising spirit wisps
    for(let i=0;i<5;i++){const yy=-100-((t*.025+i*43)%130);const xx=Math.sin(t*.001+i*1.7)*26;ctx.strokeStyle="#ffe6a566";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(xx,yy+22);ctx.bezierCurveTo(xx-24,yy,xx+26,yy-18,xx,yy-42);ctx.stroke()}
    ctx.restore();
  }
  function drawElder(t){
    ctx.save();ctx.translate(800,438);
    // seat
    ctx.fillStyle="#563c2d";ctx.fillRect(-44,0,88,62);ctx.fillStyle="#c7a45d";ctx.fillRect(-53,-8,106,10);ctx.fillRect(-38,55,76,8);
    // robe
    path([[-42,-28],[-24,-64],[0,-72],[24,-64],[42,-28],[33,32],[-33,32]],"#75608c","#d8c27e",3);
    path([[-18,-60],[0,-48],[18,-60],[10,-18],[-10,-18]],"#d9c8a0");
    ctx.fillStyle="#e9c7a0";ctx.beginPath();ctx.arc(0,-78,18,0,TAU);ctx.fill();
    ctx.fillStyle="#33252b";ctx.beginPath();ctx.arc(0,-86,19,Math.PI,TAU);ctx.fill();ctx.fillRect(-20,-84,40,12);
    ctx.strokeStyle="#e6d9c1";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-9,-65);ctx.lineTo(-18,-36);ctx.moveTo(9,-65);ctx.lineTo(18,-36);ctx.stroke();
    ctx.fillStyle="#f0d79b";ctx.fillRect(-4,-95,8,20);
    ctx.restore();
    ctx.fillStyle="#f1dfb1";ctx.font="bold 16px serif";ctx.textAlign="center";ctx.fillText("ĐAN VƯƠNG TRƯỞNG LÃO",800,535);
  }
  function drawPavilion(x,y,s=1){
    ctx.save();ctx.translate(x,y);ctx.scale(s,s);
    ctx.fillStyle="#342a20";ctx.beginPath();ctx.ellipse(0,22,75,16,0,0,TAU);ctx.fill();
    // stone pedestal
    ctx.fillStyle="#9c8254";ctx.fillRect(-67,5,134,16);ctx.strokeStyle="#dfc68b";ctx.lineWidth=2;ctx.strokeRect(-67,5,134,16);
    // legs and work surface
    ctx.fillStyle="#593c2c";ctx.fillRect(-53,-2,10,30);ctx.fillRect(43,-2,10,30);
    ctx.fillStyle="#b28b4e";ctx.fillRect(-63,-8,126,12);ctx.fillStyle="#e0c27d";ctx.fillRect(-63,-9,126,3);
    ctx.restore();
  }
  function drawCauldron(x,y,s,t,index){
    const f=flames[index];const pulse=Math.sin(t*.004+f.phase)*f.heat;
    ctx.save();ctx.translate(x,y);ctx.scale(s,s);
    // fire bowl and flame
    const fire=ctx.createRadialGradient(0,-18,2,0,-18,42);fire.addColorStop(0,"#fff0a8bb");fire.addColorStop(.35,"#f5a44c88");fire.addColorStop(1,"#e76c2a00");ctx.fillStyle=fire;ctx.fillRect(-48,-65,96,90);
    for(let k=0;k<3;k++){const dx=(k-1)*11;ctx.fillStyle=k===1?"#ffe5a0":"#e98b3e";ctx.beginPath();ctx.moveTo(dx-8,-15);ctx.quadraticCurveTo(dx-15,-37-pulse*4,dx,-53-pulse*7);ctx.quadraticCurveTo(dx+15,-34,dx+8,-15);ctx.fill()}
    // cauldron body
    const metal=ctx.createLinearGradient(-34,0,34,0);metal.addColorStop(0,"#4c4738");metal.addColorStop(.25,"#b58b4c");metal.addColorStop(.5,"#e2c77e");metal.addColorStop(.78,"#98713e");metal.addColorStop(1,"#3c382e");
    ctx.fillStyle=metal;ctx.beginPath();ctx.moveTo(-34,-25);ctx.quadraticCurveTo(-42,14,-22,22);ctx.quadraticCurveTo(0,30,22,22);ctx.quadraticCurveTo(42,14,34,-25);ctx.closePath();ctx.fill();ctx.strokeStyle="#f0d18a";ctx.lineWidth=2;ctx.stroke();
    ctx.fillStyle="#3a3026";ctx.beginPath();ctx.ellipse(0,-25,35,9,0,0,TAU);ctx.fill();ctx.strokeStyle="#e7c77e";ctx.stroke();
    ctx.fillStyle="#e8bd66";ctx.font="bold 12px serif";ctx.textAlign="center";ctx.fillText("丹",0,7);
    // smoke ribbons
    for(let j=0;j<2;j++){const yy=-53-((t*.035+j*24+index*9)%55);const xx=Math.sin(t*.0018+index+j)*9;ctx.strokeStyle=j?"#d2e5d088":"#f1d5a277";ctx.lineWidth=2.3;ctx.beginPath();ctx.moveTo(xx,yy+15);ctx.bezierCurveTo(xx-13,yy,xx+13,yy-12,xx,yy-25);ctx.stroke()}
    ctx.restore();
  }
  function drawDisciple(x,y,s,index,t){
    const robe=robes[index%robes.length],dark=darks[index%darks.length],n=npcs[index];
    const beat=Math.sin(t*.0032+index*1.7),phase=n.done?(n.success?4:5):n.phase;
    let left,right,glow="#f2b65f";
    if(phase===0){left=[-22,-51+beat*7];right=[22,-51-beat*7];glow="#ffb65c";}
    else if(phase===1){left=[-25,-43+beat*5];right=[23,-59-beat*4];glow="#b8e6ce";}
    else if(phase===2){left=[-17,-62+beat*3];right=[17,-62-beat*3];glow="#d7b8ff";}
    else if(phase===3){left=[-11,-72+beat*3];right=[11,-72-beat*3];glow="#fff0a5";}
    else if(phase===4){left=[-24,-63+beat*2];right=[24,-63-beat*2];glow="#fff0a5";}
    else{left=[-22,-17];right=[22,-17];glow="#b87568";}
    ctx.save();ctx.translate(x,y);ctx.scale(s,s);
    ctx.fillStyle="#171b17aa";ctx.beginPath();ctx.ellipse(0,4,27,7,0,0,TAU);ctx.fill();
    if(phase<4){
      const aura=ctx.createRadialGradient(0,-45,2,0,-45,34);aura.addColorStop(0,glow+"55");aura.addColorStop(1,glow+"00");ctx.fillStyle=aura;ctx.fillRect(-42,-88,84,85);
      for(let k=0;k<3;k++){const angle=t*.002+index+k*TAU/3;ctx.fillStyle=glow;ctx.globalAlpha=.5;ctx.beginPath();ctx.arc(Math.cos(angle)*23,-61+Math.sin(angle)*8,2.1,0,TAU);ctx.fill();}ctx.globalAlpha=1;
    }
    ctx.strokeStyle="#302a28";ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(-7,-5);ctx.lineTo(-9,9);ctx.moveTo(7,-5);ctx.lineTo(9,9);ctx.stroke();
    path([[-15,-37],[0,-43],[15,-37],[22,-5],[10,2],[-10,2],[-22,-5]],robe,dark,2);
    path([[-5,-37],[0,-31],[5,-37],[3,-5],[-3,-5]],"#e7d7ad88");
    ctx.strokeStyle=robe;ctx.lineWidth=8;ctx.lineCap="round";ctx.beginPath();
    ctx.moveTo(-13,-31);ctx.lineTo(left[0]*.58,left[1]+13);ctx.lineTo(left[0],left[1]);
    ctx.moveTo(13,-31);ctx.lineTo(right[0]*.58,right[1]+13);ctx.lineTo(right[0],right[1]);ctx.stroke();
    ctx.fillStyle="#edc39e";ctx.beginPath();ctx.arc(left[0],left[1],4,0,TAU);ctx.arc(right[0],right[1],4,0,TAU);ctx.fill();
    if(phase===1){
      const herbY=-76+Math.sin(t*.004+index)*5;ctx.fillStyle="#a7d6a4";ctx.beginPath();ctx.ellipse(0,herbY,4,7,beat*.3,0,TAU);ctx.fill();
    }else if(phase===2||phase===3){
      const orbY=phase===2?-84:-91;const orb=ctx.createRadialGradient(0,orbY,1,0,orbY,12);orb.addColorStop(0,"#fffbe0");orb.addColorStop(.35,glow);orb.addColorStop(1,glow+"00");ctx.fillStyle=orb;ctx.beginPath();ctx.arc(0,orbY,12+Math.sin(t*.006+index)*2,0,TAU);ctx.fill();
    }
    ctx.fillStyle="#edc39e";ctx.beginPath();ctx.arc(0,-51,10,0,TAU);ctx.fill();
    ctx.fillStyle="#28212a";ctx.beginPath();ctx.arc(0,-56,11,Math.PI,TAU);ctx.fill();ctx.fillRect(-10,-57,20,7);
    ctx.fillStyle="#30242a";ctx.beginPath();ctx.arc(0,-66,4,0,TAU);ctx.fill();
    ctx.strokeStyle="#d8bd78";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,-65);ctx.lineTo(0,-73);ctx.stroke();
    ctx.fillStyle="#2b2020";ctx.fillRect(-4,-50,8,2);
    ctx.restore();
  }
  function drawStation(index,t){
    const row=Math.floor(index/4),col=index%4;
    const x=300+col*335+(row%2?18:-18),y=590+row*111,s=.68+row*.12,n=npcs[index];
    if(index===selectedNpc){ctx.save();ctx.strokeStyle="#f4d98e";ctx.lineWidth=2;ctx.setLineDash([7,5]);ctx.beginPath();ctx.ellipse(x,y+25,78*s,66*s,0,0,TAU);ctx.stroke();ctx.restore();}
    drawPavilion(x,y,s);drawCauldron(x,y-26,s,t,index);drawDisciple(x,y+38,s*.94,index,t);
    ctx.textAlign="center";ctx.font="bold 12px Arial";ctx.fillStyle=n.done?(n.success?"#ffe49b":"#e39b8c"):"#fff0c8";ctx.fillText(n.name,x,y+58);
    ctx.font="9px Arial";ctx.fillStyle="#d9d0b8";ctx.fillText(n.done?(n.success?"THÀNH ĐAN · "+pillRank(n.quality):"LÒ ĐAN THẤT BẠI"):n.status.toUpperCase(),x,y+69);
    ctx.fillStyle="#30291f";ctx.fillRect(x-39,y+74,78,4);ctx.fillStyle=n.done?(n.success?"#e8c36d":"#9c5d50"):"#9bc6a8";ctx.fillRect(x-39,y+74,78*n.progress,4);
  }
  function drawAlchemyCamera(now){
    if(!cameraCtx||!cameraCanvas)return;
    const focus=now<cameraFocusUntil?npcs[selectedNpc]:[...npcs].sort((a,b)=>b.progress-a.progress)[0];
    if(!focus)return;
    const row=Math.floor((focus.id-1)/4),col=(focus.id-1)%4;
    const cx=300+col*335+(row%2?18:-18),cy=590+row*111+4;
    const sw=490,sh=266,sx=clamp(cx-sw/2,0,W-sw),sy=clamp(cy-sh/2,0,H-sh);
    cameraCtx.setTransform(1,0,0,1,0,0);cameraCtx.clearRect(0,0,cameraCanvas.width,cameraCanvas.height);
    cameraCtx.drawImage(canvas,sx*canvas.width/W,sy*canvas.height/H,sw*canvas.width/W,sh*canvas.height/H,0,0,cameraCanvas.width,cameraCanvas.height);
    cameraCtx.strokeStyle="#f2d58b";cameraCtx.lineWidth=3;cameraCtx.strokeRect(2,2,cameraCanvas.width-4,cameraCanvas.height-4);
    cameraCtx.strokeStyle="#fff0b188";cameraCtx.lineWidth=1;cameraCtx.beginPath();
    cameraCtx.moveTo(cameraCanvas.width/2-12,cameraCanvas.height/2);cameraCtx.lineTo(cameraCanvas.width/2+12,cameraCanvas.height/2);
    cameraCtx.moveTo(cameraCanvas.width/2,cameraCanvas.height/2-12);cameraCtx.lineTo(cameraCanvas.width/2,cameraCanvas.height/2+12);cameraCtx.stroke();
    const name=document.getElementById("alchemyCameraName"),meta=document.getElementById("alchemyCameraMeta");
    if(name)name.textContent=focus.name;
    if(meta)meta.textContent=(now<cameraFocusUntil?"ĐANG THEO DÕI":"TỰ ĐỘNG BÁM DẪN ĐẦU")+" · "+focus.status.toUpperCase()+" · "+Math.floor(focus.progress*100)+"%";
  }

  // Bộ vẽ khán giả đồng bộ hình thể, đạo bào, tóc và cử động với audience.js
  // của trường đua: tạp dịch vẫy tay, ngoại môn reo hò, nội môn kết kiếm quyết.
  function drawSpectator(x,y,scale,roleName,time,phase=0){
    const role=ROLE[roleName]||ROLE.outer;
    const seed=Math.abs(Math.floor(phase*13+({servant:0,outer:1,inner:2}[roleName]||0)*3));
    const female=seed%2===1,skin=["#f6d2b5","#e9b993","#d69a76","#f0c5a0","#bd805f"][seed%5];
    const hair=["#211a25","#39251f","#171d2c","#5a3027","#29242a"][(seed*3)%5];
    const sway=Math.sin(time*.004+phase),beat=time*.012+phase*.7;
    const jump=Math.max(0,Math.sin(beat))*3.5;
    ctx.save();ctx.translate(x,y+Math.sin(time*.006+phase)*.8-jump);ctx.scale(scale*role.scale,scale);
    ctx.fillStyle="rgba(20,30,25,.28)";ctx.beginPath();ctx.ellipse(0,21,15,4,0,0,TAU);ctx.fill();
    if(role.aura)drawAura(0,-9,roleName==="inner"?26:22,role.aura,time,phase);
    ctx.fillStyle=role.dark;ctx.beginPath();
    if(female){ctx.moveTo(-7,-8);ctx.lineTo(7,-8);ctx.lineTo(12,5);ctx.lineTo(20,20);ctx.quadraticCurveTo(0,27,-20,20);ctx.lineTo(-12,5);ctx.closePath();}
    else{ctx.moveTo(-13,-8);ctx.lineTo(13,-8);ctx.lineTo(17,19);ctx.lineTo(-17,19);ctx.closePath();}ctx.fill();
    ctx.fillStyle=role.robe;ctx.beginPath();
    if(female){ctx.moveTo(-7,-9);ctx.lineTo(7,-9);ctx.lineTo(10,4);ctx.lineTo(17,18);ctx.quadraticCurveTo(0,24,-17,18);ctx.lineTo(-10,4);ctx.closePath();}
    else{ctx.moveTo(-11,-9);ctx.lineTo(11,-9);ctx.lineTo(14,18);ctx.lineTo(-14,18);ctx.closePath();}ctx.fill();
    ctx.fillStyle=role.dark;
    if(female){ctx.beginPath();ctx.moveTo(-4,1);ctx.lineTo(0,4);ctx.lineTo(-10,22);ctx.lineTo(-17,19);ctx.closePath();ctx.fill();ctx.beginPath();ctx.moveTo(4,1);ctx.lineTo(0,4);ctx.lineTo(10,22);ctx.lineTo(17,19);ctx.closePath();ctx.fill();ctx.strokeStyle=role.belt;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(7,7);ctx.quadraticCurveTo(16,16,22,26+sway*2);ctx.stroke();}
    else{ctx.beginPath();ctx.moveTo(-10,-7);ctx.lineTo(-16,-1);ctx.lineTo(-12,5);ctx.lineTo(-6,-3);ctx.closePath();ctx.fill();ctx.beginPath();ctx.moveTo(10,-7);ctx.lineTo(16,-1);ctx.lineTo(12,5);ctx.lineTo(6,-3);ctx.closePath();ctx.fill();ctx.strokeStyle=role.belt;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-5,7);ctx.lineTo(-3,19);ctx.moveTo(5,7);ctx.lineTo(3,19);ctx.stroke();}
    ctx.strokeStyle=role.belt;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-10,5);ctx.lineTo(10,5);ctx.stroke();
    ctx.fillStyle=role.robe;ctx.beginPath();
    if(female){ctx.moveTo(-8,-5);ctx.lineTo(-16,1);ctx.lineTo(-20,11);ctx.lineTo(-13,14);ctx.lineTo(-5,3);ctx.closePath();ctx.moveTo(8,-5);ctx.lineTo(16,1);ctx.lineTo(20,11);ctx.lineTo(13,14);ctx.lineTo(5,3);ctx.closePath();}
    else{ctx.moveTo(-10,-5);ctx.lineTo(-19,0);ctx.lineTo(-17,10);ctx.lineTo(-10,9);ctx.lineTo(-6,1);ctx.closePath();ctx.moveTo(10,-5);ctx.lineTo(19,0);ctx.lineTo(17,10);ctx.lineTo(10,9);ctx.lineTo(6,1);ctx.closePath();}ctx.fill();
    ctx.strokeStyle=skin;ctx.lineWidth=4.5;ctx.lineCap="round";
    let lh=[-22,-31+Math.sin(beat)*3],rh=[22,-31-Math.sin(beat)*3],le=[-18,-17],re=[18,-17];
    if(roleName==="servant"){lh=[-21,-17+Math.sin(beat)*9];rh=[21,-17-Math.sin(beat)*9];le=[-17,-5];re=[17,-5];}
    else if(roleName==="outer"){lh=[-22,-25+Math.sin(beat)*8];rh=[22,-7-Math.sin(beat+1)*5];le=[-17,-8];re=[17,-2];}
    else{lh=[-8,-24+Math.sin(beat)*4];rh=[19,-18-Math.sin(beat)*5];le=[-15,-9];re=[15,-8];}
    ctx.beginPath();ctx.moveTo(-9,-5);ctx.lineTo(le[0],le[1]);ctx.lineTo(lh[0],lh[1]);ctx.moveTo(9,-5);ctx.lineTo(re[0],re[1]);ctx.lineTo(rh[0],rh[1]);ctx.stroke();
    ctx.fillStyle=role.robe;ctx.beginPath();ctx.arc(lh[0],lh[1],3.2,0,TAU);ctx.arc(rh[0],rh[1],3.2,0,TAU);ctx.fill();
    if(roleName==="inner"){ctx.strokeStyle="#e6d18e";ctx.lineWidth=1.7;ctx.beginPath();ctx.moveTo(rh[0]+2,rh[1]-2);ctx.lineTo(rh[0]+5,rh[1]-15);ctx.stroke();}
    ctx.strokeStyle="rgba(255,231,158,.85)";ctx.lineWidth=1.4;for(let k=0;k<3;k++){const side=k-1;ctx.beginPath();ctx.moveTo(side*9,-43-Math.sin(beat+k)*2);ctx.lineTo(side*9-3,-49-Math.sin(beat+k)*2);ctx.stroke();}
    ctx.fillStyle=skin;ctx.beginPath();ctx.ellipse(0,-19,female?6:6.6,7.7,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=hair;
    if(female){ctx.beginPath();ctx.arc(0,-23,7.2,Math.PI,Math.PI*2);ctx.fill();ctx.fillRect(-7,-23,3,23);ctx.fillRect(4,-23,3,23);ctx.beginPath();ctx.ellipse(0,-30,4.8,3.8,0,0,TAU);ctx.fill();ctx.strokeStyle="#e8cf8d";ctx.lineWidth=1.8;ctx.beginPath();ctx.moveTo(2,-30);ctx.lineTo(13,-35);ctx.stroke();}
    else{ctx.beginPath();ctx.arc(0,-24,7.2,Math.PI,Math.PI*2);ctx.fill();ctx.fillRect(-7,-24,3,6);ctx.fillRect(4,-24,3,6);ctx.beginPath();ctx.ellipse(0,-33,4.2,5.5,0,0,TAU);ctx.fill();}
    ctx.fillStyle="#392b27";ctx.beginPath();ctx.arc(-2.5,-19,1,0,TAU);ctx.arc(2.5,-19,1,0,TAU);ctx.fill();
    ctx.strokeStyle="#8b5144";ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(0,-17);ctx.lineTo(-.5,-15);ctx.quadraticCurveTo(0,-12,2,-13);ctx.stroke();
    ctx.restore();
  }
  function drawAudienceRails(t){
    // Khán giả hai cánh sân dùng cùng dáng áo trường sam, đầu tóc và chuyển động tay
    // nhất quán với phong cách nhân vật của Vạn Kiếm Phi Tiên.
    for(let side=0;side<2;side++){
      const xBase=side===0?42:1558;
      for(let i=0;i<9;i++){
        const y=555+i*43;
        const x=xBase+(side===0?1:-1)*Math.sin(t*.0018+i*.7)*3;
        const role=i<2?"inner":i<5?"outer":"servant";
        drawSpectator(x,y,.52+(i%3)*.025,role,t,i+side*11);
      }
    }
  }
  function drawCourtyard(t){
    // floor perspective lines
    ctx.fillStyle="#796b4d";ctx.beginPath();ctx.moveTo(0,510);ctx.lineTo(1600,510);ctx.lineTo(1600,1000);ctx.lineTo(0,1000);ctx.fill();
    for(let i=0;i<11;i++){ctx.strokeStyle=i%2?"#c8ae7655":"#3b392c55";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,535+i*48);ctx.lineTo(1600,535+i*48);ctx.stroke()}
    for(let i=0;i<17;i++){ctx.strokeStyle="#d7bd8055";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(800+(i-8)*30,520);ctx.lineTo((i-8)*145,1000);ctx.stroke()}
    // outer columns and banners
    for(const x of [90,1510]){ctx.fillStyle="#7d382b";ctx.fillRect(x-17,390,34,390);ctx.fillStyle="#d5b36a";ctx.fillRect(x-24,390,48,12);ctx.fillRect(x-24,770,48,14);ctx.fillStyle="#c9a65c";ctx.fillRect(x-5,430,10,310)}
    for(const x of [165,1435]){ctx.fillStyle="#7b332b";ctx.fillRect(x-30,330,60,130);ctx.strokeStyle="#e0c37e";ctx.lineWidth=3;ctx.strokeRect(x-30,330,60,130);ctx.fillStyle="#f0d9a4";ctx.font="24px serif";ctx.textAlign="center";ctx.fillText("丹",x,410);ctx.fillStyle="#7a3029";ctx.fillRect(x-35,460,70,140)}
    // Khán giả hai bên đài luyện đan, cùng phong cách đệ tử trường đua
    drawAudienceRails(t);
    // main furnace and elder platform
    drawMainFurnace(t);
    drawElder(t);
    // 16 independent stations
    for(let i=0;i<16;i++)drawStation(i,t);
    // gold floor seal in foreground
    ctx.save();ctx.globalAlpha=.35;ctx.strokeStyle="#e3c579";ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(800,925,240,42,0,0,TAU);ctx.stroke();ctx.beginPath();ctx.ellipse(800,925,205,30,0,0,TAU);ctx.stroke();for(let i=0;i<8;i++){const a=i*TAU/8;ctx.beginPath();ctx.moveTo(800+Math.cos(a)*205,925+Math.sin(a)*30);ctx.lineTo(800+Math.cos(a)*240,925+Math.sin(a)*42);ctx.stroke()}ctx.restore();
  }
  function drawAtmosphere(t){
    // fixed-count drifting motes, deterministic positions
    for(let i=0;i<36;i++){const x=(i*173+t*(.006+(i%3)*.002))%W;const y=220+(i*97+t*(.003+(i%4)*.001))%650;const a=.18+.22*(.5+.5*Math.sin(t*.001+i));ctx.fillStyle="rgba(255,224,151,"+a+")";ctx.beginPath();ctx.arc(x,y,1.2+(i%3)*.45,0,TAU);ctx.fill()}
  }
  function render(t){
    ctx.setTransform(canvas.width/W,0,0,canvas.height/H,0,0);ctx.clearRect(0,0,W,H);
    drawBackground(t);drawPalace(t);drawCourtyard(t);drawAtmosphere(t);drawAlchemyCamera(t);
  }
  function resize(){
    const dpr=Math.min(window.devicePixelRatio||1,1.6);
    const rect=canvas.getBoundingClientRect();
    const w=Math.max(1,Math.round(rect.width*dpr));
    const h=Math.max(1,Math.round(rect.width*H/W*dpr));
    if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h}
    ctx.setTransform(w/W,0,0,h/H,0,0);
  }
  canvas.addEventListener("click",event=>{
    const rect=canvas.getBoundingClientRect();
    if(!rect.width||!rect.height)return;
    const x=(event.clientX-rect.left)*W/rect.width;
    const y=(event.clientY-rect.top)*H/rect.height;
    let nearest=-1,best=Infinity;
    for(let i=0;i<16;i++){
      const row=Math.floor(i/4),col=i%4;
      const sx=300+col*335+(row%2?18:-18),sy=590+row*111;
      const d=Math.hypot((x-sx)*.8,y-sy);
      if(d<best){best=d;nearest=i;}
    }
    if(nearest>=0&&best<105){
      selectedNpc=nearest;cameraFocusUntil=performance.now()+7000;
      renderSelected();
      renderTournament(performance.now());
      const tab=document.querySelector('.dan-tab[data-panel="appraisal-panel"]');
      if(tab)tab.setAttribute("aria-label","Giám định · Lò "+String(nearest+1).padStart(2,"0"));
    }
  });
  function frame(now){
    raf=requestAnimationFrame(frame);
    if(now-last<30)return;
    last=now;resize();updateSimulation(now);render(now);
  }
  document.addEventListener("visibilitychange",()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0}else if(!raf){last=0;raf=requestAnimationFrame(frame)}});
  window.addEventListener("pagehide",()=>cancelAnimationFrame(raf),{once:true});
  raf=requestAnimationFrame(frame);
})();