export type ResumeUploadStatus =
  | 'uploading'
  | 'ready'
  | 'processing'
  | 'done'
  | 'failed';

export type ResumeUploadItem = {
  id: string;
  fileName: string;
  fileSize: number;
  status: ResumeUploadStatus;
  progress: number;
  addedAt: string;
};

export const ACCEPTED_RESUME_TYPES = '.pdf,.doc,.docx';
export const ACCEPTED_RESUME_MIME = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
