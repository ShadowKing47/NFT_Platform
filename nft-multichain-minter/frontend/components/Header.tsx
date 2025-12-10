"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-light dark:border-border-dark bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur-md px-6 py-4">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 text-primary dark:text-white cursor-pointer">
            <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-white">
              <span className="material-symbols-outlined">hexagon</span>
            </div>
            <h2 className="text-text-main-light dark:text-text-main-dark text-xl font-bold tracking-tight">
              NFT Nexus
            </h2>
          </Link>

          {/* Search */}
          <div className="hidden md:flex relative group w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-text-sec-light dark:text-text-sec-dark">
                search
              </span>
            </div>
            <input
              className="block w-full pl-10 pr-3 py-2.5 rounded-lg border-none bg-background-light dark:bg-background-dark text-text-main-light dark:text-text-main-dark placeholder-text-sec-light dark:placeholder-text-sec-dark focus:ring-2 focus:ring-primary focus:outline-none transition-all"
              placeholder="Search collections, NFTs, users..."
              type="text"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <nav className="hidden lg:flex items-center gap-6">
            <Link
              className={`font-medium hover:text-primary transition-colors ${
                pathname === "/explore"
                  ? "text-primary"
                  : "text-text-main-light dark:text-white"
              }`}
              href="/explore"
            >
              Explore
            </Link>
            <Link
              className={`font-medium hover:text-primary transition-colors ${
                pathname === "/drops"
                  ? "text-primary"
                  : "text-text-main-light dark:text-white"
              }`}
              href="/drops"
            >
              Drops
            </Link>
            <Link
              className={`font-medium hover:text-primary transition-colors ${
                pathname === "/"
                  ? "text-primary"
                  : "text-text-main-light dark:text-white"
              }`}
              href="/"
            >
              Create
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg text-text-main-light dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
              <span className="material-symbols-outlined">shopping_cart</span>
            </button>
            <button className="p-2 rounded-lg text-text-main-light dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-2.5 px-5 rounded-lg transition-all shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-sm">
                account_balance_wallet
              </span>
              <span>Connect</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
