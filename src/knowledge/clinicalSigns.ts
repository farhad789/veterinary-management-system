import type { ClinicalSignDef } from '@/types';

export const clinicalSigns: ClinicalSignDef[] = [
  // General
  { id: 'fever', name: 'fever', label: 'Fever', labelFa: 'تب', category: 'general', categoryFa: 'عمومی', type: 'boolean' },
  { id: 'lethargy', name: 'lethargy', label: 'Lethargy', labelFa: 'بی‌حالی', category: 'general', categoryFa: 'عمومی', type: 'boolean' },
  { id: 'anorexia', name: 'anorexia', label: 'Anorexia / Not eating', labelFa: 'بی‌اشتهایی', category: 'general', categoryFa: 'عمومی', type: 'boolean' },
  { id: 'weight_loss', name: 'weight_loss', label: 'Weight loss', labelFa: 'کاهش وزن', category: 'general', categoryFa: 'عمومی', type: 'boolean' },
  { id: 'dehydration', name: 'dehydration', label: 'Dehydration', labelFa: 'کم‌آبی', category: 'general', categoryFa: 'عمومی', type: 'boolean' },
  { id: 'pale_mucous_membranes', name: 'pale_mucous_membranes', label: 'Pale mucous membranes', labelFa: 'مخاط رنگ‌پریده', category: 'general', categoryFa: 'عمومی', type: 'boolean' },
  { id: 'jaundice', name: 'jaundice', label: 'Jaundice', labelFa: 'یرقان', category: 'general', categoryFa: 'عمومی', type: 'boolean' },
  { id: 'lymphadenopathy', name: 'lymphadenopathy', label: 'Enlarged lymph nodes', labelFa: 'تورم غدد لنفاوی', category: 'general', categoryFa: 'عمومی', type: 'boolean' },

  // Respiratory
  { id: 'cough', name: 'cough', label: 'Cough', labelFa: 'سرفه', category: 'respiratory', categoryFa: 'تنفسی', type: 'boolean' },
  { id: 'dry_cough', name: 'dry_cough', label: 'Dry/honking cough', labelFa: 'سرفه خشک', category: 'respiratory', categoryFa: 'تنفسی', type: 'boolean' },
  { id: 'moist_cough', name: 'moist_cough', label: 'Moist/productive cough', labelFa: 'سرفه مرطوب', category: 'respiratory', categoryFa: 'تنفسی', type: 'boolean' },
  { id: 'nasal_discharge', name: 'nasal_discharge', label: 'Nasal discharge', labelFa: 'ترشح بینی', category: 'respiratory', categoryFa: 'تنفسی', type: 'boolean' },
  { id: 'purulent_nasal_discharge', name: 'purulent_nasal_discharge', label: 'Purulent nasal discharge', labelFa: 'ترشح چرکی بینی', category: 'respiratory', categoryFa: 'تنفسی', type: 'boolean' },
  { id: 'sneezing', name: 'sneezing', label: 'Sneezing', labelFa: 'عطسه', category: 'respiratory', categoryFa: 'تنفسی', type: 'boolean' },
  { id: 'respiratory_distress', name: 'respiratory_distress', label: 'Respiratory distress', labelFa: 'تنگی نفس', category: 'respiratory', categoryFa: 'تنفسی', type: 'boolean', redFlag: true, redFlagMessage: 'Severe respiratory distress — immediate veterinary evaluation required', redFlagMessageFa: 'تنگی نفس شدید — ارزیابی فوری دامپزشکی ضروری است' },
  { id: 'dyspnea', name: 'dyspnea', label: 'Dyspnea (labored breathing)', labelFa: 'تنگی نفس شدید', category: 'respiratory', categoryFa: 'تنفسی', type: 'boolean', redFlag: true, redFlagMessage: 'Dyspnea is a life-threatening emergency', redFlagMessageFa: 'تنگی نفس شدید یک اورژانس خطرناک است' },
  { id: 'wheezing', name: 'wheezing', label: 'Wheezing', labelFa: 'ویزینگ', category: 'respiratory', categoryFa: 'تنفسی', type: 'boolean' },

  // Gastrointestinal
  { id: 'vomiting', name: 'vomiting', label: 'Vomiting', labelFa: 'استفراغ', category: 'gi', categoryFa: 'گوارشی', type: 'boolean' },
  { id: 'diarrhea', name: 'diarrhea', label: 'Diarrhea', labelFa: 'اسهال', category: 'gi', categoryFa: 'گوارشی', type: 'boolean' },
  { id: 'bloody_diarrhea', name: 'bloody_diarrhea', label: 'Bloody diarrhea', labelFa: 'اسهال خونی', category: 'gi', categoryFa: 'گوارشی', type: 'boolean', redFlag: true, redFlagMessage: 'Bloody diarrhea may indicate parvovirus, hemorrhagic gastroenteritis, or intoxication', redFlagMessageFa: 'اسهال خونی می‌تواند نشانه پاروویروس یا مسمومیت باشد' },
  { id: 'hematemesis', name: 'hematemesis', label: 'Vomiting blood', labelFa: 'استفراغ خونی', category: 'gi', categoryFa: 'گوارشی', type: 'boolean', redFlag: true, redFlagMessage: 'Hematemesis requires immediate evaluation', redFlagMessageFa: 'استفراغ خونی نیاز به ارزیابی فوری دارد' },
  { id: 'abdominal_pain', name: 'abdominal_pain', label: 'Abdominal pain', labelFa: 'درد شکم', category: 'gi', categoryFa: 'گوارشی', type: 'boolean' },
  { id: 'bloating', name: 'bloating', label: 'Abdominal bloating/distension', labelFa: 'نفخ شکم', category: 'gi', categoryFa: 'گوارشی', type: 'boolean', redFlag: true, redFlagMessage: 'Abdominal bloating in dogs may indicate GDV (gastric dilatation-volvulus) — a surgical emergency', redFlagMessageFa: 'نفخ شکم در سگ‌ها ممکن است نشانگر پیچ‌خوردگی معده باشد — اورژانس جراحی' },
  { id: 'constipation', name: 'constipation', label: 'Constipation', labelFa: 'یبوست', category: 'gi', categoryFa: 'گوارشی', type: 'boolean' },
  { id: 'melena', name: 'melena', label: 'Dark/tarry stool (melena)', labelFa: 'مدفوع سیاه', category: 'gi', categoryFa: 'گوارشی', type: 'boolean' },

  // Neurological
  { id: 'seizures', name: 'seizures', label: 'Seizures / Convulsions', labelFa: 'تشنج', category: 'neuro', categoryFa: 'عصبی', type: 'boolean', redFlag: true, redFlagMessage: 'Seizures require immediate veterinary evaluation', redFlagMessageFa: 'تشنج نیازمند ارزیابی فوری دامپزشکی است' },
  { id: 'ataxia', name: 'ataxia', label: 'Ataxia (uncoordinated gait)', labelFa: 'لرزش و عدم تعادل', category: 'neuro', categoryFa: 'عصبی', type: 'boolean' },
  { id: 'head_tilt', name: 'head_tilt', label: 'Head tilt', labelFa: 'کج بودن سر', category: 'neuro', categoryFa: 'عصبی', type: 'boolean' },
  { id: 'nystagmus', name: 'nystagmus', label: 'Nystagmus (eye movement)', labelFa: 'حركات غیرارادی چشم', category: 'neuro', categoryFa: 'عصبی', type: 'boolean' },
  { id: 'paresis', name: 'paresis', label: 'Paresis / Weakness', labelFa: 'ضعف حرکتی', category: 'neuro', categoryFa: 'عصبی', type: 'boolean' },
  { id: 'paralysis', name: 'paralysis', label: 'Paralysis', labelFa: 'فلجی', category: 'neuro', categoryFa: 'عصبی', type: 'boolean', redFlag: true, redFlagMessage: 'Paralysis may indicate spinal injury or tick paralysis — urgent evaluation needed', redFlagMessageFa: 'فلجی ممکن است نشانه آسیت نخاعی باشد — ارزیابی فوری' },
  { id: 'altered_mentation', name: 'altered_mentation', label: 'Altered mental state', labelFa: 'تغییر سطح هوشیاری', category: 'neuro', categoryFa: 'عصبی', type: 'boolean', redFlag: true, redFlagMessage: 'Altered mentation requires immediate evaluation', redFlagMessageFa: 'تغییر هوشیاری نیازمند ارزیابی فوری است' },
  { id: 'circling', name: 'circling', label: 'Circling', labelFa: 'چرخش مداوم', category: 'neuro', categoryFa: 'عصبی', type: 'boolean' },

  // Dermatological
  { id: 'pruritus', name: 'pruritus', label: 'Itching / Pruritus', labelFa: 'خارش', category: 'derm', categoryFa: 'پوستی', type: 'boolean' },
  { id: 'alopecia', name: 'alopecia', label: 'Hair loss', labelFa: 'ریزش مو', category: 'derm', categoryFa: 'پوستی', type: 'boolean' },
  { id: 'skin_lesions', name: 'skin_lesions', label: 'Skin lesions / crusts', labelFa: 'ضایعات پوستی', category: 'derm', categoryFa: 'پوستی', type: 'boolean' },
  { id: 'erythema', name: 'erythema', label: 'Skin redness (erythema)', labelFa: 'قرمزی پوست', category: 'derm', categoryFa: 'پوستی', type: 'boolean' },
  { id: 'otitis', name: 'otitis', label: 'Ear inflammation / discharge', labelFa: 'التهاب گوش', category: 'derm', categoryFa: 'پوستی', type: 'boolean' },
  { id: 'flea_dirt', name: 'flea_dirt', label: 'Flea dirt visible', labelFa: 'فضله کک', category: 'derm', categoryFa: 'پوستی', type: 'boolean' },
  { id: 'mange_lesions', name: 'mange_lesions', label: 'Mange-type lesions', labelFa: 'ضایعات گَرد', category: 'derm', categoryFa: 'پوستی', type: 'boolean' },

  // Urogenital
  { id: 'polyuria', name: 'polyuria', label: 'Excessive urination (PU)', labelFa: 'تکرر ادرار', category: 'uro', categoryFa: 'ادراری-تناسلی', type: 'boolean' },
  { id: 'polydipsia', name: 'polydipsia', label: 'Excessive drinking (PD)', labelFa: 'تشنگی زیاد', category: 'uro', categoryFa: 'ادراری-تناسلی', type: 'boolean' },
  { id: 'stranguria', name: 'stranguria', label: 'Straining to urinate', labelFa: 'درد ادرار کردن', category: 'uro', categoryFa: 'ادراری-تناسلی', type: 'boolean' },
  { id: 'hematuria', name: 'hematuria', label: 'Blood in urine', labelFa: 'خون در ادرار', category: 'uro', categoryFa: 'ادراری-تناسلی', type: 'boolean' },
  { id: 'urinary_blockage', name: 'urinary_blockage', label: 'Unable to urinate (blockage)', labelFa: 'انسداد ادراری', category: 'uro', categoryFa: 'ادراری-تناسلی', type: 'boolean', redFlag: true, redFlagMessage: 'Urinary blockage is a life-threatening emergency, especially in male cats', redFlagMessageFa: 'انسداد ادراری یک اورژانس خطرناک است، به‌ویژه در گربه‌های نر' },
  { id: 'vaginal_discharge', name: 'vaginal_discharge', label: 'Vaginal discharge', labelFa: 'ترشح واژینال', category: 'uro', categoryFa: 'ادراری-تناسلی', type: 'boolean' },

  // Musculoskeletal
  { id: 'lameness', name: 'lameness', label: 'Lameness', labelFa: 'لنگی', category: 'msk', categoryFa: 'عضلانی-اسکلتی', type: 'boolean' },
  { id: 'joint_swelling', name: 'joint_swelling', label: 'Joint swelling', labelFa: 'تورم مفصل', category: 'msk', categoryFa: 'عضلانی-اسکلتی', type: 'boolean' },
  { id: 'fracture', name: 'fracture', label: 'Fracture / suspected fracture', labelFa: 'شکستگی', category: 'msk', categoryFa: 'عضلانی-اسکلتی', type: 'boolean', redFlag: true, redFlagMessage: 'Suspected fracture requires immobilization and urgent evaluation', redFlagMessageFa: 'شکستگی مشکوک نیازمند ثابت‌سازی و ارزیابی فوری است' },
  { id: 'back_pain', name: 'back_pain', label: 'Back pain', labelFa: 'درد کمر', category: 'msk', categoryFa: 'عضلانی-اسکلتی', type: 'boolean' },

  // Cardiovascular
  { id: 'exercise_intolerance', name: 'exercise_intolerance', label: 'Exercise intolerance', labelFa: 'عدم تحمل ورزش', category: 'cardio', categoryFa: 'قلبی-عروقی', type: 'boolean' },
  { id: 'syncope', name: 'syncope', label: 'Fainting (syncope)', labelFa: 'غش', category: 'cardio', categoryFa: 'قلبی-عروقی', type: 'boolean' },
  { id: 'cough_on_exertion', name: 'cough_on_exertion', label: 'Cough on exertion', labelFa: 'سرفه هنگام فعالیت', category: 'cardio', categoryFa: 'قلبی-عروقی', type: 'boolean' },
  { id: 'weak_pulse', name: 'weak_pulse', label: 'Weak pulse', labelFa: 'نبض ضعیف', category: 'cardio', categoryFa: 'قلبی-عروقی', type: 'boolean' },

  // Eyes / Ears
  { id: 'ocular_discharge', name: 'ocular_discharge', label: 'Ocular discharge', labelFa: 'ترشح چشم', category: 'eyes', categoryFa: 'چشم-گوش', type: 'boolean' },
  { id: 'conjunctivitis', name: 'conjunctivitis', label: 'Conjunctivitis', labelFa: 'التهاب ملتحمه', category: 'eyes', categoryFa: 'چشم-گوش', type: 'boolean' },
  { id: 'keratitis', name: 'keratitis', label: 'Corneal inflammation (keratitis)', labelFa: 'التهاب قرنیه', category: 'eyes', categoryFa: 'چشم-گوش', type: 'boolean' },
  { id: 'blindness', name: 'blindness', label: 'Blindness / vision loss', labelFa: 'کوری', category: 'eyes', categoryFa: 'چشم-گوش', type: 'boolean' },
  { id: 'glaucoma_suspected', name: 'glaucoma_suspected', label: 'Suspected glaucoma (painful, red eye)', labelFa: 'گلوکوم مشکوک', category: 'eyes', categoryFa: 'چشم-گوش', type: 'boolean', redFlag: true, redFlagMessage: 'Glaucoma can cause permanent blindness within hours — urgent ophthalmic evaluation', redFlagMessageFa: 'گلوکوم می‌تواند در چند ساعت باعث کوری دائمی شود — ارزیابی فوری' },

  // Behavioral
  { id: 'aggression', name: 'aggression', label: 'Sudden aggression', labelFa: 'پرخاشگری ناگهانی', category: 'behavior', categoryFa: 'رفتاری', type: 'boolean' },
  { id: 'head_pressing', name: 'head_pressing', label: 'Head pressing against wall', labelFa: 'فشار دادن سر به دیوار', category: 'neuro', categoryFa: 'عصبی', type: 'boolean', redFlag: true, redFlagMessage: 'Head pressing indicates serious neurological disease — emergency', redFlagMessageFa: 'فشار دادن سر به دیوار نشان‌دهنده بیماری عصبی جدی است — اورژانس' },

  // Lab
  { id: 'leukopenia', name: 'leukopenia', label: 'Low WBC (leukopenia)', labelFa: 'کاهش گلبول سفید', category: 'lab', categoryFa: 'آزمایشگاهی', type: 'boolean' },
  { id: 'anemia', name: 'anemia', label: 'Anemia (low RBC)', labelFa: 'کم‌خونی', category: 'lab', categoryFa: 'آزمایشگاهی', type: 'boolean' },
  { id: 'thrombocytopenia', name: 'thrombocytopenia', label: 'Low platelets', labelFa: 'کاهش پلاکت', category: 'lab', categoryFa: 'آزمایشگاهی', type: 'boolean' },
  { id: 'elevated_liver_enzymes', name: 'elevated_liver_enzymes', label: 'Elevated liver enzymes', labelFa: 'افزایش آنزیم‌های کبدی', category: 'lab', categoryFa: 'آزمایشگاهی', type: 'boolean' },
  { id: 'azotemia', name: 'azotemia', label: 'Elevated kidney values (azotemia)', labelFa: 'افزایش فاکتورهای کلیوی', category: 'lab', categoryFa: 'آزمایشگاهی', type: 'boolean' },
  { id: 'hypoglycemia', name: 'hypoglycemia', label: 'Low blood sugar (hypoglycemia)', labelFa: 'افت قند خون', category: 'lab', categoryFa: 'آزمایشگاهی', type: 'boolean' },
  { id: 'metabolic_acidosis', name: 'metabolic_acidosis', label: 'Metabolic acidosis', labelFa: 'اسیدوز متابولیک', category: 'lab', categoryFa: 'آزمایشگاهی', type: 'boolean' },

  // History / Environment
  { id: 'vaccination_incomplete', name: 'vaccination_incomplete', label: 'Vaccination incomplete', labelFa: 'واکسیناسیون ناقص', category: 'history', categoryFa: 'سوابق', type: 'boolean' },
  { id: 'unvaccinated', name: 'unvaccinated', label: 'Unvaccinated', labelFa: 'واکسین‌نشده', category: 'history', categoryFa: 'سوابق', type: 'boolean' },
  { id: 'recent_boarding', name: 'recent_boarding', label: 'Recent boarding / shelter exposure', labelFa: 'اقامت اخیری در هتل حیوانات', category: 'history', categoryFa: 'سوابق', type: 'boolean' },
  { id: 'multi_pet_household', name: 'multi_pet_household', label: 'Multi-pet household', labelFa: 'چند حیوان در خانه', category: 'history', categoryFa: 'سوابق', type: 'boolean' },
  { id: 'outdoor_access', name: 'outdoor_access', label: 'Outdoor access', labelFa: 'دسترسی به بیرون', category: 'history', categoryFa: 'سوابق', type: 'boolean' },
  { id: 'tick_exposure', name: 'tick_exposure', label: 'Known tick exposure', labelFa: 'تماس با کنه', category: 'history', categoryFa: 'سوابق', type: 'boolean' },
  { id: 'young_age', name: 'young_age', label: 'Young age (< 1 year)', labelFa: 'سن کم (کمتر از یک سال)', category: 'history', categoryFa: 'سوابق', type: 'boolean' },
  { id: 'not_neutered', name: 'not_neutered', label: 'Intact (not neutered/spayed)', labelFa: 'تخمک/تخمدان', category: 'history', categoryFa: 'سوابق', type: 'boolean' },
  { id: 'toxin_exposure', name: 'toxin_exposure', label: 'Known toxin exposure', labelFa: 'تماس با ماده سمی', category: 'history', categoryFa: 'سوابق', type: 'boolean', redFlag: true, redFlagMessage: 'Known toxin exposure — contact veterinarian or poison control immediately', redFlagMessageFa: 'تماس با ماده سمی — فوری با دامپزشک تماس بگیرید' },
];
