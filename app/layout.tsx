import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Muslim Kids World — Learn • Play • Grow",
  description:
    "A safe, global Islamic learning world for kids. Daily quizzes, good deeds, and a virtual Muslim World — with a parent dashboard that keeps every child's progress in view.",
  metadataBase: new URL("https://muslimkidsworld.com"),
  openGraph: {
    title: "Muslim Kids World — Learn • Play • Grow",
    description:
      "A safe, global Islamic learning world for kids, with full parental oversight.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-night text-sand antialiased">{children}</body>
    </html>
  );
}
