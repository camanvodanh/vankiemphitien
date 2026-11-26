"use strict";
(() => {
  // Đan Vương Điện được nạp như một lớp độc lập, không thay đổi Canvas hay trạng thái cuộc đua.
  const canvas = document.getElementById("game");
  if (!canvas || window.__vkpDanVuongEntryInstalled) return;
  window.__vkpDanVuongEntryInstalled = true;

  const HIT = { left: 365, right: 475, top: 235, bottom: 342 };
  let overlay = null;
  let frame = null;
  let previousOverflow = "";

  function closeDanVuong() {
    if (!overlay) return;
    overlay.remove();
    overlay = null;
    frame = null;
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

    frame = document.createElement("iframe");
    frame.title = "Đan Vương Điện";
    frame.src = "dan-vuong.html?embedded=1";
    frame.setAttribute("allow", "fullscreen");
    Object.assign(frame.style, {
      display: "block", width: "100%", height: "100%",
      flex: "1 1 auto", border: "0", background: "#101715"
    });
    frame.addEventListener("load", () => {
      try {
        const back = frame.contentDocument?.querySelector(".dan-back");
        if (back) {
          back.addEventListener("click", event => {
            event.preventDefault();
            closeDanVuong();
          }, { once: true });
        }
      } catch (_) {
        // Nút đóng bên ngoài iframe vẫn luôn khả dụng.
      }
    });

    overlay.append(topbar, frame);
    document.body.appendChild(overlay);
    document.documentElement.style.overflow = "hidden";
    closeButton.focus({ preventScroll: true });
  }

  function hitDanGe(event) {
    if (overlay || event.defaultPrevented || event.button !== 0) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = (event.clientX - rect.left) * canvas.width / rect.width;
    const y = (event.clientY - rect.top) * canvas.height / rect.height;
    if (x >= HIT.left && x <= HIT.right && y >= HIT.top && y <= HIT.bottom) {
      event.preventDefault();
      openDanVuong();
    }
  }

  canvas.addEventListener("click", hitDanGe);
  canvas.addEventListener("pointermove", event => {
    if (overlay) return;
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * canvas.width / rect.width;
    const y = (event.clientY - rect.top) * canvas.height / rect.height;
    canvas.style.cursor = x >= HIT.left && x <= HIT.right && y >= HIT.top && y <= HIT.bottom
      ? "pointer" : "";
  }, { passive: true });
  canvas.addEventListener("pointerleave", () => { canvas.style.cursor = ""; });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && overlay) closeDanVuong();
  });
  canvas.setAttribute("aria-label", "Hoạt cảnh trường đua. Chạm Đan Các để mở Đan Vương Điện.");
})();
