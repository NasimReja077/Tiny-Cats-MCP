import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { readToken } from "../auth/authToken";
import type {
  ApiResponse,
  Cat,
  CatInput,
  Preferences,
  RankedResult,
  AiRecommendResponse,
  ProfileUpdateResponse,
  McpTool,
  McpCallResult,
  McpDemoResult,
} from "../../types/cat";

const baseQuery = fetchBaseQuery({
  baseUrl: "/api",
  prepareHeaders: async (headers) => {
    const token = await readToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

export const catsApi = createApi({
  reducerPath: "catsApi",
  baseQuery,
  tagTypes: ["Cat", "Profile", "Favorite"],
  endpoints: (build) => ({
    // ── Cats ─────────────────────────────────────────────────────────────
    getCats: build.query<Cat[], void>({
      query: () => "/cats",
      transformResponse: (res: ApiResponse<Cat[]>) => res.data,
      providesTags: [{ type: "Cat", id: "LIST" }],
    }),

    getFavorites: build.query<Cat[], void>({
      query: () => "/favorites",
      transformResponse: (res: ApiResponse<Cat[]>) => res.data,
      providesTags: ["Favorite"],
    }),

    setFavorite: build.mutation<
      { catId: string; favorite: boolean },
      { catId: string; favorite: boolean }
    >({
      query: ({ catId, favorite }) => ({
        url: `/favorites/${catId}`,
        method: "PATCH",
        body: { favorite },
      }),
      transformResponse: (res: ApiResponse<{ catId: string; favorite: boolean }>) =>
        res.data,
      invalidatesTags: ["Favorite"],
    }),

    clearFavorites: build.mutation<void, void>({
      query: () => ({ url: "/favorites", method: "DELETE" }),
      invalidatesTags: ["Favorite"],
    }),

    getCat: build.query<Cat | null, string>({
      query: (id) => `/cats/${id}`,
      transformResponse: (res: ApiResponse<Cat | null>) => res.data,
      providesTags: (_r, _e, id) => [{ type: "Cat", id }],
    }),

    createCat: build.mutation<Cat, { cat: CatInput; image?: File }>({
      query: ({ cat, image }) => {
        const body = new FormData();
        Object.entries(cat).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            body.append(key, String(value));
          }
        });
        if (image) body.append("image", image);
        return { url: "/cats/create", method: "POST", body };
      },
      transformResponse: (res: ApiResponse<Cat>) => res.data,
      invalidatesTags: [{ type: "Cat", id: "LIST" }],
    }),

    deleteCat: build.mutation<void, string>({
      query: (id) => ({ url: `/cats/${id}`, method: "DELETE" }),
      invalidatesTags: (_r, _e, id) => [
        { type: "Cat", id },
        { type: "Cat", id: "LIST" },
      ],
    }),

    updateCatImage: build.mutation<Cat, { id: string; file: File }>({
      query: ({ id, file }) => {
        const body = new FormData();
        body.append("image", file);
        return { url: `/cats/${id}/image`, method: "PATCH", body };
      },
      transformResponse: (res: ApiResponse<Cat>) => res.data,
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Cat", id },
        { type: "Cat", id: "LIST" },
      ],
    }),

    // ── Ranking / AI ─────────────────────────────────────────────────────
    rankCats: build.mutation<RankedResult, Preferences>({
      query: (body) => ({ url: "/cats/rank", method: "POST", body }),
      transformResponse: (res: ApiResponse<RankedResult>) => res.data,
    }),

    recommendByAi: build.mutation<AiRecommendResponse, Preferences>({
      query: (body) => ({
        url: "/aiRecommend/recommendByAi",
        method: "POST",
        body,
      }),
      transformResponse: (res: ApiResponse<AiRecommendResponse>) => res.data,
    }),

    askAi: build.mutation<string, { prompt: string }>({
      query: (body) => ({ url: "/ai/ask", method: "POST", body }),
      transformResponse: (res: ApiResponse<string>) => res.data,
    }),

    // ── Profile ───────────────────────────────────────────────────────────
    updateProfile: build.mutation<
      ProfileUpdateResponse,
      { name?: string; file?: File }
    >({
      query: ({ name, file }) => {
        const body = new FormData();
        if (name !== undefined) body.append("name", name);
        if (file) body.append("image", file);
        return { url: "/profile", method: "PATCH", body };
      },
      transformResponse: (res: ApiResponse<ProfileUpdateResponse>) => res.data,
      invalidatesTags: ["Profile"],
    }),

    // ── MCP ───────────────────────────────────────────────────────────────
    getMcpTools: build.query<McpTool[], void>({
      query: () => "/mcp/tools",
      transformResponse: (res: ApiResponse<McpTool[]>) => res.data,
    }),

    callMcpTool: build.mutation<
      McpCallResult,
      { name: string; arguments: Record<string, unknown> }
    >({
      query: (body) => ({ url: "/mcp/call", method: "POST", body }),
      transformResponse: (res: ApiResponse<McpCallResult>) => res.data,
    }),

    getMcpDemo: build.query<
      McpDemoResult,
      { kidsFriendly?: boolean; apartmentFriendly?: boolean }
    >({
      query: (params) => ({
        url: "/mcp/test-mcp",
        params,
      }),
      transformResponse: (res: ApiResponse<McpDemoResult>) => res.data,
    }),

    // ── Agent (needs backend mount) ────────────────────────────────────
    agentChat: build.mutation<
      import("../../types/cat").AgentChatResponse,
      {
        message: string;
        history?: Array<{ role: "user" | "assistant"; text: string }>;
      }
    >({
      query: (body) => ({ url: "/agent/chat", method: "POST", body }),
      transformResponse: (
        res: ApiResponse<import("../../types/cat").AgentChatResponse>
      ) => res.data,
    }),
  }),
});

export const {
  useGetCatsQuery,
  useGetCatQuery,
  useCreateCatMutation,
  useDeleteCatMutation,
  useUpdateCatImageMutation,
  useRankCatsMutation,
  useRecommendByAiMutation,
  useAskAiMutation,
  useUpdateProfileMutation,
  useGetFavoritesQuery,
  useSetFavoriteMutation,
  useClearFavoritesMutation,
  useGetMcpToolsQuery,
  useCallMcpToolMutation,
  useGetMcpDemoQuery,
  useAgentChatMutation,
} = catsApi;

// Backwards-compatible aliases
export const useGetAiAdviceMutation = catsApi.endpoints.recommendByAi.useMutation;
export const useGetMatchesMutation = catsApi.endpoints.rankCats.useMutation;
