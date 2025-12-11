"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function DropsPage() {
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
              Drops
            </span>
          </div>

          {/* Page Header */}
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-bold text-text-main-light dark:text-white">
              NFT Drops
            </h1>
            <p className="text-lg text-text-sec-light dark:text-text-sec-dark">
              Upcoming and live NFT collections
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 border-b border-border-light dark:border-border-dark">
            <button className="px-4 py-2 font-medium text-primary border-b-2 border-primary">
              Upcoming
            </button>
            <button className="px-4 py-2 font-medium text-text-sec-light dark:text-text-sec-dark hover:text-primary transition-colors">
              Live
            </button>
            <button className="px-4 py-2 font-medium text-text-sec-light dark:text-text-sec-dark hover:text-primary transition-colors">
              Past
            </button>
          </div>

          {/* Drops Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Placeholder cards - replace with actual drop data */}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-surface-light dark:bg-surface-dark rounded-xl overflow-hidden border border-border-light dark:border-border-dark hover:border-primary transition-all"
              >
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-purple-500/20 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-6xl text-text-sec-light dark:text-text-sec-dark">
                      collections
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 px-3 py-1 bg-primary text-white text-xs font-bold rounded-full">
                    {i % 3 === 0 ? "Live" : "In " + (i + 1) + "h"}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-text-main-light dark:text-white mb-2">
                    Collection Drop #{i + 1}
                  </h3>
                  <p className="text-sm text-text-sec-light dark:text-text-sec-dark mb-4">
                    A unique collection of digital art on the {i % 2 === 0 ? "Hedera" : "Ethereum"} blockchain
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-text-sec-light dark:text-text-sec-dark">
                        Mint Price
                      </p>
                      <p className="text-lg font-bold text-text-main-light dark:text-white">
                        {i % 2 === 0 ? "500 HBAR" : "0.1 ETH"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-text-sec-light dark:text-text-sec-dark">
                        Supply
                      </p>
                      <p className="text-lg font-bold text-text-main-light dark:text-white">
                        {(i + 1) * 100}
                      </p>
                    </div>
                  </div>
                  <button className="w-full py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-bold transition-colors">
                    {i % 3 === 0 ? "Mint Now" : "Set Reminder"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
