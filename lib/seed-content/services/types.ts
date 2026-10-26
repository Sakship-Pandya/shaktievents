import type { Localized } from '../../services';

/**
 * Seed copy for one service detail page. Mirrors the Json columns on Service
 * exactly, so the seed is a straight write and the admin edits the same
 * shapes afterwards.
 *
 * Note on the specs tables: figures here are conservative, typical trade
 * ranges (and, where CLAUDE.md supplied them, the client's own numbers).
 * They are marked for the client to confirm before launch — see
 * docs/content-review.md.
 */
export type ServiceSeed = {
  slug: string;
  content: {
    en: LocalisedContent;
    gu: LocalisedContent;
  };
  inclusions: Localized[];
  options: { nameEn: string; nameGu: string; descEn: string; descGu: string }[];
  specs: { labelEn: string; labelGu: string; value: string }[];
  pricing: {
    unitEn: string;
    unitGu: string;
    factors: Localized[];
  };
  faqs: { question: Localized; answer: Localized }[];
};

export type LocalisedContent = {
  promise: string;
  intro: string;
  process: { title: string; body: string }[];
  closing: string | null;
};
