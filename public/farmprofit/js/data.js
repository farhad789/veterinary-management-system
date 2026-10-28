// FarmProfit data. Every price here was read from the source page on the date below.
// Values are stored exactly as the source prints them. Do not edit numbers by hand
// unless you have re-read the source page; update META.dateISO and META.dateFa at the same time.

export const META = {
  source: 'پرتال قیمت نهاده‌های دام و طیور (ITPNews)',
  sourceUrl: 'https://price.itpnews.com/',
  dateFa: '۶ آبان ۱۴۰۵',
  dateISO: '2026-10-28',
  // The source page does not print a unit. See UNIT_NOTE below.
  unitSource: 'ریال بر کیلوگرم',
};

export const UNIT_NOTE =
  'صفحه‌ی منبع واحد قیمت را ننوشته است. قیمت‌های همان بندرها و محصول‌ها را با یک سایت مستقل نهاده‌فروشی (دان‌مارکت، به‌روزرسانی ۲۷ مهر ۱۴۰۵) مقایسه کردیم: ذرت برزیلی بندر امام، یونجه و جوی روسیه بندر امیرآباد پس از تقسیم بر ۱۰ به قیمت‌های آن سایت نزدیک‌اند (جو کمتر از یک درصد اختلاف دارد، یونجه در بازه‌ی قیمت‌های استانی منبع می‌افتد). پس واحد منبع را ریال بر کیلوگرم گرفته‌ایم و به تومان بر کیلوگرم تبدیل می‌کنیم. این برداشت ما است، نه نوشته‌ی منبع.';

export const PROVINCES = [
  ['east-azerbaijan', 'آذربایجان شرقی'], ['west-azerbaijan', 'آذربایجان غربی'], ['ardabil', 'اردبیل'],
  ['isfahan', 'اصفهان'], ['alborz', 'البرز'], ['ilam', 'ایلام'], ['bushehr', 'بوشهر'], ['tehran', 'تهران'],
  ['chaharmahal', 'چهارمحال و بختیاری'], ['south-khorasan', 'خراسان جنوبی'], ['razavi-khorasan', 'خراسان رضوی'],
  ['north-khorasan', 'خراسان شمالی'], ['khuzestan', 'خوزستان'], ['zanjan', 'زنجان'], ['semnan', 'سمنان'],
  ['sistan', 'سیستان و بلوچستان'], ['fars', 'فارس'], ['qazvin', 'قزوین'], ['qom', 'قم'], ['kurdistan', 'کردستان'],
  ['kerman', 'کرمان'], ['kermanshah', 'کرمانشاه'], ['kohgiluyeh', 'کهگیلویه و بویراحمد'], ['golestan', 'گلستان'],
  ['gilan', 'گیلان'], ['lorestan', 'لرستان'], ['mazandaran', 'مازندران'], ['markazi', 'مرکزی'],
  ['hormozgan', 'هرمزگان'], ['hamedan', 'همدان'], ['yazd', 'یزد'],
].map(([id, name]) => ({ id, name }));

export const NEIGHBORS_OF_MARKAZI = ['tehran', 'qom', 'isfahan', 'lorestan', 'hamedan', 'qazvin'];

export const PRODUCTS = [
  { id: 'alfalfa', name: 'یونجه', page: 'https://price.itpnews.com/dashboard/market/96/chart' },
  { id: 'barley', name: 'جو', page: 'https://price.itpnews.com/dashboard/market/95/chart' },
  { id: 'corn', name: 'ذرت', page: 'https://price.itpnews.com/dashboard/market/13/chart' },
  { id: 'soymeal', name: 'کنجاله سویا', page: 'https://price.itpnews.com/dashboard/market/1/chart' },
  { id: 'bran', name: 'سبوس گندم', page: 'https://price.itpnews.com/dashboard/market/99/chart' },
];

// min / max in the source's own unit. loc = where the source says the price applies.
// type 'port' = a port market (imported goods); province is the province the port lies in.
export const ROWS = [
  // یونجه
  { id: 'alf-hamedan', product: 'alfalfa', variant: 'داخلی', loc: 'همدان', type: 'province', province: 'hamedan', min: 400000, max: 450000 },
  { id: 'alf-semnan', product: 'alfalfa', variant: 'داخلی', loc: 'سمنان', type: 'province', province: 'semnan', min: 390000, max: 400000 },
  { id: 'alf-khuzestan', product: 'alfalfa', variant: 'داخلی', loc: 'خوزستان', type: 'province', province: 'khuzestan', min: 360000, max: 380000 },
  { id: 'alf-qom', product: 'alfalfa', variant: 'داخلی', loc: 'قم', type: 'province', province: 'qom', min: 440000, max: 460000 },
  { id: 'alf-fars', product: 'alfalfa', variant: 'داخلی', loc: 'فارس', type: 'province', province: 'fars', min: 350000, max: 360000 },
  { id: 'alf-kermanshah', product: 'alfalfa', variant: 'داخلی', loc: 'کرمانشاه', type: 'province', province: 'kermanshah', min: 400000, max: 420000 },
  // جو
  { id: 'barley-hamedan', product: 'barley', variant: 'داخلی', loc: 'همدان', type: 'province', province: 'hamedan', min: 630000, max: 640000 },
  { id: 'barley-zanjan', product: 'barley', variant: 'داخلی', loc: 'زنجان', type: 'province', province: 'zanjan', min: 610000, max: 620000 },
  { id: 'barley-semnan', product: 'barley', variant: 'داخلی', loc: 'سمنان', type: 'province', province: 'semnan', min: 540000, max: 550000 },
  { id: 'barley-fars', product: 'barley', variant: 'داخلی', loc: 'فارس', type: 'province', province: 'fars', min: 550000, max: 600000 },
  { id: 'barley-amirabad-kz', product: 'barley', variant: 'قزاق', loc: 'بندر امیرآباد', type: 'port', province: 'mazandaran', min: 480000, max: 485000 },
  { id: 'barley-amirabad-ru', product: 'barley', variant: 'روسیه', loc: 'بندر امیرآباد', type: 'port', province: 'mazandaran', min: 475000, max: 480000 },
  // ذرت (در جدول منبع فقط بندرها آمده‌اند)
  { id: 'corn-imam-br', product: 'corn', variant: 'برزیلی', loc: 'بندر امام', type: 'port', province: 'khuzestan', min: 650000, max: 680000 },
  { id: 'corn-imam-ua', product: 'corn', variant: 'اوکراین', loc: 'بندر امام', type: 'port', province: 'khuzestan', min: 595000, max: 615000 },
  { id: 'corn-anzali-ru', product: 'corn', variant: 'روسیه', loc: 'بندر انزلی', type: 'port', province: 'gilan', min: 595000, max: 615000 },
  { id: 'corn-nowshahr-ru', product: 'corn', variant: 'روسیه', loc: 'بندر نوشهر', type: 'port', province: 'mazandaran', min: 590000, max: 605000 },
  { id: 'corn-amirabad-ru', product: 'corn', variant: 'روسیه', loc: 'بندر امیرآباد', type: 'port', province: 'mazandaran', min: 600000, max: 615000 },
  // کنجاله سویا (نام‌ها مطابق جدول منبع)
  { id: 'soy-kermanshah-kolhor', product: 'soymeal', variant: 'کلهر', loc: 'کرمانشاه', type: 'province', province: 'kermanshah', min: 800000, max: 805000 },
  { id: 'soy-kermanshah-fullfat', product: 'soymeal', variant: 'فول‌فت', loc: 'کرمانشاه', type: 'province', province: 'kermanshah', min: 1300000, max: 1350000 },
  { id: 'soy-imam-kolhor', product: 'soymeal', variant: 'کلهر', loc: 'بندر امام', type: 'port', province: 'khuzestan', min: 800000, max: 805000 },
  { id: 'soy-imam-br', product: 'soymeal', variant: 'پلت برزیلی', loc: 'بندر امام', type: 'port', province: 'khuzestan', min: 880000, max: 905000 },
  { id: 'soy-imam-ar', product: 'soymeal', variant: 'پلت آرژانتینی', loc: 'بندر امام', type: 'port', province: 'khuzestan', min: 925000, max: 935000 },
  { id: 'soy-chabahar-br', product: 'soymeal', variant: 'پلت برزیلی', loc: 'بندر چابهار', type: 'port', province: 'sistan', min: 825000, max: 830000 },
  { id: 'soy-semnan-nabdaneh', product: 'soymeal', variant: 'نابدانه', loc: 'سمنان', type: 'province', province: 'semnan', min: 800000, max: 805000 },
  // سبوس گندم
  { id: 'bran-zanjan', product: 'bran', variant: 'داخلی', loc: 'زنجان', type: 'province', province: 'zanjan', min: 360000, max: 380000 },
  { id: 'bran-semnan', product: 'bran', variant: 'داخلی', loc: 'سمنان', type: 'province', province: 'semnan', min: 360000, max: 370000 },
];

// Reference rows used to pre-fill the calculator. These are NOT Markazi prices.
export const CALC_REFERENCE = {
  corn: 'corn-imam-br',
  barley: 'barley-hamedan',
  soymeal: 'soy-imam-kolhor',
  alfalfa: 'alf-hamedan',
  bran: 'bran-zanjan',
};

export const NASEM = {
  title: 'Nutrient Requirements of Dairy Cattle: Eighth Revised Edition',
  publisher: 'National Academies Press, Washington, DC',
  year: 2021,
  doi: '10.17226/25806',
  links: [
    { label: 'صفحه‌ی کتاب در National Academies', url: 'https://www.nationalacademies.org/publications/25806' },
    { label: 'متن در NCBI Bookshelf', url: 'https://www.ncbi.nlm.nih.gov/books/NBK600603/' },
  ],
};

export const MODULES = [
  'گروه‌های حیوانی و ورودی‌ها',
  'مصرف ماده خشک',
  'انرژی و پروتئین',
  'الیاف و نشاسته',
  'مواد معدنی و ویتامین‌ها',
  'کیفیت خوراک',
  'اقتصاد جیره',
  'شرایط استان مرکزی',
];

export const INSTAGRAM = 'https://instagram.com/dr_seyedfarhadriazi';
