"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
                                  children,
                                  ...props
                              }: React.ComponentProps<typeof NextThemesProvider>) {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        // Render nothing until mounted to avoid SSR/client mismatch
        return <>{children}</>;
    }

    return (
        <NextThemesProvider {...props}>
            {children}
        </NextThemesProvider>
    );
}