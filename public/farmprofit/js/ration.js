/* "جیره‌ی من": farmer writes the ration, we show the economics, then ask if satisfied.
   No nutrient requirement numbers live here. NASEM comparison is a later step and is
   shown as "not available" until each value is verified in the book. */
import { META, PRODUCTS, ROWS, CALC_REFERENCE } from './data.js';

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

const st = { sp: 'dairy', perf: 0, price: 0, head: 0, rows: [], sat: null, reasons: new Set() };
const blank = () => ({ key: 'custom', name: '', kg: 0, price: 0 });
st.rows = [blank(), blank(), blank()];

const root = $('#ration');
if (root) {
  const feedOpts = (sel) => `<option value="custom" ${sel === 'custom' ? 'selected' : ''}>نهاده‌ی خودم را می‌نویسم</option>`
    + PRODUCTS.map((p) => `<option value="${p.id}" ${p.id === sel ? 'selected' : ''}>${p.name}، قیمت از جدول</option>`).join('');

  const totals = () => {
    const sp = SPECIES[st.sp];
    const cost = st.rows.reduce((s, r) => s + r.kg * r.price, 0);
    const kg = st.rows.reduce((s, r) => s + r.kg, 0);
    const revenue = st.perf * st.price;
    return { sp, cost, kg, revenue, perKg: st.perf > 0 ? cost / st.perf : null, margin: st.price > 0 && st.perf > 0 ? revenue - cost : null };
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
        ${r.key !== 'custom' ? `<p class="note">قیمت اولیه از جدول قیمت‌ها (${META.dateFa}) و مربوط به استان مرکزی نیست. با قیمت خریدتان عوضش کنید.</p>` : ''}`;
      box.appendChild(el);
      $(`#ra-k${i}`, el).addEventListener('change', (e) => {
        r.key = e.target.value; r.price = r.key === 'custom' ? 0 : refPrice(r.key); render(true);
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
      .map((r) => ({ n: r.key === 'custom' ? (r.name || `نهاده‌ی ${fa(st.rows.indexOf(r) + 1)}`) : PRODUCTS.find((p) => p.id === r.key).name, c: r.kg * r.price }))
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
      </div>`;
    box.querySelectorAll('[data-r]').forEach((c) => c.addEventListener('change', () => {
      const k = Number(c.dataset.r); c.checked ? st.reasons.add(k) : st.reasons.delete(k);
    }));
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
    renderSplit(t); renderAnswer();
  }

  $('#ra-species').addEventListener('change', (e) => {
    st.sp = e.target.value; st.sat = null; st.reasons.clear();
    st.rows = [blank(), blank(), blank()]; st.perf = 0; $('#ra-perf').value = '';
    render(true);
  });
  $('#ra-perf').addEventListener('input', (e) => { st.perf = toNum(e.target.value); render(); });
  $('#ra-price').addEventListener('input', (e) => { st.price = toNum(e.target.value); render(); });
  $('#ra-head').addEventListener('input', (e) => { st.head = toNum(e.target.value); render(); });
  $('#ra-add').addEventListener('click', () => { st.rows.push(blank()); render(true); });
  $('#ra-yes').addEventListener('click', () => { st.sat = true; renderAnswer(); });
  $('#ra-no').addEventListener('click', () => { st.sat = false; renderAnswer(); });
  render(true);
}
