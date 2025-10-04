import React, { useRef } from 'react';
import { useFrame, Canvas } from '@react-three/fiber';

// Component ทดสอบพื้นฐาน (หมุนกล่อง)
function RotatingBox(props) {
  const meshRef = useRef();
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh {...props} ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="teal" />
    </mesh>
  );
}

function TestArMind() {
  // TODO: ส่วนนี้คือที่ที่คุณจะรวมโค้ด MindAR (อาจจะใช้ MindARThree)
  // เนื่องจาก MindAR มักจะต้องการ DOM element ในการเริ่มต้น
  // การรวม MindAR กับ R3F โดยตรงอาจต้องใช้ Hooks หรือ Library เสริม

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <h2>ทดสอบ MindAR (จำลอง R3F Canvas)</h2>
      <p>⚠️ **หมายเหตุ:** ในการใช้ MindAR จริง คุณต้องเขียนโค้ดเพื่อผนวก MindAR-Three.js เข้ากับ DOM/Canvas ของคุณโดยตรง หรือใช้ไลบรารีช่วยอย่าง `react-three-mind`</p>
      
      <Canvas style={{ background: '#f0f0f0', height: '400px' }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <RotatingBox position={[0, 0, 0]} />
      </Canvas>
      
    </div>
  );
}

export default TestArMind;