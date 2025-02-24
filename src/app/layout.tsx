import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import AppProvider from "@/components/app-provider";
import NextTopLoader from "nextjs-toploader";
import Footer from "@/components/footer";
import { AntdRegistry } from "@ant-design/nextjs-registry";

export const metadata: Metadata = {
  title: "Big Boy Restaurant",
  description: "The best restaurant in the world",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased")}>
        <NextTopLoader showSpinner={false} color="hsl(var(--foreground))" />
        <AppProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AntdRegistry>{children}</AntdRegistry>
            <Footer />
            <Toaster />
          </ThemeProvider>
        </AppProvider>
      </body>
    </html>
  );
}
