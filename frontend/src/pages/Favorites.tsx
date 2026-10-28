import { Link } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import {
  useClearFavoritesMutation,
  useGetFavoritesQuery,
} from "../features/api/catsApi";
import { clearFavorites, syncFavorites } from "../features/favorites/favoritesSlice";
import CatCard from "../components/CatCard";
import QueryState from "../components/QueryState";
import { Heart, Trash2, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export default function Favorites() {
  const dispatch = useAppDispatch();
  const { data: favCats = [], isLoading, error } = useGetFavoritesQuery();
  const [clearServerFavorites, { isLoading: isClearing }] =
    useClearFavoritesMutation();

  const handleClear = async () => {
    try {
      await clearServerFavorites().unwrap();
      dispatch(clearFavorites());
      dispatch(syncFavorites([]));
      toast.success("Favorites cleared");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to clear favorites",
      );
    }
  };

  return (
    <div className="relative w-full overflow-hidden min-h-screen">
      {/* Ambient background glows */}
      <div className="absolute top-10 right-10 w-80 h-80 bg-[#e0245e]/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-surface-container-high/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#e0245e]/20 flex items-center justify-center text-[#e0245e]">
              <Heart className="w-5 h-5 fill-[#e0245e]" />
            </div>
            <div>
              <h1 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface">
                Saved Favorites
              </h1>
              <p className="text-xs text-outline">
                {favCats.length} feline companion{favCats.length === 1 ? "" : "s"} saved to your account
              </p>
            </div>
          </div>

          {favCats.length > 0 && (
            <button
              onClick={handleClear}
              disabled={isClearing}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-container-high hover:bg-surface-variant text-outline hover:text-error text-xs font-semibold transition-all self-start sm:self-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear all
            </button>
          )}
        </div>

        {/* Query State */}
        <QueryState loading={isLoading} error={error} />

        {/* Empty state */}
        {!isLoading && !error && favCats.length === 0 && (
          <div className="flex flex-col items-center justify-center p-16 text-center rounded-2xl bg-surface-container border border-surface-container-high/60 shadow-xl max-w-lg mx-auto gap-4 mt-8">
            <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center text-outline">
              <Heart className="w-8 h-8 text-outline-variant" />
            </div>
            <h3 className="text-xl font-bold text-on-surface">No favorites saved yet</h3>
            <p className="text-xs text-on-surface-variant max-w-xs leading-relaxed">
              Browse our cats and tap the heart icon on any companion to save them to your personal shortlist.
            </p>
            <Link
              to="/"
              className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary-container text-on-primary-container font-semibold text-xs shadow-md hover:brightness-110 active:scale-95 transition-all"
            >
              <span>Explore Cats</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Grid of Favorited Cats */}
        {!isLoading && !error && favCats.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
            {favCats.map((cat) => (
              <CatCard key={cat._id} cat={cat} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
