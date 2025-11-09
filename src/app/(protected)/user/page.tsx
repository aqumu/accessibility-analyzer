"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api.ts";
import { supabase } from "@/lib/supabaseClient.ts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ModeToggle } from "@/components/mode-toggle.tsx";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

interface UserProfile {
  id: string;
  public_name?: string;
  created_at?: string;
}

interface UserStats {
  total_bookmarks: number;
  today_bookmarks: number;
  last_activity?: string | null;
}

interface UserQuota {
  daily_limit: number;
  used_today: number;
  remaining: number;
}

export default function UserPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [quota, setQuota] = useState<UserQuota | null>(null);
  const [loading, setLoading] = useState(true);
  const [originalName, setOriginalName] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const fetchUserData = async () => {
    try {
      const [profileRes, statsRes, quotaRes] = await Promise.all([
        api.get("/users/me"),
        api.get("/users/stats"),
        api.get("/users/quota"),
      ]);

      setProfile(profileRes.data);
      setOriginalName(profileRes.data.public_name);
      setStats(statsRes.data);
      setQuota(quotaRes.data);
    } catch (err) {
      console.error("Error fetching user data:", err);
      toast.error("Could not fetch user information");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await supabase.auth.signOut();
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed", err);
      toast.error("Failed to log out. Please try again.");
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center">
          <p>Loading user data...</p>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="flex justify-between items-center px-4 py-2 border-b border-border">
          <Link
              href="/"
              className="flex items-center text-2xl font-semibold hover:text-primary transition-colors"
          >
            <ArrowLeft className="mr-2" />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-2">
            <ModeToggle />
            <Button
                variant="outline"
                className="h-9 px-4 flex items-center justify-center"
                onClick={handleLogout}
                disabled={loggingOut}
            >
              {loggingOut ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </div>

        <div className="max-w-2xl mx-auto p-6 space-y-6">
          {/* Profile */}
          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!profile) return;

                    setSaving(true);

                    try {
                      await api.put("/users/me", {
                        public_name: profile.public_name,
                      });

                      toast.success("Your profile has been updated successfully");
                      setOriginalName(profile.public_name);
                    } catch (err) {
                      console.error(err);
                      toast.error("Something went wrong, please try again");
                    } finally {
                      setSaving(false);
                    }
                  }}
                  className="space-y-3"
              >
                <div>
                  <label className="block text-xs font-medium pb-0.5">
                    Username
                  </label>
                  <input
                      type="text"
                      className="w-full border rounded-md px-2 py-1 bg-background text-foreground"
                      value={profile?.public_name || ""}
                      onChange={(e) =>
                          setProfile((prev) =>
                              prev ? { ...prev, public_name: e.target.value } : prev,
                          )
                      }
                  />
                </div>
                <Button
                    type="submit"
                    variant="outline"
                    className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={
                        saving ||
                        profile?.public_name === originalName ||
                        !profile?.public_name
                    }
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>
                <strong>Total bookmarks:</strong> {stats?.total_bookmarks ?? 0}
              </p>
              <p>
                <strong>Bookmarks today:</strong> {stats?.today_bookmarks ?? 0}
              </p>
              <p>
                <strong>Last activity:</strong>{" "}
                {stats?.last_activity
                    ? new Date(stats.last_activity).toLocaleString()
                    : "No activity yet"}
              </p>
            </CardContent>
          </Card>

          {/* Quota */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Quota</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>
                <strong>Limit:</strong> {quota?.daily_limit ?? 0}
              </p>
              <p>
                <strong>Used today:</strong> {quota?.used_today ?? 0}
              </p>
              <p>
                <strong>Remaining:</strong> {quota?.remaining ?? 0}
              </p>
              <div className="w-full bg-muted rounded-full h-2 mt-2">
                <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.min(
                          ((quota?.used_today ?? 0) / (quota?.daily_limit ?? 1)) *
                          100,
                          100,
                      )}%`,
                    }}
                ></div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center pt-4">
            <Button asChild variant="outline">
              <Link href="/">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
  );
}
