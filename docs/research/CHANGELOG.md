# Research changelog

## 2026-10-15 (fact-check pass)

- **Fact-checked all 21 existing corpus files** against pages opened on 2026-10-15 (WHO, NHS, 2023 International PCOS Guideline, MedlinePlus, ICMR-NIN). Unverified facts removed; corrected facts listed below. All sources are in the new `SOURCES.md`.
- **Naming:** added PMOS (polyendocrine metabolic ovarian syndrome), the 2026 new name for PCOS, across files and aliases.
- **Corrected:** prevalence 8–13% → WHO "10–13%"; fertility "12 months under 35 / 6 months 35+" → NHS "after a year; sooner if 36 or over"; Tele-MANAS number format → 1800-89-14416; heavy-bleeding emergency rule → NHS pelvic-pain and pregnancy-bleeding wording.
- **Removed (could not verify):** India emergency number 112 (108 kept); "lose 5–10% of weight"; "ultrasound not used within 8 years of first period" (replaced by NHS "only if over 18" and guideline "no clear criteria in teenagers"); "soak a pad every hour for 2+ hours"; claims that PCOD is an older name for PCOS; myths about shaving, marriage, and body size; specific hair-loss types; non-classic CAH; prostaglandins; calcium and caffeine tips for PMS; miscarriage and preterm-birth risks in pregnancy; "Tele-MANAS has Tamil"; ovulation-kit reliability; ASHA workers.
- **Added 10 files:** `menstrual-cycle-basics.md`, `first-period-puberty.md`, `anaemia-and-periods.md`, `pcos-long-term-health.md`, `tests-and-scans-explained.md`, `exercise-and-yoga-pcos.md`, `indian-diet-pcos.md`, `sleep-stress-pcos.md`, `period-hygiene-products.md`, `body-image-and-emotional-health.md`, each with Hinglish and Tanglish aliases. Corpus is now 31 files.
- **Added** `docs/research/SOURCES.md`; updated README (file table, accuracy rules) and PROPOSALS (PMOS naming, Indian helpline sources, period-pain/heavy-bleeding theme ids).

## 2026-10-15

- Added 10 corpus files: `pcod-vs-pcos.md`, `painful-periods.md`, `endometriosis.md`, `heavy-periods.md`,
  `pms-pmdd.md`, `diet-lifestyle-pcos.md`, `adolescent-pcos.md`, `pregnancy-and-pcos.md`, `myths-and-facts.md`,
  `glossary-tamil-aliases.md`. Corpus is now 21 files.
- New files add Tamil / Tanglish lay aliases (Tamil script + romanised, with plain-English meanings). Tamil phrases still need a native-speaker check.
- Period pain and heavy bleeding have no theme id yet; they are tagged with the closest existing ids.

## Unreleased

- Added minimum demo corpus (11 files) under `research/corpus/`:
  `pcos-overview.md`, `cycles-irregular.md`, `hirsutism-acne.md`, `weight-insulin.md`,
  `mood-fatigue.md`, `hair-loss.md`, `fertility-pcos.md`, `overlap-thyroid-prolactin.md`,
  `red-flags-when-urgent.md`, `care-pathways.md`, `glossary-lay-aliases.md`.
- Every frozen theme id from `docs/contracts/THEME_IDS.md` is covered by at least one file.
- Standardised `##` section headings across topic files (see `README.md` → Corpus structure) so ML can chunk by section.
- Frontmatter: `theme_ids`, `urgency_default` (`routine` | `soon` | `urgent`); `red-flags-when-urgent.md` also sets `red_flag_file: true`.
- Lay aliases include English, Hinglish (romanised), and Hindi (Devanagari), covering demo phrases such as "periods nahi aaye", "chehre pe baal", "weight badh raha hai".
- Red flags cover heavy bleeding with dizziness, severe pelvic/abdominal pain, pregnancy concerns, self-harm (Tele-MANAS 14416 / 1-800-891-4416), and chest pain/breathlessness (112 / 108).
- No drug names with dosages and no diagnostic verdict language.

## Earlier

- Docs hub created; corpus guide defined.
