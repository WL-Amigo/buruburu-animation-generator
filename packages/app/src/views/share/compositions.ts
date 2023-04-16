import { Accessor, createMemo } from 'solid-js';

export const checkWebShareAvailability = (): boolean => {
  if (!navigator.canShare) {
    return false;
  }
  if (!navigator.canShare({ files: [new File([], 'test.png', { type: 'image/png' })], text: 'test' })) {
    return false;
  }

  return true;
};

interface ShareInfo {
  rawHashTag: string;
  hashTag: string;
  toolUrl: string;
  shareText: string;
}
export const useShareInfo = (): Accessor<ShareInfo> => {
  const rawHashTag = 'ブルブルアニメジェネレータ';
  // TODO: replace proper production url
  const toolUrl = window.location.href;

  const shareInfoAccessor = createMemo(() => ({
    rawHashTag,
    hashTag: '#' + rawHashTag,
    toolUrl,
    shareText: `\n${toolUrl}\n#${rawHashTag}`,
  }));
  return shareInfoAccessor;
};
