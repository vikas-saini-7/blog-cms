"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Download,
  Users,
  ExternalLink,
  FileText,
  Search,
  RefreshCw,
  Mail,
} from "lucide-react";
import { getMyFollowers, exportFollowers } from "@/actions/follower.actions";
import { toast } from "sonner";

type Follower = {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  followedAt: Date;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  designation?: string;
  contentPreferences: string[];
};

type FollowersResponse = {
  success: boolean;
  message?: string;
  followers: Follower[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

type ExportResponse =
  | {
      success: true;
      data: string;
      filename: string;
    }
  | {
      success: false;
      message: string;
    };

export default function MyFollowersPage() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchFollowers = useCallback(
    async (showRefreshing = false) => {
      if (showRefreshing) setRefreshing(true);
      else setLoading(true);

      try {
        const result = (await getMyFollowers({
          page: currentPage,
          limit: 7,
          search,
          sortBy: sortBy as "newest" | "oldest",
        })) as FollowersResponse;

        if (result.success) {
          setFollowers(result.followers);
          setTotalPages(result.pagination.totalPages);
          setTotalCount(result.pagination.totalCount);
        } else {
          toast.error(result.message || "Failed to fetch followers");
          setFollowers([]);
          setTotalCount(0);
        }
      } catch (error) {
        console.error("Failed to fetch followers:", error);
        toast.error("Failed to load followers");
        setFollowers([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [currentPage, search, sortBy]
  );

  useEffect(() => {
    fetchFollowers();
  }, [fetchFollowers]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleRefresh = () => {
    fetchFollowers(true);
  };

  const handleExport = async (format: "csv" | "json") => {
    setExporting(true);
    try {
      const result = (await exportFollowers(format)) as ExportResponse;

      if (result.success) {
        const blob = new Blob([result.data], {
          type: format === "csv" ? "text/csv" : "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = result.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success(`Followers exported as ${format.toUpperCase()}`);
      } else {
        toast.error(result.message || "Export failed");
      }
    } catch (error) {
      toast.error("Export failed");
    } finally {
      setExporting(false);
    }
  };

  const getDesignationColor = (designation?: string) => {
    const colors = {
      DEVELOPER: "bg-blue-100 text-blue-800",
      DESIGNER: "bg-purple-100 text-purple-800",
      ENTREPRENEUR: "bg-green-100 text-green-800",
      STUDENT: "bg-yellow-100 text-yellow-800",
      OTHER: "bg-gray-100 text-gray-800",
    };
    return colors[designation as keyof typeof colors] || colors.OTHER;
  };

  // Loading skeleton
  if (loading && followers.length === 0) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-gray-200 rounded-lg" />
          <div className="h-96 bg-gray-200 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">My Followers</h2>
          {/* <p className="text-sm text-gray-600">
            Manage and analyze your {totalCount.toLocaleString()} followers
          </p> */}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExport("csv")}
            disabled={exporting}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExport("json")}
            disabled={exporting}
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Export JSON
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Tabs value={sortBy} onValueChange={handleSortChange}>
          <TabsList className="bg-white">
            <TabsTrigger
              value="newest"
              className="data-[state=active]:bg-gray-200 border cursor-pointer"
            >
              Newest First
            </TabsTrigger>
            <TabsTrigger
              value="oldest"
              className="data-[state=active]:bg-gray-200 border cursor-pointer"
            >
              Oldest First
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by name, username, or email..."
            value={search}
            onChange={handleSearchChange}
            className="pl-10 bg-white"
          />
        </div>
      </div>

      {/* Content */}
      {followers.length === 0 ? (
        <div className="bg-white border rounded-lg p-12 text-center">
          <div className="space-y-3">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              {search ? "No followers match your search" : "No followers yet"}
            </h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              {search
                ? "Try adjusting your search terms to find what you're looking for."
                : "Start creating amazing content to gain followers!"}
            </p>
            {search && (
              <Button
                variant="outline"
                onClick={() => setSearch("")}
                className="mt-4"
              >
                Clear Search
              </Button>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-b bg-gray-50/50">
                  <TableHead className="w-16">Avatar</TableHead>
                  <TableHead className="w-40">Name</TableHead>
                  <TableHead className="w-32">Username</TableHead>
                  <TableHead className="w-48">Email</TableHead>
                  <TableHead className="w-28">Designation</TableHead>
                  <TableHead className="w-20 text-center">Posts</TableHead>
                  <TableHead className="w-20 text-center">Followers</TableHead>
                  <TableHead className="text-right w-20">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {followers.map((follower, index) => (
                  <TableRow
                    key={follower.id}
                    className={index % 2 === 0 ? "bg-gray-50/30" : ""}
                  >
                    <TableCell>
                      <Avatar className="h-10 w-10 border-2 border-gray-100">
                        <AvatarImage
                          src={follower.avatar}
                          alt={follower.name}
                        />
                        <AvatarFallback className="text-sm font-semibold bg-gray-100">
                          {follower.name[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>

                    <TableCell>
                      <p className="font-medium text-gray-900 truncate">
                        {follower.name}
                      </p>
                    </TableCell>

                    <TableCell>
                      <p className="text-sm text-gray-700 truncate">
                        @{follower.username}
                      </p>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Mail className="h-3 w-3 text-gray-400" />
                        <span className="truncate">{follower.email}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      {follower.designation ? (
                        <Badge
                          variant="secondary"
                          className={`${getDesignationColor(
                            follower.designation
                          )} text-xs`}
                        >
                          {follower.designation.replace("_", " ")}
                        </Badge>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <FileText className="h-3 w-3 text-gray-400" />
                        <span className="text-sm font-medium">
                          {follower.postsCount.toLocaleString()}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Users className="h-3 w-3 text-gray-400" />
                        <span className="text-sm font-medium">
                          {follower.followersCount.toLocaleString()}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        // size="icon"
                        // className="h-8 w-8"
                        onClick={() =>
                          window.open(
                            `https://pluma-web.vercel.app/authors/${follower.username}`,
                            "_blank"
                          )
                        }
                      >
                        <ExternalLink className="w-3 h-3" /> View Profile
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <div className="text-sm text-gray-600">
                Showing {(currentPage - 1) * 7 + 1} to{" "}
                {Math.min(currentPage * 7, totalCount)} of {totalCount} results
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </Button>

                {/* Page numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={
                          pageNum === currentPage ? "default" : "outline"
                        }
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
