import {snapshotNpf2Html} from './utils';
import npf2html from '../src/index';
import test from 'ava';

snapshotNpf2Html(
  'condensed with truncate_after',
  [
    {type: 'text', text: 'one'},
    {type: 'text', text: 'two'},
    {type: 'text', text: 'three'},
    {type: 'text', text: 'four'},
  ],
  {
    layout: [
      {
        type: 'condensed',
        blocks: [0, 1, 2, 3],
        truncate_after: 1,
      },
    ],
  }
);

snapshotNpf2Html(
  'condensed without truncate_after',
  [
    {type: 'text', text: 'one'},
    {type: 'text', text: 'two'},
    {type: 'text', text: 'three'},
  ],
  {
    layout: [
      {
        type: 'condensed',
        blocks: [0, 1, 2],
      },
    ],
  }
);

snapshotNpf2Html(
  'condensed with only truncate_after',
  [
    {type: 'text', text: 'one'},
    {type: 'text', text: 'two'},
    {type: 'text', text: 'three'},
  ],
  {
    layout: [
      {
        type: 'condensed',
        truncate_after: 1,
      },
    ],
  }
);

test('condensed with non-contiguous blocks throws error', t => {
  const error = t.throws(
    () =>
      npf2html(
        [
          {type: 'text', text: 'one'},
          {type: 'text', text: 'two'},
          {type: 'text', text: 'three'},
          {type: 'text', text: 'four'},
        ],
        {
          layout: [
            {
              type: 'condensed',
              blocks: [0, 2, 3], // gap between 0 and 2
            },
          ],
        }
      ),
    {instanceOf: Error}
  );

  t.regex(error!.message, /Condensed layout has invalid blocks/);
});

test('condensed with blocks not starting at 0 throws error', t => {
  const error = t.throws(
    () =>
      npf2html(
        [
          {type: 'text', text: 'one'},
          {type: 'text', text: 'two'},
          {type: 'text', text: 'three'},
        ],
        {
          layout: [
            {
              type: 'condensed',
              blocks: [1, 2],
            },
          ],
        }
      ),
    {instanceOf: Error}
  );

  t.regex(error!.message, /Condensed layout has invalid blocks/);
});

test('condensed with neither blocks nor truncate_after throws error', t => {
  const error = t.throws(
    () =>
      npf2html(
        [
          {type: 'text', text: 'one'},
          {type: 'text', text: 'two'},
        ],
        {
          layout: [
            {
              type: 'condensed',
            },
          ],
        }
      ),
    {instanceOf: Error}
  );

  t.regex(
    error!.message,
    /Condensed layout requires either blocks or truncate_after to be present/
  );
});

snapshotNpf2Html(
  'condensed with truncate_after=-1 hides everything',
  [
    {type: 'text', text: 'one'},
    {type: 'text', text: 'two'},
    {type: 'text', text: 'three'},
  ],
  {
    layout: [
      {
        type: 'condensed',
        truncate_after: -1,
      },
    ],
  }
);

snapshotNpf2Html(
  'condensed with empty blocks hides everything',
  [
    {type: 'text', text: 'one'},
    {type: 'text', text: 'two'},
  ],
  {
    layout: [
      {
        type: 'condensed',
        blocks: [],
      },
    ],
  }
);
