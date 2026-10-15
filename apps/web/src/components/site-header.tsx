"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { FloatingWeather } from "@/components/floating-weather";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/chat", label: "Ask Aai" },
  { href: "/care", label: "Find care" },
  { href: "/learn", label: "Learn" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.body.classList.add("nav-drawer-open");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("nav-drawer-open");
    };
  }, [open]);

  return (
    <header className={`site-header${open ? " is-open" : ""}`}>
      <Link className="wordmark" href="/" aria-label="Aai home">
        Aai<span className="wordmark-dot">.</span>
      </Link>

      <nav className="site-nav site-nav-desktop" aria-label="Main navigation">
        {navigation.map((item) => (
          <Link
            className="nav-link"
            href={item.href}
            key={item.href}
            aria-current={pathname === item.href ? "page" : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="header-actions">
        <FloatingWeather />
        <Link className="header-cta header-cta-desktop" href="/chat">
          Start a conversation <span aria-hidden="true">↗</span>
        </Link>
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? (
            <X aria-hidden="true" size={20} />
          ) : (
            <Menu aria-hidden="true" size={20} />
          )}
        </button>
      </div>

      <div
        className={`nav-drawer${open ? " is-open" : ""}`}
        id="mobile-nav"
        aria-hidden={!open}
      >
        <nav className="nav-drawer-links" aria-label="Mobile navigation">
          {navigation.map((item) => (
            <Link
              className="nav-drawer-link"
              href={item.href}
              key={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          className="header-cta nav-drawer-cta"
          href="/chat"
          onClick={() => setOpen(false)}
        >
          Start a conversation <span aria-hidden="true">↗</span>
        </Link>
      </div>

      {open ? (
        <button
          type="button"
          className="nav-backdrop"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      ) : null}
    </header>
  );
}
