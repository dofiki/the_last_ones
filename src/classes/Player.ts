export class Player {
  position: { x: number; y: number };
  velocity: { vx: number; vy: number };
  width: number;
  height: number;
  gravity: number;
  moveSpeed : number;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    gravity: number,
    moveSpeed: number = 3

  ) {
    this.position = { x, y };
    this.velocity = { vx: 0, vy: 1 };
    this.width = width;
    this.height = height;
    this.gravity = gravity;
    this.moveSpeed = moveSpeed;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "red";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  handleMovement(left: boolean, right: boolean, jump: boolean) {
    const speed = 3;
    if (left) this.velocity.vx = -speed;
    else if (right) this.velocity.vx = speed;
    else this.velocity.vx = 0;

    if (jump && this.velocity.vy === 0) {
      this.velocity.vy = -5; 
    }
  }

  update(ctx: CanvasRenderingContext2D, canvasHeight: number) {
    // Apply horizontal velocity
    this.position.x += this.velocity.vx;

    // Apply vertical velocity
    this.position.y += this.velocity.vy;

    // Apply gravity
    this.velocity.vy += this.gravity;

    // Bottom collision
    const playerBottom = this.position.y + this.height;
    if (playerBottom >= canvasHeight) {
      this.position.y = canvasHeight - this.height;
      this.velocity.vy = 0;
    }

    this.draw(ctx);
  }

}
