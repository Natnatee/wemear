import React from "react";

// Horizontal top tool bar, centered at the top of the viewport.
// 5 buttons horizontally; first labeled "save". Simple inline styles.
const ToolTop = ({ onSave }) => {
  const handleSave = () => {
    if (typeof onSave === "function") onSave();
    else console.log("ToolTop: save clicked");
  };

  const barStyle = {
    position: "fixed",
    top: 60,
    left: "50%",
    transform: "translateX(-50%)",
    height: 40,
    minWidth: 700,
    maxWidth: "90%",
    borderRadius: 5,
    background: "",
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: "8px 16px",
    zIndex: 1100,
    userSelect: "none",
  };

  const btnStyle = {
    height: 30,
    minWidth: 72,
    borderRadius: 10,
    border: "none",
    background: "#66d6f9ff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 12px",
    fontSize: 13,
  };

  const placeholderStyle = {
    ...btnStyle,
    background: "transparent",
    boxShadow: "none",
    border: "1px solid rgba(0,0,0,0.06)",
    color: "rgba(0,0,0,0.6)",
  };

  return (
    <div
      style={barStyle}
      role="toolbar"
      aria-orientation="horizontal"
      aria-label="Top tools"
    >
      <button
        type="button"
        aria-label="save"
        title="save"
        onClick={handleSave}
        style={btnStyle}
      >
        save
      </button>

      {[1, 2, 3, 4].map((i) => (
        <button
          key={i}
          type="button"
          aria-hidden="true"
          disabled
          style={placeholderStyle}
        />
      ))}
    </div>
  );
};

export default ToolTop;
