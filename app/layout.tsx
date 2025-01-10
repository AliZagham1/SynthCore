import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ModalProvider } from "@/components/model-provider";
import { CrispProvider } from "@/components/crisp-provider";

import "./globals.css";
import {
  ClerkProvider,
  
} from "@clerk/nextjs";

import { SubscriptionProvider } from "@/app/context/SubscriptionContext";
import { ToasterProvider } from "@/components/toaster-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SynthCore",
  description: "AI Powered Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <CrispProvider/>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <SubscriptionProvider> {/* Wrap children with SubscriptionProvider */}
            <ModalProvider />
            <ToasterProvider/>
            {children}
          </SubscriptionProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
