import { getSessionUser } from '@/lib/auth-helpers';
import { getCloudinaryConfig, signParams } from '@/lib/cloudinary';

/**
 * Signs a browser upload for the Cloudinary widget. Signed-in users only —
 * an open signing endpoint lets anyone upload into the account.
 */
export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return Response.json({ error: 'Not signed in' }, { status: 401 });
  }

  const config = getCloudinaryConfig();
  if (!config) {
    return Response.json({ error: 'Cloudinary is not configured' }, { status: 503 });
  }

  let paramsToSign: Record<string, string | number>;
  try {
    const body = (await request.json()) as { paramsToSign?: Record<string, string | number> };
    if (!body.paramsToSign || typeof body.paramsToSign !== 'object') throw new Error('bad body');
    paramsToSign = body.paramsToSign;
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  return Response.json({ signature: signParams(paramsToSign, config.apiSecret) });
}
