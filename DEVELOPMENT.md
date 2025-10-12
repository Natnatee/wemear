# คู่มือการพัฒนา WeMeAr

## การเริ่มต้นพัฒนา

### Environment Setup

1. **Node.js Version**: ใช้ Node.js 16.x หรือสูงกว่า
2. **Package Manager**: รองรับทั้ง npm และ pnpm
3. **IDE**: แนะนำ VS Code กับ extensions เหล่านี้:
   - ES7+ React/Redux/React-Native snippets
   - Prettier - Code formatter
   - ESLint

### Project Structure สำหรับ Developer

```
src/
├── components/          # React components
│   ├── tests/          # Test components (สำคัญสำหรับ AR)
│   └── ui/             # Reusable UI components
├── pages/              # Page components สำหรับ routing
├── utils/              # Utility functions (51 files)
│   ├── threeToAframe.js # แปลง Three.js → A-Frame
│   ├── idbAsset.js     # Asset caching ด้วย IndexedDB
│   ├── assetLoader.js  # โหลด assets จาก URLs
│   └── coordinateUtils.js # จัดการ coordinate transformations
├── make_data/          # Data definitions สำหรับ AR scenes
│   └── make_mind_ar.js # AR scene configurations
├── hooks/              # Custom React hooks (ถ้ามี)
└── contexts/           # React contexts (ถ้ามี)
```

## การพัฒนา AR Features

### 1. การเพิ่ม AR Scene ใหม่

1. **กำหนดข้อมูลใน make_mind_ar.js**:
```javascript
export const make_mind_ar = [
  {
    id: "new-scene-id",
    "image tracking": {
      track1: [/* assets สำหรับ target นี้ */],
      track2: [/* assets สำหรับ target อื่น */]
    },
    mindFile: "https://path-to-your.mind-file"
  }
];
```

2. **สร้าง component สำหรับ scene ใหม่**:
```jsx
// src/components/ar/NewARScene.jsx
import React, { useEffect } from 'react';
import { make_mind_ar } from '../../make_data/make_mind_ar';

const NewARScene = () => {
  useEffect(() => {
    const initAR = async () => {
      // AR initialization logic
      const arData = make_mind_ar.find(scene => scene.id === 'new-scene-id');
      // ... rest of implementation
    };
    initAR();
  }, []);

  return (
    <div id="ar-container">
      {/* AR scene will be rendered here */}
    </div>
  );
};

export default NewARScene;
```

### 2. การเพิ่ม Asset Types ใหม่

ปัจจุบันรองรับ 3 ประเภท:
- **3D Model** (.gltf, .glb)
- **Video** (.mp4, .webm)
- **Image** (.jpg, .png)

การเพิ่มประเภทใหม่:

1. **แก้ไข TestArMind2.jsx**:
```jsx
// เพิ่ม case ใหม่ใน loop ที่ render assets
for (const [modelIdx, t] of models.entries()) {
  if (t.type === "NewAssetType") {
    // Handle new asset type
    const newAsset = document.createElement("a-new-asset");
    // ... setup attributes
    entity.appendChild(newAsset);
  }
  // ... existing cases
}
```

2. **เพิ่ม utility function** สำหรับประเภทใหม่ใน utils/

## การทำงานกับ Assets

### Asset Requirements

#### 3D Models
- **Format**: .gltf หรือ .glb
- **Size**: ควร optimize สำหรับเว็บ (< 5MB)
- **Textures**: รวม textures ไว้ในไฟล์เดียวถ้าเป็นไปได้

#### Videos
- **Format**: .mp4 (H.264) หรือ .webm
- **Resolution**: ไม่เกิน 1080p สำหรับ performance
- **Duration**: ควรสั้นสำหรับ AR usage

#### Images
- **Format**: .jpg, .png, .webp
- **Size**: ควร resize ให้เหมาะสมกับ usage

### Asset Optimization

#### สำหรับ 3D Models
```bash
# ใช้ gltf-pipeline สำหรับ optimization
npx gltf-pipeline -i model.gltf -o optimized.gltf --draco
```

#### สำหรับ Videos
```bash
# ใช้ ffmpeg สำหรับ compression
ffmpeg -i input.mp4 -crf 23 -preset medium output.mp4
```

## การแก้ไขปัญหา

### Common Issues

#### 1. Camera ไม่ทำงาน
**สาเหตุ**: HTTP (ไม่ใช่ HTTPS) หรือ permissions
**แก้ไข**:
- ตรวจสอบ HTTPS certificate
- ตรวจสอบ browser permissions
- ทดสอบกับ simple getUserMedia example

#### 2. Assets ไม่โหลด
**สาเหตุ**: CORS หรือ network issues
**แก้ไข**:
```javascript
// ตรวจสอบ CORS headers ใน Network tab
// Assets จาก external domains ต้องมี CORS: *
```

#### 3. Performance Issues
**สาเหตุ**: Large assets หรือ inefficient rendering
**แก้ไข**:
- ลดขนาด assets
- ใช้ LOD (Level of Detail)
- ตรวจสอบ WebGL performance ใน DevTools

### Debug Tools

#### Browser DevTools
```javascript
// ใน Console สำหรับ debugging
// ตรวจสอบ MindAR initialization
console.log(window.MINDAR);

// ตรวจสอบ A-Frame scene
console.log(document.querySelector('a-scene'));

// ตรวจสอบ asset loading
window.addEventListener('arReady', () => {
  console.log('AR is ready!');
});
```

#### Performance Monitoring
```javascript
// ใน Console
// Monitor frame rate
console.log('FPS:', 1000 / (performance.now() - lastFrame));

// Monitor memory usage
console.log('Memory:', performance.memory);
```

## การ Testing

### Manual Testing Checklist

- [ ] Camera access ทำงานบน HTTPS
- [ ] Image tracking ทำงานกับ target images
- [ ] Assets โหลดและแสดงผลถูกต้อง
- [ ] Performance ไม่ drop ต่ำกว่า 30 FPS
- [ ] Memory ไม่ leak เมื่อเปลี่ยน scenes

### Automated Testing (ถ้ามี)

```javascript
// ตัวอย่าง Jest tests สำหรับ utilities
import { convertToAframe } from '../utils/threeToAframe';

test('converts Three.js coordinates to A-Frame', () => {
  const threeCoords = [1, 2, 3];
  const aframeCoords = convertToAframe(threeCoords, 'position');
  expect(aframeCoords).toBe('1 2 3');
});
```

## Best Practices

### Code Organization

1. **Separation of Concerns**:
   - Components สำหรับ UI logic
   - Utils สำหรับ pure functions
   - Data files สำหรับ configuration

2. **Error Handling**:
```javascript
// ใช้ try-catch สำหรับ async operations
try {
  await loadAsset(assetUrl);
} catch (error) {
  console.error('Failed to load asset:', error);
  // แสดง error UI ให้ user
}
```

3. **Memory Management**:
```javascript
// Clean up object URLs
const objectUrl = URL.createObjectURL(blob);
assetElement.addEventListener('model-loaded', () => {
  URL.revokeObjectURL(objectUrl);
});
```

### Performance

1. **Asset Loading**:
   - Pre-load critical assets
   - ใช้ progressive loading สำหรับ large assets
   - Implement asset pooling สำหรับ reusable objects

2. **Rendering**:
   - ใช้ appropriate frame rates
   - Implement culling สำหรับ off-screen objects
   - Optimize lighting setups

## การ Deploy

### Development
```bash
npm run dev
# ใช้ Vite dev server ที่รวดเร็วและมี HMR
```

### Production
```bash
npm run build
npm run preview
# Build optimized สำหรับ production
# Test production build ก่อน deploy จริง
```

### Hosting Platforms

#### แนะนำสำหรับ AR Web Apps:
- **Netlify**: ง่ายต่อการ deploy และมี HTTPS ฟรี
- **Vercel**: รองรับ large bundles และมี edge caching
- **Firebase Hosting**: ดีสำหรับ PWA features

#### Hosting Requirements:
- HTTPS mandatory สำหรับ camera access
- WebGL support
- Adequate bandwidth สำหรับ assets

## Contributing Guidelines

### Code Style
- ใช้ ESLint และ Prettier
- ตั้งชื่อ functions และ variables ให้ descriptive
- เขียน comments สำหรับ logic ที่ซับซ้อน

### Pull Request Process
1. สร้าง branch สำหรับ feature ใหม่
2. เขียน tests ถ้าจำเป็น
3. อัปเดต documentation
4. สร้าง PR กับ description ที่ชัดเจน

### Code Review Checklist
- [ ] Code ทำงานถูกต้อง
- [ ] ไม่มี security vulnerabilities
- [ ] Performance impact ได้รับการพิจารณา
- [ ] มี error handling ที่เหมาะสม
- [ ] Documentation อัปเดตแล้ว

---

เอกสารนี้เป็นคู่มือสำหรับนักพัฒนาที่ต้องการพัฒนาและ maintain โปรเจค WeMeAr ต่อไป
