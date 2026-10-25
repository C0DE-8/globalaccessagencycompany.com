/* API host may be injected at deployment; same-origin API is the default. */
window.GAA_CONFIG = Object.freeze({
  API_BASE_URL: window.GAA_API_BASE_URL || "",
});
