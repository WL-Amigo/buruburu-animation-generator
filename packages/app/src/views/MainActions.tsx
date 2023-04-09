import { Component } from 'solid-js';
import { useAppViewModel } from '../viewModels';
import clsx from 'clsx';
import { windi } from '../windi';
import { FileInput } from '../components/inputs';
import { ActionButton } from '../components/Button';

export const MainActions: Component<{ class?: string }> = (props) => {
  const { setFile, hasFile, runGenerator, isProcessing, download, isDownloading } = useAppViewModel();

  return (
    <div class={clsx(windi`flex flex-col w-full items-stretch`, props.class)}>
      <ActionButton onClick={() => runGenerator()} disabled={!hasFile() || isProcessing() || isDownloading()}>
        アニメーション再生成
      </ActionButton>
      <div class="flex flex-row w-full border-t">
        <FileInput id="image-file-input" accept="image/*" onInputFile={setFile} class="flex-1 border-none" />
        <ActionButton
          class="flex-1 border-l"
          onClick={() => download()}
          disabled={!hasFile() || isDownloading() || isProcessing()}
        >
          ダウンロード
        </ActionButton>
      </div>
    </div>
  );
};
