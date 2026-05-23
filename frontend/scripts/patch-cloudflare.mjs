#!/usr/bin/env node
/**
 * Patches the broken `cloudflare` npm package (cloudflare-typescript SDK)
 * after npm install. Versions 4.x-6.x have a packaging bug where `.mjs`
 * files are placed at the wrong directory level, causing ERR_MODULE_NOT_FOUND.
 *
 * This script replaces the broken resources/ and _shims/ directories with
 * minimal stubs that allow the import chain to resolve without errors.
 */

import { existsSync, mkdirSync, writeFileSync, readdirSync, readFileSync, rmSync, cpSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');

// ── Stub content ────────────────────────────────────────────────────

const INDEX_MJS = `export class CloudflareError extends Error {
  constructor(message, status, headers) {
    super(message);
    this.status = status;
  }
}
export class APIError extends CloudflareError {}
export class NotFoundError extends CloudflareError {}

export class Cloudflare {
  static NotFoundError = NotFoundError;
  static CloudflareError = CloudflareError;
  static APIError = APIError;

  constructor(options = {}) {
    this._options = options;
    this.apiKey = options.apiKey;
    this.apiEmail = options.apiEmail;
    this.apiToken = options.apiToken;
  }
  get baseURL() { return this._options?.baseURL || 'https://api.cloudflare.com/client/v4'; }
}

export default Cloudflare;
`;

const RESOURCES_INDEX = 'export {};\n';

const UPLOADS_MJS = `export function isBlobLike() { return false; }
export function isMultipartBody() { return false; }
export function maybeMultipartFormRequestOptions() {}
export function multipartFormRequestOptions() {}
export function createForm() {}
`;

const ERROR_MJS = `export class CloudflareError extends Error {
  constructor(message, status, headers) {
    super(message);
    this.status = status;
  }
}
export class APIError extends CloudflareError {}
export class APIConnectionError extends CloudflareError {}
export class APIConnectionTimeoutError extends CloudflareError {}
export class APIUserAbortError extends CloudflareError {}
export class NotFoundError extends CloudflareError {}
export class ConflictError extends CloudflareError {}
export class RateLimitError extends CloudflareError {}
export class BadRequestError extends CloudflareError {}
export class AuthenticationError extends CloudflareError {}
export class InternalServerError extends CloudflareError {}
export class PermissionDeniedError extends CloudflareError {}
export class UnprocessableEntityError extends CloudflareError {}
`;

const PAGINATION_MJS = 'export {};\n';

const SHIMS_INDEX_MJS = `export const kind = 'node';
export function getDefaultAgent() { return null; }
export const fetch = globalThis.fetch;
export function init() {}
export class FormData {}
export class File {}
export class ReadableStream {}
export function getMultipartRequestOptions() {}
export function isFsReadStream() { return false; }
export function fileFromPath() {}
export function getPlatformHeader() { return 'node'; }
export function getDefaultHeaders() { return {}; }
export function safeJSON() {}
`;

const VERSION_MJS = "export const VERSION = '0.0.0';\n";

// ── Core module files to write ──────────────────────────────────────

const coreModules = {
  'index.mjs': INDEX_MJS,
  'uploads.mjs': UPLOADS_MJS,
  'error.mjs': ERROR_MJS,
  'pagination.mjs': PAGINATION_MJS,
  'version.mjs': VERSION_MJS,
  '_shims/index.mjs': SHIMS_INDEX_MJS,
  'resources/index.mjs': RESOURCES_INDEX,
};

// ── Helper ──────────────────────────────────────────────────────────

function ensureDir(dir) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

function writeFile(filepath, content) {
  ensureDir(dirname(filepath));
  writeFileSync(filepath, content, 'utf-8');
}

function patchCloudflarePackage(cfDir) {
  if (!existsSync(cfDir)) return false;

  const pkgPath = join(cfDir, 'package.json');
  if (!existsSync(pkgPath)) return false;

  console.log(`  📦 Patching cloudflare package at: ${cfDir}`);

  // Remove all existing resource subdirectories (they're broken)
  const resourcesDir = join(cfDir, 'resources');
  if (existsSync(resourcesDir)) {
    rmSync(resourcesDir, { recursive: true, force: true });
  }
  ensureDir(resourcesDir);

  // Write core module files
  for (const [relPath, content] of Object.entries(coreModules)) {
    writeFile(join(cfDir, relPath), content);
  }

  // Ensure _shims directory
  ensureDir(join(cfDir, '_shims'));

  return true;
}

// ── Main ────────────────────────────────────────────────────────────

function findCloudflarePackages(root) {
  const locations = [];
  
  // Check root node_modules
  const rootCf = join(root, 'node_modules', 'cloudflare');
  if (existsSync(join(rootCf, 'package.json'))) {
    locations.push(rootCf);
  }

  // Check @opennextjs/cloudflare's nested node_modules
  const nestedCf = join(root, 'node_modules', '@opennextjs', 'cloudflare', 'node_modules', 'cloudflare');
  if (existsSync(join(nestedCf, 'package.json'))) {
    locations.push(nestedCf);
  }

  // Scan other nested locations if needed
  const topDir = join(root, 'node_modules');
  if (existsSync(topDir)) {
    const scanForNested = (dir) => {
      try {
        const entries = readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          if (!entry.isDirectory() || entry.name.startsWith('.')) continue;
          const subDir = join(dir, entry.name);
          const nested = join(subDir, 'node_modules', 'cloudflare');
          if (existsSync(join(nested, 'package.json')) && !locations.includes(nested)) {
            locations.push(nested);
          }
          // Only scan one level deep in nested packages
          if (entry.name.startsWith('@')) {
            const scopedDir = join(dir, entry.name);
            const scopedEntries = readdirSync(scopedDir, { withFileTypes: true });
            for (const scopedEntry of scopedEntries) {
              if (!scopedEntry.isDirectory() || scopedEntry.name.startsWith('.')) continue;
              const scopedNested = join(scopedDir, scopedEntry.name, 'node_modules', 'cloudflare');
              if (existsSync(join(scopedNested, 'package.json')) && !locations.includes(scopedNested)) {
                locations.push(scopedNested);
              }
            }
          }
        }
      } catch { /* ignore */ }
    };
    scanForNested(topDir);
  }

  return locations;
}

console.log('\n🔧 Patching broken cloudflare npm packages...\n');

const found = findCloudflarePackages(rootDir);

if (found.length === 0) {
  console.log('  ⚠️  No cloudflare packages found to patch.');
  console.log('  (This is fine if the package is not installed yet.)\n');
} else {
  for (const cfDir of found) {
    const pkg = JSON.parse(readFileSync(join(cfDir, 'package.json'), 'utf-8'));
    patchCloudflarePackage(cfDir);
    console.log(`  ✅ Patched cloudflare v${pkg.version}\n`);
  }
}
