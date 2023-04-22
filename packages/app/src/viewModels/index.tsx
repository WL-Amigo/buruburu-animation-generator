import { Component, ParentProps, createContext, useContext } from 'solid-js';
import { GeneratorViewModel, createGeneratorViewModel } from './generator';
import { ParametersViewModel, createGeneratorParametersStore } from './parameters';
import { createDefaultGeneratorParameters } from '../models';
import { InitStates } from '../bootstrap/initStateLoader';

const noop = () => {};

interface AppViewModel extends ParametersViewModel, GeneratorViewModel {}
const AppViewModelContext = createContext<AppViewModel>({
  parameters: createDefaultGeneratorParameters(),
  setParameters: noop,
  reset: noop,
  imageDataList: () => [],
  isProcessing: () => false,
  runGenerator: () => Promise.resolve(),
  setFile: noop,
  hasFile: () => false,
  hasUnappliedParams: () => false,
  imageBitmap: () => null,
  isDownloading: () => false,
  getAnimationFile: () => Promise.resolve(null),
  download: () => Promise.resolve(),
} satisfies AppViewModel);

export const createAppViewModel = (initStates: InitStates): AppViewModel => {
  const parametersVm = createGeneratorParametersStore(initStates.generatorParameters);
  const generatorVm = createGeneratorViewModel(parametersVm.parameters);

  return {
    ...parametersVm,
    ...generatorVm,
  };
};

export const AppViewModelContextProvider: Component<ParentProps<{ initStates: InitStates }>> = (props) => {
  // eslint-disable-next-line solid/reactivity
  const vm = createAppViewModel(props.initStates);
  return <AppViewModelContext.Provider value={vm}>{props.children}</AppViewModelContext.Provider>;
};

export const useAppViewModel = (): AppViewModel => useContext(AppViewModelContext);
