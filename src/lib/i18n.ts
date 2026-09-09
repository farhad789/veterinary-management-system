import type { Lang, UserRole } from '@/types';

type TranslationKey = string;
type Translations = Record<TranslationKey, Partial<Record<Lang, string | ((n: number) => string)>>>;

const translations: Translations = {
  // --- App Identity ---
  appName: {
    fa: 'وندا‌ت | هوش بالینی دامپزشکی',
    en: 'VetRay | Veterinary Clinical Intelligence',
    ar: 'فيت راي | الذكاء السريري البيطري',
    tr: 'VetRay | Veteriner Klinik Zekası',
    fr: 'VetRay | Intelligence Clinique Vétérinaire',
    es: 'VetRay | Inteligencia Clínica Veterinaria',
    de: 'VetRay | Veterinäre Klinische Intelligenz',
  },
  tagline: {
    fa: 'موتور استدلال منطقی و کمک‌تصمیم‌گیری بالینی',
    en: 'Logical Reasoning & Clinical Decision Support Engine',
    ar: 'محرك الاستدلال المنطقي ودعم القرار السريري',
    tr: 'Mantıksal Akıl Yürütme ve Klinik Karar Destek Motoru',
    fr: 'Moteur de Raisonnement Logique et d\'Aide à la Décision Clinique',
    es: 'Motor de Razonamiento Lógico y Apoyo a la Decisión Clínica',
    de: 'Logisches Schlussfolgern und klinische Entscheidungsunterstützung',
  },
  poweredBy: {
    fa: 'با الهام از Logic Theorist',
    en: 'Inspired by Logic Theorist',
    ar: 'مستوحى من نظرية المنطق',
    tr: 'Logic Theorist\'ten ilham almıştır',
    fr: 'Inspiré par Logic Theorist',
    es: 'Inspirado en Logic Theorist',
    de: 'Inspiriert von Logic Theorist',
  },

  // --- Disclaimer ---
  disclaimer: {
    fa: 'این سامانه یک ابزار کمک‌تصمیم‌گیری بالینی است و تشخیص قطعی ارائه نمی‌دهد و جایگزین معاینه دامپزشکی، آزمایش‌های تشخیصی یا قضاوت حرفه‌ای دامپزشک نیست.',
    en: 'This platform is a clinical decision-support tool. It does not provide a definitive diagnosis and does not replace professional veterinary examination, diagnostic testing, or clinical judgment.',
    ar: 'هذه المنصة أداة دعم قرار سريري. لا تقدم تشخيصاً نهائياً ولا تحل محل الفحص البيطري المهني أو الاختبارات التشخيصية أو الحكم السريري.',
    tr: 'Bu platform klinik karar destek aracıdır. Kesin tanı koymaz ve profesyonel veteriner muayenesinin, tanı testlerinin veya klinik yargının yerini almaz.',
    fr: 'Cette plateforme est un outil d\'aide à la décision clinique. Elle ne fournit pas de diagnostic définitif et ne remplace pas l\'examen vétérinaire professionnel, les tests diagnostiques ou le jugement clinique.',
    es: 'Esta plataforma es una herramienta de apoyo a la decisión clínica. No proporciona un diagnóstico definitivo y no reemplaza el examen veterinario profesional, las pruebas diagnósticas o el juicio clínico.',
    de: 'Diese Plattform ist ein klinisches Entscheidungsunterstützungstool. Sie liefert keine endgültige Diagnose und ersetzt nicht die tierärztliche Untersuchung, diagnostische Tests oder klinisches Urteilsvermögen.',
  },
  importantDisclaimer: {
    fa: 'هشدار مهم',
    en: 'Important Disclaimer',
    ar: 'تنبيه مهم',
    tr: 'Önemli Uyarı',
    fr: 'Avertissement Important',
    es: 'Aviso Importante',
    de: 'Wichtiger Hinweis',
  },
  notReplaceVet: {
    fa: 'این ابزار جایگزین معاینه توسط دامپزشک نیست.',
    en: 'This tool does not replace examination by a veterinarian.',
    ar: 'هذه الأداة لا تحل محل الفحص من قبل طبيب بيطري.',
    tr: 'Bu araç veteriner hekim muayenesinin yerini almaz.',
    fr: 'Cet outil ne remplace pas l\'examen par un vétérinaire.',
    es: 'Esta herramienta no reemplaza el examen de un veterinario.',
    de: 'Dieses Werkzeug ersetzt nicht die Untersuchung durch einen Tierarzt.',
  },

  // --- Language Selection ---
  chooseLanguage: {
    fa: 'زبان مورد نظر خود را انتخاب کنید',
    en: 'Choose your language',
    ar: 'اختر لغتك',
    tr: 'Dilinizi seçin',
    fr: 'Choisissez votre langue',
    es: 'Elija su idioma',
    de: 'Wählen Sie Ihre Sprache',
  },
  continue: {
    fa: 'ادامه',
    en: 'Continue',
    ar: 'متابعة',
    tr: 'Devam et',
    fr: 'Continuer',
    es: 'Continuar',
    de: 'Weiter',
  },

  // --- Auth ---
  login: { fa: 'ورود', en: 'Login', ar: 'تسجيل الدخول', tr: 'Giriş', fr: 'Connexion', es: 'Iniciar sesión', de: 'Anmelden' },
  signup: { fa: 'ثبت‌نام', en: 'Sign Up', ar: 'إنشاء حساب', tr: 'Kayıt Ol', fr: 'S\'inscrire', es: 'Registrarse', de: 'Registrieren' },
  email: { fa: 'ایمیل', en: 'Email', ar: 'البريد الإلكتروني', tr: 'E-posta', fr: 'E-mail', es: 'Correo electrónico', de: 'E-Mail' },
  enterEmail: {
    fa: 'ایمیل خود را وارد کنید',
    en: 'Enter your email',
    ar: 'أدخل بريدك الإلكتروني',
    tr: 'E-posta adresinizi girin',
    fr: 'Entrez votre e-mail',
    es: 'Ingrese su correo electrónico',
    de: 'Geben Sie Ihre E-Mail ein',
  },
  sendCode: {
    fa: 'ارسال کد تأیید',
    en: 'Send verification code',
    ar: 'إرسال رمز التحقق',
    tr: 'Doğrulama kodu gönder',
    fr: 'Envoyer le code de vérification',
    es: 'Enviar código de verificación',
    de: 'Bestätigungscode senden',
  },
  enterCode: {
    fa: 'کد ۶ رقمی را وارد کنید',
    en: 'Enter the 6-digit code',
    ar: 'أدخل الرمز المكوّن من 6 أرقام',
    tr: '6 haneli kodu girin',
    fr: 'Entrez le code à 6 chiffres',
    es: 'Ingrese el código de 6 dígitos',
    de: 'Geben Sie den 6-stelligen Code ein',
  },
  verify: { fa: 'تأیید', en: 'Verify', ar: 'تحقق', tr: 'Doğrula', fr: 'Vérifier', es: 'Verificar', de: 'Bestätigen' },
  resendCode: {
    fa: 'ارسال مجدد کد',
    en: 'Resend code',
    ar: 'إعادة إرسال الرمز',
    tr: 'Kodu yeniden gönder',
    fr: 'Renvoyer le code',
    es: 'Reenviar código',
    de: 'Code erneut senden',
  },
  codeSent: {
    fa: 'کد تأیید به ایمیل شما ارسال شد',
    en: 'Verification code sent to your email',
    ar: 'تم إرسال رمز التحقق إلى بريدك الإلكتروني',
    tr: 'Doğrulama kodu e-posta adresinize gönderildi',
    fr: 'Code de vérification envoyé à votre e-mail',
    es: 'Código de verificación enviado a su correo',
    de: 'Bestätigungscode an Ihre E-Mail gesendet',
  },
  invalidCode: {
    fa: 'کد تأیید نامعتبر است',
    en: 'Invalid verification code',
    ar: 'رمز التحقق غير صالح',
    tr: 'Geçersiz doğrulama kodu',
    fr: 'Code de vérification invalide',
    es: 'Código de verificación inválido',
    de: 'Ungültiger Bestätigungscode',
  },
  tooManyAttempts: {
    fa: 'تلاش‌های بیش از حد. لطفاً بعداً تلاش کنید.',
    en: 'Too many attempts. Please try again later.',
    ar: 'محاولات كثيرة جداً. يرجى المحاولة لاحقاً.',
    tr: 'Çok fazla deneme. Lütfen daha sonra tekrar deneyin.',
    fr: 'Trop de tentatives. Veuillez réessayer plus tard.',
    es: 'Demasiados intentos. Inténtelo más tarde.',
    de: 'Zu viele Versuche. Bitte später erneut versuchen.',
  },
  back: { fa: 'بازگشت', en: 'Back', ar: 'رجوع', tr: 'Geri', fr: 'Retour', es: 'Atrás', de: 'Zurück' },
  logout: { fa: 'خروج', en: 'Logout', ar: 'تسجيل الخروج', tr: 'Çıkış', fr: 'Déconnexion', es: 'Cerrar sesión', de: 'Abmelden' },
  loading: { fa: 'در حال بارگذاری...', en: 'Loading...', ar: 'جاري التحميل...', tr: 'Yükleniyor...', fr: 'Chargement...', es: 'Cargando...', de: 'Wird geladen...' },

  // --- Trial ---
  freeTrial: { fa: 'آزمایش رایگان ۷ روزه', en: '7-Day Free Trial', ar: 'تجربة مجانية ٧ أيام', tr: '7 Gün Ücretsiz Deneme', fr: 'Essai Gratuit 7 Jours', es: 'Prueba Gratuita 7 Días', de: '7 Tage Gratis Test' },
  trialActive: { fa: 'آزمایش رایگان فعال است', en: 'Free trial is active', ar: 'التجربة المجانية مفعلة', tr: 'Ücretsiz deneme aktif', fr: 'L\'essai gratuit est actif', es: 'La prueba gratuita está activa', de: 'Kostenlose Testphase aktiv' },
  daysRemaining: {
    fa: (n: number) => `آزمایش رایگان شما ${n} روز دیگر باقی مانده است`,
    en: (n: number) => `Your free trial has ${n} days remaining`,
    ar: (n: number) => `تبقى ${n} أيام على انتهاء تجربتك المجانية`,
    tr: (n: number) => `Ücretsiz denemenizin ${n} günü kaldı`,
    fr: (n: number) => `Il vous reste ${n} jours d\'essai gratuit`,
    es: (n: number) => `Le quedan ${n} días de prueba gratuita`,
    de: (n: number) => `Ihre kostenlose Testphase hat noch ${n} Tage`,
  },
  trialExpired: {
    fa: 'آزمایش رایگان شما به پایان رسیده است',
    en: 'Your free trial has expired',
    ar: 'انتهت تجربتك المجانية',
    tr: 'Ücretsiz denemeniz sona erdi',
    fr: 'Votre essai gratuit a expiré',
    es: 'Su prueba gratuita ha expirado',
    de: 'Ihre kostenlose Testphase ist abgelaufen',
  },
  trialExpiringSoon: {
    fa: 'آزمایش رایگان شما به‌زودی به پایان می‌رسد',
    en: 'Your free trial is expiring soon',
    ar: 'تجربتك المجانية على وشك الانتهاء',
    tr: 'Ücretsiz denemeniz yakında sona erecek',
    fr: 'Votre essai gratuit expire bientôt',
    es: 'Su prueba gratuita expira pronto',
    de: 'Ihre kostenlose Testphase läuft bald ab',
  },
  subscribeNow: { fa: 'هم‌اکنون اشتراک بگیرید', en: 'Subscribe now', ar: 'اشترك الآن', tr: 'Şimdi abone ol', fr: 'Abonnez-vous maintenant', es: 'Suscríbase ahora', de: 'Jetzt abonnieren' },
  subscriptionPlans: { fa: 'طرح اشتراک', en: 'Subscription Plans', ar: 'خطط الاشتراك', tr: 'Abonelik Planları', fr: 'Plans d\'Abonnement', es: 'Planes de Suscripción', de: 'Abonnement-Pläne' },
  comingSoon: { fa: 'به‌زودی', en: 'Coming soon', ar: 'قريباً', tr: 'Yakında', fr: 'Bientôt disponible', es: 'Próximamente', de: 'Demnächst' },
  startFreeTrial: { fa: 'شروع رایگان ۷ روزه', en: 'Start 7-Day Free Trial', ar: 'ابدأ التجربة المجانية ٧ أيام', tr: '7 Gün Ücretsiz Başla', fr: 'Commencer l\'Essai Gratuit 7 Jours', es: 'Iniciar Prueba Gratuita 7 Días', de: '7 Tage Gratis starten' },
  noPaymentRequired: { fa: 'بدون نیاز به اطلاعات پرداخت', en: 'No payment information required', ar: 'لا حاجة لمعلومات الدفع', tr: 'Ödeme bilgisi gerekmez', fr: 'Aucune information de paiement requise', es: 'No se requiere información de pago', de: 'Keine Zahlungsinformationen erforderlich' },

  // --- Role Selection ---
  selectRole: {
    fa: 'شما در حوزه دامپزشکی برای چه منظوری از این دستیار استفاده می‌کنید؟',
    en: 'How do you use this assistant in the veterinary field?',
    ar: 'كيف تستخدم هذا المساعد في المجال البيطري؟',
    tr: 'Veterinerlik alanında bu asistanı nasıl kullanıyorsunuz?',
    fr: 'Comment utilisez-vous cet assistant dans le domaine vétérinaire ?',
    es: '¿Cómo utiliza este asistente en el campo veterinario?',
    de: 'Wie nutzen Sie diesen Assistenten im veterinären Bereich?',
  },
  role_small_animal_vet: { fa: 'دامپزشک حیوانات کوچک', en: 'Small Animal Veterinarian', ar: 'طبيب بيطري للحيوانات الصغيرة', tr: 'Küçük Hayvan Veterineri', fr: 'Vétérinaire pour petits animaux', es: 'Veterinario de animales pequeños', de: 'Kleintier-Tierarzt' },
  role_large_animal_vet: { fa: 'دامپزشک دام بزرگ', en: 'Large Animal Veterinarian', ar: 'طبيب بيطري للحيوانات الكبيرة', tr: 'Büyük Hayvan Veterineri', fr: 'Vétérinaire pour grands animaux', es: 'Veterinario de animales grandes', de: 'Großtier-Tierarzt' },
  role_equine_vet: { fa: 'دامپزشک اسب', en: 'Equine Veterinarian', ar: 'طبيب بيطري للخيول', tr: 'At Veterineri', fr: 'Vétérinaire équin', es: 'Veterinario equino', de: 'Pferde-Tierarzt' },
  role_poultry_vet: { fa: 'دامپزشک طیور', en: 'Poultry Veterinarian', ar: 'طبيب بيطري للدواجن', tr: 'Kanatlı Veterineri', fr: 'Vétérinaire avicole', es: 'Veterinario avícola', de: 'Geflügel-Tierarzt' },
  role_vet_student: { fa: 'دانشجوی دامپزشکی', en: 'Veterinary Student', ar: 'طالب طب بيطري', tr: 'Veterinerlik Öğrencisi', fr: 'Étudiant vétérinaire', es: 'Estudiante de veterinaria', de: 'Veterinärmedizin-Student' },
  role_vet_technician: { fa: 'تکنسین / دستیار دامپزشکی', en: 'Veterinary Technician / Assistant', ar: 'فني / مساعد بيطري', tr: 'Veteriner Teknisyeni / Asistanı', fr: 'Technicien vétérinaire', es: 'Técnico veterinario', de: 'Tiermedizinischer Fachangestellter' },
  role_vaccinator: { fa: 'واکسیناتور', en: 'Vaccinator', ar: 'ملقح', tr: 'Aşılayıcı', fr: 'Vaccinateur', es: 'Vacunador', de: 'Impfer' },
  role_farmer: { fa: 'دامدار', en: 'Farmer / Livestock Producer', ar: 'مربي الماشية', tr: 'Çiftçi / Hayvancı', fr: 'Éleveur', es: 'Ganadero', de: 'Landwirt' },
  role_poultry_producer: { fa: 'مرغدار', en: 'Poultry Producer', ar: 'منتج الدواجن', tr: 'Kanatlı Üreticisi', fr: 'Producteur avicole', es: 'Productor avícola', de: 'Geflügelproduzent' },
  role_pet_owner: { fa: 'صاحب حیوان خانگی', en: 'Pet Owner', ar: 'مالك حيوان أليف', tr: 'Evcil Hayvan Sahibi', fr: 'Propriétaire d\'animal de compagnie', es: 'Dueño de mascota', de: 'Haustierbesitzer' },
  role_horse_owner: { fa: 'صاحب اسب', en: 'Horse Owner', ar: 'مالك حصان', tr: 'At Sahibi', fr: 'Propriétaire de cheval', es: 'Dueño de caballo', de: 'Pferdebesitzer' },
  role_breeder: { fa: 'پرورش‌دهنده', en: 'Breeder', ar: 'مربي', tr: 'Yetiştirici', fr: 'Éleveur', es: 'Criador', de: 'Züchter' },
  role_other: { fa: 'سایر', en: 'Other', ar: 'أخرى', tr: 'Diğer', fr: 'Autre', es: 'Otro', de: 'Andere' },
  skipForNow: { fa: 'فعلاً رد شو', en: 'Skip for now', ar: 'تخطي الآن', tr: 'Şimdilik atla', fr: 'Passer pour l\'instant', es: 'Omitir por ahora', de: 'Vorerst überspringen' },

  // --- Navigation ---
  home: { fa: 'خانه', en: 'Home', ar: 'الرئيسية', tr: 'Ana Sayfa', fr: 'Accueil', es: 'Inicio', de: 'Startseite' },
  dashboard: { fa: 'داشبورد', en: 'Dashboard', ar: 'لوحة التحكم', tr: 'Panel', fr: 'Tableau de bord', es: 'Panel', de: 'Dashboard' },
  newCase: { fa: 'بیمار جدید', en: 'New Case', ar: 'حالة جديدة', tr: 'Yeni Vaka', fr: 'Nouveau cas', es: 'Nuevo caso', de: 'Neuer Fall' },
  reasoning: { fa: 'استدلال', en: 'Reasoning', ar: 'الاستدلال', tr: 'Akıl Yürütme', fr: 'Raisonnement', es: 'Razonamiento', de: 'Schlussfolgern' },
  hypotheses: { fa: 'فرضیه‌ها', en: 'Hypotheses', ar: 'الفرضيات', tr: 'Hipotezler', fr: 'Hypothèses', es: 'Hipótesis', de: 'Hypothesen' },
  evidence: { fa: 'شواهد', en: 'Evidence', ar: 'الأدلة', tr: 'Kanıtlar', fr: 'Preuves', es: 'Evidencia', de: 'Beweise' },
  reasoningTree: { fa: 'درخت استدلال', en: 'Reasoning Tree', ar: 'شجرة الاستدلال', tr: 'Akıl Yürütme Ağacı', fr: 'Arbre de raisonnement', es: 'Árbol de razonamiento', de: 'Schlussfolgerungsbaum' },
  decisionSupport: { fa: 'تصمیم‌گیری', en: 'Decision Support', ar: 'دعم القرار', tr: 'Karar Desteği', fr: 'Aide à la décision', es: 'Apoyo a la decisión', de: 'Entscheidungsunterstützung' },
  caseSummary: { fa: 'خلاصه مورد', en: 'Case Summary', ar: 'ملخص الحالة', tr: 'Vaka Özeti', fr: 'Résumé du cas', es: 'Resumen del caso', de: 'Fallzusammenfassung' },
  tests: { fa: 'آزمون‌ها', en: 'Engine Tests', ar: 'اختبارات المحرك', tr: 'Motor Testleri', fr: 'Tests du moteur', es: 'Pruebas del motor', de: 'Motor-Tests' },
  vaccination: { fa: 'واکسیناسیون', en: 'Vaccination', ar: 'التطعيم', tr: 'Aşılama', fr: 'Vaccination', es: 'Vacunación', de: 'Impfung' },
  pharmacology: { fa: 'داروسازی', en: 'Pharmacology', ar: 'الدوائية', tr: 'Farmakoloji', fr: 'Pharmacologie', es: 'Farmacología', de: 'Pharmakologie' },
  diagnostics: { fa: 'تشخیص‌های آزمایشگاهی', en: 'Diagnostics', ar: 'التشخيص', tr: 'Tanı', fr: 'Diagnostics', es: 'Diagnósticos', de: 'Diagnostik' },
  settings: { fa: 'تنظیمات', en: 'Settings', ar: 'الإعدادات', tr: 'Ayarlar', fr: 'Paramètres', es: 'Configuración', de: 'Einstellungen' },
  savedCases: { fa: 'موارد ذخیره‌شده', en: 'Saved Cases', ar: 'الحالات المحفوظة', tr: 'Kayıtlı Vakalar', fr: 'Cas enregistrés', es: 'Casos guardados', de: 'Gespeicherte Fälle' },
  emergency: { fa: 'اورژانس', en: 'Emergency', ar: 'الطوارئ', tr: 'Acil Durum', fr: 'Urgence', es: 'Emergencia', de: 'Notfall' },
  profile: { fa: 'پروفایل', en: 'Profile', ar: 'الملف الشخصي', tr: 'Profil', fr: 'Profil', es: 'Perfil', de: 'Profil' },

  // --- Dashboard ---
  welcome: { fa: 'خوش آمدید', en: 'Welcome', ar: 'مرحباً', tr: 'Hoş geldiniz', fr: 'Bienvenue', es: 'Bienvenido', de: 'Willkommen' },
  quickActions: { fa: 'اقدامات سریع', en: 'Quick Actions', ar: 'إجراءات سريعة', tr: 'Hızlı İşlemler', fr: 'Actions rapides', es: 'Acciones rápidas', de: 'Schnellaktionen' },
  recentCases: { fa: 'موارد اخیر', en: 'Recent Cases', ar: 'الحالات الأخيرة', tr: 'Son Vakalar', fr: 'Cas récents', es: 'Casos recientes', de: 'Aktuelle Fälle' },
  clinicalTools: { fa: 'ابزارهای بالینی', en: 'Clinical Tools', ar: 'الأدوات السريرية', tr: 'Klinik Araçlar', fr: 'Outils cliniques', es: 'Herramientas clínicas', de: 'Klinische Werkzeuge' },
  noCasesYet: { fa: 'هنوز موردی ثبت نشده است', en: 'No cases yet', ar: 'لا توجد حالات بعد', tr: 'Henüz vaka yok', fr: 'Aucun cas pour l\'instant', es: 'Aún no hay casos', de: 'Noch keine Fälle' },

  // --- Case Input ---
  startCase: { fa: 'شروع مورد جدید', en: 'Start New Case', ar: 'ابدأ حالة جديدة', tr: 'Yeni Vaka Başlat', fr: 'Commencer un nouveau cas', es: 'Iniciar nuevo caso', de: 'Neuen Fall starten' },
  loadSample: { fa: 'بارگذاری مورد نمونه', en: 'Load Sample Case', ar: 'تحميل حالة نموذجية', tr: 'Örnek Vaka Yükle', fr: 'Charger un cas exemple', es: 'Cargar caso de ejemplo', de: 'Beispielfall laden' },
  runReasoning: { fa: 'اجرای استدلال', en: 'Run Reasoning', ar: 'تشغيل الاستدلال', tr: 'Akıl Yürütme Çalıştır', fr: 'Lancer le raisonnement', es: 'Ejecutar razonamiento', de: 'Schlussfolgern starten' },
  species: { fa: 'نوع حیوان', en: 'Species', ar: 'النوع', tr: 'Tür', fr: 'Espèce', es: 'Especie', de: 'Tierart' },
  age: { fa: 'سن (سال)', en: 'Age (years)', ar: 'العمر (سنوات)', tr: 'Yaş (yıl)', fr: 'Âge (ans)', es: 'Edad (años)', de: 'Alter (Jahre)' },
  sex: { fa: 'جنسیت', en: 'Sex', ar: 'الجنس', tr: 'Cinsiyet', fr: 'Sexe', es: 'Sexo', de: 'Geschlecht' },
  clinicalSigns: { fa: 'علائم بالینی', en: 'Clinical Signs', ar: 'العلامات السريرية', tr: 'Klinik Belirtiler', fr: 'Signes cliniques', es: 'Signos clínicos', de: 'Klinische Symptome' },
  vaccinationStatus: { fa: 'وضعیت واکسیناسیون', en: 'Vaccination Status', ar: 'حالة التطعيم', tr: 'Aşı Durumu', fr: 'Statut vaccinal', es: 'Estado de vacunación', de: 'Impfstatus' },
  duration: { fa: 'مدت علائم (روز)', en: 'Duration (days)', ar: 'مدة الأعراض (أيام)', tr: 'Süre (gün)', fr: 'Durée (jours)', es: 'Duración (días)', de: 'Dauer (Tage)' },
  environmental: { fa: 'عوامل محیطی', en: 'Environmental Factors', ar: 'العوامل البيئية', tr: 'Çevresel Faktörler', fr: 'Facteurs environnementaux', es: 'Factores ambientales', de: 'Umweltfaktoren' },
  labFindings: { fa: 'یافته‌های آزمایشگاهی', en: 'Lab Findings', ar: 'نتائج المختبر', tr: 'Laboratuvar Bulguları', fr: 'Résultats de laboratoire', es: 'Hallazgos de laboratorio', de: 'Laborbefunde' },
  selectSigns: { fa: 'علائم را انتخاب کنید', en: 'Select clinical signs', ar: 'اختر العلامات السريرية', tr: 'Klinik belirtileri seçin', fr: 'Sélectionner les signes cliniques', es: 'Seleccionar signos clínicos', de: 'Klinische Symptome auswählen' },
  complete: { fa: 'کامل', en: 'Complete', ar: 'كامل', tr: 'Tam', fr: 'Complet', es: 'Completo', de: 'Vollständig' },
  incomplete: { fa: 'ناقص', en: 'Incomplete', ar: 'ناقص', tr: 'Eksik', fr: 'Incomplet', es: 'Incompleto', de: 'Unvollständig' },
  unknown: { fa: 'نامشخص', en: 'Unknown', ar: 'غير معروف', tr: 'Bilinmiyor', fr: 'Inconnu', es: 'Desconocido', de: 'Unbekannt' },
  male: { fa: 'نر', en: 'Male', ar: 'ذكر', tr: 'Erkek', fr: 'Mâle', es: 'Macho', de: 'Männlich' },
  female: { fa: 'ماده', en: 'Female', ar: 'أنثى', tr: 'Dişi', fr: 'Femelle', es: 'Hembra', de: 'Weiblich' },

  // --- Species ---
  dog: { fa: 'سگ', en: 'Dog', ar: 'كلب', tr: 'Köpek', fr: 'Chien', es: 'Perro', de: 'Hund' },
  cat: { fa: 'گربه', en: 'Cat', ar: 'قطة', tr: 'Kedi', fr: 'Chat', es: 'Gato', de: 'Katze' },
  bird: { fa: 'پرنده', en: 'Bird', ar: 'طائر', tr: 'Kuş', fr: 'Oiseau', es: 'Ave', de: 'Vogel' },
  rabbit: { fa: 'خرگوش', en: 'Rabbit', ar: 'أرنب', tr: 'Tavşan', fr: 'Lapin', es: 'Conejo', de: 'Kaninchen' },
  horse: { fa: 'اسب', en: 'Horse', ar: 'حصان', tr: 'At', fr: 'Cheval', es: 'Caballo', de: 'Pferd' },
  cattle: { fa: 'گاو', en: 'Cattle', ar: 'بقر', tr: 'Sığır', fr: 'Bovin', es: 'Ganado', de: 'Rind' },
  sheep: { fa: 'گوسفند', en: 'Sheep', ar: 'خروف', tr: 'Koyun', fr: 'Mouton', es: 'Oveja', de: 'Schaf' },
  goat: { fa: 'بز', en: 'Goat', ar: 'ماعز', tr: 'Keçi', fr: 'Chèvre', es: 'Cabra', de: 'Ziege' },
  buffalo: { fa: 'گاو میش', en: 'Buffalo', ar: 'جاموس', tr: 'Manda', fr: 'Buffle', es: 'Búfalo', de: 'Büffel' },
  chicken: { fa: 'مرغ', en: 'Chicken', ar: 'دجاج', tr: 'Tavuk', fr: 'Poule', es: 'Pollo', de: 'Huhn' },
  turkey: { fa: 'بوقلمون', en: 'Turkey', ar: 'ديك رومي', tr: 'Hindi', fr: 'Dinde', es: 'Pavo', de: 'Pute' },
  other: { fa: 'سایر', en: 'Other', ar: 'أخرى', tr: 'Diğer', fr: 'Autre', es: 'Otro', de: 'Andere' },

  // --- Reasoning Output ---
  supportingEvidence: { fa: 'شواهد موافق', en: 'Supporting Evidence', ar: 'الأدلة المؤيدة', tr: 'Destekleyici Kanıtlar', fr: 'Preuves concordantes', es: 'Evidencia de apoyo', de: 'Stützende Beweise' },
  contradictingEvidence: { fa: 'شواهد مخالف', en: 'Contradicting Evidence', ar: 'الأدلة المعارضة', tr: 'Çelişen Kanıtlar', fr: 'Preuves contradictoires', es: 'Evidencia contradictoria', de: 'Widersprüchliche Beweise' },
  missingEvidence: { fa: 'شواهد مفقود', en: 'Missing Evidence', ar: 'الأدلة المفقودة', tr: 'Eksik Kanıtlar', fr: 'Preuves manquantes', es: 'Evidencia faltante', de: 'Fehlende Beweise' },
  requiredTests: { fa: 'آزمایش‌های لازم', en: 'Required Tests', ar: 'الاختبارات المطلوبة', tr: 'Gerekli Testler', fr: 'Tests requis', es: 'Pruebas requeridas', de: 'Erforderliche Tests' },
  confidence: { fa: 'اطمینان', en: 'Confidence', ar: 'الثقة', tr: 'Güven', fr: 'Confiance', es: 'Confianza', de: 'Vertrauen' },
  riskLevel: { fa: 'سطح خطر', en: 'Risk Level', ar: 'مستوى الخطر', tr: 'Risk Seviyesi', fr: 'Niveau de risque', es: 'Nivel de riesgo', de: 'Risikolevel' },
  reasoningPath: { fa: 'مسیر استدلال', en: 'Reasoning Path', ar: 'مسار الاستدلال', tr: 'Akıl Yürütme Yolu', fr: 'Cheminement', es: 'Ruta de razonamiento', de: 'Schlussfolgerungspfad' },
  nextSteps: { fa: 'اقدامات بعدی', en: 'Next Best Information', ar: 'أفضل المعلومات التالية', tr: 'Sonraki En İyi Bilgi', fr: 'Prochaine meilleure information', es: 'Mejor información siguiente', de: 'Nächstbeste Information' },
  redFlags: { fa: 'پرچم‌های قرمز', en: 'Red Flags', ar: 'العلامات الحمراء', tr: 'Kırmızı Bayraklar', fr: 'Drapeaux rouges', es: 'Banderas rojas', de: 'Rote Flaggen' },
  high: { fa: 'بالا', en: 'High', ar: 'عالي', tr: 'Yüksek', fr: 'Élevé', es: 'Alto', de: 'Hoch' },
  moderate: { fa: 'متوسط', en: 'Moderate', ar: 'متوسط', tr: 'Orta', fr: 'Modéré', es: 'Moderado', de: 'Mäßig' },
  low: { fa: 'پایین', en: 'Low', ar: 'منخفض', tr: 'Düşük', fr: 'Faible', es: 'Bajo', de: 'Niedrig' },
  insufficient: { fa: 'ناکافی', en: 'Insufficient', ar: 'غير كافٍ', tr: 'Yetersiz', fr: 'Insuffisant', es: 'Insuficiente', de: 'Unzureichend' },
  critical: { fa: 'بحرانی', en: 'Critical', ar: 'حرج', tr: 'Kritik', fr: 'Critique', es: 'Crítico', de: 'Kritisch' },
  noHypotheses: {
    fa: 'از یافته‌های واردشده فرضیه‌ای تولید نشد. علائم بیشتری اضافه کنید.',
    en: 'No hypotheses generated. Add more clinical signs.',
    ar: 'لم يتم توليد فرضيات. أضف المزيد من العلامات السريرية.',
    tr: 'Hipotez oluşturulmadı. Daha fazla klinik belirti ekleyin.',
    fr: 'Aucune hypothèse générée. Ajoutez plus de signes cliniques.',
    es: 'No se generaron hipótesis. Agregue más signos clínicos.',
    de: 'Keine Hypothesen generiert. Fügen Sie mehr klinische Symptome hinzu.',
  },
  facts: { fa: 'وقایع', en: 'Facts', ar: 'الحقائق', tr: 'Olgular', fr: 'Faits', es: 'Hechos', de: 'Fakten' },
  rules: { fa: 'قواعد', en: 'Rules', ar: 'القواعد', tr: 'Kurallar', fr: 'Règles', es: 'Reglas', de: 'Regeln' },
  inference: { fa: 'استنتاج', en: 'Inference', ar: 'الاستنتاج', tr: 'Çıkarım', fr: 'Inférence', es: 'Inferencia', de: 'Schlussfolgerung' },
  backToInput: { fa: 'بازگشت به ورودی', en: 'Back to Input', ar: 'العودة إلى الإدخال', tr: 'Girişe Dön', fr: 'Retour à la saisie', es: 'Volver a la entrada', de: 'Zurück zur Eingabe' },
  caseTimeline: { fa: 'خط زمانی مورد', en: 'Case Timeline', ar: 'الجدول الزمني للحالة', tr: 'Vaka Zaman Çizelgesi', fr: 'Chronologie du cas', es: 'Cronología del caso', de: 'Fall-Zeitleiste' },
  addSign: { fa: 'افزودن علامت', en: 'Add Sign', ar: 'إضافة علامة', tr: 'Belirti Ekle', fr: 'Ajouter un signe', es: 'Agregar signo', de: 'Symptom hinzufügen' },
  clear: { fa: 'پاک کردن', en: 'Clear', ar: 'مسح', tr: 'Temizle', fr: 'Effacer', es: 'Limpiar', de: 'Löschen' },
  runTests: { fa: 'اجرای آزمون‌ها', en: 'Run Tests', ar: 'تشغيل الاختبارات', tr: 'Testleri Çalıştır', fr: 'Lancer les tests', es: 'Ejecutar pruebas', de: 'Tests ausführen' },
  testResults: { fa: 'نتایج آزمون', en: 'Test Results', ar: 'نتائج الاختبار', tr: 'Test Sonuçları', fr: 'Résultats des tests', es: 'Resultados de pruebas', de: 'Testergebnisse' },
  allTestsPassed: { fa: 'همه آزمون‌ها موفق', en: 'All Tests Passed', ar: 'نجحت جميع الاختبارات', tr: 'Tüm Testler Başarılı', fr: 'Tous les tests ont réussi', es: 'Todas las pruebas pasaron', de: 'Alle Tests bestanden' },
  someTestsFailed: { fa: 'برخی آزمون‌ها ناموفق', en: 'Some Tests Failed', ar: 'فشلت بعض الاختبارات', tr: 'Bazı Testler Başarısız', fr: 'Certains tests ont échoué', es: 'Algunas pruebas fallaron', de: 'Einige Tests fehlgeschlagen' },

  // --- How It Works ---
  howItWorks: { fa: 'نحوه کار', en: 'How It Works', ar: 'كيف يعمل', tr: 'Nasıl Çalışır', fr: 'Comment ça marche', es: 'Cómo funciona', de: 'So funktioniert es' },
  step1: { fa: 'ورود داده‌های بالینی', en: 'Enter Clinical Data', ar: 'إدخال البيانات السريرية', tr: 'Klinik Verileri Girin', fr: 'Saisir les données cliniques', es: 'Ingresar datos clínicos', de: 'Klinische Daten eingeben' },
  step1Desc: { fa: 'اطلاعات حیوان و علائم بالینی را وارد کنید', en: 'Enter patient info and clinical signs', ar: 'أدخل معلومات المريض والعلامات السريرية', tr: 'Hasta bilgilerini ve klinik belirtileri girin', fr: 'Saisir les infos du patient et les signes cliniques', es: 'Ingrese información del paciente y signos clínicos', de: 'Patienteninformationen und klinische Symptome eingeben' },
  step2: { fa: 'استخراج وقایع', en: 'Fact Extraction', ar: 'استخراج الحقائق', tr: 'Olgu Çıkarımı', fr: 'Extraction des faits', es: 'Extracción de hechos', de: 'Faktextraktion' },
  step2Desc: { fa: 'سیستم داده‌ها را به وقایع ساختاریافته تبدیل می‌کند', en: 'System converts data to structured facts', ar: 'يحول النظام البيانات إلى حقائق منظمة', tr: 'Sistem verileri yapılandırılmış olgulara dönüştürür', fr: 'Le système convertit les données en faits structurés', es: 'El sistema convierte datos en hechos estructurados', de: 'Das System wandelt Daten in strukturierte Fakten um' },
  step3: { fa: 'ارزیابی قواعد', en: 'Rule Evaluation', ar: 'تقييم القواعد', tr: 'Kural Değerlendirme', fr: 'Évaluation des règles', es: 'Evaluación de reglas', de: 'Regelauswertung' },
  step3Desc: { fa: 'موتور قواعد منطقی را اعمال می‌کند', en: 'Rule engine applies logical rules', ar: 'يطبق محرك القواعد المنطقية', tr: 'Kural motoru mantıksal kuralları uygular', fr: 'Le moteur de règles applique des règles logiques', es: 'El motor de reglas aplica reglas lógicas', de: 'Regelmotor wendet logische Regeln an' },
  step4: { fa: 'تولید فرضیه‌ها', en: 'Hypothesis Generation', ar: 'توليد الفرضيات', tr: 'Hipotez Üretimi', fr: 'Génération d\'hypothèses', es: 'Generación de hipótesis', de: 'Hypothesengenerierung' },
  step4Desc: { fa: 'فرضیه‌های تفریقی تولید و رتبه‌بندی می‌شوند', en: 'Differential hypotheses are generated and ranked', ar: 'يتم توليد وترتيب الفرضيات التفريقية', tr: 'Ayırıcı tanı hipotezleri oluşturulur ve sıralanır', fr: 'Les hypothèses différentielles sont générées et classées', es: 'Se generan y clasifican hipótesis diferenciales', de: 'Differentialhypothese werden erstellt und bewertet' },
  step5: { fa: 'تحلیل شواهد', en: 'Evidence Analysis', ar: 'تحليل الأدلة', tr: 'Kanıt Analizi', fr: 'Analyse des preuves', es: 'Análisis de evidencia', de: 'Beweisanalyse' },
  step5Desc: { fa: 'شواهد موافق، مخالف و مفقود بررسی می‌شوند', en: 'Supporting, contradicting, missing evidence analyzed', ar: 'يتم تحليل الأدلة المؤيدة والمعارضة والمفقودة', tr: 'Destekleyici, çelişen ve eksik kanıtlar analiz edilir', fr: 'Preuves concordantes, contradictoires et manquantes analysées', es: 'Se analiza evidencia de apoyo, contradictoria y faltante', de: 'Stützende, widersprüchliche und fehlende Beweise werden analysiert' },
  step6: { fa: 'تصمیم‌گیری', en: 'Decision Support', ar: 'دعم القرار', tr: 'Karar Desteği', fr: 'Aide à la décision', es: 'Apoyo a la decisión', de: 'Entscheidungsunterstützung' },
  step6Desc: { fa: 'اقدامات بعدی پیشنهاد می‌شود', en: 'Next best actions recommended', ar: 'يتم اقتراح أفضل الإجراءات التالية', tr: 'Sonraki en iyi eylemler önerilir', fr: 'Les meilleures actions suivantes sont recommandées', es: 'Se recomiendan las mejores acciones siguientes', de: 'Die nächsten besten Aktionen werden empfohlen' },

  // --- Landing Page ---
  heroTitle: {
    fa: 'دستیار هوشمند تصمیم‌یار بالینی دامپزشکی',
    en: 'AI-Powered Veterinary Clinical Decision Support',
    ar: 'مساعد الذكاء الاصطناعي لدعم القرار السريري البيطري',
    tr: 'Yapay Zeka Destekli Veteriner Klinik Karar Desteği',
    fr: 'Aide à la Décision Clinique Vétérinaire par IA',
    es: 'Apoyo a la Decisión Clínica Veterinaria con IA',
    de: 'KI-gestützte tierärztliche Entscheidungsunterstützung',
  },
  heroSubtitle: {
    fa: 'ترکیب هوش مصنوعی، استدلال بالینی و منابع علمی دامپزشکی برای تصمیم‌گیری آگاهانه‌تر.',
    en: 'Combining AI, clinical reasoning, and veterinary scientific sources for smarter decision-making.',
    ar: 'الجمع بين الذكاء الاصطناعي والاستدلال السريري والمصادر العلمية البيطرية لاتخاذ قرارات أفضل.',
    tr: 'Daha akıllı kararlar için yapay zeka, klinik akıl yürütme ve veteriner bilimsel kaynaklarını birleştiren platform.',
    fr: 'Combinant IA, raisonnement clinique et sources scientifiques vétérinaires pour des décisions plus éclairées.',
    es: 'Combinando IA, razonamiento clínico y fuentes científicas veterinarias para decisiones más inteligentes.',
    de: 'Verbindung von KI, klinischem Schlussfolgern und veterinärwissenschaftlichen Quellen für bessere Entscheidungen.',
  },
  theProblem: { fa: 'مشکل', en: 'The Problem', ar: 'المشكلة', tr: 'Sorun', fr: 'Le problème', es: 'El problema', de: 'Das Problem' },
  theSolution: { fa: 'راه‌حل', en: 'The Solution', ar: 'الحل', tr: 'Çözüm', fr: 'La solution', es: 'La solución', de: 'Die Lösung' },
  whoWeServe: { fa: 'چه کسانی استفاده می‌کنند', en: 'Who We Serve', ar: 'من نخدم', tr: 'Kime Hizmet Veriyoruz', fr: 'Qui nous servons', es: 'A quién servimos', de: 'Wem wir dienen' },
  whyDifferent: { fa: 'چرا متفاوت است', en: 'Why It\'s Different', ar: 'لماذا هو مختلف', tr: 'Neden Farklı', fr: 'Pourquoi c\'est différent', es: 'Por qué es diferente', de: 'Warum es anders ist' },
  problemDesc: {
    fa: 'اطلاعات دامپزشکی در کتاب‌ها، مقالات، راهنماها، مراجع دارویی و وب‌سایت‌ها پراکنده است. دامپزشکان باید زیر فشار زمانی منابع متعددی را با هم تلفیق کنند.',
    en: 'Veterinary information is fragmented across textbooks, papers, guidelines, drug references, and websites. Professionals must integrate many sources under time pressure.',
    ar: 'المعلومات البيطرية متناثرة عبر الكتب والمقالات والإرشادات ومراجع الأدوية والمواقع. يجب على المهنيين دمج العديد من المصادر تحت ضغط الوقت.',
    tr: 'Veteriner bilgileri kitaplar, makaleler, kılavuzlar, ilaç referansları ve web siteleri arasında dağınıktır. Profesyoneller zaman baskısı altında birçok kaynağı entegre etmelidir.',
    fr: 'L\'information vétérinaire est fragmentée entre manuels, articles, directives, références pharmaceutiques et sites web. Les professionnels doivent intégrer de nombreuses sources sous pression temporelle.',
    es: 'La información veterinaria está fragmentada entre libros, artículos, guías, referencias de medicamentos y sitios web. Los profesionales deben integrar muchas fuentes bajo presión de tiempo.',
    de: 'Veterinärinformationen sind über Bücher, Artikel, Leitlinien, Arzneimittelreferenzen und Websites verstreut. Fachleute müssen viele Quellen unter Zeitdruck integrieren.',
  },
  solutionDesc: {
    fa: 'یک پلتفرم هوشمند کمک‌تصمیم‌گیری بالینی دامپزشکی که دانش دامپزشکی را حول گردش کار بالینی سازماندهی می‌کند.',
    en: 'An intelligent veterinary clinical decision-support platform that organizes veterinary knowledge around clinical workflow.',
    ar: 'منصة ذكية لدعم القرار السريري البيطري تنظم المعرفة البيطرية حول سير العمل السريري.',
    tr: 'Veteriner bilgisini klinik iş akışı etrafında düzenleyen akıllı bir veteriner klinik karar destek platformu.',
    fr: 'Une plateforme intelligente d\'aide à la décision clinique vétérinaire qui organise les connaissances vétérinaires autour du flux de travail clinique.',
    es: 'Una plataforma inteligente de apoyo a la decisión clínica veterinaria que organiza el conocimiento veterinario alrededor del flujo de trabajo clínico.',
    de: 'Eine intelligente Plattform für klinische Entscheidungsunterstützung, die veterinäres Wissen um den klinischen Arbeitsprozess organisiert.',
  },

  // --- Vaccination ---
  vaccinationAssistant: { fa: 'دستیار واکسیناسیون', en: 'Vaccination Assistant', ar: 'مساعد التطعيم', tr: 'Aşılama Asistanı', fr: 'Assistant de vaccination', es: 'Asistente de vacunación', de: 'Impf-Assistent' },
  vaccinationSchedule: { fa: 'برنامه واکسیناسیون', en: 'Vaccination Schedule', ar: 'جدول التطعيم', tr: 'Aşı Programı', fr: 'Calendrier de vaccination', es: 'Calendario de vacunación', de: 'Impfplan' },
  selectSpecies: { fa: 'نوع حیوان را انتخاب کنید', en: 'Select species', ar: 'اختر النوع', tr: 'Tür seçin', fr: 'Sélectionner l\'espèce', es: 'Seleccionar especie', de: 'Tierart auswählen' },
  needMoreInfo: { fa: 'برای ارائه برنامه دقیق، اطلاعات بیشتری لازم است', en: 'More information needed for an accurate schedule', ar: 'مطلوب مزيد من المعلومات لجدول دقيق', tr: 'Doğru bir program için daha fazla bilgi gerekli', fr: 'Plus d\'informations nécessaires pour un calendrier précis', es: 'Se necesita más información para un calendario preciso', de: 'Weitere Informationen für einen genauen Plan erforderlich' },

  // --- Pharmacology ---
  drugReference: { fa: 'مرجع دارویی', en: 'Drug Reference', ar: 'مرجع الأدوية', tr: 'İlaç Referansı', fr: 'Référence des médicaments', es: 'Referencia de medicamentos', de: 'Arzneimittelreferenz' },
  drugCalculator: { fa: 'محاسبه‌گر دارو', en: 'Drug Calculator', ar: 'حاسبة الأدوية', tr: 'İlaç Hesaplayıcı', fr: 'Calculateur de médicaments', es: 'Calculadora de medicamentos', de: 'Arzneimittelrechner' },
  searchDrug: { fa: 'جستجوی دارو...', en: 'Search drug...', ar: 'البحث عن دواء...', tr: 'İlaç ara...', fr: 'Rechercher un médicament...', es: 'Buscar medicamento...', de: 'Medikament suchen...' },
  weight: { fa: 'وزن (کیلوگرم)', en: 'Weight (kg)', ar: 'الوزن (كجم)', tr: 'Ağırlık (kg)', fr: 'Poids (kg)', es: 'Peso (kg)', de: 'Gewicht (kg)' },
  calculateDose: { fa: 'محاسبه دوز', en: 'Calculate Dose', ar: 'احسب الجرعة', tr: 'Dozu Hesapla', fr: 'Calculer la dose', es: 'Calcular dosis', de: 'Dosis berechnen' },
  contraindications: { fa: 'موارد منع مصرف', en: 'Contraindications', ar: 'موانع الاستعمال', tr: 'Kontrendikasyonlar', fr: 'Contre-indications', es: 'Contraindicaciones', de: 'Kontraindikationen' },
  adverseEffects: { fa: 'عوارض جانبی', en: 'Adverse Effects', ar: 'الآثار الجانبية', tr: 'Yan Etkiler', fr: 'Effets indésirables', es: 'Efectos adversos', de: 'Nebenwirkungen' },
  interactions: { fa: 'تداخل‌های دارویی', en: 'Drug Interactions', ar: 'التفاعلات الدوائية', tr: 'İlaç Etkileşimleri', fr: 'Interactions médicamenteuses', es: 'Interacciones medicamentosas', de: 'Wechselwirkungen' },
  withdrawalPeriod: { fa: 'دوره پرهیز دارویی', en: 'Withdrawal Period', ar: 'فترة السحب', tr: 'Geri Çekilme Süresi', fr: 'Délai d\'attente', es: 'Período de retiro', de: 'Wartezeit' },
  drugClass: { fa: 'کلاس دارویی', en: 'Drug Class', ar: 'فئة الدواء', tr: 'İlaç Sınıfı', fr: 'Classe de médicament', es: 'Clase de fármaco', de: 'Wirkstoffklasse' },
  mechanism: { fa: 'مکانیسم عمل', en: 'Mechanism of Action', ar: 'آلية العمل', tr: 'Etki Mekanizması', fr: 'Mécanisme d\'action', es: 'Mecanismo de acción', de: 'Wirkmechanismus' },
  indication: { fa: 'موارد مصرف', en: 'Indication', ar: 'الاستطباب', tr: 'Endikasyon', fr: 'Indication', es: 'Indicación', de: 'Indikation' },
  route: { fa: 'طریقه مصرف', en: 'Route', ar: 'طريق الإعطاء', tr: 'Uygulama Yolu', fr: 'Voie d\'administration', es: 'Vía', de: 'Applikationsweg' },
  frequency: { fa: 'فرکانس', en: 'Frequency', ar: 'التكرار', tr: 'Sıklık', fr: 'Fréquence', es: 'Frecuencia', de: 'Häufigkeit' },
  treatmentDuration: { fa: 'مدت درمان', en: 'Duration', ar: 'المدة', tr: 'Süre', fr: 'Durée', es: 'Duración', de: 'Dauer' },

  // --- Diagnostics ---
  diagnosticSupport: { fa: 'پشتیبان تشخیص', en: 'Diagnostic Support', ar: 'دعم التشخيص', tr: 'Tanı Desteği', fr: 'Support diagnostique', es: 'Soporte diagnóstico', de: 'Diagnostikunterstützung' },
  selectPanel: { fa: 'پنل را انتخاب کنید', en: 'Select panel', ar: 'اختر اللوحة', tr: 'Panel seçin', fr: 'Sélectionner le panel', es: 'Seleccionar panel', de: 'Panel auswählen' },
  referenceRanges: { fa: 'بازه‌های مرجع', en: 'Reference Ranges', ar: 'النطاقات المرجعية', tr: 'Referans Aralıkları', fr: 'Plages de référence', es: 'Rangos de referencia', de: 'Referenzbereiche' },
  clinicalSignificance: { fa: 'اهمیت بالینی', en: 'Clinical Significance', ar: 'الأهمية السريرية', tr: 'Klinik Önemi', fr: 'Signification clinique', es: 'Significancia clínica', de: 'Klinische Bedeutung' },
  hematology: { fa: 'هماتولوژی', en: 'Hematology', ar: 'أمراض الدم', tr: 'Hematoloji', fr: 'Hématologie', es: 'Hematología', de: 'Hämatologie' },
  biochemistry: { fa: 'بیوشیمی', en: 'Biochemistry', ar: 'الكيمياء الحيوية', tr: 'Biyokimya', fr: 'Biochimie', es: 'Bioquímica', de: 'Biochemie' },
  urinalysis: { fa: 'آزمایش ادرار', en: 'Urinalysis', ar: 'تحليل البول', tr: 'İdrar Analizi', fr: 'Analise d\'urine', es: 'Análisis de orina', de: 'Urinanalyse' },
  electrolytes: { fa: 'الکترولیت‌ها', en: 'Electrolytes', ar: 'الكهارل', tr: 'Elektrolitler', fr: 'Électrolytes', es: 'Electrolitos', de: 'Elektrolyte' },

  // --- Urgency ---
  urgency: { fa: 'میزان فوریت', en: 'Urgency', ar: 'مستوى الإلحاح', tr: 'Aciliyet', fr: 'Urgence', es: 'Urgencia', de: 'Dringlichkeit' },
  urgencyEmergency: { fa: 'اورژانسی', en: 'Emergency', ar: 'طوارئ', tr: 'Acil', fr: 'Urgence', es: 'Emergencia', de: 'Notfall' },
  urgent: { fa: 'نیازمند بررسی سریع', en: 'Needs prompt evaluation', ar: 'يحتاج تقييماً سريعاً', tr: 'Hızlı değerlendirme gerekli', fr: 'Évaluation rapide nécessaire', es: 'Necesita evaluación rápida', de: 'Schnelle Abklärung nötig' },
  routine: { fa: 'قابل پیگیری معمول', en: 'Routine follow-up', ar: 'متابعة روتينية', tr: 'Rutin takip', fr: 'Suivi de routine', es: 'Seguimiento rutinario', de: 'Routinetermin' },
  insufficientInfo: { fa: 'اطلاعات ناکافی', en: 'Insufficient information', ar: 'معلومات غير كافية', tr: 'Yetersiz bilgi', fr: 'Informations insuffisantes', es: 'Información insuficiente', de: 'Unzureichende Informationen' },
  needsImmediateEval: {
    fa: 'نیاز به ارزیابی فوری دامپزشکی',
    en: 'Immediate veterinary evaluation required',
    ar: 'يلزم تقييم بيطري فوري',
    tr: 'Acil veteriner değerlendirme gerekli',
    fr: 'Évaluation vétérinaire immédiate requise',
    es: 'Requiere evaluación veterinaria inmediata',
    de: 'Sofortige tierärztliche Untersuchung erforderlich',
  },

  // --- Contradictions ---
  contradictions: { fa: 'تناقضات اطلاعاتی', en: 'Contradictions', ar: 'التناقضات', tr: 'Çelişkiler', fr: 'Contradictions', es: 'Contradicciones', de: 'Widersprüche' },
  noContradictions: { fa: 'تناقضی یافت نشد', en: 'No contradictions found', ar: 'لم يتم العثور على تناقضات', tr: 'Çelişki bulunamadı', fr: 'Aucune contradiction trouvée', es: 'No se encontraron contradicciones', de: 'Keine Widersprüche gefunden' },

  // --- Settings ---
  language: { fa: 'زبان', en: 'Language', ar: 'اللغة', tr: 'Dil', fr: 'Langue', es: 'Idioma', de: 'Sprache' },
  role: { fa: 'نقش', en: 'Role', ar: 'الدور', tr: 'Rol', fr: 'Rôle', es: 'Rol', de: 'Rolle' },
  account: { fa: 'حساب کاربری', en: 'Account', ar: 'الحساب', tr: 'Hesap', fr: 'Compte', es: 'Cuenta', de: 'Konto' },
  save: { fa: 'ذخیره', en: 'Save', ar: 'حفظ', tr: 'Kaydet', fr: 'Enregistrer', es: 'Guardar', de: 'Speichern' },
  saved: { fa: 'ذخیره شد', en: 'Saved', ar: 'تم الحفظ', tr: 'Kaydedildi', fr: 'Enregistré', es: 'Guardado', de: 'Gespeichert' },

  // --- Case Management ---
  patientName: { fa: 'نام بیمار', en: 'Patient Name', ar: 'اسم المريض', tr: 'Hasta Adı', fr: 'Nom du patient', es: 'Nombre del paciente', de: 'Patientenname' },
  chiefComplaint: { fa: 'شکایت اصلی', en: 'Chief Complaint', ar: 'الشكوى الرئيسية', tr: 'Ana Şikayet', fr: 'Plainte principale', es: 'Queja principal', de: 'Hauptbeschwerde' },
  history: { fa: 'سابقه', en: 'History', ar: 'السجل', tr: 'Öykü', fr: 'Antécédents', es: 'Historial', de: 'Anamnese' },
  workingDiagnosis: { fa: 'تشخیص کاری', en: 'Working Diagnosis', ar: 'التشخيص العمليةي', tr: 'Çalışma Tanısı', fr: 'Diagnostic de travail', es: 'Diagnóstico de trabajo', de: 'Arbeitsdiagnose' },
  treatment: { fa: 'درمان', en: 'Treatment', ar: 'العلاج', tr: 'Tedavi', fr: 'Traitement', es: 'Tratamiento', de: 'Behandlung' },
  followUp: { fa: 'پیگیری', en: 'Follow-up', ar: 'المتابعة', tr: 'Takip', fr: 'Suivi', es: 'Seguimiento', de: 'Nachkontrolle' },
  saveCase: { fa: 'ذخیره مورد', en: 'Save Case', ar: 'حفظ الحالة', tr: 'Vakayı Kaydet', fr: 'Enregistrer le cas', es: 'Guardar caso', de: 'Fall speichern' },
  openCase: { fa: 'باز کردن مورد', en: 'Open Case', ar: 'فتح الحالة', tr: 'Vakayı Aç', fr: 'Ouvrir le cas', es: 'Abrir caso', de: 'Fall öffnen' },
  deleteCase: { fa: 'حذف مورد', en: 'Delete Case', ar: 'حذف الحالة', tr: 'Vakayı Sil', fr: 'Supprimer le cas', es: 'Eliminar caso', de: 'Fall löschen' },
  noOutputYet: {
    fa: 'هنوز کیسی اجرا نشده',
    en: 'No case has been run yet',
    ar: 'لم يتم تشغيل أي حالة بعد',
    tr: 'Henüz vaka çalıştırılmadı',
    fr: 'Aucun cas n\'a encore été lancé',
    es: 'No se ha ejecutado ningún caso aún',
    de: 'Noch kein Fall ausgeführt',
  },

  // --- Misc ---
  close: { fa: 'بستن', en: 'Close', ar: 'إغلاق', tr: 'Kapat', fr: 'Fermer', es: 'Cerrar', de: 'Schließen' },
  search: { fa: 'جستجو', en: 'Search', ar: 'بحث', tr: 'Ara', fr: 'Rechercher', es: 'Buscar', de: 'Suchen' },
  apply: { fa: 'اعمال', en: 'Apply', ar: 'تطبيق', tr: 'Uygula', fr: 'Appliquer', es: 'Aplicar', de: 'Anwenden' },
  yes: { fa: 'بله', en: 'Yes', ar: 'نعم', tr: 'Evet', fr: 'Oui', es: 'Sí', de: 'Ja' },
  no: { fa: 'خیر', en: 'No', ar: 'لا', tr: 'Hayır', fr: 'Non', es: 'No', de: 'Nein' },
  confirm: { fa: 'تأیید', en: 'Confirm', ar: 'تأكيد', tr: 'Onayla', fr: 'Confirmer', es: 'Confirmar', de: 'Bestätigen' },
  cancel: { fa: 'انصراف', en: 'Cancel', ar: 'إلغاء', tr: 'İptal', fr: 'Annuler', es: 'Cancelar', de: 'Abbrechen' },

  // --- Next Best Question ---
  nextBestQuestion: { fa: 'بهترین سوال بعدی', en: 'Next Best Question', ar: 'أفضل سؤال تالٍ', tr: 'Sonraki En İyi Soru', fr: 'Prochaine meilleure question', es: 'Mejor pregunta siguiente', de: 'Nächstbeste Frage' },

  // --- Trial Status ---
  trialStatus: { fa: 'وضعیت آزمایش', en: 'Trial Status', ar: 'حالة التجربة', tr: 'Deneme Durumu', fr: 'Statut d\'essai', es: 'Estado de prueba', de: 'Teststatus' },
  trial_active: { fa: 'آزمایش فعال', en: 'Trial Active', ar: 'التجربة نشطة', tr: 'Deneme Aktif', fr: 'Essai actif', es: 'Prueba activa', de: 'Test aktiv' },
  trial_expiring: { fa: 'آزمایش در حال انقضا', en: 'Trial Expiring Soon', ar: 'التجربة تنتهي قريباً', tr: 'Deneme Yakında Sona Eriyor', fr: 'Essai expire bientôt', es: 'Prueba por expirar', de: 'Test läuft bald ab' },
  trial_expired: { fa: 'آزمایش منقضی شد', en: 'Trial Expired', ar: 'انتهت التجربة', tr: 'Deneme Sona Erdi', fr: 'Essai expiré', es: 'Prueba expirada', de: 'Test abgelaufen' },
  subscribed: { fa: 'مشترک', en: 'Subscribed', ar: 'مشترك', tr: 'Abone', fr: 'Abonné', es: 'Suscrito', de: 'Abonniert' },
};

export function tr(key: string, lang: Lang): string {
  const entry = translations[key];
  if (!entry) return key;
  const val = entry[lang] || entry['en'];
  if (typeof val === 'function') return val(0);
  return typeof val === 'string' ? val : key;
}

export function trFn(key: string, lang: Lang, n: number): string {
  const entry = translations[key];
  if (!entry) return key;
  const val = entry[lang] || entry['en'];
  if (typeof val === 'function') return val(n);
  return typeof val === 'string' ? val : key;
}

export function trRole(role: UserRole, lang: Lang): string {
  return tr(`role_${role}`, lang);
}
