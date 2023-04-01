import { GIFEncoder, WriteFrameOpts } from 'gifenc';
import { AnimationEncoderParameters } from '../../../models';
import { PnnLABQuant } from './pnnQuant';
import { getOffscreenContext2D } from '../../../utils';

export const encodeAnimatedGif = (srcList: ImageData[], parameters: AnimationEncoderParameters): ArrayBuffer => {
  // generate global palette
  const firstFrame = srcList[0]!;
  const width = firstFrame.width;
  const height = firstFrame.height;
  const copySrcCanvas = new OffscreenCanvas(width, height);
  const canvas = new OffscreenCanvas(width, height);
  const canvasCtx = getOffscreenContext2D(canvas);
  canvasCtx.fillStyle = parameters.backgroundColor;
  canvasCtx.fillRect(0, 0, width, height);
  getOffscreenContext2D(copySrcCanvas).putImageData(firstFrame, 0, 0);
  canvasCtx.drawImage(copySrcCanvas, 0, 0);
  const pnnQuant = new PnnLABQuant({
    colors: 256,
    dithering: true,
    alphaThreshold: 0,
    pixels: new Uint32Array(canvasCtx.getImageData(0, 0, width, height).data.buffer),
    width: firstFrame.width,
    height: firstFrame.height,
  });
  pnnQuant.quantizeImage();
  const paletteRaw = new Uint8Array(pnnQuant.getPalette());
  const paletteLength = paletteRaw.length / 4;
  const palette = [...Array(paletteLength)].map((_, i) => {
    const baseIndex = i * 4;
    return [paletteRaw[baseIndex], paletteRaw[baseIndex + 1], paletteRaw[baseIndex + 2]];
  });

  // write frames
  const gifEncoder = GIFEncoder();
  let isFirst = true;
  for (const src of srcList) {
    canvasCtx.fillRect(0, 0, width, height);
    getOffscreenContext2D(copySrcCanvas).putImageData(src, 0, 0);
    canvasCtx.drawImage(copySrcCanvas, 0, 0);
    const indexed = pnnQuant.quantize_image(
      new Uint32Array(canvasCtx.getImageData(0, 0, width, height).data.buffer),
      256,
      width,
      height,
      true
    );
    // TODO: メモリ消費抑制モードを付けるか、pnnQuant 自体の最適化をおこなう
    // pnnQuant.disposeTemporallyStates();
    let opts: WriteFrameOpts = {
      delay: Math.floor(1000 / parameters.fps),
    };
    if (isFirst) {
      opts = {
        ...opts,
        palette,
        first: true,
      };
    }
    gifEncoder.writeFrame(indexed, width, height, opts);
    isFirst = false;
  }

  gifEncoder.finish();
  pnnQuant.disposeTemporallyStates();

  return gifEncoder.bytes().buffer;
};
