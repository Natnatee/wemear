import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import ArView from "./pages/ArView";
import TestPage from "./pages/TestPage"; // 1. Import TestPage
import NotFound from "./pages/NotFound";
import "./App.css";

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">หน้าหลัก</Link> |<Link to="/ar">เริ่ม AR</Link> |
        <Link to="/test">🧪 ทดสอบ</Link> {/* 2. เพิ่ม Link ใหม่ */}
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ar" element={<ArView />} />
          <Route path="/test" element={<TestPage />} />{" "}
          {/* 3. เพิ่ม Route ใหม่ */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
