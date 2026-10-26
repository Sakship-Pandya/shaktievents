'use server';

import {
  toggleProjectStatus as toggleStatus,
  toggleProjectFeatured as toggleFeatured,
  deleteProject as deleteProj,
} from '@/app/admin/(dashboard)/projects/actions';

export async function toggleProjectStatus(id: string) {
  return toggleStatus(id);
}

export async function toggleProjectFeatured(id: string) {
  return toggleFeatured(id);
}

export async function deleteProject(id: string) {
  return deleteProj(id);
}
