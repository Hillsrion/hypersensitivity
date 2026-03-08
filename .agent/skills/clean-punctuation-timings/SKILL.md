---
name: Clean Punctuation Timings
description: A skill to automatically merge standalone punctuation marks in timing JSON files into their preceding words.
---

# Clean Punctuation Timings

This skill provides a script and process to clean up timing JSON files (like `scenes.json`) where punctuation marks (e.g., `?`, `!`, `,`) are recorded as separate timing entries. It merges these marks into the preceding word entry while maintaining the word's original timing and applying proper French typography (space before `?`, `!`, `:`, and `;`).

## When to Use

- After importing new dialogue transcriptions where the speech-to-text engine might have separated punctuation.
- When you notice flickering or incorrect animation of punctuation marks in the dialogue UI.

## Components

- **Script**: `scripts/clean-punctuation.js` - A Node.js script that performs the actual merging.

## How to Use

1. **Copy the script to a temporary location or run it directly**:

   ```bash
   node .agent/skills/clean-punctuation-timings/scripts/clean-punctuation.js [relative-path-to-json]
   ```

2. **Default target**: If no path is provided, it defaults to `app/data/timings/scenes.json`.

3. **Verify the results**:
   Check for standalone punctuation entries using grep:
   ```bash
   grep -E '"word": "[[:punct:]]+"' [path-to-json]
   ```
