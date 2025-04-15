"use client";

import { useState, useEffect } from "react";
import React, { use } from "react";
import { categoryGetBySlug } from "@/services/categoryServices";
import CategoryCollectionSlider from "@/components/CategoryCollectionSlider";
import CategoryProductList from "@/components/CategoryProductList";
import NotFound from "@/components/NotFound";
import Loading from "@/components/Loading";

interface PageCategoryProps {
  params: Promise<{
    slug: string;
  }>;
}

function PageCategory({ params }: PageCategoryProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [products, setProducts] = useState<any[]>([]);
  const [category, setCategory] = useState<any>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [categoryNotFound, setCategoryNotFound] = useState(false);
  const [categoryType, setCategoryType] = useState("active");
  const [sortOption, setSortOption] = useState("newest");
  const [originalProducts, setOriginalProducts] = useState<any[]>([]);

  const productsPerPage = 10; // 10 products per page

  // Xác định categoryType dựa vào slug
  useEffect(() => {
    // Nếu slug là "nu" hoặc có chứa "nu" (ví dụ: ao-nu, quan-nu)
    if (slug === "nu" || slug.includes("-nu")) {
      setCategoryType("nu");
    } else {
      setCategoryType("active");
    }
  }, [slug]);

  // Fetch category data from API
  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      setCategoryNotFound(false);

      try {
        const response = await categoryGetBySlug(slug, 1, productsPerPage);
        setProducts(response.products || []);
        setOriginalProducts(response.products || []);
        setCategory(response.category);

        // Set pagination info from API response
        if (response.pagination) {
          setPagination(response.pagination);
        }
      } catch (error) {
        console.error("Error fetching category data:", error);
        setCategoryNotFound(true);
        setProducts([]);
        setOriginalProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [slug]);

  // If category not found, show 404 page
  if (categoryNotFound && !loading) {
    return <NotFound />;
  }

  // Handle load more products (will be passed to CategoryProductList)
  const handleLoadMore = async (page: number) => {
    setLoadingMore(true);

    try {
      const response = await categoryGetBySlug(slug, page, productsPerPage);
      const newProducts = response.products || [];

      // Append new products to existing products
      setOriginalProducts((prev) => [...prev, ...newProducts]);

      // Áp dụng lại bộ lọc hiện tại với danh sách sản phẩm mới
      const allProducts = [...products, ...newProducts];
      const sortedProducts = sortProducts(allProducts, sortOption);
      setProducts(sortedProducts);

      // Update pagination info
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error("Error loading more products:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  // Hàm sắp xếp sản phẩm theo tùy chọn
  const sortProducts = (productList: any[], option: string) => {
    let sortedResults = [...productList];

    switch (option) {
      case "price-asc":
        sortedResults.sort((a, b) => a.price.original - b.price.original);
        break;
      case "price-desc":
        sortedResults.sort((a, b) => b.price.original - a.price.original);
        break;
      case "discount":
        sortedResults.sort(
          (a, b) => b.price.discountQuantity - a.price.discountQuantity
        );
        break;
      case "bestseller":
        // Giả sử API trả về trường soldCount hoặc tương tự
        sortedResults.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
        break;
      // Mặc định là newest - giữ nguyên thứ tự từ API
      default:
        break;
    }

    return sortedResults;
  };

  // Handle sort products
  const handleSortProducts = (option: string) => {
    setSortOption(option);
    const sortedProducts = sortProducts(originalProducts, option);
    setProducts(sortedProducts);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <CategoryCollectionSlider categoryType={categoryType} />
      <CategoryProductList
        slug={slug}
        initialProducts={products}
        category={category}
        initialPagination={pagination}
        loadingMore={loadingMore}
        onLoadMore={handleLoadMore}
        onSortProducts={handleSortProducts}
        currentSortOption={sortOption}
      />
    </>
  );
}

export default PageCategory;
