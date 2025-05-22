"use client";

import * as httpRequest from "@/utils/httpRequest";
import { AxiosError } from "axios";

// Create order from cart
export const createOrder = async (orderData: any) => {
  try {
    const res = await httpRequest.post<any>(`api/v1/orders`, orderData);
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    throw err;
  }
};

// Get order by ID
export const getOrderById = async (orderId: string) => {
  try {
    const res = await httpRequest.get<any>(`api/v1/orders/${orderId}`);
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    throw err;
  }
};

// Get orders by user ID
export const getUserOrdersById = async (userId: string) => {
  try {
    console.log(`Calling API: api/v1/orders/user/${userId}`);
    const res = await httpRequest.get<any>(`api/v1/orders/user/${userId}`);
    console.log("Orders API response status:", res.status);
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error(
      "API Error fetching user orders by ID:",
      err.response?.status,
      err.response?.data || err.message
    );
    throw err;
  }
};

// Get all orders for the current user
export const getUserOrders = async () => {
  try {
    // Lấy user ID từ Redux store
    let userId = null;
    
    if (typeof window !== "undefined") {
      // Kiểm tra từ localStorage (persist:root)
      const persistRoot = localStorage.getItem("persist:root");
      if (persistRoot) {
        const persistData = JSON.parse(persistRoot);
        if (persistData && persistData.auth) {
          const authState = JSON.parse(persistData.auth);
          if (authState?.login?.currentUser) {
            userId = authState.login.currentUser._id || authState.login.currentUser.id;
          }
        }
      }
    }
    
    if (!userId) {
      throw new Error("Người dùng chưa đăng nhập");
    }
    
    // Sử dụng hàm getUserOrdersById với userId đã lấy được
    return await getUserOrdersById(userId);
  } catch (error) {
    const err = error as AxiosError;
    console.error(
      "API Error fetching user orders:",
      error instanceof AxiosError 
        ? `${err.response?.status} - ${err.response?.data || err.message}`
        : error
    );
    throw err;
  }
};

// Cancel an order
export const cancelOrder = async (orderId: string) => {
  try {
    const res = await httpRequest.post<any>(`api/v1/orders/${orderId}/cancel`, {
      reason: "Đã hủy bởi người dùng",
    });
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    throw err;
  }
};

// Get product details by ID
export const getProductById = async (productId: string) => {
  try {
    const res = await httpRequest.get<any>(`api/v1/products/${productId}`);
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    throw err;
  }
};

export const OrderService = {
  createOrder,
  getOrderById,
  getUserOrders,
  getUserOrdersById,
  cancelOrder,
  getProductById,
};
