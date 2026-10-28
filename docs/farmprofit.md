# FarmProfit inside this app

The FarmProfit site (Persian dairy feed-cost pages) lives in `public/farmprofit/` and is served as plain static files at:

    /farmprofit/index.html

Always link to `/farmprofit/index.html` (not `/farmprofit/`): the Vite dev server sends the folder URL to the React app.

- Edit data (prices, dates, sources) only in `public/farmprofit/js/data.js`.
- The development source of truth is the repository farhad789/farmprofit; changes are copied here.
- Do not run these files through the React build. They are not part of `src/`.
