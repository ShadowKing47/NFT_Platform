"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col transition-colors duration-200">
      <Header />
      
      <main className="flex-grow w-full px-6 py-8 flex justify-center">
        <div className="max-w-[1280px] w-full flex flex-col gap-8">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm">
            <a href="/" className="text-text-sec-light dark:text-text-sec-dark hover:text-primary transition-colors">
              Home
            </a>
            <span className="material-symbols-outlined text-xs text-text-sec-light dark:text-text-sec-dark">
              chevron_right
            </span>
            <span className="text-text-main-light dark:text-white font-medium">
              Explore
            </span>
          </div>

          {/* Page Header */}
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-bold text-text-main-light dark:text-white">
              Explore NFTs
            </h1>
            <p className="text-lg text-text-sec-light dark:text-text-sec-dark">
              Discover unique digital assets across multiple blockchains
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 rounded-lg bg-primary text-white font-medium">
              All
            </button>
            <button className="px-4 py-2 rounded-lg bg-surface-light dark:bg-surface-dark text-text-main-light dark:text-white hover:bg-primary/10 transition-colors">
              Art
            </button>
            <button className="px-4 py-2 rounded-lg bg-surface-light dark:bg-surface-dark text-text-main-light dark:text-white hover:bg-primary/10 transition-colors">
              Photography
            </button>
            <button className="px-4 py-2 rounded-lg bg-surface-light dark:bg-surface-dark text-text-main-light dark:text-white hover:bg-primary/10 transition-colors">
              Gaming
            </button>
            <button className="px-4 py-2 rounded-lg bg-surface-light dark:bg-surface-dark text-text-main-light dark:text-white hover:bg-primary/10 transition-colors">
              Music
            </button>
          </div>

          {/* NFT Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Placeholder cards - replace with actual NFT data */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-surface-light dark:bg-surface-dark rounded-xl overflow-hidden border border-border-light dark:border-border-dark hover:border-primary transition-all group"
              >
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-purple-500/20 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-6xl text-text-sec-light dark:text-text-sec-dark">
                      image
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-text-main-light dark:text-white mb-1">
                    NFT #{i + 1}
                  </h3>
                  <p className="text-sm text-text-sec-light dark:text-text-sec-dark mb-3">
                    Collection Name
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-text-sec-light dark:text-text-sec-dark">
                        Price
                      </p>
                      <p className="text-sm font-bold text-text-main-light dark:text-white">
                        {i % 2 === 0 ? "1,000 HBAR" : "0.5 ETH"}
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors">
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="flex justify-center">
            <button className="px-8 py-3 bg-surface-light dark:bg-surface-dark hover:bg-primary hover:text-white text-text-main-light dark:text-white rounded-lg font-medium transition-colors border border-border-light dark:border-border-dark">
              Load More
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
