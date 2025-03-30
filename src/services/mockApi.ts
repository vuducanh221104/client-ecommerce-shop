// Types
export interface Banner {
  id: number;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  imageUrl: string;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  imageUrl: string;
  category: string;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isSale?: boolean;
  isOutOfStock?: boolean;
  colors: Array<{
    name: string;
    code: string;
  }>;
}

export interface Category {
  id: number;
  name: string;
  imageUrl: string;
  link: string;
}

export interface Benefit {
  id: number;
  title: string;
  description: string;
  icon: string;
}

// Mock data for Home page
export const getHomeBanners = (): Banner[] => {
  return [
    {
      id: 1,
      title: "MEN WEAR COLLECTION",
      subtitle: "Nhập SNCM50 Giảm 50k đơn từ 460k",
      buttonText: "Mua ngay",
      buttonLink: "/collections/men",
      imageUrl:
        "https://media3.coolmate.me/cdn-cgi/image/width=192…oads/March2025/Hero_banner_Desktop_-_1920x788.jpg",
    },
    {
      id: 2,
      title: "WOMEN ACTIVE COLLECTION",
      subtitle: "Tặng Áo Bra khi mua quần Legging",
      buttonText: "Mua ngay",
      buttonLink: "/collections/women",
      imageUrl:
        "https://media3.coolmate.me/cdn-cgi/image/width=192…oads/March2025/Hero_banner_Desktop_-_1920x788.jpg",
    },
    {
      id: 3,
      title: "SUMMER ESSENTIALS",
      subtitle: "Mua 2 giảm thêm 10%",
      buttonText: "Xem ngay",
      buttonLink: "/collections/summer",
      imageUrl:
        "https://media3.coolmate.me/cdn-cgi/image/width=192…oads/March2025/Hero_banner_Desktop_-_1920x788.jpg",
    },
  ];
};

export const getFeaturedProducts = (): Product[] => {
  return [
    {
      id: 1,
      title: "Áo Polo nam Excool",
      price: 299000,
      oldPrice: 349000,
      discount: 15,
      imageUrl:
        "https://media.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85,format=auto/uploads/April2023/DSC00472-Edit_92.jpg",
      category: "Áo polo",
      rating: 4.8,
      reviewCount: 56,
      isSale: true,
      colors: [
        { name: "Đen", code: "#000000" },
        { name: "Trắng", code: "#FFFFFF" },
        { name: "Xanh dương", code: "#1E40AF" },
      ],
    },
    {
      id: 2,
      title: "Áo thun nam Cotton Compact",
      price: 199000,
      imageUrl:
        "https://media.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85,format=auto/uploads/March2023/AothunUltima3.6.jpg",
      category: "Áo thun",
      rating: 4.9,
      reviewCount: 120,
      isNew: true,
      colors: [
        { name: "Đen", code: "#000000" },
        { name: "Trắng", code: "#FFFFFF" },
        { name: "Xanh lá", code: "#166534" },
      ],
    },
    {
      id: 3,
      title: "Quần shorts nam thể thao Recycle",
      price: 249000,
      oldPrice: 299000,
      discount: 17,
      imageUrl:
        "https://media.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85,format=auto/uploads/April2023/_CMM0294-Edit.jpg",
      category: "Quần shorts",
      rating: 4.7,
      reviewCount: 42,
      isSale: true,
      colors: [
        { name: "Đen", code: "#000000" },
        { name: "Xanh navy", code: "#172554" },
        { name: "Xám", code: "#6B7280" },
      ],
    },
    {
      id: 4,
      title: "Quần Jeans nam dáng Slim",
      price: 599000,
      imageUrl:
        "https://media.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85,format=auto/uploads/February2023/quan-jean-nam-4.jpg",
      category: "Quần jeans",
      rating: 4.5,
      reviewCount: 28,
      colors: [
        { name: "Xanh đậm", code: "#172554" },
        { name: "Xanh nhạt", code: "#60A5FA" },
      ],
    },
    {
      id: 5,
      title: "Áo sơ mi nam dài tay Modal",
      price: 399000,
      imageUrl:
        "https://media.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85,format=auto/uploads/May2023/DSC09649_copy.jpg",
      category: "Áo sơ mi",
      rating: 4.6,
      reviewCount: 35,
      isNew: true,
      colors: [
        { name: "Trắng", code: "#FFFFFF" },
        { name: "Xanh dương nhạt", code: "#93C5FD" },
        { name: "Hồng nhạt", code: "#FCA5A5" },
      ],
    },
    {
      id: 6,
      title: "Quần lót nam Brief Bamboo",
      price: 99000,
      oldPrice: 129000,
      discount: 23,
      imageUrl:
        "https://media.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85,format=auto/uploads/March2023/quan-brief-bamboo1.jpg",
      category: "Đồ lót",
      rating: 4.9,
      reviewCount: 89,
      isSale: true,
      colors: [
        { name: "Đen", code: "#000000" },
        { name: "Xanh navy", code: "#172554" },
        { name: "Xám", code: "#6B7280" },
      ],
    },
    {
      id: 7,
      title: "Áo khoác nam Gió Nylon",
      price: 499000,
      imageUrl:
        "https://media.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85,format=auto/uploads/February2023/DSC04621_60.jpg",
      category: "Áo khoác",
      rating: 4.7,
      reviewCount: 23,
      colors: [
        { name: "Đen", code: "#000000" },
        { name: "Xanh rêu", code: "#3F6212" },
      ],
    },
    {
      id: 8,
      title: "Áo Tank top nam Cotton Compact",
      price: 169000,
      imageUrl:
        "https://media.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85,format=auto/uploads/March2023/tank-cotton-7-3.jpg",
      category: "Áo Tank top",
      rating: 4.8,
      reviewCount: 19,
      isNew: true,
      colors: [
        { name: "Đen", code: "#000000" },
        { name: "Trắng", code: "#FFFFFF" },
        { name: "Xám", code: "#6B7280" },
      ],
    },
  ];
};

export const getCategories = (): Category[] => {
  return [
    {
      id: 1,
      name: "Áo thun",
      imageUrl:
        "https://media.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85,format=auto/uploads/March2023/AothunUltima3.6.jpg",
      link: "/collections/ao-thun",
    },
    {
      id: 2,
      name: "Áo Polo",
      imageUrl:
        "https://media.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85,format=auto/uploads/April2023/DSC00472-Edit_92.jpg",
      link: "/collections/ao-polo",
    },
    {
      id: 3,
      name: "Quần shorts",
      imageUrl:
        "https://media.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85,format=auto/uploads/April2023/_CMM0294-Edit.jpg",
      link: "/collections/quan-shorts",
    },
    {
      id: 4,
      name: "Đồ lót",
      imageUrl:
        "https://media.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85,format=auto/uploads/March2023/quan-brief-bamboo1.jpg",
      link: "/collections/do-lot",
    },
  ];
};

export const getBenefits = (): Benefit[] => {
  return [
    {
      id: 1,
      title: "Miễn phí vận chuyển",
      description: "Cho đơn hàng từ 200k",
      icon: "truck",
    },
    {
      id: 2,
      title: "Đổi trả miễn phí",
      description: "Trong 60 ngày",
      icon: "refresh",
    },
    {
      id: 3,
      title: "Thanh toán dễ dàng",
      description: "Nhiều hình thức",
      icon: "credit-card",
    },
    {
      id: 4,
      title: "Hỗ trợ 24/7",
      description: "Hotline: 1900.272737",
      icon: "headset",
    },
  ];
};
