import { Accessor, Component, Show, createEffect, createSignal, untrack } from 'solid-js';
import { ContourGetterParameters } from '../models';
import { workerCommunicator } from '../processor';
import clsx from 'clsx';
import { windi } from '../windi';
import { dequal } from 'dequal';

interface Props {
  imageBitmap: ImageBitmap;
  params: ContourGetterParameters;
  class?: string;
}

const createContourPreviewer = (
  imageBitmap: Accessor<ImageBitmap>,
  params: Accessor<ContourGetterParameters>,
  outputCanvas: Accessor<HTMLCanvasElement | null>
) => {
  const [isProcessing, setIsProcessing] = createSignal(false);
  const nextParamsContainer: { nextParams: ContourGetterParameters | null } = { nextParams: null };

  const run = async (params: ContourGetterParameters, imageBitmap: ImageBitmap, canvas: HTMLCanvasElement) => {
    setIsProcessing(true);
    try {
      const contours = await workerCommunicator.calcContour(imageBitmap, params);
      await workerCommunicator.previewContour(canvas, imageBitmap, contours, canvas.width, canvas.height);
    } catch (_) {
      setIsProcessing(false);
      nextParamsContainer.nextParams = null;
      return;
    }

    if (nextParamsContainer.nextParams !== null && !dequal(nextParamsContainer.nextParams, params)) {
      const np = nextParamsContainer.nextParams;
      nextParamsContainer.nextParams = null;
      run(np, imageBitmap, canvas);
      return;
    }

    setIsProcessing(false);
  };

  createEffect(() => {
    const isProcessingCurrent = untrack(isProcessing);
    const currentParams = params();
    const currentCanvas = outputCanvas();
    if (currentCanvas === null) {
      return;
    }
    if (isProcessingCurrent) {
      nextParamsContainer.nextParams = currentParams;
      return;
    }

    untrack(() => {
      run(currentParams, imageBitmap(), currentCanvas);
    });
  });

  return isProcessing;
};

export const ContourPreview: Component<Props> = (props) => {
  const [canvasEl, setCanvasEl] = createSignal<HTMLCanvasElement | null>(null);
  const isProcessing = createContourPreviewer(
    () => props.imageBitmap,
    () => props.params,
    canvasEl
  );

  createEffect(() => {
    const currentCanvasEl = canvasEl();
    const bitmap = props.imageBitmap;
    if (currentCanvasEl === null) {
      return;
    }
    currentCanvasEl.width = bitmap.width;
    currentCanvasEl.height = bitmap.height;
  });

  return (
    <div class={clsx(windi`relative`, props.class)}>
      <canvas ref={setCanvasEl} class="w-full h-full object-contain" />
      <Show when={isProcessing()}>
        <div class="absolute right-4 bottom-4 p-2 bg-white/75">計算中…</div>
      </Show>
    </div>
  );
};
