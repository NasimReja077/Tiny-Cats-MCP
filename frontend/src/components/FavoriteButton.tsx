import { SignInButton, useAuth } from "@clerk/clerk-react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { toggleFavorite } from "../features/favorites/favoritesSlice";
import {
  useGetFavoritesQuery,
  useSetFavoriteMutation,
} from "../features/api/catsApi";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  catId: string;
  catName?: string;
  label?: boolean;
  className?: string;
}

export default function FavoriteButton({
  catId,
  catName = "Cat",
  label = false,
  className = "",
}: Props) {
  const dispatch = useAppDispatch();
  const isFav = useAppSelector((s) => s.favorites.ids.includes(catId));
  const { isLoaded, isSignedIn } = useAuth();
  const { isLoading: isLoadingFavorites } = useGetFavoritesQuery(undefined, {
    skip: !isSignedIn,
  });
  const [setFavorite, { isLoading }] = useSetFavoriteMutation();

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (isSignedIn) {
        await setFavorite({ catId, favorite: !isFav }).unwrap();
      }
      dispatch(toggleFavorite(catId));
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
          : "Could not update favorites";
      toast.error(message);
      return;
    }
    if (!isFav) {
      toast.success(`Saved ${catName} to favorites! ❤️`, {
        style: {
          background: "#221f1c",
          color: "#e9e1dc",
          border: "1px solid #38332e",
        },
        iconTheme: {
          primary: "#ef8148",
          secondary: "#161310",
        },
      });
    } else {
      toast(`Removed ${catName} from favorites`, {
        icon: "💔",
        style: {
          background: "#221f1c",
          color: "#a39a90",
          border: "1px solid #38332e",
        },
      });
    }
  };

  const button = (
    <button
      type="button"
      aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
      onClick={isSignedIn ? handleToggle : undefined}
      disabled={!isLoaded || isLoading || (Boolean(isSignedIn) && isLoadingFavorites)}
      className={`group/fav transition-all active:scale-90 ${
        label
          ? "inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-surface-container-high border border-surface-variant hover:border-primary-container text-on-surface font-semibold text-sm shadow-sm"
          : "w-9 h-9 rounded-full bg-[#100e0b]/80 backdrop-blur-md flex items-center justify-center text-outline hover:text-[#e0245e] hover:scale-110 shadow-md"
      } ${isFav ? "text-[#e0245e]" : ""} ${className}`}
    >
      <Heart
        className={`w-5 h-5 transition-transform group-hover/fav:scale-110 ${
          isFav
            ? "fill-[#e0245e] text-[#e0245e] animate-heart"
            : "text-outline group-hover/fav:text-[#e0245e]"
        }`}
      />
      {label && <span>{isFav ? "Favorited" : "Save to Favorites"}</span>}
    </button>
  );

  return isSignedIn ? button : (
    <SignInButton mode="modal">{button}</SignInButton>
  );
}
