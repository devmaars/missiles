import type Vector2 from 'lib/Vector2';

export default class Cloud {
  public readonly size: number;
  private readonly color: string;

  constructor(public readonly position: Vector2, canvasHeight: number) {
    const depthFactor = Math.max(0.3, Math.min(1, 1 - this.position.y / canvasHeight));

    this.size = 40 + depthFactor * 80;
    const opacity = 0.3 + depthFactor * 0.5;
    this.color = `rgba(230, 230, 230, ${opacity})`;
  }

  public draw(ctx: CanvasRenderingContext2D) {
    const [cloudX, cloudY] = this.position.unpack();

    ctx.fillStyle = this.color;
    ctx.beginPath();

    ctx.arc(cloudX, cloudY, this.size * 0.6, 0, Math.PI * 2);
    ctx.arc(cloudX + this.size * 0.5, cloudY - this.size * 0.3, this.size * 0.4, 0, Math.PI * 2);
    ctx.arc(cloudX - this.size * 0.5, cloudY - this.size * 0.3, this.size * 0.4, 0, Math.PI * 2);
    ctx.arc(cloudX + this.size * 0.8, cloudY, this.size * 0.3, 0, Math.PI * 2);
    ctx.arc(cloudX - this.size * 0.8, cloudY, this.size * 0.3, 0, Math.PI * 2);

    ctx.closePath();
    ctx.fill();
  }
}
