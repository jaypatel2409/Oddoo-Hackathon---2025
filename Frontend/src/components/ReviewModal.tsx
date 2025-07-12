import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import apiService from "../services/api";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviewedUser: {
    _id: string;
    name: string;
    profilePhoto?: { url?: string };
  };
  onReviewSubmitted?: () => void;
}

export default function ReviewModal({ 
  isOpen, 
  onClose, 
  reviewedUser, 
  onReviewSubmitted 
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [skillContext, setSkillContext] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting",
        variant: "destructive",
      });
      return;
    }

    if (!comment.trim()) {
      toast({
        title: "Comment Required",
        description: "Please provide a comment for your review",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      await apiService.createReview({
        reviewedUserId: reviewedUser._id,
        rating,
        comment: comment.trim(),
        skillContext: skillContext.trim() || null
      });

      toast({
        title: "Review Submitted",
        description: "Your review has been submitted successfully!",
      });

      // Reset form
      setRating(0);
      setComment("");
      setSkillContext("");
      
      onClose();
      onReviewSubmitted?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit review",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setRating(0);
      setComment("");
      setSkillContext("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Review {reviewedUser.name}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating */}
          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 transition-colors"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= (hoveredRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              {rating === 1 && "Poor"}
              {rating === 2 && "Fair"}
              {rating === 3 && "Good"}
              {rating === 4 && "Very Good"}
              {rating === 5 && "Excellent"}
              {rating === 0 && "Select a rating"}
            </p>
          </div>

          {/* Skill Context */}
          <div className="space-y-2">
            <Label htmlFor="skillContext">Skill Context (Optional)</Label>
            <Input
              id="skillContext"
              placeholder="e.g., JavaScript tutoring, Guitar lessons"
              value={skillContext}
              onChange={(e) => setSkillContext(e.target.value)}
              maxLength={100}
            />
            <p className="text-xs text-muted-foreground">
              What skill did you exchange with this person?
            </p>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">Review Comment</Label>
            <Textarea
              id="comment"
              placeholder="Share your experience with this person..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              maxLength={500}
              required
            />
            <p className="text-xs text-muted-foreground">
              {comment.length}/500 characters
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || rating === 0 || !comment.trim()}
              className="flex-1"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 