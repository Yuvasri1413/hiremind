import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import type { Job, JobFormValues, JobStatus } from '../../types/job';

const statusOptions: { value: JobStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'open', label: 'Open' },
  { value: 'closed', label: 'Closed' },
];

type JobFormProps = {
  values: JobFormValues;
  errors: Partial<Record<keyof JobFormValues, string>>;
  loading?: boolean;
  submitLabel?: string;
  onChange: (field: keyof JobFormValues, value: JobFormValues[keyof JobFormValues]) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export function JobForm({
  values,
  errors,
  loading = false,
  submitLabel = 'Save Job',
  onChange,
  onSubmit,
  onCancel,
}: JobFormProps) {
  return (
    <Box component="form" onSubmit={(e) => { e.preventDefault(); onSubmit(); }} noValidate>
      <TextField
        label="Job title"
        fullWidth
        required
        margin="normal"
        value={values.title}
        onChange={(e) => onChange('title', e.target.value)}
        error={Boolean(errors.title)}
        helperText={errors.title}
      />

      <TextField
        label="Location"
        fullWidth
        margin="normal"
        placeholder="e.g. Remote, Bangalore"
        value={values.location}
        onChange={(e) => onChange('location', e.target.value)}
        error={Boolean(errors.location)}
        helperText={errors.location}
      />

      <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
        <TextField
          label="Min experience (years)"
          type="number"
          fullWidth
          slotProps={{ htmlInput: { min: 0 } }}
          value={values.minExperience}
          onChange={(e) =>
            onChange('minExperience', e.target.value === '' ? '' : Number(e.target.value))
          }
          error={Boolean(errors.minExperience)}
          helperText={errors.minExperience}
        />
        <TextField
          label="Max experience (years)"
          type="number"
          fullWidth
          slotProps={{ htmlInput: { min: 0 } }}
          value={values.maxExperience}
          onChange={(e) =>
            onChange('maxExperience', e.target.value === '' ? '' : Number(e.target.value))
          }
          error={Boolean(errors.maxExperience)}
          helperText={errors.maxExperience}
        />
      </Box>

      <TextField
        select
        label="Status"
        fullWidth
        margin="normal"
        value={values.status}
        onChange={(e) => onChange('status', e.target.value as JobStatus)}
      >
        {statusOptions.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Job description"
        fullWidth
        required
        multiline
        minRows={6}
        margin="normal"
        placeholder="Paste the full job description here..."
        value={values.description}
        onChange={(e) => onChange('description', e.target.value)}
        error={Boolean(errors.description)}
        helperText={errors.description ?? 'AI will extract skills and requirements after save (Module 5)'}
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
        <Button variant="outlined" color="primary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? 'Saving…' : submitLabel}
        </Button>
      </Box>
    </Box>
  );
}

export const emptyJobFormValues: JobFormValues = {
  title: '',
  description: '',
  location: '',
  minExperience: '',
  maxExperience: '',
  status: 'draft',
};

export function jobToFormValues(job: Job): JobFormValues {
  return {
    title: job.title,
    description: job.description,
    location: job.location === 'Not specified' ? '' : job.location,
    minExperience: job.minExperience,
    maxExperience: job.maxExperience,
    status: job.status,
  };
}

export function validateJobForm(values: JobFormValues): Partial<Record<keyof JobFormValues, string>> {
  const errors: Partial<Record<keyof JobFormValues, string>> = {};

  if (!values.title.trim()) errors.title = 'Job title is required';
  if (!values.description.trim()) errors.description = 'Job description is required';

  const min = values.minExperience === '' ? null : values.minExperience;
  const max = values.maxExperience === '' ? null : values.maxExperience;

  if (min !== null && min < 0) errors.minExperience = 'Must be 0 or more';
  if (max !== null && max < 0) errors.maxExperience = 'Must be 0 or more';
  if (min !== null && max !== null && min > max) {
    errors.maxExperience = 'Must be greater than or equal to min';
  }

  return errors;
}
