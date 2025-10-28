import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

// Expiration time: 24 hours in milliseconds
const EXPIRATION_TIME = 24 * 60 * 60 * 1000;

// Debounced save to localStorage
let saveTimeout;
const debouncedSave = (project) => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    if (project) {
      const dataWithTimestamp = {
        project,
        savedAt: Date.now(), // บันทึก timestamp
      };
      localStorage.setItem(
        "current_project",
        JSON.stringify(dataWithTimestamp)
      );
      console.log("Project auto-saved to localStorage");
    }
  }, 200);
};

// Load project from localStorage with expiration check
const loadProjectFromStorage = () => {
  try {
    const stored = localStorage.getItem("current_project");
    if (!stored) return null;

    const data = JSON.parse(stored);

    // Check for old data structure (before migration)
    // If old keys exist (name, image, date), clear cache
    if (data.name || data.image || data.date) {
      console.warn("🗑️ Old cache structure detected, clearing...");
      localStorage.removeItem("current_project");
      return null;
    }

    // Support old format (direct project object without timestamp)
    if (!data.savedAt) {
      console.warn("⚠️ Old cache format detected (no timestamp), clearing...");
      localStorage.removeItem("current_project");
      return null;
    }

    // Check if cache has expired (older than 24 hours)
    const age = Date.now() - data.savedAt;
    if (age > EXPIRATION_TIME) {
      console.log(
        "🕐 Cache expired (age: " +
          Math.round(age / 1000 / 60 / 60) +
          "h), removing..."
      );
      localStorage.removeItem("current_project");
      return null;
    }

    console.log("✅ Cache valid (age: " + Math.round(age / 1000 / 60) + "m)");
    return data.project;
  } catch (error) {
    console.error("Error loading project from localStorage:", error);
    localStorage.removeItem("current_project"); // Clean up corrupted data
    return null;
  }
};

// Generate unique asset ID using UUID
const generateNewAssetId = () => {
  return `asset_${uuidv4()}`;
};

const projectStore = create((set, get) => ({
  project: null,
  currentAssetSelect: null,

  setProject: (newProject) => {
    set({ project: newProject });
    if (newProject) {
      debouncedSave(newProject);
    }
  },

  // Set selected asset
  setCurrentAssetSelect: (asset) => {
    set({ currentAssetSelect: asset });
  },

  // Clear selected asset
  clearCurrentAssetSelect: () => {
    set({ currentAssetSelect: null });
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
    localStorage.removeItem("current_project");
    clearTimeout(saveTimeout);
  },

  setProjectName: (name) => {
    set((state) => {
      const updatedProject = { ...state.project, project_name: name };
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
      const dataWithTimestamp = {
        project,
        savedAt: Date.now(),
      };
      localStorage.setItem(
        "current_project",
        JSON.stringify(dataWithTimestamp)
      );
      console.log("Project manually saved to localStorage");
    }
  },

  // Update asset transform (position, rotation, scale)
  updateAssetTransform: (assetId, transform) => {
    set((state) => {
      const currentProject = state.project;
      if (!currentProject) {
        console.error("No project loaded.");
        return state;
      }

      const updatedProject = JSON.parse(JSON.stringify(currentProject));
      let assetFound = false;

      // ค้นหา asset ในทุก tracking mode
      const trackingModes = updatedProject.info.tracking_modes;

      for (const modeKey in trackingModes) {
        const mode = trackingModes[modeKey];

        // สำหรับ image tracking (มี tracks)
        if (mode.tracks) {
          for (const track of mode.tracks) {
            for (const scene of track.scenes) {
              if (scene.assets) {
                const asset = scene.assets.find((a) => a.asset_id === assetId);
                if (asset) {
                  if (transform.position) asset.position = transform.position;
                  if (transform.rotation) asset.rotation = transform.rotation;
                  if (transform.scale) asset.scale = transform.scale;
                  assetFound = true;
                  break;
                }
              }
            }
            if (assetFound) break;
          }
        }

        // สำหรับ face/world tracking (มี scenes โดยตรง)
        if (mode.scenes && !assetFound) {
          for (const scene of mode.scenes) {
            if (scene.assets) {
              const asset = scene.assets.find((a) => a.asset_id === assetId);
              if (asset) {
                if (transform.position) asset.position = transform.position;
                if (transform.rotation) asset.rotation = transform.rotation;
                if (transform.scale) asset.scale = transform.scale;
                assetFound = true;
                break;
              }
            }
          }
        }

        if (assetFound) break;
      }

      if (assetFound) {
        console.log("✅ Asset transform updated:", assetId, transform);
        debouncedSave(updatedProject);
        return { project: updatedProject };
      } else {
        console.warn("⚠️ Asset not found:", assetId);
        return state;
      }
    });
  },

  addAssetToScene: (assetData, currentState) => {
    set((state) => {
      const currentProject = state.project;
      if (!currentProject) {
        console.error("No project loaded.");
        return state;
      }

      const parts = currentState.split("_"); // e.g., ["IMAGE", "T1S1"]
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
          console.error(
            "Could not parse trackId or sceneId from currentState for image mode:",
            currentState
          );
          return state;
        }
        const trackId = "T" + trackMatch[1];
        const sceneId = "S" + sceneMatch[1];

        targetTrack = trackingMode.tracks.find((t) => t.track_id === trackId);
        if (targetTrack) {
          targetScene = targetTrack.scenes.find((s) => s.scene_id === sceneId);
        }
      } else {
        // face or world tracking
        const sceneId = trackAndSceneIdentifier;
        targetScene = trackingMode.scenes.find((s) => s.scene_id === sceneId);
      }

      if (!targetScene) {
        console.error(
          `Target scene not found for currentState: ${currentState}`
        );
        return state;
      }

      const newAssetId = generateNewAssetId();
      const newAssetForScene = {
        asset_id: newAssetId,
        asset_name: assetData.name,
        scale: [0.5, 0.5, 0.5],
        opacity: 1,
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        // เพิ่ม src และ type โดยตรงในแต่ละ asset แทนการใช้ shared_assets
        src: assetData.src || `/assets/${assetData.name}`,
        type: assetData.type || "Image", // ใช้ type จาก assetData หรือ default เป็น Image
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

  // Remove asset from scene
  removeAssetFromScene: (assetId) => {
    set((state) => {
      const currentProject = state.project;
      if (!currentProject) {
        console.error("No project loaded.");
        return state;
      }

      const updatedProject = JSON.parse(JSON.stringify(currentProject));
      let assetRemoved = false;

      // ค้นหาและลบ asset ในทุก tracking mode
      const trackingModes = updatedProject.info.tracking_modes;

      for (const modeKey in trackingModes) {
        const mode = trackingModes[modeKey];

        // สำหรับ image tracking (มี tracks)
        if (mode.tracks) {
          for (const track of mode.tracks) {
            for (const scene of track.scenes) {
              if (scene.assets) {
                const assetIndex = scene.assets.findIndex(
                  (a) => a.asset_id === assetId
                );
                if (assetIndex !== -1) {
                  scene.assets.splice(assetIndex, 1);
                  assetRemoved = true;
                  break;
                }
              }
            }
            if (assetRemoved) break;
          }
        }

        // สำหรับ face/world tracking (มี scenes โดยตรง)
        if (mode.scenes && !assetRemoved) {
          for (const scene of mode.scenes) {
            if (scene.assets) {
              const assetIndex = scene.assets.findIndex(
                (a) => a.asset_id === assetId
              );
              if (assetIndex !== -1) {
                scene.assets.splice(assetIndex, 1);
                assetRemoved = true;
                break;
              }
            }
          }
        }

        if (assetRemoved) break;
      }

      if (assetRemoved) {
        console.log("✅ Asset removed:", assetId);
        debouncedSave(updatedProject);
        // Clear selection if deleted asset was selected
        if (state.currentAssetSelect?.asset_id === assetId) {
          set({ currentAssetSelect: null });
        }
        return { project: updatedProject };
      } else {
        console.warn("⚠️ Asset not found for removal:", assetId);
        return state;
      }
    });
  },
}));

export default projectStore;
