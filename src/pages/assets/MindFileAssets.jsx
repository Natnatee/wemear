import React, { useState, useEffect, useRef } from "react";
import { Upload, Download, Play, Eye, Send, X } from "lucide-react";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import "@tensorflow/tfjs-backend-cpu";
import { Compiler } from "../../utils/image-target/compiler.js";
import NavbarWithSidebar from "../../components/NavbarWithSidebar";
import PreviewModal from "../../components/PreviewModal";
import useMind from "../../hook/useMind";

export default function MindFileAssets() {
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [compiledData, setCompiledData] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [mindName, setMindName] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [isUploadingLocal, setIsUploadingLocal] = useState(false);

  const compilerRef = useRef(null);
  const fileInputRef = useRef(null);

  // Use Mind Hook
  const {
    uploadMind,
    isUploading,
    uploadError,
    uploadSuccess,
    reset: resetUpload,
  } = useMind();

  // Initialize TensorFlow backend
  useEffect(() => {
    const initTF = async () => {
      try {
        await tf.setBackend("webgl");
      } catch (e) {
        console.warn("WebGL backend init failed, falling back to CPU", e);
        await tf.setBackend("cpu");
      }
      await tf.ready();
      compilerRef.current = new Compiler();
    };
    initTF();
  }, []);

  // Handle upload success
  useEffect(() => {
    if (uploadSuccess) {
      alert("อัพโหลดสำเร็จ!");
      // Reset form
      setFiles([]);
      setMindName("");
      setCompiledData(null);
      setPreviewImages([]);
      setProgress("");
      setIsUploadingLocal(false);
      resetUpload();
    }
  }, [uploadSuccess, resetUpload]);

  // Handle upload error
  useEffect(() => {
    if (uploadError) {
      alert("เกิดข้อผิดพลาดในการอัพโหลด: " + uploadError.message);
      setIsUploadingLocal(false);
    }
  }, [uploadError]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files);
    addFiles(selectedFiles);
  };

  const addFiles = (newFiles) => {
    const imageFiles = newFiles.filter((file) =>
      file.type.startsWith("image/")
    );
    setFiles((prev) => [...prev, ...imageFiles]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const loadImage = async (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const createCanvasFromData = (targetImage, points) => {
    const canvas = document.createElement("canvas");
    canvas.width = targetImage.width;
    canvas.height = targetImage.height;

    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = new Uint32Array(imageData.data.buffer);

    const alpha = 0xff << 24;
    for (let c = 0; c < targetImage.width; c++) {
      for (let r = 0; r < targetImage.height; r++) {
        const pix = targetImage.data[r * targetImage.width + c];
        data[r * canvas.width + c] = alpha | (pix << 16) | (pix << 8) | pix;
      }
    }

    const pix = (0xff << 24) | (0x00 << 16) | (0xff << 8) | 0x00;
    for (let i = 0; i < points.length; ++i) {
      const x = points[i].x;
      const y = points[i].y;
      const offset = x + y * canvas.width;
      data[offset] = pix;
      for (let size = 1; size <= 6; size++) {
        data[offset - size] = pix;
        data[offset + size] = pix;
        data[offset - size * canvas.width] = pix;
        data[offset + size * canvas.width] = pix;
      }
    }
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL();
  };

  const collectImageUrls = (data) => {
    const imageUrls = [];

    for (let i = 0; i < data.trackingImageList.length; i++) {
      const image = data.trackingImageList[i];
      const points = data.trackingData[i].points.map((p) => ({
        x: Math.round(p.x),
        y: Math.round(p.y),
      }));
      const imageUrl = createCanvasFromData(image, points);
      imageUrls.push(imageUrl);
    }

    for (let i = 0; i < data.imageList.length; i++) {
      const image = data.imageList[i];
      const kpmPoints = [
        ...data.matchingData[i].maximaPoints,
        ...data.matchingData[i].minimaPoints,
      ];
      const points2 = kpmPoints.map((p) => ({
        x: Math.round(p.x),
        y: Math.round(p.y),
      }));
      const imageUrl = createCanvasFromData(image, points2);
      imageUrls.push(imageUrl);
    }

    return imageUrls;
  };

  const handleCompile = async () => {
    if (files.length === 0) {
      alert("กรุณาเลือกไฟล์รูปภาพก่อน");
      return;
    }

    if (!compilerRef.current) {
      alert("กำลังโหลด Compiler กรุณารอสักครู่");
      return;
    }

    setIsProcessing(true);
    setProgress("กำลังเริ่มต้น...");

    try {
      const images = [];
      for (let i = 0; i < files.length; i++) {
        images.push(await loadImage(files[i]));
      }

      const start = performance.now();
      const dataList = await compilerRef.current.compileImageTargets(
        images,
        (prog) => {
          setProgress(`กำลังประมวลผล: ${prog.toFixed(2)}%`);
        }
      );

      console.log(
        "exec time compile:",
        Math.round(performance.now() - start) + "ms"
      );

      const allImageUrls = [];
      for (let i = 0; i < dataList.length; i++) {
        const imageUrls = collectImageUrls(dataList[i]);
        allImageUrls.push(...imageUrls);
      }
      setPreviewImages(allImageUrls);

      const exportedBuffer = await compilerRef.current.exportData();
      setCompiledData(exportedBuffer);
      setProgress("Compile สำเร็จ!");
    } catch (error) {
      console.error("Error compiling:", error);
      setProgress("เกิดข้อผิดพลาด: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!compiledData) {
      alert("กรุณากด Compile เพื่อทำการ compile ก่อน");
      return;
    }

    const blob = new Blob([compiledData]);
    const aLink = document.createElement("a");
    aLink.download = `${mindName || "targets"}.mind`;
    aLink.href = URL.createObjectURL(blob);
    aLink.click();
    URL.revokeObjectURL(aLink.href);
  };

  const handleUpload = () => {
    if (!compiledData) {
      alert("กรุณากด Compile ก่อนอัพโหลด");
      return;
    }

    if (!mindName.trim()) {
      alert("กรุณากรอกชื่อ Mind Name");
      return;
    }

    if (files.length === 0) {
      alert("ไม่มีรูปภาพที่จะอัพโหลด");
      return;
    }

    setIsUploadingLocal(true);
    uploadMind({
      mindName: mindName.trim(),
      images: files,
      mindFileBuffer: compiledData,
    });
  };

  return (
    <>
      <NavbarWithSidebar />
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Mind File Assets
            </h1>
            <p className="text-gray-600 mt-1">
              สร้างและจัดการ Mind File สำหรับ Image Tracking
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700 font-semibold mb-2">
              วิธีการใช้งาน:
            </p>
            <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
              <li>ลากรูปภาพเป้าหมาย (target images) มาวางในพื้นที่ด้านซ้าย</li>
              <li>กรอกชื่อ Mind Name ด้านขวา</li>
              <li>คลิก "Compile" เพื่อประมวลผล</li>
              <li>คลิก "Preview" เพื่อดูผลลัพธ์ ** 1. ยิ่งรูปมีจุดเขียวมากยิ่งดี 2. รูปควรมีพื้นหลังเกลี้ยงๆและมีความคมชัด**</li>
              <li>คลิก "Download" หรือ "Upload" เพื่อบันทึกหรืออัพโหลด</li>
            </ol>
          </div>

          {/* Main Layout - 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Upload Area */}
            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  อัปโหลดรูปภาพ
                </h2>

                {/* Drop Zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-lg p-8 cursor-pointer transition-colors ${isDragging
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 bg-gray-50 hover:border-gray-400"
                    }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center justify-center text-center">
                    <Upload
                      size={48}
                      className={`mb-3 ${isDragging ? "text-blue-500" : "text-gray-400"
                        }`}
                    />
                    <p className="text-gray-600 mb-1 text-sm">
                      ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์
                    </p>
                    <p className="text-xs text-gray-500">
                      รองรับไฟล์: PNG, JPG, JPEG
                    </p>
                  </div>
                </div>

                {/* Image Thumbnails */}
                {files.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                      รูปภาพที่เลือก ({files.length})
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-100"
                        >
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile(index);
                            }}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={14} />
                          </button>
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs py-1 px-2 truncate">
                            {file.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Tools */}
            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  การตั้งค่า
                </h2>

                {/* Mind Name Input */}
                <div className="mb-6">
                  <label
                    htmlFor="mindName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Mind Name
                  </label>
                  <input
                    id="mindName"
                    type="text"
                    value={mindName}
                    onChange={(e) => setMindName(e.target.value)}
                    placeholder="ตัวอย่าง: work, logo, poster"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>

                {/* Progress */}
                {progress && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
                    <p className="text-sm text-gray-700">{progress}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleCompile}
                    disabled={isProcessing || files.length === 0}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    <Play size={18} />
                    Compile
                  </button>

                  <button
                    onClick={() => setIsPreviewOpen(true)}
                    disabled={!compiledData || previewImages.length === 0}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    <Eye size={18} />
                    Preview
                  </button>

                  <button
                    onClick={handleDownload}
                    disabled={!compiledData}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    <Download size={18} />
                    Download
                  </button>

                  <button
                    onClick={handleUpload}
                    disabled={!compiledData || !mindName.trim() || isUploadingLocal}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    <Send size={18} />
                    {isUploadingLocal ? "Uploading" : "Upload"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        imageUrls={previewImages}
      />
    </>
  );
}
