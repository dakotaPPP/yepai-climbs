# YePAI Climbing Grade Predictor API

This API uses computer vision and a graph neural network to predict the difficulty of climbing routes based on hold positions, types, and colors.

## Deployment to Railway

Railway is a platform that makes it easy to deploy, manage, and scale applications. It's perfect for deploying machine learning applications like this one that require GPU resources.

### Prerequisites

1. [Railway Account](https://railway.app/) - Sign up for a Railway account
2. [Railway CLI](https://docs.railway.app/develop/cli) (optional but recommended)

### Deployment Steps

#### Option 1: Deploy using Railway CLI

1. Install the Railway CLI:
   ```bash
   npm i -g @railway/cli
   ```

2. Login to your Railway account:
   ```bash
   railway login
   ```

3. Navigate to the API directory:
   ```bash
   cd yepai-climbs/api
   ```

4. Initialize a new Railway project:
   ```bash
   railway init
   ```

5. Deploy the application:
   ```bash
   railway up
   ```

6. Link to your Railway project (if needed):
   ```bash
   railway link
   ```

7. Open the dashboard to view your deployment:
   ```bash
   railway open
   ```

#### Option 2: Deploy using Railway Dashboard

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project" > "Deploy from GitHub repo"
3. Connect your GitHub account and select your repository
4. Select the repository and branch you want to deploy
5. Railway will automatically detect the Dockerfile and build your application
6. Wait for the deployment to complete

### Environment Variables

Set the following environment variables in your Railway project:

- `PORT`: 8080 (default)
- `CORS_ORIGINS`: Your frontend domain (e.g. `https://your-app.vercel.app`)

You can set these in the Railway dashboard under your project's "Variables" tab.

## Connecting to the Frontend

After deploying your API to Railway, you'll need to update your frontend to connect to the new API endpoint.

### Update Frontend Configuration

1. Find your API URL from the Railway dashboard (e.g. `https://yepai-climbs-production.up.railway.app`)
2. Update your frontend configuration:

```typescript
// src/config.ts
export const config = {
  apiUrl: "https://yepai-climbs-production.up.railway.app", // Replace with your Railway URL
  // other config options...
};
```

### CORS Configuration

The API is configured to allow requests from any origin (`*`), but you should update this to your specific frontend domain in production. Modify the CORS settings in `main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.environ.get("CORS_ORIGINS", "*")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Local Development

To run the API locally for development:

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Run the application:
   ```bash
   python main.py
   ```

3. The API will be available at `http://localhost:8000`

## Docker

To build and run the Docker container locally:

1. Build the Docker image:
   ```bash
   docker build -t yepai-api .
   ```

2. Run the container:
   ```bash
   docker run -p 8080:8080 yepai-api
   ```

3. The API will be available at `http://localhost:8080`

## API Endpoints

- `GET /`: Health check endpoint
- `POST /api/upload`: Predict the grade of a climbing route
  - Request body:
    ```json
    {
      "image_url": "https://example.com/image.jpg",
      "hold_color": "red"
    }
    ```
  - Response:
    ```json
    {
      "grade": "V5",
      "confidence": 0.85
    }
    ```

## Troubleshooting

### Common Issues

1. **Memory Errors**: If you encounter memory errors, Railway's standard tier should provide enough resources. Consider optimizing your model for production.

2. **Model Loading Issues**: Make sure all model files are properly included in the deployment. Check Railway logs for specific errors.

3. **Slow Inference**: The first prediction might be slow due to model loading. This is normal behavior for PyTorch models.

### Railway Logs

To view logs for your Railway deployment:

```bash
railway logs
```

Or check the logs in the Railway dashboard under your service's "Logs" tab.

## Technical Details

- Framework: FastAPI
- Machine Learning: PyTorch, Ultralytics YOLO
- Graph Neural Network: PyTorch Geometric
- Container: Docker

This API uses computer vision to detect climbing holds in images, then processes their spatial relationships using a graph neural network to predict the climbing grade. 