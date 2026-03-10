import fs from 'fs'
import path from 'path'

/**
 * Script to transform Whisper/Voxtral JSON transcriptions into game.ts dialogue format.
 * Usage: node .agent/skills/import-dialogues/scripts/import-dialogues.js <path_to_json> <base_id> <start_index> <pensees_indices>
 * Example: node .agent/skills/import-dialogues/scripts/import-dialogues.js public/audios/experience/J01_C03A_Jeu_fra.json d1 24 "5,8"
 */

const jsonPath = process.argv[2]
const baseId = process.argv[3] || 'dx'
const startIndex = parseInt(process.argv[4]) || 1
const penseesIndices = (process.argv[5] || '')
  .split(',')
  .map((n) => parseInt(n.trim()))
  .filter((n) => !isNaN(n))

if (!jsonPath) {
  console.error(
    'Usage: node import-dialogues.js <jsonPath> [baseId] [startIndex] [penseesIndices]'
  )
  process.exit(1)
}

const speakerMap = {
  Lucie: 'LUCIE',
  'Speaker 0': 'LUCIE',
  Lucas: 'Lucas',
  Ines: 'Ines',
  Inès: 'Ines',
  InÈs: 'Ines',
  Jérémy: 'Jérémy',
  Amine: 'Amine',
  'Femme sans-abri': 'Personne sans-abri',
}

function formatText(text) {
  return text.trim().replace(/"/g, '\\"')
}

try {
  const filePath = path.isAbsolute(jsonPath)
    ? jsonPath
    : path.resolve(process.cwd(), jsonPath)
  const rawData = fs.readFileSync(filePath, 'utf8')
  const data = JSON.parse(rawData)

  const newTimings = {}

  const formattedDialogues = data.segments.map((seg, i) => {
    const rawSpeaker = seg.speaker.name
    const speaker = speakerMap[rawSpeaker] || rawSpeaker
    const text = formatText(seg.text)

    // Generate ID
    const currentIdx = startIndex + i
    const dialogueId = `${baseId}_${currentIdx}`

    const isPensees = penseesIndices.includes(i)

    const timings = seg.words
      .filter((w) => w.text.trim().length > 0)
      .map((w) => ({
        word: formatText(w.text),
        start: w.start_time,
        end: w.end_time,
      }))

    newTimings[dialogueId] = timings

    if (isPensees) {
      return `    pensees(
      "${dialogueId}",
      "${text}",
      {
      }
    ),`
    } else {
      return `    d(
      "${dialogueId}",
      "${speaker}",
      "${text}",
      {
      }
    ),`
    }
  })

  const scenesTimingsPath = path.resolve(
    process.cwd(),
    'app/data/timings/scenes.json'
  )
  let existingTimings = {}
  if (fs.existsSync(scenesTimingsPath)) {
    existingTimings = JSON.parse(fs.readFileSync(scenesTimingsPath, 'utf8'))
  }

  const mergedTimings = { ...existingTimings, ...newTimings }
  fs.writeFileSync(scenesTimingsPath, JSON.stringify(mergedTimings, null, 2))

  console.log(
    `// Successfully saved ${Object.keys(newTimings).length} timings to scenes.json`
  )
  console.log('// Generated Dialogues for game.ts:\n')
  console.log(formattedDialogues.join('\n'))
} catch (err) {
  console.error('Error processing file:', err.message)
  process.exit(1)
}
