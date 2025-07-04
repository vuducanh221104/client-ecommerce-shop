import * as httpRequest from "@/utils/httpRequest";
import { AxiosError } from "axios";

// import useSWR, { mutate } from 'swr';
//mutate (hiện ảnh ngay thì thêm )
// export const uploadCloud = async (arrayImage: any) => {
//     const url = 'http://localhost:4000/api/v1/upload/uploadCloud';

//     try {
//         const data = await httpRequest.fetcherPost(url, arrayImage);
//         mutate(url, data, false);
//         return { data, error: null };
//     } catch (error) {
//         return { data: null, error };
//     }
// };

export const uploadCloud = async (arrayImage: any) => {
  try {
    const res = await httpRequest.post<any>("api/v1/upload", arrayImage);
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error("Upload error:", err);
    // Add more detailed error logging
    if (err.response) {
      console.error("Error status:", err.response.status);
      console.error("Error data:", err.response.data);
    }
    throw err; // Re-throw the error so it can be handled by the caller
  }
};
