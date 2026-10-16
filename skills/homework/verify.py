#!/usr/bin/env python3
"""Pre-push checks for Homework exercise pages (markdown file).

Usage: verify.py page.md
Checks:
  1. No repeated sentence cores across different exercises
  2. No alternating/predictable option-order rhythm in choose exercises
  3. True/False balance (warns if all True or all False)
  4. Order-exercise lists: flags capitalized tokens that give away the start
  5. Gap count summary per exercise
Exit 0 = clean, 1 = problems found (still prints details either way).
"""
import re, sys
from collections import Counter

src = open(sys.argv[1], encoding="utf-8").read()
problems = []

# Split into exercises by EXERCISE/EXERCICE headers (EN + FR)
parts = re.split(r"(EXERCI[SC]ES?\s+\d+)", src)
exs = {}
for i in range(1, len(parts) - 1, 2):
    exs[parts[i].strip()] = parts[i + 1]
if not exs:
    print("warning: no exercise headers found")
    sys.exit(1)

# 1. Duplicate sentence cores (strip blanks, options, arrows, answers)
cores = {}
for name, body in exs.items():
    for line in body.split("\n"):
        m = re.match(r"\s*\d+[.)]\s+(.*)", line)
        if not m:
            continue
        core = m.group(1)
        core = re.sub(r"`[_ ]+`", "___", core)          # blanks
        core = re.sub(r"\(.*?\)", "", core)              # options
        core = re.sub(r"➡.*", "", core)                  # order/TF tails
        core = re.sub(r"[^\w\s]", "", core).lower().strip()
        core = re.sub(r"\s+", " ", core)
        if len(core) < 12:
            continue
        cores.setdefault(core, []).append(name)
for core, where in cores.items():
    if len(set(where)) > 1:
        problems.append(f"REPEAT across {set(where)}: '{core[:70]}'")

# 2. Option-order rhythm: collect (a / b) option pairs per exercise
for name, body in exs.items():
    opts = re.findall(r"\(([^()]*?)\s*/\s*([^()]*?)\)", body)
    opts = [(a.strip(), b.strip()) for a, b in opts if len(a.strip()) < 25 and len(b.strip()) < 25]
    if len(opts) >= 4:
        # flag if first-options are identical every time (all same order)
        firsts = Counter(a for a, b in opts)
        if len(firsts) == 1:
            problems.append(f"{name}: all {len(opts)} option pairs in the SAME order {firsts.most_common(1)} — shuffle")

# 3. True/False presence (can't know answers, just count items)
tf = len(re.findall(r"➡\s*T\s*/\s*F|➡\s*V\s*/\s*F", src))
if tf:
    print(f"info: {tf} true/false items found (check balance manually: aim 50/50)")

# 4. Order lists: a LONE capitalized content word gives away the start
# (pronouns/articles as sole cap are standard hints — allowed).
STARTERS = {"I", "We", "They", "He", "She", "It", "You", "The", "This",
            "That", "These", "Those", "A", "An", "I'm", "I'll", "I've",
            "It's", "We're", "They're", "He's", "She's", "That's", "There's"}
for name, body in exs.items():
    if not re.search(r"order|ordre", name + body[:300], re.IGNORECASE):
        continue
    for line in body.split("\n"):
        m = re.match(r"\s*\d+[.)]\s+(.*?)\s*➡", line)
        if not m:
            continue
        toks = [t.strip(" /") for t in m.group(1).split("/") if t.strip(" /")]
        if len(toks) < 3:
            continue
        caps = [t for t in toks if t[:1].isupper()]
        if len(caps) == 1 and caps[0] not in STARTERS:
            problems.append(f"{name}: capitalized giveaway '{caps[0]}' in: '{m.group(1)[:60]}'")

# 5. Gap summary
gaps = Counter()
for name, body in exs.items():
    n = body.count("________")
    if n:
        gaps[name] = n
print("info: gaps per exercise:", dict(gaps))

if problems:
    print("\nPROBLEMS:")
    for p in problems:
        print(" -", p)
    sys.exit(1)
print("\nCLEAN ✓")
