export class Player {
  position: { x: number; y: number };
  velocity: { vx: number; vy: number };
  width: number;
  height: number;
  gravity: number;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    gravity: number
  ) {
    this.position = { x, y };
    this.velocity = { vx: 0, vy: 1 };
    this.width = width;
    this.height = height;
    this.gravity = gravity;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "red";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update(ctx: CanvasRenderingContext2D, canvasHeight: number) {
    // Apply velocity
    this.position.y += this.velocity.vy;

    // Apply gravity
    this.velocity.vy += this.gravity;

    // Bottom only collision with canvas
    const playerBottom = this.position.y + this.height;
    if (playerBottom >= canvasHeight) {
      this.position.y = canvasHeight - this.height; 
      this.velocity.vy = 0;                          
    }

    this.draw(ctx);
  }
}
