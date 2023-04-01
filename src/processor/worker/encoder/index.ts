import * as Comlink from 'comlink';
import { AnimationEncoderParameters } from '../../../models';
import { encodeAnimatedGif } from './gif';

export class AnimationEncoderWorker {
  public encodeAnimation(srcList: ImageData[], parameters: AnimationEncoderParameters): ArrayBuffer {
    switch (parameters.exportFileType) {
      case 'gif':
        return encodeAnimatedGif(srcList, parameters);
      case 'apng':
        // TODO: APNG 対応
        throw new Error('unimplemented');
    }
  }
}
Comlink.expose(AnimationEncoderWorker);
