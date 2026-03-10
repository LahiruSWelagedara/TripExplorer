import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../contexts/AuthContext";
import { apiFetch, uploadImage } from "../../lib/api";

export default function NewListingPage() {
  const router = useRouter();
  const { user, token, loading } = useAuth();
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !token) return;
    setSubmitting(true);
    setError("");
    try {
      const body = {
        title,
        location,
        imageUrl,
        description,
        price: price ? Number(price) : undefined,
      };
      const listing = await apiFetch("/api/listings", {
        method: "POST",
        token,
        body,
      });
      router.push(`/listings/${listing._id}`);
    } catch (err) {
      setError(err.message || "Failed to create listing");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return null;

  const handleImageSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !token) return;
    setUploadError("");
    setUploading(true);
    try {
      const { url } = await uploadImage(file, token);
      setImageUrl(url);
    } catch (err) {
      setUploadError(err.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="te-card p-8">
        <p className="te-badge mb-4 inline-flex">
          Share an experience
        </p>
        <h1 className="text-2xl font-bold text-[#2d3436] mb-2">
          Create your listing
        </h1>
        <p className="text-[#636e72] mb-6">
          Help travelers discover what makes your city special. Be specific — titles like &quot;Sunset sail with local snacks&quot; perform better than &quot;Boat tour&quot;.
        </p>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#2d3436] mb-2">Title</label>
              <input
                className="te-input"
                placeholder="Sunset Boat Tour"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2d3436] mb-2">Location</label>
              <input
                className="te-input"
                placeholder="Bali, Indonesia"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#2d3436] mb-2">Image URL</label>
              <input
                className="te-input"
                placeholder="https://..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
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
              placeholder="Describe the experience, who it's for, and what makes it special."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-[#2d3436] mb-2">Price (optional, USD)</label>
              <input
                className="te-input"
                type="number"
                min="0"
                step="1"
                placeholder="45"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="te-primary-btn w-full sm:w-auto"
            >
              {submitting ? "Publishing..." : "Publish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
