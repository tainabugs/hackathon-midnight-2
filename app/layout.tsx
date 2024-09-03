import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Midnight Hackathon",
  description: "Created on Next.js 14",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      <link rel="icon" href="/favicon-rounded.png" />
      </head>
      <body className={`${raleway.className} font-medium text-[#383838] antialiased`}>{children}</body>
    </html>
  );
}
