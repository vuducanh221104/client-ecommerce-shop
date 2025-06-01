"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Popconfirm,
  message,
  Input,
  Card,
  Typography,
  Tag,
  Image,
  Row,
  Col,
  Tooltip,
  Modal,
  Form,
  InputNumber,
  Select,
  Tabs,
  Spin,
  Upload,
  Divider,
  Pagination,
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  CalendarOutlined,
  SaveOutlined,
  UploadOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
  LoadingOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import {
  getAllProducts,
  deleteProduct,
  updateProduct,
  getAllCategories,
  getAllMaterials,
} from "@/services/adminServices";
import { uploadCloud } from "@/services/uploadService";
import MarkdownEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import ReactMarkdown from 'react-markdown';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface Product {
  id: string;
  name: string;
  price: {
    original: number;
    discount?: number;
    discountQuantity?: number;
    currency?: string;
  };
  category: Array<{
    id: string;
    name: string;
    slug?: string;
    parent?: {
      id?: string;
      name?: string;
      slug?: string;
    } | null;
  }>;
  materials?: Array<{
    id: string;
    name: string;
    slug?: string;
  }>;
  variants: Array<{
    name: string;
    colorThumbnail?: string;
    images: string[];
    sizes: Array<{
      size: string;
      stock: number;
      _id: string;
    }>;
  }>;
  description?: {
    header?: {
      image?: string;
      material?: string;
      style?: string;
      responsible?: string;
      features?: string;
    };
    body?: {
      content?: string;
    };
  };
  tagIsNew?: boolean;
  slug: string;
  created_at: string;
}

interface Category {
  id?: string;
  _id?: string;
  name: string;
  slug?: string;
  parent?: string | null;
  parent_id?: string | null;
  subcategories?: Category[];
  createdAt?: string;
  updatedAt?: string;
}

interface Material {
  id?: string;
  _id?: string;
  name: string;
  slug?: string;
  parent_id?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

interface ProductsResponse {
  products: Product[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface CategoryResponse {
  data: {
    categories: Category[];
  };
}

interface MaterialResponse {
  data: {
    materials: Material[];
  };
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [editForm] = Form.useForm();
  const [selectedParentCategories, setSelectedParentCategories] = useState<(string | null)[]>([null]);
  const [selectedMiddleCategories, setSelectedMiddleCategories] = useState<(string | null)[]>([null]);
  const [categorySelections, setCategorySelections] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Fetch data function
  const fetchData = async () => {
    try {
      setLoading(true);

      // Call APIs individually with proper typing
      const productsData = (await getAllProducts(currentPage, pageSize)) as ProductsResponse;
      const categoriesData = (await getAllCategories()) as CategoryResponse;
      const materialsData = (await getAllMaterials()) as MaterialResponse;

      if (productsData && productsData.products) {
        setProducts(productsData.products);
        // Set total products for pagination
        if (productsData.pagination) {
          setTotalProducts(productsData.pagination.total);
        }
      }

      if (
        categoriesData &&
        categoriesData.data &&
        categoriesData.data.categories
      ) {
        setCategories(categoriesData.data.categories);
      }

      if (materialsData && materialsData.data && materialsData.data.materials) {
        setMaterials(materialsData.data.materials);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Failed to load data");
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch data from server when there's no search text
    if (!searchText) {
      fetchData();
    }
  }, [currentPage, pageSize, searchText]);

  // Handle page change
  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) {
      setPageSize(pageSize);
    }
  };

  // Handle search
  const handleSearch = (value: string) => {
    setSearchText(value);
    // Reset to first page when searching
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  };

  // Handle product deletion
  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      setProducts(products.filter((product) => product.id !== id));
      message.success("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      message.error("Failed to delete product");
    }
  };

  // Get product thumbnail
  const getProductThumbnail = (product: Product) => {
    // Check if product has variants with images
    if (
      product.variants &&
      product.variants.length > 0 &&
      product.variants[0].images &&
      product.variants[0].images.length > 0
    ) {
      return product.variants[0].images[0];
    }
    // Fallback to description header image if available
    if (product.description?.header?.image) {
      return product.description.header.image;
    }
    // Default placeholder
    return "/placeholder-product.jpg";
  };

  // Get product price
  const getProductPrice = (product: Product) => {
    if (product.price) {
      // If discount is available, use it
      if (product.price.discount && product.price.discount > 0) {
        return {
          currentPrice: product.price.original - product.price.discount,
          originalPrice: product.price.original,
        };
      }
      // Otherwise use original price
      return {
        currentPrice: product.price.original,
        originalPrice: null,
      };
    }
    // Default if no price data
    return {
      currentPrice: 0,
      originalPrice: null,
    };
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Helper function to prepare variants data from a product
  const prepareVariantsFromProduct = (product: Product) => {
    if (!product.variants || product.variants.length === 0) {
      return [];
    }

    return product.variants.map((variant: any) => {
      const images = variant.images
        ? variant.images.map((url: string, index: number) => ({
            uid: `-${index}`,
            name: `image-${index}`,
            status: "done",
            url: url,
          }))
        : [];

      const colorThumbnail = variant.colorThumbnail
        ? [
            {
              uid: "-1",
              name: "thumbnail",
              status: "done",
              url: variant.colorThumbnail,
            },
          ]
        : [];

      return {
        name: variant.name,
        colorThumbnail: colorThumbnail,
        images: images,
        sizes: variant.sizes
          ? variant.sizes.map((size: any) => ({
              size: size.size,
              stock: size.stock,
              _id: size._id,
            }))
          : [],
      };
    });
  };

  // Helper function to get parent categories only (top level)
  const getParentCategories = () => {
    return categories.filter(cat => cat.parent === null);
  };

  // Helper function to get product types based on parent category
  const getProductTypes = (parentId: string) => {
    const parent = categories.find(cat => (cat._id === parentId || cat.id === parentId));
    if (!parent) return [];
    
    // Return product types based on parent category name
    if (parent.name === "Nam") {
      const productTypeNames = ["Tất Cả Sản Phẩm", "Áo Nam", "Quần Nam", "Quần Lót Nam", "Phụ Kiện"];
      return parent.subcategories?.filter(cat => 
        productTypeNames.includes(cat.name)
      ) || [];
    } else if (parent.name === "Nữ") {
      const productTypeNames = ["Tất Cả Sản Phẩm", "Áo Nữ", "Quần Nữ", "Phụ Kiện","Phụ Kiện Nữ"];
      return parent.subcategories?.filter(cat => 
        productTypeNames.includes(cat.name)
      ) || [];
    } else if (parent.name === "Thể Thao") {
      const productTypeNames = ["Thể thao Nam", "Thể thao Nữ"];
      return parent.subcategories?.filter(cat => 
        productTypeNames.includes(cat.name)
      ) || [];
    }
    
    // For other parents, return their subcategories
    return parent.subcategories || [];
  };

  // Helper function to get specific product categories based on product type
  const getSpecificCategories = (productTypeId: string) => {
    // Find the product type from our database
    const productType = categories.flatMap(cat => cat.subcategories || [])
      .find(cat => cat._id === productTypeId || cat.id === productTypeId);
    
    if (!productType) return [];
    
    // Get parent category for context
    const parentCategory = categories.find(cat => 
      cat.subcategories?.some(subcat => 
        (subcat._id === productTypeId || subcat.id === productTypeId)
      )
    );
    
    if (!parentCategory) return [];
    
    // Get all subcategories from the parent
    const allSubcategories = parentCategory.subcategories || [];
    
    // Based on the images provided, filter specific categories for each product type
    if (parentCategory.name === "Nam") {
      // For men's categories
      if (productType.name === "Tất Cả Sản Phẩm") {
        // Return "Sản phẩm mới" only
        return allSubcategories.filter(cat => cat.name === "Sản phẩm mới");
      } else if (productType.name === "Áo Nam") {
        // Return specific men's top categories
        const specificNames = ["Áo Tanktop", "Áo Thun", "Áo Thể Thao", "Áo Polo"];
        return allSubcategories.filter(cat => specificNames.includes(cat.name));
      } else if (productType.name === "Quần Nam") {
        // Return specific men's pants categories
        const specificNames = ["Quần Short", "Quần Thể Thao", "Quần Jean", "Quần Bơi"];
        return allSubcategories.filter(cat => specificNames.includes(cat.name));
      } else if (productType.name === "Quần Lót Nam") {
        // Return specific men's underwear categories
        const specificNames = ["Brief(Tam giác)", "Trunk(Boxer)"];
        return allSubcategories.filter(cat => specificNames.includes(cat.name));
      } else if (productType.name === "Phụ Kiện") {
        // Return specific men's accessory categories
        const specificNames = ["Tất cả phụ kiện", "(Tất, mũ, túi...)"];
        return allSubcategories.filter(cat => specificNames.includes(cat.name));
      }
    } else if (parentCategory.name === "Nữ") {
      // For women's categories
      if (productType.name === "Tất Cả Sản Phẩm") {
        // Return specific women's general categories
        const specificNames = ["Chạy bộ", "Yoga & Pilates"];
        return allSubcategories.filter(cat => specificNames.includes(cat.name));
      } else if (productType.name === "Áo Nữ") {
        // Return specific women's top categories
        const specificNames = ["Áo Sport Bra", "Áo Croptop", "Áo Thun"];
        return allSubcategories.filter(cat => specificNames.includes(cat.name));
      } else if (productType.name === "Quần Nữ") {
        // Return specific women's pants categories
        const specificNames = ["Quần Legging", "Quần Shorts"];
        return allSubcategories.filter(cat => specificNames.includes(cat.name));
      } else if (productType.name === "Phụ Kiện") {
        // Return specific women's accessory categories
        const specificNames = ["Tất cả phụ kiện", "(Tất, mũ, túi...)"];
        return allSubcategories.filter(cat => specificNames.includes(cat.name));
      }
    } else if (parentCategory.name === "Thể Thao") {
      // For sports categories
      if (productType.name === "Thể thao Nam") {
        // Return specific men's sports categories
        const specificNames = ["Thể Thao Chung", "Tập Gym"];
        return allSubcategories.filter(cat => specificNames.includes(cat.name));
      } else if (productType.name === "Thể thao Nữ") {
        // Return specific women's sports categories
        const specificNames = ["Chạy Bộ"];
        return allSubcategories.filter(cat => specificNames.includes(cat.name));
      }
    }
    
    return [];
  };

  // Add another category selection
  const addCategorySelection = () => {
    setSelectedParentCategories([...selectedParentCategories, null]);
    setSelectedMiddleCategories([...selectedMiddleCategories, null]);
    setCategorySelections(categorySelections + 1);
  };

  // Handle edit button click
  const handleEditClick = (product: Product) => {
    setEditingProduct(product);

    // Reset form fields
    editForm.resetFields();

    // Prepare variants for form
    const variants = prepareVariantsFromProduct(product);


    // Prepare header image if available
    const headerImage = product.description?.header?.image
      ? [
          {
            uid: "-1",
            name: "header-image",
            status: "done",
            url: product.description.header.image,
          },
        ]
      : [];

    // Extract material IDs
    const materialIds =
      product.materials && product.materials.length > 0
        ? product.materials.map((material: any) => material.id)
        : [];

    // Extract category IDs from product.category array
    const categoryIds: string[] = [];
    
    if (product.category && product.category.length > 0) {
      // Get all category IDs from the product
      product.category.forEach((category: any) => {
        if (category.id) {
          categoryIds.push(category.id);
        }
      });
    }
    
    
    // Group categories by their parent categories
    const categoryGroups: { 
      parentId: string | null, 
      middleCategoryId: string | null, 
      specificCategoryIds: string[] 
    }[] = [];
    
    // Try to identify middle categories (product types) and specific categories
    if (categoryIds.length > 0) {
      // Get all parent categories
      const parentCategories = categories.filter(cat => cat.parent === null);
      
      // For each parent category
      for (const parentCategory of parentCategories) {
        // Get middle categories (product types) for this parent
        const middleCategories = parentCategory.subcategories?.filter(cat => {
          const productTypeNames = ["Tất Cả Sản Phẩm", "Áo Nam", "Áo Nữ", "Quần Nam", "Quần Nữ", "Quần Lót Nam", "Phụ Kiện", "Phụ Kiện Nữ", "Thể thao Nam", "Thể thao Nữ"];
          return productTypeNames.includes(cat.name);
        }) || [];
        
        // Check if any of the product's categories are middle categories from this parent
        for (const middleCategory of middleCategories) {
          const middleCatId = middleCategory._id || middleCategory.id;
          if (middleCatId && categoryIds.includes(middleCatId)) {
            // Find specific categories that belong to this middle category
            const specificCategoryIds = categoryIds.filter(catId => {
              // Skip the middle category itself
              if (catId === middleCatId) return false;
              
              // Check if this category is a specific category for this middle category
              const specificCats = getSpecificCategories(middleCatId);
              return specificCats.some(specCat => (specCat._id === catId || specCat.id === catId));
            });
            
            // Add this group
            categoryGroups.push({
              parentId: parentCategory._id || parentCategory.id || null,
              middleCategoryId: middleCatId,
              specificCategoryIds: specificCategoryIds
            });
          }
        }
      }
    }
    
    // If no category groups were identified, create a default one with Nam parent
    if (categoryGroups.length === 0) {
      const defaultParent = categories.find(cat => cat.name === "Nam");
      categoryGroups.push({
        parentId: defaultParent?._id || defaultParent?.id || null,
        middleCategoryId: null,
        specificCategoryIds: []
      });
    }
    
    
    // Set up form values
    const formValues: any = {
      name: product.name,
      slug: product.slug,
      originalPrice: product.price.original,
      discountPrice: product.price.discount || 0,
      materialIds: materialIds,
      material: product.description?.header?.material || "",
      materialDescription: product.description?.header?.material || "",
      style: product.description?.header?.style || "",
      responsible: product.description?.header?.responsible || "",
      features: product.description?.header?.features || "",
      headerImage: headerImage,
      content: product.description?.body?.content || "",
      tagIsNew: product.tagIsNew === true,
      variants: variants,
    };
    
    // Set up category selections based on identified groups
    const selectedParentCats: (string | null)[] = [];
    const selectedMiddleCats: (string | null)[] = [];
    
    // Add each category group to the form values
    categoryGroups.forEach((group, index) => {
      formValues[`parentCategory_${index}`] = group.parentId;
      formValues[`middleCategory_${index}`] = group.middleCategoryId;
      formValues[`category_${index}`] = group.specificCategoryIds;
      
      selectedParentCats.push(group.parentId);
      selectedMiddleCats.push(group.middleCategoryId);
    });
    
    // Set the number of category selections
    setCategorySelections(categoryGroups.length);
    
    // Set the selected categories in state
    setSelectedParentCategories(selectedParentCats);
    setSelectedMiddleCategories(selectedMiddleCats);
    
    // Set initial form values and open modal
    editForm.setFieldsValue(formValues);
    
    setEditModalVisible(true);
  };

  // Handle modal cancel
  const handleEditCancel = () => {
    setEditModalVisible(false);
    setEditingProduct(null);
  };

  // Handle image removal consistently
  const handleImageRemove = (fieldPath: string | [number, string]) => {
    // Reset the field to an empty array
    if (typeof fieldPath === "string") {
      editForm.setFieldsValue({ [fieldPath]: [] });
    } else if (Array.isArray(fieldPath)) {
      // For nested fields like variants[0].colorThumbnail
      const [index, field] = fieldPath;
      const variants = editForm.getFieldValue("variants") || [];

      if (variants[index]) {
        variants[index][field] = [];
        editForm.setFieldsValue({ variants });
      }
    }

    return true; // Allow the removal to proceed
  };

  // Xử lý xem trước ảnh
  const handlePreview = (file: any) => {
    const previewUrl =
      file.url ||
      (file.originFileObj && URL.createObjectURL(file.originFileObj));
    if (previewUrl) {
      setPreviewImage(previewUrl);
      setPreviewVisible(true);
    }
  };

  // For uploading images on save
  const uploadImageToServer = async (file: any) => {
    if (!file || (!file.originFileObj && !file.url)) return null;

    // If the file already has a URL, use it
    if (file.url) {
      return file.url;
    }

    // Otherwise, upload it
    try {
      const formData = new FormData();
      formData.append("img", file.originFileObj);
      const response = await uploadCloud(formData);

      if (response && response.length > 0) {
        return response[0].path;
      }
      return null;
    } catch (error) {
      console.error("Error uploading file:", error);
      message.error("Failed to upload image");
      return null;
    }
  };

  // Upload multiple images
  const uploadMultipleImagesToServer = async (files: any[]) => {
    if (!files || !files.length) return [];

    // Separate existing URLs from new files
    const existingUrls = files
      .filter((file) => file.url)
      .map((file) => file.url);
    const newFiles = files.filter((file) => file.originFileObj);

    if (!newFiles.length) {
      return existingUrls;
    }

    try {
      const formData = new FormData();
      newFiles.forEach((file) => {
        formData.append("img", file.originFileObj);
      });

      const response = await uploadCloud(formData);

      if (response && response.length > 0) {
        const newUrls = response.map((item: any) => item.path);
        return [...existingUrls, ...newUrls];
      }

      return existingUrls;
    } catch (error) {
      console.error("Error uploading files:", error);
      message.error("Failed to upload images");
      return existingUrls;
    }
  };

  // Handle form submission
  const handleEditSubmit = async (values: any) => {
    if (!editingProduct) return;

    try {
      setEditLoading(true);
      
      // Check if variants exist
      if (!values.variants) {
        console.warn("Variants is undefined in form submission!");

        // Try to recover variants from editingProduct if possible
        if (
          editingProduct &&
          editingProduct.variants &&
          editingProduct.variants.length > 0
        ) {
          values.variants = prepareVariantsFromProduct(editingProduct);
        }
      }

      // Process header image
      let headerImage = null;
      if (values.headerImage && values.headerImage.length > 0) {
        const headerFile = values.headerImage[0];
        // If it's an existing image with URL, use it directly
        if (headerFile.url) {
          headerImage = headerFile.url;
        }
        // If it's a new file to upload
        else if (headerFile.originFileObj) {
          const formData = new FormData();
          formData.append("img", headerFile.originFileObj);
          try {
            const response = await uploadCloud(formData);
            if (response && response.length > 0) {
              headerImage = response[0].path;
            }
          } catch (error) {
            console.error("Error uploading header image:", error);
            message.error("Failed to upload header image");
          }
        }
      }

      const processedVariants = values.variants
        ? await Promise.all(
            values.variants.map(async (variant: any) => {
              // Process color thumbnail
              let colorThumbnail = null;
              if (variant.colorThumbnail && variant.colorThumbnail.length > 0) {
                const thumbnailFile = variant.colorThumbnail[0];
                // If it's an existing image with URL, use it directly
                if (thumbnailFile.url) {
                  colorThumbnail = thumbnailFile.url;
                }
                // If it's a new file to upload
                else if (thumbnailFile.originFileObj) {
                  const formData = new FormData();
                  formData.append("img", thumbnailFile.originFileObj);
                  try {
                    const response = await uploadCloud(formData);
                    if (response && response.length > 0) {
                      colorThumbnail = response[0].path;
                    }
                  } catch (error) {
                    console.error("Error uploading color thumbnail:", error);
                    message.error("Failed to upload color thumbnail");
                  }
                }
              }

              // Process variant images
              let variantImages = [];
              if (variant.images && variant.images.length > 0) {
                // Get existing images with URLs
                const existingImages = variant.images
                  .filter((img: any) => img.url)
                  .map((img: any) => img.url);

                // Get new images to upload
                const newImages = variant.images.filter(
                  (img: any) => img.originFileObj
                );

                if (newImages.length > 0) {
                  // Upload new images
                  const formData = new FormData();
                  newImages.forEach((img: any) => {
                    formData.append("img", img.originFileObj);
                  });

                  try {
                    const response = await uploadCloud(formData);
                    if (response && response.length > 0) {
                      const newImageUrls = response.map((img: any) => img.path);
                      variantImages = [...existingImages, ...newImageUrls];
                    } else {
                      variantImages = existingImages;
                    }
                  } catch (error) {
                    console.error("Error uploading variant images:", error);
                    message.error("Failed to upload variant images");
                    variantImages = existingImages;
                  }
                } else {
                  variantImages = existingImages;
                }
              }

              return {
                name: variant.name,
                colorThumbnail: colorThumbnail,
                images: variantImages,
                sizes: variant.sizes
                  ? variant.sizes.map((size: any) => {
                      // Only include _id if it's a valid MongoDB ObjectId
                      if (
                        size._id &&
                        typeof size._id === "string" &&
                        /^[0-9a-fA-F]{24}$/.test(size._id)
                      ) {
                        return {
                          size: size.size,
                          stock: size.stock,
                          _id: size._id,
                        };
                      }
                      return {
                        size: size.size,
                        stock: size.stock,
                      };
                    })
                  : [],
              };
            })
          )
        : []; // Return empty array if variants is undefined


      // Collect all category IDs from all selections
      const categoryIds: string[] = [];
      
      // Process multiple category selections
      for (let i = 0; i < categorySelections; i++) {
        // If parent category is selected but middleCategory is 'none', add the parent category ID
        if (values[`parentCategory_${i}`] && (!values[`middleCategory_${i}`] || values[`middleCategory_${i}`] === 'none')) {
          categoryIds.push(values[`parentCategory_${i}`]);
        }
        // Add middle/product type category if selected
        else if (values[`middleCategory_${i}`] && values[`middleCategory_${i}`] !== 'none') {
          categoryIds.push(values[`middleCategory_${i}`]);
        }
        
        // Add specific categories if selected
        if (Array.isArray(values[`category_${i}`]) && values[`category_${i}`].length > 0) {
          // Make sure we're not adding duplicate IDs
          values[`category_${i}`].forEach((catId: string) => {
            if (!categoryIds.includes(catId)) {
              categoryIds.push(catId);
            }
          });
        }
      }

      // Prepare data for update
      const productData = {
        name: values.name,
        slug: values.slug,
        price: {
          original: values.originalPrice,
          discount: values.discountPrice > 0 ? values.discountPrice : undefined,
        },
        category_id: categoryIds,
        material_id: values.materialIds, // Material IDs array
        description: {
          header: {
            image: headerImage,
            material: values.materialDescription || values.material,
            style: values.style,
            responsible: values.responsible,
            features: values.features,
          },
          body: {
            content: values.content,
          },
        },
        tagIsNew: values.tagIsNew === true || values.tagIsNew === "true", // Ensure proper boolean conversion
        variants: processedVariants,
      };


      // Call API to update product
      try {
        const response = await updateProduct(editingProduct.id, productData);

        // Reload all products to ensure we get the latest data
        message.success("Product updated successfully");
        setEditModalVisible(false);
        setEditingProduct(null);
        fetchData(); // Refresh the product list
      } catch (error: any) {
        console.error("Error updating product:", error);
        // Show more detailed error message if available
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Failed to update product";
        message.error(errorMessage);
      }
    } catch (error: any) {
      console.error("Error preparing product data:", error);
      // Show more detailed error message if available
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to prepare product data";
      message.error(errorMessage);
    } finally {
      setEditLoading(false);
    }
  };

  // Filter products based on search text
  const filteredProducts = searchText 
    ? products.filter((product) =>
        product.name.toLowerCase().includes(searchText.toLowerCase())
      )
    : products;

  // Table columns
  const columns = [
    {
      title: "Image",
      key: "image",
      render: (_: unknown, record: Product) => (
        <Image
          src={getProductThumbnail(record)}
          alt={record.name}
          width={50}
          height={50}
          style={{ objectFit: "cover" }}
          fallback="/placeholder-product.jpg"
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: Product, b: Product) => a.name.localeCompare(b.name),
      render: (name: string, record: Product) => (
        <div>
          {name}
          {record.tagIsNew && (
            <Tag color="green" style={{ marginLeft: 8 }}>
              New
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: "Price",
      key: "price",
      render: (_: unknown, record: Product) => {
        const { currentPrice, originalPrice } = getProductPrice(record);
        return (
          <>
            <div>
              {new Intl.NumberFormat("vi-VN").format(currentPrice || 0)}đ
            </div>
            {originalPrice && originalPrice > currentPrice && (
              <div style={{ textDecoration: "line-through", color: "#999" }}>
                {new Intl.NumberFormat("vi-VN").format(originalPrice || 0)}đ
              </div>
            )}
          </>
        );
      },
      sorter: (a: Product, b: Product) => {
        const priceA = getProductPrice(a).currentPrice || 0;
        const priceB = getProductPrice(b).currentPrice || 0;
        return priceA - priceB;
      },
    },
    {
      title: "Material",
      key: "material",
      render: (_: unknown, record: Product) => {
        // First try to get material from materials array (populated material_id)
        if (record.materials && record.materials.length > 0) {
          const materialName = record.materials[0].name;
          return (
            <Tooltip title={materialName}>
              <div className="truncate max-w-[100px]">{materialName}</div>
            </Tooltip>
          );
        }
        // Fallback to description.header.material if materials is not available
        const materialFromDesc = record.description?.header?.material;
        return materialFromDesc ? (
          <Tooltip title={materialFromDesc}>
            <div className="truncate max-w-[100px]">{materialFromDesc}</div>
          </Tooltip>
        ) : (
          <span className="text-gray-400">N/A</span>
        );
      },
    },
    {
      title: "Category",
      key: "category",
      render: (_: unknown, record: Product) => {
        if (!record.category || record.category.length === 0) {
          return <span>Uncategorized</span>;
        }

        // Helper function to determine if a category is a parent category (top level)
        const isParentCategory = (cat: any) => {
          return cat.parent === null || !cat.parent;
        };

        // Helper function to determine if a category is a product type (middle level)
        const isProductType = (cat: any) => {
          const productTypeNames = [
            "Tất Cả Sản Phẩm", "Áo Nam", "Quần Nam", "Quần Lót Nam", "Phụ Kiện",
            "Áo Nữ", "Quần Nữ", "Phụ Kiện Nữ", "Thể thao Nam", "Thể thao Nữ"
          ];
          return cat.parent && productTypeNames.includes(cat.name);
        };

        // First, try to find specific categories (most specific level)
        const specificCategories = record.category.filter(cat => 
          !isParentCategory(cat) && !isProductType(cat)
        );

        // If specific categories exist, show only those
        if (specificCategories.length > 0) {
          return (
            <div style={{ maxWidth: 200 }}>
              {specificCategories.map((cat, index) => (
                <Tag key={cat.id || index} style={{ marginBottom: 4 }}>
                  {cat.name}
                </Tag>
              ))}
            </div>
          );
        }

        // If no specific categories, try to find product types
        const productTypes = record.category.filter(cat => isProductType(cat));
        if (productTypes.length > 0) {
          return (
            <div style={{ maxWidth: 200 }}>
              {productTypes.map((cat, index) => (
                <Tag key={cat.id || index} style={{ marginBottom: 4 }}>
                  {cat.name}
                </Tag>
              ))}
            </div>
          );
        }

        // If no product types either, show parent categories
        const parentCategories = record.category.filter(cat => isParentCategory(cat));
        return (
          <div style={{ maxWidth: 200 }}>
            {parentCategories.map((cat, index) => (
              <Tag key={cat.id || index} style={{ marginBottom: 4 }}>
                {cat.name}
              </Tag>
            ))}
          </div>
        );
      },
    },
    {
      title: "Variants",
      key: "variants",
      render: (_: unknown, record: Product) => (
        <span>{record.variants?.length || 0} variants</span>
      ),
    },
    {
      title: "Status",
      key: "stock",
      render: (_: unknown, record: Product) => {
        const totalStock =
          record.variants?.reduce((sum, variant) => {
            return (
              sum +
              (variant.sizes?.reduce(
                (sizeSum, size) => sizeSum + (size.stock || 0),
                0
              ) || 0)
            );
          }, 0) || 0;

        return (
          <Tag color={totalStock > 0 ? "green" : "red"}>
            {totalStock > 0 ? "In Stock" : "Out of Stock"}
          </Tag>
        );
      },
    },
    {
      title: "Created Date",
      key: "created_at",
      render: (_: unknown, record: Product) => (
        <div>
          <CalendarOutlined style={{ marginRight: 6 }} />
          {formatDate(record.created_at)}
        </div>
      ),
      sorter: (a: Product, b: Product) => {
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: Product) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEditClick(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this product?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-products-page">
      <Card>
        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: 16 }}
        >
          <Col span={8}>
            <Title level={2}>Products Management</Title>
          </Col>
          <Col span={16}>
            <Row justify="end" gutter={16}>
              <Col>
                <Space direction="vertical" size="small">
                  <Input
                    placeholder="Search products"
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={(e) => handleSearch(e.target.value)}
                    style={{ width: 250 }}
                  />
                  {searchText && (
                    <span style={{ fontSize: '12px', color: '#999' }}>
                      Searching within {products.length} loaded products
                    </span>
                  )}
                </Space>
              </Col>
              <Col>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  href="/admin/products/add"
                >
                  Add New Product
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredProducts}
          rowKey="id"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: searchText ? filteredProducts.length : totalProducts,
            onChange: handlePageChange,
            showSizeChanger: false
          }}
        />
      </Card>

      {/* Edit Product Modal */}
      <Modal
        title="Edit Product"
        open={editModalVisible}
        onCancel={handleEditCancel}
        width={800}
        footer={[
          <Button key="cancel" onClick={handleEditCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            icon={<SaveOutlined />}
            loading={editLoading}
            onClick={() => {
              const formValues = editForm.getFieldsValue();

              // Check if variants are missing
              if (!formValues.variants && editingProduct) {

                formValues.variants =
                  prepareVariantsFromProduct(editingProduct);
                editForm.setFieldsValue({ variants: formValues.variants });

              }

              // Check if the form has errors
              editForm
                .validateFields()
                .then((values) => {

                  // Make sure variants exists
                  if (!values.variants && editingProduct) {
                    values.variants =
                      prepareVariantsFromProduct(editingProduct);
                  }

                  // Manually call the submit handler with values
                  handleEditSubmit(values);
                })
                .catch((errors) => {
                  console.error("Form validation failed:", errors);
                  message.error("Please fix the form errors before submitting");
                });
            }}
          >
            Save Changes
          </Button>,
        ]}
      >
        <Spin spinning={editLoading}>
          <Form
            form={editForm}
            layout="vertical"
            onFinish={handleEditSubmit}
            initialValues={{
              discountPrice: 0,
            }}
            preserve={true}
            onValuesChange={(changedValues, allValues) => {

            }}
          >
            <Tabs
              defaultActiveKey="basic"
              destroyInactiveTabPane={false}
              items={[
                {
                  key: "basic",
                  label: "Basic Information",
                  children: (
                    <>
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item
                            name="name"
                            label="Product Name"
                            rules={[
                              {
                                required: true,
                                message: "Please enter product name",
                              },
                            ]}
                          >
                            <Input placeholder="Product Name" />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            name="slug"
                            label="Slug"
                            rules={[
                              {
                                required: false,
                                message: "Please enter product slug",
                              },
                            ]}
                          >
                            <Input placeholder="product-slug" />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item
                            name="originalPrice"
                            label="Original Price"
                            rules={[
                              {
                                required: true,
                                message: "Please enter original price",
                              },
                            ]}
                          >
                            <InputNumber
                              style={{ width: "100%" }}
                              placeholder="Original Price"
                              formatter={(value) =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                              }
                              min={0}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            name="discountPrice"
                            label="Discount Price"
                          >
                            <InputNumber
                              style={{ width: "100%" }}
                              placeholder="Discount Price"
                              formatter={(value) =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                              }
                              min={0}
                            />
                          </Form.Item>
                        </Col>
                      </Row>

                      {/* Multiple Category Selections */}
                      {Array.from({ length: categorySelections }).map((_, index) => (
                        <Card 
                          key={`category-selection-${index}`} 
                          title={`Category Selection ${index + 1}`} 
                          style={{ marginBottom: 16 }}
                          extra={index > 0 ? (
                            <Button 
                              danger 
                              onClick={() => {
                                // Remove this selection
                                const newParentCategories = [...selectedParentCategories];
                                const newMiddleCategories = [...selectedMiddleCategories];
                                
                                newParentCategories.splice(index, 1);
                                newMiddleCategories.splice(index, 1);
                                
                                setSelectedParentCategories(newParentCategories);
                                setSelectedMiddleCategories(newMiddleCategories);
                                setCategorySelections(categorySelections - 1);
                                
                                // Update form values
                                const currentValues = editForm.getFieldsValue();
                                for (let i = index; i < categorySelections - 1; i++) {
                                  currentValues[`parentCategory_${i}`] = currentValues[`parentCategory_${i+1}`];
                                  currentValues[`middleCategory_${i}`] = currentValues[`middleCategory_${i+1}`];
                                  currentValues[`category_${i}`] = currentValues[`category_${i+1}`];
                                }
                                
                                // Remove the last set of values
                                delete currentValues[`parentCategory_${categorySelections-1}`];
                                delete currentValues[`middleCategory_${categorySelections-1}`];
                                delete currentValues[`category_${categorySelections-1}`];
                                
                                editForm.setFieldsValue(currentValues);
                              }}
                            >
                              Remove
                            </Button>
                          ) : null}
                        >
                          <Row gutter={16}>
                            <Col span={24}>
                              {/* Parent Category Selection (Top Level) */}
                              <Form.Item
                                label="Parent Category"
                                name={`parentCategory_${index}`}
                              >
                                <Select
                                  placeholder="Select parent category (e.g., Nam, Nữ)"
                                  showSearch
                                  filterOption={(input, option) =>
                                    option?.children?.toString().toLowerCase().includes(input.toLowerCase()) || false
                                  }
                                  onChange={(value) => {
                                    const newSelectedParents = [...selectedParentCategories];
                                    newSelectedParents[index] = value;
                                    setSelectedParentCategories(newSelectedParents);
                                    
                                    // Clear middle and product category selections when parent changes
                                    const newSelectedMiddles = [...selectedMiddleCategories];
                                    newSelectedMiddles[index] = null;
                                    setSelectedMiddleCategories(newSelectedMiddles);
                                    
                                    const formValues: any = {};
                                    formValues[`middleCategory_${index}`] = null;
                                    formValues[`category_${index}`] = [];
                                    editForm.setFieldsValue(formValues);
                                  }}
                                  allowClear
                                >
                                  {getParentCategories().map((category) => (
                                    <Option
                                      key={category._id || category.id}
                                      value={category._id || category.id}
                                    >
                                      {category.name}
                                    </Option>
                                  ))}
                                </Select>
                              </Form.Item>
                              
                              {/* Product Type Selection (Second Level) */}
                              <Form.Item 
                                name={`middleCategory_${index}`} 
                                label="Product Type"
                              >
                                <Select
                                  placeholder={selectedParentCategories[index] ? "Select product type (e.g., Áo Nam, Quần Nam)" : "Select a parent category first"}
                                  showSearch
                                  filterOption={(input, option) =>
                                    option?.children?.toString().toLowerCase().includes(input.toLowerCase()) || false
                                  }
                                  onChange={(value) => {
                                    const newSelectedMiddles = [...selectedMiddleCategories];
                                    newSelectedMiddles[index] = value;
                                    setSelectedMiddleCategories(newSelectedMiddles);
                                    
                                    // Clear product category selection when middle category changes
                                    const formValues: any = {};
                                    formValues[`category_${index}`] = [];
                                    editForm.setFieldsValue(formValues);
                                  }}
                                  disabled={!selectedParentCategories[index]}
                                  allowClear
                                >
                                  <Option value="none">None</Option>
                                  {selectedParentCategories[index] && 
                                    getProductTypes(selectedParentCategories[index]).map((type) => (
                                      <Option
                                        key={type._id || type.id}
                                        value={type._id || type.id}
                                      >
                                        {type.name}
                                      </Option>
                                    ))
                                  }
                                </Select>
                              </Form.Item>
                              
                              {/* Specific Product Category Selection (Third Level) */}
                              <Form.Item 
                                name={`category_${index}`} 
                                label="Specific Categories"
                              >
                                <Select
                                  placeholder={selectedMiddleCategories[index] ? "Select specific categories (e.g., Áo Tanktop)" : "Select a product type first"}
                                  showSearch
                                  mode="multiple"
                                  filterOption={(input, option) =>
                                    option?.children?.toString().toLowerCase().includes(input.toLowerCase()) || false
                                  }
                                  disabled={!selectedMiddleCategories[index] || selectedMiddleCategories[index] === 'none'}
                                >
                                  {selectedMiddleCategories[index] && selectedMiddleCategories[index] !== 'none' && 
                                    getSpecificCategories(selectedMiddleCategories[index]).map((category) => (
                                      <Option
                                        key={category._id || category.id}
                                        value={category._id || category.id}
                                      >
                                        {category.name}
                                      </Option>
                                    ))
                                  }
                                </Select>
                              </Form.Item>
                            </Col>
                          </Row>
                        </Card>
                      ))}
                      
                      <Form.Item>
                        <Button 
                          type="dashed" 
                          onClick={addCategorySelection} 
                          block 
                          icon={<PlusOutlined />}
                          style={{ marginBottom: 16 }}
                        >
                          Add Another Category
                        </Button>
                      </Form.Item>

                      <Row gutter={16}>
                        <Col span={24}>
                          <Form.Item name="materialIds" label="Materials">
                            <Select
                              placeholder="Select materials"
                              showSearch
                              mode="multiple"
                              optionFilterProp="children"
                            >
                              {materials &&
                                materials.length > 0 &&
                                materials.map((material) => (
                                  <Option
                                    key={material.id || material._id}
                                    value={material.id || material._id}
                                  >
                                    {material.name}
                                  </Option>
                                ))}
                            </Select>
                          </Form.Item>
                        </Col>
                      </Row>

                      <Row gutter={16}>
                        <Col span={24}>
                          <Form.Item name="tagIsNew" label="Tag as New">
                            <Select>
                              <Option value={true}>Yes</Option>
                              <Option value={false}>No</Option>
                            </Select>
                          </Form.Item>
                        </Col>
                      </Row>
                    </>
                  ),
                },
                {
                  key: "description",
                  label: "Description",
                  children: (
                    <>
                      <Row gutter={16}>
                        <Col span={24}>
                          <Form.Item
                            name="headerImage"
                            label="Header Image"
                            valuePropName="fileList"
                            getValueFromEvent={(e) => {
                              // Handle both upload and removal
                              if (Array.isArray(e)) {
                                return e;
                              }
                              // Make sure we return [] when all files are removed
                              return e?.fileList || [];
                            }}
                          >
                            <Upload
                              listType="picture-card"
                              fileList={
                                editForm.getFieldValue("headerImage") || []
                              }
                              beforeUpload={() => false}
                              maxCount={1}
                              onPreview={handlePreview}
                              onRemove={() => handleImageRemove("headerImage")}
                              showUploadList={{
                                showRemoveIcon: true,
                                showPreviewIcon: true,
                              }}
                            >
                              <div>
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Upload</div>
                              </div>
                            </Upload>
                          </Form.Item>
                        </Col>
                      </Row>

                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item name="style" label="Style">
                            <Input placeholder="Style" />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item name="responsible" label="Responsible">
                            <Input placeholder="Responsible" />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item name="features" label="Features">
                            <Input placeholder="Features" />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            name="materialDescription"
                            label="Material Description"
                          >
                            <Input placeholder="Enter material description" />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Form.Item name="content" label="Content">
                        <MarkdownEditor
                          style={{ height: '400px' }}
                          renderHTML={(text) => <ReactMarkdown>{text}</ReactMarkdown>}
                          onChange={({ text }) => {
                            editForm.setFieldsValue({ content: text });
                          }}
                          value={editForm.getFieldValue('content') || ''}
                        />
                      </Form.Item>
                    </>
                  ),
                },
                {
                  key: "variants",
                  label: "Variants",
                  children: (
                    <Form.List name="variants">
                      {(fields, { add, remove }) => (
                        <>
                          {fields.map(({ key, name, ...restField }) => (
                            <div
                              key={key}
                              style={{
                                marginBottom: 24,
                                border: "1px solid #f0f0f0",
                                padding: 16,
                                borderRadius: 8,
                              }}
                            >
                              <Row gutter={16} align="middle">
                                <Col span={22}>
                                  <Title level={5}>Variant {name + 1}</Title>
                                </Col>
                                <Col span={2} style={{ textAlign: "right" }}>
                                  <Button
                                    type="text"
                                    danger
                                    icon={<MinusCircleOutlined />}
                                    onClick={() => remove(name)}
                                  />
                                </Col>
                              </Row>

                              <Row gutter={16}>
                                <Col span={12}>
                                  <Form.Item
                                    name={[name, "name"]}
                                    label="Color Name"
                                    rules={[
                                      {
                                        required: true,
                                        message: "Missing color name",
                                      },
                                    ]}
                                  >
                                    <Input placeholder="Color name (e.g. Red, Blue)" />
                                  </Form.Item>
                                </Col>
                                <Col span={12}>
                                  <Form.Item
                                    name={[name, "colorThumbnail"]}
                                    label="Color Thumbnail"
                                    valuePropName="fileList"
                                    getValueFromEvent={(e) => {
                                      // Handle both upload and removal
                                      if (Array.isArray(e)) {
                                        return e;
                                      }
                                      // Make sure we return [] when all files are removed
                                      return e?.fileList || [];
                                    }}
                                  >
                                    <Upload
                                      listType="picture-card"
                                      fileList={
                                        editForm.getFieldValue([
                                          "variants",
                                          name,
                                          "colorThumbnail",
                                        ]) || []
                                      }
                                      beforeUpload={() => false}
                                      maxCount={1}
                                      onPreview={handlePreview}
                                      onRemove={() =>
                                        handleImageRemove([
                                          name,
                                          "colorThumbnail",
                                        ])
                                      }
                                      showUploadList={{
                                        showRemoveIcon: true,
                                        showPreviewIcon: true,
                                      }}
                                    >
                                      <div>
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>
                                          Upload
                                        </div>
                                      </div>
                                    </Upload>
                                  </Form.Item>
                                </Col>
                              </Row>

                              <Form.Item
                                label="Product Images"
                                name={[name, "images"]}
                                valuePropName="fileList"
                                getValueFromEvent={(e) => {
                                  if (Array.isArray(e)) {
                                    return e;
                                  }
                                  return e?.fileList || [];
                                }}
                              >
                                <Upload
                                  listType="picture-card"
                                  fileList={
                                    editForm.getFieldValue([
                                      "variants",
                                      name,
                                      "images",
                                    ]) || []
                                  }
                                  beforeUpload={() => false}
                                  onPreview={handlePreview}
                                  multiple
                                >
                                  <div>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                  </div>
                                </Upload>
                              </Form.Item>

                              <Form.List name={[name, "sizes"]}>
                                {(
                                  sizeFields,
                                  { add: addSize, remove: removeSize }
                                ) => (
                                  <div style={{ marginBottom: 16 }}>
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginBottom: 8,
                                      }}
                                    >
                                      <Title level={5} style={{ margin: 0 }}>
                                        Sizes
                                      </Title>
                                      <Button
                                        type="dashed"
                                        onClick={() =>
                                          addSize({ size: "", stock: 0 })
                                        }
                                        icon={<PlusOutlined />}
                                      >
                                        Add Size
                                      </Button>
                                    </div>

                                    {sizeFields.map(
                                      ({
                                        key: sizeKey,
                                        name: sizeName,
                                        ...restSizeField
                                      }) => (
                                        <Row
                                          gutter={16}
                                          key={sizeKey}
                                          style={{ marginBottom: 8 }}
                                        >
                                          <Col span={10}>
                                            <Form.Item
                                              name={[sizeName, "size"]}
                                              rules={[
                                                {
                                                  required: true,
                                                  message: "Size is required",
                                                },
                                              ]}
                                              style={{ marginBottom: 0 }}
                                            >
                                              <Select placeholder="Select size">
                                                <Option key="XS" value="XS">
                                                  XS
                                                </Option>
                                                <Option key="S" value="S">
                                                  S
                                                </Option>
                                                <Option key="M" value="M">
                                                  M
                                                </Option>
                                                <Option key="L" value="L">
                                                  L
                                                </Option>
                                                <Option key="XL" value="XL">
                                                  XL
                                                </Option>
                                                <Option key="XXL" value="XXL">
                                                  XXL
                                                </Option>
                                              </Select>
                                            </Form.Item>
                                          </Col>
                                          <Col span={10}>
                                            <Form.Item
                                              name={[sizeName, "stock"]}
                                              rules={[
                                                {
                                                  required: true,
                                                  message: "Stock is required",
                                                },
                                              ]}
                                              style={{ marginBottom: 0 }}
                                            >
                                              <InputNumber
                                                style={{ width: "100%" }}
                                                placeholder="Stock Quantity"
                                                min={0}
                                              />
                                            </Form.Item>
                                          </Col>
                                          <Col
                                            span={4}
                                            style={{
                                              display: "flex",
                                              justifyContent: "center",
                                              alignItems: "center",
                                            }}
                                          >
                                            <Button
                                              type="text"
                                              danger
                                              icon={<MinusCircleOutlined />}
                                              onClick={() =>
                                                removeSize(sizeName)
                                              }
                                            />
                                          </Col>
                                        </Row>
                                      )
                                    )}
                                  </div>
                                )}
                              </Form.List>
                              <Divider />
                            </div>
                          ))}

                          <Form.Item style={{ marginTop: 16 }}>
                            <Space
                              style={{
                                width: "100%",
                                justifyContent: "center",
                              }}
                            >
                              <Button
                                type="primary"
                                ghost
                                onClick={() => {
                                  // Create a new variant with all standard sizes
                                  const newVariant = {
                                    name: "",
                                    colorThumbnail: [],
                                    images: [],
                                    sizes: [
                                      { size: "S", stock: 100 },
                                      { size: "M", stock: 100 },
                                      { size: "L", stock: 100 },
                                      { size: "XL", stock: 100 },
                                    ],
                                  };
                                  add(newVariant);
                                }}
                                icon={<PlusOutlined />}
                              >
                                Quick Add Variant with All Sizes
                              </Button>
                              <Button
                                type="dashed"
                                onClick={() =>
                                  add({
                                    name: "",
                                    colorThumbnail: [],
                                    images: [],
                                    sizes: [],
                                  })
                                }
                                icon={<PlusOutlined />}
                              >
                                Add Empty Variant
                              </Button>
                            </Space>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>
                  ),
                },
              ]}
            />
          </Form>
        </Spin>
      </Modal>
    </div>
  );
};

export default ProductsPage;
