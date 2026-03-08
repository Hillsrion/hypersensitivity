import fs from 'fs'
import path from 'path'

// Get file path from arguments or use default
const targetPath = process.argv[2] || 'app/data/timings/scenes.json'
const filePath = path.join(process.cwd(), targetPath)

if (!fs.existsSync(filePath)) {
  console.error(`File not found: ${filePath}`)
  process.exit(1)
}

const scenes = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

const punctuationRegex = /^[?!.:,;]+$/

console.log(`Cleaning punctuation in ${targetPath}...`)

let mergedCount = 0

for (const key in scenes) {
  const entries = scenes[key]
  const newEntries = []

  for (let i = 0; i < entries.length; i++) {
    const current = entries[i]

    if (current.word && punctuationRegex.test(current.word)) {
      if (newEntries.length > 0) {
        const last = newEntries[newEntries.length - 1]
        if (last.word) {
          // French typography: space before ?, !, :, ;
          const needsSpace = /[?!:;]/.test(current.word)
          last.word = `${last.word}${needsSpace ? ' ' : ''}${current.word}`
          mergedCount++
          // Keep timing of the word itself
          continue
        }
      }
    }

    newEntries.push(current)
  }

  scenes[key] = newEntries
}

fs.writeFileSync(filePath, JSON.stringify(scenes, null, 2), 'utf-8')
console.log(`Successfully merged ${mergedCount} punctuation marks.`)
