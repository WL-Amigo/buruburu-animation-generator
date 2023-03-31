export const getOffscreenContext2D = (canvas: OffscreenCanvas) => {
  return canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;
}