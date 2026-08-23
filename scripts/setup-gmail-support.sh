#!/usr/bin/env bash
# One-time Gmail OAuth setup for the Nootropix support inbox automation.
# Authenticates support@nootropix.shop (or the Workspace account that receives it).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="${ROOT}/scripts/.env"

echo "=== Nootropix Gmail Support — OAuth Setup ==="
echo ""
echo "Prerequisites:"
echo "  1. Google Cloud project with Gmail API enabled"
echo "  2. OAuth 2.0 Desktop client (Client ID + Secret)"
echo "  3. Sign in as the account that receives support@nootropix.shop"
echo ""

if [[ -f "$ENV_FILE" ]]; then
  # shellcheck disable=SC1090
  source "$ENV_FILE"
fi

if [[ -z "${GOOGLE_CLIENT_ID:-}" ]]; then
  read -r -p "Google OAuth Client ID: " GOOGLE_CLIENT_ID
fi

if [[ -z "${GOOGLE_CLIENT_SECRET:-}" ]]; then
  read -r -p "Google OAuth Client Secret: " GOOGLE_CLIENT_SECRET
fi

export GOOGLE_CLIENT_ID
export GOOGLE_CLIENT_SECRET

echo ""
echo "Opening browser for Google OAuth..."
echo "Grant access to the account that receives support@nootropix.shop"
echo ""

GOOGLE_CLIENT_ID="$GOOGLE_CLIENT_ID" \
GOOGLE_CLIENT_SECRET="$GOOGLE_CLIENT_SECRET" \
npx -y @chieflatif/google-mcp setup-oauth

TOKEN_FILE="${HOME}/.mcp-google/tokens.json"

echo ""
echo "=== Setup complete ==="
echo ""
echo "Tokens saved to: ${TOKEN_FILE}"
echo ""
echo "Next steps:"
echo "  1. Add secrets to Cursor Cloud Agent environment (Dashboard → Cloud Agents → Environments):"
echo "       GOOGLE_CLIENT_ID"
echo "       GOOGLE_CLIENT_SECRET"
echo "  2. For cloud automations, copy tokens to the environment snapshot after OAuth:"
echo "       mkdir -p ~/.mcp-google && cp ${TOKEN_FILE} ~/.mcp-google/tokens.json"
echo "  3. Create the Cursor Automation (see automations/daily-support-inbox/README.md)"
echo ""
echo "Optional: save credentials locally for re-runs:"
echo "  cat > ${ENV_FILE} <<EOF"
echo "GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}"
echo "GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}"
echo "EOF"
