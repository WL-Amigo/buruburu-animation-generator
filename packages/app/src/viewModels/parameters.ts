import { SetStoreFunction, createStore } from 'solid-js/store';
import { GeneratorParameters, createDefaultGeneratorParameters } from '../models';

export interface ParametersViewModel {
  parameters: GeneratorParameters;
  setParameters: SetStoreFunction<GeneratorParameters>;
  reset: () => void;
}

export const createGeneratorParametersStore = (): ParametersViewModel => {
  const [parameters, setParameters] = createStore(createDefaultGeneratorParameters());
  const reset = () => {
    setParameters(createDefaultGeneratorParameters());
  };

  return {
    parameters,
    setParameters,
    reset,
  };
};
