import type Vector2 from 'lib/Vector2';

export default class Star {
  private readonly step: number;
  private readonly circleRadius: number = 10;
  private readonly starRadius: number;
  private readonly rotationSpeed: number = 0.002;
  private readonly spike: number = 5;
  private readonly starSizeFactor: number = 0.7;
  protected angle: number = 0;

  constructor(public position: Vector2) {
    this.step = Math.PI / this.spike;
    this.starRadius = this.circleRadius * this.starSizeFactor;
  }

  public update(deltaTime: number) {
    this.angle -= this.rotationSpeed * deltaTime;
  }

  public draw(ctx: CanvasRenderingContext2D) {
    const [starX, starY] = this.position.unpack();

    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(starX, starY, this.circleRadius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();

    ctx.save();
    ctx.translate(starX, starY);
    ctx.rotate(this.angle);
    ctx.beginPath();
    ctx.fillStyle = 'yellow';

    for (let i = 0; i < this.spike; i++) {
      let angle = (i * 2 * Math.PI) / this.spike;
      let x = this.starRadius * Math.cos(angle);
      let y = this.starRadius * Math.sin(angle);
      ctx.lineTo(x, y);

      angle += this.step;
      x = (this.starRadius / 2) * Math.cos(angle);
      y = (this.starRadius / 2) * Math.sin(angle);
      ctx.lineTo(x, y);
    }

    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    ctx.restore();
  }
}
