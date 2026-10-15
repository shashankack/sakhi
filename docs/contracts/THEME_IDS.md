# Theme IDs (frozen list)

**Owner:** Integration (changes require team agreement)  
**Used by:** Research (doc tagging), ML (mapping), UI (optional chip keys)

Only these IDs may appear in API `themes[].id`:

| id | English label | Hindi label (UI chip) |
|----|---------------|------------------------|
| `cycle_irregularity` | Irregular periods | अनियमित पीरियड्स |
| `hirsutism` | Facial / body hair | चेहरे / शरीर पर बाल |
| `acne` | Acne | मुंहासे |
| `weight_insulin` | Weight / hunger | वज़न / भूख |
| `mood` | Mood changes | मूड में बदलाव |
| `hair_loss` | Hair fall | बाल झड़ना |
| `fatigue` | Fatigue | थकान |
| `fertility_concerns` | Trying to conceive | गर्भधारण की चिंता |

## Research tagging

Each corpus markdown file should declare in a header comment or YAML frontmatter:

```yaml
theme_ids: [cycle_irregularity]
```

A file may list multiple theme_ids if genuinely shared.

## Adding a theme

1. Note proposal in `docs/research/PROPOSALS.md` (or ml/ui).
2. Integration updates this file on `dev`.
3. Research adds corpus coverage.
4. ML maps aliases; UI may add a chip.
