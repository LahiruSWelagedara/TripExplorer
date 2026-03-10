import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { apiFetch, uploadImage } from "../../lib/api";
import { useAuth } from "../../contexts/AuthContext";
import { DUMMY_LISTINGS } from "../../data/dummyListings";

export default function ListingDetailPage() {
  const router = useRouter();
  const { id, edit } = router.query;
  const { user, token } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [likeLoading, setLikeLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    title: "",
    location: "",
    imageUrl: "",
    description: "",
    price: "",
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    if (edit === "1") {
      setEditMode(true);
    }
  }, [edit]);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        if (typeof id === "string" && id.startsWith("dummy-")) {
          const dummy = DUMMY_LISTINGS.find((d) => d._id === id);
          if (!dummy) {
            setError("Listing not found");
          } else {
            setListing(dummy);
            setForm({
              title: dummy.title || "",
              location: dummy.location || "",
              imageUrl: dummy.imageUrl || "",
              description: dummy.description || "",
              price:
                dummy.price !== undefined && dummy.price !== null
                  ? String(dummy.price)
                  : "",
            });
          }
        } else {
          const data = await apiFetch(`/api/listings/${id}`);
          setListing(data);
          setForm({
            title: data.title || "",
            location: data.location || "",
            imageUrl: data.imageUrl || "",
            description: data.description || "",
            price:
              data.price !== undefined && data.price !== null
                ? String(data.price)
                : "",
          });
        }
      } catch (err) {
        setError(err.message || "Failed to load listing");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const isDummy = listing && typeof listing._id === "string" && listing._id.startsWith("dummy-");

  const isOwner = useMemo(() => {
    if (!user || !listing || isDummy) return false;
    return listing.createdBy?._id === user.id;
  }, [user, listing, isDummy]);

  const hasLiked = useMemo(() => {
    if (!user || !listing || isDummy) return false;
    return (listing.likes || []).some((u) => u === user.id || u?._id === user.id);
  }, [user, listing]);

  const handleLike = async () => {
    if (!user || !token || !listing || isDummy) return;
    setLikeLoading(true);
    try {
      const updated = await apiFetch(`/api/listings/${listing._id}/like`, {
        method: "POST",
        token,
      });
      setListing(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!user || !token || !listing || isDummy) return;
    setSaving(true);
    try {
      const body = {
        title: form.title,
        location: form.location,
        imageUrl: form.imageUrl,
        description: form.description,
        price: form.price ? Number(form.price) : undefined,
      };
      const updated = await apiFetch(`/api/listings/${listing._id}`, {
        method: "PUT",
        token,
        body,
      });
      setListing(updated);
      setEditMode(false);
    } catch (err) {
      setError(err.message || "Failed to update listing");
    } finally {
      setSaving(false);
    }
  };

  const handleImageSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !token) return;
    setUploadError("");
    setUploading(true);
    try {
      const { url } = await uploadImage(file, token);
      setForm((f) => ({ ...f, imageUrl: url }));
    } catch (err) {
      setUploadError(err.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!user || !token || !listing || isDummy) return;
    if (!window.confirm("Delete this listing? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await apiFetch(`/api/listings/${listing._id}`, {
        method: "DELETE",
        token,
      });
      router.push("/dashboard/my-listings");
    } catch (err) {
      setError(err.message || "Failed to delete listing");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="te-card p-6 animate-pulse min-h-[320px]">
        <div className="h-6 w-44 bg-[#e8e4de] rounded-lg mb-4" />
        <div className="h-8 w-64 bg-[#e8e4de] rounded-lg mb-4" />
        <div className="h-64 w-full bg-[#e8e4de] rounded-2xl mb-6" />
        <div className="h-4 w-full bg-[#e8e4de] rounded mb-2" />
        <div className="h-4 w-2/3 bg-[#e8e4de] rounded" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="te-card p-6 text-sm text-red-600 bg-red-50 border-red-100">
        {error}
      </div>
    );
  }

  if (!listing) return null;

  const likesCount = listing.likes ? listing.likes.length : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="grid md:grid-cols-[1.4fr_1fr] gap-6 items-start">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-[#e8e4de] shadow-lg">
            <div className="relative aspect-[4/3]">
              <img
                src={listing.imageUrl}
                alt={listing.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div className="space-y-1">
                  <span className="inline-flex px-3 py-1.5 rounded-xl bg-white/95 text-[#2d3436] font-semibold text-sm">
                    {listing.location}
                  </span>
                  <p className="text-sm text-white/90">
                    Hosted by {listing.createdBy?.name || "Unknown"}
                  </p>
                </div>
                {listing.price !== undefined && listing.price !== null && (
                  <div className="px-4 py-2 rounded-xl bg-white text-[#2d3436] font-bold text-lg">
                    ${listing.price}
                  </div>
                )}
              </div>
            </div>
          </div>

          {user && (
            <button
              onClick={handleLike}
              disabled={likeLoading}
              className={`te-like ${hasLiked ? "te-like-active" : ""}`}
            >
              <span>{hasLiked ? "♥" : "♡"}</span>
              <span>{hasLiked ? "Saved" : "Save to favorites"}</span>
              <span className="text-xs opacity-80">
                {likesCount} {likesCount === 1 ? "like" : "likes"}
              </span>
            </button>
          )}
        </div>

        <div className="te-card p-6 space-y-5">
          {!editMode ? (
            <>
              <div>
                <h1 className="text-2xl font-bold text-[#2d3436] mb-2">
                  {listing.title}
                </h1>
                <p className="text-sm text-[#636e72]">
                  Hosted by {listing.createdBy?.name || "Unknown"}
                </p>
              </div>
              <p className="text-[#636e72] leading-relaxed whitespace-pre-line">
                {listing.description}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="te-chip">In {listing.location}</span>
                <span className="te-chip">Curated experience</span>
              </div>
              {isOwner && (
                <div className="flex flex-wrap gap-2 pt-4 border-t border-[#e8e4de]">
                  <button
                    onClick={() => setEditMode(true)}
                    className="te-secondary-btn"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="te-secondary-btn border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              )}
            </>
          ) : (
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#2d3436]">Edit listing</h2>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="text-sm text-[#636e72] hover:text-[#2d3436]"
                >
                  Cancel
                </button>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[#2d3436] mb-2">Title</label>
                  <input
                    className="te-input"
                    value={form.title}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, title: e.target.value }))
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2d3436] mb-2">Location</label>
                  <input
                    className="te-input"
                    value={form.location}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, location: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[#2d3436] mb-2">Image URL</label>
                  <input
                    className="te-input"
                    value={form.imageUrl}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, imageUrl: e.target.value }))
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2d3436] mb-2">Or upload</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="block w-full text-sm text-[#636e72] file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:font-medium file:bg-[#e8e4de] file:text-[#2d3436] hover:file:bg-[#e0ddd6] cursor-pointer"
                  />
                  {uploading && <p className="mt-1 text-xs text-[#636e72]">Uploading...</p>}
                  {uploadError && <p className="mt-1 text-xs text-red-600">{uploadError}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2d3436] mb-2">Description</label>
                <textarea
                  className="te-textarea"
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2d3436] mb-2">Price (optional, USD)</label>
                <input
                  type="number"
                  min="0"
                  className="te-input"
                  value={form.price}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, price: e.target.value }))
                  }
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="te-primary-btn w-full"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
