"use client";

import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Space, message, Typography } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  updateCategory,
  createCategory,
  deleteCategory,
} from "@/services/adminServices";

const { Text } = Typography;

interface SubCategory {
  _id?: string;
  name: string;
  slug: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  subcategories: SubCategory[];
}

interface EditCategoryModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  category: Category | null;
}

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
  visible,
  onCancel,
  onSuccess,
  category,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [originalValues, setOriginalValues] = useState<any>(null);

  useEffect(() => {
    if (visible) {
      if (category) {
        const formValues = {
          name: category.name,
          slug: category.slug,
          children:
            category.subcategories?.map((sub) => ({
              _id: sub._id,
              name: sub.name,
              slug: sub.slug,
              isNew: false,
            })) || [],
        };

        form.setFieldsValue(formValues);
        // Store original values for comparison
        setOriginalValues(JSON.parse(JSON.stringify(formValues)));
      } else {
        form.setFieldsValue({
          name: "",
          slug: "",
          children: [],
        });
        setOriginalValues(null);
      }
    }
  }, [visible, category, form]);

  // Check if object values have changed
  const hasObjectChanged = (original: any, current: any) => {
    if (!original || !current) return true;

    for (const key in current) {
      if (key === "_id" || key === "isNew") continue; // Skip special fields
      if (original[key] !== current[key]) {
        return true;
      }
    }
    return false;
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);

      // Handle creating a new category
      if (!category) {
        const newCategoryData = {
          name: values.name,
          slug: values.slug,
        };

        // Create the main category first
        const result = await createCategory(newCategoryData);
        const newCategoryId = result.data.category._id;

        // If there are subcategories, create them with the new category as parent
        if (values.children && values.children.length > 0) {
          const subcategoryPromises = values.children.map((child: any) =>
            createCategory({
              name: child.name,
              slug: child.slug,
              parent: newCategoryId,
            })
          );

          await Promise.all(subcategoryPromises);
        }

        message.success("Category created successfully");
        onSuccess();
        onCancel();
        return;
      }

      // Handle updating an existing category
      const updateOperations = [];

      // Check if main category has changed
      const mainCategoryChanged =
        values.name !== originalValues.name ||
        values.slug !== originalValues.slug;

      if (mainCategoryChanged) {
        // Update main category
        const mainCategoryData = {
          name: values.name,
          slug: values.slug,
        };
        updateOperations.push(updateCategory(category._id, mainCategoryData));
      }

      // Process children/subcategories
      if (values.children && originalValues.children) {
        // Find original subcategories for comparison
        const originalSubcategories = originalValues.children || [];

        // Map original subcategories by ID for easy lookup
        const originalSubcategoriesMap = originalSubcategories.reduce(
          (map: any, sub: any) => {
            if (sub._id) {
              map[sub._id] = sub;
            }
            return map;
          },
          {}
        );

        // Create a map of current subcategories by ID
        const currentSubcategoriesMap = values.children.reduce(
          (map: any, sub: any) => {
            if (sub._id) {
              map[sub._id] = sub;
            }
            return map;
          },
          {}
        );

        // Find removed subcategories (present in original but not in current)
        const removedSubcategoryIds = Object.keys(
          originalSubcategoriesMap
        ).filter((id) => !currentSubcategoriesMap[id]);

        // Add delete operations for removed subcategories
        for (const removedId of removedSubcategoryIds) {
          updateOperations.push(deleteCategory(removedId));
        }

        // Process existing and new subcategories
        for (const child of values.children) {
          if (child._id) {
            // Existing subcategory - check if it has changed
            const originalSubcategory = originalSubcategoriesMap[child._id];

            if (
              originalSubcategory &&
              hasObjectChanged(originalSubcategory, child)
            ) {

              // This subcategory has been modified, update it
              updateOperations.push(
                updateCategory(child._id, {
                  name: child.name,
                  slug: child.slug,
                  parent: category._id,
                })
              );
            }
          } else {
            // New subcategory - create it

            updateOperations.push(
              createCategory({
                name: child.name,
                slug: child.slug,
                parent: category._id,
              })
            );
          }
        }
      }

      // Execute all operations
      if (updateOperations.length > 0) {
        await Promise.all(updateOperations);
        message.success("Category updated successfully");
      } else {
        message.info("No changes detected");
      }

      onSuccess();
      onCancel();
    } catch (error) {
      console.error("Error updating category:", error);
      message.error("Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/đ/g, "d")
      .replace(/[áàảãạâấầẩẫậăắằẳẵặ]/g, "a")
      .replace(/[éèẻẽẹêếềểễệ]/g, "e")
      .replace(/[íìỉĩị]/g, "i")
      .replace(/[óòỏõọôốồổỗộơớờởỡợ]/g, "o")
      .replace(/[úùủũụưứừửữự]/g, "u")
      .replace(/[ýỳỷỹỵ]/g, "y")
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  };

  return (
    <Modal
      title={category ? "Edit Category" : "Add Category"}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ children: [] }}
      >
        <Form.Item
          label="Category Name"
          name="name"
          rules={[{ required: true, message: "Please input category name!" }]}
        >
          <Input
            placeholder="Enter category name"
            onChange={(e) => {
              const slug = generateSlug(e.target.value);
              form.setFieldValue("slug", slug);
            }}
          />
        </Form.Item>

        <Form.Item
          label="Slug"
          name="slug"
          rules={[{ required: true, message: "Please input category slug!" }]}
        >
          <Input placeholder="Enter category slug" />
        </Form.Item>

        <div style={{ marginBottom: 8 }}>
          <Text strong>Children/Subcategories:</Text>
          <Text type="secondary" style={{ marginLeft: 8 }}>
            (New subcategories will be created as separate categories with this
            category as parent)
          </Text>
        </div>

        <Form.List name="children">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <div
                  key={field.key}
                  style={{
                    display: "flex",
                    marginBottom: 8,
                    gap: 8,
                    alignItems: "baseline",
                  }}
                >
                  <Form.Item name={[field.name, "_id"]} hidden>
                    <Input type="hidden" />
                  </Form.Item>
                  <Form.Item
                    name={[field.name, "name"]}
                    rules={[
                      { required: true, message: "Missing subcategory name" },
                    ]}
                    style={{ flex: 1, marginBottom: 0 }}
                  >
                    <Input
                      placeholder="Subcategory name"
                      onChange={(e) => {
                        const slug = generateSlug(e.target.value);
                        form.setFieldValue(
                          ["children", field.name, "slug"],
                          slug
                        );
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    name={[field.name, "slug"]}
                    rules={[
                      { required: true, message: "Missing subcategory slug" },
                    ]}
                    style={{ flex: 1, marginBottom: 0 }}
                  >
                    <Input placeholder="Subcategory slug" />
                  </Form.Item>
                  <DeleteOutlined
                    onClick={() => remove(field.name)}
                    style={{ fontSize: 18, cursor: "pointer" }}
                  />
                </div>
              ))}

              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add({ _id: null, isNew: true })}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Subcategory
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item>
          <Space style={{ width: "100%", justifyContent: "flex-end" }}>
            <Button onClick={onCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Save
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditCategoryModal;
