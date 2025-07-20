// page.tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="space-y-4 max-w-xl">
      <Input placeholder="Update Email" />
      <Input placeholder="Update Name" />
      <Input type="password" placeholder="Change Password" />
      <Button>Save Changes</Button>
    </div>
  );
}
