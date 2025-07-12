import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Clock, 
  Star, 
  Plus, 
  X, 
  Camera,
  Edit3,
  Save,
  Users,
  Upload,
  LogOut
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../hooks/use-toast";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [location, setLocation] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [skillsOffered, setSkillsOffered] = useState<string[]>([]);
  const [skillsWanted, setSkillsWanted] = useState<string[]>([]);
  const [newSkillOffered, setNewSkillOffered] = useState("");
  const [newSkillWanted, setNewSkillWanted] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { user, updateUser, setShowProfileCompletionModal, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load user data on component mount
  useEffect(() => {
    if (user) {
      setFullName(user.name || "");
      setLocation(user.location || "");
      setIntroduction(user.introduction || "");
      setSkillsOffered(user.skillsOffered?.map(skill => skill.name) || []);
      setSkillsWanted(user.skillsWanted?.map(skill => skill.name) || []);
      setProfilePhoto(user.profilePhoto?.url || null);
    }
  }, [user]);

  const addSkillOffered = () => {
    if (newSkillOffered.trim()) {
      setSkillsOffered([...skillsOffered, newSkillOffered.trim()]);
      setNewSkillOffered("");
    }
  };

  const addSkillWanted = () => {
    if (newSkillWanted.trim()) {
      setSkillsWanted([...skillsWanted, newSkillWanted.trim()]);
      setNewSkillWanted("");
    }
  };

  const removeSkillOffered = (skill: string) => {
    setSkillsOffered(skillsOffered.filter(s => s !== skill));
  };

  const removeSkillWanted = (skill: string) => {
    setSkillsWanted(skillsWanted.filter(s => s !== skill));
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      
      const profileData: any = {
        name: fullName,
        location,
        introduction,
        skillsOffered: skillsOffered.map(skill => ({
          name: skill,
          level: 'intermediate'
        })),
        skillsWanted: skillsWanted.map(skill => ({
          name: skill,
          level: 'beginner'
        }))
      };

      // Include profile photo if it has been changed
      if (profilePhoto && profilePhoto !== user?.profilePhoto?.url) {
        profileData.profilePhoto = profilePhoto;
      }

      await updateUser(profileData);
      
      setIsEditing(false);
      setShowProfileCompletionModal(false);
      
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePhoto(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
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
              <Link to="/swaps" className="text-muted-foreground hover:text-foreground">My Swaps</Link>
              <Link to="/profile" className="text-foreground font-medium">Profile</Link>
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
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8 shadow-elegant border-0">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={profilePhoto || ""} />
                      <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xl">
                        {getInitials(fullName)}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <div 
                        className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer"
                        onClick={handlePhotoClick}
                      >
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    {isEditing ? (
                      <div className="space-y-2">
                        <Input 
                          placeholder="Your Name" 
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                        />
                        <Input 
                          placeholder="Your Location" 
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                        />
                      </div>
                    ) : (
                      <>
                        <h1 className="text-3xl font-bold">{fullName}</h1>
                        <div className="flex items-center gap-2 text-muted-foreground mt-1">
                          <MapPin className="w-4 h-4" />
                          <span>{location}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-accent text-accent" />
                            <span className="font-medium">4.9</span>
                            <span className="text-muted-foreground">(127 reviews)</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-primary" />
                            <span className="font-medium">45 swaps completed</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  {isEditing && (
                    <Button 
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button 
                    variant={isEditing ? "default" : "outline"}
                    onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
                    disabled={isSaving}
                    className="gap-2"
                  >
                    {isEditing ? (
                      <>
                        <Save className="w-4 h-4" />
                        {isSaving ? "Saving..." : "Save Profile"}
                      </>
                    ) : (
                      <>
                        <Edit3 className="w-4 h-4" />
                        Edit Profile
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Hidden file input for photo upload */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Introduction */}
              <Card className="shadow-elegant border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    About Me
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="introduction">Tell us about yourself</Label>
                        <Textarea
                          id="introduction"
                          placeholder="Share your story, interests, and what motivates you to learn and teach..."
                          value={introduction}
                          onChange={(e) => setIntroduction(e.target.value)}
                          className="mt-2"
                          rows={4}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {introduction ? (
                        <p className="text-muted-foreground leading-relaxed">{introduction}</p>
                      ) : (
                        <p className="text-muted-foreground italic">No introduction added yet.</p>
                      )}
                      <Button 
                        variant="outline" 
                        onClick={() => setIsEditing(true)}
                        className="gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        {introduction ? "Edit About Me" : "Add About Me"}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Skills Offered */}
              <Card className="shadow-elegant border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Skills I Can Teach
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {skillsOffered.length > 0 ? (
                      skillsOffered.map((skill, index) => (
                        <Badge key={index} variant="default" className="gap-1">
                          {skill}
                          {isEditing && (
                            <X 
                              className="w-3 h-3 cursor-pointer hover:text-destructive" 
                              onClick={() => removeSkillOffered(skill)}
                            />
                          )}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-muted-foreground italic">No skills added yet.</p>
                    )}
                  </div>
                  
                  {isEditing ? (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a skill you can teach"
                        value={newSkillOffered}
                        onChange={(e) => setNewSkillOffered(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addSkillOffered()}
                      />
                      <Button onClick={addSkillOffered} size="icon">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditing(true)}
                      className="gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      {skillsOffered.length > 0 ? "Edit Skills" : "Add Skills"}
                    </Button>
                  )}
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
                  <div className="flex flex-wrap gap-2 mb-4">
                    {skillsWanted.length > 0 ? (
                      skillsWanted.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="gap-1">
                          {skill}
                          {isEditing && (
                            <X 
                              className="w-3 h-3 cursor-pointer hover:text-destructive" 
                              onClick={() => removeSkillWanted(skill)}
                            />
                          )}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-muted-foreground italic">No skills added yet.</p>
                    )}
                  </div>
                  
                  {isEditing ? (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a skill you want to learn"
                        value={newSkillWanted}
                        onChange={(e) => setNewSkillWanted(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addSkillWanted()}
                      />
                      <Button onClick={addSkillWanted} size="icon">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditing(true)}
                      className="gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      {skillsWanted.length > 0 ? "Edit Skills" : "Add Skills"}
                    </Button>
                  )}
                </CardContent>
              </Card>


            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Profile Settings */}
              <Card className="shadow-elegant border-0">
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Public Profile</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow others to see your profile
                      </p>
                    </div>
                    <Switch 
                      checked={isPublic} 
                      onCheckedChange={setIsPublic}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label>Profile Photo</Label>
                    <p className="text-sm text-muted-foreground">
                      {profilePhoto ? "Photo uploaded" : "No photo uploaded"}
                    </p>
                    {isEditing && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handlePhotoClick}
                        className="w-full gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        {profilePhoto ? "Change Photo" : "Upload Photo"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Stats */}
              <Card className="shadow-elegant border-0">
                <CardHeader>
                  <CardTitle>Your Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-sm">Total Swaps</span>
                    </div>
                    <span className="font-semibold">45</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-accent" />
                      <span className="text-sm">Average Rating</span>
                    </div>
                    <span className="font-semibold">4.9</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="text-sm">Skills Taught</span>
                    </div>
                    <span className="font-semibold">{skillsOffered.length}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Plus className="w-4 h-4 text-accent" />
                      <span className="text-sm">Skills Learned</span>
                    </div>
                    <span className="font-semibold">{skillsWanted.length}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}