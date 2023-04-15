import { Component, Show } from 'solid-js';
import { ModalBase } from '../components/ModalBase';
import { Button } from '../components/Button';
import { setConsentStatus } from '../models/precautionConsent';
import { IconClose } from '../components/icons';

interface Props {
  open: boolean;
  onClose: () => void;
  showConsentButton: boolean;
}
export const PrecautionDialog: Component<Props> = (props) => {
  const onClickAway = () => {
    if (!props.showConsentButton) {
      props.onClose();
    }
  };
  const onClickConsentButton = () => {
    setConsentStatus(true);
    props.onClose();
  };

  return (
    <ModalBase open={props.open} onClickAway={onClickAway}>
      <div class="p-4 w-full max-w-screen-lg max-h-screen-md rounded bg-white">
        <h1 class="text-2xl text-center">「ブルブルアニメジェネレータ」利用上の注意</h1>
        <div class="py-8 space-y-4">
          <p>
            本ツールを使用して加工した画像に関する著作権等のあらゆる権利は、元の画像の権利者にあり、本ツールの作者及び共著者を含め権利が移転することはありません。
            権利の範囲内でお楽しみください。
          </p>
          <p>
            本ツールでの画像加工処理はすべてブラウザ内で実行され、外部ネットワークに画像データが送信されることはありません。
            この動作の都合上、スマートフォンなどの一部環境では、画像の加工・出力中にツールが異常停止するなど、正常に動作しない可能性があります。
          </p>
          <p>
            本ツールは MIT ライセンスにより公開されているオープンソースソフトウェアです。
            本ツールに関して発生したいかなる損害・その他の義務について、作者及び共著者は一切責任を負わないものとします。
          </p>
          <a class="block underline text-primary-800 hover:text-primary-600" href="#" target="_blank" rel="noopener">
            ライセンス本文
          </a>
        </div>
        <Show when={props.showConsentButton}>
          <div class="pb-8 flex flex-row justify-center">
            <Button colorVariant="primary" onClick={onClickConsentButton}>
              上記内容に同意して進める
            </Button>
          </div>
        </Show>
        <Show when={!props.showConsentButton}>
          <div class="pb-8 flex flex-row justify-center">
            <Button class="flex flex-row items-center gap-x-1" colorVariant="primary" onClick={props.onClose}>
              <IconClose />
              <span>閉じる</span>
            </Button>
          </div>
        </Show>
      </div>
    </ModalBase>
  );
};
