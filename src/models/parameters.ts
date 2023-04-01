import { z } from 'zod';

export interface ContourGetterParameters {
  threshold: number;
  onlyExternal: boolean;
}

export interface FrameRendererParameters {
  isStride: boolean;
  patchSize: number;
  movableLength: number;
  eps: number;
  std: number;
  variationCount: number;
}

export const ExportFileTypeEnumSchema = z.enum(['gif', 'apng']);
export type ExportFileTypeEnum = z.infer<typeof ExportFileTypeEnumSchema>;
export interface AnimationEncoderParameters {
  variationCount: number;
  fps: number;
  exportFileType: ExportFileTypeEnum;
  backgroundColor: string;
}

export interface GeneratorParameters
  extends ContourGetterParameters,
    FrameRendererParameters,
    AnimationEncoderParameters {}

export const createDefaultGeneratorParameters = (): GeneratorParameters => ({
  threshold: 210,
  onlyExternal: false,
  isStride: true,
  patchSize: 4,
  movableLength: 2,
  eps: 0.99,
  std: 0.2,
  variationCount: 10,
  fps: 30,
  exportFileType: 'gif',
  backgroundColor: '#ffffff',
});
