import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Home from "@/pages/home";
import Landing from "@/pages/landing";
import Lesson from "@/pages/lesson";
import Achievements from "@/pages/achievements";
import Progress from "@/pages/progress";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";
import BottomNavigation from "@/components/ui/bottom-navigation";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/lesson/:id" component={Lesson} />
          <Route path="/achievements" component={Achievements} />
          <Route path="/progress" component={Progress} />
          <Route path="/profile" component={Profile} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen paw-pattern">
          <Toaster />
          <Router />
          <AuthenticatedOnlyBottomNav />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function AuthenticatedOnlyBottomNav() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <BottomNavigation /> : null;
}

export default App;
