import React, { useState, useEffect, useRef } from 'react';
import { FaStar, FaUser, FaCheck, FaRegComment } from 'react-icons/fa';
import { FiSearch, FiFilter } from 'react-icons/fi';
import { BiMessageDetail } from 'react-icons/bi';
import { MdVerified } from 'react-icons/md';
import Image from 'next/image';
import styles from './ProductComments.module.scss';
import classNames from 'classnames/bind';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { CommentData, getCommentStats, getProductComments, addComment } from '@/services/commentServices';
import { checkUserCanReview } from '@/services/OrderServices';
import Link from 'next/link';

const cx = classNames.bind(styles);

interface ProductCommentsProps {
  productId: string;
}

// Define the CurrentUser interface
interface CurrentUser {
  id?: string;
  _id?: string;
  fullName?: string;
  username?: string;
  email?: string;
}

const ProductComments: React.FC<ProductCommentsProps> = ({ productId }) => {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [totalComments, setTotalComments] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCounts, setRatingCounts] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const isAuthenticated = useSelector((state: RootState) => 
    state.auth?.login?.currentUser !== null
  );
  const currentUser = useSelector<RootState, CurrentUser | null>((state) => 
    state.auth?.login?.currentUser || null
  );

  // Create a ref for the comment form
  const commentFormRef = useRef<HTMLDivElement>(null);

  // Check if the current user has already reviewed this product
  const hasAlreadyReviewed = () => {
    if (!currentUser || !comments.length) return false;
    
    const userId = currentUser.id || currentUser._id;
    return comments.some(comment => comment.user_id === userId);
  };

  // Find the user's existing review if it exists
  const getUserReview = () => {
    if (!currentUser || !comments.length) return null;
    
    const userId = currentUser.id || currentUser._id;
    return comments.find(comment => comment.user_id === userId) || null;
  };

  // Scroll to user's review if it exists
  const scrollToUserReview = () => {
    if (hasAlreadyReviewed()) {
      const userReviewElement = document.getElementById('user-review');
      if (userReviewElement) {
        userReviewElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  // Fetch comments and stats
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get comments
        const commentsResponse = await getProductComments(productId, currentPage, 10);
        setComments(commentsResponse.data.comments);
        setTotalPages(commentsResponse.data.pagination.totalPages);
        
        // Get stats
        const statsResponse = await getCommentStats(productId);
        setTotalComments(statsResponse.data.totalComments);
        setAverageRating(statsResponse.data.averageRating);
        setRatingCounts(statsResponse.data.ratingCounts);
        
        // Check if user can review only if they haven't already reviewed
        if (isAuthenticated && currentUser && !hasAlreadyReviewed()) {
          try {
            const canReviewResponse = await checkUserCanReview(productId);
            console.log("Can review response:", canReviewResponse);
            
            // Only set canReview to true if user hasn't already reviewed
            setCanReview(canReviewResponse && !hasAlreadyReviewed());
            
            // Show notification if user can review
            if (canReviewResponse && !hasAlreadyReviewed()) {
              toast.success('Bạn đã mua sản phẩm này và có thể đánh giá ngay bây giờ!', {
                duration: 5000,
                icon: '⭐'
              });
              
              // Force setting to true again to ensure UI updates
              setTimeout(() => {
                setCanReview(true);
              }, 100);
            }
          } catch (error) {
            console.error("Error checking if user can review:", error);
          }
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
        toast.error('Không thể tải đánh giá sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId, currentPage, isAuthenticated, currentUser]);

  // Debug logs for canReview state changes
  useEffect(() => {
    console.log("canReview state changed:", canReview);
  }, [canReview]);

  // Scroll to comment form when canReview becomes true
  useEffect(() => {
    if (canReview && commentFormRef.current) {
      // Add a slight delay to ensure the form is rendered
      setTimeout(() => {
        commentFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
    }
  }, [canReview]);

  // Handle star rating selection
  const handleRatingClick = (rating: number) => {
    setSelectedRating(rating);
  };

  // Handle star rating hover
  const handleRatingHover = (rating: number) => {
    setHoveredRating(rating);
  };

  // Handle comment submission
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Submit attempted. canReview:", canReview);
    console.log("Authentication status:", isAuthenticated);
    console.log("Already reviewed:", hasAlreadyReviewed());
    
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để đánh giá sản phẩm');
      return;
    }
    
    if (hasAlreadyReviewed()) {
      toast.error('Bạn đã đánh giá sản phẩm này rồi');
      return;
    }
    
    // Remove the canReview check to allow submission if the API says user can review
    // This fixes the issue where canReview is true from API but UI doesn't submit
    
    if (selectedRating === 0) {
      toast.error('Vui lòng chọn số sao đánh giá');
      return;
    }
    
    if (!commentText.trim()) {
      toast.error('Vui lòng nhập nội dung đánh giá');
      return;
    }

    setSubmitting(true);
    try {
      const response = await addComment(productId, {
        content: commentText,
        rating: selectedRating
      });
      
      // Manually construct the new comment object
      const newComment: CommentData = {
        _id: Date.now().toString(), // Temporary ID until page refresh
        user_id: currentUser?.id || currentUser?._id || '',
        user_name: currentUser?.fullName || currentUser?.username || 'Bạn',
        content: commentText,
        rating: selectedRating,
        status: 'APPROVED',
        verified_purchase: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Update comments array with the new comment
      setComments([newComment, ...comments]);
      
      // Update rating counts and average
      const newRatingCounts = { ...ratingCounts };
      newRatingCounts[selectedRating as keyof typeof ratingCounts]++;
      setRatingCounts(newRatingCounts);
      
      // Update total comments count
      const newTotalComments = totalComments + 1;
      setTotalComments(newTotalComments);
      
      // Calculate new average rating
      const totalRatingScore = Object.entries(newRatingCounts).reduce(
        (sum, [rating, count]) => sum + (Number(rating) * count), 0
      );
      const newAverageRating = totalRatingScore / newTotalComments;
      setAverageRating(newAverageRating);
      
      toast.success('Đánh giá của bạn đã được gửi thành công');
      
      // Reset form
      setSelectedRating(0);
      setCommentText('');
      
      // User has now reviewed the product
      setCanReview(false);
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast.error('Không thể gửi đánh giá. Vui lòng thử lại sau.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle filter by rating
  const handleFilterByRating = (rating: number | null) => {
    setFilterRating(rating === filterRating ? null : rating);
    setCurrentPage(1);
  };

  // Handle search change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Filter comments by rating, search term, and only show approved comments
  const filteredComments = comments.filter(comment => {
    const matchesRating = filterRating === null || comment.rating === filterRating;
    const matchesSearch = !searchTerm || 
      comment.content.toLowerCase().includes(searchTerm.toLowerCase()) || 
      comment.user_name.toLowerCase().includes(searchTerm.toLowerCase());
    const isApproved = comment.status === 'APPROVED';
    
    // For the current user, show their comment regardless of status
    const isOwnComment = isAuthenticated && 
      (comment.user_id === (currentUser?.id || currentUser?._id));
    
    return matchesRating && matchesSearch && (isApproved || isOwnComment);
  });

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // Calculate percentage for rating bar
  const calculatePercentage = (count: number) => {
    return totalComments > 0 ? Math.round((count / totalComments) * 100) : 0;
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className={"container"}>
      <div style={{marginTop: "50px"}} className={"comment-wrapper"}>
      <div className={cx('section-header')}>
        <h2 className={cx('section-title')}>ĐÁNH GIÁ SẢN PHẨM</h2>
       
      </div>
      </div>
      
      {/* Review Form */}
      <div 
        ref={commentFormRef}
        className={cx('comment-form-container', { 
          'highlight-form': canReview,
          'already-reviewed': hasAlreadyReviewed()
        })}
      >
        <div className={cx('form-header')}>
          <div className={cx('form-title-wrapper')}>
            <BiMessageDetail className={cx('form-icon')} />
            <h3 className={cx('form-title')}>
              Viết đánh giá của bạn
            </h3>
          </div>
          {canReview && <span className={cx('review-badge')}>Có thể đánh giá</span>}
          {hasAlreadyReviewed() && <span className={cx('reviewed-badge')}>Đã đánh giá</span>}
        </div>
        
        {/* Show different content based on user status */}
        {!isAuthenticated ? (
          <div className={cx('auth-required-message')}>
            <FaUser className={cx('message-icon')} />
            <p>Vui lòng đăng nhập và mua hàng để đánh giá sản phẩm </p>
            <Link href="/auth/login" className={cx('login-btn')}>
              Đăng nhập ngay
            </Link>
          </div>
        ) : hasAlreadyReviewed() ? (
          <div className={cx('already-reviewed-message-container')}>
            <FaCheck className={cx('message-icon')} />
            <p className={cx('already-reviewed-message')}>
              Bạn đã đánh giá sản phẩm này.
              <button 
                type="button" 
                className={cx('find-review-btn')}
                onClick={scrollToUserReview}
              >
                Xem đánh giá của bạn
              </button>
            </p>
          </div>
        ) : !canReview ? (
          <div className={cx('cannot-review-message')}>
            <FaRegComment className={cx('message-icon')} />
            <p>Bạn chỉ có thể đánh giá sản phẩm khi đã mua và nhận hàng thành công</p>
          </div>
        ) : (
          /* Only show the form when user can review */
          <form onSubmit={handleSubmitComment} className={cx('comment-form')}>
            <div className={cx('rating-selection')}>
              <span className={cx('rating-label')}>Xếp hạng của bạn:</span>
              <div className={cx('star-rating')}>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <FaStar
                    key={rating}
                    className={cx('star', {
                      filled: rating <= (hoveredRating || selectedRating)
                    })}
                    onClick={() => handleRatingClick(rating)}
                    onMouseEnter={() => handleRatingHover(rating)}
                    onMouseLeave={() => setHoveredRating(0)}
                  />
                ))}
              </div>
            </div>

            <div className={cx('comment-input-container')}>
              <textarea
                className={cx('comment-input')}
                placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={4}
              />
            </div>

            <div className={cx('comment-actions')}>
              <button 
                type="submit" 
                className={cx('submit-btn')}
                disabled={submitting}
              >
                {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
              </button>
              
              {canReview && (
                <p className={cx('can-review-message')}>
                  <span className={cx('checkmark-icon')}>✓</span> Bạn đã mua sản phẩm này và có thể đánh giá ngay bây giờ!
                </p>
              )}
            </div>
          </form>
        )}
      </div>
      
      {/* Stats and Filters */}
      <div className={cx('stats-and-filters')}>
        <div className={cx('stats-container')}>
          <div className={cx('rating-overview')}>
            <div className={cx('average-rating-card')}>
              <span className={cx('rating-number')}>{averageRating.toFixed(1)}</span>
              <div className={cx('rating-stars')}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar 
                    key={star} 
                    className={cx('star', { filled: star <= Math.round(averageRating) })} 
                  />
                ))}
              </div>
              <span className={cx('rating-count')}>Dựa trên {totalComments} đánh giá</span>
            </div>

        
          </div>
        </div>

        <div className={cx('filter-container')}>
          <div className={cx('search-box')}>
            <FiSearch className={cx('search-icon')} />
            <input
              type="text"
              placeholder="Tìm kiếm đánh giá"
              value={searchTerm}
              onChange={handleSearchChange}
              className={cx('search-input')}
            />
          </div>

          <div className={cx('filter-options')}>
            <span className={cx('filter-label')}>
              <FiFilter className={cx('filter-icon')} />
              Lọc theo:
            </span>
            {[5, 4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                className={cx('filter-btn', { active: filterRating === rating })}
                onClick={() => handleFilterByRating(rating)}
              >
                {rating} <FaStar className={cx('star')} />
              </button>
            ))}
            {filterRating && (
              <button 
                className={cx('clear-filter')}
                onClick={() => setFilterRating(null)}
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className={cx('comments-list-container')}>
        <h3 className={cx('comments-list-title')}>
          Tất cả đánh giá
          <span className={cx('comments-count')}>({filteredComments.length})</span>
        </h3>
        
        {loading ? (
          <div className={cx('loading')}>
            <div className={cx('loading-spinner')}></div>
            <span>Đang tải đánh giá...</span>
          </div>
        ) : filteredComments.length > 0 ? (
          <div className={cx('comments-list')}>
            {filteredComments.map((comment) => (
              <div 
                key={comment._id} 
                id={isAuthenticated && (comment.user_id === (currentUser?.id || currentUser?._id)) ? 'user-review' : undefined}
                className={cx('comment-item', {
                  'own-comment': isAuthenticated && 
                    (comment.user_id === (currentUser?.id || currentUser?._id))
                })}
              >
                <div className={cx('comment-header')}>
                  <div className={cx('user-info')}>
                    <div className={cx('user-avatar')}>
                      <Image 
                        src="/golbal/no-avt.png" 
                        alt={comment.user_name} 
                        width={70} 
                        height={70}
                        className={cx('avatar-img')}
                      />
                    </div>
                    <div className={cx('user-details')}>
                      <div className={cx('user-name')}>
                        {comment.user_id === (currentUser?.id || currentUser?._id) 
                          ? `${comment.user_name} (Bạn)`
                          : comment.user_name
                        }
                      </div>
                      <div className={cx('comment-date')}>{formatDate(comment.createdAt)}</div>
                    </div>
                  </div>
                  <div className={cx('comment-rating')}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={cx('star', { filled: star <= comment.rating })}
                      />
                    ))}
                  </div>
                </div>
                <div className={cx('comment-content')}>{comment.content}</div>
                
                {/* Admin Reply Section */}
                {comment.replyContentAdmin && comment.replyContentAdmin.length > 0 && (
                  <div className={cx('admin-replies')}>
                    {comment.replyContentAdmin.map((reply, index) => (
                      <div key={index} className={cx('admin-reply')}>
                        <div className={cx('admin-reply-header')}>
                          <div className={cx('admin-info')}>
                            <div className={cx('admin-avatar')}>
                              <Image 
                                src="https://ui-avatars.com/api/?name=Admin&background=2F5ACF&color=fff" 
                                alt="Admin" 
                                width={30} 
                                height={30}
                                className={cx('avatar-img')}
                              />
                            </div>
                            <div className={cx('admin-details')}>
                              <div className={cx('admin-name')}>
                                Quản trị viên
                              </div>
                              <div className={cx('reply-date')}>
                                {formatDate(reply.createdAt)}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className={cx('admin-reply-content')}>
                          {reply.content}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className={cx('comment-badges')}>
                  {comment.verified_purchase && (
                    <span className={cx('verified-badge')}>
                      <MdVerified className={cx('verified-icon')} />
                      Đã mua hàng tại ZenFit
                    </span>
                  )}
                  {comment.user_id === (currentUser?.id || currentUser?._id) && (
                    <span className={cx('own-review-badge')}>Đánh giá của bạn</span>
                  )}
                  {comment.status !== 'APPROVED' && comment.user_id === (currentUser?.id || currentUser?._id) && (
                    <span className={cx('pending-badge')}>Đang chờ duyệt</span>
                  )}
                </div>
              </div>
            ))}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className={cx('pagination')}>
                <button 
                  className={cx('pagination-btn', 'prev-btn')} 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  &lt;
                </button>
                
                <div className={cx('page-numbers')}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      className={cx('pagination-btn', 'page-btn', { active: page === currentPage })}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button 
                  className={cx('pagination-btn', 'next-btn')} 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  &gt;
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className={cx('no-comments')}>
            <div className={cx('no-comments-icon')}>
              <BiMessageDetail />
            </div>
            <p>
              {searchTerm || filterRating ? 
                'Không tìm thấy đánh giá phù hợp với bộ lọc của bạn.' : 
                'Chưa có đánh giá nào cho sản phẩm này.'}
            </p>
            {isAuthenticated && canReview && (
              <p className={cx('be-first')}>Hãy là người đầu tiên đánh giá sản phẩm này!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductComments; 