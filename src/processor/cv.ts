import { CalcContourEventPayload, FinishCalcContourEventPayload, FinishInitOpenCVEventPayload, Vector2D } from './types';

class WorkerCommunicator {
  _cvWorker: Worker;
  _frameRendererWorker: Worker;
  _readyPromise: Promise<void>;
  
  constructor() {
    this._cvWorker = new Worker(new URL('./worker/calcContour.ts', import.meta.url), {
      type: 'classic'
    });
    this._frameRendererWorker = new Worker(new URL('./worker/index.ts', import.meta.url), {
      type: 'module'
    });
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

  async calcContour(threshold = 210, onlyExternal = false): Promise<Vector2D[][]> {
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
        threshold,
        onlyExternal,
      };
      this._cvWorker.postMessage(payload);
    });
  }
}

export const workerCommunicator = new WorkerCommunicator;