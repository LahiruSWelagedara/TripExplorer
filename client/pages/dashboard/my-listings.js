import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../contexts/AuthContext";
import { apiFetch } from "../../lib/api";
import ListingCard from "../../components/ListingCard";

export default function MyListingsPage() {
  const router = useRouter();
  const { user, token, loading } = useAuth();
  const [listings, setListings] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    const load = async () => {
      if (!user || !token) return;
      setFetching(true);
      setError("");
      try {
        const data = await apiFetch("/api/listings/me/mine", { token });
        setListings(data || []);
      } catch (err) {
        setError(err.message || "Failed to load your listings");
      } finally {
        setFetching(false);
      }
    };
    load();
  }, [user, token]);

  const handleEdit = (id) => {
    router.push(`/listings/${id}?edit=1`);
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <p className="te-badge mb-3">Your listings</p>
        <h1 className="text-2xl font-bold text-[#2d3436]">
          Manage your experiences
        </h1>
        <p className="text-[#636e72] mt-1">
          Edit, update or remove — changes appear instantly in the feed.
        </p>
      </div>

      {error && (
        <div className="te-card p-4 text-sm text-red-600 bg-red-50 border-red-100">
          {error}
        </div>
      )}

      {fetching && (
        <div className="te-grid">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-[#e8e4de] bg-white h-72 animate-pulse"
            />
          ))}
        </div>
      )}

      {!fetching && listings.length === 0 && !error && (
        <div className="te-card p-10 text-center">
          <p className="text-5xl mb-4">📝</p>
          <p className="text-xl font-semibold text-[#2d3436] mb-2">
            No listings yet
          </p>
          <p className="text-[#636e72] mb-5">
            Create your first experience and share it with travelers.
          </p>
          <button
            onClick={() => router.push("/dashboard/new-listing")}
            className="te-primary-btn"
          >
            Create listing
          </button>
        </div>
      )}

      {!fetching && listings.length > 0 && (
        <div className="te-grid">
          {listings.map((listing) => (
            <div key={listing._id} className="relative group/card">
              <ListingCard listing={listing} />
              <button
                onClick={() => handleEdit(listing._id)}
                className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-white/95 text-[#2d3436] text-xs font-medium border border-[#e8e4de] shadow-sm hover:bg-white z-10"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
