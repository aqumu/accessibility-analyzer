"use client";

import { ReactNode, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient.ts";
import { useRouter } from "next/navigation";


interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) setAuthenticated(true);
      else router.replace("/login");
      setLoading(false);
    };
    checkAuth();
  }, [router]);

  if (loading) return <p>Loading...</p>;
  return authenticated ? <>{children}</> : null;
}
