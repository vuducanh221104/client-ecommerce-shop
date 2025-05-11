"use client";
import React, { useState } from "react";
import {
  Upload,
  message,
  Button,
  Card,
  Typography,
  Row,
  Col,
  Divider,
  Image,
  Space,
} from "antd";
import { InboxOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { uploadCloud } from "@/services/uploadService";

const { Dragger } = Upload;
const { Title, Text } = Typography;

const UploadPage = () => {
  const [fileList, setFileList] = useState<any[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCustomRequest = async ({ file, onSuccess, onError }: any) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("img", file);

      const response = await uploadCloud(formData);

      if (response && response.length > 0) {
        const uploadedFile = response[0];
        const fileUrl = uploadedFile.path;

        setUploadedUrls((prev) => [...prev, fileUrl]);
        onSuccess({ url: fileUrl, name: file.name });
        message.success(`${file.name} uploaded successfully`);
      } else {
        onError("Upload failed");
        message.error(`${file.name} upload failed`);
      }
    } catch (error) {
      onError("Upload failed");
      message.error(`${file.name} upload failed: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (file: any) => {
    setPreviewImage(file.url || file.response?.url || "");
    setPreviewVisible(true);
  };

  const handleRemove = (file: any) => {
    const url = file.url || file.response?.url;
    if (url) {
      setUploadedUrls((prev) => prev.filter((item) => item !== url));
    }
    return true;
  };

  const props = {
    name: "img",
    multiple: true,
    fileList,
    customRequest: handleCustomRequest,
    onChange(info: any) {
      setFileList(info.fileList);
    },
    onRemove: handleRemove,
    onPreview: handlePreview,
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        message.success("URL copied to clipboard");
      })
      .catch(() => {
        message.error("Failed to copy URL");
      });
  };

  return (
    <Card title={<Title level={2}>Image Upload</Title>}>
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag files to this area to upload
        </p>
        <p className="ant-upload-hint">
          Support for single or bulk upload. Images will be uploaded to
          Cloudinary.
        </p>
      </Dragger>

      {uploadedUrls.length > 0 && (
        <>
          <Divider orientation="left">Uploaded Images</Divider>
          <Row gutter={[16, 16]}>
            {uploadedUrls.map((url, index) => (
              <Col key={index} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={`image-${index}`}
                      src={url}
                      style={{ height: 160, objectFit: "cover" }}
                    />
                  }
                  actions={[
                    <EyeOutlined
                      key="view"
                      onClick={() => {
                        setPreviewImage(url);
                        setPreviewVisible(true);
                      }}
                    />,
                    <DeleteOutlined
                      key="delete"
                      onClick={() => {
                        setUploadedUrls((prev) =>
                          prev.filter((item) => item !== url)
                        );
                        setFileList((prev) =>
                          prev.filter(
                            (file) => (file.url || file.response?.url) !== url
                          )
                        );
                      }}
                    />,
                  ]}
                >
                  <Card.Meta
                    title={`Image ${index + 1}`}
                    description={
                      <Button type="link" onClick={() => copyToClipboard(url)}>
                        Copy URL
                      </Button>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}

      <Image
        style={{ display: "none" }}
        preview={{
          visible: previewVisible,
          onVisibleChange: (visible) => setPreviewVisible(visible),
          src: previewImage,
        }}
      />
    </Card>
  );
};

export default UploadPage;
