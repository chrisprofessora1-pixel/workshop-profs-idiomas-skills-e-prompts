---
name: corretor
description: Use when the user says Corretor, corrige, correction, corrigé, gabarito check, false friends, or wants student homework corrected inline on a Notion page.
---

# Skill: corretor

# Corretor — Homework Correction Agent

Corretor corrects a student's answered homework directly ON the Notion
page, in the False-Friends visual model (source: page "False Friends
Trap"). Invoke with: "Corretor, corrige esta página: <link>" (+ language
if not obvious from the page).

## Workflow

1. **Fetch the page**: `ntn pages get <id>`. Read every student answer.
   Note what is answered, what is blank, what is half-done.
2. **Correct inline, never rewrite the student**: keep their text, add
   marks (below). Save to /tmp, push with `ntn pages edit`.
3. **Score per exercise** + total in chat. Flag the weak point
   (e.g. "passé composé 1/6 — needs targeted review").
4. **Never touch undone exercises** (leave blanks blank), unless asked
   to fill the answer key.

## Inline marks (match the page language)

- Correct: append `✅`
- Correct option in parentheses: `<span underline="true">word</span>`
- Wrong: `<span color="red">~~wrong~~</span>` + ` <span color="green">**right**</span>`
- Rule note: ` <span color="gray">*❌ one-line rule*</span>`
- Blank in an attempted exercise: `✏️ → <span color="green">**answer**</span>`
- Keep correction spans OUTSIDE backticks — Notion renders tags raw
  inside code spans.
- Never break a numbered list with a score line in the middle (Notion
  restarts numbering — scores go AFTER the last item).

## Per-exercise score

After the last item of each corrected exercise, one gray line:

```
<span color="gray">*✅ Exercice 1 : 8/8, parfait !*</span>
```

Partial: `<span color="gray">*✅ Exercice 4 : 6/8 — revoir Q3, Q5*</span>`

## Answer key

At the very end of the page (only if the page doesn't have one):

```
<details color="green_bg">
<summary>**✅ CORRIGÉ — vérifier après avoir fini !**</summary>
	**EXERCICE 1**
	1-b — 2-d — ...
</details>
```

## Page furniture (same as exercise pages)

- Header: `<callout icon="🇫🇷" color="blue_bg">` (or 🇬🇧) with level/unit/review line
- Tip: `<callout icon="💡" color="gray_bg">` with the lesson's key rules
- Exercise headers: `<callout icon="✍️" color="...">` with `### EXERCISE N — title` + gray subtitle
- Quick reference (optional): `<details color="yellow_bg">` with summary table
- Match layout (model default): two `<columns>` — left Column A (numbered
  words with student letters: `1. actually - c`), right Column B (lettered
  meanings). Never put callouts inside columns.
- Vocab notes after match: `word - definition <br>• *example.* = translation
- Answer key at the very end: `<details color="green_bg">` with
  `<summary>**✅ ANSWER KEY — check only after finishing!**</summary>`
