import { create } from "zustand";

// Debounced save to localStorage
let saveTimeout;
const debouncedSave = (project) => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    if (project) {
      localStorage.setItem('current_project', JSON.stringify(project));
      console.log('Project auto-saved to localStorage');
    }
  }, 1000); // รอ 1 วินาทีหลังจากแก้ไขล่าสุด
};

// Load project from localStorage
const loadProjectFromStorage = () => {
  try {
    const stored = localStorage.getItem('current_project');
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error loading project from localStorage:', error);
    return null;
  }
};

const generateNewAssetId = (info) => {
  const allAssetIds = new Set();

  // Collect asset IDs from tracking_modes
  for (const modeKey in info.tracking_modes) {
    const mode = info.tracking_modes[modeKey];
    if (mode.tracks) {
      mode.tracks.forEach(track => {
        track.scenes.forEach(scene => {
          if (scene.assets) {
            scene.assets.forEach(asset => allAssetIds.add(asset.asset_id));
          }
        });
      });
    } else if (mode.scenes) {
      mode.scenes.forEach(scene => {
        if (scene.assets) {
          scene.assets.forEach(asset => allAssetIds.add(asset.asset_id));
        }
      });
    }
  }

  // ลบส่วนที่เกี่ยวข้องกับ shared_assets
  // ไม่จำเป็นต้องเก็บ asset IDs จาก shared_assets อีกต่อไป

  let newId = 1;
  while (allAssetIds.has(`asset_${newId}`)) {
    newId++;
  }
  return `asset_${newId}`;
};

const projectStore = create((set, get) => ({
  project: null,

  setProject: (newProject) => {
    set({ project: newProject });
    if (newProject) {
      debouncedSave(newProject);
    }
  },

  // Load project from localStorage
  loadProjectFromStorage: () => {
    const storedProject = loadProjectFromStorage();
    if (storedProject) {
      set({ project: storedProject });
      return true;
    }
    return false;
  },

  // Clear project and localStorage
  removeAllProjects: () => {
    set({ project: null });
    localStorage.removeItem('current_project');
    clearTimeout(saveTimeout);
  },

  setProjectName: (name) => {
    set((state) => {
      const updatedProject = { ...state.project, name };
      debouncedSave(updatedProject);
      return { project: updatedProject };
    });
  },

  setProjectLabel: (label) => {
    set((state) => {
      const updatedProject = { ...state.project, label };
      debouncedSave(updatedProject);
      return { project: updatedProject };
    });
  },

  // Manual save (สำหรับกรณีที่ต้องการ save ทันที)
  saveProject: () => {
    const { project } = get();
    if (project) {
      clearTimeout(saveTimeout);
      localStorage.setItem('current_project', JSON.stringify(project));
      console.log('Project manually saved to localStorage');
    }
  },

  addAssetToScene: (assetData, currentState) => {
    set((state) => {
      const currentProject = state.project;
      if (!currentProject) {
        console.error("No project loaded.");
        return state;
      }

      const parts = currentState.split('_'); // e.g., ["IMAGE", "T1S1"]
      if (parts.length < 2) {
        console.error("Invalid currentState format:", currentState);
        return state;
      }

      const trackingModeKey = parts[0].toLowerCase(); // "image", "face", "world"
      const trackAndSceneIdentifier = parts[1]; // "T1S1", "F1", "W1"

      let targetTrack = null;
      let targetScene = null;

      const updatedProject = { ...currentProject };
      const trackingMode = updatedProject.info.tracking_modes[trackingModeKey];

      if (!trackingMode) {
        console.error(`Tracking mode ${trackingModeKey} not found.`);
        return state;
      }

      if (trackingModeKey === "image") {
        const trackMatch = trackAndSceneIdentifier.match(/T(\d+)/);
        const sceneMatch = trackAndSceneIdentifier.match(/S(\d+)/);

        if (!trackMatch || !sceneMatch) {
          console.error("Could not parse trackId or sceneId from currentState for image mode:", currentState);
          return state;
        }
        const trackId = "T" + trackMatch[1];
        const sceneId = "S" + sceneMatch[1];

        targetTrack = trackingMode.tracks.find(t => t.track_id === trackId);
        if (targetTrack) {
          targetScene = targetTrack.scenes.find(s => s.scene_id === sceneId);
        }
      } else { // face or world tracking
        const sceneId = trackAndSceneIdentifier;
        targetScene = trackingMode.scenes.find(s => s.scene_id === sceneId);
      }

      if (!targetScene) {
        console.error(`Target scene not found for currentState: ${currentState}`);
        return state;
      }

      const newAssetId = generateNewAssetId(updatedProject.info);
      const newAssetForScene = {
        asset_id: newAssetId,
        asset_name: assetData.name,
        scale: [0.5, 0.5, 0.5],
        opacity: 1,
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        // เพิ่ม src และ type โดยตรงในแต่ละ asset แทนการใช้ shared_assets
        src: assetData.src || `/assets/${assetData.name}`,
        type: "Image" // Fixed for image type
      };

      // Ensure assets array exists for the scene
      if (!targetScene.assets) {
        targetScene.assets = [];
      }
      targetScene.assets.push(newAssetForScene);

      // ลบส่วนที่เกี่ยวข้องกับ shared_assets
      // ไม่ต้องเพิ่ม asset ใน shared_assets อีกต่อไป

      debouncedSave(updatedProject);
      return { project: updatedProject };
    });
  },
}));

export default projectStore;
