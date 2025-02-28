import type Vector2 from 'lib/Vector2';

export default class Camera {
  constructor(
    public position: Vector2,
    public readonly edgeMargin: number = 500,
    public readonly smoothingFactor = 0.1,
  ) {}

  public update(
    deltaTime: number,
    playerPosition: Vector2,
    WORLD_WIDTH: number,
    WORLD_HEIGHT: number,
    canvasWidth: number,
    canvasHeight: number,
  ) {
    const maxX = Math.max(0, WORLD_WIDTH - canvasWidth);
    const maxY = Math.max(0, WORLD_HEIGHT - canvasHeight);

    let [targetX, targetY] = this.position.unpack();
    const [playerX, playerY] = playerPosition.unpack();
    const edgeMargin = this.edgeMargin;

    if (playerX < this.position.x + edgeMargin) {
      targetX = Math.max(0, playerX - edgeMargin);
    } else if (playerX > this.position.x + canvasWidth - edgeMargin) {
      targetX = Math.min(maxX, playerX + edgeMargin - canvasWidth);
    }

    if (playerY < this.position.y + edgeMargin) {
      targetY = Math.max(0, playerY - edgeMargin);
    } else if (playerY > this.position.y + canvasHeight - edgeMargin) {
      targetY = Math.min(maxY, playerY + edgeMargin - canvasHeight);
    }

    // Smooth movement
    this.position.x += (targetX - this.position.x) * this.smoothingFactor * deltaTime;
    this.position.y += (targetY - this.position.y) * this.smoothingFactor * deltaTime;

    // Clamp within world bounds
    this.position.x = Math.max(0, Math.min(this.position.x, maxX));
    this.position.y = Math.max(0, Math.min(this.position.y, maxY));
  }
}
