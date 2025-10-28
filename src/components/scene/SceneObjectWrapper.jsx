import { useMemo } from "react";
import { parseSafeConfig } from "../../utils/sceneHelpers";
import Model3D from "./Model3D";
import VideoObject from "./VideoObject";
import ImageObject from "./ImageObject";

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
