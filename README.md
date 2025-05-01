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
