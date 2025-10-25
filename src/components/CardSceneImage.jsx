import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CardSceneImage = ({ card }) => {
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          {/* backdrop */}
          <div
            className="absolute inset-0"
            onClick={() => setOpen(false)}
          />

          {/* modal - ใช้ flex column เพื่อจัดเรียงรูปและข้อมูล */}
          <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-4 py-6 sm:px-8 sm:py-8">
            {/* container สำหรับรูป - ใช้พื้นที่ 70% ของความสูง */}
            <div className="flex items-center justify-center w-full max-h-[70vh] mb-4">
              <img
                src={card.imgsrc}
                alt={card.scene_id}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* ข้อมูลและปุ่ม - พื้นหลังขาว */}
            <div className="bg-white rounded-lg p-4 shadow-lg max-w-2xl w-full mx-4">
              <div className="text-lg font-semibold">{card.scene_id}</div>
              <div className="mt-2 text-sm text-gray-600">
                Track: {card.track_id} · Scene: {card.scene_key}
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    const currentStateValue = `IMAGE_${card.track_id}${card.scene_key}`;
                    localStorage.setItem('CurrentState', currentStateValue);
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

export default CardSceneImage;
