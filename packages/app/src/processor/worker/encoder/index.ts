import * as Comlink from 'comlink';
import { AnimationEncoderParameters } from '../../../models';
import { encodeAnimatedGif } from './gif';
import { createFramesZip } from './frames';

export class AnimationEncoderWorker {
  public async encodeAnimation(srcList: ImageData[], parameters: AnimationEncoderParameters): Promise<ArrayBuffer> {
    switch (parameters.exportFileType) {
      case 'gif':
        return encodeAnimatedGif(srcList, parameters);
      case 'apng':
        // TODO: APNG 対応
        throw new Error('unimplemented');
      case 'frames':
        return await createFramesZip(srcList, parameters);
    }
  }
}
Comlink.expose(AnimationEncoderWorker);
