import type { UploadsService } from '../../api/services/types';
import type { ResumeUploadItem } from '../../types/upload';
import { MOCK_STORAGE_KEYS, mockDelay, readMockStorage, writeMockStorage } from '../mockStorage';

function loadUploads(jobId: string): ResumeUploadItem[] {
  return readMockStorage(MOCK_STORAGE_KEYS.uploads(jobId), []);
}

export const mockUploadsService: UploadsService = {
  async list(jobId) {
    return mockDelay(loadUploads(jobId));
  },

  async save(jobId, uploads) {
    writeMockStorage(MOCK_STORAGE_KEYS.uploads(jobId), uploads);
  },
};

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
