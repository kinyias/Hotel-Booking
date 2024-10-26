import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { ClerkProvider } from '@clerk/nextjs';
import NavBar from '@/components/layout/NavBar';
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
    <ClerkProvider afterSignOutUrl="/">
      <html lang="en">
        <body className={roboto.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main className="flex flex-col min-h-screen bg-secondary">
              <NavBar />
              <section className="flex-grow">{children}</section>
            </main>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
