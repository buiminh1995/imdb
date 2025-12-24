
function buildUrl(path, params = {}) {
  const u = new URL(path, window.location.origin);
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    u.searchParams.set(key, String(value));
  });
  return u.toString();
}

export async function getRecentMovies({ limit = 20, signal = undefined, timeout = 0 } = {}) {
  const url = buildUrl("/api/main", { limit });
  return fetchJson(url, { signal, timeout });
}

export async function getTitle(tconst, { signal, timeout = 0 } = {}) {
  const url = `/api/title/${encodeURIComponent(tconst)}`;
  return fetchJson(url, { signal, timeout });
}

export async function getPerson(nconst, { signal, timeout = 0 } = {}) {
  const url = `/api/person/${encodeURIComponent(nconst)}`;
  return fetchJson(url, { signal, timeout });
}

export async function search({ q, page = 1, pageSize = 20, signal, timeout = 0 } = {}) {
  const url = buildUrl("/api/search", {
    q,
    page,
    page_size: pageSize
  });
  return fetchJson(url, { signal, timeout });
}

// Helper: fetch with optional timeout (ms) and signal support
async function fetchJson(url, { signal = undefined, timeout = 0, init = {} } = {}) {
  let controller;
  let timeoutId;

  if (!signal && timeout > 0) {
    controller = new AbortController();
    init.signal = controller.signal;
    timeoutId = setTimeout(() => controller.abort(), timeout);
  } else if (signal) {
    init.signal = signal;
  }

  // default headers
  init.headers = {
    Accept: "application/json",
    ...(init.headers || {}),
  };

  const res = await fetch(url, init).finally(() => {
    if (timeoutId) clearTimeout(timeoutId);
  });

  if (!res.ok) {
    // try to parse JSON error if provided
    let text;
    try {
      text = await res.text();
      // sometimes APIs return JSON error bodies
      const json = JSON.parse(text);
      const msg = json?.detail || json?.message || text;
      const err = new Error(msg || `Request failed: ${res.status}`);
      err.status = res.status;
      throw err;
    } catch (e) {
      // fallback to generic error
      const err = new Error(`Request failed: ${res.status}`);
      err.status = res.status;
      throw err;
    }
  }

  // If no content
  if (res.status === 204) return null;
  console.log(res)
  return res.json();
}

// Default export convenience object
const api = {
  buildUrl,
  fetchJson,
  search,
  getTitle,
  getPerson,
//   getTop,
//   postJson,
};

export default api;