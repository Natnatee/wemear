import * as THREE from "three";

/**
 * Helper functions for 3D scene transformations and Three.js utilities
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
    rotation: [rotation.x, rotation.y, rotation.z], // เก็บเป็น radians (Three.js format)
    scale: [scale.x, scale.y, scale.z],
  };
};

/**
 * Create lights for the scene (same as modelViewer.js reference)
 */
export const createSceneLights = () => {
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
};

/**
 * Setup model for rendering (traverse and apply properties)
 */
export const setupModel = (scene) => {
  scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  return scene;
};

/**
 * Create video element for video texture
 */
export const createVideoElement = (src) => {
  const video = document.createElement("video");
  video.src = src;
  video.crossOrigin = "anonymous";
  video.loop = true;
  video.muted = true;
  video.playsInline = true;
  video.autoplay = true;

  const playVideo = async () => {
    try {
      await video.play();
    } catch (error) {
      console.warn("Autoplay was prevented:", error);
    }
  };

  if (video.readyState >= 2) {
    playVideo();
  } else {
    video.addEventListener("canplay", () => playVideo(), { once: true });
  }

  return video;
};
