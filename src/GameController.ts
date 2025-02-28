import PerfMon from 'lib/PerfMon';
import Camera from 'entities/Camera';
import Vector2 from 'lib/Vector2';
import Aircraft, { type Direction } from 'entities/Aircraft';
import Cloud from 'entities/Cloud';
import Input, { Key } from 'lib/Input';
import Star from 'entities/Star';
import Missile from 'entities/Missile';
import { sec2min } from 'utils/util';
import Explosion from 'entities/Explosion';

export default class GameController {
  private readonly startTime: number = Date.now();
  private readonly maxMissilePool: number = 3;
  private readonly missileSpawnIntv: number = 5000;
  private readonly input: Input;
  private readonly clouds: Cloud[] = [];
  private readonly perfM: PerfMon;
  private readonly camera: Camera;
  private readonly aircraft: Aircraft;
  private readonly worldSizeFactor = 5;
  private star: null | Star = null;
  private readonly missiles: Set<Missile> = new Set();
  private readonly explosions: Explosion[] = [];

  constructor(private canvas: HTMLCanvasElement) {
    this.perfM = new PerfMon();

    const [playerX, playerY] = this.canvasMidpoint;
    this.aircraft = new Aircraft(new Vector2(playerX, playerY));
    this.camera = new Camera(new Vector2());

    this.populateClouds();
    this.spawnStar();
    this.startMissileSpawn();

    this.input = new Input();
    this.input.bindWindowAndDocument();
  }

  public update(deltaTime: number) {
    const [WORLD_WIDTH, WORLD_HEIGHT] = this.getWorldSize();

    // Update Aircraft
    this.updateAircraft(deltaTime);
    this.handleBounds(WORLD_WIDTH, WORLD_HEIGHT);

    for (const missile of this.missiles) {
      missile.update(deltaTime);

      for (const missile2 of this.missiles) {
        if (missile.checkCollision(missile2)) {
          this.missiles.delete(missile);
          this.missiles.delete(missile2);
          this.explosions.push(new Explosion(missile.position));
        }
      }
    }

    for (const explosion of this.explosions) {
      if (explosion.isFinished) continue;
      explosion.update(deltaTime);
    }

    // Update Camera
    this.camera.update(
      deltaTime,
      this.aircraft.position,
      WORLD_WIDTH,
      WORLD_HEIGHT,
      this.canvas.width,
      this.canvas.height,
    );
    this.star?.update(deltaTime);
    this.perfM.update(deltaTime);
  }

  private updateAircraft(deltaTime: number) {
    let turnDir: Direction = 0;

    if (this.input.isKeyDown(Key.A)) turnDir = -1;
    if (this.input.isKeyDown(Key.D)) turnDir = 1;

    this.aircraft.turnTo(turnDir);
    this.aircraft.update(deltaTime);
  }

  private handleBounds(WORLD_WIDTH: number, WORLD_HEIGHT: number) {
    const [playerWidth, playerHeight] = this.aircraft.size;

    if (this.aircraft.position.x + playerWidth > WORLD_WIDTH) {
      this.aircraft.position.x = WORLD_WIDTH - playerWidth;
    } else if (this.aircraft.position.x < 0) {
      this.aircraft.position.x = 0;
    }

    if (this.aircraft.position.y + playerHeight > WORLD_HEIGHT) {
      this.aircraft.position.y = WORLD_HEIGHT - playerHeight;
    } else if (this.aircraft.position.y < 0) {
      this.aircraft.position.y = 0;
    }
  }

  private isOffScreen(entityPosition: Vector2, entityWidth: number, entityHeight: number, offset: number = 0): boolean {
    const [canvasWidth, canvasHeight] = [this.canvas.width, this.canvas.height];
    const [cameraX, cameraY] = this.camera.position.unpack();

    return (
      entityPosition.x + entityWidth < cameraX - offset ||
      entityPosition.x > cameraX + canvasWidth + offset ||
      entityPosition.y + entityHeight < cameraY - offset ||
      entityPosition.y > cameraY + canvasHeight + offset
    );
  }

  public render(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.save();
    ctx.translate(-this.camera.position.x, -this.camera.position.y);

    // this.drawGrid(ctx);

    for (const cloud of this.clouds) {
      if (this.isOffScreen(cloud.position, cloud.size, cloud.size, 100)) {
        continue;
      }
      cloud.draw(ctx);
    }

    for (const explosion of this.explosions) {
      if (explosion.isFinished) continue;
      explosion.draw(ctx);
    }

    this.star?.draw(ctx);
    this.aircraft.draw(ctx);

    for (const missile of this.missiles) {
      missile.draw(ctx);
    }

    ctx.restore();

    this.drawUI(ctx);
    this.perfM.draw(ctx);
  }

  private drawUI(ctx: CanvasRenderingContext2D) {
    // Calculate elapsed time
    const elapsedTime = sec2min(Math.floor((Date.now() - this.startTime) / 1000)).join(':');

    // Placeholder score (this should be dynamically updated based on game state)
    const score = this.getScore(); // Replace with actual score logic

    ctx.save();

    ctx.font = 'bold 36px Monaco';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(20, 100, ctx.measureText(`Score: ${score}`).width + 40, 100);

    ctx.fillStyle = 'white';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 10;

    ctx.fillText(`Time: ${elapsedTime}`, 30, 110);
    ctx.fillText(`Score: ${score}`, 30, 150);

    ctx.restore();
  }

  public getScore(): number {
    return 10;
  }

  private populateClouds(): void {
    const [worldWidth, worldHeight] = this.getWorldSize();

    // Determine cloud count dynamically based on world size
    const cloudsPerScreenUnit = 0.0001; // Adjust for density
    const cloudCount = Math.ceil(worldWidth * worldHeight * cloudsPerScreenUnit);

    // Define grid size based on calculated cloud count
    const cols = Math.ceil(Math.sqrt(cloudCount) * 1.5);
    const rows = Math.ceil(cloudCount / cols);

    const cellWidth = worldWidth / cols;
    const cellHeight = worldHeight / rows; // Cover full height of the world

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (this.clouds.length >= cloudCount) break; // Stop if we reach desired count

        // Generate cloud within grid cell with randomness
        const x = (col + Math.random() * 0.8) * cellWidth;
        const y = (row + Math.random() * 0.8) * cellHeight;

        this.clouds.push(new Cloud(new Vector2(x, y), this.canvas.height));
      }
    }
  }

  private spawnStar(): void {
    if (this.star) return;
    const [centerX, centerY] = this.canvasMidpoint;
    setTimeout(() => {
      this.star = new Star(new Vector2(centerX - 100, centerY - 100));
    }, 0);
  }

  public startMissileSpawn(): void {
    const [worldWidth, worldHeight] = this.getWorldSize();

    setInterval(() => {
      if (this.missiles.size >= this.maxMissilePool) return;

      const randomX = Math.random() * worldWidth;
      const randomY = Math.random() * worldHeight;

      this.missiles.add(new Missile(new Vector2(randomX, randomY), this.aircraft.position));
    }, this.missileSpawnIntv);
  }

  private drawGrid(ctx: CanvasRenderingContext2D) {
    const gridSize = 100;

    ctx.strokeStyle = '#444';
    ctx.lineWidth = 1;

    let startX = Math.floor(this.camera.position.x / gridSize) * gridSize;
    let startY = Math.floor(this.camera.position.y / gridSize) * gridSize;

    for (let x = startX; x < this.camera.position.x + this.canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, this.camera.position.y);
      ctx.lineTo(x, this.camera.position.y + this.canvas.height);
      ctx.stroke();
    }

    for (let y = startY; y < this.camera.position.y + this.canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(this.camera.position.x, y);
      ctx.lineTo(this.camera.position.x + this.canvas.width, y);
      ctx.stroke();
    }
  }

  private getWorldSize(): [number, number] {
    return [this.canvas.width * this.worldSizeFactor, this.canvas.height * this.worldSizeFactor];
  }

  private get canvasMidpoint(): [number, number] {
    return [this.canvas.width / 2, this.canvas.height / 2];
  }
}
