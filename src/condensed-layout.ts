/**
 * Deprecated layout type that is equivalent to a rows layout with truncate_after.
 *
 * @see https://www.tumblr.com/docs/npf#layout-block-type-condensed
 *
 * @category Layout
 */
export interface CondensedLayout {
  type: 'condensed';

  /** An array of block indices that are part of this condensed layout. */
  blocks?: number[];

  /**
   * How the content should be truncated. If not set, defaults to the last
   * block in the blocks array.
   */
  truncate_after?: number;
}

