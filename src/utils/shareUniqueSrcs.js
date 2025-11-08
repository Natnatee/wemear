// Utilities to extract and share unique asset srcs from a project
export const getUniqueAssetSrcs = (project) => {
  const uniqueSrcs = new Set();
  if (!project || !project.info || !project.info.tracking_modes) return [];

  const trackingModes = project.info.tracking_modes;
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

// Share unique asset srcs using a react-query mutation instance that supports mutateAsync
export const shareUniqueAssetSrcs = async (
  project,
  createShareAssetMutation
) => {
  const uniqueSrcsArray = getUniqueAssetSrcs(project);
  if (!uniqueSrcsArray || uniqueSrcsArray.length === 0) return [];

  try {
    const promises = uniqueSrcsArray.map((src) =>
      createShareAssetMutation.mutateAsync({
        project_id: project.project_id,
        assets_src: src,
        project_name: project.project_name,
      })
    );

    await Promise.all(promises);
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
