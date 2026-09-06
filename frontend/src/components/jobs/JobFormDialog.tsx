import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useJobs } from '../../context/JobsContext';
import { useThemeMode } from '../../context/ThemeContext';
import type { JobFormValues } from '../../types/job';
import {
  JobForm,
  emptyJobFormValues,
  jobToFormValues,
  validateJobForm,
} from './JobForm';

type JobFormDialogProps = {
  open: boolean;
  mode: 'create' | 'edit';
  jobId?: string;
  onClose: () => void;
};

export function JobFormDialog({ open, mode, jobId, onClose }: JobFormDialogProps) {
  const { addJob, updateJob, getJob } = useJobs();
  const { tokens: t } = useThemeMode();

  const [values, setValues] = useState<JobFormValues>(emptyJobFormValues);
  const [errors, setErrors] = useState<Partial<Record<keyof JobFormValues, string>>>({});
  const [loading, setLoading] = useState(false);

  const isEdit = mode === 'edit';

  useEffect(() => {
    if (!open) return;

    if (isEdit && jobId) {
      const job = getJob(jobId);
      if (job) setValues(jobToFormValues(job));
    } else {
      setValues(emptyJobFormValues);
    }
    setErrors({});
  }, [open, isEdit, jobId, getJob]);

  function handleClose() {
    if (loading) return;
    setValues(emptyJobFormValues);
    setErrors({});
    onClose();
  }

  function handleChange(
    field: keyof JobFormValues,
    value: JobFormValues[keyof JobFormValues],
  ) {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  async function handleSubmit() {
    const validationErrors = validateJobForm(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      if (isEdit && jobId) {
        await updateJob(jobId, values);
      } else {
        await addJob(values);
      }
      setValues(emptyJobFormValues);
      setErrors({});
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      scroll="paper"
      slotProps={{
        paper: {
          sx: {
            bgcolor: t.bgPaper,
            border: `1px solid ${t.borderGold}`,
            borderTop: `3px solid ${t.gold}`,
            boxShadow: t.shadows.card,
          },
        },
        backdrop: {
          sx: { backdropFilter: 'blur(4px)' },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 2,
          pr: 1,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            component="span"
            sx={{ fontFamily: '"Playfair Display", serif' }}
          >
            {isEdit ? 'Edit Job Opening' : 'Create Job Opening'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {isEdit
              ? 'Update job details — changes save to your job list'
              : 'Define a new role — AI extraction comes in Module 5'}
          </Typography>
        </Box>
        <IconButton
          aria-label="Close"
          onClick={handleClose}
          size="small"
          sx={{ mt: -0.5 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ borderColor: t.borderGold }}>
        <JobForm
          values={values}
          errors={errors}
          loading={loading}
          submitLabel={isEdit ? 'Update Job' : 'Save Job'}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
}

/** @deprecated Use JobFormDialog with mode="create" */
export function CreateJobDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return <JobFormDialog open={open} mode="create" onClose={onClose} />;
}
