"use client";
import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Select,
  InputNumber,
  Upload,
  Space,
  Divider,
  Row,
  Col,
  message,
  Spin,
  Tag,
  Modal,
  Switch,
} from "antd";
import {
  PlusOutlined,
  MinusCircleOutlined,
  UploadOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { createProduct } from "@/services/adminServices";
import { uploadCloud } from "@/services/uploadService";
import { getAllCategories, getAllMaterials } from "@/services/adminServices";
import { transformListSelect } from "@/utils/transformListSelect";
import MarkdownEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import ReactMarkdown from 'react-markdown';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface Category {
  id?: string;
  _id?: string;
  name: string;
  value?: string;
  label?: string;
  parent?: string | null;
  subcategories?: Category[];
}

interface Material {
  id?: string;
  _id?: string;
  name: string;
  value?: string;
  label?: string;
}

interface UploadFile {
  uid?: string;
  name?: string;
  url?: string;
  status?: string;
  response?: { url: string };
  preview?: string;
  originFileObj?: File;
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

const AddProductPage = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedParentCategories, setSelectedParentCategories] = useState<(string | null)[]>([null]);
  const [selectedMiddleCategories, setSelectedMiddleCategories] = useState<(string | null)[]>([null]);
  const [categorySelections, setCategorySelections] = useState<number>(1);

  // Fetch categories and materials data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesData, materialsData] = await Promise.all([
          getAllCategories() as Promise<CategoryResponse>,
          getAllMaterials() as Promise<MaterialResponse>,
        ]);

        if (
          categoriesData &&
          categoriesData.data &&
          categoriesData.data.categories
        ) {
          const transformedCategories = transformListSelect(
            categoriesData.data.categories
          );
          setCategories(transformedCategories);
        }

        if (
          materialsData &&
          materialsData.data &&
          materialsData.data.materials
        ) {
          const transformedMaterials = transformListSelect(
            materialsData.data.materials
          );
          setMaterials(transformedMaterials);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Failed to load categories or materials");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Upload image helper
  const uploadImage = async (file: any) => {
    try {
      if (!file || !file.originFileObj) return null;

      const formData = new FormData();
      formData.append("img", file.originFileObj);

      const response = await uploadCloud(formData);

      if (response && response.length > 0) {
        return response[0].path;
      }
      return null;
    } catch (error) {
      console.error("Upload error:", error);
      message.error("Failed to upload image");
      return null;
    }
  };

  // Upload multiple images helper
  const uploadImages = async (fileList: UploadFile[]) => {
    if (!fileList || fileList.length === 0) return [];

    // Filter files that need to be uploaded (have originFileObj)
    const filesToUpload = fileList.filter((file) => file.originFileObj);

    if (filesToUpload.length === 0) {
      // Return URLs of files that already have URLs
      return fileList
        .filter((file) => file.url || (file.response && file.response.url))
        .map((file) => file.url || file.response?.url);
    }

    try {
      const formData = new FormData();
      filesToUpload.forEach((file) => {
        if (file.originFileObj) {
          formData.append("img", file.originFileObj);
        }
      });

      const response = await uploadCloud(formData);

      if (response && response.length > 0) {
        // Combine existing URLs with newly uploaded URLs
        const existingUrls = fileList
          .filter((file) => file.url || (file.response && file.response.url))
          .map((file) => file.url || file.response?.url);

        const newUrls = response.map((item: any) => item.path);

        return [...existingUrls, ...newUrls];
      }

      return [];
    } catch (error) {
      console.error("Error uploading images:", error);
      message.error("Failed to upload images");
      return [];
    }
  };

  // Submit form
  const onFinish = async (values: any) => {
    try {
      setSubmitLoading(true);

      // Process variants to ensure proper format and upload images
      const uploadPromises = values.variants.map(async (variant: any) => {
        // Upload color thumbnail
        let colorThumbnailUrl = null;
        if (variant.colorThumbnail && variant.colorThumbnail.length > 0) {
          const file = variant.colorThumbnail[0];
          colorThumbnailUrl = await uploadImage(file);
        }

        // Upload variant images
        const imageUrls = await uploadImages(variant.images || []);

        // Calculate total stock
        const totalStock = variant.sizes.reduce(
          (sum: number, size: any) => sum + (parseInt(size.stock) || 0),
          0
        );

        return {
          name: variant.name,
          colorThumbnail: colorThumbnailUrl,
          images: imageUrls,
          sizes: variant.sizes || [],
          stock: totalStock,
        };
      });

      const processedVariants = await Promise.all(uploadPromises);

      // Process header image if it exists
      let headerImageUrl = null;
      if (values.headerImage && values.headerImage.length > 0) {
        headerImageUrl = await uploadImage(values.headerImage[0]);
      }

      // Calculate total quantity from all variants
      const totalQuantity = processedVariants.reduce((sum, variant) => {
        return sum + variant.stock;
      }, 0);

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
          values[`category_${i}`].forEach((catId: string) => {
            if (!categoryIds.includes(catId)) {
              categoryIds.push(catId);
            }
          });
        }
      }

      // Map materials to array of _id values - as direct strings, not $oid objects
      const materialIds = Array.isArray(values.materials)
        ? values.materials
        : [values.materials];

      // Prepare product data
      const productData = {
        name: values.name,
        slug: values.slug,
        description: {
          header: {
            material: values.material || "",
            style: values.style || "",
            features: values.features || "",
            responsible: values.responsible || "",
            image: headerImageUrl || "",
          },
          body: {
            content: values.content || "",
          },
        },
        price: {
          original: parseInt(values.originalPrice),
          discount: parseInt(values.discountPrice || 0),
          discountQuantity: 0,
          currency: "VND",
        },
        category_id: categoryIds,
        material_id: materialIds,
        variants: processedVariants,
        total_quantity: totalQuantity,
        tagIsNew: values.tagIsNew || false,
      };

      // Send to API
      const result = await createProduct(productData);

      if (result) {
        message.success("Product created successfully");
        router.push("/admin/products");
      } else {
        message.error("Failed to create product");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      message.error("Failed to create product");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Add another category selection
  const addCategorySelection = () => {
    setSelectedParentCategories([...selectedParentCategories, null]);
    setSelectedMiddleCategories([...selectedMiddleCategories, null]);
    setCategorySelections(categorySelections + 1);
  };

  // Handle image preview
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview && file.originFileObj) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewVisible(true);
  };

  // Convert file to base64 for preview
  const getBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Mock sizes for selection
  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

  // Helper function to create slug from name
  const generateSlug = (name: string): string => {
    if (!name) return "";

    // Convert to lowercase and replace spaces/special characters with hyphens
    const slug = name
      .toLowerCase()
      .trim()
      .normalize("NFD") // Normalize Vietnamese characters
      .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
      .replace(/[đĐ]/g, "d") // Replace Vietnamese d character
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-"); // Remove consecutive hyphens

    return slug;
  };

  // Handle name blur to generate slug
  const handleNameBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const name = e.target.value;

    // Only generate slug if slug field is empty or hasn't been manually edited
    const currentSlug = form.getFieldValue("slug");
    if (!currentSlug) {
      const slug = generateSlug(name);
      form.setFieldsValue({ slug });
    }
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
      const productTypeNames = ["Tất Cả Sản Phẩm", "Áo Nữ", "Quần Nữ", "Phụ Kiện"];
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
    // Find the product type category
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

  return (
    <div className="admin-add-product-page">
      <Card>
        <Title level={2}>Add New Product</Title>
        <Spin spinning={loading}>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              tagIsNew: false,
              discountPrice: 0,
              variants: [{ sizes: [{ size: "M", stock: 0 }] }],
            }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Product Name"
                  rules={[
                    { required: true, message: "Please enter product name" },
                  ]}
                >
                  <Input
                    placeholder="Enter product name"
                    onBlur={handleNameBlur}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="slug"
                  label="Slug"
                  rules={[
                    { required: true, message: "Please enter product slug" },
                    {
                      pattern: /^[a-z0-9-]+$/,
                      message:
                        "Slug can only contain lowercase letters, numbers, and hyphens",
                    },
                  ]}
                  tooltip="URL-friendly version of the name. Auto-generated but you can customize it."
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
                    { required: true, message: "Please enter original price" },
                  ]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="Original Price"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value: string | undefined) => {
                      if (!value) return 0;
                      return parseInt(value.replace(/[^\d]/g, ""));
                    }}
                    min={0}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="discountPrice"
                  label="Discount Price"
                  tooltip="Optional discount amount to subtract from original price"
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="Discount Price"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value: string | undefined) => {
                      if (!value) return 0;
                      return parseInt(value.replace(/[^\d]/g, ""));
                    }}
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
                      const currentValues = form.getFieldsValue();
                      for (let i = index; i < categorySelections - 1; i++) {
                        currentValues[`parentCategory_${i}`] = currentValues[`parentCategory_${i+1}`];
                        currentValues[`middleCategory_${i}`] = currentValues[`middleCategory_${i+1}`];
                        currentValues[`category_${i}`] = currentValues[`category_${i+1}`];
                      }
                      
                      // Remove the last set of values
                      delete currentValues[`parentCategory_${categorySelections-1}`];
                      delete currentValues[`middleCategory_${categorySelections-1}`];
                      delete currentValues[`category_${categorySelections-1}`];
                      
                      form.setFieldsValue(currentValues);
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
                      name={`parentCategory_${index}`}
                      label="Parent Category"
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
                          form.setFieldsValue(formValues);
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
                          form.setFieldsValue(formValues);
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
                        mode="multiple"
                        placeholder={selectedMiddleCategories[index] ? "Select specific categories (e.g., Áo Tanktop)" : "Select a product type first"}
                        showSearch
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
              <Col span={12}>
                <Form.Item
                  name="materials"
                  label="Materials"
                  rules={[
                    {
                      required: true,
                      message: "Please select at least one material",
                    },
                  ]}
                >
                  <Select
                    mode="multiple"
                    placeholder="Select materials"
                    options={materials}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="tagIsNew" label="Tag as New Product">
                  <Select>
                    <Option value={true}>Yes</Option>
                    <Option value={false}>No</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left">Product Details</Divider>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="style"
                  label="Style"
                  rules={[
                    {
                      required: true,
                      message: "Please enter style description",
                    },
                  ]}
                >
                  <Input placeholder="Enter style description" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="responsible"
                  label="Responsible"
                  rules={[
                    {
                      required: true,
                      message: "Please enter responsible description",
                    },
                  ]}
                >
                  <Input placeholder="Enter responsible description" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="features"
              label="Features"
              rules={[
                {
                  required: true,
                  message: "Please enter key features of the product",
                },
              ]}
            >
              <Input placeholder="Enter key features of the product" />
            </Form.Item>

            <Form.Item
              name="material"
              label="Material Description"
              rules={[
                {
                  required: true,
                  message: "Please enter material description",
                },
              ]}
            >
              <Input placeholder="Enter material description" />
            </Form.Item>

            <Form.Item
              name="content"
              label="Product Description"
              rules={[
                { required: true, message: "Please enter product description" },
              ]}
            >
              <MarkdownEditor
                style={{ height: '400px' }}
                renderHTML={(text) => <ReactMarkdown>{text}</ReactMarkdown>}
                onChange={({ text }) => {
                  form.setFieldsValue({ content: text });
                }}
              />
            </Form.Item>

            <Form.Item
              name="headerImage"
              label="Header Image"
              valuePropName="fileList"
              getValueFromEvent={(e) => {
                if (Array.isArray(e)) return e;
                return e?.fileList || [];
              }}
            >
              <Upload
                listType="picture-card"
                maxCount={1}
                beforeUpload={() => false} // Prevent auto upload
                onPreview={handlePreview}
                showUploadList={{
                  showPreviewIcon: true,
                  showRemoveIcon: true,
                  showDownloadIcon: false,
                }}
                onChange={(info) => {
                  // Force re-render when file is removed
                  if (info.fileList.length === 0) {
                    form.setFieldsValue({ headerImage: [] });
                  }
                }}
              >
                {!form.getFieldValue("headerImage") ||
                form.getFieldValue("headerImage").length === 0 ? (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                ) : null}
              </Upload>
            </Form.Item>

            <Divider orientation="left">Variants (Colors & Sizes)</Divider>

            <Form.List name="variants">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <Card
                      key={field.key}
                      title={`Variant ${index + 1}`}
                      style={{ marginBottom: 16 }}
                      extra={
                        index > 0 ? (
                          <Button
                            danger
                            onClick={() => remove(field.name)}
                            icon={<MinusCircleOutlined />}
                          >
                            Remove Variant
                          </Button>
                        ) : null
                      }
                    >
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item
                            key={field.key}
                            name={[field.name, "name"]}
                            label="Color Name"
                            rules={[
                              {
                                required: true,
                                message: "Please enter color name",
                              },
                            ]}
                          >
                            <Input placeholder="E.g., Blue, Red, Black" />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Form.Item
                        key={`${field.key}-thumbnail`}
                        label="Color Thumbnail"
                        name={[field.name, "colorThumbnail"]}
                        valuePropName="fileList"
                        getValueFromEvent={(e) => {
                          if (Array.isArray(e)) return e;
                          return e?.fileList || [];
                        }}
                      >
                        <Upload
                          listType="picture-card"
                          maxCount={1}
                          beforeUpload={() => false} // Prevent auto upload
                          onPreview={handlePreview}
                          showUploadList={{
                            showPreviewIcon: true,
                            showRemoveIcon: true,
                            showDownloadIcon: false,
                          }}
                          onChange={(info) => {
                            // Force re-render when file is removed
                            const colorThumbnail = form.getFieldValue([
                              "variants",
                              field.name,
                              "colorThumbnail",
                            ]);
                            if (info.fileList.length === 0 && colorThumbnail) {
                              const variants = [
                                ...form.getFieldValue("variants"),
                              ];
                              variants[field.name].colorThumbnail = [];
                              form.setFieldsValue({ variants });
                            }
                          }}
                        >
                          {!form.getFieldValue([
                            "variants",
                            field.name,
                            "colorThumbnail",
                          ]) ||
                          form.getFieldValue([
                            "variants",
                            field.name,
                            "colorThumbnail",
                          ]).length === 0 ? (
                            <div>
                              <PlusOutlined />
                              <div style={{ marginTop: 8 }}>Upload</div>
                            </div>
                          ) : null}
                        </Upload>
                      </Form.Item>

                      <Form.Item
                        key={`${field.key}-images`}
                        label="Variant Images"
                        name={[field.name, "images"]}
                        valuePropName="fileList"
                        getValueFromEvent={(e) => {
                          if (Array.isArray(e)) return e;
                          return e?.fileList || [];
                        }}
                        extra="Upload multiple images for this variant. You can delete or preview by hovering over each image."
                      >
                        <Upload
                          listType="picture-card"
                          beforeUpload={() => false} // Prevent auto upload
                          onPreview={handlePreview}
                          multiple
                        >
                          <div>
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Upload</div>
                          </div>
                        </Upload>
                      </Form.Item>

                      <Form.List name={[field.name, "sizes"]}>
                        {(sizeFields, { add: addSize, remove: removeSize }) => (
                          <>
                            <Divider orientation="left">
                              Sizes and Stock
                            </Divider>

                            {sizeFields.map((sizeField, sizeIndex) => (
                              <Space
                                key={sizeField.key}
                                align="baseline"
                                style={{ display: "flex", marginBottom: 8 }}
                              >
                                <Form.Item
                                  key={sizeField.key}
                                  label="Size"
                                  name={[sizeField.name, "size"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Please select size",
                                    },
                                  ]}
                                >
                                  <Select
                                    style={{ width: 120 }}
                                    placeholder="Select size"
                                  >
                                    {availableSizes.map((size, sizeIdx) => (
                                      <Option
                                        key={`${size}-${sizeIdx}`}
                                        value={size}
                                      >
                                        {size}
                                      </Option>
                                    ))}
                                  </Select>
                                </Form.Item>

                                <Form.Item
                                  key={`${sizeField.key}-stock`}
                                  label="Stock"
                                  name={[sizeField.name, "stock"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Please enter stock",
                                    },
                                  ]}
                                >
                                  <InputNumber min={0} placeholder="Stock" />
                                </Form.Item>

                                {sizeIndex > 0 && (
                                  <Button
                                    danger
                                    type="link"
                                    onClick={() => removeSize(sizeField.name)}
                                    icon={<MinusCircleOutlined />}
                                  />
                                )}
                              </Space>
                            ))}

                            <Form.Item>
                              <Button
                                type="dashed"
                                onClick={() => addSize()}
                                icon={<PlusOutlined />}
                              >
                                Add Size
                              </Button>
                            </Form.Item>
                          </>
                        )}
                      </Form.List>
                    </Card>
                  ))}

                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                      style={{ width: "100%" }}
                    >
                      Add Variant (Color)
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>

            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitLoading}
                  size="large"
                >
                  Create Product
                </Button>
                <Button
                  onClick={() => router.push("/admin/products")}
                  size="large"
                >
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Spin>
      </Card>

      <Modal
        open={previewVisible}
        title="Image Preview"
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default AddProductPage;
