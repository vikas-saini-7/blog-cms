"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { uploadAvatar } from "@/utils/uploadFile";
import { getSession, useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function OnboardingForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const [step, setStep] = useState(1);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("male");
  const [role, setRole] = useState("student");
  const [dob, setDob] = useState<Date | undefined>(undefined);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setProfilePic(reader.result as string);
    reader.readAsDataURL(file);

    if (!session?.user?.id) {
      toast.error("You must be logged in");
      return;
    }

    try {
      toast.loading("Uploading avatar...");
      const url = await uploadAvatar(file, session.user.id);
      setAvatarUrl(url);
      toast.success("Profile picture uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload profile picture.");
      console.error(error);
    } finally {
      toast.dismiss();
    }
  };

  const validateStep1 = () => {
    if (!username.trim()) {
      toast.error("Username is required");
      return false;
    }
    if (!gender.trim()) {
      toast.error("Gender is required");
      return false;
    }
    if (!dob) {
      toast.error("Date of birth is required");
      return false;
    }
    if (!role.trim()) {
      toast.error("Role is required");
      return false;
    }
    if (selectedTags.length < 1) {
      toast.error("Please select at least one tag");
      return false;
    }
    if (!avatarUrl) {
      toast.error("Profile picture is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user?.id) {
      toast.error("You must be logged in to complete onboarding.");
      return;
    }

    if (!validateStep1()) return;

    setLoading(true);

    try {
      const payload = {
        username,
        avatarUrl,
        bio,
        gender,
        role,
        dob,
        tags: selectedTags,
        isPublic,
      };

      console.log("Submitting payload:", payload);
      // TODO: POST to API route here
      const res = await axios.post("/api/onboarding", payload);

      if (res.status == 200) {
        toast.success("Profile completed successfully!");
        // Refresh the session (fetches latest DB values via session callback)
        await getSession();

        // Then redirect to home
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error during onboarding:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto space-y-8 p-6 bg-white rounded-2xl shadow mt-10"
    >
      <div className="text-2xl font-bold text-center">
        Complete Your Profile
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <div className="flex flex-col items-center gap-2">
            <Avatar
              className={`w-24 h-24 border-4 ${
                avatarUrl ? "border-green-400" : ""
              } `}
            >
              <AvatarImage src={profilePic || ""} alt="Profile" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Your Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">
              Bio <span className="text-gray-500">(optional)</span>
            </Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    disabled={loading}
                  >
                    {dob ? format(dob, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dob}
                    onSelect={setDob}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select
                value={gender}
                onValueChange={setGender}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Your Role</Label>
              <Select value={role} onValueChange={setRole} disabled={loading}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="entrepreneur">Entrepreneur</SelectItem>
                  <SelectItem value="developer">Developer</SelectItem>
                  <SelectItem value="designer">Designer</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Content Preferences</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {[
                "AI",
                "Web Development",
                "Design",
                "Tech News",
                "Open Source",
                "Startups",
                "Mobile",
                "Game Dev",
                "Machine Learning",
                "Productivity",
              ].map((tag) => (
                <Button
                  key={tag}
                  type="button"
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="rounded-full text-sm px-4 py-1.5"
                  onClick={() =>
                    setSelectedTags((prev) =>
                      prev.includes(tag)
                        ? prev.filter((t) => t !== tag)
                        : [...prev, tag]
                    )
                  }
                  disabled={loading}
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              onClick={() => {
                if (validateStep1()) setStep(2);
              }}
              disabled={loading}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="w-full max-w-md mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              Privacy Settings
            </h2>
            <p className="text-sm text-muted-foreground">
              Decide who can view your profile. You can always change this later
              in your account settings.
            </p>
          </div>

          <div className="rounded-lg border px-6 py-4 flex items-center gap-4 shadow-sm bg-muted/40">
            <Switch
              id="public-switch"
              checked={isPublic}
              onCheckedChange={setIsPublic}
              aria-label="Toggle profile visibility"
              disabled={loading}
            />
            <div>
              <Label htmlFor="public-switch" className="text-base font-medium">
                Private/Public Profile
              </Label>
              <p className="text-sm text-muted-foreground">
                {isPublic
                  ? "Your profile is visible to others."
                  : "Only you can see your profile."}
              </p>
            </div>
          </div>

          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setStep(1)}
              disabled={loading}
            >
              Back
            </Button>
            <Button type="submit" className="px-6" disabled={loading}>
              {loading ? "Submitting..." : "Finish Onboarding"}
            </Button>
          </div>
        </div>
      )}
    </form>
  );
}
