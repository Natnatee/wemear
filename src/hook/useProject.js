import { useQuery } from "react-query";
import axiosInstance from "../utils/axios";

// Fetch all projects
export const useProjects = () => {
  console.log("useProjects");
  return useQuery("project", async () => {
    const response = await axiosInstance.get("/rest/v1/project");
    return response.data;
  });
};
