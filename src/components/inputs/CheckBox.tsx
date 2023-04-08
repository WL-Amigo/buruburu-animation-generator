import { Component, Show } from 'solid-js';
import { IconCheckbox, IconCheckboxChecked } from '../icons';

interface Props {
  label: string;
  value: boolean;
  onChange: (next: boolean) => void;
}
export const CheckBoxInput: Component<Props> = (props) => {
  return (
    <label class="flex flex-row items-center group cursor-pointer">
      <input
        type="checkbox"
        class="absolute appearance-none opacity-0"
        checked={props.value}
        onInput={(ev) => {
          props.onChange(ev.currentTarget.checked);
        }}
      />
      <Show
        when={props.value}
        fallback={<IconCheckbox class="text-gray-500 group-hover:text-gray-800 w-6 h-6 flex-shrink-0" />}
      >
        <IconCheckboxChecked class="text-primary-500 group-hover:text-primary-400 w-6 h-6 flex-shrink-0" />
      </Show>
      <span class="pl-1">{props.label}</span>
    </label>
  );
};
