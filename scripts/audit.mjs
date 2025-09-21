#!/usr/bin/env node

import { readFileSync } from 'fs';
import { execSync } from 'child_process';

const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'));
const dependencies = Object.keys(packageJson.dependencies || {});

console.log('Auditing unused runtime dependencies...\n');

// Build the project to check bundle
try {
  console.log('Building project...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('Build successful.\n');
} catch (error) {
  console.error('Build failed. Cannot audit bundle.');
  process.exit(1);
}

// Check which dependencies are likely unused by looking for import statements
const unusedDeps = [];
for (const dep of dependencies) {
  try {
    // Use grep to search for imports of this dependency
    execSync(`grep -r "from '${dep}'" src/ --include="*.ts" --include="*.tsx"`, { stdio: 'pipe' });
  } catch {
    try {
      execSync(`grep -r "import.*'${dep}'" src/ --include="*.ts" --include="*.tsx"`, { stdio: 'pipe' });
    } catch {
      try {
        execSync(`grep -r "require('${dep}')" src/ --include="*.ts" --include="*.tsx"`, { stdio: 'pipe' });
      } catch {
        unusedDeps.push(dep);
      }
    }
  }
}

if (unusedDeps.length > 0) {
  console.log('Potentially unused runtime dependencies:');
  unusedDeps.forEach(dep => console.log(`  - ${dep}`));
  console.log('\nThese dependencies may be safe to remove if not used in build scripts or dynamic imports.');
} else {
  console.log('No obviously unused runtime dependencies found.');
}

console.log('\nAudit complete.');