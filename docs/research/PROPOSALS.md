# Research proposals (for other roles)

Add dated notes when you need Integration/ML/UI to change something you cannot edit.

## Template

```text
Date:
Need from: Integration | ML | UI
Request:
Why:
```

## Open proposals

```text
Date: 2026-10-15
Need from: ML
Request: Chunk corpus files on `##` headings and use the heading text as `sources[].section`.
         Read frontmatter `theme_ids` for theme mapping and `urgency_default` as a floor for care.urgency.
         Treat `red_flag_file: true` (red-flags-when-urgent.md) as the source for urgent guidance;
         the "Lay aliases" sections and glossary-lay-aliases.md can seed the red-flag / theme keyword rules.
Why: Stable headings across all 11 files are documented in docs/research/README.md → Corpus structure.
```

```text
Date: 2026-10-15
Need from: Integration
Request: The research agent prompt cites requirements/product.md, security/safety-policy.md and design/copy-safety.md,
         but none exist on this branch (only ADCE stubs requirements/overview.md, security/policy.md, design/overview.md, all untracked).
         Please either add the canonical files on `dev` or update the prompt references.
Why: Research used docs/contracts/* and docs/README.md non-negotiables as the safety source in the meantime.
```

```text
Date: 2026-10-15
Need from: UI / Integration
Request: When red_flags is non-empty, show the India ambulance number 108 and Tele-MANAS (14416 / 1800-89-14416) as plain text.
Why: The corpus includes these numbers; showing them in the UI too keeps crisis guidance visible even if retrieval is weak.
Update 2026-10-15: 112 removed from the corpus because no page confirming it could be opened during the fact-check (see SOURCES.md).
```

```text
Date: 2026-10-15
Need from: Integration (contracts, UI copy) / ML (aliases)
Request: PCOS was renamed PMOS (polyendocrine metabolic ovarian syndrome) in 2026. NHS and MedlinePlus now use PMOS.
         Please consider (1) mentioning PMOS alongside PCOS in UI copy and disclaimers, and
         (2) adding "PMOS" and "PCOD" to ML's alias / keyword lists so they retrieve PCOS content.
         Theme IDs do not need to change.
Why: Users may hear the new name from doctors or news; the corpus already says "PCOS (now also called PMOS)".
```

```text
Date: 2026-10-15
Need from: Integration (team decision)
Request: Confirm whether official Government of India pages (MoHFW / DGHS for Tele-MANAS, National Health Mission for 108)
         may be used as sources. They are not on the trusted-source list, but no listed source covers Indian helplines.
Why: These two pages are the only sources for the Tele-MANAS and 108 numbers in the corpus (SOURCES.md S16, S18).
```

```text
Date: 2026-10-15
Need from: Integration
Request: Consider adding theme ids for period pain and heavy bleeding (e.g. `period_pain`, `heavy_bleeding`).
Why: painful-periods.md, heavy-periods.md, endometriosis.md and anaemia-and-periods.md currently borrow the nearest ids
     (cycle_irregularity, fatigue), which may blur retrieval.
```
