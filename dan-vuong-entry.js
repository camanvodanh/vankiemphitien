"use strict";
(() => {
  // Chế độ Đan Vương Các dùng chung phần đầu trang, chân trang và điều khiển âm thanh/ngôn ngữ của game gốc.
  const canvas=document.getElementById("game");
  const arena=canvas?.closest(".arena-frame");
  const header=document.querySelector(".game-header");
  const footer=document.querySelector(".site-footer");
  const app=document.querySelector(".game-app");
  if(!canvas||!arena||!header||!footer||!app||window.__vkpDanVuongEntryInstalled)return;
  window.__vkpDanVuongEntryInstalled=true;

  const HIT={left:365,right:480,top:235,bottom:365};
  let overlay=null,previousOverflow="",headerNext=null,footerNext=null;

  function closeDanVuong(){
    if(!overlay)return;
    // Trả lại chính các node gốc, không clone nên các listener nhạc/âm thanh/ngôn ngữ vẫn nguyên vẹn.
    if(header.parentNode!==app)app.insertBefore(header,arena.closest(".game-stage"));
    if(footer.parentNode!==app)app.insertBefore(footer,footerNext&&footerNext.parentNode===app?footerNext:null);
    overlay.remove();overlay=null;
    document.documentElement.style.overflow=previousOverflow;
    canvas.focus?.({preventScroll:true});
  }

  function openDanVuong(){
    if(overlay)return;
    previousOverflow=document.documentElement.style.overflow;
    headerNext=header.nextSibling;footerNext=footer.nextSibling;
    overlay=document.createElement("section");
    overlay.id="vkpDanVuongOverlay";
    overlay.setAttribute("role","dialog");overlay.setAttribute("aria-modal","true");
    overlay.setAttribute("aria-label","Đan Vương Các");
    Object.assign(overlay.style,{position:"fixed",inset:"0",zIndex:"2147483000",display:"flex",justifyContent:"center",background:"#0c1b18",overflow:"hidden"});

    const shell=document.createElement("div");
    shell.className="vkp-dan-mode-shell";
    Object.assign(shell.style,{width:"min(1600px,calc(100% - 20px))",height:"100dvh",minHeight:"0",display:"flex",flexDirection:"column",margin:"0 auto",padding:"0 0 max(4px,env(safe-area-inset-bottom))",boxSizing:"border-box"});

    const topLine=document.createElement("div");
    topLine.className="vkp-dan-mode-topline";
    topLine.innerHTML='<span>丹 · ĐAN VƯƠNG CÁC</span><small>BÁCH LUYỆN ĐÀI · ĐẠI HỘI ĐAN ĐẠO</small>';
    Object.assign(topLine.style,{flex:"0 0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"8px",minHeight:"29px",padding:"0 5px 5px",color:"#e8d3a2",font:"800 9px Arial,sans-serif",letterSpacing:"1.1px"});
    const closeButton=document.createElement("button");
    closeButton.type="button";closeButton.textContent="✕  Trở về";
    closeButton.setAttribute("aria-label","Đóng Đan Vương Các và trở về Vạn Kiếm Đài");
    Object.assign(closeButton.style,{minHeight:"26px",padding:"3px 9px",border:"1px solid #c6a15d",borderRadius:"6px",color:"#f7e7bf",background:"linear-gradient(145deg,#294b3d,#142b26)",font:"700 9px Arial,sans-serif",cursor:"pointer",touchAction:"manipulation"});
    closeButton.addEventListener("click",closeDanVuong);
    topLine.appendChild(closeButton);

    const bottomLine=document.createElement("div");
    bottomLine.className="vkp-dan-mode-bottomline";
    bottomLine.textContent="ĐAN HƯƠNG NGƯNG TỤ · VẠN LÒ TRANH PHONG";
    Object.assign(bottomLine.style,{flex:"0 0 auto",minHeight:"18px",padding:"4px 4px 0",color:"#a38b5b",font:"800 7px Arial,sans-serif",letterSpacing:"1.1px",textAlign:"center"});

    const frame=document.createElement("iframe");
    frame.title="Đan Vương Các · Bách Luyện Đài";
    frame.src=new URL("dan-vuong.html?embedded=1&v=ingame-v5",document.baseURI).href;
    frame.setAttribute("allow","fullscreen");
    Object.assign(frame.style,{display:"block",width:"100%",height:"100%",minHeight:"0",flex:"1 1 auto",border:"0",background:"#102b27"});

    // Di chuyển header/footer gốc vào lớp game để giữ nguyên mọi nút và hành vi.
    shell.append(header,topLine,frame,bottomLine,footer);
    overlay.appendChild(shell);
    document.body.appendChild(overlay);
    document.documentElement.style.overflow="hidden";
    closeButton.focus({preventScroll:true});
  }

  function pointInDanGe(event){
    const rect=canvas.getBoundingClientRect();if(!rect.width||!rect.height)return false;
    const x=(event.clientX-rect.left)*canvas.width/rect.width,y=(event.clientY-rect.top)*canvas.height/rect.height;
    return x>=HIT.left&&x<=HIT.right&&y>=HIT.top&&y<=HIT.bottom;
  }
  function onArenaPointerDown(event){
    if(overlay||event.defaultPrevented||event.isPrimary===false)return;
    if(event.pointerType==="mouse"&&event.button!==0)return;
    if(!pointInDanGe(event))return;
    event.preventDefault();event.stopPropagation();openDanVuong();
  }
  arena.addEventListener("pointerdown",onArenaPointerDown,true);
  arena.addEventListener("click",event=>{
    if(overlay||event.defaultPrevented||event.button!==0||!pointInDanGe(event))return;
    event.preventDefault();event.stopPropagation();openDanVuong();
  },true);
  canvas.addEventListener("pointermove",event=>{if(!overlay)canvas.style.cursor=pointInDanGe(event)?"pointer":"";},{passive:true});
  canvas.addEventListener("pointerleave",()=>{canvas.style.cursor="";});
  document.addEventListener("keydown",event=>{if(event.key==="Escape"&&overlay)closeDanVuong();});
  canvas.setAttribute("aria-label","Hoạt cảnh trường đua. Chạm Đan Các để mở Đan Vương Các.");
})();