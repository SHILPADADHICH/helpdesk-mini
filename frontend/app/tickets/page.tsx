"use client";

import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
          <div className="text-lg">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">
            You need to be logged in to view tickets.
          </p>
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
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
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Tickets</h1>
          {["agent", "admin"].includes(user.role) && (
            <Button asChild>
              <Link href="/tickets/new">Create Ticket</Link>
            </Button>
          )}
        </div>

        {/* Filters */}
        <Card>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={filters.priority}
                  onChange={(e) =>
                    handleFilterChange("priority", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  placeholder="Search tickets..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilters({ status: "", priority: "", search: "" });
                    setCurrentPage(0);
                  }}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Tickets List */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading tickets...</div>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.length === 0 ? (
              <Card>
                <CardContent>
                  <div className="text-center py-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No tickets found
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {Object.values(filters).some((f) => f)
                        ? "Try adjusting your filters"
                        : "No tickets have been created yet"}
                    </p>
                    {["agent", "admin"].includes(user.role) && (
                      <Button asChild>
                        <Link href="/tickets/new">Create First Ticket</Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              tickets.map((ticket) => (
                <Card
                  key={ticket._id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Link href={`/tickets/${ticket._id}`}>
                            <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                              {ticket.title}
                            </h3>
                          </Link>
                          <span
                            className={`px-2 py-1 text-xs rounded ${getStatusColor(
                              ticket.status
                            )}`}
                          >
                            {ticket.status.replace("_", " ")}
                          </span>
                          <span
                            className={`px-2 py-1 text-xs rounded ${getPriorityColor(
                              ticket.priority
                            )}`}
                          >
                            {ticket.priority}
                          </span>
                          {isSLABreached(ticket.slaDeadline) && (
                            <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-800">
                              SLA Breached
                            </span>
                          )}
                        </div>

                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                          {ticket.description}
                        </p>

                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Created by {ticket.createdBy.name}</span>
                          <span>•</span>
                          <span>{formatDate(ticket.createdAt)}</span>
                          {ticket.assignedTo && (
                            <>
                              <span>•</span>
                              <span>Assigned to {ticket.assignedTo.name}</span>
                            </>
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
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing page {currentPage + 1}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={handlePrevPage}
                disabled={currentPage === 0}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={handleNextPage}
                disabled={!hasNext}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
