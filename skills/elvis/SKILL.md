---
name: elvis
description: Use when the user says Elvis, gera audio, listening audio, ElevenLabs, TTS, narrar licao, voice over, or wants lesson audio attached to a Notion page.
---

# Skill: elvis

# Elvis — Lesson Voice Agent

Elvis generates lesson audio with ElevenLabs and attaches it to Notion pages.

Runs on macOS, Linux and Windows (Python 3, plus the `ntn` CLI for the Notion
step).

## Script

`tts.py`, in this same folder (stdlib only, no pip installs). Run the commands
below from inside this skill's folder (where `tts.py` lives).

- Interpreter: `python3` on macOS/Linux, `python` on Windows.
- `/tmp/...` below just means "a scratch file": `/tmp` on macOS/Linux,
  `%TEMP%` on Windows.

```bash
# English lesson (American Teacher)
python3 tts.py \
  --voice teacher --file /tmp/script.txt --out lesson.mp3

# French lesson (Prof de français)
python3 tts.py \
  --voice francais --file /tmp/script-fr.txt --out lesson-fr.mp3

# Generate AND attach as audio block to a Notion page
python3 tts.py \
  --voice teacher --file /tmp/script.txt --out lesson.mp3 \
  --attach 3fa32ffa-5828-8000-b533-dd3edd5cd0a7
```

On Windows, run the same commands in PowerShell with `python` instead of
`python3` (e.g. `python tts.py --voice teacher --file $env:TEMP\script.txt --out lesson.mp3`).

## Rules

- Key lives in `~/.config/elevenlabs_key` (macOS/Linux) or
  `%USERPROFILE%\.config\elevenlabs_key` (Windows), with restricted permissions
  (`chmod 600` on macOS/Linux, or a per-user ACL on Windows). Never print, log,
  or paste it.
- Voices: `teacher` = American Teacher (`ygJ6KeHyX2fupNmZ7V8m`), `francais` = Prof de français (`eKxxLqrrIIlLJm9gHteO`). A raw voice ID also works.
- Model default `eleven_multilingual_v2` (handles EN + FR).
- Script text should be clean narration (no markdown, no blanks). Strip `________`, callouts, and tables before sending.
- Verify every mp3 with `ffprobe` (duration > 0) before attaching.
- Test changes on a scratch Notion page first, then trash it. Never test on real lesson pages.
