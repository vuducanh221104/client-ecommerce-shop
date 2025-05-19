import axios, {
  AxiosRequestConfig,
  AxiosResponse,
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
      try {
        const persistRoot = localStorage.getItem("persist:root");
        if (persistRoot) {
          const persistData = JSON.parse(persistRoot);
          if (persistData && persistData.auth) {
            const authState = JSON.parse(persistData.auth);
            const currentUser = authState?.login?.currentUser;
            if (currentUser && currentUser.accessToken) {
              config.headers.Authorization = `Bearer ${currentUser.accessToken}`;
              return config; // Return early if we successfully set the token
            }
          }
        }

        // Fallback to localStorage for backward compatibility
        const user = localStorage.getItem("user");
        if (user) {
          const userData = JSON.parse(user);
          if (userData && userData.accessToken) {
            config.headers.Authorization = `Bearer ${userData.accessToken}`;
          }
        }
      } catch (error) {
        console.error("Error accessing token:", error);
        // Continue without token if there's an error
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

// Add response interceptor for handling token expiration
httpRequest.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is due to an expired token (401) and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/auth/refresh-token`, 
          {}, 
          { withCredentials: true }
        );
        
        if (response.data && response.data.accessToken) {
          // Update the token in the current request
          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
          
          // Update the token in localStorage/Redux if needed
          if (typeof window !== "undefined") {
            try {
              const persistRoot = localStorage.getItem("persist:root");
              if (persistRoot) {
                const persistData = JSON.parse(persistRoot);
                if (persistData && persistData.auth) {
                  const authState = JSON.parse(persistData.auth);
                  if (authState?.login?.currentUser) {
                    authState.login.currentUser.accessToken = response.data.accessToken;
                    persistData.auth = JSON.stringify(authState);
                    localStorage.setItem("persist:root", JSON.stringify(persistData));
                  }
                }
              }
            } catch (e) {
              console.error("Error updating token in storage:", e);
            }
          }
          
          // Retry the original request
          return axios(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // Handle failed refresh (e.g., redirect to login)
        if (typeof window !== "undefined") {
          // Clear auth data
          try {
            const persistRoot = localStorage.getItem("persist:root");
            if (persistRoot) {
              const persistData = JSON.parse(persistRoot);
              if (persistData && persistData.auth) {
                const authState = JSON.parse(persistData.auth);
                if (authState?.login?.currentUser) {
                  authState.login.currentUser = null;
                  persistData.auth = JSON.stringify(authState);
                  localStorage.setItem("persist:root", JSON.stringify(persistData));
                }
              }
            }
            localStorage.removeItem("user");
          } catch (e) {
            console.error("Error clearing auth data:", e);
          }
          
          // Redirect to login page if it's a client-side navigation
          if (typeof window !== "undefined" && !originalRequest.url?.includes("/auth/")) {
            window.location.href = "/auth/login";
          }
        }
      }
    }
    
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
  data?: Record<string, unknown>,
  options: AxiosRequestConfig = {}
): Promise<AxiosResponse<T>> => {
  const res = await httpRequest.post<T>(path, data, options);
  return res;
};

export const patch = async <T>(
  path: string,
  data?: Record<string, unknown>,
  options: AxiosRequestConfig = {}
): Promise<AxiosResponse<T>> => {
  const res = await httpRequest.patch<T>(path, data, options);
  return res;
};

export const put = async <T>(
  path: string,
  data?: Record<string, unknown>,
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
