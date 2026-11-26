"use strict";
(() => {
  // Đan Vương Điện là lớp độc lập; không khởi tạo lại hoặc sửa trạng thái cuộc đua.
  const canvas = document.getElementById("game");
  const arena = canvas?.closest(".arena-frame");
  if (!canvas || !arena || window.__vkpDanVuongEntryInstalled) return;
  window.__vkpDanVuongEntryInstalled = true;

  // Tọa độ theo hệ quy chiếu nội tại 1100×900 của canvas.
  // Bao trọn mái, thân lầu và bậc thềm ĐAN CÁC (tâm tại x=420, y=326).
  const HIT = { left: 365, right: 480, top: 235, bottom: 365 };
  let overlay = null;
  let previousOverflow = "";

  function closeDanVuong() {
    if (!overlay) return;
    overlay.remove();
    overlay = null;
    document.documentElement.style.overflow = previousOverflow;
    canvas.focus?.({ preventScroll: true });
  }

  function openDanVuong() {
    if (overlay) return;
    previousOverflow = document.documentElement.style.overflow;

    overlay = document.createElement("section");
    overlay.id = "vkpDanVuongOverlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Đan Vương Điện");
    Object.assign(overlay.style, {
      position: "fixed", inset: "0", zIndex: "2147483000",
      display: "flex", flexDirection: "column",
      background: "#101715", padding: "0", margin: "0",
      overflow: "hidden"
    });

    const topbar = document.createElement("div");
    Object.assign(topbar.style, {
      position: "absolute", top: "max(8px, env(safe-area-inset-top))",
      right: "max(8px, env(safe-area-inset-right))", zIndex: "2",
      display: "flex", alignItems: "center", gap: "8px"
    });

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.textContent = "✕  Trở về Vạn Kiếm Đài";
    closeButton.setAttribute("aria-label", "Đóng Đan Vương Điện và trở về cuộc đua");
    Object.assign(closeButton.style, {
      minHeight: "42px", padding: "0 15px", border: "1px solid #d8b66d",
      borderRadius: "8px", color: "#f7e7bf",
      background: "linear-gradient(145deg,#294b3d,#142b26)",
      boxShadow: "0 3px 18px #0009", font: "700 13px Arial,sans-serif",
      cursor: "pointer", touchAction: "manipulation"
    });
    closeButton.addEventListener("click", closeDanVuong);
    topbar.appendChild(closeButton);

    const frame = document.createElement("iframe");
    frame.title = "Đan Vương Điện";
    frame.src = new URL("dan-vuong.html?embedded=1&v=ingame-v2", document.baseURI).href;
    frame.setAttribute("allow", "fullscreen");
    Object.assign(frame.style, {
      display: "block", width: "100%", height: "100%",
      flex: "1 1 auto", border: "0", background: "#101715"
    });

    overlay.append(topbar, frame);
    document.body.appendChild(overlay);
    document.documentElement.style.overflow = "hidden";
    closeButton.focus({ preventScroll: true });
  }

  function pointInDanGe(event) {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return false;
    const x = (event.clientX - rect.left) * canvas.width / rect.width;
    const y = (event.clientY - rect.top) * canvas.height / rect.height;
    return x >= HIT.left && x <= HIT.right && y >= HIT.top && y <= HIT.bottom;
  }

  // Bắt ở capture trên khung sân: vẫn nhận được thao tác nếu một lớp HUD
  // nằm phía trên canvas, nhưng chỉ mở khi điểm chạm rơi đúng vùng ĐAN CÁC.
  function onArenaPointerDown(event) {
    if (overlay || event.defaultPrevented || event.isPrimary === false) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if (!pointInDanGe(event)) return;
    event.preventDefault();
    event.stopPropagation();
    openDanVuong();
  }

  arena.addEventListener("pointerdown", onArenaPointerDown, true);
  // Dự phòng cho trình duyệt cũ không phát PointerEvent.
  arena.addEventListener("click", event => {
    if (overlay || event.defaultPrevented || event.button !== 0) return;
    if (!pointInDanGe(event)) return;
    event.preventDefault();
    event.stopPropagation();
    openDanVuong();
  }, true);

  canvas.addEventListener("pointermove", event => {
    if (overlay) return;
    canvas.style.cursor = pointInDanGe(event) ? "pointer" : "";
  }, { passive: true });
  canvas.addEventListener("pointerleave", () => { canvas.style.cursor = ""; });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && overlay) closeDanVuong();
  });

  canvas.setAttribute("aria-label", "Hoạt cảnh trường đua. Chạm tòa lầu Đan Các để mở Đan Vương Điện.");
})();
