# IRONMAN / IRONWOMAN - Workout Tracker
 
A mobile-first workout tracking app built with Vue 3. Design your own training program, log sets and weights during your session, and keep a full history of every workout.
 
Built as a personal project to practice modern Vue 3 patterns (Composition API, Pinia, Supabase) end-to-end from database schema to a polished, animated mobile UI.
 
<!-- 
  📸 Screenshots go here
  Suggested: Login screen, Onboarding (3 steps), Main workout board (dark + light theme), 
  Edit mode with supersets, Rest timer, Finish summary, Journal
-->
 
![Login screen](/screenshots/login.png)
![Onboarding](./screenshots/onboarding.png)
![Workout board](./screenshots/board.png)
![Edit mode](./screenshots/edit-mode.png)
![Rest timer](./screenshots/rest-timer.png)
![Finish summary](./screenshots/finish.png)
![Journal](./screenshots/journal.png)
 
## Live Demo
 
🔗 [Try it live](https://ironman-bygray.netlify.app/)
 
Use the **Try the Demo** button on the login screen - no account needed. Demo data resets on every logout so it always starts fresh.
 
## Features
 
- **Custom training programs** — build your own days and exercises instead of picking from a fixed template. Choose weekly frequency, name your days, and fill them from a curated exercise library or add your own.
- **Live workout tracking** — quick-edit weight, reps, sets, and rest time right from the exercise card, no separate "edit mode" needed for day-to-day logging.
- **Supersets** — link two exercises together with zero rest between them.
- **Drag-and-drop reordering** — reorder exercises with a long-press in normal mode, or a dedicated drag handle in edit mode.
- **Rest timer** — full-screen countdown that starts automatically after a completed set, with ±15s adjustment and haptic feedback on completion.
- **Workout journal** — every finished session is logged with duration, tonnage, and per-set detail. Past entries can be corrected after the fact.
- **Session summary** — a randomized motivational message plus a stats recap (duration, sets done, tonnage) after every finished workout.
- **Auth** — email/password signup with email confirmation, or a guest demo account that always starts from a clean onboarding flow.
- **Dark/light theme** — persisted across sessions, togglable from a swipe-free tap-triggered panel on the main screen.
## Tech Stack
 
**Frontend**
- Vue 3 (Composition API, `<script setup>`)
- Vite
- Pinia (state management)
- Vue Router
- [vuedraggable](https://github.com/SortableJS/vue.draggable.next) (drag-and-drop)

**Backend**
- Supabase (Postgres, Auth, Row Level Security)

**Styling**
- Hand-written CSS with a token-based design system (CSS custom properties for both themes)
- No CSS framework — custom components throughout

## Architecture Notes
 
A few decisions worth calling out for anyone reviewing the code:
 
- **RLS-first data access.** Every table is protected by Row Level Security policies; the frontend never has to filter by `user_id` manually — Supabase does it at the database layer.
- **Live program vs. history are separate tables.** `program_days` / `program_exercises` hold the current, editable state. `workout_logs` / `workout_log_exercises` are immutable snapshots taken at the moment a workout is finished — renaming an exercise later doesn't rewrite history.
- **Per-set data, not per-exercise.** Weight, reps, and completion are tracked individually for each set (`sets_data: jsonb`), so tonnage and progress are calculated from real per-set numbers, not estimates.
- **Component boundaries follow data ownership**, not just visual grouping — e.g. `ExerciseCard` owns its own debounced autosave, `DayTabs` owns day CRUD, `WorkoutBoard` only orchestrates.
## Getting Started
 
### Prerequisites
 
- Node.js 18+
- A [Supabase](https://supabase.com) project
### Setup
 
```bash
git clone <repo-url>
cd ironapp
npm install
```
 
Create a `.env` file in the project root:
 
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_DEMO_EMAIL=demo@example.com
VITE_DEMO_PASSWORD=your_demo_password
```
 
Run the SQL migrations in `supabase/schema.sql` *(if you keep one — otherwise apply the schema from the Supabase SQL Editor)* to create the required tables (`profiles`, `program_days`, `program_exercises`, `workout_logs`, `workout_log_exercises`) and their RLS policies.
 
Create a demo user in Supabase Auth (Authentication → Users → Add user, with **Auto Confirm User** checked) matching the credentials in your `.env`.
 
### Run locally
 
```bash
npm run dev
```
 
### Build for production
 
```bash
npm run build
```
 
## Roadmap
 
- [ ] Mobile app packaging (Capacitor → APK)
- [ ] Personal records / progress charts in the journal
- [ ] Additional exercise presets
## License
 
Personal portfolio project — not licensed for reuse.
