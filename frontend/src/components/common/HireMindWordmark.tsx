import Box from '@mui/material/Box';
import { useThemeMode } from '../../context/ThemeContext';

type TieIconProps = {
  color: string;
  height?: number;
};

/** Necktie replacing the "i" in Hire — HireUp style */
export function TieIcon({ color, height = 22 }: TieIconProps) {
  const width = height * 0.38;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 14 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ display: 'block', margin: '0 -0.04em' }}
    >
      {/* knot */}
      <path
        d="M7 1.5L11.5 5.5L10 7L7 6L4 7L2.5 5.5L7 1.5Z"
        fill={color}
      />
      {/* left blade */}
      <path d="M4.5 7.5L7 30L7 7.5H4.5Z" fill={color} />
      {/* right blade */}
      <path d="M9.5 7.5L7 30L7 7.5H9.5Z" fill={color} />
    </svg>
  );
}

type MindIIconProps = {
  color: string;
  height?: number;
  stemColor?: string;
};

/** "i" in Mind — stem + AI spark dot (brain/intelligence) */
export function MindIIcon({ color, height = 22, stemColor }: MindIIconProps) {
  const width = height * 0.34;
  const stem = stemColor ?? color;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 12 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ display: 'block', margin: '0 -0.02em' }}
    >
      {/* spark / neural dot */}
      <circle cx="6" cy="5" r="3.2" fill={color} />
      <circle cx="6" cy="5" r="1.2" fill="#0A0A0A" opacity="0.35" />
      <path
        d="M6 2.5v1M6 7.5v1M3.8 5h1M7.2 5h1"
        stroke={color}
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.7"
      />
      {/* stem */}
      <rect x="4.5" y="10" width="3" height="20" rx="1.5" fill={stem} />
    </svg>
  );
}

type HireMindWordmarkProps = {
  size?: 'sm' | 'md' | 'lg';
};

const fontSizes = { sm: 22, md: 28, lg: 38 } as const;

export function HireMindWordmark({ size = 'sm' }: HireMindWordmarkProps) {
  const { tokens: t } = useThemeMode();
  const fontSize = fontSizes[size];
  const iconH = fontSize * 0.92;
  const fontFamily = '"Montserrat", "Inter", sans-serif';

  return (
    <Box
      component="span"
      aria-label="HireMind"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        fontFamily,
        fontWeight: 800,
        fontSize,
        letterSpacing: '-0.03em',
        lineHeight: 1,
        userSelect: 'none',
      }}
    >
      {/* Hire — dark text + gold tie */}
      <Box component="span" sx={{ color: 'text.primary', display: 'inline-flex', alignItems: 'center' }}>
        <Box component="span">H</Box>
        <TieIcon color={t.gold} height={iconH} />
        <Box component="span">re</Box>
      </Box>

      {/* Mind — gold + special i and d */}
      <Box
        component="span"
        sx={{
          color: t.gold,
          display: 'inline-flex',
          alignItems: 'center',
        }}
      >
        <Box component="span">M</Box>
        <MindIIcon color={t.gold} height={iconH} />
        <Box component="span">nd</Box>
      </Box>
    </Box>
  );
}
