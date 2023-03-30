import { Component, createEffect, createSignal, onCleanup } from "solid-js";
import { workerCommunicator } from "./processor/cv";

export const Sandbox: Component = () => {
  const [canvasEl, setCanvasEl] = createSignal<HTMLCanvasElement | null>(null);
  let intervalId: number | null = null;
  const startOrStopWiggle = () => {
    const currentCanvasEl = canvasEl();
    if(currentCanvasEl === null) {
      return;
    }

    if(intervalId === null) {
      // intervalId = setInterval(async () => {
      //   const imgData = await workerCommunicator.loadImage();
      // currentCanvasEl.width = imgData.width;
      // currentCanvasEl.height = imgData.height;
      // const ctx = currentCanvasEl.getContext('2d')!;
      
      // ctx.clearRect(0,0,imgData.width,imgData.height);
      // ctx.putImageData(imgData, 0, 0);
      // }, 200);
      workerCommunicator.calcContour().then(res => console.log(res));
    } else {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  return <div class="flex flex-col items-start gap-y-2">
    <canvas ref={setCanvasEl}></canvas>
    <button onClick={startOrStopWiggle}>Start/Stop</button>
  </div>
}