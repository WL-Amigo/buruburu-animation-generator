import { createEffect, createSignal, onCleanup } from 'solid-js';
import { Store } from 'solid-js/store';
import {
  AnimationEncoderParameters,
  ContourGetterParameters,
  FrameRendererParameters,
  GeneratorParameters,
} from '../models';
import { workerCommunicator } from '../processor';

export const createGeneratorViewModel = (parameters: Store<GeneratorParameters>) => {
  const [isProcessing, setIsProcessing] = createSignal(false);
  const [file, setFile] = createSignal<File | null>(null);
  const [imageBlob, setImageBlob] = createSignal<Blob | null>(null);
  const [imageUrl, setImageUrl] = createSignal<string | null>(null);

  createEffect(() => {
    const currentImageBlob = imageBlob();
    if (currentImageBlob === null) {
      return;
    }

    const imageUrl = URL.createObjectURL(currentImageBlob);
    setImageUrl(imageUrl);
    onCleanup(() => URL.revokeObjectURL(imageUrl));
  });

  createEffect(() => {
    const currentFile = file();
    const contoursGetterParameters: ContourGetterParameters = {
      threshold: parameters.threshold,
      onlyExternal: parameters.onlyExternal,
    };
    const frameRendererParameters: FrameRendererParameters = {
      isStride: parameters.isStride,
      patchSize: parameters.patchSize,
      movableLength: parameters.movableLength,
      eps: parameters.eps,
      std: parameters.std,
      variationCount: parameters.variationCount,
    };
    const animationEncoderParameters: AnimationEncoderParameters = {
      variationCount: parameters.variationCount,
      fps: parameters.fps,
      exportFileType: parameters.exportFileType,
    };

    if (currentFile === null) {
      return;
    }

    (async () => {
      setIsProcessing(true);
      const bitmap = await createImageBitmap(currentFile);
      const contours = await workerCommunicator.calcContour(bitmap, contoursGetterParameters);
      const [imageData] = await workerCommunicator.renderFrames(bitmap, contours, {
        ...frameRendererParameters,
        variationCount: 1,
      });
      const canvas = document.createElement('canvas');
      canvas.width = imageData.width;
      canvas.height = imageData.height;
      const ctx = canvas.getContext('2d')!;
      ctx.putImageData(imageData, 0, 0);
      canvas.toBlob(setImageBlob, 'image/png');

      bitmap.close();
    })().finally(() => {
      setIsProcessing(false);
    });
  });

  return {
    isProcessing,
    setFile,
    imageUrl,
  };
};
