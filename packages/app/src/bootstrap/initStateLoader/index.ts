import { Accessor, createSignal, onMount } from 'solid-js';
import { GeneratorParameters, getLastUsedGeneratorParameters } from '../../models';

export interface InitStates {
  generatorParameters: GeneratorParameters;
}
export const createInitStateLoader = (): Accessor<InitStates | null> => {
  const [initState, setInitState] = createSignal<InitStates | null>(null);
  onMount(() => {
    (async () => {
      const [lastUsedGeneratorParameters] = await Promise.all([getLastUsedGeneratorParameters()]);

      setInitState({
        generatorParameters: lastUsedGeneratorParameters,
      });
    })();
  });

  return initState;
};
