# TripExplorer – Travel Experience Listing Platform

## Project Overview
TripExplorer is a simple full-stack web platform where experience providers can create and publish travel experiences for travelers to discover.

Users can register, log in, and create travel listings such as tours, activities, or experiences. These listings are displayed in a public feed where other users can explore them and view detailed information.

The platform works as a simplified **marketplace-style application** for sharing travel experiences.


## GitHub Repository
https://github.com/LahiruSWelagedara/TripExplorer

---

# Features Implemented

## User Authentication
Users can:
- Register a new account
- Log in securely
- Log out

After successful login, users are redirected to the **main feed page**.

Authentication is implemented using **JWT (JSON Web Tokens)**.

---

## Create Travel Experience Listing
Logged-in users can create travel listings with the following details:

- Experience Title
- Location
- Image URL
- Short Description
- Price (optional)

Example listing:

**Title:** Sunset Boat Tour  
**Location:** Bali  
**Description:** Enjoy a beautiful sunset while sailing along the coastline.  
**Price:** $45

---

## Public Feed
The main feed displays all travel listings created by users.

Each listing card shows:
- Image
- Title
- Location
- Short description
- Name of the user who created it
- Time posted

Listings appear from **newest to oldest**.

---

## Listing Detail Page
Users can click a listing to view full details including:

- Image
- Title
- Location
- Full description
- Price
- Creator name
- Posted time

---

# Optional Features (If Implemented)

- Edit listing
- Delete listing
- Search travel experiences
- Responsive UI
- Pagination / Infinite scroll

---

# Tech Stack

## Frontend
- Next.js
- React
- Tailwind CSS

## Backend
- Node.js
- Express.js

## Database
- MongoDB
- Mongoose

## Authentication
- JSON Web Tokens (JWT)

## Deployment
- Frontend: Vercel
- Backend: Render / Railway
- Database: MongoDB Atlas

---

# Architecture & Key Decisions

## Why this Technology Stack
The **MERN stack** (MongoDB, Express, React/Next.js, Node.js) was chosen because it allows building a full-stack JavaScript application with a unified language across the entire project.

Next.js was used for the frontend to improve performance and provide a better development experience.

---

## Authentication Implementation
Authentication is handled using **JWT (JSON Web Tokens)**.

Process:
1. User registers with email and password.
2. Passwords are securely hashed using **bcrypt**.
3. After login, the server generates a **JWT token**.
4. The token is stored on the client side and used to authenticate protected API requests.

---

## Database Design
Travel listings are stored in MongoDB using a **Listing schema**.

Example fields:
- title
- location
- description
- imageUrl
- price
- createdBy (user reference)
- createdAt

This structure allows linking each listing to the user who created it.

---

## Future Improvements
If more development time was available, the following improvements would be implemented:

- Image upload using **Cloudinary**
- Like or save travel experiences
- Advanced search and filtering
- Reviews and ratings for experiences
- Notification system
- Better mobile responsiveness

---


**If this platform had 10,000 travel listings, what changes would you make to improve performance and user experience?**

If the platform had 10,000 travel listings, I would introduce pagination or infinite scrolling to load listings gradually 
instead of displaying all listings at once. This would reduce page load time and improve performance. I would also implement 
search and filtering features so users can easily find listings by location, price, or keywords.

On the backend, I would add database indexing on frequently queried fields such as location, title, 
and createdAt to speed up search and sorting operations. To further improve performance, I would use 
caching strategies like Redis to store frequently accessed listings and reduce repeated database queries.
Additionally, I would optimize the API responses by limiting the amount of data returned and using pagination 
parameters such as limit and page. These improvements would ensure the platform remains fast, scalable, 
and user-friendly even with a large number of listings.
