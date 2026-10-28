import {
  META, UNIT_NOTE, PROVINCES, NEIGHBORS_OF_MARKAZI, PRODUCTS, ROWS, CALC_REFERENCE, NASEM, MODULES, INSTAGRAM,
} from './data.js';

/* ---------- helpers ---------- */
const $ = (s, el = document) => el.querySelector(s);
const fa = (n) => new Intl.NumberFormat('fa-IR').format(Math.round(n));
const toman = (rial) => rial / 10; // see UNIT_NOTE in data.js
const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';
const toNum = (s) => {
  const t = String(s ?? '')
    .replace(/[۰-۹]/g, (d) => FA_DIGITS.indexOf(d))
    .replace(/[٠-٩]/g, (d) => AR_DIGITS.indexOf(d))
    .replace(/[٬,،\s]/g, '')
    .replace('٫', '.');
  const v = parseFloat(t);
  return Number.isFinite(v) && v >= 0 ? v : 0;
};
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const prodName = (id) => PRODUCTS.find((p) => p.id === id)?.name ?? id;
const provName = (id) => PROVINCES.find((p) => p.id === id)?.name ?? id;
const mid = (row) => toman((row.min + row.max) / 2);
const rowById = (id) => ROWS.find((r) => r.id === id);
const rangeText = (lo, hi) => (lo === hi ? fa(lo) : `${fa(lo)} تا ${fa(hi)}`);

/* ---------- links ---------- */
['#cta-header', '#cta-main'].forEach((s) => { $(s).href = INSTAGRAM; });

/* ---------- state ---------- */
const state = {
  milk: 30,
  milkPrice: '',
  cows: 100,
  ration: [
    { key: 'corn', kg: 5 },
    { key: 'barley', kg: 4 },
    { key: 'soymeal', kg: 3 },
    { key: 'alfalfa', kg: 6 },
    { key: 'bran', kg: 2 },
  ].map((r) => ({ ...r, price: Math.round(mid(rowById(CALC_REFERENCE[r.key]))), manual: false, name: '' })),
  product: 'alfalfa',
  province: 'markazi',
};

/* ---------- freshness ---------- */
const daysOld = Math.max(0, Math.floor((Date.now() - Date.parse(META.dateISO)) / 86400000));
$('#hero-date-tag').textContent = `قیمت‌ها مربوط به ${META.dateFa} است`;

/* ---------- hero + calculator results ---------- */
function totals() {
  const perCow = state.ration.reduce((s, r) => s + r.kg * r.price, 0);
  const milk = state.milk;
  const perKg = milk > 0 ? perCow / milk : 0;
  const mp = toNum(state.milkPrice);
  const iofc = mp > 0 && milk > 0 ? milk * mp - perCow : null;
  return { perCow, perKg, iofc, herd: perCow * state.cows, mp };
}

function updateOutputs() {
  const t = totals();
  $('#hero-number').textContent = state.milk > 0 ? fa(t.perKg) : '—';
  $('#hero-milk-out').textContent = `${fa(state.milk)} کیلوگرم`;
  $('#hero-eq').textContent = `${fa(t.perCow)} تومان خوراک روزانه تقسیم بر ${fa(state.milk)} کیلوگرم شیر`;
  $('#r-day').innerHTML = `${fa(t.perCow)} <small>تومان</small>`;
  $('#r-kg').innerHTML = state.milk > 0 ? `${fa(t.perKg)} <small>تومان</small>` : '<small>شیر هر گاو را وارد کنید</small>';
  $('#r-iofc').innerHTML = t.iofc === null
    ? '<small>قیمت شیر خودتان را وارد کنید</small>'
    : `${t.iofc < 0 ? '−' : ''}${fa(Math.abs(t.iofc))} <small>تومان</small>`;
  $('#r-herd').innerHTML = `${fa(t.herd)} <small>تومان</small>`;
  $('#hero-milk').value = Math.min(60, Math.max(10, state.milk));
}

/* ---------- calculator rows ---------- */
function refNote(r) {
  if (r.manual || r.key === 'custom') return 'قیمت را خودتان وارد کرده‌اید.';
  const ref = rowById(CALC_REFERENCE[r.key]);
  return `قیمت اولیه: میانگین بازه‌ی گزارش‌شده برای ${ref.variant} در ${ref.loc}، ${META.dateFa}. مربوط به استان مرکزی نیست.`;
}

function renderRows() {
  const box = $('#rows');
  box.innerHTML = '';
  state.ration.forEach((r, i) => {
    const el = document.createElement('div');
    el.className = 'row';
    const opts = PRODUCTS.map((p) => `<option value="${p.id}" ${p.id === r.key ? 'selected' : ''}>${p.name}</option>`).join('')
      + `<option value="custom" ${r.key === 'custom' ? 'selected' : ''}>نهاده‌ی دیگر</option>`;
    el.innerHTML = `
      <div class="field"><label for="k${i}">نهاده</label>
        <select class="input" id="k${i}">${opts}</select>
        ${r.key === 'custom' ? `<input class="input" aria-label="نام نهاده" placeholder="نام نهاده" value="${esc(r.name)}" data-name="${i}" />` : ''}
      </div>
      <div class="field"><label for="g${i}">مقدار (کیلوگرم)</label><input class="input" id="g${i}" inputmode="decimal" autocomplete="off" value="${fa(r.kg)}" /></div>
      <div class="field"><label for="p${i}">قیمت (تومان بر کیلوگرم)</label><input class="input" id="p${i}" inputmode="decimal" autocomplete="off" value="${r.price ? fa(r.price) : ''}" placeholder="قیمت خودتان" /></div>
      <button type="button" class="icon-btn" aria-label="حذف ${esc(r.key === 'custom' ? r.name || 'این نهاده' : prodName(r.key))}" data-del="${i}">×</button>
      <p class="note" id="n${i}">${refNote(r)}</p>`;
    box.appendChild(el);

    $(`#k${i}`, el).addEventListener('change', (e) => {
      const key = e.target.value;
      r.key = key;
      r.manual = false;
      r.price = key === 'custom' ? 0 : Math.round(mid(rowById(CALC_REFERENCE[key])));
      renderRows(); updateOutputs();
    });
    $(`#g${i}`, el).addEventListener('input', (e) => { r.kg = toNum(e.target.value); updateOutputs(); });
    $(`#p${i}`, el).addEventListener('input', (e) => {
      r.price = toNum(e.target.value); r.manual = true;
      $(`#n${i}`).textContent = refNote(r); updateOutputs();
    });
    const nm = el.querySelector('[data-name]');
    if (nm) nm.addEventListener('input', (e) => { r.name = e.target.value; });
    el.querySelector('[data-del]').addEventListener('click', () => {
      state.ration.splice(i, 1); renderRows(); updateOutputs();
    });
  });
}

$('#add-row').addEventListener('click', () => {
  state.ration.push({ key: 'custom', kg: 1, price: 0, manual: true, name: '' });
  renderRows(); updateOutputs();
});
$('#in-milk').value = fa(state.milk);
$('#in-cows').value = fa(state.cows);
$('#in-milk').addEventListener('input', (e) => { state.milk = toNum(e.target.value); updateOutputs(); });
$('#in-price').addEventListener('input', (e) => { state.milkPrice = e.target.value; updateOutputs(); });
$('#in-cows').addEventListener('input', (e) => { state.cows = toNum(e.target.value); updateOutputs(); });
$('#hero-milk').addEventListener('input', (e) => {
  state.milk = Number(e.target.value);
  $('#in-milk').value = fa(state.milk);
  updateOutputs();
});

/* ---------- price explorer ---------- */
function rowsFor(product, province) {
  return ROWS.filter((r) => r.product === product && (!province || r.province === province));
}

function renderTabs() {
  const tabs = $('#prod-tabs');
  tabs.innerHTML = PRODUCTS.map((p) => `<button class="tab" role="tab" type="button" aria-selected="${p.id === state.product}" data-p="${p.id}">${p.name}</button>`).join('');
  tabs.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => {
    state.product = b.dataset.p; renderPrices();
  }));
}

function renderFresh() {
  const f = $('#fresh');
  if (daysOld >= 3) {
    f.className = 'fresh fresh--old';
    f.innerHTML = `هشدار قدیمی‌بودن: این قیمت‌ها ${fa(daysOld)} روز پیش (${META.dateFa}) ثبت شده‌اند. پیش از تصمیم از فروشنده بپرسید.`;
  } else {
    f.className = 'fresh';
    f.innerHTML = `<span class="tag tag--ok">قیمت ${META.dateFa}</span><span>منبع: <a href="${PRODUCTS.find((p) => p.id === state.product).page}" target="_blank" rel="noopener noreferrer">${META.source}</a></span>`;
  }
}

function renderGrid() {
  const withData = new Set(rowsFor(state.product).map((r) => r.province));
  $('#coverage').textContent = `برای ${prodName(state.product)} در ${fa(withData.size)} استان از ${fa(PROVINCES.length)} استان قیمت ثبت شده است.`;
  const order = [...PROVINCES].sort((a, b) => (a.id === 'markazi' ? -1 : b.id === 'markazi' ? 1 : 0));
  $('#prov-grid').innerHTML = order.map((p) => {
    const rs = rowsFor(state.product, p.id);
    const has = rs.length > 0;
    let sub = 'ثبت نشده';
    if (has) {
      const lo = Math.min(...rs.map((r) => toman(r.min)));
      const hi = Math.max(...rs.map((r) => toman(r.max)));
      sub = `${rangeText(lo, hi)} تومان`;
    }
    return `<button type="button" class="prov ${has ? 'prov--has' : 'prov--none'} ${p.id === 'markazi' ? 'prov--home' : ''}" data-prov="${p.id}" aria-pressed="${p.id === state.province}"><strong>${p.name}</strong><small>${sub}</small></button>`;
  }).join('');
  $('#prov-grid').querySelectorAll('button').forEach((b) => b.addEventListener('click', () => {
    state.province = b.dataset.prov; renderGrid(); renderDetail();
  }));
}

function quotationText(product, province) {
  return `سلام و وقت بخیر.\nلطفاً قیمت امروز ${prodName(product)} را اعلام کنید:\n- مشخصات و کیفیت (برای خوراک خشک: رطوبت یا ماده خشک):\n- محل تحویل: ${provName(province)}\n- حداقل مقدار سفارش:\n- هزینه‌ی حمل در قیمت هست یا جدا؟\n- شرایط پرداخت:\n- تا چه تاریخی این قیمت معتبر است؟\nممنون.`;
}

function renderDetail() {
  const d = $('#detail');
  const rs = rowsFor(state.product, state.province);
  const pn = provName(state.province);
  const pr = prodName(state.product);
  let html = `<div class="detail-head"><h3>${pr} در ${pn}</h3>`;
  html += rs.length ? '<span class="tag tag--ok">تأییدشده</span>' : '<span class="tag tag--none">موجود نیست</span>';
  html += '</div>';

  if (rs.length) {
    html += `<div class="table-scroll"><table><thead><tr><th>نوع (مطابق منبع)</th><th>محل</th><th>بازه‌ی گزارش‌شده (تومان بر کیلوگرم)</th><th>عدد خود منبع (ریال)</th><th>تاریخ</th></tr></thead><tbody>`;
    html += rs.map((r) => `<tr><td>${r.variant}</td><td>${r.loc}${r.type === 'port' ? ' (بندر)' : ''}</td><td class="num">${rangeText(toman(r.min), toman(r.max))}</td><td>${rangeText(r.min, r.max)}</td><td>${META.dateFa}</td></tr>`).join('');
    html += '</tbody></table></div>';
    if (rs.some((r) => r.type === 'port')) html += '<p class="muted">قیمت بندر یعنی قیمت کالای وارداتی در همان بندر. هزینه‌ی حمل تا مزرعه‌ی شما در آن نیست.</p>';
  } else {
    html += `<div class="callout callout--none"><strong>برای ${pr} در ${pn} قیمت تأییدشده‌ای نداریم.</strong> جدول‌های منبع در ${META.dateFa} ردیفی برای این استان ندارند. عددی حدس نمی‌زنیم.</div>`;
    if (state.province === 'markazi') {
      const near = NEIGHBORS_OF_MARKAZI.filter((p) => rowsFor(state.product, p).length);
      if (near.length) {
        html += `<div><p><strong>استان‌های همسایه‌ی مرکزی که قیمت دارند (مربوط به استان مرکزی نیست):</strong></p><div class="chips">${near.map((p) => `<button type="button" class="chip" data-go="${p}">${provName(p)}</button>`).join('')}</div></div>`;
      } else {
        html += `<p class="muted">برای ${pr} در هیچ‌کدام از استان‌های همسایه هم قیمتی ثبت نشده است.</p>`;
      }
    }
  }
  html += `<div><p><strong>برای قیمت واقعی ${pn}:</strong> این متن را برای فروشنده بفرستید.</p><button type="button" class="btn btn--ghost btn--small" id="copy-q">کپی متن استعلام</button> <span id="copy-ok" class="muted" role="status"></span></div>`;
  d.innerHTML = html;

  d.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => {
    state.province = b.dataset.go; renderGrid(); renderDetail();
  }));
  $('#copy-q').addEventListener('click', async () => {
    const text = quotationText(state.product, state.province);
    try { await navigator.clipboard.writeText(text); $('#copy-ok').textContent = 'کپی شد.'; }
    catch { $('#copy-ok').textContent = 'کپی خودکار ممکن نشد. متن را دستی بنویسید.'; }
  });
}

function renderMethod() {
  $('#method-list').innerHTML = [
    `منبع: ${META.source}، صفحه‌ی هر نهاده، خوانده‌شده در ${META.dateFa}.`,
    'این‌ها قیمت‌های گزارش‌شده‌اند (حداقل و حداکثر)، نه قیمت قطعی یک معامله.',
    'نوع و کیفیت کالا، شرایط تحویل و حمل در منبع مشخص نیست.',
    'جدول‌های منبع فقط چند استان یا بندر را برای هر نهاده دارند و برای استان مرکزی ردیفی نیست.',
    'واحد ذرت فقط برای کالای وارداتی بندرها آمده است، نه ذرت داخلی.',
  ].map((t) => `<li>${t}</li>`).join('');
  $('#unit-note').textContent = UNIT_NOTE;
}

function renderPrices() { renderTabs(); renderFresh(); renderGrid(); renderDetail(); }

/* ---------- science ---------- */
function renderScience() {
  $('#nasem-title').textContent = NASEM.title;
  $('#nasem-pub').textContent = `${NASEM.publisher}, ${NASEM.year}. DOI: ${NASEM.doi}`;
  $('#nasem-links').innerHTML = NASEM.links.map((l) => `<li><a href="${l.url}" target="_blank" rel="noopener noreferrer">${l.label}</a></li>`).join('');
  $('#modules').innerHTML = MODULES.map((m) => `<li><span>${m}</span><span class="tag tag--none">عددی وارد نشده</span></li>`).join('');
}

/* ---------- init ---------- */
renderRows();
updateOutputs();
renderPrices();
renderMethod();
renderScience();
