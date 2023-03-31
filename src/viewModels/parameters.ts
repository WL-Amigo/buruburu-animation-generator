import { createStore } from 'solid-js/store';
import { createDefaultGeneratorParameters } from '../models';

export const createGeneratorParametersStore = () => {
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
