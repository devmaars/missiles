import { ASSETS_SRC } from 'utils/util';

export default class Sprite {
  private readonly img: HTMLImageElement;

  constructor(path: string) {
    const img = new Image();
    img.src = `${path}`;
    this.img = img;
  }

  public getSize(scale: number = 1): [number, number] {
    return [this.img.width * scale, this.img.height * scale];
  }

  public get handle(): HTMLImageElement {
    return this.img;
  }
}
