(function () {
  const body = document.body;
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  const wash = document.querySelector(".page-wash");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll("[data-year]").forEach((node) => (node.textContent = new Date().getFullYear()));

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const isOpen = body.classList.toggle("nav-open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    });
    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        body.classList.remove("nav-open");
        menuButton.setAttribute("aria-expanded", "false");
      }
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        body.classList.remove("nav-open");
        menuButton.setAttribute("aria-expanded", "false");
      }
    });
  }

  if ("IntersectionObserver" in window && !reducedMotion) {
    const observer = new IntersectionObserver((entries, instance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          instance.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -36px 0px" });
    document.querySelectorAll(".reveal").forEach((node) => observer.observe(node));
  } else {
    document.querySelectorAll(".reveal").forEach((node) => node.classList.add("visible"));
  }

  document.querySelectorAll('a[href$=".html"], a[href^="pages/"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#") || link.target === "_blank" || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || reducedMotion) return;
      const target = new URL(href, window.location.href);
      if (target.origin !== window.location.origin || target.pathname === window.location.pathname) return;
      event.preventDefault();
      wash?.classList.add("exit");
      window.setTimeout(() => (window.location.href = target.href), 190);
    });
  });

  document.querySelectorAll("[data-track-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const input = form.elements.namedItem("tracking");
      const message = form.querySelector("[data-track-message]");
      const id = String(input?.value || "").trim();
      if (!id) { input?.focus(); return; }
      if (message) message.textContent = "Opening your shipment details…";
      window.location.href = `pages/track.html?number=${encodeURIComponent(id)}`;
    });
  });

  const trackPageForm = document.querySelector("[data-track-page-form]");
  if (trackPageForm) {
    const input = trackPageForm.elements.namedItem("tracking");
    const result = document.querySelector("[data-track-result]");
    const message = document.querySelector("[data-track-status]");
    const button = trackPageForm.querySelector("button[type=submit]");
    const originalButton = button?.innerHTML;

    function renderShipment(shipment) {
      result.innerHTML = "";
      const heading = document.createElement("h2");
      heading.textContent = `Shipment ${shipment.tracker_number || input.value}`;
      const badge = document.createElement("span");
      badge.className = "tracking-status";
      badge.textContent = String(shipment.status || "In progress").replaceAll("_", " ");
      const meta = document.createElement("div");
      meta.className = "track-meta";
      [["CURRENT LOCATION", shipment.location], ["DELIVERY DATE", shipment.delivery_date], ["SHIPMENT STATUS", shipment.status], ["SHIPPED OUT", shipment.shipped_out_date]].forEach(([label, value]) => {
        const cell = document.createElement("div");
        const small = document.createElement("small"); small.textContent = label;
        const strong = document.createElement("strong"); strong.textContent = value || "Updating";
        cell.append(small, strong); meta.append(cell);
      });
      result.append(heading, badge, meta);
      if (shipment.package_information) {
        const note = document.createElement("p"); note.textContent = shipment.package_information; result.append(note);
      }
      if (shipment.updates?.length) {
        const updatesHeading = document.createElement("h3"); updatesHeading.textContent = "Shipment updates"; result.append(updatesHeading);
        shipment.updates.forEach((update) => {
          const item = document.createElement("p");
          const label = [update.location, update.created_at].filter(Boolean).join(" · ");
          item.textContent = `${label ? `${label}: ` : ""}${update.update_message || "Shipment update"}`; result.append(item);
        });
      }
      result.classList.add("active");
    }

    async function lookup(number) {
      if (!number) return;
      input.value = number;
      trackPageForm.requestSubmit();
    }

    trackPageForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const number = String(input.value || "").trim();
      if (!number) { input.focus(); return; }
      message.textContent = "Looking up your shipment…";
      result.classList.remove("active");
      button.disabled = true;
      button.innerHTML = '<span class="loading"></span> Finding shipment';
      try {
        const shipment = await window.GAAShippingApi.track(number);
        renderShipment(shipment);
        message.textContent = "Shipment details updated just now.";
      } catch (error) {
        message.textContent = error.status === 404 ? "We couldn’t find that tracking number. Check it and try again." : error.message;
      } finally {
        button.disabled = false;
        button.innerHTML = originalButton;
      }
    });
    const query = new URLSearchParams(window.location.search).get("number");
    if (query) lookup(query);
  }

  document.querySelectorAll("[data-contact-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const values = Object.fromEntries(new FormData(form).entries());
      const subject = encodeURIComponent(`Shipping inquiry — ${values.name || "Website visitor"}`);
      const bodyText = encodeURIComponent(`Name: ${values.name || ""}\nEmail: ${values.email || ""}\nCompany: ${values.company || ""}\nService: ${values.service || ""}\n\n${values.message || ""}`);
      const status = form.querySelector("[data-form-message]");
      if (status) status.textContent = "Opening your email app with your inquiry…";
      window.location.href = `mailto:info@globalaccessagencycompany.com?subject=${subject}&body=${bodyText}`;
    });
  });
})();
