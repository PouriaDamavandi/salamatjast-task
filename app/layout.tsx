import type { Metadata } from "next";
import "../styles/globals.scss";

export const metadata: Metadata = {
  title: "Trello Clone",
  description: "A Trello Clone built with Next.js, TypeScript, and SCSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
