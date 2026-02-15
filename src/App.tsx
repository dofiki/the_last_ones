import { useEffect, useRef } from "react";
import { Player } from "./classes/Player";
import { Platform } from "./classes/Platform";
import { useKeyboard } from "./hooks/useKeyboard";
import { Obstacle } from "./classes/Obstacle";
import { resolveCollision } from "./utils/Collision";

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const playerRef = useRef<Player | null>(null);
  const platformRef = useRef<Platform | null>(null);
  const obstacleRef = useRef<Obstacle []>([]);
  const GRAVITY : number = 0.09;
  // player controllers
  const keys = useKeyboard();
  

  // initialize game objects
  useEffect(()=>{
    if (!playerRef.current && canvasRef.current) {
    playerRef.current = new Player(50, 50, 50, 50, GRAVITY);
    platformRef.current = new Platform(0, 800, window.innerWidth, 140);
    obstacleRef.current = [
       new Obstacle(400, window.innerHeight -240, 50, 80),
       new Obstacle(500, window.innerHeight - 360, 50, 80),
       new Obstacle(650, window.innerHeight - 450, 80, 20)
    ]
  }
      
}, [])

  // canvas and game loop  
  useEffect(() => {

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;


    // game loop
    const gameLoop = () =>   {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Passing input state to player
      playerRef.current!.handleMovement(keys.current.a, keys.current.d, keys.current.jump);
      playerRef.current?.update(ctx, canvas.width, 800); 
      // drawing platform
      platformRef.current?.draw(ctx)
      // drawing all obstacle 
      obstacleRef.current?.forEach(obstacle => {
        obstacle.draw(ctx);
        
        if(playerRef.current){
          // Resolve collision first
          resolveCollision(playerRef.current, obstacle);

          const playerBottom = playerRef.current.position.y + playerRef.current.height;
          const obstacleTop = obstacle.position.y;
          
          // Player's horizontal position
          const playerLeft = playerRef.current.position.x;
          const playerRight = playerRef.current.position.x + playerRef.current.width;
          
          // Obstacle's horizontal position
          const obstacleLeft = obstacle.position.x;
          const obstacleRight = obstacle.position.x + obstacle.width;

          if(
            Math.abs(playerBottom - obstacleTop) < 2 && 
            playerRight > obstacleLeft &&
            playerLeft < obstacleRight &&
            playerRef.current.velocity.vy >= 0
          ){
            playerRef.current.isGrounded = true;
          }
        }
      });

      requestAnimationFrame(gameLoop)
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
