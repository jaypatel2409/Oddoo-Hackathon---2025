import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Users,
  MessageSquare,
  Clock,
  LogOut,
  Eye,
  Phone,
  ArrowRight
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ProfileCompletionModal from "../components/ProfileCompletionModal";
import SwapRequestModal from "../components/SwapRequestModal";
import apiService from "../services/api";
import { useToast } from "../hooks/use-toast";

// Gujarat cities for location filter
const gujaratCities = [
  "Ahmedabad",
  "Surat", 
  "Vadodara",
  "Rajkot",
  "Bhavnagar",
  "Jamnagar",
  "Gandhinagar",
  "Anand",
  "Bharuch",
  "Valsad",
  "Navsari",
  "Mehsana",
  "Patan",
  "Surendranagar",
  "Junagadh",
  "Porbandar",
  "Amreli",
  "Botad",
  "Dahod",
  "Kheda",
  "Panchmahal",
  "Sabarkantha",
  "Banaskantha",
  "Kutch"
];

export default function BrowsePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSwapRequestModal, setShowSwapRequestModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { user, showProfileCompletionModal, setShowProfileCompletionModal, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Debug log for user object
  console.log('User object:', user);

  const locations = ["all", ...gujaratCities];

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await apiService.getPublicUsers();
        // Filter out current user and only show public profiles
        const publicUsers = (response.users || []).filter(fetchedUser => 
          fetchedUser._id !== user?._id && fetchedUser.isPublic === true
        );
        setUsers(publicUsers);
        setFilteredUsers(publicUsers);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        toast({
          title: "Error",
          description: "Failed to load users",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [toast, user?._id]);

  const handleSearch = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.skillsOffered?.some(skill => 
          skill.name.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        user.skillsWanted?.some(skill => 
          skill.name.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedLocation !== "all") {
      filtered = filtered.filter(user => 
        user.location && user.location.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  };

  // Auto-search when filters change
  useEffect(() => {
    handleSearch();
  }, [searchTerm, selectedLocation, users]);

  // Check if user needs to complete profile
  useEffect(() => {
    if (user && !user.isProfileComplete && !showProfileCompletionModal) {
      setShowProfileCompletionModal(true);
    }
  }, [user, showProfileCompletionModal, setShowProfileCompletionModal]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleViewProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const handleContactUser = (user) => {
    // For now, show a toast. In a real app, this would open a contact modal or chat
    toast({
      title: "Contact User",
      description: `Contact information for ${user.name} will be available soon!`,
    });
  };

  const handleRequestSwap = (user) => {
    setSelectedUser(user);
    setShowSwapRequestModal(true);
  };

  const handleSwapRequestSent = () => {
    // Optionally refresh the user list or show a success message
    toast({
      title: "Success",
      description: "Swap request sent successfully! Check your My Swaps page for updates.",
    });
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatLastActive = (lastActive: string | Date) => {
    if (!lastActive) return "Unknown";
    const date = new Date(lastActive);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return "1 day ago";
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Profile Completion Modal */}
      <ProfileCompletionModal 
        isOpen={showProfileCompletionModal} 
        onClose={() => setShowProfileCompletionModal(false)} 
      />
      
      {/* Header */}
      <header className="bg-background border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold">SkillSwap</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link to="/browse" className="text-foreground font-medium">Browse</Link>
              <Link to="/swaps" className="text-muted-foreground hover:text-foreground">My Swaps</Link>
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
          <h1 className="text-4xl font-bold mb-2">Browse Skills</h1>
          <p className="text-xl text-muted-foreground">
            Find amazing people to exchange skills with
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 shadow-elegant border-0">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search for skills (e.g., React, Guitar, Spanish...)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              </div>
              
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>
                      {location === "all" ? "All Locations" : location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button onClick={handleSearch} className="gap-2">
                <Filter className="w-4 h-4" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-muted-foreground">
            Showing {filteredUsers.length} skill swappers
          </p>
          <Select defaultValue="rating">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="swaps">Most Swaps</SelectItem>
              <SelectItem value="recent">Recently Active</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50 animate-pulse" />
              <h3 className="text-lg font-medium mb-2">Loading users...</h3>
              <p>Finding amazing skill swappers for you.</p>
            </div>
          </div>
        )}

        {/* User Cards */}
        {!isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <Card key={user._id} className="shadow-elegant border-0 hover:shadow-glow transition-all duration-300 hover:scale-105">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={user.profilePhoto?.url} />
                        <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{user.name}</CardTitle>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span>{user.location || "Location not set"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-accent text-accent" />
                        <span className="font-medium">{user.rating?.average?.toFixed(1) || "N/A"}</span>
                      </div>
                      <div className="text-muted-foreground">{user.rating?.count || 0} reviews</div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2 text-primary">Can Teach:</h4>
                    <div className="flex flex-wrap gap-1">
                      {user.skillsOffered?.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="default" className="text-xs">
                          {skill.name}
                        </Badge>
                      ))}
                      {user.skillsOffered?.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{user.skillsOffered.length - 3} more
                        </Badge>
                      )}
                      {(!user.skillsOffered || user.skillsOffered.length === 0) && (
                        <span className="text-xs text-muted-foreground italic">No skills listed</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm mb-2 text-accent">Wants to Learn:</h4>
                    <div className="flex flex-wrap gap-1">
                      {user.skillsWanted?.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill.name}
                        </Badge>
                      ))}
                      {user.skillsWanted?.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{user.skillsWanted.length - 3} more
                        </Badge>
                      )}
                      {(!user.skillsWanted || user.skillsWanted.length === 0) && (
                        <span className="text-xs text-muted-foreground italic">No skills listed</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Active {formatLastActive(user.lastActive)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="flex-1 gap-1"
                      onClick={() => handleRequestSwap(user)}
                    >
                      <ArrowRight className="w-3 h-3" />
                      Request Swap
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewProfile(user._id)}
                    >
                      <Eye className="w-3 h-3" />
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No results found</h3>
              <p>Try adjusting your search criteria or browse all available skills.</p>
            </div>
          </div>
        )}
      </div>

      {/* Swap Request Modal */}
      {selectedUser && user && (
        <SwapRequestModal
          isOpen={showSwapRequestModal}
          onClose={() => setShowSwapRequestModal(false)}
          recipientUser={selectedUser}
          currentUser={user}
          onSwapRequestSent={handleSwapRequestSent}
        />
      )}
    </div>
  );
}