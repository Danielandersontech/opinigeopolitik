"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TAUTAN = [
  { href: "/", label: "Beranda" },
  { href: "/analisis", label: "Analisis" },
  { href: "/analisis-massal", label: "Analisis Massal" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/metodologi", label: "Metodologi" },
];

export default function Navbar() {
  const path = usePathname();
  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <Link href="/" className="brand" aria-label="OpiniScope, ke beranda">
          <span className="brand-logo">O</span>
          <span>
            OpiniScope <small>Research Intelligence</small>
          </span>
        </Link>
        <nav className="nav-links">
          {TAUTAN.map((t) => (
            <Link key={t.href} href={t.href} className={path === t.href ? "aktif" : ""}>
              {t.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
