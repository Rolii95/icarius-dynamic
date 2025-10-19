#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${DELIVERABILITY_DOMAIN:-}" ]]; then
  echo "DELIVERABILITY_DOMAIN is not set. Export it or pass --domain to dns-check.js"
  exit 2
fi

args=(--domain "$DELIVERABILITY_DOMAIN")

if [[ -n "${DKIM_SELECTOR:-}" ]]; then
  args+=(--dkim-selector "$DKIM_SELECTOR")
fi

if [[ -n "${SENDING_IP:-}" ]]; then
  args+=(--ip "$SENDING_IP")
fi

node scripts/dns-check.js "${args[@]}"
