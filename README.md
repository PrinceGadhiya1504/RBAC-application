# RBAC Application

A full-stack Role-Based Access Control (RBAC) application for managing users, roles, permissions, and job positions.

---

## Technologies & Languages

- **Backend**: Python (Flask, Flask-SQLAlchemy, Flask-JWT-Extended, Flask-Bcrypt)
- **Frontend**: TypeScript, React, Vite, Tailwind CSS, Shadcn UI, TanStack Query, Axios
- **Database**: PostgreSQL

---

## Database Creation

Ensure PostgreSQL is running, then create the database:

```bash
# Using CLI
psql -U postgres -c "CREATE DATABASE rbac_db;"
```

Or inside the `psql` shell:

```sql
CREATE DATABASE rbac_db;
```

> **Note:** Tables and initial seed data (default admin: `admin@gmail.com` / `Admin@123`) are automatically created when the backend starts. You can also manually seed via `python seed.py`.

---

## Environment Variables

### Backend (`backend/.env`)

Create a `.env` file in the `backend/` directory:

```ini
SECRET_KEY=your_secret_key
FLASK_DEBUG=True

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=rbac_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# JWT Authentication
JWT_SECRET_KEY=your_jwt_secret_key
```

### Frontend (`frontend/.env`)

Create a `.env` file in the `frontend/` directory:

```ini
VITE_API_URL=http://127.0.0.1:5000/api
```

---

## Commands to Run

### Backend

```bash
cd backend

# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate      # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the backend server (starts on http://127.0.0.1:5000)
python app.py
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server (starts on http://localhost:5173)
npm run dev
```