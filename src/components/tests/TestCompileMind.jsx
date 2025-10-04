import React, { useState, useRef, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-backend-cpu';
import { Compiler } from '../../utils/mind-compiler/compiler.js';

const TestCompileMind2 = () => {
  const [files, setFiles] = useState([]);
  const [isCompiling, setIsCompiling] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [compiledData, setCompiledData] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const loadImage = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }, []);

  const compileImages = useCallback(async () => {
    if (files.length === 0) return;

    setIsCompiling(true);
    setProgress(0);
    setError(null);
    setCurrentStep('');

    try {
      // เตรียม TensorFlow.js backend
      setCurrentStep('กำลังเตรียม TensorFlow.js backend...');
      try {
        await tf.setBackend('webgl');
        setCurrentStep('ใช้ WebGL backend สำหรับการประมวลผลที่รวดเร็ว');
      } catch (e) {
        console.warn('WebGL backend failed, falling back to CPU', e);
        await tf.setBackend('cpu');
        setCurrentStep('ใช้ CPU backend สำหรับการประมวลผล');
      }
      await tf.ready();

      // โหลดรูปภาพทั้งหมด
      setCurrentStep(`กำลังโหลด ${files.length} ไฟล์รูปภาพ...`);
      const images = [];
      for (let i = 0; i < files.length; i++) {
        const img = await loadImage(files[i]);
        images.push(img);
        setCurrentStep(`โหลดแล้ว ${i + 1}/${files.length} รูปภาพ`);
      }

      // สร้าง compiler instance
      setCurrentStep('กำลังเตรียม Image Target Compiler...');
      const compiler = new Compiler();

      // เริ่มการ compile
      setCurrentStep('กำลังวิเคราะห์และค้นหา feature points ในรูปภาพ...');
      const dataList = await compiler.compileImageTargets(images, (progressValue) => {
        setProgress(progressValue);
        if (progressValue < 50) {
          setCurrentStep(`กำลังวิเคราะห์ feature points... ${progressValue.toFixed(1)}%`);
        } else {
          setCurrentStep(`กำลังสร้าง tracking data... ${progressValue.toFixed(1)}%`);
        }
      });

      // แสดงผลข้อมูลที่ compile แล้ว
      setCompiledData(dataList);
      setCurrentStep('การ Compile เสร็จสิ้น! กำลังเตรียมดาวน์โหลดไฟล์...');

      // เตรียมดาวน์โหลด
      const exportedBuffer = await compiler.exportData();

      // สร้าง download link
      const blob = new Blob([exportedBuffer]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'targets.mind';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setCurrentStep('ไฟล์ targets.mind ได้ถูกดาวน์โหลดแล้ว!');

    } catch (err) {
      console.error('Compile error:', err);
      setError(err.message || 'เกิดข้อผิดพลาดในการ compile');
      setCurrentStep('');
    } finally {
      setIsCompiling(false);
    }
  }, [files, loadImage]);

  const handleFileSelect = useCallback((event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);
    setError(null);
    setCompiledData(null);
  }, []);

  const showImageWithPoints = useCallback((targetImage, points, canvasId) => {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    canvas.width = targetImage.width;
    canvas.height = targetImage.height;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = new Uint32Array(imageData.data.buffer);

    // แปลงข้อมูลภาพเป็น grayscale และใส่ใน canvas
    const alpha = (0xff << 24);
    for (let c = 0; c < targetImage.width; c++) {
      for (let r = 0; r < targetImage.height; r++) {
        const pix = targetImage.data[r * targetImage.width + c] || 128;
        data[r * canvas.width + c] = alpha | (pix << 16) | (pix << 8) | pix;
      }
    }

    // วาด feature points เป็นสีเขียว
    const pix = (0xff << 24) | (0x00 << 16) | (0xff << 8) | 0x00; // green
    for (let i = 0; i < points.length; i++) {
      const x = Math.round(points[i].x);
      const y = Math.round(points[i].y);
      if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {
        const offset = (x + y * canvas.width);
        data[offset] = pix;

        // วาดจุดรอบๆ ให้เห็นชัดขึ้น
        for (let size = 1; size <= 3; size++) {
          if (offset - size >= 0) data[offset - size] = pix;
          if (offset + size < data.length) data[offset + size] = pix;
          if (offset - size * canvas.width >= 0) data[offset - size * canvas.width] = pix;
          if (offset + size * canvas.width < data.length) data[offset + size * canvas.width] = pix;
        }
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }, []);

  const renderCompiledImages = useCallback(() => {
    if (!compiledData) return null;

    return compiledData.map((data, index) => {
      return (
        <div key={index} style={{ marginBottom: '20px', border: '1px solid #ddd', padding: '10px' }}>
          <h3>ภาพที่ {index + 1}</h3>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div>
              <h4>Tracking Points</h4>
              <canvas id={`tracking-canvas-${index}`} style={{ border: '1px solid #ccc' }}></canvas>
            </div>
            <div>
              <h4>Matching Points</h4>
              <canvas id={`matching-canvas-${index}`} style={{ border: '1px solid #ccc' }}></canvas>
            </div>
          </div>
        </div>
      );
    });
  }, [compiledData]);

  // อัปเดต canvas เมื่อมีข้อมูล
  React.useEffect(() => {
    if (compiledData) {
      compiledData.forEach((data, index) => {
        const trackingPoints = data.trackingData?.points?.map(p => ({ x: Math.round(p.x), y: Math.round(p.y) })) || [];
        const matchingPoints = [
          ...(data.matchingData?.maximaPoints || []),
          ...(data.matchingData?.minimaPoints || [])
        ].map(p => ({ x: Math.round(p.x), y: Math.round(p.y) }));

        showImageWithPoints(data.targetImage, trackingPoints, `tracking-canvas-${index}`);
        showImageWithPoints(data.targetImage, matchingPoints, `matching-canvas-${index}`);
      });
    }
  }, [compiledData, showImageWithPoints]);

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <h1>MindAR Image Target Compiler</h1>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => fileInputRef.current?.click()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          เลือกไฟล์รูปภาพ
        </button>

        {files.length > 0 && (
          <button
            onClick={compileImages}
            disabled={isCompiling}
            style={{
              padding: '10px 20px',
              backgroundColor: isCompiling ? '#ccc' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isCompiling ? 'not-allowed' : 'pointer'
            }}
          >
            {isCompiling ? 'กำลัง Compile...' : 'เริ่ม Compile'}
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </div>

      {files.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h3>ไฟล์ที่เลือก ({files.length} ไฟล์):</h3>
          <ul>
            {files.map((file, index) => (
              <li key={index}>{file.name} ({(file.size / 1024).toFixed(1)} KB)</li>
            ))}
          </ul>
        </div>
      )}

      {isCompiling && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>กำลังประมวลผล...</span>
            <div style={{
              width: '200px',
              height: '20px',
              backgroundColor: '#e0e0e0',
              borderRadius: '10px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${progress}%`,
                height: '100%',
                backgroundColor: '#007bff',
                transition: 'width 0.3s ease'
              }}></div>
            </div>
            <span>{progress.toFixed(1)}%</span>
          </div>
          {currentStep && (
            <div style={{ marginTop: '10px', color: '#666' }}>
              {currentStep}
            </div>
          )}
        </div>
      )}

      {error && (
        <div style={{
          marginBottom: '20px',
          padding: '10px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '4px',
          border: '1px solid #f5c6cb'
        }}>
          ข้อผิดพลาด: {error}
        </div>
      )}

      {compiledData && (
        <div>
          <h2>ผลลัพธ์การ Compile</h2>
          <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#d4edda', borderRadius: '4px' }}>
            <p style={{ color: '#155724', margin: 0 }}>
              ✅ การ Compile เสร็จสิ้น! ไฟล์ targets.mind ได้ถูกดาวน์โหลดแล้ว
            </p>
          </div>
          {renderCompiledImages()}
        </div>
      )}
    </div>
  );
};

export default TestCompileMind2;
