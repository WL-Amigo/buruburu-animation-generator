import { Component, Match, Switch, createEffect, createSignal, untrack } from 'solid-js';
import { NumberStepper, RadioGroup } from '../components/inputs';
import { useAppViewModel } from '../viewModels';
import { AllExportFileTypeEnum } from '../models';
import clsx from 'clsx';
import { windi } from '../windi';
import { ContourGetterConfigDialog } from './ContourGetterConfigDialog';
import { Accordion } from '../components/Accordion';
import { CheckBoxInput } from '../components/inputs/CheckBox';
import { ColorPickerInput } from '../components/inputs/Color';
import { Button } from '../components/Button';

const FpsPresets = [10, 15, 30, 60] as const;
const FpsPresetsOptions: readonly string[] = FpsPresets.map((v) => v.toFixed(0));

const BgColorPresets = ['#ffffff', '#000000'] as const;

export const BasicConfig: Component<{ class?: string }> = (props) => {
  const { parameters, setParameters, hasFile, reset } = useAppViewModel();
  const [isContourGetterConfigDialogOpen, setContourGetterConfigDialogOpen] = createSignal(false);

  const [arbitraryFpsMode, setArbitraryFpsMode] = createSignal(false);
  createEffect(() => {
    const currentArbitraryFpsMode = arbitraryFpsMode();
    if (!currentArbitraryFpsMode) {
      // set nearest fps to presets
      const currentFps = untrack(() => parameters.fps);
      let nextFps = 0;
      for (const fpsPreset of FpsPresets) {
        if (Math.abs(currentFps - nextFps) > Math.abs(currentFps - fpsPreset)) {
          nextFps = fpsPreset;
        } else {
          break;
        }
      }
      setParameters('fps', nextFps);
    }
  });

  const [arbitraryBgColorMode, setArbitraryBgColorMode] = createSignal(false);
  createEffect(() => {
    const currentArbitraryBgColorMode = arbitraryBgColorMode();
    if (!currentArbitraryBgColorMode) {
      setParameters('backgroundColor', BgColorPresets[0]);
    }
  });

  return (
    <div class={clsx(windi`w-full p-2 overflow-y-auto overflow-x-hidden flex flex-col gap-y-4`, props.class)}>
      <Button colorVariant="primary" onClick={() => setContourGetterConfigDialogOpen(true)} disabled={!hasFile()}>
        輪郭検出を調整
      </Button>
      <ContourGetterConfigDialog
        open={isContourGetterConfigDialogOpen()}
        onCloseRequested={() => setContourGetterConfigDialogOpen(false)}
      />
      <NumberStepper
        id="movable-length"
        label="揺れの大きさの最大値 (px)"
        tooltip={
          <div class="flex flex-col items-start">
            <span>小さいと控えめに、大きいとよりブルブルします。</span>
            <span>大きくしすぎるとノイズっぽくなりますのでご注意ください。</span>
          </div>
        }
        value={parameters.movableLength}
        onChange={(v) => setParameters('movableLength', () => v)}
        scale={1}
        step={0.1}
        min={1}
        max={100}
      />
      <NumberStepper
        id="patch-size"
        label="一度に動かす範囲の半径 (px)"
        tooltip={<span>小さいとビリビリした印象に、大きいとより大雑把にブルブルするようになります。</span>}
        value={parameters.patchSize}
        onChange={(v) => setParameters('patchSize', () => v)}
        step={1}
        min={1}
        max={9999}
      />

      <Switch>
        <Match when={!arbitraryFpsMode()}>
          <RadioGroup
            label="速さ (fps)"
            value={parameters.fps.toFixed(0)}
            setValue={(v) => setParameters('fps', () => Number(v))}
            options={FpsPresetsOptions}
            optionLabelGetter={(opt) => opt}
          />
        </Match>
        <Match when={arbitraryFpsMode()}>
          <NumberStepper
            id="arbitrary-fps"
            label="速さ (fps)"
            value={parameters.fps}
            onChange={(v) => setParameters('fps', () => v)}
            step={1}
            min={1}
            max={60}
          />
        </Match>
      </Switch>
      <CheckBoxInput label="直接設定する" value={arbitraryFpsMode()} onChange={(v) => setArbitraryFpsMode(v)} />

      <Switch>
        <Match when={!arbitraryBgColorMode()}>
          <RadioGroup
            label="背景色 (gif のみ)"
            value={parameters.backgroundColor}
            setValue={(v) => setParameters('backgroundColor', () => v)}
            options={BgColorPresets}
            optionLabelGetter={(opt) => {
              switch (opt) {
                case '#ffffff':
                  return '白';
                case '#000000':
                  return '黒';
              }
              return '';
            }}
          />
        </Match>
        <Match when={arbitraryBgColorMode()}>
          <ColorPickerInput
            label="背景色 (gif のみ)"
            value={parameters.backgroundColor}
            onChange={(v) => setParameters('backgroundColor', () => v)}
          />
        </Match>
      </Switch>
      <CheckBoxInput label="直接設定する" value={arbitraryBgColorMode()} onChange={(v) => setArbitraryBgColorMode(v)} />

      <RadioGroup
        label="ダウンロード形式"
        value={parameters.exportFileType}
        setValue={(v) => setParameters('exportFileType', () => v)}
        options={AllExportFileTypeEnum}
        optionLabelGetter={(opt) => {
          switch (opt) {
            case 'gif':
              return 'gif';
            case 'apng':
              return 'apng';
            case 'frames':
              return '連番PNG (zip)';
          }
        }}
      />
      <Accordion label="高度な設定">
        <div class="p-2 flex flex-col gap-y-4">
          <CheckBoxInput
            label="ずらす範囲が被らないように間引く"
            value={parameters.isStride}
            onChange={(v) => setParameters('isStride', () => v)}
          />
          <NumberStepper
            id="stddev"
            label="動かす量を決める乱数の分散"
            value={parameters.std}
            onChange={(v) => setParameters('std', () => v)}
            scale={2}
            step={0.01}
            min={0.01}
            max={1.0}
            tooltip={
              <div class="flex flex-col items-start">
                <span>動かす量を決める乱数は正規分布に従うようになっています(ただし出力を [-1,1] に制限)。</span>
                <span>大きくすると動かす量が最大値に偏るようになります。</span>
              </div>
            }
          />
          <NumberStepper
            id="variation-count"
            label="生成するフレーム数"
            value={parameters.variationCount}
            onChange={(v) => setParameters('variationCount', () => v)}
            step={1}
            min={2}
            max={100}
          />
        </div>
      </Accordion>
      <Button colorVariant="danger" onClick={reset}>
        設定をデフォルト値にリセット
      </Button>
    </div>
  );
};
