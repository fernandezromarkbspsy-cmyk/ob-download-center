const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const exts = ['.ts', '.tsx', '.js', '.jsx', '.json']

function walk(dir) {
  const files = []
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name)
    const stat = fs.statSync(p)
    if (stat.isDirectory()) {
      if (name === 'node_modules' || name === '.next' || name === '.git') continue
      files.push(...walk(p))
    } else if (/\.(ts|tsx|js|jsx)$/.test(name)) {
      files.push(p)
    }
  }
  return files
}

function existsWithExt(base) {
  for (const e of exts) {
    if (fs.existsSync(base + e)) return base + e
  }
  // index file
  for (const e of exts) {
    if (fs.existsSync(path.join(base, 'index' + e))) return path.join(base, 'index' + e)
  }
  return null
}

const files = walk(root)
const importRe = /import\s+(?:[^'"]+\s+from\s+)?['"]([^'"]+)['"]/g

const missing = []

for (const file of files) {
  const src = fs.readFileSync(file, 'utf8')
  let m
  while ((m = importRe.exec(src))) {
    const imp = m[1]
    if (imp.startsWith('.') || imp.startsWith('@/')) {
      let resolved
      if (imp.startsWith('@/')) {
        // tsconfig paths map @/* -> ./*
        const rel = imp.replace(/^@\//, '')
        resolved = path.join(root, rel)
      } else {
        resolved = path.resolve(path.dirname(file), imp)
      }
      const found = existsWithExt(resolved)
      if (!found) {
        missing.push({file: path.relative(root, file), import: imp, resolved})
      }
    }
  }
}

if (missing.length === 0) {
  console.log('No missing local imports found.')
  process.exit(0)
}

console.log('Missing imports:')
for (const m of missing) {
  console.log(`- ${m.file} -> ${m.import} (resolved: ${path.relative(root, m.resolved)})`)
}
process.exit(2)
