Here is the updated version of the README with the correct formatting:

```markdown
# ElderLink  
**SC2006 Software Engineering Team 4**  
ElderLink is a web application designed to connect and engage elderly individuals through events, notifications, and a chatbot service. This project is developed as part of SC2006 Software Engineering Team 4.

---

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Scripts](#scripts)
- [API Endpoints](#api-endpoints)
- [License](#license)

---

## Features

- User authentication and authorization  
- Event creation and attendance tracking  
- Notifications for users  
- Location-based services with caching  
- Chatbot integration for user interaction  
- RESTful API for backend services  

---

## Technologies Used

### Frontend

- React  
- Vite  
- CSS  

### Backend

- Node.js  
- Express.js  
- MongoDB (via Mongoose)  
- WebSocket for real-time notifications  

---

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)  
- MongoDB  
- npm or yarn  

### Backend Setup

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `server` directory with the following variables:
   ```
   MONGODB_URI=<your-mongodb-uri>
   NODE_ENV=development
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `frontend` directory with the necessary environment variables (e.g., API base URL):
   ```
   VITE_API_BASE_URL=<your-api-base-url>
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

---

## Scripts

### Backend

- `npm start`: Start the backend server  
- `npm test`: Run backend tests  

### Frontend

- `npm run dev`: Start the frontend development server  
- `npm run build`: Build the frontend for production  

---

## API Endpoints

### Authentication

- `POST /api/auth`: User registration  
- `POST /api/login`: User login  

### Events

- `GET /api/events`: Fetch all events  
- `POST /api/events`: Create a new event  

### Notifications

- `GET /api/notifications`: Fetch user notifications  

### Chatbot

- `POST /api/chatbot`: Interact with the chatbot  

---

## License

*Specify your license here.*
```

This version includes the `.env` configuration with the placeholder `<your-api-base-url>`. Let me know if you need any more changes!
