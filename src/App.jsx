import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import ArView from "./pages/ArView";
import TestPage from "./pages/TestPage"; // 1. Import TestPage
import NotFound from "./pages/NotFound";
import TestComponent from "./pages/TestComponent";
import NavbarWithSidebar from "./components/NavbarWithSidebar";
import Test_Ar_Mind from "./pages/TestArMind"; // 2. Import Test_Ar_Mind

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
          <Route path="/ar" element={<ArView />} />
          <Route path="/testpage" element={<TestPage />} />
          <Route path="/testcomponent" element={<TestComponent />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/test_ar_mind" element={<Test_Ar_Mind />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
