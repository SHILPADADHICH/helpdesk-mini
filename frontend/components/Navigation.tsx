"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Navigation() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <nav className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-gray-900">
              HelpDesk Mini
            </Link>
            <div className="space-x-2">
              <Button variant="outline" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Register</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/tickets" className="text-xl font-bold text-gray-900">
            HelpDesk Mini
          </Link>

          <div className="flex items-center space-x-6">
            <div className="flex space-x-4">
              <Link
                href="/tickets"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Tickets
              </Link>
              {["agent", "admin"].includes(user.role) && (
                <>
                  <Link
                    href="/tickets/breached"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Breached SLA
                  </Link>
                  <Link
                    href="/tickets/new"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    New Ticket
                  </Link>
                </>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-sm">
                <div className="font-medium text-gray-900">{user.name}</div>
                <div
                  className={cn(
                    "text-xs",
                    user.role === "admin" && "text-red-600",
                    user.role === "agent" && "text-blue-600",
                    user.role === "user" && "text-gray-600"
                  )}
                >
                  {user.role.toUpperCase()}
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
