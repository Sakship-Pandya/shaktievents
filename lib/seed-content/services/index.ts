import { avServices } from './av';
import { decorServices } from './decor';
import { experienceServices } from './experience';
import { structureServices } from './structures';
import { supportServices } from './support';
import type { ServiceSeed } from './types';

/**
 * Detail-page copy, grouped by the kind of work. A service with no entry here
 * still exists in the catalogue and renders its hub card — the detail page
 * simply shows fewer blocks until its copy is written.
 */
export const serviceSeeds: ServiceSeed[] = [
  ...structureServices,
  ...avServices,
  ...decorServices,
  ...supportServices,
  ...experienceServices,
];

export type { ServiceSeed };
