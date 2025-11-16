import { useMemo, useState } from "react";
import CardSceneFace from "./CardSceneFace";
import projectStore from "../utils/projectStore";
import ModalUploadImage from "./ModalUploadImage";

function SectionSceneFace({ project }) {
  const [showAddSceneModal, setShowAddSceneModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState("item");
  const { setProject } = projectStore();
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [sceneToDelete, setSceneToDelete] = useState(null); // { track_id, scene_key }
  const [customSceneImg, setCustomSceneImg] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

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

    // Find max scene number (e.g., S1, S2, S3 -> max is 3)
    const maxSceneNum = (t1.scenes || []).reduce((max, scene) => {
      const match = scene.scene_id?.match(/^S(\d+)$/);
      return match ? Math.max(max, parseInt(match[1], 10)) : max;
    }, 0);
    const nextIndex = maxSceneNum + 1;
    const newSceneId = `S${nextIndex}`;

    // Set default image based on scene type
    const defaultImg =
      selectedType === "face_mesh"
        ? "https://supabase.wemear.com/storage/v1/object/public/project-card/face_mesh"
        : "https://supabase.wemear.com/storage/v1/object/public/project-card/human_head";

    // Use custom image if uploaded, otherwise use default
    const sceneImage = customSceneImg || defaultImg;

    t1.scenes = [
      ...(t1.scenes || []),
      {
        scene_id: newSceneId,
        assets: [],
        scene_type: selectedType,
        scene_img: sceneImage,
      },
    ];

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
    setCustomSceneImg(null); // Reset custom image
  };

  // Open confirm-delete modal from CardSceneFace
  const openModalConfirmDelete = (track_id, scene_key) => {
    setSceneToDelete({ track_id, scene_key });
    setShowConfirmDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (!project || !sceneToDelete) return;

    const { track_id, scene_key } = sceneToDelete;

    const projectInfo = project.project_info || {};
    const info = projectInfo.info || {};
    const tracking_modes = info.tracking_modes || {};
    const face = tracking_modes.face || { tracks: [] };

    const tracks = (face.tracks || []).map((t) => {
      if (t.track_id !== track_id) return t;
      // Remove the scene with matching scene_id
      const newScenes = (t.scenes || []).filter(
        (s) => s.scene_id !== scene_key
      );
      return { ...t, scenes: newScenes };
    });

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
    setShowConfirmDeleteModal(false);
    setSceneToDelete(null);
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
        // Use scene_img if exists, otherwise fallback to default based on scene_type
        const imgsrc =
          scene.scene_img ||
          (scene.scene_type === "face_mesh"
            ? "https://supabase.wemear.com/storage/v1/object/public/project-card/face_mesh"
            : "https://supabase.wemear.com/storage/v1/object/public/project-card/human_head");
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

                  {/* Upload image section */}
                  <div className="flex-1 flex flex-col gap-3">
                    {customSceneImg ? (
                      <div className="relative">
                        <img
                          src={customSceneImg}
                          alt="Custom scene"
                          className="w-full h-32 object-cover rounded pb-2"
                        />
                        <button
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                          onClick={() => setCustomSceneImg(null)}
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <button
                        className="px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
                        onClick={() => setShowUploadModal(true)}
                      >
                        Upload Custom Image (Optional)
                      </button>
                    )}
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
            <CardSceneFace
              key={card.scene_id}
              card={card}
              openModalConfirmDelete={openModalConfirmDelete}
            />
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

      {/* Confirm delete modal */}
      {showConfirmDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black opacity-30"
            onClick={() => setShowConfirmDeleteModal(false)}
          />

          <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative z-10">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-lg font-semibold">Confirm Delete</h4>
              <button
                className="text-gray-600 hover:text-gray-900"
                onClick={() => setShowConfirmDeleteModal(false)}
              >
                ×
              </button>
            </div>

            <div className="text-sm text-gray-700 mb-4">
              Are you sure you want to delete scene{" "}
              <span className="font-medium">{sceneToDelete?.scene_key}</span>{" "}
              from track{" "}
              <span className="font-medium">{sceneToDelete?.track_id}</span>?
            </div>

            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-1 border rounded hover:bg-gray-100"
                onClick={() => setShowConfirmDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Image Modal */}
      <ModalUploadImage
        isOpen={showUploadModal}
        isClose={() => setShowUploadModal(false)}
        setSrc={setCustomSceneImg}
      />
    </div>
  );
}

export default SectionSceneFace;
