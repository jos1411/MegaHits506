# Radio Streaming Specification

## Purpose

Live radio streaming feature embedded in the website. Streams audio from AzuraCast/Icecast on a VPS. Includes a persistent player widget.

## Requirements

### Requirement: Radio Player Widget

The system MUST display a radio player widget with play/pause controls and current track info.

#### Scenario: Player renders on page load

- GIVEN the radio stream is configured and online
- WHEN the visitor loads any page
- THEN a radio player widget is visible with play button, station name, and current track info

#### Scenario: Stream offline

- GIVEN the radio stream is offline or unreachable
- WHEN the visitor loads the page
- THEN the player shows a "Fuera de línea" status and the play button is disabled

### Requirement: Play and Pause

The system MUST allow the visitor to play and pause the live stream.

#### Scenario: Play stream

- GIVEN the player is in paused state
- WHEN the visitor clicks play
- THEN audio begins streaming within 5 seconds

#### Scenario: Pause stream

- GIVEN the stream is playing
- WHEN the visitor clicks pause
- THEN audio stops immediately

### Requirement: Persistent Player Across Navigation

The system MUST keep the player playing when the visitor navigates between pages.

#### Scenario: Player survives page navigation

- GIVEN the stream is playing
- WHEN the visitor navigates to a different page
- THEN the audio continues without interruption and the player widget remains visible

### Requirement: Now Playing Info

The system MUST display the current track/artist from the stream metadata.

#### Scenario: Now playing updates

- GIVEN the stream is playing and the DJ changes the track
- WHEN the AzuraCast API returns updated metadata
- THEN the player widget updates to show the new track/artist within 15 seconds

#### Scenario: No metadata available

- GIVEN the stream is playing but no metadata is available
- WHEN the player renders
- THEN the player shows "En vivo" as fallback text

### Requirement: Volume Control

The system SHOULD provide a volume slider for the player.

#### Scenario: Volume adjustment

- GIVEN the stream is playing
- WHEN the visitor adjusts the volume slider
- THEN the audio volume changes accordingly

### Requirement: Mobile Player

The system MUST render the player widget correctly on mobile viewports.

#### Scenario: Mobile player layout

- GIVEN a mobile viewport
- WHEN the page loads with the radio player
- THEN the player is visible, compact, and controls are tappable

### Requirement: Graceful Degradation

The system MUST NOT break the page if the radio stream is unavailable.

#### Scenario: Stream URL unreachable

- GIVEN the stream URL returns an error
- WHEN the page loads
- THEN the page renders normally; the player shows offline status without JavaScript errors
