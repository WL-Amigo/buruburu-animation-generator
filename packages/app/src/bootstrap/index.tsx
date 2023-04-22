import { Component, JSX, Show } from 'solid-js';
import { RequiredFeatureCheckGuard } from './featureChecker';
import { ConsentPrecautionStatusGuard } from './precautionConsent';
import { InitStates, createInitStateLoader } from './initStateLoader';

export const Bootstrap: Component<{ children: (initStates: InitStates) => JSX.Element }> = (props) => {
  const initState = createInitStateLoader();

  return (
    <RequiredFeatureCheckGuard>
      <ConsentPrecautionStatusGuard>
        <Show when={initState()} keyed>
          {(initState) => props.children(initState)}
        </Show>
      </ConsentPrecautionStatusGuard>
    </RequiredFeatureCheckGuard>
  );
};
