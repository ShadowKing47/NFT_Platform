export default function Footer() {
  return (
    <footer className="mt-12 py-8 border-t border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
      <div className="max-w-[1280px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-text-sec-light dark:text-text-sec-dark text-sm">
          © 2024 NFT Marketplace. All rights reserved.
        </p>
        <div className="flex gap-6">
          <a
            className="text-text-sec-light dark:text-text-sec-dark hover:text-primary text-sm"
            href="#"
          >
            Privacy Policy
          </a>
          <a
            className="text-text-sec-light dark:text-text-sec-dark hover:text-primary text-sm"
            href="#"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
