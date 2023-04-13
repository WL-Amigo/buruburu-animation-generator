import { Component, ComponentProps, ParentProps, Show, createEffect, createSignal, onCleanup } from 'solid-js';
import { useFloating } from 'solid-floating-ui';
import { flip, offset, shift, autoUpdate } from '@floating-ui/dom';
import { Dynamic, Portal } from 'solid-js/web';
import { Transition } from 'solid-transition-group';
import { windi } from '../windi';
import { IconHelp } from './icons';
import clsx from 'clsx';

interface TooltipProps {
  anchorEl: HTMLElement | null;
  open: boolean;
}
export const Tooltip: Component<ParentProps<TooltipProps>> = (props) => {
  const [floatingEl, setFloatingEl] = createSignal<HTMLDivElement | null>(null);
  const position = useFloating(() => props.anchorEl, floatingEl, {
    whileElementsMounted: autoUpdate,
    placement: 'top',
    middleware: [offset(4), shift(), flip()],
  });

  return (
    <Portal mount={document.getElementById('tooltip')!}>
      <Transition
        enterClass={windi`scale-0`}
        enterToClass={windi`scale-100`}
        exitClass={windi`scale-100`}
        exitToClass={windi`scale-0`}
      >
        <Show when={props.open}>
          <div
            ref={setFloatingEl}
            class="p-1 bg-black/75 rounded text-white transform origin-bottom transition-transform duration-100"
            style={{
              position: position.strategy,
              top: `${position.y ?? 0}px`,
              left: `${position.x ?? 0}px`,
            }}
          >
            {props.children}
          </div>
        </Show>
      </Transition>
    </Portal>
  );
};

const createTooltipViewModel = () => {
  const [anchorEl, setAnchorEl] = createSignal<HTMLElement | null>(null);
  const [isHovered, setIsHovered] = createSignal(false);

  createEffect(() => {
    const currentAnchorEl = anchorEl();
    if (currentAnchorEl === null) {
      return;
    }
    // if scroll is occurred, close tooltip
    const scrollHandler = () => {
      setIsHovered(false);
    };
    const watchingEls: HTMLElement[] = [];
    let currentEl: HTMLElement | null = currentAnchorEl;
    while (currentEl !== null) {
      watchingEls.push(currentEl);
      currentEl.addEventListener('scroll', scrollHandler);
      currentEl = currentEl.parentElement;
    }
    onCleanup(() => {
      for (const el of watchingEls) {
        el.removeEventListener('scroll', scrollHandler);
      }
    });
  });

  return {
    anchorEl,
    setAnchorEl,
    isTooltipOpen: isHovered,
    onMouseEnterToAnchor: () => setIsHovered(true),
    onMouseLeaveFromAnchor: () => setIsHovered(false),
  };
};

interface IconTooltipProps {
  iconComponent: Component<ComponentProps<'svg'>>;
  iconClass?: string;
}
export const IconTooltip: Component<ParentProps<IconTooltipProps>> = (props) => {
  const { anchorEl, setAnchorEl, isTooltipOpen, onMouseEnterToAnchor, onMouseLeaveFromAnchor } =
    createTooltipViewModel();

  return (
    <>
      <Dynamic
        component={props.iconComponent}
        class={clsx(windi`text-gray-600 hover:text-gray-800 w-6 h-6 flex-shrink-0`, props.iconClass)}
        ref={setAnchorEl}
        onMouseEnter={onMouseEnterToAnchor}
        onMouseLeave={onMouseLeaveFromAnchor}
      />
      <Tooltip anchorEl={anchorEl()} open={isTooltipOpen()}>
        {props.children}
      </Tooltip>
    </>
  );
};

export const HelpTooltip: Component<ParentProps<{}>> = (props) => {
  const { anchorEl, setAnchorEl, isTooltipOpen, onMouseEnterToAnchor, onMouseLeaveFromAnchor } =
    createTooltipViewModel();

  return (
    <>
      <IconHelp
        class="text-gray-600 hover:text-gray-800 w-6 h-6 flex-shrink-0"
        ref={setAnchorEl}
        onMouseEnter={onMouseEnterToAnchor}
        onMouseLeave={onMouseLeaveFromAnchor}
      />
      <Tooltip anchorEl={anchorEl()} open={isTooltipOpen()}>
        {props.children}
      </Tooltip>
    </>
  );
};
