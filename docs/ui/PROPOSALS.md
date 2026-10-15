# UI proposals

## Open proposals

- Integration: provide the real same-origin `POST /api/chat` BFF on the `dev`
  branch. The UI currently handles this path with a local template fixture;
  replace or route the fixture when the BFF is ready without changing the
  request/response contract.
- Integration: confirm the shared local-development command and deployment
  routing. The UI can run independently from `apps/web` today; no root scripts
  or CORS configuration are needed while the local mock is used.
- Integration: if the BFF is hosted on a different origin, agree on a
  same-origin proxy or environment-based base URL and its CORS policy before
  wiring the UI to it.
