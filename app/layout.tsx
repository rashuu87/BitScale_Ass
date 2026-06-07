import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bitscale - GTM Intelligence Dashboard",
  description: "Find and enrich leads for your GTM strategy",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">{children}</body>
    </html>
  );
}
