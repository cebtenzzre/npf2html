import {isAttribution, MaybeAttribution} from './attribution';
import {VisualMedia} from './media';
import {Renderer} from './renderer';

/**
 * An NPF image type content block.
 *
 * @see https://www.tumblr.com/docs/npf#content-block-type-image
 *
 * @category Content
 */
export interface ImageBlock {
  type: 'image';

  /**
   * An array of {@link VisualMedia} objects which represent different available
   * sizes of this image asset.
   */
  media: VisualMedia[];

  /** Colors used in the image. */
  colors?: Record<string, string>;

  /** A feedback token to use when this image block is a GIF Search result. */
  feedback_token?: string;

  /**
   * For GIFs, this is a single-frame "poster".
   *
   * @see https://www.tumblr.com/docs/npf#gif-posters
   */
  poster?: VisualMedia;

  /** @see https://www.tumblr.com/docs/npf#attributions */
  attribution?: MaybeAttribution;

  /** Text used to describe the image, for screen readers. */
  alt_text?: string;

  /** A caption typically shown under the image. */
  caption?: string;
}

/**
 * Converts {@link block} to HTML.
 *
 * @category Content
 */
export function renderImage(renderer: Renderer, block: ImageBlock): string {
  const highestResImage = block.media.reduce((best, current) =>
    best && best.width > current.width ? best : current
  );
  let result =
    `<figure class="${renderer.prefix}-block-image">` +
    `<a href="${renderer.escape(highestResImage.url)}">` +
    renderer.renderImageMedia(block.media, {alt: block.alt_text}) +
    '</a>';
  if (block.caption || isAttribution(block.attribution)) {
    result += '<figcaption>';
    if (block.caption) {
      result +=
        `<span class="${renderer.prefix}-block-image-caption">` +
        renderer.escape(block.caption) +
        '</span>';
    }
    if (isAttribution(block.attribution))
      result += renderer.renderAttribution(block.attribution);
    result += '</figcaption>';
  }
  result += '</figure>';
  return result;
}
