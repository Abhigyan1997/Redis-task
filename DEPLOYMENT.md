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

https://redis-task.onrender.com/
