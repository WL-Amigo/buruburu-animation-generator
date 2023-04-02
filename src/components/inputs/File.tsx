import clsx from 'clsx';
import { Component } from 'solid-js';
import type { JSX } from 'solid-js/jsx-runtime';
import { windi } from '../../windi';

interface Props {
  accept: string;
  id: string;
  onInputFile: (file: File) => void;
  icon?: JSX.Element;
  class?: string;
}
export const FileInput: Component<Props> = (props) => {
  return (
    <div class={clsx(windi`relative group`, props.class)}>
      <label
        for={props.id}
        class="w-full h-full flex flex-col items-center gap-y-2 p-4 group-hover:bg-blue-50 cursor-pointer"
      >
        {props.icon}
        <span>画像ファイルを選択</span>
      </label>
      <input
        type="file"
        accept={props.accept}
        id={props.id}
        class="opacity-0 absolute inset-0 cursor-pointer"
        onChange={(ev) => {
          const file = ev.currentTarget.files?.item(0);
          file && props.onInputFile(file);
        }}
      />
    </div>
  );
};
