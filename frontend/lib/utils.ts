import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatRelativeTime(date: string | Date) {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

export function getPriorityColor(priority: string) {
  switch (priority) {
    case "critical":
      return "text-red-600 bg-red-50";
    case "high":
      return "text-orange-600 bg-orange-50";
    case "medium":
      return "text-yellow-600 bg-yellow-50";
    case "low":
      return "text-green-600 bg-green-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
}

export function getStatusColor(status: string) {
  switch (status) {
    case "open":
      return "text-blue-600 bg-blue-50";
    case "in_progress":
      return "text-purple-600 bg-purple-50";
    case "resolved":
      return "text-green-600 bg-green-50";
    case "closed":
      return "text-gray-600 bg-gray-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
}

export function isSLABreached(slaDeadline: string) {
  return new Date() > new Date(slaDeadline);
}

export function getSLATimeRemaining(slaDeadline: string) {
  const now = new Date();
  const deadline = new Date(slaDeadline);
  const diffInHours = Math.floor((deadline.getTime() - now.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 0) return "Overdue";
  if (diffInHours < 1) return "Due soon";
  if (diffInHours < 24) return `${diffInHours}h remaining`;
  return `${Math.floor(diffInHours / 24)}d remaining`;
}