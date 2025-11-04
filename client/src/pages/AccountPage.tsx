import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AccountData {
  id: string;
  email: string;
  role: string;
  subscriptionTier: string;
}

export default function AccountPage() {
  const [, setLocation] = useLocation();
  const { user, isLoading: authLoading } = useAuth();
  
  console.log('ACCOUNT PAGE - Auth state:', { user, authLoading, hasUser: !!user });
  
  const { data: account, isLoading, refetch } = useQuery<AccountData>({
    queryKey: ["/api/account"],
    enabled: !authLoading && !!user,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
  });
  
  // Force refetch on mount
  useEffect(() => {
    if (!authLoading && user) {
      refetch();
    }
  }, [authLoading, user, refetch]);

  console.log('ACCOUNT PAGE - Query state:', { account, isLoading, queryEnabled: !authLoading && !!user });

  useEffect(() => {
    if (!authLoading && !user) {
      console.log('ACCOUNT PAGE - No user found, redirecting to /auth');
      setLocation("/auth");
    }
  }, [user, authLoading, setLocation]);

  useEffect(() => {
    if (account) {
      console.log('ACCOUNT PAGE - Received data:', account);
      console.log('ACCOUNT PAGE - Role:', account.role);
      console.log('ACCOUNT PAGE - Subscription:', account.subscriptionTier);
    }
  }, [account]);

  if (authLoading || isLoading) {
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  const getTierLabel = (tier: string) => {
    switch (tier) {
      case "free":
        return "Free Trial";
      case "basic":
        return "Basic ($1.99/mo)";
      case "pro":
        return "Pro ($4.99/mo)";
      default:
        return tier;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "free":
        return "secondary";
      case "basic":
        return "default";
      case "pro":
        return "default";
      default:
        return "secondary";
    }
  };

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6" data-testid="heading-account">Account Settings</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your account details and subscription status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Email</label>
            <p className="text-lg" data-testid="text-account-email">{account?.email}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-muted-foreground">Account Type</label>
            <div className="mt-1">
              {account?.role === 'admin' && (
                <Badge variant="default" className="mr-2" data-testid="badge-admin">Admin</Badge>
              )}
              <Badge variant="secondary" data-testid="badge-user">User</Badge>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Subscription Plan</label>
            <div className="mt-1">
              <Badge variant={getTierColor(account?.subscriptionTier || 'free')} data-testid="badge-subscription">
                {getTierLabel(account?.subscriptionTier || 'free')}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subscription Plans</CardTitle>
          <CardDescription>Choose the plan that works best for you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Free Trial</h3>
              {account?.subscriptionTier === 'free' && <Badge variant="secondary">Current Plan</Badge>}
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Perfect for trying out NovaWriter with basic features
            </p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Basic text editor</li>
              <li>• Limited document storage</li>
              <li>• Single device access</li>
            </ul>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Basic - $1.99/month</h3>
              {account?.subscriptionTier === 'basic' ? (
                <Badge variant="secondary">Current Plan</Badge>
              ) : (
                <Button 
                  size="sm"
                  onClick={() => setLocation('/subscribe?tier=basic')}
                  data-testid="button-upgrade-basic"
                >
                  Upgrade
                </Button>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Full editor access without AI assistance
            </p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Full rich text editor</li>
              <li>• Unlimited documents & projects</li>
              <li>• Multi-device sync</li>
              <li>• File import/export (.docx, .pdf, .txt)</li>
              <li>• Autosave & cloud storage</li>
            </ul>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Pro - $4.99/month</h3>
              {account?.subscriptionTier === 'pro' ? (
                <Badge variant="secondary">Current Plan</Badge>
              ) : (
                <Button 
                  size="sm"
                  onClick={() => setLocation('/subscribe?tier=pro')}
                  data-testid="button-upgrade-pro"
                >
                  Upgrade
                </Button>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Everything in Basic plus AI-powered writing assistance
            </p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• All Basic features</li>
              <li>• AI Writing Assistant</li>
              <li>• Smart suggestions & continuations</li>
              <li>• Content summarization</li>
              <li>• Writing improvements</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
