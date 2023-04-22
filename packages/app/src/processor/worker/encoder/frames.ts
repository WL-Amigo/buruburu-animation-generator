import { AnimationEncoderParameters } from '../../../models';
import * as zip from '@zip.js/zip.js';
import { getOffscreenContext2D } from '../../../utils';

export const createFramesZip = async (
  srcList: ImageData[],
  _parameters: AnimationEncoderParameters
): Promise<ArrayBuffer> => {
  const zipBufferWriter = new zip.Uint8ArrayWriter();
  const zipWriter = new zip.ZipWriter(zipBufferWriter);

  const firstFrame = srcList[0]!;
  const { width, height } = firstFrame;
  const copySrcCanvas = new OffscreenCanvas(width, height);
  const canvas = new OffscreenCanvas(width, height);
  const copyCtx = getOffscreenContext2D(copySrcCanvas);
  const ctx = getOffscreenContext2D(canvas);

  for (const srcIdx in srcList) {
    const src = srcList[srcIdx]!;
    copyCtx.putImageData(src, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(copySrcCanvas, 0, 0);
    zipWriter.add(`${srcIdx.padStart(2, '0')}.png`, new zip.BlobReader(await canvas.convertToBlob()));
  }

  return (await zipWriter.close()).buffer;
};
