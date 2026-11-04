/* "جیره‌ی من": farmer writes the ration, we show the economics, then ask if satisfied.
   No nutrient requirement numbers live here. NASEM comparison is a later step and is
   shown as "not available" until each value is verified in the book. */
import { META, PRODUCTS, ROWS, CALC_REFERENCE, INSTAGRAM } from './data.js';
import { track, trackOnce, copyText } from './request.js';
/* feeds.js (NASEM feed library) is optional. It is licensed material that only exists in the private repo until
   NASEM permits public use (docs/licensing.md). Without it the page falls back to the 5 priced products + own feeds. */
let lib = null;
try { lib = await import('./feeds.js'); } catch (e) { lib = null; }
const HAS_NASEM = !!lib;
const FEEDS = lib ? lib.FEEDS : PRODUCTS.map((p) => ({ id: p.id, n: p.name, c: 'market', t: '', dm: null, cp: null, ndf: null }));
const FEED_CATEGORIES = lib ? lib.FEED_CATEGORIES : { market: 'نهاده‌های جدول قیمت' };
const PRICE_MAP = lib ? lib.PRICE_MAP : Object.fromEntries(PRODUCTS.map((p) => [p.id, p.id]));

const $ = (s, el = document) => el.querySelector(s);
const fa = (n) => new Intl.NumberFormat('fa-IR').format(Math.round(n));
const fa1 = (n) => new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 1 }).format(n);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const D = '۰۱۲۳۴۵۶۷۸۹', A = '٠١٢٣٤٥٦٧٨٩';
const toNum = (s) => {
  const t = String(s ?? '').replace(/[۰-۹]/g, (d) => D.indexOf(d)).replace(/[٠-٩]/g, (d) => A.indexOf(d))
    .replace(/[٬,،\s]/g, '').replace('٫', '.');
  const v = parseFloat(t);
  return Number.isFinite(v) && v >= 0 ? v : 0;
};
const rowById = (id) => ROWS.find((r) => r.id === id);
const feedById = (id) => FEEDS.find((f) => f.id === id);
const refPrice = (key) => Math.round(((rowById(CALC_REFERENCE[key]).min + rowById(CALC_REFERENCE[key]).max) / 2) / 10);

/* One animal group at a time. Groups are never mixed. */
const SPECIES = {
  dairy: {
    label: 'گاو شیری', group: 'گاو شیرده',
    perf: 'شیر هر گاو در روز (کیلوگرم)', perfDefault: '', unitOut: 'کیلو شیر',
    price: 'قیمت شیر (تومان بر کیلوگرم)', head: 'تعداد گاو شیرده',
    valueNote: 'درآمد شیر منهای خرج خوراک',
    measure: ['وزن گاو', 'شیر روزانه', 'چربی و پروتئین شیر', 'روز شیردهی', 'نمره‌ی بدنی'],
    unsatisfied: ['شیر کم است', 'خرج خوراک زیاد است', 'چربی شیر پایین آمده', 'مشکل هضم یا سلامت'],
  },
  beef: {
    label: 'گاو گوشتی (پرواری)', group: 'گاو پرواری',
    perf: 'افزایش وزن هر رأس در روز (کیلوگرم)', perfDefault: '', unitOut: 'کیلو افزایش وزن',
    price: 'قیمت هر کیلو وزن زنده (تومان)', head: 'تعداد دام',
    valueNote: 'ارزش افزایش وزن منهای خرج خوراک (تقریبی)',
    measure: ['وزن زنده در شروع و حالا', 'فاصله‌ی دو وزن‌کشی به روز', 'سن و نژاد', 'جنس (نر یا ماده)'],
    unsatisfied: ['افزایش وزن کم است', 'خرج خوراک زیاد است', 'اسهال یا اسیدوز', 'ضریب تبدیل بد است'],
  },
  sheep: {
    label: 'گوسفند (بره‌ی پرواری)', group: 'بره‌ی پرواری',
    perf: 'افزایش وزن هر رأس در روز (کیلوگرم، مثلاً ۰٫۲۵)', perfDefault: '', unitOut: 'کیلو افزایش وزن',
    price: 'قیمت هر کیلو وزن زنده (تومان)', head: 'تعداد بره',
    valueNote: 'ارزش افزایش وزن منهای خرج خوراک (تقریبی)',
    measure: ['وزن زنده در شروع و حالا', 'فاصله‌ی دو وزن‌کشی به روز', 'سن و نژاد', 'جنس'],
    unsatisfied: ['افزایش وزن کم است', 'خرج خوراک زیاد است', 'اسهال یا نفخ', 'ضریب تبدیل بد است'],
  },
};

const st = { sp: 'dairy', perf: 0, price: 0, head: 0, rows: [], sat: null, reasons: new Set(), notes: '' };
const blank = () => ({ key: 'custom', name: '', kg: 0, price: 0 });
st.rows = [blank(), blank(), blank()];

const root = $('#ration');
if (root) {
  const feedOpts = (sel) => {
    const groups = Object.keys(FEED_CATEGORIES).map((c) => {
      const items = FEEDS.filter((f) => f.c === c);
      return `<optgroup label="${FEED_CATEGORIES[c]} (${fa(items.length)})">${items.map((f) => `<option value="${f.id}" ${f.id === sel ? 'selected' : ''}>${esc(f.n)}</option>`).join('')}</optgroup>`;
    }).join('');
    return `<option value="custom" ${sel === 'custom' ? 'selected' : ''}>نهاده‌ی خودم را می‌نویسم</option>${groups}`;
  };

  const totals = () => {
    const sp = SPECIES[st.sp];
    const cost = st.rows.reduce((s, r) => s + r.kg * r.price, 0);
    const kg = st.rows.reduce((s, r) => s + r.kg, 0);
    const revenue = st.perf * st.price;
    const known = st.rows.filter((r) => r.kg > 0 && feedById(r.key)?.dm != null);
    const dmKg = known.reduce((a, r) => a + r.kg * feedById(r.key).dm / 100, 0);
    const wavg = (k) => { const w = known.filter((r) => feedById(r.key)[k] != null); const d = w.reduce((a, r) => a + r.kg * feedById(r.key).dm / 100, 0); return d > 0 ? w.reduce((a, r) => a + r.kg * feedById(r.key).dm / 100 * feedById(r.key)[k], 0) / d : null; };
    const unknown = st.rows.filter((r) => r.kg > 0 && r.key === 'custom').length;
    return { sp, cost, kg, revenue, dmKg, cp: wavg('cp'), ndf: wavg('ndf'), unknown, perKg: st.perf > 0 ? cost / st.perf : null, margin: st.price > 0 && st.perf > 0 ? revenue - cost : null };
  };

  const feedNote = (r) => {
    const f = feedById(r.key); if (!f) return '';
    if (!HAS_NASEM) return `قیمت اولیه از جدول قیمت‌ها (${META.dateFa}) است و مربوط به استان مرکزی نیست. با قیمت خریدتان عوضش کنید.`;
    const v = (x) => (x == null ? 'ثبت نشده' : `${fa1(x)}٪`);
    const pm = PRICE_MAP[r.key] ? ` قیمت اولیه از جدول قیمت‌ها (${META.dateFa}) است و فقط انطباق تقریبی با «${PRODUCTS.find((p) => p.id === PRICE_MAP[r.key]).name}» دارد. استان مرکزی نیست؛ با قیمت خریدتان عوضش کنید.` : ' قیمت این نهاده در جدول ما نیست؛ قیمت خریدتان را بنویسید.';
    return `NASEM: ماده خشک ${v(f.dm)}، پروتئین خام ${v(f.cp)} و NDF ${v(f.ndf)} (دو مورد آخر نسبت به ماده خشک).${pm}`;
  };

  function renderRows() {
    const box = $('#ra-rows'); box.innerHTML = '';
    st.rows.forEach((r, i) => {
      const el = document.createElement('div'); el.className = 'row';
      el.innerHTML = `
        <div class="field"><label for="ra-k${i}">نهاده</label>
          <select class="input" id="ra-k${i}">${feedOpts(r.key)}</select>
          ${r.key === 'custom' ? `<input class="input" aria-label="نام نهاده" placeholder="نام نهاده" value="${esc(r.name)}" data-name />` : ''}
        </div>
        <div class="field"><label for="ra-g${i}">مقدار (کیلوگرم)</label><input class="input" id="ra-g${i}" inputmode="decimal" autocomplete="off" value="${r.kg ? fa1(r.kg) : ''}" placeholder="مثلاً ۴" /></div>
        <div class="field"><label for="ra-p${i}">قیمت (تومان بر کیلوگرم)</label><input class="input" id="ra-p${i}" inputmode="decimal" autocomplete="off" value="${r.price ? fa(r.price) : ''}" placeholder="قیمت خودتان" /></div>
        <button type="button" class="icon-btn" aria-label="حذف ردیف ${i + 1}">×</button>
        ${r.key !== 'custom' ? `<p class="note">${feedNote(r)}</p>` : ''}`;
      box.appendChild(el);
      $(`#ra-k${i}`, el).addEventListener('change', (e) => {
        r.key = e.target.value; r.price = PRICE_MAP[r.key] ? refPrice(PRICE_MAP[r.key]) : 0; render(true);
      });
      $(`#ra-g${i}`, el).addEventListener('input', (e) => { r.kg = toNum(e.target.value); render(); });
      $(`#ra-p${i}`, el).addEventListener('input', (e) => { r.price = toNum(e.target.value); render(); });
      const nm = el.querySelector('[data-name]'); if (nm) nm.addEventListener('input', (e) => { r.name = e.target.value; render(); });
      el.querySelector('.icon-btn').addEventListener('click', () => { st.rows.splice(i, 1); render(true); });
    });
  }

  function renderSplit(t) {
    const box = $('#ra-split');
    const used = st.rows.filter((r) => r.kg > 0 && r.price > 0);
    if (!used.length || t.cost <= 0) { box.innerHTML = ''; return; }
    box.innerHTML = '<h4>سهم هر نهاده از خرج خوراک</h4>' + used
      .map((r) => ({ n: r.key === 'custom' ? (r.name || `نهاده‌ی ${fa(st.rows.indexOf(r) + 1)}`) : feedById(r.key).n, c: r.kg * r.price }))
      .sort((a, b) => b.c - a.c)
      .map((x) => { const pc = (x.c / t.cost) * 100;
        return `<div class="bar"><span>${esc(x.n)}</span><i style="--w:${pc.toFixed(1)}%"></i><b>${fa(pc)}٪</b></div>`; }).join('');
  }

  function renderAnswer() {
    const sp = SPECIES[st.sp], box = $('#ra-answer');
    $('#ra-yes').setAttribute('aria-pressed', String(st.sat === true));
    $('#ra-no').setAttribute('aria-pressed', String(st.sat === false));
    if (st.sat === null) { box.innerHTML = ''; return; }
    if (st.sat) {
      box.innerHTML = `<p>خوب است. عددهای بالا را نگه دارید و ماه بعد با قیمت‌های تازه دوباره حساب کنید تا ببینید خرج هر ${sp.unitOut.replace('کیلو ', 'کیلو ')} تغییر کرده یا نه.</p>`;
      return;
    }
    box.innerHTML = `
      <fieldset><legend>چه چیزی راضی‌تان نمی‌کند؟ (چند مورد را می‌توانید بزنید)</legend>
        ${sp.unsatisfied.map((x, i) => `<label class="chk"><input type="checkbox" data-r="${i}" ${st.reasons.has(i) ? 'checked' : ''} /> ${x}</label>`).join('')}
      </fieldset>
      <div class="next">
        <span class="tag tag--none">موجود نیست</span>
        <p><strong>مقایسه‌ی جیره‌ی شما با نیاز ${sp.group} در NASEM هنوز در سایت نیست.</strong>
        این مقایسه را فقط وقتی اضافه می‌کنیم که نیاز همین گروه را در متن کتاب دیده و تأیید کرده باشیم. تا آن موقع عددی از خودمان نمی‌گوییم.</p>
        <p>برای اینکه مقایسه‌ی درست ممکن شود، این‌ها را از مزرعه اندازه بگیرید و یادداشت کنید:</p>
        <ul>${sp.measure.map((m) => `<li>${m}</li>`).join('')}</ul>
        <p class="muted">تا آن موقع، سهم هر نهاده از خرج را نگاه کنید. گران‌ترین نهاده اولین جایی است که با متخصص تغذیه‌تان درباره‌اش حرف بزنید. تغییر جیره را بدون نظر او انجام ندهید.</p>
      </div>
      <div class="next request">
        <h4>درخواست بازبینی و جیره‌نویسی</h4>
        <p class="muted">اگر می‌خواهید جیره‌تان را یک دامپزشک بازبینی کند، متن درخواست را آماده کنید. این متن جایی فرستاده نمی‌شود؛ خودتان کپی می‌کنید و برای ما می‌فرستید.</p>
        <label for="ra-notes">توضیح بیشتر (نژاد، نوع علوفه، مشکل‌ها)</label>
        <textarea class="input" id="ra-notes" rows="3">${esc(st.notes || '')}</textarea>
        <button type="button" class="btn btn--tag" id="ra-prepare">آماده‌کردن درخواست جیره‌نویسی</button>
        <div id="ra-req" hidden>
          <textarea class="input" id="ra-req-text" rows="11" readonly dir="rtl"></textarea>
          <div class="satisfy-btns">
            <button type="button" class="btn btn--ghost" id="ra-copy">کپی درخواست</button>
            <a class="btn btn--ghost" id="ra-send-ig" href="${INSTAGRAM}" target="_blank" rel="noopener noreferrer">ارسال در اینستاگرام</a>
          </div>
          <p class="muted" id="ra-copied" aria-live="polite"></p>
        </div>
      </div>`;
    box.querySelectorAll('[data-r]').forEach((c) => c.addEventListener('change', () => {
      const k = Number(c.dataset.r); c.checked ? st.reasons.add(k) : st.reasons.delete(k);
    }));
    $('#ra-notes').addEventListener('input', (e) => { st.notes = e.target.value; });
    $('#ra-prepare').addEventListener('click', () => {
      $('#ra-req-text').value = requestText(totals()); $('#ra-req').hidden = false;
      track('request_prepared', { market: 'ir', species: st.sp });
    });
    $('#ra-copy').addEventListener('click', async () => {
      const ok = await copyText($('#ra-req-text').value);
      $('#ra-copied').textContent = ok ? 'کپی شد. آن را در پیام برای ما بچسبانید.' : 'کپی خودکار انجام نشد. متن را انتخاب و کپی کنید.';
      if (ok) track('request_copied', { market: 'ir', species: st.sp });
    });
    $('#ra-send-ig').addEventListener('click', () => track('contact_click', { via: 'Instagram', market: 'ir' }));
  }

  function requestText(t) {
    const sp = t.sp;
    return [
      'درخواست بازبینی و جیره‌نویسی (FarmProfit)',
      `دام: ${sp.label}${st.head > 0 ? `، تعداد ${fa(st.head)}` : ''}`,
      `${sp.perf}: ${st.perf > 0 ? fa1(st.perf) : 'وارد نشده'}`,
      `${sp.price}: ${st.price > 0 ? fa(st.price) : 'وارد نشده'}`,
      'جیره‌ی فعلی هر رأس در روز (خوراک تازه):',
      ...st.rows.filter((r) => r.kg > 0).map((r) => `- ${r.key === 'custom' ? (r.name || 'نهاده') : feedById(r.key).n}: ${fa1(r.kg)} کیلوگرم${r.price > 0 ? ` به قیمت ${fa(r.price)} تومان بر کیلوگرم` : ''}`),
      `خرج خوراک هر رأس در روز: ${t.cost > 0 ? `${fa(t.cost)} تومان` : 'حساب نشده'}`,
      `خرج خوراک هر ${sp.unitOut}: ${t.perKg === null || t.cost <= 0 ? 'حساب نشده' : `${fa(t.perKg)} تومان`}`,
      `${sp.valueNote}، هر رأس در روز: ${t.margin === null ? 'حساب نشده' : `${fa(t.margin)} تومان`}`,
      `ناراضی از: ${[...st.reasons].map((i) => sp.unsatisfied[i]).join('، ') || 'مشخص نشده'}`,
      `توضیح: ${(st.notes || '').trim() || 'ندارد'}`,
    ].join('\n');
  }

  function render(rows) {
    const t = totals(), sp = t.sp;
    if (rows) renderRows();
    $('#ra-perf-l').textContent = sp.perf; $('#ra-price-l').textContent = sp.price; $('#ra-head-l').textContent = sp.head;
    const money = (v) => (v === null ? '<span class="tag tag--none">قیمت یا مقدار را وارد کنید</span>' : `${fa(v)} <small>تومان</small>`);
    $('#ra-day').innerHTML = t.cost > 0 ? `${fa(t.cost)} <small>تومان</small>` : '—';
    $('#ra-perkg-l').textContent = `خرج خوراک هر ${sp.unitOut}`;
    $('#ra-perkg').innerHTML = t.perKg === null || t.cost <= 0 ? '—' : `${fa(t.perKg)} <small>تومان</small>`;
    $('#ra-margin-l').textContent = `${sp.valueNote}، هر رأس در روز`;
    $('#ra-margin').innerHTML = t.cost > 0 ? (t.margin === null ? money(null) : `${t.margin < 0 ? '−' : ''}${fa(Math.abs(t.margin))} <small>تومان${t.margin < 0 ? ' (زیان)' : ''}</small>`) : '—';
    $('#ra-herd').innerHTML = t.cost > 0 && st.head > 0 ? `${fa(t.cost * st.head)} <small>تومان</small>` : '—';
    $('#ra-kg').textContent = t.kg > 0 ? `${fa1(t.kg)} کیلوگرم خوراک تازه برای هر رأس در روز` : '';
    $('#ra-dm').innerHTML = t.dmKg > 0 ? `${fa1(t.dmKg)} <small>کیلوگرم</small>` : '—';
    $('#ra-cp').innerHTML = t.cp == null ? '—' : `${fa1(t.cp)}٪ <small>پروتئین خام</small>`;
    $('#ra-ndf').innerHTML = t.ndf == null ? '—' : `${fa1(t.ndf)}٪ <small>NDF</small>`;
    $('#ra-unk').textContent = t.unknown > 0 ? `${fa(t.unknown)} ردیف با نهاده‌ی خودتان در این میانگین‌ها حساب نشده است.` : '';
    renderSplit(t); renderAnswer();
  }

  $('#ra-libnote').textContent = HAS_NASEM
    ? `فهرست نهاده‌ها همان فهرست NASEM (${fa(FEEDS.length)} نهاده) است؛ نام‌ها به انگلیسی و مثل کتاب‌اند.`
    : 'نهاده‌ی خودتان را با نام و قیمت بنویسید یا از ۵ نهاده‌ی جدول قیمت‌ها شروع کنید.';
  if (!HAS_NASEM) ['#ra-dm', '#ra-cp', '#ra-ndf'].forEach((q) => { const d = $(q); (d.closest('div') || d).hidden = true; });
  $('#ra-species').addEventListener('change', (e) => {
    st.sp = e.target.value; st.sat = null; st.reasons.clear();
    st.rows = [blank(), blank(), blank()]; st.perf = 0; $('#ra-perf').value = '';
    render(true);
  });
  $('#ra-perf').addEventListener('input', (e) => { st.perf = toNum(e.target.value); render(); });
  $('#ra-price').addEventListener('input', (e) => { st.price = toNum(e.target.value); render(); });
  $('#ra-head').addEventListener('input', (e) => { st.head = toNum(e.target.value); render(); });
  $('#ra-add').addEventListener('click', () => { st.rows.push(blank()); render(true); });
  $('#ra-yes').addEventListener('click', () => { st.sat = true; track('satisfied_yes', { market: 'ir' }); renderAnswer(); });
  $('#ra-no').addEventListener('click', () => { st.sat = false; track('satisfied_no', { market: 'ir' }); renderAnswer(); });
  render(true);
}
