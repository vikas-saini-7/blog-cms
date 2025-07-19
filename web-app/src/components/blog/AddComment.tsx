"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const AddComment = () => {
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    // TODO: Add submission logic here
    console.log("Comment submitted:", comment);
    setComment("");
  };

  return (
    <div className="w-full mx-auto mt-6 mb-6">
      {/* <h3 className="text-lg font-semibold mb-2">Add a comment</h3> */}

      <Textarea
        placeholder="Write your comment here..."
        className="min-h-[120px] resize-none resize-y"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
    
      />

      <div className="flex justify- mt-3">
        <Button onClick={handleSubmit} disabled={!comment.trim()}>
          Post Comment
        </Button>
      </div>
    </div>
  );
};

export default AddComment;
