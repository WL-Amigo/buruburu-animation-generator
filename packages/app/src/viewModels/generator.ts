import { Accessor, createEffect, createMemo, createSignal, onCleanup, untrack } from 'solid-js';
import { Store } from 'solid-js/store';
import {
  AnimationEncoderParameters,
  ContourGetterParameters,
  FrameRendererParameters,
  GeneratorParameters,
  getFileExtensionFromExportFileType,
  getMimeTypeFromExportFileType,
} from '../models';
import { workerCommunicator } from '../processor';
import { removeFileExtension } from '../utils/fileName';
import { dequal } from 'dequal';

export interface GeneratorViewModel {
  isProcessing: Accessor<boolean>;
  setFile: (file: File) => void;
  hasFile: Accessor<boolean>;
  hasUnappliedParams: Accessor<boolean>;
  imageBitmap: Accessor<ImageBitmap | null>;
  imageDataList: Accessor<ImageData[]>;
  runGenerator: () => Promise<void>;
  isDownloading: Accessor<boolean>;
  getAnimationFile: () => Promise<File | null>;
  download: () => Promise<void>;
}

export const createGeneratorViewModel = (parameters: Store<GeneratorParameters>): GeneratorViewModel => {
  const [isProcessing, setIsProcessing] = createSignal(false);
  const [isDownloading, setIsDownloading] = createSignal(false);
  const [file, setFile] = createSignal<File | null>(null);
  const [currentImageBitmap, setImageBitmap] = createSignal<ImageBitmap | null>(null);
  const [imageDataList, setImageDataList] = createSignal<ImageData[]>([]);
  const [lastUsedParams, setLastUsedParams] = createSignal<GeneratorParameters>({ ...parameters });
  const hasUnappliedParams = createMemo(() => {
    const lup = lastUsedParams();
    return !dequal(
      [
        parameters.threshold,
        parameters.onlyExternal,
        parameters.contourExtractionBasis,
        parameters.patchSize,
        parameters.movableLength,
        parameters.isStride,
        parameters.std,
        parameters.variationCount,
      ],
      [
        lup.threshold,
        lup.onlyExternal,
        lup.contourExtractionBasis,
        lup.patchSize,
        lup.movableLength,
        lup.isStride,
        lup.std,
        lup.variationCount,
      ]
    );
  });

  createEffect(() => {
    const currentFile = file();
    if (currentFile === null) {
      setImageBitmap(null);
      return;
    }
    createImageBitmap(currentFile).then((ib) => setImageBitmap(ib));
  });
  createEffect(() => {
    const bitmap = currentImageBitmap();
    if (bitmap === null) {
      return;
    }
    onCleanup(() => bitmap.close());
  });

  const runGenerator = async (bitmap: ImageBitmap) => {
    const contoursGetterParameters: ContourGetterParameters = {
      threshold: parameters.threshold,
      onlyExternal: parameters.onlyExternal,
      contourExtractionBasis: parameters.contourExtractionBasis,
    };
    const frameRendererParameters: FrameRendererParameters = {
      isStride: parameters.isStride,
      patchSize: parameters.patchSize,
      movableLength: parameters.movableLength,
      eps: parameters.eps,
      std: parameters.std,
      variationCount: parameters.variationCount,
    };

    setLastUsedParams({ ...parameters });
    setIsProcessing(true);
    try {
      const t0 = performance.now();
      const contours = await workerCommunicator.calcContour(bitmap, contoursGetterParameters);
      const t1 = performance.now();
      console.log(`calcContour: ${(t1 - t0).toFixed(2)}ms`);
      const imageDataList = await workerCommunicator.renderFrames(bitmap, contours, frameRendererParameters);
      const t2 = performance.now();
      console.log(`renderFrames: ${(t2 - t1).toFixed(2)}ms`);
      setImageDataList(imageDataList);
    } finally {
      setIsProcessing(false);
    }
  };

  createEffect(() => {
    const bitmap = currentImageBitmap();
    if (bitmap === null) {
      return;
    }
    untrack(() => {
      runGenerator(bitmap);
    });
  });

  const getAnimationFile = async (): Promise<File | null> => {
    const currentFile = file();
    const frames = imageDataList();
    if (currentFile === null || frames.length === 0) {
      return null;
    }

    const exportFileType = parameters.exportFileType;
    const animationEncoderParameters: AnimationEncoderParameters = {
      variationCount: parameters.variationCount,
      fps: parameters.fps,
      exportFileType,
      backgroundColor: parameters.backgroundColor,
    };

    setIsDownloading(true);
    try {
      const animationFileBlob = await workerCommunicator.encodeAnimation(frames, animationEncoderParameters);
      return new File(
        [animationFileBlob],
        `${removeFileExtension(currentFile.name)}_buruburu.${getFileExtensionFromExportFileType(exportFileType)}`,
        { type: getMimeTypeFromExportFileType(exportFileType) }
      );
    } catch (_) {
      return null;
    } finally {
      setIsDownloading(false);
    }
  };

  const download = async () => {
    const animationFile = await getAnimationFile();
    if (animationFile === null) {
      return;
    }
    const blobUrl = URL.createObjectURL(animationFile);
    const anchorEl = document.createElement('a');
    anchorEl.href = blobUrl;
    anchorEl.download = animationFile.name;
    anchorEl.click();
    URL.revokeObjectURL(blobUrl);
  };

  return {
    isProcessing,
    setFile,
    hasFile: () => file() !== null,
    hasUnappliedParams,
    imageBitmap: currentImageBitmap,
    imageDataList,
    runGenerator: async () => {
      const bitmap = currentImageBitmap();
      if (bitmap === null) {
        return;
      }
      await runGenerator(bitmap);
    },
    isDownloading,
    getAnimationFile,
    download,
  };
};
