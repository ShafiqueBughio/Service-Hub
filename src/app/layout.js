import { Schibsted_Grotesk } from "next/font/google";
import AuthHydrator from "@/components/auth/AuthHydrator";
import "../style/globals.css";
import "../style/custom.css";

const schibstedGrotesk = Schibsted_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-schibsted",
});

export const metadata = {
  title: "Service Hub",
  description: "Service Hub — Connecting users with the right professionals",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${schibstedGrotesk.variable} font-schibsted`}>
        <AuthHydrator>{children}</AuthHydrator>
      </body>
    </html>
  );
}
