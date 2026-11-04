// International markets (phase 1: neighbours of Iran). Currency codes are ISO 4217.
//
// PRICES: no reference feed prices are stored here on purpose. On 2026-11-04 we looked for dated,
// sourced feed-ingredient prices in these four countries and found only undated seller adverts
// with mixed units. Under the site principle ("no invented numbers") the farmer enters his own
// local prices, which is what he needs for his own decision anyway. When a dated, sourced price
// list is found for a market, add rows under `prices` with source, date and unit, like js/data.js.

export const MARKETS = [
  { id: 'iq', name: 'Iraq', currency: 'IQD', prices: [] },
  { id: 'tr', name: 'Türkiye', currency: 'TRY', prices: [] },
  { id: 'af', name: 'Afghanistan', currency: 'AFN', prices: [] },
  { id: 'pk', name: 'Pakistan', currency: 'PKR', prices: [] },
];

// Common feed names only (no nutrient values). Used as suggestions; the farmer can type any feed.
export const COMMON_FEEDS = [
  'Barley', 'Maize (corn)', 'Wheat bran', 'Soybean meal', 'Cottonseed cake', 'Sunflower meal',
  'Alfalfa hay', 'Wheat straw', 'Corn silage', 'Molasses', 'Rice bran', 'Beet pulp',
];

// One sourced reference, shown only for dairy and only as context, never as advice.
export const REFERENCE = {
  label: 'Penn State Extension, "Managing Income Over Feed Costs"',
  url: 'https://extension.psu.edu/managing-income-over-feed-costs',
  low: 30,
  high: 70,
};

// Where the farmer sends his request. Fill the ones you use; empty ones are not shown.
// Add your LinkedIn profile URL, a WhatsApp link (https://wa.me/<number>) and an email here.
export const CONTACT = {
  instagram: 'https://instagram.com/dr_seyedfarhadriazi',
  linkedin: '',
  whatsapp: '',
  email: '',
};
