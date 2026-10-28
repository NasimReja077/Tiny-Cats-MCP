import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useAppDispatch } from "../../app/hooks";
import { syncFavorites } from "../favorites/favoritesSlice";
import { setTokenGetter } from "./authToken";

/**
 * AuthBridge renders nothing but wires the Clerk token getter
 * into the RTK Query baseQuery so every API call gets a Bearer token.
 * Render this once inside <ClerkProvider>.
 */
export default function AuthBridge() {
  const { getToken, isSignedIn } = useAuth();
  const dispatch = useAppDispatch();

  useEffect(() => {
    setTokenGetter(() => getToken());
    if (!isSignedIn) dispatch(syncFavorites([]));
  }, [dispatch, getToken, isSignedIn]);

  return null;
}
