# Backend Implementation Plan for ElderLink Application

## Overview

This document outlines the implementation plan for the backend of the ElderLink application based on the provided diagrams. The plan follows MVC (Model-View-Controller) architecture and adheres to OOP principles.

## Models (Data Layer)

### 1. User Model
- [x] Basic schema with username, name, passwordHash
- [ ] Add fields for profile information
- [ ] Add references to eventsCreated and eventsAttending
- [ ] Add validation for required fields
- [ ] Add toJSON transform method
- [ ] Add timestamps for creation/update

### 2. Event Model
- [x] Basic schema with title, dateTime, location, description, numAttendees
- [x] Add createdBy reference to User model
- [x] Add attendees array reference to User model
- [ ] Add validation for required fields
- [ ] Add location coordinates for map display
- [ ] Add timestamps for creation/update
- [ ] Add status field (active, cancelled, completed)

## Controllers (Business Logic)

### 1. Authentication Controller (auth.js)
- [x] Handle login functionality 
- [ ] Handle registration functionality
- [ ] Implement JWT token generation
- [ ] Add token validation middleware
- [ ] Add user extraction middleware
- [ ] Add password hashing with bcrypt
- [ ] Add proper error handling for auth failures

### 2. Users Controller (users.js)
- [ ] Implement user creation (registration)
- [ ] Implement get all users functionality
- [ ] Implement get user by ID functionality
- [ ] Implement update user profile
- [ ] Implement delete user (with cascade delete of associated events)
- [ ] Add proper authorization checks for user operations

### 3. Events Controller (events.js)
- [x] Implement get all events
- [x] Implement get event by ID
- [ ] Implement create event functionality
- [ ] Implement update event functionality
- [ ] Implement delete event functionality
- [ ] Add filtering options (by date, location, etc.)
- [ ] Add pagination for large result sets
- [ ] Add search functionality
- [ ] Add proper authorization checks (only creators can edit/delete)

### 4. Events Attendance Controller (eventsAttendance.js)
- [ ] Implement RSVP (join event) functionality
- [ ] Implement withdraw from event functionality
- [ ] Implement get attendees for an event
- [ ] Implement get events a user is attending
- [ ] Add capacity checks (prevent joining full events)
- [ ] Add proper authorization checks
- [ ] Add notification hooks for attendance changes

### 5. Locations Controller (locations.js)
- [ ] Implement get locations functionality
- [ ] Implement integrate with Community Clubs API
- [ ] Add caching for external API responses
- [ ] Add error handling for external API failures

### 6. Maps Controller (maps.js)
- [ ] Implement show event on map functionality
- [ ] Integrate with OneMap API
- [ ] Add geocoding functionality (convert address to coordinates)
- [ ] Add error handling for external API failures

## Routes (Views in MVC terminology)

### 1. Authentication Routes (login.js)
- [x] POST /api/login - User login
- [ ] POST /api/register - User registration

### 2. User Routes (users.js)
- [ ] GET /api/users - Get all users
- [ ] GET /api/users/:id - Get user by ID
- [ ] PUT /api/users/:id - Update user profile
- [ ] DELETE /api/users/:id - Delete user

### 3. Event Routes (events.js)
- [x] GET /api/events - Get all events
- [x] GET /api/events/:id - Get event by ID
- [ ] POST /api/events - Create new event
- [ ] PUT /api/events/:id - Update event
- [ ] DELETE /api/events/:id - Delete event
- [ ] GET /api/events/search - Search events

### 4. Event Attendance Routes (eventsAttendance.js)
- [ ] POST /api/events/:id/attend - Join an event
- [ ] DELETE /api/events/:id/attend - Withdraw from event
- [ ] GET /api/events/:id/attendees - Get all attendees for an event
- [ ] GET /api/users/:id/attending - Get all events a user is attending

### 5. Location Routes (locations.js)
- [ ] GET /api/locations - Get available event locations

### 6. Map Routes (maps.js)
- [ ] GET /api/maps/event/:id - Get map details for an event

## Middleware

### 1. Authentication Middleware
- [x] Token extraction middleware
- [x] User extraction middleware
- [ ] Role-based access control

### 2. Error Handling Middleware
- [ ] Global error handler
- [ ] API error response formatter
- [ ] Validation error handler

### 3. Logging Middleware
- [x] Request logging middleware
- [ ] Error logging middleware

## External API Integration

### 1. Community Clubs API Integration
- [ ] Create service for API interaction
- [ ] Add caching layer
- [ ] Add error handling and fallbacks

### 2. OneMap API Integration
- [ ] Create service for API interaction
- [ ] Add geocoding functionality
- [ ] Add reverse geocoding functionality
- [ ] Add error handling and fallbacks

## Implementation Order

1. **Core Authentication System** (Priority: High)
   - Complete login functionality
   - Implement registration
   - Set up JWT token system

2. **User Management** (Priority: High)
   - Complete CRUD operations for users
   - Implement profile management

3. **Event Management** (Priority: High)
   - Complete CRUD operations for events
   - Implement search and filtering

4. **Event Attendance** (Priority: Medium)
   - Implement join/withdraw functionality
   - Implement attendee management

5. **Location Services** (Priority: Medium)
   - Integrate with Community Clubs API
   - Implement location management

6. **Map Integration** (Priority: Low)
   - Integrate with OneMap API
   - Implement map visualization services

## Notes on Architecture and Design Principles

Based on the provided diagrams, I've made the following adjustments to better align with OOP and software design principles:

1. **Separation of Concerns**: 
   - Created separate controllers for different domains (events, users, attendance)
   - Each controller has clear, focused responsibilities

2. **Single Responsibility Principle**:
   - Events controller handles only event CRUD operations
   - Separate attendance controller for join/withdraw functionality

3. **DRY (Don't Repeat Yourself)**:
   - Common middleware extracted for reuse
   - Authentication logic centralized

4. **RESTful API Design**:
   - Resource-based URL structure
   - Proper HTTP methods (GET, POST, PUT, DELETE)
   - Consistent response formats

5. **Error Handling**:
   - Centralized error handling middleware
   - Consistent error response format

The diagrams provide a good foundation, but I've added some additional components to ensure a robust, maintainable backend system that follows best practices for Node.js/Express applications.
