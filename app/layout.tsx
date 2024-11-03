import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { ClerkProvider } from '@clerk/nextjs';
import NavBar from '@/components/layout/NavBar';
import Container from '@/components/Container';
import { Toaster } from "@/components/ui/toaster"
const roboto = localFont({
  src: [
    {
      path: './fonts/Roboto-Bold.ttf',
      weight: '700',
    },
    {
      path: './fonts/Roboto-Medium.ttf',
      weight: '500',
    },
    {
      path: './fonts/Roboto-Regular.ttf',
      weight: '400',
    },
  ],
});
export const metadata: Metadata = {
  title: 'Hotel Booking',
  description: 'Đặt phòng khách sạn',
  icons: { icon: '/logo.svg' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider dynamic afterSignOutUrl="/">
      <html lang="en">
        <body className={roboto.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster/>
            <main className="flex flex-col min-h-screen bg-secondary">
              <NavBar />
              <section className="flex-grow">
                <Container>
                {children}
                </Container>
                </section>
            </main>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
