import { createSignal } from 'solid-js';

export const createFileDragAndDropHandlers = (onFileDrop: (file: File) => void) => {
  const [inDropArea, setIsInDropArea] = createSignal(false);
  const onDragEnter = (_ev: DragEvent) => {
    setIsInDropArea(true);
  };
  const onDragLeave = (_ev: DragEvent) => {
    setIsInDropArea(false);
  };
  const onDragOver = (ev: DragEvent) => {
    ev.preventDefault();
  };
  const onDrop = (ev: DragEvent) => {
    ev.preventDefault();
    setIsInDropArea(false);
    if (ev.dataTransfer?.items !== undefined) {
      const items = [...ev.dataTransfer.items];
      for (const item of items) {
        const maybeFile = item.kind === 'file' ? item.getAsFile() : null;
        if (maybeFile !== null && maybeFile.type.startsWith('image/')) {
          onFileDrop(maybeFile);
          return;
        }
      }
    }
  };

  return {
    inDropArea,
    onDragEnter,
    onDragLeave,
    onDragOver,
    onDrop,
  };
};
