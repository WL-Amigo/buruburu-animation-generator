import clsx from 'clsx';
import { Component, ParentProps } from 'solid-js';
import { windi } from '../windi';

export type ButtonColorVariant = 'default' | 'primary' | 'danger';
const ColorVariantToClassMap: Record<ButtonColorVariant, string> = {
  default: windi`border bg-white hover:bg-gray-50 disabled:text-gray-400 disabled:hover:bg-white`,
  primary: windi`bg-primary-500 hover:bg-primary-400 text-white disabled:opacity-50 disabled:hover:bg-primary-500`,
  danger: windi`bg-red-400 hover:bg-red-300 text-white disabled:opacity-50 disabled:hover:bg-red-400`,
};
interface Props {
  onClick: () => void;
  colorVariant?: ButtonColorVariant;
  disabled?: boolean;
  class?: string;
  ref?: HTMLButtonElement | ((el: HTMLButtonElement) => void);
}

export const Button: Component<ParentProps<Props>> = (props) => {
  return (
    <button
      class={clsx(
        windi`px-2 py-1 rounded cursor-pointer disabled:cursor-not-allowed`,
        ColorVariantToClassMap[props.colorVariant ?? 'default'],
        props.class
      )}
      onClick={() => props.onClick()}
      disabled={props.disabled}
      ref={props.ref}
    >
      {props.children}
    </button>
  );
};

export const ActionButton: Component<ParentProps<Props>> = (props) => {
  return (
    <button
      class={clsx(
        windi`py-3 cursor-pointer disabled:cursor-not-allowed`,
        windi`bg-white hover:bg-primary-50 disabled:text-gray-400 disabled:hover:bg-white`,
        props.class
      )}
      onClick={() => props.onClick()}
      disabled={props.disabled}
      ref={props.ref}
    >
      {props.children}
    </button>
  );
};
