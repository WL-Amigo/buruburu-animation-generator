import clsx from 'clsx';
import { Component, Show } from 'solid-js';
import { windi } from '../windi';
import { SquareSpinner } from './spinner';
import { Transition } from 'solid-transition-group';

interface Props {
  isLoading: boolean;
  text?: string;
  class?: string;
}
export const Loading: Component<Props> = (props) => {
  return (
    <Transition
      enterClass={windi`opacity-0`}
      enterToClass={windi`opacity-100`}
      exitClass={windi`opacity-100`}
      exitToClass={windi`opacity-0`}
    >
      <Show when={props.isLoading}>
        <div class={clsx(windi`transition-opacity duration-200 flex flex-col gap-y-4 items-center`, props.class)}>
          <SquareSpinner />
          <Show when={props.text} keyed>
            {(text) => <span>{text}</span>}
          </Show>
        </div>
      </Show>
    </Transition>
  );
};
