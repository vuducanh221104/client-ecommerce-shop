export interface User {
  id: string;
  name?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  phoneNumber?: string;
}

export interface CartItem {
  _id: string;
  product_id: string;
  name: string;
  thumb: string;
  slug: string;
  price: {
    discount?: number;
    original?: number;
  };
  quantity: number;
  colorOrder: string;
  sizeOrder: string;
  stock: number;
}

export interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  colorOrder: string;
  sizeOrder: string;
  thumb?: string;
  slug?: string;
}

export interface Order {
  id: string;
  user_id?: string;
  customer_email: string;
  items: OrderItem[];
  shipping_address: {
    full_name: string;
    phone_number: string;
    street: string;
    ward: string;
    district: string;
    city: string;
    country: string;
  };
  payment: {
    method: string;
    status: string;
    transaction_id?: string;
    payment_date?: string;
  };
  total_amount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}
