import { Component, Show } from 'solid-js';
import { useAppViewModel } from '../viewModels';
import clsx from 'clsx';
import { windi } from '../windi';
import { FileInput } from '../components/inputs';
import { ActionButton } from '../components/Button';
import { IconTooltip } from '../components/Tooltip';
import { IconRefresh, IconSave } from '../components/icons';

export const MainActions: Component<{ class?: string }> = (props) => {
  const { setFile, hasFile, hasUnappliedParams, runGenerator, isProcessing, download, isDownloading } =
    useAppViewModel();

  return (
    <div class={clsx(windi`flex flex-col w-full items-stretch`, props.class)}>
      <ActionButton
        class="flex flex-row justify-center items-center gap-x-1"
        onClick={() => runGenerator()}
        disabled={!hasFile() || isProcessing() || isDownloading()}
      >
        <Show when={hasUnappliedParams()} fallback={<IconRefresh class="w-6 h-6 transform rotate-135" />}>
          <IconTooltip
            iconComponent={IconRefresh}
            iconClass={windi`w-6 h-6 transform rotate-135 text-yellow-500 hover:text-yellow-600`}
          >
            <p>
              アニメーションに反映されていないパラメータ変更があります。
              <br />
              このボタンを押すと反映されます。
            </p>
          </IconTooltip>
        </Show>
        <span>アニメーション再生成</span>
      </ActionButton>
      <div class="flex flex-row w-full border-t">
        <FileInput id="image-file-input" accept="image/*" onInputFile={setFile} class="flex-1 border-none" />
        <ActionButton
          class="flex-1 border-l flex flex-row justify-center items-center gap-x-1"
          onClick={() => download()}
          disabled={!hasFile() || isDownloading() || isProcessing()}
        >
          <IconSave />
          <span>ダウンロード</span>
        </ActionButton>
      </div>
    </div>
  );
};
