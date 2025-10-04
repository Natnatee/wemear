import React, { Suspense, useState, useEffect, useRef } from "react";
// นำเข้า ARView และส่วนประกอบอื่นๆ จาก react-three-mind และ mind-ar
import { ARView, ARAnchor } from "react-three-mind";

// Component สำหรับแสดง 3D object เมื่อตรวจจับภาพได้
function ARTrackedObject() {
  const meshRef = useRef();

  useEffect(() => {
    if (meshRef.current) {
      // เพิ่ม animation ให้ object หมุน
      meshRef.current.rotation.x = 0;
      meshRef.current.rotation.y = 0;
    }
  }, []);

  return (
    <group>
      {/* กล่องหลัก */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="blue" />
      </mesh>

      {/* ลูกบอลเล็กๆ ลอยอยู่ด้านบน */}
      <mesh position={[0, 0.8, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="yellow" emissive="yellow" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

// Component สำหรับแสดงเมื่อไม่พบภาพเป้าหมาย
function NotFoundTarget() {
  return (
    <mesh position={[0, 0, -2]}>
      <planeGeometry args={[2, 1]} />
      <meshBasicMaterial color="red" transparent opacity={0.7} />
    </mesh>
  );
}

function TestArMind() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [targetFound, setTargetFound] = useState(false);
  const [error, setError] = useState(null);

  // กำหนด image target สำหรับการติดตาม
  const imageTargets = {
    // ในที่นี้ใช้ตัวอย่างชื่อ target เป็น "test-target"
    // ในทางปฏิบัติ คุณจะต้องสร้างไฟล์ .mind ที่มีข้อมูล image target
    "test-target": {
      url: "/targets/test-target.mind", // ไฟล์ .mind ที่คุณจะต้องสร้าง
    }
  };

  useEffect(() => {
    // จำลองการเริ่มต้น AR
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleARError = (error) => {
    console.error("AR Error:", error);
    setError(error.message || "เกิดข้อผิดพลาดในการเริ่มต้น AR");
  };

  const handleTargetFound = () => {
    setTargetFound(true);
    setIsTracking(true);
  };

  const handleTargetLost = () => {
    setTargetFound(false);
    setIsTracking(false);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "70vh",
        position: "relative",
        backgroundColor: "#000",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: "rgba(0,0,0,0.8)",
          color: "white",
          padding: "10px",
          zIndex: 10,
        }}
      >
        <h3 style={{ margin: 0, fontSize: "16px" }}>
          🧠 MindAR Image Tracking Demo
        </h3>
        <div style={{ fontSize: "12px", opacity: 0.8 }}>
          สถานะ: {isInitialized ? "✅ พร้อมใช้งาน" : "⏳ กำลังเริ่มต้น"}
          {isTracking && " | 🔍 กำลังติดตาม"}
          {targetFound && " | 🎯 พบเป้าหมาย"}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div
          style={{
            position: "absolute",
            top: "60px",
            left: "10px",
            right: "10px",
            backgroundColor: "rgba(255,0,0,0.8)",
            color: "white",
            padding: "8px",
            borderRadius: "4px",
            zIndex: 10,
            fontSize: "12px",
          }}
        >
          ❌ ข้อผิดพลาด: {error}
        </div>
      )}

      {/* Instructions */}
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          left: "10px",
          right: "10px",
          backgroundColor: "rgba(0,0,0,0.7)",
          color: "white",
          padding: "10px",
          borderRadius: "4px",
          fontSize: "12px",
          zIndex: 10,
        }}
      >
        <div>📋 คำแนะนำการใช้งาน:</div>
        <div>• กด "อนุญาต" เมื่อเบราว์เซอร์ขอกล้อง</div>
        <div>• หากยังไม่มีไฟล์ .mind ให้สร้างก่อน</div>
        <div>• ชี้กล้องไปที่ภาพเป้าหมายเพื่อเริ่มติดตาม</div>
      </div>

      {/* AR View */}
      <ARView
        imageTargets={imageTargets}
        onARError={handleARError}
        onTargetFound={handleTargetFound}
        onTargetLost={handleTargetLost}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        {/* แสงสว่างในฉาก AR */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />

        <Suspense fallback={null}>
          {/* แสดง object เมื่อพบภาพเป้าหมาย */}
          <ARAnchor target="test-target">
            <ARTrackedObject />
          </ARAnchor>

          {/* แสดงข้อความเตือนเมื่อไม่พบเป้าหมาย */}
          {!targetFound && <NotFoundTarget />}
        </Suspense>
      </ARView>
    </div>
  );
}

export default TestArMind;
