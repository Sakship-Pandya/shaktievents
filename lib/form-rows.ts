/**
 * Reads repeatable rows out of a FormData built by the admin's list editor,
 * which names its inputs `<list>.<index>.<field>` (for example
 * `inclusions.0.en`). Rows are returned in index order with blanks dropped,
 * so removing a row in the UI does not leave a hole.
 */
export function readRows(
  formData: FormData,
  list: string,
  fields: string[],
): Record<string, string>[] {
  const byIndex = new Map<number, Record<string, string>>();

  for (const [key, value] of formData.entries()) {
    const match = key.match(/^(.+?)\.(\d+)\.(.+)$/);
    if (!match) continue;

    const [, name, rawIndex, field] = match;
    if (name !== list || !field || !fields.includes(field)) continue;

    const index = Number(rawIndex);
    const row = byIndex.get(index) ?? {};
    row[field] = typeof value === 'string' ? value.trim() : '';
    byIndex.set(index, row);
  }

  return (
    [...byIndex.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([, row]) => row)
      // A row where every field is blank is a row the editor left empty.
      .filter((row) => fields.some((field) => (row[field] ?? '') !== ''))
  );
}
