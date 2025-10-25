import React, { Suspense, useEffect, useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import SceneImage from "../components/SceneImage";
import NavbarWithSidebar from "../components/NavbarWithSidebar";
import { make_project } from "../make_data/make_project.js";

function Preview2() {
  const track = useMemo(() => {
    const sharedAssets = make_project.info.shared_assets;
    const imageTrackingMode = make_project.info.tracking_modes.image;

    const transformedScenes = {};

    imageTrackingMode.tracks.forEach(trackItem => {
      trackItem.scenes.forEach(scene => {
        const sceneKey = `IMAGE_${trackItem.track_id}${scene.scene_id}`;
        transformedScenes[sceneKey] = scene.assets.map(asset => {
          const sharedAsset = sharedAssets.find(sa => sa.asset_name === asset.asset_name);
          return {
            ...asset,
            src: sharedAsset ? sharedAsset.src : '',
            type: sharedAsset ? sharedAsset.type : '',
          };
        });
      });
    });
    return transformedScenes;
  }, []);
  console.log(track);

  return (
    <Preview track={track} />
  );
}

function Preview({ track }) {
  const [scene_image_select, setscene_image_select] = useState([]);

  useEffect(() => {
    if (track) {
      const firstSceneKey = Object.keys(track)[0];
      if (firstSceneKey) {
        setscene_image_select(track[firstSceneKey]);
      }
    }
  }, [track]);

  const handleSceneChange = (sceneKey) => {
    if (track && track[sceneKey]) {
      setscene_image_select(track[sceneKey]);
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
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          display: "flex",
          gap: "10px",
        }}
      >
        {scenes.map((sceneKey) => (
          <button
            key={sceneKey}
            onClick={() => handleSceneChange(sceneKey)}
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {sceneKey.replace("IMAGE_", "").replace("S", " Scene ").replace("T", " Track ")}
          </button>
        ))}
      </div>
    </>
  );
}

export default Preview2;
