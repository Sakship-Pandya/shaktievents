import { ImageResponse } from 'next/og';

export const runtime = 'edge';

const WIDTH = 1200;
const HEIGHT = 630;

/**
 * Brand OG card, generated per page.
 *
 * Deliberately typographic rather than photographic: there are no real
 * photographs of the client's work yet, and a share card carrying a stock
 * image of somebody else's wedding would be worse than none. Fonts are the
 * system stack — loading a webfont here would add a round trip to every card.
 */
export function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const title = (params.get('title') ?? 'Shree Shakti').slice(0, 120);
  const eyebrow = (params.get('eyebrow') ?? 'Mandap · Sound · Lighting').slice(0, 60);

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 72,
        backgroundColor: '#14100D',
        backgroundImage:
          'radial-gradient(90% 70% at 50% -10%, #7A1F2B 0%, rgba(20,16,13,0) 60%), radial-gradient(60% 50% at 12% 92%, rgba(245,179,43,0.18) 0%, rgba(20,16,13,0) 70%)',
        color: '#FBF6EE',
        fontFamily: 'Georgia, serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: 999,
            backgroundColor: '#F5B32B',
            display: 'flex',
          }}
        />
        <div
          style={{
            fontSize: 22,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: '#E7D3A3',
            fontFamily: 'Helvetica, Arial, sans-serif',
          }}
        >
          {eyebrow}
        </div>
      </div>

      <div style={{ fontSize: title.length > 60 ? 60 : 76, lineHeight: 1.1, maxWidth: 980 }}>
        {title}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          borderTop: '1px solid rgba(201,162,78,0.4)',
          paddingTop: 28,
        }}
      >
        <div style={{ fontSize: 30, color: '#FBF6EE' }}>Shree Shakti</div>
        <div
          style={{
            fontSize: 20,
            letterSpacing: 3,
            textTransform: 'uppercase',
            color: '#C9A24E',
            fontFamily: 'Helvetica, Arial, sans-serif',
          }}
        >
          Surendranagar
        </div>
      </div>
    </div>,
    { width: WIDTH, height: HEIGHT },
  );
}
