import { z } from 'zod';

/**
 * Shapes for the Json columns on Project. Like the service pages, the detail
 * page renders discrete blocks rather than one rich-text body, so the content
 * is stored structured and validated here.
 */

/** Project.briefEn / briefGu — what the event was. */
export const projectBriefSchema = z.object({
  paragraphs: z.array(z.string().min(20).max(1200)).min(1).max(4),
});

/** Project.workEn / workGu — what we did on site, and what got in the way. */
export const projectWorkSchema = z.object({
  did: z.array(z.string().min(5).max(300)).max(10),
  /** Challenges and how they were solved. Optional — many jobs have none worth telling. */
  challenges: z
    .array(
      z.object({ problem: z.string().min(10).max(300), solution: z.string().min(10).max(400) }),
    )
    .max(4)
    .default([]),
});

export type ProjectBrief = z.infer<typeof projectBriefSchema>;
export type ProjectWork = z.infer<typeof projectWorkSchema>;

export const EMPTY_BRIEF: ProjectBrief = { paragraphs: [] };
export const EMPTY_WORK: ProjectWork = { did: [], challenges: [] };
