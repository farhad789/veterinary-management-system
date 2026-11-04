# FarmProfit inside this app

The FarmProfit site (Persian dairy feed-cost pages) lives in `public/farmprofit/` and is served as plain static files at:

    /farmprofit/index.html
    /farmprofit/intl.html      (English page for foreign markets: Iraq, Türkiye, Afghanistan, Pakistan)

Always link to `/farmprofit/index.html` (not `/farmprofit/`): the Vite dev server sends the folder URL to the React app.

- Edit data (prices, dates, sources) only in `public/farmprofit/js/data.js`.
- The development source of truth is the repository farhad789/farmprofit; changes are copied here.
- `js/markets.js` holds the international markets and the contact links (`CONTACT`). Add LinkedIn, WhatsApp or email there.
- Do not add a `vite.config.js` for FarmProfit: this project's config is `vite.config.ts` and a `.js` file would replace it. The static pages in `public/` need no Vite config.
- Do not run these files through the React build. They are not part of `src/`.
