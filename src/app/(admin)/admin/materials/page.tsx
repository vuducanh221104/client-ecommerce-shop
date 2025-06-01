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
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { getAllMaterials, deleteMaterial } from "@/services/adminServices";
import EditMaterialModal from "./EditMaterialModal";

const { Title } = Typography;

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

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const response = (await getAllMaterials()) as MaterialsResponse;


      const materialsData = response.data?.materials || [];

      // Check that each material has a valid ID
      const validMaterials = materialsData.map((material) => {
        if (!material._id) {
          console.error("Material missing ID:", material);
          // Try to use id if _id is not available
          return { ...material, _id: material.id || material._id };
        }
        return material;
      });

      setMaterials(validMaterials);
    } catch (error) {
      console.error("Error fetching materials:", error);
      message.error("Failed to load materials");
    } finally {
      setLoading(false);
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
      fetchMaterials();
    } catch (error) {
      console.error("Error deleting material:", error);
      message.error("Failed to delete material");
    } finally {
      setDeleteLoading(null);
    }
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
        <div
          style={{
            marginBottom: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title level={2}>List Materials</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddMaterial}
          >
            Add Material
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={materials}
          rowKey="_id"
          loading={loading}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`,
          }}
        />
      </Card>

      <EditMaterialModal
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onSuccess={fetchMaterials}
        material={selectedMaterial}
      />
    </div>
  );
};

export default MaterialsPage;
