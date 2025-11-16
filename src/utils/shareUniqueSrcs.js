import axiosInstance from "../utils/axios";

// Utilities to extract and share unique asset srcs from a project
export const getUniqueAssetSrcs = (project) => {
  const uniqueSrcs = new Set();
  if (!project || !project.project_info || !project.project_info.info.tracking_modes) return [];

  const trackingModes = project.project_info.info.tracking_modes;
  Object.keys(trackingModes).forEach((modeKey) => {
    const mode = trackingModes[modeKey];

    // image-like modes (with tracks)
    if (mode.tracks && Array.isArray(mode.tracks)) {
      mode.tracks.forEach((track) => {
        if (track.scenes && Array.isArray(track.scenes)) {
          track.scenes.forEach((scene) => {
            if (scene.assets && Array.isArray(scene.assets)) {
              scene.assets.forEach((asset) => {
                if (asset && asset.src) uniqueSrcs.add(asset.src);
              });
            }
          });
        }
      });
    }

    // face/world like modes (scenes directly)
    if (mode.scenes && Array.isArray(mode.scenes)) {
      mode.scenes.forEach((scene) => {
        if (scene.assets && Array.isArray(scene.assets)) {
          scene.assets.forEach((asset) => {
            if (asset && asset.src) uniqueSrcs.add(asset.src);
          });
        }
      });
    }
  });

  return Array.from(uniqueSrcs);
};

// Share unique asset srcs by replacing existing rows for the project with a bulk insert.
// This performs a DELETE of existing `share_project_assets` for the project_id,
// then a single bulk POST of all srcs. Uses the project's REST endpoint directly.
export const shareUniqueAssetSrcs = async (project) => {
  const uniqueSrcsArray = getUniqueAssetSrcs(project);
  if (!uniqueSrcsArray || uniqueSrcsArray.length === 0) return [];

  const projectId = project?.project_id;
  try {
    // Delete existing rows for this project
    if (projectId) {
      await axiosInstance.delete(
        `/rest/v1/share_project_assets?project_id=eq.${projectId}`
      );
    }

    // Build bulk insert payload
    const payload = uniqueSrcsArray.map((src) => ({
      project_id: projectId,
      assets_src: src,
      project_name: project.project_name,
    }));

    // Bulk insert
    await axiosInstance.post("/rest/v1/share_project_assets", payload, {
      headers: { Prefer: "resolution=merge-duplicates" },
    });

    return uniqueSrcsArray;
  } catch (err) {
    console.error("shareUniqueAssetSrcs error:", err);
    throw err;
  }
};

export default {
  getUniqueAssetSrcs,
  shareUniqueAssetSrcs,
};
