"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LoginIllustration,
  FloatingShapes,
} from "@/components/ui/illustrations";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await register(email, password, name, role);
      router.push("/tickets");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-animated flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <FloatingShapes />
      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center animate-fade-in">
          <div className="w-32 h-32 mx-auto mb-6 animate-scale-in">
            <LoginIllustration />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 animate-slide-up">
            HelpDesk Mini
          </h1>
          <p
            className="text-white/80 text-lg animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            Create your account
          </p>
        </div>

        <Card className="gradient-card shadow-purple-lg border-white/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gradient">
              Join Our Team
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your information to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-foreground"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-background/50 backdrop-blur-sm"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-background/50 backdrop-blur-sm"
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-foreground"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-background/50 backdrop-blur-sm"
                  placeholder="Enter your password"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-foreground"
                >
                  Role
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-background/50 backdrop-blur-sm"
                >
                  <option value="user">User</option>
                  <option value="agent">Agent</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <Button
                type="submit"
                className="w-full gradient-primary hover:opacity-90 shadow-purple-lg hover-lift"
                disabled={loading}
                size="lg"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating account...</span>
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card border-white/20">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-center mb-4 text-gradient">
              Role Information
            </h3>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-background/50 rounded-lg">
                <div className="font-medium text-primary mb-1">👤 User</div>
                <div className="text-muted-foreground">
                  Submit and track support tickets
                </div>
              </div>
              <div className="p-3 bg-background/50 rounded-lg">
                <div className="font-medium text-primary mb-1">🛠️ Agent</div>
                <div className="text-muted-foreground">
                  Manage tickets and respond to users
                </div>
              </div>
              <div className="p-3 bg-background/50 rounded-lg">
                <div className="font-medium text-primary mb-1">👑 Admin</div>
                <div className="text-muted-foreground">
                  Full system access and management
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
