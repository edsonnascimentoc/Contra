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
function parseJobs(yaml) {
  const jobsBlockIndex = yaml.indexOf('\njobs:')
  if (jobsBlockIndex === -1) return []
  const after = yaml.slice(jobsBlockIndex + 1)
  const matches = [...after.matchAll(/^\s{2}([A-Za-z0-9_-]+):/gm)]
  const result = []
  for (let i = 0; i < matches.length; i++) {
    const name = matches[i][1]
    const start = matches[i].index
    const end = i + 1 < matches.length ? matches[i + 1].index : after.length
    const block = after.slice(start, end)
    const ifMatch = block.match(/^\s{4}if:\s*(.+)$/m)
    const needsMatch = block.match(/^\s{4}needs:\s*(.+)$/m)
    let needs = ''
    if (needsMatch) {
      const val = needsMatch[1].trim()
      if (val.startsWith('[')) {
        needs = val.replace(/[\[\]]/g, '').split(',').map(s => s.trim()).join(', ')
      } else {
        needs = val
      }
    }
    const envMatch = block.match(/^\s{4}environment:\s*[\r\n]+\s{6}name:\s*(\w+)/m)
    const env = envMatch ? envMatch[1] : ''
    result.push({ name, ifCond: ifMatch ? ifMatch[1].trim() : '', needs, env })
  }
  return result
}
const jobs = parseJobs(ci)
const environments = jobs.map(j => j.env).filter(Boolean)
const coverageXml = read(path.join(root, 'coverage', 'clover.xml'))
let coverageSummary = 'n/a'
if (coverageXml) {
  const m = coverageXml.match(/<metrics[^>]*statements="(\d+)"[^>]*coveredstatements="(\d+)"/)
  if (m) {
    const total = parseFloat(m[1])
    const covered = parseFloat(m[2])
    const pct = total > 0 ? ((covered / total) * 100).toFixed(1) : '0.0'
    coverageSummary = `${pct}% (${covered}/${total})`
  }
}
function gitInfo() {
  const info = { version: pkg.version || '0.0.0', commit: '', tag: '' }
  if (process.env.GITHUB_SHA) info.commit = process.env.GITHUB_SHA
  if (process.env.GITHUB_REF_NAME) info.tag = process.env.GITHUB_REF_NAME
  try {
    if (!info.commit) {
      const { execSync } = require('child_process')
      info.commit = execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()
      try {
        info.tag = execSync('git describe --tags --exact-match HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()
      } catch {}
    }
  } catch {}
  return info
}
const gi = gitInfo()
const doc = [
  `# Process Documentation`,
  ``,
  `Generated: ${now()}`,
  `Project: ${brandName}`,
  `Version: ${gi.version}`,
  `Commit: ${gi.commit || 'n/a'}`,
  `Tag: ${gi.tag || 'n/a'}`,
  ``,
  `## CI/CD`,
  `Jobs: ${jobs.map(j => j.name).join(', ') || 'n/a'}`,
  `Environments: ${environments.join(', ') || 'n/a'}`,
  ``,
  `### Jobs Table`,
  `| Job | If | Needs | Environment |`,
  `| --- | --- | --- | --- |`,
  ...jobs.map(j => `| ${j.name} | ${j.ifCond || '-'} | ${j.needs || '-'} | ${j.env || '-'} |`),
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
  `Unit/API: Vitest (coverage: ${coverageSummary})`,
  `E2E: Playwright`,
  ``,
].join('\n')
const out = path.join(root, 'build', 'process-docs.md')
write(out, doc)
process.stdout.write(`Wrote ${out}\n`)
