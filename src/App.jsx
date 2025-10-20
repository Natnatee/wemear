import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import Home from "./pages/Home";
import Preview from "./pages/Preview";
import TestPage from "./pages/TestPage";
import Project from "./pages/Project";
import Register from "./pages/Register";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import TestComponent from "./pages/TestComponent";
import NavbarWithSidebar from "./components/NavbarWithSidebar";
import ImageAssets from "./pages/assets/ImageAssets";
import VideoAssets from "./pages/assets/VideoAssets";
import ThreeDAssets from "./pages/assets/ThreeDAssets";
import AudioAssets from "./pages/assets/AudioAssets";
import MindFileAssets from "./pages/assets/MindFileAssets";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
            <Route path="/project/:id" element={<Project />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/testpage" element={<TestPage />} />
            <Route path="/testcomponent" element={<TestComponent />} />
            <Route path="/assets/image" element={<ImageAssets />} />
            <Route path="/assets/video" element={<VideoAssets />} />
            <Route path="/assets/3d" element={<ThreeDAssets />} />
            <Route path="/assets/audio" element={<AudioAssets />} />
            <Route path="/assets/mindfile" element={<MindFileAssets />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
