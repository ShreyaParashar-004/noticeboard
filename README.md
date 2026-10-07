# Noticeboard

A small private web app for sharing things with your favorite people.

Noticeboard started as a curiosity project. I wanted to understand what actually goes into building a complete web application rather than only working on isolated frontend or backend pieces.

It grew into a full-stack application with a React frontend, FastAPI backend, PostgreSQL database, file storage, authentication, access control, and cloud deployment.

The idea is simple: give a small group of people a shared digital noticeboard where they can post things, collect photos, share links, make polls, and keep little pieces of their lives in one place.

> A personal learning project built to explore full-stack development end to end.

---

## What is Noticeboard?

Noticeboard is organized around **circles** — private spaces for groups of people.

Each circle has its own members, content, and permissions.

### Board

The main shared space for everyday information.

* Posts and comments
* Polls
* Shared links and resources

### Album

A more visual space for things worth keeping.

* Photos
* Song links
* Moodboards
* Image collections

### Members

The people who belong to the circle.

Membership and permissions are managed at the circle level, with separate roles for administrators and members.

---

## Why I built it

This project was primarily driven by curiosity.

I wanted to understand how the different parts of a real web application fit together:

* How does a frontend communicate with a backend?
* How are API routes structured?
* How does a relational database fit into an application?
* How do users and memberships work?
* How should access control be handled?
* How are uploaded files stored?
* What changes when an application moves from `localhost` to the internet?
* How do the frontend, backend, database, and deployment environments interact?

Rather than building something purely around a technical checklist, I wanted to make something I would actually enjoy using.

That is how Noticeboard came about.

---

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* CSS

### Backend

* Python
* FastAPI
* SQLAlchemy
* Pydantic
* Uvicorn

### Database & Storage

* PostgreSQL
* Supabase
* Supabase Storage

### Deployment

* Vercel — frontend
* Railway — backend
* Supabase — database and storage

### Development

* Git
* GitHub
* VS Code / Cursor

---

## Architecture

Noticeboard follows a client-server architecture:

```text
                    ┌─────────────────────┐
                    │       Browser       │
                    │    React + Vite     │
                    └──────────┬──────────┘
                               │
                               │ HTTP API
                               ▼
                    ┌─────────────────────┐
                    │       FastAPI       │
                    │       Backend       │
                    └──────────┬──────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
                    ▼                     ▼
          ┌──────────────────┐   ┌──────────────────┐
          │    PostgreSQL    │   │ Supabase Storage │
          │     Database     │   │ Uploaded images  │
          └──────────────────┘   └──────────────────┘
```

The React frontend communicates with the FastAPI backend through HTTP requests. The backend handles application logic and database access, while Supabase provides the PostgreSQL database and persistent file storage.

The frontend does not directly query the application's database.

---

## Features

### Authentication

Users can create accounts and sign in to access their circles.

### Circles

Users can create private circles and invite other people using an invite code.

Circle membership has its own role:

* **Admin** — manages the circle and its content
* **Member** — participates in the circle

Membership requests are handled through the circle rather than being treated as a global user permission.

### Posts & Comments

Admins can create and manage posts within a circle.

Members can interact with posts through comments.

Posts are intentionally simple, the goal is to provide useful information without turning the application into a conventional social media feed.

### Polls

Create polls with multiple options and allow members of a circle to vote.

### Album

The Album provides a more visual collection for a circle.

It supports:

* Uploaded photos
* Song links from external platforms

### Moodboards

Create visual collections from uploaded images.

Moodboards are intended for collecting references, inspiration, photographs, or anything else that works better visually than as a traditional post.

### Links

Share external resources with the rest of the circle without needing to host the original content.

---

## Access Control

Because Noticeboard is built around private circles, access control is handled as part of the application rather than relying only on frontend visibility.

A user's membership is associated with a specific circle, and permissions are checked by the backend for circle-specific operations.

This means a user can have different roles in different circles rather than having one global role across the entire application.

One of the things I wanted to understand through this project was the difference between:

* what the frontend displays
* what the backend allows
* what the database stores

---

## File Uploads

Noticeboard supports uploading images directly from a user's device.

Uploaded images are used for features such as:

* Album photos
* Moodboards

Supabase Storage is used for persistent file storage rather than keeping uploaded files inside the application server.

---

## Project Structure

The repository is split into separate frontend and backend applications:

```text
noticeboard/
│
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── model.py
│   ├── schema.py
│   ├── routers/
│   │   ├── users.py
│   │   ├── posts.py
│   │   ├── comments.py
│   │   ├── circles.py
│   │   ├── polls.py
│   │   ├── moodboard.py
│   │   ├── links.py
│   │   └── ...
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
└── README.md
```

The structure may change as the project evolves.

---

## Running Locally

The frontend and backend can be run as separate services during local development.

The backend runs on:

```text
http://127.0.0.1:8000
```

The frontend runs on:

```text
http://localhost:5173
```

The frontend communicates with the FastAPI backend through the configured API URL.

---

## Environment Variables

The application uses environment-specific configuration for the database, Supabase, storage, and frontend API URL.

These values are kept outside the repository and configured separately for local development and deployment.

---

## What I Explored

Building Noticeboard gave me hands-on experience across several parts of full-stack development:

### Frontend

* React component structure
* TypeScript
* Application state
* API integration
* File upload interfaces
* Responsive UI

### Backend

* FastAPI routing
* REST APIs
* Request and response schemas
* Authentication
* Authorization
* Circle-level access control
* File upload handling

### Database

* PostgreSQL
* SQLAlchemy ORM
* Relational data modelling
* Users, circles, and memberships
* Foreign-key relationships
* Database schema changes

### Deployment & Integration

* Environment configuration
* CORS and cross-origin communication
* Deploying frontend and backend separately
* Connecting a deployed backend to a hosted database
* Debugging issues across multiple services

### Storage

* Supabase Storage
* Persistent uploaded files
* Connecting uploaded media to application data

The main thing I gained from the project was an understanding of how these pieces fit together into one working application.

---

## Project Status

Noticeboard is a functional personal project that is currently deployed and used as a small private space for testing with friends.

It is intentionally not trying to be a large social platform or a production-scale collaboration tool.

The project is primarily a way for me to keep learning, experiment with full-stack development, and build features that I actually have a reason to use.

---

## A Note on the Project

Noticeboard is intentionally personal.

It started with a simple idea.

The technical scope grew from there, but the original idea stayed the same, build something fun, learn how it works, and see if I could make the whole thing come together.
