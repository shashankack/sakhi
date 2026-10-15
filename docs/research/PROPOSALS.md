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
Request: When red_flags is non-empty, show India emergency numbers (112 / 108) and Tele-MANAS (14416 / 1-800-891-4416) as plain text.
Why: The corpus includes these numbers; showing them in the UI too keeps crisis guidance visible even if retrieval is weak.
```
