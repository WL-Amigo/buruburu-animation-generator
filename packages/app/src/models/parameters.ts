import { z } from 'zod';
import { StorageInstance } from './storage';

const ContourExtractionBasisEnum = z.enum(['brightness', 'grayscale']);
export type ContourExtractionBasisType = z.infer<typeof ContourExtractionBasisEnum>;
export const ContourExtractionBasisOptions = ContourExtractionBasisEnum.options;

const ContourGetterParametersSchema = z.object({
  threshold: z.number().default(210),
  onlyExternal: z.boolean().default(false),
  contourExtractionBasis: ContourExtractionBasisEnum.default('brightness'),
});
export type ContourGetterParameters = z.infer<typeof ContourGetterParametersSchema>;

const FrameRendererParametersSchema = z.object({
  isStride: z.boolean().default(true),
  patchSize: z.number().default(4),
  movableLength: z.number().default(2.5),
  eps: z.number().default(0.99),
  std: z.number().default(0.2),
  variationCount: z.number().default(10),
});
export type FrameRendererParameters = z.infer<typeof FrameRendererParametersSchema>;

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
const AnimationEncoderParametersSchema = z.object({
  variationCount: z.number().default(10),
  fps: z.number().default(30),
  exportFileType: ExportFileTypeEnumSchema.default('gif'),
  backgroundColor: z.string().default('#ffffff'),
});
export type AnimationEncoderParameters = z.infer<typeof AnimationEncoderParametersSchema>;

const GeneratorParametersSchema = ContourGetterParametersSchema.merge(FrameRendererParametersSchema).merge(
  AnimationEncoderParametersSchema
);
export type GeneratorParameters = z.infer<typeof GeneratorParametersSchema>;

export const createDefaultGeneratorParameters = (): GeneratorParameters => GeneratorParametersSchema.parse({});

export const getLastUsedGeneratorParameters = async (): Promise<GeneratorParameters> => {
  const savedParams = (await StorageInstance.get('lastUsedParameters')) as GeneratorParameters | null | undefined;
  return savedParams !== undefined && savedParams !== null ? savedParams : createDefaultGeneratorParameters();
};

export const saveLastUsedGeneratorParameters = async (params: GeneratorParameters): Promise<void> => {
  await StorageInstance.set('lastUsedParameters', params);
};
