import { Platform } from "../classes/Platform";
import { Obstacle } from "../classes/Obstacle";
import { Loot } from "../classes/Loot";
import { Player } from "../classes/Player";

export const GRAVITY = 0.09;
export const SCROLL_THRESHOLD_RIGHT = 400;
export const SCROLL_THRESHOLD_LEFT = 100;
export const SCROLL_SPEED = 3.5;

export function createPlayer(): Player {
  return new Player(50, 50, 50, 50, GRAVITY);
}

export function createPlatforms(): Platform[] {
  return [
    new Platform(0, 800, window.innerWidth, 140),
    new Platform(window.innerWidth + 500, 800, window.innerWidth, 140),
  ];
}

export function createObstacles(): Obstacle[] {
  return [
    new Obstacle(400, window.innerHeight - 240, 100, 113),
    new Obstacle(500, window.innerHeight - 360, 100, 30),
    new Obstacle(650, window.innerHeight - 480, 100, 30),
    new Obstacle(500, window.innerHeight - 580, 100, 30),
    new Obstacle(700, window.innerHeight - 680, 300, 30),
    new Obstacle(950, window.innerHeight - 580, 50, 30),
    new Obstacle(1200, window.innerHeight - 400, 100, 30),
    new Obstacle(1400, window.innerHeight - 500, 150, 30),
  ];
}

export function createLoot(): Loot[] {
  return [
    new Loot(965, window.innerHeight - 610, 20, 20),
    new Loot(1215, window.innerHeight - 430, 20, 20),
  ];
}
