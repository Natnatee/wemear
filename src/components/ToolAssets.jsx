import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useImageAssets, getImageUrl } from "../hook/useImageAssets";
import { useVideoAssets, getVideoUrl } from "../hook/useVideoAssets";
import { useThreeDAssets, getThreeDUrl } from "../hook/useThreeDAssets";
import { useNavigate } from "react-router-dom";
import projectStore from "../utils/projectStore";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

const ToolAssets = ({ currentState }) => {
  const [selectedAssetType, setSelectedAssetType] = useState(null); // เริ่มต้นยังไม่โดนกด
  const [showModal, setShowModal] = useState(false);
  const [thumbnails, setThumbnails] = useState({});
  const navigate = useNavigate();
  const addAsset = projectStore((state) => state.addAssetToScene);

  // call the image assets hook at top-level (hooks must not be conditional)
  const {
    data: imageAssetsData,
    isLoading: imageLoading,
    error: imageError,
  } = useImageAssets();

  // call the video assets hook at top-level
  const {
    data: videoAssetsData,
    isLoading: videoLoading,
    error: videoError,
  } = useVideoAssets();

  // call the 3D assets hook at top-level
  const {
    data: threeDAssetsData,
    isLoading: threeDLoading,
    error: threeDError,
  } = useThreeDAssets();

  const buttonClasses = (type) =>
    `px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ` +
    (selectedAssetType === type
      ? `bg-blue-500 text-white shadow-lg transform scale-105`
      : `bg-gray-200 text-gray-700 hover:bg-gray-300`);

  const handleButtonClick = (type) => {
    setSelectedAssetType(type);
    setShowModal(true); // เปิด modal เมื่อกดปุ่ม
    console.log("Selected Asset Type:", type);
    console.log("Current State:", currentState);

    // If user clicked Image, log image assets from hook (hook is called at top-level)
    if (type === "Image") {
      // imageAssetsData comes from useImageAssets
      console.log("Image assets loading:", imageLoading);
      console.log("Image assets data:", imageAssetsData);
      if (imageError) console.error("Image assets error:", imageError);
    }

    // If user clicked Video, log video assets from hook
    if (type === "Video") {
      console.log("Video assets loading:", videoLoading);
      console.log("Video assets data:", videoAssetsData);
      if (videoError) console.error("Video assets error:", videoError);
    }

    // If user clicked 3D, log 3D assets from hook
    if (type === "3D") {
      console.log("3D assets loading:", threeDLoading);
      console.log("3D assets data:", threeDAssetsData);
      if (threeDError) console.error("3D assets error:", threeDError);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    // ถ้าต้องการให้การปิด modal ยกเลิกการเลือก ให้ uncomment บรรทัดล่าง
    // setSelectedAssetType(null);
  };

  // ปิด modal เมื่อกด Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") closeModal();
    };
    if (showModal) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showModal]);

  // Generate 3D thumbnail
  const generateThumbnailFromUrl = useCallback(async (url, fileExtension) => {
    if (!["gltf", "glb", "obj"].includes(fileExtension)) {
      return null;
    }

    try {
      const canvas = document.createElement("canvas");
      canvas.width = 200;
      canvas.height = 200;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xffffff);

      const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
      renderer.setSize(200, 200);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);

      let model = null;

      if (fileExtension === "gltf" || fileExtension === "glb") {
        const loader = new GLTFLoader();
        const gltf = await new Promise((resolve, reject) => {
          loader.load(url, resolve, undefined, reject);
        });
        model = gltf.scene;
      } else if (fileExtension === "obj") {
        const loader = new OBJLoader();
        model = await new Promise((resolve, reject) => {
          loader.load(url, resolve, undefined, reject);
        });
        model.traverse((child) => {
          if (child.isMesh) {
            child.material = new THREE.MeshLambertMaterial({ color: 0x888888 });
          }
        });
      }

      if (model) {
        scene.add(model);
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        model.position.sub(center);
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 1.5 / maxDim;
        model.scale.setScalar(scale);

        camera.position.set(2, 1, 2);
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);

        const thumbnail = canvas.toDataURL("image/png");
        renderer.dispose();
        return thumbnail;
      }

      renderer.dispose();
      return null;
    } catch (error) {
      console.error("Error generating 3D preview:", error);
      return null;
    }
  }, []);

  // Generate thumbnails for 3D models
  useEffect(() => {
    const generateAllThumbnails = async () => {
      if (!threeDAssetsData || threeDAssetsData.length === 0) return;

      const newThumbnails = { ...thumbnails };
      const toGenerate = [];

      for (const model of threeDAssetsData) {
        if (newThumbnails[model.id] !== undefined) continue;

        const ext = model.name.split(".").pop().toLowerCase();
        if (["gltf", "glb", "obj"].includes(ext)) {
          toGenerate.push({ model, ext });
          newThumbnails[model.id] = null;
        } else {
          newThumbnails[model.id] = null;
        }
      }

      setThumbnails(newThumbnails);

      await Promise.all(
        toGenerate.map(async ({ model, ext }) => {
          try {
            const url = getThreeDUrl(model.name);
            const thumbnail = await generateThumbnailFromUrl(url, ext);
            setThumbnails((prev) => ({ ...prev, [model.id]: thumbnail }));
          } catch (e) {
            console.log(`Error generating thumbnail for ${model.name}: ${e}`);
            setThumbnails((prev) => ({ ...prev, [model.id]: null }));
          }
        })
      );
    };

    if (selectedAssetType === "3D") {
      generateAllThumbnails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threeDAssetsData, selectedAssetType, generateThumbnailFromUrl]);

  // small Modal component that renders into document.body so it is relative to the browser viewport
  const Modal = ({ open, onClose, children }) => {
    if (!open) return null;
    // guard for SSR / missing document
    if (typeof document === "undefined") return null;

    return createPortal(
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        aria-modal="true"
        role="dialog"
      >
        <div
          className="absolute inset-0 bg-black opacity-40"
          onClick={onClose}
        />
        <div className="relative bg-white rounded-lg shadow-xl w-11/12 max-w-3xl max-h-[90vh] p-6 flex flex-col">
          {children}
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-4 rounded-xl shadow-lg flex flex-col items-center space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Assets</h3>
      <div className="flex flex-col space-y-2">
        <button
          className={buttonClasses("Image")}
          onClick={() => handleButtonClick("Image")}
        >
          Image
        </button>
        <button
          className={buttonClasses("Video")}
          onClick={() => handleButtonClick("Video")}
        >
          Video
        </button>
        <button
          className={buttonClasses("3D")}
          onClick={() => handleButtonClick("3D")}
        >
          3D
        </button>
      </div>

      {/* Modal (rendered with portal so it is positioned relative to the browser viewport) */}
      <Modal open={showModal} onClose={closeModal}>
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold">{selectedAssetType || ""}</h4>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                if (selectedAssetType === "Image") {
                  navigate("/assets/image");
                } else if (selectedAssetType === "Video") {
                  navigate("/assets/video");
                } else if (selectedAssetType === "3D") {
                  navigate("/assets/3d");
                }
              }}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
              aria-label="Add new asset"
            >
              Add
            </button>
            <button
              onClick={closeModal}
              className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
              aria-label="Close modal"
            >
              ปิด
            </button>
          </div>
        </div>

        {selectedAssetType === "Image" && imageAssetsData && (
          <div className="grid grid-cols-4 gap-4 overflow-y-auto flex-grow">
            {imageAssetsData.map((image) => (
              <div
                key={image.id}
                className="cursor-pointer p-2 border rounded-lg hover:shadow-md transition-shadow"
                onClick={() => {
                  console.log("Selected Image:", image);
                  // เพิ่ม src และ type โดยตรงใน image object
                  const assetData = {
                    ...image,
                    src: getImageUrl(image.name),
                    type: "Image",
                  };
                  addAsset(assetData, currentState);
                }}
              >
                <img
                  src={getImageUrl(image.name)}
                  alt={image.name}
                  className="w-full h-20 object-cover rounded-md mb-2"
                />
                <p className="text-xs text-gray-600 truncate">{image.name}</p>
              </div>
            ))}
          </div>
        )}

        {selectedAssetType === "Video" && videoAssetsData && (
          <div className="grid grid-cols-4 gap-4 overflow-y-auto flex-grow">
            {videoAssetsData.map((video) => (
              <div
                key={video.id}
                className="cursor-pointer p-2 border rounded-lg hover:shadow-md transition-shadow"
                onClick={() => {
                  console.log("Selected Video:", video);
                  const assetData = {
                    ...video,
                    src: getVideoUrl(video.name),
                    type: "Video",
                  };
                  addAsset(assetData, currentState);
                }}
              >
                <video
                  src={getVideoUrl(video.name)}
                  className="w-full h-20 object-cover rounded-md mb-2"
                  muted
                />
                <p className="text-xs text-gray-600 truncate">{video.name}</p>
              </div>
            ))}
          </div>
        )}

        {selectedAssetType === "3D" && threeDAssetsData && (
          <div className="grid grid-cols-4 gap-4 overflow-y-auto flex-grow">
            {threeDAssetsData.map((model) => {
              const ext = model.name.split(".").pop().toLowerCase();
              const isSupported = ["gltf", "glb", "obj"].includes(ext);
              const thumbnail = thumbnails[model.id];

              return (
                <div
                  key={model.id}
                  className="cursor-pointer p-2 border rounded-lg hover:shadow-md transition-shadow"
                  onClick={() => {
                    console.log("Selected 3D Model:", model);
                    const assetData = {
                      ...model,
                      src: getThreeDUrl(model.name),
                      type: "3D Model",
                    };
                    addAsset(assetData, currentState);
                  }}
                >
                  {!isSupported || thumbnail === null ? (
                    <div className="w-full h-20 bg-gray-100 rounded-md mb-2 flex items-center justify-center">
                      <span className="text-gray-500 text-xs">📦 3D</span>
                    </div>
                  ) : thumbnail ? (
                    <img
                      src={thumbnail}
                      alt={model.name}
                      className="w-full h-20 object-cover rounded-md mb-2"
                    />
                  ) : (
                    <div className="w-full h-20 bg-gray-100 rounded-md mb-2 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                    </div>
                  )}
                  <p className="text-xs text-gray-600 truncate">{model.name}</p>
                </div>
              );
            })}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ToolAssets;
