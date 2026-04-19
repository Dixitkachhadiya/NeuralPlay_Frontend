import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:2222/api',
// });

// Global delayed loader (shows only for slow requests).
// Implemented here so every `api.*` call automatically benefits.
const LOADER_DELAY_MS = 250;
let activeRequests = 0;
let showTimer = null;
let loaderMounted = false;

function ensureLoaderMounted() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (loaderMounted) return;

  const styleId = 'np-global-loader-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      #np-global-loader {
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: grid;
        place-items: center;
        padding: max(16px, env(safe-area-inset-top)) max(16px, env(safe-area-inset-right)) max(16px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left));
        background: radial-gradient(1200px 800px at 20% 10%, rgba(99, 102, 241, 0.16), transparent 55%),
                    radial-gradient(900px 650px at 80% 30%, rgba(16, 185, 129, 0.14), transparent 55%),
                    rgba(2, 6, 23, 0.72);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        opacity: 0;
        pointer-events: none;
        transition: opacity 220ms ease;
      }
      #np-global-loader[data-open="true"] {
        opacity: 1;
        pointer-events: all;
      }
      #np-global-loader .np-card {
        width: min(560px, 92vw);
        border-radius: 18px;
        border: 1px solid rgba(255,255,255,0.14);
        background: rgba(15, 23, 42, 0.65);
        box-shadow: 0 18px 60px rgba(0,0,0,0.45);
        overflow: hidden;
      }
      #np-global-loader .np-topbar {
        height: 3px;
        background: linear-gradient(90deg, rgba(99,102,241,0), rgba(99,102,241,0.95), rgba(16,185,129,0.95), rgba(99,102,241,0));
        background-size: 220% 100%;
        animation: np-glowbar 1.2s linear infinite;
      }
      #np-global-loader .np-body {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 14px;
        align-items: center;
        padding: 18px 18px 16px;
      }
      #np-global-loader .np-spinner {
        width: 40px;
        height: 40px;
        border-radius: 999px;
        background:
          conic-gradient(from 180deg, rgba(99,102,241,0.0), rgba(99,102,241,0.95), rgba(16,185,129,0.85), rgba(99,102,241,0.0));
        -webkit-mask: radial-gradient(circle at center, transparent 56%, #000 58%);
        mask: radial-gradient(circle at center, transparent 56%, #000 58%);
        animation: np-spin 0.9s linear infinite;
        filter: drop-shadow(0 8px 14px rgba(99,102,241,0.28));
      }
      #np-global-loader .np-title {
        font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
        color: rgba(255,255,255,0.92);
        font-weight: 700;
        letter-spacing: 0.2px;
        font-size: 15px;
        line-height: 1.2;
      }
      #np-global-loader .np-subtitle {
        margin-top: 4px;
        font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
        color: rgba(255,255,255,0.68);
        font-size: 13px;
        line-height: 1.35;
      }
      #np-global-loader .np-skeletons {
        padding: 0 18px 18px;
        display: grid;
        gap: 10px;
      }
      #np-global-loader .np-skel {
        height: 12px;
        border-radius: 999px;
        background: linear-gradient(90deg, rgba(255,255,255,0.10), rgba(255,255,255,0.18), rgba(255,255,255,0.10));
        background-size: 220% 100%;
        animation: np-shimmer 1.25s ease-in-out infinite;
      }
      #np-global-loader .np-skel:nth-child(1) { width: 92%; }
      #np-global-loader .np-skel:nth-child(2) { width: 78%; }
      #np-global-loader .np-skel:nth-child(3) { width: 64%; }

      @keyframes np-spin { to { transform: rotate(360deg); } }
      @keyframes np-shimmer {
        0% { background-position: 0% 50%; }
        100% { background-position: 100% 50%; }
      }
      @keyframes np-glowbar {
        0% { background-position: 0% 50%; }
        100% { background-position: 100% 50%; }
      }
      @media (prefers-reduced-motion: reduce) {
        #np-global-loader .np-spinner,
        #np-global-loader .np-skel,
        #np-global-loader .np-topbar {
          animation: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  const rootId = 'np-global-loader';
  if (!document.getElementById(rootId)) {
    const el = document.createElement('div');
    el.id = rootId;
    el.setAttribute('aria-hidden', 'true');
    el.setAttribute('data-open', 'false');
    el.innerHTML = `
      <div class="np-card" role="status" aria-live="polite" aria-label="Loading">
        <div class="np-topbar"></div>
        <div class="np-body">
          <div class="np-spinner" aria-hidden="true"></div>
          <div>
            <div class="np-title">Loading your data…</div>
            <div class="np-subtitle">This may take a moment. Please don’t refresh.</div>
          </div>
        </div>
        <div class="np-skeletons" aria-hidden="true">
          <div class="np-skel"></div>
          <div class="np-skel"></div>
          <div class="np-skel"></div>
        </div>
      </div>
    `;
    document.body.appendChild(el);
  }

  loaderMounted = true;
}

function setLoaderOpen(isOpen) {
  ensureLoaderMounted();
  const el = typeof document !== 'undefined' ? document.getElementById('np-global-loader') : null;
  if (!el) return;
  el.setAttribute('data-open', isOpen ? 'true' : 'false');
}

function startGlobalLoader() {
  activeRequests += 1;
  if (activeRequests !== 1) return;

  if (showTimer) clearTimeout(showTimer);
  showTimer = setTimeout(() => {
    showTimer = null;
    if (activeRequests > 0) setLoaderOpen(true);
  }, LOADER_DELAY_MS);
}

function stopGlobalLoader() {
  activeRequests = Math.max(0, activeRequests - 1);
  if (activeRequests !== 0) return;

  if (showTimer) {
    clearTimeout(showTimer);
    showTimer = null;
  }
  setLoaderOpen(false);
}

const api = axios.create({
  baseURL: 'https://neuralplay-backend.onrender.com/api',
});


// Add a request interceptor to include the JWT token
api.interceptors.request.use(
  (config) => {
    startGlobalLoader();
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    stopGlobalLoader();
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    stopGlobalLoader();
    return response;
  },
  (error) => {
    stopGlobalLoader();
    // Optionally handle generic errors like 401 Unauthorized globally
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // We can trigger a custom event or let the current component handle the redirect
      window.dispatchEvent(new Event('auth-error'));
    }
    return Promise.reject(error);
  }
);

export default api;
