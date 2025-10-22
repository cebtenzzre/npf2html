import {isAttribution, MaybeAttribution} from './attribution';
import {VisualMedia} from './media';
import {Renderer} from './renderer';

/**
 * An NPF video type content block.
 *
 * @see https://www.tumblr.com/docs/npf#content-block-type-video
 *
 * @category Content
 */
export interface VideoBlock {
  type: 'video';

  /**
   * The URL to use for the video block. Either this, {@link media}, or both
   * will always be set.
   */
  url?: string;

  /**
   * The {@link Media} to use for the video block. Either this, {@link url}, or
   * both will always be set.
   */
  media?: VisualMedia;

  /**
   * The provider of the audio source, whether it's `tumblr` for native audio or
   * a trusted third party.
   */
  provider?: string;

  /** HTML code that could be used to embed this video into a webpage. */
  embed_html?: string;

  /** An {@link IFrame} used for constructing video iframes. */
  embed_iframe?: IFrame;

  /** A URL to the embeddable content to use as an iframe. */
  embed_url?: string;

  /**
   * An image media object to use as a "poster" for the video, usually a single
   * frame.
   */
  poster?: VisualMedia[];

  /** Optional provider-specific metadata about the video. */
  metadata?: Record<string, unknown>;

  /** Optional attribution information about where the video came from. */
  attribution?: MaybeAttribution;

  /** Whether this video can be played on a cellular connection. */
  can_autoplay_on_cellular?: boolean;

  /** The video duration in milliseconds. */
  duration?: number;
}

/**
 * An NPF iframe object.
 *
 * @see https://www.tumblr.com/docs/npf#embed-iframe-objects
 */
export interface IFrame {
  /** A URL used for constructing and embeddable video iframe. */
  url: string;

  /** The width of the video iframe */
  width: number;

  /** The height of the video iframe */
  height: number;
}

/**
 * Converts {@link block} to HTML.
 *
 * @category Content
 */
export function renderVideo(renderer: Renderer, block: VideoBlock): string {
  let result = `<figure class="${renderer.prefix}-block-video">`;
  if (block.media) {
    // cebtenzzre: use controls for consistency with tumblr-utils rendering of legacy posts
    result +=
      '<video controls src="' +
      renderer.escape(block.media?.url ?? block.url!) +
      '"';
    if (block.poster) {
      result +=
        ' poster="' +
        renderer.escape(
          block.poster.reduce((biggest, current) =>
            biggest && biggest.width > current.width ? biggest : current
          ).url
        ) +
        '"';
    }
    result += '></video>';
  } else if (block.embed_html) {
    result += block.embed_html;
  } else if (block.embed_iframe) {
    result +=
      `<iframe src="${renderer.escape(block.embed_iframe.url)}"` +
      ` width="${block.embed_iframe.width}"` +
      ` height="${block.embed_iframe.height}"></iframe>`;
  } else if (block.embed_url) {
    result += `<iframe src="${renderer.escape(block.embed_url)}"></iframe>`;
  } else {
    result +=
      `<a href="${renderer.escape(block.url!)}">` +
      renderer.escape(block.url!) +
      '</a>';
  }

  if (isAttribution(block.attribution)) {
    result +=
      '<figcaption>' +
      renderer.renderAttribution(block.attribution) +
      '</figcaption>';
  }
  result += '</figure>';
  return result;
}
