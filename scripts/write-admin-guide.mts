/**
 * Writes docs/admin-guide.md and docs/admin-guide.gu.md from lib/admin-guide.ts.
 *
 *   pnpm docs:guide
 *
 * The guide is written once, in one place, and shown at /admin/help. These two
 * files exist so the guide can be printed or emailed to somebody who is not
 * signed in — they are generated, so they cannot drift from what the admin
 * actually says.
 */
import { writeFileSync } from 'node:fs';
import { adminGuide, guideIntro, guideTitle } from '../lib/admin-guide';

type Lang = 'en' | 'gu';

const LABELS: Record<Lang, { generated: string; screen: string; contents: string }> = {
  en: {
    generated:
      'This file is generated from lib/admin-guide.ts — edit that, then run `pnpm docs:guide`. The same guide is inside the admin at /admin/help.',
    screen: 'Screen',
    contents: 'Contents',
  },
  gu: {
    generated:
      'આ ફાઇલ lib/admin-guide.ts માંથી બને છે — ત્યાં સુધારો, પછી `pnpm docs:guide` ચલાવો. આ જ માર્ગદર્શિકા એડમિનમાં /admin/help પર છે.',
    screen: 'સ્ક્રીન',
    contents: 'અનુક્રમ',
  },
};

function render(lang: Lang): string {
  const labels = LABELS[lang];
  const lines: string[] = [
    `# ${guideTitle[lang]}`,
    '',
    guideIntro[lang],
    '',
    `> ${labels.generated}`,
    '',
    `## ${labels.contents}`,
    '',
  ];

  for (const [index, section] of adminGuide.entries()) {
    lines.push(`${index + 1}. [${section.title[lang]}](#${section.id})`);
  }
  lines.push('');

  for (const section of adminGuide) {
    lines.push(`<a id="${section.id}"></a>`, '', `## ${section.title[lang]}`, '');
    if (section.href) lines.push(`**${labels.screen}:** \`${section.href}\``, '');
    lines.push(section.intro[lang], '');

    for (const [index, step] of (section.steps ?? []).entries()) {
      lines.push(`${index + 1}. ${step[lang]}`);
    }
    if (section.steps?.length) lines.push('');

    for (const note of section.notes ?? []) {
      lines.push(`> ${note[lang]}`, '');
    }
  }

  return `${lines
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trimEnd()}\n`;
}

for (const [lang, file] of [
  ['en', 'docs/admin-guide.md'],
  ['gu', 'docs/admin-guide.gu.md'],
] as const) {
  writeFileSync(file, render(lang));
  console.log(`wrote ${file}`);
}
