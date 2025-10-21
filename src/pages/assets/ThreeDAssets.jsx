import React, { useState, useCallback, useRef, useEffect, memo } from "react";
import { Box, Upload, Download, FileText, Trash2 } from "lucide-react";
import NavbarWithSidebar from "../../components/NavbarWithSidebar";
import { useThreeDAssets, useUploadThreeD, useDeleteThreeD, getThreeDUrl } from "../../hook/useThreeDAssets";
import { useDropzone } from "react-dropzone";
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

export default function ThreeDAssets() {
  const [selectedModel, setSelectedModel] = useState(null);
  const [fileName, setFileName] = useState("");
  const [draggedFile, setDraggedFile] = useState(null);
  const [previewThumbnail, setPreviewThumbnail] = useState(null);
  const [thumbnails, setThumbnails] = useState({});

  const { data: models, isLoading, error } = useThreeDAssets();
  const uploadMutation = useUploadThreeD();
  const deleteMutation = useDeleteThreeD();

  // Generate 3D preview
  const generate3DPreview = useCallback(async (file) => {
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!['gltf', 'glb', 'obj'].includes(fileExtension)) {
      setPreviewThumbnail(null);
      return;
    }

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 200;
      canvas.height = 200;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xffffff);

      const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
      renderer.setSize(200, 200);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);

      const fileUrl = URL.createObjectURL(file);
      let model = null;

      if (fileExtension === 'gltf' || fileExtension === 'glb') {
        const loader = new GLTFLoader();
        const gltf = await new Promise((resolve, reject) => {
          loader.load(fileUrl, resolve, undefined, reject);
        });
        model = gltf.scene;
      } else if (fileExtension === 'obj') {
        const loader = new OBJLoader();
        model = await new Promise((resolve, reject) => {
          loader.load(fileUrl, resolve, undefined, reject);
        });
        model.traverse((child) => {
          if (child.isMesh) {
            child.material = new THREE.MeshLambertMaterial({ color: 0x888888 });
          }
        });
      }

      if (model) {
        scene.add(model);
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        model.position.sub(center);
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 1.5 / maxDim;
        model.scale.setScalar(scale);

        camera.position.set(2, 1, 2);
        camera.lookAt(0, 0, 0);

        // Render single frame only
        renderer.render(scene, camera);

        const thumbnail = canvas.toDataURL('image/png');
        setPreviewThumbnail(thumbnail);
      }

      URL.revokeObjectURL(fileUrl);
      renderer.dispose();
    } catch (error) {
      console.error('Error generating 3D preview:', error);
      setPreviewThumbnail(null);
    }
  }, []);

  const generateThumbnailFromUrl = useCallback(async (url, fileExtension) => {
    if (!['gltf', 'glb', 'obj'].includes(fileExtension)) {
      return null;
    }

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 200;
      canvas.height = 200;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xffffff);

      const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
      renderer.setSize(200, 200);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);

      let model = null;

      if (fileExtension === 'gltf' || fileExtension === 'glb') {
        const loader = new GLTFLoader();
        const gltf = await new Promise((resolve, reject) => {
          loader.load(url, resolve, undefined, reject);
        });
        model = gltf.scene;
      } else if (fileExtension === 'obj') {
        const loader = new OBJLoader();
        model = await new Promise((resolve, reject) => {
          loader.load(url, resolve, undefined, reject);
        });
        model.traverse((child) => {
          if (child.isMesh) {
            child.material = new THREE.MeshLambertMaterial({ color: 0x888888 });
          }
        });
      }

      if (model) {
        scene.add(model);
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        model.position.sub(center);
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 1.5 / maxDim;
        model.scale.setScalar(scale);

        camera.position.set(2, 1, 2);
        camera.lookAt(0, 0, 0);

        // Render single frame only
        renderer.render(scene, camera);

        const thumbnail = canvas.toDataURL('image/png');
        renderer.dispose();
        return thumbnail;
      }

      renderer.dispose();
      return null;
    } catch (error) {
      console.error('Error generating 3D preview:', error);
      return null;
    }
  }, []);

  // Drag and drop functionality
  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setDraggedFile(file);
      setSelectedModel(URL.createObjectURL(file));
      setFileName(file.name);
      await generate3DPreview(file);
    }
  }, [generate3DPreview]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'model/*': ['.gltf', '.glb', '.obj', '.fbx', '.dae', '.3ds', '.ply', '.stl']
    },
    multiple: false,
    maxSize: 50 * 1024 * 1024, // 50MB limit
    onDropRejected: (rejectedFiles) => {
      const file = rejectedFiles[0];
      if (file.errors.some(error => error.code === 'file-too-large')) {
        alert(`ไฟล์ใหญ่เกินไป! ขนาดสูงสุดที่รองรับคือ 50MB\nไฟล์ของคุณมีขนาด ${(file.file.size / (1024 * 1024)).toFixed(1)}MB`);
      } else {
        alert('ไฟล์ไม่ถูกต้อง กรุณาเลือกไฟล์ 3D ที่รองรับ');
      }
    }
  });

  // Handle upload
  const handleUpload = async () => {
    if (!draggedFile || !fileName) {
      alert("กรุณาเลือกไฟล์และใส่ชื่อไฟล์");
      return;
    }

    // Check file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    if (draggedFile.size > maxSize) {
      alert(`ไฟล์ใหญ่เกินไป! ขนาดสูงสุดที่รองรับคือ 50MB\nไฟล์ของคุณมีขนาด ${(draggedFile.size / (1024 * 1024)).toFixed(1)}MB`);
      return;
    }

    const fileExtension = draggedFile.name.split('.').pop();
    const finalFileName = fileName.includes('.') ? fileName : `${fileName}.${fileExtension}`;

    try {
      await uploadMutation.mutateAsync({
        file: draggedFile,
        fileName: finalFileName
      });

      // Reset form
      setDraggedFile(null);
      setSelectedModel(null);
      setFileName("");
      setPreviewThumbnail(null);
      alert("อัพโหลดสำเร็จ!");
    } catch (error) {
      console.error("Upload error:", error);
      if (error.response?.status === 413) {
        alert("ไฟล์ใหญ่เกินไป! กรุณาลดขนาดไฟล์หรือใช้ไฟล์ที่เล็กกว่า 50MB");
      } else {
        alert("เกิดข้อผิดพลาดในการอัพโหลด: " + (error.message || "Unknown error"));
      }
    }
  };

  // Handle download
  const handleDownload = useCallback((modelName) => {
    const url = getThreeDUrl(modelName);
    const link = document.createElement('a');
    link.href = url;
    link.download = modelName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [getThreeDUrl]);

  // Handle delete
  const handleDelete = useCallback(async (modelName) => {
    if (window.confirm(`คุณต้องการลบ ${modelName} ใช่หรือไม่?`)) {
      try {
        await deleteMutation.mutateAsync(modelName);
        alert("ลบไฟล์สำเร็จ!");
      } catch (error) {
        console.error("Delete error:", error);
        alert("เกิดข้อผิดพลาดในการลบไฟล์");
      }
    }
  }, [deleteMutation]);

  // Get model type from file extension
  const getModelType = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    const typeMap = {
      'gltf': 'GLTF',
      'glb': 'GLB',
      'obj': 'OBJ',
      'fbx': 'FBX',
      'dae': 'DAE',
      '3ds': '3DS',
      'ply': 'PLY',
      'stl': 'STL'
    };
    return typeMap[ext] || '3D';
  };



  useEffect(() => {
    const generateAllThumbnails = async () => {
      if (!models || models.length === 0) return;

      const newThumbnails = { ...thumbnails };
      const toGenerate = [];

      for (const model of models) {
        if (newThumbnails[model.id] !== undefined) continue;

        const ext = model.name.split('.').pop().toLowerCase();
        if (['gltf', 'glb', 'obj'].includes(ext)) {
          toGenerate.push({ model, ext });
          newThumbnails[model.id] = null; // placeholder for loading
        } else {
          newThumbnails[model.id] = null;
        }
      }

      setThumbnails(newThumbnails);

      // Generate in parallel for better perf
      await Promise.all(
        toGenerate.map(async ({ model, ext }) => {
          try {
            const url = getThreeDUrl(model.name);
            const thumbnail = await generateThumbnailFromUrl(url, ext);
            setThumbnails(prev => ({ ...prev, [model.id]: thumbnail }));
          } catch (err) {
            setThumbnails(prev => ({ ...prev, [model.id]: null }));
          }
        })
      );
    };

    generateAllThumbnails();
  }, [models, getThreeDUrl, generateThumbnailFromUrl]);

  // ModelItem component with memoization
  const ModelItem = memo(({ model, getThreeDUrl, handleDownload, handleDelete, deleteMutationIsLoading }) => {
    return (
      <div className="group relative">
        <div className="aspect-square bg-white rounded-lg overflow-hidden relative border z-0">
          {(() => {
            const ext = model.name.split('.').pop().toLowerCase();
            const isSupported = ['gltf', 'glb', 'obj'].includes(ext);
            const thumbnail = thumbnails[model.id];

            if (!isSupported || thumbnail === null) {
              return (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
                  <Box size={32} className="text-gray-400 mb-2" />
                  <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">
                    {getModelType(model.name)}
                  </span>
                </div>
              );
            }

            if (thumbnail && thumbnail !== null) {
              return (
                <div className="w-full h-full relative">
                  <img
                    src={thumbnail}
                    alt={model.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 z-10">
                    <span className="text-xs font-bold text-white bg-green-600 bg-opacity-80 px-2 py-1 rounded">
                      {getModelType(model.name)}
                    </span>
                  </div>
                </div>
              );
            }

            // Loading for supported
            return (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mb-2"></div>
                <span className="text-xs text-gray-500">Loading...</span>
              </div>
            );
          })()}

          {/* 3D overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
            <div className="p-2 bg-white bg-opacity-90 rounded-full">
              <Box size={16} className="text-gray-700" />
            </div>
          </div>
        </div>

        {/* Model Info */}
        <div className="mt-2">
          <p className="text-xs text-gray-600 truncate" title={model.name}>
            {model.name}
          </p>
          <p className="text-xs text-gray-400">
            {model.metadata?.size ? (model.metadata.size / (1024 * 1024)).toFixed(1) + ' MB' : 'N/A'}
          </p>
        </div>

        {/* Action Buttons (Show on Hover) */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex gap-1">
            <button
              onClick={() => handleDownload(model.name)}
              className="p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              title="ดาวน์โหลด"
            >
              <Download size={12} />
            </button>
            <button
              onClick={() => handleDelete(model.name)}
              className="p-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              title="ลบ"
              disabled={deleteMutationIsLoading}
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      </div>
    );
  });

  return (
    <>
      <NavbarWithSidebar />
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-green-100 rounded-lg">
              <Box size={24} className="text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">3D Assets</h1>
              <p className="text-gray-600">Manage your 3D models and assets</p>
            </div>
          </div>

          {/* Top Block - Split Left/Right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Left - Drag and Drop */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload 3D Model</h3>

              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive
                  ? 'border-green-400 bg-green-50'
                  : 'border-gray-300 hover:border-gray-400'
                  }`}
              >
                <input {...getInputProps()} />
                {selectedModel ? (
                  <div className="space-y-4">
                    <div className="w-48 h-48 mx-auto rounded-lg border bg-gray-900 overflow-hidden">
                      {previewThumbnail ? (
                        <img
                          src={previewThumbnail}
                          alt="3D Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Box size={48} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        {draggedFile?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        ขนาด: {draggedFile ? (draggedFile.size / (1024 * 1024)).toFixed(1) : 0} MB
                      </p>
                      <p className="text-xs font-medium text-green-600">
                        ประเภท: {draggedFile ? getModelType(draggedFile.name) : ''}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <Upload size={24} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900">
                        {isDragActive ? 'วางไฟล์ที่นี่...' : 'ลากไฟล์ 3D มาวางที่นี่'}
                      </p>
                      <p className="text-sm text-gray-500">
                        หรือคลิกเพื่อเลือกไฟล์ (GLTF, GLB, OBJ, FBX, STL)
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        ขนาดไฟล์สูงสุด: 50MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right - Tools */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tools</h3>

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
                    placeholder="กรอกชื่อไฟล์ 3D..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleUpload}
                    disabled={!draggedFile || uploadMutation.isLoading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    <Upload size={16} />
                    {uploadMutation.isLoading ? 'กำลังอัพโหลด...' : 'อัพโหลด'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Block - 3D Gallery */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">3D Models ทั้งหมด</h3>
              <span className="text-sm text-gray-500">
                {models?.length || 0} ไฟล์
              </span>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">กำลังโหลด...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500">เกิดข้อผิดพลาดในการโหลด 3D Models</p>
              </div>
            ) : models && models.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {models.map((model) => (
                  <ModelItem
                    key={model.id}
                    model={model}
                    getThreeDUrl={getThreeDUrl}
                    handleDownload={handleDownload}
                    handleDelete={handleDelete}
                    deleteMutationIsLoading={deleteMutation.isLoading}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Box size={24} className="text-gray-400" />
                </div>
                <p className="text-gray-500">ยังไม่มี 3D Models</p>
                <p className="text-sm text-gray-400">เริ่มต้นด้วยการอัพโหลด 3D Model แรกของคุณ</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
