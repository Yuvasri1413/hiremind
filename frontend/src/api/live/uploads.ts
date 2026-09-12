import type { UploadsService } from '../services/types';

export const liveUploadsService: UploadsService = {
  async list() {
    return [];
  },

  async save() {
    // Upload queue is handled directly in JobUploadTab for live mode.
  },
};
