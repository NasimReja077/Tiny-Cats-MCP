import { rankCatsService, type RankPreferences } from "./cat.service.ts";
import { generateAiResponse } from "./gemini.service.ts";

/**
 * AI Breed Advisor
 * 1. Rank cats from the database using score-based matching
 * 2. Send the ranked results + user preferences to Gemini
 * 3. Return both the ranked data and the AI-written recommendation
 */
export const aiRecommendService = async (prefs: RankPreferences) => {
  // ── 1. Rank cats from DB ──────────────────────────────────────────
  const ranked = await rankCatsService({
    ...prefs,
    limit: prefs.limit ?? 5,
  });

  const matchCatsFromDb = ranked.results;

  // ── 2. Human-readable preference summary ──────────────────────────
  const preferenceLines: string[] = [];
  if (prefs.kidsFriendly !== undefined) {
    preferenceLines.push(
      `- Kids in the home: ${prefs.kidsFriendly ? "Yes" : "No"}`
    );
  }
  if (prefs.apartmentFriendly !== undefined) {
    preferenceLines.push(
      `- Lives in an apartment: ${prefs.apartmentFriendly ? "Yes" : "No"}`
    );
  }
  if (prefs.energyLevel) {
    preferenceLines.push(`- Preferred energy level: ${prefs.energyLevel}`);
  }
  if (prefs.size) {
    preferenceLines.push(`- Preferred size: ${prefs.size}`);
  }
  if (prefs.minLifeSpan !== undefined) {
    preferenceLines.push(`- Minimum life span: ${prefs.minLifeSpan} years`);
  }
  if (prefs.lowAggression !== undefined) {
    preferenceLines.push(
      `- Prefers calm / low-aggression cats: ${prefs.lowAggression ? "Yes" : "No"}`
    );
  }

  const preferenceBlock =
    preferenceLines.length > 0
      ? preferenceLines.join("\n")
      : "- No specific preferences provided";

  // ── 3. Enhanced prompt ────────────────────────────────────────────
  const prompt = `
You are an expert Cat Breed Consultant and adoption advisor with deep knowledge of:
- Cat breeds, temperament, and behavior
- Family and children compatibility
- Apartment vs house living
- Energy levels, grooming, and care needs
- Health, life span, and common trade-offs

Your job is to help the user choose the best cat from OUR DATABASE only.
Do not invent or recommend breeds that are not in the list below.

═══════════════════════════════════════
USER PREFERENCES
═══════════════════════════════════════
${preferenceBlock}

═══════════════════════════════════════
CATS FROM OUR DATABASE (ranked by match score)
═══════════════════════════════════════
${JSON.stringify(matchCatsFromDb, null, 2)}

═══════════════════════════════════════
INSTRUCTIONS
═══════════════════════════════════════
1. Recommend ONLY from the cats listed above. Never invent a cat or breed.
2. If the list is empty, say clearly that no strong matches were found and suggest relaxing one or two filters.
3. Use the existing matchScore, reasons, and tradeOffs as your starting point — then expand on them in plain language.
4. Rank from best match to least suitable.
5. For each cat, cover:
   - Why it matches this user
   - Pros (strengths for this lifestyle)
   - Cons / trade-offs (be honest)
   - Key characteristics (energy, size, life span, kids, apartment, aggression)
6. End with a clear Final Recommendation for the #1 choice and a short "who this is best for" line.
7. Tone: warm, professional, easy to read. No fluff, no fictional facts.
8. Format with Markdown headings and bullet points as shown below.

═══════════════════════════════════════
RESPONSE FORMAT
═══════════════════════════════════════

# Best Cat Matches For You

A short 1–2 sentence intro that reflects the user's preferences.

## 1. {name} ({breed})
**Match Score:** {matchScore}/100

### Why This Cat Fits You
- ...

### Pros
- ...
- ...

### Cons / Trade-offs
- ...
- ...

### Key Characteristics
| Trait | Detail |
|-------|--------|
| Energy Level | ... |
| Size | ... |
| Life Span | ... |
| Kids Friendly | Yes / No |
| Apartment Friendly | Yes / No |
| Temperament | ... |

---

(Repeat the same structure for each remaining cat, in rank order.)

# Final Recommendation

**Top pick: {name} ({breed})**

Explain in 3–5 sentences why this is the strongest overall match.
Add one line: **Best for:** (e.g. "families with kids in an apartment who want a calm companion").

If the list was empty:

# No Strong Matches

Explain that nothing scored well enough, list which filters were strictest, and suggest 1–2 filters the user could relax.
`;

  // ── 4. Call Gemini ────────────────────────────────────────────────
  const aiResponse = await generateAiResponse(prompt);

  return {
    ranked,
    aiResponse,
  };
};
