<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import GameController from './GameController';
  import GameOver from 'components/GameOver.svelte';

  let lastTimestamp: number;
  let canvas: HTMLCanvasElement;
  let animationFrameId: number;
  let gameController: GameController;

  let canvasWidth = $state(window.innerWidth);
  let canvasHeight = $state(window.innerHeight);

  onMount(() => {
    if (!canvas) {
      console.log('Canvas element not found !');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.log('Failed to acquire 2D rendering context');
      return;
    }

    gameController = new GameController(canvas);

    animationFrameId = requestAnimationFrame(function animate(timestamp: number) {
      if (!lastTimestamp) lastTimestamp = timestamp;

      const deltaTime = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      gameController.update(deltaTime);
      gameController.render(ctx);

      animationFrameId = requestAnimationFrame(animate);
    });

    window.addEventListener('resize', onWindowResize);
  });

  function onWindowResize() {
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
  }
</script>

<main>
  <!-- <GameOver score={10} timeSurvived={'00:00'}></GameOver> -->
  <canvas width={canvasWidth} height={canvasHeight} bind:this={canvas}></canvas>
</main>

<style>
  canvas {
    /* display: none; */
    background-color: lightblue;
  }
</style>
