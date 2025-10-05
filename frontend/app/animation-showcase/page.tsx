"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  EmptyTicketsIllustration,
  LoginIllustration,
  SuccessIllustration,
  LoadingIllustration,
  ErrorIllustration,
  FloatingShapes,
  GradientOrb,
} from "@/components/ui/illustrations";
import {
  AnimatedTicketIcon,
  AnimatedUserIcon,
  AnimatedClockIcon,
  AnimatedCheckIcon,
  AnimatedAlertIcon,
  AnimatedStarIcon,
  AnimatedDots,
  AnimatedWave,
  AnimatedProgressBar,
} from "@/components/ui/animated-icons";
import {
  PageTransition,
  AnimatedWrapper,
  StaggeredList,
  LoadingTransition,
} from "@/components/ui/page-transitions";

export default function AnimationShowcase() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 10));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 p-8">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gradient mb-4 animate-fade-in">
              Animation Showcase
            </h1>
            <p
              className="text-xl text-muted-foreground animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              Beautiful illustrations and smooth animations for your helpdesk
            </p>
          </div>

          {/* Illustrations Section */}
          <section className="space-y-8">
            <h2 className="text-3xl font-bold text-gradient text-center animate-slide-up">
              Custom Illustrations
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatedWrapper delay={0}>
                <Card className="gradient-card shadow-purple hover-lift">
                  <CardHeader>
                    <CardTitle className="text-center">Empty State</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="w-32 h-32 mx-auto mb-4">
                      <EmptyTicketsIllustration />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Perfect for empty ticket lists
                    </p>
                  </CardContent>
                </Card>
              </AnimatedWrapper>

              <AnimatedWrapper delay={200}>
                <Card className="gradient-card shadow-purple hover-lift">
                  <CardHeader>
                    <CardTitle className="text-center">Login</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="w-32 h-32 mx-auto mb-4">
                      <LoginIllustration />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Secure authentication illustration
                    </p>
                  </CardContent>
                </Card>
              </AnimatedWrapper>

              <AnimatedWrapper delay={400}>
                <Card className="gradient-card shadow-purple hover-lift">
                  <CardHeader>
                    <CardTitle className="text-center">Success</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="w-32 h-32 mx-auto mb-4">
                      <SuccessIllustration />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Celebration and confirmation
                    </p>
                  </CardContent>
                </Card>
              </AnimatedWrapper>

              <AnimatedWrapper delay={600}>
                <Card className="gradient-card shadow-purple hover-lift">
                  <CardHeader>
                    <CardTitle className="text-center">Loading</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="w-32 h-32 mx-auto mb-4">
                      <LoadingIllustration />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Engaging loading animation
                    </p>
                  </CardContent>
                </Card>
              </AnimatedWrapper>

              <AnimatedWrapper delay={800}>
                <Card className="gradient-card shadow-purple hover-lift">
                  <CardHeader>
                    <CardTitle className="text-center">Error</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="w-32 h-32 mx-auto mb-4">
                      <ErrorIllustration />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Error state with visual feedback
                    </p>
                  </CardContent>
                </Card>
              </AnimatedWrapper>

              <AnimatedWrapper delay={1000}>
                <Card className="gradient-card shadow-purple hover-lift">
                  <CardHeader>
                    <CardTitle className="text-center">Gradient Orb</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="w-32 h-32 mx-auto mb-4 flex items-center justify-center">
                      <GradientOrb size="lg" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Decorative gradient element
                    </p>
                  </CardContent>
                </Card>
              </AnimatedWrapper>
            </div>
          </section>

          {/* Animated Icons Section */}
          <section className="space-y-8">
            <h2 className="text-3xl font-bold text-gradient text-center animate-slide-up">
              Animated Icons
            </h2>

            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
              <StaggeredList delay={100}>
                <Card className="gradient-card shadow-purple hover-lift p-6">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-3 text-primary">
                      <AnimatedTicketIcon />
                    </div>
                    <p className="text-sm font-medium">Ticket</p>
                  </div>
                </Card>

                <Card className="gradient-card shadow-purple hover-lift p-6">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-3 text-primary">
                      <AnimatedUserIcon />
                    </div>
                    <p className="text-sm font-medium">User</p>
                  </div>
                </Card>

                <Card className="gradient-card shadow-purple hover-lift p-6">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-3 text-primary">
                      <AnimatedClockIcon />
                    </div>
                    <p className="text-sm font-medium">Clock</p>
                  </div>
                </Card>

                <Card className="gradient-card shadow-purple hover-lift p-6">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-3 text-primary">
                      <AnimatedCheckIcon />
                    </div>
                    <p className="text-sm font-medium">Check</p>
                  </div>
                </Card>

                <Card className="gradient-card shadow-purple hover-lift p-6">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-3 text-primary">
                      <AnimatedAlertIcon />
                    </div>
                    <p className="text-sm font-medium">Alert</p>
                  </div>
                </Card>

                <Card className="gradient-card shadow-purple hover-lift p-6">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-3 text-primary">
                      <AnimatedStarIcon />
                    </div>
                    <p className="text-sm font-medium">Star</p>
                  </div>
                </Card>
              </StaggeredList>
            </div>
          </section>

          {/* Interactive Elements */}
          <section className="space-y-8">
            <h2 className="text-3xl font-bold text-gradient text-center animate-slide-up">
              Interactive Elements
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <AnimatedWrapper delay={0}>
                <Card className="gradient-card shadow-purple">
                  <CardHeader>
                    <CardTitle>Loading States</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Dots Animation</h4>
                      <div className="flex justify-center">
                        <AnimatedDots />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Wave Animation</h4>
                      <div className="flex justify-center">
                        <AnimatedWave />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Progress Bar</h4>
                      <AnimatedProgressBar progress={progress} />
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Loading Transition</h4>
                      <LoadingTransition
                        isLoading={isLoading}
                        loadingComponent={
                          <div className="flex items-center justify-center h-20">
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        }
                      >
                        <div className="h-20 flex items-center justify-center">
                          <p className="text-muted-foreground">
                            Content loaded!
                          </p>
                        </div>
                      </LoadingTransition>
                      <Button
                        onClick={() => setIsLoading(!isLoading)}
                        className="w-full"
                      >
                        Toggle Loading
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedWrapper>

              <AnimatedWrapper delay={200}>
                <Card className="gradient-card shadow-purple">
                  <CardHeader>
                    <CardTitle>Floating Elements</CardTitle>
                  </CardHeader>
                  <CardContent className="relative h-64 overflow-hidden">
                    <FloatingShapes />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-muted-foreground text-center">
                        Floating decorative elements
                        <br />
                        with smooth animations
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedWrapper>
            </div>
          </section>

          {/* Animation Classes Demo */}
          <section className="space-y-8">
            <h2 className="text-3xl font-bold text-gradient text-center animate-slide-up">
              Animation Classes
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="gradient-card shadow-purple hover-lift animate-bounce-in">
                <CardContent className="p-6 text-center">
                  <h4 className="font-medium mb-2">Bounce In</h4>
                  <p className="text-sm text-muted-foreground">
                    animate-bounce-in
                  </p>
                </CardContent>
              </Card>

              <Card className="gradient-card shadow-purple hover-lift animate-zoom-in">
                <CardContent className="p-6 text-center">
                  <h4 className="font-medium mb-2">Zoom In</h4>
                  <p className="text-sm text-muted-foreground">
                    animate-zoom-in
                  </p>
                </CardContent>
              </Card>

              <Card className="gradient-card shadow-purple hover-lift animate-rotate-in">
                <CardContent className="p-6 text-center">
                  <h4 className="font-medium mb-2">Rotate In</h4>
                  <p className="text-sm text-muted-foreground">
                    animate-rotate-in
                  </p>
                </CardContent>
              </Card>

              <Card className="gradient-card shadow-purple hover-lift animate-flip-in">
                <CardContent className="p-6 text-center">
                  <h4 className="font-medium mb-2">Flip In</h4>
                  <p className="text-sm text-muted-foreground">
                    animate-flip-in
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}
