import { Component, createSignal } from 'solid-js';
import { NumberStepper, RadioGroup } from '../components/inputs';
import { useAppViewModel } from '../viewModels';
import { AllExportFileTypeEnum } from '../models';
import clsx from 'clsx';
import { windi } from '../windi';
import { ContourGetterConfigDialog } from './ContourGetterConfigDialog';

export const BasicConfig: Component<{ class?: string }> = (props) => {
  const { parameters, setParameters, reset } = useAppViewModel();
  const [isContourGetterConfigDialogOpen, setContourGetterConfigDialogOpen] = createSignal(false);

  return (
    <div class={clsx(windi`w-full p-2 overflow-y-auto overflow-x-hidden flex flex-col gap-y-4`, props.class)}>
      <button onClick={() => setContourGetterConfigDialogOpen(true)}>輪郭検出を調整</button>
      <ContourGetterConfigDialog
        open={isContourGetterConfigDialogOpen()}
        onCloseRequested={() => setContourGetterConfigDialogOpen(false)}
      />
      <NumberStepper
        id="patch-size"
        label="一度に動かす範囲 (px)"
        value={parameters.patchSize}
        onChange={(v) => setParameters('patchSize', () => v)}
        step={1}
        min={1}
        max={9999}
      />
      <RadioGroup
        label="ダウンロード形式"
        value={parameters.exportFileType}
        setValue={(v) => setParameters('exportFileType', () => v)}
        options={AllExportFileTypeEnum}
        optionLabelGetter={(opt) => opt}
      />
      <button onClick={reset}>設定をデフォルト値にリセット</button>
    </div>
  );
};
