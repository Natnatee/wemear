import { useQuery, useMutation, useQueryClient } from "react-query";
import axiosAdmin from "../utils/axiosAdmin";

// Fetch all videos from storage
export const useVideoAssets = () => {
  return useQuery("videoAssets", async () => {
    console.log("Fetching video assets");
    const requestBody = {
      prefix: "videos/",
      limit: 100,
      offset: 0,
      sortBy: {
        column: "name",
        order: "asc"
      }
    };
    const response = await axiosAdmin.post("/storage/v1/object/list/assets", requestBody);
    return response.data;
  }, {
    staleTime: 30 * 1000, // ถือว่าข้อมูลยังใหม่อยู่ 30 วินาที
    cacheTime: 5 * 60 * 1000, // เก็บ cache ไว้ 5 นาที
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
};

// Upload new video
export const useUploadVideo = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ file, fileName }) => {
      console.log("Uploading video:", fileName);

      const response = await axiosAdmin.post(
        `/storage/v1/object/assets/videos/${fileName}`,
        file,
        {
          headers: {
            'Content-Type': file.type,
            'x-upsert': 'true',
          },
        }
      );
      return response.data;
    },
    {
      onSuccess: () => {
        // Invalidate and refetch videos after successful upload
        queryClient.invalidateQueries("videoAssets");
      },
      onError: (error) => {
        console.error("Upload failed:", error);
      },
    }
  );
};

// Delete video
export const useDeleteVideo = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (fileName) => {
      console.log("Deleting video:", fileName);
      const response = await axiosAdmin.delete(`/storage/v1/object/assets/videos/${fileName}`);
      return response.data;
    },
    {
      onSuccess: () => {
        // Invalidate and refetch videos after successful deletion
        queryClient.invalidateQueries("videoAssets");
      },
      onError: (error) => {
        console.error("Delete failed:", error);
      },
    }
  );
};

// Get video URL for display
export const getVideoUrl = (fileName) => {
  return `https://supabase.wemear.com/storage/v1/object/public/assets/videos/${fileName}`;
};
