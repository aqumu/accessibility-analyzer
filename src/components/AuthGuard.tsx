"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const [checking, setChecking] = useState(true);
    const router = useRouter();

    useEffect(() => {
        (async () => {
            const { data } = await supabase.auth.getUser();
            if (!data.user) router.replace("/login");
            else setChecking(false);
        })();
    }, [router]);

    if (checking) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Загрузка...</p>
            </div>
        );
    }

    return <>{children}</>;
}