# ⚽ Soccer Puzzle Coach

A web application for creating and solving tactical soccer puzzles. Coaches can design positional challenges for their teams, and players can solve them to improve their tactical understanding.

## Features

- 🎯 **Create Puzzles**: Design tactical scenarios with custom player positions
- 🔍 **Search by Team**: Find puzzles created for your team
- 🧩 **Solve Challenges**: Move players to find the solution
- 💡 **Hints & Solutions**: Get help when stuck
- 📱 **Responsive Design**: Works on desktop and mobile

## Tech Stack

**Frontend:**
- React + TypeScript
- Vite
- Custom SVG pitch rendering

**Backend:**
- FastAPI (Python)
- PostgreSQL
- SQLAlchemy + Alembic
- Pydantic

## Local Development

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL

### Backend Setup

1. Create virtual environment:
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create `.env` file:
```bash
cp .env.example .env
# Edit .env with your database URL
```

4. Run migrations:
```bash
alembic upgrade head
```

5. Start server:
```bash
uvicorn app.main:app --reload
```

Backend runs at `http://127.0.0.1:8000`

### Frontend Setup

1. Navigate to frontend:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Start dev server:
```bash
npm run dev
```

Frontend runs at `http://localhost:5173`

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

**Quick Deploy:**
- Backend: Railway or Render
- Frontend: Vercel or Netlify
- Database: Railway PostgreSQL or Neon

## API Endpoints

- `GET /health` - Health check
- `POST /puzzles` - Create puzzle
- `GET /puzzles?team_name={name}` - Search puzzles
- `GET /puzzles/{id}` - Get puzzle details
- `POST /puzzles/{id}/validate` - Submit solution
- `GET /puzzles/{id}/solution` - Get solution positions

## License

MIT

## Contributing

Pull requests welcome! Please open an issue first to discuss changes.
