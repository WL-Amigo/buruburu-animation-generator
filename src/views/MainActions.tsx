import { Component } from 'solid-js';
import { useAppViewModel } from '../viewModels';
import clsx from 'clsx';
import { windi } from '../windi';
import { FileInput } from '../components/inputs';

export const MainActions: Component<{ class?: string }> = (props) => {
  const { setFile, runGenerator, isProcessing, download, isDownloading } = useAppViewModel();

  return (
    <div class={clsx(windi`flex flex-col w-full items-stretch`, props.class)}>
      <button class="p-4" onClick={() => runGenerator()} disabled={isProcessing() || isDownloading()}>
        アニメーション再生成
      </button>
      <div class="flex flex-row w-full border-t">
        <FileInput id="image-file-input" accept="image/*" onInputFile={setFile} class="flex-1 border-none" />
        <button class="flex-1 py-4 border-l" onClick={() => download()} disabled={isDownloading() || isProcessing()}>
          ダウンロード
        </button>
      </div>
    </div>
  );
};
