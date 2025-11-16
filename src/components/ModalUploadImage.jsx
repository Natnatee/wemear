import React, { useState } from "react";
import axiosAdmin from "../utils/axiosAdmin";

// Minimal reusable uploader
// Props: isOpen (bool), isClose (fn), setSrc (fn), src (string)
const ModalUploadImage = ({ isOpen, isClose, setSrc }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    setError(null);
    setFile(f);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(f);
  };

  const upload = async () => {
    if (!file) return;
    setIsUploading(true);
    setError(null);
    try {
      // create a unique filename
      const ext = (file.name.match(/\.([0-9a-z]+)(?:[?#]|$)/i) || [
        "",
        "jpg",
      ])[1];
      const filename = `upload_${Date.now()}_${Math.floor(
        Math.random() * 10000
      )}.${ext}`;
      const filepath = `project-card/${filename}`;

      const fileData = await file.arrayBuffer();
      const resp = await axiosAdmin.post(
        `/storage/v1/object/${filepath}`,
        fileData,
        {
          headers: { "Content-Type": file.type },
        }
      );

      if (resp.status === 200 || resp.status === 201) {
        const imageUrl = `https://supabase.wemear.com/storage/v1/object/public/${filepath}?t=${Date.now()}`;
        if (typeof setSrc === "function") setSrc(imageUrl);
        // close
        if (typeof isClose === "function") isClose();
        // reset
        setFile(null);
        setPreview(null);
      } else {
        setError("Upload failed.");
      }
    } catch (err) {
      console.error(err);
      setError("Upload error");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) =>
        e.target === e.currentTarget &&
        (typeof isClose === "function" ? isClose() : null)
      }
    >
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Upload Image</h3>
          <button
            onClick={() => (typeof isClose === "function" ? isClose() : null)}
            disabled={isUploading}
          >
            ×
          </button>
        </div>

        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </div>

        {preview && (
          <div className="mb-4">
            <img
              src={preview}
              alt="preview"
              className="w-full h-48 object-cover rounded"
            />
          </div>
        )}

        {error && <div className="mb-4 text-red-600">{error}</div>}

        <div className="flex justify-end gap-2">
          <button
            onClick={() => (typeof isClose === "function" ? isClose() : null)}
            disabled={isUploading}
            className="px-4 py-2 bg-gray-100 rounded"
          >
            Cancel
          </button>
          <button
            onClick={upload}
            disabled={!file || isUploading}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalUploadImage;
