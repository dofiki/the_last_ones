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
  private readonly friction = 0.85;
  private coyoteTime: number = 0.2;
  private coyoteTimeCounter: number = 0;

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
      moveSpeed: config.moveSpeed ?? 3,
      jumpForce: config.jumpForce ?? -5,
      leftBoundary: config.leftBoundary ?? 50,
      rightBoundary: config.rightBoundary ?? 500,
      landingThreshold: config.landingThreshold ?? 10,
    };
  }

  getPosition() {
    return this.position;
  }

  setPosition(x: number, y: number) {
    this.position = {
      x: x,
      y: y,
    };
  }

  setX(x: number) {
    this.position = {
      ...this.position, // keep y
      x: x, // update x
    };
  }

  setY(y: number) {
    this.position = {
      ...this.position, // keep x
      y: y, // update y
    };
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

  setVelocity(vx: number, vy: number) {
    this.velocity = {
      vx: vx,
      vy: vy,
    };
  }

  setVX(vx: number) {
    this.velocity = {
      ...this.velocity,
      vx: vx,
    };
  }

  setVY(vy: number) {
    this.velocity = {
      ...this.velocity,
      vy: vy,
    };
  }

  checkIsGrounded() {
    return this.isGrounded;
  }

  updateIsGrounded(status: boolean) {
    // if status is true (i.e., the player is on the ground)
    // than we reset the coyote time counter.
    if (status) {
      this.coyoteTimeCounter = this.coyoteTime;
    }
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
      this.velocity.vx *= this.friction;

      // Prevent tiny sliding forever
      if (Math.abs(this.velocity.vx) < 0.1) {
        this.velocity.vx = 0;
      }
    }

    // count down coyote timer each frame when airborne
    if (!this.isGrounded) {
      this.coyoteTimeCounter -= 1 / 60;
    }

    if (jump && this.coyoteTimeCounter > 0) {
      this.velocity.vy = this.config.jumpForce;
      this.isGrounded = false;
      // resetting so there is no double jump
      this.coyoteTimeCounter = 0;
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
