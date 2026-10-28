import { useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useGetCatQuery,
  useUpdateCatImageMutation,
  useDeleteCatMutation,
} from "../features/api/catsApi";
import FavoriteButton from "../components/FavoriteButton";
import QueryState from "../components/QueryState";
import { FALLBACK_IMG } from "../components/CatCard";
import {
  ArrowLeft,
  Camera,
  ShieldCheck,
  Zap,
  Clock,
  Building,
  CheckCircle2,
  XCircle,
  Share2,
  Sparkles,
  MessageCircle,
  Trash2,
} from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import toast from "react-hot-toast";

export default function CatDetail() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { data: cat, isLoading, error } = useGetCatQuery(id, { skip: !id });
  const [updateCatImage, { isLoading: isUploading }] = useUpdateCatImageMutation();
  const [deleteCat, { isLoading: isDeleting }] = useDeleteCatMutation();
  const { user } = useUser();
  const canManage = Boolean(user && cat?.createdByClerkId === user.id);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [inquirySent, setInquirySent] = useState(false);

  if (isLoading || error || !cat) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-outline hover:text-on-surface mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to browse
        </Link>
        <QueryState
          loading={isLoading}
          error={error}
          empty={!isLoading && !error && !cat}
          emptyText="Companion not found or may have been adopted."
        />
      </div>
    );
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPEG, PNG, WebP)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file must be under 5MB");
      return;
    }

    try {
      await updateCatImage({ id: cat._id, file }).unwrap();
      toast.success("Cat photo updated successfully! 📸");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update image");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Cat profile link copied to clipboard! 📋");
  };

  const handleInquiry = () => {
    setInquirySent(true);
    toast.success(`Inquiry sent for ${cat.name}! A shelter counselor will reach out.`);
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete ${cat.name}? This cannot be undone.`)) return;
    try {
      await deleteCat(cat._id).unwrap();
      toast.success(`${cat.name} was deleted`);
      navigate("/");
    } catch (error) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        typeof error.data === "object" &&
        error.data !== null &&
        "message" in error.data &&
        typeof error.data.message === "string"
          ? error.data.message
          : "Failed to delete cat";
      toast.error(message);
    }
  };

  return (
    <div className="relative w-full overflow-hidden min-h-screen">
      {/* Background ambient accents */}
      <div className="absolute top-0 right-1/3 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary-container/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        {/* Top Breadcrumb Nav */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-outline hover:text-on-surface transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back to all cats
          </Link>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-variant text-outline hover:text-on-surface text-xs font-semibold transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share Profile
          </button>
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Photo & Image Replacement (6 Cols) */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-surface-container-low border border-surface-container-high/60 shadow-2xl group">
              <img
                src={cat.image || FALLBACK_IMG}
                alt={cat.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_IMG;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#161310]/80 via-transparent to-transparent"></div>

              {/* Status Badge */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-surface-container-lowest/80 backdrop-blur-md text-on-surface text-xs font-bold shadow-md">
                  {cat.isAvailable ? "Available for Adoption" : "Reserved"}
                </span>
                <span className="px-3 py-1 rounded-full bg-secondary-container/80 backdrop-blur-md text-secondary text-xs font-bold shadow-md flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Medically Vetted
                </span>
              </div>

              {/* Favorite Action */}
              <div className="absolute top-4 right-4 z-10">
                <FavoriteButton catId={cat._id} catName={cat.name} />
              </div>

              {/* Image Upload Trigger */}
              <div className="absolute bottom-4 right-4">
                {canManage ? (
                  <>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={isUploading}
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-lowest/80 backdrop-blur-md hover:bg-surface-container text-xs font-semibold text-on-surface shadow-md border border-surface-variant transition-all"
                    >
                      <Camera className="w-4 h-4 text-primary" />
                      {isUploading ? "Uploading…" : "Change Photo"}
                    </button>
                  </>
                ) : (
                  <span className="text-[11px] text-outline bg-surface-container-lowest/70 backdrop-blur-md px-2.5 py-1 rounded-md">
                    Only the creator can change this photo
                  </span>
                )}
              </div>
            </div>

            {/* Quick foster note quote */}
            <div className="p-4 rounded-xl bg-surface-container border border-surface-container-high/60 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-tertiary shrink-0 mt-0.5" />
              <p className="text-xs text-on-surface-variant italic leading-relaxed">
                "Observed by shelter staff: {cat.name} responds well to soothing voices and settles into cozy lap routines with gentle care."
              </p>
            </div>
          </div>

          {/* Right Column: Title, Quick Badges & Overview (6 Cols) */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h1 className="font-headline-lg text-3xl sm:text-4xl font-bold text-on-surface tracking-tight">
                  {cat.name}
                </h1>
                <div className="flex items-center gap-2">
                  {canManage && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="inline-flex items-center gap-2 rounded-lg border border-error/30 px-3.5 py-2 text-sm font-semibold text-error hover:bg-error/10 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      {isDeleting ? "Deleting…" : "Delete"}
                    </button>
                  )}
                  <FavoriteButton catId={cat._id} catName={cat.name} label />
                </div>
              </div>
              <p className="text-base text-primary font-semibold">
                {cat.breed}
              </p>
            </div>

            {/* Primary Fact Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-surface-container border border-surface-container-high/60 flex flex-col gap-1">
                <span className="text-xs text-outline flex items-center gap-1 font-medium">
                  <Zap className="w-3.5 h-3.5 text-tertiary" /> Energy Level
                </span>
                <span className="text-sm font-bold text-on-surface capitalize">
                  {cat.energyLevel || "Balanced"}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-surface-container border border-surface-container-high/60 flex flex-col gap-1">
                <span className="text-xs text-outline flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-primary" /> Lifespan
                </span>
                <span className="text-sm font-bold text-on-surface">
                  {cat.lifeSpan ? `${cat.lifeSpan} Years` : "12-15 Years"}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-surface-container border border-surface-container-high/60 flex flex-col gap-1">
                <span className="text-xs text-outline flex items-center gap-1 font-medium">
                  <Building className="w-3.5 h-3.5 text-secondary" /> Space
                </span>
                <span className="text-sm font-bold text-on-surface">
                  {cat.apartmentFriendly ? "Apartment OK" : "Needs Yard"}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">
                About {cat.name}
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed bg-surface-container/60 p-4 rounded-xl border border-surface-container-high/40">
                {cat.description ||
                  `${cat.name} is a lovely ${cat.breed} looking for a dedicated home with warm affection and calm companionship.`}
              </p>
            </div>

            {/* Lifestyle Compatibility Checks */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider">
                Lifestyle Compatibility
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-container border border-surface-container-high/40">
                  {cat.kidsFriendly ? (
                    <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-outline shrink-0" />
                  )}
                  <span className="text-on-surface font-medium">Kids Friendly</span>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-container border border-surface-container-high/40">
                  {cat.apartmentFriendly ? (
                    <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-outline shrink-0" />
                  )}
                  <span className="text-on-surface font-medium">Apartment Friendly</span>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-container border border-surface-container-high/40">
                  {cat.goodWithDogs ? (
                    <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-outline shrink-0" />
                  )}
                  <span className="text-on-surface font-medium">Good with Dogs</span>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-container border border-surface-container-high/40">
                  {cat.goodWithOtherCats ? (
                    <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-outline shrink-0" />
                  )}
                  <span className="text-on-surface font-medium">Good with Other Cats</span>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-container border border-surface-container-high/40">
                  {cat.indoorOnly ? (
                    <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-outline shrink-0" />
                  )}
                  <span className="text-on-surface font-medium">Indoor Only</span>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-container border border-surface-container-high/40">
                  {cat.hypoallergenic ? (
                    <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-outline shrink-0" />
                  )}
                  <span className="text-on-surface font-medium">Hypoallergenic</span>
                </div>
              </div>
            </div>

            {/* Adoption CTA Card */}
            <div className="p-5 rounded-2xl bg-surface-container border border-surface-container-high/80 flex flex-col sm:flex-row items-center justify-between gap-4 mt-2 shadow-xl">
              <div>
                <p className="font-bold text-on-surface text-base">
                  Ready to adopt {cat.name}?
                </p>
                <p className="text-xs text-outline">
                  Submit a foster adoption inquiry or chat with our AI Advisor.
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Link
                  to="/advisor"
                  className="px-4 py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-variant text-on-surface text-xs font-semibold transition-all flex items-center justify-center gap-1.5 flex-1 sm:flex-initial"
                >
                  <Sparkles className="w-3.5 h-3.5 text-tertiary" />
                  Check Fit
                </Link>

                <button
                  onClick={handleInquiry}
                  disabled={inquirySent}
                  className="px-5 py-2.5 rounded-lg bg-primary-container text-on-primary-container hover:brightness-110 active:scale-95 text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 flex-1 sm:flex-initial disabled:opacity-60"
                >
                  <MessageCircle className="w-4 h-4" />
                  {inquirySent ? "Inquiry Sent!" : "Adopt Me"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Breed Details & Specifications Grid */}
        <section className="bg-surface-container rounded-2xl p-6 lg:p-8 border border-surface-container-high/60 shadow-xl space-y-6">
          <h2 className="font-headline-sm text-xl font-bold text-on-surface">
            Physical Traits & Care Specifications
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-xs">
            <div className="flex flex-col gap-1 p-3 rounded-xl bg-surface-container-low border border-surface-container-high/40">
              <span className="text-outline">Color / Coat</span>
              <span className="font-bold text-on-surface text-sm capitalize">
                {cat.color || "Natural"}
              </span>
            </div>

            <div className="flex flex-col gap-1 p-3 rounded-xl bg-surface-container-low border border-surface-container-high/40">
              <span className="text-outline">Size Category</span>
              <span className="font-bold text-on-surface text-sm capitalize">
                {cat.size || "Medium"}
              </span>
            </div>

            <div className="flex flex-col gap-1 p-3 rounded-xl bg-surface-container-low border border-surface-container-high/40">
              <span className="text-outline">Aggression / Temper</span>
              <span className="font-bold text-on-surface text-sm capitalize">
                {cat.aggressionLevel || "Low Gentle"}
              </span>
            </div>

            <div className="flex flex-col gap-1 p-3 rounded-xl bg-surface-container-low border border-surface-container-high/40">
              <span className="text-outline">Tail Size</span>
              <span className="font-bold text-on-surface text-sm capitalize">
                {cat.tailSize || "Medium Full"}
              </span>
            </div>

            <div className="flex flex-col gap-1 p-3 rounded-xl bg-surface-container-low border border-surface-container-high/40">
              <span className="text-outline">Vocalization</span>
              <span className="font-bold text-on-surface text-sm capitalize">
                {cat.vocalization || "Quiet Chirps"}
              </span>
            </div>

            <div className="flex flex-col gap-1 p-3 rounded-xl bg-surface-container-low border border-surface-container-high/40">
              <span className="text-outline">Grooming Frequency</span>
              <span className="font-bold text-on-surface text-sm capitalize">
                {cat.grooming || "Low Maintenance"}
              </span>
            </div>

            <div className="flex flex-col gap-1 p-3 rounded-xl bg-surface-container-low border border-surface-container-high/40">
              <span className="text-outline">Shedding Rate</span>
              <span className="font-bold text-on-surface text-sm capitalize">
                {cat.sheddingLevel || "Low"}
              </span>
            </div>

            <div className="flex flex-col gap-1 p-3 rounded-xl bg-surface-container-low border border-surface-container-high/40">
              <span className="text-outline">Alone Tolerance</span>
              <span className="font-bold text-on-surface text-sm capitalize">
                {cat.aloneTolerance || "High (Calm)"}
              </span>
            </div>
          </div>

          {cat.foodHabits && (
            <div className="pt-2 border-t border-surface-container-high/60">
              <span className="text-xs text-outline font-semibold uppercase tracking-wider">
                Dietary & Feeding Habits
              </span>
              <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">
                {cat.foodHabits}
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
