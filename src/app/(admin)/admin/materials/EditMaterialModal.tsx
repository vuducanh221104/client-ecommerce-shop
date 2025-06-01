"use client";

import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Space, message } from "antd";
import { createMaterial, updateMaterial } from "@/services/adminServices";

interface Material {
  _id: string;
  name: string;
  slug: string;
}

interface EditMaterialModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  material: Material | null;
}

const EditMaterialModal: React.FC<EditMaterialModalProps> = ({
  visible,
  onCancel,
  onSuccess,
  material,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      if (material) {
        form.setFieldsValue({
          name: material.name,
          slug: material.slug,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, material, form]);

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      if (material) {
        if (!material._id) {
          console.error("Material ID is undefined:", material);
          message.error("Cannot update material: ID is missing");
          return;
        }

        await updateMaterial(material._id, values);
        message.success("Material updated successfully");
      } else {
        await createMaterial(values);
        message.success("Material created successfully");
      }
      onSuccess();
      onCancel();
    } catch (error) {
      console.error("Error saving material:", error);
      message.error("Failed to save material");
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
      title={material ? "Edit Material" : "Add Material"}
      open={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Material Name"
          name="name"
          rules={[{ required: true, message: "Please input material name!" }]}
        >
          <Input
            placeholder="Enter material name"
            onChange={(e) => {
              const slug = generateSlug(e.target.value);
              form.setFieldValue("slug", slug);
            }}
          />
        </Form.Item>

        <Form.Item
          label="Slug"
          name="slug"
          rules={[{ required: true, message: "Please input material slug!" }]}
        >
          <Input placeholder="Enter material slug" />
        </Form.Item>

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

export default EditMaterialModal;
