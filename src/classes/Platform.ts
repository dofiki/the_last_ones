export class Platform {
  position: { x: number; y: number };
  width: number;
  height: number;

  constructor(x: number, y: number, width: number, height: number) {
    this.position = { x, y };
    this.width = width;
    this.height = height;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "green";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}
