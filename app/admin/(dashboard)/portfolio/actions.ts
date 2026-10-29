'use server';

import {
  toggleProjectStatus as toggleStatus,
  toggleProjectFeatured as toggleFeatured,
  deleteProject as deleteProj,
} from '@/app/admin/(dashboard)/projects/actions';

export async function toggleProjectStatus(
  id: string,
  targetStatus?: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED' | FormData,
) {
  return toggleStatus(id, targetStatus);
}

export async function toggleProjectFeatured(
  id: string,
  targetFeatured?: boolean | FormData,
) {
  return toggleFeatured(id, targetFeatured);
}

export async function deleteProject(id: string) {
  return deleteProj(id);
}
