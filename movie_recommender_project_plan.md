# Movie Recommender — Project Plan

## Problem
Decision fatigue when picking a movie in low-willpower moments (tired, hungry, late night). The failure mode is *slow* decisions, not bad recommendations.

## Solution
Swipe-based movie picker: silent taste profile (from rated movies) + 2-4 blunt filter questions to narrow candidates + swipe deck (poster/title/rating only) for fast gut-reaction picks.

## Success Metric
Time-to-decision (target: TBD once we have baseline data from friend testing).

## Stack
- **Data**: TMDB API (metadata, posters, ratings)
- **Backend**: Supabase (Postgres + pgvector for embedding similarity)
- **Frontend**: Expo React Native
- **Auth**: Supabase Auth, invite-only for v1

---

## Work Breakdown Structure (WBS)

Each phase is broken into tasks. IDs used later for Gantt dependencies. "Effort" is a rough size (S/M/L) — we'll convert to days once you tell me your available hours/week.

### Phase 1 — Schema & Data Model
| ID | Task | Effort | Depends on |
|---|---|---|---|
| 1.1 | Define full entity list (users, ratings, movies_cache, taste_vectors, invites, sessions?) | S | — |
| 1.2 | Decide embedding approach (plot-summary vector vs structured feature vector vs hybrid) | M | — |
| 1.3 | Design pgvector schema (per-user taste vector vs per-movie + similarity search) | M | 1.2 |
| 1.4 | Draft ER diagram (all tables, relationships, keys) | M | 1.1, 1.3 |
| 1.5 | TMDB field mapping — decide exactly which fields get cached (genre, cast, director, runtime, plot, poster, vote_average, etc.) | S | 1.2 |
| 1.6 | TMDB caching/refresh strategy (on-demand fetch + cache vs scheduled sync, rate-limit handling) | S | 1.5 |
| 1.7 | Write actual Supabase migrations (tables, RLS policies) | M | 1.4 |
| 1.8 | Review checkpoint: can we answer "how do we onboard a user" and "how do we compute a rec" on paper | S | 1.7 |

### Phase 2 — Taste Profile Engine
| ID | Task | Effort | Depends on |
|---|---|---|---|
| 2.1 | Build TMDB ingestion script (fetch + store movies into cache) | M | 1.7 |
| 2.2 | Generate embeddings for cached movies (batch job) | M | 2.1, 1.2 |
| 2.3 | Build user taste-vector computation (aggregate rated movies, weighted by rating) | M | 2.2 |
| 2.4 | Build cold-start onboarding set (curate ~15-20 popular/diverse movies for first-rating flow) | S | 2.1 |
| 2.5 | Build similarity search query (pgvector nearest-neighbor against taste vector) | M | 2.3 |
| 2.6 | Manual sanity test: feed test ratings, check if recs look reasonable | S | 2.5 |

### Phase 3 — Filter Question Logic
| ID | Task | Effort | Depends on |
|---|---|---|---|
| 3.1 | Finalize the 2-4 filter dimensions (runtime + energy/mood + ? ) | S | — (can run parallel to Phase 2) |
| 3.2 | Define filter → query logic (how each answer maps to a WHERE clause / vector re-rank) | M | 3.1, 1.7 |
| 3.3 | Test candidate-pool size after filters across a few taste profiles (target ~15-40 movies) | S | 3.2, 2.6 |
| 3.4 | Tune filter thresholds if pool too big/small | S | 3.3 |

### Phase 4 — Swipe UI (Expo)
| ID | Task | Effort | Depends on |
|---|---|---|---|
| 4.1 | App scaffold (Expo project, navigation, design tokens/theme) | S | — (can start early, parallel to Phase 1-3) |
| 4.2 | Onboarding screens (rate ~15-20 movies) | M | 2.4, 4.1 |
| 4.3 | Filter-question screens (2-4 taps) | S | 3.4, 4.1 |
| 4.4 | Swipe deck screen (poster/title/rating, swipe gesture + animation) | M | 4.1 |
| 4.5 | Wire swipe deck to filtered/ranked candidate results (API integration) | M | 4.4, 3.4, 2.6 |
| 4.6 | Post-swipe result state (watchlist save? done screen?) | S | 4.5 |
| 4.7 | End-to-end manual test: cold open → onboarding → filters → swipe → decision | M | 4.6 |

### Phase 5 — Auth & Deploy (Invite-only)
| ID | Task | Effort | Depends on |
|---|---|---|---|
| 5.1 | Supabase Auth setup (magic link or email/password) | S | 1.7 |
| 5.2 | Invite mechanism (code-based or manual allow-list) | S | 5.1 |
| 5.3 | Wire auth into app (login/signup screens) | M | 5.1, 4.1 |
| 5.4 | EAS build config + deploy (TestFlight/APK or Expo Go link) | M | 4.7, 5.3 |
| 5.5 | Smoke test: friend installs, signs up via invite, completes full flow unassisted | S | 5.4 |

### Phase 6 — Friend Testing & Fix
| ID | Task | Effort | Depends on |
|---|---|---|---|
| 6.1 | Onboard <20 friends via invite | S | 5.5 |
| 6.2 | Usage window (your call on length, e.g. 2 weeks) | — | 6.1 |
| 6.3 | Collect bug/issue log + basic usage stats (time-to-decision if you instrument it) | S | 6.2 |
| 6.4 | Fix bugs (maintenance only, no architecture changes) | M | 6.3 |
| 6.5 | Decide on v2 (public release) based on evidence | — | 6.4 |

---

## Explicitly Parked (not in scope for v1)
- Full public release / Twitter launch
- ~100 user scale planning
- Social features, friend taste-matching, etc.

## Open Decisions (need your input before Phase 1 starts)
1. Exact embedding approach: plot-summary embeddings, structured feature vectors, or hybrid?
2. Exact filter dimensions (you said runtime + energy as candidates — final 2-4?)
3. Timeline: what's the target date for Phase 5 (invite-only live)?
