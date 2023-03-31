import { Component, Show } from 'solid-js';
import { FileInput } from './components/inputs';
import { createAppViewModel } from './viewModels';

const App: Component = () => {
  const { setFile, isProcessing, imageUrl, reset, parameters, setParameters } = createAppViewModel();

  return (
    <div class="flex flex-col lg:flex-row w-full h-full overflow-hidden">
      <div class="flex-1 lg:flex-[2] <lg:border-b lg:border-r overflow-hidden flex flex-col justify-center items-center">
        <Show when={imageUrl()} keyed>
          {(imageUrl) => <img src={imageUrl} />}
        </Show>
      </div>
      <div class="flex-1 flex flex-col justify-center items-center">
        <FileInput id="image-file-input" accept="image/*" onInputFile={setFile} />
      </div>
    </div>
  );
};

export default App;
