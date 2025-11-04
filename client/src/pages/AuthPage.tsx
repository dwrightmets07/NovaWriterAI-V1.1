import { AuthForm } from "@/components/AuthForm";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export default function AuthPage() {
  const [location, setLocation] = useLocation();
  const { login, register, user, isLoading } = useAuth();
  const { toast } = useToast();
  
  const params = new URLSearchParams(window.location.search);
  const mode = params.get("mode") === "register" ? "signup" : "login";

  // Temporarily disabled to fix caching issue
  // useEffect(() => {
  //   if (user) {
  //     setLocation("/dashboard");
  //   }
  // }, [user, setLocation]);

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      // Wait for auth cache to propagate before navigation (iOS first-install fix)
      await new Promise(resolve => setTimeout(resolve, 300));
      setLocation("/dashboard");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error instanceof Error ? error.message : "Failed to login",
      });
    }
  };

  const handleSignup = async (email: string, password: string) => {
    try {
      await register(email, password);
      // Wait for auth cache to propagate before navigation (iOS first-install fix)
      await new Promise(resolve => setTimeout(resolve, 300));
      setLocation("/dashboard");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: error instanceof Error ? error.message : "Failed to sign up",
      });
    }
  };

  if (isLoading) {
    return null;
  }

  return <AuthForm onLogin={handleLogin} onSignup={handleSignup} initialMode={mode} />;
}
