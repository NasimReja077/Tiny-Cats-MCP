import { Link } from "react-router-dom";
import { Sparkles, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#1e1b18] border-t border-[#38332e] py-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-outline">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#ef8148]/20 flex items-center justify-center text-primary">
            <span>🐱</span>
          </div>
          <div>
            <p className="font-semibold text-on-surface">Tiny Cats</p>
            <p className="text-xs text-outline">AI-Powered Feline Breed Explorer & MCP Network</p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs">
          <Link to="/" className="hover:text-primary transition-colors">Browse</Link>
          <Link to="/advisor" className="hover:text-primary transition-colors flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-tertiary" />
            Advisor
          </Link>
          <Link to="/agent" className="hover:text-primary transition-colors">Ask Agent</Link>
          <Link to="/favorites" className="hover:text-primary transition-colors flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-[#e0245e]" />
            Favorites
          </Link>
          <Link to="/add" className="hover:text-primary transition-colors">+ Add Cat</Link>
        </div>

        <p className="text-xs text-outline/80">
          Powered by Groq & Model Context Protocol (MCP)
        </p>
      </div>
    </footer>
  );
}
