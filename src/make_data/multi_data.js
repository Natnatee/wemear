export const mindar_hybrid_config = [
  {
    id: "4dce27a0-486c-4d87-a0b7-7c6b66dd210e",
    name: "AR Multi-Mode Experience",
    created_at: "2025-09-14T16:16:56.29961+00:00",

    // ==========================================
    // 1. SHARED ASSETS (Asset Registry)
    // ใช้สำหรับเก็บ Source File หลัก และใช้ asset_name อ้างอิง
    // ==========================================
    shared_assets: [
      {
        asset_name: "IMAGE_TPL",
        src: "https://msdwbkeszkklbelimvaw.supabase.co/storage/v1/object/public/assets/AS0101_pamh6b.jpg",
        type: "Image",
      },
      {
        asset_name: "VIDEO_FLOWER",
        src: "https://msdwbkeszkklbelimvaw.supabase.co/storage/v1/object/public/assets/flower.mp4",
        type: "Video",
      },
      {
        asset_name: "MODEL_SHINE",
        src: "https://msdwbkeszkklbelimvaw.supabase.co/storage/v1/object/assets/uploads_files_2882496_Shine+Sprite.gltf",
        type: "3D Model",
      },
      {
        asset_name: "MODEL_GLASSES",
        src: "https://example.com/assets/glasses.gltf",
        type: "3D Model",
      },
      {
        asset_name: "ICON_BACK",
        src: "https://example.com/assets/back_arrow.png",
        type: "Image",
      },
      {
        asset_name: "MODEL_STATUE",
        src: "https://example.com/assets/world_statue.gltf",
        type: "3D Model",
      },
      {
        asset_name: "ICON_EXIT",
        src: "https://example.com/assets/exit_world.png",
        type: "Image",
      },
    ],

    tracking_modes: {
      // ==========================================
      // 2. IMAGE TRACKING MODE
      // ==========================================
      image: {
        engine: "mindar-image",
        mindFile: {
          src: "https://msdwbkeszkklbelimvaw.supabase.co/storage/v1/object/assets/final_2.mind",
          image: {
            // Target Images สำหรับ Mind File ยังต้องใช้ src ดั้งเดิม
            T1: "https://msdwbkeszkklbelimvaw.supabase.co/storage/v1/object/public/assets/AS0101_pamh6b.jpg",
            T2: "https://msdwbkeszkklbelimvaw.supabase.co/storage/v1/object/public/assets/AS0101_pamh6b.jpg",
            T3: "https://msdwbkeszkklbelimvaw.supabase.co/storage/v1/object/public/assets/AS0101_pamh6b.jpg",
            T4: "https://msdwbkeszkklbelimvaw.supabase.co/storage/v1/object/public/assets/AS0101_pamh6b.jpg",
          },
        },

        tracks: [
          {
            track_id: "T1",
            scenes: [
              {
                scene_id: "S1",
                assets: [
                  {
                    asset_id: "000001",
                    asset_name: "IMAGE_TPL", // ใช้ asset_name
                    scale: [0.2, 0.2, 0.2],
                    opacity: 1,
                    position: [0, 0, 0],
                    rotation: [0, 0, 0],
                  },
                ],
              },
            ],
          },
          {
            track_id: "T2",
            scenes: [
              {
                scene_id: "S1",
                assets: [
                  {
                    asset_id: "000002",
                    asset_name: "VIDEO_FLOWER", // ใช้ asset_name
                    loop: true,
                    muted: true,
                    scale: [0.3, 0.3, 0.3],
                    autoplay: true,
                    position: [0, 0, 0],
                    rotation: [0, 0, 0],
                  },
                ],
              },
            ],
          },
          {
            track_id: "T3",
            scenes: [
              {
                scene_id: "S1",
                assets: [
                  {
                    asset_id: "000003",
                    asset_name: "MODEL_SHINE", // ใช้ asset_name
                    scale: [0.1, 0.1, 0.1],
                    position: [0, 0, 0],
                    rotation: [0, 0, 0],
                  },
                ],
              },
            ],
          },
          {
            track_id: "T4",
            scenes: [
              {
                scene_id: "S1",
                assets: [
                  {
                    asset_id: "000004",
                    asset_name: "MODEL_SHINE", // ใช้ asset_name
                    scale: [0.1, 0.1, 0.1],
                    position: [0.5, 0, 0],
                    rotation: [0, 0, 0],
                    action: {
                      event: "click",
                      type: "scene_transition",
                      target_track: "T4",
                      target_scene: "S2",
                    },
                  },
                  {
                    asset_id: "000005",
                    asset_name: "IMAGE_TPL", // ใช้ asset_name
                    scale: [0.2, 0.2, 0.2],
                    opacity: 1,
                    position: [0, 0, 0],
                    rotation: [0, 0, 0],
                  },
                  {
                    asset_id: "000006",
                    asset_name: "VIDEO_FLOWER", // ใช้ asset_name
                    loop: true,
                    muted: true,
                    scale: [0.3, 0.3, 0.3],
                    autoplay: true,
                    position: [-0.5, 0, 0],
                    rotation: [0, 0, 0],
                  },
                ],
              },
              {
                scene_id: "S2",
                assets: [
                  {
                    asset_id: "000007",
                    asset_name: "MODEL_SHINE", // ใช้ asset_name
                    scale: [0.1, 0.1, 0.1],
                    position: [0, 0, 0],
                    rotation: [0, 0, 0],
                    action: {
                      event: "click",
                      type: "scene_transition",
                      target_track: "T4",
                      target_scene: "S1",
                    },
                  },
                ],
              },
            ],
          },
        ],
      },

      // ==========================================
      // 3. FACE TRACKING MODE
      // ==========================================
      face: {
        engine: "mindar-face",
        faceFile: { src: "https://example.com/assets/face-target.mind" },

        scenes: [
          {
            scene_id: "F1",
            assets: [
              {
                asset_id: "000008",
                asset_name: "MODEL_GLASSES", // ใช้ asset_name
                position: [0, 0, 0],
                scale: [0.5, 0.5, 0.5],
              },
              {
                asset_id: "000009",
                asset_name: "ICON_BACK", // ใช้ asset_name
                position: [0, -0.5, -0.5],
                action: {
                  event: "click",
                  type: "mode_transition",
                  target_mode: "image",
                  target_track: "T2",
                  target_scene: "S1",
                },
              },
            ],
          },
        ],
      },

      // ==========================================
      // 4. WORLD TRACKING MODE
      // ==========================================
      world: {
        engine: "webxr-ar",

        scenes: [
          {
            scene_id: "W1",
            assets: [
              {
                asset_id: "000010",
                asset_name: "MODEL_STATUE", // ใช้ asset_name
                position: [0, -1, -3],
              },
              {
                asset_id: "000011",
                asset_name: "ICON_EXIT", // ใช้ asset_name
                position: [-0.5, 0.5, -2],
                action: {
                  event: "click",
                  type: "engine_transition",
                  target_mode: "image",
                  target_track: "T2",
                  target_scene: "S1",
                },
              },
            ],
          },
        ],
      },
    },
  },
];
