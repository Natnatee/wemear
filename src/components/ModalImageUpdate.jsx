import React, { useState } from "react";
import axiosAdmin from "../utils/axiosAdmin";
import projectStore from "../utils/projectStore";

const ModalImageUpdate = ({ isOpen, onClose, projectId }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const setProject = projectStore((state) => state.setProject);
  const project = projectStore((state) => state.project);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // ตรวจสอบว่าเป็นไฟล์รูปภาพ
      if (!file.type.startsWith("image/")) {
        setError("กรุณาเลือกไฟล์รูปภาพเท่านั้น");
        return;
      }

      // ตรวจสอบขนาดไฟล์ (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("ขนาดไฟล์ต้องไม่เกิน 5MB");
        return;
      }

      setSelectedFile(file);
      setError(null);

      // สร้าง preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !projectId) return;

    try {
      setIsUploading(true);
      setError(null);

      // สร้าง filename จาก project_id
      const filename = `${projectId}.jpg`;
      const filepath = `project-card/${filename}`;

      // อ่านไฟล์เป็น binary
      const fileData = await selectedFile.arrayBuffer();

      // อัพโหลดไปที่ Supabase Storage
      const response = await axiosAdmin.post(
        `/storage/v1/object/${filepath}`,
        fileData,
        {
          headers: {
            "Content-Type": selectedFile.type,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        // สร้าง URL ของรูปภาพ
        const imageUrl = `https://supabase.wemear.com/storage/v1/object/public/${filepath}?t=${Date.now()}`;

        // อัพเดท state
        if (project) {
          const updatedProject = {
            ...project,
            project_image: imageUrl,
          };
          setProject(updatedProject);
        }

        // ปิด modal
        onClose();
        resetState();
      }
    } catch (err) {
      console.error("Error uploading image:", err);
      if (err.response?.status === 409) {
        // ถ้าไฟล์มีอยู่แล้ว ใช้ PUT แทน
        try {
          const filename = `${projectId}.jpg`;
          const filepath = `project-card/${filename}`;
          const fileData = await selectedFile.arrayBuffer();

          const response = await axiosAdmin.put(
            `/storage/v1/object/${filepath}`,
            fileData,
            {
              headers: {
                "Content-Type": selectedFile.type,
              },
            }
          );

          if (response.status === 200) {
            const imageUrl = `https://supabase.wemear.com/storage/v1/object/public/${filepath}?t=${Date.now()}`;

            if (project) {
              const updatedProject = {
                ...project,
                image: imageUrl,
              };
              setProject(updatedProject);
            }

            onClose();
            resetState();
            return;
          }
        } catch (updateErr) {
          console.error("Error updating image:", updateErr);
          setError("เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ");
        }
      } else {
        setError("เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const resetState = () => {
    setSelectedFile(null);
    setPreview(null);
    setError(null);
  };

  const handleClose = () => {
    if (!isUploading) {
      resetState();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 animate-slideIn">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">
            อัพเดทรูปภาพโปรเจค
          </h3>
          <button
            onClick={handleClose}
            disabled={isUploading}
            className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* File Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            เลือกรูปภาพ
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
          />
          <p className="text-xs text-gray-500 mt-1">
            รองรับไฟล์: JPG, PNG, GIF (ขนาดไม่เกิน 5MB)
          </p>
        </div>

        {/* Preview */}
        {preview && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ตัวอย่าง
            </label>
            <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={handleClose}
            disabled={isUploading}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                กำลังอัพโหลด...
              </>
            ) : (
              "ยืนยัน"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalImageUpdate;
