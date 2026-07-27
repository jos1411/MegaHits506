# Events Specification

## Purpose

Public events portfolio showcasing past and upcoming events managed by admin. Visitors browse events; admins CRUD them.

## Requirements

### Requirement: Public Events List

The system MUST display a public list of events with title, date, location, description, and cover image.

#### Scenario: Events page renders

- GIVEN events exist in the database
- WHEN a visitor navigates to the events page
- THEN events are listed in reverse chronological order (newest first)

#### Scenario: No events available

- GIVEN no events exist
- WHEN a visitor navigates to the events page
- THEN a placeholder message "No hay eventos registrados" is displayed

### Requirement: Event Detail View

The system MUST display a detail page for each event with full information and a photo gallery of that event.

#### Scenario: Visitor opens event detail

- GIVEN the events list is visible
- WHEN the visitor clicks an event card
- THEN the event detail page shows title, full date, location, description, cover image, and associated photos

#### Scenario: Event with no photos

- GIVEN an event exists but has no photos
- WHEN the visitor opens the event detail
- THEN the event renders without a photo gallery section

### Requirement: Admin Create Event

The system MUST allow an authenticated admin to create a new event with title, date, location, description, and cover image.

#### Scenario: Admin creates event successfully

- GIVEN an admin is logged in
- WHEN the admin fills in all required fields and submits
- THEN the event is saved and appears in the public events list

#### Scenario: Admin submits incomplete form

- GIVEN an admin is on the create event form
- WHEN the admin submits without filling required fields
- THEN validation errors are shown and the event is NOT saved

### Requirement: Admin Edit Event

The system MUST allow an authenticated admin to edit an existing event.

#### Scenario: Admin updates event

- GIVEN an admin is logged in and editing an event
- WHEN the admin changes the title and submits
- THEN the public event list reflects the updated title

### Requirement: Admin Delete Event

The system MUST allow an authenticated admin to delete an event.

#### Scenario: Admin deletes event

- GIVEN an admin is logged in
- WHEN the admin clicks delete and confirms
- THEN the event is removed from the public list

#### Scenario: Delete confirmation

- GIVEN an admin clicks delete
- WHEN the confirmation dialog appears
- THEN the event is NOT deleted until the admin confirms

### Requirement: Event Date Display

The system MUST display event dates in Costa Rica timezone (UTC-6).

#### Scenario: Date formatting

- GIVEN an event stored with UTC datetime
- WHEN displayed on the public page
- THEN the date shows in local Costa Rica format (e.g., "15 de Marzo, 2026")
