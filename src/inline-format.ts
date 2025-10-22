import {BlogInfo} from './blog-info';
import {Renderer} from './renderer';

/**
 * A single piece of inline formatting for a {@link TextBlock}.
 *
 * @see https://www.tumblr.com/docs/npf#inline-formatting-within-a-text-block
 *
 * @category Inline
 */
export type InlineFormat =
  | InlineFormatBasic
  | InlineFormatLink
  | InlineFormatMention
  | InlineFormatColor;

/** The base interface for all types of inline formatting. */
interface InlineFormatBase {
  /** The starting index of the formatting range (inclusive). */
  start: number;

  /** The ending index of the formatting range (inclusive). */
  end: number;
}

/**
 * Basic inline formatting types that require no additional information.
 *
 * @see https://www.tumblr.com/docs/npf#inline-format-types-bold-italic-strikethrough-small
 *
 * @category Inline
 */
export interface InlineFormatBasic extends InlineFormatBase {
  type: 'bold' | 'italic' | 'strikethrough' | 'small';
}

/**
 * An inline link.
 *
 * @see https://www.tumblr.com/docs/npf#inline-format-type-link
 *
 * @category Inline
 */
export interface InlineFormatLink extends InlineFormatBase {
  type: 'link';

  /** The link's URL. */
  url: string;
}

/**
 * A mention of another blog.
 *
 * @see https://www.tumblr.com/docs/npf#inline-format-type-mention
 *
 * @category Inline
 */
export interface InlineFormatMention extends InlineFormatBase {
  type: 'mention';

  /** The mentioned blog. */
  blog: BlogInfo;
}

/**
 * Colored text.
 *
 * @see https://www.tumblr.com/docs/npf#inline-format-type-color
 *
 * @category Inline
 */
export interface InlineFormatColor extends InlineFormatBase {
  type: 'color';

  /** The color to use, in standard hex format, with leading #. */
  hex: string;
}

/**
 * An intermediate interface used when processing inline formatting that
 * represents a specific kind of formatting, its range in terms of JS indices,
 * and the formatting nested within it.
 */
interface InlineFormatSpan {
  /** The formatting to apply. */
  format: InlineFormat;

  /**
   * Unique-ish identity for dedupe and diff.
   */
  key: string;

  /**
   * The inclusive code point index in the text at which this span starts.
   */
  start: number;

  /**
   * The exclusive code point index in the text at which this span ends (exclusive).
   */
  end: number;
}

/**
 * Pre-processes {@link formatting} to combine any adjacent identical formats.
 * Tumblr sometimes splits these up when other formatting is also present, so
 * this produces cleaner HTML.
 **/
function mergeAdjacentFormats(formatting: InlineFormat[]): InlineFormat[] {
  // A map from format types to the index in mergedFormats of the most recent
  // occurance of those formats.
  const lastFormatOfType: Partial<Record<InlineFormat['type'], number>> = {};
  const mergedFormats: InlineFormat[] = [];

  for (const format of formatting) {
    // Never merge links or mentions.
    if (format.type === 'link' || format.type === 'mention') {
      mergedFormats.push(format);
      continue;
    }

    const lastIndex = lastFormatOfType[format.type];
    if (lastIndex !== undefined) {
      const last = mergedFormats[lastIndex];
      if (last && canMerge(last, format)) {
        mergedFormats[lastIndex] = {...last, end: format.end};
        continue;
      }
    }

    lastFormatOfType[format.type] = mergedFormats.length;
    mergedFormats.push(format);
  }

  return mergedFormats;
}

/** Returns whether two {@link InlineFormat}s can be safely merged. */
function canMerge(format1: InlineFormat, format2: InlineFormat): boolean {
  if (format1.end !== format2.start) return false;
  if (format1.type !== format2.type) return false;
  switch (format1.type) {
    case 'bold':
    case 'italic':
    case 'strikethrough':
    case 'small':
      return true;
    case 'link':
    case 'mention':
      return false;
    case 'color':
      return format1.hex === (format2 as InlineFormatColor).hex;
  }
}

function makeKey(f: InlineFormat): string {
  switch (f.type) {
    case 'bold':
    case 'italic':
    case 'strikethrough':
    case 'small':
      return f.type;
    case 'color':
      return `color:${(f as InlineFormatColor).hex.toLowerCase()}`;
    case 'link':
      return `link:${(f as InlineFormatLink).url}`;
    case 'mention':
      // blog.url is a decent identity key for mentions in practice
      return `mention:${(f as InlineFormatMention).blog.url}`;
  }
}

function stableOrderRank(f: InlineFormatSpan): number {
  // Outer → inner. Keep a deterministic order to minimize churn.
  switch (f.format.type) {
    case 'link':
      return 0; // anchors outermost
    case 'mention':
      return 1;
    case 'color':
      return 2;
    case 'bold':
      return 3;
    case 'italic':
      return 4;
    case 'strikethrough':
      return 5;
    case 'small':
      return 6;
  }
}

function isAnchor(f: InlineFormatSpan): boolean {
  return f.format.type === 'link' || f.format.type === 'mention';
}

// Choose exactly one active anchor for a segment using
// "most-recently opened wins": maximal start; tie → tighter range; tie → key.
function pickWinningAnchor(
  active: InlineFormatSpan[]
): InlineFormatSpan | null {
  const anchors = active.filter(isAnchor);
  if (anchors.length === 0) return null;
  anchors.sort((a, b) => {
    if (a.start !== b.start) return b.start - a.start; // later start wins
    const lenA = a.end - a.start;
    const lenB = b.end - b.start;
    if (lenA !== lenB) return lenA - lenB; // tighter wins
    return a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
  });
  return anchors[0]!;
}

function openTag(renderer: Renderer, f: InlineFormatSpan): string {
  switch (f.format.type) {
    case 'bold':
      return '<strong>';
    case 'italic':
      return '<em>';
    case 'strikethrough':
      return '<s>';
    case 'small':
      return '<small>';
    case 'color':
      return `<span style="color: ${renderer.escape(f.format.hex)}">`;
    case 'link':
      return `<a href="${renderer.escape(f.format.url)}">`;
    case 'mention':
      return `<a class="${renderer.prefix}-inline-mention" href="${renderer.escape(f.format.blog.url)}">`;
  }
}

function closeTag(f: InlineFormatSpan): string {
  switch (f.format.type) {
    case 'bold':
      return '</strong>';
    case 'italic':
      return '</em>';
    case 'strikethrough':
      return '</s>';
    case 'small':
      return '</small>';
    case 'color':
      return '</span>';
    case 'link':
    case 'mention':
      return '</a>';
  }
}

// --- helpers: codepoint <-> code unit mapping ---
function buildCpToCuMap(s: string): number[] {
  const map: number[] = [0]; // cp index -> cu offset
  let cu = 0;
  for (let i = 0; i < s.length; ) {
    const code = s.charCodeAt(i);
    const isHigh = (code & 0xfc00) === 0xd800;
    const step = isHigh ? 2 : 1;
    cu += step;
    i += step;
    map.push(cu);
  }
  return map; // length = cpLen + 1 (terminal offset at end)
}

/**
 * Applies the formatting specified by {@link format} to {@link html}, which may
 * already include nested formatting.
 *
 * @category Inline
 */
export function renderInlineFormat(
  renderer: Renderer,
  html: string,
  format: InlineFormat
): string {
  switch (format.type) {
    case 'bold':
      return `<strong>${html}</strong>`;
    case 'italic':
      return `<em>${html}</em>`;
    case 'strikethrough':
      return `<s>${html}</s>`;
    case 'small':
      return `<small>${html}</small>`;
    case 'link':
      return `<a href="${renderer.escape(format.url)}">${html}</a>`;
    case 'mention':
      return (
        `<a class="${renderer.prefix}-inline-mention"` +
        ` href="${renderer.escape(format.blog.url)}">${html}</a>`
      );
    case 'color':
      return (
        `<span style="color: ${renderer.escape(format.hex)}">` +
        html +
        '</span>'
      );
  }
}

/** HTML-escapes {@link text} and formats it according to {@link formatting}. */
export function formatText(
  renderer: Renderer,
  text: string,
  formatting: InlineFormat[] | undefined
): string {
  if (!formatting || formatting.length === 0) return renderer.escape(text);

  // Optional prepass: merge adjacent identical formats
  const fmts = mergeAdjacentFormats(formatting);

  // Build code-point → code-unit map
  const cpToCu = buildCpToCuMap(text);
  const cpLen = cpToCu.length - 1;

  // Normalize, clamp, make keys
  type Range = {f: InlineFormatSpan};
  const ranges: Range[] = [];
  for (const raw of fmts) {
    const startCp = Math.max(0, Math.min(cpLen, raw.start));
    const endCpEx = Math.max(startCp, Math.min(cpLen, raw.end ?? raw.start));
    if (startCp >= endCpEx) continue;
    const keyed: InlineFormatSpan = {
      format: raw,
      key: makeKey(raw),
      start: startCp,
      end: endCpEx,
    };
    ranges.push({f: keyed});
  }
  if (ranges.length === 0) return renderer.escape(text);

  // Deterministic sort (start, end, rank, key)
  ranges.sort(
    (A, B) =>
      A.f.start - B.f.start ||
      A.f.end - B.f.end ||
      stableOrderRank(A.f) - stableOrderRank(B.f) ||
      (A.f.key < B.f.key ? -1 : A.f.key > B.f.key ? 1 : 0)
  );

  // Collect breakpoints
  const bpSet = new Set<number>();
  for (const r of ranges) {
    bpSet.add(r.f.start);
    bpSet.add(r.f.end);
  }
  bpSet.add(0);
  bpSet.add(cpLen);
  const bps = Array.from(bpSet).sort((a, b) => a - b);

  // Sweep state
  let ri = 0; // lower bound of possibly-active ranges
  const open: InlineFormatSpan[] = []; // open stack (outer → inner)
  let out = '';

  for (let i = 0; i < bps.length - 1; i++) {
    const segStart = bps[i]!;
    const segEnd = bps[i + 1]!;
    if (segStart >= segEnd) continue;

    // Compute active formats for this segment
    while (ri < ranges.length && ranges[ri]!.f.end <= segStart) ri++;

    const active: InlineFormatSpan[] = [];
    for (let j = ri; j < ranges.length; j++) {
      const r = ranges[j]!.f;
      if (r.start > segStart) break;
      if (r.end > segStart) active.push(r);
    }

    // Dedupe by key
    const dedup: InlineFormatSpan[] = [];
    {
      const seen = new Set<string>();
      for (const f of active) {
        if (seen.has(f.key)) continue;
        seen.add(f.key);
        dedup.push(f);
      }
    }

    // Select exactly one anchor per segment
    const winner = pickWinningAnchor(dedup);

    // Desired stack for this segment (filter to winner anchor + non-anchors)
    const wanted: InlineFormatSpan[] = [];
    for (const f of dedup) {
      if (isAnchor(f)) {
        if (winner && f.key === winner.key) wanted.push(f);
      } else {
        wanted.push(f);
      }
    }

    // Smart ordering to minimize tag reopening:
    // 1. Formats that started earlier should be outer (opened first)
    // 2. When formats start at the same position, those ending later should be outer
    wanted.sort((a, b) => {
      // Anchors always go first (outermost)
      const aIsAnchor = isAnchor(a);
      const bIsAnchor = isAnchor(b);
      if (aIsAnchor !== bIsAnchor) return aIsAnchor ? -1 : 1;

      // Sort by start position (earlier start = outer = earlier in list)
      if (a.start !== b.start) return a.start - b.start;

      // If same start, sort by end position (later end = outer = earlier in list)
      if (a.end !== b.end) return b.end - a.end;

      // Tie: use stable rank
      const ra = stableOrderRank(a);
      const rb = stableOrderRank(b);
      if (ra !== rb) return ra - rb;

      // Final tie: use key
      return a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
    });

    // Diff open vs wanted: close extras
    let lcp = 0;
    while (
      lcp < open.length &&
      lcp < wanted.length &&
      open[lcp]!.key === wanted[lcp]!.key
    ) {
      lcp++;
    }
    for (let c = open.length - 1; c >= lcp; c--) out += closeTag(open[c]!);
    open.length = lcp;

    // Open new ones
    for (let o = lcp; o < wanted.length; o++) {
      const f = wanted[o]!;
      out += openTag(renderer, f);
      open.push(f);
    }

    // Emit text slice
    const cuStart = cpToCu[segStart]!;
    const cuEnd = cpToCu[segEnd]!;
    out += renderer.escape(text.substring(cuStart, cuEnd));
  }

  // Close remaining
  for (let c = open.length - 1; c >= 0; c--) out += closeTag(open[c]!);

  return out;
}
