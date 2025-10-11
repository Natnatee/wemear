import React, { useEffect } from "react";
import { make_mind_ar } from "../../make_data/make_mind_ar";
import convert_three_to_aframe from "../../utils/convert_three_to_aframe";
import { fetchAndCacheAsset } from "../../utils/idbAsset"; // <-- เพิ่มบรรทัดนี้

const TestArMind = () => {
  useEffect(() => {
    // ✅ ป้องกัน init ซ้ำจาก StrictMode
    if (window.__MINDAR_INIT__) return;
    window.__MINDAR_INIT__ = true;

    const waitForMindAR = () => {
      return new Promise((resolve) => {
        const check = () => {
          if (window.MINDAR && window.MINDAR.IMAGE) resolve(true);
          else setTimeout(check, 200);
        };
        check();
      });
    };

    async function initAR() {
      await waitForMindAR();

      // ✅ ใช้ make_mind_ar แทน API
      const converted = convert_three_to_aframe(make_mind_ar[0]);
      const arData = converted;
      if (!arData || !arData["image tracking"] || !arData.mindFile) {
        console.error("Invalid data structure from make_mind_ar.");
        return;
      }

      const targets = arData["image tracking"];
      const mindFile = arData.mindFile;

      // ✅ สร้าง scene
      const scene = document.createElement("a-scene");
      scene.setAttribute(
        "mindar-image",
        `imageTargetSrc: ${mindFile}; autoStart: true; maxTrack: 3;`
      );
      scene.setAttribute("vr-mode-ui", "enabled: false");
      scene.setAttribute("device-orientation-permission-ui", "enabled: true");

      const camera = document.createElement("a-camera");
      camera.setAttribute("position", "0 0 0");
      camera.setAttribute("look-controls", "enabled: false");
      scene.appendChild(camera);

      const assets = document.createElement("a-assets");
      scene.appendChild(assets);

      // ✅ เพิ่มแสง 3 ดวง
      const ambientLight = document.createElement("a-entity");
      ambientLight.setAttribute(
        "light",
        "type: ambient; color: #fff5cc; intensity: 2"
      );
      scene.appendChild(ambientLight);

      const dirLight1 = document.createElement("a-entity");
      dirLight1.setAttribute(
        "light",
        "type: directional; color: #ffffff; intensity: 2; castShadow: true"
      );
      dirLight1.setAttribute("position", "5 10 5");
      dirLight1.setAttribute(
        "shadow",
        "mapSizeWidth: 1024; mapSizeHeight: 1024; cameraNear: 0.5; cameraFar: 50"
      );
      scene.appendChild(dirLight1);

      const dirLight2 = document.createElement("a-entity");
      dirLight2.setAttribute(
        "light",
        "type: directional; color: #aaaaaa; intensity: 2"
      );
      dirLight2.setAttribute("position", "-5 5 -5");
      scene.appendChild(dirLight2);

      document.getElementById("ar-container").appendChild(scene);

      let targetIndex = 0;

      for (const key in targets) {
        if (!targets[key] || !Array.isArray(targets[key])) continue;
        const models = targets[key];

        const entity = document.createElement("a-entity");
        entity.setAttribute(
          "mindar-image-target",
          `targetIndex: ${targetIndex}`
        );

        for (let modelIdx = 0; modelIdx < models.length; modelIdx++) {
          const t = models[modelIdx];

          // ใช้ fetchAndCacheAsset กับทุก type ที่เป็นไฟล์
          if (t.type === "Video") {
            const blob = await fetchAndCacheAsset(t.src);
            const objectUrl = URL.createObjectURL(blob);

            const video = document.createElement("video");
            video.id = `video-${targetIndex}-${modelIdx}`;
            video.src = objectUrl;
            video.autoplay = t.autoplay ?? false;
            video.loop = t.loop ?? false;
            video.muted = t.muted ?? true;
            video.playsInline = true;
            assets.appendChild(video);

            const videoEl = document.createElement("a-video");
            videoEl.setAttribute("src", `#video-${targetIndex}-${modelIdx}`);
            videoEl.setAttribute("scale", t.scale.join(" "));
            videoEl.setAttribute("position", t.position.join(" "));
            videoEl.setAttribute(
              "rotation",
              t.rotation ? t.rotation.join(" ") : "0 0 0"
            );
            entity.appendChild(videoEl);
          }

          if (t.type === "3D Model") {
            const blob = await fetchAndCacheAsset(t.src);
            const objectUrl = URL.createObjectURL(blob);

            const model = document.createElement("a-gltf-model");
            model.setAttribute("src", objectUrl);
            model.setAttribute("scale", t.scale.join(" "));
            model.setAttribute("position", t.position.join(" "));
            model.setAttribute(
              "rotation",
              t.rotation ? t.rotation.join(" ") : "0 0 0"
            );
            entity.appendChild(model);
          }

          if (t.type === "Image") {
            const blob = await fetchAndCacheAsset(t.src);
            const objectUrl = URL.createObjectURL(blob);

            const img = document.createElement("a-image");
            img.setAttribute("src", objectUrl);
            img.setAttribute("scale", t.scale.join(" "));
            img.setAttribute("position", t.position.join(" "));
            img.setAttribute(
              "rotation",
              t.rotation ? t.rotation.join(" ") : "0 0 0"
            );
            if (t.opacity !== undefined) img.setAttribute("opacity", t.opacity);
            entity.appendChild(img);
          }
        }

        scene.appendChild(entity);
        targetIndex++;
      }

      scene.addEventListener("arReady", () => {
        Object.keys(targets).forEach((key, tIdx) => {
          targets[key].forEach((t, mIdx) => {
            if (t.type === "Video")
              document.getElementById(`video-${tIdx}-${mIdx}`).play();
          });
        });
        document.getElementById("status").innerText = "AR พร้อมใช้งาน!";
      });
    }

    initAR();
  }, []);

  return (
    <div>
      <div
        id="status"
        style={{
          position: "fixed",
          bottom: "20px",
          left: "20px",
          background: "rgba(0,0,0,0.8)",
          color: "#fff",
          padding: "10px",
          borderRadius: "8px",
          zIndex: 1000,
        }}
      >
        กำลังโหลด AR...
      </div>

      <div
        id="ar-container"
        style={{
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 1,
        }}
      ></div>
    </div>
  );
};

export default TestArMind;
