import { CalcContourEventPayload, FinishCalcContourEventPayload, FinishInitOpenCVEventPayload, Vector2D } from './types';
import type {FrameRenderer as FrameRendererWorkerClass} from './worker/wiggler';
import * as Comlink from 'comlink';
import { ContourGetterParameters, FrameRendererParameters } from '../models';

const FrameRenderer = Comlink.wrap<typeof FrameRendererWorkerClass>(new Worker(new URL('./worker/index.ts', import.meta.url), {
  type: 'module'
}));

class WorkerCommunicator {
  _cvWorker: Worker;
  _frameRendererWorker: Promise<Comlink.Remote<FrameRendererWorkerClass>>;
  _readyPromise: Promise<void>;
  
  constructor() {
    this._cvWorker = new Worker(new URL('./worker/calcContour.ts', import.meta.url), {
      type: 'classic'
    });
    this._frameRendererWorker = new FrameRenderer();
    this._readyPromise = new Promise((res) => {
      const listener = (ev: MessageEvent) => {
        const payload: FinishInitOpenCVEventPayload = ev.data;
        if(payload.type === 'finishInitOpenCV') {
          console.log('OpenCV worker ready');
          res();
          this._cvWorker.removeEventListener('message', listener);
        }
      }
      this._cvWorker.addEventListener('message', listener)
    })
  }

  async loadImage(): Promise<ImageData> {
    throw new Error();
    // await this._readyPromise;

    // return new Promise<ImageData>((res) => {
    //   const listener = (ev: MessageEvent) => {
    //     const payload = ev.data;
    //     if(payload.type === 'loadFinished' && payload.imgData instanceof ImageData) {
    //       res(payload.imgData);
    //       this._cvWorker.removeEventListener('message',listener);
    //     }
    //   };
    //   this._cvWorker.addEventListener('message', listener);
    //   this._cvWorker.postMessage({type:'loadImage'});
    // });
  }

  async calcContour(src: ImageBitmap, parameters: ContourGetterParameters): Promise<Vector2D[][]> {
    await this._readyPromise;

    return new Promise<Vector2D[][]>((res) => {
      const listener = (ev: MessageEvent) => {
        const payload: FinishCalcContourEventPayload = ev.data;
        if(payload.type === 'finishCalcContours') {
          res(payload.contours);
          this._cvWorker.removeEventListener('message',listener);
          return;
        }
      }
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

  async renderFrames(src: ImageBitmap, contours: Vector2D[][], parameters: FrameRendererParameters): Promise<ImageData[]> {
    const frameRenderer = await this._frameRendererWorker;
    return await frameRenderer.applyWiggle(src, contours, parameters);
  }
}

export const workerCommunicator = new WorkerCommunicator;