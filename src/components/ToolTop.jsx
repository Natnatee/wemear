import React, { useState, useEffect } from "react";

// Horizontal top tool bar, centered at the top of the viewport.
// 5 buttons horizontally; first labeled "save". Simple inline styles.
const ToolTop = ({ onSave }) => {
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  useEffect(() => {
    let t;
    if (status === "success") {
      t = setTimeout(() => setStatus("idle"), 1800);
    } else if (status === "error") {
      t = setTimeout(() => setStatus("idle"), 3000);
    }
    return () => clearTimeout(t);
  }, [status]);

  const handleSave = async () => {
    if (status === "loading") return; // prevent double clicks
    if (typeof onSave !== "function") {
      console.log("ToolTop: save clicked");
      return;
    }

    try {
      setStatus("loading");
      await onSave();
      setStatus("success");
    } catch (err) {
      console.error("ToolTop onSave error:", err);
      setStatus("error");
    }
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
    minWidth: 92,
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
    transition:
      "transform 160ms ease, background-color 160ms ease, opacity 160ms",
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
        style={{
          ...btnStyle,
          opacity: status === "loading" ? 0.9 : 1,
          transform: status === "loading" ? "scale(0.98)" : "scale(1)",
          background:
            status === "success"
              ? "linear-gradient(90deg,#9ae6b4,#63b3ed)"
              : status === "error"
              ? "#feb2b2"
              : btnStyle.background,
          cursor: status === "loading" ? "wait" : btnStyle.cursor,
        }}
        disabled={status === "loading"}
      >
        {status === "loading" ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 14,
                height: 14,
                border: "2px solid rgba(255,255,255,0.9)",
                borderTop: "2px solid rgba(255,255,255,0.2)",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <span style={{ color: "#fff", fontWeight: 600 }}>Saving</span>
          </div>
        ) : status === "success" ? (
          <span style={{ color: "#fff", fontWeight: 600 }}>Saved</span>
        ) : status === "error" ? (
          <span style={{ color: "#6b1a1a", fontWeight: 600 }}>Error</span>
        ) : (
          "save"
        )}
      </button>

      {[1, 2, 3, 4].map((i) => (
        <button
          key={i}
          type="button"
          aria-hidden="true"
          disabled={status === "loading"}
          style={placeholderStyle}
        />
      ))}

      {/* spinner keyframes */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default ToolTop;
