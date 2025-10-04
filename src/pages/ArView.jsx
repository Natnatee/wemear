import React from 'react';
import { Canvas } from '@react-three/fiber';
// import ArScene from '../components/ArScene'; // จะสร้างในขั้นตอนถัดไป

function ArView() {
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        {/*
          TODO: นำเข้า Component AR/3D ของคุณที่นี่
          <Suspense fallback={null}>
            <ArScene />
          </Suspense>
        */}
        
        {/* ตัวอย่าง Object ง่าย ๆ */}
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="hotpink" />
        </mesh>

      </Canvas>
      <p style={{textAlign: 'center'}}>กำลังรัน Three.js Canvas...</p>
    </div>
  );
}

export default ArView;