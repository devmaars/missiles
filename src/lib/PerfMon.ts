export default class PerfMon {
  private static readonly MAX_SAMPLE: number = 100;

  private readonly frameTimes: number[] = [];
  private lastTime: number = performance.now();
  private fps: number = 0;

  public update(deltaTime: number) {
    const now = performance.now();
    const frameTime = now - this.lastTime;
    this.lastTime = now;

    this.frameTimes.push(frameTime);
    if (this.frameTimes.length > PerfMon.MAX_SAMPLE) {
      this.frameTimes.shift();
    }

    const avgFrameTime = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
    this.fps = 1000 / avgFrameTime;
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 150, 50);

    ctx.fillStyle = 'white';
    ctx.font = '14px Arial';
    ctx.fillText(`FPS: ${this.fps.toFixed(1)}`, 10, 20);
  }
}
