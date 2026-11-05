/* "جیره‌ی من": farmer writes the ration, we show the economics, then ask if satisfied.
   No nutrient requirement numbers live here. NASEM comparison is a later step and is
   shown as "not available" until each value is verified in the book. */
import { META, PRODUCTS, ROWS, CALC_REFERENCE, INSTAGRAM } from './data.js';
import { track, trackOnce, copyText } from './request.js';
import { FEEDS as OPEN_FEEDS, FEED_CATEGORIES as OPEN_FEED_CATEGORIES, PRICE_MAP as OPEN_PRICE_MAP } from './feed-guide.js';
import { SATISFACTION_REASONS, LEARNING_CARDS, evaluateSatisfaction } from './decision.js';
/* feeds.js (NASEM feed library) is optional. It is licensed material that only exists in the private repo until
   NASEM permits public use (docs/licensing.md). Without it the page falls back to the 5 priced products + own feeds. */
let lib = null;
try { lib = await import('./feeds.js'); } catch (e) { lib = null; }
const HAS_NASEM = !!lib;
const FEEDS = lib ? lib.FEEDS : OPEN_FEEDS;
const FEED_CATEGORIES = lib ? lib.FEED_CATEGORIES : OPEN_FEED_CATEGORIES;
const PRICE_MAP = lib ? lib.PRICE_MAP : OPEN_PRICE_MAP;

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

const st = { sp: 'dairy', perf: 0, price: 0, head: 0, rows: [], sat: null, reasons: new Set(), notes: '', profile: {}, evidence: {} };
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
    const unknown = st.rows.filter((r) => r.kg > 0 && (r.key === 'custom' || feedById(r.key)?.dm == null)).length;
    return { sp, cost, kg, revenue, dmKg, cp: wavg('cp'), ndf: wavg('ndf'), unknown, perKg: st.perf > 0 ? cost / st.perf : null, margin: st.price > 0 && st.perf > 0 ? revenue - cost : null };
  };

  const feedNote = (r) => {
    const f = feedById(r.key); if (!f) return '';
    if (!HAS_NASEM) { const detail = f.note ? ` ${f.note}` : ''; const market = PRICE_MAP[r.key] ? ` قیمت اولیه از جدول قیمت‌ها (${META.dateFa}) است؛ محل قیمت با محل مزرعه یکی نیست و باید با فاکتور خرید جایگزین شود.` : ' برای این نهاده قیمت مرجع تأییدشده در سایت نداریم؛ قیمت تحویل مزرعه را وارد کنید.'; return `ترکیب ماده خشک، پروتئین و NDF این نهاده در نسخه عمومی ثبت نشده؛ آن را از برگه آنالیز یا آزمایشگاه وارد کنید.${market}${detail}`; }
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
      box.innerHTML = `
        <div class="next decision-dialogue">
          <span class="tag tag--ok">گفت‌وگوی بررسی رضایت</span>
          <p><strong>خوشحالیم که راضی هستید؛ اما می‌خواهیم بدانیم رضایت شما بر چه شواهدی تکیه دارد.</strong> کم‌شدن قیمت خرید به‌تنهایی به معنی افزایش سود نیست؛ باید تولید، ضایعات، حمل، سلامت و هزینه‌های جانبی را هم دید.</p>
          <div class="field"><label for="ra-yes-reason">مهم‌ترین دلیل رضایت شما چیست؟</label>
            <select class="input" id="ra-yes-reason">${SATISFACTION_REASONS.map(x => `<option value="${x.id}" ${st.evidence.reason === x.id ? 'selected' : ''}>${x.label}</option>`).join('')}</select></div>
          <div class="fields">
            <div class="field"><label for="ra-period">چند روز را مقایسه کرده‌اید؟</label><input class="input" id="ra-period" inputmode="numeric" value="${esc(st.evidence.period || '')}" placeholder="مثلاً ۳۰" /></div>
            <div class="field"><label for="ra-before">عملکرد قبل از جیره</label><input class="input" id="ra-before" inputmode="decimal" value="${esc(st.evidence.before || '')}" placeholder="${sp.unitOut}" /></div>
            <div class="field"><label for="ra-after">عملکرد فعلی</label><input class="input" id="ra-after" inputmode="decimal" value="${esc(st.evidence.after || '')}" placeholder="${sp.unitOut}" /></div>
            <div class="field"><label for="ra-waste">هزینه ضایعات و حمل (تومان/رأس/روز)</label><input class="input" id="ra-waste" inputmode="decimal" value="${esc(st.evidence.waste || '')}" placeholder="اگر می‌دانید" /></div>
            <div class="field"><label for="ra-health-cost">هزینه درمان و افت سلامت (تومان/رأس/روز)</label><input class="input" id="ra-health-cost" inputmode="decimal" value="${esc(st.evidence.healthCost || '')}" placeholder="اگر می‌دانید" /></div>
          </div>
          <div class="field"><label for="ra-yes-notes">چه چیزی را مشاهده یا اندازه‌گیری کرده‌اید؟</label><textarea class="input" id="ra-yes-notes" rows="3" placeholder="مثلاً شیر، چربی شیر، وزن‌کشی، باقیمانده خوراک، مدفوع یا نشخوار">${esc(st.evidence.notes || '')}</textarea></div>
          <button type="button" class="btn btn--tag" id="ra-yes-evaluate">دلیل رضایت من را بررسی کن</button>
          <div id="ra-yes-feedback" class="decision-feedback" aria-live="polite"></div>
          <p class="muted">این بررسی در نسخه فعلی قاعده‌محور است؛ متن آزاد شما هنوز با هوش مصنوعی تحلیل نمی‌شود. نتیجه هم تشخیص بیماری یا تأیید قطعی جیره نیست.</p>
        </div>`;
      const fields = ['reason','period','before','after','waste','healthCost','notes'];
      const ids = ['ra-yes-reason','ra-period','ra-before','ra-after','ra-waste','ra-health-cost','ra-yes-notes'];
      ids.forEach((id, i) => { const el = $('#'+id); el.addEventListener(i === 0 ? 'change' : 'input', e => { st.evidence[fields[i]] = e.target.value; }); });
      $('#ra-yes-evaluate').addEventListener('click', () => {
        const result = evaluateSatisfaction({ ...st.evidence, reason: st.evidence.reason || $('#ra-yes-reason').value, performance: st.perf, feedCost: totals().cost, margin: totals().margin, species: st.sp });
        $('#ra-yes-feedback').innerHTML = `<strong>${result.heading}</strong><ul>${result.questions.map(q => `<li>${q}</li>`).join('')}</ul><p>${result.summary}</p>`;
        track('satisfaction_evidence_reviewed', { market: 'ir', species: st.sp, status: result.status });
      });
      return;
    }
    const cards = LEARNING_CARDS.filter((c) => c.species.includes(st.sp)).map((c) => `
      <article class="learning-card">
        <span class="learning-brand">دکتر سید فرهاد ریاضی | FarmProfit</span>
        <h4>${c.title}</h4><p>${c.body}</p><p class="learning-question"><strong>سؤال متخصص:</strong> ${c.question}</p>
        <a href="${c.url}" target="_blank" rel="noopener noreferrer">${c.source}</a>
      </article>`).join('');
    box.innerHTML = `
      <div class="next">
        <fieldset><legend>چه چیزی راضی‌تان نمی‌کند؟ (چند مورد را انتخاب کنید)</legend>
          ${sp.unsatisfied.map((x, i) => `<label class="chk"><input type="checkbox" data-r="${i}" ${st.reasons.has(i) ? 'checked' : ''} /> ${x}</label>`).join('')}
        </fieldset>
        <div class="decision-dialogue">
          <h4>قبل از تغییر جیره، این چند نکته را بررسی کنیم</h4>
          <p>ارزان‌تر بودن یک نهاده یا بالاتر بودن پروتئین خام به‌تنهایی برای انتخاب کافی نیست. نوع فیبر، قابلیت هضم، ماده خشک، نشاسته، مواد معدنی، کیفیت و قیمت تحویل‌شده هم مهم‌اند.</p>
          <div class="learning-grid">${cards}</div>
        </div>
        <div class="request">
          <h4>اطلاعات لازم برای پیشنهاد جیره جایگزین</h4>
          <p class="muted">این اطلاعات کمک می‌کند نسخه علمی با مرحله تولید و شرایط واقعی گله اشتباه نشود. بیماری و انگل باید با تشخیص دامپزشک ثبت شوند؛ سیستم نباید صرف وجود یک علامت، نسخه درمانی یا تغییر خودکار جیره بدهد.</p>
          <details class="profile-details" open>
            <summary>مشخصات دام و گله</summary>
            <div class="fields">
              <div class="field"><label for="ra-breed">نژاد یا دورگ</label><input class="input" id="ra-breed" value="${esc(st.profile.breed || '')}" placeholder="مثلاً هلشتاین، سیمنتال، بومی" /></div>
              <div class="field"><label for="ra-weight">میانگین وزن زنده (کیلوگرم)</label><input class="input" id="ra-weight" inputmode="decimal" value="${esc(st.profile.weight || '')}" /></div>
              <div class="field"><label for="ra-stage">مرحله تولید / روز شیردهی یا پرواربندی</label><input class="input" id="ra-stage" value="${esc(st.profile.stage || '')}" placeholder="مثلاً ۸۰ روز شیردهی" /></div>
              <div class="field"><label for="ra-bcs">نمره وضعیت بدنی (در صورت اندازه‌گیری)</label><input class="input" id="ra-bcs" value="${esc(st.profile.bcs || '')}" /></div>
              <div class="field"><label for="ra-health">بیماری‌ها یا سوابق درمان با تشخیص دامپزشک</label><textarea class="input" id="ra-health" rows="2">${esc(st.profile.health || '')}</textarea></div>
              <div class="field"><label for="ra-parasites">وضعیت انگل و نتیجه آزمایش / درمان</label><textarea class="input" id="ra-parasites" rows="2">${esc(st.profile.parasites || '')}</textarea></div>
              <div class="field"><label for="ra-analysis">آنالیز علوفه و خوراک (در صورت وجود)</label><textarea class="input" id="ra-analysis" rows="2">${esc(st.profile.analysis || '')}</textarea></div>
            </div>
          </details>
          <label for="ra-notes">توضیح بیشتر: خوراک در دسترس، قیمت تحویل مزرعه، مشکل اصلی و هدف اقتصادی</label>
          <textarea class="input" id="ra-notes" rows="3">${esc(st.notes || '')}</textarea>
          <button type="button" class="btn btn--tag" id="ra-prepare">آماده‌کردن درخواست بازبینی علمی جیره</button>
          <div id="ra-req" hidden>
            <textarea class="input" id="ra-req-text" rows="14" readonly dir="rtl"></textarea>
            <div class="satisfy-btns"><button type="button" class="btn btn--ghost" id="ra-copy">کپی درخواست</button>
              <a class="btn btn--ghost" id="ra-send-ig" href="${INSTAGRAM}" target="_blank" rel="noopener noreferrer">ارسال در اینستاگرام</a></div>
            <p class="muted" id="ra-copied" aria-live="polite"></p>
          </div>
        </div>
        <div class="decision-feedback"><strong>مرز علمی نسخه فعلی:</strong> این نسخه دسته‌بندی نهاده‌ها، پرسش‌های ارزیابی و آموزش خطرات را ارائه می‌کند؛ هنوز الگوریتم معتبرِ بهینه‌سازی مقدار هر نهاده برای همه نژادها، بیماری‌ها و مراحل تولید را اجرا نمی‌کند. برای پیشنهاد عددی باید نیاز دام، آنالیز واقعی خوراک و قیود مدل معتبر به‌صورت کامل اعتبارسنجی شوند. تا آن زمان عدد جیره حدس نمی‌زنیم.</div>
      </div>`;
    box.querySelectorAll('[data-r]').forEach((c) => c.addEventListener('change', () => {
      const k = Number(c.dataset.r); c.checked ? st.reasons.add(k) : st.reasons.delete(k);
    }));
    ['breed','weight','stage','bcs','health','parasites','analysis'].forEach(k => $('#ra-'+k).addEventListener('input', e => { st.profile[k] = e.target.value; }));
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
      `نژاد: ${st.profile.breed || 'ثبت نشده'}`,
      `وزن زنده: ${st.profile.weight || 'ثبت نشده'} کیلوگرم`,
      `مرحله تولید: ${st.profile.stage || 'ثبت نشده'}`,
      `نمره وضعیت بدنی: ${st.profile.bcs || 'ثبت نشده'}`,
      `سوابق بیماری: ${st.profile.health || 'ثبت نشده'}`,
      `وضعیت انگل: ${st.profile.parasites || 'ثبت نشده'}`,
      `آنالیز خوراک: ${st.profile.analysis || 'ثبت نشده'}`,
      `دلیل نارضایتی: ${[...st.reasons].map((i) => sp.unsatisfied[i]).join('، ') || 'مشخص نشده'}`,
      `دوره مقایسه رضایت: ${st.evidence.period || 'ثبت نشده'} روز`,
      `عملکرد قبل/بعد: ${st.evidence.before || 'ثبت نشده'} / ${st.evidence.after || 'ثبت نشده'}`,
      `هزینه ضایعات و حمل: ${st.evidence.waste || 'ثبت نشده'}`,
      `هزینه درمان و افت سلامت: ${st.evidence.healthCost || 'ثبت نشده'}`,
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
    ? `فهرست نهاده‌ها از کتابخانه خصوصی NASEM (${fa(FEEDS.length)} مورد) است و فقط در محیط توسعه نگه داشته شده است.`
    : `فهرست عمومی شامل ${fa(FEEDS.length)} گزینه در چند گروه علوفه، انرژی، پروتئین، فرآورده جانبی، چربی و مواد معدنی است. ترکیب غذایی همه گزینه‌ها باید با آنالیز محلی تکمیل شود.`;
  if (!HAS_NASEM) ['#ra-dm', '#ra-cp', '#ra-ndf'].forEach((q) => { const d = $(q); (d.closest('div') || d).hidden = true; });
  $('#ra-species').addEventListener('change', (e) => {
    st.sp = e.target.value; st.sat = null; st.reasons.clear(); st.profile = {}; st.evidence = {}; st.notes = '';
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
