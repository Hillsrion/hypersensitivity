---
description: Import transcription JSON into game.ts dialogues
---

This workflow helps you transform a Whisper/Voxtral JSON transcription into the TypeScript format required by `app/data/game.ts`, including detailed word timings.

1. Ensure your JSON file is accessible (e.g., in `public/audios/experience/`).
2. Identify the starting ID for your scene (e.g., `d2_1`).
3. Run the import script using Node.js:

```bash
node .agent/skills/import-dialogues/scripts/import-dialogues.js <path_to_json> <id_prefix> <start_number> <pensees_indices>
```

**Arguments:**

- `<path_to_json>`: Path to the transcription JSON file.
- `<id_prefix>`: Prefix for the dialogue IDs (e.g., `d1` for day 1).
- `<start_number>`: The number to start the ID counter from (e.g., `24` creates `d1_24`).
- `<pensees_indices>`: Comma-separated list of segment indices to format as `pensees()` instead of `d()`.

**Example:**
To import a file starting at ID `d2_10` where the 3rd and 5th segments are inner thoughts:

```bash
node .agent/skills/import-dialogues/scripts/import-dialogues.js public/audios/experience/Day2_Scene1.json d2 10 "2,4"
```

4. Copy the output from the terminal.
5. Paste it into the `dialogues` array of your `Scene` object in `app/data/game.ts`.
6. Update the `audio` property of the `Scene` to point to the corresponding `.mp3` file.
7. Verify speaker mappings in `.agent/skills/import-dialogues/scripts/import-dialogues.js` if you encounter unknown speakers.
