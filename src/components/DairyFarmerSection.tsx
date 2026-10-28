import type { Lang } from '@/types';
import { Milk, Layers, BookOpen, ChevronLeft, Info } from 'lucide-react';

// Farmer-facing teaser for the upcoming dairy nutrition & feed-cost module.
// Persian only (shown when lang === 'fa'). No results or numbers are claimed.
const INSTAGRAM_URL = 'https://instagram.com/dr_seyedfarhadriazi';

export function DairyFarmerSection({ lang }: { lang: Lang }) {
  if (lang !== 'fa') return null;

  const points = [
    {
      icon: Milk,
      title: 'عدد روشن برای هر کیلو شیر',
      text: 'با وزن گاوها، مقدار شیر و خوراک واقعی مزرعه‌ی شما، هزینه‌ی خوراک به‌ازای هر کیلو شیر و درآمد بعد از کسر خوراک محاسبه می‌شود.',
      color: 'bg-teal-500/20 text-teal-400',
    },
    {
      icon: Layers,
      title: 'هر مرحله جداگانه',
      text: 'گاو شیرده، گاو خشک و گاو نزدیک به زایمان نیازهای متفاوتی دارند. هرکدام جدا محاسبه می‌شوند، نه با یک نسخه برای همه.',
      color: 'bg-blue-500/20 text-blue-400',
    },
    {
      icon: BookOpen,
      title: 'منبع هر عدد',
      text: 'محاسبات بر پایه‌ی منابع علمی معتبر مانند NASEM 2021 است و برای هر عدد، منبع و محدودیتش گفته می‌شود.',
      color: 'bg-amber-500/20 text-amber-400',
    },
  ];

  return (
    <section dir="rtl" className="max-w-5xl mx-auto px-4 py-12">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 lg:p-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-500/20 rounded-full text-sm text-teal-300 mb-4">
          به‌زودی · ویژه‌ی گاوداران شیری
        </div>
        <h3 className="text-xl lg:text-2xl font-bold text-white mb-3 leading-relaxed">
          شیر گاوهات رو می‌بینی؛ هزینه‌ی خوراک هر کیلو شیر رو هم می‌دونی؟
        </h3>
        <p className="text-slate-400 text-sm lg:text-base leading-relaxed mb-6 max-w-3xl">
          بخش تغذیه و اقتصاد گاو شیری در حال ساخت است. هدفش این است که هزینه‌ی خوراک هر کیلو شیر را
          با داده‌ی خود مزرعه‌ی شما حساب کند و وقتی قیمت خوراک یا شیر عوض می‌شود، دوباره حساب کند.
        </p>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {points.map((p, i) => {
            const Icon = p.icon;
            return (
              <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className={`w-11 h-11 ${p.color} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-white text-sm font-bold mb-1">{p.title}</p>
                <p className="text-slate-400 text-sm leading-relaxed">{p.text}</p>
              </div>
            );
          })}
        </div>

        <div className="flex items-start gap-3 text-slate-400 text-sm leading-relaxed mb-6">
          <Info className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
          <p>
            این سامانه جای دامپزشک و آنالیز آزمایشگاهی خوراک را نمی‌گیرد. هنوز در مرحله‌ی ساخت است و
            نظر گاوداران در شکل‌گیری آن نقش دارد.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href="/farmprofit/index.html"
            className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-900 px-6 py-3 rounded-xl font-bold transition"
          >
            قیمت‌های امروز و ماشین‌حساب را ببینید
            <ChevronLeft className="w-5 h-5" />
          </a>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-6 py-3 rounded-xl font-medium transition"
          >
            می‌خواهید زودتر خبردار شوید؟ در اینستاگرام پیام بدهید
            <ChevronLeft className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
