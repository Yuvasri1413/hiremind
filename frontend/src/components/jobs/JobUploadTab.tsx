import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../../api';
import { formatFileSize } from '../../mocks/services/uploadsMock';
import { useThemeMode } from '../../context/ThemeContext';
import {
  ACCEPTED_RESUME_MIME,
  ACCEPTED_RESUME_TYPES,
  type ResumeUploadItem,
  type ResumeUploadStatus,
} from '../../types/upload';

type JobUploadTabProps = {
  jobId: string;
};

const statusLabels: Record<ResumeUploadStatus, string> = {
  uploading: 'Uploading',
  ready: 'Ready',
  processing: 'Processing',
  done: 'Queued for pipeline',
  failed: 'Failed',
};

const statusColors: Record<
  ResumeUploadStatus,
  'default' | 'primary' | 'success' | 'warning' | 'error'
> = {
  uploading: 'primary',
  ready: 'warning',
  processing: 'warning',
  done: 'success',
  failed: 'error',
};

export function JobUploadTab({ jobId }: JobUploadTabProps) {
  const { tokens: t } = useThemeMode();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploads, setUploads] = useState<ResumeUploadItem[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<string | null>(null);

  const persist = useCallback(
    async (next: ResumeUploadItem[]) => {
      setUploads(next);
      await api.uploads.save(jobId, next);
    },
    [jobId],
  );

  useEffect(() => {
    api.uploads.list(jobId).then(setUploads);
  }, [jobId]);

  const readyCount = uploads.filter((item) => item.status === 'ready').length;
  const processingCount = uploads.filter((item) => item.status === 'processing').length;

  function isAcceptedFile(file: File) {
    const ext = file.name.split('.').pop()?.toLowerCase();
    return (
      ACCEPTED_RESUME_MIME.includes(file.type) ||
      ext === 'pdf' ||
      ext === 'doc' ||
      ext === 'docx'
    );
  }

  function simulateUpload(file: File) {
    const id = crypto.randomUUID();
    const item: ResumeUploadItem = {
      id,
      fileName: file.name,
      fileSize: file.size,
      status: 'uploading',
      progress: 0,
      addedAt: new Date().toISOString(),
    };

    setUploads((current) => {
      const next = [item, ...current];
      void api.uploads.save(jobId, next);
      return next;
    });

    let progress = 0;
    const interval = window.setInterval(() => {
      progress += 20 + Math.random() * 15;
      const nextProgress = Math.min(Math.round(progress), 100);

      setUploads((current) => {
        const updated = current.map((entry) =>
          entry.id === id
            ? {
                ...entry,
                progress: nextProgress,
                status: nextProgress >= 100 ? ('ready' as const) : entry.status,
              }
            : entry,
        );
        void api.uploads.save(jobId, updated);
        return updated;
      });

      if (nextProgress >= 100) {
        window.clearInterval(interval);
      }
    }, 350);
  }

  function handleFiles(fileList: FileList | null) {
    if (!fileList?.length) return;

    const files = Array.from(fileList);
    const invalid = files.find((file) => !isAcceptedFile(file));
    if (invalid) {
      setError('Only PDF, DOC, and DOCX files are supported.');
      return;
    }

    const tooLarge = files.find((file) => file.size > 10 * 1024 * 1024);
    if (tooLarge) {
      setError('Each file must be 10 MB or smaller.');
      return;
    }

    setError(null);
    files.forEach(simulateUpload);
  }

  function handleRemove(id: string) {
    persist(uploads.filter((item) => item.id !== id));
  }

  function handleStartProcessing() {
    const readyIds = new Set(
      uploads.filter((item) => item.status === 'ready').map((item) => item.id),
    );
    if (readyIds.size === 0) return;

    const processing = uploads.map((item) =>
      readyIds.has(item.id) ? { ...item, status: 'processing' as const, progress: 100 } : item,
    );
    persist(processing);
    setSnackbar(`Processing started for ${readyIds.size} resume${readyIds.size > 1 ? 's' : ''}.`);

    window.setTimeout(() => {
      setUploads((current) => {
        const updated = current.map((item) =>
          readyIds.has(item.id) ? { ...item, status: 'done' as const } : item,
        );
        void api.uploads.save(jobId, updated);
        return updated;
      });
    }, 2000);
  }

  return (
    <Box>
      <Paper
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        sx={{
          p: 4,
          mb: 3,
          textAlign: 'center',
          cursor: 'pointer',
          bgcolor: t.bgPaper,
          boxShadow: t.shadows.card,
          border: `2px dashed ${dragOver ? t.gold : t.borderGold}`,
          transition: 'border-color 0.2s ease, background-color 0.2s ease',
          '&:hover': {
            borderColor: t.gold,
            bgcolor: t.goldMuted,
          },
        }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            mx: 'auto',
            mb: 2,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: t.goldMuted,
            color: 'primary.main',
          }}
        >
          <CloudUploadOutlinedIcon sx={{ fontSize: 32 }} />
        </Box>
        <Typography variant="h6" gutterBottom>
          Drop resumes here
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          or click to browse — PDF, DOC, DOCX up to 10 MB each
        </Typography>
        <Button
          variant="outlined"
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.click();
          }}
        >
          Choose Files
        </Button>
        <input
          ref={inputRef}
          type="file"
          hidden
          multiple
          accept={ACCEPTED_RESUME_TYPES}
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper sx={{ bgcolor: t.bgPaper, boxShadow: t.shadows.card, overflow: 'hidden' }}>
        <Box
          sx={{
            px: 2.5,
            py: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
            borderBottom: `1px solid ${t.borderGold}`,
          }}
        >
          <Box>
            <Typography variant="h6">Uploaded Files</Typography>
            <Typography variant="body2" color="text.secondary">
              {uploads.length === 0
                ? 'No resumes uploaded yet'
                : `${uploads.length} file${uploads.length > 1 ? 's' : ''} in queue`}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<PlayArrowOutlinedIcon />}
            disabled={readyCount === 0 || processingCount > 0}
            onClick={handleStartProcessing}
          >
            Start Processing
          </Button>
        </Box>

        {uploads.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <DescriptionOutlinedIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Upload candidate resumes to start the AI recruitment pipeline
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>File</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Progress</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {uploads.map((item) => (
                  <TableRow key={item.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <DescriptionOutlinedIcon fontSize="small" color="action" />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {item.fileName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{formatFileSize(item.fileSize)}</TableCell>
                    <TableCell sx={{ minWidth: 160 }}>
                      {item.status === 'uploading' ? (
                        <LinearProgress
                          variant="determinate"
                          value={item.progress}
                          sx={{ height: 6, borderRadius: 1 }}
                        />
                      ) : item.status === 'done' ? (
                        <CheckCircleOutlinedIcon fontSize="small" color="success" />
                      ) : item.status === 'failed' ? (
                        <ErrorOutlineOutlinedIcon fontSize="small" color="error" />
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          {item.status === 'processing' ? 'Running pipeline…' : 'Complete'}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={statusLabels[item.status]}
                        size="small"
                        color={statusColors[item.status]}
                        variant={item.status === 'ready' ? 'outlined' : 'filled'}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Remove file">
                        <span>
                          <IconButton
                            size="small"
                            color="error"
                            disabled={item.status === 'processing'}
                            aria-label={`Remove ${item.fileName}`}
                            onClick={() => handleRemove(item.id)}
                          >
                            <DeleteOutlinedIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Snackbar
        open={Boolean(snackbar)}
        autoHideDuration={4000}
        onClose={() => setSnackbar(null)}
        message={snackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
}
