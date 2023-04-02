import { Accessor, createEffect, createSignal, untrack } from 'solid-js';
import { Store } from 'solid-js/store';
import {
  AnimationEncoderParameters,
  ContourGetterParameters,
  FrameRendererParameters,
  GeneratorParameters,
} from '../models';
import { workerCommunicator } from '../processor';
import { removeFileExtension } from '../utils/fileName';

export interface GeneratorViewModel {
  isProcessing: Accessor<boolean>;
  setFile: (file: File) => void;
  imageDataList: Accessor<ImageData[]>;
  runGenerator: () => Promise<void>;
  isDownloading: Accessor<boolean>;
  download: () => Promise<void>;
}

export const createGeneratorViewModel = (parameters: Store<GeneratorParameters>): GeneratorViewModel => {
  const [isProcessing, setIsProcessing] = createSignal(false);
  const [isDownloading, setIsDownloading] = createSignal(false);
  const [file, setFile] = createSignal<File | null>(null);
  const [imageDataList, setImageDataList] = createSignal<ImageData[]>([]);

  const runGenerator = async () => {
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

    if (currentFile === null) {
      return;
    }

    setIsProcessing(true);
    try {
      const bitmap = await createImageBitmap(currentFile);
      const t0 = performance.now();
      const contours = await workerCommunicator.calcContour(bitmap, contoursGetterParameters);
      const t1 = performance.now();
      console.log(`calcContour: ${(t1 - t0).toFixed(2)}ms`);
      const imageDataList = await workerCommunicator.renderFrames(bitmap, contours, frameRendererParameters);
      const t2 = performance.now();
      console.log(`renderFrames: ${(t2 - t1).toFixed(2)}ms`);
      setImageDataList(imageDataList);

      bitmap.close();
    } finally {
      setIsProcessing(false);
    }
  };

  createEffect(() => {
    file();
    untrack(() => {
      runGenerator();
    });
  });

  const download = async () => {
    const currentFile = file();
    const frames = imageDataList();
    if (currentFile === null || frames.length === 0) {
      return;
    }

    const animationEncoderParameters: AnimationEncoderParameters = {
      variationCount: parameters.variationCount,
      fps: parameters.fps,
      exportFileType: parameters.exportFileType,
      backgroundColor: parameters.backgroundColor,
    };
    setIsDownloading(true);
    try {
      const animationFileBlob = await workerCommunicator.encodeAnimation(frames, animationEncoderParameters);
      const blobUrl = URL.createObjectURL(animationFileBlob);
      const anchorEl = document.createElement('a');
      anchorEl.href = blobUrl;
      anchorEl.download = `${removeFileExtension(currentFile.name)}_buruburu.gif`;
      anchorEl.click();
      URL.revokeObjectURL(blobUrl);
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    isProcessing,
    setFile,
    imageDataList,
    runGenerator,
    isDownloading,
    download,
  };
};
