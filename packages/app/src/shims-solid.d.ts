import type { ComponentProps } from 'solid-js';
import type {} from 'vanilla-colorful';
declare module 'solid-js' {
  namespace JSX {
    interface IntrinsicElements {
      'hex-color-picker': ComponentProps<'div'> & {
        color?: string;
        'on:color-changed'?: (ev: { detail: { value: string } }) => void;
      };
    }
  }
}
