import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import ToastProvider from "@/components/ReactHotToast/ReactHotToast";

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
        <Header />

        <main className="flex grow flex-col dark:bg-zinc-700 bg-zinc-100 dark:text-zinc-200 text-zinc-800">
          {children}
        </main>

        <Footer />

        <ToastProvider />
      </body>
    </html>
  );
}
