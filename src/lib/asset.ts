/**
 * Prefix a /public asset path with the deploy base path.
 *
 * Next's `basePath` rewrites routes, `_next/*` chunks and next/font URLs, but
 * NOT raw string references to /public assets (plain <img src>, fetch(), image
 * preloads). This helper covers those so assets resolve when the site is hosted
 * under a sub-path (e.g. GitHub Pages: /paria-ghorashi-site/...). Empty in dev
 * and the standalone build, so those are unaffected.
 */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const asset = (path: string): string => `${BASE}${path}`;
