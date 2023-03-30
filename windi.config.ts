import {defineConfig} from 'windicss/helpers';
import Colors from 'windicss/colors';

export default defineConfig({
  theme: {
    extend: {
      colors: {
        primary: Colors.blue,
        secondary: Colors.gray
      }
    }
  }
});