export type Vector2D = [number, number];

// main -> OpenCV Worker
export const CalcContourEventId = 'calcContours';
export interface CalcContourEventPayload {
  type: typeof CalcContourEventId;
  threshold: number;
  onlyExternal: boolean;
  // imageData: ImageData;
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