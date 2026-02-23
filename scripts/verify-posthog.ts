/**
 * PostHog Configuration Verification Script
 * Verifies PostHog SDK is properly configured and up to date
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MIN_VERSION = '1.352.0';
const REQUIRED_ENV_VAR = 'VITE_POSTHOG_KEY';

function parseVersion(version: string): number[] {
  return version.replace(/[^\d.]/g, '').split('.').map(Number);
}

function compareVersions(v1: string, v2: string): number {
  const parts1 = parseVersion(v1);
  const parts2 = parseVersion(v2);
  
  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const part1 = parts1[i] || 0;
    const part2 = parts2[i] || 0;
    
    if (part1 > part2) return 1;
    if (part1 < part2) return -1;
  }
  
  return 0;
}

function checkVersion(): boolean {
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  
  const currentVersion = packageJson.dependencies['posthog-js'];
  if (!currentVersion) {
    console.error('❌ posthog-js not found in dependencies');
    return false;
  }
  
  const cleanVersion = currentVersion.replace(/[\^~]/, '');
  const comparison = compareVersions(cleanVersion, MIN_VERSION);
  
  if (comparison >= 0) {
    console.log(`✅ PostHog SDK version: ${cleanVersion}`);
    return true;
  } else {
    console.error(`❌ PostHog SDK version ${cleanVersion} is below minimum ${MIN_VERSION}`);
    return false;
  }
}

function checkConfiguration(): boolean {
  const posthogPath = path.join(__dirname, '..', 'src', 'lib', 'posthog.tsx');
  const content = fs.readFileSync(posthogPath, 'utf-8');
  
  const checks = [
    { name: 'PostHog initialization', pattern: /posthog\.init/ },
    { name: 'Reverse proxy configured', pattern: /(POSTHOG_HOST\s*=\s*['"]?\/_capi|api_host.*_capi)/ },
    { name: 'Session recording enabled', pattern: /session_recording/ },
    { name: 'Autocapture enabled', pattern: /autocapture:\s*true/ },
    { name: 'Performance tracking', pattern: /capture_performance:\s*true/ },
    { name: 'Error tracking', pattern: /\$exception/ },
  ];
  
  let allPassed = true;
  
  checks.forEach(check => {
    if (check.pattern.test(content)) {
      console.log(`✅ ${check.name}`);
    } else {
      console.error(`❌ ${check.name} - not found`);
      allPassed = false;
    }
  });
  
  return allPassed;
}

function checkEnvironment(): void {
  const envExamplePath = path.join(__dirname, '..', '.env.example');
  
  if (fs.existsSync(envExamplePath)) {
    const envContent = fs.readFileSync(envExamplePath, 'utf-8');
    if (envContent.includes(REQUIRED_ENV_VAR)) {
      console.log(`✅ ${REQUIRED_ENV_VAR} documented in .env.example`);
    } else {
      console.warn(`⚠️  ${REQUIRED_ENV_VAR} not documented in .env.example`);
    }
  }
  
  console.log(`\nℹ️  Remember to set ${REQUIRED_ENV_VAR} in:`);
  console.log('   - .env.local for development (optional)');
  console.log('   - Vercel dashboard for production (required for analytics)');
}

function checkProxyConfiguration(): boolean {
  const vercelConfigPath = path.join(__dirname, '..', 'vercel.json');
  
  if (!fs.existsSync(vercelConfigPath)) {
    console.error('❌ vercel.json not found');
    return false;
  }
  
  const config = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf-8'));
  const hasProxyRewrites = config.rewrites?.some((r: any) => 
    r.source?.includes('_capi') && r.destination?.includes('posthog.com')
  );
  
  if (hasProxyRewrites) {
    console.log('✅ Reverse proxy configured in vercel.json');
    return true;
  } else {
    console.error('❌ Reverse proxy not configured in vercel.json');
    return false;
  }
}

console.log('🔍 PostHog Configuration Verification\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const versionOk = checkVersion();
console.log('');

const configOk = checkConfiguration();
console.log('');

const proxyOk = checkProxyConfiguration();
console.log('');

checkEnvironment();

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

if (versionOk && configOk && proxyOk) {
  console.log('✅ All PostHog checks passed!\n');
  process.exit(0);
} else {
  console.log('❌ Some PostHog checks failed. Review the output above.\n');
  process.exit(1);
}
