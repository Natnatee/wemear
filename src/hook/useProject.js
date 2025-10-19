import { useQuery, useMutation, useQueryClient } from "react-query";
import axiosInstance from "../utils/axios";

// Fetch all projects
export const useProjects = () => {
  return useQuery("project", async () => {
    console.log("useProjects");
    const response = await axiosInstance.get("/rest/v1/project");
    return response.data;
  }, {
    staleTime: 5 * 60 * 1000, // ถือว่าข้อมูลยังใหม่อยู่ 5 นาที
    cacheTime: 10 * 60 * 1000, // เก็บ cache ไว้ 10 นาที
    refetchOnWindowFocus: false, // ปิดการ refetch เมื่อ focus กลับมาที่หน้าต่าง
    refetchOnMount: false, // ไม่ refetch เมื่อ component mount ถ้ามี cache อยู่แล้ว
    refetchOnReconnect: true, // refetch เมื่อ internet กลับมา (ควรเปิดไว้)
  });
};

// Create new project
export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ projectName, tool }) => {
      // ดึงข้อมูลจาก localStorage
      const userData = JSON.parse(localStorage.getItem("user_data2") || "{}");
      const workspaceId = localStorage.getItem("workspace_id");

      const projectData = {
        workspace_id: workspaceId,
        project_image: "https://supabase.wemear.com/storage/v1/object/public/project-card/default.jpg",
        project_name: projectName,
        label: "New",
        owner: userData?.user_name || "Unknown",
        status: "Unpublished",
        tool: [tool],
        user_id: userData?.user_id
      };

      const response = await axiosInstance.post("/rest/v1/project", projectData);
      return response.data;
    },
    {
      onSuccess: () => {
        // Invalidate and refetch projects after successful creation
        queryClient.invalidateQueries("project");
      },
    }
  );
};
