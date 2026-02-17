interface PlayerConfig {
  moveSpeed?: number;
  jumpForce?: number;
  leftBoundary?: number;
  rightBoundary?: number;
  landingThreshold?: number;
}

export class Player {
  private position: { x: number; y: number };
  private velocity: { vx: number; vy: number };
  private readonly width: number;
  private readonly height: number;
  private readonly gravity: number;
  private readonly config: Required<PlayerConfig>;
  private isGrounded: boolean = false;
  private lootScore: number = 0;
  private color: string = "red";

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    gravity: number,
    config: PlayerConfig = {},
  ) {
    this.position = { x, y };
    this.velocity = { vx: 0, vy: 0 };
    this.width = width;
    this.height = height;
    this.gravity = gravity;

    this.config = {
      moveSpeed: config.moveSpeed ?? 3.5,
      jumpForce: config.jumpForce ?? -5,
      leftBoundary: config.leftBoundary ?? 50,
      rightBoundary: config.rightBoundary ?? 500,
      landingThreshold: config.landingThreshold ?? 10,
    };
  }

  getPosition() {
    return this.position;
  }

  getHeight() {
    return this.height;
  }

  getWidth() {
    return this.width;
  }

  getVelocity() {
    return this.velocity;
  }

  checkIsGrounded() {
    return this.isGrounded;
  }

  updateIsGrounded(status: boolean) {
    this.isGrounded = status;
  }

  getScore(): number {
    return this.lootScore;
  }

  addScore(points: number): void {
    this.lootScore += points;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  handleMovement(left: boolean, right: boolean, jump: boolean) {
    // stop movement, if out of bound
    if (this.position.x >= 500 && right) {
      this.velocity.vx = 0;
    } else if (this.position.x <= 50 && left) {
      this.velocity.vx = 0;
    } else if (left) {
      this.velocity.vx = -this.config.moveSpeed;
    } else if (right) {
      this.velocity.vx = this.config.moveSpeed;
    } else {
      this.velocity.vx = 0;
    }

    if (jump && this.isGrounded) {
      this.velocity.vy = -5;
      this.isGrounded = false;
    }
  }

  updatePhysics(): void {
    // Apply horizontal velocity
    this.position.x += this.velocity.vx;
    // Apply vertical velocity
    this.position.y += this.velocity.vy;
    // Apply gravity
    this.velocity.vy += this.gravity;
    // at spawn : in sky
    this.isGrounded = false;
  }

  update(ctx: CanvasRenderingContext2D) {
    this.updatePhysics();
    this.draw(ctx);
  }
}
