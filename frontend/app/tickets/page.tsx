"use client";

import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  EmptyTicketsIllustration,
  FloatingShapes,
} from "@/components/ui/illustrations";
import { useAuth } from "@/contexts/AuthContext";
import { Ticket, ticketsApi } from "@/lib/api";
import {
  formatDate,
  getPriorityColor,
  getStatusColor,
  isSLABreached,
} from "@/lib/utils";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export default function TicketsPage() {
  const { user, loading: authLoading } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    search: "",
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const limit = 20;

  const loadTickets = useCallback(
    async (offset = 0) => {
      setLoading(true);
      try {
        const response = await ticketsApi.getTickets({
          limit,
          offset,
          ...filters,
        });
        setTickets((response as unknown as { tickets: Ticket[] }).tickets);
        setHasNext(
          !!(
            response as unknown as {
              pagination?: { next_offset: number | null };
            }
          ).pagination?.next_offset
        );
        setCurrentPage(Math.floor(offset / limit));
      } catch (err: unknown) {
        setError(
          err && typeof err === "object" && "response" in err
            ? (
                err as {
                  response?: { data?: { error?: { message?: string } } };
                }
              ).response?.data?.error?.message || "Failed to load tickets"
            : "Failed to load tickets"
        );
      } finally {
        setLoading(false);
      }
    },
    [filters, limit]
  );

  useEffect(() => {
    if (!authLoading && user) {
      loadTickets();
    }
  }, [authLoading, user, filters, loadTickets]);

  if (authLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <div className="text-lg text-muted-foreground">Loading...</div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 gradient-primary rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-4 text-gradient">
              Access Required
            </h1>
            <p className="text-muted-foreground mb-8 text-lg">
              You need to be logged in to view tickets.
            </p>
            <Button
              asChild
              size="lg"
              className="gradient-primary shadow-purple-lg hover-lift"
            >
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(0);
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      loadTickets((currentPage - 1) * limit);
    }
  };

  const handleNextPage = () => {
    if (hasNext) {
      loadTickets((currentPage + 1) * limit);
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gradient mb-2">
              Support Tickets
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage and track all support requests
            </p>
          </div>
          {["agent", "admin"].includes(user.role) && (
            <Button
              asChild
              size="lg"
              className="gradient-primary shadow-purple-lg hover-lift"
            >
              <Link href="/tickets/new">Create Ticket</Link>
            </Button>
          )}
        </div>

        {/* Filters */}
        <Card className="gradient-card shadow-purple border-white/20">
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 py-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-background/50 backdrop-blur-sm"
                >
                  <option value="">All Statuses</option>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Priority
                </label>
                <select
                  value={filters.priority}
                  onChange={(e) =>
                    handleFilterChange("priority", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-background/50 backdrop-blur-sm"
                >
                  <option value="">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Search
                </label>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  placeholder="Search tickets..."
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-background/50 backdrop-blur-sm"
                />
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilters({ status: "", priority: "", search: "" });
                    setCurrentPage(0);
                  }}
                  className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center text-red-700">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tickets List */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <div className="text-lg text-muted-foreground">
                Loading tickets...
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {tickets.length === 0 ? (
              <Card className="gradient-card shadow-purple border-white/20 relative overflow-hidden">
                <FloatingShapes />
                <CardContent>
                  <div className="text-center py-16 relative z-10">
                    <div className="w-48 h-48 mx-auto mb-8 animate-fade-in">
                      <EmptyTicketsIllustration />
                    </div>
                    <h3 className="text-3xl font-semibold mb-4 text-gradient animate-slide-up">
                      No tickets found
                    </h3>
                    <p
                      className="text-muted-foreground mb-8 text-lg animate-slide-up"
                      style={{ animationDelay: "0.2s" }}
                    >
                      {Object.values(filters).some((f) => f)
                        ? "Try adjusting your filters to find what you're looking for"
                        : "Start by creating your first support ticket"}
                    </p>
                    {["agent", "admin"].includes(user.role) && (
                      <div
                        className="animate-slide-up"
                        style={{ animationDelay: "0.4s" }}
                      >
                        <Button
                          asChild
                          size="lg"
                          className="gradient-primary shadow-purple-lg hover-lift interactive-hover"
                        >
                          <Link href="/tickets/new">Create First Ticket</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              tickets.map((ticket, index) => (
                <Card
                  key={ticket._id}
                  className="gradient-card hover-lift shadow-purple border-white/20 transition-all duration-200 interactive-hover animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <Link href={`/tickets/${ticket._id}`}>
                            <h3 className="font-semibold text-lg text-foreground hover:text-primary transition-colors">
                              {ticket.title}
                            </h3>
                          </Link>
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                              ticket.status
                            )}`}
                          >
                            {ticket.status.replace("_", " ")}
                          </span>
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                              ticket.priority
                            )}`}
                          >
                            {ticket.priority}
                          </span>
                          {isSLABreached(ticket.slaDeadline) && (
                            <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 border border-red-200">
                              SLA Breached
                            </span>
                          )}
                        </div>

                        <p className="text-muted-foreground mb-4 line-clamp-2">
                          {ticket.description}
                        </p>

                        <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-2">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            <span>Created by {ticket.createdBy.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span>{formatDate(ticket.createdAt)}</span>
                          </div>
                          {ticket.assignedTo && (
                            <div className="flex items-center space-x-2">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <span>Assigned to {ticket.assignedTo.name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Pagination */}
        {tickets.length > 0 && (
          <Card className="gradient-card shadow-purple border-white/20">
            <CardContent>
              <div className="flex justify-between items-center py-4">
                <div className="text-muted-foreground">
                  Showing page {currentPage + 1}
                </div>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={handlePrevPage}
                    disabled={currentPage === 0}
                    className="border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleNextPage}
                    disabled={!hasNext}
                    className="border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
