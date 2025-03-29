import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Food Analysis Console | Nu.",
  description: "Analyze food nutritional content using AI",
};

export default function ConsoleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
} 