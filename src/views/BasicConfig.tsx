import { Component } from 'solid-js';
import { RadioGroup } from '../components/inputs';
import { useAppViewModel } from '../viewModels';
import { AllExportFileTypeEnum } from '../models';
import clsx from 'clsx';
import { windi } from '../windi';

export const BasicConfig: Component<{ class?: string }> = (props) => {
  const { parameters, setParameters } = useAppViewModel();

  return (
    <div class={clsx(windi`w-full p-2 overflow-y-auto overflow-x-hidden`, props.class)}>
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
