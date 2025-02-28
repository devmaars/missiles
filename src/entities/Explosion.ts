import Vector2 from 'lib/Vector2';

export default class Explosion {
  private elapsedTime: number = 0;
  private readonly maxSize: number;
  public isFinished: boolean = false;
  private particles: { x: number; y: number; size: number; velocity: Vector2; life: number }[] = [];

  constructor(private readonly position: Vector2, private readonly duration: number = 1200) {
    this.maxSize = 50 + Math.random() * 50; // Randomize explosion size
    this.generateParticles();
  }

  private generateParticles() {
    const numParticles = 10 + Math.random() * 20;
    for (let i = 0; i < numParticles; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 2;
      this.particles.push({
        x: this.position.x,
        y: this.position.y,
        size: 5 + Math.random() * 10,
        velocity: new Vector2(Math.cos(angle) * speed, Math.sin(angle) * speed),
        life: 0.5 + Math.random() * 0.5,
      });
    }
  }

  public update(deltaTime: number): void {
    this.elapsedTime += deltaTime;
    if (this.elapsedTime >= this.duration) {
      this.isFinished = true;
    }

    // Update particles
    this.particles.forEach((p) => {
      p.x += p.velocity.x * deltaTime * 100;
      p.y += p.velocity.y * deltaTime * 100;
      p.life -= deltaTime;
    });

    this.particles = this.particles.filter((p) => p.life > 0);
  }

  public draw(ctx: CanvasRenderingContext2D) {
    const progress = this.elapsedTime / this.duration;
    const size = this.maxSize * progress;
    const opacity = 1 - progress;

    ctx.save();
    ctx.translate(this.position.x, this.position.y);

    // Draw main explosion glow
    ctx.fillStyle = `rgba(255, ${150 + Math.random() * 100}, 0, ${opacity})`;
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    ctx.fill();

    // Draw particles
    this.particles.forEach((p) => {
      ctx.fillStyle = `rgba(255, ${Math.random() * 255}, 0, ${p.life})`;
      ctx.beginPath();
      ctx.arc(p.x - this.position.x, p.y - this.position.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }
}
