"use client";

import * as httpRequest from "@/utils/httpRequest";
import { ApiResponse, PaginatedResponse, Product } from "@/types";
import { AxiosError } from "axios";

export const productGetAll = async (): Promise<ApiResponse<Product[]>> => {
  try {
    const res = await httpRequest.get<ApiResponse<Product[]>>(`api/v1/products`);

    return res;
  } catch (error: unknown) {
    const err = error as AxiosError;
    throw err;
    // return error;
    // console.error(err.response?.data);
  }
};

export const productGetBySlug = async (slug: string): Promise<ApiResponse<Product>> => {
  try {
    // Use the real API endpoint
    const res = await httpRequest.get<ApiResponse<Product>>(`api/v1/products/slug/${slug}`);
    return res;
  } catch (error: unknown) {
    const err = error as AxiosError;
    throw err;
  }
};

export const searchProducts = async (query: string): Promise<PaginatedResponse<Product[]>> => {
  try {
    const res = await httpRequest.get<PaginatedResponse<Product[]>>(
      `api/v1/products/search?q=${encodeURIComponent(query)}&limit=4`
    );
    return res;
  } catch (error: unknown) {
    const err = error as AxiosError;
    throw err;
  }
};

export const searchProductsGetAll = async (
  query: string,
  page = 1,
  limit = 10
): Promise<PaginatedResponse<Product[]>> => {
  try {
    const res = await httpRequest.get<PaginatedResponse<Product[]>>(
      `api/v1/products/search?q=${encodeURIComponent(
        query
      )}&page=${page}&limit=${limit}`
    );
    return res;
  } catch (error: unknown) {
    const err = error as AxiosError;
    throw err;
  }
};

export const ProductOutstanding = async (): Promise<ApiResponse<Product[]>> => {
  try {
    const res = await httpRequest.get<ApiResponse<Product[]>>(`api/v1/products?limit=4`);
    return res;
  } catch (error: unknown) {
    const err = error as AxiosError;
    throw err;
  }
};
