#!/usr/bin/env bash
# install.sh <target-project-dir> [--force] [--ide claude|cursor|both]
#
# Installs the Engineering Constitution building blocks into a target project:
#   CLAUDE.md → root            configs → root           hook → .husky/
#   CI yml → .github/workflows/ PR template → .github/   skills/ → .claude/skills/
#   checklists + standards/testing/persona guides → docs/
#   laws/REGISTRY.md + registry.json → docs/constitution/   (offline citability)
#
# --ide selects the agent steering layer (default: claude, unchanged from prior
# versions of this script):
#   claude  skills/ → .claude/skills/ only (Claude Code plugin/skill format)
#   cursor  skills/ → .cursor/rules/*.mdc + .cursor/commands/*.md (Cursor's
#           auto-attached-rule and slash-command formats) instead of .claude/skills/
#   both    installs both layers side by side
# AGENTS.md (always installed, see below) is read natively by Cursor already —
# only the skills layer needs a per-IDE conversion. See docs/cursor-install.md
# and docs/adr/0007-cursor-ide-support.md.
#
# Idempotent: existing files are skipped unless --force is given.
set -euo pipefail

SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET=""
FORCE=""
IDE="claude"

while [ $# -gt 0 ]; do
  case "$1" in
    --force) FORCE="--force"; shift ;;
    --ide)
      IDE="${2:-}"
      shift 2
      ;;
    *)
      if [ -z "$TARGET" ]; then
        TARGET="$1"
      else
        echo "ERROR: unexpected argument: $1" >&2
        exit 1
      fi
      shift
      ;;
  esac
done

if [ -z "$TARGET" ]; then
  echo "Usage: install.sh <target-project-dir> [--force] [--ide claude|cursor|both]" >&2
  exit 1
fi
if [ ! -d "$TARGET" ]; then
  echo "ERROR: target directory not found: $TARGET" >&2
  exit 1
fi
case "$IDE" in
  claude|cursor|both) ;;
  *)
    echo "ERROR: --ide must be one of: claude, cursor, both (got: $IDE)" >&2
    exit 1
    ;;
esac

installed=0
skipped=0

copy() { # copy <src> <dest>
  local src="$1" dest="$2"
  mkdir -p "$(dirname "$dest")"
  if [ -e "$dest" ] && [ "$FORCE" != "--force" ]; then
    echo "  skip (exists): ${dest#"$TARGET"/}"
    skipped=$((skipped + 1))
  else
    cp "$src" "$dest"
    echo "  installed:     ${dest#"$TARGET"/}"
    installed=$((installed + 1))
  fi
}

copy_tree() { # copy_tree <src-dir> <dest-dir>
  local srcdir="$1" destdir="$2" f rel
  while IFS= read -r -d '' f; do
    rel="${f#"$srcdir"/}"
    copy "$f" "$destdir/$rel"
  done < <(find "$srcdir" -type f -print0)
}

emit_cursor_skill() { # emit_cursor_skill <skill-dir> — SKILL.md → .mdc rule + .md command
  local skill_dir="$1" name desc body_file rule_dest cmd_dest
  name="$(basename "$skill_dir")"
  desc="$(sed -n 's/^description: *//p' "$skill_dir/SKILL.md" | head -1)"
  body_file="$(mktemp)"
  # Strip the YAML frontmatter block (everything between the first two --- lines).
  awk '/^---[[:space:]]*$/{c++; next} c>=2' "$skill_dir/SKILL.md" > "$body_file"
  rule_dest="$TARGET/.cursor/rules/$name.mdc"
  cmd_dest="$TARGET/.cursor/commands/$name.md"
  mkdir -p "$(dirname "$rule_dest")" "$(dirname "$cmd_dest")"
  if [ -e "$rule_dest" ] && [ "$FORCE" != "--force" ]; then
    echo "  skip (exists): ${rule_dest#"$TARGET"/}"
    skipped=$((skipped + 1))
  else
    # alwaysApply: false + description = Cursor's "Apply Intelligently" mode,
    # the closest match to a Claude skill auto-activating by its description.
    { printf -- '---\ndescription: %s\nalwaysApply: false\n---\n' "$desc"; cat "$body_file"; } > "$rule_dest"
    echo "  installed:     ${rule_dest#"$TARGET"/}"
    installed=$((installed + 1))
  fi
  if [ -e "$cmd_dest" ] && [ "$FORCE" != "--force" ]; then
    echo "  skip (exists): ${cmd_dest#"$TARGET"/}"
    skipped=$((skipped + 1))
  else
    cp "$body_file" "$cmd_dest"
    echo "  installed:     ${cmd_dest#"$TARGET"/}"
    installed=$((installed + 1))
  fi
  rm -f "$body_file"
}

echo "Engineering Constitution installer"
echo "  source: $SRC"
echo "  target: $TARGET"
echo "  ide:    $IDE"
echo ""

echo "Steering files → project root (LAW-10.4: ship both CLAUDE.md and AGENTS.md)"
copy "$SRC/CLAUDE.md" "$TARGET/CLAUDE.md"
copy "$SRC/AGENTS.md" "$TARGET/AGENTS.md"

echo "Tooling configs → project root"
copy "$SRC/configs/.eslintrc.json"        "$TARGET/.eslintrc.json"
copy "$SRC/configs/.prettierrc.json"      "$TARGET/.prettierrc.json"
copy "$SRC/configs/tsconfig.base.json"    "$TARGET/tsconfig.base.json"
copy "$SRC/configs/jest.config.js"        "$TARGET/jest.config.js"
copy "$SRC/configs/lint-staged.config.js" "$TARGET/lint-staged.config.js"

echo "Pre-commit hook → .husky/"
copy "$SRC/hooks/pre-commit" "$TARGET/.husky/pre-commit"
chmod +x "$TARGET/.husky/pre-commit" 2>/dev/null || true

echo "CI workflows → .github/workflows/"
copy "$SRC/ci/github/quality.yml"  "$TARGET/.github/workflows/quality.yml"
copy "$SRC/ci/github/security.yml" "$TARGET/.github/workflows/security.yml"

echo "PR template → .github/"
copy "$SRC/templates/pull_request_template.md" "$TARGET/.github/pull_request_template.md"

if [ "$IDE" = "claude" ] || [ "$IDE" = "both" ]; then
  echo "Skills (personas + enforcement) → .claude/skills/"
  copy_tree "$SRC/skills" "$TARGET/.claude/skills"
fi

if [ "$IDE" = "cursor" ] || [ "$IDE" = "both" ]; then
  echo "Skills (personas + enforcement) → .cursor/rules/*.mdc + .cursor/commands/*.md"
  for skill_dir in "$SRC"/skills/*/; do
    [ -f "${skill_dir}SKILL.md" ] && emit_cursor_skill "${skill_dir%/}"
  done
  echo "  note: AGENTS.md (installed above) is read natively by Cursor — no extra steering file needed"
fi

echo "Checklists + guides → docs/"
copy "$SRC/checklists/code-review-checklist.md" "$TARGET/docs/code-review-checklist.md"
copy "$SRC/checklists/pre-commit-checklist.md"  "$TARGET/docs/pre-commit-checklist.md"
copy "$SRC/docs/standards.md"                   "$TARGET/docs/standards.md"
copy "$SRC/docs/testing-guide.md"               "$TARGET/docs/testing-guide.md"
copy "$SRC/docs/persona-guide.md"               "$TARGET/docs/persona-guide.md"

echo "Law registry → docs/constitution/ (offline law citability)"
copy "$SRC/laws/REGISTRY.md"    "$TARGET/docs/constitution/REGISTRY.md"
copy "$SRC/laws/registry.json"  "$TARGET/docs/constitution/registry.json"

echo "Workflow catalog → docs/constitution/workflows/ (LAW-10.6)"
copy_tree "$SRC/workflows" "$TARGET/docs/constitution/workflows"

echo ""
echo "Done: $installed installed, $skipped skipped$( [ "$FORCE" != "--force" ] && [ $skipped -gt 0 ] && echo ' (use --force to overwrite)' )."
echo ""
echo "── Next steps ──────────────────────────────────────────────────────"
echo ""
echo "1) Install devDependencies:"
echo ""
echo "   npm install --save-dev typescript prettier eslint \\"
echo "     @typescript-eslint/parser @typescript-eslint/eslint-plugin \\"
echo "     eslint-plugin-import eslint-import-resolver-typescript \\"
echo "     eslint-config-prettier jest ts-jest @types/jest \\"
echo "     lint-staged husky"
echo ""
echo "2) Add to package.json scripts:"
echo ""
cat <<'JSON'
   "scripts": {
     "lint": "eslint . --ext .ts,.tsx",
     "type-check": "tsc --noEmit",
     "test": "jest",
     "format": "prettier --write .",
     "prepare": "husky"
   }
JSON
echo ""
echo "3) Extend tsconfig.json from tsconfig.base.json:"
echo '   { "extends": "./tsconfig.base.json", ... }'
echo ""
echo "4) Run: npm run prepare   (activates the .husky/pre-commit hook — LAW-6.2)"
echo "5) Verify: $SRC/scripts/validate.sh $TARGET"
if [ "$IDE" = "cursor" ] || [ "$IDE" = "both" ]; then
  echo ""
  echo "6) Cursor: open the project — .cursor/rules/*.mdc auto-attach by description,"
  echo "   or type /<skill-name> (e.g. /workflow-orchestrator) to invoke one explicitly."
  echo "   See docs/cursor-install.md. For the optional memory-service MCP server,"
  echo "   add its config to .cursor/mcp.json (see memory-service/README.md)."
fi
