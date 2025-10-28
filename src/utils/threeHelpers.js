import * as THREE from "three";

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
