import axios from "axios";

const API_BASE = process.env.CATS_API_URL || "http://localhost:5000/api";

export interface RankPreferences {
  kidsFriendly?: boolean;
  apartmentFriendly?: boolean;
  energyLevel?: "low" | "medium" | "high";
  size?: "small" | "medium" | "large";
  minLifeSpan?: number;
  lowAggression?: boolean;
  limit?: number;
  minScore?: number;
}

/** Score-based ranking via POST /api/cats/rank */
export const recommendCatsTool = async (prefs: RankPreferences) => {
  try {
    const res = await axios.post(`${API_BASE}/cats/rank`, prefs, {
      timeout: 15_000,
    });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Cannot reach the Cats API. Is the backend running on port 5000?";
      return {
        success: false,
        isError: true,
        message: msg,
      };
    }
    throw error;
  }
};

/** Exact match (legacy) via POST /api/cats/recommend */
export const recommendCatsExactTool = async (
  kidsFriendly: boolean,
  apartmentFriendly: boolean
) => {
  try {
    const res = await axios.post(
      `${API_BASE}/cats/recommend`,
      { kidsFriendly, apartmentFriendly },
      { timeout: 15_000 }
    );
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        isError: true,
        message:
          error.response?.data?.message ||
          "Cannot reach the Cats API. Is the backend running?",
      };
    }
    throw error;
  }
};

/** All cats via GET /api/cats */
export const getAllCatsTool = async () => {
  try {
    const res = await axios.get(`${API_BASE}/cats`, { timeout: 15_000 });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        isError: true,
        message:
          error.response?.data?.message ||
          "Cannot reach the Cats API. Is the backend running?",
      };
    }
    throw error;
  }
};

/** Search by name/breed via GET /api/cats/search/all?q= */
export const searchCatsTool = async (query: string, limit = 10) => {
  try {
    const res = await axios.get(`${API_BASE}/cats/search/all`, {
      params: { q: query },
      timeout: 15_000,
    });
    const data = res.data?.data ?? res.data;
    if (Array.isArray(data) && limit > 0) {
      return { ...res.data, data: data.slice(0, limit) };
    }
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        isError: true,
        message:
          error.response?.data?.message ||
          "Cannot reach the Cats API. Is the backend running?",
      };
    }
    throw error;
  }
};

/** One cat by id via GET /api/cats/:id */
export const getCatByIdTool = async (id: string) => {
  try {
    const res = await axios.get(`${API_BASE}/cats/${id}`, { timeout: 15_000 });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        isError: true,
        message:
          error.response?.status === 404
            ? "Cat not found"
            : error.response?.data?.message ||
              "Cannot reach the Cats API. Is the backend running?",
      };
    }
    throw error;
  }
};
