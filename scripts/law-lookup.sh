#!/usr/bin/env bash
# law-lookup.sh <LAW-ID>
#
# Quick citation tool: prints a law's full record from laws/registry.json —
# ID, title, version, status, statement, rationale summary, owner personas,
# amendment history, file path. Uses jq if available, falls back to grep/sed.
#
#   ./scripts/law-lookup.sh LAW-2.3
set -euo pipefail

SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REG="$SRC/laws/registry.json"
ID="${1:-}"

if [ -z "$ID" ]; then
  echo "Usage: law-lookup.sh <LAW-ID>     e.g. law-lookup.sh LAW-2.3" >&2
  exit 1
fi
# Normalize: accept "2.3" as shorthand for "LAW-2.3"
case "$ID" in
  LAW-*) ;;
  *) ID="LAW-$ID" ;;
esac

if [ ! -f "$REG" ]; then
  echo "ERROR: registry not found: $REG" >&2
  exit 1
fi

if command -v jq >/dev/null 2>&1; then
  LAW="$(jq --arg id "$ID" '.laws[] | select(.id == $id)' "$REG")"
  if [ -z "$LAW" ]; then
    echo "ERROR: $ID not found in registry ($(jq -r '.laws | length' "$REG") laws, constitution v$(jq -r '.constitution_version' "$REG"))" >&2
    exit 1
  fi
  echo "$LAW" | jq -r '
    "\(.id) (v\(.version), \(.status)) — \(.title)",
    "Article \(.article)",
    "Owners: \(.owner_personas | join(", "))",
    "Enforcement: \(.enforcement)",
    "",
    "Statement:",
    "  \(.statement)",
    "",
    "Rationale:",
    "  \(.rationale_summary)",
    "",
    "Amendments: \(.amendments | join(", "))",
    "File: \(.file)",
    "",
    "Citation: [\(.id) v\(.version)] \"\(.statement)\""
  '
else
  # Fallback: grep/sed over the pretty-printed registry (2-space indented objects)
  BLOCK="$(awk -v id="\"$ID\"" '
    $0 ~ "\"id\": " id "," { found=1 }
    found { print }
    found && /^    },?$/ { exit }
  ' "$REG")"
  if [ -z "$BLOCK" ]; then
    echo "ERROR: $ID not found in registry" >&2
    exit 1
  fi
  field() { echo "$BLOCK" | sed -n "s/.*\"$1\": \"\(.*\)\",\{0,1\}\$/\1/p" | head -1; }
  list()  { echo "$BLOCK" | awk -v key="\"$1\"" '$0 ~ key {f=1; next} f && /\]/ {exit} f {gsub(/[ ",]/,""); items[n++]=$0} END {for (i=0;i<n;i++) printf "%s%s", (i?", ":""), items[i]}'; }

  echo "$ID (v$(field version), $(field status)) — $(field title)"
  echo "Article $(echo "$BLOCK" | sed -n 's/.*"article": \([0-9]*\),/\1/p' | head -1)"
  echo "Owners: $(list owner_personas)"
  echo "Enforcement: $(field enforcement)"
  echo ""
  echo "Statement:"
  echo "  $(field statement)"
  echo ""
  echo "Rationale:"
  echo "  $(field rationale_summary)"
  echo ""
  echo "Amendments: $(list amendments)"
  echo "File: $(field file)"
  echo ""
  echo "Citation: [$ID v$(field version)] \"$(field statement)\""
fi
