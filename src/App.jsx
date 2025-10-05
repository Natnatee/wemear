import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import ArView from "./pages/ArView";
import TestPage from "./pages/TestPage"; // 1. Import TestPage
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
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
