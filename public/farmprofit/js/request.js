/* Shared by the Persian page (ration.js) and the international page (intl.js).
   1) track(): funnel events. Sends nothing anywhere unless the site owner adds an analytics script
      (Plausible or Google Analytics). It never sends what the farmer typed, only event names.
   2) copyText(): copies the ration-review request so the farmer can send it himself.
      There is no server: what the farmer types stays in the browser until he sends it. */

export function track(name, props = {}) {
  try {
    if (typeof window.plausible === 'function') window.plausible(name, { props });
    else if (typeof window.gtag === 'function') window.gtag('event', name, props);
    (window.dataLayer = window.dataLayer || []).push({ event: name, ...props });
  } catch (e) { /* analytics must never break the page */ }
}

export async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(text); return true; }
  } catch (e) { /* fall through to the old method */ }
  try {
    const ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    const ok = document.execCommand('copy'); ta.remove(); return ok;
  } catch (e) { return false; }
}

/* A one-time funnel step: fires the event the first time only. */
const done = new Set();
export function trackOnce(name, props) { if (done.has(name)) return; done.add(name); track(name, props); }
