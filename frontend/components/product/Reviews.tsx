import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';

interface Review {
  id: number;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface ReviewsProps {
  productId: number;
  initialReviews: Review[];
}

export default function Reviews({ productId, initialReviews = [] }: ReviewsProps) {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [userReview, setUserReview] = useState({
    rating: 0,
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Helper function to render stars
  const renderStars = (rating: number, interactive = false) => {
    return Array.from({ length: 5 }).map((_, i) => {
      if (interactive) {
        return (
          <button
            key={i}
            onClick={() => setUserReview({ ...userReview, rating: i + 1 })}
            className="focus:outline-none"
          >
            {i < userReview.rating ? (
              <StarIcon className="h-5 w-5 text-yellow-400" />
            ) : (
              <StarIconOutline className="h-5 w-5 text-yellow-400" />
            )}
          </button>
        );
      } else {
        return i < rating ? (
          <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
        ) : (
          <StarIconOutline key={i} className="h-5 w-5 text-yellow-400" />
        );
      }
    });
  };

  // Calculate average rating
  const averageRating = reviews.length 
    ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1) 
    : 'No ratings yet';

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (userReview.rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (userReview.comment.trim() === '') {
      setError('Please enter a review comment');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/api';
      const response = await fetch(`${baseApiUrl}/products/${productId}/reviews/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: userReview.rating,
          comment: userReview.comment
        }),
        credentials: 'include'
      });

      if (response.ok) {
        const newReview = await response.json();
        setReviews([...reviews, newReview]);
        setUserReview({ rating: 0, comment: '' });
        setSuccess('Your review has been submitted successfully!');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to submit review. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
      console.error('Error submitting review:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
      
      {/* Average Rating */}
      <div className="flex items-center mb-6">
        <div className="flex mr-2">
          {typeof averageRating === 'string' ? (
            <p>{averageRating}</p>
          ) : (
            <>
              {renderStars(Math.round(parseFloat(averageRating)))}
              <span className="ml-2 text-gray-600">({averageRating} out of 5)</span>
            </>
          )}
        </div>
        <span className="text-gray-500">
          Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
        </span>
      </div>

      {/* Review Form */}
      {isAuthenticated ? (
        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
          
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 text-green-700 p-3 rounded-md mb-4">
              {success}
            </div>
          )}
          
          <form onSubmit={handleSubmitReview}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Rating</label>
              <div className="flex">
                {renderStars(0, true)}
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="comment" className="block text-gray-700 mb-2">
                Review
              </label>
              <textarea
                id="comment"
                rows={4}
                className="w-full border border-gray-300 rounded-md p-2"
                value={userReview.comment}
                onChange={(e) => setUserReview({ ...userReview, comment: e.target.value })}
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-gray-50 p-6 rounded-lg mb-8 text-center">
          <p className="mb-4">Please sign in to leave a review.</p>
          <a href="/login" className="text-black underline">
            Sign in
          </a>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-6">
              <div className="flex justify-between mb-2">
                <div>
                  <span className="font-medium">{review.user_name}</span>
                  <div className="flex mt-1">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <span className="text-gray-500 text-sm">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-2 text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
        </div>
      )}
    </div>
  );
}
