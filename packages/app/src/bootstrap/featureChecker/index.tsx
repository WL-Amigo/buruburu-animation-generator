import { Accessor, Component, Match, ParentProps, Switch, createSignal, onMount } from 'solid-js';
import * as Comlink from 'comlink';
import type { FeatureCheckerWorker } from './worker';
import { Loading } from '../../components/Loading';
import { IconWindowClose } from '../../components/icons';
import { ModalBase } from '../../components/ModalBase';
import { Button } from '../../components/Button';

const createIsRequiredFeatureAvailable = (): Accessor<boolean | null> => {
  const [isRequiredFeatureAvailable, setIsRequiredFeatureAvailable] = createSignal<boolean | null>(null);
  onMount(() => {
    (async () => {
      try {
        // checks ES modules web worker
        const featureCheckerWorkerInstance = new Worker(new URL('./worker.ts', import.meta.url), {
          type: 'module',
        });
        const onWorkerError = () => {
          setIsRequiredFeatureAvailable(false);
          featureCheckerWorkerInstance.removeEventListener('error', onWorkerError);
        };
        featureCheckerWorkerInstance.addEventListener('error', onWorkerError);

        const FeatureChecker = Comlink.wrap<typeof FeatureCheckerWorker>(featureCheckerWorkerInstance);
        const featureChecker = await new FeatureChecker();
        setIsRequiredFeatureAvailable(await featureChecker.checkFeatureAvailability());
      } catch (_) {
        setIsRequiredFeatureAvailable(false);
      }
    })();
  });

  return isRequiredFeatureAvailable;
};

export const RequiredFeatureCheckGuard: Component<ParentProps<{}>> = (props) => {
  const isRequiredFeatureAvailable = createIsRequiredFeatureAvailable();

  return (
    <Switch>
      <Match when={isRequiredFeatureAvailable() === null}>
        <Loading class="w-full h-full justify-center" isLoading />
      </Match>
      <Match when={isRequiredFeatureAvailable() === false}>
        <RequiredFeatureDescription />
      </Match>
      <Match when={isRequiredFeatureAvailable() === true}>{props.children}</Match>
    </Switch>
  );
};

const RequiredFeatureDescription: Component = () => (
  <div class="h-full w-full p-8 flex flex-col justify-center items-center">
    <IconWindowClose class="w-24 h-24 text-gray-500" />
    <div class="pt-2 text-xl">お使いのブラウザではブルブルアニメジェネレータをご利用いただけません。</div>
    <div class="pt-6">本アプリの動作には以下の機能がサポートされている必要があります。</div>
    <ul class="list-disc">
      <li>
        <a
          class="underline hover:text-gray-800"
          href="https://developer.mozilla.org/ja/docs/Web/API/Worker/Worker#%E3%83%96%E3%83%A9%E3%82%A6%E3%82%B6%E3%83%BC%E3%81%AE%E4%BA%92%E6%8F%9B%E6%80%A7"
          target="_blank"
          rel="noopener noreferrer"
        >
          Web Worker での ES Modules の利用
        </a>
      </li>
      <li>
        <a
          class="underline hover:text-gray-800"
          href="https://developer.mozilla.org/ja/docs/Web/API/OffscreenCanvas#browser_compatibility"
          target="_blank"
          rel="noopener noreferrer"
        >
          OffscreenCanvas
        </a>
      </li>
    </ul>
    <div class="pt-4">動作確認済みブラウザ</div>
    <ul class="list-disc pb-4">
      <li>PC 版 Chrome 110</li>
      <li>Android 版 Chrome 112</li>
    </ul>
    <InfoForFirefoxPcUser />
  </div>
);

const InfoForFirefoxPcUser: Component = () => {
  const [isOpen, setIsOpen] = createSignal(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>PC 版 Firefox をお使いの場合</Button>
      <ModalBase open={isOpen()} onClickAway={() => setIsOpen(false)}>
        <div class="p-4 rounded bg-white max-w-screen-md space-y-2" onClick={(ev) => ev.stopPropagation()}>
          <div>Firefox 111 以降をご利用であれば、以下の手順で本アプリの動作に必要な機能が使えるようになります。</div>
          <ol class="list-decimal list-inside">
            <li>about:config を URL 欄に打ち込んで開く (セキュリティの観点よりリンクは提供していません)</li>
            <li>警告文をお読みいただき「危険性を承知の上で使用する」をクリックして進む</li>
            <li>dom.workers.modules.enabled を true に切り替える</li>
          </ol>
          <div>
            本設定は「Web Worker での ES Modules の利用」をできるようにするもので、Firefox
            以外のブラウザでは一般提供されている機能ですが、自己責任の上で設定変更をお願いいたします。
          </div>
          <div>Android 版 Firefox は現時点では上記機能のサポートがないためご利用いただけません。</div>
        </div>
      </ModalBase>
    </>
  );
};
