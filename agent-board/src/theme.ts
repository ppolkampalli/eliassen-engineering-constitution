import { createTheme } from '@mui/material';

/**
 * Hand-duplicated from `src/styles/board.css`'s `:root` custom properties —
 * there's no single source of truth bridging CSS custom properties and a
 * JS theme object in this stack, so a future palette change needs updating
 * both places.
 */
export const theme = createTheme({
  palette: {
    primary: { main: '#0052cc' }, // --color-entered
    error: { main: '#de350b' }, // --color-blocked
    success: { main: '#00875a' }, // --color-complete
    text: { primary: '#172b4d', secondary: '#5e6c84' }, // --color-text, --color-muted
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
});
