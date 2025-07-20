import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AccountPage() {
  return (
    <div className="space-y-6 mb-10">
      <h2 className="text-xl font-semibold">Account Settings</h2>

      {/* Update Profile Info */}
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">Update Profile</h3>
        <Input placeholder="Full Name" defaultValue="Vikas Saini" />
        <Input placeholder="Username" defaultValue="vikas" />
        <Input
          placeholder="Bio"
          defaultValue="Full Stack Developer & UI/UX enthusiast 🚀"
        />
        <Button className="mt-2">Save Changes</Button>
      </div>

      {/* Change Password */}
      <div className="space-y-3 border-t pt-6">
        <h3 className="font-semibold text-lg">Change Password</h3>
        <Input type="password" placeholder="Current Password" />
        <Input type="password" placeholder="New Password" />
        <Input type="password" placeholder="Confirm New Password" />
        <Button className="mt-2" variant="outline">
          Update Password
        </Button>
      </div>
    </div>
  );
}
