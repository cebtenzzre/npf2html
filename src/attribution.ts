import {BlogInfo} from './blog-info';
import {VisualMedia} from './media';
import {Renderer} from './renderer';

/** Attribution indicating where a content or layout block came from. */
export type Attribution =
  | PostAttribution
  | LinkAttribution
  | BlogAttribution
  | AppAttribution;

// cebtenzzre: sometimes attribution is an empty array, I have seen this in the wild
export type MaybeAttribution = Attribution | [];

/**
 * Type guard to check if {@link attr} is a valid Attribution object and not an
 * empty array.
 */
export function isAttribution(attr?: MaybeAttribution): attr is Attribution {
  return !!attr && 'type' in attr;
}

/**
 * Attributes an image to a particular post.
 *
 * @see https://www.tumblr.com/docs/npf#attribution-type-post
 */
export interface PostAttribution {
  type: 'post';

  /** The URL of the post to be attributed. */
  url: string;

  /** The post to be attributed. */
  post: Post;

  /** The blog whose post is attributed. */
  blog: BlogInfo;
}

/** A reference to a Tumblr post. */
export interface Post {
  id: string;
}

/**
 * Attributes an image to an arbitrary link.
 *
 * @see https://www.tumblr.com/docs/npf#attribution-type-link
 */
export interface LinkAttribution {
  type: 'link';

  /** The URL to be attributed for the content. */
  url: string;
}

/**
 * Attributes something to a specific Tumblr blog.
 *
 * @see https://www.tumblr.com/docs/npf#attribution-type-blog
 */
export interface BlogAttribution {
  type: 'blog';

  /** The blog to which this is attributed. */
  blog: BlogInfo;
}

/**
 * Attributes something to a third-party app.
 *
 * @see https://www.tumblr.com/docs/npf#attribution-type-app
 */
export interface AppAttribution {
  type: 'app';

  /** The canonical URL to the source content in the third-party app. */
  url: string;

  /** The name of the application to be attributed. */
  app_name?: string;

  /** Any display text that the client should use with the attribution. */
  display_text?: string;

  /**
   * A specific logo that the client should use with the third-party app
   * attribution.
   */
  logo?: VisualMedia;
}

/** Converts {@link attribution} to HTML. */
export function renderAttribution(
  renderer: Renderer,
  attribution: Attribution
): string {
  const href =
    attribution.type === 'blog' ? attribution.blog.url : attribution.url;
  let result =
    `<a class="${renderer.prefix}-attribution` +
    ` ${renderer.prefix}-attribution-${attribution.type}"` +
    ` href="${renderer.escape(href)}">`;

  switch (attribution.type) {
    case 'post':
    case 'blog':
      result += renderer.escape(attribution.blog.name);
      break;

    case 'link':
      result += renderer.escape(attribution.url);
      break;

    case 'app': {
      const display = attribution.display_text || attribution.app_name;
      if (display) result += renderer.escape(display);
      if (attribution.logo) {
        result += renderer.renderImageMedia([attribution.logo]);
      } else if (!display) {
        result += renderer.escape(attribution.url);
      }
    }
  }

  return result + '</a>';
}
