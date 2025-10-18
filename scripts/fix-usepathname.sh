#!/usr/bin/env bash
set -euo pipefail

# scripts/fix-usepathname.sh
# Usage: ./scripts/fix-usepathname.sh
# This script:
#  - finds files that contain "usePathname()"
#  - replaces occurrences like:
#      const pathname = usePathname();
#    with:
#      const pathname = usePathname() ?? '';
#  - creates backups with .bak extension for safety.

echo "Scanning repo for usePathname() occurrences..."
mapfile -t matches < <(grep -RI --line-number --exclude-dir=node_modules --exclude-dir=.git "usePathname()" . || true)

if [ ${#matches[@]} -eq 0 ]; then
  echo "No usePathname() occurrences found."
  exit 0
fi

# Extract unique file paths while preserving order
files=()
declare -A seen
for entry in "${matches[@]}"; do
  filepath="${entry%%:*}"
  if [[ -z "${seen[$filepath]+x}" ]]; then
    files+=("$filepath")
    seen["$filepath"]=1
  fi
done

if [ ${#files[@]} -eq 0 ]; then
  echo "No usePathname() occurrences found."
  exit 0
fi

echo "Found ${#files[@]} file matches. Processing..."

processed=0
for filepath in "${files[@]}"; do
  if [[ "$filepath" == "./scripts/fix-usepathname.sh" || "$filepath" == *.bak || "$filepath" == *.patch ]]; then
    continue
  fi

  echo "-> $filepath"

  if [ ! -f "${filepath}.bak" ]; then
    cp "$filepath" "${filepath}.bak"
  fi

  python3 - "$filepath" <<'PY'
import re
import sys
from pathlib import Path
path = Path(sys.argv[1])
text = path.read_text()
pattern = re.compile(r"\b(?:const|let|var)\s+([A-Za-z0-9_$]+)\s*=\s*usePathname\(\s*\)(?!\s*\?\?)(\s*;?)")

def replace(match):
    suffix = match.group(2) or ''
    return f"const {match.group(1)} = usePathname() ?? ''{suffix}"

new_text, count = pattern.subn(replace, text)
if count:
    path.write_text(new_text)
PY

  ((processed += 1))
done

echo "Processed $processed file(s)."
echo "Files modified (backups .bak available):"
for filepath in "${files[@]}"; do
  if [[ "$filepath" == "./scripts/fix-usepathname.sh" || "$filepath" == *.bak || "$filepath" == *.patch ]]; then
    continue
  fi
  echo "  - $filepath"
done

echo
echo "Run 'git add -A && git commit -m \"fix: guard usePathname() returns against null\"' to commit changes."
echo "Then run 'npm run build' locally to verify."
