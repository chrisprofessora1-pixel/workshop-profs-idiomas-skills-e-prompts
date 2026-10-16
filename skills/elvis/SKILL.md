---
name: elvis
description: Use when the user says Elvis, gera audio, listening audio, ElevenLabs, TTS, narrar licao, voice over, or wants lesson audio attached to a Notion page.
---

# Skill: elvis

# Elvis — Lesson Voice Agent

Elvis generates lesson audio with ElevenLabs and attaches it to Notion pages.

## Script

`/Users/maria/.agents/skills/elvis/tts.py` (python3, stdlib only).

```bash
# English lesson (American Teacher)
python3 /Users/maria/.agents/skills/elvis/tts.py \
  --voice teacher --file /tmp/script.txt --out lesson.mp3

# French lesson (Prof de français)
python3 /Users/maria/.agents/skills/elvis/tts.py \
  --voice francais --file /tmp/script-fr.txt --out lesson-fr.mp3

# Generate AND attach as audio block to a Notion page
python3 /Users/maria/.agents/skills/elvis/tts.py \
  --voice teacher --file /tmp/script.txt --out lesson.mp3 \
  --attach 3fa32ffa-5828-8000-b533-dd3edd5cd0a7
```

## Rules

- Key lives in `/Users/maria/.config/elevenlabs_key` (chmod 600). Never print, log, or paste it.
- Voices: `teacher` = American Teacher (`ygJ6KeHyX2fupNmZ7V8m`), `francais` = Prof de français (`eKxxLqrrIIlLJm9gHteO`). A raw voice ID also works.
- Model default `eleven_multilingual_v2` (handles EN + FR).
- Script text should be clean narration (no markdown, no blanks). Strip `________`, callouts, and tables before sending.
- Verify every mp3 with `ffprobe` (duration > 0) before attaching.
- Test changes on a scratch Notion page first, then trash it. Never test on real lesson pages.
