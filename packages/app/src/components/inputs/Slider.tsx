import { Component } from 'solid-js';

interface Props {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (next: number) => void;
}
export const SliderInput: Component<Props> = (props) => {
  return (
    <div>
      <label for={props.id} class="font-bold">
        {props.label}
      </label>
      <div class="w-full flex flex-row gap-x-2 items-center mt-2">
        <span class="w-10">{props.value}</span>
        <input
          class="flex-1 min-w-0"
          type="range"
          id={props.id}
          min={props.min}
          max={props.max}
          step={props.step}
          value={props.value}
          onInput={(ev) => {
            props.onChange(Number(ev.currentTarget.value));
          }}
        />
      </div>
    </div>
  );
};
