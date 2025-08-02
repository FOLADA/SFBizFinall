"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu } from "react-icons/fi";
import { useState } from "react";
import { useAuth } from "./AuthContext";

const links = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Search" },
  { href: "/#explore", label: "Explore" },
  { href: "/add", label: "Add Business" },
  {href: "/aboutus", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur lg:backdrop-blur-lg">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
        <Link href="/" className="text-2xl font-black tracking-tight">
          <span className="bg-gradient-to-r from-fuchsia-500 to-rose-500 bg-clip-text text-transparent">
            SFBiz
          </span>
        </Link>

        {/* desktop */}
        <ul className="hidden gap-8 lg:flex">
          {links.map((l) => (
            <li key={l.href} className="relative">
              <Link
                href={l.href}
                className="inline-block pb-1 font-medium transition-colors hover:text-rose-400"
              >
                {l.label}
                {pathname === l.href && (
                  <motion.span
                    layoutId="underline"
                    className="absolute -bottom-0.5 left-0 h-[2px] w-full bg-gradient-to-r from-fuchsia-500 to-rose-500"
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* mobile */}
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          className="block rounded p-2 lg:hidden"
        >
          <FiMenu size={24} />
        </button>

        <AnimatePresence>
          {open && (
            <motion.ul
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="absolute left-0 right-0 top-full space-y-4 overflow-hidden bg-neutral-900/95 px-6 py-6 lg:hidden"
            >
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block py-1 text-lg font-medium hover:text-rose-400"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>

        <div className="hidden lg:flex items-center gap-4">
          {user ? (
            <>
              <span>Welcome, {user.email}</span>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
