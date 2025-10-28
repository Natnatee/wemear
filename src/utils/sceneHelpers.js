/**
 * Helper functions for 3D scene transformations
 */

// Convert degrees to radians
export const degToRad = (degrees) => {
  return (degrees * Math.PI) / 180;
};

// Convert radians to degrees
export const radToDeg = (radians) => {
  return (radians * 180) / Math.PI;
};

// Parse position from array to object
export const parsePosition = (
  positionArray,
  defaultValue = { x: 0, y: 0.05, z: 0 }
) => {
  if (!positionArray) return defaultValue;
  return {
    x: positionArray[0] ?? defaultValue.x,
    y: positionArray[1] ?? defaultValue.y,
    z: positionArray[2] ?? defaultValue.z,
  };
};

// Parse scale from array to object with type-specific defaults
export const parseScale = (scaleArray, type) => {
  const defaultScaleValue = type === "3D Model" ? 0.1 : 1;
  const defaultScale = {
    x: defaultScaleValue,
    y: defaultScaleValue,
    z: defaultScaleValue,
  };

  if (!scaleArray) return defaultScale;
  return {
    x: scaleArray[0] ?? defaultScale.x,
    y: scaleArray[1] ?? defaultScale.y,
    z: scaleArray[2] ?? defaultScale.z,
  };
};

// Parse rotation from array to object
export const parseRotation = (
  rotationArray,
  defaultValue = { x: 0, y: 0, z: 0 }
) => {
  if (!rotationArray) return defaultValue;
  return {
    x: rotationArray[0] ?? defaultValue.x,
    y: rotationArray[1] ?? defaultValue.y,
    z: rotationArray[2] ?? defaultValue.z,
  };
};

// Parse safe config from raw config
export const parseSafeConfig = (config) => {
  return {
    asset_id: config?.asset_id || null,
    src: config?.src || null,
    type: config?.type,
    position: parsePosition(config?.position),
    scale: parseScale(config?.scale, config?.type),
    rotation: parseRotation(config?.rotation),
  };
};

// Create transform update object from Three.js objects
export const createTransformUpdate = (position, rotation, scale) => {
  return {
    position: [position.x, position.y, position.z],
    rotation: [
      radToDeg(rotation.x),
      radToDeg(rotation.y),
      radToDeg(rotation.z),
    ],
    scale: [scale.x, scale.y, scale.z],
  };
};
