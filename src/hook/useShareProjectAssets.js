import { useQuery, useMutation, useQueryClient } from "react-query";
import axiosInstance from "../utils/axios";

// Fetch all share project assets
export const useShareProjectAssets = () => {
  return useQuery(
    "shareProjectAssets",
    async () => {
      console.log("useShareProjectAssets");
      const response = await axiosInstance.get("/rest/v1/share_project_assets");
      return response.data;
    },
    {
      staleTime: 5 * 60 * 1000, // ถือว่าข้อมูลยังใหม่อยู่ 5 นาที
      cacheTime: 10 * 60 * 1000, // เก็บ cache ไว้ 10 นาที
      refetchOnWindowFocus: false, // ปิดการ refetch เมื่อ focus กลับมาที่หน้าต่าง
      refetchOnMount: false, // ไม่ refetch เมื่อ component mount ถ้ามี cache อยู่แล้ว
      refetchOnReconnect: true, // refetch เมื่อ internet กลับมา (ควรเปิดไว้)
    }
  );
};

// Create new share project asset
export const useCreateShareProjectAsset = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ project_id, assets_src, project_name }) => {
      const assetData = {
        project_id,
        assets_src,
        project_name,
      };

      const response = await axiosInstance.post(
        "/rest/v1/share_project_assets",
        assetData,
        {
          headers: {
            Prefer: "resolution=merge-duplicates",
          },
        }
      );
      return response.data;
    },
    {
      onSuccess: () => {
        // Invalidate and refetch share project assets query
        queryClient.invalidateQueries("shareProjectAssets");
      },
    }
  );
};
