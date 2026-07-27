# Media Gallery Specification

## Purpose

Public photo and video gallery showcasing past events. Photos open in a lightbox; videos embed YouTube players.

## Requirements

### Requirement: Photo Grid Display

The system MUST display photos in a responsive grid layout.

#### Scenario: Gallery page loads with photos

- GIVEN photos exist in the database
- WHEN a visitor navigates to the gallery page
- THEN photos are displayed in a responsive grid (2–4 columns depending on viewport)

#### Scenario: No photos available

- GIVEN no photos exist in the database
- WHEN a visitor navigates to the gallery page
- THEN a placeholder message "No hay fotos disponibles" is displayed

### Requirement: Photo Lightbox

The system MUST open a full-screen lightbox when a visitor clicks/taps a photo.

#### Scenario: Lightbox opens on click

- GIVEN the photo grid is visible
- WHEN the visitor clicks a photo thumbnail
- THEN a lightbox overlay displays the full-resolution image

#### Scenario: Lightbox navigation

- GIVEN the lightbox is open on a photo
- WHEN the visitor swipes left/right or clicks navigation arrows
- THEN the next/previous photo is displayed in the lightbox

#### Scenario: Lightbox close

- GIVEN the lightbox is open
- WHEN the visitor clicks the close button or presses Escape
- THEN the lightbox closes and the grid is visible again

### Requirement: Video Gallery

The system MUST display embedded YouTube videos in a grid or list layout.

#### Scenario: Videos render with embeds

- GIVEN YouTube videos exist in the database
- WHEN a visitor navigates to the video section
- THEN each video is displayed as a YouTube embed player

#### Scenario: Invalid YouTube URL

- GIVEN a video entry has an invalid YouTube URL
- WHEN the video section renders
- THEN that entry is skipped without breaking the page layout

### Requirement: Lazy Loading

The system MUST lazy-load images and video embeds to optimize initial page load.

#### Scenario: Off-screen images not loaded immediately

- GIVEN the gallery page has 50+ photos
- WHEN the page loads
- THEN only above-the-fold images are fetched; below-the-fold images load on scroll

### Requirement: Mobile Responsiveness

The system MUST render the gallery correctly on mobile viewports.

#### Scenario: Touch-friendly lightbox

- GIVEN a mobile device
- WHEN the visitor opens the lightbox
- THEN swipe gestures navigate between photos
