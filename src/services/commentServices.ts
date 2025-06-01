import httpRequest from "@/utils/httpRequest";

interface CommentResponse {
  status: string;
  message: string;
  data: {
    comments: CommentData[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

interface CommentStatsResponse {
  status: string;
  message: string;
  data: {
    totalComments: number;
    averageRating: number;
    ratingCounts: {
      1: number;
      2: number;
      3: number;
      4: number;
      5: number;
    };
  };
}

export interface CommentData {
  _id: string;
  user_id: string;
  user_name: string;
  content: string;
  rating: number;
  status: string;
  verified_purchase: boolean;
  createdAt: string;
  updatedAt: string;
  replyContentAdmin?: Array<{
    content: string;
    createdAt: string;
    adminId?: string;
  }>;
}

interface AddCommentData {
  content: string;
  rating: number;
}

// Get all comments for a product
export const getProductComments = async (productId: string, page = 1, limit = 10) => {
  try {
    const res = await httpRequest.get<CommentResponse>(`/api/v1/comments/product/${productId}?page=${page}&limit=${limit}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching product comments:", error);
    throw error;
  }
};

// Get comment statistics for a product
export const getCommentStats = async (productId: string) => {
  try {
    const res = await httpRequest.get<CommentStatsResponse>(`/api/v1/comments/product/${productId}/stats`);
    return res.data;
  } catch (error) {
    console.error("Error fetching comment statistics:", error);
    throw error;
  }
};

// Add a comment to a product
export const addComment = async (productId: string, commentData: AddCommentData) => {
  try {
    const res = await httpRequest.post<any>(`/api/v1/comments/product/${productId}`, commentData);
    return res.data;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};

// Delete a comment
export const deleteComment = async (productId: string, commentId: string) => {
  try {
    const res = await httpRequest.delete<any>(`/comments/product/${productId}/comment/${commentId}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
}; 