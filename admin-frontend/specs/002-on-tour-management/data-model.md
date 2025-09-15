# Data Model

This document defines the data models for the Tour Management feature.

## Tour

Represents a tour package.

| Field           | Type                               | Description                            |
| --------------- | ---------------------------------- | -------------------------------------- |
| id              | string                             | Unique identifier for the tour.        |
| name            | string                             | Name of the tour.                      |
| description     | string                             | Detailed description of the tour.      |
| duration        | string                             | Duration of the tour (e.g., "5 days"). |
| price           | number                             | Price of the tour.                     |
| status          | 'active' \| 'inactive' \| 'draft' | Status of the tour.                    |
| maxParticipants | number?                            | Maximum number of participants.        |
| difficulty      | string                             | Difficulty level of the tour.          |
| imageUrl        | string?                            | URL of an image for the tour.          |
| createdAt       | string                             | ISO date string of creation time.      |
| updatedAt       | string                             | ISO date string of last update time.   |

## ItineraryItem

Represents a single item in a tour's itinerary.

| Field    | Type    | Description                           |
| -------- | ------- | ------------------------------------- |
| id       | string  | Unique identifier for the item.       |
| tourId   | string  | ID of the tour this item belongs to.  |
| day      | number  | The day of the tour for this item.    |
| time     | string  | Time of the activity (HH:mm format).  |
| activity | string  | Description of the activity.          |
| location | string? | Location of the activity.             |
| notes    | string? | Additional notes for the activity.    |
| createdAt| string  | ISO date string of creation time.     |
| updatedAt| string  | ISO date string of last update time.  |
