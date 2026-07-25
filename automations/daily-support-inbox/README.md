# Daily Support Inbox Automation

Automatically drafts replies to customer emails in **support@nootropix.shop** once per day. Drafts are saved in Gmail for you to review and send manually.

## What this does

| Step | Action |
|------|--------|
| Trigger | Daily schedule (e.g. 8:00 AM GST) |
| Read | Unread customer emails from last 24h |
| Draft | On-brand replies using Nootropix FAQ knowledge |
| Save | Gmail drafts (threaded replies) |
| Label | `agent-drafted` or `needs-human-review` |
| Send | **Never** — you review and send from Gmail |

## Setup (one time)

### 1. Google Cloud OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create or select a project
3. Enable **Gmail API** (APIs & Services → Library)
4. Configure **OAuth consent screen** (Internal if using Google Workspace)
5. Create **OAuth 2.0 Client ID** → Application type: **Desktop app**
6. Save the Client ID and Client Secret

**Important:** Run OAuth as the Google account that receives `support@nootropix.shop`. If support is a group alias, authenticate as the user who owns the shared inbox.

### 2. Authenticate Gmail MCP

From the repo root:

```bash
chmod +x scripts/setup-gmail-support.sh
./scripts/setup-gmail-support.sh
```

Or manually:

```bash
GOOGLE_CLIENT_ID="your-id.apps.googleusercontent.com" \
GOOGLE_CLIENT_SECRET="your-secret" \
npx -y @chieflatif/google-mcp setup-oauth
```

### 3. Configure Cursor MCP

Project MCP config is at `.cursor/mcp.json`. Set environment variables:

```bash
export GOOGLE_CLIENT_ID="your-id.apps.googleusercontent.com"
export GOOGLE_CLIENT_SECRET="your-secret"
```

For **cloud automations**, add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` as secrets in your [Cloud Agents environment](https://cursor.com/dashboard/cloud-agents#environments). After running OAuth once, ensure `~/.mcp-google/tokens.json` exists in the environment snapshot (run setup from a cloud agent session, or copy tokens into the environment).

In Cursor: **Customize → MCP** → enable the `google-mcp` server and complete OAuth if prompted.

### 4. Create Gmail labels

In Gmail, create these labels (or let the agent create them on first run):

- `agent-drafted`
- `needs-human-review`

### 5. Create the Cursor Automation

1. Open [cursor.com/automations](https://cursor.com/automations) (or Agents Window → Automations)
2. Click **New automation**
3. Configure:

| Field | Value |
|-------|-------|
| **Name** | Daily Support Inbox Drafts |
| **Trigger** | Scheduled — daily at your preferred time (e.g. `0 8 * * *` for 8am) |
| **Repository** | This repo (`nootropix` theme) — needed for knowledge base files |
| **Tools** | Enable **MCP server** (`google-mcp`) |
| **Model** | Your preferred model (Claude/GPT — use a capable model for customer comms) |

4. Paste the prompt from [`prompt.md`](./prompt.md) into the automation instructions
5. Save and activate

### 6. Test before going live

Run the automation manually once (or test in Cursor chat with MCP enabled):

> Read `automations/daily-support-inbox/tone-and-rules.md` and process unread support emails from the last 24 hours. Draft only — do not send.

Check Gmail → **Drafts** and verify threading, tone, and labels.

## Daily workflow

1. Open Gmail → **Drafts**
2. Review each draft the agent created overnight
3. Edit if needed → **Send**
4. Check threads labeled `needs-human-review` for cases that need your judgment

## Files

| File | Purpose |
|------|---------|
| `prompt.md` | Automation prompt (paste into Cursor) |
| `knowledge-base.md` | FAQ, policies, brand voice |
| `tone-and-rules.md` | Skip rules, escalation, Gmail queries |
| `../../.cursor/mcp.json` | Gmail MCP configuration |
| `../../scripts/setup-gmail-support.sh` | OAuth setup helper |

## Safety

- Agent is instructed to **never send** email
- Escalation rules flag risky cases (refunds, legal, medical)
- `gmail_send` should not be used; drafts only via `gmail_create_draft`
- Review all drafts before sending — the agent may lack live order data

## Troubleshooting

| Issue | Fix |
|-------|-----|
| OAuth / auth failed | Re-run `scripts/setup-gmail-support.sh` |
| No emails found | Confirm you authenticated as the inbox owner; check Gmail query in `tone-and-rules.md` |
| Duplicate drafts | Ensure `agent-drafted` label is applied after each draft |
| MCP not available in automation | Enable MCP in automation tools; verify cloud environment secrets |
| Wrong tone/facts | Update `knowledge-base.md` and re-run |

## Optional improvements

- Add Shopify Admin MCP for live order lookups by customer email
- Switch to webhook trigger for faster response on new mail
- Add Memories in the automation to track processed thread IDs
