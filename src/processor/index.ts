import {
  CalcContourEventPayload,
  FinishCalcContourEventPayload,
  FinishInitOpenCVEventPayload,
  Vector2D,
} from './types';
import type { FrameRenderer as FrameRendererWorkerClass } from './worker/wiggler';
import * as Comlink from 'comlink';
import {
  AnimationEncoderParameters,
  ContourGetterParameters,
  FrameRendererParameters,
  getMimeTypeFromExportFileType,
} from '../models';
import { AnimationEncoderWorker } from './worker/encoder';
import { PreviewContourWorker } from './worker/previewContour';
import { getOffscreenContext2D } from '../utils';

const FrameRenderer = Comlink.wrap<typeof FrameRendererWorkerClass>(
  new Worker(new URL('./worker/wiggler.ts', import.meta.url), {
    type: 'module',
  })
);
const AnimationEncoder = Comlink.wrap<typeof AnimationEncoderWorker>(
  new Worker(new URL('./worker/encoder/index.ts', import.meta.url), {
    type: 'module',
  })
);
const PreviewContour = Comlink.wrap<typeof PreviewContourWorker>(
  new Worker(new URL('./worker/previewContour.ts', import.meta.url), {
    type: 'module',
  })
);

class WorkerCommunicator {
  private readonly _cvWorker: Worker;
  private readonly _frameRendererWorker: Promise<Comlink.Remote<FrameRendererWorkerClass>>;
  private readonly _animationEncoder: Promise<Comlink.Remote<AnimationEncoderWorker>>;
  private readonly _previewContour: Promise<Comlink.Remote<PreviewContourWorker>>;
  private readonly _readyPromise: Promise<void>;

  constructor() {
    this._cvWorker = new Worker(new URL('./worker/calcContour.ts', import.meta.url), {
      type: 'classic',
    });
    this._frameRendererWorker = new FrameRenderer();
    this._animationEncoder = new AnimationEncoder();
    this._previewContour = new PreviewContour();
    this._readyPromise = new Promise((res) => {
      const listener = (ev: MessageEvent) => {
        const payload: FinishInitOpenCVEventPayload = ev.data;
        if (payload.type === 'finishInitOpenCV') {
          console.log('OpenCV worker ready');
          res();
          this._cvWorker.removeEventListener('message', listener);
        }
      };
      this._cvWorker.addEventListener('message', listener);
    });
  }

  public async calcContour(src: ImageBitmap, parameters: ContourGetterParameters): Promise<Vector2D[][]> {
    await this._readyPromise;

    return new Promise<Vector2D[][]>((res) => {
      const listener = (ev: MessageEvent) => {
        const payload: FinishCalcContourEventPayload = ev.data;
        if (payload.type === 'finishCalcContours') {
          res(payload.contours);
          this._cvWorker.removeEventListener('message', listener);
          return;
        }
      };
      this._cvWorker.addEventListener('message', listener);
      const payload: CalcContourEventPayload = {
        type: 'calcContours',
        threshold: parameters.threshold,
        onlyExternal: parameters.onlyExternal,
        contourExtractionBasis: parameters.contourExtractionBasis,
        bitmap: src,
      };
      this._cvWorker.postMessage(payload);
    });
  }

  public async previewContour(
    dest: HTMLCanvasElement,
    src: ImageBitmap,
    contours: Vector2D[][],
    width: number,
    height: number
  ) {
    const previewContour = await this._previewContour;
    const overlay = await previewContour.getContourLinesOverlay(contours, width, height);

    const baseCanvas = new OffscreenCanvas(width, height);
    const ctx = getOffscreenContext2D(baseCanvas);
    ctx.drawImage(src, 0, 0);
    ctx.fillStyle = '#FFFFFF80';
    ctx.fillRect(0, 0, width, height);
    const copyCanvas = new OffscreenCanvas(width, height);
    getOffscreenContext2D(copyCanvas).putImageData(overlay, 0, 0);
    ctx.drawImage(copyCanvas, 0, 0);

    dest.getContext('2d')?.putImageData(ctx.getImageData(0, 0, width, height), 0, 0);
  }

  public async renderFrames(
    src: ImageBitmap,
    contours: Vector2D[][],
    parameters: FrameRendererParameters
  ): Promise<ImageData[]> {
    const frameRenderer = await this._frameRendererWorker;
    return await frameRenderer.applyWiggle(src, contours, parameters);
  }

  public async encodeAnimation(srcList: ImageData[], parameters: AnimationEncoderParameters): Promise<Blob> {
    const animationEncoder = await this._animationEncoder;
    const buffer = await animationEncoder.encodeAnimation(srcList, parameters);
    return new Blob([buffer], {
      type: getMimeTypeFromExportFileType(parameters.exportFileType),
    });
  }
}

export const workerCommunicator = new WorkerCommunicator();
