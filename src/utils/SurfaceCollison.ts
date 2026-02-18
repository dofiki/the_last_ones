import type { Player } from "../classes/Player";

interface Surface {
  position: { x: number; y: number };
  width: number;
}

export function resolveSurfaceCollision(
  player: Player,
  surface: Surface,
): void {
  const playerBottom = player.getPosition().y + player.getHeight();
  const playerLeft = player.getPosition().x;
  const playerRight = player.getPosition().x + player.getWidth();

  const surfaceTop = surface.position.y;
  const surfaceLeft = surface.position.x;
  const surfaceRight = surface.position.x + surface.width;

  const isHorizontallyAligned =
    playerRight > surfaceLeft && playerLeft < surfaceRight;

  if (
    isHorizontallyAligned &&
    playerBottom >= surfaceTop &&
    playerBottom <= surfaceTop + 10 &&
    player.getVelocity().vy >= 0
  ) {
    player.setY(surfaceTop - player.getHeight());
    player.setVY(0);
    player.updateIsGrounded(true);
  }
}
