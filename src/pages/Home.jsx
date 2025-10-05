import React from 'react';

function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">
        ยินดีต้อนรับสู่โปรเจกต์ Web AR 4
      </h1>
      <p className="text-lg text-gray-700 mb-6">
        คลิกที่ "เริ่ม AR" เพื่อเข้าสู่ประสบการณ์ AR
      </p>
      <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
        เริ่ม AR
      </button>
    </div>
  );
}

export default Home;
