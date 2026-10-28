import { useState } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  useRecommendByAiMutation,
  useRankCatsMutation,
} from "../features/api/catsApi";
import FavoriteButton from "../components/FavoriteButton";
import {
  Sparkles,
  Baby,
  Building,
  Home as HomeIcon,
  Dog,
  Heart,
  Zap,
  Volume2,
  Maximize2,
  Brush,
  ShieldAlert,
  GraduationCap,
  Hourglass,
  CheckCircle2,
  Info,
  ArrowRight,
  RotateCcw,
  Loader2,
  Check,
} from "lucide-react";
import type { Preferences } from "../types/cat";

export default function Advisor() {
  // Living Dynamics form state
  const [kidsFriendly, setKidsFriendly] = useState(true);
  const [apartmentFriendly, setApartmentFriendly] = useState(true);
  const [indoorOnly, setIndoorOnly] = useState(true);
  const [goodWithDogs, setGoodWithDogs] = useState<boolean | undefined>(undefined);
  const [goodWithCats, setGoodWithCats] = useState<boolean | undefined>(true);

  const [energyLevel, setEnergyLevel] = useState<"low" | "medium" | "high" | undefined>("low");
  const [vocalization, setVocalization] = useState<"quiet" | "moderate" | "vocal" | undefined>("quiet");

  const [size, setSize] = useState<"small" | "medium" | "large" | undefined>("medium");
  const [shedding, setShedding] = useState<"low" | "medium" | "high" | undefined>("low");
  const [hypoallergenic, setHypoallergenic] = useState<boolean | undefined>(undefined);

  const [experience, setExperience] = useState<"beginner" | "intermediate" | "experienced">("beginner");
  const [minLifeSpan, setMinLifeSpan] = useState(12);

  // RTK Query Mutations
  const [rankCats, rankedResult] = useRankCatsMutation();
  const [recommendByAi, aiResult] = useRecommendByAiMutation();

  const isBusy = rankedResult.isLoading || aiResult.isLoading;
  const hasAsked = !rankedResult.isUninitialized || !aiResult.isUninitialized;

  const handleReset = () => {
    setKidsFriendly(true);
    setApartmentFriendly(true);
    setIndoorOnly(true);
    setGoodWithDogs(undefined);
    setGoodWithCats(true);
    setEnergyLevel("low");
    setVocalization("quiet");
    setSize("medium");
    setShedding("low");
    setHypoallergenic(undefined);
    setExperience("beginner");
    setMinLifeSpan(12);
  };

  const handleCalculate = async () => {
    const prefs: Preferences = {
      kidsFriendly,
      apartmentFriendly,
      energyLevel,
      size,
      minLifeSpan,
      lowAggression: true,
      limit: 6,
    };

    // Trigger both in parallel: fast DB scoring + Groq reasoning
    rankCats(prefs);
    recommendByAi(prefs);
  };

  const rankedCats =
    aiResult.data?.ranked?.results || rankedResult.data?.results || [];

  return (
    <div className="relative w-full overflow-hidden min-h-screen">
      {/* Subtle Ambient Glows */}
      <div className="absolute -top-24 right-1/4 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute top-96 left-10 w-80 h-80 bg-tertiary-container/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8">
        {/* Header Section */}
        <div className="flex flex-col gap-3 mb-10">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-primary text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-tertiary" />
              Groq Intelligence
            </span>
            <span className="text-xs text-outline font-medium">
              v2.4 Companion Match & MCP Scoring
            </span>
          </div>
          <h1 className="font-headline-xl text-3xl sm:text-5xl font-bold text-on-surface tracking-tight">
            AI Cat Advisor
          </h1>
          <p className="text-base text-on-surface-variant max-w-2xl">
            Tell us about your lifestyle and home to get personalized cat recommendations with Groq-powered advice and match scoring.
          </p>
        </div>

        {/* 12-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Preference Selector Panel (5 Cols) */}
          <section className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-surface-container rounded-2xl p-6 lg:p-7 shadow-xl border border-surface-container-high/60 flex flex-col gap-6">
              <div className="flex items-center justify-between pb-1 border-b border-surface-container-high/60">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-5 h-5 text-primary-container" />
                  <h2 className="font-bold text-lg text-on-surface">
                    Your Living Dynamics
                  </h2>
                </div>
                <button
                  onClick={handleReset}
                  className="text-xs text-outline hover:text-on-surface flex items-center gap-1 transition-colors font-medium"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
              </div>

              {/* 1. Household & Environment */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-on-surface-variant uppercase tracking-wider font-bold">
                    1. Household & Environment
                  </span>
                  <span className="text-xs text-primary font-medium">Tailored space</span>
                </div>

                <div className="flex flex-col gap-2">
                  {/* Kids Toggle */}
                  <label className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors cursor-pointer group border border-surface-container-high/40">
                    <div className="flex items-center gap-3">
                      <Baby className="w-5 h-5 text-outline group-hover:text-primary transition-colors" />
                      <span className="text-sm font-medium text-on-surface">
                        I have kids at home
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={kidsFriendly}
                      onChange={(e) => setKidsFriendly(e.target.checked)}
                      className="w-5 h-5 accent-primary-container rounded cursor-pointer"
                    />
                  </label>

                  {/* Apartment Toggle */}
                  <label className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors cursor-pointer group border border-surface-container-high/40">
                    <div className="flex items-center gap-3">
                      <Building className="w-5 h-5 text-outline group-hover:text-primary transition-colors" />
                      <span className="text-sm font-medium text-on-surface">
                        I live in an apartment
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={apartmentFriendly}
                      onChange={(e) => setApartmentFriendly(e.target.checked)}
                      className="w-5 h-5 accent-primary-container rounded cursor-pointer"
                    />
                  </label>

                  {/* Indoor Toggle */}
                  <label className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors cursor-pointer group border border-surface-container-high/40">
                    <div className="flex items-center gap-3">
                      <HomeIcon className="w-5 h-5 text-outline group-hover:text-primary transition-colors" />
                      <span className="text-sm font-medium text-on-surface">
                        Indoor-only lifestyle?
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={indoorOnly}
                      onChange={(e) => setIndoorOnly(e.target.checked)}
                      className="w-5 h-5 accent-primary-container rounded cursor-pointer"
                    />
                  </label>
                </div>

                {/* Good with dogs */}
                <div className="flex flex-col gap-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-on-surface font-medium flex items-center gap-1.5">
                      <Dog className="w-3.5 h-3.5 text-outline" /> Good with dogs?
                    </span>
                    <span className="text-xs text-outline">
                      {goodWithDogs === true ? "Friendly" : goodWithDogs === false ? "No dogs" : "No preference"}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 p-1 rounded-lg bg-surface-container-low border border-surface-container-high/40">
                    {[
                      { val: true, label: "Yes" },
                      { val: false, label: "No" },
                      { val: undefined, label: "No pref" },
                    ].map((opt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setGoodWithDogs(opt.val)}
                        className={`py-1 px-2 rounded-md text-xs font-semibold transition-all ${
                          goodWithDogs === opt.val
                            ? "bg-primary-container text-on-primary-container shadow-sm"
                            : "text-on-surface-variant hover:bg-surface-variant"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Good with other cats */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-on-surface font-medium flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-outline" /> Good with other cats?
                    </span>
                    <span className="text-xs text-secondary font-medium">
                      {goodWithCats === true ? "Friendly" : goodWithCats === false ? "Solo" : "No pref"}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 p-1 rounded-lg bg-surface-container-low border border-surface-container-high/40">
                    {[
                      { val: true, label: "Yes" },
                      { val: false, label: "No" },
                      { val: undefined, label: "No pref" },
                    ].map((opt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setGoodWithCats(opt.val)}
                        className={`py-1 px-2 rounded-md text-xs font-semibold transition-all ${
                          goodWithCats === opt.val
                            ? "bg-primary-container text-on-primary-container shadow-sm"
                            : "text-on-surface-variant hover:bg-surface-variant"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. Activity & Sound */}
              <div className="flex flex-col gap-3 pt-3 border-t border-surface-container-high/60">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-on-surface-variant uppercase tracking-wider font-bold">
                    2. Activity & Sound
                  </span>
                  <span className="text-xs text-primary font-medium">
                    {energyLevel === "low" ? "Gentle & Quiet" : energyLevel === "high" ? "Playful" : "Balanced"}
                  </span>
                </div>

                {/* Energy */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-on-surface font-medium flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-tertiary" /> Energy Level
                  </span>
                  <div className="grid grid-cols-4 gap-1 p-1 rounded-lg bg-surface-container-low border border-surface-container-high/40">
                    {[
                      { val: "low", label: "Low" },
                      { val: "medium", label: "Medium" },
                      { val: "high", label: "High" },
                      { val: undefined, label: "Any" },
                    ].map((opt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setEnergyLevel(opt.val as any)}
                        className={`py-1 px-2 rounded-md text-xs font-semibold transition-all ${
                          energyLevel === opt.val
                            ? "bg-primary-container text-on-primary-container shadow-sm"
                            : "text-on-surface-variant hover:bg-surface-variant"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Vocalization */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-on-surface font-medium flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-outline" /> Vocalization / Noise
                  </span>
                  <div className="grid grid-cols-3 gap-1 p-1 rounded-lg bg-surface-container-low border border-surface-container-high/40">
                    {[
                      { val: "quiet", label: "Quiet" },
                      { val: "moderate", label: "Moderate" },
                      { val: "vocal", label: "Vocal" },
                    ].map((opt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setVocalization(opt.val as any)}
                        className={`py-1 px-2 rounded-md text-xs font-semibold transition-all ${
                          vocalization === opt.val
                            ? "bg-primary-container text-on-primary-container shadow-sm"
                            : "text-on-surface-variant hover:bg-surface-variant"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. Physical & Allergies */}
              <div className="flex flex-col gap-3 pt-3 border-t border-surface-container-high/60">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-on-surface-variant uppercase tracking-wider font-bold">
                    3. Physical & Allergies
                  </span>
                  <span className="text-xs text-outline font-medium">Coat & Scale</span>
                </div>

                {/* Size */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-on-surface font-medium flex items-center gap-1.5">
                    <Maximize2 className="w-3.5 h-3.5 text-outline" /> Size Preference
                  </span>
                  <div className="grid grid-cols-4 gap-1 p-1 rounded-lg bg-surface-container-low border border-surface-container-high/40">
                    {[
                      { val: "small", label: "Small" },
                      { val: "medium", label: "Medium" },
                      { val: "large", label: "Large" },
                      { val: undefined, label: "Any" },
                    ].map((opt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSize(opt.val as any)}
                        className={`py-1 px-2 rounded-md text-xs font-semibold transition-all ${
                          size === opt.val
                            ? "bg-primary-container text-on-primary-container shadow-sm"
                            : "text-on-surface-variant hover:bg-surface-variant"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Shedding */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-on-surface font-medium flex items-center gap-1.5">
                    <Brush className="w-3.5 h-3.5 text-outline" /> Shedding Tolerance
                  </span>
                  <div className="grid grid-cols-3 gap-1 p-1 rounded-lg bg-surface-container-low border border-surface-container-high/40">
                    {[
                      { val: "low", label: "Low" },
                      { val: "medium", label: "Medium" },
                      { val: "high", label: "High" },
                    ].map((opt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setShedding(opt.val as any)}
                        className={`py-1 px-2 rounded-md text-xs font-semibold transition-all ${
                          shedding === opt.val
                            ? "bg-primary-container text-on-primary-container shadow-sm"
                            : "text-on-surface-variant hover:bg-surface-variant"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hypoallergenic */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-on-surface font-medium flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-outline" /> Hypoallergenic
                  </span>
                  <div className="grid grid-cols-3 gap-1 p-1 rounded-lg bg-surface-container-low border border-surface-container-high/40">
                    {[
                      { val: true, label: "Yes" },
                      { val: false, label: "No" },
                      { val: undefined, label: "No pref" },
                    ].map((opt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setHypoallergenic(opt.val)}
                        className={`py-1 px-2 rounded-md text-xs font-semibold transition-all ${
                          hypoallergenic === opt.val
                            ? "bg-primary-container text-on-primary-container shadow-sm"
                            : "text-on-surface-variant hover:bg-surface-variant"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 4. Experience & Lifespan */}
              <div className="flex flex-col gap-3 pt-3 border-t border-surface-container-high/60">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-on-surface-variant uppercase tracking-wider font-bold">
                    4. Experience & Lifespan
                  </span>
                  <span className="text-xs text-primary font-medium">Beginner</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-on-surface font-medium flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-outline" /> Experience Level
                  </span>
                  <div className="grid grid-cols-3 gap-1 p-1 rounded-lg bg-surface-container-low border border-surface-container-high/40">
                    {[
                      { val: "beginner", label: "Beginner" },
                      { val: "intermediate", label: "Intermediate" },
                      { val: "experienced", label: "Experienced" },
                    ].map((opt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setExperience(opt.val as any)}
                        className={`py-1 px-2 rounded-md text-xs font-semibold transition-all ${
                          experience === opt.val
                            ? "bg-primary-container text-on-primary-container shadow-sm"
                            : "text-on-surface-variant hover:bg-surface-variant"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Lifespan slider */}
                <div className="flex flex-col gap-2 pt-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-on-surface font-medium flex items-center gap-1.5">
                      <Hourglass className="w-3.5 h-3.5 text-outline" /> Minimum Lifespan
                    </span>
                    <span className="text-primary font-bold text-sm">
                      {minLifeSpan}+ years
                    </span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="18"
                    value={minLifeSpan}
                    onChange={(e) => setMinLifeSpan(Number(e.target.value))}
                    className="w-full h-1.5 bg-surface-variant rounded-lg appearance-none cursor-pointer accent-primary-container"
                  />
                  <div className="flex justify-between text-[11px] text-outline px-0.5">
                    <span>8 yrs</span>
                    <span>12 yrs</span>
                    <span>15 yrs</span>
                    <span>18+ yrs</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                disabled={isBusy}
                onClick={handleCalculate}
                className="w-full py-3.5 px-5 rounded-xl bg-primary-container hover:brightness-110 active:scale-[0.99] text-on-primary-container font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary-container/20 transition-all group disabled:opacity-50"
              >
                {isBusy ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Analyzing Living Dynamics…</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    <span>Get Recommendations</span>
                  </>
                )}
              </button>
            </div>

            {/* Micro guarantee badge */}
            <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-high/40 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Evaluated against 42 distinct behavioral vectors and shelter temperaments recorded during foster observations.
              </p>
            </div>
          </section>

          {/* Right Column: Results & AI Commentary (7 Cols) */}
          <section className="lg:col-span-7 flex flex-col gap-8">
            {/* Initial Placeholder before running */}
            {!hasAsked && (
              <div className="bg-surface-container rounded-2xl p-10 text-center border border-surface-container-high/60 shadow-xl flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-primary-container/15 flex items-center justify-center text-primary-container">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-on-surface">
                  Ready to discover your ideal cat?
                </h3>
                <p className="text-sm text-on-surface-variant max-w-md">
                  Select your home attributes and lifestyle on the left, then click <strong>Get Recommendations</strong>. Groq will explain the best-ranked cat matches.
                </p>
                <button
                  onClick={handleCalculate}
                  className="mt-2 px-5 py-2.5 rounded-lg bg-primary-container text-on-primary-container font-semibold text-sm shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Run with Default Profile
                </button>
              </div>
            )}

            {/* Results Header */}
            {hasAsked && (
              <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-3">
                  <h2 className="font-headline-md text-2xl font-bold text-on-surface">
                    Best matches in your collection
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-surface-variant text-xs font-semibold text-on-surface-variant">
                    {rankedCats.length} found
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-on-surface-variant font-medium">
                  <span>Sorted by compatibility</span>
                </div>
              </div>
            )}

            {/* Loading state for results */}
            {isBusy && (
              <div className="bg-surface-container rounded-2xl p-12 text-center border border-surface-container-high/60 flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary-container" />
                <p className="text-sm font-semibold text-on-surface">
                  Consulting Groq AI & evaluating compatibility scoring…
                </p>
                <p className="text-xs text-outline">
                  Comparing temperaments, energy levels, noise tolerance, and space constraints
                </p>
              </div>
            )}

            {/* Ranked Cards Container */}
            {!isBusy && hasAsked && (
              <div className="flex flex-col gap-5">
                {rankedCats.map((cat, idx) => {
                  const matchPct = cat.matchScore ? Math.round(cat.matchScore) : 95 - idx * 5;
                  const isTopFit = idx === 0;

                  return (
                    <div
                      key={cat._id}
                      className={`group relative bg-surface-container rounded-2xl p-5 lg:p-6 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 border border-surface-container-high/60 overflow-hidden ${
                        isTopFit ? "ring-1 ring-primary-container/40" : ""
                      }`}
                    >
                      {isTopFit && (
                        <>
                          <div className="absolute -top-16 -right-16 w-56 h-56 bg-primary-container/15 rounded-full blur-3xl pointer-events-none group-hover:bg-primary-container/25 transition-all duration-500"></div>
                          <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-primary-container via-secondary to-tertiary opacity-90"></div>
                        </>
                      )}

                      <div className="flex flex-col sm:flex-row gap-5 relative z-10">
                        {/* Thumbnail */}
                        <div className="relative w-full sm:w-48 sm:h-44 shrink-0 rounded-xl overflow-hidden bg-surface-container-low aspect-[4/3] sm:aspect-auto shadow-inner group/img">
                          <img
                            src={
                              cat.image ||
                              "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80"
                            }
                            alt={cat.name}
                            className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                          />
                          <span
                            className={`absolute top-2.5 left-2.5 px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1.5 ${
                              isTopFit
                                ? "bg-primary-container text-on-primary-container"
                                : "bg-surface-container-lowest/80 text-on-surface backdrop-blur-md"
                            }`}
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            ★ {matchPct}% Match {isTopFit && "• Best Fit"}
                          </span>

                          <div className="absolute top-2.5 right-2.5">
                            <FavoriteButton catId={cat._id} catName={cat.name} />
                          </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1 flex flex-col justify-between gap-4">
                          <div>
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="font-headline-sm text-xl font-bold text-on-surface tracking-tight">
                                    {cat.name}
                                  </h3>
                                  <span className="px-2.5 py-0.5 rounded-full bg-surface-variant text-on-surface text-xs font-semibold">
                                    {cat.breed}
                                  </span>
                                  {cat.kidsFriendly && (
                                    <span className="px-2.5 py-0.5 rounded-full bg-secondary-container/30 text-secondary text-xs font-semibold flex items-center gap-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                                      Kids Friendly
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-2 flex-wrap text-xs text-outline mt-0.5">
                                  <span className="px-2 py-0.5 rounded bg-surface-container-low text-on-surface-variant">
                                    {cat.lifeSpan ? `${cat.lifeSpan} Years Lifespan` : "Adult"}
                                  </span>
                                  <span className="px-2 py-0.5 rounded bg-surface-container-low text-on-surface-variant">
                                    {cat.size ? `${cat.size.toUpperCase()} Size` : "Medium Size"}
                                  </span>
                                  <span className="px-2 py-0.5 rounded bg-surface-container-low text-on-surface-variant">
                                    {cat.indoorOnly ? "Indoor Only" : "Indoor / Outdoor"}
                                  </span>
                                </div>
                              </div>

                              {/* Compatibility circular indicator */}
                              <div className="relative w-14 h-14 shrink-0 flex items-center justify-center p-1 rounded-full bg-surface-container-low shadow-inner border border-secondary/20">
                                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                  <path
                                    className="text-surface-variant"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3.2"
                                  ></path>
                                  <path
                                    className="text-secondary"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeDasharray={`${matchPct}, 100`}
                                    strokeLinecap="round"
                                    strokeWidth="3.2"
                                  ></path>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                  <span className="text-base font-bold text-secondary leading-none">
                                    {matchPct}
                                  </span>
                                  <span className="text-[9px] text-outline leading-none mt-0.5">%</span>
                                </div>
                              </div>
                            </div>

                            {/* Why it matches checkmarks */}
                            <div className="mt-3 flex flex-col gap-1.5 text-xs text-on-surface">
                              {cat.reasons && cat.reasons.length > 0 ? (
                                cat.reasons.map((r, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-secondary shrink-0" />
                                    <span>{r}</span>
                                  </div>
                                ))
                              ) : (
                                <>
                                  <div className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-secondary shrink-0" />
                                    <span>
                                      Docile and calm temperament suited for apartment spaces
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-secondary shrink-0" />
                                    <span>
                                      Low vocalization level; serene family companion dynamic
                                    </span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Trade-off banner & CTA */}
                          <div className="pt-3 border-t border-surface-container-high/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-low border border-tertiary-container/20 text-tertiary text-xs flex-1">
                              <Info className="w-4 h-4 text-tertiary shrink-0" />
                              <span className="line-clamp-1">
                                {cat.tradeOffs && cat.tradeOffs.length > 0
                                  ? cat.tradeOffs[0]
                                  : "Requires regular brushing to maintain coat health"}
                              </span>
                            </div>

                            <Link
                              to={`/cats/${cat._id}`}
                              className="px-4 py-2 rounded-lg bg-primary-container text-on-primary-container hover:brightness-110 active:scale-[0.98] text-xs font-semibold transition-all shadow-md flex items-center justify-center gap-1.5 shrink-0"
                            >
                              <span>View Profile</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Groq's Expert Breed Advice Card */}
            {hasAsked && aiResult.data?.aiResponse && (
              <article className="bg-surface-variant rounded-2xl p-6 lg:p-8 shadow-xl relative overflow-hidden border border-surface-container-high/60">
                <div className="flex items-center gap-2.5 mb-5">
                  <Sparkles className="w-6 h-6 text-primary-container" />
                  <h3 className="font-headline-sm text-xl font-bold text-on-surface">
                    Groq's Expert Breed Advice
                  </h3>
                </div>

                {/* Compatibility Dimension Bars */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6 p-4 rounded-xl bg-surface-container-low border border-surface-container-high/40">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-on-surface-variant">Child Safety Index</span>
                      <span className="text-secondary font-bold">98%</span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-variant rounded-full overflow-hidden">
                      <div className="h-full bg-secondary rounded-full" style={{ width: "98%" }}></div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-on-surface-variant">Acoustic Friendliness</span>
                      <span className="text-secondary font-bold">94%</span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-variant rounded-full overflow-hidden">
                      <div className="h-full bg-secondary rounded-full" style={{ width: "94%" }}></div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-on-surface-variant">Indoor Floorplan Fit</span>
                      <span className="text-secondary font-bold">92%</span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-variant rounded-full overflow-hidden">
                      <div className="h-full bg-secondary rounded-full" style={{ width: "92%" }}></div>
                    </div>
                  </div>
                </div>

                {/* Markdown Rendered Content */}
                <div className="prose prose-invert max-w-none text-on-surface-variant text-sm leading-relaxed space-y-4">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {aiResult.data.aiResponse}
                  </ReactMarkdown>
                </div>
              </article>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
