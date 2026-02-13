import { useEffect, useRef } from "react";
import { Player } from "./classes/Player";
import { Platform } from "./classes/Platform";

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const playerRef = useRef<Player | null>(null);
  const platformRef = useRef<Platform | null>(null);
  const GRAVITY : number = 0.1;

  useEffect(() => {

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // creating instances
    playerRef.current = new Player(50, 50, 50, 50, GRAVITY);
    platformRef.current = new Platform(200,340, 100, 20);

    // game loop
    const gameLoop = () =>   {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      playerRef.current?.update(ctx, canvas.height);
      platformRef.current?.draw(ctx)
      requestAnimationFrame(gameLoop)
    };

    gameLoop(); 

  }, []);

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
