import { useMemo, useState } from "react";
import CardSceneFace from "./CardSceneFace";
import projectStore from "../utils/projectStore";

function SectionSceneFace({ project }) {
  const [showAddSceneModal, setShowAddSceneModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState("item");
  const { setProject } = projectStore();

  const handleModalAdd = () => {
    if (!project) return;

    const selectedType = selectedTab === "mesh" ? "face_mesh" : "face_item";

    // Ensure project_info/info/tracking_modes exist
    const projectInfo = project.project_info || {};
    const info = projectInfo.info || {};
    const tracking_modes = info.tracking_modes || {};
    const face = tracking_modes.face || { tracks: [] };

    // Find or create T1
    const tracks = face.tracks || [];
    let t1 = tracks.find((t) => t.track_id === "T1");
    if (!t1) {
      t1 = { track_id: "T1", scenes: [] };
      tracks.push(t1);
    }

    const nextIndex = (t1.scenes?.length || 0) + 1; // simple increment
    const newSceneId = `S${nextIndex}`;
    t1.scenes = [...(t1.scenes || []), { scene_id: newSceneId, assets: [], scene_type: selectedType }];

    const newFace = { ...face, tracks };

    const updatedProject = {
      ...project,
      project_info: {
        ...projectInfo,
        info: {
          ...info,
          tracking_modes: {
            ...tracking_modes,
            face: newFace,
          },
        },
      },
    };

    setProject(updatedProject);
    setShowAddSceneModal(false);
  };

  const sceneCards = useMemo(() => {
    // A. ตรวจสอบ State
    if (!project) return [];

    // B. ใช้ข้อมูล face tracking (มีแค่ T1 เป็นหลัก)
    const faceMode = project.project_info?.info?.tracking_modes?.face;

    // C. คำนวณและคืนค่า Array จาก faceMode
    // ใช้ optional chaining เพื่อให้ปลอดภัยแม้ faceMode ยังไม่ถูกสร้าง — จะกลายเป็น [] อัตโนมัติ
    return (faceMode?.tracks || []).flatMap((track) => {
      const trackId = track.track_id;
      const scenes = track.scenes || [];
      return scenes.map((scene) => {
        const imgsrc =
          scene.scene_type === "face_mesh"
            ? "/assets_face/face_mesh.png"
            : "/assets_face/human_head.jpg";
        return {
          type: "face",
          imgsrc,
          scene_id: `FACE_${trackId}${scene.scene_id}`, // FACE_T1S1
          track_id: trackId,
          scene_key: scene.scene_id,
        };
      });
    });
  }, [project]); // 4. Dependency คือ 'project' เท่านั้น

  // รายการ tracks ที่มีอยู่
  // availableTracks not required right now (modal handles adding)

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Scenes Face</h3>
      </div>

      {/* Container สำหรับ cards พร้อม scroll bar แกน x */}
      <div className="overflow-x-auto">
        <div className="grid grid-cols-4 grid-rows-2 gap-6 min-w-max lg:min-w-0">
          {/* Card แรก: ปุ่มเพิ่ม Scene */}
          <div className="relative">
            <button
              onClick={() => setShowAddSceneModal(true)}
              className="w-full h-48 border-2 border-dashed border-red-500 rounded-lg flex flex-col items-center justify-center hover:bg-red-50 transition-colors group"
            >
              <div className="text-6xl text-red-500 font-light mb-2">+</div>
              <span className="text-sm font-medium text-red-600">
                Add Scene
              </span>
            </button>

            {/* Modal สำหรับเพิ่ม Scene (ว่างตอนนี้) */}
            {showAddSceneModal && (
              <div className="fixed inset-0 z-40 flex items-center justify-center">
                <div
                  className="absolute inset-0 bg-black opacity-30"
                  onClick={() => setShowAddSceneModal(false)}
                />
                <div className="bg-white rounded-lg shadow-lg p-6 z-50 w-96 h-56 flex flex-col relative">
                  <div className="flex justify-end">
                    <button
                      className="text-gray-600 hover:text-gray-900"
                      onClick={() => setShowAddSceneModal(false)}
                    >
                      ×
                    </button>
                  </div>

                  {/* Toggle buttons top */}
                  <div className="flex gap-2 mb-4">
                    <button
                      className={`px-3 py-1 rounded ${
                        selectedTab === "item"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                      onClick={() => setSelectedTab("item")}
                    >
                      Face Item
                    </button>
                    <button
                      className={`px-3 py-1 rounded ${
                        selectedTab === "mesh"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                      onClick={() => setSelectedTab("mesh")}
                    >
                      Face Mesh
                    </button>
                  </div>

                  {/* content placeholder */}
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    Select an option and click Add
                  </div>

                  {/* Add button bottom-right */}
                  <div className="absolute bottom-4 right-4">
                    <button
                      className="px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700"
                      onClick={handleModalAdd}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* แสดง Scene Cards ที่มีอยู่ (สูงสุด 7 cards เพราะตำแหน่งแรกเป็นปุ่ม +) */}
          {sceneCards.slice(0, 7).map((card) => (
            <CardSceneFace key={card.scene_id} card={card} />
          ))}
        </div>
      </div>

      {/* ปิด modal เมื่อคลิกข้างนอก */}
      {showAddSceneModal && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowAddSceneModal(false)}
        />
      )}
    </div>
  );
}

export default SectionSceneFace;
