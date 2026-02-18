import type { Platform } from "../classes/Platform";
import type { Obstacle } from "../classes/Obstacle";
import type { Loot } from "../classes/Loot";
import type { Stair } from "../classes/Stair";
import type { Player } from "../classes/Player";

interface GameObjects {
  platforms: Platform[];
  obstacles: Obstacle[];
  loot: Loot[];
  stairs: Stair[];
}

// where camera wants to be
let targetOffset = 0;
// where camera actually is
let cameraOffset = 0;

export function updateCamera(
  player: Player,
  movingRight: boolean,
  movingLeft: boolean,
  objects: GameObjects,
  thresholdRight: number,
  thresholdLeft: number,
  scrollSpeed: number,
): void {
  const lerpSpeed = 0.1;

  if (movingRight && player.getPosition().x > thresholdRight) {
    player.setX(thresholdRight);
    player.setVX(0);
    targetOffset -= scrollSpeed;
  } else if (movingLeft && player.getPosition().x < thresholdLeft) {
    player.setX(thresholdLeft);
    player.setVX(0);
    targetOffset += scrollSpeed;
  }

  // Smoothly interpolate cameraOffset toward targetOffset.
  // 1. Compute the remaining distance (gap) between the current camera position
  //    and where it should be (targetOffset).
  // 2. Take 10% of that gap (lerp factor = 0.1).
  // 3. Move the world objects (platforms, obstacles, etc.) by that amount.
  // 4. Accumulate the movement into cameraOffset (cameraOffset += delta).
  // This process repeats every frame until the remaining gap is very small
  // (e.g., less than 0.01), preventing jitter from tiny floating-point updates.

  const delta = (targetOffset - cameraOffset) * lerpSpeed;
  cameraOffset += delta;

  // Only shift world objects if there's a meaningful delta
  if (Math.abs(delta) > 0.01) {
    objects.platforms.forEach((platform) => (platform.position.x += delta));
    objects.obstacles.forEach((obstacle) => (obstacle.position.x += delta));
    objects.loot.forEach((loot) => (loot.position.x += delta));
    objects.stairs.forEach((stair) => (stair.position.x += delta));
  }
}
