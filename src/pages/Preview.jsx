import React, { Suspense, useEffect, useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import SceneImage from "../components/SceneImage";
import NavbarWithSidebar from "../components/NavbarWithSidebar";
import ToolScene from "../components/ToolScene";
import projectStore from "../utils/projectStore.js";

function Preview2() {
  const projectState = projectStore((state) => state.project);
  const track = useMemo(() => {
    const sharedAssets = projectState.info.shared_assets;
    const imageTrackingMode = projectState.info.tracking_modes.image;

    const transformedScenes = {};

    imageTrackingMode.tracks.forEach((trackItem) => {
      trackItem.scenes.forEach((scene) => {
        const sceneKey = `IMAGE_${trackItem.track_id}${scene.scene_id}`;
        transformedScenes[sceneKey] = scene.assets.map((asset) => {
          const sharedAsset = sharedAssets.find(
            (sa) => sa.asset_name === asset.asset_name
          );
          return {
            ...asset,
            src: sharedAsset ? sharedAsset.src : "",
            type: sharedAsset ? sharedAsset.type : "",
          };
        });
      });
    });
    return transformedScenes;
  }, []);
  console.log(track);

  return <Preview track={track} />;
}

function Preview({ track }) {
  const [scene_image_select, setscene_image_select] = useState([]);
  const [currentScene, setCurrentScene] = useState(null);

  useEffect(() => {
    if (track) {
      const firstSceneKey = Object.keys(track)[0];
      if (firstSceneKey) {
        setscene_image_select(track[firstSceneKey]);
        setCurrentScene(firstSceneKey);
      }
    }
  }, [track]);

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
      <ToolScene scenes={scenes} handleSceneChange={handleSceneChange} currentScene={currentScene} />
    </>
  );
}

export default Preview2;
