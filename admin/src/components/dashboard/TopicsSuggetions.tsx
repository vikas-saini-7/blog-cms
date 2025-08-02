import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Sparkles, PenTool } from "lucide-react";
import { suggestTopics } from "@/actions/llm.actions";

const TopicsSuggetions = () => {
  const [topics, setTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTopics = async () => {
    setLoading(true);
    try {
      const topics = await suggestTopics();
      console.log(topics);
      setTopics(topics);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  return (
    <Card className="gap-2 border-purple-200 shadow-sm border-dashed">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-500" />
            AI Topic Suggestions
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchTopics}
            disabled={loading}
            className="h-7 px-2 hover:bg-primary/10 cursor-pointer"
          >
            <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 p-6 pt-4">
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-12 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : (
          topics.map((topic, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-3 px-3 rounded-lg border border-gray-100 hover:border-primary/20 hover:bg-purple-50/50 group transition-all duration-200 cursor-pointer"
            >
              <p className="text-sm text-gray-700 flex-1 font-medium">
                {topic}
              </p>
              {/* <Button
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-all duration-200 bg-primary text-white h-8 px-3 text-xs font-medium shadow-sm"
              >
                <PenTool className="h-3 w-3 mr-1.5" />
                Start Writing
              </Button> */}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default TopicsSuggetions;
