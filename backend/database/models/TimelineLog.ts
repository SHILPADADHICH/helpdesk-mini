import mongoose, { Document, Schema } from "mongoose";

export interface ITimelineLog extends Document {
  _id: string;
  ticketId: mongoose.Types.ObjectId;
  action: string;
  description: string;
  userId: mongoose.Types.ObjectId;
  metadata?: Record<string, any>;
  createdAt: Date;
}

const TimelineLogSchema: Schema = new Schema(
  {
    ticketId: {
      type: Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Index for efficient queries
TimelineLogSchema.index({ ticketId: 1, createdAt: -1 });

export default mongoose.model<ITimelineLog>("TimelineLog", TimelineLogSchema);
