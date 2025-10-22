import React, { useState, useEffect, useRef } from "react";
import { Upload, Download, Play } from "lucide-react";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import "@tensorflow/tfjs-backend-cpu";
import { Compiler } from "../utils/image-target/compiler.js";

export default function TestPage() {
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [compiledData, setCompiledData] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const canvasContainerRef = useRef(null);
  const compilerRef = useRef(null);
  const fileInputRef = useRef(null);

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

  const showImage = (targetImage, points, container) => {
    const canvas = document.createElement("canvas");
    container.appendChild(canvas);
    canvas.width = targetImage.width;
    canvas.height = targetImage.height;
    canvas.style.width = "100%";
    canvas.style.height = "auto";
    canvas.style.border = "1px solid #ddd";
    canvas.style.marginBottom = "12px";

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

    const pix = (0xff << 24) | (0x00 << 16) | (0xff << 8) | 0x00; // green
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
  };

  const showData = (data, container) => {
    for (let i = 0; i < data.trackingImageList.length; i++) {
      const image = data.trackingImageList[i];
      const points = data.trackingData[i].points.map((p) => ({
        x: Math.round(p.x),
        y: Math.round(p.y),
      }));
      showImage(image, points, container);
    }

    for (let i = 0; i < data.imageList.length; i++) {
      const image = data.imageList[i];
      const kpmPoints = [
        ...data.matchingData[i].maximaPoints,
        ...data.matchingData[i].minimaPoints,
      ];
      const points2 = [];
      for (let j = 0; j < kpmPoints.length; j++) {
        points2.push({
          x: Math.round(kpmPoints[j].x),
          y: Math.round(kpmPoints[j].y),
        });
      }
      showImage(image, points2, container);
    }
  };

  const handleStart = async () => {
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

    // Clear previous results
    if (canvasContainerRef.current) {
      canvasContainerRef.current.innerHTML = "";
    }

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

      for (let i = 0; i < dataList.length; i++) {
        showData(dataList[i], canvasContainerRef.current);
      }

      const exportedBuffer = await compilerRef.current.exportData();
      setCompiledData(exportedBuffer);
      setProgress("เสร็จสิ้น! คลิกปุ่ม Download เพื่อบันทึกไฟล์");
    } catch (error) {
      console.error("Error compiling:", error);
      setProgress("เกิดข้อผิดพลาด: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!compiledData) {
      alert("กรุณากด Start เพื่อทำการ compile ก่อน");
      return;
    }

    const blob = new Blob([compiledData]);
    const aLink = document.createElement("a");
    aLink.download = "targets.mind";
    aLink.href = URL.createObjectURL(blob);
    aLink.click();
    URL.revokeObjectURL(aLink.href);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          MindAR Image Target Compiler
        </h1>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-700 font-semibold mb-2">
            วิธีการใช้งาน:
          </p>
          <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
            <li>อัปโหลดรูปภาพเป้าหมาย (target images) ที่ต้องการใช้สำหรับ AR</li>
            <li>คลิกปุ่ม "Start" เพื่อเริ่มประมวลผล (อาจใช้เวลาสักครู่)</li>
            <li>ดูผลลัพธ์ที่แสดง feature points บนรูปภาพ</li>
            <li>คลิก "Download" เพื่อดาวน์โหลดไฟล์ targets.mind</li>
          </ol>
        </div>

        {/* Toolbar */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={handleStart}
            disabled={isProcessing || files.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Play size={18} />
            Start
          </button>
          <button
            onClick={handleDownload}
            disabled={!compiledData}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Download size={18} />
            Download
          </button>
          {progress && (
            <span className="flex items-center text-sm text-gray-600 ml-2">
              {progress}
            </span>
          )}
        </div>

        {/* Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-8 mb-6 cursor-pointer transition-colors ${isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 bg-white hover:border-gray-400"
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
            <p className="text-gray-600 mb-1">
              ลากไฟล์มาวางที่นี่ หรือคลิกเพื่ือเลือกไฟล์
            </p>
            <p className="text-sm text-gray-500">
              รองรับไฟล์: PNG, JPG, JPEG
            </p>
          </div>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <h3 className="font-semibold text-gray-700 mb-3">
              ไฟล์ที่เลือก ({files.length})
            </h3>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <span className="text-sm text-gray-700 truncate flex-1">
                    {file.name}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="ml-2 text-red-500 hover:text-red-700 text-sm"
                  >
                    ลบ
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        <div ref={canvasContainerRef} className="space-y-4"></div>
      </div>
    </div>
  );
}
