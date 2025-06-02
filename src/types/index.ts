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

export interface Size {
  _id?: string;
  size: string;
  stock: number;
}

export interface Variant {
  _id?: string;
  name: string;
  colorThumbnail: string;
  sizes: Size[];
  images: string[];
}

export interface Price {
  original: number;
  discount?: number;
  discountQuantity?: number;
  currency?: string;
}

export interface Comment {
  _id?: string;
  user_id: string;
  user_name: string;
  content: string;
  rating: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'FLAGGED';
  replyContentAdmin?: string;
  likes?: string[];
  issues?: ('INAPPROPRIATE' | 'SPAM' | 'OFFENSIVE' | 'MISLEADING' | 'OTHER')[];
  replies?: string[];
  parent_id?: string | null;
  images?: string[];
  verified_purchase?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Description {
  header: {
    material?: string;
    style?: string;
    responsible?: string;
    features?: string;
    image?: string;
  };
  body: {
    content: string;
  };
}

export interface Product {
  product:any;
  _id?: string;
  id?: string;
  product_type_id?: string;
  material_id?: string[] | Material[];
  category_id?: string[] | Category[];
  materials?: Material[];
  category?: Category[];
  order_id?: string;
  name: string;
  price: Price;
  thumb?: string;
  variants: Variant[];
  total_quantity: number;
  total_star?: number;
  comments?: Comment[];
  description: Description;
  slug: string;
  tagIsNew?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
  parent?: string | null;
  level?: number;
  description?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Material {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminUser {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: 'admin' | 'staff';
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  products?: T;
  data?: T;
  message?: string;
  status: number;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface UploadResponse {
  path: string;
  filename: string;
  originalname: string;
  size: number;
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalUsers: number;
  recentOrders: Order[];
  topSellingProducts: Product[];
}
