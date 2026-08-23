# Movie Recommender — Agent Execution Plan

> Feed this to your coding agent as the build spec. Where a decision wasn't explicitly locked in planning, a default is stated — flag it back to Moaz before building if it seems wrong, don't just silently assume.

## Project Summary
Swipe-based movie recommender. Core loop: user rates movies once → silent taste profile is computed → 2-4 blunt filter taps narrow the pool → user swipes through a small deck (poster/title/rating only) to decide fast. Optimize for **speed to decision**, not recommendation accuracy. Target user is tired/low-bandwidth, not browsing casually.

## Stack (locked)
- **Data source**: TMDB API (v3)
- **Backend/DB**: Supabase — Postgres + pgvector extension
- **Frontend**: Expo (React Native)
- **Auth**: Supabase Auth, invite-only for v1
- **Deploy target v1**: Expo Go link or internal build (TestFlight/APK), NOT app store release

---

## Phase 1 — Schema & Data Model
**Do not let the agent skip straight to code here — get schema reviewed by Moaz before Phase 2 starts.**

### Tables (default proposal — confirm before migrating)
- `users` — Supabase Auth managed, extend with profile row if needed
- `invites` — code, used_by, created_at, expires_at
- `movies_cache` — tmdb_id (PK), title, poster_path, release_date, runtime, genres (array), cast (array, top 5), director, overview, vote_average, embedding (vector), last_synced_at
- `ratings` — user_id, tmdb_id, rating (1-5 or thumbs up/down — **confirm scale with Moaz**), rated_at
- `taste_vectors` — user_id (PK), vector, updated_at
- `filter_sessions` (optional, only if instrumenting for Phase 6 metrics) — user_id, answers (jsonb), pool_size_after, created_at, decided_movie_id, time_to_decision_seconds

### Embedding approach (default — confirm before building)
**Default: structured feature vector**, not plot-summary NLP embedding. Reason: simpler, faster to build, no extra model dependency, and genre/cast/director similarity is likely a stronger taste signal than plot-text similarity for a "fast decision" product. Combine:
- one-hot / weighted genre vector
- cast/director overlap (top-5 cast, director as categorical features)
- normalize runtime and vote_average as secondary features

If Moaz wants plot-based semantic embeddings instead (better for "similar vibe, different genre" matches, more resume-impressive), swap this for an embedding API call per movie during ingestion — flag this as an open swap-in, don't block on it.

### Tasks
1. Confirm table list above with Moaz (quick yes/no per table)
2. Confirm rating scale (thumbs up/down vs 1-5 stars) — this affects the taste-vector weighting logic
3. Write Supabase migrations for all tables + RLS policies (users only see their own ratings/taste_vector; movies_cache is public read)
4. Set up pgvector extension, index on `movies_cache.embedding` (ivfflat or hnsw)
5. Confirm TMDB fields to cache: title, poster_path, release_date, runtime, genres, credits (cast/crew), overview, vote_average — pull via `/movie/{id}` + `/movie/{id}/credits`
6. Build TMDB sync script: on-demand fetch + cache (don't bulk-download whole catalog — pull as movies are needed, cache indefinitely with periodic refresh, e.g. weekly, for rating/popularity drift)

**Checkpoint before Phase 2**: schema finalized, migrations run, can manually insert a test movie + test rating and query it back.

---

## Phase 2 — Taste Profile Engine
### Tasks
1. Curate cold-start onboarding set: ~15-20 popular, genre-diverse movies (mix of blockbuster + indie + different decades) for new-user rating flow
2. Build feature-vector generator for cached movies (genre + cast + director + runtime + vote_average → vector)
3. Build taste-vector computation: aggregate a user's rated movies' feature vectors, weighted by their rating (higher rating = more weight, low ratings should pull the vector away from that profile, not just contribute zero)
4. Build pgvector similarity query: given a user's taste_vector, return nearest movies_cache entries not yet rated by that user
5. Manual sanity test: create 2-3 fake test users with distinct tastes (e.g. "action fan," "indie drama fan"), rate ~15 movies each, confirm returned candidates make sense

**Checkpoint before Phase 3/4 integration**: given any test taste profile, similarity query returns a sane ranked list.

---

## Phase 3 — Filter Question Logic (can run parallel to Phase 2 build)
### Filter dimensions (default — confirm with Moaz, only 2 were explicitly discussed)
1. **Runtime**: short (<100 min) vs. doesn't matter
2. **Energy**: focus/engage vs. zone-out/background

If a 3rd is wanted, candidate: **Tone** — heavy/intense vs. light/easy. Don't add a 3rd or 4th without Moaz confirming — the whole design principle is minimum questions, maximum pool reduction.

### Tasks
1. Confirm final filter dimensions (2-4, binary/ternary only, no open text/mood selection)
2. Map each filter answer to a query condition against `movies_cache` (e.g. runtime filter → WHERE runtime < 100)
3. Combine filters with the taste-vector similarity query (filter first, then rank filtered pool by similarity — or rank then filter, test both, pick whichever gives better pool sizes)
4. Test resulting pool size across a few scenarios — target ~15-40 movies after filters. If pool is too small (<10), soften strictness. If too big (>50), the filters aren't cutting enough — consider a 3rd dimension.

**Checkpoint**: for test taste profiles + filter combos, pool size lands in swipeable range reliably.

---

## Phase 4 — Swipe UI (Expo)
### Tasks
1. Scaffold Expo app, set up navigation (onboarding → filters → swipe → result)
2. Onboarding screen: rate the cold-start set (swipe or tap-based rating UI, keep it fast)
3. Filter question screens: 2-4 single-tap screens, big obvious buttons, no scrolling/reading
4. Swipe deck screen: poster (large), title, rating badge only — no synopsis, no extra metadata. Swipe right = interested/save, swipe left = skip, maybe swipe up = "seen it, don't show again"
5. Wire swipe deck to the filtered + ranked candidate list from Phase 2/3 backend
6. Post-swipe result state: right-swipe should feel like a resolution — show the picked movie clearly, maybe a "watch now" link placeholder, don't dump them back into more choices
7. End-to-end manual test: cold open through decision, time yourself doing it

**Checkpoint**: full flow works standalone, feels fast (rough self-check, not formal metric yet).

---

## Phase 5 — Auth & Deploy (Invite-only)
### Tasks
1. Supabase Auth setup — magic link recommended (lowest friction for <20 friends, no password reset flow needed)
2. Invite mechanism: simple invite code table, checked at signup, mark used
3. Wire auth into app (login/signup screens gate the main flow)
4. EAS build config, deploy as Expo Go shareable link or internal build for iOS/Android
5. Smoke test: have one friend install and complete the full flow with zero help from Moaz — if they get stuck, that's a real bug, not a "let me explain" moment

**Checkpoint**: a friend can install, sign up, rate, filter, swipe, and land on a decision unassisted.

---

## Phase 6 — Friend Testing & Fix
### Tasks
1. Invite <20 friends
2. Let it run ~2 weeks with real usage
3. Log bugs/issues as they come in (don't fix live/reactively — batch review)
4. Fix bugs only — **no architecture changes**, no new features, no "while I'm in here let me also..."
5. After the window: review whether time-to-decision felt fast in practice (informal, ask friends directly) — this is the evidence Moaz uses to decide on a v2/public release, not something to decide now

---

## Guardrails for the agent (read before every phase)
- Do not add features not listed here. If something seems missing, flag it as a question, don't silently build it.
- Do not skip the Phase 1 schema checkpoint — rework here is expensive later, unlike UI polish.
- Filter dimensions stay at 2-4, binary/ternary only — resist the urge to add an open-text mood field, it defeats the product's purpose.
- Swipe deck screen shows poster/title/rating ONLY — no synopsis, no cast list, no extra reading.
- v1 scope stops at invite-only <20 friends. Public release, social features, and Twitter distribution are explicitly out of scope until Moaz decides otherwise post-Phase 6.
