"use client";
import * as httpRequest from "@/utils/httpRequest";
import * as httpRequestAdmin from "@/utils/httpRequestAdmin";
import { AxiosError } from "axios";
import useSWR from "swr";

export const authAdminLogin = async (
  user: any
  // tokenCaptcha: string | null
): Promise<any> => {
  try {
    const res = await httpRequestAdmin.adminPost<any>(
      `api/v1/auth/admin/login`,
      {
        usernameOrEmail: user.usernameOrEmail,
        password: user.password,
        // tokenCaptcha: tokenCaptcha,
      }
    );
    return res.data;
  } catch (error: any) {
    const err = error as AxiosError;
    throw err;
  }
};

export const authAdminLogout = async (): Promise<any> => {
  try {
    const res = await httpRequestAdmin.adminPost<any>(
      `/api/v1/auth/admin/logout`
    );
    return res.data;
  } catch (error: any) {
    const err = error as AxiosError;
    throw err;
  }
};

export const authAdminRefreshToken = async (): Promise<any> => {
  try {
    const res = await httpRequestAdmin.adminPost<any>(
      `/api/v1/auth/admin/refreshToken`
    );
    return res.data;
  } catch (error: any) {
    const err = error as AxiosError;
    throw err;
  }
};

export const authRefreshToken = async (): Promise<any> => {
  try {
    const res = await httpRequestAdmin.adminPost<any>(`/api/v1/auth/refreshToken`);
    return res.data;
  } catch (error: any) {
    const err = error as AxiosError;
    throw err;
  }
};

// Admin User Management
// export const getAllUsers = () => {
//   const url = `api/v1/auth/users`;
//   const { data, error, isLoading, mutate } = useSWR<any, AxiosError>(
//     url,
//     httpRequestAdmin.adminFetcher,
//     {
//       revalidateIfStale: false,
//       revalidateOnFocus: false,
//       revalidateOnReconnect: false,
//       shouldRetryOnError: false,
//       errorRetryCount: 0,
//     }
//   );

//   if (error) {
//     const err = error as AxiosError;
//   }
//   return { data, error, isLoading, mutate };
// };

// export const updateUser = async (
//   userId: string,
//   userData: any
// ): Promise<any> => {
//   try {
//     const res = await httpRequestAdmin.adminPatch<any>(
//       `api/v1/auth/users/${userId}`,
//       userData
//     );
//     return res.data;
//   } catch (error: any) {
//     const err = error as AxiosError;
//     throw err;
//   }
// };

// export const deleteUser = async (userId: string): Promise<any> => {
//   try {
//     const res = await httpRequestAdmin.adminDeleted<any>(
//       `api/v1/auth/users/${userId}`
//     );
//     return res.data;
//   } catch (error: any) {
//     const err = error as AxiosError;
//     throw err;
//   }
// };

// export const adminAddUser = async (userData: any): Promise<any> => {
//   try {
//     const res = await httpRequestAdmin.adminPost<any>(
//       `api/v1/auth/admin/users`,
//       userData
//     );
//     return res.data;
//   } catch (error: any) {
//     const err = error as AxiosError;
//     throw err;
//   }
// };
