import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Star, 
  Users,
  ArrowLeft,
  Phone,
  MessageSquare,
  Clock,
  Calendar,
  Award
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import apiService from "../services/api";
import { useToast } from "../hooks/use-toast";
import ReviewModal from "../components/ReviewModal";
import ReviewsList from "../components/ReviewsList";

export default function PublicProfilePage() {
  const [profileUser, setProfileUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [isCheckingReview, setIsCheckingReview] = useState(false);
  const { userId } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const userData = await apiService.getUserById(userId);
        setProfileUser(userData);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        toast({
          title: "Error",
          description: "Failed to load user profile",
          variant: "destructive",
        });
        navigate('/browse');
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId, navigate, toast]);

  // Check if current user can review this profile
  useEffect(() => {
    const checkCanReview = async () => {
      if (!user || !profileUser || user._id === profileUser._id) {
        setCanReview(false);
        return;
      }

      try {
        setIsCheckingReview(true);
        const response = await apiService.canReviewUser(profileUser._id);
        setCanReview(response.canReview);
      } catch (error) {
        console.error('Failed to check review status:', error);
        setCanReview(false);
      } finally {
        setIsCheckingReview(false);
      }
    };

    if (profileUser) {
      checkCanReview();
    }
  }, [user, profileUser]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleContactUser = (user) => {
    toast({
      title: "Contact User",
      description: `Contact information for ${user.name} will be available soon!`,
    });
  };

  const handleReviewSubmitted = () => {
    setCanReview(false);
    // Refresh the page to show updated rating
    window.location.reload();
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatLastActive = (lastActive) => {
    if (!lastActive) return "Unknown";
    const date = new Date(lastActive);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return "1 day ago";
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50 animate-pulse" />
              <h3 className="text-lg font-medium mb-2">Loading profile...</h3>
              <p>Fetching user information.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-muted/30">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Profile not found</h3>
              <p>This user profile could not be found.</p>
              <Button asChild className="mt-4">
                <Link to="/browse">Back to Browse</Link>
              </Button>
            </div>
          </div>
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
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild className="gap-2">
                <Link to="/browse">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Browse
                </Link>
              </Button>
              <Link to="/" className="flex items-center gap-2">
                <Users className="w-6 h-6 text-primary" />
                <span className="text-xl font-bold">SkillSwap</span>
              </Link>
            </div>
            <nav className="flex items-center gap-6">
              <Link to="/browse" className="text-muted-foreground hover:text-foreground">Browse</Link>
              <Link to="/swaps" className="text-muted-foreground hover:text-foreground">My Swaps</Link>
              <Link to="/profile" className="text-muted-foreground hover:text-foreground">Profile</Link>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="gap-2"
              >
                Logout
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8 shadow-elegant border-0">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profileUser.profilePhoto?.url} />
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xl">
                      {getInitials(profileUser.name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h1 className="text-3xl font-bold">{profileUser.name}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground mt-1">
                      <MapPin className="w-4 h-4" />
                      <span>{profileUser.location || "Location not set"}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-accent text-accent" />
                        <span className="font-medium">{profileUser.rating?.average?.toFixed(1) || "N/A"}</span>
                        <span className="text-muted-foreground">({profileUser.rating?.count || 0} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">Active {formatLastActive(profileUser.lastActive)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => handleContactUser(profileUser)}
                    className="gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Contact
                  </Button>
                  {canReview && (
                    <Button 
                      variant="default"
                      onClick={() => setShowReviewModal(true)}
                      className="gap-2"
                    >
                      <Star className="w-4 h-4" />
                      Write Review
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Introduction */}
              {profileUser.introduction && (
                <Card className="shadow-elegant border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      About
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{profileUser.introduction}</p>
                  </CardContent>
                </Card>
              )}

              {/* Skills Offered */}
              <Card className="shadow-elegant border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Skills I Can Teach
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profileUser.skillsOffered?.length > 0 ? (
                      profileUser.skillsOffered.map((skill, index) => (
                        <Badge key={index} variant="default" className="gap-1">
                          {skill.name}
                          {skill.level && (
                            <span className="text-xs opacity-75">({skill.level})</span>
                          )}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-muted-foreground italic">No skills listed</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Skills Wanted */}
              <Card className="shadow-elegant border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    Skills I Want to Learn
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profileUser.skillsWanted?.length > 0 ? (
                      profileUser.skillsWanted.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="gap-1">
                          {skill.name}
                          {skill.level && (
                            <span className="text-xs opacity-75">({skill.level})</span>
                          )}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-muted-foreground italic">No skills listed</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Reviews */}
              <ReviewsList 
                userId={profileUser._id} 
                userName={profileUser.name}
                onReviewSubmitted={handleReviewSubmitted}
              />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Contact Card */}
              <Card className="shadow-elegant border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Get in Touch
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={() => handleContactUser(profileUser)}
                    className="w-full gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Contact {profileUser.name}
                  </Button>
                  <p className="text-sm text-muted-foreground text-center">
                    Start a conversation and arrange a skill exchange!
                  </p>
                </CardContent>
              </Card>

              {/* Stats Card */}
              <Card className="shadow-elegant border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Rating</span>
                    <span className="font-medium">{profileUser.rating?.average?.toFixed(1) || "N/A"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Reviews</span>
                    <span className="font-medium">{profileUser.rating?.count || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Member since</span>
                    <span className="font-medium">
                      {profileUser.createdAt ? new Date(profileUser.createdAt).getFullYear() : "N/A"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {profileUser && (
        <ReviewModal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          reviewedUser={profileUser}
          onReviewSubmitted={handleReviewSubmitted}
        />
      )}
    </div>
  );
} 