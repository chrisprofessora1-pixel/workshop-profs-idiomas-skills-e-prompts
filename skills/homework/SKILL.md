---
name: homework
description: Use when the user says Homework, faz exercicios, homework, lesson exercises, gap fill, match exercise, true or false, or wants homework generated from a Notion lesson page.
---

# Skill: homework

# Homework — Lesson Homework Agent

Homework turns a Notion lesson page into homework exercises on a target
Notion page. Invoke with: "Homework, make exercises for <lesson link> here:
<target link>". Pair with the `corretor` skill when correcting,
with `elvis` when the homework needs audio,
and with `biner` (notion-beautifier) to give the final page the polished
"notion bonito" look — see the Notion look section below.

## Workflow

1. **Fetch the lesson**: `ntn pages get <id>`. Map verbs, vocabulary,
   grammar patterns, and examples into a short lesson map. Show the map
   and wait for approval before generating (unless told to go ahead).
2. **Check the target page**: `ntn pages get <id>`.
   - Empty → build the full set.
   - Has content → keep everything, prepend or append only. Never rewrite
     existing blocks unless asked. If the user is editing, stop and wait.
   - Lesson pages and Homework pages live in DIFFERENT databases. The user
     often says "here" meaning the lesson as SOURCE while the TARGET is a
     separate "X - Homework" page. Always confirm which page receives the
     exercises before pushing (lesson link ≠ homework link).
3. **Generate** in the page's existing style and the requested language (EN only / FR only /
   FR + PT glosses where they disambiguate).
   Default style (teacher preference, 2026-10-16 — use always unless told otherwise):
   colored exercise titles + callout instructions, as in October 13 Homework:
   `## 📚 EXERCISE 1 — frequency adverbs {color="purple"}` followed by
   `<callout icon="💡" color="gray_bg">\n\t💡 Short instruction.\n</callout>`.
4. **Verify before pushing** (mandatory): save the markdown to /tmp, then from
   this skill's folder (where `verify.py` lives) run
   `python3 verify.py file.md`,
   fix everything it reports (repeats, option rhythm, caps giveaways).
   Then push with `ntn pages edit` (replaces content — re-attach audio
   blocks afterwards if the page had any).
5. **Report**: what was added, answers/gabarito in chat when asked. Always
   keep a gabarito (ordered answers per exercise) ready — the teacher
   asks for it constantly.
6. **Beautify (notion bonito)**: after the exercises are pushed, load the
   `biner` skill (notion-beautifier) and apply its design system to the page
   (CREATE for a fresh page, BEAUTIFY for one that already exists). It only
   changes the look — never the exercises, answers, or the one-cue rule.
   Skip it only if the teacher says she wants it plain.

## Formatting (never break — teacher loves this)

- Header per exercise: `## <emoji> EXERCISE <n> — <short title> {color="<color>"}`
  Example: `## 📚 EXERCISE 1 — frequency adverbs {color="purple"}`
- Cycle colors (purple, yellow, pink, brown, blue, red, orange, green…),
  don't repeat the same color twice in a row. Pick an emoji that matches
  the exercise type (📚🧲🧠🔁⛓️🐞🔢🔷🕵️🚌👂💼🍳…).
- Directly under each header, a gray callout with the instruction:
  `<callout icon="💡" color="gray_bg">\n\t💡 Instruction here.\n</callout>`
  Teacher preference (2026-10-16, corrected — use this, not the old bullet rule):
  on established homework pages instructions are SHORT, 1–2 sentences, like
  the siblings (`Make a question for each answer. Use the correct tense.`,
  `Read each sentence. True or false?`). Formula reference goes in the blue
  bank callout below (real bullet children), never in a wall of hyphen text.
- Word bank (teacher preference, 2026-10-16): separate blue callout right
  after the instruction, alphabetical, bold items:
  `<callout icon="📦" color="blue_bg">\n\t📦 Word bank: **assist** · **choose** · **depend on** · ...\n</callout>`
- Sequential numbering 1..N, never skip. Titles in lowercase except first
  word / proper nouns.
- Items stay clean: NO quotes around statements, NO parenthetical cues like
  `(Simple Present)` — the teacher removes both every time. One cue mechanism
  per exercise (word bank OR arrow-blank OR T/F), never stacked.
- Word banks list each word ONCE, always unique (`get · have · take`,
  never `get · get · get · have · have · take`) — repeats give away answer
  counts.
- Blanks render as code pills like the existing exercises: in markdown use
  `` `________` `` (backticks → code style on import); via the API use a
  rich_text segment with `annotations: {"code": true}` and NO literal
  backticks (they show as visible characters). Use ➡ (U+27A1), never →.
- Callout body text starts with its own icon character
  (`💡 Instruction…`, `📦 Word bank: …`) — that's the house style.
- Bullet points inside a callout must be REAL `bulleted_list_item` child
  blocks of the callout — never typed `- ` hyphens (they render as plain
  text and look broken).

## Notion look — pair with `biner` (notion-beautifier)

The formatting rules above are the teacher's house style and always win for
exercise content. On top of them, load the `biner` skill (notion-beautifier)
so the page looks polished, not just correct:

- **Fresh homework page** → load `biner`, mode CREATE, and lay it out with
  its design system (intro/hero layout, colored headings, callouts, columns
  for match exercises, toggles for the gabarito and answer keys).
- **Existing page that looks flat**, or the teacher says "notion bonito" /
  "beautify" / "deixa bonito" → load `biner`, mode BEAUTIFY: fetch the page,
  keep every block, only restructure into the design system. Never drop
  content.
- **Workspace / database level** (homework hub, filtered views, the
  "X - Homework" database) → load `notion-homework-pages` (notion-pages-skill)
  for the page/database architecture.

Rule of precedence: exercise content and the formatting rules above beat the
beautifier. `biner` changes the look, never the exercises, the answers, or
the one-cue-per-exercise rule. Never let a beautify pass wipe audio/image
blocks — re-append them if a rewrite happens (see Editing safety).

## Editing safety (incident 2026-10-16 — never break)

- NEVER run full-page `ntn pages edit` on a page whose lines start with
  `1.` / `2.` / `3.` etc. The markdown importer converts them to
  `numbered_list_item` blocks and can SILENTLY DROP the line text
  (seen: `1. "She…" → Use WORTH` became three EMPTY blocks, content lost).
- For any fix on an existing page, use SURGICAL block API calls only:
  - PATCH `v1/blocks/<id>` to rewrite one heading / callout / item.
  - PATCH `v1/blocks/<page>/children` with
    `position: {type: after_block, after_block: {id}}` to insert
    (the old `after` param is deprecated and rejected).
  - DELETE `v1/blocks/<id>` to remove a block.
- After every surgical edit, re-fetch (`ntn pages get`) and diff: only the
  intended lines may change.

## Exercise toolbox (pick what fits the lesson)

- Match word → meaning (model default: two `<columns>`, A numbered + letters
  / B lettered meanings, meanings fully shuffled; table variant also allowed)
- Gap fill from a word box (box order never equals answer order; 1–2 extras)
- Complete with a cue, NO multiple-choice parentheses by default: give the
  verb (`(work)`), never the options (`(work / works)`). The teacher
  removes `(a / b)` options every time — only use them when explicitly
  asked for an easier version.
- True / False (balanced 50/50 — use EVEN item counts so balance is
  possible; no circular definitions like "X means X"; the clue must never
  contain the answer, e.g. "To decide…" testing choose/decide)
- Complete with the correct form (tense/conjugation drills)
- Put in order (all lowercase, capitals never give away the first word)
- Find the mistake (exactly ONE mistake per sentence)
- Discussion (reuse lesson words in the questions)

## Difficulty rules (never break)

- Meanings/options with no a,b,c runs and no alternating rhythm.
- Distractors plausible: test the lesson's real confusions
  (way/manner, fuel/fool, leur/leurs, très/trop, argue/discuss).
- Disambiguate with context or glosses (= very / = too), never leave two
  valid answers. Grammar traps (less + countable, much homework) are
  errors in the exercise, not in the lesson.
- Deleted scenes: `ntn pages edit` wipes audio/image blocks — re-upload
  and re-append them after every full-page rewrite.

## Correction

Corrections follow the `corretor` skill model (✅ / red strike
+ green fix + gray rule note / per-exercise scores / answer-key toggle),
in the page's language.

## Student level

Ask once per student and remember: level (e.g. A2), lesson language
(EN/FR), and whether PT glosses help or pollute. A2 = short sentences,
no subordinate clauses in instructions, one new rule per exercise.
Never test grammar the lesson didn't teach (e.g. don't require past
participles the lesson never showed — model them first).
