import { useState, useRef } from "react";
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
  Upload
} from "lucide-react";
import { Link } from "react-router-dom";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [fullName, setFullName] = useState("Sarah Chen");
  const [location, setLocation] = useState("San Francisco, CA");
  const [skillsOffered, setSkillsOffered] = useState([
    "React Development", "UI/UX Design", "JavaScript", "Python"
  ]);
  const [skillsWanted, setSkillsWanted] = useState([
    "Spanish Language", "Guitar Playing", "Photography"
  ]);
  const [newSkillOffered, setNewSkillOffered] = useState("");
  const [newSkillWanted, setNewSkillWanted] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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

                <Button 
                  variant={isEditing ? "default" : "outline"}
                  onClick={() => setIsEditing(!isEditing)}
                  className="gap-2"
                >
                  {isEditing ? (
                    <>
                      <Save className="w-4 h-4" />
                      Save Profile
                    </>
                  ) : (
                    <>
                      <Edit3 className="w-4 h-4" />
                      Edit Profile
                    </>
                  )}
                </Button>
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
                    {skillsOffered.map((skill, index) => (
                      <Badge key={index} variant="default" className="gap-1">
                        {skill}
                        {isEditing && (
                          <X 
                            className="w-3 h-3 cursor-pointer hover:text-destructive" 
                            onClick={() => removeSkillOffered(skill)}
                          />
                        )}
                      </Badge>
                    ))}
                  </div>
                  
                  {isEditing && (
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
                    {skillsWanted.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        {skill}
                        {isEditing && (
                          <X 
                            className="w-3 h-3 cursor-pointer hover:text-destructive" 
                            onClick={() => removeSkillWanted(skill)}
                          />
                        )}
                      </Badge>
                    ))}
                  </div>
                  
                  {isEditing && (
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
                  )}
                </CardContent>
              </Card>

              {/* Bio */}
              <Card className="shadow-elegant border-0">
                <CardHeader>
                  <CardTitle>About Me</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Textarea 
                      placeholder="Tell others about yourself and your learning goals..."
                      defaultValue="I'm a frontend developer passionate about creating beautiful user experiences. I love teaching others what I know and learning new skills from the community. Always excited to connect with fellow learners!"
                      rows={4}
                    />
                  ) : (
                    <p className="text-muted-foreground leading-relaxed">
                      I'm a frontend developer passionate about creating beautiful user experiences. 
                      I love teaching others what I know and learning new skills from the community. 
                      Always excited to connect with fellow learners!
                    </p>
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