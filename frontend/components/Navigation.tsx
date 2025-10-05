"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Navigation() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <nav className="gradient-primary shadow-purple-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-2xl font-bold text-white hover:text-mauve transition-colors"
            >
              HelpDesk Mini
            </Link>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                asChild
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
              >
                <Link href="/login">Login</Link>
              </Button>
              <Button
                asChild
                className="bg-white text-primary hover:bg-white/90 shadow-purple"
              >
                <Link href="/register">Register</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="gradient-primary shadow-purple-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/tickets"
            className="text-2xl font-bold text-white hover:text-mauve transition-colors"
          >
            HelpDesk Mini
          </Link>

          <div className="flex items-center space-x-8">
            <div className="flex space-x-6">
              <Link
                href="/tickets"
                className="text-white/90 hover:text-white transition-colors font-medium relative group"
              >
                Tickets
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>
              </Link>
              {["agent", "admin"].includes(user.role) && (
                <>
                  <Link
                    href="/tickets/breached"
                    className="text-white/90 hover:text-white transition-colors font-medium relative group"
                  >
                    Breached SLA
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>
                  </Link>
                  <Link
                    href="/tickets/new"
                    className="text-white/90 hover:text-white transition-colors font-medium relative group"
                  >
                    New Ticket
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all group-hover:w-full"></span>
                  </Link>
                </>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-white/90">
                <div className="font-semibold">{user.name}</div>
                <div
                  className={cn(
                    "text-xs font-medium px-2 py-1 rounded-full",
                    user.role === "admin" && "bg-red-500/20 text-red-200",
                    user.role === "agent" && "bg-blue-500/20 text-blue-200",
                    user.role === "user" && "bg-white/20 text-white/80"
                  )}
                >
                  {user.role.toUpperCase()}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
