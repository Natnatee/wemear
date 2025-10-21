import { useQuery, useMutation, useQueryClient } from "react-query";
import axiosAdmin from "../utils/axiosAdmin";

// Fetch all 3D models from storage
export const useThreeDAssets = () => {
  return useQuery("threeDAssets", async () => {
    console.log("Fetching 3D assets");
    const requestBody = {
      prefix: "3d/",
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

// Upload new 3D model
export const useUploadThreeD = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ file, fileName }) => {
      console.log("Uploading 3D model:", fileName);

      const response = await axiosAdmin.post(
        `/storage/v1/object/assets/3d/${fileName}`,
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
        // Invalidate and refetch 3D models after successful upload
        queryClient.invalidateQueries("threeDAssets");
      },
      onError: (error) => {
        console.error("Upload failed:", error);
      },
    }
  );
};

// Delete 3D model
export const useDeleteThreeD = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (fileName) => {
      console.log("Deleting 3D model:", fileName);
      const response = await axiosAdmin.delete(`/storage/v1/object/assets/3d/${fileName}`);
      return response.data;
    },
    {
      onSuccess: () => {
        // Invalidate and refetch 3D models after successful deletion
        queryClient.invalidateQueries("threeDAssets");
      },
      onError: (error) => {
        console.error("Delete failed:", error);
      },
    }
  );
};

// Get 3D model URL for display
export const getThreeDUrl = (fileName) => {
  return `https://supabase.wemear.com/storage/v1/object/public/assets/3d/${fileName}`;
};
