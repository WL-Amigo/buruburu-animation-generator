import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import WindiCSS from 'vite-plugin-windicss';
import Icons from 'unplugin-icons/vite';

export default defineConfig({
  plugins: [
    solidPlugin(),
    WindiCSS(),
    Icons({ compiler: 'solid', defaultClass: 'w-6 h-6 flex-shrink-0 text-current' }),
  ],
  server: {},
  build: {
    target: 'esnext',
  },
});
