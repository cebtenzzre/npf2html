import {snapshotNpf2Html} from './utils';

snapshotNpf2Html('bold', [
  {
    type: 'text',
    text: 'format this text',
    formatting: [{type: 'bold', start: 7, end: 11}],
  },
]);

snapshotNpf2Html('italic', [
  {
    type: 'text',
    text: 'format this text',
    formatting: [{type: 'italic', start: 7, end: 11}],
  },
]);

snapshotNpf2Html('strikethrough', [
  {
    type: 'text',
    text: 'format this text',
    formatting: [{type: 'strikethrough', start: 7, end: 11}],
  },
]);

snapshotNpf2Html('small', [
  {
    type: 'text',
    text: 'format this text',
    formatting: [{type: 'small', start: 7, end: 11}],
  },
]);

snapshotNpf2Html('link', [
  {
    type: 'text',
    text: 'format this text',
    formatting: [
      {type: 'link', start: 7, end: 11, url: 'https://example.org/link'},
    ],
  },
]);

snapshotNpf2Html('mention', [
  {
    type: 'text',
    text: 'format this text',
    formatting: [
      {
        type: 'mention',
        start: 7,
        end: 11,
        blog: {
          uuid: 'e23bdaeb-f31e-4dd3-b990-00f24ec7c16c',
          name: 'Example Blog',
          url: 'https://example.org/blog',
        },
      },
    ],
  },
]);

snapshotNpf2Html('color', [
  {
    type: 'text',
    text: 'format this text',
    formatting: [{type: 'color', start: 7, end: 11, hex: '#0000ff'}],
  },
]);

snapshotNpf2Html('covering the whole text', [
  {
    type: 'text',
    text: 'format this text',
    formatting: [{type: 'bold', start: 0, end: 16}],
  },
]);

snapshotNpf2Html('multiple', [
  {
    type: 'text',
    text: 'bold italic strikethrough',
    formatting: [
      {type: 'bold', start: 0, end: 4},
      {type: 'strikethrough', start: 12, end: 25},
      {type: 'italic', start: 5, end: 11},
    ],
  },
]);

snapshotNpf2Html('nested', [
  {
    type: 'text',
    text: 'format this text',
    formatting: [
      {type: 'bold', start: 0, end: 16},
      {type: 'strikethrough', start: 7, end: 11},
      {type: 'italic', start: 12, end: 16},
    ],
  },
]);

snapshotNpf2Html('overlapping', [
  {
    type: 'text',
    text: 'format this text',
    formatting: [
      {type: 'bold', start: 0, end: 11},
      {type: 'strikethrough', start: 7, end: 16},
    ],
  },
]);

snapshotNpf2Html('HTML-escapes nested formatting once', [
  {
    type: 'text',
    text: 'format t<"&>s text',
    formatting: [
      {type: 'bold', start: 0, end: 18},
      {type: 'strikethrough', start: 7, end: 13},
      {type: 'italic', start: 8, end: 12},
    ],
  },
]);

snapshotNpf2Html('correctly indexes through wide characters', [
  {
    type: 'text',
    text: 'format 🌳 tree',
    formatting: [{type: 'strikethrough', start: 7, end: 8}],
  },
]);

// Regression test for #1
snapshotNpf2Html('adjacent and overlapping (same format)', [
  {
    type: 'text',
    text: 'before [left][right] after',
    formatting: [
      {
        type: 'bold',
        start: 7,
        end: 13,
      },
      {
        type: 'italic',
        start: 13,
        end: 20,
      },
      {
        type: 'bold',
        start: 13,
        end: 30,
      },
    ],
  },
]);

// Regression test for #1
snapshotNpf2Html('adjacent and overlapping (different format)', [
  {
    type: 'text',
    text: 'before [left][right] after',
    formatting: [
      {
        type: 'bold',
        start: 7,
        end: 13,
      },
      {
        type: 'italic',
        start: 13,
        end: 20,
      },
      {
        type: 'strikethrough',
        start: 13,
        end: 30,
      },
    ],
  },
]);

snapshotNpf2Html('complex formatting does not overflow string length', [
  {
    formatting: [
      {
        end: 674,
        start: 0,
        type: 'bold',
      },
      {
        end: 674,
        start: 0,
        type: 'italic',
      },
      {
        end: 674,
        start: 27,
        type: 'bold',
      },
      {
        end: 674,
        start: 27,
        type: 'italic',
      },
      {
        end: 80,
        start: 53,
        type: 'bold',
      },
      {
        end: 80,
        start: 53,
        type: 'italic',
      },
      {
        end: 80,
        start: 54,
        type: 'bold',
      },
      {
        end: 80,
        start: 54,
        type: 'italic',
      },
      {
        end: 107,
        start: 80,
        type: 'bold',
      },
      {
        end: 107,
        start: 80,
        type: 'italic',
      },
      {
        end: 107,
        start: 81,
        type: 'bold',
      },
      {
        end: 107,
        start: 81,
        type: 'italic',
      },
      {
        end: 134,
        start: 107,
        type: 'bold',
      },
      {
        end: 134,
        start: 107,
        type: 'italic',
      },
      {
        end: 134,
        start: 108,
        type: 'bold',
      },
      {
        end: 134,
        start: 108,
        type: 'italic',
      },
      {
        end: 161,
        start: 134,
        type: 'bold',
      },
      {
        end: 161,
        start: 134,
        type: 'italic',
      },
      {
        end: 161,
        start: 135,
        type: 'bold',
      },
      {
        end: 161,
        start: 135,
        type: 'italic',
      },
      {
        end: 188,
        start: 161,
        type: 'bold',
      },
      {
        end: 188,
        start: 161,
        type: 'italic',
      },
      {
        end: 188,
        start: 162,
        type: 'bold',
      },
      {
        end: 188,
        start: 162,
        type: 'italic',
      },
      {
        end: 215,
        start: 188,
        type: 'bold',
      },
      {
        end: 215,
        start: 188,
        type: 'italic',
      },
      {
        end: 215,
        start: 189,
        type: 'bold',
      },
      {
        end: 215,
        start: 189,
        type: 'italic',
      },
      {
        end: 242,
        start: 215,
        type: 'bold',
      },
      {
        end: 242,
        start: 215,
        type: 'italic',
      },
      {
        end: 242,
        start: 216,
        type: 'bold',
      },
      {
        end: 242,
        start: 216,
        type: 'italic',
      },
      {
        end: 269,
        start: 242,
        type: 'bold',
      },
      {
        end: 269,
        start: 242,
        type: 'italic',
      },
      {
        end: 269,
        start: 243,
        type: 'bold',
      },
      {
        end: 269,
        start: 243,
        type: 'italic',
      },
      {
        end: 296,
        start: 269,
        type: 'bold',
      },
      {
        end: 296,
        start: 269,
        type: 'italic',
      },
      {
        end: 296,
        start: 270,
        type: 'bold',
      },
      {
        end: 296,
        start: 270,
        type: 'italic',
      },
      {
        end: 323,
        start: 296,
        type: 'bold',
      },
      {
        end: 323,
        start: 296,
        type: 'italic',
      },
      {
        end: 323,
        start: 297,
        type: 'bold',
      },
      {
        end: 323,
        start: 297,
        type: 'italic',
      },
      {
        end: 350,
        start: 323,
        type: 'bold',
      },
      {
        end: 350,
        start: 323,
        type: 'italic',
      },
      {
        end: 350,
        start: 324,
        type: 'bold',
      },
      {
        end: 350,
        start: 324,
        type: 'italic',
      },
      {
        end: 377,
        start: 350,
        type: 'bold',
      },
      {
        end: 377,
        start: 350,
        type: 'italic',
      },
      {
        end: 377,
        start: 351,
        type: 'bold',
      },
      {
        end: 377,
        start: 351,
        type: 'italic',
      },
      {
        end: 404,
        start: 377,
        type: 'bold',
      },
      {
        end: 404,
        start: 377,
        type: 'italic',
      },
      {
        end: 404,
        start: 378,
        type: 'bold',
      },
      {
        end: 404,
        start: 378,
        type: 'italic',
      },
      {
        end: 431,
        start: 404,
        type: 'bold',
      },
      {
        end: 431,
        start: 404,
        type: 'italic',
      },
      {
        end: 431,
        start: 405,
        type: 'bold',
      },
      {
        end: 431,
        start: 405,
        type: 'italic',
      },
      {
        end: 458,
        start: 431,
        type: 'bold',
      },
      {
        end: 458,
        start: 431,
        type: 'italic',
      },
      {
        end: 458,
        start: 432,
        type: 'bold',
      },
      {
        end: 458,
        start: 432,
        type: 'italic',
      },
      {
        end: 485,
        start: 458,
        type: 'bold',
      },
      {
        end: 485,
        start: 458,
        type: 'italic',
      },
      {
        end: 485,
        start: 459,
        type: 'bold',
      },
      {
        end: 485,
        start: 459,
        type: 'italic',
      },
      {
        end: 512,
        start: 485,
        type: 'bold',
      },
      {
        end: 512,
        start: 485,
        type: 'italic',
      },
      {
        end: 512,
        start: 486,
        type: 'bold',
      },
      {
        end: 512,
        start: 486,
        type: 'italic',
      },
      {
        end: 539,
        start: 512,
        type: 'bold',
      },
      {
        end: 539,
        start: 512,
        type: 'italic',
      },
      {
        end: 539,
        start: 513,
        type: 'bold',
      },
      {
        end: 539,
        start: 513,
        type: 'italic',
      },
      {
        end: 566,
        start: 539,
        type: 'bold',
      },
      {
        end: 566,
        start: 539,
        type: 'italic',
      },
      {
        end: 566,
        start: 540,
        type: 'bold',
      },
      {
        end: 566,
        start: 540,
        type: 'italic',
      },
      {
        end: 593,
        start: 566,
        type: 'bold',
      },
      {
        end: 593,
        start: 566,
        type: 'italic',
      },
      {
        end: 593,
        start: 567,
        type: 'bold',
      },
      {
        end: 593,
        start: 567,
        type: 'italic',
      },
      {
        end: 620,
        start: 593,
        type: 'bold',
      },
      {
        end: 620,
        start: 593,
        type: 'italic',
      },
      {
        end: 620,
        start: 594,
        type: 'bold',
      },
      {
        end: 620,
        start: 594,
        type: 'italic',
      },
      {
        end: 647,
        start: 620,
        type: 'bold',
      },
      {
        end: 647,
        start: 620,
        type: 'italic',
      },
      {
        end: 647,
        start: 621,
        type: 'bold',
      },
      {
        end: 647,
        start: 621,
        type: 'italic',
      },
      {
        end: 674,
        start: 647,
        type: 'bold',
      },
      {
        end: 674,
        start: 647,
        type: 'italic',
      },
      {
        end: 674,
        start: 648,
        type: 'bold',
      },
      {
        end: 674,
        start: 648,
        type: 'italic',
      },
    ],
    subtype: 'heading2',
    text: 'A AAAAAAA AAAA AAAAAA AAAA A AAAAAAA AAAA AAAAAA AAAA A AAAAAAA AAAA AAAAAA AAAA A AAAAAAA AAAA AAAAAA AAAA A AAAAAAA AAAA AAAAAA AAAA A AAAAAAA AAAA AAAAAA AAAA A AAAAAAA AAAA AAAAAA AAAA A AAAAAAA AAAA AAAAAA AAAA A AAAAAAA AAAA AAAAAA AAAA A AAAAAAA AAAA AAAAAA AAAA A AAAAAAA AAAA AAAAAA AAAA A AAAAAAA AAAA AAAAAA AAAA A AAAAAAA AAAA AAAAAA AAAA A AAAAAAA AAAA AAAAAA AAAA A AAAAAAA AAAA AAAAAA AAAA A AAAAAAA AAAA AAAAAA AAAA A AAAAAAA AAAA AAAAAA AAAA A AAAAAAA AAAA AAAAAA AAAA A AAAAAAA AAAA AAAAAA AAAA A AAAAAAA AAAA AAAAAA AAAA A AAAAAAA AAAA AAAAAA AAAA A AAAAAAA AAAA AAAAAA AAAA A AAAAAAA AAAA AAAAAA AAAA A AAAAAAA AAAA AAAAAA AAAA A AAAAAAA AAAA AAAAAA AAAA',
    type: 'text',
  },
]);
