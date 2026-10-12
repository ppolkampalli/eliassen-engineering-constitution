import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

import { boardApiPlugin } from './server/vite-plugin-board-api';

export default defineConfig({
  plugins: [react(), boardApiPlugin()],
});
