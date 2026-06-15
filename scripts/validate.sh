#!/usr/bin/env bash
# validate.sh <target-project-dir>
#
# Verifies a constitution installation: presence of all installed files, strict
# tsconfig, jest coverage thresholds, executable hook, and that
# docs/constitution/registry.json parses and matches the source repo's
# constitution_version. PASS/FAIL report; non-zero exit on failure.
set -uo pipefail

SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET="${1:-}"

if [ -z "$TARGET" ]; then
  echo "Usage: validate.sh <target-project-dir>" >&2
  exit 1
fi
if [ ! -d "$TARGET" ]; then
  echo "ERROR: target directory not found: $TARGET" >&2
  exit 1
fi

fails=0
checks=0

ok()   { checks=$((checks + 1)); echo "  PASS  $1"; }
bad()  { checks=$((checks + 1)); fails=$((fails + 1)); echo "  FAIL  $1"; }

check_file() { # check_file <relative path>
  if [ -f "$TARGET/$1" ]; then ok "$1"; else bad "$1 (missing)"; fi
}

echo "Validating constitution installation: $TARGET"
echo ""
echo "Installed files"
check_file "CLAUDE.md"
check_file "AGENTS.md"
check_file ".eslintrc.json"
check_file ".prettierrc.json"
check_file "tsconfig.base.json"
check_file "jest.config.js"
check_file "lint-staged.config.js"
check_file ".husky/pre-commit"
check_file ".github/workflows/quality.yml"
check_file ".github/workflows/security.yml"
check_file ".github/pull_request_template.md"
check_file ".claude/skills/constitution-enforcer/SKILL.md"
check_file ".claude/skills/persona-security/SKILL.md"
check_file "docs/code-review-checklist.md"
check_file "docs/standards.md"
check_file "docs/constitution/REGISTRY.md"
check_file "docs/constitution/registry.json"
check_file "docs/constitution/workflows/registry.json"
check_file ".claude/skills/workflow-orchestrator/SKILL.md"

echo ""
echo "Configuration integrity"

# Strict tsconfig (LAW-2.3/2.4)
if [ -f "$TARGET/tsconfig.base.json" ] && grep -q '"strict": true' "$TARGET/tsconfig.base.json" \
   && grep -q '"noImplicitAny": true' "$TARGET/tsconfig.base.json" \
   && grep -q '"noUncheckedIndexedAccess": true' "$TARGET/tsconfig.base.json"; then
  ok "tsconfig strict flags (LAW-2.3/2.4)"
else
  bad "tsconfig strict flags weakened or missing (LAW-2.3/2.4)"
fi

# Jest thresholds (LAW-3.2)
if [ -f "$TARGET/jest.config.js" ] && grep -q 'coverageThreshold' "$TARGET/jest.config.js" \
   && grep -q 'lines: 80' "$TARGET/jest.config.js"; then
  ok "jest coverage thresholds present (LAW-3.2)"
else
  bad "jest coverage thresholds missing or altered (LAW-3.2)"
fi

# Hook executable (LAW-6.2)
if [ -x "$TARGET/.husky/pre-commit" ]; then
  ok "pre-commit hook executable (LAW-6.2)"
else
  bad "pre-commit hook missing or not executable (LAW-6.2)"
fi

# no-explicit-any present (LAW-2.3)
if [ -f "$TARGET/.eslintrc.json" ] && grep -q 'no-explicit-any' "$TARGET/.eslintrc.json"; then
  ok "eslint no-explicit-any rule present (LAW-2.3)"
else
  bad "eslint no-explicit-any rule missing (LAW-2.3)"
fi

echo ""
echo "Registry sync"

REG="$TARGET/docs/constitution/registry.json"
SRC_REG="$SRC/laws/registry.json"

json_get_version() { # json_get_version <file> — jq → node → sed, first non-empty wins
  local v=""
  if command -v jq >/dev/null 2>&1; then
    v="$(jq -r '.constitution_version' "$1" 2>/dev/null || true)"
  fi
  if [ -z "$v" ] && command -v node >/dev/null 2>&1; then
    # stdin avoids path-translation issues (e.g. Git Bash /tmp vs Windows node)
    v="$(node -e "let d='';process.stdin.on('data',(c)=>d+=c).on('end',()=>console.log(JSON.parse(d).constitution_version))" <"$1" 2>/dev/null || true)"
  fi
  if [ -z "$v" ]; then
    v="$(sed -n 's/.*"constitution_version": *"\([^"]*\)".*/\1/p' "$1" | head -1)"
  fi
  echo "$v"
}

if [ -f "$REG" ]; then
  TVER="$(json_get_version "$REG")"
  if [ -n "$TVER" ]; then
    ok "registry.json parses (constitution_version: $TVER)"
    SVER="$(json_get_version "$SRC_REG")"
    if [ "$TVER" = "$SVER" ]; then
      ok "registry version matches source repo ($SVER)"
    else
      bad "registry version drift: installed $TVER, source repo $SVER — run scripts/update.sh"
    fi
  else
    bad "registry.json does not parse"
  fi
else
  bad "docs/constitution/registry.json missing"
fi

echo ""
if [ $fails -eq 0 ]; then
  echo "RESULT: PASS ($checks checks)"
  exit 0
else
  echo "RESULT: FAIL ($fails of $checks checks failed)"
  exit 1
fi
