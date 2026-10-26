/**
 * Cloudflare Turnstile verification.
 *
 * Turnstile is optional: with no secret configured the check is skipped and
 * the form still works, because a half-configured spam filter must not block
 * real enquiries. The honeypot and the per-IP rate limit run either way.
 */
export type TurnstileResult = { ok: boolean; skipped: boolean };

export async function verifyTurnstile(
  token: string | null,
  ip: string | null,
): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET;
  if (!secret) return { ok: true, skipped: true };
  if (!token) return { ok: false, skipped: false };

  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip) body.set('remoteip', ip);

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
    });
    const json = (await res.json()) as { success?: boolean };
    return { ok: json.success === true, skipped: false };
  } catch {
    // Cloudflare being unreachable should not cost the client an enquiry.
    console.error('[turnstile] verification unreachable; allowing the submission');
    return { ok: true, skipped: true };
  }
}
