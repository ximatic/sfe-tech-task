# 💪 SFE Tech Task

Welcome! This project is a small Angular-based application designed to assess your frontend skills with a realistic setup. It includes a backend built in Node.js with an in-memory database, and a frontend written in Angular 19 using the latest standalone and signal-based patterns.

---

## Solution description

### Changes to exisiting solution

- Replace `/users/:id` route with `/users/update/:id` to avoid issues with certain User Id (e.g. `create`) which technically could be possible
- Replace Karma/Jasmine with Jest - personally I prefer Jest for unit tests in Angular
- Improve UI to fully use Angular Material Magenta/Violet color scheme
- Add optional call to `/users` endpoint when editing exisiting user - without it, form could be filled with data only if users list were visited previously. For better solution, backend endpoint to get single user data should be created.
- Add toggle theme mechanism to provide better UX

### TODOs

In current section you will find information what else could be done to have application "by the book"

#### Frontend

- Add `lint` and `prettier` to provide better code quality and standards - it's not added to the task as thos could overshadow "real" changes to the solution
- Add translation support (e.g. `ngx-translate`) - even with ont language it would be beneficial as adding extra language(s) in the future would be trivial
- Add E2E tests
- Add password complexity verification - in current case it's not needed (as no logic in the backend) but could be usefull in the future
- Use widely used state management library (e.g. `ngrx`) - it would simplify understanding the code for future developers

#### Backend

- Add validation for unique and "test" containing username for `/:id` PUT endpoint - currently it allows such usernames
- Create `/:id` GET endpoint to get user information - it would simplify logic in the frontend

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone <REPO_URL>
cd sfe-tech-task
```

### 2. Start the Backend

```bash
cd backend
npm install
npm start
```

The backend will run on [http://localhost:3000](http://localhost:3000).

### 3. Start the Frontend

If you are still in the backend folder, go back to the root folder:

```bash
npm install
ng serve
```

The frontend will run on [http://localhost:4200](http://localhost:4200).

---

## ✅ What’s Already Implemented

### 🔐 Auth

- A login page is scaffolded using Angular Material.
- `AuthService.login()` is implemented and connects to the backend.
- Backend API accepts hardcoded credentials (see `backend/db.js`).

### 👥 User Management

- A working API for fetching, creating, and updating users exists.
- Angular architecture follows best practices:
  - **Dumb components** for UI
  - **Smart container pages** for logic
  - **Facade → Store → Service** pattern for state and API management
- Routes:
  - `GET /users` — user list
  - `POST /users/create` — create user
  - `PUT /users/:id` — edit user

---

## 🧐 Your Task

Your goal is to complete the app’s functionality using Angular best practices.

### 🔐 Auth

- Implement logic in `LoginPage` to store and share the token with other API calls.
- Protect all `/users` routes from unauthorized access.

### 👥 Users

- Make the user form fully functional for **creating and editing users**.
- Add **form validation** (e.g., required fields, custom validators). You might notice that there is a validation on the BE to not have **test** in the name, try to prevent sending those requests from the FE.
- Display loading states and error messages as needed.
- Fix any subtle bugs in the existing logic or API integration (if popping up, of course you don't need to touch backend).

---

## ✨ Bonus Points

These are optional but will showcase advanced skills:

- Add **unit tests**.
- Improve **UI/UX**.

---

## 🧹 Git Commit Guidelines

- Start with an **initial empty commit** (e.g., `chore: start tech task`) when beginning your work.
- Use **small, clear commits** to document your progress.
- End with a **final commit** (e.g., `feat: complete tech task`) when you have finished.
- We value **clean and readable Git history**!

---

## 📬 Submission

1. **Fork** this repository to your own GitHub account.
2. Complete the task in your forked repo.
3. Send us the link to your fork when you're finished.

---

Good luck! We’re looking forward to seeing how you approach the challenge and what best practices you're going to introduce for us 🚀
