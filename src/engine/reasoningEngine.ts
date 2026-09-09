import type {
  ClinicalInput,
  Fact,
  Rule,
  RuleCondition,
  FiredRule,
  HypothesisResult,
  ReasoningStep,
  ReasoningTreeNode,
  RedFlagResult,
  DecisionSupportItem,
  ReasoningOutput,
  Confidence,
  Disease,
  Species,
  Contradiction,
  NextBestQuestion,
} from '@/types';
import { rules } from '@/knowledge/rules';
import { diseases } from '@/knowledge/diseases';
import { diseaseRequiredTests } from '@/knowledge/rules';
import { redFlags } from '@/knowledge/redFlags';
import { clinicalSigns } from '@/knowledge/clinicalSigns';

// ============================================================
// Fact Engine — converts raw input into structured facts
// ============================================================

export function extractFacts(input: ClinicalInput): Fact[] {
  const facts: Fact[] = [];
  let idx = 0;

  // Patient facts
  facts.push({
    id: `fact_${idx++}`,
    name: 'species',
    label: 'Species',
    value: input.species,
    source: 'user_input',
    category: 'patient',
  });

  if (input.ageYears !== undefined) {
    facts.push({
      id: `fact_${idx++}`,
      name: 'age_years',
      label: 'Age (years)',
      value: input.ageYears,
      source: 'user_input',
      category: 'patient',
    });
    if (input.ageYears < 1) {
      facts.push({
        id: `fact_${idx++}`,
        name: 'young_age',
        label: 'Young age (< 1 year)',
        value: true,
        source: 'inferred',
        category: 'patient',
      });
    }
  }

  if (input.sex) {
    facts.push({
      id: `fact_${idx++}`,
      name: 'sex',
      label: 'Sex',
      value: input.sex,
      source: 'user_input',
      category: 'patient',
    });
  }

  // Vaccination facts
  if (input.vaccinationStatus === 'incomplete') {
    facts.push({
      id: `fact_${idx++}`,
      name: 'vaccination_incomplete',
      label: 'Vaccination incomplete',
      value: true,
      source: 'user_input',
      category: 'history',
    });
  }
  if (input.vaccinationStatus === 'incomplete' || input.vaccinationStatus === 'unknown') {
    facts.push({
      id: `fact_${idx++}`,
      name: 'unvaccinated',
      label: 'Unvaccinated / Unknown status',
      value: true,
      source: 'inferred',
      category: 'history',
    });
  }

  // Environmental factors → facts
  if (input.environmentalFactors) {
    for (const factor of input.environmentalFactors) {
      facts.push({
        id: `fact_${idx++}`,
        name: factor,
        label: factor.replace(/_/g, ' '),
        value: true,
        source: 'user_input',
        category: 'environment',
      });
    }
  }

  // Clinical signs → facts
  for (const [signName, signValue] of Object.entries(input.signs)) {
    if (signValue === true || (typeof signValue === 'string' && signValue) || (typeof signValue === 'number' && signValue > 0)) {
      const signDef = clinicalSigns.find(s => s.name === signName);
      facts.push({
        id: `fact_${idx++}`,
        name: signName,
        label: signDef?.label || signName,
        value: signValue,
        source: 'user_input',
        category: 'clinical_sign',
      });
    }
  }

  // Lab findings → facts
  if (input.labFindings) {
    for (const [labName, labValue] of Object.entries(input.labFindings)) {
      if (labValue === true || (typeof labValue === 'number' && labValue > 0)) {
        const signDef = clinicalSigns.find(s => s.name === labName);
        facts.push({
          id: `fact_${idx++}`,
          name: labName,
          label: signDef?.label || labName,
          value: labValue,
          source: 'lab',
          category: 'lab',
        });
      }
    }
  }

  // Duration fact
  if (input.durationDays !== undefined) {
    facts.push({
      id: `fact_${idx++}`,
      name: 'duration_days',
      label: 'Duration (days)',
      value: input.durationDays,
      source: 'user_input',
      category: 'history',
    });
  }

  return facts;
}

// ============================================================
// Rule Engine — evaluates rules against facts
// ============================================================

function getFactValue(facts: Fact[], name: string): boolean | number | string | undefined {
  const fact = facts.find(f => f.name === name);
  return fact?.value;
}

function evaluateCondition(condition: RuleCondition, facts: Fact[]): boolean {
  const factValue = getFactValue(facts, condition.fact);
  if (factValue === undefined) return false;

  switch (condition.operator) {
    case 'equals':
      return factValue === condition.value;
    case 'not_equals':
      return factValue !== condition.value;
    case 'contains':
      return typeof factValue === 'string' && typeof condition.value === 'string' && factValue.includes(condition.value);
    case 'greater_than':
      return typeof factValue === 'number' && typeof condition.value === 'number' && factValue > condition.value;
    case 'less_than':
      return typeof factValue === 'number' && typeof condition.value === 'number' && factValue < condition.value;
    case 'any_of':
      return Array.isArray(condition.value) && condition.value.includes(factValue as string);
    default:
      return false;
  }
}

export function evaluateRule(rule: Rule, facts: Fact[]): FiredRule | null {
  const matched: RuleCondition[] = [];
  const unmatched: RuleCondition[] = [];

  for (const condition of rule.conditions) {
    if (evaluateCondition(condition, facts)) {
      matched.push(condition);
    } else {
      unmatched.push(condition);
    }
  }

  const fired = rule.conditionLogic === 'AND' ? matched.length === rule.conditions.length : matched.length > 0;

  if (!fired) return null;

  return {
    rule,
    matchedConditions: matched,
    unmatchedConditions: unmatched,
    conclusion: rule.conclusion,
  };
}

// ============================================================
// Species Filter — only evaluate rules for relevant species
// ============================================================

function ruleAppliesToSpecies(rule: Rule, species: Species): boolean {
  const disease = diseases.find(d => d.id === rule.diseaseId);
  if (!disease) return false;
  return disease.species.includes(species) || disease.species.includes('other');
}

// ============================================================
// Inference Engine — runs all rules, collects fired rules
// ============================================================

export function runInference(facts: Fact[], species: Species): FiredRule[] {
  const firedRules: FiredRule[] = [];
  for (const rule of rules) {
    if (!ruleAppliesToSpecies(rule, species)) continue;
    const fired = evaluateRule(rule, facts);
    if (fired) firedRules.push(fired);
  }
  return firedRules;
}

// ============================================================
// Hypothesis Engine — groups fired rules into hypotheses
// ============================================================

const evidenceWeights: Record<string, number> = {
  strong: 40,
  moderate: 25,
  weak: 10,
};

const priorityWeights: Record<string, number> = {
  high: 1.3,
  medium: 1.0,
  low: 0.7,
};

export function generateHypotheses(facts: Fact[], firedRules: FiredRule[]): HypothesisResult[] {
  // Group fired rules by disease
  const rulesByDisease = new Map<string, FiredRule[]>();
  for (const fr of firedRules) {
    const existing = rulesByDisease.get(fr.rule.diseaseId) || [];
    existing.push(fr);
    rulesByDisease.set(fr.rule.diseaseId, existing);
  }

  const hypotheses: HypothesisResult[] = [];

  for (const [diseaseId, diseaseFiredRules] of rulesByDisease) {
    const disease = diseases.find(d => d.id === diseaseId);
    if (!disease) continue;

    // Supporting facts: facts referenced in matched conditions
    const supportingFactNames = new Set<string>();
    for (const fr of diseaseFiredRules) {
      for (const cond of fr.matchedConditions) {
        supportingFactNames.add(cond.fact);
      }
    }
    const supportingFacts = facts.filter(f => supportingFactNames.has(f.name));

    // Contradicting facts: associated facts that are explicitly false in input
    // (We check if any associated fact was explicitly provided as false)
    const contradictingFacts: Fact[] = [];

    // Missing evidence: associated facts not present in input
    const presentFactNames = new Set(facts.map(f => f.name));
    const missingEvidence = disease.associatedFacts.filter(
      fn => !presentFactNames.has(fn) && !supportingFactNames.has(fn)
    );

    // Required tests
    const requiredTests = diseaseRequiredTests[diseaseId] || [];

    // Calculate confidence score
    let rawScore = 0;
    for (const fr of diseaseFiredRules) {
      const ew = evidenceWeights[fr.rule.evidenceLevel] || 10;
      const pw = priorityWeights[fr.rule.priority] || 1.0;
      rawScore += ew * pw;
    }
    // Normalize: more supporting facts → higher score, but cap at 100
    const supportRatio = disease.associatedFacts.length > 0
      ? supportingFactNames.size / disease.associatedFacts.length
      : 0;
    const confidenceScore = Math.min(100, Math.round(rawScore * (0.5 + supportRatio * 0.5)));

    // Determine confidence level
    let confidence: Confidence;
    if (confidenceScore >= 70) confidence = 'high';
    else if (confidenceScore >= 40) confidence = 'moderate';
    else if (confidenceScore >= 20) confidence = 'low';
    else confidence = 'insufficient';

    // Risk level
    let riskLevel: 'low' | 'medium' | 'high' | 'critical';
    if (disease.redFlag) riskLevel = 'critical';
    else if (confidenceScore >= 60) riskLevel = 'high';
    else if (confidenceScore >= 30) riskLevel = 'medium';
    else riskLevel = 'low';

    // Build reasoning path for this hypothesis
    const reasoningPath = buildHypothesisReasoning(disease, diseaseFiredRules, supportingFacts, missingEvidence);

    hypotheses.push({
      disease,
      firedRules: diseaseFiredRules,
      supportingFacts,
      contradictingFacts,
      missingEvidence,
      requiredTests,
      riskLevel,
      confidence,
      confidenceScore,
      reasoningPath,
      rank: 0, // will be set by ranking engine
    });
  }

  return hypotheses;
}

function buildHypothesisReasoning(
  disease: Disease,
  firedRules: FiredRule[],
  supportingFacts: Fact[],
  missingEvidence: string[]
): ReasoningStep[] {
  const steps: ReasoningStep[] = [];
  let stepNum = 1;

  // Step 1: Present facts
  for (const fact of supportingFacts) {
    steps.push({
      step: stepNum++,
      type: 'fact',
      title: `Fact: ${fact.label}`,
      detail: `${fact.label} = ${typeof fact.value === 'boolean' ? 'present' : fact.value}`,
      factName: fact.name,
    });
  }

  // Step 2: Rules fired
  for (const fr of firedRules) {
    steps.push({
      step: stepNum++,
      type: 'rule',
      title: `Rule ${fr.rule.id}: ${fr.rule.name}`,
      detail: fr.rule.explanation,
      ruleId: fr.rule.id,
    });
  }

  // Step 3: Inference
  steps.push({
    step: stepNum++,
    type: 'inference',
    title: `Inference → ${disease.name}`,
    detail: `Based on ${firedRules.length} fired rule(s) and ${supportingFacts.length} supporting fact(s), the system generates a hypothesis for ${disease.name}.`,
    diseaseId: disease.id,
  });

  // Step 4: Missing evidence
  if (missingEvidence.length > 0) {
    steps.push({
      step: stepNum++,
      type: 'inference',
      title: 'Missing Evidence',
      detail: `${missingEvidence.length} fact(s) that would strengthen or weaken this hypothesis are not yet available: ${missingEvidence.join(', ')}`,
    });
  }

  return steps;
}

// ============================================================
// Ranking Engine — sorts hypotheses by confidence score
// ============================================================

export function rankHypotheses(hypotheses: HypothesisResult[]): HypothesisResult[] {
  const sorted = [...hypotheses].sort((a, b) => {
    // Red-flag diseases first
    if (a.disease.redFlag && !b.disease.redFlag) return -1;
    if (!a.disease.redFlag && b.disease.redFlag) return 1;
    // Then by score
    return b.confidenceScore - a.confidenceScore;
  });
  sorted.forEach((h, i) => { h.rank = i + 1; });
  return sorted;
}

// ============================================================
// Explanation Engine — builds global reasoning path + tree
// ============================================================

export function buildExplanation(
  facts: Fact[],
  firedRules: FiredRule[],
  hypotheses: HypothesisResult[]
): { path: ReasoningStep[]; tree: ReasoningTreeNode } {
  const path: ReasoningStep[] = [];
  let step = 1;

  // Phase 1: Facts
  const clinicalFacts = facts.filter(f => f.category === 'clinical_sign' || f.category === 'lab');
  path.push({
    step: step++,
    type: 'fact',
    title: 'Fact Extraction',
    detail: `${clinicalFacts.length} clinical finding(s) extracted from input and converted to structured facts.`,
  });

  for (const fact of clinicalFacts) {
    path.push({
      step: step++,
      type: 'fact',
      title: `Fact: ${fact.label}`,
      detail: `${fact.label} = ${typeof fact.value === 'boolean' ? 'present' : fact.value}`,
      factName: fact.name,
    });
  }

  // Phase 2: Rule evaluation
  path.push({
    step: step++,
    type: 'rule',
    title: 'Rule Evaluation',
    detail: `${rules.length} rules evaluated against extracted facts. ${firedRules.length} rule(s) fired.`,
  });

  for (const fr of firedRules) {
    path.push({
      step: step++,
      type: 'rule',
      title: `Rule ${fr.rule.id} fired: ${fr.rule.name}`,
      detail: fr.rule.explanation,
      ruleId: fr.rule.id,
    });
  }

  // Phase 3: Hypothesis generation
  path.push({
    step: step++,
    type: 'hypothesis',
    title: 'Hypothesis Generation',
    detail: `${hypotheses.length} hypothesis/hypotheses generated from fired rules and ranked by confidence.`,
  });

  for (const h of hypotheses) {
    path.push({
      step: step++,
      type: 'hypothesis',
      title: `Hypothesis #${h.rank}: ${h.disease.name}`,
      detail: `Confidence: ${h.confidence} (score: ${h.confidenceScore}). Supporting facts: ${h.supportingFacts.length}. Missing evidence: ${h.missingEvidence.length}.`,
      diseaseId: h.disease.id,
    });
  }

  // Build reasoning tree
  const tree = buildReasoningTree(facts, firedRules, hypotheses);

  return { path, tree };
}

function buildReasoningTree(
  facts: Fact[],
  firedRules: FiredRule[],
  hypotheses: HypothesisResult[]
): ReasoningTreeNode {
  const root: ReasoningTreeNode = {
    id: 'root',
    label: 'Clinical Case',
    labelFa: 'کیس بالینی',
    type: 'input',
    children: [],
  };

  // Group clinical facts by category
  const factsByCategory = new Map<string, Fact[]>();
  for (const fact of facts) {
    if (fact.category === 'clinical_sign' || fact.category === 'lab') {
      const existing = factsByCategory.get(fact.category) || [];
      existing.push(fact);
      factsByCategory.set(fact.category, existing);
    }
  }

  const factsNode: ReasoningTreeNode = {
    id: 'facts',
    label: 'Clinical Findings',
    labelFa: 'یافته‌های بالینی',
    type: 'fact',
    children: [],
  };

  for (const [, categoryFacts] of factsByCategory) {
    for (const fact of categoryFacts) {
      factsNode.children.push({
        id: `fact_${fact.id}`,
        label: fact.label,
        labelFa: fact.label,
        type: 'fact',
        children: [],
        detail: `Source: ${fact.source}`,
      });
    }
  }
  root.children.push(factsNode);

  // Rules node
  const rulesNode: ReasoningTreeNode = {
    id: 'rules',
    label: 'Rules Evaluated',
    labelFa: 'قواعد ارزیابی‌شده',
    type: 'rule',
    children: [],
  };

  for (const fr of firedRules) {
    rulesNode.children.push({
      id: `rule_${fr.rule.id}`,
      label: `${fr.rule.id}: ${fr.rule.name}`,
      labelFa: `${fr.rule.id}: ${fr.rule.name}`,
      type: 'rule',
      children: [],
      detail: fr.rule.explanation,
      ruleId: fr.rule.id,
    });
  }
  root.children.push(rulesNode);

  // Hypotheses node
  const hypNode: ReasoningTreeNode = {
    id: 'hypotheses',
    label: 'Differential Hypotheses',
    labelFa: 'فرضیه‌های تفریقی',
    type: 'hypothesis',
    children: [],
  };

  for (const h of hypotheses) {
    const hNode: ReasoningTreeNode = {
      id: `hyp_${h.disease.id}`,
      label: `#${h.rank} ${h.disease.name}`,
      labelFa: `#${h.rank} ${h.disease.nameFa}`,
      type: 'hypothesis',
      children: [],
      diseaseId: h.disease.id,
      confidence: h.confidence,
      score: h.confidenceScore,
      detail: h.disease.description,
    };

    // Supporting facts as children
    if (h.supportingFacts.length > 0) {
      hNode.children.push({
        id: `hyp_${h.disease.id}_support`,
        label: `Supporting (${h.supportingFacts.length})`,
        labelFa: `شواهد موافق (${h.supportingFacts.length})`,
        type: 'fact',
        children: h.supportingFacts.map(f => ({
          id: `hyp_${h.disease.id}_sup_${f.id}`,
          label: f.label,
          labelFa: f.label,
          type: 'fact',
          children: [],
        })),
      });
    }

    // Missing evidence as children
    if (h.missingEvidence.length > 0) {
      hNode.children.push({
        id: `hyp_${h.disease.id}_missing`,
        label: `Missing (${h.missingEvidence.length})`,
        labelFa: `شواهد مفقود (${h.missingEvidence.length})`,
        type: 'fact',
        children: h.missingEvidence.map(m => ({
          id: `hyp_${h.disease.id}_miss_${m}`,
          label: m.replace(/_/g, ' '),
          labelFa: m.replace(/_/g, ' '),
          type: 'fact',
          children: [],
        })),
      });
    }

    hypNode.children.push(hNode);
  }
  root.children.push(hypNode);

  return root;
}

// ============================================================
// Red Flag Engine — checks for emergency signs
// ============================================================

export function checkRedFlags(facts: Fact[]): RedFlagResult[] {
  const results: RedFlagResult[] = [];
  for (const flag of redFlags) {
    const fact = facts.find(f => f.name === flag.fact && f.value === true);
    if (fact) {
      results.push({ flag, fact });
    }
  }
  return results;
}

// ============================================================
// Decision Support Engine — recommends next steps
// ============================================================

export function generateDecisionSupport(hypotheses: HypothesisResult[]): DecisionSupportItem[] {
  const items: DecisionSupportItem[] = [];
  const seenTests = new Set<string>();

  // Collect required tests from top hypotheses
  const topHypotheses = hypotheses.slice(0, 3);
  for (const h of topHypotheses) {
    for (const test of h.requiredTests) {
      if (!seenTests.has(test.label)) {
        seenTests.add(test.label);
        items.push({
          label: test.label,
          labelFa: test.labelFa,
          reason: `Recommended to evaluate ${h.disease.name}`,
          reasonFa: `برای ارزیابی ${h.disease.nameFa}`,
          priority: h.rank === 1 ? 'high' : h.rank === 2 ? 'medium' : 'low',
        });
      }
    }
  }

  // Add general recommendations based on missing evidence
  for (const h of topHypotheses) {
    if (h.missingEvidence.length > 3 && h.confidence !== 'high') {
      items.push({
        label: 'Collect additional clinical history',
        labelFa: 'تکمیل تاریخچه بالینی',
        reason: `Hypothesis "${h.disease.name}" has ${h.missingEvidence.length} missing data points. More information would improve reasoning accuracy.`,
        reasonFa: `فرضیه «${h.disease.nameFa}» ${h.missingEvidence.length} داده مفقود دارد. اطلاعات بیشتر دقت استدلال را بالا می‌برد.`,
        priority: 'medium',
      });
    }
  }

  return items;
}

// ============================================================
// Main Pipeline — runs the full reasoning chain
// ============================================================

export function runReasoning(input: ClinicalInput): ReasoningOutput {
  // 1. Extract facts
  const facts = extractFacts(input);

  // 2. Run inference
  const firedRules = runInference(facts, input.species);

  // 3. Generate hypotheses
  const hypotheses = generateHypotheses(facts, firedRules);

  // 4. Rank hypotheses
  const rankedHypotheses = rankHypotheses(hypotheses);

  // 5. Check red flags
  const redFlagResults = checkRedFlags(facts);

  // 6. Build explanation
  const { path, tree } = buildExplanation(facts, firedRules, rankedHypotheses);

  // 7. Decision support
  const decisionSupport = generateDecisionSupport(rankedHypotheses);

  // 8. Overall confidence
  const topScore = rankedHypotheses[0]?.confidenceScore || 0;
  let overallConfidence: Confidence;
  if (topScore >= 70) overallConfidence = 'high';
  else if (topScore >= 40) overallConfidence = 'moderate';
  else if (topScore >= 20) overallConfidence = 'low';
  else overallConfidence = 'insufficient';

  // 9. Summary
  const summary = rankedHypotheses.length > 0
    ? `${rankedHypotheses.length} hypothesis/hypotheses generated. Top hypothesis: ${rankedHypotheses[0].disease.name} (${rankedHypotheses[0].confidence} confidence). ${redFlagResults.length} red flag(s) detected.`
    : `No hypotheses generated from the provided clinical findings. ${redFlagResults.length} red flag(s) detected. Consider providing additional clinical signs.`;

  const summaryFa = rankedHypotheses.length > 0
    ? `${rankedHypotheses.length} فرضیه تولید شد. فرضیه اصلی: ${rankedHypotheses[0].disease.nameFa} (اطمینان: ${rankedHypotheses[0].confidence}). ${redFlagResults.length} پرچم قرمز شناسایی شد.`
    : `از یافته‌های ارائه‌شده فرضیه‌ای تولید نشد. ${redFlagResults.length} پرچم قرمز شناسایی شد. علائم بالینی بیشتری وارد کنید.`;

  // 10. Contradiction detection
  const contradictions: Contradiction[] = [];
  if (input.ageYears !== undefined && input.ageYears < 0) {
    contradictions.push({
      field: 'age',
      value1: String(input.ageYears),
      value2: '>= 0',
      message: 'Age cannot be negative.',
      messageFa: 'سن نمی‌تواند منفی باشد.',
    });
  }

  // 11. Next best questions — identify high-value missing info from top hypotheses
  const nextBestQuestions: NextBestQuestion[] = [];
  for (const h of rankedHypotheses.slice(0, 3)) {
    for (const missing of h.missingEvidence.slice(0, 3)) {
      const signDef = clinicalSigns.find(s => s.name === missing);
      const question = signDef
        ? `Is "${signDef.label}" present?`
        : `Is "${missing.replace(/_/g, ' ')}" present or has it been checked?`;
      const questionFa = signDef
        ? `آیا «${signDef.labelFa}» وجود دارد؟`
        : `آیا «${missing.replace(/_/g, ' ')}» وجود دارد یا بررسی شده است؟`;
      nextBestQuestions.push({
        factName: missing,
        question,
        questionFa,
        rationale: `This finding is relevant to the hypothesis: ${h.disease.name}. Confirming or excluding it would meaningfully adjust the differential ranking.`,
        rationaleFa: `این یافته برای فرضیه ${h.disease.nameFa} مرتبط است. تأیید یا رد آن رتبه‌بندی افتراقی را به‌طور معناداری تغییر می‌دهد.`,
        clinicalValue: h.rank === 1 ? 'high' : 'medium',
      });
    }
  }

  // 12. Urgency determination
  let urgency: ReasoningOutput['urgency'] = 'routine';
  if (redFlagResults.length > 0) {
    urgency = 'emergency';
  } else if (rankedHypotheses.some(h => h.riskLevel === 'high' || h.riskLevel === 'critical')) {
    urgency = 'urgent';
  } else if (rankedHypotheses.length === 0) {
    urgency = 'insufficient_info';
  }

  return {
    facts,
    firedRules,
    hypotheses: rankedHypotheses,
    redFlags: redFlagResults,
    decisionSupport,
    reasoningPath: path,
    reasoningTree: tree,
    confidence: overallConfidence,
    summary,
    summaryFa,
    contradictions,
    nextBestQuestions: nextBestQuestions.slice(0, 5),
    urgency,
  };
}
