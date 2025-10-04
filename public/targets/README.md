# MindAR Image Tracking Demo

ตัวอย่างการใช้งาน MindAR สำหรับการติดตามภาพและแสดงเนื้อหา AR บนเว็บ

## การติดตั้งและการใช้งาน

### ข้อกำหนดเบื้องต้น
- React 18+
- mind-ar ^1.2.5
- react-three-mind ^0.3.0
- @react-three/fiber ^8.18.0
- three ^0.180.0

### การติดตั้ง Dependencies
```bash
npm install mind-ar react-three-mind @react-three/fiber @react-three/drei three
```

## ไฟล์ที่สำคัญ

### TestArMind.jsx
คอมโพเนนต์หลักสำหรับการแสดง AR View และจัดการสถานะการติดตามภาพ

คุณสมบัติหลัก:
- การจัดการสถานะการเริ่มต้น AR
- การติดตามภาพเป้าหมาย (Image Tracking)
- การแสดงผล 3D objects บนภาพเป้าหมาย
- การจัดการข้อผิดพลาดและสถานะต่างๆ
- UI แสดงสถานะการทำงาน

### การกำหนด Image Targets

ในไฟล์ `TestArMind.jsx` มีการกำหนด image targets ดังนี้:

```javascript
const imageTargets = {
  "test-target": {
    url: "/targets/test-target.mind", // ไฟล์ข้อมูลภาพเป้าหมาย
  }
};
```

## การสร้างไฟล์ .mind

สำหรับการใช้งานจริง คุณต้องสร้างไฟล์ .mind โดยใช้:

1. **MindAR Studio** (วิธีที่ง่ายที่สุด)
   - เข้าเว็บ https://studio.mindar.org
   - อัปโหลดรูปภาพที่ต้องการใช้เป็นเป้าหมาย
   - ดาวน์โหลดไฟล์ .mind ที่สร้างขึ้น

2. **MindAR CLI**
   ```bash
   npm install -g @mindar/cli
   mindar-cli build --image path/to/your/image.jpg
   ```

## การพัฒนาและทดสอบ

### การรัน Development Server
```bash
npm run dev
```

### การแก้ไขปัญหาทั่วไป

1. **ข้อผิดพลาดเกี่ยวกับ HTTPS**
   - ตรวจสอบว่า Vite ใช้ HTTPS ใน development
   - เพิ่ม `--host` flag ใน package.json scripts

2. **กล้องไม่ทำงาน**
   - ตรวจสอบการอนุญาตเข้าถึงกล้องในเบราว์เซอร์
   - ใช้ HTTPS (ไม่ใช่ HTTP) สำหรับการเข้าถึงกล้อง

3. **ไม่พบภาพเป้าหมาย**
   - ตรวจสอบว่าไฟล์ .mind อยู่ในโฟลเดอร์ `/public/targets/`
   - ชื่อ target ในโค้ดต้องตรงกับชื่อในไฟล์ .mind

## โครงสร้างไฟล์

```
public/
  targets/
    test-target.mind    # ไฟล์ข้อมูลภาพเป้าหมาย
src/
  components/
    tests/
      TestArMind.jsx    # คอมโพเนนต์หลักสำหรับ AR
```

## ตัวอย่างการปรับแต่ง

### การเพิ่ม Target เพิ่มเติม

```javascript
const imageTargets = {
  "target1": { url: "/targets/target1.mind" },
  "target2": { url: "/targets/target2.mind" }
};
```

### การปรับแต่ง 3D Objects

สามารถแก้ไขคอมโพเนนต์ `ARTrackedObject` เพื่อเพิ่ม objects หรือ animations เพิ่มเติม

### การเพิ่ม Interaction

สามารถเพิ่ม event handlers เพิ่มเติมสำหรับการโต้ตอบกับ objects ใน AR

## การ Deploy

เมื่อพร้อม deploy ให้ใช้:
```bash
npm run build
```

ตรวจสอบว่าไฟล์ในโฟลเดอร์ `public/` ถูก copy ไปยัง production server ด้วย

## การเรียนรู้เพิ่มเติม

- [MindAR Documentation](https://docs.mindar.org)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [Three.js](https://threejs.org/docs/)
