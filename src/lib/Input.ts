export enum Key {
  W = 'w',
  A = 'a',
  S = 's',
  D = 'd',
  Space = ' ',
  Escape = 'Escape',
}

export enum Mouse {
  LeftClick = 0,
  MiddleClick = 1,
  RightClick = 2,
}

export default class Input {
  private keys: Set<string>;
  private mouseXY: [number, number];
  private buttons: Set<number>;

  private keyDownHandler: (e: KeyboardEvent) => void;
  private keyUpHandler: (e: KeyboardEvent) => void;
  private mouseDownHandler: (e: MouseEvent) => void;
  private mouseUpHandler: (e: MouseEvent) => void;

  constructor() {
    this.mouseXY = [0, 0];
    this.keys = new Set();
    this.buttons = new Set();

    this.keyDownHandler = this.onKeyDown.bind(this);
    this.keyUpHandler = this.onKeyUp.bind(this);
    this.mouseDownHandler = this.onMouseDown.bind(this);
    this.mouseUpHandler = this.onMouseUp.bind(this);
  }

  public bindWindowAndDocument() {
    this.unbindWindowAndDocument();
    window.addEventListener('keydown', this.keyDownHandler);
    window.addEventListener('keyup', this.keyUpHandler);
    document.addEventListener('mousedown', this.mouseDownHandler);
    document.addEventListener('mouseup', this.mouseUpHandler);
  }

  public unbindWindowAndDocument() {
    window.removeEventListener('keydown', this.keyDownHandler);
    window.removeEventListener('keyup', this.keyUpHandler);
    document.removeEventListener('mousedown', this.mouseDownHandler);
    document.removeEventListener('mouseup', this.mouseUpHandler);
  }

  private onMouseDown(e: MouseEvent): void {
    this.buttons.add(e.button);
  }

  private onMouseUp(e: MouseEvent): void {
    this.buttons.delete(e.button);
  }

  private onKeyDown(e: KeyboardEvent): void {
    this.keys.add(e.key);
  }

  private onKeyUp(e: KeyboardEvent): void {
    this.keys.delete(e.key);
  }

  public getMouseXY(): [number, number] {
    return this.mouseXY;
  }

  public isKeyDown(key: string): boolean {
    return this.keys.has(key);
  }

  public isMouseDown(button: number): boolean {
    return this.buttons.has(button);
  }
}
