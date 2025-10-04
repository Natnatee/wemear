import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div>
      <h1>404 - ไม่พบหน้า</h1>
      <p>ขออภัย, หน้าที่คุณค้นหาไม่มีอยู่</p>
      <Link to="/">กลับไปหน้าหลัก</Link>
    </div>
  );
}

export default NotFound;