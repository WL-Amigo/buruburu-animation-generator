import { createGeneratorViewModel } from "./generator";
import { createGeneratorParametersStore } from "./parameters"

export const createAppViewModel = () => {
  const {
    parameters, setParameters, reset,
  } = createGeneratorParametersStore();
  const {
    isProcessing, setFile, imageUrl,
  } = createGeneratorViewModel(parameters);

  return {
    isProcessing,
    setFile,
    imageUrl,
    parameters,
    setParameters,
    reset,
  }
}