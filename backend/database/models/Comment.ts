import mongoose, { Document, Schema } from "mongoose";

export interface IComment extends Document {
  _id: string;
  ticketId: mongoose.Types.ObjectId;
  content: string;
  author: mongoose.Types.ObjectId;
  parentComment?: mongoose.Types.ObjectId; // For threaded comments
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema: Schema = new Schema(
  {
    ticketId: {
      type: Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
    },
    content: {
      type: String,
      required: [true, "Comment content is required"],
      trim: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
CommentSchema.index({ ticketId: 1, createdAt: -1 });

export default mongoose.model<IComment>("Comment", CommentSchema);
