/**
 * src/lib/debug.ts — dev-only debugging helpers.
 * Everything here is a no-op outside `astro dev`, so it is safe to leave in
 * while you investigate, and trivial to delete afterwards.
 *
 * URL switches (dev only):
 *   /?skip=gallery,notices        hide those sections
 *   /?only=hero                   render only those sections
 *   /?skip=navbar,footer,loader   hide layout parts
 *   /?probe                       render every section alone and log its HTML size
 *   /?measure                     render the page content to a string and log its size
 */
export const DEBUG = import.meta.env.DEV;
const TAG = "[advaita]";

const stamp = () => new Date().toISOString().slice(11, 23);
export const log = (...a: unknown[]) => DEBUG && console.log(TAG, stamp(), ...a);
export const warn = (...a: unknown[]) => DEBUG && console.warn(TAG, stamp(), "⚠", ...a);
export const err = (...a: unknown[]) => DEBUG && console.error(TAG, stamp(), "✗", ...a);

export function fmtBytes(n: number): string {
  if (n < 0) return "unknown";
  if (n < 1024) return `${n} B`;
  if (n < 1024 ** 2) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 ** 2).toFixed(1)} MB`;
}

export function memory(): string {
  try {
    const m = process.memoryUsage();
    return `heap ${fmtBytes(m.heapUsed)} / rss ${fmtBytes(m.rss)}`;
  } catch {
    return "memory n/a";
  }
}

/** JSON length, or -1 if it can't be serialised (circular, or itself too big). */
export function jsonSize(v: unknown): number {
  try {
    return JSON.stringify(v)?.length ?? 0;
  } catch {
    return -1;
  }
}

/** Finds very long strings (e.g. base64 images) and repeated references. */
export function findBigStrings(root: unknown, limit = 20_000, maxHits = 10) {
  const hits: { path: string; length: number; preview: string }[] = [];
  const seen = new WeakSet<object>();
  const state = { repeated: null as string | null };

  const walk = (v: unknown, path: string, depth: number) => {
    if (hits.length >= maxHits || depth > 8) return;
    if (typeof v === "string") {
      if (v.length > limit) hits.push({ path, length: v.length, preview: v.slice(0, 60) });
      return;
    }
    if (v && typeof v === "object") {
      if (seen.has(v as object)) {
        if (!state.repeated) state.repeated = path;
        return;
      }
      seen.add(v as object);
      for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
        walk(val, `${path}.${k}`, depth + 1);
      }
    }
  };

  walk(root, "$", 0);
  return { hits, repeated: state.repeated };
}

/** One-call summary of a CMS dataset. */
export function describeData(name: string, value: unknown) {
  if (!DEBUG) return;
  const isArr = Array.isArray(value);
  const size = jsonSize(value);
  log(
    `${name}: type=${isArr ? "array" : typeof value}` +
      (isArr ? ` length=${(value as unknown[]).length}` : "") +
      ` json=${size < 0 ? "UNSERIALISABLE" : fmtBytes(size)}`,
  );
  if (isArr && (value as unknown[]).length > 0) {
    log(`${name}: first item keys →`, Object.keys(((value as any[])[0] ?? {}) as object));
  }
  const { hits, repeated } = findBigStrings(value);
  for (const h of hits) {
    warn(`${name}: HUGE string at ${h.path} (${h.length.toLocaleString()} chars) starts with "${h.preview}"`);
  }
  if (repeated) warn(`${name}: same object referenced twice at ${repeated} (circular or shared)`);
  if (size < 0 || size > 1_000_000) warn(`${name}: payload is over 1 MB or unserialisable`);
}

/** Dev-only URL switches. In production everything is shown and nothing is probed. */
export function getFlags(url: URL) {
  const list = (key: string) =>
    new Set(
      (url.searchParams.get(key) ?? "")
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean),
    );

  if (!DEBUG) {
    return { skip: new Set<string>(), only: new Set<string>(), probe: false, measure: false, show: (_n: string) => true };
  }

  const skip = list("skip");
  const only = list("only");
  return {
    skip,
    only,
    probe: url.searchParams.has("probe"),
    measure: url.searchParams.has("measure"),
    show: (name: string) => {
      const n = name.toLowerCase();
      return only.size ? only.has(n) : !skip.has(n);
    },
  };
}