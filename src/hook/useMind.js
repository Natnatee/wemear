import { useMutation } from "react-query";
import axiosAdmin from "../utils/axiosAdmin";
import axiosInstance from "../utils/axios";

const useMind = () => {
  // Upload images to Supabase Storage
  const uploadImages = async ({ mindName, images }) => {
    const uploadPromises = images.map(async (image, index) => {
      const targetNumber = index + 1;
      const targetName = `${mindName}_T${targetNumber}`;
      const url = `/storage/v1/object/assets/mind/images/${targetName}`;

      const formData = new FormData();
      formData.append("file", image);

      await axiosAdmin.post(url, formData, {
        headers: {
          "Content-Type": image.type,
        },
      });

      return {
        targetName,
        targetNumber,
        url: `https://supabase.wemear.com/storage/v1/object/public/assets/mind/images/${targetName}`,
      };
    });

    return await Promise.all(uploadPromises);
  };

  // Upload mind file to Supabase Storage
  const uploadMindFile = async ({ mindName, mindFileBuffer }) => {
    const url = `/storage/v1/object/assets/mind/${mindName}`;

    const blob = new Blob([mindFileBuffer], {
      type: "application/octet-stream",
    });

    const response = await axiosAdmin.post(url, blob, {
      headers: {
        "Content-Type": "application/octet-stream",
      },
    });

    return response.data;
  };

  // Save mind data to database table
  const saveMindToTable = async ({ mindId, mindName, imageUrls }) => {
    const mindImageObject = imageUrls.reduce((acc, img) => {
      acc[`T${img.targetNumber}`] = img.url;
      return acc;
    }, {});

    const body = {
      mind_id: mindId,
      mind_name: mindName,
      mind_src: `https://supabase.wemear.com/storage/v1/object/public/assets/mind/${mindName}`,
      mind_image: mindImageObject,
    };

    const response = await axiosInstance.post("/rest/v1/mind_image", body);
    return response.data;
  };

  // Main mutation to handle the complete upload process
  const uploadMindMutation = useMutation({
    mutationFn: async ({ mindName, images, mindFileBuffer }) => {
      // Step 1: Upload images
      const imageUrls = await uploadImages({ mindName, images });

      // Step 2: Upload mind file
      const mindFileResponse = await uploadMindFile({
        mindName,
        mindFileBuffer,
      });

      // Step 3: Save to table
      const tableResponse = await saveMindToTable({
        mindId: mindFileResponse.Id,
        mindName,
        imageUrls,
      });

      return {
        imageUrls,
        mindFileResponse,
        tableResponse,
      };
    },
  });

  return {
    uploadMind: uploadMindMutation.mutate,
    uploadMindAsync: uploadMindMutation.mutateAsync,
    isUploading: uploadMindMutation.isPending,
    uploadError: uploadMindMutation.error,
    uploadSuccess: uploadMindMutation.isSuccess,
    uploadData: uploadMindMutation.data,
    reset: uploadMindMutation.reset,
  };
};

export default useMind;
