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
