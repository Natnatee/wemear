import React, { useState, useCallback } from "react";
import { Video, Upload, Download, FileText, Trash2, Play } from "lucide-react";
import NavbarWithSidebar from "../../components/NavbarWithSidebar";
import { useVideoAssets, useUploadVideo, useDeleteVideo, getVideoUrl } from "../../hook/useVideoAssets";
import { useDropzone } from "react-dropzone";

export default function VideoAssets() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [fileName, setFileName] = useState("");
  const [draggedFile, setDraggedFile] = useState(null);

  const { data: videos, isLoading, error } = useVideoAssets();
  const uploadMutation = useUploadVideo();
  const deleteMutation = useDeleteVideo();

  // Drag and drop functionality
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setDraggedFile(file);
      setSelectedVideo(URL.createObjectURL(file));
      setFileName(file.name);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.wmv']
    },
    multiple: false,
    maxSize: 100 * 1024 * 1024, // 100MB limit
    onDropRejected: (rejectedFiles) => {
      const file = rejectedFiles[0];
      if (file.errors.some(error => error.code === 'file-too-large')) {
        alert(`ไฟล์ใหญ่เกินไป! ขนาดสูงสุดที่รองรับคือ 100MB\nไฟล์ของคุณมีขนาด ${(file.file.size / (1024 * 1024)).toFixed(1)}MB`);
      } else {
        alert('ไฟล์ไม่ถูกต้อง กรุณาเลือกไฟล์วิดีโอที่รองรับ');
      }
    }
  });

  // Handle upload
  const handleUpload = async () => {
    if (!draggedFile || !fileName) {
      alert("กรุณาเลือกไฟล์และใส่ชื่อไฟล์");
      return;
    }

    // Check file size (100MB limit)
    const maxSize = 100 * 1024 * 1024; // 100MB in bytes
    if (draggedFile.size > maxSize) {
      alert(`ไฟล์ใหญ่เกินไป! ขนาดสูงสุดที่รองรับคือ 100MB\nไฟล์ของคุณมีขนาด ${(draggedFile.size / (1024 * 1024)).toFixed(1)}MB`);
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
      setSelectedVideo(null);
      setFileName("");
      alert("อัพโหลดสำเร็จ!");
    } catch (error) {
      console.error("Upload error:", error);
      if (error.response?.status === 413) {
        alert("ไฟล์ใหญ่เกินไป! กรุณาลดขนาดไฟล์หรือใช้ไฟล์ที่เล็กกว่า 100MB");
      } else {
        alert("เกิดข้อผิดพลาดในการอัพโหลด: " + (error.message || "Unknown error"));
      }
    }
  };

  // Handle download
  const handleDownload = (videoName) => {
    const url = getVideoUrl(videoName);
    const link = document.createElement('a');
    link.href = url;
    link.download = videoName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle delete
  const handleDelete = async (videoName) => {
    if (window.confirm(`คุณต้องการลบ ${videoName} ใช่หรือไม่?`)) {
      try {
        await deleteMutation.mutateAsync(videoName);
        alert("ลบไฟล์สำเร็จ!");
      } catch (error) {
        console.error("Delete error:", error);
        alert("เกิดข้อผิดพลาดในการลบไฟล์");
      }
    }
  };

  return (
    <>
      <NavbarWithSidebar />
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Video size={24} className="text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Video Assets</h1>
              <p className="text-gray-600">Manage your video assets</p>
            </div>
          </div>

          {/* Top Block - Split Left/Right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Left - Drag and Drop */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Video</h3>

              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive
                  ? 'border-purple-400 bg-purple-50'
                  : 'border-gray-300 hover:border-gray-400'
                  }`}
              >
                <input {...getInputProps()} />
                {selectedVideo ? (
                  <div className="space-y-4">
                    <div className="max-h-48 mx-auto rounded-lg shadow-sm overflow-hidden bg-black">
                      <video
                        src={selectedVideo}
                        className="w-full h-full object-cover"
                        controls
                        preload="metadata"
                        style={{ maxHeight: '192px' }}
                      />
                    </div>
                    <p className="text-sm text-gray-600">
                      {draggedFile?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      ขนาด: {draggedFile ? (draggedFile.size / (1024 * 1024)).toFixed(1) : 0} MB
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <Upload size={24} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900">
                        {isDragActive ? 'วางไฟล์ที่นี่...' : 'ลากไฟล์วิดีโอมาวางที่นี่'}
                      </p>
                      <p className="text-sm text-gray-500">
                        หรือคลิกเพื่อเลือกไฟล์ (MP4, MOV, AVI, MKV, WebM, WMV)
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        ขนาดไฟล์สูงสุด: 100MB
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
                    placeholder="กรอกชื่อไฟล์วิดีโอ..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleUpload}
                    disabled={!draggedFile || uploadMutation.isLoading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    <Upload size={16} />
                    {uploadMutation.isLoading ? 'กำลังอัพโหลด...' : 'อัพโหลด'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Block - Video Gallery */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">วิดีโอทั้งหมด</h3>
              <span className="text-sm text-gray-500">
                {videos?.length || 0} ไฟล์
              </span>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">กำลังโหลด...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500">เกิดข้อผิดพลาดในการโหลดวิดีโอ</p>
              </div>
            ) : videos && videos.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {videos.map((video) => (
                  <div key={video.id} className="group relative">
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative">
                      <video
                        src={getVideoUrl(video.name)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        preload="metadata"
                        muted
                      />
                      {/* Play overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="p-2 bg-white bg-opacity-90 rounded-full">
                          <Play size={16} className="text-gray-700 ml-0.5" />
                        </div>
                      </div>
                    </div>

                    {/* Video Info */}
                    <div className="mt-2">
                      <p className="text-xs text-gray-600 truncate" title={video.name}>
                        {video.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {video.metadata?.size ? (video.metadata.size / (1024 * 1024)).toFixed(1) + ' MB' : 'N/A'}
                      </p>
                    </div>

                    {/* Action Buttons (Show on Hover) */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleDownload(video.name)}
                          className="p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                          title="ดาวน์โหลด"
                        >
                          <Download size={12} />
                        </button>
                        <button
                          onClick={() => handleDelete(video.name)}
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
                  <Video size={24} className="text-gray-400" />
                </div>
                <p className="text-gray-500">ยังไม่มีวิดีโอ</p>
                <p className="text-sm text-gray-400">เริ่มต้นด้วยการอัพโหลดวิดีโอแรกของคุณ</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
