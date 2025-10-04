import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // *** นี่คือส่วนที่ถูกต้อง: server อยู่ใน Object เดียวกับ plugins ***
  server: {
    port: 5173,
    host: "0.0.0.0", // ฟังทุก IP เพื่อให้ Nginx เข้าถึงได้
    
    // ตั้งค่า HMR สำหรับ Reverse Proxy
    hmr: {
      host: "wemear.com", 
      protocol: "wss", 
    },
    
    // อนุญาตให้เข้าถึงผ่านโดเมนเหล่านี้
    allowedHosts: [
      'wemear.com',
      'www.wemear.com',
    ],
  },
});