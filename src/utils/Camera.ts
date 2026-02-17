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

export function updateCamera(
  player: Player,
  movingRight: boolean,
  movingLeft: boolean,
  objects: GameObjects,
  thresholdRight: number,
  thresholdLeft: number,
  scrollSpeed: number,
): void {
  if (movingRight && player.getPosition().x > thresholdRight) {
    player.getPosition().x = thresholdRight;
    player.getVelocity().vx = 0;

    objects.platforms.forEach((player) => (player.position.x -= scrollSpeed));
    objects.obstacles.forEach(
      (obstacle) => (obstacle.position.x -= scrollSpeed),
    );
    objects.loot.forEach((loot) => (loot.position.x -= scrollSpeed));
    objects.stairs.forEach((stair) => (stair.position.x -= scrollSpeed));
  } else if (movingLeft && player.getPosition().x < thresholdLeft) {
    player.getPosition().x = thresholdLeft;
    player.getVelocity().vx = 0;

    objects.platforms.forEach((player) => (player.position.x += scrollSpeed));
    objects.obstacles.forEach(
      (obstacle) => (obstacle.position.x += scrollSpeed),
    );
    objects.loot.forEach((loot) => (loot.position.x += scrollSpeed));
    objects.stairs.forEach((stair) => (stair.position.x += scrollSpeed));
  }
}
