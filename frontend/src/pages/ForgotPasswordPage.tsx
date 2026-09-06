import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState, type FormEvent } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { api } from '../api';
import { AuthLayout } from '../components/layout/AuthLayout';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [resetLink, setResetLink] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const result = await api.auth.requestPasswordReset(email);
      setSent(true);

      if (result.resetToken && result.email) {
        const params = new URLSearchParams({
          email: result.email,
          token: result.resetToken,
        });
        setResetLink(`/reset-password?${params.toString()}`);
      } else {
        setResetLink(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Forgot password"
      subtitle="Enter your email and we'll send reset instructions"
    >
      {sent ? (
        <Box>
          <Alert severity="success" sx={{ mb: 2 }}>
            If an account exists for this email, you will receive password reset instructions.
          </Alert>

          {resetLink && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Mock mode: no email is sent. Use the button below to reset your password.
            </Alert>
          )}

          {resetLink ? (
            <Button component={RouterLink} to={resetLink} variant="contained" fullWidth size="large">
              Continue to reset password
            </Button>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Check your inbox for the reset link. If you don&apos;t see it, verify the email you
              entered matches your registered account.
            </Typography>
          )}

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Link component={RouterLink} to="/login" underline="hover">
              Back to login
            </Link>
          </Box>
        </Box>
      ) : (
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
            required
            margin="normal"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? 'Sending…' : 'Send reset link'}
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Link component={RouterLink} to="/login" underline="hover">
              Back to login
            </Link>
          </Box>
        </Box>
      )}
    </AuthLayout>
  );
}
