import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SceneCard = ({ card }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!card) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="bg-white rounded-lg shadow p-3 flex flex-col items-start"
      >
        <img
          src={card.imgsrc}
          alt={card.scene_id}
          className="w-full h-40 object-cover rounded mb-3"
        />
        <div className="text-sm font-medium">{card.scene_id}</div>
        <div className="text-xs text-gray-500">
          Track: {card.track_id} · Scene: {card.scene_key}
        </div>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />

          {/* modal */}
          <div className="relative bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto z-10">
            <img
              src={card.imgsrc}
              alt={card.scene_id}
              className="w-full h-auto object-contain rounded-t-lg bg-black"
            />
            <div className="p-4">
              <div className="text-lg font-semibold">{card.scene_id}</div>
              <div className="mt-2 text-sm text-gray-600">
                Track: {card.track_id} · Scene: {card.scene_key}
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    navigate("/preview");
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Preview
                </button>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SceneCard;
