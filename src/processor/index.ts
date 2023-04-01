import {
  CalcContourEventPayload,
  FinishCalcContourEventPayload,
  FinishInitOpenCVEventPayload,
  Vector2D,
} from './types';
import type { FrameRenderer as FrameRendererWorkerClass } from './worker/wiggler';
import * as Comlink from 'comlink';
import { AnimationEncoderParameters, ContourGetterParameters, FrameRendererParameters } from '../models';
import { AnimationEncoderWorker } from './worker/encoder';

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

class WorkerCommunicator {
  _cvWorker: Worker;
  _frameRendererWorker: Promise<Comlink.Remote<FrameRendererWorkerClass>>;
  _animationEncoder: Promise<Comlink.Remote<AnimationEncoderWorker>>;
  _readyPromise: Promise<void>;

  constructor() {
    this._cvWorker = new Worker(new URL('./worker/calcContour.ts', import.meta.url), {
      type: 'classic',
    });
    this._frameRendererWorker = new FrameRenderer();
    this._animationEncoder = new AnimationEncoder();
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
        bitmap: src,
      };
      this._cvWorker.postMessage(payload);
    });
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
      type: 'image/gif',
    });
  }
}

export const workerCommunicator = new WorkerCommunicator();
