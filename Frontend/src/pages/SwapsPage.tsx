import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Users,
  Calendar,
  Clock,
  MessageSquare,
  CheckCircle,
  XCircle,
  Star,
  ArrowRight,
  Send,
  LogOut,
  Loader2
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import apiService from "../services/api";
import { useToast } from "../hooks/use-toast";

interface SwapRequest {
  _id: string;
  requester: {
    _id: string;
    name: string;
    email: string;
    profilePhoto?: { url?: string };
  };
  recipient: {
    _id: string;
    name: string;
    email: string;
    profilePhoto?: { url?: string };
  };
  skillOffered: {
    name: string;
    description?: string;
    level: string;
  };
  skillRequested: {
    name: string;
    description?: string;
    level: string;
  };
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed';
  message?: string;
  proposedSchedule?: string;
  feedback?: {
    rating: number;
    comment: string;
    givenBy: string;
    givenAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface SwapStats {
  pending: number;
  active: number;
  completed: number;
  averageRating: number;
}

export default function SwapsPage() {
  const [activeTab, setActiveTab] = useState("pending");
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<SwapStats>({
    pending: 0,
    active: 0,
    completed: 0,
    averageRating: 0
  });
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedSwap, setSelectedSwap] = useState<SwapRequest | null>(null);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch swap requests
  const fetchSwapRequests = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getSwapRequests({ limit: 50 });
      setSwapRequests(response.swapRequests);
      
      // Calculate stats
      const pending = response.swapRequests.filter((swap: SwapRequest) => swap.status === 'pending').length;
      const active = response.swapRequests.filter((swap: SwapRequest) => swap.status === 'accepted').length;
      const completed = response.swapRequests.filter((swap: SwapRequest) => swap.status === 'completed').length;
      
      // Calculate average rating from completed swaps with feedback
      const completedWithFeedback = response.swapRequests.filter((swap: SwapRequest) => 
        swap.status === 'completed' && swap.feedback
      );
      const averageRating = completedWithFeedback.length > 0 
        ? completedWithFeedback.reduce((sum: number, swap: SwapRequest) => sum + (swap.feedback?.rating || 0), 0) / completedWithFeedback.length
        : 0;

      setStats({ pending, active, completed, averageRating });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load swap requests",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSwapRequests();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAcceptRequest = async (swapId: string) => {
    try {
      setIsUpdatingStatus(swapId);
      await apiService.updateSwapStatus(swapId, 'accepted');
      toast({
        title: "Success",
        description: "Swap request accepted!",
      });
      fetchSwapRequests();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to accept request",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  const handleRejectRequest = async (swapId: string) => {
    try {
      setIsUpdatingStatus(swapId);
      await apiService.updateSwapStatus(swapId, 'rejected');
      toast({
        title: "Success",
        description: "Swap request rejected",
      });
      fetchSwapRequests();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reject request",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  const handleCancelRequest = async (swapId: string) => {
    try {
      setIsUpdatingStatus(swapId);
      await apiService.cancelSwapRequest(swapId);
      toast({
        title: "Success",
        description: "Swap request cancelled",
      });
      fetchSwapRequests();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to cancel request",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  const handleCompleteSwap = async (swapId: string) => {
    try {
      setIsUpdatingStatus(swapId);
      await apiService.updateSwapStatus(swapId, 'completed');
      toast({
        title: "Success",
        description: "Swap marked as completed!",
      });
      fetchSwapRequests();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to complete swap",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!selectedSwap || feedbackRating === 0 || !feedbackComment.trim()) {
      toast({
        title: "Error",
        description: "Please provide both rating and comment",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmittingFeedback(true);
      await apiService.addSwapFeedback(selectedSwap._id, {
        rating: feedbackRating,
        comment: feedbackComment.trim()
      });
      
      toast({
        title: "Success",
        description: "Feedback submitted successfully!",
      });
      
      setShowFeedbackModal(false);
      setSelectedSwap(null);
      setFeedbackRating(0);
      setFeedbackComment("");
      fetchSwapRequests();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit feedback",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const getFilteredSwaps = (status: string) => {
    return swapRequests.filter(swap => swap.status === status);
  };

  const isRequester = (swap: SwapRequest) => {
    return swap.requester._id === user?._id;
  };

  const getOtherUser = (swap: SwapRequest) => {
    return isRequester(swap) ? swap.recipient : swap.requester;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading your swaps...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold">SkillSwap</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link to="/browse" className="text-muted-foreground hover:text-foreground">Browse</Link>
              <Link to="/swaps" className="text-foreground font-medium">My Swaps</Link>
              <Link to="/profile" className="text-muted-foreground hover:text-foreground">Profile</Link>
              {user?.isAdmin && (
                <Link to="/admin" className="text-muted-foreground hover:text-foreground">
                  Admin Panel
                </Link>
              )}
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Skill Swaps</h1>
          <p className="text-xl text-muted-foreground">
            Manage your skill exchange requests and sessions
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-elegant border-0">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold">{stats.pending}</div>
              <div className="text-sm text-muted-foreground">Pending Requests</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-elegant border-0">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-accent" />
              </div>
              <div className="text-2xl font-bold">{stats.active}</div>
              <div className="text-sm text-muted-foreground">Active Swaps</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-elegant border-0">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold">{stats.completed}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-elegant border-0">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-accent" />
              </div>
              <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">Avg Rating</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
            <TabsTrigger value="active">Active ({stats.active})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({stats.completed})</TabsTrigger>
          </TabsList>

          {/* Pending Requests */}
          <TabsContent value="pending" className="space-y-6">
            {getFilteredSwaps('pending').map((swap) => {
              const otherUser = getOtherUser(swap);
              const isUserRequester = isRequester(swap);
              
              return (
                <Card key={swap._id} className="shadow-elegant border-0">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={otherUser.profilePhoto?.url} />
                          <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                            {getInitials(otherUser.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{otherUser.name}</CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{formatDate(swap.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant={isUserRequester ? "secondary" : "default"}>
                        {isUserRequester ? "Sent" : "Received"}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="default">{swap.skillOffered.name}</Badge>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        <Badge variant="secondary">{swap.skillRequested.name}</Badge>
                      </div>
                    </div>
                    
                    {swap.message && (
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-sm">{swap.message}</p>
                      </div>
                    )}

                    {!isUserRequester ? (
                      <div className="flex gap-3">
                        <Button 
                          onClick={() => handleAcceptRequest(swap._id)}
                          disabled={isUpdatingStatus === swap._id}
                          className="gap-2"
                        >
                          {isUpdatingStatus === swap._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                          Accept
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => handleRejectRequest(swap._id)}
                          disabled={isUpdatingStatus === swap._id}
                          className="gap-2"
                        >
                          {isUpdatingStatus === swap._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <XCircle className="w-4 h-4" />
                          )}
                          Decline
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>Waiting for response...</span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleCancelRequest(swap._id)}
                          disabled={isUpdatingStatus === swap._id}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
            
            {getFilteredSwaps('pending').length === 0 && (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">No pending requests</h3>
                <p className="text-muted-foreground mb-4">Start browsing skills to send new swap requests</p>
                <Link to="/browse">
                  <Button>Browse Skills</Button>
                </Link>
              </div>
            )}
          </TabsContent>

          {/* Active Swaps */}
          <TabsContent value="active" className="space-y-6">
            {getFilteredSwaps('accepted').map((swap) => {
              const otherUser = getOtherUser(swap);
              
              return (
                <Card key={swap._id} className="shadow-elegant border-0">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={otherUser.profilePhoto?.url} />
                          <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                            {getInitials(otherUser.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{otherUser.name}</CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Started {formatDate(swap.updatedAt)}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="default" className="bg-accent">Active</Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="default">{swap.skillOffered.name}</Badge>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        <Badge variant="secondary">{swap.skillRequested.name}</Badge>
                      </div>
                    </div>
                    
                    {swap.proposedSchedule && (
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span className="font-medium text-sm">Proposed Schedule</span>
                        </div>
                        <p className="text-sm">{swap.proposedSchedule}</p>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <Button 
                        onClick={() => handleCompleteSwap(swap._id)}
                        disabled={isUpdatingStatus === swap._id}
                        className="gap-2"
                      >
                        {isUpdatingStatus === swap._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        Mark Complete
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Message
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            {getFilteredSwaps('accepted').length === 0 && (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">No active swaps</h3>
                <p className="text-muted-foreground">Accept a pending request to start your first skill exchange</p>
              </div>
            )}
          </TabsContent>

          {/* Completed Swaps */}
          <TabsContent value="completed" className="space-y-6">
            {getFilteredSwaps('completed').map((swap) => {
              const otherUser = getOtherUser(swap);
              
              return (
                <Card key={swap._id} className="shadow-elegant border-0">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={otherUser.profilePhoto?.url} />
                          <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                            {getInitials(otherUser.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{otherUser.name}</CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle className="w-3 h-3 text-accent" />
                            <span>Completed {formatDate(swap.updatedAt)}</span>
                          </div>
                        </div>
                      </div>
                      {swap.feedback && (
                        <div className="flex items-center gap-1">
                          {[...Array(swap.feedback.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                          ))}
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{swap.skillOffered.name}</Badge>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        <Badge variant="outline">{swap.skillRequested.name}</Badge>
                      </div>
                    </div>
                    
                    {swap.feedback ? (
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-sm font-medium mb-1">Your Feedback:</p>
                        <p className="text-sm text-muted-foreground">{swap.feedback.comment}</p>
                      </div>
                    ) : (
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-2">No feedback provided yet</p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedSwap(swap);
                            setShowFeedbackModal(true);
                          }}
                          className="gap-2"
                        >
                          <Star className="w-4 h-4" />
                          Add Feedback
                        </Button>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <Button variant="outline" className="gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Contact Again
                      </Button>
                      {!swap.feedback && (
                        <Button 
                          variant="ghost" 
                          className="gap-2"
                          onClick={() => {
                            setSelectedSwap(swap);
                            setShowFeedbackModal(true);
                          }}
                        >
                          <Star className="w-4 h-4" />
                          Add Feedback
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            {getFilteredSwaps('completed').length === 0 && (
              <div className="text-center py-12">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">No completed swaps yet</h3>
                <p className="text-muted-foreground">Complete your first skill exchange to see it here</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Feedback Modal */}
      <Dialog open={showFeedbackModal} onOpenChange={setShowFeedbackModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Feedback</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Rating</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFeedbackRating(star)}
                    className="p-1 transition-colors"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= feedbackRating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Comment</label>
              <Textarea
                placeholder="Share your experience with this skill exchange..."
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground">
                {feedbackComment.length}/500 characters
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowFeedbackModal(false)}
                disabled={isSubmittingFeedback}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitFeedback}
                disabled={isSubmittingFeedback || feedbackRating === 0 || !feedbackComment.trim()}
                className="flex-1"
              >
                {isSubmittingFeedback ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  "Submit Feedback"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}