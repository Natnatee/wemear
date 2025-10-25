import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useLocation } from "react-router-dom";
import SceneImage from "../components/SceneImage";
import NavbarWithSidebar from "../components/NavbarWithSidebar";
import projectStore from "../utils/projectStore";



function Preview() {
  const location = useLocation();
  const { trackId, sceneKey } = location.state || {};
  const { project } = projectStore();

  const [scene_image_select, setscene_image_select] = useState([]);
  console.log(trackId, sceneKey);
  useEffect(() => {
    if (project && trackId && sceneKey) {
      const trackData = project.image_tracking[trackId];
      if (trackData && trackData.scene[sceneKey]) {
        setscene_image_select(trackData.scene[sceneKey]);
      }
    } else if (project && project.image_tracking) {
      // Fallback to the first available scene if no specific scene is provided
      const firstTrackKey = Object.keys(project.image_tracking)[0];
      if (firstTrackKey) {
        const firstTrack = project.image_tracking[firstTrackKey];
        const firstSceneKey = Object.keys(firstTrack.scene)[0];
        if (firstSceneKey) {
          setscene_image_select(firstTrack.scene[firstSceneKey]);
        }
      }
    }
  }, [project, trackId, sceneKey]);

  const handleSceneChange = (newSceneKey) => {
    if (project && trackId) {
      const trackData = project.image_tracking[trackId];
      if (trackData && trackData.scene[newSceneKey]) {
        setscene_image_select(trackData.scene[newSceneKey]);
      }
    }
  };

  const scenes = project && trackId && project.image_tracking[trackId]
    ? Object.keys(project.image_tracking[trackId].scene).filter((key) => key.startsWith("scene_"))
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
        {scenes.map((newSceneKey) => (
          <button
            key={newSceneKey}
            onClick={() => handleSceneChange(newSceneKey)}
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {newSceneKey.replace("_", " ").toUpperCase()}
          </button>
        ))}
      </div>
    </>
  );
}


export default Preview;
