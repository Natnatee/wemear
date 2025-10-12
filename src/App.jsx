import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Preview from "./pages/Preview";
import TestPage from "./pages/TestPage"; // 1. Import TestPage
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
          <Route path="/testpage" element={<TestPage />} />
          <Route path="/testcomponent" element={<TestComponent />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
