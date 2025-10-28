import React, { useEffect, useMemo, useRef } from "react";
import { useThree, extend } from "@react-three/fiber";
import { OrbitControls, Plane, Grid } from "@react-three/drei";
import { VideoTexture } from "three";
import * as THREE from "three";
import projectStore from "../utils/projectStore";
import { createSceneLights } from "../utils/threeHelpers";
import SceneObjectWrapper from "./scene/SceneObjectWrapper";

// Extend THREE namespace เพื่อรองรับ video element
extend({ VideoTexture });

function SceneImage({ scene }) {
  const { scene: threeScene } = useThree();
  const currentAssetSelect = projectStore((state) => state.currentAssetSelect);
  const orbitControlsRef = useRef();

  console.log("SceneImage:", scene);

  // ตั้งค่าแสงเหมือนใน modelViewer.js
  const lights = useMemo(() => createSceneLights(), []);

  // เพิ่มแสงเข้า scene
  useEffect(() => {
    lights.forEach((light) => threeScene.add(light));
    return () => {
      lights.forEach((light) => threeScene.remove(light));
    };
  }, [threeScene, lights]);

  return (
    <>
      {/* Camera Controls */}
      <OrbitControls
        ref={orbitControlsRef}
        enableDamping
        dampingFactor={0.05}
        screenSpacePanning={false}
        minDistance={1}
        maxDistance={50}
        enablePan
        enableZoom
        mouseButtons={{
          LEFT: null, // ปิดการหมุนด้วยเมาส์ซ้าย
          MIDDLE: THREE.MOUSE.ROTATE, // ใช้ scroll wheel (กดล้อ) ในการหมุน
          RIGHT: THREE.MOUSE.PAN, // ใช้เมาส์ขวาในการ pan
        }}
      />

      {/* พื้นและ Grid สำหรับ reference */}
      <Plane
        args={[10, 10]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#ffffff" />
      </Plane>

      <Grid
        position={[0, -0.99, 0]}
        args={[10, 10]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#444444"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#000000"
        fadeDistance={25}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid={false}
      />

      {/* ระนาบอ้างอิงโปร่งใส */}
      <mesh position={[0, 0.011, 0]}>
        <planeGeometry args={[2, 2]} />
        <meshBasicMaterial color="#00ffff" wireframe />
      </mesh>

      {/* แสดงผล objects จาก scene data */}
      {scene.map((config, index) => (
        <SceneObjectWrapper
          key={config?.asset_id || index}
          config={config}
          index={index}
          isSelected={currentAssetSelect?.src === config?.src}
          orbitControlsRef={orbitControlsRef}
        />
      ))}
    </>
  );
}

export default SceneImage;
