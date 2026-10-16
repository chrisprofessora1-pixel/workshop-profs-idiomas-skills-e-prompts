---
name: imager
description: Use when the user says Imager, ilustra, illustrate, fotos, cover image, one photo per scene, or wants free stock photos embedded in a Notion page.
---

# Skill: imager

# Imager — Notion Illustration Agent

Imager illustrates Notion pages with free stock photos (Unsplash),
one cover or one per scene. Invoke with: "Imager, ilustra esta página:
<link>" (+ how many photos: cover or per-scene).

Limitation: no AI-generated images here — only real free stock photos.

## Workflow

1. **Read the page**: `ntn pages get <id>`. Split into scenes, one photo
   each (or a single cover). Confirm the shot list with the user.
2. **Find photos**: websearch `unsplash.com photo <subject>`. Pick
   results that are free (skip Unsplash+ / premium / iStock). Note the
   photo page IDs (`unsplash.com/photos/<slug>-<id>`).
3. **Resolve direct URLs** (never guess them):
   ```bash
   curl -sIL -o /dev/null -w '%{url_effective}' --max-time 25 \
     "https://unsplash.com/photos/<id>/download?w=1600"
   ```
   This follows to `images.unsplash.com/photo-...?w=1600`.
4. **Verify each URL**: HTTP 200 + `content-type: image/*` + sane size:
   ```bash
   curl -sI --max-time 20 "<url>" | grep -iE "^HTTP|content-type|content-length"
   ```
5. **Embed interleaved** with the story: `![caption](url)` markdown at
   each scene, under a scene heading (`## 🏖️ Scene N — title`).
6. **Push** with `ntn pages edit`. This WIPES audio blocks — re-upload
   and re-append them afterwards (see `elvis` skill). Verify with
   `ntn pages get`: count images + audio blocks.

## Rules

- Never invent `images.unsplash.com` URLs — always resolve + verify.
- `w=1600` on every URL (good size/weight balance).
- Captions describe the photo for the student.
- Keep the listen-first instruction: audio stays LAST, photos illustrate.
- Unsplash License = free to use, no attribution required.
