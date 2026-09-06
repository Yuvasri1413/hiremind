import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState, type FormEvent } from 'react';
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../api';
import { AuthLayout } from '../components/layout/AuthLayout';

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const emailParam = searchParams.get('email') ?? '';
  const tokenParam = searchParams.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const linkInvalid = !emailParam || !tokenParam;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await api.auth.resetPassword(emailParam, tokenParam, password);
      navigate('/login', {
        replace: true,
        state: { message: 'Password reset successfully. Please sign in.' },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reset failed');
    } finally {
      setLoading(false);
    }
  }

  if (linkInvalid) {
    return (
      <AuthLayout title="Invalid link" subtitle="This password reset link is not valid">
        <Alert severity="error" sx={{ mb: 2 }}>
          The reset link is missing or expired. Request a new one.
        </Alert>
        <Button component={RouterLink} to="/forgot-password" variant="contained" fullWidth>
          Request new link
        </Button>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Reset password" subtitle="Choose a new password for your account">
      <Box component="form" onSubmit={handleSubmit} noValidate>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={emailParam}
          slotProps={{ input: { readOnly: true } }}
        />

        <TextField
          label="New password"
          type="password"
          fullWidth
          required
          margin="normal"
          autoComplete="new-password"
          helperText="Minimum 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <TextField
          label="Confirm new password"
          type="password"
          fullWidth
          required
          margin="normal"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          disabled={loading}
          sx={{ mt: 3, mb: 2 }}
        >
          {loading ? 'Updating…' : 'Reset password'}
        </Button>

        <Box sx={{ textAlign: 'center' }}>
          <Link component={RouterLink} to="/login" underline="hover">
            Back to login
          </Link>
        </Box>
      </Box>
    </AuthLayout>
  );
}
