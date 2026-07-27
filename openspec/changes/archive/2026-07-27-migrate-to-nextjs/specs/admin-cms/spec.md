# Admin CMS Specification

## Purpose

Content management system for admin users to manage gallery photos, YouTube videos, and events. All CMS routes are protected behind admin-auth.

## Requirements

### Requirement: Admin Dashboard

The system MUST provide a dashboard at `/admin` with navigation to gallery, videos, and events management.

#### Scenario: Dashboard renders

- GIVEN an authenticated admin navigates to `/admin`
- WHEN the page loads
- THEN a dashboard with links to manage gallery, videos, and events is displayed

### Requirement: Photo Upload

The system MUST allow admin to upload photos to the gallery.

#### Scenario: Admin uploads photo

- GIVEN the admin is on the gallery management page
- WHEN the admin selects an image file and confirms upload
- THEN the photo is stored and appears in the public gallery

#### Scenario: File size exceeds limit

- GIVEN the admin selects a file larger than the max size (5 MB)
- WHEN the admin attempts to upload
- THEN an error "Archivo demasiado grande (máx. 5 MB)" is shown and the upload does not proceed

#### Scenario: Invalid file type

- GIVEN the admin selects a non-image file (e.g., .pdf, .exe)
- WHEN the admin attempts to upload
- THEN an error "Solo se permiten imágenes (JPG, PNG, WebP)" is shown

### Requirement: Photo Delete

The system MUST allow admin to delete a photo from the gallery.

#### Scenario: Admin deletes photo

- GIVEN the admin is on the gallery management page
- WHEN the admin clicks delete on a photo and confirms
- THEN the photo is removed from storage and the public gallery

### Requirement: Video Management

The system MUST allow admin to add, edit, and delete YouTube video entries.

#### Scenario: Admin adds YouTube video

- GIVEN the admin is on the video management page
- WHEN the admin pastes a YouTube URL and saves
- THEN the video appears in the public video gallery with the embed

#### Scenario: Admin edits video title

- GIVEN a video entry exists
- WHEN the admin changes the title and saves
- THEN the public gallery reflects the new title

#### Scenario: Admin deletes video

- GIVEN a video entry exists
- WHEN the admin clicks delete and confirms
- THEN the video is removed from the public gallery

#### Scenario: Invalid YouTube URL

- GIVEN the admin pastes a non-YouTube URL
- WHEN the admin attempts to save
- THEN a validation error "URL de YouTube inválida" is shown

### Requirement: Event Management

The system MUST allow admin to create, edit, and delete events (see events spec for full CRUD).

#### Scenario: Admin manages events

- GIVEN the admin is on the events management page
- WHEN the admin creates, edits, or deletes events
- THEN changes are reflected in the public events list

### Requirement: Image Optimization

The system MUST optimize uploaded images (resize, compress to WebP) before storage.

#### Scenario: Uploaded image is optimized

- GIVEN the admin uploads a 4000x3000px JPEG (8 MB)
- WHEN the upload completes
- THEN the stored image is resized and compressed (WebP, reasonable dimensions for web)

### Requirement: CMS Mobile Responsiveness

The system MUST render CMS management pages correctly on tablet and desktop viewports.

#### Scenario: CMS on tablet

- GIVEN the admin opens the CMS on a 768px viewport
- WHEN the management page renders
- THEN all controls are accessible and forms are usable
