#!/usr/bin/env python3
"""Lesson TTS agent: text -> ElevenLabs mp3 -> optional Notion audio attach.

Usage:
  tts.py --voice teacher --text "Hello class" --out lesson.mp3
  tts.py --voice francais --file /tmp/script.txt --out lesson-fr.mp3
  tts.py --voice teacher --file /tmp/script.txt --out lesson.mp3 --attach <notion-page-id>

Voices: teacher (American Teacher), francais (Prof de français), or a raw voice ID.
Key: read from ~/.config/elevenlabs_key (chmod 600, never printed).
"""
import argparse, json, os, subprocess, sys, urllib.request, urllib.error

KEY_FILE = os.path.expanduser("~/.config/elevenlabs_key")
VOICES = {
    "teacher": "ygJ6KeHyX2fupNmZ7V8m",   # American Teacher (EN lessons)
    "francais": "eKxxLqrrIIlLJm9gHteO",  # Prof de français (FR lessons)
}
API = "https://api.elevenlabs.io/v1"


def api_post(path, key, payload):
    req = urllib.request.Request(
        API + path, data=json.dumps(payload).encode(),
        headers={"xi-api-key": key, "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            return r.status, r.read()
    except urllib.error.HTTPError as e:
        sys.exit(f"ElevenLabs error {e.code}: {e.read().decode()[:300]}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--voice", default="teacher")
    ap.add_argument("--text")
    ap.add_argument("--file")
    ap.add_argument("--out", required=True)
    ap.add_argument("--model", default="eleven_multilingual_v2")
    ap.add_argument("--attach", help="Notion page ID to attach the mp3 to")
    a = ap.parse_args()

    text = a.text
    if a.file:
        text = open(a.file, encoding="utf-8").read()
    if not text or not text.strip():
        sys.exit("No text provided (--text or --file).")
    voice = VOICES.get(a.voice, a.voice)
    key = open(KEY_FILE).read().strip()

    status, audio = api_post(f"/text-to-speech/{voice}", key, {
        "text": text.strip(), "model_id": a.model,
        "voice_settings": {"stability": 0.5, "similarity_boost": 0.75},
    })
    with open(a.out, "wb") as f:
        f.write(audio)
    print(f"Saved {a.out} ({len(audio)} bytes, ~{len(text)} chars)")

    if a.attach:
        page = a.attach.replace("-", "")
        up = subprocess.run(
            ["ntn", "files", "create", "--filename", os.path.basename(a.out),
             "--content-type", "audio/mpeg", "--json"],
            stdin=open(a.out, "rb"), capture_output=True, text=True)
        if up.returncode != 0:
            sys.exit(f"ntn files create failed: {up.stderr[-500:]}")
        uid = json.loads(up.stdout).get("id")
        if not uid:
            sys.exit(f"Could not parse upload id: {up.stdout[:200]}")
        block = {"children": [{"object": "block", "type": "audio",
                "audio": {"type": "file_upload", "file_upload": {"id": uid}}}]}
        ch = subprocess.run(
            ["ntn", "api", f"v1/blocks/{page}/children", "-X", "PATCH",
             "-d", json.dumps(block)],
            capture_output=True, text=True)
        if ch.returncode != 0:
            sys.exit(f"attach failed: {ch.stderr[-500:]}")
        print(f"Attached audio to Notion page {a.attach}")


if __name__ == "__main__":
    main()
