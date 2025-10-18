# คู่มือการพัฒนา WeMeAr

## การเริ่มต้นพัฒนา

### Environment Setup

1. **Node.js Version**: ใช้ Node.js 20.x หรือสูงกว่า
2. **Package Manager**: รองรับทั้ง npm และ pnpm
3. **IDE**: แนะนำ VS Code กับ extensions เหล่านี้:
   - ES7+ React/Redux/React-Native snippets
   - Prettier - Code formatter
   - ESLint
4. api ใช้ utils/axios.js สำหรับ api ทั่วไป และ utils/axiosAdmin.js สำหรับ api สำหรับ admin
5. โฟลเดอร์ hook ไว้ใช้สำหรับการจัดการ state by react query
6. โฟลเดอร์ utils ไว้ใช้สำหรับการจัดการ utility functions
7. โฟลเดอร์ components ไว้ใช้สำหรับการจัดการ components
8. โฟลเดอร์ make_data ไว้ใช้สำหรับการจัดการ mockdata
9. โฟลเดอร์ pages ไว้ใช้สำหรับการจัดการ pages
