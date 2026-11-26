import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AggieRide",
  description: "An independent, educational demo for student carpool matching.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
