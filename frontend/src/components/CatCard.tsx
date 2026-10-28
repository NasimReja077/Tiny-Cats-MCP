import { Link } from "react-router-dom";
import type { Cat } from "../types/cat";
import FavoriteButton from "./FavoriteButton";
import { Zap, CheckCircle2, ShieldCheck } from "lucide-react";

export const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80";

export default function CatCard({ cat }: { cat: Cat }) {
  const energyBadgeColor =
    cat.energyLevel === "high"
      ? "text-primary"
      : cat.energyLevel === "medium"
      ? "text-secondary"
      : "text-tertiary";

  return (
    <article className="cat-card group flex flex-col bg-surface-container rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative border border-surface-container-high/60">
      {/* Image Area */}
      <div className="relative w-full aspect-[4/3] bg-surface-container-low overflow-hidden">
        <Link to={`/cats/${cat._id}`} className="block w-full h-full">
          <img
            src={cat.image || FALLBACK_IMG}
            alt={cat.name}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = FALLBACK_IMG;
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </Link>
        <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent opacity-80 pointer-events-none"></div>

        {/* Age / Status Pill */}
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-surface-container-lowest/80 backdrop-blur-md text-on-surface text-xs font-semibold shadow-md">
          {cat.lifeSpan ? `${cat.lifeSpan} yrs lifespan` : "Companion"}
        </span>

        {/* Favorite Heart */}
        <div className="absolute top-3 right-3 z-10">
          <FavoriteButton catId={cat._id} catName={cat.name} />
        </div>
      </div>

      {/* Body Area */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3 bg-surface-container">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <Link to={`/cats/${cat._id}`}>
              <h3 className="font-headline-sm text-lg font-bold text-on-surface group-hover:text-primary transition-colors">
                {cat.name}
              </h3>
            </Link>
            <span className="text-secondary text-xs font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Ready
            </span>
          </div>
          <p className="text-xs text-outline font-medium">
            {cat.breed} • {cat.size ? `${cat.size.toUpperCase()} size` : "Cat"}
          </p>
        </div>

        {/* Trait Chips Row */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {cat.energyLevel && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-xs font-medium">
              <Zap className={`w-3 h-3 ${energyBadgeColor}`} />
              {cat.energyLevel.charAt(0).toUpperCase() + cat.energyLevel.slice(1)} energy
            </span>
          )}
          {cat.kidsFriendly && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container/30 text-secondary text-xs font-medium">
              <CheckCircle2 className="w-3 h-3" /> Kids OK
            </span>
          )}
          {cat.apartmentFriendly && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary-container/30 text-secondary text-xs font-medium">
              Apt OK
            </span>
          )}
          {cat.vocalization && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-variant text-outline text-xs">
              {cat.vocalization}
            </span>
          )}
          {cat.hypoallergenic && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-variant text-outline text-xs">
              Hypoallergenic
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
