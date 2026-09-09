// ============================================================
// Core Type System for Veterinary Clinical Intelligence Platform
// ============================================================

// --- Languages ---

export type Lang = 'fa' | 'en' | 'ar' | 'tr' | 'fr' | 'es' | 'de';

export const RTL_LANGS: Lang[] = ['fa', 'ar'];

export const LANG_LABELS: Record<Lang, { native: string; flag: string; english: string }> = {
  fa: { native: 'فارسی', flag: '🇮🇷', english: 'Persian' },
  en: { native: 'English', flag: '🇬🇧', english: 'English' },
  ar: { native: 'العربية', flag: '🇸🇦', english: 'Arabic' },
  tr: { native: 'Türkçe', flag: '🇹🇷', english: 'Turkish' },
  fr: { native: 'Français', flag: '🇫🇷', english: 'French' },
  es: { native: 'Español', flag: '🇪🇸', english: 'Spanish' },
  de: { native: 'Deutsch', flag: '🇩🇪', english: 'German' },
};

export function isRTL(lang: Lang): boolean {
  return RTL_LANGS.includes(lang);
}

// --- User Roles ---

export type UserRole =
  | 'small_animal_vet'
  | 'large_animal_vet'
  | 'equine_vet'
  | 'poultry_vet'
  | 'vet_student'
  | 'vet_technician'
  | 'vaccinator'
  | 'farmer'
  | 'poultry_producer'
  | 'pet_owner'
  | 'horse_owner'
  | 'breeder'
  | 'other';

export const USER_ROLES: { id: UserRole; icon: string }[] = [
  { id: 'small_animal_vet', icon: '🐕' },
  { id: 'large_animal_vet', icon: '🐄' },
  { id: 'equine_vet', icon: '🐎' },
  { id: 'poultry_vet', icon: '🐔' },
  { id: 'vet_student', icon: '🎓' },
  { id: 'vet_technician', icon: '🩺' },
  { id: 'vaccinator', icon: '💉' },
  { id: 'farmer', icon: '🚜' },
  { id: 'poultry_producer', icon: '🏭' },
  { id: 'pet_owner', icon: '🏠' },
  { id: 'horse_owner', icon: '🏇' },
  { id: 'breeder', icon: '🐾' },
  { id: 'other', icon: '👤' },
];

// --- Trial / Subscription ---

export type TrialState = 'trial_active' | 'trial_expiring' | 'trial_expired' | 'subscribed';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole | null;
  preferredLang: Lang;
  trialStartedAt: string | null;
  trialEndsAt: string | null;
  subscribed: boolean;
  createdAt: string;
}

// --- Species ---

export type Species = 'dog' | 'cat' | 'bird' | 'rabbit' | 'horse' | 'cattle' | 'sheep' | 'goat' | 'buffalo' | 'chicken' | 'turkey' | 'other';

export type SpeciesCategory = 'small_animal' | 'equine' | 'large_animal' | 'poultry';

export const SPECIES_CATEGORY: Record<Species, SpeciesCategory> = {
  dog: 'small_animal',
  cat: 'small_animal',
  rabbit: 'small_animal',
  bird: 'small_animal',
  horse: 'equine',
  cattle: 'large_animal',
  sheep: 'large_animal',
  goat: 'large_animal',
  buffalo: 'large_animal',
  chicken: 'poultry',
  turkey: 'poultry',
  other: 'small_animal',
};

// --- Clinical Reasoning Core ---

export type Severity = 'mild' | 'moderate' | 'severe' | 'critical';
export type Operator = 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'any_of';
export type EvidenceLevel = 'strong' | 'moderate' | 'weak';
export type Confidence = 'high' | 'moderate' | 'low' | 'insufficient';
export type RulePriority = 'high' | 'medium' | 'low';

// --- Clinical Input ---

export interface ClinicalInput {
  species: Species;
  breed?: string;
  ageYears?: number;
  sex?: 'male' | 'female' | 'unknown';
  signs: Record<string, boolean | number | string>;
  vaccinationStatus?: 'complete' | 'incomplete' | 'unknown';
  previousMedications?: string;
  environmentalFactors?: string[];
  labFindings?: Record<string, boolean | number | string>;
  durationDays?: number;
  timeline?: TimelineEvent[];
}

export interface TimelineEvent {
  day: number;
  sign: string;
  note?: string;
}

// --- Facts ---

export interface Fact {
  id: string;
  name: string;
  label: string;
  value: boolean | number | string;
  source: 'user_input' | 'inferred' | 'lab';
  category: 'patient' | 'clinical_sign' | 'lab' | 'history' | 'environment';
}

// --- Rules ---

export interface RuleCondition {
  fact: string;
  operator: Operator;
  value: boolean | number | string | string[];
}

export interface Rule {
  id: string;
  name: string;
  description: string;
  diseaseId: string;
  conditions: RuleCondition[];
  conditionLogic: 'AND' | 'OR';
  conclusion: string;
  evidenceLevel: EvidenceLevel;
  priority: RulePriority;
  explanation: string;
  produces?: string[];
}

// --- Diseases / Hypotheses ---

export interface Disease {
  id: string;
  name: string;
  nameFa: string;
  species: Species[];
  category: string;
  categoryFa: string;
  description: string;
  descriptionFa: string;
  associatedFacts: string[];
  redFlag?: boolean;
}

// --- Clinical Signs Catalog ---

export interface ClinicalSignDef {
  id: string;
  name: string;
  label: string;
  labelFa: string;
  category: string;
  categoryFa: string;
  type: 'boolean' | 'select' | 'number';
  options?: string[];
  species?: Species[];
  redFlag?: boolean;
  redFlagMessage?: string;
  redFlagMessageFa?: string;
}

// --- Red Flags ---

export interface RedFlagDef {
  id: string;
  fact: string;
  label: string;
  labelFa: string;
  message: string;
  messageFa: string;
  action: string;
  actionFa: string;
}

// --- Engine Output ---

export interface FiredRule {
  rule: Rule;
  matchedConditions: RuleCondition[];
  unmatchedConditions: RuleCondition[];
  conclusion: string;
}

export interface HypothesisResult {
  disease: Disease;
  firedRules: FiredRule[];
  supportingFacts: Fact[];
  contradictingFacts: Fact[];
  missingEvidence: string[];
  requiredTests: { label: string; labelFa: string }[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  confidence: Confidence;
  confidenceScore: number;
  reasoningPath: ReasoningStep[];
  rank: number;
}

export interface ReasoningStep {
  step: number;
  type: 'fact' | 'rule' | 'inference' | 'hypothesis';
  title: string;
  detail: string;
  factName?: string;
  ruleId?: string;
  diseaseId?: string;
}

export interface ReasoningTreeNode {
  id: string;
  label: string;
  labelFa: string;
  type: 'input' | 'fact' | 'rule' | 'syndrome' | 'hypothesis';
  children: ReasoningTreeNode[];
  detail?: string;
  diseaseId?: string;
  ruleId?: string;
  confidence?: Confidence;
  score?: number;
}

export interface RedFlagResult {
  flag: RedFlagDef;
  fact: Fact;
}

export interface DecisionSupportItem {
  label: string;
  labelFa: string;
  reason: string;
  reasonFa: string;
  priority: 'high' | 'medium' | 'low';
}

export interface Contradiction {
  field: string;
  value1: string;
  value2: string;
  message: string;
  messageFa: string;
}

export interface NextBestQuestion {
  factName: string;
  question: string;
  questionFa: string;
  rationale: string;
  rationaleFa: string;
  clinicalValue: 'high' | 'medium' | 'low';
}

export interface ReasoningOutput {
  facts: Fact[];
  firedRules: FiredRule[];
  hypotheses: HypothesisResult[];
  redFlags: RedFlagResult[];
  decisionSupport: DecisionSupportItem[];
  reasoningPath: ReasoningStep[];
  reasoningTree: ReasoningTreeNode;
  confidence: Confidence;
  summary: string;
  summaryFa: string;
  contradictions: Contradiction[];
  nextBestQuestions: NextBestQuestion[];
  urgency: 'emergency' | 'urgent' | 'routine' | 'insufficient_info';
}

// --- Sample Cases ---

export interface SampleCase {
  id: string;
  title: string;
  titleFa: string;
  description: string;
  descriptionFa: string;
  input: ClinicalInput;
}

// --- Saved Case (database-backed) ---

export interface SavedCase {
  id: string;
  user_id: string;
  patient_name: string | null;
  species: Species;
  breed: string | null;
  age_years: number | null;
  sex: string | null;
  weight: number | null;
  chief_complaint: string | null;
  history: string | null;
  vaccination_status: string | null;
  previous_medications: string | null;
  clinical_input: ClinicalInput | null;
  reasoning_output: ReasoningOutput | null;
  working_diagnosis: string | null;
  treatment: string | null;
  follow_up: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

// --- Evidence / Knowledge Sources ---

export type EvidenceTier = 'tier1' | 'tier2' | 'tier3' | 'tier4';

export interface KnowledgeSource {
  id: string;
  title: string;
  author: string;
  year: number;
  edition?: string;
  journal?: string;
  doi?: string;
  evidenceType: string;
  species: Species[];
  specialty: string;
  evidenceLevel: EvidenceLevel;
  tier: EvidenceTier;
  reviewDate: string;
  status: 'verified' | 'needs_review' | 'outdated' | 'conflicting';
}

// --- Vaccination ---

export interface VaccinationSchedule {
  id: string;
  species: Species;
  disease: string;
  diseaseFa: string;
  vaccineName: string;
  vaccineNameFa: string;
  ageFirstDose: string;
  boosterInterval: string;
  revaccination: string;
  notes: string;
  notesFa: string;
  evidenceLevel: EvidenceLevel;
}

// --- Pharmacology ---

export interface DrugInfo {
  id: string;
  genericName: string;
  genericNameFa: string;
  drugClass: string;
  drugClassFa: string;
  species: Species[];
  indication: string;
  indicationFa: string;
  mechanism: string;
  mechanismFa: string;
  doseMgPerKg: string;
  route: string;
  routeFa: string;
  frequency: string;
  frequencyFa: string;
  duration: string;
  durationFa: string;
  contraindications: string;
  contraindicationsFa: string;
  adverseEffects: string;
  adverseEffectsFa: string;
  interactions: string;
  interactionsFa: string;
  monitoring: string;
  monitoringFa: string;
  withdrawalPeriod: string | null;
  withdrawalPeriodFa: string | null;
  specialPopulations: string;
  specialPopulationsFa: string;
  evidenceLevel: EvidenceLevel;
}

// --- Diagnostic Reference Ranges ---

export interface DiagnosticPanel {
  id: string;
  name: string;
  nameFa: string;
  category: 'hematology' | 'biochemistry' | 'urinalysis' | 'fecal' | 'cytology' | 'microbiology' | 'parasitology' | 'imaging' | 'ecg' | 'blood_gas' | 'electrolytes';
  species: Species[];
  parameters: DiagnosticParameter[];
}

export interface DiagnosticParameter {
  name: string;
  nameFa: string;
  unit: string;
  unitFa: string;
  referenceRange: { min: number; max: number } | string;
  referenceRangeFa: { min: number; max: number } | string;
  clinicalSignificance: string;
  clinicalSignificanceFa: string;
}
