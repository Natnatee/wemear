import React, { useState } from 'react';
import TestArMind from '../components/tests/TestArMind';
// TODO: Import Component ทดสอบอื่นๆ ที่จะสร้างในอนาคต เช่น
// import TestMediaPipe from '../components/tests/TestMediaPipe';

const tests = {
  'ar-mind': {
    name: 'MindAR - (3D Basic Test)',
    Component: TestArMind,
  },
  // 'mediapipe': {
  //   name: 'MediaPipe - Hand Tracking',
  //   Component: TestMediaPipe,
  // },
  // สามารถเพิ่มการทดสอบ 3D อื่นๆ ได้ที่นี่
};

function TestPage() {
  const [activeTest, setActiveTest] = useState('ar-mind');
  
  // ดึง Component ที่เลือกมาแสดง
  const ActiveComponent = tests[activeTest].Component;

  return (
    <div style={{ padding: '20px' }}>
      <h1>หน้าทดสอบ Component AR / 3D</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <strong>เลือก Component ที่จะทดสอบ: </strong>
        {Object.keys(tests).map((key) => (
          <button
            key={key}
            onClick={() => setActiveTest(key)}
            style={{ 
              marginRight: '10px', 
              padding: '8px 15px',
              backgroundColor: activeTest === key ? '#007bff' : '#ccc',
              color: activeTest === key ? 'white' : 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {tests[key].name}
          </button>
        ))}
      </div>

      <hr />
      
      {/* ส่วนแสดง Component ที่เลือก */}
      <div style={{ border: '1px solid #ccc', padding: '15px', minHeight: '500px' }}>
        <ActiveComponent />
      </div>
    </div>
  );
}

export default TestPage;
