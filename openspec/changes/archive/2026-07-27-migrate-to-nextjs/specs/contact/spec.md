# Contact Specification

## Purpose

Static contact section that directs visitors to WhatsApp. No backend, no forms — pure deep-link to WhatsApp conversation.

## Requirements

### Requirement: WhatsApp Contact Button

The system MUST display a prominent WhatsApp contact button with the business phone number.

#### Scenario: Contact section renders

- GIVEN the visitor navigates to the contact section or page
- WHEN the page loads
- THEN a WhatsApp button is visible with the configured business phone number

#### Scenario: WhatsApp button click

- GIVEN the WhatsApp button is visible
- WHEN the visitor clicks it
- THEN `https://wa.me/<phone-number>` opens in a new tab with the pre-filled message

### Requirement: Pre-filled WhatsApp Message

The system MUST include a default pre-filled message in the WhatsApp deep link.

#### Scenario: Pre-filled message content

- GIVEN the visitor clicks the WhatsApp button
- WHEN WhatsApp opens
- THEN the message field contains "Hola, me interesa contratar los servicios de Mega Hits 506"

### Requirement: Contact Information Display

The system MUST display the business location (Pérez Zeledón, Costa Rica) and service hours.

#### Scenario: Contact info visible

- GIVEN the contact section renders
- WHEN the visitor views it
- THEN location and service hours are displayed

### Requirement: Floating WhatsApp Button

The system MAY display a floating WhatsApp button visible on all pages.

#### Scenario: Floating button on all pages

- GIVEN the visitor is on any page
- WHEN the page loads
- THEN a fixed-position WhatsApp icon is visible in the bottom-right corner

#### Scenario: Floating button click

- GIVEN the floating button is visible
- WHEN the visitor clicks it
- THEN the same WhatsApp deep link opens as the contact section button

### Requirement: No Form Submission

The system MUST NOT include any contact form that submits data to a backend.

#### Scenario: No form exists

- GIVEN the contact page
- WHEN the DOM is inspected
- THEN no `<form>` element with a submit action to a backend endpoint exists
