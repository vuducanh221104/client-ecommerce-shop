"use client";

import * as httpRequest from "@/utils/httpRequest";
import { AxiosError } from "axios";
import { getProductBySlug as getMockProductBySlug } from "./mockApi";

export const productGetAll = async (): Promise<any> => {
  try {
    const res = await httpRequest.get<any>(`api/v1/products`);

    return res;
  } catch (error: any) {
    const err = error as AxiosError;
    throw err;
    // return error;
    // console.error(err.response?.data);
  }
};

export const productGetBySlug = async (slug: string): Promise<any> => {
  try {
    // Use the real API endpoint
    const res = await httpRequest.get<any>(`api/v1/products/slug/${slug}`);
    return res;
  } catch (error: any) {
    const err = error as AxiosError;
    throw err;
  }
};

export const searchProducts = async (query: string): Promise<any> => {
  try {
    const res = await httpRequest.get<any>(
      `api/v1/products/search?q=${encodeURIComponent(query)}&limit=4`
    );
    return res;
  } catch (error: any) {
    const err = error as AxiosError;
    throw err;
  }
};

export const searchProductsGetAll = async (
  query: string,
  page = 1,
  limit = 10
): Promise<any> => {
  try {
    const res = await httpRequest.get<any>(
      `api/v1/products/search?q=${encodeURIComponent(
        query
      )}&page=${page}&limit=${limit}`
    );
    return res;
  } catch (error: any) {
    const err = error as AxiosError;
    throw err;
  }
};

export const ProductOutstanding = async (query: string): Promise<any> => {
  try {
    const res = await httpRequest.get<any>(`api/v1/products?limit=4`);
    return res;
  } catch (error: any) {
    const err = error as AxiosError;
    throw err;
  }
};
