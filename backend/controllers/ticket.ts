import { Request, Response } from "express";
import Ticket from "../database/models/Ticket";
import Comment from "../database/models/Comment";
import TimelineLog from "../database/models/TimelineLog";
import User from "../database/models/User";
import { AuthenticatedRequest } from "../middleware/auth";
import { PaginatedRequest } from "../middleware/pagination";

export const createTicket = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, description, priority = "medium", assignedTo } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        error: {
          code: "FIELD_REQUIRED",
          field: !title ? "title" : "description",
          message: `${!title ? "Title" : "Description"} is required`,
        },
      });
    }

    const ticketData: any = {
      title,
      description,
      priority,
      createdBy: req.user._id,
      version: 0,
    };

    if (assignedTo) {
      // Verify assignee exists and is an agent or admin
      const assignee = await User.findById(assignedTo);
      if (!assignee) {
        return res.status(404).json({
          error: {
            code: "USER_NOT_FOUND",
            message: "Assigned user not found",
          },
        });
      }
      if (!["agent", "admin"].includes(assignee.role)) {
        return res.status(400).json({
          error: {
            code: "INVALID_ASSIGNEE",
            message: "Only agents and admins can be assigned tickets",
          },
        });
      }
      ticketData.assignedTo = assignedTo;
    }

    const ticket = new Ticket(ticketData);
    await ticket.save();

    // Log timeline
    await TimelineLog.create({
      ticketId: ticket._id,
      action: "ticket_created",
      description: `Ticket "${title}" created`,
      userId: req.user._id,
      metadata: { priority, assignedTo },
    });

    res.status(201).json({
      ticket: await Ticket.findById(ticket._id)
        .populate("createdBy", "name email")
        .populate("assignedTo", "name email"),
      message: "Ticket created successfully",
    });
  } catch (error) {
    console.error("Create ticket error:", error);
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to create ticket",
      },
    });
  }
};

export const getTickets = async (
  req: PaginatedRequest & AuthenticatedRequest,
  res: Response
) => {
  try {
    const { status, priority, assignedTo, search } = req.query;
    const { limit, offset } = req.pagination!;

    // Build filter
    const filter: any = {};

    // If user is not admin/agent, only show their tickets
    if (!["admin", "agent"].includes(req.user.role)) {
      filter.$or = [
        { createdBy: req.user._id },
        { assignedTo: req.user._id },
      ];
    }

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;

    // Search functionality
    if (search) {
      const searchRegex = new RegExp(search as string, "i");
      filter.$and = [
        {
          $or: [
            { title: searchRegex },
            { description: searchRegex },
            // Search in latest comment content
          ],
        },
      ];

      // Also search in comments
      const commentsWithMatch = await Comment.find({
        content: searchRegex,
      }).select("ticketId");
      
      if (commentsWithMatch.length > 0) {
        const ticketIds = commentsWithMatch.map(c => c.ticketId);
        filter.$and[0].$or.push({ _id: { $in: ticketIds } });
      }
    }

    const tickets = await Ticket.find(filter)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset);

    const totalCount = await Ticket.countDocuments(filter);
    const nextOffset = offset + limit < totalCount ? offset + limit : null;

    res.status(200).json({
      tickets,
      pagination: {
        limit,
        offset,
        total: totalCount,
        next_offset: nextOffset,
      },
      message: "Tickets retrieved successfully",
    });
  } catch (error) {
    console.error("Get tickets error:", error);
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to retrieve tickets",
      },
    });
  }
};

export const getTicket = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findById(id)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email");

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
          message: "You don't have permission to view this ticket",
        },
      });
    }

    res.status(200).json({
      ticket,
      message: "Ticket retrieved successfully",
    });
  } catch (error) {
    console.error("Get ticket error:", error);
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to retrieve ticket",
      },
    });
  }
};

export const updateTicket = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Get current ticket for optimistic locking
    const currentTicket = await Ticket.findById(id);
    if (!currentTicket) {
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
      currentTicket.createdBy._id.toString() !== req.user._id.toString() &&
      currentTicket.assignedTo?._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        error: {
          code: "FORBIDDEN",
          message: "You don't have permission to update this ticket",
        },
      });
    }

    // Optimistic locking check
    if (
      updates.version !== undefined &&
      updates.version !== currentTicket.version
    ) {
      return res.status(409).json({
        error: {
          code: "CONFLICT",
          message: "Ticket has been updated by another user. Please refresh and try again.",
        },
      });
    }

    // Remove version from updates to avoid conflicts
    delete updates.version;

    // Check if assigning to someone
    if (updates.assignedTo) {
      const assignee = await User.findById(updates.assignedTo);
      if (!assignee) {
        return res.status(404).json({
          error: {
            code: "USER_NOT_FOUND",
            message: "Assigned user not found",
          },
        });
      }
      if (!["agent", "admin"].includes(assignee.role)) {
        return res.status(400).json({
          error: {
            code: "INVALID_ASSIGNEE",
            message: "Only agents and admins can be assigned tickets",
          },
        });
      }
    }

    // Update ticket
    const updatedTicket = await Ticket.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate("createdBy", "name email").populate("assignedTo", "name email");

    // Log significant changes
    const changes = [];
    if (updates.status) changes.push(`status changed to ${updates.status}`);
    if (updates.priority) changes.push(`priority changed to ${updates.priority}`);
    if (updates.assignedTo) {
      const assignee = await User.findById(updates.assignedTo);
      if (assignee) {
        changes.push(`assigned to ${assignee.name}`);
      }
    }

    if (changes.length > 0) {
      await TimelineLog.create({
        ticketId: id,
        action: "ticket_updated",
        description: changes.join(", "),
        userId: req.user._id,
        metadata: updates,
      });
    }

    res.status(200).json({
      ticket: updatedTicket,
      message: "Ticket updated successfully",
    });
  } catch (error: any) {
    console.error("Update ticket error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        error: {
          code: "INVALID_ID",
          message: "Invalid ticket ID",
        },
      });
    }
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to update ticket",
      },
    });
  }
};

export const getBreachedTickets = async (
  req: PaginatedRequest & AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!["admin", "agent"].includes(req.user.role)) {
      return res.status(403).json({
        error: {
          code: "FORBIDDEN",
          message: "Only agents and admins can view breached tickets",
        },
      });
    }

    const { limit, offset } = req.pagination!;
    const now = new Date();

    const breachedTickets = await Ticket.find({
      status: { $in: ["open", "in_progress"] },
      slaDeadline: { $lt: now },
    })
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .sort({ slaDeadline: 1 })
      .limit(limit)
      .skip(offset);

    const totalCount = await Ticket.countDocuments({
      status: { $in: ["open", "in_progress"] },
      slaDeadline: { $lt: now },
    });

    const nextOffset = offset + limit < totalCount ? offset + limit : null;

    res.status(200).json({
      tickets: breachedTickets,
      pagination: {
        limit,
        offset,
        total: totalCount,
        next_offset: nextOffset,
      },
      message: "Breached tickets retrieved successfully",
    });
  } catch (error) {
    console.error("Get breached tickets error:", error);
    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to retrieve breached tickets",
      },
    });
  }
};
