import type { Metadata } from "next";
import "./globals.css";
import CustomCursor from "@/components/ui/custom-cursor";
import GridRails from "@/components/layout/grid-rails";
import Navbar from "@/components/layout/navbar";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Kenji — Developer",
  description: "Software Engineer & Builder based in Kalinga, Philippines.",
  icons: {
    icon: "/kenjivafe-logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700,900&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem>
          <CustomCursor />
          <GridRails />
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
