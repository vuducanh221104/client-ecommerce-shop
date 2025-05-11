"use client";

import * as httpRequest from "@/utils/httpRequest";
import { AxiosError } from "axios";

// Product management services
export const getAllProducts = async () => {
  try {
    const res = await httpRequest.get<any>(`api/v1/products`);
    return res;
  } catch (error) {
    const err = error as AxiosError;
    throw err;
  }
};

export const getProductById = async (id: string) => {
  try {
    const res = await httpRequest.get<any>(`api/v1/products/${id}`);
    return res;
  } catch (error) {
    const err = error as AxiosError;
    throw err;
  }
};

export const createProduct = async (productData: any) => {
  try {
    const res = await httpRequest.post<any>(`api/v1/products`, productData);
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    throw err;
  }
};

export const updateProduct = async (id: string, productData: any) => {
  try {
    const res = await httpRequest.put<any>(
      `api/v1/products/${id}`,
      productData
    );
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    throw err;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const res = await httpRequest.deleted<any>(`api/v1/products/${id}`);
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    throw err;
  }
};

// User management services
export const getAllUsers = async () => {
  try {
    const res = await httpRequest.get<any>(`api/v1/users`);
    return res;
  } catch (error) {
    const err = error as AxiosError;
    throw err;
  }
};

export const getUserById = async (id: string) => {
  try {
    const res = await httpRequest.get<any>(`api/v1/users/${id}`);
    return res;
  } catch (error) {
    const err = error as AxiosError;
    throw err;
  }
};

export const createUser = async (userData: any) => {
  try {
    const res = await httpRequest.post<any>(`api/v1/users`, userData);
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    throw err;
  }
};

export const updateUser = async (id: string, userData: any) => {
  try {
    const res = await httpRequest.put<any>(`api/v1/users/${id}`, userData);
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    throw err;
  }
};

export const deleteUser = async (id: string) => {
  try {
    const res = await httpRequest.deleted<any>(`api/v1/users/${id}`);
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    throw err;
  }
};

// Order management services
export const getAllOrders = async () => {
  try {
    const res = await httpRequest.get<any>(`api/v1/orders`);
    return res;
  } catch (error) {
    const err = error as AxiosError;
    throw err;
  }
};

export const getOrderById = async (id: string) => {
  try {
    const res = await httpRequest.get<any>(`api/v1/orders/${id}`);
    return res;
  } catch (error) {
    const err = error as AxiosError;
    throw err;
  }
};

export const updateOrderStatus = async (id: string, status: string) => {
  try {
    const res = await httpRequest.put<any>(`api/v1/orders/${id}/status`, {
      status,
    });
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    throw err;
  }
};

export const updateOrder = async (id: string, orderData: any) => {
  try {
    const res = await httpRequest.put<any>(`api/v1/orders/${id}`, orderData);
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    throw err;
  }
};

export const deleteOrder = async (id: string) => {
  try {
    const res = await httpRequest.deleted<any>(`api/v1/orders/${id}`);
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    throw err;
  }
};

// Category management services
interface CategoryResponse {
  status: string;
  message: string;
  data: {
    categories: Array<{
      _id: string;
      name: string;
      slug: string;
      subcategories: Array<{
        _id: string;
        name: string;
        slug: string;
      }>;
    }>;
  };
}

export const getAllCategories = async () => {
  try {
    const response = await httpRequest.get<CategoryResponse>(
      "api/v1/categories"
    );
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error;
    }
    throw new Error("Failed to fetch categories");
  }
};

export const createCategory = async (categoryData: any) => {
  try {
    const res = await httpRequest.post<any>(`api/v1/categories`, categoryData);
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    throw err;
  }
};

export const updateCategory = async (id: string, categoryData: any) => {
  try {
    const res = await httpRequest.put<any>(
      `api/v1/categories/${id}`,
      categoryData
    );
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    throw err;
  }
};

export const deleteCategory = async (id: string) => {
  try {
    const res = await httpRequest.deleted<any>(`api/v1/categories/${id}`);
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    throw err;
  }
};

// Dashboard statistics
export const getDashboardStats = async () => {
  try {
    const res = await httpRequest.get<any>(`api/v1/stats/dashboard`);
    return res;
  } catch (error) {
    const err = error as AxiosError;
    throw err;
  }
};

// Material management services
export const getAllMaterials = async () => {
  try {
    const response = await httpRequest.get("/api/v1/materials");
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error;
    }
    throw new Error("Failed to fetch materials");
  }
};

export const createMaterial = async (materialData: any) => {
  try {
    const response = await httpRequest.post("/api/v1/materials", materialData);
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error;
    }
    throw new Error("Failed to create material");
  }
};

export const updateMaterial = async (
  id: string | undefined,
  materialData: any
) => {
  try {
    // Validate ID
    if (!id) {
      throw new Error("Material ID is required for updating");
    }

    const response = await httpRequest.put(
      `/api/v1/materials/${id}`,
      materialData
    );
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error;
    }
    throw new Error("Failed to update material");
  }
};

export const deleteMaterial = async (id: string) => {
  try {
    const response = await httpRequest.deleted(`/api/v1/materials/${id}`);
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error;
    }
    throw new Error("Failed to delete material");
  }
};
