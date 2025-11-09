"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export function ModeToggle() {
    const { theme, setTheme } = useTheme();

    const handleClick = () => {
        const systemIsDark = window.matchMedia(
            "(prefers-color-scheme: dark)",
        ).matches;
        const activeTheme =
            theme === "system" ? (systemIsDark ? "dark" : "light") : theme;

        setTheme(activeTheme === "dark" ? "light" : "dark");
    };

    return (
        <Button onClick={handleClick} variant="outline" size="icon">
            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}