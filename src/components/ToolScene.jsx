import React from "react";

function ToolScene({ scenes, handleSceneChange, currentScene }) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
        display: "flex",
        gap: "10px",
        overflowX: "auto",
        maxWidth: "calc(5 * (120px + 10px))", // Assuming button width is ~100px and gap is 10px
        paddingBottom: "10px", // To make scrollbar visible
        scrollbarColor: "#999 transparent", // Firefox
      }}
    >
      {scenes.map((sceneKey) => (
        <button
          key={sceneKey}
          onClick={() => handleSceneChange(sceneKey)}
          style={{
            padding: "10px 20px",
            backgroundColor: currentScene === sceneKey ? "#add8e6" : "#ffffff",
            color: "black",
            border: "1px solid #007bff",
            borderRadius: "5px",
            cursor: "pointer",
            flexShrink: 0, // Prevent buttons from shrinking
          }}
        >
          {sceneKey}
        </button>
      ))}
    </div>
  );
}

export default ToolScene;
