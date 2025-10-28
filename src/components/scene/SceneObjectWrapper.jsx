import { useRef, useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { TransformControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { VideoTexture, TextureLoader, DoubleSide } from "three";
import projectStore from "../../utils/projectStore";
import {
  degToRad,
  createTransformUpdate,
  parseSafeConfig,
  setupModel,
  createVideoElement,
} from "../../utils/sceneHelpers";

/**
 * Component สำหรับแสดง 3D Models
 */
function Model3D({ safe, isSelected, orbitControlsRef }) {
  const gltf = useLoader(GLTFLoader, safe.src);
  const setCurrentAssetSelect = projectStore(
    (state) => state.setCurrentAssetSelect
  );
  const updateAssetTransform = projectStore(
    (state) => state.updateAssetTransform
  );
  const groupRef = useRef();

  const model = useMemo(() => {
    const scene = gltf.scene;
    setupModel(scene);
    console.log("🎯 Model loaded - Original position:", scene.position);
    return scene;
  }, [gltf]);

  const handleTransformEnd = () => {
    console.log("🟢 หยุดลาก");
    const pos = groupRef.current.position;
    const rot = groupRef.current.rotation;
    const scale = groupRef.current.scale;

    console.log("🎯 New position:", [pos.x, pos.y, pos.z]);
    updateAssetTransform(safe.asset_id, createTransformUpdate(pos, rot, scale));

    if (orbitControlsRef.current) {
      orbitControlsRef.current.enabled = true;
    }
  };

  return (
    <>
      <primitive
        ref={groupRef}
        object={model}
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
      />
      {isSelected && groupRef.current && (
        <>
          <TransformControls
            object={groupRef.current}
            mode="translate"
            onMouseDown={() => {
              console.log("🟡 กำลังลาก - เริ่มต้น");
              if (orbitControlsRef.current) {
                orbitControlsRef.current.enabled = false;
              }
            }}
            onMouseUp={handleTransformEnd}
          />
          <TransformControls
            object={groupRef.current}
            mode="rotate"
            size={0.5}
            onMouseDown={() => {
              console.log("🔄 กำลังหมุน - เริ่มต้น");
              if (orbitControlsRef.current) {
                orbitControlsRef.current.enabled = false;
              }
            }}
            onMouseUp={handleTransformEnd}
          />
        </>
      )}
    </>
  );
}

/**
 * Component สำหรับแสดง Videos
 */
function VideoObject({ safe, isSelected, orbitControlsRef }) {
  const setCurrentAssetSelect = projectStore(
    (state) => state.setCurrentAssetSelect
  );
  const updateAssetTransform = projectStore(
    (state) => state.updateAssetTransform
  );
  const meshRef = useRef();

  const texture = useMemo(() => {
    const video = createVideoElement(safe.src);
    return new VideoTexture(video);
  }, [safe.src]);

  const handleTransformEnd = () => {
    const pos = meshRef.current.position;
    const rot = meshRef.current.rotation;
    const scale = meshRef.current.scale;

    updateAssetTransform(safe.asset_id, createTransformUpdate(pos, rot, scale));

    if (orbitControlsRef.current) {
      orbitControlsRef.current.enabled = true;
    }
  };

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
        <>
          <TransformControls
            object={meshRef.current}
            mode="translate"
            onMouseDown={() => {
              if (orbitControlsRef.current) {
                orbitControlsRef.current.enabled = false;
              }
            }}
            onMouseUp={handleTransformEnd}
          />
          <TransformControls
            object={meshRef.current}
            mode="rotate"
            size={0.5}
            onMouseDown={() => {
              if (orbitControlsRef.current) {
                orbitControlsRef.current.enabled = false;
              }
            }}
            onMouseUp={handleTransformEnd}
          />
        </>
      )}
    </>
  );
}

/**
 * Component สำหรับแสดง Images
 */
function ImageObject({ safe, isSelected, orbitControlsRef }) {
  const texture = useLoader(TextureLoader, safe.src);
  const setCurrentAssetSelect = projectStore(
    (state) => state.setCurrentAssetSelect
  );
  const updateAssetTransform = projectStore(
    (state) => state.updateAssetTransform
  );
  const meshRef = useRef();

  const handleTransformEnd = () => {
    const pos = meshRef.current.position;
    const rot = meshRef.current.rotation;
    const scale = meshRef.current.scale;

    updateAssetTransform(safe.asset_id, createTransformUpdate(pos, rot, scale));

    if (orbitControlsRef.current) {
      orbitControlsRef.current.enabled = true;
    }
  };

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
        <>
          <TransformControls
            object={meshRef.current}
            mode="translate"
            onMouseDown={() => {
              if (orbitControlsRef.current) {
                orbitControlsRef.current.enabled = false;
              }
            }}
            onMouseUp={handleTransformEnd}
          />
          <TransformControls
            object={meshRef.current}
            mode="rotate"
            size={0.5}
            onMouseDown={() => {
              if (orbitControlsRef.current) {
                orbitControlsRef.current.enabled = false;
              }
            }}
            onMouseUp={handleTransformEnd}
          />
        </>
      )}
    </>
  );
}

/**
 * Wrapper component สำหรับจัดการแต่ละ object ใน scene
 */
function SceneObjectWrapper({ config, index, isSelected, orbitControlsRef }) {
  const safe = useMemo(() => parseSafeConfig(config), [config]);

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

export default SceneObjectWrapper;
