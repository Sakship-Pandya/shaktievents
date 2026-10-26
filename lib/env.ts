import { z } from 'zod';

/**
 * Environment validation. Server-only variables are optional until the
 * feature that needs them ships (step 2+), so the skeleton builds with an
 * empty .env. Public variables must be referenced literally as
 * process.env.NEXT_PUBLIC_* so Next can inline them into the client bundle.
 */
const emptyToUndefined = (v: unknown) => (typeof v === 'string' && v.trim() === '' ? undefined : v);

const clientSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.preprocess(emptyToUndefined, z.url().default('http://localhost:3000')),
  NEXT_PUBLIC_GA_ID: z.preprocess(emptyToUndefined, z.string().optional()),
  NEXT_PUBLIC_GTM_ID: z.preprocess(emptyToUndefined, z.string().optional()),
  NEXT_PUBLIC_PHONE_PRIMARY: z.preprocess(emptyToUndefined, z.string().optional()),
  NEXT_PUBLIC_WHATSAPP_NUMBER: z.preprocess(emptyToUndefined, z.string().optional()),
});

const serverSchema = z.object({
  DATABASE_URL: z.preprocess(emptyToUndefined, z.string().optional()),
  AUTH_SECRET: z.preprocess(emptyToUndefined, z.string().optional()),
  AUTH_URL: z.preprocess(emptyToUndefined, z.url().optional()),
  CLOUDINARY_CLOUD_NAME: z.preprocess(emptyToUndefined, z.string().optional()),
  CLOUDINARY_API_KEY: z.preprocess(emptyToUndefined, z.string().optional()),
  CLOUDINARY_API_SECRET: z.preprocess(emptyToUndefined, z.string().optional()),
  RESEND_API_KEY: z.preprocess(emptyToUndefined, z.string().optional()),
  ENQUIRY_TO_EMAIL: z.preprocess(emptyToUndefined, z.email().optional()),
  TURNSTILE_SITE_KEY: z.preprocess(emptyToUndefined, z.string().optional()),
  TURNSTILE_SECRET: z.preprocess(emptyToUndefined, z.string().optional()),
  INSTAGRAM_TOKEN: z.preprocess(emptyToUndefined, z.string().optional()),
  WHATSAPP_CLOUD_TOKEN: z.preprocess(emptyToUndefined, z.string().optional()),
  REVALIDATE_SECRET: z.preprocess(emptyToUndefined, z.string().optional()),
});

export const clientEnv = clientSchema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
  NEXT_PUBLIC_GTM_ID: process.env.NEXT_PUBLIC_GTM_ID,
  NEXT_PUBLIC_PHONE_PRIMARY: process.env.NEXT_PUBLIC_PHONE_PRIMARY,
  NEXT_PUBLIC_WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
});

export const serverEnv =
  typeof window === 'undefined'
    ? serverSchema.parse(process.env)
    : ({} as z.infer<typeof serverSchema>);
