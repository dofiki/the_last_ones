import type { Platform } from "./Platform";

export class Player {
  position: { x: number; y: number };
  velocity: { vx: number; vy: number };
  width: number;
  height: number;
  gravity: number;
  moveSpeed : number;
  isGrounded : boolean;
  lootScore : number;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    gravity: number,
    moveSpeed: number = 3.5,
    isGrounded: boolean = false,
    lootScore: number = 0

  ) {
    this.position = { x, y };
    this.velocity = { vx: 0, vy: 0 };
    this.width = width;
    this.height = height;
    this.gravity = gravity;
    this.moveSpeed = moveSpeed;
    this.isGrounded = isGrounded;
    this.lootScore = lootScore;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "red";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  handleMovement(left: boolean, right: boolean, jump: boolean) {
    // stop movement, if out of bound
    if (this.position.x >= 500 && right) {
      this.velocity.vx = 0;
    } 
    else if (this.position.x <= 50 && left) {
      this.velocity.vx = 0;
    } 
    else if (left) {
      this.velocity.vx = -this.moveSpeed;
    } 
    else if (right) {
      this.velocity.vx = this.moveSpeed;
    } 
    else {
      this.velocity.vx = 0;
    }

    if (jump && this.isGrounded) {
      this.velocity.vy = -5; 
      this.isGrounded = false; 
    }
  }

 update(ctx: CanvasRenderingContext2D, canvasWidth: number, platforms: Platform[]) {
  // Apply horizontal velocity
  this.position.x += this.velocity.vx;

  // Apply vertical velocity
  this.position.y += this.velocity.vy;

  // Apply gravity
  this.velocity.vy += this.gravity;

  // at spawn : in sky
  this.isGrounded = false;

  // platform collision : check each platform
  const playerBottom = this.position.y + this.height;
  const playerLeft = this.position.x;
  const playerRight = this.position.x + this.width;

  platforms.forEach((platform) => {
    const platformTop = platform.position.y;
    const platformLeft = platform.position.x;
    const platformRight = platform.position.x + platform.width;

    // check if  horizontally aligned with platform
    const isHorizontallyAligned = playerRight > platformLeft && playerLeft < platformRight;
    
    // check if player is landing on top of platform
    if (
      isHorizontallyAligned &&
      playerBottom >= platformTop &&
      playerBottom <= platformTop + 10 && // threshold for landing
      this.velocity.vy >= 0 // only when falling or stationary
    ) {
      this.position.y = platformTop - this.height;
      this.velocity.vy = 0;
      this.isGrounded = true;
    }
  });


  // left collision
  if (this.position.x <= 0) {
    this.position.x = 0;
    this.velocity.vx = 0;
  }

  // right collision
  if (this.position.x + this.width >= canvasWidth) {
    this.position.x = canvasWidth - this.width;
    this.velocity.vx = 0;
  }

  this.draw(ctx);
}


}
