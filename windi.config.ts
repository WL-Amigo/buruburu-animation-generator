import {defineConfig} from 'windicss/helpers';
import Colors from 'windicss/colors';

export default defineConfig({
  extract: {
    include: ['index.html', './src/**/*.{ts,tsx}']
  },
  theme: {
    extend: {
      colors: {
        primary: Colors.blue,
        secondary: Colors.gray
      }
    }
  }
});