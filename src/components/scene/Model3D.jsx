import { useRef, useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { TransformControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import projectStore from "../../utils/projectStore";
import { degToRad, createTransformUpdate } from "../../utils/sceneHelpers";
import { setupModel } from "../../utils/threeHelpers";

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
      )}
    </>
  );
}

export default Model3D;
