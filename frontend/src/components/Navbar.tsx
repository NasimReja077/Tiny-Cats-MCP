import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  useAuth,
  UserButton,
} from "@clerk/clerk-react";
import { Sparkles, Heart, Plus, Menu, X, Bot, Compass } from "lucide-react";
import { useGetFavoritesQuery } from "../features/api/catsApi";
import { syncFavorites } from "../features/favorites/favoritesSlice";

export default function Navbar() {
  const dispatch = useAppDispatch();
  const favCount = useAppSelector((s) => s.favorites.ids.length);
  const { isSignedIn } = useAuth();
  const { data: favoriteCats } = useGetFavoritesQuery(undefined, {
    skip: !isSignedIn,
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (favoriteCats) {
      dispatch(syncFavorites(favoriteCats.map((cat) => cat._id)));
    }
  }, [dispatch, favoriteCats]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `font-medium text-sm transition-colors flex items-center gap-1.5 ${
      isActive
        ? "text-primary-container font-semibold"
        : "text-on-surface-variant hover:text-on-surface"
    }`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#221f1c]/90 backdrop-blur-md border-b border-[#38332e] shadow-[0_2px_12px_rgba(0,0,0,0.4)]">
      <div className="h-[64px] max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-90 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ef8148] to-[#9d430c] flex items-center justify-center text-white shadow-md shadow-[#ef8148]/20 group-hover:scale-105 transition-transform">
              <span className="text-xl">🐱</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-on-surface">
              Tiny Cats
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink to="/" end className={navLinkClass}>
              <Compass className="w-4 h-4" />
              Browse
            </NavLink>
            <NavLink to="/advisor" className={navLinkClass}>
              <Sparkles className="w-4 h-4 text-tertiary" />
              AI Advisor
            </NavLink>
            <NavLink to="/agent" className={navLinkClass}>
              <Bot className="w-4 h-4 text-primary" />
              Ask Agent
            </NavLink>
            <NavLink to="/favorites" className={navLinkClass}>
              <Heart className="w-4 h-4 text-[#e0245e]" />
              Favorites
              {favCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full bg-[#ef8148] text-white text-xs font-bold leading-none">
                  {favCount}
                </span>
              )}
            </NavLink>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/add"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary-container text-on-primary-container font-semibold text-sm shadow-sm hover:brightness-110 active:scale-[0.98] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Cat</span>
          </Link>

          {/* Clerk Auth Integration */}
          <div className="flex items-center">
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-8 h-8 ring-2 ring-[#38332e] hover:ring-primary-container transition-all",
                  },
                }}
              />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-3 py-1.5 rounded-lg border border-[#38332e] bg-[#2b2723] hover:bg-[#383431] text-xs font-semibold text-on-surface transition-all">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-[#2b2723] text-on-surface-variant hover:text-on-surface transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#221f1c] border-b border-[#38332e] px-6 py-4 flex flex-col gap-3 shadow-xl">
          <NavLink
            to="/"
            end
            onClick={() => setMobileMenuOpen(false)}
            className={navLinkClass}
          >
            <Compass className="w-4 h-4" />
            Browse
          </NavLink>
          <NavLink
            to="/advisor"
            onClick={() => setMobileMenuOpen(false)}
            className={navLinkClass}
          >
            <Sparkles className="w-4 h-4 text-tertiary" />
            AI Advisor
          </NavLink>
          <NavLink
            to="/agent"
            onClick={() => setMobileMenuOpen(false)}
            className={navLinkClass}
          >
            <Bot className="w-4 h-4 text-primary" />
            Ask Agent
          </NavLink>
          <NavLink
            to="/favorites"
            onClick={() => setMobileMenuOpen(false)}
            className={navLinkClass}
          >
            <Heart className="w-4 h-4 text-[#e0245e]" />
            Favorites
            {favCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-[#ef8148] text-white text-xs font-bold">
                {favCount}
              </span>
            )}
          </NavLink>
        </div>
      )}
    </header>
  );
}
