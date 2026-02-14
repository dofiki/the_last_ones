import { useEffect, useRef } from "react";
import { Player } from "./classes/Player";
import { Platform } from "./classes/Platform";
import { useKeyboard } from "./hooks/useKeyboard";

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const playerRef = useRef<Player | null>(null);
  const platformRef = useRef<Platform | null>(null);
  const GRAVITY : number = 0.1;
  const keys = useKeyboard();

  // initialize game objects
  useEffect(()=>{
    if (!playerRef.current && canvasRef.current) {
    playerRef.current = new Player(50, 50, 50, 50, GRAVITY);
    platformRef.current = new Platform(200, 340, 100, 20);
  }
      
    })

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
      playerRef.current?.update(ctx, canvas.height);
      // drawing platform
      platformRef.current?.draw(ctx)
      
      requestAnimationFrame(gameLoop)
    };

    gameLoop(); 

  });

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
      />
    </div>
  );
};

export default App;
