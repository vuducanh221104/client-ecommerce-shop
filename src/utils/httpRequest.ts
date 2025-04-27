import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosInstance,
} from "axios";

// Extend AxiosInstance to include our custom methods
declare module "axios" {
  interface AxiosInstance {
    deleted: <T>(
      path: string,
      options?: AxiosRequestConfig
    ) => Promise<AxiosResponse<T>>;
  }
}

axios.defaults.withCredentials = true;

const httpRequest = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
});

// Add request interceptor for authentication tokens
httpRequest.interceptors.request.use(
  (config) => {
    // Try to get auth token from Redux persist state first (primary source)
    if (typeof window !== "undefined") {
      const persistRoot = localStorage.getItem("persist:root");
      if (persistRoot) {
        try {
          const persistData = JSON.parse(persistRoot);
          if (persistData && persistData.auth) {
            const authState = JSON.parse(persistData.auth);
            const currentUser = authState?.login?.currentUser;
            if (currentUser && currentUser.accessToken) {
              config.headers.Authorization = `Bearer ${currentUser.accessToken}`;
              return config; // Return early if we successfully set the token
            }
          }
        } catch (error) {
          console.error("Error parsing Redux persist state:", error);
          // Continue to the fallback method
        }
      }

      // Fallback to localStorage for backward compatibility
      const user = localStorage.getItem("user");
      if (user) {
        try {
          const userData = JSON.parse(user);
          if (userData && userData.accessToken) {
            config.headers.Authorization = `Bearer ${userData.accessToken}`;
          }
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    }

    // For debugging
    // console.log("HTTP Request:", {
    //   method: config.method,
    //   url: config.url,
    //   headers: {
    //     ...config.headers,
    //     Authorization: config.headers.Authorization ? "Bearer ***" : "None",
    //   },
    //   withCredentials: config.withCredentials,
    // });

    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// // Add response interceptor for debugging
// httpRequest.interceptors.response.use(
//   (response) => {
//     console.log("HTTP Response Status:", response.status);
//     return response;
//   },
//   (error) => {
//     console.error(
//       "Response Error:",
//       error.response?.status,
//       error.response?.data || error.message
//     );
//     return Promise.reject(error);
//   }
// );

export const get = async <T>(
  path: string,
  options: AxiosRequestConfig = {}
): Promise<T> => {
  const res = await httpRequest.get<T>(path, options);
  return res.data;
};

export const post = async <T>(
  path: string,
  data?: any,
  options: AxiosRequestConfig = {}
): Promise<AxiosResponse<T>> => {
  const res = await httpRequest.post<T>(path, data, options);
  return res;
};

export const patch = async <T>(
  path: string,
  data?: any,
  options: AxiosRequestConfig = {}
): Promise<AxiosResponse<T>> => {
  const res = await httpRequest.patch<T>(path, data, options);
  return res;
};

export const put = async <T>(
  path: string,
  data?: any,
  options: AxiosRequestConfig = {}
): Promise<AxiosResponse<T>> => {
  const res = await httpRequest.put<T>(path, data, options);
  return res;
};

export const deleted = async <T>(
  path: string,
  options: AxiosRequestConfig = {}
): Promise<AxiosResponse<T>> => {
  const res = await httpRequest.delete<T>(path, options);
  return res;
};

// Add the deleted method to httpRequest
httpRequest.deleted = deleted;

// SWR
export const fetcher = <T>(url: string) =>
  httpRequest.get<T>(url).then((response) => response.data);

export default httpRequest;
