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

      // Map categories to array of _id values - as direct strings, not $oid objects
      const categoryIds = Array.isArray(values.category)
        ? values.category
        : [values.category];

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

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="category"
                  label="Categories"
                  rules={[
                    {
                      required: true,
                      message: "Please select at least one category",
                    },
                  ]}
                >
                  <Select
                    mode="multiple"
                    placeholder="Select categories"
                    options={categories}
                  />
                </Form.Item>
              </Col>

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
            </Row>

            <Form.Item name="tagIsNew" label="Tag as New Product">
              <Select>
                <Option value={true}>Yes</Option>
                <Option value={false}>No</Option>
              </Select>
            </Form.Item>

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
