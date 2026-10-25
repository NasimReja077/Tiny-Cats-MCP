# 🐱 Tiny Cats

A full-stack cat breed explorer with an **AI Advisor** (Google Gemini) and a custom **MCP (Model Context Protocol) server**. Browse cats, filter them, save favorites, add new cats, and get AI-written breed recommendations based on your home (kids / apartment).

> Built with React, Redux Toolkit, Express, MongoDB, TypeScript, Gemini and MCP.

---

## ✨ Features

### Available now
- 🔎 Browse all cats with search (name / breed) and filters (kids friendly, apartment friendly)
- 🐈 Cat detail page with full facts (energy, lifespan, size, color, tail, food habits, aggression)
- ➕ Add a new cat with a form
- ❤️ Favorites saved in the browser (localStorage) with a live counter in the navbar
- 🤖 **AI Advisor**: pick your preferences and get matching cats from the database plus a Gemini-written breed breakdown (rendered as Markdown)
- 🧩 **MCP server** exposing cat tools (`recommend_cats`, `get_all_cats`) that an AI client can call
- 🌗 Automatic dark / light theme

### Roadmap
- [ ] AI chat assistant using MCP tool calling (the model decides which tool to use)
- [x] Score-based recommendations (match percentage) with more preferences
- [ ] Compare 2-3 cats side by side
- [ ] Server-side search, filters and pagination
- [ ] User accounts (JWT), roles (user / admin), favorites saved per user
- [ ] Edit / delete cats and image upload (Cloudinary)
- [ ] Adoption requests and reviews / ratings
- [ ] Semantic search with embeddings
- [ ] More MCP tools, resources and prompts, Streamable HTTP + API key auth
- [ ] Tests, Docker Compose, CI/CD and deployment

---

## 🧱 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, React Router, Redux Toolkit + RTK Query, react-markdown, plain CSS (CSS variables) |
| **Backend** | Node.js, Express 5, TypeScript, Mongoose, dotenv, tsx |
| **Database** | MongoDB |
| **AI** | Google Gemini via `@google/genai` |
| **MCP** | `@modelcontextprotocol/sdk` (server + client over stdio), zod, axios |
| **Tooling** | ESLint, TypeScript strict mode |

---

## 🏗️ Architecture

```
┌────────────┐   /api    ┌──────────────┐        ┌──────────┐
│  React app │ ────────► │ Express API  │ ─────► │ MongoDB  │
│  (Vite)    │           │ (backend)    │        └──────────┘
└────────────┘           │              │
                         │  Gemini      │ ◄──► Google Gemini API
                         │  service     │
                         │              │ ◄──► MCP client ◄──stdio──► MCP server
                         └──────────────┘                              │
                                 ▲                                      │
                                 └────────── HTTP (/api/cats) ◄─────────┘
```

- The frontend talks only to the Express API (Vite proxies `/api` to port 5000).
- The Express API reads/writes MongoDB and calls Gemini.
- The MCP client in the backend starts the MCP server and calls its tools.
- The MCP server exposes cat tools and fetches data from the Express API.

---

## 📁 Project Structure

```
tiny-cats/
├── backend/
│   └── src/
│       ├── config/        # MongoDB connection
│       ├── controller/    # Request handlers
│       ├── models/        # Mongoose schemas
│       ├── routes/        # Express routes
│       ├── services/      # Business logic, Gemini, MCP client
│       ├── types/         # TypeScript types
│       ├── app.ts
│       └── server.ts
├── frontend/
│   └── src/
│       ├── app/           # Redux store and typed hooks
│       ├── components/    # CatCard, Navbar, FavoriteButton, QueryState
│       ├── features/      # RTK Query API + favorites slice
│       ├── pages/         # Home, CatDetail, AddCat, Advisor, Favorites
│       └── types/
└── mcp_server/
    └── src/
        ├── tools/         # Tool implementations
        └── index.ts       # MCP server entry
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- A MongoDB database (local or MongoDB Atlas)
- A Gemini API key from Google AI Studio

### 1. Clone and install

```bash
git clone <your-repo-url>
cd tiny-cats

cd backend && npm install
cd ../frontend && npm install
cd ../mcp_server && npm install
```

### 2. Environment variables

Create `backend/src/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tiny-cats
GEMINI_API_KEY=your_gemini_api_key
```

> Never commit your `.env` file. Add it to `.gitignore`.

### 3. Run the project

Open three terminals:

```bash
# Terminal 1: backend (http://localhost:5000)
cd backend
npm run dev

# Terminal 2: frontend (http://localhost:5173)
cd frontend
npm run dev

# Terminal 3 (optional): run the MCP server on its own
cd mcp_server
npm run dev
```

The backend starts the MCP server automatically when you call the test route, so you do not need Terminal 3 for that.

---

## 🔌 API Reference

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/cats` | Get all cats |
| GET | `/cats/:id` | Get one cat |
| POST | `/cats/create` | Create a cat |
| GET | `/cats/search/all?q=` | Search by name or breed |
| POST | `/cats/recommend` | Cats matching `{ kidsFriendly, apartmentFriendly }` exactly (old endpoint) |
| POST | `/cats/rank` | Score-based ranking: `{ kidsFriendly?, apartmentFriendly?, energyLevel?, size?, minLifeSpan?, lowAggression?, limit?, minScore? }` |
| POST | `/ai/ask` | Send a prompt to Gemini `{ prompt }` |
| POST | `/aiRecommend/recommendByAi` | AI breed recommendation `{ kidsFriendly, apartmentFriendly }` |
| GET | `/mcp/test-mcp` | Demo: call MCP tool and summarize with Gemini |

### Example: create a cat

```bash
curl -X POST http://localhost:5000/api/cats/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Misty",
    "breed": "Ragdoll",
    "description": "Calm and affectionate lap cat.",
    "energyLevel": "low",
    "lifeSpan": 14,
    "kidsFriendly": true,
    "apartmentFriendly": true
  }'
```

---

## 🧩 MCP Server

The MCP server (`mcp_server`) runs over stdio and exposes:

| Tool | Input | Description |
|---|---|---|
| `recommend_cats` | `kidsFriendly: boolean`, `apartmentFriendly: boolean` | Returns cats that match the preferences |
| `get_all_cats` | none | Returns all cats |

### Use it from an MCP client (example config)

```json
{
  "mcpServers": {
    "tiny-cats": {
      "command": "npx",
      "args": ["tsx", "/absolute/path/to/mcp_server/src/index.ts"]
    }
  }
}
```

The backend must be running on port 5000 because the tools fetch data from the API.

### How a tool call works

```
MCP client ──callTool("recommend_cats", {...})──► MCP server
                                                     │  validates input with zod
                                                     ▼
                                        axios POST /api/cats/recommend
                                                     │
                                                     ▼
                                          Express API ──► MongoDB
                                                     │
MCP client ◄── { content: [{ type: "text", text: JSON }] } ◄──┘
```

### Tool reference (implemented)

#### `recommend_cats`
Ranks the saved cats against the user's lifestyle and returns the best matches. Each cat gets a `matchScore` (0-100), the `reasons` it fits and its `tradeOffs`. Send only the preferences the user mentioned (at least one is required). Backed by `POST /api/cats/rank`.

| Input | Type | Required | Description |
|---|---|---|---|
| `kidsFriendly` | boolean | no | `true` if the home has children |
| `apartmentFriendly` | boolean | no | `true` if the user lives in an apartment |
| `energyLevel` | `low` / `medium` / `high` | no | Wanted activity level |
| `size` | `small` / `medium` / `large` | no | Wanted body size |
| `minLifeSpan` | number (1-40) | no | Minimum life span in years |
| `lowAggression` | boolean | no | Prefer calm cats |
| `limit` | number (1-20) | no | How many cats to return (default 5) |
| `minScore` | number (0-100) | no | Hide cats scoring below this (default 0) |

How scoring works (only the preferences you send are counted, so the score is always out of 100):

| Preference | Weight | Rule |
|---|---|---|
| `kidsFriendly` | 30 | `true`: cat must be kids friendly. `false`: any cat is fine |
| `apartmentFriendly` | 30 | `true`: cat must be apartment friendly. `false`: any cat is fine |
| `energyLevel` | 20 | exact match = full, one step away = half |
| `size` | 10 | exact match = full, one step away = half |
| `minLifeSpan` | 5 | scaled by how close the cat's life span is |
| `lowAggression` | 5 | full for low aggression, half for medium |

Ties are broken by longer life span. Errors come back with `isError: true` and a readable message (for example "Cannot reach the Cats API ... Is the backend running?").

Example call:

```json
{
  "name": "recommend_cats",
  "arguments": {
    "kidsFriendly": true,
    "apartmentFriendly": true,
    "energyLevel": "low",
    "limit": 3
  }
}
```

Example result (text content, JSON string):

```json
{
  "success": true,
  "message": "Cats ranked",
  "count": 1,
  "data": {
    "evaluated": 12,
    "criteria": { "kidsFriendly": true, "apartmentFriendly": true, "energyLevel": "low" },
    "results": [
      {
        "_id": "665f1c2e8a1b2c3d4e5f6a7b",
        "name": "Misty",
        "breed": "Ragdoll",
        "energyLevel": "low",
        "matchScore": 100,
        "reasons": [
          "Good with kids",
          "Suits apartment living",
          "Energy level is low, as you wanted"
        ],
        "tradeOffs": []
      }
    ]
  }
}
```

#### `get_all_cats`
Returns every cat in the database. Takes no input.

### Planned tools

| Tool | Input | What it will do |
|---|---|---|
| `search_cats` | `query: string`, `limit?: number` | Search by name or breed |
| `get_cat_by_id` | `id: string` | Return one cat with full details |
| `filter_cats` | `energyLevel?`, `size?`, `minLifeSpan?`, `kidsFriendly?`, `apartmentFriendly?` | Multi-field filtering |
| `compare_cats` | `ids: string[]` (2-3) | Side-by-side comparison table |
| `find_similar_cats` | `id: string`, `limit?: number` | Similar cats using embeddings |
| `create_cat` | cat fields | Add a new cat (admin / API key only) |
| `update_cat` | `id`, partial cat fields | Edit a cat (admin only) |
| `delete_cat` | `id` | Remove a cat (admin only) |
| `estimate_monthly_cost` | `id: string`, `city?: string` | Estimate food, litter, vet and grooming cost |
| `get_care_tips` | `breed: string` | Feeding, grooming and health tips (cached) |
| `get_adoption_status` | `requestId: string` | Check an adoption request |
| `get_cat_stats` | none | Counts by breed, energy level and size |

### Planned resources

Resources are read-only data the client can load as context.

| URI | Description |
|---|---|
| `cats://all` | All cats as JSON |
| `cats://breed/{name}` | Cats of one breed |
| `cats://{id}` | One cat |
| `cats://stats` | Summary statistics |

### Planned prompts

Prompts are reusable templates the user can pick in the client.

| Prompt | Arguments | Purpose |
|---|---|---|
| `adoption_advisor` | `homeType`, `hasKids`, `hoursAlone` | Guide a user to the best cat |
| `first_time_owner_guide` | `catId` | Checklist for a new owner |
| `compare_and_decide` | `ids` | Compare cats and give a final pick |

### Test with MCP Inspector

```bash
cd mcp_server
npx @modelcontextprotocol/inspector npx tsx src/index.ts
```

Open the URL it prints, click **Connect**, then open **Tools** to run `recommend_cats` or `get_all_cats` and see the raw response. Keep the backend running on port 5000 while testing.

### Call the MCP server from the backend

The backend uses the MCP SDK client (`backend/src/services/mcp.service.ts`):

```ts
const client = await getMcpClient();

const tools = await client.listTools();          // discover tools

const result = await client.callTool({           // call one tool
  name: "recommend_cats",
  arguments: { kidsFriendly: true, apartmentFriendly: true },
});
```

### Add a new tool (step by step)

1. Add the function in `mcp_server/src/tools/` (call the API or the database).
2. Register it in `mcp_server/src/index.ts`:

```ts
server.registerTool(
  "get_cat_by_id",
  {
    title: "get_cat_by_id",
    description: "Get one cat by its id",
    inputSchema: { id: z.string() },
  },
  async ({ id }) => {
    const result = await getCatByIdTool(id);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);
```

3. Restart the server and test it in MCP Inspector.
4. Add it to the tool table in this README.

> Tip: write a clear `description`. The AI model reads it to decide when to call the tool.

### Transport and security roadmap

| Item | Now | Planned |
|---|---|---|
| Transport | stdio (local process) | Streamable HTTP (hosted URL) |
| Auth | none | API key in an `Authorization` header, keys stored hashed |
| Permissions | all tools open | read tools public, write tools admin-only |
| Rate limiting | none | per API key |
| Logging | `console.error` | request log with tool name, duration, key id |
| Error handling | errors bubble up | return `isError: true` with a clear message |

Notes:
- With stdio, never write normal logs to stdout (it breaks the protocol). Use `console.error`, as the server already does.
- Validate every tool input with zod and cap list sizes (`limit` max 50).
- Never return secrets or internal ids you do not want exposed.

---

## 🗃️ Data Model

```ts
Cat {
  name: string          // required
  breed: string         // required
  description: string   // required
  energyLevel: string   // required (low | medium | high)
  lifeSpan: number      // default 1
  kidsFriendly: boolean // default true
  apartmentFriendly: boolean // default true
  image?: string
  color?: string
  size?: string
  violenceLevel?: string
  foodHabits?: string
  tailSize: string      // default "medium"
  createdAt, updatedAt
}
```

### Cat field reference

| Field | Type | Required | Default | Notes |
|---|---|---|---|---|
| `_id` | ObjectId | auto | auto | Generated by MongoDB |
| `name` | String | yes | none | Cat's name |
| `breed` | String | yes | none | Breed name |
| `description` | String | yes | none | Short description |
| `energyLevel` | String | yes | none | The form sends `low`, `medium` or `high` |
| `lifeSpan` | Number | no | `1` | Years (the form allows 1-40) |
| `kidsFriendly` | Boolean | no | `true` | Used by recommendations |
| `apartmentFriendly` | Boolean | no | `true` | Used by recommendations |
| `image` | String | no | none | Image URL |
| `color` | String | no | none | Coat color |
| `size` | String | no | none | For example small, medium, large |
| `violenceLevel` | String | no | none | Shown as "Aggression" in the UI |
| `foodHabits` | String | no | none | Diet notes |
| `tailSize` | String | no | `"medium"` | Tail length |
| `createdAt` | Date | auto | auto | Added by `timestamps: true` |
| `updatedAt` | Date | auto | auto | Added by `timestamps: true` |

### Example document

```json
{
  "_id": "665f1c2e8a1b2c3d4e5f6a7b",
  "name": "Misty",
  "breed": "Ragdoll",
  "description": "Calm and affectionate lap cat.",
  "energyLevel": "low",
  "lifeSpan": 14,
  "kidsFriendly": true,
  "apartmentFriendly": true,
  "image": "https://example.com/misty.jpg",
  "color": "Cream and grey",
  "size": "large",
  "violenceLevel": "low",
  "foodHabits": "Eats twice a day, likes wet food",
  "tailSize": "long",
  "createdAt": "2026-10-25T14:30:00.000Z",
  "updatedAt": "2026-10-25T14:30:00.000Z"
}
```

### Planned improvements to the Cat model

| Change | Why |
|---|---|
| Make `energyLevel` an enum (`low`, `medium`, `high`) | Prevents inconsistent values |
| Make `size` an enum (`small`, `medium`, `large`) | Reliable filtering and scoring |
| Rename `violenceLevel` to `aggressionLevel` | Matches the UI and is clearer |
| Add `grooming` (`low`, `medium`, `high`) | Better recommendations |
| Add `hypoallergenic` (Boolean) | Allergy-friendly filter |
| Add `aloneTolerance` (`low`, `medium`, `high`) | For people who work long hours |
| Add `images: string[]` | Gallery on the detail page |
| Add `avgRating` and `reviewCount` | Show ratings without extra queries |
| Add `embedding: number[]` | Semantic search and similar cats |
| Add `isAvailable` and `isDeleted` | Adoption status and soft delete |
| Add `createdBy` (ref User) | Track who added the cat |

Planned indexes:

```ts
catSchema.index({ name: "text", breed: "text", description: "text" }); // text search
catSchema.index({ kidsFriendly: 1, apartmentFriendly: 1 });            // recommend queries
catSchema.index({ breed: 1 });
catSchema.index({ energyLevel: 1, size: 1 });
```

### Planned collections

#### User

| Field | Type | Notes |
|---|---|---|
| `name` | String | required |
| `email` | String | required, unique, lowercase |
| `passwordHash` | String | bcrypt hash, never returned by the API |
| `role` | `"user"` or `"admin"` | default `"user"` |
| `favorites` | ObjectId[] (ref Cat) | replaces localStorage favorites |
| `createdAt`, `updatedAt` | Date | timestamps |

#### Review

| Field | Type | Notes |
|---|---|---|
| `cat` | ObjectId (ref Cat) | required |
| `user` | ObjectId (ref User) | required |
| `rating` | Number | 1-5 |
| `comment` | String | optional, max length |
| `createdAt` | Date | timestamp |

Unique index on `{ cat, user }` so each user reviews a cat once.

#### AdoptionRequest

| Field | Type | Notes |
|---|---|---|
| `cat` | ObjectId (ref Cat) | required |
| `user` | ObjectId (ref User) | required |
| `phone` | String | required |
| `message` | String | optional |
| `status` | `"pending"`, `"approved"`, `"rejected"` | default `"pending"` |
| `createdAt`, `updatedAt` | Date | timestamps |

#### ChatSession

| Field | Type | Notes |
|---|---|---|
| `user` | ObjectId (ref User) | optional for guests |
| `messages` | `{ role, content, toolCalls? }[]` | chat history |
| `createdAt`, `updatedAt` | Date | timestamps |

#### ApiKey

| Field | Type | Notes |
|---|---|---|
| `user` | ObjectId (ref User) | owner of the key |
| `name` | String | label, for example "My Cursor" |
| `keyHash` | String | store only a hash, show the real key once |
| `lastUsedAt` | Date | usage tracking |
| `revoked` | Boolean | default `false` |
| `createdAt` | Date | timestamp |

#### CareTip (cache)

| Field | Type | Notes |
|---|---|---|
| `breed` | String | unique |
| `content` | String | Markdown from Gemini |
| `createdAt` | Date | refresh when old |

### Relationships

```
User ──< Review >── Cat
User ──< AdoptionRequest >── Cat
User ──< ChatSession
User ──< ApiKey
User >──< Cat            (favorites)
Cat  ──  CareTip         (by breed)
```

`──<` means one to many, `>──<` means many to many.

### TypeScript types

Backend (`backend/src/types/cats.types.ts`) and frontend (`frontend/src/types/cat.ts`) define the Cat type. Keep them in sync:

```ts
export interface Cat {
  _id: string;
  name: string;
  breed: string;
  description: string;
  kidsFriendly: boolean;
  apartmentFriendly: boolean;
  lifeSpan: number;
  energyLevel: string;
  image?: string;
  color?: string;
  size?: string;
  violenceLevel?: string;
  foodHabits?: string;
  tailSize?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type CatInput = Omit<Cat, "_id" | "createdAt" | "updatedAt">;

export interface Preferences {
  kidsFriendly: boolean;
  apartmentFriendly: boolean;
}
```

---

## 🧪 Scripts

| Folder | Script | What it does |
|---|---|---|
| backend | `npm run dev` | Start the API with auto reload |
| frontend | `npm run dev` | Start Vite dev server |
| frontend | `npm run build` | Type-check and build for production |
| frontend | `npm run lint` | Run ESLint |
| mcp_server | `npm run dev` | Start the MCP server |

---

## 🛠️ Known Issues / Improvements

- The AI recommendation prompt should include the matched cats from the database.
- The MCP client should be created once and reused instead of on every request.
- Add input validation, error middleware, rate limiting and tests.

---

## 📸 Screenshots

Add screenshots here:

```
![Home](./screenshots/home.png)
![AI Advisor](./screenshots/advisor.png)
```

---

## 👤 Author

**Nasim**

- GitHub: [@NasimReja077](https://github.com/NasimReja077)

---

## 📄 License

This project is licensed under the ISC License.
