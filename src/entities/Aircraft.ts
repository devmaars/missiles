import Sprite from 'lib/Sprite';
import type Vector2 from 'lib/Vector2';

export type Direction = -1 | 1 | 0;

export default class Aircraft {
  private readonly debug = false;
  private speed: number = 0.5;
  private angle: number = 0;
  private sprite: Sprite;
  private direction: number = 0;
  private scaleFactor: number = 0.5;
  private readonly turnRate: number = 0.03;
  private bankAngle = 0; // Tilt amount
  private readonly maxBankAngle = Math.PI / 10;
  private readonly bankSmoothing = 0.05;

  constructor(public position: Vector2) {
    this.sprite = new Sprite(`/aircraft2.png`);
  }

  public update(deltaTime: number) {
    const targetBankAngle = this.direction * this.maxBankAngle;
    this.bankAngle += (targetBankAngle - this.bankAngle) * this.bankSmoothing * deltaTime;

    this.angle += this.direction * this.turnRate;

    this.position.x += Math.cos(this.angle) * this.speed * deltaTime;
    this.position.y += Math.sin(this.angle) * this.speed * deltaTime;
  }

  public get size(): [number, number] {
    return this.sprite.getSize(this.scaleFactor);
  }

  public turnTo(direction: Direction) {
    this.direction = direction;
  }

  public draw(ctx: CanvasRenderingContext2D) {
    const [playerX, playerY] = this.position.unpack();
    const [playerWidth, playerHeight] = this.size;

    ctx.save();

    ctx.translate(playerX, playerY);
    ctx.rotate(this.angle + Math.PI / 2 + this.bankAngle);
    ctx.drawImage(this.sprite.handle, -playerWidth, -playerHeight, playerWidth, playerHeight);

    if (this.debug) {
      ctx.strokeStyle = 'green';
      ctx.rect(-playerWidth, -playerHeight, playerWidth, playerHeight);
      ctx.stroke();
    }

    ctx.restore();
  }
}
