import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Loader2 } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import apiService from "../services/api";

interface SwapRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientUser: {
    _id: string;
    name: string;
    profilePhoto?: { url?: string };
    skillsOffered: Array<{
      name: string;
      description?: string;
      level: string;
    }>;
    skillsWanted: Array<{
      name: string;
      description?: string;
      level: string;
    }>;
  };
  currentUser: {
    _id: string;
    skillsOffered: Array<{
      name: string;
      description?: string;
      level: string;
    }>;
    skillsWanted: Array<{
      name: string;
      description?: string;
      level: string;
    }>;
  };
  onSwapRequestSent?: () => void;
}

export default function SwapRequestModal({ 
  isOpen, 
  onClose, 
  recipientUser, 
  currentUser,
  onSwapRequestSent 
}: SwapRequestModalProps) {
  const [skillOffered, setSkillOffered] = useState("");
  const [skillRequested, setSkillRequested] = useState("");
  const [message, setMessage] = useState("");
  const [proposedSchedule, setProposedSchedule] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!skillOffered || !skillRequested) {
      toast({
        title: "Skills Required",
        description: "Please select both skills to offer and request",
        variant: "destructive",
      });
      return;
    }

    if (!message.trim()) {
      toast({
        title: "Message Required",
        description: "Please provide a message explaining your swap request",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      await apiService.createSwapRequest({
        recipientId: recipientUser._id,
        skillOffered: {
          name: skillOffered,
          level: 'intermediate'
        },
        skillRequested: {
          name: skillRequested,
          level: 'beginner'
        },
        message: message.trim(),
        proposedSchedule: proposedSchedule.trim() || undefined
      });

      toast({
        title: "Swap Request Sent!",
        description: `Your request has been sent to ${recipientUser.name}`,
      });

      // Reset form
      setSkillOffered("");
      setSkillRequested("");
      setMessage("");
      setProposedSchedule("");
      
      onClose();
      onSwapRequestSent?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send swap request",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setSkillOffered("");
      setSkillRequested("");
      setMessage("");
      setProposedSchedule("");
      onClose();
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

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Request Skill Swap</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto flex-1 pr-2">
          {/* Recipient Info */}
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Avatar className="w-10 h-10">
              <AvatarImage src={recipientUser.profilePhoto?.url} />
              <AvatarFallback className="bg-gradient-primary text-primary-foreground text-sm">
                {getInitials(recipientUser.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{recipientUser.name}</p>
              <p className="text-sm text-muted-foreground">Skill Exchange Partner</p>
              <div className="text-xs text-muted-foreground mt-1">
                <span>Can teach: {recipientUser.skillsOffered?.length || 0} skills</span>
                <span className="mx-2">•</span>
                <span>Wants to learn: {recipientUser.skillsWanted?.length || 0} skills</span>
              </div>
            </div>
          </div>

          {/* Debug Info - Remove this in production */}
          {process.env.NODE_ENV === 'development' && (
            <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
              <p><strong>Debug:</strong> Recipient skills offered: {recipientUser.skillsOffered?.map(s => s.name).join(', ') || 'None'}</p>
              <p><strong>Debug:</strong> Recipient skills wanted: {recipientUser.skillsWanted?.map(s => s.name).join(', ') || 'None'}</p>
              <p><strong>Debug:</strong> Current user skills offered: {currentUser.skillsOffered?.map(s => s.name).join(', ') || 'None'}</p>
            </div>
          )}

          {/* Skill Selection */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>I can teach you:</Label>
              <Select value={skillOffered} onValueChange={setSkillOffered}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a skill you can teach" />
                </SelectTrigger>
                <SelectContent>
                  {currentUser.skillsOffered?.map((skill, index) => (
                    <SelectItem key={index} value={skill.name}>
                      {skill.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-center">
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </div>

            <div className="space-y-2">
              <Label>I want to learn from you:</Label>
              <Select value={skillRequested} onValueChange={setSkillRequested}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a skill you want to learn" />
                </SelectTrigger>
                <SelectContent>
                  {recipientUser.skillsOffered?.length > 0 ? (
                    recipientUser.skillsOffered.map((skill, index) => (
                      <SelectItem key={index} value={skill.name}>
                        {skill.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-skills" disabled>
                      No skills available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {recipientUser.skillsOffered?.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  This user hasn't added any skills they can teach yet.
                </p>
              )}
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Introduce yourself and explain why you'd like to exchange skills..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              maxLength={1000}
              required
            />
            <p className="text-xs text-muted-foreground">
              {message.length}/1000 characters
            </p>
          </div>

          {/* Proposed Schedule */}
          <div className="space-y-2">
            <Label htmlFor="schedule">Proposed Schedule (Optional)</Label>
            <Input
              id="schedule"
              placeholder="e.g., Weekends 2-4 PM, Tuesday evenings..."
              value={proposedSchedule}
              onChange={(e) => setProposedSchedule(e.target.value)}
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground">
              Suggest when you'd like to meet for skill exchange
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
              disabled={isSubmitting || !skillOffered || !skillRequested || !message.trim()}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                "Send Request"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 