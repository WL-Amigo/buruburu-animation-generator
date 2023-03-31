import { FrameRendererParameters } from '../../models';
import * as Comlink from 'comlink';

interface WigglerParams {
  leaves: number; // int
  threshold: number;
  eps: number;
  size: number; // int
  movableRange: number;
  std: number;
  isStride: boolean;
  onlyExternal: boolean;
}

type Vector2D = [number, number];

const getContext2D = (c: OffscreenCanvas) => c.getContext('2d') as OffscreenCanvasRenderingContext2D;

// from: https://mika-s.github.io/javascript/random/normal-distributed/2019/05/15/generating-normally-distributed-random-numbers-in-javascript.html
const getNormallyDistributedRandomNumber = (stddev: number): number => {
  const x = Math.random();
  const y = Math.random();
  const z0 = Math.sqrt(-2 * Math.log(x)) * Math.cos(2 * Math.PI * y);

  return z0 * stddev;
};

const createMask = (size: number): OffscreenCanvas => {
  // 円形マスク(バイナリ値)を作る
  const canvas = new OffscreenCanvas(size * 2 + 1, size * 2 + 1);
  const ctx = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;
  ctx.beginPath();
  ctx.arc(size, size, size, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();

  return canvas;
};

const calcNormalRadians = (contourPoints: Array<Vector2D>): number[] => {
  return contourPoints.map((v, i) => {
    const pv = contourPoints.at(i - 1)!;
    const sub = [v[0] - pv[0], v[1] - pv[1]];
    return Math.atan2(sub[1], sub[0]) + Math.PI / 2;
  });
};

const applyWiggle = (
  base: OffscreenCanvas,
  mask: OffscreenCanvas,
  contours: readonly Vector2D[][],
  normalRadiansForContours: readonly number[][],
  eps: number,
  movableLength: number,
  std: number,
  isStride: boolean
): OffscreenCanvas => {
  const size = Math.floor(mask.width / 2);
  const patchCanvas = new OffscreenCanvas(mask.width, mask.height);
  const outputCanvas = new OffscreenCanvas(base.width, base.height);
  getContext2D(outputCanvas).drawImage(base, 0, 0);

  for (const contourIdx in contours) {
    const contour = contours[contourIdx]!;
    const normalRadiansForContour = normalRadiansForContours[contourIdx]!;

    for (const iStr in contour) {
      const i = Number(iStr);
      if (isStride && i % mask.width !== 0) {
        continue;
      }
      const pos = contour[i]!;
      const normalRad = normalRadiansForContour[i]!;

      const distortLen = Math.max(Math.min(getNormallyDistributedRandomNumber(std), 1), -1) * movableLength;
      const distortedPos: Vector2D = [
        Math.round(pos[0] + distortLen * Math.cos(normalRad)),
        Math.round(pos[1] + distortLen * Math.sin(normalRad)),
      ];

      const patchCtx = getContext2D(patchCanvas);
      // TODO: 範囲外にはみ出している可能性があるのでやっぱりパッド入れ処理は必要
      patchCtx.clearRect(0, 0, mask.width, mask.height);
      patchCtx.drawImage(base, pos[0] - size, pos[1] - size, mask.width, mask.height, 0, 0, mask.width, mask.height);
      patchCtx.globalCompositeOperation = 'destination-in';
      patchCtx.drawImage(mask, 0, 0);
      patchCtx.globalCompositeOperation = 'source-over';

      const outputCtx = getContext2D(outputCanvas);
      outputCtx.drawImage(patchCanvas, distortedPos[0] - size, distortedPos[1] - size);
    }
  }

  return outputCanvas;
};

export const testWiggler = (src: ImageData, contours: Vector2D[][]) => {
  const baseCanvas = new OffscreenCanvas(src.width, src.height);
  getContext2D(baseCanvas).putImageData(src, 0, 0);
  const normalRadians = contours.map((c) => calcNormalRadians(c));
  const mask = createMask(4);

  const applied = applyWiggle(baseCanvas, mask, contours, normalRadians, 0.99, 4, 0.15, true);

  return getContext2D(applied).getImageData(0, 0, applied.width, applied.height);
};

export class FrameRenderer {
  public applyWiggle(src: ImageBitmap, contours: Vector2D[][], parameters: FrameRendererParameters): ImageData[] {
    const baseCanvas = new OffscreenCanvas(src.width, src.height);
    getContext2D(baseCanvas).drawImage(src, 0, 0);
    const normalRadians = contours.map((c) => calcNormalRadians(c));
    const mask = createMask(parameters.patchSize);

    const results: ImageData[] = [];

    for (let i = 0; i < parameters.variationCount; i++) {
      const appliedCanvas = applyWiggle(
        baseCanvas,
        mask,
        contours,
        normalRadians,
        parameters.eps,
        parameters.movableLength,
        parameters.std,
        parameters.isStride
      );
      results.push(getContext2D(appliedCanvas).getImageData(0, 0, appliedCanvas.width, appliedCanvas.height));
    }

    return results;
  }
}
Comlink.expose(FrameRenderer);
