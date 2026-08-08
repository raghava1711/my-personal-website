import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Raghavendra — Software Engineer & Java Backend Developer",
    template: "%s | Raghavendra",
  },
  description:
    "Professional portfolio and private digital workspace for Raghavendra, a software engineer focused on Java backend development, REST APIs, and modern web applications.",
  applicationName: "Raghavendra Workspace",
  authors: [{ name: "Raghavendra" }],
  keywords: ["Raghavendra", "Software Engineer", "Java Developer", "Spring Boot", "Backend Developer", "Portfolio", "Resume"],
  openGraph: {
    title: "Raghavendra — Software Engineer & Java Backend Developer",
    description: "A modern professional identity website with a secure private productivity workspace.",
    type: "website",
    locale: "en_US",
    siteName: "Raghavendra",
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased selection:bg-cyan-200 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
