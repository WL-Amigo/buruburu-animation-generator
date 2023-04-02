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

export const ExportFileTypeEnumSchema = z.enum(['gif', 'apng', 'frames']);
export const AllExportFileTypeEnum = ExportFileTypeEnumSchema.options;
export type ExportFileTypeEnum = z.infer<typeof ExportFileTypeEnumSchema>;
const ExportFileTypeToMimeTypeMap: Readonly<Record<ExportFileTypeEnum, string>> = {
  gif: 'image/gif',
  apng: 'image/apng',
  frames: 'application/zip',
};
export const getMimeTypeFromExportFileType = (ft: ExportFileTypeEnum): string => {
  return ExportFileTypeToMimeTypeMap[ft];
};
const ExportFileTypeToFileExtensionMap: Readonly<Record<ExportFileTypeEnum, string>> = {
  gif: 'gif',
  apng: 'apng',
  frames: 'frames.zip',
};
export const getFileExtensionFromExportFileType = (ft: ExportFileTypeEnum): string => {
  return ExportFileTypeToFileExtensionMap[ft];
};
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
