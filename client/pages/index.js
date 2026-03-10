import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { apiFetch } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import ListingCard from "../components/ListingCard";
import { DUMMY_LISTINGS } from "../data/dummyListings";

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [listings, setListings] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await apiFetch(
          `/api/listings?search=${encodeURIComponent(
            debouncedSearch
          )}&page=${page}&limit=9`
        );
        setListings(res.data || []);
        setPagination(res.pagination || null);
      } catch (err) {
        setError(err.message || "Failed to load listings");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [debouncedSearch, page]);

  const handleNext = () => {
    if (pagination && page < pagination.totalPages) {
      setPage((p) => p + 1);
    }
  };

  const handlePrev = () => {
    if (page > 1) {
      setPage((p) => p - 1);
    }
  };

  const hasRealListings = listings.length > 0;
  const normalizedSearch = debouncedSearch.trim().toLowerCase();
  const filteredFallback =
    normalizedSearch.length === 0
      ? DUMMY_LISTINGS
      : DUMMY_LISTINGS.filter((item) => {
          const haystack = `${item.title} ${item.location} ${item.description}`.toLowerCase();
          return haystack.includes(normalizedSearch);
        });
  const visibleListings = [...filteredFallback, ...listings];

  return (
    <div className="space-y-10">
      <section className="max-w-3xl mx-auto text-center space-y-6">
        <p className="inline-flex items-center gap-2 te-badge">
          <span className="h-2 w-2 rounded-full bg-[#4a9b8e] animate-pulse" />
          Discover local experiences
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#2d3436] leading-tight">
          Adventures curated by{" "}
          <span className="text-[#e07c5c]">locals</span>
        </h1>
        <p className="text-lg text-[#636e72] max-w-2xl mx-auto leading-relaxed">
          Sunset boat tours, food walks, hidden gems — find your next trip through the eyes of people who live there.
        </p>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 max-w-xl mx-auto">
          <div className="relative flex-1">
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by title, location, or vibe..."
              className="te-input pl-5 pr-12"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#b2bec3]">
              🔍
            </span>
          </div>
          <button
            onClick={() =>
              user ? router.push("/dashboard/new-listing") : router.push("/login")
            }
            className="te-primary-btn w-full sm:w-auto shrink-0"
          >
            {user ? "Create experience" : "Become a host"}
          </button>
        </div>
        <div className="flex justify-center gap-2 flex-wrap">
          <span className="te-chip">No ads</span>
          <span className="te-chip">Real hosts</span>
          <span className="te-chip">Curated</span>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between text-sm text-[#636e72]">
          <span>
            {hasRealListings && pagination
              ? `${pagination.total} experiences · Page ${pagination.page} of ${pagination.totalPages}`
              : hasRealListings
              ? `${listings.length} experiences`
              : "Featured experiences from our demo hosts"}
          </span>
        </div>

        {error && (
          <div className="te-card p-4 text-sm text-red-600 bg-red-50 border-red-200">
            {error}
          </div>
        )}

        {loading && (
          <div className="te-grid">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-[#e8e4de] bg-white h-72 animate-pulse"
              />
            ))}
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="te-grid">
              {visibleListings.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>

            {hasRealListings && pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <button
                  onClick={handlePrev}
                  disabled={page === 1}
                  className="te-secondary-btn"
                >
                  ← Previous
                </button>
                <span className="text-sm text-[#636e72]">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={handleNext}
                  disabled={page === pagination.totalPages}
                  className="te-secondary-btn"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
