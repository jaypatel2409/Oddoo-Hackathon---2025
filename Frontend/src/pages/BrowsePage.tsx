import { useState } from "react";
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
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";

const mockUsers = [
  {
    id: 1,
    name: "Alex Thompson",
    location: "New York, NY",
    avatar: "AT",
    rating: 4.8,
    completedSwaps: 32,
    skillsOffered: ["Photography", "Video Editing", "Photoshop"],
    skillsWanted: ["Spanish", "Guitar", "Cooking"],
    availability: "Weekends",
    lastActive: "2 hours ago"
  },
  {
    id: 2,
    name: "Maria Garcia",
    location: "Los Angeles, CA",
    avatar: "MG",
    rating: 4.9,
    completedSwaps: 45,
    skillsOffered: ["Spanish", "Salsa Dancing", "Marketing"],
    skillsWanted: ["React", "UI Design", "Piano"],
    availability: "Evenings",
    lastActive: "1 day ago"
  },
  {
    id: 3,
    name: "David Kim",
    location: "Seattle, WA",
    avatar: "DK",
    rating: 4.7,
    completedSwaps: 28,
    skillsOffered: ["Python", "Data Science", "Machine Learning"],
    skillsWanted: ["Guitar", "Photography", "French"],
    availability: "Flexible",
    lastActive: "30 minutes ago"
  },
  {
    id: 4,
    name: "Emma Wilson",
    location: "Austin, TX",
    avatar: "EW",
    rating: 5.0,
    completedSwaps: 18,
    skillsOffered: ["Yoga", "Meditation", "Nutrition"],
    skillsWanted: ["Web Development", "Graphic Design"],
    availability: "Mornings",
    lastActive: "5 hours ago"
  },
  {
    id: 5,
    name: "James Rodriguez",
    location: "Miami, FL", 
    avatar: "JR",
    rating: 4.6,
    completedSwaps: 41,
    skillsOffered: ["Guitar", "Music Production", "Songwriting"],
    skillsWanted: ["Video Editing", "Marketing", "Business"],
    availability: "Weekends",
    lastActive: "3 hours ago"
  },
  {
    id: 6,
    name: "Sophie Chen",
    location: "San Francisco, CA",
    avatar: "SC",
    rating: 4.9,
    completedSwaps: 39,
    skillsOffered: ["UI/UX Design", "Figma", "User Research"],
    skillsWanted: ["Mandarin", "Cooking", "Photography"],
    availability: "Evenings",
    lastActive: "1 hour ago"
  }
];

export default function BrowsePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [filteredUsers, setFilteredUsers] = useState(mockUsers);

  const categories = [
    "all", "Technology", "Creative Arts", "Languages", "Music", "Fitness", "Business"
  ];

  const locations = [
    "all", "New York, NY", "Los Angeles, CA", "San Francisco, CA", "Seattle, WA", "Austin, TX", "Miami, FL"
  ];

  const handleSearch = () => {
    let filtered = mockUsers;

    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.skillsOffered.some(skill => 
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedLocation !== "all") {
      filtered = filtered.filter(user => user.location === selectedLocation);
    }

    setFilteredUsers(filtered);
  };

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
              <Link to="/browse" className="text-foreground font-medium">Browse</Link>
              <Link to="/swaps" className="text-muted-foreground hover:text-foreground">My Swaps</Link>
              <Link to="/profile" className="text-muted-foreground hover:text-foreground">Profile</Link>
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

        {/* User Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="shadow-elegant border-0 hover:shadow-glow transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                        {user.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{user.name}</CardTitle>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span>{user.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-accent text-accent" />
                      <span className="font-medium">{user.rating}</span>
                    </div>
                    <div className="text-muted-foreground">{user.completedSwaps} swaps</div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2 text-primary">Can Teach:</h4>
                  <div className="flex flex-wrap gap-1">
                    {user.skillsOffered.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="default" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {user.skillsOffered.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{user.skillsOffered.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2 text-accent">Wants to Learn:</h4>
                  <div className="flex flex-wrap gap-1">
                    {user.skillsWanted.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {user.skillsWanted.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{user.skillsWanted.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{user.availability}</span>
                  </div>
                  <span>Active {user.lastActive}</span>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="default" size="sm" className="flex-1 gap-1">
                    <MessageSquare className="w-3 h-3" />
                    Contact
                  </Button>
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No results found</h3>
              <p>Try adjusting your search criteria or browse all available skills.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}