/**
 * Global LocalStorage Variables Reference
 * ใช้สำหรับเช็คว่ามีตัวแปร global อะไรบ้างใน localStorage
 */

// Current scene state (IMAGE_T1S1, IMAGE_T2S1, etc.)
const CurrentState = "IMAGE_T1S1";

// Authentication token
const access_token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZDU4YTkzNy0wMWUzLTRiODYtYTI0Ny1jOTIzYzFmNDMxYTIiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzYxNDc5NzkxLCJpYXQiOjE3NjE0NTgxOTEsImVtYWlsIjoidGVzdDEyM0BnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7ImVtYWlsIjoidGVzdDEyM0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGhvbmVfdmVyaWZpZWQiOmZhbHNlLCJzdWIiOiJkZDU4YTkzNy0wMWUzLTRiODYtYTI0Ny1jOTIzYzFmNDMxYTIiLCJ1c2VyX25hbWUiOiJUZXN0In0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoicGFzc3dvcmQiLCJ0aW1lc3RhbXAiOjE3NjE0NTgxOTF9XSwic2Vzc2lvbl9pZCI6ImNjN2E3MzM2LWZjOTAtNGMzYS1hZjI0LTBhNDg4ODc1NGNmMiIsImlzX2Fub255bW91cyI6ZmFsc2V9.8rEmVHPK5z-Pi6Vx2calBZXZkuJTuYfsiPM0Bu4jtOY";

// Current project data
const current_project = {
  project_id: "cdce0ddc-614b-4b90-b14a-c3ac3f30ff62",
  image:
    "https://supabase.wemear.com/storage/v1/object/public/project-card/project3.jpg",
  name: "Project Name Updated (Link Omitted)",
  label: "Designer",
  owner: "Test",
  date: "19/10/2568",
  status: "Published",
  tool: "Image Tracking, Face Tracking",
  link: "scan.wemear.com/cdce0ddc-614b-4b90-b14a-c3ac3f30ff62",
  info: {
    shared_assets: [],
    tracking_modes: {
      image: {
        mindFile: {
          mind_name: "test",
          mind_id: "6e8f7663-3627-48ac-86ad-62cad8043552",
          mind_src:
            "https://supabase.wemear.com/storage/v1/object/public/assets/mind/test",
          mind_image: {
            T1: "https://supabase.wemear.com/storage/v1/object/public/assets/mind/images/test_T1",
            T2: "https://supabase.wemear.com/storage/v1/object/public/assets/mind/images/test_T2",
            T3: "https://supabase.wemear.com/storage/v1/object/public/assets/mind/images/test_T3",
            T4: "https://supabase.wemear.com/storage/v1/object/public/assets/mind/images/test_T4",
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
                    asset_id: "asset_1",
                    asset_name: "flower.mp4",
                    scale: [0.5, 0.5, 0.5],
                    opacity: 1,
                    position: [0, 0, 0],
                    rotation: [0, 0, 0],
                    src: "https://supabase.wemear.com/storage/v1/object/public/assets/videos/flower.mp4",
                    type: "Video",
                  },
                  {
                    asset_id: "asset_2",
                    asset_name: "chair.gltf",
                    scale: [0.5, 0.5, 0.5],
                    opacity: 1,
                    position: [0, 0, 0],
                    rotation: [0, 0, 0],
                    src: "https://supabase.wemear.com/storage/v1/object/public/assets/3d/chair.gltf",
                    type: "3D Model",
                  },
                  {
                    asset_id: "asset_3",
                    asset_name: "men2025.glb",
                    scale: [0.5, 0.5, 0.5],
                    opacity: 1,
                    position: [0, 0, 0],
                    rotation: [0, 0, 0],
                    src: "https://supabase.wemear.com/storage/v1/object/public/assets/3d/men2025.glb",
                    type: "3D Model",
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
                assets: [],
              },
            ],
          },
          {
            track_id: "T3",
            scenes: [
              {
                scene_id: "S1",
                assets: [],
              },
            ],
          },
          {
            track_id: "T4",
            scenes: [
              {
                scene_id: "S1",
                assets: [],
              },
            ],
          },
        ],
      },
    },
  },
};

// Debug configuration
const debug = "*:error,*:info,*:warn";

// Refresh token
const refresh_token = "dydktggeqvry";

// User authentication data
const user_data = {
  id: "dd58a937-01e3-4b86-a247-c923c1f431a2",
  aud: "authenticated",
  role: "authenticated",
  email: "test123@gmail.com",
  email_confirmed_at: "2025-10-18T10:58:42.700065Z",
  phone: "",
  confirmed_at: "2025-10-18T10:58:42.700065Z",
  last_sign_in_at: "2025-10-26T05:56:31.363753376Z",
  app_metadata: {
    provider: "email",
    providers: ["email"],
  },
  user_metadata: {
    email: "test123@gmail.com",
    email_verified: true,
    phone_verified: false,
    sub: "dd58a937-01e3-4b86-a247-c923c1f431a2",
    user_name: "Test",
  },
  identities: [
    {
      identity_id: "f0061e85-a53f-4c3f-95c4-7ea1f085d180",
      id: "dd58a937-01e3-4b86-a247-c923c1f431a2",
      user_id: "dd58a937-01e3-4b86-a247-c923c1f431a2",
      identity_data: {
        email: "test123@gmail.com",
        email_verified: false,
        phone_verified: false,
        sub: "dd58a937-01e3-4b86-a247-c923c1f431a2",
        user_name: "Test",
      },
      provider: "email",
      last_sign_in_at: "2025-10-18T10:58:42.697576Z",
      created_at: "2025-10-18T10:58:42.697618Z",
      updated_at: "2025-10-18T10:58:42.697618Z",
      email: "test123@gmail.com",
    },
  ],
  created_at: "2025-10-18T10:58:42.693976Z",
  updated_at: "2025-10-26T05:56:31.366216Z",
  is_anonymous: false,
};

// Extended user data
const user_data2 = {
  user_id: "dd58a937-01e3-4b86-a247-c923c1f431a2",
  permission: 1,
  user_name: "Test",
  created_at: "2025-10-18T10:58:42.693483+00:00",
};

// Workspace ID
const workspace_id = "a7f6ae6e-9209-4b07-9c4e-a3a988213768";

// Workspace name
const workspace_name = "Global";

/**
 * LocalStorage Keys Reference
 * คีย์ที่ใช้ใน localStorage:
 *
 * - "CurrentState"      : สถานะ scene ปัจจุบัน (IMAGE_T1S1, etc.)
 * - "access_token"      : Token สำหรับ authentication
 * - "current_project"   : ข้อมูล project ปัจจุบัน (JSON string)
 * - "debug"             : Debug configuration
 * - "refresh_token"     : Refresh token
 * - "user_data"         : ข้อมูล user จาก auth (JSON string)
 * - "user_data2"        : ข้อมูล user เพิ่มเติม (JSON string)
 * - "workspace_id"      : ID ของ workspace
 * - "workspace_name"    : ชื่อ workspace
 */

export {
  CurrentState,
  access_token,
  current_project,
  debug,
  refresh_token,
  user_data,
  user_data2,
  workspace_id,
  workspace_name,
};
