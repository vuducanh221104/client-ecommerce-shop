"use client";

import * as httpRequest from "@/utils/httpRequest";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";

interface CartItemData {
  product_id: string;
  quantity: number;
  colorOrder: string;
  sizeOrder: string;
}

// Kiểm tra xác thực
const checkAuthentication = () => {
  let isAuthenticated = false;
  
  if (typeof window !== "undefined") {
    // Kiểm tra từ localStorage
    const persistRoot = localStorage.getItem("persist:root");
    if (persistRoot) {
      const persistData = JSON.parse(persistRoot);
      if (persistData && persistData.auth) {
        const authState = JSON.parse(persistData.auth);
        if (authState?.login?.currentUser) {
          isAuthenticated = true;
        }
      }
    }
  }
  
  if (!isAuthenticated) {
    toast.error("Vui lòng đăng nhập");
    window.location.href = "/auth/login";
    throw new Error("Chưa đăng nhập");
  }
  
  return isAuthenticated;
};

// Add product to cart
export const addToCart = async (cartData: {
  _id: string;
  quantityAddToCart: number;
  selectedColor: string;
  selectedSize: string;
}) => {
  try {
    // Kiểm tra đăng nhập
    checkAuthentication();

    // Convert from UI model to API model
    const apiCartData: CartItemData = {
      product_id: cartData._id,
      quantity: cartData.quantityAddToCart,
      colorOrder: cartData.selectedColor,
      sizeOrder: cartData.selectedSize,
    };

    // Add to API (backend)
    const res = await httpRequest.post<any>(`api/v1/cart`, apiCartData as unknown as Record<string, unknown>);

    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    throw err;
  }
};

// Get cart items
export const getCartItems = async () => {
  try {
    // Kiểm tra đăng nhập
    checkAuthentication();
    
    const res = await httpRequest.get<any>(`api/v1/cart`);
    return res;
  } catch (error) {
    const err = error as AxiosError;
    throw err;
  }
};

// Update cart item quantity
export const updateCartItem = async (cartItemId: string, quantity: number) => {
  try {
    // Kiểm tra đăng nhập
    checkAuthentication();
    
    const res = await httpRequest.patch<any>(`api/v1/cart/${cartItemId}`, {
      quantity,
    });
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    throw err;
  }
};

// Remove item from cart
export const removeCartItem = async (cartItemId: string) => {
  try {
    // Kiểm tra đăng nhập
    checkAuthentication();
    
    const res = await httpRequest.deleted<any>(`api/v1/cart/${cartItemId}`);
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    throw err;
  }
};

// Clear entire cart
export const clearCart = async () => {
  try {
    // Kiểm tra đăng nhập
    checkAuthentication();
    
    const res = await httpRequest.deleted<any>(`api/v1/cart`);
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    throw err;
  }
};
