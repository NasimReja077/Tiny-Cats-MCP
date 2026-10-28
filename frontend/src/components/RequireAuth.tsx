import type { ReactNode } from "react";
import { SignInButton, useAuth } from "@clerk/clerk-react";
import { Loader2, LockKeyhole } from "lucide-react";

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center gap-4 px-6 text-center">
        <LockKeyhole className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold text-on-surface">Sign in to continue</h1>
        <p className="text-sm text-on-surface-variant">
          Your account is required to use this feature.
        </p>
        <SignInButton mode="modal">
          <button className="rounded-lg bg-primary-container px-5 py-2.5 text-sm font-semibold text-on-primary-container">
            Sign in
          </button>
        </SignInButton>
      </div>
    );
  }

  return children;
}
