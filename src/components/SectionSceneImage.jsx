import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CardSceneImage from "./CardSceneImage";
import projectStore from "../utils/projectStore";
import { useMindImages } from "../hook/useMind";

function SectionSceneImage({ project }) {
  const [selectedMindName, setSelectedMindName] = useState("");
  const [showTrackSelector, setShowTrackSelector] = useState(false);
  const { setProject } = projectStore();
  const navigate = useNavigate();

  // ดึงข้อมูล mind_image จาก React Query
  const { data: mindImages = [], isLoading: loading } = useMindImages();

  // ตั้งค่า selected mind name จาก project ที่มีอยู่
  useEffect(() => {
    if (
      project?.project_info?.info?.tracking_modes?.image?.mindFile?.mind_name
    ) {
      setSelectedMindName(
        project.project_info.info.tracking_modes.image.mindFile.mind_name
      );
    }
  }, [project]);

  // Handler สำหรับเปลี่ยน mind_name
  const handleMindNameChange = (e) => {
    const mindName = e.target.value;
    setSelectedMindName(mindName);

    // หา mind object ที่เลือก
    const selectedMind = mindImages.find((mind) => mind.mind_name === mindName);

    if (selectedMind && project) {
      // สร้าง tracks อัตโนมัติจาก mind_image keys (T1, T2, T3, T4)
      // แต่ถ้าใน project.info.tracking_modes.image.tracks มี track ที่มี scene "S1"
      // และ scene นั้นมี assets ที่ไม่ใช่ [] ให้เก็บ track นั้นไว้เหมือนเดิม
      const trackIds = Object.keys(selectedMind.mind_image || {});
      const existingTracks =
        project.project_info?.info?.tracking_modes?.image?.tracks || [];

      const tracks = trackIds.map((trackId) => {
        const existing = existingTracks.find((t) => t.track_id === trackId);
        const hasNonEmptyS1 = !!(
          existing &&
          Array.isArray(existing.scenes) &&
          existing.scenes.some(
            (s) =>
              s.scene_id === "S1" &&
              Array.isArray(s.assets) &&
              s.assets.length > 0
          )
        );

        if (hasNonEmptyS1) {
          // เก็บ track เดิมไว้ทั้งก้อน
          return existing;
        }

        // สร้าง track ใหม่ (S1 เปล่า)
        return {
          track_id: trackId,
          scenes: [
            {
              scene_id: "S1",
              assets: [],
            },
          ],
        };
      });

      // อัพเดท project state ในส่วน image tracking (update project.project_info.info)
      const updatedProject = {
        ...project,
        project_info: {
          ...project.project_info,
          info: {
            ...project.project_info?.info,
            tracking_modes: {
              ...project.project_info?.info?.tracking_modes,
              image: {
                ...project.project_info?.info?.tracking_modes?.image,
                mindFile: {
                  mind_name: selectedMind.mind_name,
                  mind_id: selectedMind.mind_id,
                  mind_src: selectedMind.mind_src,
                  mind_image: selectedMind.mind_image,
                },
                tracks: tracks,
              },
            },
          },
        },
      };

      // อัพเดท projectStore
      setProject(updatedProject);
    }
  };

  // Handler สำหรับเพิ่ม scene ใหม่
  const handleAddScene = (trackId) => {
    if (!project) return;

    const imageMode = project.project_info?.info?.tracking_modes?.image;
    if (!imageMode) return;

    const updatedTracks = imageMode.tracks.map((track) => {
      if (track.track_id === trackId) {
        // หาหมายเลข scene ถัดไป
        const existingSceneNumbers = track.scenes.map((scene) =>
          parseInt(scene.scene_id.replace("S", ""))
        );
        const nextSceneNumber = Math.max(...existingSceneNumbers) + 1;
        const newSceneId = `S${nextSceneNumber}`;

        return {
          ...track,
          scenes: [
            ...track.scenes,
            {
              scene_id: newSceneId,
              assets: [],
            },
          ],
        };
      }
      return track;
    });

    const updatedProject = {
      ...project,
      project_info: {
        ...project.project_info,
        info: {
          ...project.project_info?.info,
          tracking_modes: {
            ...project.project_info?.info?.tracking_modes,
            image: {
              ...imageMode,
              tracks: updatedTracks,
            },
          },
        },
      },
    };

    setProject(updatedProject);
    setShowTrackSelector(false);
  };

  const sceneCards = useMemo(() => {
    // A. ตรวจสอบ State
    if (!project) return [];

    // B. นำตรรกะคำนวณจาก sceneImageProject ใน Store มาใส่
    const imageMode = project.project_info?.info?.tracking_modes?.image;
    if (!imageMode) return [];

    const mindImages = imageMode.mindFile?.mind_image || {};

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

  // รายการ tracks ที่มีอยู่
  const availableTracks = useMemo(() => {
    const imageMode = project?.project_info?.info?.tracking_modes?.image;
    if (!imageMode) return [];
    return imageMode.tracks || [];
  }, [project]);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Scenes Images</h3>

        {/* Dropdown และปุ่ม Add MindFile */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">
            Select Mind Image:
          </label>
          <select
            value={selectedMindName}
            onChange={handleMindNameChange}
            disabled={loading}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">-- Select Mind --</option>
            {mindImages.map((mind) => (
              <option key={mind.mind_id} value={mind.mind_name}>
                {mind.mind_name}
              </option>
            ))}
          </select>
          {loading && <span className="text-sm text-gray-500">Loading...</span>}

          {/* ปุ่ม Add MindFile */}
          <button
            onClick={() => navigate("/assets/mindfile")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium shadow-sm"
          >
            Add MindFile
          </button>
        </div>
      </div>

      {/* Container สำหรับ cards พร้อม scroll bar แกน x แบบ snap */}
      <div className="overflow-x-auto snap-x snap-mandatory">
        <div className="inline-flex gap-6 pb-2">
          {/* แบ่งการ์ดเป็นกลุ่มๆ ละ 8 การ์ด (4 คอลัมน์ x 2 แถว) */}
          {Array.from({
            length: Math.ceil((sceneCards.length + 1) / 8),
          }).map((_, pageIndex) => {
            const startIdx = pageIndex * 8;
            const cardsInPage = sceneCards.slice(startIdx, startIdx + 7); // 7 การ์ด + 1 ปุ่ม = 8
            const showAddButton = pageIndex === 0;

            return (
              <div
                key={pageIndex}
                className="snap-start grid grid-cols-4 grid-rows-2 gap-6 flex-shrink-0"
                style={{ width: "calc(100% - 2rem)" }}
              >
                {/* Card แรก: ปุ่มเพิ่ม Scene (แสดงเฉพาะหน้าแรก) */}
                {showAddButton && (
                  <div className="relative">
                    <button
                      onClick={() => setShowTrackSelector(!showTrackSelector)}
                      className="w-full h-48 border-2 border-dashed border-red-500 rounded-lg flex flex-col items-center justify-center hover:bg-red-50 transition-colors group"
                    >
                      <div className="text-6xl text-red-500 font-light mb-2">
                        +
                      </div>
                      <span className="text-sm font-medium text-red-600">
                        Add Scene
                      </span>
                    </button>

                    {/* Dropdown สำหรับเลือก Track */}
                    {showTrackSelector && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                        <div className="p-2">
                          <div className="text-xs font-semibold text-gray-600 px-2 py-1 mb-1">
                            Select Track:
                          </div>
                          {availableTracks.length > 0 ? (
                            availableTracks.map((track) => (
                              <button
                                key={track.track_id}
                                onClick={() => handleAddScene(track.track_id)}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 rounded transition-colors"
                              >
                                {track.track_id} ({track.scenes.length} scenes)
                              </button>
                            ))
                          ) : (
                            <div className="px-3 py-2 text-sm text-gray-500">
                              No tracks available
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* แสดง Scene Cards ในหน้านี้ */}
                {cardsInPage.map((card) => (
                  <CardSceneImage key={card.scene_id} card={card} />
                ))}

                {/* เติม div เปล่าให้ครบ 8 ช่อง (4x2) */}
                {Array.from({
                  length: 8 - cardsInPage.length - (showAddButton ? 1 : 0),
                }).map((_, emptyIdx) => (
                  <div key={`empty-${pageIndex}-${emptyIdx}`} />
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* ปิด dropdown เมื่อคลิกข้างนอก */}
      {showTrackSelector && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowTrackSelector(false)}
        />
      )}
    </div>
  );
}

export default SectionSceneImage;
