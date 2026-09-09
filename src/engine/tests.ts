import { extractFacts, evaluateRule, runInference, generateHypotheses, rankHypotheses, checkRedFlags, runReasoning } from '@/engine/reasoningEngine';
import { rules } from '@/knowledge/rules';
import type { ClinicalInput, Rule } from '@/types';

function assert(condition: boolean, message: string): { pass: boolean; message: string } {
  return { pass: condition, message };
}

export interface TestResult {
  name: string;
  pass: boolean;
  message: string;
}

export function runAllTests(): TestResult[] {
  const results: TestResult[] = [];

  // ===== Test 001: Fact extraction =====
  {
    const input: ClinicalInput = {
      species: 'dog',
      ageYears: 0.5,
      signs: { fever: true, cough: true, nasal_discharge: true },
      vaccinationStatus: 'incomplete',
    };
    const facts = extractFacts(input);
    const hasFever = facts.find(f => f.name === 'fever');
    const hasYoungAge = facts.find(f => f.name === 'young_age');
    const hasVaxIncomplete = facts.find(f => f.name === 'vaccination_incomplete');
    const r = assert(
      !!hasFever && hasFever.value === true &&
      !!hasYoungAge && hasYoungAge.value === true &&
      !!hasVaxIncomplete && hasVaxIncomplete.value === true,
      'Fact extraction should produce fever, young_age, and vaccination_incomplete facts'
    );
    results.push({ name: 'Test 001: Fact Extraction', ...r });
  }

  // ===== Test 002: Rule evaluation — AND logic, all conditions met =====
  {
    const input: ClinicalInput = {
      species: 'dog',
      signs: { fever: true, cough: true, nasal_discharge: true },
    };
    const facts = extractFacts(input);
    const rule = rules.find(r => r.id === 'CD-001')!;
    const fired = evaluateRule(rule, facts);
    const r = assert(fired !== null, 'Rule CD-001 should fire when fever, cough, and nasal_discharge are all present');
    results.push({ name: 'Test 002: Rule CD-001 fires (AND logic)', ...r });
  }

  // ===== Test 003: Rule evaluation — AND logic, conditions not met =====
  {
    const input: ClinicalInput = {
      species: 'dog',
      signs: { fever: false, cough: false, nasal_discharge: false },
    };
    const facts = extractFacts(input);
    const rule = rules.find(r => r.id === 'CD-001')!;
    const fired = evaluateRule(rule, facts);
    const r = assert(fired === null, 'Rule CD-001 should NOT fire when no conditions are met');
    results.push({ name: 'Test 003: Rule CD-001 does not fire (no conditions)', ...r });
  }

  // ===== Test 004: Species filtering — cat rule should not fire for dog =====
  {
    const input: ClinicalInput = {
      species: 'dog',
      signs: { sneezing: true, nasal_discharge: true, ocular_discharge: true },
    };
    const facts = extractFacts(input);
    const fired = runInference(facts, 'dog');
    const felineURIRule = fired.find(fr => fr.rule.diseaseId === 'feline_uri');
    const r = assert(!felineURIRule, 'Feline URI rule should NOT fire for a dog');
    results.push({ name: 'Test 004: Species filtering (cat rule for dog)', ...r });
  }

  // ===== Test 005: Parvovirus hypothesis generation =====
  {
    const input: ClinicalInput = {
      species: 'dog',
      ageYears: 0.3,
      signs: {
        bloody_diarrhea: true,
        vomiting: true,
        lethargy: true,
        anorexia: true,
        fever: true,
      },
      vaccinationStatus: 'incomplete',
    };
    const facts = extractFacts(input);
    const fired = runInference(facts, 'dog');
    const hypotheses = generateHypotheses(facts, fired);
    const parvo = hypotheses.find(h => h.disease.id === 'canine_parvovirus');
    const r = assert(!!parvo && parvo.confidenceScore > 0, 'Parvovirus hypothesis should be generated with positive score');
    results.push({ name: 'Test 005: Parvovirus hypothesis generation', ...r });
  }

  // ===== Test 006: Ranking — higher confidence should rank first =====
  {
    const input: ClinicalInput = {
      species: 'dog',
      ageYears: 0.5,
      signs: {
        fever: true,
        cough: true,
        nasal_discharge: true,
        seizures: true,
        ataxia: true,
        lethargy: true,
      },
      vaccinationStatus: 'incomplete',
    };
    const output = runReasoning(input);
    const r = assert(
      output.hypotheses.length > 0 && output.hypotheses[0].rank === 1,
      'Top hypothesis should have rank 1'
    );
    results.push({ name: 'Test 006: Hypothesis ranking', ...r });
  }

  // ===== Test 007: Red flag detection — respiratory distress =====
  {
    const input: ClinicalInput = {
      species: 'dog',
      signs: { respiratory_distress: true, cough: true },
    };
    const facts = extractFacts(input);
    const redFlags = checkRedFlags(facts);
    const r = assert(
      redFlags.length > 0 && redFlags.some(rf => rf.flag.fact === 'respiratory_distress'),
      'Respiratory distress should trigger a red flag'
    );
    results.push({ name: 'Test 007: Red flag detection (respiratory distress)', ...r });
  }

  // ===== Test 008: Red flag detection — seizures =====
  {
    const input: ClinicalInput = {
      species: 'dog',
      signs: { seizures: true, lethargy: true },
    };
    const facts = extractFacts(input);
    const redFlags = checkRedFlags(facts);
    const r = assert(
      redFlags.some(rf => rf.flag.fact === 'seizures'),
      'Seizures should trigger a red flag'
    );
    results.push({ name: 'Test 008: Red flag detection (seizures)', ...r });
  }

  // ===== Test 009: No hypotheses when no signs =====
  {
    const input: ClinicalInput = {
      species: 'dog',
      signs: {},
    };
    const output = runReasoning(input);
    const r = assert(
      output.hypotheses.length === 0,
      'No hypotheses should be generated when no clinical signs are present'
    );
    results.push({ name: 'Test 009: No hypotheses for empty input', ...r });
  }

  // ===== Test 010: Reasoning tree structure =====
  {
    const input: ClinicalInput = {
      species: 'dog',
      signs: { fever: true, cough: true, nasal_discharge: true },
    };
    const output = runReasoning(input);
    const r = assert(
      output.reasoningTree.children.length >= 2,
      'Reasoning tree should have at least facts and rules nodes'
    );
    results.push({ name: 'Test 010: Reasoning tree structure', ...r });
  }

  // ===== Test 011: Feline URI for cat =====
  {
    const input: ClinicalInput = {
      species: 'cat',
      signs: { sneezing: true, nasal_discharge: true, ocular_discharge: true, conjunctivitis: true },
    };
    const output = runReasoning(input);
    const uri = output.hypotheses.find(h => h.disease.id === 'feline_uri');
    const r = assert(!!uri, 'Feline URI hypothesis should be generated for cat with URI signs');
    results.push({ name: 'Test 011: Feline URI hypothesis', ...r });
  }

  // ===== Test 012: Decision support generation =====
  {
    const input: ClinicalInput = {
      species: 'dog',
      ageYears: 0.3,
      signs: { bloody_diarrhea: true, vomiting: true, lethargy: true },
      vaccinationStatus: 'incomplete',
    };
    const output = runReasoning(input);
    const r = assert(
      output.decisionSupport.length > 0,
      'Decision support should have recommendations when hypotheses exist'
    );
    results.push({ name: 'Test 012: Decision support generation', ...r });
  }

  // ===== Test 013: Confidence levels =====
  {
    const input: ClinicalInput = {
      species: 'dog',
      ageYears: 0.3,
      signs: { bloody_diarrhea: true, vomiting: true, lethargy: true, anorexia: true, fever: true },
      vaccinationStatus: 'incomplete',
    };
    const output = runReasoning(input);
    const r = assert(
      output.hypotheses[0]?.confidence === 'high' || output.hypotheses[0]?.confidence === 'moderate',
      'Strong clinical picture should yield moderate or high confidence'
    );
    results.push({ name: 'Test 013: Confidence level assignment', ...r });
  }

  // ===== Test 014: Backward chaining — missing evidence =====
  {
    const input: ClinicalInput = {
      species: 'dog',
      signs: { fever: true, cough: true, nasal_discharge: true },
      vaccinationStatus: 'incomplete',
    };
    const output = runReasoning(input);
    const distemper = output.hypotheses.find(h => h.disease.id === 'canine_distemper');
    const r = assert(
      !!distemper && distemper.missingEvidence.length > 0,
      'Distemper hypothesis should have missing evidence (e.g., neurological signs not provided)'
    );
    results.push({ name: 'Test 014: Missing evidence identification', ...r });
  }

  // ===== Test 015: Full pipeline output structure =====
  {
    const input: ClinicalInput = {
      species: 'dog',
      signs: { fever: true, cough: true },
    };
    const output = runReasoning(input);
    const r = assert(
      output.facts.length > 0 &&
      output.reasoningPath.length > 0 &&
      output.reasoningTree !== undefined &&
      output.summary.length > 0,
      'Full pipeline should produce facts, reasoning path, tree, and summary'
    );
    results.push({ name: 'Test 015: Full pipeline output structure', ...r });
  }

  return results;
}
