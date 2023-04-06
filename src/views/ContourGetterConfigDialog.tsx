import { Component, Show, createEffect, createSignal, untrack } from 'solid-js';
import { useAppViewModel } from '../viewModels';
import { ModalBase } from '../components/ModalBase';
import { ContourPreview } from '../components/ContourPreview';
import { SliderInput } from '../components/inputs/Slider';
import { ContourGetterParameters } from '../models';

const getContourGetterParameters = (source: ContourGetterParameters): ContourGetterParameters => ({
  threshold: source.threshold,
  onlyExternal: source.onlyExternal,
});

interface Props {
  open: boolean;
  onCloseRequested: () => void;
}
export const ContourGetterConfigDialog: Component<Props> = (props) => {
  const { parameters, setParameters, imageBitmap } = useAppViewModel();
  const [localParams, setLocalParams] = createSignal<ContourGetterParameters>(getContourGetterParameters(parameters));
  const resetCurrentParams = () => {
    setLocalParams(getContourGetterParameters(parameters));
  };
  createEffect(() => {
    const isOpen = props.open;
    if (isOpen) {
      untrack(() => {
        resetCurrentParams();
      });
    }
  });

  return (
    <ModalBase open={props.open}>
      <div class="bg-white w-full max-w-screen-lg h-full max-h-screen-lg flex flex-col lg:flex-row overflow-hidden">
        <div class="flex-[2] overflow-hidden flex flex-col justify-center items-center">
          <Show when={imageBitmap()} keyed>
            {(ib) => <ContourPreview imageBitmap={ib} params={localParams()} />}
          </Show>
        </div>
        <div class="flex-1 flex flex-col">
          <div class="flex-1 p-4 flex flex-col gap-y-4">
            <SliderInput
              id="threshold"
              label="しきい値"
              value={localParams().threshold}
              min={1}
              max={254}
              step={1}
              onChange={(next) => setLocalParams((prev) => ({ ...prev, threshold: next }))}
            />
          </div>
          <div class="flex flex-row">
            <button class="flex-1 border-r" onClick={props.onCloseRequested}>
              キャンセル
            </button>
            <button
              class="flex-1"
              onClick={() => {
                const nextParams = localParams();
                setParameters('threshold', () => nextParams.threshold);
                setParameters('onlyExternal', () => nextParams.onlyExternal);
                props.onCloseRequested();
              }}
            >
              確定
            </button>
          </div>
        </div>
      </div>
    </ModalBase>
  );
};
