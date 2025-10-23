import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavbarWithSidebar from "../components/NavbarWithSidebar";
import QRCodeGenerator from "../components/QRCodeGenerator";
import ModalImageUpdate from "../components/ModalImageUpdate";
import SceneImageCards from "../components/SceneImageCards";
import projectStore from "../utils/projectStore.js";
import axiosInstance from "../utils/axios";


function Project() {
  const { id } = useParams();
  const [showSaveIndicator, setShowSaveIndicator] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const project = projectStore((state) => state.project);
  const setProject = projectStore((state) => state.setProject);
  const setProjectName = projectStore((state) => state.setProjectName);
  const setProjectLabel = projectStore((state) => state.setProjectLabel);
  const loadProjectFromStorage = projectStore((state) => state.loadProjectFromStorage);
  const saveProject = projectStore((state) => state.saveProject);

  // โหลดข้อมูลจาก API
  useEffect(() => {
    const fetchProject = async () => {
      if (!id) {
        setError("ไม่พบ Project ID");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // 1. ลองโหลดจาก localStorage ก่อน (ถ้า id ตรงกัน)
        const hasStoredProject = loadProjectFromStorage();
        const storedProject = projectStore.getState().project;

        if (hasStoredProject && storedProject?.project_id === id) {
          setIsLoading(false);
          return;
        }

        // 2. ถ้าไม่มีหรือ id ไม่ตรง ดึงจาก API
        const response = await axiosInstance.get(
          `/rest/v1/project?select=*,project_info(info)&project_id=eq.${id}`
        );

        if (response.data && response.data.length > 0) {
          const apiData = response.data[0];

          // แปลง API response ให้ตรงกับ structure ที่ใช้
          const projectData = {
            project_id: apiData.project_id,
            image: apiData.project_image,
            name: apiData.project_name,
            label: apiData.label,
            owner: apiData.owner,
            date: new Date(apiData.created_at).toLocaleDateString('th-TH'),
            status: apiData.status,
            tool: Array.isArray(apiData.tool) ? apiData.tool.join(", ") : apiData.tool,
            link: apiData.link,
            info: apiData.project_info?.info || { tracking_modes: {}, shared_assets: [] },
          };

          setProject(projectData);
        } else {
          setError("ไม่พบโปรเจคที่คุณกำลังมองหา");
        }
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id, setProject, loadProjectFromStorage]);

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



  // Loading state
  if (isLoading) {
    return (
      <>
        <NavbarWithSidebar />
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">กำลังโหลดโปรเจค...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <NavbarWithSidebar />
        <div className="container mx-auto p-4">
          <div className="text-center py-8">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              เกิดข้อผิดพลาด
            </h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              กลับไปหน้าก่อนหน้า
            </button>
          </div>
        </div>
      </>
    );
  }

  // No project state
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
            <div className="lg:w-1/2 flex items-center justify-center relative">
              <img
                src={project.image}
                alt={project.name}
                className="w-full h-64 lg:h-80 object-cover rounded-lg shadow-md"
              />
              {/* ปุ่มแก้ไขรูปภาพ - ลอยมุมขวาล่าง */}
              <button
                onClick={() => setIsImageModalOpen(true)}
                className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                title="แก้ไขรูปภาพ"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>
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

          <SceneImageCards project={project} />

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

      {/* Modal สำหรับอัพเดทรูปภาพ */}
      <ModalImageUpdate
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        projectId={id}
      />
    </>
  );
}

export default Project;
