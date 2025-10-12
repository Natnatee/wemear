# WeMeAr - Augmented Reality Web Application

## 📖 ภาพรวมโปรเจค

**WeMeAr** เป็นแอปพลิเคชัน Augmented Reality บนเว็บที่พัฒนาด้วยเทคโนโลยีล้ำสมัย ผสมผสานระหว่าง AI, Computer Vision และ Web 3D Graphics เพื่อสร้างประสบการณ์ AR ที่น่าทึ่งบนเบราว์เซอร์

### 🎯 วัตถุประสงค์

โปรเจคนี้พัฒนาขึ้นเพื่อสำรวจและแสดงศักยภาพของเทคโนโลยี Augmented Reality บนเว็บ โดยใช้การติดตามภาพ (Image Tracking) เพื่อ overlay เนื้อหาดิจิทัล (3D Models, Videos, Images) บนภาพจริงผ่านกล้องของอุปกรณ์

## 🚀 เทคโนโลยีที่ใช้

### Core Technologies
- **React 18** - Frontend framework สำหรับสร้าง UI
- **Vite** - Build tool ที่รวดเร็วและทันสมัย
- **A-Frame** - Web framework สำหรับสร้าง VR/AR บนเว็บ
- **MindAR** - Library สำหรับการติดตามภาพและสร้าง AR บนเว็บ

### AI & Computer Vision
- **TensorFlow.js** - Machine Learning framework สำหรับเว็บ
- **MediaPipe** - Google ไลบรารีสำหรับ Computer Vision tasks
- **@tensorflow/tfjs-backend-cpu** & **@tensorflow/tfjs-backend-webgl** - Backend สำหรับการคำนวณ ML

### 3D Graphics & Assets
- **Three.js** - 3D graphics library
- **@react-three/fiber** - React renderer สำหรับ Three.js
- **@react-three/drei** - Helper components สำหรับ React Three Fiber

### UI & Styling
- **Tailwind CSS** - CSS framework สำหรับ styling
- **Flowbite** - UI component library
- **Lucide React** - Icon library

### Backend & Storage
- **Supabase** - Backend-as-a-Service สำหรับเก็บข้อมูลและ assets
- **React Router DOM** - สำหรับการจัดการ routing

## 🏗️ โครงสร้างโปรเจค

```
wemear/
├── src/
│   ├── components/          # React components
│   │   ├── tests/          # Test components สำหรับทดสอบฟีเจอร์
│   │   │   └── TestArMind2.jsx  # คอมโปเนนท์หลักสำหรับ AR
│   │   └── ...             # อื่นๆ
│   ├── pages/              # React pages สำหรับ routing
│   ├── utils/              # Utility functions (51 files)
│   │   ├── threeToAframe.js # แปลงข้อมูล Three.js ให้กับ A-Frame
│   │   ├── idbAsset.js     # จัดการ asset caching ด้วย IndexedDB
│   │   └── ...             # utility functions อื่นๆ
│   ├── make_data/          # ข้อมูลสำหรับสร้าง AR scenes
│   │   └── make_mind_ar.js # กำหนด AR targets และ assets
│   ├── assets/             # Static assets
│   ├── App.jsx             # Main App component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── public/                 # Public static files
├── package.json            # Dependencies และ scripts
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── README.md              # เอกสารนี้
```

## 🔧 การติดตั้งและใช้งาน

### Prerequisites
- Node.js 16+
- npm หรือ pnpm
- อุปกรณ์ที่รองรับกล้อง (สำหรับทดสอบ AR)

### การติดตั้ง

```bash
# Clone โปรเจค
git clone <repository-url>
cd wemear

# ติดตั้ง dependencies
npm install
# หรือ
pnpm install

# เริ่ม development server
npm run dev
# หรือ
pnpm dev

# Build สำหรับ production
npm run build

# Preview production build
npm run preview
```

### การใช้งาน

1. เปิดเบราว์เซอร์และไปที่ `http://localhost:5173`
2. ให้สิทธิ์การเข้าถึงกล้องเมื่อถูกถาม
3. เล็งกล้องไปที่ภาพที่รองรับการติดตาม
4. สนุกกับประสบการณ์ AR!

## 🎨 คุณสมบัติหลัก

### Image Tracking
- ติดตามภาพจริงด้วย MindAR
- รองรับการ overlay หลายประเภทเนื้อหา

### Asset Types ที่รองรับ
- **3D Models** (.gltf, .glb)
- **Videos** (.mp4, .webm)
- **Images** (.jpg, .png, .webp)

### Asset Caching
- ใช้ IndexedDB สำหรับ cache assets
- ลดเวลาโหลดและการใช้ bandwidth

### Lighting System
- ระบบแสงสว่าง 3 ระดับ (ambient + directional)
- รองรับ shadow casting

## 📁 โครงสร้างข้อมูล AR

ข้อมูล AR แต่ละ scene ประกอบด้วย:

```javascript
{
  id: "unique-id",
  "image tracking": {
    track1: [ // Target สำหรับติดตาม
      {
        src: "asset-url",
        type: "3D Model", // หรือ "Video", "Image"
        scale: [0.1, 0.1, 0.1],
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        // สำหรับ Video
        autoplay: true,
        loop: true,
        muted: true
      }
    ]
  },
  mindFile: "mindar-target-file-url"
}
```

## 🔒 ความปลอดภัยและประสิทธิภาพ

- **HTTPS Only**: ต้องใช้ HTTPS สำหรับการเข้าถึงกล้อง
- **Asset Caching**: ลดการโหลดซ้ำด้วย IndexedDB
- **Memory Management**: จัดการ memory อย่างเหมาะสมสำหรับ 3D assets

## 🛠️ การพัฒนา

### สำคัญสำหรับนักพัฒนา

1. **MindAR Files**: ต้องสร้างไฟล์ `.mind` สำหรับการติดตามภาพ
2. **Asset Optimization**: ควร optimize 3D models และ videos สำหรับเว็บ
3. **Browser Compatibility**: ทดสอบบนเบราว์เซอร์ที่รองรับ WebGL

### การแก้ไขข้อผิดพลาดทั่วไป

- **กล้องไม่ทำงาน**: ตรวจสอบ HTTPS และ permissions
- **Assets ไม่โหลด**: ตรวจสอบ URLs และ CORS settings
- **Performance Issues**: ลดขนาด assets หรือใช้ LOD (Level of Detail)

## 📚 การเรียนรู้เพิ่มเติม

- [MindAR Documentation](https://hiukim.github.io/mind-ar-js-doc/)
- [A-Frame Documentation](https://aframe.io/docs/)
- [Three.js Documentation](https://threejs.org/docs/)
- [TensorFlow.js Guide](https://www.tensorflow.org/js)

## 👥 ผู้พัฒนา

โปรเจคนี้พัฒนาโดยทีมพัฒนา WeMeAr

## 📄 สิทธิ์การใช้งาน

โปรเจคนี้เป็น open source ภายใต้ [MIT License](LICENSE)

---

**หมายเหตุ**: โปรเจคนี้เป็นตัวอย่างการพัฒนา AR บนเว็บ ควรปรับแต่งให้เหมาะสมกับความต้องการเฉพาะของแต่ละโปรเจค
