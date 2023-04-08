import { z } from 'zod';

export type Vector2D = [number, number];
const ContourExtractionBasisEnum = z.enum(['brightness', 'grayscale']);
export type ContourExtractionBasisType = z.infer<typeof ContourExtractionBasisEnum>;
export const ContourExtractionBasisOptions = ContourExtractionBasisEnum.options;

// main -> OpenCV Worker
export const CalcContourEventId = 'calcContours';
export interface CalcContourEventPayload {
  type: typeof CalcContourEventId;
  threshold: number;
  onlyExternal: boolean;
  contourExtractionBasis: ContourExtractionBasisType;
  bitmap: ImageBitmap;
}

// main <- OpenCV Worker
export const FinishInitOpenCVEventId = 'finishInitOpenCV';
export interface FinishInitOpenCVEventPayload {
  type: typeof FinishInitOpenCVEventId;
}

export const FinishCalcContourEventId = 'finishCalcContours';
export interface FinishCalcContourEventPayload {
  type: typeof FinishCalcContourEventId;
  contours: Vector2D[][];
}
