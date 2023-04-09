import { For, JSX } from 'solid-js';
import { RadioGroup as HUIRadioGroup, RadioGroupLabel, RadioGroupOption } from 'solid-headless';
import clsx from 'clsx';
import { windi } from '../../windi';
import { IconCheckCircleSolid, IconCircle } from '../icons';

interface Props<OptionsType extends string> {
  label: string;
  value: OptionsType;
  setValue: (next: OptionsType) => void;
  options: readonly OptionsType[];
  optionLabelGetter: (opt: OptionsType) => string;
}
export const RadioGroup = <OptionsType extends string>(props: Props<OptionsType>): JSX.Element => {
  const onChangeLocal = (v: OptionsType | undefined) => {
    v !== undefined && props.setValue(v);
  };

  return (
    <HUIRadioGroup class="w-full" value={props.value} onChange={onChangeLocal}>
      <RadioGroupLabel>{props.label}</RadioGroupLabel>
      <div class="mt-1 flex flex-col gap-x-4 lg:flex-row lg:w-full">
        <For each={props.options}>
          {(opt) => (
            <RadioGroupOption class="p-2 cursor-pointer" value={opt}>
              {(optionProps) => (
                <div
                  class={clsx(
                    windi`flex flex-row gap-x-2 items-center`,
                    optionProps.isSelected() ? windi`text-primary-700` : windi`text-black`
                  )}
                >
                  {optionProps.isSelected() ? <IconCheckCircleSolid /> : <IconCircle />}
                  <span class="leading-none">{props.optionLabelGetter(opt)}</span>
                </div>
              )}
            </RadioGroupOption>
          )}
        </For>
      </div>
    </HUIRadioGroup>
  );
};
//clsx()
