import type { Metadata } from "next";
import { Kumbh_Sans, Coustard } from "next/font/google";
import "./globals.css";

const coustard = Coustard({
  weight: "400",
  variable: "--font-coustard",
  subsets: ["latin"],
});

const kumbhSans = Kumbh_Sans({
  variable: "--font-kumbh-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mango",
  description: "Track your health goals with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${coustard.variable} ${kumbhSans.variable} antialiased`}
      >
        <div className="flex justify-center font-sans">
          {children}
        </div>
      </body>
    </html>
  );
}
