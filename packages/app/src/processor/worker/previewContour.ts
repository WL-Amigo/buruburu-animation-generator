import * as Comlink from 'comlink';
import { Vector2D } from '../types';
import { getOffscreenContext2D } from '../../utils';

export class PreviewContourWorker {
  public async getContourLinesOverlay(contours: Vector2D[][], width: number, height: number): Promise<ImageData> {
    const canvas = new OffscreenCanvas(width, height);
    const ctx = getOffscreenContext2D(canvas);
    ctx.strokeStyle = '#3b82f6'; // blue-500
    ctx.lineWidth = 2;

    for (const contour of contours) {
      ctx.beginPath();
      ctx.moveTo(contour[0]![0], contour[0]![1]);
      for (const point of contour) {
        ctx.lineTo(point[0], point[1]);
      }
      ctx.stroke();
    }

    return ctx.getImageData(0, 0, width, height);
  }
}
Comlink.expose(PreviewContourWorker);
