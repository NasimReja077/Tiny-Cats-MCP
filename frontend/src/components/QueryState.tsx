import { Loader2, AlertCircle, HelpCircle } from "lucide-react";

interface Props {
  loading?: boolean;
  error?: unknown;
  empty?: boolean;
  emptyText?: string;
  className?: string;
}

export const errorMessage = (err: unknown): string => {
  if (err && typeof err === "object") {
    const e = err as { status?: unknown; data?: { message?: string }; error?: string };
    if (e.status === "FETCH_ERROR")
      return "Unable to connect to Tiny Cats backend. Please verify server is running on port 5000.";
    if (e.data?.message) return e.data.message;
    if (e.error) return e.error;
    if (e.status) return `Request failed (${String(e.status)})`;
  }
  return "An unexpected error occurred.";
};

export default function QueryState({
  loading,
  error,
  empty,
  emptyText,
  className = "",
}: Props) {
  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center p-12 text-center text-outline gap-3 ${className}`}>
        <Loader2 className="w-8 h-8 animate-spin text-primary-container" />
        <p className="text-sm font-medium">Fetching feline companions…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center p-10 text-center rounded-2xl bg-[#3d1f1c]/50 border border-error/30 text-error gap-3 ${className}`}>
        <AlertCircle className="w-8 h-8 text-error" />
        <p className="text-sm font-semibold max-w-md">{errorMessage(error)}</p>
      </div>
    );
  }

  if (empty) {
    return (
      <div className={`flex flex-col items-center justify-center p-14 text-center rounded-2xl bg-surface-container border border-surface-container-high text-outline gap-3 ${className}`}>
        <HelpCircle className="w-10 h-10 text-outline-variant" />
        <p className="text-base font-semibold text-on-surface">{emptyText ?? "No cats matched your criteria."}</p>
        <p className="text-xs text-outline max-w-sm">Try broadening your search or adjusting your filters to discover more companions.</p>
      </div>
    );
  }

  return null;
}
