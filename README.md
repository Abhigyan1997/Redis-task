# 📝 Task Manager API

A RESTful API built with **Node.js, TypeScript, Express, MongoDB**, and **Redis** for managing tasks with user authentication and role-based access control.

---

## 🚀 Features
- ✅ Task CRUD operations
- 🔐 User authentication using JWT
- 👥 Role-based access (admin can delete)
- ⚡ Redis caching for task retrieval
- 🧰 MongoDB (via Mongoose) with TypeScript
- 🧪 Unit tests with Jest & Supertest
- 🐳 Docker support with `docker-compose`

---

## ⚙️ Setup Instructions

```bash
# Clone repo
git clone <your-repo>
cd task-manager-api

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Run locally
npm run dev


#Run on docker
docker-compose up --build


## 📌 API Endpoints

### Auth Routes
| Method | Endpoint        | Description         |
|--------|------------------|---------------------|
| POST   | `/auth/register` | Register user       |
| POST   | `/auth/login`    | Login and get token |

### Task Routes (Protected)
| Method | Endpoint             | Description                      |
|--------|--------------------- |----------------------------------|
| POST   | `/tasks/create_task` | Create a new task                |
| GET    | `/tasks/get_all_task`| Get all tasks                    |
| GET    | `/tasks/:id`         | Get task by ID                   |
| PUT    | `/update/tasks/:id`  | Update task                      |
| DELETE | `/delete/tasks/:id`  | Delete task (Admin only)         |

> Supports query params: `?status=pending&dueDate=2025-05-01`


## 🔑 Environment Variables

| Variable       | Description                        |
|----------------|------------------------------------|
| `PORT`         | Port number                        |
| `MONGO_URI`    | MongoDB connection string          |
| `JWT_SECRET`   | Secret key for JWT                 |


## 🧾 MongoDB Models

### User
```ts
{
  name: string;
  email: string;
  role: 'user' | 'admin';
}

{
  title: string;
  description: string;
  status: 'pending' | 'completed';
  dueDate: Date;
  assignedTo: ObjectId (ref: 'User');
}



---

### ✅ **4. Redis Caching Explanation**
As required in the assignment:

```markdown
## ⚡ Redis Caching

- `GET /tasks` response is cached for **1 minute**
- Cache is **invalidated** when:
  - A task is **created**
  - A task is **updated** or **deleted**


## 🌐 Deployment

This application is Dockerized using `Dockerfile` and `docker-compose.yml`, and can be easily deployed to a free-tier cloud provider like **Render**.

### Steps to Deploy on Render:

1. **Create a Render Account**: Sign up or log in to [Render](https://render.com).
   
2. **Create a New Web Service**:
   - Choose "New Web Service" from your Render dashboard.
   - Select **"Docker"** as the environment.
   - Connect your GitHub repository to Render (or push your code to a new repository if it's not already there).

3. **Configure Environment Variables**:
   - Set your environment variables such as `PORT`, `MONGO_URI`, `JWT_SECRET`, `REDIS_HOST`, and `REDIS_PORT` in Render's dashboard under the **Environment** tab.

4. **Configure Build and Run**:
   - Render will automatically detect the `Dockerfile` and `docker-compose.yml` in the root of your project.
   - Select the **Docker** option, and Render will build and deploy your container.

5. **Wait for Deployment**:
   - Render will handle the build and deployment. It should take a few minutes.

6. **Access Your Application**:
   - Once the deployment is successful, you will get a live URL from Render (e.g., `https://task-manager.onrender.com`).

### live link: 

https://redis-task.onrender.com
