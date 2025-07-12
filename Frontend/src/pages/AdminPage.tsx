import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users,
  Shield,
  MessageSquare,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Ban,
  Download,
  Send,
  Eye,
  Loader2,
  TrendingUp,
  Activity,
  UserCheck,
  UserX,
  ArrowRight
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import apiService from "../services/api";
import { useToast } from "../hooks/use-toast";

interface User {
  _id: string;
  name: string;
  email: string;
  profilePhoto?: { url?: string };
  isBanned: boolean;
  isAdmin: boolean;
  createdAt: string;
  skillsOffered: Array<{
    name: string;
    description?: string;
    level: string;
    isApproved: boolean;
  }>;
  skillsWanted: Array<{
    name: string;
    description?: string;
    level: string;
  }>;
}

interface SwapRequest {
  _id: string;
  requester: {
    _id: string;
    name: string;
    email: string;
  };
  recipient: {
    _id: string;
    name: string;
    email: string;
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
  createdAt: string;
}

interface AdminMessage {
  _id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'alert';
  isActive: boolean;
  createdAt: string;
}

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  bannedUsers: number;
  totalSwaps: number;
  pendingSwaps: number;
  completedSwaps: number;
  pendingSkillApprovals: number;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [users, setUsers] = useState<User[]>([]);
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);
  const [adminMessages, setAdminMessages] = useState<AdminMessage[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    bannedUsers: 0,
    totalSwaps: 0,
    pendingSwaps: 0,
    completedSwaps: 0,
    pendingSkillApprovals: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messageTitle, setMessageTitle] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [messageType, setMessageType] = useState<'info' | 'warning' | 'alert'>('info');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const { user } = useAuth();
  const { toast } = useToast();

  // Check if user is admin
  useEffect(() => {
    if (user && !user.isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin panel",
        variant: "destructive",
      });
      // Redirect to home page
      window.location.href = '/';
    }
  }, [user, toast]);

  // Fetch admin data
  const fetchAdminData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch users
      const usersResponse = await apiService.getUsers();
      setUsers(usersResponse.users);
      
      // Fetch swap requests
      const swapsResponse = await apiService.getSwapRequests({ limit: 100 });
      setSwapRequests(swapsResponse.swapRequests);
      
      // Fetch admin messages
      const messagesResponse = await apiService.getAdminMessages();
      setAdminMessages(messagesResponse.messages);
      
      // Calculate stats
      const totalUsers = usersResponse.users.length;
      const activeUsers = usersResponse.users.filter((u: User) => !u.isBanned).length;
      const bannedUsers = usersResponse.users.filter((u: User) => u.isBanned).length;
      const totalSwaps = swapsResponse.swapRequests.length;
      const pendingSwaps = swapsResponse.swapRequests.filter((s: SwapRequest) => s.status === 'pending').length;
      const completedSwaps = swapsResponse.swapRequests.filter((s: SwapRequest) => s.status === 'completed').length;
      const pendingSkillApprovals = usersResponse.users.reduce((count: number, u: User) => 
        count + u.skillsOffered.filter(s => !s.isApproved).length, 0
      );

      setStats({
        totalUsers,
        activeUsers,
        bannedUsers,
        totalSwaps,
        pendingSwaps,
        completedSwaps,
        pendingSkillApprovals
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.isAdmin) {
      fetchAdminData();
    }
  }, [user]);

  const handleBanUser = async (userId: string, ban: boolean) => {
    try {
      setIsUpdating(userId);
      await apiService.updateUserStatus(userId, { isBanned: ban });
      toast({
        title: "Success",
        description: `User ${ban ? 'banned' : 'unbanned'} successfully`,
      });
      fetchAdminData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to ${ban ? 'ban' : 'unban'} user`,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(null);
    }
  };

  const handleApproveSkill = async (userId: string, skillName: string, approve: boolean) => {
    try {
      setIsUpdating(`${userId}-${skillName}`);
      await apiService.updateSkillApproval(userId, skillName, approve);
      toast({
        title: "Success",
        description: `Skill ${approve ? 'approved' : 'rejected'} successfully`,
      });
      fetchAdminData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to ${approve ? 'approve' : 'reject'} skill`,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(null);
    }
  };

  const handleSendMessage = async () => {
    if (!messageTitle.trim() || !messageContent.trim()) {
      toast({
        title: "Error",
        description: "Please provide both title and message",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await apiService.createAdminMessage({
        title: messageTitle.trim(),
        message: messageContent.trim(),
        type: messageType
      });
      
      toast({
        title: "Success",
        description: "Platform message sent successfully!",
      });
      
      setShowMessageModal(false);
      setMessageTitle("");
      setMessageContent("");
      setMessageType('info');
      fetchAdminData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadReport = async (reportType: string) => {
    try {
      const response = await apiService.downloadReport(reportType);
      
      // Create and download file
      const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportType}_report_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Success",
        description: `${reportType} report downloaded successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to download report",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">You don't have permission to access the admin panel.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Admin Panel</h1>
                <p className="text-sm text-muted-foreground">Platform management and monitoring</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Welcome, {user.name}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="swaps">Swaps</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.activeUsers} active, {stats.bannedUsers} banned
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Swaps</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalSwaps}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.pendingSwaps} pending, {stats.completedSwaps} completed
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.pendingSkillApprovals}</div>
                  <p className="text-xs text-muted-foreground">
                    Skills awaiting approval
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Messages</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {adminMessages.filter(m => m.isActive).length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Platform notifications
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {users.slice(0, 5).map((user) => (
                      <div key={user._id} className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={user.profilePhoto?.url} />
                          <AvatarFallback className="text-xs">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                        <Badge variant={user.isBanned ? "destructive" : "default"}>
                          {user.isBanned ? "Banned" : "Active"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Swaps</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {swapRequests.slice(0, 5).map((swap) => (
                      <div key={swap._id} className="flex items-center gap-3">
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {swap.requester.name} ↔ {swap.recipient.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {swap.skillOffered.name} for {swap.skillRequested.name}
                          </p>
                        </div>
                        <Badge variant={
                          swap.status === 'completed' ? 'default' :
                          swap.status === 'accepted' ? 'secondary' :
                          swap.status === 'pending' ? 'outline' : 'destructive'
                        }>
                          {swap.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">User Management</h2>
              <Button onClick={() => setShowUserModal(true)}>
                <Eye className="w-4 h-4 mr-2" />
                View All Details
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map((user) => (
                <Card key={user._id}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user.profilePhoto?.url} />
                        <AvatarFallback>
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{user.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Status:</span>
                      <Badge variant={user.isBanned ? "destructive" : "default"}>
                        {user.isBanned ? "Banned" : "Active"}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Skills Offered:</span>
                      <span className="text-sm font-medium">{user.skillsOffered.length}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm">Pending Approvals:</span>
                      <span className="text-sm font-medium text-orange-600">
                        {user.skillsOffered.filter(s => !s.isApproved).length}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBanUser(user._id, !user.isBanned)}
                        disabled={isUpdating === user._id}
                        className="flex-1"
                      >
                        {isUpdating === user._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : user.isBanned ? (
                          <>
                            <UserCheck className="w-4 h-4 mr-1" />
                            Unban
                          </>
                        ) : (
                          <>
                            <Ban className="w-4 h-4 mr-1" />
                            Ban
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Swaps Tab */}
          <TabsContent value="swaps" className="space-y-6">
            <h2 className="text-xl font-semibold">Swap Monitoring</h2>
            
            <div className="space-y-4">
              {swapRequests.map((swap) => (
                <Card key={swap._id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {swap.requester.name} ↔ {swap.recipient.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Created: {formatDate(swap.createdAt)}
                        </p>
                      </div>
                      <Badge variant={
                        swap.status === 'completed' ? 'default' :
                        swap.status === 'accepted' ? 'secondary' :
                        swap.status === 'pending' ? 'outline' : 'destructive'
                      }>
                        {swap.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Skill Exchange</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <ArrowRight className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">
                              <strong>{swap.requester.name}</strong> offers: {swap.skillOffered.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ArrowRight className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">
                              <strong>{swap.recipient.name}</strong> offers: {swap.skillRequested.name}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {swap.message && (
                        <div>
                          <h4 className="font-medium mb-2">Message</h4>
                          <p className="text-sm text-muted-foreground">{swap.message}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Platform Messages</h2>
              <Button onClick={() => setShowMessageModal(true)}>
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {adminMessages.map((message) => (
                <Card key={message._id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{message.title}</CardTitle>
                      <Badge variant={
                        message.type === 'alert' ? 'destructive' :
                        message.type === 'warning' ? 'secondary' : 'default'
                      }>
                        {message.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(message.createdAt)}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">{message.message}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Status:</span>
                      <Badge variant={message.isActive ? "default" : "secondary"}>
                        {message.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <h2 className="text-xl font-semibold">Reports & Analytics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    User Activity Report
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Download comprehensive user activity data including registrations, logins, and profile updates.
                  </p>
                  <Button 
                    onClick={() => handleDownloadReport('user-activity')}
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Report
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Swap Statistics Report
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get detailed swap statistics including success rates, completion times, and user satisfaction.
                  </p>
                  <Button 
                    onClick={() => handleDownloadReport('swap-stats')}
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Report
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Feedback Log Report
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Export all user feedback, ratings, and comments for analysis and improvement.
                  </p>
                  <Button 
                    onClick={() => handleDownloadReport('feedback-logs')}
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Send Message Modal */}
      <Dialog open={showMessageModal} onOpenChange={setShowMessageModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send Platform Message</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="message-title">Message Title</Label>
              <Input
                id="message-title"
                placeholder="Enter message title..."
                value={messageTitle}
                onChange={(e) => setMessageTitle(e.target.value)}
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message-type">Message Type</Label>
              <Select value={messageType} onValueChange={(value: 'info' | 'warning' | 'alert') => setMessageType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Information</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="alert">Alert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message-content">Message Content</Label>
              <Textarea
                id="message-content"
                placeholder="Enter your platform message..."
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                rows={4}
                maxLength={1000}
              />
              <p className="text-xs text-muted-foreground">
                {messageContent.length}/1000 characters
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowMessageModal(false)}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={isSubmitting || !messageTitle.trim() || !messageContent.trim()}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 