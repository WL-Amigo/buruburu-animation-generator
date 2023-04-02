import { Component } from 'solid-js';
import { NumberStepper, RadioGroup } from '../components/inputs';
import { useAppViewModel } from '../viewModels';
import { AllExportFileTypeEnum } from '../models';
import clsx from 'clsx';
import { windi } from '../windi';

export const BasicConfig: Component<{ class?: string }> = (props) => {
  const { parameters, setParameters } = useAppViewModel();

  return (
    <div class={clsx(windi`w-full p-2 overflow-y-auto overflow-x-hidden flex flex-col gap-y-4`, props.class)}>
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
    </div>
  );
};
