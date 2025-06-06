"use client";

import * as httpRequest from "@/utils/httpRequest";
import { AxiosError, AxiosResponse } from "axios";

// Create order from cart
export const createOrder = async (orderData: any) => {
  try {
    const res = await httpRequest.post<any>(`/api/v1/orders`, orderData);
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    throw err;
  }
};

// Get order by ID
export const getOrderById = async (orderId: string) => {
  try {
    const res = await httpRequest.get<any>(`/api/v1/orders/${orderId}`);
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    throw err;
  }
};

// Get orders by user ID
export const getUserOrdersById = async (userId: string) => {
  try {
    const res = await httpRequest.get<any>(`/api/v1/orders/user/${userId}`);
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
export const getUserOrders = async (page = 1, limit = 10) => {
  try {
    const res = await httpRequest.get<any>(`/api/v1/orders/my?page=${page}&limit=${limit}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw error;
  }
};

// Cancel an order
export const cancelOrder = async (orderId: string) => {
  try {
    const res = await httpRequest.post<any>(`/api/v1/orders/${orderId}/cancel`, {
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
    const res = await httpRequest.get<any>(`/api/v1/products/${productId}`);
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    throw err;
  }
};

// Check if user has purchased and received a product
export const checkUserCanReview = async (productId: string): Promise<boolean> => {
  try {
    interface SimpleResponse {
      canReview: boolean;
    }
    
    const response = await httpRequest.get<any>(`/api/v1/orders/can-review/${productId}`);
    console.log("Review response:", response.data); // Debug log
    
    // The API returns {canReview: true} directly
    return response.data.canReview === true;
  } catch (error) {
    console.error("Error checking if user can review:", error);
    // Return false by default if there's an error
    return false;
  }
};

export const OrderService = {
  createOrder,
  getOrderById,
  getUserOrders,
  getUserOrdersById,
  cancelOrder,
  getProductById,
  checkUserCanReview,
};
