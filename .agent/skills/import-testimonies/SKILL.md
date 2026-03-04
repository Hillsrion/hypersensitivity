---
name: Import Testimonies
description: Process Whisper Voice json transcriptions to add new testimonies to the app
---

# Import Testimonies

This skill automatically imports new testimonies audio timings and configuration from Voice json transcriptions.

## Workflow

To process and add a testimony:

1. Run the included script with the appropriate arguments to generate the output JSON and the terminal configuration mapping:

   ```bash
   node .agent/skills/import-testimonies/scripts/import-testimonies.js <path_to_json> <short_name> [author_name] [color]
   ```

   **Parameters:**
   - `<path_to_json>`: The transcription file containing the Whisper word timings (e.g. `app/data/timings/mon-temoignage.json`).
   - `<short_name>`: The identifier used to build the final `<short_name>.json` file and point to `<short_name>.mp3` audio (e.g. `lisa`).
   - `[author_name]`: Optional UI display name (e.g. `"Lisa D."`). Defaults to `short_name`.
   - `[color]`: Optional card color theme (e.g. `blue`, `pink`, `yellow`, `green`, `red`, `violet`). Defaults to `blue`.

2. The script will automatically parse the word timings, string-escape everything properly, and save a formatted timing list into `app/data/timings/<short_name>.json`.

3. The script will print out an object for the testimony array.
   - Copy this object.
   - Insert it into the `testimonies` array in `app/data/main.json`.

4. Run `pnpm format` to correct formatting issues in the modified files.
