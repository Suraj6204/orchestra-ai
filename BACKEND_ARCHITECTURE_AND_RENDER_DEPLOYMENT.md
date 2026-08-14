# OrchestraAI Backend Architecture and Render Docker Deployment

## 1) Backend Architecture Overview

This project follows a microservice-style backend with a central API gateway and separate service modules for auth, chat, agent, billing, and shared infrastructure.

### High-level flow

- Frontend calls the gateway
- Gateway routes requests to the correct backend service
- Services use MongoDB, Redis, Firebase, Supabase, and external AI providers
- Agent service handles LLM workflows, file generation, and document/PPT/PDF generation

### Service breakdown

#### 1. Gateway

- Path: `backend/gateway/`
- Purpose: API entrypoint
- Port: `8000`
- Main responsibilities:
  - exposes public API routes
  - proxies requests to internal services
  - enforces auth middleware
  - handles CORS and cookies
- Key files:
  - `backend/gateway/index.js`
  - `backend/gateway/utils/proxyWithHeader.js`
  - `backend/gateway/middleware/auth.middleware.js`

#### 2. Auth Service

- Path: `backend/services/auth/`
- Purpose: login, logout, session user data, credits and user updates
- Port: `8001`
- Main responsibilities:
  - Firebase auth integration
  - user creation / retrieval
  - user payment / credit state updates
- Key files:
  - `backend/services/auth/index.js`
  - `backend/services/auth/controllers/auth.controller.js`
  - `backend/services/auth/config/firebase.js`

#### 3. Chat Service

- Path: `backend/services/chat/`
- Purpose: conversation and message persistence
- Port: `8002`
- Main responsibilities:
  - create conversations
  - fetch conversations and messages
  - save user/assistant messages
- Key files:
  - `backend/services/chat/index.js`
  - `backend/services/chat/controllers/chat.controller.js`

#### 4. Agent Service

- Path: `backend/services/agent/`
- Purpose: LLM-powered agent workflows
- Port: `8003`
- Main responsibilities:
  - chat agent
  - search agent
  - coding agent
  - PDF creation
  - PPT generation
  - image analysis / vision workflows
  - file uploads to Supabase storage
- Key files:
  - `backend/services/agent/index.js`
  - `backend/services/agent/graph/graph.js`
  - `backend/services/agent/controllers/agent.controller.js`
  - `backend/services/agent/agents/*.js`

#### 5. Billing Service

- Path: `backend/services/billing/`
- Purpose: subscription / payment handling
- Port: `8004`
- Main responsibilities:
  - create Razorpay orders
  - verify payment
  - update user plan / payment records
- Key files:
  - `backend/services/billing/index.js`
  - `backend/services/billing/controllers/billing.controller.js`
  - `backend/services/billing/config/razorpay.js`

#### 6. Shared Infrastructure

##### Redis

- Used for: rate limiting, session/state, agent usage tracking
- Local port: `6379`
- File: `backend/shared/redis/redis.js`

##### MongoDB

- Each service connects to MongoDB independently using its own config files under each service’s `config/` folder.
- Used for service-level persistence (users, chats, payments, etc.)

##### Supabase Storage

- Used for generated artifacts like PDFs and PPT files
- Configured via `backend/services/agent/config/s3.js`

##### Firebase

- Used for authentication in auth service
- Configured via `backend/services/auth/config/firebase.js`

---

## 2) Port Summary

| Service | Path                        | Port |
| ------- | --------------------------- | ---: |
| Gateway | `backend/gateway/`          | 8000 |
| Auth    | `backend/services/auth/`    | 8001 |
| Chat    | `backend/services/chat/`    | 8002 |
| Agent   | `backend/services/agent/`   | 8003 |
| Billing | `backend/services/billing/` | 8004 |
| Redis   | shared infrastructure       | 6379 |

### Local gateway routing

The gateway proxies requests to services using environment variables like:

- `AUTH_SERVICE`
- `CHAT_SERVICE`
- `AGENT_SERVICE`
- `BILLING_SERVICE`

Example pattern in `backend/gateway/index.js`:

```js
app.use("/api/auth", proxy(process.env.AUTH_SERVICE));
app.use("/api/chat", protect, proxyWithHeader(process.env.CHAT_SERVICE));
appp.use("/api/agent", protect, proxyWithHeader(process.env.AGENT_SERVICE));
app.use("/api/billing", protect, proxyWithHeader(process.env.BILLING_SERVICE));
```

---

## 3) Local Docker Setup

The project already contains Docker support.

### Current local compose setup

File: `backend/docker-compose.yml`

```yaml
services:
  redis:
    image: redis
    ports:
      - 6379:6379
```

This shows Redis is containerized locally, while the Node microservices are designed to run as separate Docker services in deployment environments like Render.

---

## 4) Render Deployment Strategy (Microservice Docker)

For Render, the best deployment pattern is to run each backend service as its own Web Service using Docker.

### Recommended Render services

1. `orchestraai-gateway`
   - Dockerfile: `backend/gateway/Dockerfile`
   - Port env: `PORT=8000`

2. `orchestraai-auth`
   - Dockerfile: `backend/services/auth/Dockerfile`
   - Port env: `PORT=8001`

3. `orchestraai-chat`
   - Dockerfile: `backend/services/chat/Dockerfile`
   - Port env: `PORT=8002`

4. `orchestraai-agent`
   - Dockerfile: `backend/services/agent/Dockerfile`
   - Port env: `PORT=8003`

5. `orchestraai-billing`
   - Dockerfile: `backend/services/billing/Dockerfile`
   - Port env: `PORT=8004`

6. `orchestraai-redis` (optional)
   - Use Render’s managed Redis add-on or a standalone Redis service

---

## 5) Render Docker Deployment Steps

### Step 1: Prepare each service for Docker

Each service already has a `Dockerfile` in its folder.

Example structure:

```text
backend/
  gateway/
    Dockerfile
  services/
    auth/
      Dockerfile
    chat/
      Dockerfile
    agent/
      Dockerfile
    billing/
      Dockerfile
```

### Step 2: Create a Render Web Service for each backend

For each service:

- Go to Render Dashboard
- Click `New` -> `Web Service`
- Connect your GitHub repo
- Select the service folder or use a monorepo approach
- Set the Dockerfile path for that service
- Set the `PORT` environment variable to the correct value

### Step 3: Set environment variables

For each service, add required runtime env vars.

#### Gateway env vars

```env
PORT=8000
FRONTEND_URL=https://your-frontend-url
AUTH_SERVICE=http://your-auth-service-url:8001
CHAT_SERVICE=http://your-chat-service-url:8002
AGENT_SERVICE=http://your-agent-service-url:8003
BILLING_SERVICE=http://your-billing-service-url:8004
```

#### Auth env vars

```env
PORT=8001
MONGODB_URI=your_mongo_connection_string
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...
JWT_SECRET=...
```

#### Chat env vars

```env
PORT=8002
MONGODB_URI=your_mongo_connection_string
```

#### Agent env vars

```env
PORT=8003
MONGODB_URI=your_mongo_connection_string
SUPABASE_URL=...
SUPABASE_SECRET_KEY=...
SUPABASE_BUCKET_NAME=...
REDIS_URL=...
GROQ_API_KEY=...
GOOGLE_API_KEY=...
OPENROUTER_API_KEY=...
TAVILY_API_KEY=...
```

#### Billing env vars

```env
PORT=8004
MONGODB_URI=your_mongo_connection_string
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
```

### Step 4: Use private/internal service URLs on Render

Render services usually need to talk to each other over their internal service URLs or public URLs depending on your setup.

Recommended pattern:

- Frontend uses the public gateway URL
- Gateway uses the public URLs of the downstream services or Render internal networking
- Each service must know the correct base URLs for its dependencies

### Step 5: Deploy Redis

If you do not use Render managed Redis, you can deploy Redis as its own service or use a managed Redis instance.

Recommended Redis env var:

```env
REDIS_URL=redis://:password@host:port
```

---

## 6) Dockerfile Pattern for Render

Each microservice uses a Node base image and runs on the service port environment variable.

Example pattern:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8000
CMD ["npm", "start"]
```

The important part is that the app listens on `process.env.PORT`, not a hardcoded port.

---

## 7) Production Notes

- Keep all services independent so they can scale independently
- Use environment variables for all secrets and config
- Use a managed Redis service for reliability
- Keep the gateway as the public entrypoint for frontend traffic
- Ensure each service can run on its own Docker container with the correct port
- Add health checks for better Render monitoring

---

## 8) Recommended Production Architecture

```text
Frontend (Vite app)
    |
    v
Gateway (Render Web Service, port 8000)
    |---> Auth Service (port 8001)
    |---> Chat Service (port 8002)
    |---> Agent Service (port 8003)
    |---> Billing Service (port 8004)
    |
    +---> Redis
    +---> MongoDB
    +---> Supabase Storage
    +---> Firebase Auth
```

---

## 9) Summary

This project is a clean microservice backend with:

- 1 API gateway on port `8000`
- 1 auth service on port `8001`
- 1 chat service on port `8002`
- 1 agent service on port `8003`
- 1 billing service on port `8004`
- shared Redis on port `6379` locally

The most practical Render deployment is to run each service as its own Dockerized web service and connect them through environment variables and public/internal service URLs.
