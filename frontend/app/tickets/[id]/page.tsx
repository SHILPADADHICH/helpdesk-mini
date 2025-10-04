"use client";

import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import {
  Comment,
  commentsApi,
  Ticket,
  ticketsApi,
  TimelineLog,
} from "@/lib/api";
import {
  formatDate,
  formatRelativeTime,
  getPriorityColor,
  getSLATimeRemaining,
  getStatusColor,
  isSLABreached,
} from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function TicketDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [timeline, setTimeline] = useState<TimelineLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newComment, setNewComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);
  const [showComments, setShowComments] = useState(true);
  const [showTimeline, setShowTimeline] = useState(true);

  const loadTicketData = useCallback(async () => {
    setLoading(true);
    try {
      const [ticketResponse, commentsResponse, timelineResponse] =
        await Promise.all([
          ticketsApi.getTicket(id as string),
          commentsApi.getComments(id as string),
          commentsApi.getTimeline(id as string),
        ]);

      setTicket((ticketResponse as unknown as { ticket: Ticket }).ticket);
      setComments(
        (commentsResponse as unknown as { comments: Comment[] }).comments
      );
      setTimeline(
        (timelineResponse as unknown as { timeline: TimelineLog[] }).timeline
      );
    } catch (err: unknown) {
      setError(
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { error?: { message?: string } } } })
              .response?.data?.error?.message || "Failed to load ticket data"
          : "Failed to load ticket data"
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!authLoading && user) {
      loadTicketData();
    }
  }, [authLoading, user, id, loadTicketData]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setAddingComment(true);
    try {
      await commentsApi.createComment(id as string, { content: newComment });
      setNewComment("");
      await loadTicketData(); // Reload to get updated comments and timeline
    } catch (err: unknown) {
      setError(
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { error?: { message?: string } } } })
              .response?.data?.error?.message || "Failed to add comment"
          : "Failed to add comment"
      );
    } finally {
      setAddingComment(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await ticketsApi.updateTicket(id as string, {
        status: newStatus,
        version: ticket?.version,
      });
      await loadTicketData();
    } catch (err: unknown) {
      setError(
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { error?: { message?: string } } } })
              .response?.data?.error?.message || "Failed to update ticket"
          : "Failed to update ticket"
      );
    }
  };

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
            <button onClick={() => router.push("/login")}>Login</button>
          </Button>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading ticket...</div>
        </div>
      </Layout>
    );
  }

  if (error && !ticket) {
    return (
      <Layout>
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </Layout>
    );
  }

  if (!ticket) {
    return (
      <Layout>
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold mb-4">Ticket Not Found</h1>
          <p className="text-gray-600 mb-4">
            The ticket you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button onClick={() => router.push("/tickets")}>
            Back to Tickets
          </Button>
        </div>
      </Layout>
    );
  }

  // Check permissions
  const canEdit =
    ["agent", "admin"].includes(user.role) ||
    ticket.createdBy._id === user._id ||
    ticket.assignedTo?._id === user._id;

  const slaBreached = isSLABreached(ticket.slaDeadline);
  const slaStatus = slaBreached
    ? "Overdue"
    : getSLATimeRemaining(ticket.slaDeadline);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {ticket.title}
            </h1>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>#{ticket._id.slice(-8)}</span>
              <span>•</span>
              <span>Created {formatRelativeTime(ticket.createdAt)}</span>
              <span>•</span>
              <span>by {ticket.createdBy.name}</span>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => router.back()}>
              Back
            </Button>
            <Button variant="outline" onClick={() => router.push("/tickets")}>
              All Tickets
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Ticket Info */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{ticket.title}</CardTitle>
                <CardDescription>
                  Created by {ticket.createdBy.name} •{" "}
                  {formatDate(ticket.createdAt)}
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <span
                  className={`px-3 py-1 text-sm rounded-full ${getStatusColor(
                    ticket.status
                  )}`}
                >
                  {ticket.status.replace("_", " ")}
                </span>
                <span
                  className={`px-3 py-1 text-sm rounded-full ${getPriorityColor(
                    ticket.priority
                  )}`}
                >
                  {ticket.priority}
                </span>
                {slaBreached && (
                  <span className="px-3 py-1 text-sm rounded-full bg-red-100 text-red-800">
                    SLA Breached
                  </span>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {ticket.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Priority</h4>
                  <p
                    className={`text-sm px-2 py-1 rounded ${getPriorityColor(
                      ticket.priority
                    )}`}
                  >
                    {ticket.priority}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Status</h4>
                  <p
                    className={`text-sm px-2 py-1 rounded ${getStatusColor(
                      ticket.status
                    )}`}
                  >
                    {ticket.status.replace("_", " ")}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">SLA Status</h4>
                  <p
                    className={`text-sm px-2 py-1 rounded ${
                      slaBreached
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {slaStatus}
                  </p>
                </div>
              </div>

              {ticket.assignedTo && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    Assigned To
                  </h4>
                  <p className="text-gray-700">{ticket.assignedTo.name}</p>
                </div>
              )}

              {canEdit && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Quick Actions
                  </h4>
                  <div className="flex space-x-2">
                    <select
                      value={ticket.status}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className="px-3 py-1 text-sm border rounded"
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Comments ({comments.length})</span>
              <Button
                variant="ghost"
                onClick={() => setShowComments(!showComments)}
              >
                {showComments ? "Hide" : "Show"}
              </Button>
            </CardTitle>
          </CardHeader>
          {showComments && (
            <CardContent>
              <div className="space-y-4">
                {/* Add Comment Form */}
                <form onSubmit={handleAddComment} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Add Comment
                  </label>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Write your comment here..."
                    disabled={addingComment}
                  />
                  <Button
                    type="submit"
                    disabled={addingComment || !newComment.trim()}
                  >
                    {addingComment ? "Adding..." : "Add Comment"}
                  </Button>
                </form>

                {/* Comments List */}
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment._id} className="border-l-2 pl-4 py-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                        <span className="font-medium">
                          {comment.author.name}
                        </span>
                        <span>•</span>
                        <span>{formatRelativeTime(comment.createdAt)}</span>
                      </div>
                      <p className="text-gray-800 whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </div>
                  ))}
                  {comments.length === 0 && (
                    <p className="text-gray-500 italic">No comments yet.</p>
                  )}
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Timeline Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Timeline ({timeline.length})</span>
              <Button
                variant="ghost"
                onClick={() => setShowTimeline(!showTimeline)}
              >
                {showTimeline ? "Hide" : "Show"}
              </Button>
            </CardTitle>
          </CardHeader>
          {showTimeline && (
            <CardContent>
              <div className="space-y-3">
                {timeline.map((log) => (
                  <div key={log._id} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                        <span className="font-medium">{log.userId.name}</span>
                        <span>•</span>
                        <span>{formatRelativeTime(log.createdAt)}</span>
                      </div>
                      <p className="text-gray-800">{log.action}</p>
                      <p className="text-gray-600 text-sm">{log.description}</p>
                    </div>
                  </div>
                ))}
                {timeline.length === 0 && (
                  <p className="text-gray-500 italic">
                    No timeline entries yet.
                  </p>
                )}
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </Layout>
  );
}
