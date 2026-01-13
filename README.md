# GigFlow

GigFlow is a mini freelance marketplace platform where clients post gigs and freelancers bid on them.
The project focuses on authentication, database relationships, and state handling.

## Key Features

- **Authentication**
   - Secure user registration & login
   - JWT-based authentication

- **Client** 
   - Create, update, delete gigs
   - View bids on their gigs
   - hire a freelancer for a gig

- **Freelancer** - 
   - Browse available gigs
   - Place bids on gigs
   - Track bid status (pending / accepted / rejected)

- **Core parts**
   - Users, Gigs, Bids relational mapping
   - Protected routes & authorization
   - Clean API structure

## Tech stack

- **Frontend**: React.js, Tailwind CSS, Framer Motion, Material UI 
- **Backend**: Node.js, Express.js
- **Database** - MongoDB 
- **Real Time Chat** - Socket.io
- **ODM** - Mongoose
- **Auth** - JSON Web Tokens, bcrypt

## Installation and setup

1. **Clone the repo**:

``` bash

git clone https://github.com/yashrai54/gigflow.git
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
