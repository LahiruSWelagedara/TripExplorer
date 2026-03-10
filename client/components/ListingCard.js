import Link from "next/link";
import { useEffect, useState } from "react";

export default function ListingCard({ listing }) {
  const [postedLabel, setPostedLabel] = useState("");

  useEffect(() => {
    if (!listing.createdAt) {
      setPostedLabel("");
      return;
    }
    const createdAt = new Date(listing.createdAt);
    if (Number.isNaN(createdAt.getTime())) {
      setPostedLabel("");
      return;
    }
    const update = () => {
      const diffMs = Date.now() - createdAt.getTime();
      const diffMinutes = Math.max(1, Math.floor(diffMs / 60000));
      if (diffMinutes < 60) {
        setPostedLabel(`Posted ${diffMinutes} min ago`);
        return;
      }
      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24) {
        setPostedLabel(`Posted ${diffHours} hour${diffHours > 1 ? "s" : ""} ago`);
        return;
      }
      const diffDays = Math.floor(diffHours / 24);
      setPostedLabel(`Posted ${diffDays} day${diffDays > 1 ? "s" : ""} ago`);
    };
    update();
  }, [listing.createdAt]);

  const displayPrice =
    listing.price !== undefined && listing.price !== null ? `$${listing.price}` : null;

  return (
    <Link
      href={`/listings/${listing._id}`}
      className="group block rounded-xl overflow-hidden bg-white border border-[#e8e4de] hover:border-[#e0ddd6] hover:shadow-md transition-all duration-200"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={listing.imageUrl}
          alt={listing.title}
          className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute top-3 right-3">
          {displayPrice && (
            <span className="inline-flex px-2.5 py-1 rounded-lg bg-white/95 text-[#2d3436] font-semibold text-sm border border-[#e8e4de]/50">
              {displayPrice}
            </span>
          )}
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
          <span className="px-2 py-1 rounded-lg bg-white/95 text-[#2d3436] text-xs font-medium border border-[#e8e4de]/50">
            {listing.location}
          </span>
          <span className="text-xs text-white/90">{postedLabel}</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-[#2d3436] line-clamp-2 group-hover:text-[#e07c5c] transition-colors mb-1.5">
          {listing.title}
        </h3>
        <p className="text-sm text-[#636e72] line-clamp-2 leading-snug mb-2">
          {listing.description}
        </p>
        <div className="flex items-center gap-1.5 text-xs text-[#636e72]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#4a9b8e]" />
          {listing.createdBy?.name || "Unknown"}
        </div>
      </div>
    </Link>
  );
}
