import fs from 'fs'
import path from 'path'

const jsonPath = process.argv[2]
const shortName = process.argv[3]
const author = process.argv[4] || shortName
const color = process.argv[5] || 'blue'

if (!jsonPath || !shortName) {
  console.error(
    'Usage: node scripts/import-testimonies.js <jsonPath> <shortName> [author] [color]'
  )
  process.exit(1)
}

function formatText(text) {
  return text.trim().replace(/"/g, '\\"')
}

try {
  const filePath = path.isAbsolute(jsonPath)
    ? jsonPath
    : path.resolve(process.cwd(), jsonPath)

  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found at ${filePath}`)
    process.exit(1)
  }

  const rawData = fs.readFileSync(filePath, 'utf8')
  const data = JSON.parse(rawData)

  const segment = data.segments ? data.segments[0] : null
  if (!segment || !segment.words) {
    console.error('Error: No valid Whisper segments found in the JSON file.')
    process.exit(1)
  }

  const fullText = formatText(segment.text)

  const timings = segment.words
    .filter((w) => w.text.trim().length > 0)
    .map((w) => ({
      word: formatText(w.text),
      start: w.start_time,
      end: w.end_time,
    }))

  const outPath = path.resolve(
    process.cwd(),
    `app/data/timings/${shortName}.json`
  )
  fs.writeFileSync(outPath, JSON.stringify(timings, null, 2))

  console.log(
    `// Successfully saved ${timings.length} word timings to app/data/timings/${shortName}.json`
  )
  console.log(
    '\n// Add the following object to the `testimonies` array in app/data/main.json:\n'
  )

  const testimonyObj = {
    content: fullText,
    author: author,
    color: color,
    audio: `/audios/${shortName}.mp3`,
  }

  console.log(JSON.stringify(testimonyObj, null, 2) + ',')
} catch (err) {
  console.error('Error processing file:', err.message)
  process.exit(1)
}
