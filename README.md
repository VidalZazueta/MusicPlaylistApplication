# Music Playlist Application

A full-stack web application that lets users create and manage personal music playlists, search for tracks, and explore music trends — all powered by the [Last.fm API](https://www.last.fm/api).

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, React Router v7 |
| Backend | Node.js, Express 5 |
| Database | MongoDB (Mongoose) |
| Auth | JWT, bcrypt |
| Music Data | Last.fm API |

---

## Features

- **User Authentication** — Register and log in with a username and password. Passwords are hashed with bcrypt and sessions are managed via JWTs.
- **Playlist Management** — Create, view, and delete personal playlists.
- **Track Search** — Search for songs by name using the Last.fm API and add them to any playlist.
- **Track Details** — View album art, artist, and album info for any track in a playlist.
- **Top Charts** — Browse the top 10 globally trending tracks and artists from Last.fm.
- **Similar Music** — Discover similar tracks and artists based on what you're listening to.
- **Protected Routes** — Dashboard and playlist pages require authentication; unauthenticated users are redirected to login.

---

## Project Structure

```
MusicPlaylistApplication/
├── frontend/                        # React + Vite SPA
│   └── src/
│       ├── components/
│       │   ├── AuthForm/
│       │   ├── CreatePlaylistForm/
│       │   ├── ErrorMessage/
│       │   ├── PlaylistCard/
│       │   ├── PlaylistList/
│       │   ├── ProfileIcon/
│       │   ├── SearchBar/
│       │   ├── SimilarTracksAndArtists/
│       │   └── TopTracksAndArtists/
│       ├── pages/
│       │   ├── DashboardPage/
│       │   ├── LoginPage/
│       │   ├── PlaylistDetailPage/
│       │   └── RegisterPage/
│       ├── router/
│       │   ├── AppRouter.jsx        # Route definitions
│       │   └── ProtectedRoute.jsx   # Auth guard
│       └── services/
│           ├── authService.js
│           ├── lastFmService.js
│           ├── playlistService.js
│           └── trackService.js
│
└── backend/                         # Node.js + Express REST API
    ├── app.js                       # Server entry point
    ├── api/
    │   ├── middleware/
    │   │   └── authorization.js     # JWT verification middleware
    │   ├── models/
    │   │   ├── playlists.js
    │   │   └── users.js
    │   ├── routes/
    │   │   ├── lastfm.js            # Last.fm proxy routes
    │   │   ├── playlists.js
    │   │   ├── tracks.js
    │   │   └── users.js
    │   └── util/
    │       └── auth.js              # JWT + bcrypt helpers
    └── db/
        └── connections.js           # MongoDB connection
```

---

## API Routes

### Users
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/users/register` | Public | Register a new user |
| POST | `/users/login` | Public | Log in and receive a JWT |
| GET | `/users/:id` | Protected | Get the authenticated user's profile |

### Playlists
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/playlists` | Protected | Get all playlists for the logged-in user |
| POST | `/playlists` | Protected | Create a new playlist |
| GET | `/playlists/:id` | Protected | Get a single playlist by ID |
| PUT | `/playlists/:id` | Protected | Add a track to a playlist |
| DELETE | `/playlists/:id` | Protected | Delete a playlist |

### Tracks
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/tracks/search?track=` | Protected | Search for tracks via Last.fm |
| GET | `/tracks/:mbid` | Protected | Get details for a single track |

### Last.fm
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/lastfm/top-tracks` | Public | Top 10 globally trending tracks |
| GET | `/lastfm/top-artists` | Public | Top 10 globally trending artists |
| GET | `/lastfm/similar-tracks?track=&artist=` | Public | Tracks similar to a given track |
| GET | `/lastfm/similar-artists?artist=` | Public | Artists similar to a given artist |

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (or a local MongoDB instance)
- A [Last.fm API key](https://www.last.fm/api/account/create)

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
LASTFM_API_KEY=your_lastfm_api_key
JWT_SECRET=your_jwt_secret

# MongoDB Atlas credentials
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_URL=your_cluster.mongodb.net
DB_NAME=your_database_name

# Or provide a full URI directly (overrides the individual vars above)
# MONGO_URI=mongodb+srv://...
```

Start the backend server (runs on port `8888`):

```bash
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and expects the backend at `http://localhost:8888`.

---

## Pages

| Route | Page | Access |
|---|---|---|
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/dashboard` | Dashboard (playlists + charts) | Protected |
| `/playlists/:id` | Playlist detail + track search | Protected |
