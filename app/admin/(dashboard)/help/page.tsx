import type { Metadata } from 'next';
import { HelpGuide } from './help-guide';

export const metadata: Metadata = { title: 'Guide' };

export default function HelpPage() {
  return <HelpGuide />;
}
