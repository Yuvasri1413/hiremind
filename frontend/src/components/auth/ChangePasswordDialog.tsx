import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect, useState, type FormEvent } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useThemeMode } from '../../context/ThemeContext';
import type { ChangePasswordValues } from '../../types/auth';

type ChangePasswordDialogProps = {
  open: boolean;
  onClose: () => void;
};

const emptyValues: ChangePasswordValues = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

function validate(values: ChangePasswordValues) {
  const errors: Partial<Record<keyof ChangePasswordValues, string>> = {};

  if (!values.currentPassword) {
    errors.currentPassword = 'Current password is required';
  }
  if (!values.newPassword) {
    errors.newPassword = 'New password is required';
  } else if (values.newPassword.length < 8) {
    errors.newPassword = 'Password must be at least 8 characters';
  }
  if (!values.confirmPassword) {
    errors.confirmPassword = 'Please confirm your new password';
  } else if (values.newPassword !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  if (
    values.currentPassword &&
    values.newPassword &&
    values.currentPassword === values.newPassword
  ) {
    errors.newPassword = 'New password must be different from current password';
  }

  return errors;
}

export function ChangePasswordDialog({ open, onClose }: ChangePasswordDialogProps) {
  const { changePassword } = useAuth();
  const { tokens: t } = useThemeMode();

  const [values, setValues] = useState<ChangePasswordValues>(emptyValues);
  const [errors, setErrors] = useState<Partial<Record<keyof ChangePasswordValues, string>>>({});
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setValues(emptyValues);
    setErrors({});
    setFormError('');
    setSuccess(false);
  }, [open]);

  function handleClose() {
    if (loading) return;
    onClose();
  }

  function handleChange(field: keyof ChangePasswordValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    setFormError('');
    setSuccess(false);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setFormError('');
    try {
      await changePassword(values.currentPassword, values.newPassword);
      setSuccess(true);
      setValues(emptyValues);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
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
          <Typography variant="h6" sx={{ fontFamily: '"Playfair Display", serif' }}>
            Change Password
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Update your account password
          </Typography>
        </Box>
        <IconButton aria-label="Close" onClick={handleClose} size="small" sx={{ mt: -0.5 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <DialogContent dividers sx={{ borderColor: t.borderGold }}>
          {formError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formError}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Password updated successfully.
            </Alert>
          )}

          <TextField
            label="Current password"
            type="password"
            fullWidth
            required
            margin="normal"
            autoComplete="current-password"
            value={values.currentPassword}
            error={Boolean(errors.currentPassword)}
            helperText={errors.currentPassword}
            onChange={(e) => handleChange('currentPassword', e.target.value)}
          />
          <TextField
            label="New password"
            type="password"
            fullWidth
            required
            margin="normal"
            autoComplete="new-password"
            value={values.newPassword}
            error={Boolean(errors.newPassword)}
            helperText={errors.newPassword ?? 'Minimum 8 characters'}
            onChange={(e) => handleChange('newPassword', e.target.value)}
          />
          <TextField
            label="Confirm new password"
            type="password"
            fullWidth
            required
            margin="normal"
            autoComplete="new-password"
            value={values.confirmPassword}
            error={Boolean(errors.confirmPassword)}
            helperText={errors.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Updating…' : 'Update Password'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
