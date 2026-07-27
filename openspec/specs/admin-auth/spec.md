# Admin Auth Specification

## Purpose

Authentication system for admin users (José + papá). Email + password via Supabase Auth. No client login, no social OAuth.

## Requirements

### Requirement: Login Page

The system MUST provide a login page at `/admin/login` with email and password fields.

#### Scenario: Login page renders

- GIVEN a user navigates to `/admin/login`
- WHEN the page loads
- THEN email and password fields and a "Iniciar sesión" button are displayed

### Requirement: Successful Login

The system MUST authenticate valid admin credentials and redirect to the admin dashboard.

#### Scenario: Valid credentials

- GIVEN the user is on the login page
- WHEN the user enters valid admin email and password and submits
- THEN the user is redirected to `/admin` (dashboard) and a session is established

#### Scenario: Invalid credentials

- GIVEN the user is on the login page
- WHEN the user enters an invalid email or password
- THEN an error message "Credenciales inválidas" is displayed and the user remains on the login page

### Requirement: Protected Routes

The system MUST redirect unauthenticated users to the login page when accessing admin routes.

#### Scenario: Unauthenticated access to admin

- GIVEN the user is NOT logged in
- WHEN the user navigates to `/admin` or any `/admin/*` route
- THEN the user is redirected to `/admin/login`

#### Scenario: Authenticated access to admin

- GIVEN the user IS logged in with a valid session
- WHEN the user navigates to `/admin`
- THEN the admin dashboard renders normally

### Requirement: Session Management

The system MUST maintain the user session across page navigations and browser refreshes.

#### Scenario: Session persists on refresh

- GIVEN the user is logged in
- WHEN the user refreshes the browser
- THEN the session remains active and the user stays on the admin page

#### Scenario: Session expiration

- GIVEN the user's session has expired
- WHEN the user attempts to access an admin route
- THEN the user is redirected to `/admin/login`

### Requirement: Logout

The system MUST provide a logout action that ends the session.

#### Scenario: User logs out

- GIVEN the user is logged in
- WHEN the user clicks "Cerrar sesión"
- THEN the session is destroyed and the user is redirected to the login page

### Requirement: No Client Registration

The system MUST NOT expose any registration or sign-up functionality.

#### Scenario: No registration page

- GIVEN any URL on the site
- WHEN the URL is accessed
- THEN no registration or sign-up page exists at any route

#### Scenario: Only pre-created users can log in

- GIVEN no self-registration is available
- WHEN a non-admin email attempts to log in
- THEN login fails with "Credenciales inválidas"

### Requirement: Rate Limiting

The system SHOULD limit login attempts to prevent brute-force attacks.

#### Scenario: Too many failed attempts

- GIVEN a user has failed login 5+ times in 15 minutes
- WHEN another login attempt is made
- THEN a rate-limit error is displayed: "Demasiados intentos. Espere unos minutos."
