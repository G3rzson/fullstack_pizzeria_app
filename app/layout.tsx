import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import Header from "./_components/Header";
import CookieConsentBanner from "./_components/CookieConsentBanner";
import { AuthProvider } from "@/lib/auth/AuthContext";
import "./globals.css";
import { CartProvider } from "@/lib/cart/CartContext";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Pizzeria App",
  description:
    "Pizzéria rendelő alkalmazás, ahol tudsz regisztrálni, pizzát rendelni és kezelni a rendeléseidet.",

  metadataBase: new URL("https://fullstack-pizzeria-app.vercel.app"),
  openGraph: {
    title: "Pizzéria App - Rendelés és Kezelés",
    description:
      "Pizzéria rendelő alkalmazás, ahol tudsz regisztrálni, pizzát rendelni és kezelni a rendeléseidet.",
    url: "https://fullstack-pizzeria-app.vercel.app",
    images: ["/og-image.png"], // optimális méret: 1200x630 px
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="hu"
      suppressHydrationWarning
      className={cn("font-sans", geist.variable)}
    >
      <body className="flex flex-col min-h-screen">
        <AuthProvider>
          <CartProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <Header />
              <main className="flex flex-col grow gap-4 p-4 md:px-0 w-full md:w-4/5 mx-auto">
                {children}
              </main>
              <Toaster />
              <CookieConsentBanner />
            </ThemeProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
