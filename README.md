# VetRay — Veterinary Clinical Reasoning Engine

> An explainable, rule-based clinical decision support system for veterinary medicine, inspired by the **Logic Theorist** (1956) — one of the first AI programs capable of logical reasoning.

## Overview

VetRay is a web application that takes structured clinical input (species, signs, history, lab findings) and produces **ranked differential hypotheses** with a fully **explainable reasoning path**. It does not provide a definitive diagnosis — it shows *why* each hypothesis was considered, what evidence supports or contradicts it, what evidence is still missing, and what the clinician should check next.

The core product is a reasoning pipeline:

```
Clinical Input → Fact Extraction → Rule Evaluation → Inference → Hypothesis Generation → Ranking → Evidence Analysis → Explanation → Decision Support
```

## Problem

Veterinary professionals and students need tools that don't just list possible diseases but show the **logical chain of reasoning** behind each conclusion. Black-box diagnostic tools provide answers without explanation, making them unsuitable for clinical education and decision support.

## Solution

VetRay implements a transparent, rule-based reasoning engine where every step is visible:

- **Facts** are extracted from user input and stored as structured data
- **Rules** (logical IF-THEN conditions) are evaluated against facts
- **Inferences** are drawn from fired rules
- **Hypotheses** are generated, ranked, and presented with full evidence breakdowns
- **Explanations** show the exact path from input to conclusion

## Architecture

```
src/
  types/           TypeScript type definitions
  knowledge/       JSON-style knowledge base (signs, diseases, rules, red flags, cases)
    clinicalSigns.ts
    diseases.ts
    rules.ts
    redFlags.ts
    sampleCases.ts
  engine/          Reasoning engine (pure logic, no UI)
    reasoningEngine.ts
    tests.ts
  lib/             Shared utilities
    i18n.ts
  App.tsx          UI components and views
```

### Reasoning Engine Modules

| Module | Responsibility |
|--------|---------------|
| Fact Engine | Converts raw clinical input into structured facts |
| Rule Engine | Evaluates IF-THEN rules against facts (AND/OR logic) |
| Inference Engine | Runs all species-relevant rules, collects fired rules |
| Hypothesis Engine | Groups fired rules by disease, calculates confidence |
| Ranking Engine | Sorts hypotheses by confidence score, red-flags first |
| Explanation Engine | Builds reasoning path + interactive reasoning tree |
| Red Flag Engine | Independently checks for emergency signs |
| Decision Support | Recommends next tests and information to collect |

### Key Design Principles

1. **Separation of knowledge and logic** — The knowledge base (diseases, rules, signs) is completely separate from the reasoning engine. New diseases can be added without touching engine code.
2. **Explainability first** — Every hypothesis includes its reasoning path, fired rules, and evidence breakdown.
3. **Forward chaining** — The engine reasons from facts forward to conclusions.
4. **Uncertainty handling** — Confidence levels (high, moderate, low, insufficient) replace definitive claims.
5. **Red flag independence** — Emergency detection runs independently of the hypothesis engine.

## Knowledge Base

### Clinical Signs
70+ boolean signs organized by system: general, respiratory, GI, neurological, dermatological, urogenital, musculoskeletal, cardiovascular, ophthalmic, behavioral, laboratory, and history/environmental.

### Diseases
17 diseases across species (dog, cat) including:
- Canine Distemper, Parvovirus, Kennel Cough, Influenza
- Feline Panleukopenia, URI, FLUTD
- GDV, Flea Allergy Dermatitis, Sarcoptic Mange
- Tick-Borne Disease, Diabetes, CKD, Hepatic Disease
- Intoxication, Congestive Heart Failure, IVDD

### Rules
30+ rules with structured conditions, evidence levels (strong/moderate/weak), priorities (high/medium/low), and human-readable explanations. Each rule references a disease and produces a conclusion when fired.

### Red Flags
13 independent red flag definitions for emergency signs (respiratory distress, seizures, urinary blockage, GDV, toxin exposure, etc.) that trigger immediate alerts regardless of hypothesis ranking.

## Usage

1. **New Case** — Enter patient info (species, age, sex), select clinical signs, vaccination status, environmental factors, and lab findings.
2. **Run Reasoning** — The engine processes input through the full pipeline.
3. **View Results** — Navigate through:
   - **Reasoning** — Step-by-step reasoning path
   - **Hypotheses** — Ranked differential diagnoses with expandable details
   - **Evidence** — Supporting/missing evidence and required tests per hypothesis
   - **Reasoning Tree** — Interactive tree visualization
   - **Decision Support** — Next best information to collect
   - **Case Summary** — Complete case overview

### Sample Cases
8 pre-built sample cases are available for testing, covering parvovirus, feline URI, kennel cough, distemper, FLUTD, flea allergy, tick-borne disease, and diabetes.

## Testing

The engine includes 15 unit tests covering:
- Fact extraction and inference
- Rule evaluation (AND/OR logic, species filtering)
- Hypothesis generation and ranking
- Red flag detection
- Confidence level assignment
- Missing evidence identification
- Full pipeline output structure

Run tests in the **Engine Tests** tab within the app.

## Rule Structure

```json
{
  "id": "CD-002",
  "name": "Distemper with Neurological Signs",
  "diseaseId": "canine_distemper",
  "conditions": [
    { "fact": "fever", "operator": "equals", "value": true },
    { "fact": "cough", "operator": "equals", "value": true },
    { "fact": "seizures", "operator": "equals", "value": true }
  ],
  "conditionLogic": "AND",
  "conclusion": "distemper_strongly_supported",
  "evidenceLevel": "strong",
  "priority": "high",
  "explanation": "The combination of fever, respiratory signs, and seizures is highly suspicious for canine distemper..."
}
```

## Roadmap

- [ ] Backend API (FastAPI + PostgreSQL) for persistent case storage
- [ ] Machine learning confidence calibration
- [ ] Additional knowledge bases: dermatology, neurology, large animal medicine
- [ ] Backward chaining for targeted questioning
- [ ] Multi-language expansion
- [ ] Veterinary education mode with teaching annotations
- [ ] Case comparison and outcome tracking

## Disclaimer

> This application is an educational and clinical decision-support tool. It does not provide a definitive diagnosis and does not replace professional veterinary examination, diagnostic testing, or clinical judgment.

> این سامانه یک ابزار آموزشی و کمک‌تصمیم‌گیری بالینی است و تشخیص قطعی ارائه نمی‌دهد و جایگزین معاینه دامپزشکی، آزمایش‌های تشخیصی یا قضاوت حرفه‌ای دامپزشک نیست.

## License

MIT
