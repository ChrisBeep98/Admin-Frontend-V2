# Edge Function Architecture for Tours App

This document outlines the architecture and step-by-step planning for the Edge Function in Supabase for the Tours App MVP. The Edge Function acts as a secure backend layer to handle all admin operations and sensitive logic, such as token validation, price calculations, and database mutations. It ensures that anonymous users can only perform allowed actions (e.g., creating bookings), while admins (via superadmin token) have full control over tours, itineraries, and bookings.

The Edge Function is built in Deno (Supabase's default runtime for Edge Functions) and uses the Supabase JS client with the service role key for full database access. It processes incoming requests with a JSON payload containing an `action` (e.g., "create_tour") and `data` (payload details). All admin actions require a Bearer token in the `Authorization` header, matched against a secret `SUPERADMIN_TOKEN`.

## Key Requirements from Conversation
## Key Requirements from Conversation
- **Admin Role (Superadmin Token)**: No login; access via a secret token stored in Supabase secrets. Admins can create, update, delete tours; add/update/delete itineraries; view, update, delete bookings.
- **User Role (Anonymous)**: Can create bookings (no token required for this action). View tours/itineraries handled directly via Supabase client in frontend (public reads via RLS).
- **Database Integration**: Connect to Supabase using `DB_URL` and `SERVICE_ROLE_KEY` (secrets).
- **Price Calculation for Bookings**: Based on `number_of_people`:
  - 1 person: `price_one`
  - 2 people: `price_couple`
  - 3-5 people: `price_three_to_five`
  - 6+ people: `price_six_plus`
  The `createBooking` function in the Edge Function now implements this logic to calculate `applied_price` before inserting the booking into the database.
- **Security**: Validate token for all admin actions. Handle errors gracefully (e.g., 401 Unauthorized, 500 Internal Error).
- **CORS Handling**: The Edge Function now explicitly handles CORS (Cross-Origin Resource Sharing) by setting `Access-Control-Allow-Origin: '*'` and other necessary headers for all responses, including pre-flight `OPTIONS` requests.
- **Functionality Coverage**:
  - Tours: Create, Read (admin view all, including inactive), Update, Delete.
  - Itineraries: Create (add days with activities), Update, Delete (per day or all for a tour).
  - Bookings: Create (anonymous or admin, with dynamic price calculation), Read (admin only), Update (e.g., change status), Delete.
- **Dynamic Elements**: Itineraries use JSONB for activities array (e.g., `[{name: "Hiking", start_time: "08:00", end_time: "12:00"}]`).
- **Error Handling**: Validate inputs (e.g., positive numbers, valid formats); return meaningful errors.
- **Scalability**: Keep functions lightweight; no heavy computations.

## Architecture Overview
- **Entry Point**: Single Edge Function ("admin-functions") that handles multiple actions via a switch-like structure based on `action` in the request body.
- **Request Format**: POST requests with JSON body `{ action: "create_tour", data: { ... } }` and `Authorization: Bearer <token>` for admin actions.
- **Response Format**: JSON responses with success messages or errors (e.g., `{ message: "Tour created" }` or `{ error: "Invalid data" }`), always including CORS headers.
- **Supabase Client**: Initialized with service role for bypassing RLS on admin operations.
- **Secrets**: `SUPERADMIN_TOKEN`, `DB_URL`, `SERVICE_ROLE_KEY` stored in Supabase Edge Function secrets.

Proyect-supabase-name: 
tours-app-mvp
EwQEwh7Fq0wGFcrL

SUPERADMIN_TOKEN
qQxLebk8jpi_pND

DB_URL
https://donprqhxuezsyokucfht.supabase.co

SERVICE_ROLE_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvbnBycWh4dWV6c3lva3VjZmh0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzcyNjEwNiwiZXhwIjoyMDczMzAyMTA2fQ.tb176105x4JMIrdALiVRdv3IL0FFRrBRIjKOjLIIA8M

- **Public vs. Protected Actions**:
  - Protected (require token): All tour/itinerary mutations, booking updates/deletes, admin reads (e.g., all bookings).
  - Public: Create booking (anonymous, but validate data and calculate price).
- **Data Validation**: Use simple checks in code (e.g., if (!data.name) return error).
- **Logging**: Use `console.log` for debugging (visible in Supabase logs).

## Step-by-Step Planning for Functionality
1. **Setup and Initialization**:
   - Import Supabase client.
   - Parse request: Get headers (for token), body (for action/data).
   - Handle CORS pre-flight `OPTIONS` requests.
   - Validate token for protected actions.

2. **Protected Actions (Require Token)**:
   - **create_tour**: Insert into `tours` with `created_by: 'superadmin'`. Validate required fields (name, description, prices, etc.). Return new tour ID.
   - **update_tour**: Update `tours` by ID. Allow partial updates. Validate ID exists.
   - **delete_tour**: Delete from `tours` by ID (cascades to itineraries; restrict if bookings exist via DB constraint).
   - **get_all_tours**: Select all tours (including inactive) for admin dashboard.
   - **create_itinerary**: Insert into `itineraries` with tour_id, day, activities (JSONB). Validate tour_id exists and activities format.
   - **update_itinerary**: Update by ID (or by tour_id and day). Allow changing activities.
   - **delete_itinerary**: Delete by ID or all for a tour_id.
   - **get_bookings**: Select all bookings (admin view). Optional filters (e.g., by tour_id, status).
   - **update_booking**: Update by ID (e.g., change status to 'confirmed' or 'canceled', or edit details).
   - **delete_booking**: Delete by ID.

3. **Public Actions (No Token Required)**:
   - **create_booking**: Fetch tour by ID, calculate `applied_price` based on `number_of_people` (using `price_one`, `price_couple`, `price_three_to_five`, `price_six_plus` from the tour data), insert into `bookings`. Validate required fields (full_name, phone, nationality, etc.) and that tour exists/active.

4. **General Handling**:
   - If action unknown: Return 400 "Unsupported action" with CORS headers.
   - Error handling: Catch Supabase errors, return 500 with error message and CORS headers.
   - Input sanitization: Ensure numbers are parsed (e.g., parseInt for IDs), strings trimmed.
   - Activities validation: For itineraries, check activities is an array of objects with name, start_time, end_time.

5. **Deployment Steps**:
   - Create Edge Function in Supabase dashboard.
   - Paste code, deploy.
   - Set secrets.
   - Test with Postman or frontend: Send POST to function URL.

6. **Testing Plan**:
   - Test token validation: Invalid token → 401.
   - Create tour: Valid data → 200 success.
   - Create booking: Calculate price correctly based on `number_of_people`.
   - Edge cases: Missing fields, invalid IDs, large number_of_people.
   - CORS: Verify successful requests from different origins.

## Prompt for Creating the Edge Function
Use this prompt to generate the full Deno/JavaScript code for the Edge Function (e.g., paste into an AI like Grok or ChatGPT):

"Create a complete Supabase Edge Function in Deno/JavaScript for a tours app. The function handles multiple actions via a POST request with JSON body { action: 'create_tour', data: { ... } }. Admin actions require a Bearer token in Authorization header, validated against Deno.env.get('SUPERADMIN_TOKEN'). Use Supabase client with Deno.env.get('DB_URL') and Deno.env.get('SERVICE_ROLE_KEY').

Database tables:
- tours: id, name, description, altitude, difficulty (1-5), distance, temperature, days, hours, price_one, price_couple, price_three_to_five, price_six_plus, images (TEXT[]), includes (TEXT[]), recommendations (TEXT[]), created_by, created_at, status ('active'/'inactive').
- itineraries: id, tour_id (FK to tours, cascade delete), day (>=1), activities (JSONB array of {name, start_time, end_time}), created_at.
- bookings: id, tour_id (FK to tours, restrict delete), full_name, document (opt), phone, nationality, note (<=500 chars), number_of_people (>=1), departure_date, applied_price, status ('pending'/'confirmed'/'canceled'), created_at.

Implement these actions:
- Protected (require token):
  - create_tour: Insert data into tours, set created_by='superadmin'. Validate required fields.
  - update_tour: Update tours by data.id. Partial updates ok.
  - delete_tour: Delete tours by data.id.
  - get_all_tours: Select * from tours (all statuses).
  - create_itinerary: Insert into itineraries. Validate tour_id exists, activities is valid JSONB array.
  - update_itinerary: Update by data.id or {tour_id, day}.
  - delete_itinerary: Delete by data.id or all for data.tour_id.
  - get_bookings: Select * from bookings, optional filters (data.tour_id, data.status).
  - update_booking: Update bookings by data.id (e.g., status).
  - delete_booking: Delete bookings by data.id.
- Public:
  - create_booking: Fetch tour by data.tour_id (must be active), calculate applied_price based on number_of_people (use price_one for 1, price_couple for 2, etc.), insert into bookings. Validate fields.

Handle errors: 401 for invalid token, 400 for bad data, 500 for DB errors. Log issues. Return JSON responses like { message: 'Success' } or { error: 'Details' }.

Also, ensure that all responses include CORS headers (`Access-Control-Allow-Origin: '*'`) to allow requests from any origin, including for OPTIONS preflight requests."


## Architecture Overview
- **Entry Point**: Single Edge Function ("admin-functions") that handles multiple actions via a switch-like structure based on `action` in the request body.
- **Request Format**: POST requests with JSON body `{ action: "create_tour", data: { ... } }` and `Authorization: Bearer <token>` for admin actions.
- **Response Format**: JSON responses with success messages or errors (e.g., `{ message: "Tour created" }` or `{ error: "Invalid data" }`).
- **Supabase Client**: Initialized with service role for bypassing RLS on admin operations.
- **Secrets**: `SUPERADMIN_TOKEN`, `DB_URL`, `SERVICE_ROLE_KEY` stored in Supabase Edge Function secrets.

Proyect-supabase-name: 
tours-app-mvp
EwQEwh7Fq0wGFcrL

SUPERADMIN_TOKEN
qQxLebk8jpi_pND

DB_URL
https://donprqhxuezsyokucfht.supabase.co

SERVICE_ROLE_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvbnBycWh4dWV6c3lva3VjZmh0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzcyNjEwNiwiZXhwIjoyMDczMzAyMTA2fQ.tb176105x4JMIrdALiVRdv3IL0FFRrBRIjKOjLIIA8M

- **Public vs. Protected Actions**:
  - Protected (require token): All tour/itinerary mutations, booking updates/deletes, admin reads (e.g., all bookings).
  - Public: Create booking (anonymous, but validate data).
- **Data Validation**: Use simple checks in code (e.g., if (!data.name) return error).
- **Logging**: Use `console.log` for debugging (visible in Supabase logs).

## Step-by-Step Planning for Functionality
1. **Setup and Initialization**:
   - Import Supabase client.
   - Parse request: Get headers (for token), body (for action/data).
   - Validate token for protected actions.

2. **Protected Actions (Require Token)**:
   - **create_tour**: Insert into `tours` with `created_by: 'superadmin'`. Validate required fields (name, description, prices, etc.). Return new tour ID.
   - **update_tour**: Update `tours` by ID. Allow partial updates. Validate ID exists.
   - **delete_tour**: Delete from `tours` by ID (cascades to itineraries; restrict if bookings exist via DB constraint).
   - **get_all_tours**: Select all tours (including inactive) for admin dashboard.
   - **create_itinerary**: Insert into `itineraries` with tour_id, day, activities (JSONB). Validate tour_id exists and activities format.
   - **update_itinerary**: Update by ID (or by tour_id and day). Allow changing activities.
   - **delete_itinerary**: Delete by ID or all for a tour_id.
   - **get_bookings**: Select all bookings (admin view). Optional filters (e.g., by tour_id, status).
   - **update_booking**: Update by ID (e.g., change status to 'confirmed' or 'canceled', or edit details).
   - **delete_booking**: Delete by ID.

3. **Public Actions (No Token Required)**:
   - **create_booking**: Fetch tour by ID, calculate applied_price based on number_of_people, insert into `bookings`. Validate required fields (full_name, phone, nationality, etc.) and that tour exists/active.

4. **General Handling**:
   - If action unknown: Return 400 "Unsupported action".
   - Error handling: Catch Supabase errors, return 500 with error message.
   - Input sanitization: Ensure numbers are parsed (e.g., parseInt for IDs), strings trimmed.
   - Activities validation: For itineraries, check activities is an array of objects with name, start_time, end_time.

5. **Deployment Steps**:
   - Create Edge Function in Supabase dashboard.
   - Paste code, deploy.
   - Set secrets.
   - Test with Postman or frontend: Send POST to function URL.

6. **Testing Plan**:
   - Test token validation: Invalid token → 401.
   - Create tour: Valid data → 200 success.
   - Create booking: Calculate price correctly.
   - Edge cases: Missing fields, invalid IDs, large number_of_people.

## Prompt for Creating the Edge Function
Use this prompt to generate the full Deno/JavaScript code for the Edge Function (e.g., paste into an AI like Grok or ChatGPT):

"Create a complete Supabase Edge Function in Deno/JavaScript for a tours app. The function handles multiple actions via a POST request with JSON body { action: 'create_tour', data: { ... } }. Admin actions require a Bearer token in Authorization header, validated against Deno.env.get('SUPERADMIN_TOKEN'). Use Supabase client with Deno.env.get('DB_URL') and Deno.env.get('SERVICE_ROLE_KEY').

Database tables:
- tours: id, name, description, altitude, difficulty (1-5), distance, temperature, days, hours, price_one, price_couple, price_three_to_five, price_six_plus, images (TEXT[]), includes (TEXT[]), recommendations (TEXT[]), created_by, created_at, status ('active'/'inactive').
- itineraries: id, tour_id (FK to tours, cascade delete), day (>=1), activities (JSONB array of {name, start_time, end_time}), created_at.
- bookings: id, tour_id (FK to tours, restrict delete), full_name, document (opt), phone, nationality, note (<=500 chars), number_of_people (>=1), departure_date, applied_price, status ('pending'/'confirmed'/'canceled'), created_at.

Implement these actions:
- Protected (require token):
  - create_tour: Insert data into tours, set created_by='superadmin'. Validate required fields.
  - update_tour: Update tours by data.id. Partial updates ok.
  - delete_tour: Delete tours by data.id.
  - get_all_tours: Select * from tours (all statuses).
  - create_itinerary: Insert into itineraries. Validate tour_id exists, activities is valid JSONB array.
  - update_itinerary: Update by data.id or {tour_id, day}.
  - delete_itinerary: Delete by data.id or all for data.tour_id.
  - get_bookings: Select * from bookings, optional filters (data.tour_id, data.status).
  - update_booking: Update bookings by data.id (e.g., status).
  - delete_booking: Delete bookings by data.id.
- Public:
  - create_booking: Fetch tour by data.tour_id (must be active), calculate applied_price based on number_of_people (use price_one for 1, price_couple for 2, etc.), insert into bookings. Validate fields.

Handle errors: 401 for invalid token, 400 for bad data, 500 for DB errors. Log issues. Return JSON responses like { message: 'Success' } or { error: 'Details' }.

Also, ensure that all responses include CORS headers (`Access-Control-Allow-Origin: '*'`) to allow requests from any origin, including for OPTIONS preflight requests.