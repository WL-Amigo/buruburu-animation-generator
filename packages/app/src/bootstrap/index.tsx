import { Component, ParentProps } from 'solid-js';
import { RequiredFeatureCheckGuard } from './featureChecker';

export const Bootstrap: Component<ParentProps<{}>> = (props) => {
  return <RequiredFeatureCheckGuard>{props.children}</RequiredFeatureCheckGuard>;
};
