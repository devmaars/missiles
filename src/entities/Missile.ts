import Vector2 from 'lib/Vector2';
import { RAD_2_DEG } from 'utils/util';

export default class Missile {
  private static readonly collisionThreshold = 20;
  private angle: number = 0;
  // private turnRate: number = 0.002;
  private turnRate: number = 0.003;
  private readonly speed: number = 0.6;

  constructor(public position: Vector2, private readonly target: Vector2) {}

  public update(deltaTime: number) {
    const direction = this.target.sub(this.position);
    const targetAngle = Math.atan2(direction.y, direction.x);

    const angleDiff = ((targetAngle - this.angle + Math.PI) % (2 * Math.PI)) - Math.PI;
    this.angle += Math.sign(angleDiff) * Math.min(Math.abs(angleDiff), this.turnRate * deltaTime);

    this.position.x += Math.cos(this.angle) * this.speed * deltaTime;
    this.position.y += Math.sin(this.angle) * this.speed * deltaTime;

    // console.log(`Missile Angle: ${this.angle * RAD_2_DEG}`);
  }

  public checkCollision(other: Missile): boolean {
    if (this === other) return false; // Avoid self-collision

    return this.position.distance(other.position) <= Missile.collisionThreshold;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);

    // Rotate the missile to align its head with the current direction
    ctx.rotate(this.angle + Math.PI / 2); // Adjust for default canvas orientation
    // Draw the missile body (gray body, darker tail)
    ctx.fillStyle = 'gray';
    ctx.beginPath();
    ctx.moveTo(0, -15); // Start at the tip of the missile (pointed head)
    ctx.lineTo(-5, -10); // Left side of the body
    ctx.lineTo(-5, 10); // Left side of the body (bottom)
    ctx.lineTo(5, 10); // Right side of the body (bottom)
    ctx.lineTo(5, -10); // Right side of the body
    ctx.closePath();
    ctx.fill();

    // Draw the tail fins (dark gray)
    ctx.fillStyle = 'darkgray';
    ctx.beginPath();
    ctx.moveTo(-5, 10); // Left bottom of the body
    ctx.lineTo(-10, 20); // Left fin
    ctx.lineTo(0, 15); // Back of the missile (connecting the tail)
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(5, 10); // Right bottom of the body
    ctx.lineTo(10, 20); // Right fin
    ctx.lineTo(0, 15); // Back of the missile (connecting the tail)
    ctx.closePath();
    ctx.fill();

    // Draw the exhaust flame (optional for effect)
    ctx.fillStyle = 'orange';
    ctx.beginPath();
    ctx.moveTo(-3, 15); // Start from the tail
    ctx.lineTo(0, 30); // Flame end
    ctx.lineTo(3, 15); // End at the tail
    ctx.closePath();
    ctx.fill();

    //
    // ctx.strokeStyle = 'green';
    // ctx.rect(0, 0, 20, 20);
    // ctx.stroke();

    ctx.restore();
  }
}
