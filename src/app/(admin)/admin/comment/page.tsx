"use client";
import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Input, Form, Rate, Select, Popconfirm, Tag, Avatar, Pagination, Spin, Badge, Tooltip, Typography, Divider, List, Space } from "antd";
import { EditOutlined, DeleteOutlined, CommentOutlined, SearchOutlined, FilterOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { toast } from "react-hot-toast";
import styles from "./CommentAdmin.module.scss";
import { useRouter } from "next/navigation";
import Image from "next/image";
import * as adminServices from "@/services/adminServices";
import RefreshButton from "@/components/admin/RefreshButton";

const { TextArea } = Input;
const { Option } = Select;

// Using the Comment interface from adminServices
import { Comment } from "@/services/adminServices";

interface PaginationState {
  current: number;
  pageSize: number;
  total: number;
}

interface TableParams {
  pagination?: PaginationState;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, any>;
}

function CommentAdmin() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [replyModalVisible, setReplyModalVisible] = useState(false);
    const [currentComment, setCurrentComment] = useState<Comment | null>(null);
    const [form] = Form.useForm();
    const [replyForm] = Form.useForm();
    const [pagination, setPagination] = useState<PaginationState>({
        current: 1,
        pageSize: 10,
        total: 0
    });
    const [searchText, setSearchText] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortField, setSortField] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('descend');
    const [refreshLoading, setRefreshLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchComments();
    }, [pagination.current, pagination.pageSize, filterStatus, sortField, sortOrder]);

    const fetchComments = async () => {
        setLoading(true);
        try {
            const response = await adminServices.getAllComments({
                page: pagination.current,
                limit: pagination.pageSize,
                status: filterStatus !== 'all' ? filterStatus : undefined,
                sortField,
                sortOrder: sortOrder === 'ascend' ? 1 : -1,
                search: searchText || undefined
            });
            
            setComments(response.comments);
            setPagination({
                ...pagination,
                total: response.pagination.total
            });
        } catch (error) {
            console.error("Failed to fetch comments:", error);
            toast.error("Không thể tải danh sách bình luận");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setPagination({
            ...pagination,
            current: 1
        });
        fetchComments();
    };

    const handleTableChange = (
        newPagination: PaginationState, 
        filters: Record<string, any>, 
        sorter: { field?: string; order?: string }
    ) => {
        setPagination(newPagination);
        
        if (sorter.field) {
            setSortField(sorter.field);
            setSortOrder(sorter.order || 'descend');
        }
    };

    const showEditModal = (record: Comment) => {
        setCurrentComment(record);
        form.setFieldsValue({
            content: record.content,
            rating: record.rating,
            status: record.status ? record.status.toUpperCase() : 'PENDING'
        });
        setModalVisible(true);
    };

    const showReplyModal = (record: Comment) => {
        setCurrentComment(record);
        replyForm.resetFields();
        setReplyModalVisible(true);
    };

    const handleEdit = async (values: { content: string; rating: number; status: string }) => {
        if (!currentComment) return;
        
        try {
            await adminServices.updateComment(currentComment._id, values);
            toast.success("Cập nhật bình luận thành công");
            setModalVisible(false);
            fetchComments();
        } catch (error) {
            console.error("Failed to update comment:", error);
            toast.error("Không thể cập nhật bình luận");
        }
    };

    const handleReply = async (values: { replyContent: string }) => {
        if (!currentComment) return;
        
        try {
            const response = await adminServices.replyToComment(currentComment._id, {
                content: values.replyContent
            });
            
            // Update the current comment in the modal with the new reply
            if (currentComment) {
                const updatedComment = { ...currentComment };
                
                // Initialize replyContentAdmin array if it doesn't exist
                if (!updatedComment.replyContentAdmin) {
                    updatedComment.replyContentAdmin = [];
                }
                
                // Add the new reply to the array
                if (response && response.reply) {
                    updatedComment.replyContentAdmin.push(response.reply);
                    setCurrentComment(updatedComment);
                }
            }
            
            toast.success("Phản hồi bình luận thành công");
            replyForm.resetFields();
            
            // Refresh the comments list
            fetchComments();
        } catch (error) {
            console.error("Failed to reply to comment:", error);
            toast.error("Không thể phản hồi bình luận");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await adminServices.deleteComment(id);
            toast.success("Xóa bình luận thành công");
            fetchComments();
        } catch (error) {
            console.error("Failed to delete comment:", error);
            toast.error("Không thể xóa bình luận");
        }
    };

    const handleDeleteReply = async (commentId: string, replyIndex: number) => {
        try {
            await adminServices.deleteCommentReply(commentId, replyIndex.toString());
            toast.success("Xóa phản hồi thành công");
            
            // Update the current comment in the modal to reflect the deleted reply
            if (currentComment && currentComment._id === commentId) {
                // Create a new copy of the current comment
                const updatedComment = { ...currentComment };
                
                // Remove the deleted reply from the array
                if (updatedComment.replyContentAdmin && Array.isArray(updatedComment.replyContentAdmin)) {
                    updatedComment.replyContentAdmin = updatedComment.replyContentAdmin.filter((_, idx) => idx !== replyIndex);
                    setCurrentComment(updatedComment);
                }
            }
            
            // Refresh the comments list
            fetchComments();
        } catch (error) {
            console.error("Failed to delete reply:", error);
            toast.error("Không thể xóa phản hồi");
        }
    };

    const viewProduct = (productId?: string) => {
        if (productId) {
            router.push(`/admin/products/${productId}`);
        }
    };

    const viewUser = (userId?: string) => {
        if (userId) {
            router.push(`/admin/users/${userId}`);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approved':
                return 'green';
            case 'pending':
                return 'gold';
            case 'rejected':
                return 'red';
            default:
                return 'default';
        }
    };

    const columns = [
        {
            title: 'Người dùng',
            dataIndex: 'user',
            key: 'user',
            render: (user: Comment['user']) => (
                <div className={styles.userInfo}>
                    <Avatar 
                        src={"/golbal/no-avt.png"} 
                        size={40} 
                        className={styles.userAvatar}
                    />
                    <div className={styles.userDetails}>
                        <div className={styles.userName} onClick={() => viewUser(user?._id)}>
                            {user?.fullName || "Người dùng ẩn danh"}
                        </div>
                        <div className={styles.userEmail}>{user?.email || "N/A"}</div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Sản phẩm',
            dataIndex: 'product',
            key: 'product',
            render: (product: Comment['product']) => (
                <div className={styles.productInfo} onClick={() => viewProduct(product?._id)}>
                    {product && product.image && Array.isArray(product.image) && product.image[0] && (
                        <Image 
                            src={product.image[0]} 
                            alt={product?.name || "Sản phẩm"} 
                            width={50} 
                            height={50}
                            className={styles.productImage}
                        />
                    )}
                    <span className={styles.productName}>{product?.name || "Sản phẩm không xác định"}</span>
                </div>
            ),
        },
        {
            title: 'Đánh giá',
            dataIndex: 'rating',
            key: 'rating',
            render: (rating: number) => <Rate disabled defaultValue={rating} />,
            sorter: true,
        },
        {
            title: 'Nội dung',
            dataIndex: 'content',
            key: 'content',
            render: (content: string, record: Comment) => (
                <div className={styles.commentContent}>
                    <div className={styles.mainContent}>{content}</div>
                    {record.replyContentAdmin && record.replyContentAdmin.length > 0 && (
                        <div className={styles.replies}>
                            {record.replyContentAdmin.map((reply, index) => (
                                <div key={index} className={styles.replyItem}>
                                    <div className={styles.replyHeader}>
                                        <strong>Admin</strong>
                                        <span className={styles.replyDate}>
                                            {new Date(reply.createdAt).toLocaleString('vi-VN')}
                                        </span>
                                    </div>
                                    <div className={styles.replyContent}>{reply.content}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                // Convert status to lowercase for consistent comparison
                const statusLower = status ? status.toLowerCase() : 'pending';
                
                return (
                    <Tag color={getStatusColor(statusLower)}>
                        {statusLower === 'approved' ? 'Đã duyệt' : statusLower === 'pending' ? 'Chờ duyệt' : 'Từ chối'}
                    </Tag>
                );
            },
            sorter: true,
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => new Date(date).toLocaleString('vi-VN'),
            sorter: true,
        },
        {
            title: 'Thao tác',
            key: 'actions',
            render: (_: any, record: Comment) => (
                <div className={styles.actionButtons}>
                    <Tooltip title="Phản hồi">
                        <Button 
                            icon={<CommentOutlined />} 
                            onClick={() => showReplyModal(record)} 
                            type="primary"
                            ghost
                        />
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                        <Button 
                            icon={<EditOutlined />} 
                            onClick={() => showEditModal(record)} 
                            className={styles.editButton}
                        />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Popconfirm
                            title="Bạn có chắc chắn muốn xóa bình luận này?"
                            onConfirm={() => handleDelete(record._id)}
                            okText="Xóa"
                            cancelText="Hủy"
                        >
                            <Button 
                                icon={<DeleteOutlined />} 
                                danger 
                                className={styles.deleteButton}
                            />
                        </Popconfirm>
                    </Tooltip>
                </div>
            ),
        },
    ] as any;

    const handleRefresh = async () => {
        try {
            setRefreshLoading(true);
            await fetchComments();
            toast.success("Dữ liệu đã được làm mới");
        } catch (error) {
            console.error("Error refreshing data:", error);
            toast.error("Không thể làm mới dữ liệu");
        } finally {
            setRefreshLoading(false);
        }
    };

    return (
            <div className={styles.commentAdminContainer}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Quản lý bình luận</h1>
                    <div className={styles.statsCards}>
                        <div className={styles.statsCard}>
                            <div className={styles.statsValue}>
                                {pagination.total}
                            </div>
                            <div className={styles.statsLabel}>Tổng số</div>
                        </div>
                        <div className={`${styles.statsCard} ${styles.pendingCard}`}>
                            <div className={styles.statsValue}>
                                {comments.filter(c => c.status === 'PENDING').length}
                            </div>
                            <div className={styles.statsLabel}>Chờ duyệt</div>
                        </div>
                    </div>
                </div>

                <div className={styles.searchAndFilter}>
                    <Input
                        placeholder="Tìm kiếm bình luận..."
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onPressEnter={handleSearch}
                        className={styles.searchInput}
                    />
                    <Space>
                        <RefreshButton 
                            onClick={handleRefresh} 
                            isLoading={refreshLoading} 
                        />
                        <Button 
                            type="primary" 
                            icon={<SearchOutlined />} 
                            onClick={handleSearch}
                            className={styles.searchButton}
                        >
                            Tìm kiếm
                        </Button>
                    </Space>
                    <Select
                        defaultValue="all"
                        className={styles.statusFilter}
                        onChange={(value: string) => {
                            setFilterStatus(value);
                            setPagination({...pagination, current: 1});
                        }}
                    >
                        <Option value="all">Tất cả trạng thái</Option>
                        <Option value="APPROVED">Đã duyệt</Option>
                        <Option value="PENDING">Chờ duyệt</Option>
                        <Option value="REJECTED">Từ chối</Option>
                    </Select>
                </div>
                
                <Spin spinning={loading}>
                    <Table
                        columns={columns}
                        dataSource={comments}
                        rowKey="_id"
                        pagination={false}
                        onChange={handleTableChange as any}
                        className={styles.commentsTable}
                    />
                    <div className={styles.paginationContainer}>
                        <Pagination
                            current={pagination.current}
                            pageSize={pagination.pageSize}
                            total={pagination.total}
                            onChange={(page, pageSize) => {
                                setPagination({...pagination, current: page, pageSize: pageSize || 10});
                            }}
                            showSizeChanger
                            showTotal={(total) => `Tổng ${total} bình luận`}
                        />
                    </div>
                </Spin>

                {/* Edit Comment Modal */}
                <Modal
                    title="Chỉnh sửa bình luận"
                    open={modalVisible}
                    onCancel={() => setModalVisible(false)}
                    footer={null}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleEdit}
                    >
                        <Form.Item
                            name="rating"
                            label="Đánh giá"
                            rules={[{ required: true, message: 'Vui lòng chọn đánh giá' }]}
                        >
                            <Rate />
                        </Form.Item>
                        <Form.Item
                            name="content"
                            label="Nội dung"
                            rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
                        >
                            <TextArea rows={4} />
                        </Form.Item>
                        <Form.Item
                            name="status"
                            label="Trạng thái"
                            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
                        >
                            <Select>
                                <Option value="APPROVED">Đã duyệt</Option>
                                <Option value="PENDING">Chờ duyệt</Option>
                                <Option value="REJECTED">Từ chối</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item className={styles.formActions}>
                            <Button onClick={() => setModalVisible(false)} style={{ marginRight: 8 }}>
                                Hủy
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Lưu thay đổi
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>

                {/* Reply Modal */}
                <Modal
                    title="Phản hồi bình luận"
                    open={replyModalVisible}
                    onCancel={() => setReplyModalVisible(false)}
                    footer={null}
                    width={600}
                >
                    {currentComment && (
                        <div className={styles.replyModalContent}>
                            <div className={styles.originalComment}>
                                <div className={styles.commentHeader}>
                                    <div className={styles.commentUser}>
                                        <Avatar 
                                            src={currentComment.user?.avatar || "/images/default-avatar.png"} 
                                            size={32} 
                                        />
                                        <span>{currentComment.user?.fullName || "Người dùng ẩn danh"}</span>
                                    </div>
                                    <Rate disabled value={currentComment.rating} />
                                </div>
                                <div className={styles.commentText}>
                                    {currentComment.content}
                                </div>
                            </div>
                            
                            {/* Existing Replies Section */}
                            {currentComment.replyContentAdmin && currentComment.replyContentAdmin.length > 0 && (
                                <>
                                    <Divider orientation="left">Phản hồi trước đây</Divider>
                                    <List
                                        itemLayout="horizontal"
                                        dataSource={currentComment.replyContentAdmin}
                                        renderItem={(reply, index) => (
                                            <List.Item 
                                                actions={[
                                                    <Popconfirm
                                                        title="Bạn có chắc chắn muốn xóa phản hồi này?"
                                                        onConfirm={() => handleDeleteReply(currentComment._id, index)}
                                                        okText="Xóa"
                                                        cancelText="Hủy"
                                                    >
                                                        <Button 
                                                            icon={<DeleteOutlined />} 
                                                            danger 
                                                            size="small"
                                                        />
                                                    </Popconfirm>
                                                ]}
                                            >
                                                <List.Item.Meta
                                                    avatar={<Avatar>A</Avatar>}
                                                    title={
                                                        <Space>
                                                            <span>Admin{reply.adminId ? ` (${reply.adminId})` : ''}</span>
                                                            <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                                                                {new Date(reply.createdAt).toLocaleString('vi-VN')}
                                                            </Typography.Text>
                                                        </Space>
                                                    }
                                                    description={reply.content}
                                                />
                                            </List.Item>
                                        )}
                                    />
                                    <Divider orientation="left">Thêm phản hồi mới</Divider>
                                </>
                            )}
                            
                            {/* New Reply Form */}
                            <Form
                                form={replyForm}
                                layout="vertical"
                                onFinish={handleReply}
                            >
                                <Form.Item
                                    name="replyContent"
                                    label="Nội dung phản hồi"
                                    rules={[{ required: true, message: 'Vui lòng nhập nội dung phản hồi' }]}
                                >
                                    <TextArea rows={4} placeholder="Nhập phản hồi của bạn..." />
                                </Form.Item>
                                <Form.Item className={styles.formActions}>
                                    <Button onClick={() => setReplyModalVisible(false)} style={{ marginRight: 8 }}>
                                        Hủy
                                    </Button>
                                    <Button type="primary" htmlType="submit">
                                        Gửi phản hồi
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    )}
                </Modal>
            </div>

    );
}   

export default CommentAdmin;