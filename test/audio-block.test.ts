import {snapshotNpf2Html} from './utils';

snapshotNpf2Html('with media: with everything', [
  {
    type: 'audio',
    media: {url: 'https://example.org/song.mp3'},
    title: 'A Neat Song',
    artist: 'A Neat Singer',
    album: 'A Neat Record',
    poster: [
      {
        url: 'https://example.org/poster.jpg',
        width: 150,
        height: 150,
      },
    ],
    attribution: {
      type: 'link',
      url: 'https://example.org/',
    },
  },
]);

snapshotNpf2Html('with media: with nothing', [
  {
    type: 'audio',
    media: {url: 'https://example.org/song.mp3'},
  },
]);

snapshotNpf2Html('with media: with title only', [
  {
    type: 'audio',
    media: {url: 'https://example.org/song.mp3'},
    title: 'A Neat Song',
  },
]);

snapshotNpf2Html('with media: with artist only', [
  {
    type: 'audio',
    media: {url: 'https://example.org/song.mp3'},
    artist: 'A Neat Singer',
  },
]);

snapshotNpf2Html('with media: with album only', [
  {
    type: 'audio',
    media: {url: 'https://example.org/song.mp3'},
    album: 'A Neat Record',
  },
]);

snapshotNpf2Html('with media: with poster only', [
  {
    type: 'audio',
    media: {url: 'https://example.org/song.mp3'},
    poster: [
      {
        url: 'https://example.org/poster.jpg',
        width: 150,
        height: 150,
      },
    ],
  },
]);

snapshotNpf2Html('with media: with attribution only', [
  {
    type: 'audio',
    media: {url: 'https://example.org/song.mp3'},
    attribution: {
      type: 'link',
      url: 'https://example.org/',
    },
  },
]);

snapshotNpf2Html('with media: with title and album', [
  {
    type: 'audio',
    media: {url: 'https://example.org/song.mp3'},
    title: 'A Neat Song',
    album: 'A Neat Record',
  },
]);

snapshotNpf2Html('with media: with artist and album', [
  {
    type: 'audio',
    media: {url: 'https://example.org/song.mp3'},
    artist: 'A Neat Singer',
    album: 'A Neat Record',
  },
]);

snapshotNpf2Html('with media: with title and artist', [
  {
    type: 'audio',
    media: {url: 'https://example.org/song.mp3'},
    title: 'A Neat Song',
    artist: 'A Neat Singer',
  },
]);

snapshotNpf2Html('with url: with everything', [
  {
    type: 'audio',
    url: 'https://example.org/song',
    title: 'A Neat Song',
    artist: 'A Neat Singer',
    album: 'A Neat Record',
    poster: [
      {
        url: 'https://example.org/poster.jpg',
        width: 150,
        height: 150,
      },
    ],
    attribution: {
      type: 'link',
      url: 'https://example.org/',
    },
  },
]);

snapshotNpf2Html('with url: with nothing', [
  {
    type: 'audio',
    url: 'https://example.org/song',
  },
]);

snapshotNpf2Html('prefers media to embed_html', [
  {
    type: 'audio',
    media: {url: 'https://example.org/song.mp3'},
    embed_html: '<marquee>total nonsense</marquee>',
  },
]);

snapshotNpf2Html('prefers embed_html to embed_url', [
  {
    type: 'audio',
    embed_html: '<marquee>total nonsense</marquee>',
    embed_url: 'https://example.org/frame',
  },
]);

snapshotNpf2Html('prefers embed_url to url', [
  {
    type: 'audio',
    embed_url: 'https://example.org/frame',
    url: 'https://example.org/song',
  },
]);

snapshotNpf2Html('with media: HTML-escapes title', [
  {
    type: 'audio',
    media: {url: 'https://example.org/song.mp3'},
    title: '<&">',
  },
]);

snapshotNpf2Html('with media: HTML-escapes artist', [
  {
    type: 'audio',
    media: {url: 'https://example.org/song.mp3'},
    artist: '<&">',
  },
]);

snapshotNpf2Html('with media: HTML-escapes album', [
  {
    type: 'audio',
    media: {url: 'https://example.org/song.mp3'},
    album: '<&">',
  },
]);
