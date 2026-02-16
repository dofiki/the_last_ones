import type { Obstacle } from "../classes/Obstacle";
import type { Player } from "../classes/Player";

/* 
Axis-Aligned Bounding Box Collision System: 

For boxes to overlap horizontally:
- Box A's left side must be to the left of Box B's right side, AND
- Box A's right side must be to the right of Box B's left side

For boxes to overlap vertically (same logic):
- Box A's top must be above Box B's bottom, AND
- Box A's bottom must be below Box B's top
*/

export function isColliding(player: Player , obstacle: Obstacle): boolean {
  return (
    player.position.x < obstacle.position.x + obstacle.width &&
    player.position.x + player.width > obstacle.position.x &&
    player.position.y < obstacle.position.y + obstacle.height &&
    player.position.y + player.height > obstacle.position.y
  );
}

export function resolveCollision(player: Player, obstacle: Obstacle): void {

  
  // exit if not colliding
  if (!isColliding(player, obstacle)) return;

  // find overlap
  const overlapLeft = ( player.position.x + player.width ) - obstacle.position.x;
  const overlapRight = (obstacle.position.x + obstacle.width) - player.position.x;
  const overlapTop = (player.position.y + player.height) - obstacle.position.y ;
  const overlapBottom = (obstacle.position.y + obstacle.height) - player.position.y;

  // min overlap 
  const minOverLapX = Math.min(overlapLeft, overlapRight); 
  const minOverLapY = Math.min(overlapTop, overlapBottom);

  // resolving horizontal collision
  if(minOverLapX < minOverLapY){
    // from left 
    if(overlapLeft < overlapRight){
      player.position.x = obstacle.position.x - player.width;
    }else{
      // from right
      player.position.x = obstacle.position.x + obstacle.width;
    }
    player.velocity.vx = 0;
  }
    else{
      // resolving vertical collision
      // from top
      if(overlapTop < overlapBottom){
        player.position.y = obstacle.position.y - player.height;
      }else{
        // from bottom
        player.position.y = obstacle.position.y + obstacle.height;
      }
      
      player.velocity.vy = 0;
    }
  }

