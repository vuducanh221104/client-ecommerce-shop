"use client";

import * as httpRequest from "@/utils/httpRequest";
import { AxiosError } from "axios";

export const authLogin = async (user: any): Promise<any> => {
  try {
    const res = await httpRequest.post<any>(`api/v1/auth/login`, {
      email: user.emailOrPhone,
      password: user.password,
    });

    // Store user data in localStorage after successful login
    if (res.data && res.data.user) {
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }

    return res.data;
  } catch (error: any) {
    const err = error as AxiosError;
    throw err;
    // return error;
    // console.error(err.response?.data);
  }
};

export const authRegister = async (userData: {
  name: string;
  phone: string;
  fullName: string;
  email: string;
  username: string;
  password: string;
}): Promise<any> => {
  try {
    const res = await httpRequest.post<any>(`api/v1/auth/register`, userData);
    return res.data;
  } catch (error: any) {
    const err = error as AxiosError;
    throw err;
  }
};

// Get current user
export const getCurrentUser = () => {
  if (typeof window !== "undefined") {
    const userData = localStorage.getItem("user");
    if (userData) {
      return JSON.parse(userData);
    }
  }
  return null;
};

// Logout
export const logout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
  }
};
