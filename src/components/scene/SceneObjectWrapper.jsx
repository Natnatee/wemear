import { useRef, useMemo, useState } from "react";
import { useLoader } from "@react-three/fiber";
import { TransformControls, Html } from "@react-three/drei";
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
 * Component สำหรับปุ่มลบ (กากบาท) ที่มุมบนขวา
 */
function DeleteButton({ position, onDelete }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Html position={position}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowModal(true);
          }}
          className="bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg cursor-pointer"
          style={{ transform: "translate(50%, -50%)" }}
        >
          ✕
        </button>
      </Html>

      {showModal && (
        <Html>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={(e) => {
              e.stopPropagation();
              setShowModal(false);
            }}
          >
            <div
              className="bg-white rounded-lg p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold mb-4">ยืนยันการลบ</h3>
              <p className="mb-6">คุณต้องการลบวัตถุนี้หรือไม่?</p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowModal(false);
                  }}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                    setShowModal(false);
                  }}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
                >
                  ลบ
                </button>
              </div>
            </div>
          </div>
        </Html>
      )}
    </>
  );
}

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
  const removeAssetFromScene = projectStore(
    (state) => state.removeAssetFromScene
  );
  const clearCurrentAssetSelect = projectStore(
    (state) => state.clearCurrentAssetSelect
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

    // Clear selection หลังจากลาก/หมุนเสร็จ
    clearCurrentAssetSelect();
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
          <DeleteButton
            position={[
              safe.position.x + safe.scale.x * 0.5,
              safe.position.y + safe.scale.y * 0.5,
              safe.position.z,
            ]}
            onDelete={() => removeAssetFromScene(safe.asset_id)}
          />
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
  const removeAssetFromScene = projectStore(
    (state) => state.removeAssetFromScene
  );
  const clearCurrentAssetSelect = projectStore(
    (state) => state.clearCurrentAssetSelect
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

    // Clear selection หลังจากลาก/หมุนเสร็จ
    clearCurrentAssetSelect();
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
          <DeleteButton
            position={[
              safe.position.x + safe.scale.x * 0.5,
              safe.position.y + safe.scale.y * 0.5,
              safe.position.z,
            ]}
            onDelete={() => removeAssetFromScene(safe.asset_id)}
          />
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
  const removeAssetFromScene = projectStore(
    (state) => state.removeAssetFromScene
  );
  const clearCurrentAssetSelect = projectStore(
    (state) => state.clearCurrentAssetSelect
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

    // Clear selection หลังจากลาก/หมุนเสร็จ
    clearCurrentAssetSelect();
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
          <DeleteButton
            position={[
              safe.position.x + safe.scale.x * 0.5,
              safe.position.y + safe.scale.y * 0.5,
              safe.position.z,
            ]}
            onDelete={() => removeAssetFromScene(safe.asset_id)}
          />
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
