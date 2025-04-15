"use client";

import * as httpRequest from "@/utils/httpRequest";
import { AxiosError } from "axios";

export const categoryGetBySlug = async (
  slug: string,
  page: number = 1,
  limit: number = 10
): Promise<any> => {
  try {
    const res = await httpRequest.get<any>(
      `api/v1/products/category/slug/${slug}?page=${page}&limit=${limit}`
    );

    return res;
  } catch (error: any) {
    const err = error as AxiosError;
    throw err;
    // return error;
    // console.error(err.response?.data);
  }
};
