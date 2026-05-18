import type { Metadata } from "next";
import { Crimson_Pro, IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";

import "@/app/globals.css";

const headingFont = Crimson_Pro({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"]
});

const bodyFont = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"]
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"]
});

export const metadata: Metadata = {
  title: "Forest eOffice Productivity Monitoring System",
  description: "Productivity monitoring, analytics, and AI summaries for Forest Department eOffice operations."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${headingFont.variable} ${bodyFont.variable} ${monoFont.variable} bg-surface text-forest-900`}
      >
        {children}
      </body>
    </html>
  );
}
