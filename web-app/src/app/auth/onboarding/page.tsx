"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// Remove Calendar and Popover imports as they're no longer needed
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
  // Add individual date state
  const [dobDay, setDobDay] = useState<string>("");
  const [dobMonth, setDobMonth] = useState<string>("");
  const [dobYear, setDobYear] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);

  // Generate options for date dropdowns
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - 13 - i); // Start from age 13

  // Update dob when individual date components change
  const updateDob = (day: string, month: string, year: string) => {
    if (day && month && year) {
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      setDob(date);
    } else {
      setDob(undefined);
    }
  };

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
    <div className="min-h-screen bg-gray-50 py-12">
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto space-y-8 p-8 bg-white rounded-md border border-gray-200"
      >
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-gray-900">
            Complete Your Profile
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Tell us about yourself to personalize your experience
          </p>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <Avatar
                className={`w-24 h-24 border-3 ${
                  avatarUrl ? "border-green-500" : "border-gray-300"
                }`}
              >
                <AvatarImage src={profilePic || ""} alt="Profile" />
                <AvatarFallback className="bg-gray-100 text-gray-600">
                  U
                </AvatarFallback>
              </Avatar>
              <div className="w-full max-w-xs">
                {/* <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Picture
                </Label> */}
                <div className="relative">
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={loading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 font-normal"
                  >
                    {avatarUrl ? "Change Photo" : "Choose Photo"}
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="bio"
                className="block text-sm font-medium text-gray-700"
              >
                Bio{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors min-h-[100px] resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2 md:col-span-3">
                <Label className="block text-sm font-medium text-gray-700">
                  Date of Birth
                </Label>
                <div className="flex items-center gap-2">
                  <div>
                    <Select
                      value={dobDay}
                      onValueChange={(value) => {
                        setDobDay(value);
                        updateDob(value, dobMonth, dobYear);
                      }}
                      disabled={loading}
                    >
                      <SelectTrigger className="px-3 py-2 border border-gray-300 rounded-md">
                        <SelectValue placeholder="Day" />
                      </SelectTrigger>
                      <SelectContent>
                        {days.map((day) => (
                          <SelectItem key={day} value={day.toString()}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Select
                      value={dobMonth}
                      onValueChange={(value) => {
                        setDobMonth(value);
                        updateDob(dobDay, value, dobYear);
                      }}
                      disabled={loading}
                    >
                      <SelectTrigger className="px-3 py-2 border border-gray-300 rounded-md">
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem key={month.value} value={month.value}>
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Select
                      value={dobYear}
                      onValueChange={(value) => {
                        setDobYear(value);
                        updateDob(dobDay, dobMonth, value);
                      }}
                      disabled={loading}
                    >
                      <SelectTrigger className="px-3 py-2 border border-gray-300 rounded-md">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="block text-sm font-medium text-gray-700">
                  Gender
                </Label>
                <Select
                  value={gender}
                  onValueChange={setGender}
                  disabled={loading}
                >
                  <SelectTrigger className="px-4 py-3 border border-gray-300 rounded-md">
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
                <Label className="block text-sm font-medium text-gray-700">
                  Your Role
                </Label>
                <Select value={role} onValueChange={setRole} disabled={loading}>
                  <SelectTrigger className="px-4 py-3 border border-gray-300 rounded-md">
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

            <div className="space-y-3">
              <Label className="block text-sm font-medium text-gray-700">
                Content Preferences
              </Label>
              <div className="flex flex-wrap gap-2">
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
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      selectedTags.includes(tag)
                        ? "bg-orange-500 text-white hover:bg-orange-600"
                        : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
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

            <div className="flex justify-end pt-4">
              <Button
                type="button"
                onClick={() => {
                  if (validateStep1()) setStep(2);
                }}
                disabled={loading}
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md transition-colors duration-200"
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="w-full max-w-md mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-semibold text-gray-900">
                Privacy Settings
              </h3>
              <p className="text-sm text-gray-600">
                Decide who can view your profile. You can always change this
                later in your account settings.
              </p>
            </div>

            <div className="rounded-md border border-gray-200 px-6 py-4 flex items-center gap-4 bg-gray-50">
              <Switch
                id="public-switch"
                checked={isPublic}
                onCheckedChange={setIsPublic}
                aria-label="Toggle profile visibility"
                disabled={loading}
              />
              <div>
                <Label
                  htmlFor="public-switch"
                  className="text-base font-medium text-gray-900"
                >
                  {isPublic ? "Public Profile" : "Private Profile"}
                </Label>
                <p className="text-sm text-gray-600">
                  {isPublic
                    ? "Your profile is visible to others."
                    : "Only you can see your profile."}
                </p>
              </div>
            </div>

            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                disabled={loading}
                className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
              >
                Back
              </Button>
              <Button
                type="submit"
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md transition-colors duration-200"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Complete Setup"}
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
