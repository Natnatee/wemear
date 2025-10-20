import { useQuery, useMutation, useQueryClient } from "react-query";
import axiosAdmin from "../utils/axiosAdmin";

// Fetch all images from storage
export const useImageAssets = () => {
  return useQuery("imageAssets", async () => {
    console.log("Fetching image assets");
    const requestBody = {
      prefix: "images/",
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

// Upload new image
export const useUploadImage = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ file, fileName }) => {
      console.log("Uploading image:", fileName);

      // Create FormData for binary upload
      const formData = new FormData();
      formData.append('file', file);

      const response = await axiosAdmin.post(
        `/storage/v1/object/assets/images/${fileName}`,
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
        // Invalidate and refetch images after successful upload
        queryClient.invalidateQueries("imageAssets");
      },
      onError: (error) => {
        console.error("Upload failed:", error);
      },
    }
  );
};

// Delete image
export const useDeleteImage = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (fileName) => {
      console.log("Deleting image:", fileName);
      const response = await axiosAdmin.delete(`/storage/v1/object/assets/images/${fileName}`);
      return response.data;
    },
    {
      onSuccess: () => {
        // Invalidate and refetch images after successful deletion
        queryClient.invalidateQueries("imageAssets");
      },
      onError: (error) => {
        console.error("Delete failed:", error);
      },
    }
  );
};

// Get image URL for display
export const getImageUrl = (fileName) => {
  return `https://supabase.wemear.com/storage/v1/object/public/assets/images/${fileName}`;
};
