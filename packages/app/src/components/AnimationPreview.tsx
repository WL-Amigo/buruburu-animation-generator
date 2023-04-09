import { Component, createEffect, createSignal, onCleanup } from 'solid-js';
import { AnimationEncoderParameters } from '../models';
import { getOffscreenContext2D } from '../utils';

const renderFrame = (targetCanvas: HTMLCanvasElement, imageData: ImageData, bgColor: string | undefined) => {
  if (bgColor === undefined) {
    targetCanvas.getContext('2d')!.putImageData(imageData, 0, 0);
  } else {
    const tempCanvas = new OffscreenCanvas(imageData.width, imageData.height);
    getOffscreenContext2D(tempCanvas).putImageData(imageData, 0, 0);
    const ctx = targetCanvas.getContext('2d')!;
    ctx.save();
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, imageData.width, imageData.height);
    ctx.restore();
    ctx.drawImage(tempCanvas, 0, 0);
  }
};

interface Props {
  frames: ImageData[];
  animationEncoderParameters: AnimationEncoderParameters;
  shouldStop?: boolean;
}
export const AnimationPreview: Component<Props> = (props) => {
  const [canvasEl, setCanvasEl] = createSignal<HTMLCanvasElement | null>(null);
  createEffect(() => {
    const currentCanvas = canvasEl();
    const frames = props.frames;
    const fps = props.animationEncoderParameters.fps;
    const exportFileType = props.animationEncoderParameters.exportFileType;
    const bgColor = exportFileType === 'gif' ? props.animationEncoderParameters.backgroundColor : undefined;
    const shouldStop = props.shouldStop;
    if (currentCanvas === null || frames.length === 0 || shouldStop === true) {
      return;
    }

    const startTime = Date.now();
    const firstFrame = frames[0]!;
    currentCanvas.width = firstFrame.width;
    currentCanvas.height = firstFrame.height;
    renderFrame(currentCanvas, firstFrame, bgColor);
    const intervalId = window.setInterval(() => {
      const currentTime = Date.now();
      const targetFrameIndex = Math.round(((currentTime - startTime) * fps) / 1000) % frames.length;
      const targetFrame = frames[targetFrameIndex]!;
      renderFrame(currentCanvas, targetFrame, bgColor);
    }, Math.round(1000 / fps));
    onCleanup(() => window.clearInterval(intervalId));
  });

  return <canvas ref={setCanvasEl} class="w-full h-full object-scale-down" />;
};
