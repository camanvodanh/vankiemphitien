"use strict";

(function initTournamentCommentary(){
  const arena=document.querySelector(".arena-frame");
  const canvas=document.getElementById("game");
  const startButton=document.getElementById("start");
  const eventNode=document.getElementById("event");
  const statusNode=document.getElementById("status");
  if(!arena||!canvas||!startButton)return;

  const bubbles=[];
  let chatterTimer=0,frameRequest=0,turn=0,lastEvent="",bubbleSequence=0,stopped=false;
  const MAX_BUBBLES=6,BUBBLE_LIFE=4300;

  function inferGender(name){
    const n=String(name||"").trim().toLowerCase();
    if(!n)return "unknown";
    if(/(nữ|tiên tử|thánh nữ|tiểu thư|cô nương|sư tỷ|chị|cô gái)/.test(n))return "female";
    if(/(nam|sư huynh|công tử|đạo trưởng|thiếu hiệp|kiếm tôn|chân quân|tiên quân|anh)/.test(n))return "male";
    if(/(linh nhi|tử yên|băng tâm|thanh huyền|nhược|mộng|uyển|婉|嫣|瑶|蓉|娜|婷|琳|雪|月|凤|凰|仙|姬|妃|柔|清|霜|梅|兰|菊|荷|萱|馨|静|雅|薇|璃|曦|妍|诗)/i.test(n))return "female";
    if(/(thiên|hạo|minh|long|phong|kiệt|khải|vũ|quân|nguyên|cường|tuấn|đạt|bảo|俊|豪|杰|龙|天|宇|轩|辰|阳|剑|君|枫|峰|海|浩|明|伟|强|勇|文|武)/i.test(n))return "male";
    return "unknown";
  }
  const titleFor=g=>g==="female"?"sư tỷ":g==="male"?"sư huynh":"đạo hữu";
  const addressedName=(name,g,capital=true)=>{const title=titleFor(g);const text=name?name+" "+title:title;return capital?text.charAt(0).toUpperCase()+text.slice(1):text;};
  const lines=[
    ["outer",(n,h)=>n?h+"! Cố lên! Đệ tử đang dõi theo!":"Chư vị cố lên! Đệ tử đang dõi theo!"],
    ["inner",(n,h)=>n?h+" sắp vượt thêm một người rồi!":"Nhanh quá, sắp vượt thêm một người rồi!"],
    ["servant",(n,h)=>n?"Hay quá, "+h+"! Giữ vững kiếm thế nhé!":"Hay quá! Giữ vững kiếm thế nhé!"],
    ["disciple",(n,h)=>n?h+" có hy vọng đoạt vị trí cao rồi!":"Phong chúng ta có hy vọng đoạt vị trí cao rồi!"],
    ["core",(n,h)=>n?h+" quả nhiên có bản lĩnh, đường kiếm thật đẹp!":"Đạo hữu quả nhiên có bản lĩnh, đường kiếm thật đẹp!"],
    ["outer",(n,h)=>n?h+"! Đệ tử tin "+(h.toLowerCase().startsWith("sư huynh")?"huynh":h.toLowerCase().startsWith("sư tỷ")?"tỷ":"đạo hữu")+" làm được!":"Đừng để mất vị trí! Cố lên!"],
    ["inner",()=> "Đuổi kịp rồi! Chỉ còn một đoạn nữa thôi!"],
    ["servant",()=> "Đệ tử cổ vũ cho tất cả các vị! Bay nhanh lên nào!"],
    ["disciple",(n,h)=>n?h+", phía trước đang có cơ hội! Tăng tốc đi!":"Phía trước đang có cơ hội! Tăng tốc đi!"],
    ["inner",()=> "Đẹp lắm! Đường kiếm ấy khiến người xem cũng thấy nhiệt huyết!"],
    ["outer",()=> "Sắp vượt rồi! Mau lên, chỉ còn một chút nữa!"],
    ["core",()=> "Thân pháp ấy rất có triển vọng. Lại áp sát rồi!"],
    ["servant",()=> "Cố lên! Khán đài đang cổ vũ cho các vị!"],
    ["disciple",()=> "Đừng chậm lại! Cơ hội đổi thứ hạng ngay trước mắt!"],
    ["inner",(n,h)=>n?h+", cố giữ nhịp thở và kiếm thế!":"Đạo hữu, cố giữ nhịp thở và kiếm thế!"],
    ["outer",()=> "Kiếm quang thật đẹp! Tranh phong càng lúc càng kịch liệt!"],
    ["elder",()=> "Lão phu sống ba ngàn năm, lần đầu thấy có người bay mà phong thái còn đẹp hơn lúc đi bộ!"],
    ["master",()=> "Đại hội hôm nay, ai đoạt khôi thủ sẽ được bổn môn trọng thưởng… một lời khen thật dài!"],
    ["servant",()=> "Sư huynh bay nhanh quá! Đệ tử nhìn theo mà quên cả quét sân!"],
    ["inner",()=> "Đạo hữu vừa thi triển thân pháp gì vậy? Ta chỉ chớp mắt mà đã mất dấu!"],
    ["core",()=> "Kiếm ý ngút trời! À không, hình như là gió thổi bay tóc thôi!"],
    ["disciple",()=> "Người phía trước xin chậm một chút! Ta còn chưa kịp cổ vũ xong!"],
    ["outer",()=> "Đây là tranh phong hay cuộc thi ai ngự kiếm giao hàng nhanh nhất?"],
    ["elder",()=> "Khí tức vững vàng, tâm cảnh kiên định… trừ vị vừa suýt bay ngược kia!"],
    ["master",()=> "Thắng bại là chuyện thường tình, nhưng bay lệch khỏi đường đua thì phải tìm đường về!"],
    ["servant",()=> "Đệ tử đã chuẩn bị trà, nhưng chư vị nhanh đến mức trà còn chưa kịp nguội!"],
    ["inner",()=> "Một kiếm phá không! Ba phần phong độ, bảy phần… vận may!"],
    ["core",()=> "Người này có đại khí vận! Vừa nói xong đã vượt thêm một vị!"],
    ["disciple",()=> "Sư huynh phía trước, phía sau có người đuổi! Không phải đòi nợ đâu!"],
    ["outer",()=> "Ta cược một viên linh thạch… thôi, linh thạch của ta cũng đang nợ!"],
    ["elder",()=> "Đừng xem thường đối thủ. Có khi người chậm nhất đang giữ bí thuật cuối cùng!"],
    ["master",()=> "Các vị giữ vững đạo tâm! Đừng để tiếng reo hò làm quên mất hướng bay!"],
    ["servant",()=> "Hảo kiếm! Hảo thân pháp! Hảo… ai vừa làm rơi dép vậy?"],
    ["inner",()=> "Linh khí bùng nổ! Khán đài cũng sắp bùng nổ theo rồi!"],
    ["core",()=> "Tư thế này, lão tổ nhìn thấy chắc cũng muốn đăng ký thi đấu!"],
    ["disciple",()=> "Cố lên! Phía trước là vinh quang, phía sau là… áp lực đồng môn!"],
    ["outer",()=> "Đường kiếm như rồng! Mà con rồng này hình như đang tìm đường!"],
    ["elder",()=> "Lão phu thấy được một tia đột phá… trong khả năng giữ thăng bằng!"],
    ["master",()=> "Ai còn giữ sức thì cứ dùng! Đại hội không có vòng thi tiết kiệm linh lực!"],
    ["servant",()=> "Đệ tử xin phép cổ vũ bằng cả hai tay, vì một tay đang cầm bánh!"],
    ["inner",()=> "Nhanh như chớp! Ta còn chưa kịp gọi tên đã vượt qua rồi!"],
    ["core",()=> "Thiên tài quả nhiên khác biệt! Người thường như ta chỉ biết vỗ tay!"],
    ["disciple",()=> "Đừng hoảng! Nếu mất vị trí, hãy mất một cách thật phong độ!"],
    ["outer",()=> "Ngự kiếm mà không cần bản đồ! Quả là cảnh giới cao thâm!"],
    ["elder",()=> "Tâm không động, kiếm không loạn… khán giả thì đang loạn cả lên!"],
    ["master",()=> "Hôm nay không luận xuất thân, chỉ luận tốc độ và… khả năng không va vào nhau!"],
    ["servant",()=> "Chư vị bay đẹp quá! Đệ tử đứng đây mà linh khí cũng tăng ba phần!"],
    ["inner",()=> "Người dẫn đầu đang giữ ưu thế! Nhưng thiên cơ chưa định, đừng vội ăn mừng!"],
    ["core",()=> "Một bước thiên đường, một bước… suýt chạm cổng!"],
    ["disciple",()=> "Ta đã chuẩn bị tiếng reo cho người thắng! Ai thắng thì nhận nhé!"],
    ["outer",()=> "Kiếm khí tung hoành! Mây cũng phải nhường đường, chắc vậy!"],
    ["elder",()=> "Hậu sinh khả úy! Lão phu bắt đầu thấy muốn trẻ lại để dự thi!"],
    ["master",()=> "Đại hội đang nóng! Xin khán giả giữ bình tĩnh, linh thạch không tự mọc lại!"],
    ["servant",()=> "Nếu bay nhanh thế này, bữa cơm hôm nay chắc phải ăn trên phi kiếm!"],
    ["inner",()=> "Trận thế biến hóa khôn lường! Ai nấy đều như có buff… tinh thần!"],
    ["core",()=> "Đạo tâm sáng như gương! Riêng ta nhìn bảng xếp hạng hơi chóng mặt!"],
    ["disciple",()=> "Cố lên! Đừng để đối thủ vượt! Đừng để kiếm bay trước, người bay sau!"],
    ["outer",()=> "Đây mới là phong thái tiên gia! Ta xin ghi lại để… luyện lúc rảnh!"],
    ["elder",()=> "Nếu đây là tốc độ thường ngày, lão phu xin miễn đi chợ cùng các vị!"],
    ["master",()=> "Kẻ thắng nhận vinh quang, kẻ còn lại nhận kinh nghiệm và một bữa trà!"],
    ["servant",()=> "Đệ tử không hiểu kiếm pháp, nhưng biết ai bay nhanh thì rất ngầu!"],
    ["inner",()=> "Cơ hội lật ngược thế cờ đang đến! Thiên cơ bảo ta… cứ cổ vũ trước!"],
    ["core",()=> "Đừng hỏi ta ai thắng! Ta đang bận thưởng thức màn ngự kiếm tuyệt diệu!"],
    ["disciple",()=> "Đại hội hôm nay quá xuất sắc! Xin cho khán giả thêm một đôi mắt!"],
    ["outer",()=> "Chỉ còn một đoạn! Vận khí, kiếm ý, và đôi chân… à, phi kiếm!"],
    ["elder",()=> "Lão phu phán đoán: người về nhất sẽ là người chạm đích đầu tiên!"],
    ["master",()=> "Các vị đã khiến tông môn rạng danh! Dù thắng hay thua, đừng quên trả phi kiếm!"]
  ];

  function racersNow(){
    return typeof racers!=="undefined"&&Array.isArray(racers)?racers:[];
  }

  const speakerAnchors={
    // Hai vị trí hàng đầu dùng bong bóng nằm dưới điểm neo; đuôi hướng ngược lên
    // để chỉ đúng người đang thoại mà không phủ lên nhân vật thi đấu.
    master:{x:550,y:755,side:1},elder:{x:867,y:600,side:-1,below:true},disciple:{x:263,y:600,side:1,below:true},core:{x:550,y:765,side:-1},inner:{x:380,y:775,side:1},outer:{x:550,y:795,side:-1},servant:{x:550,y:845,side:1},
    racer:{x:550,y:720,side:1}
  };

  function isFinished(){return typeof finished!=="undefined"&&finished;}
  function positionBubble(item){
    if(!item.el.isConnected)return;
    const cr=canvas.getBoundingClientRect(),ar=arena.getBoundingClientRect();
    if(!cr.width||!cr.height||!ar.width||!ar.height)return;
    const anchor=speakerAnchors[item.type]||speakerAnchors.outer;
    const zoom=typeof gameZoom!=="undefined"?gameZoom:1;
    const panX=typeof gamePanX!=="undefined"?gamePanX:0;
    const panY=typeof gamePanY!=="undefined"?gamePanY:0;
    const sx=canvas.width*.5+panX+(anchor.x-canvas.width*.5)*zoom;
    const sy=canvas.height*.5+panY+(anchor.y-canvas.height*.5)*zoom;
    const px=cr.left-ar.left+sx/canvas.width*cr.width;
    const py=cr.top-ar.top+sy/canvas.height*cr.height;
    const width=item.el.offsetWidth||120,height=item.el.offsetHeight||34;
    const side=anchor.side||1,offset=Math.min(16,width*.09)*side;
    item.el.classList.toggle("is-below",!!anchor.below);
    // Phân phối bong bóng theo các vùng ngang luân phiên thay vì neo tất cả ở giữa.
    // Vẫn giữ một phần tọa độ người nói để đuôi bong bóng hướng về đúng khu vực.
    const spreadSlots=[.17,.83,.35,.65,.50,.25,.75];
    const spreadSlot=spreadSlots[(item.sequence-1)%spreadSlots.length];
    const spreadCenter=px*.42+ar.width*spreadSlot*.58;
    const left=Math.max(width/2+5,Math.min(ar.width-width/2-5,spreadCenter+offset));
    // Nhóm hàng đầu đặt hộp thoại phía dưới điểm neo; mũi tên đảo lên trên.
    // Các vai còn lại vẫn nằm phía trên điểm neo như trước.
    const stackDrop=Math.min(item.stack||0,2)*Math.min(10,height*.18);
    const bubbleY=anchor.below
      ?Math.max(8,Math.min(ar.height-height-8,py+8+stackDrop))
      :Math.max(height+8,Math.min(ar.height-8,py-10+stackDrop));
    item.el.style.left=left+"px";
    item.el.style.top=bubbleY+"px";
    item.el.style.setProperty("--speech-tail-x",Math.max(10,Math.min(width-10,px-left+width/2))+"px");
  }
  function followBubbles(){
    bubbles.forEach(positionBubble);
    if(bubbles.length)frameRequest=requestAnimationFrame(followBubbles);
    else frameRequest=0;
  }

  function removeBubble(item){if(item.timer)clearTimeout(item.timer);item.el.remove();const i=bubbles.indexOf(item);if(i>=0)bubbles.splice(i,1);}
  function clearBubbles(){bubbles.slice().forEach(removeBubble);if(frameRequest){cancelAnimationFrame(frameRequest);frameRequest=0;}}
  function stopChatter(){stopped=true;if(chatterTimer){clearTimeout(chatterTimer);chatterTimer=0;}clearBubbles();}
  function showBubble(message,type){
    if(!message||stopped||isFinished())return;
    while(bubbles.length>=MAX_BUBBLES)removeBubble(bubbles[0]);
    const seq=++bubbleSequence;
    const el=document.createElement("div");
    el.className="tournament-speech-bubble speaker-"+type+" is-visible";
    el.setAttribute("role","status");
    el.setAttribute("aria-label",String(message));
    const text=document.createElement("strong");
    text.className="tournament-speech-message";
    text.textContent=String(message);
    el.appendChild(text);
    el.style.zIndex=String(1150+seq);
    arena.appendChild(el);
    const item={el,type,sequence:seq,stack:bubbles.filter(b=>b.type===type).length,timer:0};
    bubbles.push(item);
    positionBubble(item);
    if(!frameRequest)frameRequest=requestAnimationFrame(followBubbles);
    item.timer=window.setTimeout(()=>removeBubble(item),BUBBLE_LIFE);
  }

  function scheduleChatter(){
    if(chatterTimer)return;
    const speak=()=>{
      chatterTimer=0;
      if(stopped||isFinished())return;
      const active=typeof running!=="undefined"&&running&&typeof started!=="undefined"&&started&&!(typeof paused!=="undefined"&&paused);
      if(!active){chatterTimer=window.setTimeout(speak,350);return;}
      const list=racersNow();
      const leader=typeof leaderOf==="function"?leaderOf():null;
      const target=turn%4===0&&leader?leader:list.length?list[turn%list.length]:null;
      const name=target&&target.name?String(target.name).trim():"";
      const gender=inferGender(name);
      const call=addressedName(name,gender,true);
      // Luân phiên có trọng số để Trưởng lão và Chân truyền đệ tử thường xuyên tham gia bình luận.
      const speakerCycle=["elder","disciple","core","inner","outer","servant","disciple","elder","inner","outer","core","master","servant"];
      const cycleIndex=turn++;
      const speaker=speakerCycle[cycleIndex%speakerCycle.length];
      const choices=lines.filter(line=>line[0]===speaker);
      const entry=choices.length?choices[Math.floor(Math.random()*choices.length)]:lines[cycleIndex%lines.length];
      showBubble(entry[1](name,call),entry[0]);
      if(!stopped&&!isFinished())chatterTimer=window.setTimeout(speak,1250+Math.floor(Math.random()*450));
    };
    chatterTimer=window.setTimeout(speak,500);
  }

  function handleEvent(){
    if(!eventNode||stopped||isFinished())return;
    const value=eventNode.textContent.trim();
    if(!value||value===lastEvent)return;
    lastEvent=value;
    if(value.includes("ĐẠI HỘI BẮT ĐẦU")){
      showBubble("Đại hội Ngự Kiếm chính thức khai cuộc! Chư vị chuẩn bị thưởng thức!","elder");
      scheduleChatter();
    }else if(value.startsWith("HẠNG 1 · ĐANG DẪN ĐẦU:")){
      const name=value.slice("HẠNG 1 · ĐANG DẪN ĐẦU:".length).trim();
      const gender=inferGender(name),call=addressedName(name,gender,true),midCall=addressedName(name,gender,false);
      showBubble("Chưởng môn, "+call+" vừa vượt lên rồi! Kiếm thế thật khá!","elder");
      window.setTimeout(()=>{if(!isFinished()&&!stopped)showBubble("Ta thấy rồi. "+midCall+" giữ thân pháp rất vững, không hề rối loạn.","master");},850);
    }else if(value.includes("PHOTO FINISH")){
      showBubble("Chỉ chênh lệch trong gang tấc! Quả là một trận tranh phong kịch liệt!","elder");
    }
  }

  startButton.addEventListener("click",scheduleChatter);
  if(eventNode)new MutationObserver(handleEvent).observe(eventNode,{childList:true,characterData:true,subtree:true});
  if(statusNode)new MutationObserver(()=>{if(isFinished())stopChatter();else if(statusNode.textContent.includes("Đã triệu hồi"))stopped=false;else if(typeof running!=="undefined"&&running&&typeof started!=="undefined"&&started&&!(typeof paused!=="undefined"&&paused))scheduleChatter();}).observe(statusNode,{childList:true,characterData:true,subtree:true});

  const originalDraw=window.drawAnnouncement;
  if(typeof originalDraw==="function"){
    window.drawAnnouncement=function(...args){
      if(bubbles.some(item=>item.el.isConnected&&item.el.classList.contains("is-visible")))return;
      return originalDraw.apply(this,args);
    };
  }

  window.addEventListener("pagehide",stopChatter);
})();
