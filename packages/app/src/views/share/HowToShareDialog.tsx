import { Component, Show, createEffect, createSignal } from 'solid-js';
import { ModalBase } from '../../components/ModalBase';
import { IconClose, IconCopy, IconSave, IconShare, IconTwitter } from '../../components/icons';
import { useAppViewModel } from '../../viewModels';
import { Button, LinkButton } from '../../components/Button';
import { checkWebShareAvailability, useShareInfo } from './compositions';
import { windi } from '../../windi';

interface Props {
  open: boolean;
  onClose: () => void;
}
export const HowToShareDialog: Component<Props> = (props) => {
  const canUseWebShare = checkWebShareAvailability();
  const shareInfo = useShareInfo();
  const { getAnimationFile, download, isDownloading } = useAppViewModel();

  const [showShareTextCopyIsDone, setShowShareTextCopyIsDone] = createSignal(false);
  createEffect(() => {
    if (showShareTextCopyIsDone()) {
      setTimeout(() => setShowShareTextCopyIsDone(false), 2000);
    }
  });

  return (
    <ModalBase open={props.open} onClickAway={props.onClose}>
      <div
        class="relative w-full max-w-screen-lg max-h-screen-md overflow-y-hidden rounded bg-white p-2"
        onClick={(ev) => ev.stopPropagation()}
      >
        <div class="overflow-y-auto flex flex-col gap-y-4">
          <h1 class="pr-8 text-2xl text-center">アニメーションを SNS 等に投稿するには？</h1>
          <p>アニメーションファイルをダウンロードし、投稿に添付してください。</p>
          <div class="flex flex-row justify-center">
            <Button
              class="flex flex-row items-center gap-x-1"
              colorVariant="primary"
              onClick={download}
              disabled={isDownloading()}
            >
              <IconSave />
              <span>ダウンロード</span>
            </Button>
          </div>
          <p>
            ハッシュタグ「{shareInfo().hashTag}」と本ツールの URL も添えていただけると嬉しいです！
            <br />
            「他 SNS 投稿用テキストをコピーする」でハッシュタグと本ツールの URL
            をクリップボードにコピーできます。Mastodon や Misskey 等をお使いの場合に便利です。
          </p>
          <div class="flex flex-col gap-y-2 items-center lg:flex-row lg:justify-around">
            <LinkButton
              colorVariant="primary"
              class="items-center gap-x-1"
              href={`https://twitter.com/intent/tweet?hashtags=${encodeURIComponent(
                shareInfo().rawHashTag
              )}&url=${encodeURIComponent(shareInfo().toolUrl)}`}
            >
              <IconTwitter />
              <span>Twitter に投稿する</span>
            </LinkButton>
            <Button
              class="flex flex-row items-center gap-x-1"
              colorVariant="primary"
              onClick={() => {
                navigator.clipboard.writeText(shareInfo().shareText).then(() => setShowShareTextCopyIsDone(true));
              }}
            >
              <IconCopy />
              <div class="relative">
                <span class={showShareTextCopyIsDone() ? windi`opacity-0` : undefined}>
                  他 SNS 投稿用テキストをコピーする
                </span>
                <Show when={showShareTextCopyIsDone()}>
                  <div class="absolute inset-0 w-full flex flex-row justify-center">
                    <span>コピーしました！</span>
                  </div>
                </Show>
              </div>
            </Button>
          </div>
          <Show when={canUseWebShare}>
            <p>もしご利用の環境がスマホもしくはタブレットの場合は以下のボタンからシェア機能を使うこともできます。</p>
            <div class="flex flex-row justify-center">
              <Button
                class="flex flex-row items-center gap-x-1"
                colorVariant="primary"
                onClick={() => {
                  getAnimationFile().then((f) => {
                    if (f === null) {
                      return;
                    }
                    navigator.share({ text: shareInfo().shareText, files: [f] });
                  });
                }}
                disabled={isDownloading()}
              >
                <IconShare />
                <span>シェア</span>
              </Button>
            </div>
          </Show>
        </div>
        <div class="absolute top-0 right-0 w-10 h-10 flex flex-row justify-end">
          <button
            class="w-10 h-10 flex flex-row justify-center items-center opacity-50 hover:opacity-100 hover:bg-white/50"
            onClick={() => props.onClose()}
          >
            <IconClose />
          </button>
        </div>
      </div>
    </ModalBase>
  );
};
