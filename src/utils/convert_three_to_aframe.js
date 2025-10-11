import * as THREE from "three";

export default function convert_three_to_aframe(threeData) {
  if (!threeData || !threeData["image tracking"]) return threeData;

  const convertedData = { ...threeData };
  const targets = convertedData["image tracking"];

  for (const key in targets) {
    if (!targets[key] || !Array.isArray(targets[key])) continue;
    convertedData["image tracking"][key] = targets[key].map((asset) => ({
      ...asset,
      position: asset.position,
      scale: asset.scale,
      rotation: asset.rotation
        ? asset.rotation.map((rad) => THREE.MathUtils.radToDeg(rad))
        : [0, 0, 0],
    }));
  }

  return convertedData;
}
