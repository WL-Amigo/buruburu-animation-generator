import { Component, Show } from 'solid-js';
import { useAppViewModel } from './viewModels';
import { AnimationPreview } from './components/AnimationPreview';
import { MainActions, BasicConfig } from './views';
import { createFileDragAndDropHandlers } from './compositions/fileDnd';
import { IconImageAdd } from './components/icons';
import clsx from 'clsx';
import { windi } from './windi';
import { Loading } from './components/Loading';

const App: Component = () => {
  const { imageDataList, parameters, setFile, isProcessing, isDownloading } = useAppViewModel();
  const { inDropArea, onDragEnter, onDragLeave, onDragOver, onDrop } = createFileDragAndDropHandlers((file) =>
    setFile(file)
  );

  return (
    <div class="flex flex-col lg:flex-row w-full h-full overflow-hidden">
      <div
        class="flex-[3] lg:flex-[8] <lg:border-b lg:border-r relative overflow-hidden flex flex-col justify-center items-center"
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <Show when={imageDataList().length > 0}>
          <AnimationPreview
            frames={imageDataList()}
            animationEncoderParameters={parameters}
            shouldStop={isProcessing() || isDownloading()}
          />
        </Show>
        <Loading
          class="absolute bottom-0 left-0 right-0 w-full bg-white/75 py-8"
          isLoading={isProcessing()}
          text="フレーム生成中…"
        />
        <Loading
          class="absolute bottom-0 left-0 right-0 w-full bg-white/75 py-8"
          isLoading={isDownloading()}
          text="ファイル書き出し中…"
        />
        <div
          class={clsx(
            windi`absolute inset-0 flex-col justify-center items-center bg-primary-500/10 pointer-events-none`,
            inDropArea() ? windi`flex` : windi`hidden`
          )}
        >
          <div class="bg-white/90 rounded p-4 flex flex-col gap-y-4 items-center">
            <IconImageAdd class="w-24 h-24" />
            <span>ドロップして画像を読み込み</span>
          </div>
        </div>
      </div>
      <div class="flex-[4] flex flex-col justify-center items-center overflow-y-hidden">
        <BasicConfig class="flex-1" />
        <MainActions class="border-t" />
      </div>
    </div>
  );
};

export default App;
