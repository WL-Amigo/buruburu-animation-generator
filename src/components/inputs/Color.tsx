import { Component } from 'solid-js';
import 'vanilla-colorful';

interface Props {
  label: string;
  value: string;
  onChange: (next: string) => void;
}
export const ColorPickerInput: Component<Props> = (props) => {
  return (
    <div>
      <label class="block mb-3">{props.label}</label>
      <hex-color-picker color={props.value} on:color-changed={(ev) => props.onChange(ev.detail.value)} />
    </div>
  );
};
