import{t as u}from"./request-Cv2gUkVI.js";import{b as w,c as $,d as T,p as M,P as x,m as _,S as q}from"./store-DRhW6nc7.js";const o=(t,s=document)=>s.querySelector(t),b=t=>new Intl.NumberFormat("fa-IR").format(t),l=t=>String(t).replace(/[&<>"]/g,s=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[s]),v=5;let f="all",p={};const g=o("#mode-note");w()||(g.hidden=!1,g.textContent="حالت آزمایشی: پاسخ‌های شما فقط در همین مرورگر می‌ماند و دامداران دیگر آن را نمی‌بینند. (مدیر سایت باید بک‌اند را وصل کند.)");function k(t){const s=p[t];return s?s.answered<v?'<p class="pstat muted">هنوز پاسخ کافی برای نمایش آمار جمع نشده.</p>':`<p class="pstat"><strong>${b(s.encountered)}</strong> از <strong>${b(s.answered)}</strong> دامدار گفته‌اند این مشکل در فارمشان پیش آمده.</p>`:""}function E(t){const s=_()[t.id];return`
  <article class="pcard" id="p-${t.id}" data-id="${t.id}">
    <div class="pcard-top">
      <span class="tag">${q[t.species]}</span>
      <h3>${l(t.title)}</h3>
    </div>
    <p>${l(t.what)}</p>
    <p class="psigns-h"><strong>در آخور و گله چه می‌بینید:</strong></p>
    <ul class="psigns">${t.signs.map(n=>`<li>${l(n)}</li>`).join("")}</ul>
    <div class="pstat-slot">${k(t.id)}</div>
    <div class="pflow" data-flow>${s?L(t.id,s):I()}</div>
  </article>`}const I=()=>`
  <p class="pq"><strong>این مشکل در فارم شما پیش آمده؟</strong></p>
  <div class="satisfy-btns">
    <button class="btn btn--tag" data-act="yes">بله، پیش آمده</button>
    <button class="btn btn--ghost" data-act="no">نه، پیش نیامده</button>
  </div>`;function L(t,s){return s.encountered?s.worked===!0?'<p class="pdone">راه‌حل شما ثبت شد. ممنون که تجربه‌تان را با دامداران دیگر شریک شدید.</p>':y(t):'<p class="pdone">شما گفته‌اید این مشکل در فارمتان پیش نیامده. ممنون.</p>'}const y=t=>`
  <div class="pcta">
    <p><strong>راه‌حلی که جواب بدهد پیدا نکرده‌اید؟</strong> برای این مشکل مراحل عملی، عددها و منبع‌های معتبر آماده است. با اشتراک، همه‌ی پاسخ‌های منبع‌دار را می‌بینید.</p>
    <a class="btn btn--tag" href="subscribe.html?problem=${encodeURIComponent(t)}" data-track="goto_subscribe">دیدن طرح‌های اشتراک</a>
  </div>`;function H(){const t=x.filter(a=>f==="all"||a.species===f),s=a=>{const e=p[a.id];return e&&e.answered>=v?e.encountered/e.answered:-1},n=[...t].sort((a,e)=>s(e)-s(a));o("#plist").innerHTML=n.map(E).join(""),o("#count").textContent=`${b(t.length)} مشکل`}o("#sp-tabs").addEventListener("click",t=>{const s=t.target.closest("[data-sp]");s&&(f=s.dataset.sp,document.querySelectorAll("#sp-tabs .tab").forEach(n=>n.setAttribute("aria-selected",String(n===s))),H())});o("#plist").addEventListener("click",async t=>{const s=t.target.closest("[data-track]");if(s){u(s.dataset.track,{problem:s.closest(".pcard")?.dataset.id});return}const n=t.target.closest("[data-act]");if(!n)return;const a=n.closest(".pcard"),e=a.dataset.id,r=o("[data-flow]",a),c=n.dataset.act;if(c==="no"){n.disabled=!0;try{await $({problemId:e,encountered:!1})}catch{}u("problem_not_met",{problem:e}),r.innerHTML=L(e,{encountered:!1}),S(e,!1);return}if(c==="yes"){u("problem_met",{problem:e});const i=await T(e);r.innerHTML=`
      ${i.length?`<div class="pothers"><h4>دامداران دیگر چه کرده‌اند؟</h4>
        <p class="muted">تجربه‌ی دامدارها پس از بررسی دامپزشک سایت؛ نسخه‌ی درمان نیست.</p>
        <ul>${i.map(d=>`<li>${l(d.solution)}</li>`).join("")}</ul></div>`:""}
      <div class="field">
        <label for="sol-${e}">چه راه‌حلی به کار بردید؟</label>
        <textarea class="input" id="sol-${e}" maxlength="800" rows="4" placeholder="مثلاً: چه چیزی را در جیره یا مدیریت عوض کردید و چند روز طول کشید"></textarea>
        <small class="muted">نام، شماره و نام فارم ننویسید. حداکثر ۸۰۰ نویسه.</small>
      </div>
      <label class="chk"><input type="checkbox" data-none /> هنوز راه‌حلی به کار نبرده‌ام</label>
      <div class="satisfy-btns"><button class="btn" data-act="next">ادامه</button></div>
      <p class="perr" role="alert" hidden></p>`,o(`#sol-${e}`,r).focus();return}if(c==="next"){const i=o("[data-none]",r).checked,d=o(`#sol-${e}`,r).value.trim(),m=o(".perr",r);if(i){await h(a,e,{solution:null,worked:null});return}if(d.length<5){m.hidden=!1,m.textContent="راه‌حلتان را کمی توضیح دهید، یا گزینه‌ی «هنوز راه‌حلی به کار نبرده‌ام» را بزنید.";return}r.innerHTML=`
      <p class="pq"><strong>از این راه‌حل جواب گرفتید؟</strong></p>
      <blockquote class="pquote">${l(d)}</blockquote>
      <div class="satisfy-btns">
        <button class="btn btn--tag" data-act="worked" data-sol="${l(d)}">بله، جواب گرفتم</button>
        <button class="btn btn--ghost" data-act="failed" data-sol="${l(d)}">نه، راضی نیستم</button>
      </div>`;return}if(c==="worked"||c==="failed"){const i=c==="worked";await h(a,e,{solution:n.dataset.sol,worked:i})}});async function h(t,s,{solution:n,worked:a}){const e=o("[data-flow]",t);e.innerHTML='<p class="muted">در حال ثبت…</p>';let r=!1;try{({shared:r}=await $({problemId:s,encountered:!0,solution:n,worked:a}))}catch{e.innerHTML='<p class="perr">ثبت انجام نشد. اینترنت را بررسی و دوباره تلاش کنید.</p>';return}S(s,!0),a===!0?(u("solution_worked",{problem:s}),e.innerHTML=`<p class="pdone"><strong>ثبت شد.</strong> ${r?"پس از بررسی دامپزشک سایت، راه‌حل شما برای دامداران دیگر نمایش داده می‌شود.":"در حالت آزمایشی فقط در همین مرورگر ذخیره شد."}</p>`):(u(a===!1?"solution_failed":"solution_none",{problem:s}),e.innerHTML=y(s))}function S(t,s){if(!w())return;const n=p[t]||{answered:0,encountered:0};p[t]={answered:n.answered+1,encountered:n.encountered+(s?1:0)};const a=o(`#p-${t} .pstat-slot`);a&&(a.innerHTML=k(t))}o("#plist").innerHTML='<p class="muted">در حال بارگذاری…</p>';Promise.race([M(),new Promise(t=>setTimeout(()=>t({}),1500))]).then(t=>{p=t,H()});
