import { Component, Show } from 'solid-js';
import { useAppViewModel } from './viewModels';
import { AnimationPreview } from './components/AnimationPreview';
import { MainActions, BasicConfig } from './views';

const App: Component = () => {
  const { imageDataList, parameters, isProcessing, isDownloading } = useAppViewModel();

  return (
    <div class="flex flex-col lg:flex-row w-full h-full overflow-hidden">
      <div class="flex-[3] lg:flex-[8] <lg:border-b lg:border-r overflow-hidden flex flex-col justify-center items-center">
        <Show when={imageDataList().length > 0}>
          <AnimationPreview
            frames={imageDataList()}
            animationEncoderParameters={parameters}
            shouldStop={isProcessing() || isDownloading()}
          />
        </Show>
      </div>
      <div class="flex-[4] flex flex-col justify-center items-center overflow-y-hidden">
        <BasicConfig class="flex-1" />
        <MainActions class="border-t" />
      </div>
    </div>
  );
};

export default App;
