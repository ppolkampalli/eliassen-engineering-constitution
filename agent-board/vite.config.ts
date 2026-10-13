import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

import { boardApiPlugin } from './server/vite-plugin-board-api';
import { tokenUsageApiPlugin } from './server/vite-plugin-token-usage-api';

export default defineConfig({
  plugins: [react(), boardApiPlugin(), tokenUsageApiPlugin()],
});
