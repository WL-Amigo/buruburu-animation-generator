import { Accessor, Component, createEffect, createSignal, onCleanup } from 'solid-js';
import { useAppViewModel } from '../../viewModels';
import { ActionButton } from '../../components/Button';
import { IconShare } from '../../components/icons';
import { HowToShareDialog } from './HowToShareDialog';
import clsx from 'clsx';
import { windi } from '../../windi';
import { checkWebShareAvailability, useShareInfo } from './compositions';

declare global {
  interface Navigator {
    userAgentData:
      | {
          mobile: boolean;
        }
      | undefined;
  }
}

const useMaybeUserEnvPc = (): Accessor<boolean> => {
  // determine by user-agent client hints
  const isMobile = navigator.userAgentData?.mobile;

  // determine by viewport width
  const [isMediaQueryMatch, setIsMediaQueryMatch] = createSignal(false);
  const mediaQuery = window.matchMedia('(min-width: 1024px)');
  createEffect(() => {
    const handler = (ev: MediaQueryListEvent) => {
      setIsMediaQueryMatch(ev.matches);
    };
    mediaQuery.addEventListener('change', handler);
    onCleanup(() => mediaQuery.removeEventListener('change', handler));
  });

  const accessor = () => {
    return isMobile !== undefined ? !isMobile : isMediaQueryMatch();
  };
  return accessor;
};

export const ShareActionButton: Component<{ class?: string }> = (props) => {
  const canUseWebShare = checkWebShareAvailability();
  const maybeUserEnvPc = useMaybeUserEnvPc();
  const shareInfo = useShareInfo();
  const { getAnimationFile, isDownloading, hasFile, isProcessing } = useAppViewModel();
  const [isOpenDialog, setIsOpenDialog] = createSignal(false);

  const onClickActionButton = () => {
    if (canUseWebShare && !maybeUserEnvPc()) {
      getAnimationFile().then((f) => {
        if (f === null) {
          return;
        }

        navigator.share({ text: shareInfo().shareText, files: [f] });
      });
    } else {
      setIsOpenDialog(true);
    }
  };

  return (
    <>
      <ActionButton
        class={clsx(windi`border-l flex-shrink-0 w-12`, props.class)}
        onClick={onClickActionButton}
        disabled={!hasFile() || isDownloading() || isProcessing()}
      >
        <IconShare />
      </ActionButton>
      <HowToShareDialog open={isOpenDialog()} onClose={() => setIsOpenDialog(false)} />
    </>
  );
};
