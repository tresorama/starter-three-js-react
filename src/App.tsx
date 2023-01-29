import { useEffect, useRef } from 'react';
import './App.css';
import { initScene } from './three-scene';

function App() {
  const nodeCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!nodeCanvasRef.current) return;
    const cleanup = initScene(nodeCanvasRef.current);
    return cleanup;
  }, []);

  return (
    <>
      <div className="canvas-container">
        <canvas ref={nodeCanvasRef} />
      </div>
      <div className="page"></div>
    </>
  );
}

export default App;
