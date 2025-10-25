import React, { Suspense, useEffect, useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { useLocation } from "react-router-dom";
import SceneImage from "../components/SceneImage";
import NavbarWithSidebar from "../components/NavbarWithSidebar";
import ToolScene from "../components/ToolScene";
import ToolAssets from "../components/ToolAssets";
import projectStore from "../utils/projectStore.js";

function Preview() {
  const projectState = projectStore((state) => state.project);
  const [scene_image_select, setscene_image_select] = useState([]);
  const [currentScene, setCurrentScene] = useState(null);
  console.log("currentScene", currentScene);
  const location = useLocation();
  const { trackId, sceneKey } = location.state || {};
  const track = useMemo(() => {
    // ************************************************
    // ✅ จุดแก้ไขหลัก: เพิ่มการตรวจสอบความปลอดภัยของ projectState
    // ป้องกันการ CRASH เมื่อ projectState.info หรือ projectState.info.tracking_modes เป็น undefined
    // ************************************************
    if (!projectState || !projectState.info?.tracking_modes?.image) {
      return {}; // คืนค่า Object เปล่า เพื่อไม่ให้โค้ดส่วนล่าง Crash
    }

    const sharedAssets = projectState.info.shared_assets || []; // ตั้งเป็น Array เปล่าถ้าไม่มี
    const imageTrackingMode = projectState.info.tracking_modes.image;

    const transformedScenes = {};

    // ใช้ Optional Chaining (?.) สำหรับการวนซ้ำเพื่อความปลอดภัย
    imageTrackingMode.tracks?.forEach((trackItem) => {
      trackItem.scenes?.forEach((scene) => {
        const sceneKey = `IMAGE_${trackItem.track_id}${scene.scene_id}`;

        // ใช้ Array เปล่าแทน scene.assets ที่อาจเป็น undefined
        const assetsToMap = scene.assets || [];

        transformedScenes[sceneKey] = assetsToMap.map((asset) => {
          const sharedAsset = sharedAssets.find(
            (sa) => sa.asset_name === asset.asset_name
          );
          return {
            ...asset,
            src: sharedAsset?.src || "", // ใช้ Optional Chaining
            type: sharedAsset?.type || "", // ใช้ Optional Chaining
          };
        });
      });
    });
    return transformedScenes;
  }, [projectState]);
  console.log(track);

  useEffect(() => {
    if (track) {
      let initialSceneKey = null;
      if (trackId && sceneKey) {
        initialSceneKey = `IMAGE_${trackId}${sceneKey}`;
      } else {
        initialSceneKey = Object.keys(track)[0];
      }

      if (initialSceneKey && track[initialSceneKey]) {
        setscene_image_select(track[initialSceneKey]);
        setCurrentScene(initialSceneKey);
      }
    }
  }, [track, trackId, sceneKey]);

  const handleSceneChange = (sceneKey) => {
    if (track && track[sceneKey]) {
      setscene_image_select(track[sceneKey]);
      setCurrentScene(sceneKey);
    }
  };

  const scenes = track
    ? Object.keys(track).filter((key) => key.startsWith("IMAGE_"))
    : [];

  return (
    <>
      <NavbarWithSidebar />
      <div
        style={{
          height: "100vh",
          width: "100vw",
          position: "fixed",
          top: 0,
          left: 0,
          margin: 0,
          padding: 0,
          overflow: "hidden",
        }}
      >
        <Canvas>
          <Suspense fallback={null}>
            <SceneImage scene={scene_image_select} />
          </Suspense>
        </Canvas>
      </div>
      <ToolAssets currentState={currentScene} />
      <ToolScene
        scenes={scenes}
        handleSceneChange={handleSceneChange}
        currentScene={currentScene}
      />
    </>
  );
}

export default Preview;
