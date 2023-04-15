import { Component, ParentProps } from 'solid-js';
import { RequiredFeatureCheckGuard } from './featureChecker';
import { ConsentPrecautionStatusGuard } from './precautionConsent';

export const Bootstrap: Component<ParentProps<{}>> = (props) => {
  return (
    <RequiredFeatureCheckGuard>
      <ConsentPrecautionStatusGuard>{props.children}</ConsentPrecautionStatusGuard>
    </RequiredFeatureCheckGuard>
  );
};
