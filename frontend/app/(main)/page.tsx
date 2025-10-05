"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FloatingShapes, GradientOrb } from "@/components/ui/illustrations";
import Link from "next/link";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace("/tickets");
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <div className="text-lg text-muted-foreground">Loading...</div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="gradient-animated absolute inset-0 opacity-10"></div>
        <div className="relative z-10 text-center py-20">
          <h1 className="text-6xl font-bold mb-6 text-gradient">
            Welcome to HelpDesk Mini
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Efficiently manage support tickets, track SLA compliance, and
            maintain comprehensive audit trails. Built for modern teams who
            demand excellence in customer support.
          </p>
          <div className="flex justify-center space-x-4 mb-12">
            <Button asChild size="lg" className="shadow-purple-lg hover-lift">
              <Link href="/register">Get Started</Link>
            </Button>
            <Button
              variant="outline"
              asChild
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-white"
            >
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gradient">
          Why Choose HelpDesk Mini?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="gradient-card hover-lift shadow-purple">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Smart Ticket Management
              </h3>
              <p className="text-muted-foreground">
                Organize, prioritize, and track support tickets with intelligent
                categorization and automated workflows.
              </p>
            </CardContent>
          </Card>

          <Card className="gradient-card hover-lift shadow-purple">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 gradient-secondary rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">SLA Monitoring</h3>
              <p className="text-muted-foreground">
                Real-time SLA tracking with automated alerts and breach
                notifications to ensure service excellence.
              </p>
            </CardContent>
          </Card>

          <Card className="gradient-card hover-lift shadow-purple">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 gradient-accent rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Complete Audit Trail
              </h3>
              <p className="text-muted-foreground">
                Comprehensive logging and audit trails for compliance,
                accountability, and process improvement.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16">
        <Card className="gradient-primary text-white text-center shadow-purple-lg">
          <CardContent className="p-12">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Support?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of teams already using HelpDesk Mini to deliver
              exceptional customer support.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-white text-primary hover:bg-white/90 shadow-lg"
            >
              <Link href="/register">Start Your Free Trial</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
