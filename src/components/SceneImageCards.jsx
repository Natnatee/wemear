import { useMemo } from "react";
import SceneCard from "./SceneCard";

function SceneImageCards({ project }) {
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

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4">
        Scenes
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sceneCards.map((card) => (
          <SceneCard key={card.scene_id} card={card} />
        ))}
      </div>
    </div>
  );
}

export default SceneImageCards;
