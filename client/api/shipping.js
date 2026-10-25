(function () {
  const base = String(window.GAA_CONFIG?.API_BASE_URL || "").replace(/\/$/, "");

  async function request(path, options = {}) {
    const response = await fetch(`${base}${path}`, {
      ...options,
      headers: { Accept: "application/json", ...(options.headers || {}) },
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(payload.message || payload.error || "We couldn’t retrieve that information.");
      error.status = response.status;
      throw error;
    }
    return payload;
  }

  window.GAAShippingApi = Object.freeze({
    async track(trackingNumber) {
      const id = encodeURIComponent(String(trackingNumber || "").trim());
      if (!id) throw new Error("Enter a tracking number to continue.");
      const [shipment, updateResult] = await Promise.all([
        request(`/api/packages/package/${id}`),
        request(`/api/packages/package/${id}/updates`).catch(() => null),
      ]);
      const pkg = shipment.package || shipment;
      return { ...pkg, updates: updateResult?.updates || [] };
    },
    async contact(details) {
      // The existing API has no public contact endpoint; use the configured mail link on the page.
      return { submitted: false, details };
    },
  });
})();
