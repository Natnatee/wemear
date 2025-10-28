import { useRef } from "react";
import { useLoader } from "@react-three/fiber";
import { TransformControls } from "@react-three/drei";
import { TextureLoader, DoubleSide } from "three";
import projectStore from "../../utils/projectStore";
import { degToRad, createTransformUpdate } from "../../utils/sceneHelpers";

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
      )}
    </>
  );
}

export default ImageObject;
