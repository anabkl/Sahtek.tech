# CLAUDE.md

Project guidance for Claude Code.

## GBrain Configuration (configured by /setup-gbrain)
- Mode: local-stdio
- Engine: pglite (`C:\Users\KHALID\.gbrain\brain.pglite`)
- Config file: ~/.gbrain/config.json (mode 0600)
- Embeddings: disabled (no API key) — semantic vector search is off until you run
  `gbrain config set embedding_model <id>` and set the matching API key, then
  `gbrain sync --source sahtek` + `gbrain embed --stale`
- Setup date: 2026-06-26
- MCP registered: yes (user scope, `gbrain serve` stdio) — restart Claude Code to load `mcp__gbrain__*` tools
- Artifacts sync: off
- Current repo policy: read-write
- Code source id: `sahtek` (105 pages indexed)

### Running gbrain from the shell on this machine
`gbrain` lives at `~/.bun/bin/gbrain` (Git Bash). If it's not on PATH:
`export PATH="$HOME/.bun/bin:$PATH"`. This machine is behind a TLS-intercepting
proxy, so any networked gbrain op (remote embeddings, pack upgrade) needs
`export NODE_EXTRA_CA_CERTS=/c/Users/KHALID/.gstack-ca-bundle.pem`. Local PGLite
operations (put/search/code-def) need neither.

## GBrain Search Guidance (configured by /setup-gbrain)
<!-- gstack-gbrain-search-guidance:start -->

GBrain is set up on this machine with this repo's code indexed (source `sahtek`,
105 pages). Embeddings are OFF, so prefer the symbol-graph and keyword tools over
semantic vector search.

Prefer gbrain when:
- "Where is symbol Y defined?" → `gbrain code-def <symbol>`
- "Where is symbol Y used?" → `gbrain code-refs <symbol>`
- "What calls Y / what does Y call?" → `gbrain code-callers <symbol>` / `gbrain code-callees <symbol>`
  (these use tree-sitter and work without embeddings)
- Keyword lookup across code/notes → `gbrain search "<terms>" --source sahtek`

Grep is still right for exact strings, regex, multiline patterns, and file globs.
Re-index after large code changes: `gbrain sync --source sahtek --strategy code --no-embed`
then `gbrain extract --stale`.

<!-- gstack-gbrain-search-guidance:end -->
