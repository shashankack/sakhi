# Research changelog

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
