"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Space,
  Button,
  Row,
  Col,
  Tag,
  message,
  Popconfirm,
  Spin,
  Empty,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import { getAllCategories, deleteCategory } from "@/services/adminServices";
import EditCategoryModal from "./EditCategoryModal";
import { motion } from "framer-motion";

const { Title, Text } = Typography;

interface SubCategory {
  _id: string;
  name: string;
  slug: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  subcategories: SubCategory[];
}

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getAllCategories();
      setCategories(response?.data?.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      message.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setEditModalVisible(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setEditModalVisible(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      setDeleteLoading(categoryId);
      await deleteCategory(categoryId);
      message.success("Category deleted successfully");
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      message.error("Failed to delete category");
    } finally {
      setDeleteLoading(null);
    }
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchText.toLowerCase()) ||
      category.subcategories.some((sub) =>
        sub.name.toLowerCase().includes(searchText.toLowerCase())
      )
  );

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="admin-categories-page">
      <Card
        className="categories-card"
        style={{
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
        }}
      >
        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: 24 }}
          gutter={[16, 16]}
        >
          <Col>
            <Title level={2} style={{ margin: 0 }}>
              <TagsOutlined style={{ marginRight: 8 }} />
              Categories Management
            </Title>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddCategory}
              size="large"
              style={{
                borderRadius: "6px",
                boxShadow: "0 2px 4px rgba(24, 144, 255, 0.2)",
              }}
            >
              Add Category
            </Button>
          </Col>
        </Row>

        <Spin spinning={loading}>
          {filteredCategories.length > 0 ? (
            <motion.div variants={container} initial="hidden" animate="show">
              <Row gutter={[24, 24]}>
                {filteredCategories.map((category) => (
                  <Col xs={24} sm={24} md={12} lg={8} key={category._id}>
                    <motion.div variants={item}>
                      <Card
                        className="category-item"
                        hoverable
                        style={{
                          height: "100%",
                          borderRadius: "8px",
                          transition: "all 0.3s ease",
                        }}
                      >
                        <div style={{ marginBottom: 16 }}>
                          <Row justify="space-between" align="middle">
                            <Col>
                              <Text
                                strong
                                style={{
                                  fontSize: 18,
                                  marginBottom: 8,
                                  display: "block",
                                }}
                              >
                                {category.name}
                              </Text>
                              <Text type="secondary" style={{ fontSize: 14 }}>
                                {category.slug}
                              </Text>
                            </Col>
                            <Col>
                              <Space>
                                <Button
                                  type="text"
                                  icon={<EditOutlined />}
                                  onClick={() => handleEditCategory(category)}
                                  className="edit-button"
                                  style={{
                                    color: "#1890ff",
                                    background: "#e6f7ff",
                                    borderRadius: "6px",
                                  }}
                                />
                                <Popconfirm
                                  title="Are you sure you want to delete this category?"
                                  description="This action cannot be undone."
                                  onConfirm={() =>
                                    handleDeleteCategory(category._id)
                                  }
                                  okText="Yes"
                                  cancelText="No"
                                  disabled={deleteLoading === category._id}
                                >
                                  <Button
                                    type="text"
                                    icon={<DeleteOutlined />}
                                    danger
                                    loading={deleteLoading === category._id}
                                    className="delete-button"
                                    style={{
                                      background: "#fff1f0",
                                      borderRadius: "6px",
                                    }}
                                  />
                                </Popconfirm>
                              </Space>
                            </Col>
                          </Row>
                        </div>

                        <div>
                          <Text
                            strong
                            style={{
                              fontSize: 14,
                              marginBottom: 12,
                              display: "block",
                              color: "#8c8c8c",
                            }}
                          >
                            Sub-categories:
                          </Text>
                          <div style={{ marginTop: 12 }}>
                            <Space size={[8, 16]} wrap>
                              {category.subcategories?.map((sub) => (
                                <Tag
                                  key={sub._id}
                                  className="category-tag"
                                  style={{
                                    padding: "6px 12px",
                                    borderRadius: "16px",
                                    fontSize: "14px",
                                    background: "#f0f5ff",
                                    border: "1px solid #d6e4ff",
                                    color: "#1890ff",
                                    margin: "4px",
                                    transition: "all 0.3s ease",
                                    cursor: "default",
                                  }}
                                >
                                  {sub.name}
                                </Tag>
                              ))}
                            </Space>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  </Col>
                ))}
              </Row>
            </motion.div>
          ) : (
            <Empty
              description="No categories found"
              style={{ margin: "40px 0" }}
            />
          )}
        </Spin>
      </Card>

      <EditCategoryModal
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onSuccess={fetchCategories}
        category={selectedCategory}
      />

      <style jsx global>{`
        .categories-card .ant-card-body {
          padding: 24px;
        }

        .category-item {
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
        }

        .category-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .category-tag {
          margin: 4px;
        }

        .category-tag:hover {
          transform: translateY(-2px);
          box-shadow: 0 2px 6px rgba(24, 144, 255, 0.2);
        }

        .edit-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 2px 6px rgba(24, 144, 255, 0.2);
          background: #bae7ff !important;
        }

        .delete-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 2px 6px rgba(255, 77, 79, 0.2);
          background: #ffd6d6 !important;
        }

        .ant-btn {
          transition: all 0.3s ease;
        }

        .ant-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }

        .ant-card-head {
          border-bottom: none;
        }

        .ant-empty {
          color: #8c8c8c;
        }
      `}</style>
    </div>
  );
};

export default CategoriesPage;
