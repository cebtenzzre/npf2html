import {InlineFormat} from './inline-format';
import {Renderer} from './renderer';

/**
 * An NPF text type content block.
 *
 * @see https://www.tumblr.com/docs/npf#content-block-type-text
 *
 * @category Content
 */
export type TextBlock = TextBlockNoIndent | TextBlockIndented;

/**
 * The base interface for all types of text blocks.
 *
 * @category Content
 */
interface TextBlockBase {
  type: 'text';

  /** The text to use inside this block. */
  text: string;

  /**
   * The subtype of text block.
   *
   * @see https://www.tumblr.com/docs/npf#text-block-subtypes
   */
  subtype?:
    | 'heading1'
    | 'heading2'
    | 'quirky'
    | 'quote'
    | 'indented'
    | 'chat'
    | 'ordered-list-item'
    | 'unordered-list-item';

  /**
   * Inline formatting for this text.
   *
   * @see https://www.tumblr.com/docs/npf#inline-formatting-within-a-text-block
   */
  formatting?: InlineFormat[];
}

/**
 * A text block of a type that doesn't allow indentation.
 *
 * @category Content
 */
export interface TextBlockNoIndent extends TextBlockBase {
  subtype?: 'heading1' | 'heading2' | 'quirky' | 'quote' | 'chat';
}

/**
 * A text block of a type that allows indentation.
 *
 * @category Content
 */
export interface TextBlockIndented extends TextBlockBase {
  /**
   * The subtype of text block.
   *
   * @see https://www.tumblr.com/docs/npf#text-block-subtypes
   */
  subtype: 'indented' | 'ordered-list-item' | 'unordered-list-item';

  /** @see https://www.tumblr.com/docs/npf#text-block-subtype-list-item */
  indent_level?: number;
}

/**
 * Converts {@link block} to HTML.
 *
 * @category Content
 */
export function renderTextNoIndent(
  renderer: Renderer,
  block: TextBlockNoIndent
): string {
  const text = renderer.formatText(block.text, block.formatting);
  switch (block.subtype) {
    case 'heading1':
      return `<h1>${text}</h1>`;
    case 'heading2':
      return `<h2>${text}</h2>`;
    case 'quirky':
      return `<p class="${renderer.prefix}-block-text-quirky">${text}</p>`;
    case 'quote':
      // cebtenzzre: use blockquote for consistency with legacy post HTML, until we come up with better styling
      return `<blockquote class="${renderer.prefix}-block-text-quote"><p>${text}</p></blockquote>`;
    case 'chat':
      return `<p class="${renderer.prefix}-block-text-chat">${text}</p>`;
    default:
      return `<p>${text}</p>`;
  }
}

/**
 * Converts {@link blocksAndNested} to HTML.
 *
 * The first element of {@link blocksAndNested} determines the subtype of the
 * entire thing; any other blocks are guaranteed to have the same subtype. The
 * string elements of {@link blocksAndNested} ar {@link TextBlockIndented}
 * objects which are more deeply nested and have already been converted to HTML.
 *
 * @category Content
 */
export function renderTextIndented(
  renderer: Renderer,
  blocksAndNested: [TextBlockIndented, ...Array<TextBlockIndented | string>]
): string {
  const {subtype} = blocksAndNested[0];
  let contents = {
    indented: '<blockquote>',
    'ordered-list-item': '<ol>',
    'unordered-list-item': '<ul>',
  }[subtype];

  for (const element of blocksAndNested) {
    const string = typeof element === 'string';
    contents += subtype === 'indented' ? (string ? '' : '<p>') : '<li>';
    contents += string
      ? element
      : renderer.formatText(element.text, element.formatting);
    contents += subtype === 'indented' ? (string ? '' : '</p>') : '</li>';
  }
  contents += {
    indented: '</blockquote>',
    'ordered-list-item': '</ol>',
    'unordered-list-item': '</ul>',
  }[subtype];
  return contents;
}
