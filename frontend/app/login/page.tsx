"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
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

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Starting login process...");
      console.log("Email:", email);
      console.log("Password:", password);

      const userData = await login(email, password);
      console.log("Login successful, user data:", userData);

      // Only redirect if we have user data
      if (userData) {
        console.log("Redirecting to /tickets");
        router.push("/tickets");
      } else {
        console.log("No user data received");
        setError("Login successful but no user data received");
      }
    } catch (err: unknown) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : "Login failed");
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
            Sign in to your account
          </p>
        </div>

        <Card className="gradient-card shadow-purple-lg border-white/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gradient">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your credentials to access your dashboard
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

              <Button
                type="submit"
                className="w-full gradient-primary hover:opacity-90 shadow-purple-lg hover-lift"
                disabled={loading}
                size="lg"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Create one now
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card border-white/20">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-center mb-4 text-gradient">
              Test Credentials
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                <span className="font-medium">Admin:</span>
                <span className="text-muted-foreground">
                  admin@mail.com / admin123
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                <span className="font-medium">Agent:</span>
                <span className="text-muted-foreground">
                  agent@test.com / agent123
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                <span className="font-medium">User:</span>
                <span className="text-muted-foreground">
                  user@test.com / user123
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
