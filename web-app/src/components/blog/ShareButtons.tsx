"use client";

import { Button } from "@/components/ui/button";
import {
  IconBrandX,
  IconBrandLinkedin,
  IconCopy,
} from "@tabler/icons-react";

export function ShareButtons() {
  return (
    <div className="flex items-center gap-3 text-sm text-muted-foreground">
      <p className="font-medium">Share:</p>

      {/* X Button */}
      <Button
        variant="outline"
        className="flex items-center gap-2 rounded-md px-3 py-2 bg-[#00000008] text-black border border-transparent hover:border-black hover:bg-black hover:text-white transition-all"
      >
        <IconBrandX size={16} stroke={2} />
        Post on X
      </Button>

      {/* LinkedIn Button */}
      <Button
        variant="outline"
        className="flex items-center gap-2 rounded-md px-3 py-2 bg-[#0077B509] text-[#0077B5] border border-transparent hover:border-[#0077B5] hover:bg-[#0077B5] hover:text-white transition-all"
      >
        <IconBrandLinkedin size={16} stroke={2} />
        LinkedIn
      </Button>

      {/* Copy Link Button */}
      <Button
        variant="outline"
        className="flex items-center gap-2 rounded-md px-3 py-2 bg-gray-100 text-gray-600 border border-transparent hover:border-gray-600 hover:bg-white hover:text-black transition-all"
      >
        <IconCopy size={16} stroke={2} />
        Copy Link
      </Button>
    </div>
  );
}
