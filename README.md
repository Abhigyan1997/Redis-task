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

## ⚡ Redis Caching

This application utilizes **Redis** for caching the result of the `GET /tasks` endpoint to improve performance and reduce database load. Here's how the caching mechanism works:

- **Cache Duration**: The response of the `GET /tasks` endpoint is cached for **1 minute**. This ensures that repeated requests within this time frame are served faster, reducing database load.
  
- **Cache Invalidation**:
  - The cache is **invalidated** whenever:
    - A **new task** is created via the `POST /tasks` endpoint.
    - An **existing task** is updated via the `PUT /tasks/:id` endpoint.
    - A **task is deleted** via the `DELETE /tasks/:id` endpoint.

### How Redis was Added using Upstash:

1. **Upstash Setup**:
   - I signed up on **[Upstash](https://upstash.com/)**, a serverless Redis provider, which is ideal for this project as it doesn’t require managing Redis infrastructure.
   - After logging in, I created a new Redis database on Upstash, which provided me with the necessary connection details such as the **URL** and **Password**.

2. **Integration with the Application**:
   - I installed the Redis client package using:
     ```bash
     npm install redis
     ```
   - In the application, I configured Redis using the Upstash connection details. Here’s how the connection was set up in the `redis.ts` file:
     ```typescript
     import { createClient } from 'redis';

     const redisClient = createClient({
       url: `redis://default:${process.env.REDIS_PASSWORD}@${process.env.REDIS_URL}`,
     });

     redisClient.connect();

     redisClient.on('connect', () => {
       console.log('Connected to Redis');
     });
     redisClient.on('error', (err) => {
       console.error('Redis connection error:', err);
     });
     ```
   - The Redis **URL** and **Password** are stored in environment variables (`REDIS_URL`, `REDIS_PASSWORD`) for security reasons.

3. **Caching Logic**:
   - In the `GET /tasks` route, I added the logic to check if the task data is already cached in Redis:
     ```typescript
     import { redisClient } from './redis';

     app.get('/tasks', async (req, res) => {
       const cacheKey = 'tasks';
       const cachedData = await redisClient.get(cacheKey);
       
       if (cachedData) {
         // Return cached data if available
         return res.json(JSON.parse(cachedData));
       }

       // Fetch tasks from MongoDB if not cached
       const tasks = await Task.find();
       // Cache the result for 1 minute
       await redisClient.setEx(cacheKey, 60, JSON.stringify(tasks));
       return res.json(tasks);
     });
     ```

4. **Cache Invalidation**:
   - After any modification (create, update, delete), I invalidate the cache by using the `DEL` command to remove the cached data:
     ```typescript
     app.post('/tasks', async (req, res) => {
       const task = new Task(req.body);
       await task.save();
       // Invalidate the cache after task creation
       await redisClient.del('tasks');
       return res.status(201).json(task);
     });

     app.put('/tasks/:id', async (req, res) => {
       const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
       // Invalidate the cache after task update
       await redisClient.del('tasks');
       return res.json(task);
     });

     app.delete('/tasks/:id', async (req, res) => {
       await Task.findByIdAndDelete(req.params.id);
       // Invalidate the cache after task deletion
       await redisClient.del('tasks');
       return res.status(204).send();
     });
     ```

### Cache Flow:
1. A user requests the `GET /tasks` endpoint.
2. The application checks if the result is present in Redis:
   - **If cached**, the result is returned from Redis.
   - **If not cached**, the result is fetched from MongoDB and stored in Redis for subsequent requests.
3. After creating, updating, or deleting a task, the cache is cleared using `redisClient.del('tasks')`, ensuring that the next request fetches the most up-to-date task list.

By using **Upstash Redis**, I achieved a lightweight, serverless Redis setup that efficiently handles caching and improves API performance without needing to manage Redis infrastructure manually.


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
