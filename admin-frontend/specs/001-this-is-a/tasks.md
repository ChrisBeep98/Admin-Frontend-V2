# Tasks: Comprehensive Admin Application

**Input**: Design documents from `/specs/001-this-is-a/`
**Prerequisites**: plan.md, research.md, data-model.md

## Phase 3.1: Setup
- [ ] T001 [P]make a git version before starting changes, review the entire proyect and check its state,  wich is already working with its integrations with the api and create a `setupTests.ts` file.

## Phase 3.2: Refactor
- [ ] T002 Refactor the `api.ts` service in `src/services/api.ts` to be more modular. Create separate functions for each endpoint.

## Phase 3.3: Tests First (TDD)
- [ ] T003 [P] Write unit tests for the `AuthContext` in `src/contexts/AuthContext.tsx` that is a simple auth, by obtainig the tours using the token, we ensure the authentication.
- [ ] T004 [P] Write unit tests for the `api.ts` service in `src/services/api.ts`.
- [ ] T005 [P] Write integration tests for the login flow in `src/pages/LoginPage.tsx`.
- [ ] T006 [P] Write integration tests for the tours page in `src/pages/ToursPage.tsx`.
- [ ] T007 [P] Write integration tests for the bookings page in `src/pages/BookingsPage.tsx`.

## Phase 3.4: Feature: Calendar View
- [ ] T008 Create a new `CalendarPage.tsx` in `src/pages/`.
- [ ] T009 Add a route for the calendar page in `src/router/AppRouter.tsx`.
- [ ] T010 Add a link to the calendar page in the navigation component.
- [ ] T011 Install `react-big-calendar` and its types: `npm install react-big-calendar @types/react-big-calendar`.
- [ ] T012 Implement the calendar view in `src/pages/CalendarPage.tsx` to display bookings.

## Phase 3.5: Polish
- [ ] T013 [P] Add loading indicators for API calls in the pages.
- [ ] T014 [P] Add error handling for API calls in the pages.
- [ ] T015 [P] Review and improve the UI of the application.

## Dependencies
- T001 must be done before all tests.
- T002 should be done before writing tests for the api service.
- T008-T012 are dependent on each other.

## Parallel Example
```
# Launch T003-T007 together:
Task: "Write unit tests for the AuthContext in src/contexts/AuthContext.tsx"
Task: "Write unit tests for the api.ts service in src/services/api.ts"
Task: "Write integration tests for the login flow in src/pages/LoginPage.tsx"
Task: "Write integration tests for the tours page in src/pages/ToursPage.tsx"
Task: "Write integration tests for the bookings page in src/pages/BookingsPage.tsx"
```