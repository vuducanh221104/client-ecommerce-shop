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

// Get all orders for the current user
export const getUserOrders = async () => {
  try {
    console.log("Calling API: api/v1/orders/my-orders");
    const res = await httpRequest.get<any>(`api/v1/orders/my-orders`);
    console.log("Orders API response status:", res.status);
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error(
      "API Error fetching user orders:",
      err.response?.status,
      err.response?.data || err.message
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
  cancelOrder,
  getProductById,
};
