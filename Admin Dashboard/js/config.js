// config.js

const CONFIG = {
  BASE_URL: "http://localhost:8080",
};

// Optional helper
function buildUrl(path) {
  return CONFIG.BASE_URL + path;
}
