"use client";

import { useEffect, useState } from "react";
import Link from "next/link"; // or Next.js Link if applicable
import api from "@/lib/api.ts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ModeToggle } from "@/components/mode-toggle.tsx";
import { Input } from "@/components/ui/input.tsx";
import { DeleteButton } from "@/components/trash-button.tsx";

interface Bookmark {
  id: string;
  url: string;
  title: string;
  notes?: string;
}

export default function Dashboard() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUrl, setNewUrl] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [username, setUsername] = useState<string>("");

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const res = await api.get("/bookmarks");
      setBookmarks(res.data);
    } catch (err) {
      console.error("Error fetching bookmarks:", err);
    }
    setLoading(false);
  };

  const fetchUsername = async () => {
    try {
      const res = await api.get("/users/me");
      setUsername(res.data.public_name || res.data.id || "User");
    } catch (err) {
      console.error("Error fetching username:", err);
    }
  };

  const addBookmark = async () => {
    if (!newUrl) return;

    let url = newUrl;
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;

    try {
      await api.post("/bookmarks", {
        url,
        title: newTitle || url,
      });
      setNewUrl("");
      setNewTitle("");
      fetchBookmarks();
    } catch (err) {
      console.error("Error adding bookmark:", err);
    }
  };

  const deleteBookmark = async (id: string) => {
    try {
      await api.delete(`/bookmarks/${id}`);
      fetchBookmarks();
    } catch (err) {
      console.error("Error deleting bookmark:", err);
    }
  };

  useEffect(() => {
    fetchUsername();
    fetchBookmarks();
  }, []);

  return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="flex justify-between items-center px-4 py-2 border-b border-border">
          <Link
              href="/user"
              className="text-2xl font-semibold hover:text-primary transition-colors"
          >
            {username || "Loading..."}
          </Link>
          <ModeToggle />
        </div>

        <div className="p-6 max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">Your Bookmarks</h2>

          <div className="flex gap-2 mb-6">
            <Input
                placeholder="URL"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
            />
            <Input
                placeholder="Title (optional)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
            />
            <Button onClick={addBookmark}>Add</Button>
          </div>

          {loading ? (
              <p>Loading bookmarks...</p>
          ) : bookmarks.length === 0 ? (
              <p>No bookmarks yet.</p>
          ) : (
              <div className="space-y-4">
                {bookmarks.map((bm) => (
                    <Card
                        key={bm.id}
                        className="bg-card text-card-foreground border-border"
                    >
                      <CardHeader>
                        <CardTitle>{bm.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex justify-between items-center">
                        <a
                            href={bm.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                        >
                          {bm.url}
                        </a>
                        <DeleteButton onClick={() => deleteBookmark(bm.id)} />
                      </CardContent>
                    </Card>
                ))}
              </div>
          )}
        </div>
      </div>
  );
}
