"use strict";
(async function bootVanKiemPhiTien(){
 const names=["characters","swords","effects","summoning","ceremony","scenery"];
 const entries=await Promise.all(names.map(async name=>{
  const response=await fetch("data/"+name+".json",{cache:"no-cache"});
  if(!response.ok)throw new Error("Không tải được data/"+name+".json ("+response.status+")");
  return [name,await response.json()];
 }));
 window.VKP_DATA=Object.fromEntries(entries);
 const scripts=[
  "core.js?v=leaderboard-one-second-v158",
  "scenery.js?v=leaderboard-one-second-v158",
  "audience.js?v=leaderboard-one-second-v158",
  "race-render.js?v=leaderboard-one-second-v158",
  "visual-overrides.js?v=leaderboard-one-second-v158",
  "music.js?v=leaderboard-one-second-v158",
  "race-logic.js?v=leaderboard-one-second-v158",
  "i18n.js?v=leaderboard-one-second-v158"
 ];
 for(const src of scripts){
  await new Promise((resolve,reject)=>{
   const script=document.createElement("script");
   script.src=src;script.onload=resolve;script.onerror=()=>reject(new Error("Không tải được "+src));
   document.body.appendChild(script);
  });
 }
})().catch(error=>{
 console.error("[Vạn Kiếm Phi Tiên] Data bootstrap failed:",error);
 const notice=document.getElementById("lockNotice");
 if(notice)notice.textContent="Không thể tải dữ liệu trong thư mục data/. Vui lòng tải lại trang.";
 const status=document.getElementById("status");
 if(status)status.textContent="Lỗi tải dữ liệu trò chơi. Hãy tải lại trang.";
});
