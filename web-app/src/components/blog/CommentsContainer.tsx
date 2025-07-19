import React from "react";

const CommentsContainer = () => {
  return (
    <div>
      <div className="space-y-4">
        <div className="border rounded-lg p-4">
          <p className="font-medium">Alex</p>
          <p className="text-sm text-muted-foreground">
            Great post! Really helpful.
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="font-medium">Sam</p>
          <p className="text-sm text-muted-foreground">
            Waiting for the full version with CMS integration.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommentsContainer;
