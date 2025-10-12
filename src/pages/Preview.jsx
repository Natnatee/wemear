import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import SceneImage from '../components/SceneImage';

function Preview() {
  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      position: 'fixed',
      top: 0,
      left: 0,
      margin: 0,
      padding: 0,
      overflow: 'hidden'
    }}>
      <Canvas>
        <Suspense fallback={null}>
          <SceneImage />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default Preview;