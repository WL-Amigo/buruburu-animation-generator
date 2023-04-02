import { Component, createEffect, createSignal, onCleanup } from 'solid-js';
import { AnimationEncoderParameters } from '../models';

interface Props {
  frames: ImageData[];
  animationEncoderParameters: AnimationEncoderParameters;
}
export const AnimationPreview: Component<Props> = (props) => {
  const [canvasEl, setCanvasEl] = createSignal<HTMLCanvasElement | null>(null);
  createEffect(() => {
    const currentCanvas = canvasEl();
    const frames = props.frames;
    const params = props.animationEncoderParameters;
    if (currentCanvas === null || frames.length === 0) {
      return;
    }

    const startTime = Date.now();
    const firstFrame = frames[0]!;
    currentCanvas.width = firstFrame.width;
    currentCanvas.height = firstFrame.height;
    const intervalId = window.setInterval(() => {
      const currentTime = Date.now();
      const targetFrameIndex = Math.round(((currentTime - startTime) * params.fps) / 1000) % frames.length;
      const targetFrame = frames[targetFrameIndex]!;
      currentCanvas.getContext('2d')?.putImageData(targetFrame, 0, 0);
    }, Math.round(1000 / params.fps));
    onCleanup(() => window.clearInterval(intervalId));
  });

  return <canvas ref={setCanvasEl} class="w-full h-full object-scale-down" />;
};
