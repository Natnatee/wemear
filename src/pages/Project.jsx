import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import NavbarWithSidebar from "../components/NavbarWithSidebar";
import SceneCard from "../components/SceneCard";
import QRCodeGenerator from "../components/QRCodeGenerator";
import { make_project } from "../make_data/make_project.js";
import projectStore from "../utils/projectStore.js";

function Project() {
  const { id } = useParams();
  const [showSaveIndicator, setShowSaveIndicator] = useState(false);

  // ใช้เพื่อ mock ข้อมูล
  const project = projectStore((state) => state.project);
  const setProject = projectStore((state) => state.setProject);
  const setProjectName = projectStore((state) => state.setProjectName);
  const setProjectLabel = projectStore((state) => state.setProjectLabel);
  const loadProjectFromStorage = projectStore((state) => state.loadProjectFromStorage);
  const saveProject = projectStore((state) => state.saveProject);

  // โหลดข้อมูลเมื่อเปิดหน้า
  useEffect(() => {
    // 1. ลองโหลดจาก localStorage ก่อน
    const hasStoredProject = loadProjectFromStorage();

    if (!hasStoredProject) {
      // 2. ถ้าไม่มี ใช้ mock data
      const mockData = make_project;
      setProject(mockData);
    }
  }, [setProject, loadProjectFromStorage]);

  // Auto-save เมื่อออกจากหน้า
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveProject();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [saveProject]);

  // แสดง save indicator เมื่อแก้ไข
  const handleProjectNameChange = (value) => {
    setProjectName(value);
    setShowSaveIndicator(true);
    setTimeout(() => setShowSaveIndicator(false), 2000);
  };

  const handleProjectLabelChange = (value) => {
    setProjectLabel(value);
    setShowSaveIndicator(true);
    setTimeout(() => setShowSaveIndicator(false), 2000);
  };

  // memoize derived array เพื่อไม่คำนวณซ้ำบ่อย ๆ
  const sceneCards = useMemo(() => {
    // A. ตรวจสอบ State
    if (!project) return [];

    // B. นำตรรกะคำนวณจาก sceneImageProject ใน Store มาใส่
    const imageMode = project.info?.tracking_modes?.image;
    if (!imageMode) return [];

    const mindImages = imageMode.mindFile?.image || {};

    // C. คำนวณและคืนค่า Array
    return (imageMode.tracks || []).flatMap((track) => {
      const trackId = track.track_id;
      const imgsrc = mindImages[trackId] ?? "/default_asset_image/image.png";
      const scenes = track.scenes || [];
      return scenes.map((scene) => ({
        type: "image",
        imgsrc,
        scene_id: `IMAGE_${trackId}${scene.scene_id}`, // IMAGE_T1S1
        track_id: trackId,
        scene_key: scene.scene_id,
      }));
    });
  }, [project]); // 4. Dependency คือ 'project' เท่านั้น

  if (!project) {
    return (
      <>
        <NavbarWithSidebar />
        <div className="container mx-auto p-4">
          <div className="text-center py-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              ไม่พบโปรเจค
            </h1>
            <p className="text-gray-600">ไม่พบโปรเจคที่คุณกำลังมองหา</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavbarWithSidebar />
      <div className="container mx-auto p-4">
        <div className="max-w-6xl mx-auto">
          {/* ส่วนบน - แยกซ้ายขวา */}
          <div className="flex flex-col lg:flex-row gap-8 mb-8">
            {/* ซ้าย - รูปภาพ */}
            <div className="lg:w-1/2 flex items-center justify-center">
              <img
                src={project.image}
                alt={project.name}
                className="w-full h-64 lg:h-80 object-cover rounded-lg shadow-md"
              />
            </div>

            {/* ขวา - รายละเอียดโปรเจค */}
            <div className="lg:w-1/2 relative">
              {/* Save Indicator */}
              {showSaveIndicator && (
                <div className="absolute top-2 right-2 z-10">
                  <div className="flex items-center gap-2 bg-green-100 text-green-700 text-xs px-3 py-2 rounded-lg shadow">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Auto-saving...
                  </div>
                </div>
              )}
              <div className="bg-gray-50 rounded-lg p-6 h-full">
                <h2 className="text-xl font-semibold mb-4">รายละเอียดโปรเจค</h2>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-700">
                      ชื่อโปรเจค:
                    </span>
                    <input
                      type="text"
                      value={project.name ?? ""}
                      onChange={(e) => handleProjectNameChange(e.target.value)}
                      className="ml-2 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="ใส่ชื่อโปรเจค"
                    />
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Label:</span>
                    <input
                      type="text"
                      value={project.label ?? ""}
                      onChange={(e) => handleProjectLabelChange(e.target.value)}
                      className="ml-2 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="ใส่ label"
                    />
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Owner:</span>
                    <span className="ml-2">{project.owner}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">
                      วันที่สร้าง:
                    </span>
                    <span className="ml-2">{project.date}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">สถานะ:</span>
                    <span
                      className={`ml-2 px-2 py-1 rounded text-sm ${project.status === "Published"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                        }`}
                    >
                      {project.status}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Tool:</span>
                    <span className="ml-2">{project.tool}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ส่วน - แสดง Scene CardImage */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">
              Scenes (Image Tracking)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {sceneCards.map((card) => (
                <SceneCard key={card.scene_id} card={card} />
              ))}
            </div>
          </div>

          {/* ส่วน QR Code */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <QRCodeGenerator link={project.link} />
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              onClick={() => {
                saveProject(); // Save ก่อน deploy
                console.log(project);
              }}
            >
              Deploy
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Project;
