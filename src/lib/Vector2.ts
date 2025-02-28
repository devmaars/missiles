export default class Vector2 {
  constructor(public x: number = 0, public y: number = 0) {}

  public unpack(): [number, number] {
    return [this.x, this.y];
  }

  public sub(other: Vector2) {
    return new Vector2(this.x - other.x, this.y - other.y);
  }

  public lengh(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  public distance(other: Vector2): number {
    return this.sub(other).lengh();
  }

  public clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }
}
