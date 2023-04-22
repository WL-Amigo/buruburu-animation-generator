import type CV from 'opencv-ts';
import type { Mat } from 'opencv-ts';
import type {
  CalcContourEventPayload,
  FinishCalcContourEventPayload,
  FinishInitOpenCVEventPayload,
  Vector2D,
} from '../types';
import type { ContourExtractionBasisType } from '../../models';

declare global {
  interface Window {
    cv: typeof CV;
  }
}

self.importScripts('/opencv.js');

self.cv.onRuntimeInitialized = () => {
  const returnPayload: FinishInitOpenCVEventPayload = {
    type: 'finishInitOpenCV',
  };
  self.postMessage(returnPayload);
};

const matTo2DVectorArray = (src: Mat): Array<Vector2D> => {
  const data32S = src.data32S;
  if (data32S.length % 2 !== 0) {
    throw new Error('invalid mat for 2-dim vector');
  }
  const result: Array<Vector2D> = [];
  for (let i = 0; i < data32S.length / 2; i++) {
    result.push([data32S[i * 2], data32S[i * 2 + 1]]);
  }
  return result;
};

const preprocessImageForExtractContours = (cv: typeof CV, src: Mat, basisType: ContourExtractionBasisType): Mat => {
  if (basisType === 'brightness') {
    const imgBGR = new cv.Mat();
    cv.cvtColor(src, imgBGR, cv.COLOR_BGRA2BGR);
    const imgHSV = new cv.Mat();
    cv.cvtColor(imgBGR, imgHSV, cv.COLOR_BGR2HSV);
    const hsvVector = new cv.MatVector();
    cv.split(imgHSV, hsvVector);

    const result = hsvVector.get(2);
    imgBGR.delete();
    imgHSV.delete();
    hsvVector.delete();
    return result;
  } else if (basisType === 'grayscale') {
    const imgGray = new cv.Mat();
    cv.cvtColor(src, imgGray, cv.COLOR_BGRA2GRAY);
    return imgGray;
  }

  throw new Error('invalid contour extraction basis type');
};

const getContoursFromMat = (
  cv: typeof CV,
  src: Mat,
  threshold = 210,
  onlyExternal = false,
  basisType: ContourExtractionBasisType
) => {
  const retrMode = onlyExternal ? cv.RETR_EXTERNAL : cv.RETR_LIST;

  const binImgBase = preprocessImageForExtractContours(cv, src, basisType);
  const binImg = new cv.Mat();
  cv.threshold(binImgBase, binImg, threshold, 255, cv.THRESH_BINARY_INV);

  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();
  cv.findContours(binImg, contours, hierarchy, retrMode, cv.CHAIN_APPROX_NONE);

  const allContourPointsList: Array<Array<[number, number]>> = [];
  for (let i = 0; i < contours.size(); i++) {
    allContourPointsList.push(matTo2DVectorArray(contours.get(i)));
  }

  binImgBase.delete();
  binImg.delete();
  contours.delete();
  hierarchy.delete();

  return allContourPointsList;
};

const calcContours = async (payload: CalcContourEventPayload) => {
  const { bitmap: src, threshold, onlyExternal, contourExtractionBasis } = payload;
  const offscreenCanvas = new OffscreenCanvas(src.width, src.height);
  const ctx = offscreenCanvas.getContext('2d') as OffscreenCanvasRenderingContext2D;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, src.width, src.height);
  ctx.drawImage(src, 0, 0);

  const imgData = ctx.getImageData(0, 0, src.width, src.height);
  const mat = self.cv.matFromImageData(imgData);

  const contours = getContoursFromMat(self.cv, mat, threshold, onlyExternal, contourExtractionBasis);

  mat.delete();

  return contours;
};

self.addEventListener('message', (ev) => {
  const payload: CalcContourEventPayload = ev.data;
  if (payload.type === 'calcContours') {
    calcContours(payload).then((results) => {
      const returnPayload: FinishCalcContourEventPayload = {
        type: 'finishCalcContours',
        contours: results,
      };
      self.postMessage(returnPayload);
    });
  }
});
