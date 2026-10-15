# Repo Setup — Commands (human lead / Integration)

Do this **once** at the start. Prefer GitHub (or Cursor Origin) so `main` can be protected in the UI.

## 0. Prerequisites

- Git installed
- GitHub account (or Origin) with a new empty repo, e.g. `saheli-pcos`
- Node.js 20+ and Python 3.11+ on machines that will run the app

## 1. Create local project + git

From an empty project folder (example: `chaos`):

```bash
# already inside empty project root
git init
git branch -M main
```

Copy / create the scaffold folder structure (see section 5), then:

```bash
git add .
git commit -m "chore: initial scaffold, docs, and ownership boundaries"
```

## 2. Create remote and push `main`

```bash
# GitHub example — create empty repo first on github.com (no README if you already committed locally)
git remote add origin https://github.com/<ORG_OR_USER>/saheli-pcos.git
git push -u origin main
```

## 3. Create the four work branches from `main`

```bash
git branch dev
git branch ui
git branch ml
git branch research

git push -u origin dev
git push -u origin ui
git push -u origin ml
git push -u origin research
```

Branch roles:

| Branch | Role |
|--------|------|
| `main` | Protected release / demo snapshots only |
| `dev` | Integration + system wiring |
| `ui` | UI developer |
| `ml` | ML developer |
| `research` | Research docs / corpus |

## 4. Protect `main` (GitHub UI)

GitHub → **Settings → Branches → Add branch protection rule**

- Branch name pattern: `main`
- Enable:
  - **Require a pull request before merging**
  - **Require approvals** (at least 1 — Integration lead)
  - **Do not allow force pushes**
  - **Do not allow deletions**
- Optional: restrict who can push to `main` to Integration only

`dev` may stay unprotected for speed, **or** require PR from `ui` / `ml` / `research` into `dev` (recommended if the team can handle it).

### Merge flow (only allowed flow)

```text
ui | ml | research  →  PR into dev  →  Integration tests
dev                 →  PR into main →  demo / freeze
```

Never commit directly to `main`. Never merge feature branches into each other.

## 5. Scaffold directories (create empty owners)

Create this tree so each branch has somewhere to work **without colliding**:

```text
.
├── apps/
│   ├── web/                 # UI ONLY (placeholder README)
│   └── api/                 # Integration ONLY (BFF / route handlers)
├── services/
│   └── ml/                  # ML ONLY (Python service)
├── research/
│   └── corpus/              # Research ONLY (markdown knowledge)
├── docs/                    # see docs/README.md (subfolder ownership)
├── scripts/                 # Integration ONLY
├── .gitignore
└── README.md                # Integration owns root README
```

Minimal `.gitignore` starter:

```gitignore
node_modules/
.next/
dist/
build/
.venv/
venv/
__pycache__/
*.pyc
.env
.env.local
.chroma/
*.log
.DS_Store
```

Each owned folder should contain a short `README.md` stating **Owner** and **Do not edit if you are not that role**.

## 6. Each teammate: clone and checkout their branch

```bash
git clone https://github.com/<ORG_OR_USER>/saheli-pcos.git
cd saheli-pcos

# Research
git checkout research

# UI
git checkout ui

# ML
git checkout ml

# Integration
git checkout dev
```

## 7. Daily sync rule (avoid divergence)

Before starting work:

```bash
git fetch origin
git checkout <your-branch>
git merge origin/dev
# If conflicts appear outside your owned paths → STOP and ping Integration.
# Do not "fix" unrelated files.
```

After work:

```bash
git add <only-your-owned-paths>
git commit -m "feat(<area>): <why>"
git push origin <your-branch>
# Open PR → base: dev
```

## 8. Coding agents

Paste `docs/agents/MASTER_PROMPT.md` first, then the role prompt under `docs/agents/prompts/`. Agents must refuse to edit paths outside their ownership.
