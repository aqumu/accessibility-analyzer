import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    weight: ["100","200","300","400","500","600","700","800","900"],
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
            <body className={`${inter.variable} ${geistMono.variable} antialiased`}>
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


