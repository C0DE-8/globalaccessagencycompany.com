(function () {
  function confirmAction({ title, message, detail, confirmLabel = "Continue" }) {
    return new Promise((resolve) => {
      const overlay = document.createElement("div");
      overlay.className = "confirmOverlay show";
      overlay.innerHTML = `
        <section class="confirmDialog" role="alertdialog" aria-modal="true" aria-labelledby="adminConfirmTitle" aria-describedby="adminConfirmMessage">
          <div class="confirmIcon" aria-hidden="true">!</div>
          <h2 id="adminConfirmTitle"></h2>
          <p id="adminConfirmMessage"></p>
          ${detail ? '<code class="confirmTracker"></code>' : ""}
          <div class="confirmActions">
            <button type="button" class="confirmCancel">Cancel</button>
            <button type="button" class="confirmDelete"></button>
          </div>
        </section>`;
      const titleNode = overlay.querySelector("h2");
      const messageNode = overlay.querySelector("p");
      titleNode.textContent = title;
      messageNode.textContent = message;
      if (detail) overlay.querySelector(".confirmTracker").textContent = detail;
      const cancel = overlay.querySelector(".confirmCancel");
      const accept = overlay.querySelector(".confirmDelete");
      accept.textContent = confirmLabel;
      document.body.appendChild(overlay);
      document.body.classList.add("dialog-open");
      accept.focus();

      let done = false;
      function close(value) {
        if (done) return;
        done = true;
        document.removeEventListener("keydown", onKeydown);
        overlay.remove();
        document.body.classList.remove("dialog-open");
        resolve(value);
      }
      function onKeydown(event) {
        if (event.key === "Escape") close(false);
        if (event.key === "Tab") {
          event.preventDefault();
          (document.activeElement === accept ? cancel : accept).focus();
        }
      }
      cancel.addEventListener("click", () => close(false));
      accept.addEventListener("click", () => close(true));
      overlay.addEventListener("click", (event) => {
        if (event.target === overlay) close(false);
      });
      document.addEventListener("keydown", onKeydown);
    });
  }

  window.AdminUI = {
    confirmDelete(tracker) {
      return confirmAction({
        title: "Delete this package?",
        message: "This will permanently remove the package and its tracking record. This action cannot be undone.",
        detail: tracker,
        confirmLabel: "Delete package"
      });
    }
  };
})();
