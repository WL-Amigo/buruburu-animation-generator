export declare class PnnLABQuant {
  public constructor(opts: {
    colors: number;
    dithering: boolean;
    pixels: Uint32Array;
    alphaThreshold: number;
    width: number;
    height: number;
  });
  public quantize_image(
    pixels: Uint32Array,
    nMaxColors: number,
    width: number,
    height: number,
    dither: boolean
  ): Uint8Array;
  public quantizeImage(): any;
  public getPalette(): ArrayBuffer;
  public disposeTemporallyStates(): void;
}
