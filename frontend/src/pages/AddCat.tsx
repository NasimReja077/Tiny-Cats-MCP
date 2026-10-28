import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { catFormSchema, type CatFormValues } from "../lib/schemas";
import { useCreateCatMutation } from "../features/api/catsApi";
import {
  ArrowLeft,
  Plus,
  Loader2,
  Sparkles,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";

export default function AddCat() {
  const navigate = useNavigate();
  const [createCat, { isLoading }] = useCreateCatMutation();
  const [imageFile, setImageFile] = useState<File>();
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CatFormValues>({
    resolver: zodResolver(catFormSchema) as any,
    defaultValues: {
      name: "",
      breed: "",
      description: "",
      energyLevel: "medium",
      aggressionLevel: "low",
      kidsFriendly: true,
      apartmentFriendly: true,
      goodWithDogs: false,
      goodWithOtherCats: true,
      grooming: "medium",
      sheddingLevel: "medium",
      aloneTolerance: "medium",
      vocalization: "moderate",
      hypoallergenic: false,
      indoorOnly: true,
      size: "medium",
      color: "Tabby",
      tailSize: "medium",
      lifeSpan: 14,
      foodHabits: "Standard balanced dry and wet food twice daily.",
      isAvailable: true,
    },
  });

  const onSubmit = async (values: CatFormValues) => {
    try {
      const newCat = await createCat({
        cat: values,
        ...(imageFile ? { image: imageFile } : {}),
      }).unwrap();
      toast.success(`${newCat.name} has been added to Tiny Cats! 🐱`);
      navigate(`/cats/${newCat._id}`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create cat record");
    }
  };

  return (
    <div className="relative w-full overflow-hidden min-h-screen">
      {/* Background ambient glows */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-primary-container/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-outline hover:text-on-surface transition-colors font-medium self-start"
        >
          <ArrowLeft className="w-4 h-4" /> Back to browse
        </Link>

        {/* Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-primary text-xs font-semibold uppercase tracking-wider shadow-sm">
              <Plus className="w-3.5 h-3.5 text-primary" />
              Shelter Intake
            </span>
          </div>
          <h1 className="font-headline-lg text-3xl sm:text-4xl font-bold text-on-surface">
            Add a New Cat Companion
          </h1>
          <p className="text-sm text-on-surface-variant">
            Register a rescue cat with an optional photo. Its attributes are available to the Groq AI Advisor and MCP tools.
          </p>
        </div>

        {/* Form Container */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-surface-container rounded-2xl p-6 sm:p-8 border border-surface-container-high/60 shadow-xl flex flex-col gap-8"
        >
          {/* Section 1: Basic Identity */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-on-surface uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-surface-container-high/60">
              <Sparkles className="w-4 h-4 text-primary-container" />
              1. Basic Identity & Photography
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface">
                  Cat Name *
                </label>
                <input
                  type="text"
                  {...register("name")}
                  placeholder="e.g. Oliver, Cleo"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary-container"
                />
                {errors.name && (
                  <p className="text-xs text-error flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Breed */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface">
                  Breed *
                </label>
                <input
                  type="text"
                  {...register("breed")}
                  placeholder="e.g. British Shorthair, Ragdoll, Persian"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary-container"
                />
                {errors.breed && (
                  <p className="text-xs text-error flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.breed.message}
                  </p>
                )}
              </div>
            </div>

            {/* Image upload + Preview */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-outline" /> Cat photo (Optional)
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
                    toast.error("Choose a JPEG, PNG, WebP, or GIF image");
                    event.target.value = "";
                    setImageFile(undefined);
                    setImagePreview("");
                    return;
                  }
                  if (file.size > 5 * 1024 * 1024) {
                    toast.error("Image file must be under 5MB");
                    event.target.value = "";
                    setImageFile(undefined);
                    setImagePreview("");
                    return;
                  }
                  setImageFile(file);
                  setImagePreview(URL.createObjectURL(file));
                }}
                className="w-full rounded-xl border border-surface-container-high bg-surface-container-low px-3.5 py-2.5 text-sm text-on-surface"
              />
              {imagePreview && (
                <div className="mt-2 w-36 h-24 rounded-lg overflow-hidden border border-surface-variant bg-surface-container-low">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface">
                Description & Personality Bio * (min 20 chars)
              </label>
              <textarea
                rows={3}
                {...register("description")}
                placeholder="Describe personality, favorite activities, behavior around people..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low text-on-surface text-sm border border-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary-container leading-relaxed"
              />
              {errors.description && (
                <p className="text-xs text-error flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          {/* Section 2: Physical & Characteristics */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-on-surface uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-surface-container-high/60">
              <Sparkles className="w-4 h-4 text-tertiary" />
              2. Physical Attributes & Lifespan
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Energy Level */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface">Energy</label>
                <select
                  {...register("energyLevel")}
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-on-surface text-xs border border-surface-container-high focus:ring-2 focus:ring-primary-container"
                >
                  <option value="low">Low Calm</option>
                  <option value="medium">Medium</option>
                  <option value="high">High Energetic</option>
                </select>
              </div>

              {/* Size */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface">Size</label>
                <select
                  {...register("size")}
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-on-surface text-xs border border-surface-container-high focus:ring-2 focus:ring-primary-container"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>

              {/* Lifespan */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface">Lifespan (yrs)</label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  {...register("lifeSpan", { valueAsNumber: true })}
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-on-surface text-xs border border-surface-container-high focus:ring-2 focus:ring-primary-container"
                />
              </div>

              {/* Color */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface">Color / Pattern</label>
                <input
                  type="text"
                  {...register("color")}
                  placeholder="e.g. Calico, White"
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-on-surface text-xs border border-surface-container-high focus:ring-2 focus:ring-primary-container"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Vocalization */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface">Vocalization</label>
                <select
                  {...register("vocalization")}
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-on-surface text-xs border border-surface-container-high focus:ring-2 focus:ring-primary-container"
                >
                  <option value="quiet">Quiet</option>
                  <option value="moderate">Moderate</option>
                  <option value="vocal">Vocal</option>
                </select>
              </div>

              {/* Shedding */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface">Shedding</label>
                <select
                  {...register("sheddingLevel")}
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-on-surface text-xs border border-surface-container-high focus:ring-2 focus:ring-primary-container"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              {/* Grooming */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface">Grooming</label>
                <select
                  {...register("grooming")}
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-on-surface text-xs border border-surface-container-high focus:ring-2 focus:ring-primary-container"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              {/* Aggression */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface">Aggression</label>
                <select
                  {...register("aggressionLevel")}
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-low text-on-surface text-xs border border-surface-container-high focus:ring-2 focus:ring-primary-container"
                >
                  <option value="low">Low Gentle</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Lifestyle & Living Dynamics */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-on-surface uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-surface-container-high/60">
              <Sparkles className="w-4 h-4 text-secondary" />
              3. Living & Compatibility Flags
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <label className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low border border-surface-container-high/40 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("kidsFriendly")}
                  className="w-4 h-4 accent-primary-container rounded"
                />
                <span className="text-xs font-medium text-on-surface">Kids Friendly</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low border border-surface-container-high/40 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("apartmentFriendly")}
                  className="w-4 h-4 accent-primary-container rounded"
                />
                <span className="text-xs font-medium text-on-surface">Apartment Friendly</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low border border-surface-container-high/40 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("indoorOnly")}
                  className="w-4 h-4 accent-primary-container rounded"
                />
                <span className="text-xs font-medium text-on-surface">Indoor Only</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low border border-surface-container-high/40 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("goodWithDogs")}
                  className="w-4 h-4 accent-primary-container rounded"
                />
                <span className="text-xs font-medium text-on-surface">Good with Dogs</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low border border-surface-container-high/40 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("goodWithOtherCats")}
                  className="w-4 h-4 accent-primary-container rounded"
                />
                <span className="text-xs font-medium text-on-surface">Good with Other Cats</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low border border-surface-container-high/40 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("hypoallergenic")}
                  className="w-4 h-4 accent-primary-container rounded"
                />
                <span className="text-xs font-medium text-on-surface">Hypoallergenic</span>
              </label>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-surface-container-high/60 flex items-center justify-end gap-4">
            <Link
              to="/"
              className="px-5 py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-variant text-on-surface text-xs font-semibold transition-all"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl bg-primary-container text-on-primary-container hover:brightness-110 active:scale-95 text-sm font-bold shadow-lg shadow-primary-container/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting to Database…</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Create Cat Record</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
