import type { Vector2D } from '../types';
import { testWiggler } from './wiggler';

const loadImage = async (contours: Vector2D[][]) => {
  const imgBitmap = (await createImageBitmap(await fetch('/test.png').then(r => r.blob())));
  const offscreenCanvas = new OffscreenCanvas(imgBitmap.width, imgBitmap.height);
  const ctx = offscreenCanvas.getContext('2d') as OffscreenCanvasRenderingContext2D;
  ctx.drawImage(imgBitmap, 0, 0);
  
  const imgData = ctx.getImageData(0,0,imgBitmap.width, imgBitmap.height);

  const wiggledImageData = testWiggler(imgData, contours);
  self.postMessage({type: 'loadFinished', imgData: wiggledImageData});
  console.log('loadImage: finished')

  imgBitmap.close();
}

self.addEventListener('message', (ev) => {
  const payload = ev.data;
  if(payload.type === 'loadImage') {
    loadImage(payload.contours);
  }
});

