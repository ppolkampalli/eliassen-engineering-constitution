#!/usr/bin/env bash
# update.sh <target-project-dir>
#
# Syncs configs, skills, and the law registry from this repo into a target
# project. Before applying, prints a human-readable diff of any changed laws
# INCLUDING the amendment ID and motivation for each change (read from
# amendments/records/) — auditability propagates with the update
# (AMENDMENT-PROCESS.md stage 5: PROPAGATION).
set -euo pipefail

SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET="${1:-}"

if [ -z "$TARGET" ]; then
  echo "Usage: update.sh <target-project-dir>" >&2
  exit 1
fi
if [ ! -d "$TARGET" ]; then
  echo "ERROR: target directory not found: $TARGET" >&2
  exit 1
fi

TREG="$TARGET/docs/constitution/registry.json"
SREG="$SRC/laws/registry.json"

if [ ! -f "$TREG" ]; then
  echo "No installed registry found at $TREG — run install.sh first." >&2
  exit 1
fi

# ── Law diff with amendment motivations ─────────────────────────────────────
echo "Engineering Constitution update"
echo "  source: $SRC"
echo "  target: $TARGET"
echo ""
echo "── Law changes since installed version ─────────────────────────────"

if command -v node >/dev/null 2>&1; then
  # Git Bash on Windows: convert POSIX paths to ones Windows node can read
  if command -v cygpath >/dev/null 2>&1; then
    SREG_N="$(cygpath -m "$SREG")"; TREG_N="$(cygpath -m "$TREG")"; SRC_N="$(cygpath -m "$SRC")"
  else
    SREG_N="$SREG"; TREG_N="$TREG"; SRC_N="$SRC"
  fi
  node - "$SREG_N" "$TREG_N" "$SRC_N" <<'EOF'
const fs = require('fs');
const [sregPath, tregPath, src] = process.argv.slice(2);
const sreg = JSON.parse(fs.readFileSync(sregPath, 'utf8'));
const treg = JSON.parse(fs.readFileSync(tregPath, 'utf8'));
const oldLaws = new Map(treg.laws.map((l) => [l.id, l]));
const newLaws = new Map(sreg.laws.map((l) => [l.id, l]));

const motivation = (amd) => {
  const dir = `${src}/amendments/records`;
  const file = fs.readdirSync(dir).find((f) => f.startsWith(amd));
  if (!file) return '(amendment record not found)';
  const body = fs.readFileSync(`${dir}/${file}`, 'utf8');
  const m = body.match(/## Motivation\r?\n([\s\S]*?)(?=\r?\n## )/);
  return m ? m[1].trim().replace(/\s+/g, ' ').slice(0, 400) : '(no motivation section)';
};

let changes = 0;
if (treg.constitution_version !== sreg.constitution_version) {
  console.log(`Constitution: v${treg.constitution_version} → v${sreg.constitution_version}\n`);
}
for (const [id, nl] of newLaws) {
  const ol = oldLaws.get(id);
  if (!ol) {
    changes++;
    console.log(`NEW     ${id} (v${nl.version}) — ${nl.title}`);
    for (const amd of nl.amendments) console.log(`        via ${amd}: ${motivation(amd)}`);
  } else if (ol.version !== nl.version || ol.status !== nl.status) {
    changes++;
    console.log(`CHANGED ${id}: v${ol.version} ${ol.status} → v${nl.version} ${nl.status} — ${nl.title}`);
    const newAmds = nl.amendments.filter((a) => !ol.amendments.includes(a));
    for (const amd of (newAmds.length ? newAmds : nl.amendments.slice(-1)))
      console.log(`        via ${amd}: ${motivation(amd)}`);
  }
}
for (const [id, ol] of oldLaws)
  if (!newLaws.has(id)) { changes++; console.log(`REMOVED ${id} — ${ol.title} (repeal? repealed laws are normally retained)`); }

console.log(changes === 0 ? 'No law changes — configs/skills will still be synced.' : `\n${changes} law change(s).`);
EOF
else
  echo "(node not found — showing raw registry diff instead)"
  diff -u "$TREG" "$SREG" || true
fi

echo ""
read -r -p "Apply update? [y/N] " answer
case "$answer" in
  [Yy]*) ;;
  *) echo "Aborted — nothing changed."; exit 0 ;;
esac

# ── Apply: configs, skills, registry ────────────────────────────────────────
echo ""
sync_file() { cp "$1" "$2" && echo "  updated: ${2#"$TARGET"/}"; }

mkdir -p "$TARGET/docs/constitution" "$TARGET/.claude" "$TARGET/.husky" \
         "$TARGET/.github/workflows" "$TARGET/docs"

sync_file "$SRC/CLAUDE.md"                       "$TARGET/CLAUDE.md"
sync_file "$SRC/configs/.eslintrc.json"          "$TARGET/.eslintrc.json"
sync_file "$SRC/configs/.prettierrc.json"        "$TARGET/.prettierrc.json"
sync_file "$SRC/configs/tsconfig.base.json"      "$TARGET/tsconfig.base.json"
sync_file "$SRC/configs/jest.config.js"          "$TARGET/jest.config.js"
sync_file "$SRC/configs/lint-staged.config.js"   "$TARGET/lint-staged.config.js"
sync_file "$SRC/hooks/pre-commit"                "$TARGET/.husky/pre-commit"
chmod +x "$TARGET/.husky/pre-commit" 2>/dev/null || true
sync_file "$SRC/ci/github/quality.yml"           "$TARGET/.github/workflows/quality.yml"
sync_file "$SRC/ci/github/security.yml"          "$TARGET/.github/workflows/security.yml"

# Skills tree (full refresh)
rm -rf "$TARGET/.claude/skills"
mkdir -p "$TARGET/.claude/skills"
cp -R "$SRC/.claude/skills/." "$TARGET/.claude/skills/"
echo "  updated: .claude/skills/ (full refresh)"

sync_file "$SRC/docs/standards.md"               "$TARGET/docs/standards.md"
sync_file "$SRC/docs/testing-guide.md"           "$TARGET/docs/testing-guide.md"
sync_file "$SRC/docs/persona-guide.md"           "$TARGET/docs/persona-guide.md"
sync_file "$SRC/checklists/code-review-checklist.md" "$TARGET/docs/code-review-checklist.md"
sync_file "$SRC/checklists/pre-commit-checklist.md"  "$TARGET/docs/pre-commit-checklist.md"
sync_file "$SRC/laws/REGISTRY.md"                "$TARGET/docs/constitution/REGISTRY.md"
sync_file "$SRC/laws/registry.json"              "$TARGET/docs/constitution/registry.json"

echo ""
echo "Update complete. Verify with: $SRC/scripts/validate.sh $TARGET"
