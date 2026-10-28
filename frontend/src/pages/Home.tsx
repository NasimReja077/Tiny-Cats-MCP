import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useGetCatsQuery } from "../features/api/catsApi";
import CatCard from "../components/CatCard";
import QueryState from "../components/QueryState";
import {
  Search,
  X,
  Sparkles,
  Zap,
  RotateCcw,
  CheckCircle2,
  Heart,
  Home as HomeIcon,
  Dog,
  ChevronRight,
} from "lucide-react";

export default function Home() {
  const { data: cats, isLoading, error } = useGetCatsQuery();

  // Filter states
  const [search, setSearch] = useState("");
  const [kidsFilter, setKidsFilter] = useState("any");
  const [aptFilter, setAptFilter] = useState("any");
  const [sortOption, setSortOption] = useState("newest");
  const [energyFilter, setEnergyFilter] = useState("all");
  const [sheddingFilter, setSheddingFilter] = useState("any");
  const [groomingFilter, setGroomingFilter] = useState("any");
  const [vocalFilter, setVocalFilter] = useState("any");
  const [expFilter, setExpFilter] = useState("any");

  // Quick trait toggles
  const [quickHypo, setQuickHypo] = useState(false);
  const [quickDogs, setQuickDogs] = useState(false);
  const [quickCats, setQuickCats] = useState(false);
  const [quickIndoor, setQuickIndoor] = useState(false);

  // Filter logic
  const filteredCats = useMemo(() => {
    if (!cats) return [];

    let result = [...cats];

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.breed.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q) ||
          c.color?.toLowerCase().includes(q)
      );
    }

    // Kids filter
    if (kidsFilter === "yes") {
      result = result.filter((c) => c.kidsFriendly);
    } else if (kidsFilter === "no") {
      result = result.filter((c) => !c.kidsFriendly);
    }

    // Apartment filter
    if (aptFilter === "yes") {
      result = result.filter((c) => c.apartmentFriendly);
    } else if (aptFilter === "garden") {
      result = result.filter((c) => !c.apartmentFriendly || c.indoorOnly === false);
    }

    // Energy filter
    if (energyFilter !== "all") {
      result = result.filter((c) => c.energyLevel === energyFilter);
    }

    // Shedding filter
    if (sheddingFilter !== "any") {
      result = result.filter((c) => c.sheddingLevel === sheddingFilter);
    }

    // Grooming filter
    if (groomingFilter !== "any") {
      result = result.filter((c) => c.grooming === groomingFilter);
    }

    // Vocal filter
    if (vocalFilter !== "any") {
      result = result.filter((c) => c.vocalization === vocalFilter);
    }

    // Quick traits
    if (quickHypo) result = result.filter((c) => c.hypoallergenic);
    if (quickDogs) result = result.filter((c) => c.goodWithDogs);
    if (quickCats) result = result.filter((c) => c.goodWithOtherCats);
    if (quickIndoor) result = result.filter((c) => c.indoorOnly);

    // Sorting
    if (sortOption === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "lifespan") {
      result.sort((a, b) => (b.lifeSpan || 0) - (a.lifeSpan || 0));
    } else if (sortOption === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
    }

    return result;
  }, [
    cats,
    search,
    kidsFilter,
    aptFilter,
    sortOption,
    energyFilter,
    sheddingFilter,
    groomingFilter,
    vocalFilter,
    expFilter,
    quickHypo,
    quickDogs,
    quickCats,
    quickIndoor,
  ]);

  const resetFilters = () => {
    setSearch("");
    setKidsFilter("any");
    setAptFilter("any");
    setSortOption("newest");
    setEnergyFilter("all");
    setSheddingFilter("any");
    setGroomingFilter("any");
    setVocalFilter("any");
    setExpFilter("any");
    setQuickHypo(false);
    setQuickDogs(false);
    setQuickCats(false);
    setQuickIndoor(false);
  };

  const hasActiveFilters =
    search ||
    kidsFilter !== "any" ||
    aptFilter !== "any" ||
    energyFilter !== "all" ||
    sheddingFilter !== "any" ||
    groomingFilter !== "any" ||
    vocalFilter !== "any" ||
    quickHypo ||
    quickDogs ||
    quickCats ||
    quickIndoor;

  return (
    <div className="relative w-full overflow-hidden min-h-screen">
      {/* Background ambient glows matching Stitch */}
      <div className="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-primary-container/10 blur-[100px] pointer-events-none"></div>
      <div className="absolute top-48 right-0 w-80 h-80 rounded-full bg-tertiary-container/10 blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 flex flex-col gap-8">
        {/* Screen Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-primary text-xs font-semibold uppercase tracking-wider shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-ping"></span>
                Live Shelter Network
              </span>
              <span className="text-xs text-outline">Updated recently</span>
            </div>

            <div className="flex items-baseline gap-3.5 flex-wrap">
              <h1 className="font-headline-lg text-3xl sm:text-4xl font-bold text-on-surface tracking-tight">
                Browse cats
              </h1>
              {cats && (
                <span className="px-2.5 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant text-xs font-medium shadow-inner">
                  Showing <strong className="text-on-surface">{filteredCats.length}</strong> of {cats.length} cats
                </span>
              )}
            </div>

            <p className="text-sm text-on-surface-variant max-w-xl">
              Gentle companions looking for forever warmth. Filter by lifestyle compatibility or ask our AI advisor for instant tailored matches.
            </p>
          </div>

          {/* Quick AI Advisor Switch Card */}
          <Link
            to="/advisor"
            className="group flex items-center gap-3 p-3 pr-4 rounded-xl bg-surface-container hover:bg-surface-container-high transition-all shadow-md border border-surface-container-high/60 self-start md:self-auto"
          >
            <div className="w-10 h-10 rounded-lg bg-primary-container/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5 text-tertiary" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-semibold text-on-surface group-hover:text-primary transition-colors flex items-center gap-1">
                Not sure who fits?
              </span>
              <span className="text-xs text-outline flex items-center gap-1">
                Take AI Compatibility Quiz <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        </div>

        {/* Filter Bar */}
        <section className="w-full bg-surface-container rounded-2xl p-5 md:p-6 shadow-xl flex flex-col gap-4 border border-surface-container-high/60">
          {/* Row 1: Search + Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
            {/* Search */}
            <div className="lg:col-span-5 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline w-4 h-4 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, breed, or temperament..."
                className="w-full pl-10 pr-9 py-2 rounded-lg bg-surface-container-low text-on-surface placeholder:text-outline text-sm focus:outline-none focus:ring-2 focus:ring-primary-container transition-all border border-surface-container-high shadow-inner"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Kids */}
            <div className="lg:col-span-2">
              <select
                value={kidsFilter}
                onChange={(e) => setKidsFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary-container cursor-pointer border border-surface-container-high shadow-inner"
              >
                <option value="any">Kids: Any</option>
                <option value="yes">Kids: Friendly (Yes)</option>
                <option value="no">Kids: Adults Only</option>
              </select>
            </div>

            {/* Space / Apartment */}
            <div className="lg:col-span-2">
              <select
                value={aptFilter}
                onChange={(e) => setAptFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary-container cursor-pointer border border-surface-container-high shadow-inner"
              >
                <option value="any">Space: Any</option>
                <option value="yes">Apartment: Great</option>
                <option value="garden">Needs Yard / Garden</option>
              </select>
            </div>

            {/* Sort */}
            <div className="lg:col-span-3">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary-container cursor-pointer border border-surface-container-high shadow-inner"
              >
                <option value="newest">Sort: Recently Rescued</option>
                <option value="lifespan">Sort: Longest Lifespan</option>
                <option value="name">Sort: Name (A – Z)</option>
              </select>
            </div>
          </div>

          {/* Row 2: Energy chips + Reset */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-surface-variant/40">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-xs text-outline uppercase tracking-wider flex items-center gap-1 font-semibold">
                <Zap className="w-3.5 h-3.5 text-tertiary" /> Energy:
              </span>
              <div className="flex items-center gap-1.5">
                {[
                  { id: "all", label: "All" },
                  { id: "low", label: "Low Calm" },
                  { id: "medium", label: "Medium Playful" },
                  { id: "high", label: "High Energetic" },
                ].map((chip) => (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => setEnergyFilter(chip.id)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all active:scale-95 ${
                      energyFilter === chip.id
                        ? "bg-primary-container text-on-primary-container shadow-sm"
                        : "bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-outline hover:text-on-surface text-xs font-semibold transition-all active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Clear filters
              </button>
            )}
          </div>

          {/* Row 3: Quick trait toggle pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-surface-variant/40">
            <span className="text-xs text-outline uppercase tracking-wider mr-1 font-semibold">
              Quick Traits:
            </span>
            <button
              type="button"
              onClick={() => setQuickHypo(!quickHypo)}
              className={`px-2.5 py-1 rounded-full text-xs transition-all active:scale-95 inline-flex items-center gap-1.5 ${
                quickHypo
                  ? "bg-secondary-container/60 text-secondary border border-secondary/40 font-semibold"
                  : "bg-surface-container-low text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-secondary" />
              Hypoallergenic
            </button>

            <button
              type="button"
              onClick={() => setQuickDogs(!quickDogs)}
              className={`px-2.5 py-1 rounded-full text-xs transition-all active:scale-95 inline-flex items-center gap-1.5 ${
                quickDogs
                  ? "bg-tertiary-container/40 text-tertiary border border-tertiary/40 font-semibold"
                  : "bg-surface-container-low text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <Dog className="w-3.5 h-3.5 text-tertiary" />
              Good w/ Dogs
            </button>

            <button
              type="button"
              onClick={() => setQuickCats(!quickCats)}
              className={`px-2.5 py-1 rounded-full text-xs transition-all active:scale-95 inline-flex items-center gap-1.5 ${
                quickCats
                  ? "bg-primary-container/40 text-primary border border-primary/40 font-semibold"
                  : "bg-surface-container-low text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-primary" />
              Good w/ Cats
            </button>

            <button
              type="button"
              onClick={() => setQuickIndoor(!quickIndoor)}
              className={`px-2.5 py-1 rounded-full text-xs transition-all active:scale-95 inline-flex items-center gap-1.5 ${
                quickIndoor
                  ? "bg-surface-container-highest text-on-surface border border-outline font-semibold"
                  : "bg-surface-container-low text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <HomeIcon className="w-3.5 h-3.5 text-outline" />
              Indoor Only
            </button>
          </div>
        </section>

        {/* Status / Guarantee Banner */}
        <div className="flex items-center justify-between text-xs text-outline px-1">
          <div className="flex items-center gap-2">
            <span>Active view:</span>
            <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface font-semibold">
              {filteredCats.length} Available Companions
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-secondary"></span> 100% Medically Vetted
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-tertiary"></span> Adoption Guarantee
            </span>
          </div>
        </div>

        {/* Main Cat Cards Grid */}
        <QueryState
          loading={isLoading}
          error={error}
          empty={!isLoading && !error && filteredCats.length === 0}
          emptyText="No cats matched your search criteria."
        />

        {!isLoading && !error && filteredCats.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
            {filteredCats.map((cat) => (
              <CatCard key={cat._id} cat={cat} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
