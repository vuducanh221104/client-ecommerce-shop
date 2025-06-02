"use client";

import * as httpRequest from "@/utils/httpRequest";
import * as httpRequestAdmin from "@/utils/httpRequestAdmin";
import { AxiosError } from "axios";

// Comment management services
export interface Comment {
  _id: string;
  content: string;
  rating: number;
  user: {
    _id?: string;
    fullName?: string;
    email?: string;
    avatar?: string;
  } | null;
  product: {
    _id?: string;
    name?: string;
    image?: string[] | string;
  } | null;
  status: 'APPROVED' | 'PENDING' | 'REJECTED' | 'FLAGGED' | string;
  createdAt: string;
  updatedAt: string;
  replyContentAdmin?: Array<{
    content: string;
    createdAt: string;
    adminId?: string;
  }>;
}

export interface CommentResponse {
  status: string;
  message: string;
  comments: Comment[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}



// Product management services
export const getAllProducts = async (page = 1, limit = 10) => {
  try {
    const res = await httpRequestAdmin.adminGet<any>(`api/v1/products?page=${page}&limit=${limit}`);
    return res;
  } catch (error) {
    const err = error as AxiosError;
    throw err;
  }
};

export const getProductById = async (id: string) => {
  try {
    const res = await httpRequestAdmin.adminGet<any>(`api/v1/products/${id}`);
    return res;
  } catch (error) {
    const err = error as AxiosError;
    throw err;
  }
};

export const createProduct = async (productData: any) => {
  try {
    const res = await httpRequestAdmin.adminPost<any>(`api/v1/products`, productData);
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    throw err;
  }
};

export const updateProduct = async (id: string, productData: any) => {
  try {
    const res = await httpRequestAdmin.adminPut<any>(
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
    const res = await httpRequestAdmin.adminDeleted<any>(`api/v1/products/${id}`);
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    throw err;
  }
};

// User management services
export const getAllUsers = async () => {
  try {
    const res = await httpRequestAdmin.adminGet<any>(`api/v1/users`);
    return res;
  } catch (error) {
    const err = error as AxiosError;
    throw err;
  }
};

export const getUserById = async (id: string) => {
  try {
    const res = await httpRequestAdmin.adminGet<any>(`api/v1/users/${id}`);
    return res;
  } catch (error) {
    const err = error as AxiosError;
    throw err;
  }
};

export const createUser = async (userData: any) => {
  try {
    const res = await httpRequestAdmin.adminPost<any>(`api/v1/users`, userData);
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    throw err;
  }
};

export const updateUser = async (id: string, userData: any) => {
  try {
    const res = await httpRequestAdmin.adminPut<any>(`api/v1/users/${id}`, userData);
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    throw err;
  }
};

export const deleteUser = async (id: string) => {
  try {
    const res = await httpRequestAdmin.adminDeleted<any>(`api/v1/users/${id}`);
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    throw err;
  }
};

// Order management services
export const getAllOrders = async () => {
  try {
    const res = await httpRequestAdmin.adminGet<any>(`api/v1/orders?limit=100`);
    return res;
  } catch (error) {
    const err = error as AxiosError;
    throw err;
  }
};

export const getOrderById = async (id: string) => {
  try {
    const res = await httpRequestAdmin.adminGet<any>(`api/v1/orders/${id}`);
    return res;
  } catch (error) {
    const err = error as AxiosError;
    throw err;
  }
};

export const updateOrderStatus = async (id: string, status: string) => {
  try {
    const res = await httpRequestAdmin.adminPut<any>(`api/v1/orders/${id}/status`, {
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
    const res = await httpRequestAdmin.adminPut<any>(`api/v1/orders/${id}`, orderData);
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    throw err;
  }
};

export const deleteOrder = async (id: string) => {
  try {
    const res = await httpRequestAdmin.adminDeleted<any>(`api/v1/orders/${id}`);
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
    const response = await httpRequestAdmin.adminGet<CategoryResponse>(
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
    const res = await httpRequestAdmin.adminPost<any>(`api/v1/categories`, categoryData);
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    throw err;
  }
};

export const updateCategory = async (id: string, categoryData: any) => {
  try {
    const res = await httpRequestAdmin.adminPut<any>(
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
    const res = await httpRequestAdmin.adminDeleted<any>(`api/v1/categories/${id}`);
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    throw err;
  }
};

// Dashboard statistics
export const getDashboardStats = async () => {
  try {
    const res = await httpRequestAdmin.adminGet<any>(`api/v1/stats/dashboard`);
    return res;
  } catch (error) {
    const err = error as AxiosError;
    throw err;
  }
};

// Material management services
export const getAllMaterials = async () => {
  try {
    const response = await httpRequestAdmin.adminGet<any>("/api/v1/materials");
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
    const response = await httpRequestAdmin.adminPost<any>("/api/v1/materials", materialData);
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

    const response = await httpRequestAdmin.adminPut<any>(
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
    const response = await httpRequestAdmin.adminDeleted<any>(`/api/v1/materials/${id}`);
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error;
    }
    throw new Error("Failed to delete material");
  }
};


export interface CommentDetailsResponse {
  status: string;
  message: string;
  comment: Comment;
}

export const getAllComments = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortField?: string;
  sortOrder?: number | string;
  productId?: string;
  userId?: string;
}) => {
  try {
    const res = await httpRequestAdmin.adminGet<CommentResponse>(`api/v1/comments/admin`, {
      params,
    });
    return res;
  } catch (error) {
    const err = error as AxiosError;
    throw err;
  }
};

export const getCommentById = async (commentId: string) => {
  try {
    const res = await httpRequestAdmin.adminGet<CommentDetailsResponse>(`api/v1/comments/admin/${commentId}`);
    return res;
  } catch (error) {
    const err = error as AxiosError;
    throw err;
  }
};

export const updateComment = async (
  commentId: string,
  data: {
    content?: string;
    rating?: number;
    status?: string;
  }
) => {
  try {
    const res = await httpRequestAdmin.adminPatch<any>(`api/v1/comments/admin/${commentId}`, data);
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    throw err;
  }
};

export const replyToComment = async (
  commentId: string,
  data: {
    content: string;
  }
) => {
  try {
    const res = await httpRequestAdmin.adminPost<any>(`api/v1/comments/admin/${commentId}/reply`, data);
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    throw err;
  }
};

export const deleteComment = async (commentId: string) => {
  try {
    const res = await httpRequestAdmin.adminDeleted<any>(`api/v1/comments/admin/${commentId}`);
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    throw err;
  }
};

export const deleteCommentReply = async (commentId: string, replyId: string) => {
  try {
    const res = await httpRequestAdmin.adminDeleted<any>(`api/v1/comments/admin/${commentId}/reply/${replyId}`);
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    throw err;
  }
};
