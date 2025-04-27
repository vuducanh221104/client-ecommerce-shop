"use client";

import * as httpRequest from "@/utils/httpRequest";
import { AxiosError } from "axios";

interface CartItemData {
  product_id: string;
  quantity: number;
  colorOrder: string;
  sizeOrder: string;
}

// Add product to cart
export const addToCart = async (cartData: {
  _id: string;
  quantityAddToCart: number;
  selectedColor: string;
  selectedSize: string;
}) => {
  try {
    // Convert from UI model to API model
    const apiCartData: CartItemData = {
      product_id: cartData._id,
      quantity: cartData.quantityAddToCart,
      colorOrder: cartData.selectedColor,
      sizeOrder: cartData.selectedSize,
    };

    // Add to API (backend)
    const res = await httpRequest.post<any>(`api/v1/cart`, apiCartData);

    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    throw err;
  }
};

// Get cart items from API
export const getCartItems = async () => {
  try {
    console.log("Fetching cart items from API...");
    const res = await httpRequest.get<any>(`api/v1/cart`);
    console.log("API response:", res);

    // Kiểm tra nếu có dữ liệu cart trong response
    if (res && res.cart && Array.isArray(res.cart)) {
      console.log("Found cart items:", res.cart.length);
    } else if (res && res.cart) {
      console.log("Cart data exists but is not an array:", typeof res.cart);
    } else {
      console.log("No cart data in response");
    }

    return res;
  } catch (error) {
    const err = error as AxiosError;
    console.error("Error in getCartItems:", err.response?.data || err.message);
    // Nếu lỗi xác thực, trả về object rỗng thay vì ném lỗi
    if (err.response?.status === 401) {
      console.log("Authentication error - user needs to login");
      return { cart: [] };
    }
    throw err;
  }
};

// Update cart item quantity
export const updateCartItem = async (cartItemId: string, quantity: number) => {
  try {
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
    const res = await httpRequest.deleted<any>(`api/v1/cart`);
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    throw err;
  }
};
