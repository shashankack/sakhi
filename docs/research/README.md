# Research docs

**Branch:** `research`  
**Owns:** `research/corpus/**`, `docs/research/**`

Educational markdown for local RAG. Not medical advice. Not diagnosis criteria for a chatbot to apply as a verdict.

## Quick start for Research teammate

1. Checkout `research`.
2. Read `CORPUS_GUIDE.md`.
3. Add/edit files only under `research/corpus/`.
4. Update `CHANGELOG.md`.
5. PR into `dev`.

## Corpus structure

| File | theme_ids | urgency_default |
|------|-----------|-----------------|
| `pcos-overview.md` | all 8 | routine |
| `cycles-irregular.md` | cycle_irregularity | soon |
| `hirsutism-acne.md` | hirsutism, acne | routine |
| `weight-insulin.md` | weight_insulin | routine |
| `mood-fatigue.md` | mood, fatigue | routine |
| `hair-loss.md` | hair_loss | routine |
| `fertility-pcos.md` | fertility_concerns, cycle_irregularity | soon |
| `overlap-thyroid-prolactin.md` | cycle_irregularity, fatigue, weight_insulin, hair_loss, mood, fertility_concerns | routine |
| `red-flags-when-urgent.md` | cycle_irregularity, mood, fertility_concerns (+ `red_flag_file: true`) | urgent |
| `care-pathways.md` | all 8 | routine |
| `glossary-lay-aliases.md` | all 8 (alias map) | routine |
| `glossary-tamil-aliases.md` | all 8 (Tamil / Tanglish alias map) | routine |
| `pcod-vs-pcos.md` | cycle_irregularity, hirsutism, acne, weight_insulin | routine |
| `painful-periods.md` | cycle_irregularity, fatigue, mood | routine |
| `endometriosis.md` | fertility_concerns, fatigue, cycle_irregularity | soon |
| `heavy-periods.md` | cycle_irregularity, fatigue, hair_loss | soon |
| `pms-pmdd.md` | mood, fatigue, acne, weight_insulin | routine |
| `diet-lifestyle-pcos.md` | weight_insulin, fatigue, mood, cycle_irregularity | routine |
| `adolescent-pcos.md` | cycle_irregularity, acne, hirsutism, weight_insulin, mood | routine |
| `pregnancy-and-pcos.md` | fertility_concerns, weight_insulin | soon |
| `myths-and-facts.md` | all 8 | routine |
| `menstrual-cycle-basics.md` | cycle_irregularity | routine |
| `first-period-puberty.md` | cycle_irregularity, acne | routine |
| `anaemia-and-periods.md` | fatigue, cycle_irregularity, hair_loss | routine |
| `pcos-long-term-health.md` | weight_insulin, mood, cycle_irregularity, fatigue | routine |
| `tests-and-scans-explained.md` | cycle_irregularity, hirsutism, weight_insulin, fertility_concerns | routine |
| `exercise-and-yoga-pcos.md` | weight_insulin, mood, fatigue | routine |
| `indian-diet-pcos.md` | weight_insulin, fatigue | routine |
| `sleep-stress-pcos.md` | fatigue, mood | routine |
| `period-hygiene-products.md` | cycle_irregularity | routine |
| `body-image-and-emotional-health.md` | mood, hirsutism, acne, weight_insulin, hair_loss | routine |

Total: 31 corpus files (plus `research/corpus/README.md`, which ML skips).

### Frontmatter

```yaml
---
theme_ids: [cycle_irregularity]   # only ids from docs/contracts/THEME_IDS.md
urgency_default: soon             # routine | soon | urgent
red_flag_file: true               # only on red-flags-when-urgent.md
---
```

### Section headings (stable, for chunking)

Every topic file uses these `##` headings in this order:

1. `## Plain-language explanation`
2. `## PCOS education context`
3. `## Other possible causes and overlaps`
4. `## Self-care notes`
5. `## Care pathway`
6. `## Questions for a clinician`
7. `## Lay aliases`

Some files add extra `##` sections (for example `## Red flag 1: …`, `## Who's who`, `## Phrase map by theme`). Treat any `##` heading as a chunk boundary and the heading text as `sources[].section`.

## Sources and accuracy rules

Every fact in the corpus must trace to a page listed in [`SOURCES.md`](SOURCES.md), which also maps each corpus file to its sources.

- Trusted sources only: WHO, NHS, NICE, International PCOS Guideline 2023 (Monash/ESHRE), ACOG, FOGSI, ICMR, MedlinePlus, CDC.
- Read the actual page before writing. No facts from memory. No numbers unless the source states them exactly.
- If a fact cannot be verified, leave it out.
- No URLs inside corpus files; sources go in `SOURCES.md`.
- **Naming:** PCOS was renamed **PMOS** (polyendocrine metabolic ovarian syndrome) in 2026 (NHS, MedlinePlus). Corpus files say "PCOS (now also called PMOS)" and include PMOS and PCOD as lay aliases.
- **Urgency levels** map to NHS advice tiers: `urgent` = call 999 / A&E (India: 108), `soon` = urgent GP / NHS 111, `routine` = non-urgent GP. See `research/corpus/care-pathways.md`.
- **India numbers used:** Tele-MANAS 14416 / 1800-89-14416 and ambulance 108. The number 112 is not used because it could not be verified (see `SOURCES.md`).

Before any public release, a clinician should review the corpus.
