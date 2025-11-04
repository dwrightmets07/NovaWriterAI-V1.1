import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface AdminUser {
  id: string;
  email: string;
  role: string;
  subscriptionTier: string;
  deletedAt?: string | null;
}

interface AuditLog {
  id: string;
  userId: string | null;
  performedBy: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  details: string | null;
  createdAt: string;
}

export default function AdminPage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  const { data: users, isLoading } = useQuery<AdminUser[]>({
    queryKey: ['/api/admin/users'],
    enabled: user?.role === 'admin',
  });

  const { data: deletedUsers, isLoading: isLoadingDeleted } = useQuery<AdminUser[]>({
    queryKey: ['/api/admin/users/deleted'],
    enabled: user?.role === 'admin',
  });

  const { data: auditLogs, isLoading: isLoadingLogs } = useQuery<AuditLog[]>({
    queryKey: ['/api/admin/audit-logs'],
    enabled: user?.role === 'admin',
  });

  const updateSubscriptionMutation = useMutation({
    mutationFn: async ({ userId, tier }: { userId: string; tier: string }) => {
      return apiRequest('POST', `/api/admin/users/${userId}/subscription`, { tier });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: "Subscription updated",
        description: "User subscription tier has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      return apiRequest('POST', `/api/admin/users/${userId}/delete`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users/deleted'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/audit-logs'] });
      toast({
        title: "User deleted",
        description: "User account has been soft deleted successfully.",
      });
      setDeleteUserId(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
      setDeleteUserId(null);
    },
  });

  const restoreUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      return apiRequest('POST', `/api/admin/users/${userId}/restore`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users/deleted'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/audit-logs'] });
      toast({
        title: "User restored",
        description: "User account has been restored successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Restore failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (user && user.role !== 'admin') {
      setLocation('/dashboard');
    }
  }, [user, setLocation]);

  if (!user || user.role !== 'admin') {
    return null;
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'pro': return 'default';
      case 'basic': return 'secondary';
      default: return 'outline';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create': return 'default';
      case 'soft_delete': return 'destructive';
      case 'restore': return 'default';
      case 'update_role': return 'secondary';
      case 'update_subscription': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => setLocation('/dashboard')}
              data-testid="button-back-dashboard"
            >
              ← Back to Dashboard
            </Button>
          </div>

          <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="users" data-testid="tab-users">Active Users</TabsTrigger>
              <TabsTrigger value="deleted" data-testid="tab-deleted">Deleted Users</TabsTrigger>
              <TabsTrigger value="audit" data-testid="tab-audit">Audit Logs</TabsTrigger>
            </TabsList>

            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>Active Users</CardTitle>
                  <CardDescription>Manage user accounts and subscription tiers</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <p className="text-muted-foreground">Loading users...</p>
                  ) : (
                    <div className="space-y-4">
                      {users?.map((activeUser) => (
                        <div 
                          key={activeUser.id} 
                          className="flex items-center justify-between p-4 border rounded-lg"
                          data-testid={`user-row-${activeUser.id}`}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium" data-testid={`text-user-email-${activeUser.id}`}>
                                {activeUser.email}
                              </p>
                              {activeUser.role === 'admin' && (
                                <Badge variant="default" data-testid={`badge-admin-${activeUser.id}`}>
                                  Admin
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              Current tier: <Badge variant={getTierColor(activeUser.subscriptionTier)}>
                                {activeUser.subscriptionTier}
                              </Badge>
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Select
                              value={activeUser.subscriptionTier}
                              onValueChange={(tier) => updateSubscriptionMutation.mutate({ userId: activeUser.id, tier })}
                              data-testid={`select-tier-${activeUser.id}`}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="free">Free</SelectItem>
                                <SelectItem value="basic">Basic</SelectItem>
                                <SelectItem value="pro">Pro</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setDeleteUserId(activeUser.id)}
                              data-testid={`button-delete-${activeUser.id}`}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="deleted">
              <Card>
                <CardHeader>
                  <CardTitle>Deleted Users</CardTitle>
                  <CardDescription>View and restore soft-deleted user accounts</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingDeleted ? (
                    <p className="text-muted-foreground">Loading deleted users...</p>
                  ) : deletedUsers && deletedUsers.length > 0 ? (
                    <div className="space-y-4">
                      {deletedUsers.map((deletedUser) => (
                        <div 
                          key={deletedUser.id} 
                          className="flex items-center justify-between p-4 border rounded-lg bg-muted/50"
                          data-testid={`deleted-user-row-${deletedUser.id}`}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium" data-testid={`text-deleted-email-${deletedUser.id}`}>
                                {deletedUser.email}
                              </p>
                              <Badge variant="destructive">Deleted</Badge>
                              {deletedUser.role === 'admin' && (
                                <Badge variant="outline">Admin</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              Deleted: {deletedUser.deletedAt ? format(new Date(deletedUser.deletedAt), 'PPpp') : 'Unknown'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Subscription tier: <Badge variant={getTierColor(deletedUser.subscriptionTier)}>
                                {deletedUser.subscriptionTier}
                              </Badge>
                            </p>
                          </div>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => restoreUserMutation.mutate(deletedUser.id)}
                            disabled={restoreUserMutation.isPending}
                            data-testid={`button-restore-${deletedUser.id}`}
                          >
                            Restore
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No deleted users</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="audit">
              <Card>
                <CardHeader>
                  <CardTitle>Audit Logs</CardTitle>
                  <CardDescription>View all user account activity and changes</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingLogs ? (
                    <p className="text-muted-foreground">Loading audit logs...</p>
                  ) : auditLogs && auditLogs.length > 0 ? (
                    <div className="space-y-2">
                      {auditLogs.map((log) => (
                        <div 
                          key={log.id} 
                          className="flex items-start gap-3 p-3 border rounded-lg text-sm"
                          data-testid={`audit-log-${log.id}`}
                        >
                          <Badge variant={getActionColor(log.action)} className="mt-0.5">
                            {log.action}
                          </Badge>
                          <div className="flex-1">
                            <p className="font-medium">{log.details}</p>
                            <p className="text-muted-foreground text-xs mt-1">
                              {format(new Date(log.createdAt), 'PPpp')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No audit logs</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <AlertDialog open={deleteUserId !== null} onOpenChange={(open) => !open && setDeleteUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User Account?</AlertDialogTitle>
            <AlertDialogDescription>
              This will soft delete the user account. The user will not be able to log in, but their data will be preserved and the account can be restored later from the "Deleted Users" tab.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteUserId && deleteUserMutation.mutate(deleteUserId)}
              data-testid="button-confirm-delete"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
