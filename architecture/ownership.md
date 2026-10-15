# Architecture ↔ directory ownership

Exclusive write ownership prevents merge conflicts across `ui`, `ml`, `research`, and `dev` branches.

Canonical table: `docs/contracts/DIRECTORY_OWNERS.md`.

## Deploy / run boundaries

- UI never calls Ollama or Chroma directly.
- ML never serves browser HTML.
- Integration alone owns root manifests and the public HTTP surface.
- Research never commits application code; ML reads corpus at runtime.
