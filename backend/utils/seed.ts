import bcrypt from "bcryptjs";
import User from "../database/models/User";
import Ticket from "../database/models/Ticket";
import Comment from "../database/models/Comment";
import TimelineLog from "../database/models/TimelineLog";
import connectDB from "../database/connection/mongoose";

export const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await User.deleteMany({});
    await Ticket.deleteMany({});
    await Comment.deleteMany({});
    await TimelineLog.deleteMany({});

    console.log("Cleared existing data");

    // Create test users
    const admin = new User({
      email: "admin@test.com",
      password: await bcrypt.hash("admin123", 12),
      name: "Admin User",
      role: "admin",
    });

    const agent = new User({
      email: "agent@test.com",
      password: await bcrypt.hash("agent123", 12),
      name: "Support Agent",
      role: "agent",
    });

    const user = new User({
      email: "user@test.com",
      password: await bcrypt.hash("user123", 12),
      name: "Regular User",
      role: "user",
    });

    await Promise.all([admin.save(), agent.save(), user.save()]);

    console.log("Created test users");

    // Create sample tickets
    const tickets = [
      {
        title: "Login issue with mobile app",
        description: "Unable to login to mobile app. Getting error message.",
        priority: "high",
        createdBy: user._id,
        assignedTo: agent._id,
      },
      {
        title: "Password reset not working",
        description: "Password reset email is not being sent.",
        priority: "critical",
        createdBy: user._id,
      },
      {
        title: "Feature request: Dark mode",
        description: "Would love to have a dark mode option in the settings.",
        priority: "low",
        createdBy: user._id,
      },
      {
        title: "Database performance issue",
        description: "Reports are taking too long to generate. Need optimization.",
        priority: "medium",
        createdBy: admin._id,
        assignedTo: agent._id,
      },
    ];

    const savedTickets = await Ticket.insertMany(tickets);
    console.log("Created sample tickets");

    // Create sample comments
    const comments = [
      {
        ticketId: savedTickets[0]._id,
        content: "I'm experiencing this issue on iOS 15. Any updates?",
        author: user._id,
      },
      {
        ticketId: savedTickets[0]._id,
        content: "Thanks for reporting. We're investigating this issue.",
        author: agent._id,
      },
      {
        ticketId: savedTickets[1]._id,
        content: "This is urgent for our team. Please prioritize.",
        author: user._id,
      },
      {
        ticketId: savedTickets[2]._id,
        content: "Great suggestion! We'll add this to our roadmap.",
        author: admin._id,
      },
    ];

    await Comment.insertMany(comments);
    console.log("Created sample comments");

    // Create timeline logs
    const timelineLogs = [
      {
        ticketId: savedTickets[0]._id,
        action: "ticket_assigned",
        description: "Ticket assigned to Support Agent",
        userId: admin._id,
        metadata: { assignedTo: agent._id },
      },
      {
        ticketId: savedTickets[3]._id,
        action: "status_changed",
        description: "Status changed to in_progress",
        userId: agent._id,
        metadata: { newStatus: "in_progress" },
      },
    ];

    await TimelineLog.insertMany(timelineLogs);
    console.log("Created timeline logs");

    console.log("✅ Database seeded successfully!");
    console.log("\nTest credentials:");
    console.log("Admin: admin@test.com / admin123");
    console.log("Agent: agent@test.com / agent123");
    console.log("User: user@test.com / user123");

  } catch (error) {
    console.error("Seed error:", error);
  }
};

// Run seed if this file is executed directly
if (require.main === module) {
  seedDatabase().then(() => process.exit(0));
}
