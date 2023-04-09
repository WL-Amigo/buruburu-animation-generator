import * as Comlink from 'comlink';

export class FeatureCheckerWorker {
  public async checkFeatureAvailability(): Promise<boolean> {
    try {
      await this.checkOffscreenCanvasInWorker();

      return true;
    } catch (_) {
      return false;
    }
  }

  private async checkOffscreenCanvasInWorker() {
    const c = new OffscreenCanvas(1, 1);
    c.getContext('2d')!.clearRect(0, 0, 1, 1);
  }
}
Comlink.expose(FeatureCheckerWorker);
