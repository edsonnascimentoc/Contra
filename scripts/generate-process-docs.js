const fs = require('fs')
const path = require('path')
function read(file) { try { return fs.readFileSync(file, 'utf8') } catch { return '' } }
function write(file, content) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, content) }
function now() { return new Date().toISOString() }
const root = path.resolve(__dirname, '..')
const pkg = JSON.parse(read(path.join(root, 'package.json')) || '{}')
const ci = read(path.join(root, '.github', 'workflows', 'ci.yml'))
const backupPs1 = read(path.join(root, 'scripts', 'backup.ps1'))
const brandCfg = read(path.join(root, 'src', 'lib', 'config.js'))
const netlifyToml = read(path.join(root, 'netlify.toml'))
const brandNameMatch = brandCfg.match(/export const BRAND_NAME.*?['"](.+?)['"]/)
const brandName = brandNameMatch ? brandNameMatch[1] : 'National Group'
const hasCleanup = /AddDays\(-45\)/.test(backupPs1) && /Select-Object -First 3/.test(backupPs1)
const backupScripts = Object.keys((pkg && pkg.scripts) || {}).filter((k) => k.startsWith('backup'))
const ciJobs = (ci.match(/^[^\s].*?:$/gm) || []).map((l) => l.replace(':', ''))
const environments = (ci.match(/environment:\s*\r?\n\s*name:\s*(\w+)/g) || []).map((m) => m.split(':').pop().trim())
const doc = [
  `# Process Documentation`,
  ``,
  `Generated: ${now()}`,
  `Project: ${brandName}`,
  ``,
  `## CI/CD`,
  `Jobs: ${ciJobs.join(', ') || 'n/a'}`,
  `Environments: ${environments.join(', ') || 'n/a'}`,
  ``,
  `## Netlify`,
  netlifyToml ? 'Configured' : 'Not configured',
  ``,
  `## Backups`,
  `Scripts: ${backupScripts.join(', ') || 'n/a'}`,
  `Cleanup: ${hasCleanup ? 'Remove 3 backups older than 45 days' : 'n/a'}`,
  ``,
  `## Secrets`,
  `Staging: NETLIFY_AUTH_TOKEN, NETLIFY_SITE_ID, SSH_HOST, SSH_USER, SSH_KEY, PM2_WORKDIR`,
  `Production: NETLIFY_AUTH_TOKEN, NETLIFY_SITE_ID, SSH_HOST, SSH_USER, SSH_KEY, PM2_WORKDIR`,
  ``,
  `## Tests`,
  `Unit/API: Vitest`,
  `E2E: Playwright`,
  ``,
].join('\n')
const out = path.join(root, 'build', 'process-docs.md')
write(out, doc)
process.stdout.write(`Wrote ${out}\n`)
