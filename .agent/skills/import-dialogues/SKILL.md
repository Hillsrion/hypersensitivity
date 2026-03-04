---
name: Import Dialogues
description: Process Whisper Voice json transcriptions to add new dialogues to the game
---

# Import Dialogues

This skill transforms Whisper/Voxtral JSON transcriptions into the `app/data/game.ts` dialogue format, automatically handling word timings and saving them to `app/data/timings/scenes.json`.

## Workflow

To import dialogues for a scene:

1. Ensure your JSON transcription is accessible.
2. Run the script with the following arguments:

   ```bash
   node .agent/skills/import-dialogues/scripts/import-dialogues.js <path_to_json> <id_prefix> <start_number> [pensees_indices]
   ```

   **Parameters:**
   - `<path_to_json>`: Path to the transcription JSON file (e.g., `public/audios/experience/J01_C03A_Jeu_fra.json`).
   - `<id_prefix>`: Prefix for the dialogue IDs (e.g., `d1` for day 1).
   - `<start_number>`: The number to start the ID counter from (e.g., `24` creates `d1_24`).
   - `[pensees_indices]`: Optional comma-separated list of segment indices to format as `pensees()` (inner thoughts) instead of `d()`.

3. The script will:
   - Save the word-level timings to `app/data/timings/scenes.json`.
   - Print the formatted code for `app/data/game.ts`.

4. Copy the generated code and paste it into the `dialogues` array of your scene in `app/data/game.ts`.

5. Update the speaker mapping in `.agent/skills/import-dialogues/scripts/import-dialogues.js` if you encounter new characters.
