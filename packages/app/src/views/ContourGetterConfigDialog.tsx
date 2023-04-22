import { Component, Show, createEffect, createSignal, untrack } from 'solid-js';
import { useAppViewModel } from '../viewModels';
import { ModalBase } from '../components/ModalBase';
import { ContourPreview } from '../components/ContourPreview';
import { SliderInput } from '../components/inputs/Slider';
import { ContourExtractionBasisOptions, ContourExtractionBasisType, ContourGetterParameters } from '../models';
import { CheckBoxInput } from '../components/inputs/CheckBox';
import { RadioGroup } from '../components/inputs';
import { ActionButton } from '../components/Button';

const getContourGetterParameters = (source: ContourGetterParameters): ContourGetterParameters => ({
  threshold: source.threshold,
  onlyExternal: source.onlyExternal,
  contourExtractionBasis: source.contourExtractionBasis,
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
      <div class="bg-white w-full max-w-screen-lg h-full max-h-[920px] lg:rounded flex flex-col lg:flex-row overflow-hidden">
        <div class="flex-[2] overflow-hidden flex flex-col justify-center items-center">
          <Show when={imageBitmap()} keyed>
            {(ib) => <ContourPreview imageBitmap={ib} params={localParams()} />}
          </Show>
        </div>
        <div class="flex-1 flex flex-col border-l">
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
            <CheckBoxInput
              label="できるだけ外側の輪郭だけ抽出する"
              value={localParams().onlyExternal}
              onChange={(next) => setLocalParams((prev) => ({ ...prev, onlyExternal: next }))}
            />
            <RadioGroup<ContourExtractionBasisType>
              label="輪郭抽出の基準"
              options={ContourExtractionBasisOptions}
              optionLabelGetter={(opt) => {
                switch (opt) {
                  case 'brightness':
                    return '明度';
                  case 'grayscale':
                    return 'グレースケール';
                }
              }}
              value={localParams().contourExtractionBasis}
              setValue={(next) => setLocalParams((prev) => ({ ...prev, contourExtractionBasis: next }))}
            />
          </div>
          <div class="flex flex-row border-t">
            <ActionButton class="flex-1 border-r" onClick={props.onCloseRequested}>
              キャンセル
            </ActionButton>
            <ActionButton
              class="flex-1"
              onClick={() => {
                const nextParams = localParams();
                setParameters('threshold', () => nextParams.threshold);
                setParameters('onlyExternal', () => nextParams.onlyExternal);
                setParameters('contourExtractionBasis', () => nextParams.contourExtractionBasis);
                props.onCloseRequested();
              }}
            >
              確定
            </ActionButton>
          </div>
        </div>
      </div>
    </ModalBase>
  );
};
