/* Public, original feed-choice catalogue. It contains names/categories only; no copied NASEM composition table. */
export const FEED_CATEGORIES = {
  forage: 'علوفه و منابع فیبر', energy: 'منابع انرژی و غلات', protein: 'منابع پروتئین',
  byproduct: 'فرآورده‌های جانبی و فیبر قابل‌هضم', fat: 'منابع چربی',
  mineral: 'مواد معدنی و مکمل‌های ویتامینی', additive: 'افزودنی‌ها و کمک‌خوراک‌ها', special: 'مواد پرخطر؛ فقط با نظر متخصص'
};
const item = (id,n,c,note='') => ({id,n,c,t:'',dm:null,cp:null,ndf:null,note});
export const FEEDS = [
  item('alfalfa','یونجه خشک','forage'), item('grass_hay','علف خشک / گراس','forage'), item('clover_hay','شبدر خشک','forage'),
  item('corn_silage','سیلاژ ذرت','forage'), item('sorghum_silage','سیلاژ سورگوم','forage'), item('barley_silage','سیلاژ جو','forage'),
  item('oat_hay','یولاف خشک','forage'), item('wheat_straw','کاه گندم','forage'), item('barley_straw','کاه جو','forage'),
  item('pasture','مرتع / علوفه تازه','forage'), item('vetch_hay','ماشک خشک','forage'),
  item('corn','ذرت دانه‌ای','energy'), item('barley','جو دانه‌ای','energy'), item('wheat','گندم دانه‌ای','energy'),
  item('oats','یولاف دانه‌ای','energy'), item('sorghum','سورگوم دانه‌ای','energy'), item('molasses','ملاس','energy'),
  item('soymeal','کنجاله سویا','protein'), item('canola_meal','کنجاله کلزا','protein'), item('cottonseed_meal','کنجاله پنبه‌دانه','protein'),
  item('sunflower_meal','کنجاله آفتابگردان','protein'), item('peas','نخود / لپه علوفه‌ای','protein'), item('ddgs','دی‌دی‌جی‌اس (محصول تقطیر غلات)','protein'),
  item('brewers_grain','تفاله مرطوب یا خشک آبجوسازی','protein'), item('bran','سبوس گندم','byproduct'),
  item('rice_bran','سبوس برنج','byproduct'), item('beet_pulp','تفاله چغندر','byproduct'), item('citrus_pulp','تفاله مرکبات','byproduct'),
  item('soy_hulls','پوسته سویا','byproduct'), item('cottonseed_hulls','پوسته پنبه‌دانه','byproduct'), item('corn_gluten_feed','خوراک گلوتن ذرت','byproduct'),
  item('wheat_middlings','آردک / فرآورده میانی گندم','byproduct'), item('tomato_pomace','تفاله گوجه‌فرنگی','byproduct'),
  item('apple_pomace','تفاله سیب','byproduct'), item('corn_stover','ساقه و بقایای ذرت','byproduct'),
  item('whole_cottonseed','پنبه‌دانه کامل','fat'), item('vegetable_oil','روغن گیاهی خوراکی','fat'), item('flaxseed','بذر کتان','fat'),
  item('salt','نمک خوراکی','mineral'), item('limestone','سنگ آهک خوراکی / کربنات کلسیم','mineral'),
  item('dicalcium_phosphate','فسفات دی‌کلسیم','mineral'), item('magnesium_oxide','اکسید منیزیم','mineral'),
  item('sodium_bicarbonate','بی‌کربنات سدیم','mineral'), item('mineral_premix','پریمیکس مواد معدنی','mineral'),
  item('vitamin_premix','پریمیکس ویتامینی','mineral'), item('yeast_culture','کشت مخمر','additive'),
  item('mycotoxin_binder','جاذب مایکوتوکسین','additive'), item('feed_enzyme','آنزیم خوراکی','additive'),
  item('urea','اوره خوراکی','special','اوره منبع پروتئین واقعی نیست؛ مصرف یا اختلاط نادرست می‌تواند مسمومیت ایجاد کند. این گزینه نباید بدون متخصص استفاده شود.')
];
export const PRICE_MAP = { alfalfa:'alfalfa', barley:'barley', corn:'corn', soymeal:'soymeal', bran:'bran' };
