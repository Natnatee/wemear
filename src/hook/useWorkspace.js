import { useQuery, useMutation, useQueryClient } from "react-query";
import axiosInstance from "../utils/axios";

// Fetch all workspaces
export const useWorkspaces = () => {
  return useQuery("workspace", async () => {
    const response = await axiosInstance.get("/rest/v1/workspace");
    return response.data;
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
