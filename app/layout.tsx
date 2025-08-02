import Navbar from "@/components/Navbar";
import "./globals.css";
import Footer from "@/components/Footer";
import { AuthProvider } from "../components/AuthContext";

export const metadata = { title: "SFBiz – Find & Grow Local Gems" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-neutral-950 text-white antialiased selection:bg-rose-600/80" suppressHydrationWarning>
        <AuthProvider>
          <Navbar />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}