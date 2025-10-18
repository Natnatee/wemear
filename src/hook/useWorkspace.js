import { useQuery, useMutation, useQueryClient } from "react-query";
import axiosInstance from "../utils/axios";

// Fetch all workspaces
export const useWorkspaces = () => {
  return useQuery("workspace", async () => {
    console.log("Fetching workspaces...");
    const response = await axiosInstance.get("/rest/v1/workspace");
    return response.data;
  }, {
    staleTime: 5 * 60 * 1000, // ถือว่าข้อมูลยังใหม่อยู่ 5 นาที
    cacheTime: 10 * 60 * 1000, // เก็บ cache ไว้ 10 นาที
    refetchOnWindowFocus: false, // ปิดการ refetch เมื่อ focus กลับมาที่หน้าต่าง
    refetchOnMount: false, // ไม่ refetch เมื่อ component mount ถ้ามี cache อยู่แล้ว
    refetchOnReconnect: true, // refetch เมื่อ internet กลับมา (ควรเปิดไว้)
  });
};

// Create new workspace
export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (workspaceData) => {
      const response = await axiosInstance.post("/rest/v1/workspace", workspaceData);
      return response.data;
    },
    {
      onSuccess: () => {
        // Invalidate and refetch workspace query
        queryClient.invalidateQueries("workspace");
      },
    }
  );
};

// Delete workspace
export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (workspaceId) => {
      const response = await axiosInstance.delete(
        `/rest/v1/workspace?workspace_id=eq.${workspaceId}`
      );
      return response.data;
    },
    {
      onSuccess: () => {
        // Invalidate and refetch workspace query
        queryClient.invalidateQueries("workspace");
      },
    }
  );
};

// Update workspace
export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ workspaceId, workspaceName }) => {
      const response = await axiosInstance.patch(
        `/rest/v1/workspace?workspace_id=eq.${workspaceId}`,
        { workspace_name: workspaceName }
      );
      return response.data;
    },
    {
      onSuccess: () => {
        // Invalidate and refetch workspace query
        queryClient.invalidateQueries("workspace");
      },
    }
  );
};
