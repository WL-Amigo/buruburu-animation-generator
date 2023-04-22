import { Component, For, Show } from 'solid-js';
import Licenses from 'virtual:licenses';
import type { License } from '@buruburu-animgen/vite-plugin-licenses/dist/index';
import { ModalBase } from '../components/ModalBase';
import { windi } from '../windi';
import clsx from 'clsx';
import { IconClose, IconGitHub, IconPackage } from '../components/icons';

const AllLicenses: readonly License[] = [
  ...Licenses,
  {
    name: 'OpenCV',
    url: 'https://github.com/opencv/opencv',
    license: 'Apache-2.0',
  },
].sort((a, b) => a.name.localeCompare(b.name));

export const LicensesDialog: Component<{ open: boolean; onClose: () => void }> = (props) => {
  return (
    <ModalBase open={props.open} onClickAway={props.onClose}>
      <div
        class="relative w-full max-w-screen-lg h-full lg:h-auto lg:max-h-screen-md overflow-y-auto rounded bg-white p-2"
        onClick={(ev) => ev.stopPropagation()}
      >
        <div class="sticky top-0 lg:hidden h-10 flex flex-row justify-end">
          <button
            class="w-10 h-10 flex flex-row justify-center items-center opacity-50 hover:opacity-100 hover:bg-white/50"
            onClick={() => props.onClose()}
          >
            <IconClose />
          </button>
        </div>
        <div class="pl-2 pb-4 pt-2 flex flex-col md:flex-row">
          <div class="text-xl">ブルブルアニメジェネレーター</div>
          <div class="md:pl-4">presented by WhiteLuckBringers</div>
          <a
            class="md:pl-4 flex flex-row gap-x-1 items-center text-primary-700 hover:text-primary-500"
            href="https://github.com/WL-Amigo/buruburu-animation-generator"
            rel="noopener"
            target="_blank"
          >
            <IconGitHub />
            <span>GitHub</span>
          </a>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          <For each={AllLicenses}>{(item) => <LicenseItemView item={item} />}</For>
        </div>
        <div class="pt-8">
          <span>本ツールのアイデア、及び画像加工に関するアルゴリズムは </span>
          <a
            class="underline text-primary-800 hover:text-primary-600"
            href="https://github.com/wwwshwww"
            target="_blank"
            rel="noopener"
          >
            wwwshwww
          </a>
          &nbsp;さん作 "
          <a
            class="underline text-primary-800 hover:text-primary-600"
            href="https://github.com/wwwshwww/tegaki_animation_generator"
            target="_blank"
            rel="noopener"
          >
            Tegaki Animation Generator
          </a>
          " より、連絡の上お借りすることをご快諾いただいたものです。ここに感謝及び御礼の意を示します。
        </div>
      </div>
    </ModalBase>
  );
};

const LicenseItemViewClasses = windi`flex flex-row gap-x-2`;

const LicenseItemView: Component<{ item: License }> = (props) => {
  return (
    <Show
      when={props.item.url !== ''}
      fallback={
        <div class={LicenseItemViewClasses}>
          <IconPackage />
          <span>{`${props.item.name} (${props.item.license})`}</span>
        </div>
      }
    >
      <a
        class={clsx(LicenseItemViewClasses, windi`underline hover:text-gray-600`)}
        href={props.item.url}
        target="_blank"
        rel="noopener"
      >
        <IconPackage />
        <span>{`${props.item.name} (${props.item.license})`}</span>
      </a>
    </Show>
  );
};
