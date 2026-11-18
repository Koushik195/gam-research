// Publish the website version of the library to GitHub Pages (https://koushik195.github.io/gam-research/).
// 1. exports the published reports from the running app (tools/export-static.js) into site/
// 2. pushes site/ as a single fresh commit to the gh-pages branch (the branch holds only the website)
//   node tools/deploy-pages.js [--no-pdf]
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, 'site');
const REMOTE = 'https://github.com/Koushik195/gam-research.git';
const run = (cmd, cwd = ROOT) => execSync(cmd, { cwd, stdio: 'inherit' });

run(`node tools/export-static.js ${process.argv.includes('--no-pdf') ? '--no-pdf' : ''}`);
const day = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
fs.rmSync(path.join(SITE, '.git'), { recursive: true, force: true });
run('git init -q -b gh-pages', SITE);
run('git -c core.autocrlf=false add -A', SITE);
fs.writeFileSync(path.join(SITE, '..', '.pages-msg'), `Static snapshot of the GAM Research library (${day})\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>\n`);
run(`git commit -q -F "${path.join(ROOT, '.pages-msg')}"`, SITE);
fs.rmSync(path.join(ROOT, '.pages-msg'));
run(`git remote add origin ${REMOTE}`, SITE);
run('git push -q -f origin gh-pages', SITE);
console.log('Published. GitHub Pages updates in about a minute: https://koushik195.github.io/gam-research/library/');
