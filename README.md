# `npf2html`

A simple zero-dependency package for converting Tumblr's [Neue Post Format] to
standard HTML.

[Neue Post Format]: https://www.tumblr.com/docs/npf

This is recommended for use along with [tumblr.js], which can interact with the
Tumblr API to get the NPF for Tumblr posts.

[tumblr.js]: https://www.npmjs.com/package/tumblr.js

## API

[**API Docs**](https://nex3.github.io/npf2html/)

This module exports a primary entrypoint function, [`npf2html`], which takes a
list of content blocks as provided by the Tumblr API's `post.content` and
returns it as HTML. It's also recommended you pass in `post.layout` and
`post.asking_avatar` as [options] to accurately reproduce the structure of the
post.

[`npf2html`]: https://nex3.github.io/npf2html/functions/default.html
[options]: https://nex3.github.io/npf2html/interfaces/Options.html

```js
import npf2html from 'npf2html';
// or for CJS:
// const npf2html = require('npf2html');

import * as tumblr from "tumblr.js";

const client = new tumblr.Client({
  consumer_key: "<your key goes here>",
});

const response = await client.blogPosts("the-lonelyshepherd", {
  id: "751572408377507840",
  npf: true
});

const post = response.posts[0];
console.log(npf2html(post.content, {
  layout: post.layout,
  askingAvatar: post.asking_avatar,
}));
```

## Output

This package's goal is *not* to produce the same HTML as the Tumblr website
itself. Instead, it aims to produce reasonably clean, semantic, easy-to-style
HTML while following the general presentation guidelines for Tumblr API clients.

In many situations, the output will include `npf-...` classes to make it easier
to style different blocks. However, in cases where the meaning of a given
element is always clear from the structure of the HTML, classes may be omitted
for cleaner output.

Various components may be omitted, depending on what's sent down by the server.

### Audio Block

Most audio blocks look like:

```html
<figure class="npf-block-audio">
  <audio controls src="..."></audio>
  <figcaption>
    <img src="..."> <!-- the "poster" for the audio track -->
    <span class="npf-block-audio-title">...</span> -
    <span class="npf-block-audio-artist">...</span> on
    <span class="npf-block-audio-album">...</span>
    <a class="npf-attribution" href="...">...</a>
  </figcaption>
</figure>
```

However, audio may also be represented as a plain link:

```html
<figure class="npf-block-audio">
  <a href="...">
    <img src="..."> <!-- the "poster" for the audio track -->
    <span class="npf-block-audio-title">...</span> -
    <span class="npf-block-audio-artist">...</span> on
    <span class="npf-block-audio-album">...</span>
  </a>
  <figcaption>
    <a class="npf-attribution" href="...">...</a>
  </figcaption>
</figure>
```

Or as an iframe embed:

```html
<figure class="npf-block-audio">
  <iframe src="...."></iframe>
  <figcaption>
    <a class="npf-attribution" href="...">...</a>
  </figcaption>
</figure>
```

### Image Block

Image blocks look like:

```html
<figure class="npf-block-image">
  <a href="...">
    <img src="...">
  </a>
  <figcaption>
    <span class="npf-block-image-caption">...</span>
    <a class="npf-attribution" href="...">blogname</a>
  </figcaption>
</figure>
```

### Link Block

Link blocks look like:

```html
<a class="npf-block-link" href="...">
  <img src="..."> <!-- the "poster" for the link -->
  <h2>...</h2> <!-- the link title, or URL if title is unavailable -->
  <p class="npf-block-link-site">...</p>
  <p class="npf-block-link-author">...</p>
  <p class="npf-block-link-description">...</p>
</a>
```

### Paywall Block

Paywall blocks look like:

```html
<a class="npf-block-paywall ..." href="...">
  <h2>...</h2> <!-- paywall title -->
  <p>...</p> <!-- paywall description or label -->
</a>
```

There are three types of paywall:

* An unpaid paywall has the class `npf-block-paywall-cta`, and has both a title
  and description.

* A disabled paywall has the class `npf-block-paywall-disabled`, and has both a
  title and description.

* A paywall for which the viewer has paid has the class
  `npf-block-paywall-divider`, and has only text, no title. It may also have a
  `--npf-paywall-color` CSS variable set with the divider color.

### Poll Block

Poll blocks look like:

```html
<div class="npf-block-poll">
  <h2>...</h2> <!-- poll question -->
  <ul>
    <li>...</li> <!-- poll option -->
    ...
  </ul>
</div>
```

Polls can't be interacted with outside the Tumblr web interface, so this doesn't
include any interactive elements.

### Text Block

Text blocks are rendered either as `<h1>`s, `<h2>`s, `<blockquote>`s, `<ul>`s,
`<li>`s, or `<p>`s. The latter may have one of the following classes:

* `npf-block-text-quirky` indicates text that's rendered in a large cursive
  font.

* `npf-block-text-quote` indicates text that's rendered in a large serif font.

* `npf-block-text-chat` indicates text that's rendered in a monospace font.

Text blocks also support the following inline formatting:

* Plain `<strong>`, `<em>`, `<small>`, `<s>`, and `<a>` tags.

* `<a class="npf-inline-mention">` tags, which indicate mentions of other blogs.

* `<span style="color: ...">` for colored text.

**Note:** Tumblr assumes all text is rendered with whitespace preserved but text
wrapped, equivalent to `white-space: pre-wrap` in CSS. If you don't use this
style, it's likely that some posts won't render as the authors intended.

### Video Block

Most video blocks look like:

```html
<figure class="npf-block-video">
  <video src="..." poster="..."></video>
  <figcaption>
    <a class="npf-attribution" href="...">...</a>
  </figcaption>
</figure>
```

However, video may also be represented as a plain link:

```html
<figure class="npf-block-video">
  <a href="...">...</a>
  <figcaption>
    <a class="npf-attribution" href="...">...</a>
  </figcaption>
</figure>
```

Or as an iframe embed:

```html
<figure class="npf-block-video">
  <iframe src="...."></iframe>
  <figcaption>
    <a class="npf-attribution" href="...">...</a>
  </figcaption>
</figure>
```

### Attribution

Audio, video, and image blocks can all have attributions attached which indicate
where they were sourced. These always appear in `<figcaption>`s beneath the
media itself. They're always wrapped in `<a class="npf-attribution">`, which can
have the following additional classes:

* `npf-attribution-post` indicates that the media came from a specific Tumblr
  post. The link's text is the blog's name.

* `npf-attribution-blog` indicates that the media came from a Tumblr blog, but
  not a specific post. The link's text is the blog's name.

* `npf-attribution-link` indicates that the media came from an arbitrary URL.
  The link text is the URL itself.

* `npf-attribution-app` indicates that the media came from a third-party app.
  The link may contain an image representing the app's logo, as well as a
  text description from the application.

### Layouts

There are a number of layouts that can wrap multiple content blocks.

#### Ask Layout

An ask looks like:

```html
<div class="npf-layout-ask">
  <a href="..."><img></a> <!-- asker avatar -->
  <figure>
    <figcaption>
      <a href="..."><strong>...</strong> asked:</a>
    </figcaption>
    ... <!-- content blocks -->
  </figure>
</div>
```

An anonymous ask looks like:

```html
<div class="npf-layout-ask">
  <a><img></a> <!-- standard anonymous avatar -->
  <figure>
    <figcaption>
      <strong>Anonyous</strong> asked:
    </figcaption>
    ... <!-- content blocks -->
  </figure>
</div>
```

Note that the avatar still has an `<a>` tag despite not having an `href`, to
make the styling more consistent with non-anonymous asks.

#### Row Layout

A row with multiple images looks like:

```html
<div class="npf-layout-row">
  ... <!-- content blocks -->
</div>
```

Rows are guaranteed to contain only image blocks. They may have the additional
class `npf-layout-row-carousel` if they're expected to display in [carousel
display mode].

[carousel display mode]: https://www.tumblr.com/docs/npf#layout-block-display-mode-carousel

#### Truncate Layout

A truncation, also known as a "read more", looks like:

```html
<details class="npf-layout-truncate">
  <summary>Keep reading</summary>
  ... <!-- content blocks -->
</details>
```

#### Condensed Layout

The condensed layout is a [deprecated layout type](https://www.tumblr.com/docs/npf#layout-block-type-condensed) that is functionally equivalent to a rows layout with `truncate_after`. When encountered, it's automatically converted to use the truncate layout:

- If `truncate_after` is specified, content is truncated after that block index
- If `truncate_after` is not specified, content is truncated after the second-to-last block in the layout
- The blocks in a condensed layout must be contiguous (no gaps in the block indices)

The condensed layout produces the same HTML output as the truncate layout shown above.
