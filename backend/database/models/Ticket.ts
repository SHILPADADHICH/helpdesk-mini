import mongoose, { Document, Schema } from "mongoose";

export interface ITicket extends Document {
  _id: string;
  title: string;
  description: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "critical";
  createdBy: mongoose.Types.ObjectId;
  assignedTo?: mongoose.Types.ObjectId;
  slaDeadline: Date;
  actualResolutionTime?: Date;
  version: number; // For optimistic locking
  createdAt: Date;
  updatedAt: Date;
}

const getSLADeadline = (priority: string): Date => {
  const now = new Date();
  const hours = {
    low: 72,
    medium: 24,
    high: 8,
    critical: 2,
  }[priority] || 24;
  
  return new Date(now.getTime() + hours * 60 * 60 * 1000);
};

const TicketSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "closed"],
      default: "open",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    slaDeadline: {
      type: Date,
      default: function() {
        return getSLADeadline(this.priority);
      }
    },
    actualResolutionTime: {
      type: Date,
    },
    version: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to set SLA deadline based on priority
TicketSchema.pre("save", function(next: any) {
  if (this.isNew || this.isModified("priority")) {
    this.slaDeadline = getSLADeadline(this.priority as string);
  }
  next();
});

// Pre-update middleware to increment version for optimistic locking
TicketSchema.pre("updateOne", function(next: any) {
  this.set({ version: (this.getQuery().version || 0) + 1 });
  next();
});

// Method to check if SLA is breached
TicketSchema.methods.isSLABreached = function(): boolean {
  if (this.status === "closed" || this.status === "resolved") {
    return false;
  }
  return new Date() > this.slaDeadline;
};

export default mongoose.model<ITicket>("Ticket", TicketSchema);
