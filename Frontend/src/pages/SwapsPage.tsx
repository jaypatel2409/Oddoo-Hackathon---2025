import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { 
  Users,
  Calendar,
  Clock,
  MessageSquare,
  CheckCircle,
  XCircle,
  Star,
  ArrowRight,
  Send
} from "lucide-react";
import { Link } from "react-router-dom";

const mockSwapRequests = {
  pending: [
    {
      id: 1,
      type: "received",
      user: { name: "Alex Thompson", avatar: "AT", rating: 4.8 },
      skillOffered: "Photography",
      skillWanted: "React Development",
      message: "Hi! I'd love to learn React development from you. I can teach you professional photography techniques in return.",
      date: "2 days ago",
      status: "pending"
    },
    {
      id: 2,
      type: "sent",
      user: { name: "Maria Garcia", avatar: "MG", rating: 4.9 },
      skillOffered: "UI/UX Design", 
      skillWanted: "Spanish",
      message: "Hello Maria! I'm interested in learning Spanish and can offer UI/UX design lessons in exchange.",
      date: "1 week ago",
      status: "pending"
    }
  ],
  active: [
    {
      id: 3,
      user: { name: "David Kim", avatar: "DK", rating: 4.7 },
      skillOffered: "JavaScript",
      skillWanted: "Python",
      nextSession: "Tomorrow, 3:00 PM",
      progress: "2 of 4 sessions completed",
      status: "active"
    },
    {
      id: 4,
      user: { name: "Emma Wilson", avatar: "EW", rating: 5.0 },
      skillOffered: "Yoga",
      skillWanted: "Web Development",
      nextSession: "Friday, 6:00 PM",
      progress: "1 of 3 sessions completed",
      status: "active"
    }
  ],
  completed: [
    {
      id: 5,
      user: { name: "James Rodriguez", avatar: "JR", rating: 4.6 },
      skillOffered: "React Development",
      skillWanted: "Guitar",
      completedDate: "Last week",
      rating: 5,
      feedback: "Amazing teacher! Really helped me understand React concepts.",
      status: "completed"
    },
    {
      id: 6,
      user: { name: "Sophie Chen", avatar: "SC", rating: 4.9 },
      skillOffered: "Figma",
      skillWanted: "Spanish",
      completedDate: "2 weeks ago", 
      rating: 4,
      feedback: "Great experience learning Figma. Very patient instructor.",
      status: "completed"
    }
  ]
};

export default function SwapsPage() {
  const [activeTab, setActiveTab] = useState("pending");
  const [replyMessage, setReplyMessage] = useState("");

  const handleAcceptRequest = (id: number) => {
    console.log("Accepted request:", id);
  };

  const handleRejectRequest = (id: number) => {
    console.log("Rejected request:", id);
  };

  const handleSendMessage = (id: number) => {
    console.log("Sending message to:", id, replyMessage);
    setReplyMessage("");
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
              <Link to="/browse" className="text-muted-foreground hover:text-foreground">Browse</Link>
              <Link to="/swaps" className="text-foreground font-medium">My Swaps</Link>
              <Link to="/profile" className="text-muted-foreground hover:text-foreground">Profile</Link>
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
              <div className="text-2xl font-bold">{mockSwapRequests.pending.length}</div>
              <div className="text-sm text-muted-foreground">Pending Requests</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-elegant border-0">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-accent" />
              </div>
              <div className="text-2xl font-bold">{mockSwapRequests.active.length}</div>
              <div className="text-sm text-muted-foreground">Active Swaps</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-elegant border-0">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold">{mockSwapRequests.completed.length}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-elegant border-0">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-accent" />
              </div>
              <div className="text-2xl font-bold">4.9</div>
              <div className="text-sm text-muted-foreground">Avg Rating</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="pending">Pending ({mockSwapRequests.pending.length})</TabsTrigger>
            <TabsTrigger value="active">Active ({mockSwapRequests.active.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({mockSwapRequests.completed.length})</TabsTrigger>
          </TabsList>

          {/* Pending Requests */}
          <TabsContent value="pending" className="space-y-6">
            {mockSwapRequests.pending.map((request) => (
              <Card key={request.id} className="shadow-elegant border-0">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                          {request.user.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{request.user.name}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Star className="w-3 h-3 fill-accent text-accent" />
                          <span>{request.user.rating}</span>
                          <span>•</span>
                          <span>{request.date}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant={request.type === "received" ? "default" : "secondary"}>
                      {request.type === "received" ? "Received" : "Sent"}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="default">{request.skillOffered}</Badge>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      <Badge variant="secondary">{request.skillWanted}</Badge>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm">{request.message}</p>
                  </div>

                  {request.type === "received" ? (
                    <div className="flex gap-3">
                      <Button 
                        onClick={() => handleAcceptRequest(request.id)}
                        className="gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Accept
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => handleRejectRequest(request.id)}
                        className="gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Decline
                      </Button>
                      <Button variant="ghost" className="gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Reply
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>Waiting for response...</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            
            {mockSwapRequests.pending.length === 0 && (
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
            {mockSwapRequests.active.map((swap) => (
              <Card key={swap.id} className="shadow-elegant border-0">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                          {swap.user.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{swap.user.name}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Star className="w-3 h-3 fill-accent text-accent" />
                          <span>{swap.user.rating}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="default" className="bg-accent">Active</Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="default">{swap.skillOffered}</Badge>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      <Badge variant="secondary">{swap.skillWanted}</Badge>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="font-medium text-sm">Next Session</span>
                      </div>
                      <p className="text-sm">{swap.nextSession}</p>
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-accent" />
                        <span className="font-medium text-sm">Progress</span>
                      </div>
                      <p className="text-sm">{swap.progress}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button className="gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Message
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <Calendar className="w-4 h-4" />
                      Schedule Session
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {mockSwapRequests.active.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">No active swaps</h3>
                <p className="text-muted-foreground">Accept a pending request to start your first skill exchange</p>
              </div>
            )}
          </TabsContent>

          {/* Completed Swaps */}
          <TabsContent value="completed" className="space-y-6">
            {mockSwapRequests.completed.map((swap) => (
              <Card key={swap.id} className="shadow-elegant border-0">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                          {swap.user.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{swap.user.name}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="w-3 h-3 text-accent" />
                          <span>Completed {swap.completedDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(swap.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{swap.skillOffered}</Badge>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      <Badge variant="outline">{swap.skillWanted}</Badge>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm font-medium mb-1">Your Feedback:</p>
                    <p className="text-sm text-muted-foreground">{swap.feedback}</p>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" className="gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Contact Again
                    </Button>
                    <Button variant="ghost" className="gap-2">
                      <Star className="w-4 h-4" />
                      Update Rating
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {mockSwapRequests.completed.length === 0 && (
              <div className="text-center py-12">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">No completed swaps yet</h3>
                <p className="text-muted-foreground">Complete your first skill exchange to see it here</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}