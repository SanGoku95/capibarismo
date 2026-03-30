#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read .env file
const envPath = join(__dirname, '../.env');
const envContent = readFileSync(envPath, 'utf-8');

// Parse .env file
const envVars = {};
envContent.split('\n').forEach(line => {
  line = line.trim();
  if (!line || line.startsWith('#')) return;

  const [key, ...valueParts] = line.split('=');
  const value = valueParts.join('=').trim();

  if (key && value) {
    envVars[key] = value;
  }
});

// Generate terraform.tfvars content
const tfvarsContent = `# Auto-generated from .env - DO NOT EDIT MANUALLY
# Run: npm run tf:vars to regenerate

mistral_api_key       = "${envVars.MISTRAL_API_KEY || ''}"
openai_api_key        = "${envVars.OPENAI_API_KEY || ''}"
database_url          = "${envVars.DATABASE_URL || ''}"
auth_token            = "${envVars.AUTH_TOKEN || ''}"
blob_read_write_token = "${envVars.BLOB_READ_WRITE_TOKEN || ''}"
`;

// Write terraform.tfvars
const tfvarsPath = join(__dirname, '../terraform/terraform.tfvars');
writeFileSync(tfvarsPath, tfvarsContent);

console.log('✅ Generated terraform/terraform.tfvars from .env');
console.log('⚠️  Do not commit this file - it contains secrets!');
