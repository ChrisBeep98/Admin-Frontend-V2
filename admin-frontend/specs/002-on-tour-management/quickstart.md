# Quickstart: Tour Management Modal

This document provides a quick way to test and validate the Tour Management Modal feature.

## Prerequisites

*   The application is running.
*   You are logged in as an admin user.
*   There are existing tours in the system.

## Testing Scenarios

### Scenario 1: View and Update Tour Details

1.  Navigate to the "Tours" page.
2.  Click on any tour in the list.
3.  A modal window should appear with the title of the tour.
4.  The "Tour Details" tab should be active.
5.  Verify that the fields are populated with the correct tour information.
6.  Change the value of the "Price" field to a new number.
7.  Click the "Save" button.
8.  The modal should close, and the tour list should reflect the updated price.
9.  Re-open the modal for the same tour and verify that the price is updated.

### Scenario 2: View and Update Itinerary

1.  Navigate to the "Tours" page.
2.  Click on a tour that has an existing itinerary.
3.  The tour management modal should open.
4.  Click on the "Itinerary" tab.
5.  Verify that the itinerary items are displayed correctly.
6.  Click on the "Add Item" button.
7.  Fill in the details for a new itinerary item.
8.  Click the "Save" button for the new item.
9.  Verify that the new item is added to the list.
10. Click on an existing itinerary item to edit it.
11. Change the "activity" of the item.
12. Click the "Save" button.
13. Verify that the activity is updated in the list.
14. Click on the "Delete" button for an itinerary item.
15. Confirm the deletion.
16. Verify that the item is removed from the list.
17. Click the main "Save" button for the itinerary tab.
18. Re-open the modal and verify that all itinerary changes are persisted.
