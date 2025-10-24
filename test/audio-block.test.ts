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

snapshotNpf2Html('with embed_html: poster without dimensions', [
  {
    type: 'audio',
    album: 'I.',
    artist: 'Cigarettes After Sex',
    attribution: {
      app_name: 'Spotify',
      display_text: 'Listen on Spotify',
      logo: {
        height: 64,
        type: 'image/png',
        url: 'https://static.tumblr.com/620021e3d68993e56aadd0b7719f987d/k3htaqs/irQnz1ujc/tumblr_static_spotify-logo_64.png',
        width: 64,
      },
      type: 'app',
      url: 'https://open.spotify.com/track/5RROFztQ7ua0p9ttJ0U8nv',
    },
    embed_html:
      '<iframe class="spotify_audio_player" src="https://open.spotify.com/embed?uri=spotify%3Atrack%3A5RROFztQ7ua0p9ttJ0U8nv&amp;view=coverart" frameborder="0" allowtransparency="true" width="540" height="620"></iframe>',
    embed_url:
      'https://open.spotify.com/embed?uri=spotify%3Atrack%3A5RROFztQ7ua0p9ttJ0U8nv&amp;view=coverart',
    metadata: {
      id: 'spotify:track:5RROFztQ7ua0p9ttJ0U8nv',
    },
    poster: [
      {
        url: 'https://i.scdn.co/image/1e2b79159df4ea01b0b478dc8b6a485efe14c755',
      },
    ],
    provider: 'spotify',
    title: "Nothing's Gonna Hurt You Baby",
    url: 'https://open.spotify.com/track/5RROFztQ7ua0p9ttJ0U8nv',
  },
]);
