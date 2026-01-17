import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/Footer/Footer";

export const metadata: Metadata = {
  title: "Pizzeria App",
  description:
    "A fullstack pizzeria application built with Next.js and TypeScript.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hu">
      <body className="flex min-h-screen flex-col">
        <main className="flex grow flex-col">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
