import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../contexts/AuthContext";

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5]">
      <header className="sticky top-0 z-30 bg-white/98 backdrop-blur-lg border-b border-[#e8e4de] shadow-[0_1px_0_0_rgba(255,255,255,0.8)_inset]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => router.push("/")}
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#e07c5c] to-[#4a9b8e] flex items-center justify-center text-white font-bold text-base shadow-md group-hover:shadow-lg group-hover:scale-[1.02] transition-all duration-200">
              ✈
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-[#2d3436]">
                TripExplorer
              </span>
              <p className="text-[10px] text-[#636e72] -mt-0.5 hidden sm:block">
                Local experiences
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/"
              className="px-3 py-2 rounded-lg text-sm font-medium text-[#636e72] hover:text-[#2d3436] hover:bg-[#f5f4f0] transition-colors"
            >
              Explore
            </Link>
            {!user ? (
              <>
                <Link
                  href="/login"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-[#636e72] hover:text-[#2d3436] hover:bg-[#f5f4f0] transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="ml-1 te-primary-btn py-2"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard/my-listings"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-[#636e72] hover:text-[#2d3436] hover:bg-[#f5f4f0] transition-colors"
                >
                  My listings
                </Link>
                <Link
                  href="/dashboard/new-listing"
                  className="ml-1 te-primary-btn py-2"
                >
                  New listing
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-[#636e72] hover:text-[#2d3436] hover:bg-[#f5f4f0] transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 md:py-12">{children}</div>
      </main>

      <footer className="mt-auto border-t border-[#e8e4de] bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-[#e07c5c] to-[#4a9b8e] flex items-center justify-center text-white text-xs font-bold">
                ✈
              </div>
              <span className="font-semibold text-[#2d3436]">TripExplorer</span>
            </div>
            <p className="text-sm text-[#636e72] max-w-md">
              Discover unique experiences curated by locals. Sunset tours, food walks, hidden gems — your next adventure starts here.
            </p>
          </div>
          <div className="mt-6 pt-6 border-t border-[#e8e4de] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <span className="text-xs text-[#b2bec3]">
              © {new Date().getFullYear()} TripExplorer. All rights reserved.
            </span>
            <div className="flex gap-6 text-sm">
              <Link href="/" className="text-[#636e72] hover:text-[#2d3436] transition-colors">
                Explore
              </Link>
              <Link href="/login" className="text-[#636e72] hover:text-[#2d3436] transition-colors">
                Log in
              </Link>
              <Link href="/register" className="text-[#636e72] hover:text-[#2d3436] transition-colors">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
