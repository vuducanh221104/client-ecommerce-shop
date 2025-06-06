"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Space,
  Button,
  Table,
  message,
  Popconfirm,
  Input,
  Row,
  Col,
  Modal,
  Form,
  Select,
  Spin,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { getAllMaterials, deleteMaterial } from "@/services/adminServices";
import EditMaterialModal from "./EditMaterialModal";
import RefreshButton from "@/components/admin/RefreshButton";

const { Title } = Typography;
const { Option } = Select;

interface Material {
  _id: string;
  id?: string;
  name: string;
  slug: string;
}

interface MaterialsResponse {
  status: string;
  message: string;
  data: {
    materials: Material[];
  };
}

const MaterialsPage = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(
    null
  );
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getAllMaterials();

      if (response?.data?.materials) {
        setMaterials(response.data.materials);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching materials:", error);
      message.error("Failed to load materials");
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshLoading(true);
      await fetchData();
      message.success("Dữ liệu đã được làm mới");
    } catch (error) {
      console.error("Error refreshing data:", error);
      message.error("Không thể làm mới dữ liệu");
    } finally {
      setRefreshLoading(false);
    }
  };

  const handleAddMaterial = () => {
    setSelectedMaterial(null);
    setEditModalVisible(true);
  };

  const handleEditMaterial = (material: Material) => {
    // Ensure material has a valid ID
    if (!material._id) {
      console.error("Material is missing _id:", material);
      message.error("Cannot edit material: ID is missing");
      return;
    }
    // Clone the material to avoid reference issues
    setSelectedMaterial({ ...material });
    setEditModalVisible(true);
  };

  const handleDeleteMaterial = async (materialId: string) => {
    try {
      setDeleteLoading(materialId);
      await deleteMaterial(materialId);
      message.success("Material deleted successfully");
      fetchData();
    } catch (error) {
      console.error("Error deleting material:", error);
      message.error("Failed to delete material");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    // Implement search functionality
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: Material, b: Material) => a.name.localeCompare(b.name),
      width: "40%",
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
      width: "40%",
    },
    {
      title: "Actions",
      key: "actions",
      width: "20%",
      render: (_: any, record: Material) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditMaterial(record)}
            style={{ color: "#1890ff" }}
          />
          <Popconfirm
            title="Are you sure you want to delete this material?"
            onConfirm={() => handleDeleteMaterial(record._id)}
            okText="Yes"
            cancelText="No"
            disabled={deleteLoading === record._id}
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              danger
              loading={deleteLoading === record._id}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-materials-page">
      <Card>
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Col>
            <Title level={2}>Quản lý chất liệu</Title>
          </Col>
          <Col>
            <Space>
              <RefreshButton 
                onClick={handleRefresh} 
                isLoading={refreshLoading} 
              />
              <Input
                placeholder="Tìm kiếm chất liệu..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
                style={{ width: 250 }}
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setEditModalVisible(true)}
              >
                Thêm chất liệu
              </Button>
            </Space>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={materials}
          rowKey="id"
          loading={loading}
          pagination={{
            total: materials.length,
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} chất liệu`,
          }}
        />
      </Card>

      <EditMaterialModal
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onSuccess={fetchData}
        material={selectedMaterial}
      />
    </div>
  );
};

export default MaterialsPage;
