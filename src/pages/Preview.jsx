import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import SceneImage from "../components/SceneImage";
import NavbarWithSidebar from "../components/NavbarWithSidebar";
import { make_mind_ar } from "../make_data/make_mind_ar_3.js";

function Preview2() {
  const track = make_mind_ar[0].image_tracking.track4.scene;
  console.log(track);

  return (
    <Preview track={track} />
  );
}

function Preview({ track }) {
  const [scene_image_select, setscene_image_select] = useState([]);

  useEffect(() => {
    if (track && track.scene_1) {
      setscene_image_select(track.scene_1);
    }
  }, [track]);

  const handleSceneChange = (sceneKey) => {
    if (track && track[sceneKey]) {
      setscene_image_select(track[sceneKey]);
    }
  };

  const scenes = track
    ? Object.keys(track).filter((key) => key.startsWith("scene_"))
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
            {sceneKey.replace("_", " ").toUpperCase()}
          </button>
        ))}
      </div>
    </>
  );
}

export default Preview2;
