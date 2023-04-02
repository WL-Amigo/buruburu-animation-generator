import { Component, ParentProps, createContext, useContext } from 'solid-js';
import { GeneratorViewModel, createGeneratorViewModel } from './generator';
import { ParametersViewModel, createGeneratorParametersStore } from './parameters';
import { createDefaultGeneratorParameters } from '../models';

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
  isDownloading: () => false,
  download: () => Promise.resolve(),
} satisfies AppViewModel);

export const createAppViewModel = (): AppViewModel => {
  const parametersVm = createGeneratorParametersStore();
  const generatorVm = createGeneratorViewModel(parametersVm.parameters);

  return {
    ...parametersVm,
    ...generatorVm,
  };
};

export const AppViewModelContextProvider: Component<ParentProps> = (props) => {
  const vm = createAppViewModel();
  return <AppViewModelContext.Provider value={vm}>{props.children}</AppViewModelContext.Provider>;
};

export const useAppViewModel = (): AppViewModel => useContext(AppViewModelContext);
