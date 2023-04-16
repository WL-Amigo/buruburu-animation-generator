import { defineConfig, loadEnv } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import WindiCSS from 'vite-plugin-windicss';
import Icons from 'unplugin-icons/vite';
import Licenses from '@buruburu-animgen/vite-plugin-licenses';
import { readFileSync } from 'node:fs';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', 'LOCALDEV_');
  const isHttpsEnabled = env['LOCALDEV_HTTPS']?.toLowerCase() === String(true);
  const mkcertBasePath = env['LOCALDEV_MKCERT_BASE_PATH'] ?? '';

  return {
    plugins: [
      solidPlugin(),
      WindiCSS(),
      Icons({ compiler: 'solid', defaultClass: 'w-6 h-6 flex-shrink-0 text-current' }),
      Licenses({ exclude: ['@buruburu-animgen'] }),
    ],
    server: {
      https:
        isHttpsEnabled && mkcertBasePath.length > 0
          ? {
              key: readFileSync(mkcertBasePath + '-key.pem'),
              cert: readFileSync(mkcertBasePath + '.pem'),
            }
          : false,
    },
    build: {
      target: 'esnext',
    },
  };
});
