"use client";

import * as httpRequest from "@/utils/httpRequest";
import { AxiosError } from "axios";

interface PaymentResponse {
  status: string;
  message: string;
  data?: {
    method?: string;
    redirectUrl?: string;
    order?: {
      id?: string;
      _id?: string;
      createdAt?: string;
      [key: string]: any;
    };
    _id?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

class PaymentServices {
  /**
   * Tạo đơn hàng mới
   * @param orderData Dữ liệu đơn hàng
   */
  async createOrder(orderData: any) {
    try {
      const response = await httpRequest.post<PaymentResponse>(
        `api/v1/orders`,
        orderData
      );
      
      // Kiểm tra cấu trúc response
      if (!response || !response.data) {
        throw new Error("Không nhận được phản hồi từ server");
      }
      
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  /**
   * Khởi tạo thanh toán
   * @param orderId ID của đơn hàng
   * @param method Phương thức thanh toán (VNPAY, MOMO, COD)
   * @param successUrl URL chuyển hướng khi thanh toán thành công
   * @param cancelUrl URL chuyển hướng khi hủy thanh toán
   */
  async initializePayment(orderId: string, method: string, successUrl: string, cancelUrl: string) {
    try {
      // Kiểm tra orderId trước khi gửi request
      if (!orderId) {
        throw new Error('Mã đơn hàng là bắt buộc');
      }
      
      // For VNPay, always use the confirmOrder page as the success URL
      let finalSuccessUrl = successUrl;
      if (method === "VNPAY") {
        // The server will append orderId and other params to this URL
        finalSuccessUrl = `${window.location.origin}/confirmOrder`;
      }
      
      const response = await httpRequest.post<PaymentResponse>(
        `api/v1/payment/initialize`,
        {
          orderId,
          method,
          successUrl: finalSuccessUrl,
          cancelUrl
        }
      );
      
      // API trả về cấu trúc: { status, message, data: { method, redirectUrl } }
      // Kiểm tra xem response có đúng định dạng không
      if (response.data.status === 'success' && response.data.data) {
        if (!response.data.data.redirectUrl) {
          console.warn('Warning: redirectUrl not found in response data:', response.data);
        }
      }
      
      return response.data;
    } catch (error) {
      console.error('Error initializing payment:', error);
      throw error;
    }
  }

  /**
   * Kiểm tra trạng thái thanh toán
   * @param orderId ID của đơn hàng
   */
  async checkPaymentStatus(orderId: string) {
    try {
      const response = await httpRequest.get<PaymentResponse>(`api/v1/payment/status/${orderId}`);
      return response;
    } catch (error) {
      console.error('Error checking payment status:', error);
      throw error;
    }
  }

  /**
   * Lấy thông tin thanh toán của đơn hàng
   * @param orderId ID của đơn hàng
   */
  async getOrderPaymentInfo(orderId: string) {
    try {
      const response = await httpRequest.get<PaymentResponse>(`api/v1/payment/order/${orderId}`);
      return response;
    } catch (error) {
      console.error('Error getting order payment info:', error);
      throw error;
    }
  }

  /**
   * Lấy danh sách phương thức thanh toán có sẵn
   */
  async getAvailablePaymentMethods() {
    try {
      const response = await httpRequest.get<PaymentResponse>(`api/v1/payment/methods`);
      return response;
    } catch (error) {
      console.error('Error getting payment methods:', error);
      throw error;
    }
  }
}

export default new PaymentServices(); 