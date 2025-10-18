import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Preview from "./pages/Preview";
import TestPage from "./pages/TestPage"; // 1. Import TestPage
import Project from "./pages/Project"; // เพิ่มการ import Project page
import Register from "./pages/Register"; // เพิ่มการ import Register page
import Login from "./pages/Login"; // เพิ่มการ import Login page
import NotFound from "./pages/NotFound";
import TestComponent from "./pages/TestComponent";
import NavbarWithSidebar from "./components/NavbarWithSidebar";

function App() {
  return (
    <Router>
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <NavbarWithSidebar />
                <Home />
              </>
            }
          />
          <Route path="/preview" element={<Preview />} />
          <Route path="/project/:id" element={<Project />} /> {/* เพิ่ม route สำหรับ Project page */}
          <Route path="/register" element={<Register />} /> {/* เพิ่ม route สำหรับ Register page */}
          <Route path="/login" element={<Login />} /> {/* เพิ่ม route สำหรับ Login page */}
          <Route path="/testpage" element={<TestPage />} />
          <Route path="/testcomponent" element={<TestComponent />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
