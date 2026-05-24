#!/usr/bin/env node
/**
 * Generates a Cloudflare Pages-compatible _worker.js from the OpenNext build.
 *
 * Cloudflare Pages Advanced Mode (_worker.js):
 * - ALL requests hit the _worker.js
 * - env.ASSETS is available to serve static files
 * - We try env.ASSETS first, then fall through to the OpenNext handler
 *
 * This wrapper converts the OpenNext worker (designed for Workers with Assets)
 * into a Pages-compatible format.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputDir = resolve(__dirname, '..', '.open-next');
const workerPath = resolve(outputDir, 'worker.js');

if (!existsSync(workerPath)) {
  console.error('❌ worker.js not found at', workerPath);
  console.error('   Run "opennextjs-cloudflare build" first.');
  process.exit(1);
}

const WORKER_WRAPPER = `// Auto-generated _worker.js for Cloudflare Pages
// Serves static assets from env.ASSETS, then falls through to OpenNext handler

// Static imports from OpenNext worker (converted from dynamic import)
import { handleCdnCgiImageRequest, handleImageRequest } from "./cloudflare/images.js";
import { runWithCloudflareRequestContext } from "./cloudflare/init.js";
import { maybeGetSkewProtectionResponse } from "./cloudflare/skew-protection.js";
import { handler as middlewareHandler } from "./middleware/handler.mjs";
import { handler as serverHandler } from "./server-functions/default/handler.mjs";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 1. Try to serve static assets from env.ASSETS (Cloudflare Pages binding)
    //    Assets are in /assets/ subdirectory, so we rewrite the URL
    if (env.ASSETS) {
      try {
        const assetUrl = new URL(request.url);
        // Rewrite /path -> /assets/path (static files are in assets/ subdir)
        if (!assetUrl.pathname.startsWith('/cdn-cgi/')) {
          assetUrl.pathname = '/assets' + assetUrl.pathname;
          const assetRequest = new Request(assetUrl, request);
          const assetResponse = await env.ASSETS.fetch(assetRequest);
          if (assetResponse.status !== 404 && assetResponse.status !== 403) {
            return assetResponse;
          }
        }
      } catch {
        // ASSETS fetch failed, continue to worker handler
      }
    }

    // 2. If not found in assets, use the OpenNext handler
    return runWithCloudflareRequestContext(request, env, ctx, async () => {
      const response = maybeGetSkewProtectionResponse(request);
      if (response) {
        return response;
      }

      // Serve images in development.
      if (url.pathname.startsWith("/cdn-cgi/image/")) {
        return handleCdnCgiImageRequest(url, env);
      }

      // Fallback for the Next default image loader.
      if (url.pathname ===
          \`\${globalThis.__NEXT_BASE_PATH__}/_next/image\${globalThis.__TRAILING_SLASH__ ? "/" : ""}\`) {
        return await handleImageRequest(url, request.headers, env);
      }

      // Process through middleware
      const reqOrResp = await middlewareHandler(request, env, ctx);
      if (reqOrResp instanceof Response) {
        return reqOrResp;
      }

      // Process through server handler
      return serverHandler(reqOrResp, env, ctx, request.signal);
    });
  },
};
`;

const workerJsPath = resolve(outputDir, '_worker.js');
writeFileSync(workerJsPath, WORKER_WRAPPER, 'utf-8');
console.log('✅ Generated _worker.js for Cloudflare Pages at', workerJsPath);
