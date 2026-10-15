# Merge checklist

## Before merging `ui` / `ml` / `research` → `dev`

- [ ] Diff only touches that role’s owned paths (+ their `docs/<role>/`)
- [ ] No root lockfile fights unless Integration intentionally updates
- [ ] API_CONTRACT still honored (UI mocks / ML response)
- [ ] Disclaimer / non-diagnosis language intact
- [ ] Role CHANGELOG updated

## Before merging `dev` → `main`

- [ ] Happy-path Hinglish demo works offline (no cloud LLM key)
- [ ] Red-flag demo works
- [ ] README run instructions accurate
- [ ] `main` protection still enabled
- [ ] Tag or note demo commit SHA
