"use strict";
(()=>{
 const $=id=>document.getElementById(id);
 const names=["Lăng Vân","Mặc Trần","Tử Yên","Thanh Huyền","Bạch Ly","Cố Minh","Diệp Khanh","Hàn Phong","Vân Chi","Tạ Nguyệt","Lục Dương","Thẩm Dao","Kỷ Ninh","Tô Mặc","Ninh Tuyết","Phong Dật"];
 const pills=[
  {name:"Tụ Khí Đan",desc:"Sơ cấp · ổn định linh khí",base:48},
  {name:"Trúc Cơ Đan",desc:"Trung cấp · củng cố đạo cơ",base:57},
  {name:"Ngưng Nguyên Đan",desc:"Trung cấp · ngưng tụ nguyên lực",base:64},
  {name:"Hồi Xuân Đan",desc:"Cao cấp · phục nguyên sinh cơ",base:70},
  {name:"Phá Cảnh Đan",desc:"Cao cấp · trợ lực đột phá",base:78},
  {name:"Cửu Chuyển Kim Đan",desc:"Đỉnh cấp · thử thách tối thượng",base:88}
 ];
 const rounds=[{name:"Sơ tuyển",short:"TOP 16 → TOP 8",keep:8},{name:"Bán kết",short:"TOP 8 → TOP 4",keep:4},{name:"Chung kết",short:"TOP 4 → ĐAN VƯƠNG",keep:1}];
 let pillIndex=0,roundIndex=0,active=false,elapsed=0,last=0,results=[],history=[],season=1,raf=0;
 let roster=names.map((name,i)=>({name,id:i,alchemy:58+(i*17%39),fire:55+(i*23%42),sense:54+(i*13%43),spirit:55+(i*19%42),calm:52+(i*11%46),score:0,progress:0,qualified:true,rank:0}));
 const pill=$("leaguePill"),round=$("leagueRound"),state=$("leagueState"),clock=$("leagueClock"),board=$("leagueBoard"),detail=$("leagueDetail"),champ=$("leagueChampion"),historyEl=$("leagueHistory");
 function eligible(){return roster.filter(n=>n.qualified)}
 function draw(){
  if(pill)pill.textContent=pills[pillIndex].name+" · "+pills[pillIndex].desc;
  if(round)round.textContent=rounds[roundIndex].name+" · "+rounds[roundIndex].short;
  if(state)state.textContent=active?"ĐANG TRANH TÀI":"ĐANG CHỜ KHAI MẠC";
  if(clock)clock.textContent="THỜI GIAN: "+(elapsed/1000).toFixed(1)+"s · "+eligible().length+" ĐẠO HỮU DỰ THI";
  const sorted=[...roster].sort((a,b)=>b.score-a.score);
  if(board)board.innerHTML=sorted.map((n,i)=>'<div class="league-row '+(!n.qualified?'out':'')+'"><b>'+(i===0&&n.qualified?'👑':String(i+1).padStart(2,"0"))+'</b><span>'+n.name+'<small>'+(n.qualified?(active?Math.floor(n.progress*100)+"% · đang luyện":(n.rank?"Hạng "+n.rank:"Chờ thi")):"Đã bị loại")+'</small></span><strong>'+n.score.toFixed(1)+'</strong></div>').join("");
  const current=sorted.find(n=>n.qualified);
  if(champ)champ.textContent=roundIndex===2&&!active&&history.length?"ĐAN VƯƠNG MÙA "+season+": "+history[history.length-1].winner:"DẪN ĐẦU: "+(current?current.name:"Chưa có");
  if(detail){const n=sorted[0];detail.innerHTML=n?'<b>'+n.name+'</b><span>Đan thuật '+n.alchemy+' · Khống hỏa '+n.fire+' · Thần thức '+n.sense+'</span><span>Linh lực '+n.spirit+' · Tâm cảnh '+n.calm+'</span><span>Điểm mùa giải: '+n.score.toFixed(1)+'</span>':"Chưa có dữ liệu"}
  if(historyEl)historyEl.innerHTML=history.slice().reverse().map(h=>'<div class="league-history-row"><b>Mùa '+h.season+'</b><span>'+h.pill+'</span><strong>'+h.winner+'</strong></div>').join("")||'<p class="league-muted">Chưa có mùa giải hoàn tất.</p>';
  const start=$("startLeague"),next=$("nextLeague");
  if(start)start.disabled=active;
  if(next)next.disabled=active||roundIndex>=2||!results.length;
 }
 function startRound(){
  if(active)return;
  const entrants=eligible();if(!entrants.length)return;
  active=true;elapsed=0;last=performance.now();
  entrants.forEach(n=>n.progress=0);
  draw();cancelAnimationFrame(raf);raf=requestAnimationFrame(tick);
 }
 function tick(now){
  if(!active)return;
  const dt=Math.min(80,Math.max(0,now-last));last=now;elapsed+=dt;
  const entrants=eligible();let done=0;
  entrants.forEach((n,i)=>{
   const ability=(n.alchemy*.3+n.fire*.18+n.sense*.2+n.spirit*.17+n.calm*.15);
   const speed=ability/100*(roundIndex===2?.000095:.00014);
   n.progress=Math.min(1,n.progress+dt*speed*(.82+(i%4)*.08));
   if(n.progress>=1)done++;
  });
  if(now%250<35)draw();
  if(done===entrants.length)finishRound();else raf=requestAnimationFrame(tick);
 }
 function finishRound(){
  active=false;
  const entrants=eligible();
  entrants.forEach(n=>{
   const ability=n.alchemy*.3+n.fire*.18+n.sense*.2+n.spirit*.17+n.calm*.15;
   const jitter=((n.id*37+pillIndex*19+roundIndex*13+season*7)%17)-8;
   const quality=Math.max(0,Math.min(100,ability+pills[pillIndex].base*.18+jitter));
   const timeBonus=Math.max(0,30-elapsed/1000)*.35;
   n.score+=quality*.7+timeBonus;
   n.quality=quality;
  });
  entrants.sort((a,b)=>b.score-a.score).forEach((n,i)=>n.rank=i+1);
  const keep=rounds[roundIndex].keep;
  const winners=entrants.slice(0,keep);
  roster.forEach(n=>n.qualified=winners.includes(n));
  results.push({round:rounds[roundIndex].name,pill:pills[pillIndex].name,qualified:winners.map(n=>n.name)});
  if(roundIndex===2){
   const winner=winners[0];
   history.push({season,pill:pills[pillIndex].name,winner:winner.name,score:winner.score});
   if(history.length>12)history.shift();
   if(champ)champ.textContent="ĐAN VƯƠNG MÙA "+season+": "+winner.name;
   state.textContent="CHUNG KẾT HOÀN TẤT · TÔN VINH ĐAN VƯƠNG";
  }else state.textContent=rounds[roundIndex].name.toUpperCase()+" HOÀN TẤT · "+keep+" ĐỆ TỬ ĐI TIẾP";
  draw();
 }
 function nextRound(){
  if(active||roundIndex>=2||!results.length)return;
  roundIndex++;pillIndex=(pillIndex+1)%pills.length;startRound();
 }
 function newSeason(){
  if(active)return;
  season++;roundIndex=0;pillIndex=(season-1)%pills.length;results=[];elapsed=0;
  roster.forEach((n,i)=>{n.score=0;n.progress=0;n.qualified=true;n.rank=0;n.quality=0;n.alchemy=58+(i*17%39);});
  state.textContent="MÙA GIẢI "+season+" · SẴN SÀNG KHAI MẠC";draw();
 }
 $("startLeague")?.addEventListener("click",startRound);
 $("nextLeague")?.addEventListener("click",nextRound);
 $("newLeague")?.addEventListener("click",newSeason);
 draw();
 document.addEventListener("visibilitychange",()=>{if(document.hidden&&active){last=performance.now()}});
})();