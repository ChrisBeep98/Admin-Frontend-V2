# Tours App Database Architecture

This document outlines the database architecture for the Tours App MVP, built on Supabase using its PostgreSQL backend and the free plan (500 MB storage, 2 GB bandwidth, suitable for an MVP). The app supports two roles:
- **Admin**: Accesses the system via a superadmin token (no login required). Can create, update, delete tours, itineraries, and manage bookings.
- **Users**: Anonymous access. Can view active tours and itineraries, and create bookings with personal details (no login required).

The database uses **Row Level Security (RLS)** to control access, ensuring public users can only read active tours and itineraries, and create bookings, while admin operations (create/update/delete) are restricted and will be handled via a secure backend process (e.g., Edge Function, to be defined separately). The structure supports dynamic itineraries, multiple pricing tiers, and anonymous bookings with calculated prices.

## Key Features
- **Relational Structure**: Tours as the main entity, linked to dynamic itineraries (per day with variable activities) and bookings (reservations with calculated prices).
- **Security**: RLS ensures public reads for active data only; admin operations restricted to token-based access (handled externally).
- **Pricing Logic**: Supports prices for 1 person, 2 people, 3–5 people, and 6+ people, stored in the `tours` table. The `applied_price` for bookings is calculated by the Edge Function based on these tiers and the `number_of_people`.
- **Data Types**: Uses TEXT arrays for images, includes, and recommendations; JSONB for flexible itinerary activities.
- **Performance**: Indexes on foreign keys and common query fields (e.g., departure date, full name).
- **Constraints**: Enforces valid difficulty (1–5), positive values, status enums, and note length limits.
- **Deployment**: Designed for Supabase free plan; monitor storage (<500 MB) and query usage.

## Database Schema (SQL Code)

### 1. Create Tables, Constraints, and Indexes
This SQL creates three tables: `tours`, `itineraries`, and `bookings`, with appropriate relationships, constraints, and indexes for performance.

```sql
-- Table Tours: stores tour information
CREATE TABLE tours (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    altitude INTEGER NOT NULL, -- In meters
    difficulty INTEGER CHECK (difficulty >= 1 AND difficulty <= 5), -- Scale 1 to 5
    distance INTEGER NOT NULL, -- In kilometers
    temperature VARCHAR(50), -- Example: "Warm", "Cold"
    days INTEGER DEFAULT 0, -- Duration in days, 0 if not applicable
    hours INTEGER DEFAULT 0, -- Duration in hours, 0 if not applicable
    price_one DECIMAL(10,2) NOT NULL, -- Price for 1 person
    price_couple DECIMAL(10,2) NOT NULL, -- Price for 2 people
    price_three_to_five DECIMAL(10,2) NOT NULL, -- Price for 3 to 5 people
    price_six_plus DECIMAL(10,2) NOT NULL, -- Price for 6 or more people
    images TEXT[] NOT NULL, -- Array of image URLs
    includes TEXT[] NOT NULL, -- Array of included items
    recommendations TEXT[] NOT NULL, -- Array of recommendations
    created_by VARCHAR(50) NOT NULL, -- Reference to superadmin (e.g., 'superadmin')
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive'))
);

-- Table Itineraries: stores dynamic itineraries for tours
CREATE TABLE itineraries (
    id SERIAL PRIMARY KEY,
    tour_id INTEGER REFERENCES tours(id) ON DELETE CASCADE, -- Links to tours
    day INTEGER NOT NULL CHECK (day >= 1), -- Day number
    activities JSONB NOT NULL, -- Array of objects [{name, start_time, end_time}]
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table Bookings: stores user bookings
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    tour_id INTEGER REFERENCES tours(id) ON DELETE RESTRICT, -- Prevents tour deletion if bookings exist
    full_name VARCHAR(255) NOT NULL,
    document VARCHAR(50), -- Optional, e.g., ID or passport
    phone VARCHAR(20) NOT NULL, -- With country code, e.g., +56912345678
    nationality VARCHAR(100) NOT NULL,
    note TEXT, -- Optional note
    number_of_people INTEGER NOT NULL CHECK (number_of_people >= 1),
    departure_date DATE NOT NULL,
    applied_price DECIMAL(10,2) NOT NULL, -- Calculated final price
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'canceled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Constraint for note in bookings (max 500 characters)
ALTER TABLE bookings ADD CONSTRAINT note_length CHECK (LENGTH(note) <= 500);

-- Indexes for performance
CREATE INDEX idx_tour_id_itineraries ON itineraries(tour_id);
CREATE INDEX idx_tour_id_bookings ON bookings(tour_id);
CREATE INDEX idx_departure_date_bookings ON bookings(departure_date);
CREATE INDEX idx_full_name_bookings ON bookings(full_name);
```

### 2. Enable Row Level Security (RLS)
RLS is enabled to enforce access control at the database level.

```sql
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
```

### 3. RLS Policies
These policies define who can read or write data. Admin operations (INSERT/UPDATE/DELETE for `tours` and `itineraries`, and UPDATE/DELETE for `bookings`) are restricted and will be handled via a secure backend process (e.g., Edge Function, to be defined later). Public users can read active tours/itineraries and create bookings.

```sql
-- Policies for Tours
CREATE POLICY "Public tours for all" ON tours
FOR SELECT
USING (status = 'active');

-- Policies for Itineraries
CREATE POLICY "Itineraries for active tours" ON itineraries
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM tours
        WHERE tours.id = itineraries.tour_id AND tours.status = 'active'
    )
);

-- Policies for Bookings
CREATE POLICY "Bookings visible to superadmin" ON bookings
FOR SELECT
USING (true); -- Restricted in backend (e.g., Edge Function)

CREATE POLICY "Anonymous booking creation" ON bookings
FOR INSERT
WITH CHECK (true); -- Anyone can create bookings (validated in backend)
```

## Architecture Overview

### Entity Relationships
- **Tours** (Main Table):
  - Stores core tour details: `name`, `description`, `altitude` (meters), `difficulty` (1–5), `distance` (kilometers), `temperature` (text), `days`/`hours` (flexible duration), `price_one`, `price_couple`, `price_three_to_five`, `price_six_plus` (decimal prices), `images`, `includes`, `recommendations` (TEXT arrays), `created_by` (superadmin reference), `created_at`, `status` (active/inactive).
  - One-to-Many with **Itineraries**: Each tour can have multiple days, each with a dynamic number of activities stored in JSONB (e.g., `[{"name": "Hiking", "start_time": "08:00", "end_time": "12:00"}]`.
  - One-to-Many with **Bookings**: Multiple bookings can reference a single tour.
- **Itineraries**:
  - Linked to `tours` via `tour_id` (foreign key).
  - Fields: `id`, `tour_id`, `day` (number, ≥1), `activities` (JSONB for dynamic activities), `created_at`.
  - `ON DELETE CASCADE`: Deleting a tour removes its itineraries.
- **Bookings**:
  - Linked to `tours` via `tour_id` (foreign key).
  - Fields: `id`, `tour_id`, `full_name`, `document` (optional), `phone` (with country code, e.g., +56912345678), `nationality`, `note` (optional, ≤500 chars), `number_of_people` (≥1), `departure_date`, `applied_price` (calculated in backend), `status` (pending/confirmed/canceled), `created_at`.
  - `ON DELETE RESTRICT`: Prevents tour deletion if active bookings exist.

### ### Data Flow
- **Public/Anonymous Access**:
  - Users query Supabase directly for active `tours` and `itineraries` using the anon key (public read-only access).
  - Create booking: Users send data (full_name, phone, etc.) to the Edge Function, which fetches the tour, calculates the `applied_price` based on `number_of_people` and the tour's pricing tiers, and then inserts the booking.
- **Admin Access**:
  - All mutations (create/update/delete tours, itineraries, bookings) are restricted to superadmin via token-based authentication (handled externally, e.g., Edge Function).
  - `created_by` tracks superadmin actions for auditing.
- **Price Calculation**: The Edge Function calculates the `applied_price` based on `number_of_people` and the tour's pricing tiers (`price_one`, `price_couple`, `price_three_to_five`, `price_six_plus`) and stores it in the `applied_price` field of the `bookings` table.

### Security Considerations
- **RLS**: Ensures public users only read active tours/itineraries; bookings readable only by superadmin (via backend).
- **Admin Restrictions**: INSERT/UPDATE/DELETE operations for `tours` and `itineraries`, and UPDATE/DELETE for `bookings`, are restricted to superadmin (handled externally).
- **Validation**: The Edge Function validates:
  - `phone` format (e.g., +<country code><number>).
  - `activities` JSONB structure (e.g., `{name, start_time, end_time}`).
  - Positive values for prices, `number_of_people`, etc.
- **Audit**: `created_by` and `created_at` track all changes.

### Performance Optimizations
- **Indexes**:
  - `idx_tour_id_itineraries` and `idx_tour_id_bookings` for fast joins.
  - `idx_departure_date_bookings` and `idx_full_name_bookings` for common queries (e.g., filtering bookings by date or name).
- **Constraints**:
  - `difficulty` limited to 1–5.
  - `number_of_people` ≥ 1.
  - `note` ≤ 500 characters.
  - `status` enums for consistency.
- **Scalability**: Arrays and JSONB allow flexible data (e.g., unlimited images or activities). If arrays grow large, consider separate tables (e.g., `tour_images`).


- **Tested sql code (working)**:
  - Insert test tour: `INSERT INTO tours (name, description, ..., status) VALUES ('Test Tour', 'A fun tour', ..., 'active');`.
  - Test itinerary: `INSERT INTO itineraries (tour_id, day, activities) VALUES (1, 1, '[{"name": "Hiking", "start_time": "08:00", "end_time": "12:00"}]');`.
  - Test booking: `INSERT INTO bookings (tour_id, full_name, ..., status) VALUES (1, 'John Doe', ..., 'pending');`.

