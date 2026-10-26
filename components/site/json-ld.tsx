/**
 * Renders one or more JSON-LD graphs. Nulls are dropped so a caller can pass
 * a builder result straight through without guarding.
 */
export function JsonLd({ schemas }: { schemas: (Record<string, unknown> | null)[] }) {
  const present = schemas.filter((s): s is Record<string, unknown> => s !== null);
  if (present.length === 0) return null;

  return (
    <>
      {present.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          // Content is built by us from database values, never from user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
