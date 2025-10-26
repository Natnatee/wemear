import React, { useEffect, useMemo, useRef } from "react";
import { useThree, useLoader, extend } from "@react-three/fiber";
import {
  OrbitControls,
  Plane,
  Grid,
  TransformControls,
} from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { TextureLoader, VideoTexture, DoubleSide } from "three";
import * as THREE from "three";
import projectStore from "../utils/projectStore";

// Extend THREE namespace เพื่อรองรับ video element
extend({ VideoTexture });

function SceneImage({ scene }) {
  const { scene: threeScene } = useThree();
  const currentAssetSelect = projectStore((state) => state.currentAssetSelect);
  const orbitControlsRef = useRef();

  console.log("SceneImage:", scene);
  // ตั้งค่าแสงเหมือนใน modelViewer.js
  const lights = useMemo(() => {
    const ambientLight = new THREE.AmbientLight(0xfff5cc, 2);
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight1.position.set(5, 10, 5);
    directionalLight1.castShadow = true;
    directionalLight1.shadow.mapSize.width = 1024;
    directionalLight1.shadow.mapSize.height = 1024;
    directionalLight1.shadow.camera.near = 0.5;
    directionalLight1.shadow.camera.far = 50;

    const directionalLight2 = new THREE.DirectionalLight(0xaaaaaa, 2);
    directionalLight2.position.set(-5, 5, -5);

    return [ambientLight, directionalLight1, directionalLight2];
  }, []);

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

// Component แยกสำหรับจัดการแต่ละ object เพื่อหลีกเลี่ยงปัญหา conditional hooks
function SceneObjectWrapper({ config, index, isSelected, orbitControlsRef }) {
  const safe = useMemo(() => {
    const def = { x: 0, y: 0.05, z: 0 };
    const defScale = { x: 1, y: 1, z: 1 };
    const defRotation = { x: 0, y: 0, z: 0 };

    return {
      src: config?.src || null,
      type: config?.type,
      position: {
        x: config?.position?.[0] ?? def.x,
        y: config?.position?.[1] ?? def.y,
        z: config?.position?.[2] ?? def.z,
      },
      scale: {
        x: config?.scale?.[0] ?? defScale.x,
        y: config?.scale?.[1] ?? defScale.y,
        z: config?.scale?.[2] ?? defScale.z,
      },
      rotation: {
        x: config?.rotation?.[0] ?? defRotation.x,
        y: config?.rotation?.[1] ?? defRotation.y,
        z: config?.rotation?.[2] ?? defRotation.z,
      },
    };
  }, [config]);

  if (!safe.src) {
    console.warn(
      `Object config at index ${index} has no src and will be skipped.`
    );
    return null;
  }

  if (safe.type === "3D Model" || !safe.type) {
    return (
      <Model3D
        safe={safe}
        isSelected={isSelected}
        orbitControlsRef={orbitControlsRef}
      />
    );
  }

  if (safe.type === "Video") {
    return (
      <VideoObject
        safe={safe}
        isSelected={isSelected}
        orbitControlsRef={orbitControlsRef}
      />
    );
  }

  if (safe.type === "Image") {
    return (
      <ImageObject
        safe={safe}
        isSelected={isSelected}
        orbitControlsRef={orbitControlsRef}
      />
    );
  }

  return null;
}

// Component สำหรับ 3D Models
function Model3D({ safe, isSelected, orbitControlsRef }) {
  const gltf = useLoader(GLTFLoader, safe.src);
  const degToRad = (d) => (d * Math.PI) / 180;
  const setCurrentAssetSelect = projectStore(
    (state) => state.setCurrentAssetSelect
  );
  const groupRef = useRef();

  const model = useMemo(() => {
    const clonedScene = gltf.scene.clone();
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clonedScene;
  }, [gltf]);

  return (
    <>
      <group
        ref={groupRef}
        position={[safe.position.x, safe.position.y, safe.position.z]}
        rotation={[
          degToRad(safe.rotation.x),
          degToRad(safe.rotation.y),
          degToRad(safe.rotation.z),
        ]}
        scale={[safe.scale.x, safe.scale.y, safe.scale.z]}
        onClick={(e) => {
          e.stopPropagation();
          console.log("Clicked 3D Model:", safe);
          setCurrentAssetSelect(safe);
        }}
      >
        <primitive object={model} />
      </group>
      {isSelected && groupRef.current && (
        <TransformControls
          object={groupRef.current}
          mode="translate"
          onMouseDown={() => {
            console.log("🟡 กำลังลาก - เริ่มต้น");
            console.log("Group position:", groupRef.current.position);
            console.log("Model position:", model.position);
            orbitControlsRef.current &&
              (orbitControlsRef.current.enabled = false);
          }}
          onMouseUp={() => {
            console.log("🟢 หยุดลาก");
            console.log("Group position:", groupRef.current.position);
            console.log("Model position:", model.position);
            orbitControlsRef.current &&
              (orbitControlsRef.current.enabled = true);
          }}
          onChange={() => {
            console.log("🔵 กำลังลาก...");
            console.log("Group position:", groupRef.current.position);
            console.log("Model position:", model.position);
          }}
        />
      )}
    </>
  );
}

// Component สำหรับ Videos
function VideoObject({ safe, isSelected, orbitControlsRef }) {
  const degToRad = (d) => (d * Math.PI) / 180;
  const setCurrentAssetSelect = projectStore(
    (state) => state.setCurrentAssetSelect
  );
  const meshRef = useRef();

  const texture = useMemo(() => {
    const video = document.createElement("video");
    video.src = safe.src;
    video.crossOrigin = "anonymous";
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;

    // พยายามเล่นวิดีโอ
    const playVideo = async () => {
      try {
        await video.play();
      } catch (error) {
        console.warn("Autoplay was prevented:", error);
      }
    };

    // รอให้วิดีโอพร้อมแล้วจึงเล่น
    if (video.readyState >= 2) {
      playVideo();
    } else {
      video.addEventListener(
        "canplay",
        () => {
          playVideo();
        },
        { once: true }
      );
    }

    return new VideoTexture(video);
  }, [safe.src]);

  return (
    <>
      <mesh
        ref={meshRef}
        position={[safe.position.x, safe.position.y, safe.position.z]}
        rotation={[
          degToRad(safe.rotation.x),
          degToRad(safe.rotation.y),
          degToRad(safe.rotation.z),
        ]}
        scale={[safe.scale.x, safe.scale.y, safe.scale.z]}
        onClick={(e) => {
          e.stopPropagation();
          console.log("Clicked Video:", safe);
          setCurrentAssetSelect(safe);
        }}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={texture} side={DoubleSide} />
      </mesh>
      {isSelected && meshRef.current && (
        <TransformControls
          object={meshRef.current}
          mode="translate"
          onMouseDown={() =>
            orbitControlsRef.current &&
            (orbitControlsRef.current.enabled = false)
          }
          onMouseUp={() =>
            orbitControlsRef.current &&
            (orbitControlsRef.current.enabled = true)
          }
        />
      )}
    </>
  );
}

// Component สำหรับ Images
function ImageObject({ safe, isSelected, orbitControlsRef }) {
  const texture = useLoader(TextureLoader, safe.src);
  const degToRad = (d) => (d * Math.PI) / 180;
  const setCurrentAssetSelect = projectStore(
    (state) => state.setCurrentAssetSelect
  );
  const meshRef = useRef();

  return (
    <>
      <mesh
        ref={meshRef}
        position={[safe.position.x, safe.position.y, safe.position.z]}
        rotation={[
          degToRad(safe.rotation.x),
          degToRad(safe.rotation.y),
          degToRad(safe.rotation.z),
        ]}
        scale={[safe.scale.x, safe.scale.y, safe.scale.z]}
        onClick={(e) => {
          e.stopPropagation();
          console.log("Clicked Image:", safe);
          setCurrentAssetSelect(safe);
        }}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={texture} side={DoubleSide} />
      </mesh>
      {isSelected && meshRef.current && (
        <TransformControls
          object={meshRef.current}
          mode="translate"
          onMouseDown={() =>
            orbitControlsRef.current &&
            (orbitControlsRef.current.enabled = false)
          }
          onMouseUp={() =>
            orbitControlsRef.current &&
            (orbitControlsRef.current.enabled = true)
          }
        />
      )}
    </>
  );
}

export default SceneImage;
