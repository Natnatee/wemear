import { useQuery } from "react-query";
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
