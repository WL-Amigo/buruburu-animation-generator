import { Accessor, Component, JSX, createEffect, createSignal, onCleanup } from 'solid-js';
import IMask from 'imask';
import { IconMinus, IconPlus } from '../icons';
import { windi } from '../../windi';
import { HelpTooltip } from '../Tooltip';

const DefaultMin = 0;
const DefaultMax = 9999;

interface NumberMaskConfig {
  scale?: number; // default: 0
  min?: number; // default: 0
  max?: number; // default: 9999
}
const createNumberMask = (
  elSignal: Accessor<HTMLInputElement | null>,
  config: NumberMaskConfig
): Accessor<IMask.InputMask<IMask.MaskedNumberOptions> | null> => {
  const [inputMask, setInputMask] = createSignal<IMask.InputMask<IMask.MaskedNumberOptions> | null>(null);
  createEffect(() => {
    const currentInputEl = elSignal();
    if (currentInputEl === null) {
      return;
    }

    const imask = IMask(currentInputEl, {
      mask: Number,
      scale: config?.scale ?? 0,
      signed: false,
      thousandsSeparator: '',
      radix: '.',
      padFractionalZeros: true,
      min: config.min ?? DefaultMin,
      max: config.max ?? DefaultMax,
    });
    setInputMask(imask);
  });
  createEffect(() => {
    const currentInputMask = inputMask();
    if (currentInputMask === null) {
      return;
    }
    onCleanup(() => {
      currentInputMask.destroy();
    });
  });

  return inputMask;
};

const StepButtonClasses = windi`border rounded border-primary-500 bg-primary-500 hover:bg-primary-400 text-white flex flex-row justify-center items-center w-8`;

interface Props extends NumberMaskConfig {
  id: string;
  label: string;
  step: number;
  value: number;
  onChange: (next: number) => void;
  tooltip?: JSX.Element;
}
export const NumberStepper: Component<Props> = (props) => {
  const [inputEl, setInputEl] = createSignal<HTMLInputElement | null>(null);
  const inputMask = createNumberMask(inputEl, { scale: props.scale, min: props.min, max: props.max });

  createEffect(() => {
    const currentInputMask = inputMask();
    if (currentInputMask === null) {
      return;
    }

    const handler = () => {
      props.onChange(currentInputMask.typedValue);
    };
    currentInputMask.on('accept', handler);
    onCleanup(() => currentInputMask.off('accept', handler));
  });
  createEffect(() => {
    const incomingValue = props.value;
    const currentInputMask = inputMask();
    if (currentInputMask === null) {
      return;
    }
    if (currentInputMask.typedValue !== incomingValue) {
      currentInputMask.typedValue = incomingValue;
    }
  });

  const onClickMinus = () => {
    const min = props.min ?? DefaultMin;
    const nextRaw = Math.max(min, props.value - props.step);
    const next = Math.round(nextRaw / props.step) * props.step;
    props.onChange(next);
  };
  const onClickPlus = () => {
    const max = props.max ?? DefaultMax;
    const nextRaw = Math.min(max, props.value + props.step);
    const next = Math.round(nextRaw / props.step) * props.step;
    props.onChange(next);
  };

  return (
    <div>
      <label for={props.id} class="flex flex-row gap-x-2 items-center">
        <span class="font-bold">{props.label}</span>
        {props.tooltip !== undefined && <HelpTooltip>{props.tooltip}</HelpTooltip>}
      </label>
      <div class="flex flex-row gap-x-1 items-stretch w-full mt-2 max-w-[240px] h-8">
        <button class={StepButtonClasses} onClick={onClickMinus}>
          <IconMinus />
        </button>
        <input id={props.id} class="border rounded flex-1 min-w-0 px-2" type="text" ref={setInputEl} />
        <button class={StepButtonClasses} onClick={onClickPlus}>
          <IconPlus />
        </button>
      </div>
    </div>
  );
};
