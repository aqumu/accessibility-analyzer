import type { Metadata } from "next";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

import { Manrope } from "next/font/google";
import { JetBrains_Mono } from "next/font/google";

const manrope = Manrope({
    subsets: ["latin", "cyrillic"],
    variable: "--font-sans",
    weight: ["200","300","400","500","600","700","800"],
    display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin", "cyrillic"],
    variable: "--font-mono",
    weight: ["400","500","600","700"],
    display: "swap",
});

export const metadata: Metadata = {
  title: "Accessibility Analyzer",
  description: "A Web Tool to Check Website Accessibility",
  icons: {
      icon: "/favicon.png",
      apple: "/favicon.png",
      shortcut: "/favicon.png",
  },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${manrope.variable} ${jetbrainsMono.variable} antialiased`}>
                <ThemeProvider
                    attribute="class"
                    enableSystem
                >
                    {children}
                    <Toaster richColors closeButton position="top-center" />
                </ThemeProvider>
            </body>
        </html>
    );
}


