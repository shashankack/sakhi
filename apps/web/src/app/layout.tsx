import type { Metadata } from "next";
import Link from "next/link";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import { cn } from "@/lib/utils";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Sakhi — understand your symptoms",
    template: "%s | Sakhi",
  },
  description:
    "A calm place to learn about PCOS-related symptoms and prepare for a care conversation.",
};

const navigation = [
  { href: "/", label: "Home" },
  { href: "/chat", label: "Ask Sakhi" },
  { href: "/learn", label: "Learn" },
  { href: "/about", label: "About" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("font-sans", fraunces.variable, jakarta.variable)}
    >
      <body>
        <TooltipProvider delayDuration={250}>
          <div className="disclaimer-strip" role="note">
            <span className="disclaimer-mark" aria-hidden="true">
              i
            </span>
            <span>This is not a medical diagnosis.</span>
            <span className="disclaimer-detail">
              Sakhi shares education, not a substitute for care.
            </span>
          </div>
          <header className="site-header">
            <Link className="wordmark" href="/" aria-label="Sakhi home">
              sakhi<span className="wordmark-dot">.</span>
            </Link>
            <nav className="site-nav" aria-label="Main navigation">
              {navigation.map((item) => (
                <Link className="nav-link" href={item.href} key={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
            <Link className="header-cta" href="/chat">
              Start a conversation <span aria-hidden="true">↗</span>
            </Link>
          </header>
          <main>{children}</main>
          <footer className="site-footer">
            <Link className="footer-wordmark" href="/">
              sakhi.
            </Link>
            <p>Small steps toward feeling more informed.</p>
            <span>Education only · Not a diagnosis</span>
          </footer>
        </TooltipProvider>
      </body>
    </html>
  );
}
