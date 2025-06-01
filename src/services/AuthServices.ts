"use client";

import * as httpRequest from "@/utils/httpRequest";
import { AxiosError } from "axios";
import { loginSuccess, logOutSuccess } from "@/redux/authSlice";
import { adminGet, adminPost, adminPatch, adminDeleted } from "@/utils/httpRequestAdmin";
export const authLogin = async (user: any, dispatch?: any): Promise<any> => {
  try {
    const res = await httpRequest.post<any>(`/api/v1/auth/login`, {
      email: user.emailOrPhone,
      password: user.password,
    });

    // Update Redux store with user data if dispatch is provided
    if (
      res.data &&
      res.data.user &&
      dispatch &&
      typeof dispatch === "function"
    ) {
      dispatch(loginSuccess(res.data.user));
    }

    return res.data;
  } catch (error: any) {
    const err = error as AxiosError;
    throw err;
  }
};

export const authRegister = async (
  userData: {
    name: string;
    phone: string;
    fullName: string;
    email: string;
    username: string;
    password: string;
  },
  dispatch?: any
): Promise<any> => {
  try {
    const res = await httpRequest.post<any>(`/api/v1/auth/register`, userData);

    // Update Redux store with user data if dispatch is provided
    if (
      res.data &&
      res.data.user &&
      dispatch &&
      typeof dispatch === "function"
    ) {
      dispatch(loginSuccess(res.data.user));
    }

    return res.data;
  } catch (error: any) {
    const err = error as AxiosError;
    throw err;
  }
};

// Get current user from Redux store (provided by the component)
export const getCurrentUser = (reduxState?: any) => {
  // If a Redux state is provided directly, use it (for components using useSelector)
  if (reduxState?.auth?.login?.currentUser) {
    return reduxState.auth.login.currentUser;
  }

  // Fallback to localStorage for backward compatibility
  if (typeof window !== "undefined") {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }
  return null;
};

// Logout using Redux
export const logout = async (dispatch?: any) => {
  try {
    // Call the logout endpoint
    await httpRequest.post("/api/v1/auth/logout");

    // Update Redux store if dispatch is provided
    if (dispatch && typeof dispatch === "function") {
      dispatch(logOutSuccess());
    } else {
      console.error(
        "No dispatch function provided for logout - Redux state not cleared"
      );
    }

    // Clear any localStorage for backward compatibility
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
    }

    return { success: true };
  } catch (error) {
    console.error("Error during logout:", error);

    // Even if /API call fails, clear the redux store and localStorage
    if (dispatch && typeof dispatch === "function") {
      dispatch(logOutSuccess());
    }

    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
    }

    throw error;
  }
};

// Add an updateUserProfile function to AuthServices.ts
export const updateUserProfile = async (
  userData: {
    fullName?: string;
    phoneNumber?: string;
    gender?: string;
    dateOfBirth?: string;
  },
  dispatch?: any
) => {
  try {
    const response = await httpRequest.put<any>(
      "/api/v1/users/profile",
      userData
    );

    // If update was successful and dispatch is provided, update Redux store
    if (
      response.data &&
      response.data.user &&
      dispatch &&
      typeof dispatch === "function"
    ) {
      const { updateUserProfile } = require("@/redux/authSlice");
      dispatch(updateUserProfile(response.data.user));
    }

    return response.data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

// Address management services
export interface Address {
  _id?: string;
  street: string;
  city: string;
  district: string;
  ward?: string;
  country?: string;
  isDefault: boolean;
}

// Get user addresses
export const getUserAddresses = async (): Promise<Address[]> => {
  try {
    const result = await httpRequest.get<{
      message: string;
      addresses: Address[];
    }>("/api/v1/users/addresses");
    return result.addresses || [];
  } catch (error) {
    console.error("Error fetching addresses:", error);
    throw error;
  }
};

// Add a new address
export const addUserAddress = async (
  addressData: Address |any
): Promise<Address> => {
  try {
    const response = await httpRequest.post<{ address: Address }>(
      "/api/v1/users/addresses",
      addressData
    );
    return response.data.address;
  } catch (error) {
    console.error("Error adding address:", error);
    throw error;
  }
};

// Update an address
export const updateUserAddress = async (
  addressId: string,
  addressData: Partial<Address>
): Promise<Address> => {
  try {
    const response = await httpRequest.put<{ address: Address }>(
      `/api/v1/users/addresses/${addressId}`,
      addressData
    );
    return response.data.address;
  } catch (error) {
    console.error("Error updating address:", error);
    throw error;
  }
};

// Delete an address
export const deleteUserAddress = async (addressId: string): Promise<void> => {
  try {
    await httpRequest.deleted<{ message: string }>(
      `/api/v1/users/addresses/${addressId}`
    );
  } catch (error) {
    console.error("Error deleting address:", error);
    throw error;
  }
};

// Set an address as default
export const setDefaultAddress = async (
  addressId: string
): Promise<Address> => {
  try {
    const response = await httpRequest.put<{ address: Address }>(
      `/api/v1/users/addresses/${addressId}/default`,
      {}
    );
    return response.data.address;
  } catch (error) {
    console.error("Error setting default address:", error);
    throw error;
  }
};

// Change password
export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<{ message: string }> => {
  try {
    const response = await httpRequest.put<{ message: string }>(
      "/api/v1/users/profile/change-password",
      {
        currentPassword,
        newPassword,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};


