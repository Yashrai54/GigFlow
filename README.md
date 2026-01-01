# QuickGig

QuickGig is a hyper-local freelancing marketplace designed to connect individuals within a 5km radius. Unlike traditional platforms, QuickGig removes the barrier of "roles"—every user can be both a seeker and a provider. It focuses on proximity, privacy (anonymous chat), and a modern, fluid user experience.

## Key Features

- **Hyper-Local Discovery**: Uses MongoDB Geospatial indexing to fetch projects exclusively within a 5km radius of the user's current location.

- **Unified User roles** : A seamless "One-Platform" approach where any user can post a project or bid on one without switching account types.

- **Real time anonymous chat** - Integrated Socket.io communication for every project, allowing users to discuss details privately and securely.

- **Dynamic UI/UX**: Built with Framer Motion for smooth transitions, Tailwind CSS for modern styling, and Material UI (MUI) for professional navigation components.

- **Secure Authentication**: Full-stack security using JSON Web Tokens (JWT) for protected API routes and user sessions.

## Tech stack

- **Frontend**: React.js, Tailwind CSS, Framer Motion, Material UI 
- **Backend**: Node.js, Express.js
- **Database** - MongoDB 
- **Real Time Chat** - Socket.io
- **Auth** - JSON Web Tokens

## Technical Challenges

### Geolocation Engine
The most challenging aspect was implementing the Proximity Logic. Instead of calculating distances on the frontend, I utilized MongoDB's $near operator and 2dsphere indexing. This ensures that the application is performant and only fetches relevant data from the database based on longitude and latitude coordinates.

### Fluid Animations
To elevate the "Resume Showcase" quality, I focused heavily on the frontend. Using Framer Motion, I implemented staggered list animations and layout transitions that make the app feel like a native mobile experience.

## Installation and setup

1. **Clone the repo**:

``` bash

git clone https://github.com/yashrai54/quickgig.git
```
2. **Install Dependencies**:

``` bash
# For Backend
cd backend && npm install
# For Frontend
cd frontend && npm install

```
3. **Environment Variables**

Create a .env file in the root directory and add:
``` bash
MONGO_URI
JWT_SECRET
```
4. **Run the app**

``` bash
# For backend
nodemon server.js
# For frontend
npm run dev
```
