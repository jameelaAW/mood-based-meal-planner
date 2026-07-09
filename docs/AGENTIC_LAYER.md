# Agentic Layer

## Risk Levels & Actions

### Low Risk — Auto-execute
- **Tag mood from free text** → `interpret_mood(text)` → writes `ai_mood_interpretation` to `mood_checkins`
- **Score and rank meals** → `rank_meals(mood_label)` → returns ordered meal list
- **Write why-it-fits copy** → `generate_why_it_fits(meal_id, mood_label)` → writes to `meals.why_it_fits`

### Medium Risk — Confirm before write
- **Generate shopping list** → `generate_shopping_list(checkin_id)` → user clicks "Build my list" to confirm

### High Risk — Approval required
- **Email shopping list** (Sprint 4+) → user explicitly triggers; shows preview before send

### Critical — Human only
- Deleting a shopping list or check-in history
- Any billing or account deletion (not in scope v1)

## Named Tools (v1)
| Tool | Input | Output |
|---|---|---|
| `interpret_mood` | raw free_text | mood_label, score, interpretation |
| `rank_meals` | mood_label | ordered meal ids |
| `generate_why_it_fits` | meal_id, mood_label | why_it_fits string + confidence |
| `generate_shopping_list` | checkin_id | shopping_list_id |

## Audit Log Fields
`tool_name`, `input_payload`, `output_payload`, `confidence`, `triggered_by` (`'user'` / `'system'`), `created_at`

## v1 vs Later
- v1: low-risk tools only run automatically; shopping list is user-confirmed
- Later: full audit_log table, admin review queue for low-confidence AI fields
