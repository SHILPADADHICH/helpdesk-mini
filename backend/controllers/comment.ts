import { Request, Response } from "express";
import Comment from "../database/models/Comment";
import Ticket from "../database/models/Ticket";
import TimelineLog from "../database/models/TimelineLog";
import { AuthenticatedRequest } from "../middleware/auth";
import { PaginatedRequest } from "../middleware/pagination";

export const createComment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { ticketId } = req.params;
    const { content, parentComment } = req.body;

    if (!content) {
      return res.status(400).json({
        error: {
          code: "FIELD_REQUIRED",
          field: "content",
          message: "Content is required",
        },
      });
    }

    // Verify ticket exists
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({
        error: {
          code: "TICKET_NOT_FOUND",
          message: "Ticket not found",
        },
      });
    }

    // Check permissions
    if (
      !["admin", "agent"].includes(req.user.role) &&
      ticket.createdBy._id.toString() !== req.user._id.toString() &&
      ticket.assignedTo?._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        error: {
          code: "FORBIDDEN",
          message: "You don't have permission to comment on this ticket",
        },
      });
    }

    // If parentComment is provided, verify it exists and belongs to the same ticket
    if (parentComment) {
      const parentCommentDoc = await Comment.findById(parentComment);
      if (
        !parentCommentDoc ||
        parentCommentDoc.ticketId.toString() !== ticketId
      ) {
        return res.status(400).json({
          error: {
            code: "INVALID_PARENT_COMMENT",
            message: "Invalid parent comment",
          },
        });
      }
    }

    const comment = new Comment({
      ticketId,
      content,
      author: req.user._id,
      parentComment: parentComment || undefined,
    });

    await comment.save();

    // Populate author info
    await comment.populate("author", "name email");

    // Log timeline
    await TimelineLog.create({
      ticketId,
      action: parentComment ? "reply_added" : "comment_added",
      description: parentComment
        ? "Reply added to comment"
        : "Comment added to ticket",
      userId: req.user._id,
      metadata: { commentId: comment._id, parentComment },
    });

    res.status(201).json({
      comment,
      message: "Comment created successfully",
    });
  } catch (error) {
    console.error("Create comment error:", error);
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to create comment",
      },
    });
  }
};

export const getComments = async (
  req: PaginatedRequest & AuthenticatedRequest,
  res: Response
) => {
  try {
    const { ticketId } = req.params;
    const { limit, offset } = req.pagination!;

    // Verify ticket exists
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({
        error: {
          code: "TICKET_NOT_FOUND",
          message: "Ticket not found",
        },
      });
    }

    // Check permissions
    if (
      !["admin", "agent"].includes(req.user.role) &&
      ticket.createdBy._id.toString() !== req.user._id.toString() &&
      ticket.assignedTo?._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        error: {
          code: "FORBIDDEN",
          message: "You don't have permission to view comments on this ticket",
        },
      });
    }

    const comments = await Comment.find({ ticketId })
      .populate("author", "name email")
      .populate("parentComment")
      .sort({ createdAt: 1 })
      .limit(limit)
      .skip(offset);

    const totalCount = await Comment.countDocuments({ ticketId });
    const nextOffset = offset + limit < totalCount ? offset + limit : null;

    res.status(200).json({
      comments,
      pagination: {
        limit,
        offset,
        total: totalCount,
        next_offset: nextOffset,
      },
      message: "Comments retrieved successfully",
    });
  } catch (error) {
    console.error("Get comments error:", error);
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to retrieve comments",
      },
    });
  }
};

export const getTimeline = async (
  req: PaginatedRequest & AuthenticatedRequest,
  res: Response
) => {
  try {
    const { ticketId } = req.params;
    const { limit, offset } = req.pagination!;

    // Verify ticket exists
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({
        error: {
          code: "TICKET_NOT_FOUND",
          message: "Ticket not found",
        },
      });
    }

    // Check permissions
    if (
      !["admin", "agent"].includes(req.user.role) &&
      ticket.createdBy._id.toString() !== req.user._id.toString() &&
      ticket.assignedTo?._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        error: {
          code: "FORBIDDEN",
          message: "You don't have permission to view timeline for this ticket",
        },
      });
    }

    const timeline = await TimelineLog.find({ ticketId })
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset);

    const totalCount = await TimelineLog.countDocuments({ ticketId });
    const nextOffset = offset + limit < totalCount ? offset + limit : null;

    res.status(200).json({
      timeline,
      pagination: {
        limit,
        offset,
        total: totalCount,
        next_offset: nextOffset,
      },
      message: "Timeline retrieved successfully",
    });
  } catch (error) {
    console.error("Get timeline error:", error);
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to retrieve timeline",
      },
    });
  }
};
