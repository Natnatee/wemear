import React, { Suspense, useEffect, useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
// import { useLocation } from "react-router-dom"; // ไม่ใช้แล้ว
import SceneImage from "../components/SceneImage";
import NavbarWithSidebar from "../components/NavbarWithSidebar";
import ToolScene from "../components/ToolScene";
import ToolAssets from "../components/ToolAssets";
import ToolTop from "../components/ToolTop";
import projectStore from "../utils/projectStore.js";
import { useUpdateProject } from "../hook/useProject";
import { useCreateShareProjectAsset } from "../hook/useShareProjectAssets";
import { shareUniqueAssetSrcs } from "../utils/shareUniqueSrcs";

function Preview() {
  const projectState = projectStore((state) => state.project);
  const saveProject = projectStore((state) => state.saveProject);
  const loadProjectFromStorage = projectStore(
    (state) => state.loadProjectFromStorage
  );
  const updateProjectMutation = useUpdateProject();
  const createShareAssetMutation = useCreateShareProjectAsset();
  const [scene_image_select, setscene_image_select] = useState([]);
  const [currentScene, setCurrentScene] = useState(null);
  // const location = useLocation(); // ไม่ใช้แล้ว
  // const { trackId, sceneKey } = location.state || {}; // ไม่ใช้แล้ว

  // โหลด project จาก localStorage เมื่อ component mount
  useEffect(() => {
    if (!projectState) {
      loadProjectFromStorage();
    }
  }, [projectState, loadProjectFromStorage]);

  // Memoize track เพื่อป้องกัน unnecessary recalculation
  const track = useMemo(() => {
    // ************************************************
    // ✅ จุดแก้ไขหลัก: เพิ่มการตรวจสอบความปลอดภัยของ projectState
    // ป้องกันการ CRASH เมื่อ projectState.info หรือ projectState.info.tracking_modes เป็น undefined
    // ************************************************
    if (!projectState || !projectState.info?.tracking_modes?.image) {
      return {}; // คืนค่า Object เปล่า เพื่อไม่ให้โค้ดส่วนล่าง Crash
    }

    // const sharedAssets = projectState.info.shared_assets || []; // ไม่ใช้แล้ว เพราะเปลี่ยนโครงสร้างข้อมูล
    const imageTrackingMode = projectState.info.tracking_modes.image;

    const transformedScenes = {};

    // ใช้ Optional Chaining (?.) สำหรับการวนซ้ำเพื่อความปลอดภัย
    imageTrackingMode.tracks?.forEach((trackItem) => {
      trackItem.scenes?.forEach((scene) => {
        const sceneKey = `IMAGE_${trackItem.track_id}${scene.scene_id}`;

        // ใช้ Array เปล่าแทน scene.assets ที่อาจเป็น undefined
        const assetsToMap = scene.assets || [];

        transformedScenes[sceneKey] = assetsToMap.map((asset) => {
          // ไม่ต้องค้นหาใน shared_assets แล้ว เพราะ src และ type อยู่ใน asset โดยตรง
          return {
            ...asset,
            src: asset.src || "", // ใช้ src จาก asset โดยตรง
            type: asset.type || "", // ใช้ type จาก asset โดยตรง
          };
        });
      });
    });
    return transformedScenes;
  }, [projectState]); // Keep projectState but more specific checks inside
  console.log(track);

  useEffect(() => {
    if (track && currentScene) {
      // ลบเงื่อนไข currentScene === null ออก
      setscene_image_select(track[currentScene]);
    } else if (track && Object.keys(track).length > 0) {
      // กรณีที่ currentScene ยังเป็น null หรือไม่มีค่า ให้ตั้งค่าเริ่มต้น
      let initialSceneKey = localStorage.getItem("CurrentState");
      if (!initialSceneKey) {
        initialSceneKey = Object.keys(track)[0];
      }
      if (initialSceneKey && track[initialSceneKey]) {
        setscene_image_select(track[initialSceneKey]);
        setCurrentScene(initialSceneKey);
      }
    }
  }, [track, currentScene]); // ลบ trackId, sceneKey ออกจาก dependency array

  console.log("currentScene", currentScene);
  console.log("projectState", projectState);
  const handleSceneChange = (sceneKey) => {
    if (track && track[sceneKey]) {
      setscene_image_select(track[sceneKey]);
      setCurrentScene(sceneKey);
      localStorage.setItem("CurrentState", sceneKey); // เพิ่มบรรทัดนี้เพื่อบันทึกใน localStorage
    }
  };

  const scenes = track
    ? Object.keys(track).filter((key) => key.startsWith("IMAGE_"))
    : [];

  return (
    <>
      <NavbarWithSidebar />
      {/* Top-centered horizontal tool bar */}
      <ToolTop
        onSave={async () => {
          console.log("Preview: save clicked (ToolTop)");

          try {
            // 1) Save locally via projectStore
            saveProject();

            // 2) Log project state
            console.log("projectState", projectState);

            // 3) Share unique srcs via shared util
            try {
              await shareUniqueAssetSrcs(
                projectState,
                createShareAssetMutation
              );
            } catch (err) {
              console.error("Preview: Error sharing assets:", err);
            }

            // 4) Trigger update (deploy-like)
            updateProjectMutation.mutate(projectState);
          } catch (e) {
            console.warn("Preview: save/deploy failed", e);
          }
        }}
      />
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
