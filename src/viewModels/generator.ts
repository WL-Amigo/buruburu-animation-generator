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
      setImageUrl(null);
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
      backgroundColor: parameters.backgroundColor,
    };

    if (currentFile === null) {
      return;
    }

    (async () => {
      setIsProcessing(true);
      const bitmap = await createImageBitmap(currentFile);
      const t0 = performance.now();
      const contours = await workerCommunicator.calcContour(bitmap, contoursGetterParameters);
      const t1 = performance.now();
      console.log(`calcContour: ${(t1 - t0).toFixed(2)}ms`);
      const imageDataList = await workerCommunicator.renderFrames(bitmap, contours, frameRendererParameters);
      const t2 = performance.now();
      console.log(`renderFrames: ${(t2 - t1).toFixed(2)}ms`);
      const animationFileBlob = await workerCommunicator.encodeAnimation(imageDataList, animationEncoderParameters);
      const t3 = performance.now();
      console.log(`encodeAnimation: ${(t3 - t2).toFixed(2)}ms`);

      setImageBlob(animationFileBlob);

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
