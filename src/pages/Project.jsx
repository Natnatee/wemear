// import { useParams } from "react-router-dom";
import { useEffect } from "react";
import NavbarWithSidebar from "../components/NavbarWithSidebar";
import CardImage from "../components/CardImage";
import QRCodeGenerator from "../components/QRCodeGenerator";
import { make_project } from "../make_data/make_project.js";
import projectStore from "../utils/projectStore.js";

function Project() {
  //รอใช้ตอนดึงข้อมูลจริง
  // const { id } = useParams();

  // ใช้เพื่อ mock ข้อมูล
  const project = projectStore((state) => state.project);
  const setProject = projectStore((state) => state.setProject); // 👈 ดึง Action มาด้วย
  const setProjectName = projectStore((state) => state.setProjectName);
  const setProjectLabel = projectStore((state) => state.setProjectLabel);

  // ใช้ useEffect เพื่อโหลดข้อมูล Mock เข้า Store
  useEffect(() => {
    // ในโลกจริง: โค้ดนี้คือการเรียก API
    const mockData = make_project;

    // บันทึกข้อมูลเข้า Zustand State
    setProject(mockData);
  }, [setProject]); // Array ว่าง [] หรือ [setProject] เพื่อให้รันครั้งเดียว

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
                      onChange={(e) => setProjectName(e.target.value)}
                      className="ml-2 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="ใส่ชื่อโปรเจค"
                    />
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Label:</span>
                    <input
                      type="text"
                      value={project.label ?? ""}
                      onChange={(e) => setProjectLabel(e.target.value)}
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
                      className={`ml-2 px-2 py-1 rounded text-sm ${
                        project.status === "Published"
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
              {/*
                ตรวจสอบว่ามีข้อมูล image tracking อยู่ก่อน จากนั้น map tracks -> scenes
                แต่ละ card ใช้รูปจาก make_project.info.tracking_modes.image.mindFile.image[trackId]
                id ของแต่ละ card เป็น IMAGE_{trackId}{sceneId} เช่น IMAGE_T1S1
                ถ้ามีหลาย scene ใน track เดียวกัน จะใช้รูปเดียวกัน
              */}
              {project?.info?.tracking_modes?.image?.tracks?.map((track) =>
                track.scenes?.map((scene) => {
                  const trackId = track.track_id; // ex "T1"
                  const sceneId = scene.scene_id; // ex "S1"
                  const mindImages =
                    project.info?.tracking_modes?.image?.mindFile?.image || {};
                  const imgSrc =
                    mindImages[trackId] ?? "/default_asset_image/image.png";
                  const cardId = `IMAGE_${trackId}${sceneId}`; // IMAGE_T1S1
                  return (
                    <div
                      key={cardId}
                      className="bg-white rounded-lg shadow p-3 flex flex-col items-start"
                    >
                      <img
                        src={imgSrc}
                        alt={cardId}
                        className="w-full h-40 object-cover rounded mb-3"
                      />
                      <div className="text-sm font-medium">{cardId}</div>

                    </div>
                  );
                })
              )}
            </div>
          </div>
          {/* ส่วน QR Code */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <QRCodeGenerator link={project.link} />
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              onClick={() => console.log(project)}
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
