import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hand Recognition",
  description: "Control with Hand Recognition",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AppRouterCacheProvider>
        <body className={inter.className}>{children}</body>
      </AppRouterCacheProvider>
    </html>
  );
}
