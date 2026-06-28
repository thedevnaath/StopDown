import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NeoSaaS Platform",
  description: "A modern SaaS platform embodying Neobrutalism design principles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/*
        Applying 'inter.className' ensures the Inter font is used throughout the app.
        'bg-neobrutal-bg' and 'text-neobrutal-text' are custom Tailwind classes
        expected to be defined in `tailwind.config.js` for the Neobrutalism theme.
        These will establish the foundational background and text colors.
      */}
      <body className={`${inter.className} bg-neobrutal-bg text-neobrutal-text min-h-screen`}>
        {children}
      </body>
    </html>
  );
}