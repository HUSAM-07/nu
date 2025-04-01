import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nu. | Know what's in it.",
  description: "Discover what's in your food with AI-powered nutritional analysis",
  authors: [{ name: "Nu Team" }],
  keywords: ["food", "nutrition", "bakery", "AI analysis", "calories", "ingredients"],
  creator: "Nu",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <header className="container mx-auto py-6 px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0" role="banner">
          <Link href="/" aria-label="Augen Home" className="flex items-center">
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image
                src="/bakery-image.png"
                alt="Bakery logo"
                fill
                sizes="40px"
                className="object-cover"
                priority
              />
            </div>
            <span className="ml-2 text-xl font-bold">Nu.</span>
          </Link>
          <nav aria-label="Main navigation" className="w-full sm:w-auto">
            <ul className="flex items-center justify-center sm:justify-start space-x-8 sm:space-x-12">
              <li>
                <Link href="/console" className="text-gray-800 hover:text-gray-600">
                  Nu. It
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-800 hover:text-gray-600">
                  About
                </Link>
              </li>
            </ul>
          </nav>
          <div className="text-xs text-gray-500 hidden sm:block">
            <Link href="https://projects.ihusam.tech/" className="hover:underline">
              discover more tools on ihusam.tech
            </Link>
          </div>
        </header>
        <main>
          {children}
        </main>
        <footer className="py-8 px-4 mt-16 border-t border-gray-100" role="contentinfo">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p className="text-sm text-gray-500">© {new Date().getFullYear()} Nu | ihusam.tech. All rights reserved.</p>
              </div>
              <div className="flex space-x-6">
                <Link href="https://mohammedhusamuddin.notion.site/?pvs=4" className="text-sm text-gray-500 hover:text-gray-700">
                  Privacy Policy
                </Link>
                <Link href="https://mohammedhusamuddin.notion.site/?pvs=4" className="text-sm text-gray-500 hover:text-gray-700">
                  Terms of Service
                </Link>
                <Link href="https://mohammedhusamuddin.notion.site/?pvs=4" className="text-sm text-gray-500 hover:text-gray-700">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
