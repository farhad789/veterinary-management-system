/* FarmProfit International: the farmer writes his ration and local prices, sees what it costs,
   says whether he is satisfied, and if not, prepares a ration-review request.
   No nutrient requirement numbers live here. Everything the farmer types stays in the browser. */
import { MARKETS, COMMON_FEEDS, REFERENCE, CONTACT } from './markets.js';
import { track, trackOnce, copyText } from './request.js';

const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const D = '۰۱۲۳۴۵۶۷۸۹', A = '٠١٢٣٤٥٦٧٨٩';
const toNum = (s) => {
  const t = String(s ?? '').replace(/[۰-۹]/g, (d) => D.indexOf(d)).replace(/[٠-٩]/g, (d) => A.indexOf(d))
    .replace(/[٬,،\s]/g, '').replace('٫', '.');
  const v = parseFloat(t);
  return Number.isFinite(v) && v >= 0 ? v : 0;
};
const fmt = (n) => new Intl.NumberFormat('en', { maximumFractionDigits: Math.abs(n) < 100 ? 2 : 0 }).format(n);
const fmt1 = (n) => new Intl.NumberFormat('en', { maximumFractionDigits: 1 }).format(n);

const SPECIES = {
  dairy: {
    label: 'Dairy cows', group: 'milking cows',
    perf: 'Milk per cow per day (kg)', price: 'Milk price', head: 'Number of milking cows',
    unit: 'kg of milk', valueNote: 'Income over feed cost',
    reasons: ['Milk yield is low', 'Feed cost is too high', 'Milk fat has dropped', 'Digestive or health problems'],
  },
  beef: {
    label: 'Beef cattle (feedlot)', group: 'feedlot cattle',
    perf: 'Weight gain per head per day (kg)', price: 'Live-weight price', head: 'Number of animals',
    unit: 'kg of gain', valueNote: 'Value of gain minus feed cost (approximate)',
    reasons: ['Weight gain is low', 'Feed cost is too high', 'Diarrhoea or acidosis', 'Feed conversion is poor'],
  },
};

const blank = () => ({ name: '', kg: 0, price: 0 });
const st = { market: MARKETS[0], sp: 'dairy', perf: 0, price: 0, head: 0, rows: [blank(), blank(), blank()], sat: null, reasons: new Set(), notes: '' };

const cur = () => st.market.currency;
const money = (v) => `${fmt(v)} <small>${cur()}</small>`;

function totals() {
  const sp = SPECIES[st.sp];
  const cost = st.rows.reduce((s, r) => s + r.kg * r.price, 0);
  const kg = st.rows.reduce((s, r) => s + r.kg, 0);
  const revenue = st.perf * st.price;
  return {
    sp, cost, kg, revenue,
    perUnit: st.perf > 0 && cost > 0 ? cost / st.perf : null,
    margin: st.price > 0 && st.perf > 0 && cost > 0 ? revenue - cost : null,
    share: st.sp === 'dairy' && revenue > 0 && cost > 0 ? (cost / revenue) * 100 : null,
  };
}

function renderRows() {
  const box = $('#ra-rows'); box.innerHTML = '';
  st.rows.forEach((r, i) => {
    const el = document.createElement('div'); el.className = 'row';
    el.innerHTML = `
      <div class="field"><label for="ia-n${i}">Feed</label>
        <input class="input" id="ia-n${i}" list="ia-feeds" autocomplete="off" placeholder="e.g. Barley" value="${esc(r.name)}" /></div>
      <div class="field"><label for="ia-g${i}">Amount (kg per head per day)</label>
        <input class="input" id="ia-g${i}" inputmode="decimal" autocomplete="off" placeholder="e.g. 4" value="${r.kg ? fmt1(r.kg) : ''}" /></div>
      <div class="field"><label for="ia-p${i}">Price (${cur()} per kg)</label>
        <input class="input" id="ia-p${i}" inputmode="decimal" autocomplete="off" placeholder="your price" value="${r.price ? fmt(r.price) : ''}" /></div>
      <button type="button" class="icon-btn" aria-label="Remove row ${i + 1}">×</button>`;
    box.appendChild(el);
    $(`#ia-n${i}`, el).addEventListener('input', (e) => { r.name = e.target.value; render(); });
    $(`#ia-g${i}`, el).addEventListener('input', (e) => { r.kg = toNum(e.target.value); trackOnce('calc_started', { market: st.market.id }); render(); });
    $(`#ia-p${i}`, el).addEventListener('input', (e) => { r.price = toNum(e.target.value); trackOnce('calc_started', { market: st.market.id }); render(); });
    el.querySelector('.icon-btn').addEventListener('click', () => { st.rows.splice(i, 1); render(true); });
  });
}

function renderSplit(t) {
  const box = $('#ra-split');
  const used = st.rows.filter((r) => r.kg > 0 && r.price > 0);
  if (!used.length || t.cost <= 0) { box.innerHTML = ''; return; }
  box.innerHTML = '<h4>Share of each feed in the feed cost</h4>' + used
    .map((r) => ({ n: r.name || `Feed ${st.rows.indexOf(r) + 1}`, c: r.kg * r.price }))
    .sort((a, b) => b.c - a.c)
    .map((x) => { const pc = (x.c / t.cost) * 100;
      return `<div class="bar"><span>${esc(x.n)}</span><i style="--w:${pc.toFixed(1)}%"></i><b>${fmt(pc)}%</b></div>`; }).join('');
}

function requestText(t) {
  const sp = t.sp;
  const lines = [
    'FarmProfit ration review request',
    `Country: ${st.market.name} (prices in ${cur()})`,
    `Animals: ${sp.label}, ${st.head > 0 ? fmt(st.head) : 'number not given'}`,
    `${sp.perf}: ${st.perf > 0 ? fmt1(st.perf) : 'not given'}`,
    `${sp.price} (${cur()} per kg): ${st.price > 0 ? fmt(st.price) : 'not given'}`,
    'Current ration per head per day (fresh weight):',
    ...st.rows.filter((r) => r.kg > 0).map((r) => `- ${r.name || 'feed'}: ${fmt1(r.kg)} kg${r.price > 0 ? ` at ${fmt(r.price)} ${cur()}/kg` : ''}`),
    `Feed cost per head per day: ${t.cost > 0 ? `${fmt(t.cost)} ${cur()}` : 'not calculated'}`,
    `Feed cost per ${sp.unit.replace('kg of ', 'kg ')}: ${t.perUnit ? `${fmt(t.perUnit)} ${cur()}` : 'not calculated'}`,
    `${sp.valueNote} per head per day: ${t.margin === null ? 'not calculated' : `${fmt(t.margin)} ${cur()}`}`,
    `Not satisfied with: ${[...st.reasons].map((i) => sp.reasons[i]).join('; ') || 'not specified'}`,
    `Notes (breed, forage, problems): ${st.notes.trim() || 'none'}`,
  ];
  return lines.join('\n');
}

function contactLinks() {
  const links = [];
  if (CONTACT.whatsapp) links.push(['WhatsApp', CONTACT.whatsapp]);
  if (CONTACT.linkedin) links.push(['LinkedIn', CONTACT.linkedin]);
  if (CONTACT.email) links.push(['Email', `mailto:${CONTACT.email}`]);
  if (CONTACT.instagram) links.push(['Instagram', CONTACT.instagram]);
  return links;
}

function renderAnswer(t) {
  const box = $('#ra-answer');
  $('#ra-yes').setAttribute('aria-pressed', String(st.sat === true));
  $('#ra-no').setAttribute('aria-pressed', String(st.sat === false));
  if (st.sat === null) { box.innerHTML = ''; return; }
  if (st.sat) {
    box.innerHTML = `<p>Good. Keep these numbers as your baseline. Once a month, re-enter your feed prices and your ${t.sp.unit.replace('kg of ', '')} output. If the feed cost per ${t.sp.unit.replace('kg of ', 'kg ')} moves, that is the moment to look at the ration again.</p>
      <p class="muted">Not sure? You can still ask for a second opinion: choose "No, I am not satisfied" and prepare a request.</p>`;
    return;
  }
  box.innerHTML = `
    <fieldset><legend>What are you not satisfied with? (tick any)</legend>
      ${t.sp.reasons.map((x, i) => `<label class="chk"><input type="checkbox" data-r="${i}" ${st.reasons.has(i) ? 'checked' : ''} /> ${x}</label>`).join('')}
    </fieldset>
    <div class="field"><label for="ia-notes">Anything else we should know? (breed, forage, problems)</label>
      <textarea class="input" id="ia-notes" rows="3">${esc(st.notes)}</textarea></div>
    <div class="next">
      <button type="button" class="btn btn--tag" id="ia-prepare">Prepare my ration review request</button>
      <div id="ia-req" hidden>
        <p class="muted">Copy this text and send it to us. It is not sent anywhere until you send it yourself.</p>
        <textarea class="input" id="ia-req-text" rows="11" readonly></textarea>
        <div class="satisfy-btns">
          <button type="button" class="btn btn--ghost" id="ia-copy">Copy request</button>
          ${contactLinks().map(([n, u]) => `<a class="btn btn--ghost" data-contact="${n}" href="${esc(u)}" target="_blank" rel="noopener noreferrer">Send via ${n}</a>`).join('')}
        </div>
        <p class="muted" id="ia-copied" aria-live="polite"></p>
      </div>
    </div>`;
  box.querySelectorAll('[data-r]').forEach((c) => c.addEventListener('change', () => {
    const k = Number(c.dataset.r); c.checked ? st.reasons.add(k) : st.reasons.delete(k);
  }));
  $('#ia-notes').addEventListener('input', (e) => { st.notes = e.target.value; });
  $('#ia-prepare').addEventListener('click', () => {
    const tt = totals();
    $('#ia-req-text').value = requestText(tt); $('#ia-req').hidden = false;
    track('request_prepared', { market: st.market.id, species: st.sp });
  });
  $('#ia-copy').addEventListener('click', async () => {
    const ok = await copyText($('#ia-req-text').value);
    $('#ia-copied').textContent = ok ? 'Copied. Paste it into your message to us.' : 'Could not copy automatically. Select the text and copy it.';
    if (ok) track('request_copied', { market: st.market.id, species: st.sp });
  });
  box.querySelectorAll('[data-contact]').forEach((a) => a.addEventListener('click', () => track('contact_click', { via: a.dataset.contact, market: st.market.id })));
}

function render(rows) {
  const t = totals(), sp = t.sp;
  if (rows) renderRows();
  $('#ra-perf-l').textContent = sp.perf;
  $('#ra-price-l').textContent = `${sp.price} (${cur()} per kg)`;
  $('#ra-head-l').textContent = sp.head;
  $('#ra-perkg-l').textContent = `Feed cost per ${sp.unit.replace('kg of ', 'kg ')}`;
  $('#ra-margin-l').textContent = `${sp.valueNote}, per head per day`;
  const none = '—';
  $('#ra-day').innerHTML = t.cost > 0 ? money(t.cost) : none;
  $('#ra-perkg').innerHTML = t.perUnit === null ? none : money(t.perUnit);
  $('#ra-margin').innerHTML = t.margin === null ? none : `${t.margin < 0 ? '−' : ''}${money(Math.abs(t.margin))}${t.margin < 0 ? ' (loss)' : ''}`;
  $('#ra-herd').innerHTML = t.cost > 0 && st.head > 0 ? money(t.cost * st.head) : none;
  $('#ra-month').innerHTML = t.cost > 0 && st.head > 0 ? money(t.cost * st.head * 30) : none;
  $('#ra-kg').textContent = t.kg > 0 ? `${fmt1(t.kg)} kg of fresh feed per head per day` : '';
  $('#ra-share').innerHTML = t.share === null ? '' : `Feed is ${fmt(t.share)}% of your milk income. ${REFERENCE.label} reports feed cost can range between ${REFERENCE.low} and ${REFERENCE.high} percent of milk income (US herds, so use it as context only). <a href="${REFERENCE.url}" target="_blank" rel="noopener noreferrer">Source</a>`;
  renderSplit(t);
  if (t.cost > 0 && st.perf > 0 && st.price > 0) trackOnce('calc_completed', { market: st.market.id, species: st.sp });
  renderAnswer(t);
}

$('#ra-feeds-list').innerHTML = COMMON_FEEDS.map((f) => `<option value="${esc(f)}"></option>`).join('');
$('#ia-market').innerHTML = MARKETS.map((m) => `<option value="${m.id}">${m.name} (${m.currency})</option>`).join('');
$('#ia-market').addEventListener('change', (e) => {
  st.market = MARKETS.find((m) => m.id === e.target.value); track('market_selected', { market: st.market.id }); render(true);
});
$('#ra-species').addEventListener('change', (e) => {
  st.sp = e.target.value; st.sat = null; st.reasons.clear(); st.perf = 0; $('#ra-perf').value = '';
  st.rows = [blank(), blank(), blank()]; render(true);
});
$('#ra-perf').addEventListener('input', (e) => { st.perf = toNum(e.target.value); trackOnce('calc_started', { market: st.market.id }); render(); });
$('#ra-price').addEventListener('input', (e) => { st.price = toNum(e.target.value); render(); });
$('#ra-head').addEventListener('input', (e) => { st.head = toNum(e.target.value); render(); });
$('#ra-add').addEventListener('click', () => { st.rows.push(blank()); render(true); });
$('#ra-yes').addEventListener('click', () => { st.sat = true; track('satisfied_yes', { market: st.market.id }); render(); });
$('#ra-no').addEventListener('click', () => { st.sat = false; track('satisfied_no', { market: st.market.id }); render(); });
render(true);
