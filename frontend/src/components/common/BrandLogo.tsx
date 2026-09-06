import Box from '@mui/material/Box';
import { Link as RouterLink } from 'react-router-dom';
import { HireMindWordmark } from './HireMindWordmark';

type BrandLogoProps = {
  variant?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  linkToHome?: boolean;
};

export function BrandLogo({
  variant = 'horizontal',
  size = 'sm',
  linkToHome = false,
}: BrandLogoProps) {
  const content = (
    <Box
      sx={{
        display: 'inline-flex',
        flexDirection: variant === 'vertical' ? 'column' : 'row',
        alignItems: 'center',
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      <HireMindWordmark size={size} />
    </Box>
  );

  if (linkToHome) {
    return (
      <Box
        component={RouterLink}
        to="/dashboard"
        sx={{
          textDecoration: 'none',
          color: 'inherit',
          display: 'inline-flex',
          '&:hover': { opacity: 0.92 },
        }}
      >
        {content}
      </Box>
    );
  }

  return content;
}
