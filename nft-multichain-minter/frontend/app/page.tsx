"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Home page - redirects to the create/mint page
 */
export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/create");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-4">
          NFT Nexus
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Redirecting...</p>
      </div>
    </div>
  );
}

        )}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <ToastProvider>
      <MintPageContent />
    </ToastProvider>
  );
}
