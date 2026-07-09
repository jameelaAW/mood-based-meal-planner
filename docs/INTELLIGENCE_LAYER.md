# Intelligence Layer

## Messy Input → Structured Data
User types or picks: `"I'm so stressed about the presentation"`

```json
{
  "raw_input": "I'm so stressed about the presentation",
  "mood_label": "stressed",
  "mood_score": 3,
  "ai_mood_interpretation": "Acute situational stress; needs calming carbs and familiar flavours",
  "ai_mood_interpretation_source": "openai-gpt4o",
  "ai_mood_interpretation_confidence": 0.88,
  "ai_mood_interpretation_review_status": "unreviewed"
}
```

## Events to Track
- Mood label selected
- Free-text submitted
- Meal card viewed
- Shopping list generated
- Item checked/unchecked

## Scoring Rules (v1 — rule-based first)
1. Filter `meals` where `mood_tags` contains the selected `mood_label`
2. Score each match: exact tag match = +2, adjacent mood = +1, prep_minutes < 20 = +1
3. Return highest-scoring meal
4. AI (GPT-4o) writes `why_it_fits` for the winning meal and may override rank if confidence > 0.85

## What Gets Ranked
- Meal candidates per mood check-in

## v1 vs Later
| v1 | Later |
|---|---|
| Rule-based tag filter + score | Embedding similarity for free-text moods |
| GPT-4o writes why-it-fits | Fine-tuned model on user feedback |
| Static confidence from rules | User thumbs-up/down feeds confidence |
