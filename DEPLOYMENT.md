# Soccer Puzzle Coach - Deployment Guide

## Quick Start MVP Deployment

### Option 1: Railway (Recommended - Easiest)

**Backend + Database:**
1. Sign up at [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Connect your GitHub account and select this repository
4. Railway will auto-detect the Python app
5. Add PostgreSQL database:
   - Click "New" → "Database" → "Add PostgreSQL"
   - Railway will automatically set `DATABASE_URL`
6. Set environment variables in Railway dashboard:
   ```
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```
7. Deploy! Railway will run migrations automatically

**Frontend:**
1. Sign up at [vercel.com](https://vercel.com)
2. Click "New Project" → Import from GitHub
3. Select your repository → Select `frontend` folder as root directory
4. Set environment variable:
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   ```
5. Deploy!

---

### Option 2: Render

**Backend:**
1. Sign up at [render.com](https://render.com)
2. Click "New" → "Web Service"
3. Connect GitHub repository
4. Configure:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add PostgreSQL database:
   - Click "New" → "PostgreSQL"
   - Copy the Internal Database URL
6. Set environment variables:
   ```
   DATABASE_URL=<your-postgres-url>
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```
7. After first deploy, run migrations:
   - Go to Shell tab
   - Run: `alembic upgrade head`

**Frontend:**
Same as Option 1 (Vercel)

---

### Option 3: Fly.io

**Backend:**
1. Install flyctl: `brew install flyctl` (Mac) or visit [fly.io/docs/hands-on/install-flyctl/](https://fly.io/docs/hands-on/install-flyctl/)
2. Sign up: `flyctl auth signup`
3. Launch app: `flyctl launch`
4. Create Postgres: `flyctl postgres create`
5. Attach database: `flyctl postgres attach <postgres-app-name>`
6. Set environment variable:
   ```bash
   flyctl secrets set FRONTEND_URL=https://your-frontend-url.vercel.app
   ```
7. Deploy: `flyctl deploy`
8. Run migrations: `flyctl ssh console` then `alembic upgrade head`

**Frontend:**
Same as Option 1 (Vercel)

---

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@host:5432/dbname
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend (.env)
```
VITE_API_URL=https://your-backend-domain.com
```

---

## Database Migration

After deploying backend, run migrations:
```bash
alembic upgrade head
```

---

## Post-Deployment Checklist

- [ ] Backend health check works: `https://your-backend-url/health`
- [ ] Database migrations completed
- [ ] Frontend can connect to backend API
- [ ] CORS is configured correctly
- [ ] Create a test puzzle
- [ ] Search for and solve a test puzzle

---

## Troubleshooting

**CORS errors:**
- Ensure `FRONTEND_URL` is set correctly in backend
- Check that frontend URL matches exactly (no trailing slash)

**Database connection errors:**
- Verify `DATABASE_URL` format: `postgresql+psycopg://...`
- Check database is running and accessible

**Frontend can't reach backend:**
- Verify `VITE_API_URL` is set correctly
- Check backend is deployed and health endpoint responds

---

## Cost Estimate (Free Tier)

- **Railway:** Free tier includes $5 credit/month (enough for MVP)
- **Render:** Free tier available (sleeps after inactivity)
- **Vercel:** Free tier for frontend (unlimited)
- **Neon/Supabase:** Free PostgreSQL tier available

**Total: $0-5/month for MVP**
