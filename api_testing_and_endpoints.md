# Nevado Trek API: Endpoints and Testing Guide

This document provides a comprehensive overview of the Nevado Trek API endpoints and a guide to testing them.

## API Base URL

All endpoints are accessed via POST requests to the following base URL:
`https://donprqhxuezsyokucfht.supabase.co/functions/v1/nevado-trek-api`

### CORS (Cross-Origin Resource Sharing)
The Edge Function is configured to include CORS headers in all responses, allowing requests from any origin. This is crucial for local development and frontend integration. Pre-flight `OPTIONS` requests are also handled.

## Authentication

-   **Admin Actions**: Require a Bearer token in the `Authorization` header.
    -   `Authorization: Bearer <SUPERADMIN_TOKEN>`
-   **Public Actions**: Do not require an `Authorization` header.

---

## Endpoints

All requests are `POST` requests with a JSON body containing an `action` and `data`.

### Tour Endpoints

#### Get All Tours (Admin)
-   **Action**: `get_all_tours`
-   **Protected**: Yes
-   **Description**: Retrieves a list of all tours, including inactive ones.
-   **Request Body**: `{"action": "get_all_tours"}`
-   **Curl Example**:
    ```bash
    curl -X POST "https://donprqhxuezsyokucfht.supabase.co/functions/v1/nevado-trek-api" \
      -H "Authorization: Bearer <TOKEN>" \
      -H "Content-Type: application/json" \
      -d '{"action": "get_all_tours"}'
    ```

#### Create Tour (Admin)
-   **Action**: `create_tour`
-   **Protected**: Yes
-   **Description**: Creates a new tour.
-   **Request Body**:
    ```json
    {
      "action": "create_tour",
      "data": {
        "name": "New Tour Name",
        "description": "A description of the tour.",
        "altitude": 4200,
        "difficulty": 4,
        "distance": 15,
        "temperature": "Cold",
        "days": 2,
        "hours": 0,
        "price_one": 150.00,
        "price_couple": 280.00,
        "price_three_to_five": 400.00,
        "price_six_plus": 500.00,
        "images": ["url1", "url2"],
        "includes": ["Item 1", "Item 2"],
        "recommendations": ["Recommendation 1"],
        "status": "active"
      }
    }
    ```

#### Update Tour (Admin)
-   **Action**: `update_tour`
-   **Protected**: Yes
-   **Description**: Updates an existing tour.
-   **Request Body**:
    ```json
    {
      "action": "update_tour",
      "data": {
        "id": 3,
        "description": "An updated description."
      }
    }
    ```

#### Delete Tour (Admin)
-   **Action**: `delete_tour`
-   **Protected**: Yes
-   **Description**: Deletes a tour by its ID.
-   **Request Body**: `{"action": "delete_tour", "data": {"id": 3}}`

### Itinerary Endpoints

#### Create Itinerary (Admin)
-   **Action**: `create_itinerary`
-   **Protected**: Yes
-   **Description**: Creates a new itinerary for a tour.
-   **Request Body**:
    ```json
    {
      "action": "create_itinerary",
      "data": {
        "tour_id": 3,
        "day": 1,
        "activities": [
          {"name": "Activity 1", "start_time": "08:00", "end_time": "12:00"}
        ]
      }
    }
    ```

#### Update Itinerary (Admin)
-   **Action**: `update_itinerary`
-   **Protected**: Yes
-   **Description**: Updates an itinerary by its ID.
-   **Request Body**: `{"action": "update_itinerary", "data": {"id": 1, "day": 2}}`

#### Delete Itinerary (Admin)
-   **Action**: `delete_itinerary`
-   **Protected**: Yes
-   **Description**: Deletes an itinerary by its ID.
-   **Request Body**: `{"action": "delete_itinerary", "data": {"id": 1}}`

#### Get Itineraries (Admin)
-   **Action**: `get_itineraries`
-   **Protected**: Yes
-   **Description**: Retrieves itineraries. Can be filtered by `tour_id` or `id`.
-   **Request Body**: `{"action": "get_itineraries", "data": {"tour_id": 1}}`

### Booking Endpoints

#### Create Booking (Public)
-   **Action**: `create_booking`
-   **Protected**: No
-   **Description**: Creates a new booking for a tour.
-   **Request Body**:
    ```json
    {
      "action": "create_booking",
      "data": {
        "tour_id": 3,
        "full_name": "John Doe",
        "phone": "+1234567890",
        "nationality": "American",
        "number_of_people": 2,
        "departure_date": "2025-10-20"
      }
    }
    ```

#### Get Bookings (Admin)
-   **Action**: `get_bookings`
-   **Protected**: Yes
-   **Description**: Retrieves bookings. Can be filtered by `tour_id` or `status`.
-   **Request Body**: `{"action": "get_bookings", "data": {"tour_id": 3}}`

#### Update Booking (Admin)
-   **Action**: `update_booking`
-   **Protected**: Yes
-   **Description**: Updates a booking by its ID.
-   **Request Body**: `{"action": "update_booking", "data": {"id": 3, "status": "confirmed"}}`

#### Delete Booking (Admin)
-   **Action**: `delete_booking`
-   **Protected**: Yes
-   **Description**: Deletes a booking by its ID.
-   **Request Body**: `{"action": "delete_booking", "data": {"id": 3}}`

---

## Full Test Cycle Commands

This section documents the `curl` commands for a full create-read-update-delete test cycle.

*Note: The JSON data in the `-d` flag is escaped for use in a bash-compatible shell.*

### 1. Create a new Tour
```bash
curl -X POST "https://donprqhxuezsyokucfht.supabase.co/functions/v1/nevado-trek-api" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d "{\"action\":\"create_tour\",\"data\":{\"name\":\"Gemini Test Tour\",\"description\":\"A tour created for testing purposes.\",\"altitude\":4200,\"difficulty\":4,\"distance\":15,\"temperature\":\"Cold\",\"days\":2,\"hours\":0,\"price_one\":150.00,\"price_couple\":280.00,\"price_three_to_five\":400.00,\"price_six_plus\":500.00,\"images\":[\"https://example.com/image1.jpg\"],\"includes\":[\"Transportation\",\"Guide\"],\"recommendations\":[\"Bring warm clothes\"],\"status\":\"active\"}}"
```
**Result:** `{"message":"Tour created successfully"}`

### 2. Get All Tours (to find the new tour's ID)
```bash
curl -X POST "https://donprqhxuezsyokucfht.supabase.co/functions/v1/nevado-trek-api" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d "{\"action\":\"get_all_tours\"}"
```
**Result:** A JSON array of tours. Find the tour with the name "Gemini Test Tour" to get its `id`.

### 3. Update the Tour
```bash
curl -X POST "https://donprqhxuezsyokucfht.supabase.co/functions/v1/nevado-trek-api" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d "{\"action\":\"update_tour\",\"data\":{\"id\":3,\"description\":\"This is an updated description for the Gemini Test Tour.\"}}"
```
**Result:** `{"message":"Tour updated successfully"}`

### 4. Create an Itinerary
```bash
curl -X POST "https://donprqhxuezsyokucfht.supabase.co/functions/v1/nevado-trek-api" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d "{\"action\":\"create_itinerary\",\"data\":{\"tour_id\":3,\"day\":1,\"activities\":[{\"name\": \"Morning Hike\", \"start_time\": \"08:00\", \"end_time\": \"12:00\"}]}}"
```
**Result:** `{"message":"Itinerary created successfully"}`

### 5. Create a Booking (Public)
```bash
curl -X POST "https://donprqhxuezsyokucfht.supabase.co/functions/v1/nevado-trek-api" \
  -H "Content-Type: application/json" \
  -d "{\"action\":\"create_booking\",\"data\":{\"tour_id\":3,\"full_name\":\"John Doe\",\"phone\":\"+1234567890\",\"nationality\":\"American\",\"number_of_people\":2,\"departure_date\":\"2025-10-20\"}}"
```
**Result:** `{"message":"Booking created successfully"}`

### 6. Get Bookings (to find the new booking's ID)
```bash
curl -X POST "https://donprqhxuezsyokucfht.supabase.co/functions/v1/nevado-trek-api" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d "{\"action\":\"get_bookings\",\"data\":{\"tour_id\":3}}"
```
**Result:** A JSON array containing the new booking. Get its `id`.

### 7. Update the Booking
```bash
curl -X POST "https://donprqhxuezsyokucfht.supabase.co/functions/v1/nevado-trek-api" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d "{\"action\":\"update_booking\",\"data\":{\"id\":3,\"status\":\"confirmed\"}}"
```
**Result:** `{"message":"Booking updated successfully"}`

### 8. Delete the Booking
```bash
curl -X POST "https://donprqhxuezsyokucfht.supabase.co/functions/v1/nevado-trek-api" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d "{\"action\":\"delete_booking\",\"data\":{\"id\":3}}"
```
**Result:** `{"message":"Booking deleted successfully"}`

### 9. Delete the Tour
```bash
curl -X POST "https://donprqhxuezsyokucfht.supabase.co/functions/v1/nevado-trek-api" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d "{\"action\":\"delete_tour\",\"data\":{\"id\":3}}"
```
**Result:** `{"message":"Tour deleted successfully"}`
