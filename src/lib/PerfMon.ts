export default class PerfMon {
  private static readonly maxSample = 100;
  private fps: number = 0;
  private readonly frametimes: number[] = new Array(PerfMon.maxSample);

  public update(deltaTime: number) {
    this.frametimes.push(deltaTime);
    if (this.frametimes.length > PerfMon.maxSample) {
      this.frametimes.shift();
    }

    this.fps = 1000 / this.avgFrametime;
  }

  private get avgFrametime(): number {
    return this.frametimes.reduce((a, b) => a + b, 0) / this.frametimes.length;
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 40, 20);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 15px Roboto';
    ctx.fillText(this.fps.toFixed(0), 5, 15);
  }
}
