# Deployment Guide for YepAI Climbs

This guide explains how to deploy the YepAI Climbs application using Vercel for the frontend and Heroku for the backend API.

## Frontend Deployment (Vercel)

### Prerequisites
- A GitHub account with your project repository
- A Vercel account (sign up at [vercel.com](https://vercel.com))

### Deployment Steps

1. **Push your code to GitHub**
   Make sure your latest code is committed and pushed to your GitHub repository.

2. **Sign up/Log in to Vercel**
   Go to [vercel.com](https://vercel.com) and sign up or log in with your GitHub account.

3. **Import your project**
   - Click on "Add New" > "Project"
   - Select your GitHub repository
   - Configure project:
     - Framework Preset: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm install`

4. **Set environment variables**
   Go to Settings > Environment Variables and add the following:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_API_URL=https://your-api-name.herokuapp.com
   ```

5. **Deploy**
   Click "Deploy" and wait for the build to complete.

6. **Custom Domain (Optional)**
   - Go to Settings > Domains
   - Add your custom domain and follow the instructions to set up DNS

## Backend Deployment (Heroku)

### Prerequisites
- A Heroku account (sign up at [heroku.com](https://heroku.com))
- Heroku CLI installed on your computer

### Deployment Steps

1. **Login to Heroku CLI**
   ```
   heroku login
   ```

2. **Create a new Heroku app**
   ```
   cd /path/to/your/project
   heroku create your-api-name
   ```

3. **Navigate to the API directory**
   ```
   cd api
   ```

4. **Deploy to Heroku**
   ```
   git init
   git add .
   git commit -m "Initial API deployment"
   heroku git:remote -a your-api-name
   git push heroku master
   ```
   
   If you're deploying from a subdirectory, you can use:
   ```
   git subtree push --prefix api heroku master
   ```

5. **Check if the deployment was successful**
   ```
   heroku open
   ```
   You should see a message indicating that the API is running.

## Connecting Frontend and Backend

1. **Update the frontend environment variable**
   Make sure `VITE_API_URL` on Vercel points to your Heroku app URL.

2. **Update CORS settings**
   In `api/main.py`, update the CORS origins to include your Vercel app domain:
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["https://your-app.vercel.app"],  # Your Vercel app URL
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

3. **Redeploy the API if necessary**

## Troubleshooting

### Common Issues:

1. **API calls failing**
   - Check the browser console for CORS errors
   - Verify that the `VITE_API_URL` environment variable is correct
   - Ensure the Heroku app is running with `heroku ps:scale web=1`

2. **Heroku deployment failing**
   - Check the logs with `heroku logs --tail`
   - Verify that all dependencies are in requirements.txt
   - Ensure the Procfile is correctly formatted

3. **Vercel deployment failing**
   - Check the deployment logs in the Vercel dashboard
   - Verify that all environment variables are correctly set

## Maintenance

- **Monitoring Heroku app**
  ```
  heroku logs --tail
  ```

- **Restarting the Heroku app**
  ```
  heroku restart
  ```

- **Updating the deployment**
  Simply push changes to your GitHub repository and Vercel will automatically redeploy.
  For Heroku, you'll need to push changes to the Heroku remote again. 