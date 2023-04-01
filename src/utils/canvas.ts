export const getOffscreenContext2D = (canvas: OffscreenCanvas) => {
  return canvas.getContext('2d', { willReadFrequently: true }) as OffscreenCanvasRenderingContext2D;
};
