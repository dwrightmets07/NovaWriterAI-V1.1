import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/lib/auth";
import LandingPage from "@/pages/LandingPage";
import AuthPage from "@/pages/AuthPage";
import DashboardPage from "@/pages/DashboardPage";
import EditorPage from "@/pages/EditorPage";
import ProjectPage from "@/pages/ProjectPage";
import TrialEditorPage from "@/pages/TrialEditorPage";
import AccountPage from "@/pages/AccountPage";
import ContactUs from "@/pages/ContactUs";
import AboutPage from "@/pages/AboutPage";
import SubscribePage from "@/pages/SubscribePage";
import AdminPage from "@/pages/AdminPage";
import WritingStylePage from "@/pages/WritingStylePage";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/trial" component={TrialEditorPage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/editor/:id" component={EditorPage} />
      <Route path="/project/:id" component={ProjectPage} />
      <Route path="/account" component={AccountPage} />
      <Route path="/subscribe" component={SubscribePage} />
      <Route path="/writing-style" component={WritingStylePage} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/contact" component={ContactUs} />
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route path="/about" component={AboutPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
