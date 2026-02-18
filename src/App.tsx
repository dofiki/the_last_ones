import { useEffect, useRef } from "react";
import { Player } from "./classes/Player";
import { Loot } from "./classes/Loot";
import { Stair } from "./classes/Stair";
import { Platform } from "./classes/Platform";
import { Obstacle } from "./classes/Obstacle";
import { useKeyboard } from "./hooks/useKeyboard";
import { isColliding } from "./utils/Collision";
import { resolveSurfaceCollision } from "./utils/SurfaceCollison";
import { updateCamera } from "./utils/Camera";
import {
  SCROLL_THRESHOLD_RIGHT,
  SCROLL_THRESHOLD_LEFT,
  SCROLL_SPEED,
  createPlayer,
  createPlatforms,
  createObstacles,
  createLoot,
} from "./constants/gameObject";

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const playerRef = useRef<Player | null>(null);
  const platformRef = useRef<Platform[]>([]);
  const obstacleRef = useRef<Obstacle[]>([]);
  const stairRef = useRef<Stair[]>([]);
  const lootRef = useRef<Loot[]>([]);
  const eWasPressedRef = useRef<boolean>(false);
  const keys = useKeyboard();

  useEffect(() => {
    if (!canvasRef.current) return;
    playerRef.current = createPlayer();
    platformRef.current = createPlatforms();
    obstacleRef.current = createObstacles();
    lootRef.current = createLoot();
    stairRef.current = [];
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const player = playerRef.current;
      if (!player) return;

      // score
      ctx.font = "30px Arial";
      ctx.fillText(`stair power: ${player.getScore()}`, 80, 80);

      // input
      player.handleMovement(keys.current.a, keys.current.d, keys.current.jump);

      // stair placement
      const ePressedNow = keys.current.e;
      if (ePressedNow && !eWasPressedRef.current && player.getScore() >= 2) {
        player.addScore(-2);
        const stairX = player.getPosition().x + player.getWidth() - 20;
        const stairY = player.getPosition().y + player.getHeight() + 5;
        stairRef.current.push(new Stair(stairX, stairY, 40, 20));
      }
      eWasPressedRef.current = ePressedNow;

      // physics
      player.update(ctx);

      // surface collision
      [...platformRef.current, ...stairRef.current].forEach((surface) => {
        resolveSurfaceCollision(player, surface);
      });

      // camera
      updateCamera(
        player,
        keys.current.d,
        keys.current.a,
        {
          platforms: platformRef.current,
          obstacles: obstacleRef.current,
          loot: lootRef.current,
          stairs: stairRef.current,
        },
        SCROLL_THRESHOLD_RIGHT,
        SCROLL_THRESHOLD_LEFT,
        SCROLL_SPEED,
      );

      // draw surfaces
      [...platformRef.current, ...stairRef.current].forEach((s) => s.draw(ctx));

      // obstacles
      obstacleRef.current.forEach((obstacle) => {
        obstacle.draw(ctx);
        resolveSurfaceCollision(player, obstacle);
      });

      // loot
      lootRef.current = lootRef.current.filter((loot) => {
        loot.draw(ctx);
        if (isColliding(player, loot)) {
          player.addScore(10);
          return false;
        }
        return true;
      });

      player.draw(ctx);

      console.log(window.innerWidth);
      requestAnimationFrame(gameLoop);
    };

    gameLoop();
  }, []);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
      />
    </div>
  );
};

export default App;
