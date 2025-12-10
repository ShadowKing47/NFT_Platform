"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useToast } from "@/components/ToastProvider";

export default function SettingsPage() {
  const router = useRouter();
  const { isLoggedIn, walletAddress, chain, logout } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<"profile" | "notifications" | "security">(
    "profile"
  );

  // Profile settings
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [salesNotifications, setSalesNotifications] = useState(true);
  const [bidNotifications, setBidNotifications] = useState(true);
  const [followNotifications, setFollowNotifications] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      setLoading(false);
      // Load user settings from API here
    }
  }, [isLoggedIn, router]);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      // API call to save profile
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay
      showToast("Profile updated successfully", "success");
    } catch (error) {
      showToast("Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setSaving(true);
    try {
      // API call to save notification settings
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay
      showToast("Notification settings updated", "success");
    } catch (error) {
      showToast("Failed to update settings", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDisconnectWallet = () => {
    logout();
    showToast("Wallet disconnected successfully", "success");
    router.push("/");
  };

  if (loading || !isLoggedIn) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col transition-colors duration-200">
      <Header />

      <main className="flex-grow w-full px-6 py-8 flex justify-center">
        <div className="max-w-[1280px] w-full flex flex-col gap-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm">
            <Link
              href="/"
              className="text-text-sec-light dark:text-text-sec-dark hover:text-primary transition-colors"
            >
              Home
            </Link>
            <span className="text-text-sec-light dark:text-text-sec-dark">/</span>
            <Link
              href="/dashboard"
              className="text-text-sec-light dark:text-text-sec-dark hover:text-primary transition-colors"
            >
              Dashboard
            </Link>
            <span className="text-text-sec-light dark:text-text-sec-dark">/</span>
            <span className="text-text-main-light dark:text-white font-medium">Settings</span>
          </nav>

          {/* Header */}
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-text-main-light dark:text-white mb-2">
              Account Settings
            </h1>
            <p className="text-text-sec-light dark:text-text-sec-dark">
              Manage your account preferences and settings
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-3">
              <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-2 sticky top-24">
                <button
                  onClick={() => setActiveSection("profile")}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    activeSection === "profile"
                      ? "bg-primary/10 text-primary"
                      : "text-text-sec-light dark:text-text-sec-dark hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  <span className="material-symbols-outlined">person</span>
                  <span className="font-bold">Profile</span>
                </button>

                <button
                  onClick={() => setActiveSection("notifications")}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    activeSection === "notifications"
                      ? "bg-primary/10 text-primary"
                      : "text-text-sec-light dark:text-text-sec-dark hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  <span className="material-symbols-outlined">notifications</span>
                  <span className="font-bold">Notifications</span>
                </button>

                <button
                  onClick={() => setActiveSection("security")}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    activeSection === "security"
                      ? "bg-primary/10 text-primary"
                      : "text-text-sec-light dark:text-text-sec-dark hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  <span className="material-symbols-outlined">security</span>
                  <span className="font-bold">Security</span>
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-9">
              {/* Profile Section */}
              {activeSection === "profile" && (
                <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-8">
                  <h2 className="text-2xl font-black text-text-main-light dark:text-white mb-6">
                    Profile Information
                  </h2>

                  <div className="space-y-6">
                    {/* Username */}
                    <div>
                      <label className="block text-text-main-light dark:text-white text-sm font-bold mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        className="w-full px-4 py-3 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-main-light dark:text-white placeholder-text-sec-light dark:placeholder-text-sec-dark focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-text-main-light dark:text-white text-sm font-bold mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full px-4 py-3 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-main-light dark:text-white placeholder-text-sec-light dark:placeholder-text-sec-dark focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                      />
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="block text-text-main-light dark:text-white text-sm font-bold mb-2">
                        Bio
                      </label>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell us about yourself"
                        rows={4}
                        className="w-full px-4 py-3 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-main-light dark:text-white placeholder-text-sec-light dark:placeholder-text-sec-dark focus:ring-2 focus:ring-primary focus:outline-none transition-all resize-none"
                      />
                      <p className="text-text-sec-light dark:text-text-sec-dark text-xs mt-1">
                        {bio.length}/500 characters
                      </p>
                    </div>

                    {/* Save Button */}
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg shadow-primary/20"
                    >
                      {saving ? (
                        <>
                          <LoadingSpinner size="sm" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-sm">save</span>
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Notifications Section */}
              {activeSection === "notifications" && (
                <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-8">
                  <h2 className="text-2xl font-black text-text-main-light dark:text-white mb-6">
                    Notification Preferences
                  </h2>

                  <div className="space-y-6">
                    {/* Email Notifications Toggle */}
                    <div className="flex items-center justify-between p-4 bg-background-light dark:bg-background-dark rounded-lg">
                      <div>
                        <h3 className="text-text-main-light dark:text-white font-bold mb-1">
                          Email Notifications
                        </h3>
                        <p className="text-text-sec-light dark:text-text-sec-dark text-sm">
                          Receive email updates about your account
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={emailNotifications}
                          onChange={(e) => setEmailNotifications(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-border-light dark:bg-border-dark peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    {/* Sales Notifications */}
                    <div className="flex items-center justify-between p-4 bg-background-light dark:bg-background-dark rounded-lg">
                      <div>
                        <h3 className="text-text-main-light dark:text-white font-bold mb-1">
                          Sales Notifications
                        </h3>
                        <p className="text-text-sec-light dark:text-text-sec-dark text-sm">
                          Get notified when your NFTs are sold
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={salesNotifications}
                          onChange={(e) => setSalesNotifications(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-border-light dark:bg-border-dark peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    {/* Bid Notifications */}
                    <div className="flex items-center justify-between p-4 bg-background-light dark:bg-background-dark rounded-lg">
                      <div>
                        <h3 className="text-text-main-light dark:text-white font-bold mb-1">
                          Bid Notifications
                        </h3>
                        <p className="text-text-sec-light dark:text-text-sec-dark text-sm">
                          Receive alerts about new bids
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={bidNotifications}
                          onChange={(e) => setBidNotifications(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-border-light dark:bg-border-dark peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    {/* Follow Notifications */}
                    <div className="flex items-center justify-between p-4 bg-background-light dark:bg-background-dark rounded-lg">
                      <div>
                        <h3 className="text-text-main-light dark:text-white font-bold mb-1">
                          Follow Notifications
                        </h3>
                        <p className="text-text-sec-light dark:text-text-sec-dark text-sm">
                          Know when someone follows you
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={followNotifications}
                          onChange={(e) => setFollowNotifications(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-border-light dark:bg-border-dark peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    {/* Save Button */}
                    <button
                      onClick={handleSaveNotifications}
                      disabled={saving}
                      className="flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg shadow-primary/20"
                    >
                      {saving ? (
                        <>
                          <LoadingSpinner size="sm" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-sm">save</span>
                          <span>Save Preferences</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Security Section */}
              {activeSection === "security" && (
                <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-8">
                  <h2 className="text-2xl font-black text-text-main-light dark:text-white mb-6">
                    Security Settings
                  </h2>

                  <div className="space-y-6">
                    {/* Connected Wallet */}
                    <div className="p-6 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-text-main-light dark:text-white font-bold">
                          Connected Wallet
                        </h3>
                        <span className="px-3 py-1 bg-green-500/10 text-green-500 text-xs font-bold uppercase rounded-full">
                          Connected
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="material-symbols-outlined text-primary text-2xl">
                          account_balance_wallet
                        </span>
                        <div>
                          <p className="text-text-main-light dark:text-white font-mono text-sm">
                            {walletAddress}
                          </p>
                          <p className="text-text-sec-light dark:text-text-sec-dark text-xs">
                            {chain === "ethereum" ? "Ethereum (MetaMask)" : "Hedera (HashPack)"}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleDisconnectWallet}
                        className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold py-2 px-4 rounded-lg transition-all"
                      >
                        <span className="material-symbols-outlined text-sm">logout</span>
                        <span>Disconnect Wallet</span>
                      </button>
                    </div>

                    {/* Two-Factor Authentication */}
                    <div className="p-6 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg">
                      <h3 className="text-text-main-light dark:text-white font-bold mb-2">
                        Two-Factor Authentication
                      </h3>
                      <p className="text-text-sec-light dark:text-text-sec-dark text-sm mb-4">
                        Add an extra layer of security to your account
                      </p>
                      <button className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary font-bold py-2 px-4 rounded-lg transition-all">
                        <span className="material-symbols-outlined text-sm">shield</span>
                        <span>Enable 2FA</span>
                      </button>
                    </div>

                    {/* Session Management */}
                    <div className="p-6 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg">
                      <h3 className="text-text-main-light dark:text-white font-bold mb-2">
                        Active Sessions
                      </h3>
                      <p className="text-text-sec-light dark:text-text-sec-dark text-sm mb-4">
                        Manage your active sessions across devices
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-surface-light dark:bg-surface-dark rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary">devices</span>
                            <div>
                              <p className="text-text-main-light dark:text-white text-sm font-bold">
                                Current Device
                              </p>
                              <p className="text-text-sec-light dark:text-text-sec-dark text-xs">
                                Last active: Just now
                              </p>
                            </div>
                          </div>
                          <span className="text-green-500 text-xs font-bold">ACTIVE</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
