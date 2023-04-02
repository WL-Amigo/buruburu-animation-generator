import { defineConfig } from 'windicss/helpers';
import Colors from 'windicss/colors';

export default defineConfig({
  extract: {
    include: ['index.html', './src/**/*.{ts,tsx}'],
  },
  safelist: ['w-6', 'h-6', 'flex-shrink-0', 'text-current'],
  theme: {
    extend: {
      colors: {
        primary: Colors.blue,
        secondary: Colors.gray,
      },
    },
  },
});
