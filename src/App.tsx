import { useEffect, useRef } from "react";
import { Player } from "./classes/Player";
import { Platform } from "./classes/Platform";
import { Loot } from "./classes/Loot";
import { useKeyboard } from "./hooks/useKeyboard";
import { Obstacle } from "./classes/Obstacle";
import { Stair } from "./classes/Stair";
import { isColliding, resolveCollision } from "./utils/Collision";

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const playerRef = useRef<Player | null>(null);
  const platformRef = useRef<Platform[]>([]);
  const obstacleRef = useRef<Obstacle[]>([]);
  const stairRef = useRef<Stair[]>([]);
  const lootRef = useRef<Loot[]>([]);
  const GRAVITY: number = 0.09;
  const eWasPressedRef = useRef<boolean>(false); 


  // Screen bounds for camera trigger
  const SCROLL_THRESHOLD_RIGHT = 400;
  const SCROLL_THRESHOLD_LEFT = 100;
  const SCROLL_SPEED = 3.5;
  
  // player controllers
  const keys = useKeyboard();

  // initialize game objects
  useEffect(() => {
    if (!playerRef.current && canvasRef.current) {
      playerRef.current = new Player(50, 50, 50, 50, GRAVITY);
      platformRef.current = [
        new Platform(0, 800, window.innerWidth, 140),
        new Platform(window.innerWidth + 500, 800, window.innerWidth, 140),
      ]
      obstacleRef.current = [
        new Obstacle(400, window.innerHeight - 240, 100, 113),
        new Obstacle(500, window.innerHeight - 360, 100, 30),
        new Obstacle(650, window.innerHeight - 480, 100, 30),
        new Obstacle(500, window.innerHeight - 580, 100, 30),
        new Obstacle(700, window.innerHeight - 680, 300, 30),
        new Obstacle(950, window.innerHeight - 580, 50, 30),
        new Obstacle(1200, window.innerHeight - 400, 100, 30),
        new Obstacle(1400, window.innerHeight - 500, 150, 30),
      ];
      lootRef.current = [
        new Loot(965, window.innerHeight - 610, 20, 20),
        new Loot(1215, window.innerHeight - 430, 20, 20),
      ];
      stairRef.current = []
      
    }
  }, []);

  // canvas and game loop
  useEffect(() => {

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
   
    // for pixelated asset
    // ctx.imageSmoothingEnabled = false;
    /* chekcing assets
    const img = new Image();
    img.src = "/assets/buildings_1_demo.png";
    */

    // game loop
    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      /* chekcing asset
      if (img.complete) {
        ctx.drawImage(img, 100, 100, 200, 300);
      }
      */

      ctx.font = "30px Arial";
      ctx.fillText(`Score: ${playerRef.current?.lootScore}`,80,80);

      if (!playerRef.current || !platformRef.current) return;

      // passing input state to player
      playerRef.current.handleMovement(keys.current.a, keys.current.d, keys.current.jump);

      // handle player power
      const ePressedNow: boolean = keys.current.e;

      if (ePressedNow && !eWasPressedRef.current && playerRef.current.lootScore >= 2) {
        // updating loot score  
        playerRef.current.lootScore -= 2;

          const player = playerRef.current;

          const stairX = player.position.x + player.width + 100;
          const stairY = player.position.y + player.height /2 ;

          stairRef.current.push(new Stair(stairX, stairY, 40, 20));
        }

      eWasPressedRef.current = ePressedNow; 

      playerRef.current.update(ctx, canvas.width, [...platformRef.current, ...stairRef.current]);

      // camera scrolling logic 
      if (keys.current.d && playerRef.current.position.x > SCROLL_THRESHOLD_RIGHT) {
        // moving right : shift everything left
        playerRef.current.velocity.vx = 0;
        playerRef.current.position.x = SCROLL_THRESHOLD_RIGHT;
        
        platformRef.current.forEach((platform=>{
          platform.position.x -= SCROLL_SPEED;        
        }))

        obstacleRef.current.forEach(obstacle => {
          obstacle.position.x -= SCROLL_SPEED;
        });
        lootRef.current.forEach(loot => {
          loot.position.x -= SCROLL_SPEED;
        });
        stairRef.current.forEach((stair)=>{
          stair.position.x -= SCROLL_SPEED;
        })
      } else if (keys.current.a && playerRef.current.position.x < SCROLL_THRESHOLD_LEFT) {
        // moving left : shift everything right
        playerRef.current.velocity.vx = 0;
        playerRef.current.position.x = SCROLL_THRESHOLD_LEFT;
        
        platformRef.current.forEach((platform)=>{
          platform.position.x += SCROLL_SPEED;

        })
        obstacleRef.current.forEach(obstacle => {
          obstacle.position.x += SCROLL_SPEED;
        });
        lootRef.current.forEach(loot => {
          loot.position.x += SCROLL_SPEED;
        });
         stairRef.current.forEach((stair)=>{
          stair.position.x += SCROLL_SPEED;
        })
      }
      // drawing platformLoot
      platformRef.current.forEach((platform) =>{
        platform.draw(ctx)
      })

      // drawing all obstacles
      obstacleRef.current.forEach((obstacle) => {
        obstacle.draw(ctx);

        if (playerRef.current) {
          resolveCollision(playerRef.current, obstacle);

          const playerBottom = playerRef.current.position.y + playerRef.current.height;
          const obstacleTop = obstacle.position.y;
          const playerLeft = playerRef.current.position.x;
          const playerRight = playerRef.current.position.x + playerRef.current.width;
          const obstacleLeft = obstacle.position.x;
          const obstacleRight = obstacle.position.x + obstacle.width;

          if (
            Math.abs(playerBottom - obstacleTop) < 2 &&
            playerRight > obstacleLeft &&
            playerLeft < obstacleRight &&
            playerRef.current.velocity.vy >= 0
          ) {
            playerRef.current.isGrounded = true;
          }
        }
      });

      // loot collection
      lootRef.current = lootRef.current.filter((loot) => {
        loot.draw(ctx);
        if (playerRef.current && isColliding(playerRef.current, loot)) {
          playerRef.current.lootScore += 10;
          console.log(playerRef.current.lootScore);
          return false;
        }
        return true;
      });

      // stairs
      stairRef.current.forEach(stair => {
        stair.draw(ctx);
      });


      playerRef.current.draw(ctx);

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