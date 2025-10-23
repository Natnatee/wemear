import { useMemo, useState, useEffect } from "react";
import axiosInstance from "../utils/axios";
import SceneCard from "./SceneCard";
import projectStore from "../utils/projectStore";

function SceneImageCards({ project }) {
  const [mindImages, setMindImages] = useState([]);
  const [selectedMindName, setSelectedMindName] = useState("");
  const [loading, setLoading] = useState(false);
  const { setProject } = projectStore();

  // ดึงข้อมูล mind_image จาก API
  useEffect(() => {
    const fetchMindImages = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          "/rest/v1/mind_image"
        );
        setMindImages(response.data || []);
      } catch (error) {
        console.error("Error fetching mind images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMindImages();
  }, []);

  // ตั้งค่า selected mind name จาก project ที่มีอยู่
  useEffect(() => {
    if (project?.info?.tracking_modes?.image?.mindFile?.mind_name) {
      setSelectedMindName(project.info.tracking_modes.image.mindFile.mind_name);
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
      const trackIds = Object.keys(selectedMind.mind_image || {});
      const tracks = trackIds.map((trackId) => ({
        track_id: trackId,
        scenes: [
          {
            scene_id: "S1",
            assets: [],
          },
        ],
      }));

      // อัพเดท project state ในส่วน image tracking
      const updatedProject = {
        ...project,
        info: {
          ...project.info,
          tracking_modes: {
            ...project.info?.tracking_modes,
            image: {
              ...project.info?.tracking_modes?.image,
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
      };

      // อัพเดท projectStore
      setProject(updatedProject);
    }
  };

  const sceneCards = useMemo(() => {
    // A. ตรวจสอบ State
    if (!project) return [];

    // B. นำตรรกะคำนวณจาก sceneImageProject ใน Store มาใส่
    const imageMode = project.info?.tracking_modes?.image;
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

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Scenes Images</h3>

        {/* Dropdown สำหรับเลือก mind_name */}
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
          {loading && (
            <span className="text-sm text-gray-500">Loading...</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sceneCards.map((card) => (
          <SceneCard key={card.scene_id} card={card} />
        ))}
      </div>
    </div>
  );
}

export default SceneImageCards;
