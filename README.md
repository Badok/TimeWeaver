# 🕰️ TimeWeaver

**TimeWeaver** is a self-hosted, AI-enhanced scheduling assistant that helps teams coordinate availability, schedules, and priorities using natural language.
It bridges **web, Discord, and AI**, making planning fast, intuitive, and collaborative.

---

## 🚀 Project Overview

TimeWeaver parses plain-text availability messages like:

> “I’m free after 3 PM except Wednesday, and only mornings on weekends.”

and turns them into structured, shared team schedules.
It integrates with **Discord** and a **web dashboard**, allowing users to view, summarize, and manage availability data **all in one Next.js app**.

---

## 🧩 Architecture Summary

| Layer        | Role                                                   | Tech                                            |
| ------------ | ------------------------------------------------------ | ----------------------------------------------- |
| **Frontend** | Web dashboard for users & teams                        | Next.js + React + TailwindCSS                   |
| **Backend**  | REST API, database, AI, auth                           | Next.js API routes + Prisma + MariaDB           |
| **Bot**      | Discord integration for surveys, reminders & summaries | `discord.js` or `@discordjs/rest` in API routes |
| **AI**       | Natural-language → structured schedule parsing         | OpenRouter / OpenAI-compatible API endpoints    |
| **Auth**     | Cookie/session-based authentication                    | NextAuth.js or custom server-side cookies       |
| **Hosting**  | Docker Compose, Vercel, or bare-metal deployment       | Fullstack in a single Next.js project           |

---

## 🗂️ Folder Structure

```
timeweaver/
├── app/            # Next.js frontend pages & layouts
│   ├── api/        # Next.js API routes (REST endpoints, Discord hooks)
│   └── ...         # React UI pages
├── prisma/         # Prisma schema & migrations
├── public/         # Static assets (images, icons)
├── .env            # Secrets, API keys, DB connection
├── package.json
└── README.md
```

> No separate `backend/` folder needed — **Next.js handles API + frontend** in one place.

---

## ⚙️ Environment Variables

```env
# === Core App ===
ENVIRONMENT=development
SESSION_SECRET=replace_me

# === Database ===
DATABASE_URL=mysql://timeweaver:password@localhost:3306/timeweaver

# === AI (OpenRouter / OpenAI compatible) ===
OPENROUTER_API_KEY=sk-xxxx
OPENROUTER_API_BASE=https://openrouter.ai/api/v1
OPENROUTER_MODEL=openai/gpt-oss-20b:free

# === Discord ===
DISCORD_BOT_TOKEN=xxxx
```

---

## 🧱 Backend / API Architecture

### Data Flow

1. User submits free-text availability → stored in MariaDB via Prisma
2. AI parses text → structured JSON availability
3. Next.js API computes overlaps → suggested meeting windows
4. Frontend & Discord bot display summaries and manage responses

### Core Modules (API Routes)

* `app/api/auth` — register, login, logout, session checks
* `app/api/teams` — create teams, invite members, list surveys
* `app/api/surveys` — create surveys, submit availability, generate AI summaries
* `app/api/integrations/discord` — link/unlink users, send notifications
* `app/services` — Prisma client, AI calls, Discord helpers

---

## 🧠 Data Model Overview (Prisma Schema)

### User

| Field         | Type              | Description         |
| ------------- | ----------------- | ------------------- |
| id            | UUID              | Primary key         |
| email         | string            | Unique email        |
| username      | string            | Display name        |
| password_hash | string            | Hashed password     |
| discord_id    | string (optional) | Linked Discord user |
| is_premium    | boolean           | Premium flag        |
| created_at    | datetime          | Creation date       |

### Team

| Field      | Type     | Description            |
| ---------- | -------- | ---------------------- |
| id         | UUID     | Team ID                |
| name       | string   | Team name              |
| owner_id   | UUID     | User who owns the team |
| created_at | datetime | Creation date          |

*Many-to-many with Users via `TeamMembership`*

### TeamMembership

| Field   | Type                   | Description  |
| ------- | ---------------------- | ------------ |
| team_id | UUID                   | Team         |
| user_id | UUID                   | Member       |
| role    | enum("owner","member") | Role in team |

### Survey

| Field         | Type            | Description            |
| ------------- | --------------- | ---------------------- |
| id            | UUID            | Survey ID              |
| title         | string          | Title                  |
| description   | string          | Optional notes         |
| owner_user_id | UUID (nullable) | Solo survey owner      |
| team_id       | UUID (nullable) | Owning team            |
| expires_at    | datetime        | Expiration timestamp   |
| is_locked     | boolean         | Disables new responses |
| created_at    | datetime        | Creation time          |

### Availability

| Field      | Type     | Description         |
| ---------- | -------- | ------------------- |
| id         | UUID     | Entry ID            |
| survey_id  | UUID     | Linked survey       |
| user_id    | UUID     | Linked user         |
| data       | JSON     | Availability blocks |
| comment    | string   | Optional text       |
| created_at | datetime | Creation time       |
| updated_at | datetime | Last edit           |

### Invite

| Field      | Type     | Description        |
| ---------- | -------- | ------------------ |
| id         | UUID     | Invite ID          |
| survey_id  | UUID     | Linked survey      |
| token      | string   | Unique share token |
| created_at | datetime | Creation time      |

---

## ⚙️ REST API Overview (Next.js API Routes)

### Auth

| Method | Path                 | Description             |
| ------ | -------------------- | ----------------------- |
| POST   | `/api/auth/register` | Register user           |
| POST   | `/api/auth/login`    | Log in (cookie session) |
| GET    | `/api/auth/me`       | Get current profile     |
| POST   | `/api/auth/logout`   | End session             |

### Teams

| Method | Path                      | Description            |
| ------ | ------------------------- | ---------------------- |
| POST   | `/api/teams`              | Create team            |
| GET    | `/api/teams`              | List user’s teams      |
| GET    | `/api/teams/[id]`         | Team details & members |
| POST   | `/api/teams/[id]/invite`  | Invite user            |
| GET    | `/api/teams/[id]/surveys` | Surveys for team       |

### Surveys

| Method | Path                        | Description                 |
| ------ | --------------------------- | --------------------------- |
| POST   | `/api/surveys`              | Create survey               |
| GET    | `/api/surveys`              | List surveys (user & teams) |
| GET    | `/api/surveys/[id]`         | Get survey & responses      |
| DELETE | `/api/surveys/[id]`         | Delete (owner/admin)        |
| GET    | `/api/surveys/[id]/summary` | Generate AI summary         |

### Availability

| Method | Path                                       | Description                  |
| ------ | ------------------------------------------ | ---------------------------- |
| POST   | `/api/surveys/[id]/availability`           | Submit / update availability |
| GET    | `/api/surveys/[id]/availability/[user_id]` | Get user availability        |
| DELETE | `/api/surveys/[id]/availability/[user_id]` | Delete availability          |

### Integrations (Discord)

| Method | Path                               | Description             |
| ------ | ---------------------------------- | ----------------------- |
| POST   | `/api/integrations/discord/link`   | Link Discord ID         |
| POST   | `/api/integrations/discord/unlink` | Unlink Discord          |
| POST   | `/api/integrations/discord/notify` | Trigger notification DM |

---

## 🔒 Permissions Overview

| Role        | Create Surveys | Edit Others | Delete Surveys | View All  |
| ----------- | -------------- | ----------- | -------------- | --------- |
| User        | ✅ (personal)   | ❌           | ✅ (own)        | ✅ (own)   |
| Team Owner  | ✅              | ✅           | ✅              | ✅         |
| Team Member | ✅ (team)       | ❌           | ❌              | ✅ (team)  |
| Discord Bot | ❌              | ❌           | ❌              | Read-only |

---

## 💎 Free & Premium Features

| Feature                              | Free | Premium                  |
| ------------------------------------ | ---- | ------------------------ |
| Natural-language parsing & summaries | ✅    | ✅                        |
| Create surveys & submit availability | ✅    | ✅                        |
| View overlaps & summaries            | ✅    | ✅                        |
| Discord notifications                | ✅    | ✅                        |
| Survey duration (max 14 days)        | ✅    | ➕ Extended duration      |
| Survey storage (7 days post-expiry)  | ✅    | ➕ Long-term retention    |
| Participants (up to 6 users)         | ✅    | ➕ Unlimited participants |
| Teams / Organisations                | ❌    | ✅                        |

---

## ⚙️ Non-Functional Requirements

| Category        | Requirement                       |
| --------------- | --------------------------------- |
| Performance     | API < 500 ms (excluding AI calls) |
| Scalability     | Async-first modular design        |
| Security        | Hashed passwords + secure cookies |
| Portability     | Docker or Vercel-compatible       |
| Maintainability | Clear module separation           |
| Reliability     | Graceful AI & DB error handling   |

---

## 🧰 Tooling

| Task      | Tool                             |
| --------- | -------------------------------- |
| Fullstack | Next.js + React + TailwindCSS    |
| Database  | MariaDB + Prisma                 |
| AI        | OpenRouter / OpenAI API          |
| Discord   | `discord.js` / `@discordjs/rest` |
| Dev Env   | VS Code / WebStorm               |

---

## 🧠 Development Roadmap

* [ ] Scaffold single Next.js project
* [ ] Set up Prisma + MariaDB schema & migrations
* [ ] Implement cookie/session-based auth
* [ ] Integrate OpenRouter AI (`gpt-oss-20b`)
*
