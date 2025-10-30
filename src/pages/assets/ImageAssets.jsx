import React, { useState, useCallback } from "react";
import {
  Image,
  Upload,
  Download,
  Scissors,
  FileText,
  Trash2,
} from "lucide-react";
import NavbarWithSidebar from "../../components/NavbarWithSidebar";
import {
  useImageAssets,
  useUploadImage,
  useDeleteImage,
  getImageUrl,
} from "../../hook/useImageAssets";
import { useShareProjectAssets } from "../../hook/useShareProjectAssets";
import { useDropzone } from "react-dropzone";

export default function ImageAssets() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [fileName, setFileName] = useState("");
  const [draggedFile, setDraggedFile] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    imageName: null,
    usedInProjects: [],
  });

  const { data: images, isLoading, error } = useImageAssets();
  const { data: shareProjectAssets } = useShareProjectAssets();
  const uploadMutation = useUploadImage();
  const deleteMutation = useDeleteImage();

  // Drag and drop functionality
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setDraggedFile(file);
      setSelectedImage(URL.createObjectURL(file));
      setFileName(file.name);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    multiple: false,
  });

  // Handle upload
  const handleUpload = async () => {
    if (!draggedFile || !fileName) {
      alert("กรุณาเลือกไฟล์และใส่ชื่อไฟล์");
      return;
    }

    const fileExtension = draggedFile.name.split(".").pop();
    const finalFileName = fileName.includes(".")
      ? fileName
      : `${fileName}.${fileExtension}`;

    try {
      await uploadMutation.mutateAsync({
        file: draggedFile,
        fileName: finalFileName,
      });

      // Reset form
      setDraggedFile(null);
      setSelectedImage(null);
      setFileName("");
      alert("อัพโหลดสำเร็จ!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("เกิดข้อผิดพลาดในการอัพโหลด");
    }
  };

  // Handle download
  const handleDownload = (imageName) => {
    const url = getImageUrl(imageName);
    const link = document.createElement("a");
    link.href = url;
    link.download = imageName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle delete
  const handleDelete = async (imageName) => {
    // ตรวจสอบว่า image นี้ถูกใช้ใน project ไหนบ้าง
    const usedInProjects =
      shareProjectAssets?.filter((asset) =>
        asset.assets_src.includes(imageName)
      ) || [];

    if (usedInProjects.length > 0) {
      // แสดง modal ถ้ามี project ที่ใช้รูปนี้
      setDeleteModal({
        isOpen: true,
        imageName,
        usedInProjects,
      });
    } else {
      // ถ้าไม่มี project ไหนใช้ ลบได้เลย
      if (window.confirm(`คุณต้องการลบ ${imageName} ใช่หรือไม่?`)) {
        try {
          await deleteMutation.mutateAsync(imageName);
          alert("ลบไฟล์สำเร็จ!");
        } catch (error) {
          console.error("Delete error:", error);
          alert("เกิดข้อผิดพลาดในการลบไฟล์");
        }
      }
    }
  };

  // ยืนยันลบ (หลังจากแสดง modal)
  const confirmDelete = async () => {
    try {
      await deleteMutation.mutateAsync(deleteModal.imageName);
      alert("ลบไฟล์สำเร็จ!");
      setDeleteModal({ isOpen: false, imageName: null, usedInProjects: [] });
    } catch (error) {
      console.error("Delete error:", error);
      alert("เกิดข้อผิดพลาดในการลบไฟล์");
    }
  };

  // Handle background removal (placeholder)
  const handleRemoveBackground = () => {
    alert("ฟีเจอร์ตัดพื้นหลังกำลังพัฒนา");
  };

  return (
    <>
      <NavbarWithSidebar />
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Image size={24} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Image Assets</h1>
              <p className="text-gray-600">Manage your image assets</p>
            </div>
          </div>

          {/* Top Block - Split Left/Right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Left - Drag and Drop */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Upload Image
              </h3>

              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <input {...getInputProps()} />
                {selectedImage ? (
                  <div className="space-y-4">
                    <img
                      src={selectedImage}
                      alt="Preview"
                      className="max-h-48 mx-auto rounded-lg shadow-sm"
                    />
                    <p className="text-sm text-gray-600">{draggedFile?.name}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <Upload size={24} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900">
                        {isDragActive
                          ? "วางไฟล์ที่นี่..."
                          : "ลากไฟล์มาวางที่นี่"}
                      </p>
                      <p className="text-sm text-gray-500">
                        หรือคลิกเพื่อเลือกไฟล์ (JPG, PNG, GIF, WebP)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right - Tools */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Tools
              </h3>

              <div className="space-y-4">
                {/* File Name Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText size={16} className="inline mr-2" />
                    ชื่อไฟล์
                  </label>
                  <input
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder="กรอกชื่อไฟล์..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleRemoveBackground}
                    disabled={!selectedImage}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    <Scissors size={16} />
                    ตัดพื้นหลัง
                  </button>

                  <button
                    onClick={handleUpload}
                    disabled={!draggedFile || uploadMutation.isLoading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    <Upload size={16} />
                    {uploadMutation.isLoading ? "กำลังอัพโหลด..." : "อัพโหลด"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Block - Image Gallery */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                รูปภาพทั้งหมด
              </h3>
              <span className="text-sm text-gray-500">
                {images?.length || 0} ไฟล์
              </span>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">กำลังโหลด...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500">เกิดข้อผิดพลาดในการโหลดรูปภาพ</p>
              </div>
            ) : images && images.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {images.map((image) => (
                  <div key={image.id} className="group relative">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={getImageUrl(image.name)}
                        alt={image.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        loading="lazy"
                      />
                    </div>

                    {/* Image Info */}
                    <div className="mt-2">
                      <p
                        className="text-xs text-gray-600 truncate"
                        title={image.name}
                      >
                        {image.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {(image.metadata?.size / 1024).toFixed(1)} KB
                      </p>
                    </div>

                    {/* Action Buttons (Show on Hover) */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleDownload(image.name)}
                          className="p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                          title="ดาวน์โหลด"
                        >
                          <Download size={12} />
                        </button>
                        <button
                          onClick={() => handleDelete(image.name)}
                          className="p-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                          title="ลบ"
                          disabled={deleteMutation.isLoading}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Image size={24} className="text-gray-400" />
                </div>
                <p className="text-gray-500">ยังไม่มีรูปภาพ</p>
                <p className="text-sm text-gray-400">
                  เริ่มต้นด้วยการอัพโหลดรูปภาพแรกของคุณ
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <Trash2 size={20} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  ยืนยันการลบ
                </h3>
                <p className="text-sm text-gray-600">
                  ไฟล์นี้ถูกใช้ในโปรเจคต่อไปนี้
                </p>
              </div>
            </div>

            <div className="mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  โปรเจคที่ใช้ไฟล์นี้:
                </h4>
                <div className="space-y-2">
                  {deleteModal.usedInProjects.map((project, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">
                        {project.project_name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() =>
                  setDeleteModal({
                    isOpen: false,
                    imageName: null,
                    usedInProjects: [],
                  })
                }
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteMutation.isLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {deleteMutation.isLoading ? "กำลังลบ..." : "ลบไฟล์"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
